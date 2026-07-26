"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { site, spotSession } from "@/lib/site";
import {
  cashAppPayUrl,
  paymentDisplay,
  venmoPayUrl,
} from "@/lib/payments";
import { onsiteInfoStepSchema, onsiteWaiverSchema } from "@/lib/onsite-schema";
import { formatSpotPaymentNote } from "@/lib/event";
import { waiverAcknowledgments, waiverEffectiveDate, waiverSections } from "@/lib/waiver-text";
import { SignatureField } from "@/components/book/SignatureField";

type Step = "info" | "waiver" | "pay";

const steps: { id: Step; label: string }[] = [
  { id: "info", label: "Rider info" },
  { id: "waiver", label: "Waiver" },
  { id: "pay", label: "Pay" },
];

type PayResult = {
  id: string;
  packageTitle: string;
  priceLabel: string;
  baseAmount: number;
};

type OnsiteWizardProps = {
  defaultEventName?: string;
};

export function OnsiteWizard({ defaultEventName = "" }: OnsiteWizardProps) {
  const [step, setStep] = useState<Step>("info");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [payResult, setPayResult] = useState<PayResult | null>(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState("");

  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [participantAge, setParticipantAge] = useState(10);
  const [riderNotes, setRiderNotes] = useState("");
  const [eventName, setEventName] = useState(defaultEventName);
  const [acknowledgments, setAcknowledgments] = useState([false, false, false]);
  const [signatureDataUrl, setSignatureDataUrl] = useState("");

  const stepIndex = steps.findIndex((s) => s.id === step);
  const baseAmount = spotSession.priceAmount;

  const totalAmount = useMemo(() => {
    const tip = Number.isFinite(tipAmount) && tipAmount > 0 ? tipAmount : 0;
    return Math.round((baseAmount + tip) * 100) / 100;
  }, [baseAmount, tipAmount]);

  const scrollToErrors = (map: Record<string, string>) => {
    const firstKey = Object.keys(map)[0];
    if (!firstKey) return;
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-field="${firstKey}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const goBack = () => {
    const order: Step[] = ["info", "waiver", "pay"];
    const i = order.indexOf(step);
    if (i > 0 && step !== "pay") setStep(order[i - 1]);
  };

  const goNext = () => {
    setSubmitError(null);

    if (step === "info") {
      const result = onsiteInfoStepSchema.safeParse({
        packageId: spotSession.id,
        guardianName,
        guardianPhone,
        guardianEmail: guardianEmail.trim() || undefined,
        participantName,
        participantAge,
        riderNotes: riderNotes || undefined,
      });
      if (!result.success) {
        const map: Record<string, string> = {};
        for (const issue of result.error.issues) {
          map[issue.path.join(".")] = issue.message;
        }
        setErrors(map);
        scrollToErrors(map);
        return;
      }
      setErrors({});
      setStep("waiver");
      return;
    }

    if (step === "waiver") {
      void submitWaiver();
    }
  };

  const submitWaiver = async () => {
    const payload = {
      packageId: spotSession.id,
      guardianName,
      guardianPhone,
      guardianEmail: guardianEmail.trim() || undefined,
      participantName,
      participantAge,
      riderNotes: riderNotes || undefined,
      eventName: eventName.trim() || undefined,
      checkInContext: "event" as const,
      acknowledgments,
      signatureDataUrl,
      signedAt: new Date().toISOString(),
    };

    const parsed = onsiteWaiverSchema.safeParse(payload);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[issue.path.join(".")] = issue.message;
      }
      if (!acknowledgments.every(Boolean)) {
        map.acknowledgments = "Check all three boxes";
      }
      if (!signatureDataUrl) {
        map.signatureDataUrl = "Sign and tap Save signature";
      }
      setErrors(map);
      scrollToErrors(map);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/onsite-waiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as PayResult & { ok?: boolean; error?: string };
      if (!res.ok || !data.ok || !data.id) {
        throw new Error(data.error || "Could not save waiver");
      }
      setPayResult({
        id: data.id,
        packageTitle: data.packageTitle,
        priceLabel: data.priceLabel,
        baseAmount,
      });
      setStep("pay");
      setErrors({});
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const paymentNote = payResult
    ? formatSpotPaymentNote(payResult.id, {
        tipAmount,
        eventName: eventName.trim() || undefined,
      })
    : "";

  const venmoUrl = payResult
    ? venmoPayUrl({ amount: totalAmount, note: paymentNote })
    : null;
  const cashAppUrl = payResult
    ? cashAppPayUrl({ amount: totalAmount, note: paymentNote })
    : null;

  const resetForNextRider = () => {
    setStep("info");
    setPayResult(null);
    setTipAmount(0);
    setCustomTip("");
    setErrors({});
    setSubmitError(null);
    setGuardianName("");
    setGuardianPhone("");
    setGuardianEmail("");
    setParticipantName("");
    setParticipantAge(10);
    setRiderNotes("");
    setAcknowledgments([false, false, false]);
    setSignatureDataUrl("");
  };

  const copyReference = async () => {
    if (!payResult?.id) return;
    try {
      await navigator.clipboard.writeText(payResult.id);
    } catch {
      /* ignore */
    }
  };

  const applyCustomTip = () => {
    const n = parseFloat(customTip.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(n) && n >= 0 && n <= 500) {
      setTipAmount(Math.round(n * 100) / 100);
    }
  };

  const tipPresets = [0, 5, 10, 20];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
          On the spot
        </p>
        <h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">Sign waiver & pay</h1>
        <p className="mt-3 text-lg text-amber-200/90">
          {spotSession.price}{" "}
          <span className="text-base font-normal text-zinc-400">· {spotSession.riders}</span>
        </p>
        <p className="mt-3 text-zinc-400">
          Fill in rider info, sign the waiver, then pay with{" "}
          <strong className="text-white">Venmo</strong> ({paymentDisplay.venmo}) or{" "}
          <strong className="text-white">Cash App</strong> ({paymentDisplay.cashApp}). Optional tip
          at checkout. Booking a private session later?{" "}
          <Link href="/book" className="text-red-400 hover:text-red-300">
            Book online
          </Link>
          .
        </p>
      </div>

      {step !== "pay" ? (
        <ol className="mb-10 flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <li
              key={s.id}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                i <= stepIndex
                  ? "bg-amber-600/20 text-amber-300 ring-1 ring-amber-500/40"
                  : "bg-white/5 text-zinc-500"
              }`}
            >
              {i + 1}. {s.label}
            </li>
          ))}
        </ol>
      ) : null}

      {Object.keys(errors).length > 0 && step !== "pay" ? (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-2 list-inside list-disc">
            {Object.values(errors).map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {step === "info" && (
        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-white">Parent / guardian & rider</h2>
          <Field label="Event or location (optional)" fieldKey="eventName">
            <input
              className={inputClass}
              placeholder="Festival, fair, park name…"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </Field>
          <Field label="Parent or guardian full name" error={errors.guardianName} fieldKey="guardianName">
            <input className={inputClass} value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mobile phone" error={errors.guardianPhone} fieldKey="guardianPhone">
              <input
                type="tel"
                className={inputClass}
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
              />
            </Field>
            <Field label="Email (optional)" error={errors.guardianEmail} fieldKey="guardianEmail">
              <input
                type="email"
                className={inputClass}
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rider legal name" error={errors.participantName} fieldKey="participantName">
              <input
                className={inputClass}
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
              />
            </Field>
            <Field label="Rider age" error={errors.participantAge} fieldKey="participantAge">
              <input
                type="number"
                min={8}
                className={inputClass}
                value={participantAge}
                onChange={(e) => setParticipantAge(Number(e.target.value))}
              />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <textarea
              className={inputClass}
              rows={2}
              placeholder="Allergies, experience level, etc."
              value={riderNotes}
              onChange={(e) => setRiderNotes(e.target.value)}
            />
          </Field>
        </section>
      )}

      {step === "waiver" && (
        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-white">Sign waiver</h2>
          <p className="text-sm text-zinc-400">
            Effective {waiverEffectiveDate}. Parent/guardian must sign for riders under 18.
          </p>
          <div className="max-h-72 space-y-4 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300 sm:max-h-80">
            {waiverSections.map((section) => (
              <div key={section.title}>
                <p className="font-semibold text-white">{section.title}</p>
                <p className="mt-1 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2" data-field="acknowledgments">
            {waiverAcknowledgments.map((text, i) => (
              <label
                key={text}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-zinc-300"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={acknowledgments[i]}
                  onChange={(e) => {
                    const next = [...acknowledgments];
                    next[i] = e.target.checked;
                    setAcknowledgments(next);
                  }}
                />
                {text}
              </label>
            ))}
          </div>
          <Field label="Signature" fieldKey="signatureDataUrl">
            <SignatureField onChange={setSignatureDataUrl} error={errors.signatureDataUrl} />
          </Field>
          {submitError ? (
            <p className="rounded-lg bg-red-950/50 p-3 text-sm text-red-300">{submitError}</p>
          ) : null}
        </section>
      )}

      {step === "pay" && payResult ? (
        <section className="space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              Waiver saved — choose payment
            </p>
            <p className="mt-2 font-mono text-lg text-white">{payResult.id}</p>
            <button
              type="button"
              onClick={() => void copyReference()}
              className="mt-2 text-sm font-medium text-zinc-400 underline hover:text-white"
            >
              Copy reference code
            </button>
            <p className="mt-2 text-zinc-300">{payResult.packageTitle}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="font-semibold text-white">Add a tip (optional)</p>
            <p className="mt-1 text-sm text-zinc-400">Tips go directly to your instructor — thank you!</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tipPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setTipAmount(preset);
                    setCustomTip(preset === 0 ? "" : String(preset));
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    tipAmount === preset
                      ? "bg-amber-500 text-black"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {preset === 0 ? "No tip" : `$${preset}`}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                inputMode="decimal"
                placeholder="Custom amount"
                className={inputClass}
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                onBlur={applyCustomTip}
              />
              <button
                type="button"
                onClick={applyCustomTip}
                className="shrink-0 rounded-xl border border-white/20 px-4 text-sm font-semibold text-white hover:bg-white/10"
              >
                Apply
              </button>
            </div>
            <dl className="mt-5 space-y-1 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-zinc-400">
                <dt>Session</dt>
                <dd>${baseAmount.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-zinc-400">
                <dt>Tip</dt>
                <dd>${tipAmount.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-lg font-bold text-white">
                <dt>Total</dt>
                <dd>${totalAmount.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Put reference <strong className="text-zinc-200">{payResult.id}</strong> in your Venmo
            note if the app allows it.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {venmoUrl ? (
              <a
                href={venmoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#3D95CE]/40 bg-[#3D95CE]/10 px-6 py-10 text-center transition hover:bg-[#3D95CE]/20"
              >
                <span className="text-lg font-bold text-white">Pay with Venmo</span>
                <span className="mt-1 text-sm text-[#3D95CE]">{paymentDisplay.venmo}</span>
                <span className="mt-2 text-2xl font-bold text-[#3D95CE]">${totalAmount.toFixed(2)}</span>
              </a>
            ) : null}

            {cashAppUrl ? (
              <a
                href={cashAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#00D632]/40 bg-[#00D632]/10 px-6 py-10 text-center transition hover:bg-[#00D632]/20"
              >
                <span className="text-lg font-bold text-white">Pay with Cash App</span>
                <span className="mt-1 text-sm text-[#00D632]">{paymentDisplay.cashApp}</span>
                <span className="mt-2 text-2xl font-bold text-[#00D632]">${totalAmount.toFixed(2)}</span>
              </a>
            ) : null}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
            <p className="font-semibold text-white">Paying cash?</p>
            <p className="mt-1">
              Give ${totalAmount.toFixed(2)} to the instructor and mention{" "}
              <span className="font-mono text-amber-300">{payResult.id}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForNextRider}
            className="w-full rounded-2xl bg-amber-500 py-4 text-center text-base font-bold text-black hover:bg-amber-400"
          >
            Next rider — start over
          </button>

          <p className="text-center text-sm text-zinc-500">
            Questions?{" "}
            <a href={site.phoneHref} className="text-white underline">
              Call {site.phone}
            </a>
          </p>
        </section>
      ) : null}

      {step !== "pay" ? (
        <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-40 -mx-4 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#070708]/95 px-4 py-4 backdrop-blur-md md:static md:mx-0 md:bg-transparent md:py-0 md:backdrop-blur-none">
          <button
            type="button"
            onClick={goBack}
            disabled={step === "info" || submitting}
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={submitting}
            className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-60"
          >
            {submitting ? "Saving…" : step === "waiver" ? "Submit waiver & pay" : "Continue"}
          </button>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={resetForNextRider}
            className="inline-block rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-black hover:bg-amber-400"
          >
            Next rider
          </button>
          <Link
            href="/"
            className="inline-block rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white"
          >
            Back to home
          </Link>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function Field({
  label,
  error,
  fieldKey,
  children,
}: {
  label: string;
  error?: string;
  fieldKey?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" data-field={fieldKey}>
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error ? <p className="mt-1 text-sm text-red-400">{error}</p> : null}
    </label>
  );
}
