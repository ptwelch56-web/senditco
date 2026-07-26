import Link from "next/link";
import { HashLink } from "@/components/HashLink";
import { MobileMenu } from "@/components/MobileMenu";
import { sectionNavLinks } from "@/lib/nav-links";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0c]/90 backdrop-blur-md">
      <div
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 via-white to-blue-700 text-xs font-black text-black shadow-lg shadow-red-900/30">
            S
          </span>
          <span className="font-display truncate text-sm leading-tight tracking-wide text-white group-hover:text-red-400 sm:max-w-none sm:text-lg">
            {site.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {sectionNavLinks.map((link) => (
            <HashLink
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              {link.label}
            </HashLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/sign-pay"
            className="hidden rounded-full border border-emerald-500/40 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-950/40 lg:inline-flex"
          >
            Sign & pay
          </Link>
          <a
            href={site.phoneHref}
            className="hidden text-sm font-medium text-zinc-300 hover:text-white lg:inline"
          >
            {site.phone}
          </a>
          <Link
            href="/book"
            className="hidden rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:bg-red-500 md:inline-flex"
          >
            Book & sign waiver
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
