"use client";

import { BusinessCardArt } from "@/components/print/BusinessCardArt";
import { siteHomeUrl } from "@/lib/event";
import { site } from "@/lib/site";

/** Force file download (works better than relying on the download attribute alone). */
function forceDownload(url: string) {
  window.location.assign(url);
}

export function BusinessCardPrintPage() {
  return (
    <>
      <div className="no-print mx-auto max-w-lg px-4 py-8 text-zinc-300">
        <h1 className="font-display text-3xl text-white">Download your business card</h1>
        <p className="mt-3 text-sm leading-relaxed">
          One file, ready for the print shop — <strong className="text-white">3.5″ × 2″</strong>,
          300 DPI. QR goes to <strong className="text-white">{siteHomeUrl()}</strong>.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => forceDownload("/api/business-card/png")}
            className="w-full rounded-2xl bg-red-600 px-6 py-4 text-base font-bold text-white hover:bg-red-500"
          >
            Download PNG (recommended for print shop)
          </button>
          <button
            type="button"
            onClick={() => forceDownload("/api/business-card/pdf")}
            className="w-full rounded-2xl border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Download PDF instead
          </button>
        </div>

        <p className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
          <strong className="text-zinc-200">On this Mac right now:</strong> open Finder →{" "}
          <strong className="text-white">sendit-co → public → print</strong> → attach{" "}
          <strong className="text-white">sendit-business-card.png</strong> to email or AirDrop. No
          website needed.
        </p>
        <p className="mt-3 text-xs text-zinc-500">
          {site.phone} · {site.email}
        </p>
      </div>

      <div className="print-sheet flex min-h-[50vh] items-center justify-center bg-zinc-900 py-12 print:min-h-0 print:bg-white print:py-0">
        <BusinessCardArt />
      </div>

      <style jsx global>{`
        .business-card {
          width: 3.5in;
          height: 2in;
        }

        @media screen {
          .business-card {
            box-shadow:
              0 25px 50px -12px rgba(0, 0, 0, 0.8),
              0 0 0 1px rgba(255, 255, 255, 0.08);
          }
        }

        @media print {
          @page {
            size: 3.5in 2in;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #070708 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          .print-sheet {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3.5in;
            height: 2in;
            margin: 0;
            padding: 0;
          }

          .business-card {
            width: 3.5in !important;
            height: 2in !important;
            page-break-after: avoid;
          }
        }
      `}</style>
    </>
  );
}
