"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const tabs = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  { href: "/#gallery", label: "Gallery", match: (path: string) => path === "/" },
  { href: site.phoneHref, label: "Call", external: true },
  { href: "/book", label: "Book", match: (path: string) => path.startsWith("/book") },
] as const;

function IconHome({ active }: { active?: boolean }) {
  return (
    <svg
      className={active ? "text-red-400" : "text-zinc-400"}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

function IconGallery({ active }: { active?: boolean }) {
  return (
    <svg
      className={active ? "text-red-400" : "text-zinc-400"}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10.5" r="1.5" />
      <path d="m21 16-5-5-4 4-2-2-4 4" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      className="text-zinc-400"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M5 4h4l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function IconBook({ active }: { active?: boolean }) {
  return (
    <svg
      className={active ? "text-white" : "text-white"}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M8 6h8M8 10h8M8 14h5M6 4h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function MobileActionBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0a0c]/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile quick navigation"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map((tab) => {
          const active =
            "match" in tab && tab.match ? tab.match(pathname) : false;
          const isBook = tab.href === "/book";

          if ("external" in tab && tab.external) {
            return (
              <li key={tab.label}>
                <a
                  href={tab.href}
                  className="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-300 active:bg-white/5"
                >
                  <IconPhone />
                  {tab.label}
                </a>
              </li>
            );
          }

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold uppercase tracking-wide active:bg-white/5 ${
                  isBook
                    ? "bg-red-600 text-white"
                    : active
                      ? "text-red-400"
                      : "text-zinc-300"
                }`}
              >
                {tab.href === "/" ? (
                  <IconHome active={active} />
                ) : tab.href === "/#gallery" ? (
                  <IconGallery active={false} />
                ) : (
                  <IconBook active={active} />
                )}
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
