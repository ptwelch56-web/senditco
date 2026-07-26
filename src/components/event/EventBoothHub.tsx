"use client";

import Link from "next/link";
import { spotCheckInUrl } from "@/lib/event";
import { spotSession } from "@/lib/site";
import { paymentDisplay } from "@/lib/payments";
import { SpotCheckInQr } from "@/components/onsite/SpotCheckInQr";

export function EventBoothHub() {
  const checkInPath = "/sign-pay";

  return (
    <div className="event-booth mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="no-print mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
          For instructors
        </p>
        <h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">Event QR</h1>
        <p className="mt-3 text-zinc-400">
          Same QR as on the homepage: {spotSession.price} on-spot ride, waiver, then Venmo or Cash
          App ({paymentDisplay.venmo} · {paymentDisplay.cashApp}).
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <SpotCheckInQr size="lg" />

        <div className="no-print mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
          >
            Print QR poster
          </button>
          <Link
            href={checkInPath}
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Open check-in on this device
          </Link>
        </div>
      </div>

      <p className="no-print mt-6 break-all text-center text-xs text-zinc-500">{spotCheckInUrl()}</p>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header,
          footer,
          nav,
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
