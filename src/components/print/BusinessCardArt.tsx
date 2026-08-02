"use client";

import { QRCodeSVG } from "qrcode.react";
import { siteHomeUrl } from "@/lib/event";
import { site } from "@/lib/site";

const websiteDisplay = siteHomeUrl().replace(/^https?:\/\//, "");

export function BusinessCardArt() {
  return (
    <article
      className="business-card relative box-border overflow-hidden bg-[#070708] text-white"
      aria-label="sendit and sons.co business card"
    >
      <div
        className="absolute inset-x-0 top-0 h-[0.14in] bg-gradient-to-r from-red-600 via-white to-blue-700"
        aria-hidden
      />
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-red-600/20 blur-2xl" aria-hidden />
      <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-blue-700/15 blur-2xl" aria-hidden />

      <div className="relative flex h-full flex-row">
        <div className="flex min-w-0 flex-1 flex-col justify-between py-[0.22in] pl-[0.2in] pr-[0.08in]">
          <div>
            <p className="font-display text-[0.19in] leading-[0.95] text-white">
              Send it
            </p>
            <p className="font-display text-[0.11in] leading-tight tracking-wide text-red-500">
              and sons.co
            </p>
            <p className="mt-[0.06in] text-[0.055in] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              {site.tagline}
            </p>
            <p className="mt-[0.05in] text-[0.052in] leading-snug text-zinc-500">
              Ramp + air bag · Mebane, NC
            </p>
          </div>

          <div className="space-y-[0.03in] text-[0.062in] leading-tight">
            <p className="font-semibold text-white">{site.phone}</p>
            <p className="break-all text-zinc-300">{site.email}</p>
            <p className="font-medium text-amber-400/90">{websiteDisplay}</p>
          </div>
        </div>

        <div className="flex w-[1.12in] shrink-0 flex-col items-center justify-center py-[0.16in] pr-[0.12in]">
          <div className="rounded-md bg-white p-[0.03in] shadow-lg leading-none">
            <QRCodeSVG value={siteHomeUrl()} size={96} level="M" includeMargin={false} />
          </div>
          <p className="mt-[0.05in] text-center text-[0.048in] font-bold uppercase tracking-wider text-zinc-400">
            Scan to
            <br />
            book & pay
          </p>
        </div>
      </div>

      <JumpIcon className="pointer-events-none absolute bottom-[0.12in] left-[1.35in] h-[0.28in] w-[0.5in] text-red-600/25" />
    </article>
  );
}

function JumpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 40" fill="none" aria-hidden>
      <path
        d="M4 32 Q28 8 52 18 T76 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="52" cy="18" r="4" fill="currentColor" />
    </svg>
  );
}
