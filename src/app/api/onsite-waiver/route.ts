import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { onsiteWaiverSchema } from "@/lib/onsite-schema";
import { packages, site } from "@/lib/site";
import { waiverAcknowledgments, waiverEffectiveDate, waiverSections } from "@/lib/waiver-text";
import { resendErrorMessage } from "@/lib/resend-errors";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = onsiteWaiverSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const waiverId = `ONS-${randomUUID().slice(0, 8).toUpperCase()}`;
  const pkg = packages.find((p) => p.id === data.packageId);

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL ?? site.email;
  const fromEmail =
    process.env.BOOKING_FROM_EMAIL ?? "Sendit Bookings <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Email is not configured yet. Add RESEND_API_KEY to enable waiver submissions.",
      },
      { status: 503 },
    );
  }

  const html = buildOnsiteEmailHtml(waiverId, data, pkg?.title ?? data.packageId, pkg?.price ?? "");
  const signatureBase64 = data.signatureDataUrl.replace(/^data:image\/png;base64,/, "");
  const resend = new Resend(apiKey);

  const subjectPrefix = data.checkInContext === "event" ? "Event waiver" : "On-site waiver";
  const eventPart = data.eventName?.trim() ? ` — ${data.eventName.trim()}` : "";

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [notifyEmail],
    replyTo: data.guardianEmail || undefined,
    subject: `[${waiverId}] ${subjectPrefix}${eventPart} — ${pkg?.title ?? data.packageId}`,
    html,
    attachments: [
      {
        filename: `${waiverId}-signature.png`,
        content: Buffer.from(signatureBase64, "base64"),
      },
    ],
  });

  if (error) {
    console.error("[onsite-waiver] Resend error", error);
    return NextResponse.json(
      { ok: false, error: resendErrorMessage(error, { fromEmail, notifyEmail }) },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: waiverId,
    priceAmount: pkg?.priceAmount ?? null,
    packageTitle: pkg?.title ?? data.packageId,
    priceLabel: pkg?.price ?? "",
  });
}

function buildOnsiteEmailHtml(
  waiverId: string,
  data: ReturnType<typeof onsiteWaiverSchema.parse>,
  packageTitle: string,
  priceLabel: string,
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
      <h1 style="font-size:20px;">${escapeHtml(data.checkInContext === "event" ? "Event" : "On-site")} waiver ${escapeHtml(waiverId)}</h1>
      ${data.eventName?.trim() ? `<p><strong>Event:</strong> ${escapeHtml(data.eventName.trim())}</p>` : ""}
      <p><strong>Package:</strong> ${escapeHtml(packageTitle)} (${escapeHtml(priceLabel)})</p>
      <p><strong>On-spot price:</strong> $30 (+ optional tip when paying)</p>
      <p><strong>Payment:</strong> Venmo / Cash App / cash — ${escapeHtml(data.paymentChoice ?? "pending")}</p>
      <p><strong>Guardian:</strong> ${escapeHtml(data.guardianName)} · ${escapeHtml(data.guardianPhone)}${data.guardianEmail ? ` · ${escapeHtml(data.guardianEmail)}` : ""}</p>
      <p><strong>Rider:</strong> ${escapeHtml(data.participantName)} (age ${data.participantAge})</p>
      ${data.riderNotes ? `<p><strong>Notes:</strong> ${escapeHtml(data.riderNotes)}</p>` : ""}
      <hr/>
      <h2 style="font-size:16px;">Waiver (effective ${escapeHtml(waiverEffectiveDate)})</h2>
      <p><strong>Signed at:</strong> ${escapeHtml(data.signedAt)}</p>
      <ul>${acks}</ul>
      ${waiverHtml}
      <p style="font-size:12px;color:#666;">Signature attached as PNG.</p>
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
