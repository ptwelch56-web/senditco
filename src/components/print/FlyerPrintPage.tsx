"use client";

import Link from "next/link";
import { siteHomeUrl } from "@/lib/event";
import { site } from "@/lib/site";

function forceDownload(url: string) {
  window.location.assign(url);
}

export function FlyerPrintPage() {
  return (
    <>
      <div className="no-print mx-auto max-w-lg px-4 py-8 text-zinc-300">
        <h1 className="font-display text-3xl text-white">B&amp;W track flyer</h1>
        <p className="mt-3 text-sm">
          Letter size (8.5×11″), black &amp; white, QR →{" "}
          <strong className="text-white">{siteHomeUrl()}</strong>
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => forceDownload("/api/flyer/png")}
            className="w-full rounded-2xl bg-white px-6 py-4 text-base font-bold text-black hover:bg-zinc-200"
          >
            Download PNG — print at home / FedEx
          </button>
          <button
            type="button"
            onClick={() => forceDownload("/api/flyer/pdf")}
            className="w-full rounded-2xl border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Download PDF
          </button>
        </div>
        <p className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
          <strong className="text-zinc-200">Fastest tonight:</strong> Finder →{" "}
          <strong className="text-white">sendit-co/public/print/sendit-flyer.pdf</strong> — print
          on any printer (B&amp;W is fine).
        </p>
        <p className="mt-3 text-xs text-zinc-500">
          {site.phone} · {site.email}
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-red-400 hover:text-red-300">
          ← Back to site
        </Link>
      </div>

      <div className="no-print mx-auto max-w-md px-4 pb-12">
        <p className="mb-3 text-center text-xs uppercase tracking-widest text-zinc-500">Preview</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/print/sendit-flyer.png"
          alt="Black and white sendit and sons.co flyer preview"
          className="w-full border border-white/10 shadow-2xl"
        />
      </div>
    </>
  );
}
