import { site } from "@/lib/site";

export function ReviewBanner() {
  return (
    <div className="border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-zinc-950 to-amber-950/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-3 text-center sm:justify-between sm:text-left">
        <p className="text-sm text-zinc-300">
          Had a great session with us?{" "}
          <span className="hidden sm:inline">We&apos;d love to hear about it.</span>
        </p>
        <a
          href={site.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-amber-100"
        >
          <span aria-hidden>★</span>
          Leave a Google review
        </a>
      </div>
    </div>
  );
}
