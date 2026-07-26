"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { spotCheckInUrl } from "@/lib/event";
import { spotSession } from "@/lib/site";

type SpotCheckInQrProps = {
  /** Larger QR for event booth / homepage section */
  size?: "md" | "lg";
  showUrl?: boolean;
  className?: string;
};

export function SpotCheckInQr({
  size = "md",
  showUrl = true,
  className = "",
}: SpotCheckInQrProps) {
  const url = spotCheckInUrl();
  const px = size === "lg" ? 200 : 160;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="rounded-2xl bg-white p-4 shadow-lg">
        <QRCodeSVG value={url} size={px} level="M" includeMargin />
      </div>
      {showUrl ? (
        <p className="mt-3 max-w-xs break-all text-center text-xs text-zinc-500">{url}</p>
      ) : null}
    </div>
  );
}

export function SpotCheckInQrLink() {
  return (
    <Link
      href="/sign-pay"
      className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
    >
      Open sign & pay page
    </Link>
  );
}

export function spotSessionSummary() {
  return `${spotSession.price} — ${spotSession.riders}`;
}
