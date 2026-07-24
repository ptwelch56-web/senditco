import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { bookingSchema } from "@/lib/booking-schema";
import { packages, site } from "@/lib/site";
import { waiverAcknowledgments, waiverEffectiveDate, waiverSections } from "@/lib/waiver-text";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const bookingId = `SNT-${randomUUID().slice(0, 8).toUpperCase()}`;
  const pkg = packages.find((p) => p.id === data.packageId);

  const html = buildEmailHtml(bookingId, data, pkg?.title ?? data.packageId);

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL ?? site.email;
  const fromEmail =
    process.env.BOOKING_FROM_EMAIL ?? "Sendit Bookings <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("[book] RESEND_API_KEY not set", { bookingId, contact: data.contactEmail });
    return NextResponse.json(
      {
        ok: false,
        error:
          "Email is not configured yet. Add RESEND_API_KEY to enable online submissions.",
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const signatureBase64 = data.signatureDataUrl.replace(/^data:image\/png;base64,/, "");

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [notifyEmail],
    replyTo: data.contactEmail,
    subject: `[${bookingId}] New booking — ${pkg?.title ?? data.packageId}`,
    html,
    attachments: [
      {
        filename: `${bookingId}-signature.png`,
        content: signatureBase64,
      },
    ],
  });

  if (error) {
    console.error("[book] Resend error", error);
    return NextResponse.json(
      { ok: false, error: "Could not send booking email. Try calling or texting us." },
      { status: 502 },
    );
  }

  await resend.emails.send({
    from: fromEmail,
    to: [data.contactEmail],
    subject: `We received your sendit and sons.co request (${bookingId})`,
    html: buildCustomerEmailHtml(bookingId, data, pkg?.title ?? data.packageId),
  }).catch(() => {
    /* customer copy is best-effort */
  });

  return NextResponse.json({ ok: true, id: bookingId });
}

function buildEmailHtml(
  bookingId: string,
  data: ReturnType<typeof bookingSchema.parse>,
  packageTitle: string,
) {
  const waiverHtml = waiverSections
    .map(
      (s) =>
        `<h3 style="margin:16px 0 4px;font-size:14px;">${escapeHtml(s.title)}</h3><p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#333;">${escapeHtml(s.body)}</p>`,
    )
    .join("");

  const acks = waiverAcknowledgments
    .map((a, i) => `<li>${data.acknowledgments[i] ? "✓" : "✗"} ${escapeHtml(a)}</li>`)
    .join("");

  return `
    <div style="font-family:system-ui,sans-serif;max-width:640px;">
      <h1 style="font-size:20px;">New booking ${escapeHtml(bookingId)}</h1>
      <p><strong>Package:</strong> ${escapeHtml(packageTitle)}</p>
      <p><strong>Preferred:</strong> ${escapeHtml(data.preferredDate)} · ${escapeHtml(data.preferredTime)}</p>
      <p><strong>Location:</strong> ${escapeHtml(data.locationAddress)}, ${escapeHtml(data.locationCity)}</p>
      ${data.locationNotes ? `<p><strong>Location notes:</strong> ${escapeHtml(data.locationNotes)}</p>` : ""}
      <p><strong>Contact:</strong> ${escapeHtml(data.contactName)} · ${escapeHtml(data.contactPhone)} · ${escapeHtml(data.contactEmail)}</p>
      <p><strong>Riders (${data.riderCount}):</strong><br/>${escapeHtml(data.riderDetails).replace(/\n/g, "<br/>")}</p>
      <p><strong>Equipment:</strong> Bikes ${data.needsBike ? "yes" : "no"} · Helmets ${data.needsHelmet ? "yes" : "no"}</p>
      ${data.notes ? `<p><strong>Notes:</strong> ${escapeHtml(data.notes)}</p>` : ""}
      <hr/>
      <h2 style="font-size:16px;">Waiver (effective ${escapeHtml(waiverEffectiveDate)})</h2>
      <p><strong>Participant:</strong> ${escapeHtml(data.participantName)} (age ${data.participantAge})</p>
      ${data.guardianName ? `<p><strong>Guardian:</strong> ${escapeHtml(data.guardianName)}</p>` : ""}
      <p><strong>Signed at:</strong> ${escapeHtml(data.signedAt)}</p>
      <p><strong>Photo opt-out:</strong> ${data.photoOptOut ? "Yes" : "No"}</p>
      <ul>${acks}</ul>
      ${waiverHtml}
      <p style="font-size:12px;color:#666;">Signature attached as PNG.</p>
    </div>
  `;
}

function buildCustomerEmailHtml(
  bookingId: string,
  data: ReturnType<typeof bookingSchema.parse>,
  packageTitle: string,
) {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:640px;">
      <h1 style="font-size:20px;">Thanks for sending it!</h1>
      <p>Hi ${escapeHtml(data.contactName)},</p>
      <p>We received your <strong>${escapeHtml(packageTitle)}</strong> request (${escapeHtml(bookingId)}) and your signed waiver.</p>
      <p>We'll confirm your session date soon—usually within 24 hours. Questions? Call or text <a href="${site.phoneHref}">${site.phone}</a>.</p>
      <p>— ${site.name}<br/>${site.location}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
