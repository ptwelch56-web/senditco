"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { packages, site } from "@/lib/site";
import { waiverAcknowledgments, waiverEffectiveDate, waiverSections } from "@/lib/waiver-text";
import { bookingSchema, detailsStepSchema, type BookingPayload } from "@/lib/booking-schema";
import {
  referralSourceLabels,
  referralSourceValues,
  type ReferralSource,
} from "@/lib/referral-sources";
import { SignatureField } from "./SignatureField";

type Step = "package" | "details" | "waiver" | "review";

const steps: { id: Step; label: string }[] = [
  { id: "package", label: "Package" },
  { id: "details", label: "Details" },
  { id: "waiver", label: "Waiver" },
  { id: "review", label: "Review" },
];

const initial: Partial<BookingPayload> & {
  acknowledgments: boolean[];
  referralSource?: ReferralSource;
} = {
  packageId: "private",
  preferredDate: "",
  preferredTime: "",
  locationAddress: "",
  locationCity: "",
  locationNotes: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  riderCount: 1,
  riderDetails: "",
  needsBike: false,
  needsHelmet: false,
  photoOptOut: false,
  notes: "",
  referralSourceDetail: "",
  participantName: "",
  participantAge: 18,
  isMinor: false,
  guardianName: "",
  acknowledgments: [false, false, false],
  signatureDataUrl: "",
  signedAt: "",
};

export function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("package");
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === form.packageId),
    [form.packageId],
  );

  const stepIndex = steps.findIndex((s) => s.id === step);

  const update = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const scrollToErrors = (map: Record<string, string>) => {
    const firstKey = Object.keys(map)[0];
    if (!firstKey) return;
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-field="${firstKey}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const validateStep = (): boolean => {
    const partial: Partial<BookingPayload> = {
      ...form,
      signedAt: form.signedAt || new Date().toISOString(),
    };

    if (step === "package") {
      if (!form.packageId) {
        const map = { packageId: "Choose a package" };
        setErrors(map);
        scrollToErrors(map);
        return false;
      }
      setErrors({});
      return true;
    }

    if (step === "details") {
      const result = detailsStepSchema.safeParse(partial);
      if (!result.success) {
        const map: Record<string, string> = {};
        for (const issue of result.error.issues) {
          map[issue.path.join(".")] = issue.message;
        }
        setErrors(map);
        scrollToErrors(map);
        return false;
      }
      setErrors({});
      return true;
    }

    if (step === "waiver") {
      const map: Record<string, string> = {};
      const age = Number(form.participantAge);

      if (!form.participantName?.trim() || form.participantName.trim().length < 2) {
        map.participantName = "Enter participant legal name";
      }
      if (!Number.isFinite(age) || age < 8 || age > 99) {
        map.participantAge = "Enter participant age (8+)";
      }
      if (age < 18 && !form.guardianName?.trim()) {
        map.guardianName = "Parent/guardian name required for minors";
      }
      if (!form.acknowledgments.every(Boolean)) {
        map.acknowledgments = "Check all three boxes to continue";
      }
      if (!form.signatureDataUrl || form.signatureDataUrl.length < 50) {
        map.signatureDataUrl = "Sign above and tap Save signature";
      }

      if (Object.keys(map).length > 0) {
        setErrors(map);
        scrollToErrors(map);
        return false;
      }

      update("signedAt", new Date().toISOString());
      update("isMinor", age < 18);
      setErrors({});
      return true;
    }

    setErrors({});
    return true;
  };

  const goNext = () => {
    try {
      if (!validateStep()) return;
      const order: Step[] = ["package", "details", "waiver", "review"];
      const i = order.indexOf(step);
      if (i < order.length - 1) setStep(order[i + 1]);
    } catch (error) {
      console.error("[booking] validateStep failed", error);
      setErrors({
        form: "Something went wrong validating this step. Please try again or call us.",
      });
    }
  };

  const goBack = () => {
    const order: Step[] = ["package", "details", "waiver", "review"];
    const i = order.indexOf(step);
    if (i > 0) setStep(order[i - 1]);
  };

  const submit = async () => {
    setSubmitError(null);
    const payload = {
      ...form,
      isMinor: (form.participantAge ?? 18) < 18,
      signedAt: form.signedAt || new Date().toISOString(),
      acknowledgments: form.acknowledgments,
    } as BookingPayload;

    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[issue.path.join(".")] = issue.message;
      }
      setErrors(map);
      setStep("waiver");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Could not submit booking");
      }
      router.push(`/book/success?id=${encodeURIComponent(data.id || "")}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
          Book your session
        </p>
        <h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">
          Request + waiver
        </h1>
        <p className="mt-3 text-zinc-400">
          Choose your package, tell us where to set up, and sign the liability
          waiver. We&apos;ll confirm your date by phone or email—usually within
          24 hours.
        </p>
      </div>

      <ol className="mb-10 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <li
            key={s.id}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              i <= stepIndex
                ? "bg-red-600/20 text-red-300 ring-1 ring-red-500/40"
                : "bg-white/5 text-zinc-500"
            }`}
          >
            {i + 1}. {s.label}
          </li>
        ))}
      </ol>

      {Object.keys(errors).length > 0 ? (
        <div
          className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          <p className="font-semibold">Please fix the following to continue:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-red-300/90">
            {Object.entries(errors).map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {step === "package" && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Select a package</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {packages.filter((pkg) => pkg.id !== "event-spot").map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => update("packageId", pkg.id as BookingPayload["packageId"])}
                className={`rounded-2xl border p-4 text-left transition ${
                  form.packageId === pkg.id
                    ? "border-red-500 bg-red-950/40 ring-2 ring-red-500/50"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <p className="font-semibold text-white">{pkg.title}</p>
                <p className="mt-1 text-2xl font-bold text-red-400">{pkg.price}</p>
                <p className="text-sm text-zinc-400">
                  {pkg.duration} · {pkg.riders}
                </p>
              </button>
            ))}
          </div>
          {errors.packageId ? (
            <p className="text-sm text-red-400">{errors.packageId}</p>
          ) : null}
        </section>
      )}

      {step === "details" && (
        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-white">Session details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Preferred date" error={errors.preferredDate} fieldKey="preferredDate">
              <input
                type="date"
                className={inputClass}
                value={form.preferredDate}
                onChange={(e) => update("preferredDate", e.target.value)}
              />
            </Field>
            <Field label="Preferred time" error={errors.preferredTime} fieldKey="preferredTime">
              <select
                className={inputClass}
                value={form.preferredTime}
                onChange={(e) => update("preferredTime", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="morning">Morning (8am–12pm)</option>
                <option value="afternoon">Afternoon (12pm–4pm)</option>
                <option value="evening">Evening (4pm–7pm)</option>
                <option value="flexible">Flexible</option>
              </select>
            </Field>
          </div>
          <Field label="Street address (where we set up)" error={errors.locationAddress} fieldKey="locationAddress">
            <input
              className={inputClass}
              placeholder="123 Main St"
              value={form.locationAddress}
              onChange={(e) => update("locationAddress", e.target.value)}
            />
          </Field>
          <Field label="City" error={errors.locationCity} fieldKey="locationCity">
            <input
              className={inputClass}
              placeholder="Mebane"
              value={form.locationCity}
              onChange={(e) => update("locationCity", e.target.value)}
            />
          </Field>
          <Field label="Location notes (optional)">
            <textarea
              className={inputClass}
              rows={2}
              placeholder="Driveway width, HOA rules, school field gate code…"
              value={form.locationNotes}
              onChange={(e) => update("locationNotes", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" error={errors.contactName} fieldKey="contactName">
              <input
                className={inputClass}
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
              />
            </Field>
            <Field label="Phone" error={errors.contactPhone} fieldKey="contactPhone">
              <input
                type="tel"
                className={inputClass}
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Email" error={errors.contactEmail} fieldKey="contactEmail">
            <input
              type="email"
              className={inputClass}
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Number of riders" error={errors.riderCount} fieldKey="riderCount">
              <input
                type="number"
                min={1}
                max={20}
                className={inputClass}
                value={form.riderCount}
                onChange={(e) => update("riderCount", Number(e.target.value))}
              />
            </Field>
          </div>
          <Field
            label="Rider names & ages"
            error={errors.riderDetails}
            fieldKey="riderDetails"
            hint="One per line, e.g. Alex, 12"
          >
            <textarea
              className={inputClass}
              rows={4}
              value={form.riderDetails}
              onChange={(e) => update("riderDetails", e.target.value)}
            />
          </Field>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.needsBike}
                onChange={(e) => update("needsBike", e.target.checked)}
              />
              Need bike(s)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.needsHelmet}
                onChange={(e) => update("needsHelmet", e.target.checked)}
              />
              Need helmet(s)
            </label>
          </div>
          <Field
            label="How did you hear about us?"
            error={errors.referralSource || errors.referralSourceDetail}
            fieldKey="referralSource"
          >
            <select
              className={inputClass}
              value={form.referralSource ?? ""}
              onChange={(e) =>
                update("referralSource", e.target.value as ReferralSource)
              }
            >
              <option value="">Select one…</option>
              {referralSourceValues.map((value) => (
                <option key={value} value={value}>
                  {referralSourceLabels[value]}
                </option>
              ))}
            </select>
          </Field>
          {form.referralSource === "other" ? (
            <Field
              label="Please specify"
              error={errors.referralSourceDetail}
              fieldKey="referralSourceDetail"
            >
              <input
                className={inputClass}
                placeholder="e.g. Burlington BMX track"
                value={form.referralSourceDetail ?? ""}
                onChange={(e) => update("referralSourceDetail", e.target.value)}
              />
            </Field>
          ) : null}
          <Field label="Anything else? (optional)">
            <textarea
              className={inputClass}
              rows={2}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </Field>
        </section>
      )}

      {step === "waiver" && (
        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-white">Liability waiver</h2>
          <p className="text-sm text-zinc-400">
            Please read carefully. Effective {waiverEffectiveDate}. Have a parent or
            guardian complete this section for riders under 18. This is not a
            substitute for advice from a licensed attorney.
          </p>
          <div className="max-h-72 space-y-4 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300 sm:max-h-80">
            {waiverSections.map((section) => (
              <div key={section.title}>
                <p className="font-semibold text-white">{section.title}</p>
                <p className="mt-1 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Participant legal name" error={errors.participantName} fieldKey="participantName">
              <input
                className={inputClass}
                value={form.participantName}
                onChange={(e) => update("participantName", e.target.value)}
              />
            </Field>
            <Field label="Participant age" error={errors.participantAge} fieldKey="participantAge">
              <input
                type="number"
                min={8}
                className={inputClass}
                value={form.participantAge}
                onChange={(e) => {
                  const age = Number(e.target.value);
                  update("participantAge", age);
                  update("isMinor", age < 18);
                }}
              />
            </Field>
          </div>
          {(form.participantAge ?? 18) < 18 ? (
            <Field label="Parent / guardian full name" error={errors.guardianName} fieldKey="guardianName">
              <input
                className={inputClass}
                value={form.guardianName}
                onChange={(e) => update("guardianName", e.target.value)}
              />
            </Field>
          ) : null}
          <div className="space-y-2" data-field="acknowledgments">
            {waiverAcknowledgments.map((text, i) => (
              <label
                key={text}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-zinc-300"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.acknowledgments[i]}
                  onChange={(e) => {
                    const next = [...form.acknowledgments];
                    next[i] = e.target.checked;
                    update("acknowledgments", next);
                  }}
                />
                {text}
              </label>
            ))}
            {errors.acknowledgments ? (
              <p className="text-sm text-red-400">{errors.acknowledgments}</p>
            ) : null}
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={form.photoOptOut}
              onChange={(e) => update("photoOptOut", e.target.checked)}
            />
            Opt out of photo/video for marketing
          </label>
          <Field label="Signature" fieldKey="signatureDataUrl">
            <SignatureField
              onChange={(url) => update("signatureDataUrl", url)}
              error={errors.signatureDataUrl}
            />
          </Field>
        </section>
      )}

      {step === "review" && selectedPackage && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Review & submit</h2>
          <dl className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 text-sm">
            <Row label="Package" value={`${selectedPackage.title} — ${selectedPackage.price}`} />
            <Row label="When" value={`${form.preferredDate} · ${form.preferredTime}`} />
            <Row
              label="Where"
              value={`${form.locationAddress}, ${form.locationCity}`}
            />
            <Row label="Contact" value={`${form.contactName} · ${form.contactPhone}`} />
            <Row label="Email" value={form.contactEmail || ""} />
            <Row
              label="Riders"
              value={`${form.riderCount} — ${form.riderDetails}`}
            />
            {form.referralSource ? (
              <Row
                label="Heard about us"
                value={
                  referralSourceLabels[form.referralSource] +
                  (form.referralSource === "other" && form.referralSourceDetail
                    ? ` — ${form.referralSourceDetail}`
                    : "")
                }
              />
            ) : null}
            <Row label="Waiver signed by" value={form.participantName || ""} />
          </dl>
          <p className="text-xs text-zinc-500">
            Submitting sends your request and signed waiver to {site.email}. Payment
            is arranged when your session is confirmed.
          </p>
          {submitError ? (
            <p className="rounded-lg bg-red-950/50 p-3 text-sm text-red-300">
              {submitError}
            </p>
          ) : null}
        </section>
      )}

      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-40 -mx-4 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#070708]/95 px-4 py-4 backdrop-blur-md md:static md:mx-0 md:bg-transparent md:py-0 md:backdrop-blur-none">
        <button
          type="button"
          onClick={goBack}
          disabled={step === "package" || submitting}
          className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white disabled:opacity-40"
        >
          Back
        </button>
        {step !== "review" ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Submit booking & waiver"}
          </button>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

function Field({
  label,
  hint,
  error,
  fieldKey,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  fieldKey?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" data-field={fieldKey}>
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      {hint ? <span className="ml-2 text-xs text-zinc-500">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
      {error ? <p className="mt-1 text-sm text-red-400">{error}</p> : null}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-3">
      <dt className="font-medium text-zinc-500">{label}</dt>
      <dd className="whitespace-pre-wrap text-zinc-200 sm:col-span-2">{value}</dd>
    </div>
  );
}
