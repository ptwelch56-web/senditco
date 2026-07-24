import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-white">{site.name}</p>
          <p className="mt-2 text-sm text-zinc-400">{site.tagline}</p>
          <p className="mt-4 text-sm text-zinc-500">Based in {site.location}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Book
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/book" className="text-zinc-300 hover:text-white">
                Request a session
              </Link>
            </li>
            <li>
              <a href={site.phoneHref} className="text-zinc-300 hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-zinc-300 hover:text-white"
              >
                {site.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Follow
          </p>
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-zinc-300 hover:text-white"
          >
            Facebook — Stars and Stripes Media
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} {site.name}. Ride safe. Send it responsibly.
      </div>
    </footer>
  );
}
