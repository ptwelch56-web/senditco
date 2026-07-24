"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mobileNavLinks } from "@/lib/nav-links";
import { site } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav-panel"
            className="absolute left-0 right-0 top-0 max-h-[100dvh] overflow-y-auto border-b border-white/10 bg-[#0a0a0c] px-4 pb-8 pt-[4.25rem] shadow-2xl"
            style={{ paddingTop: "max(4.25rem, env(safe-area-inset-top))" }}
          >
            <ul className="space-y-1">
              {mobileNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3.5 text-base font-medium text-zinc-100 active:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-white/10 pt-6">
              <a
                href={site.phoneHref}
                className="flex items-center justify-center rounded-xl bg-white/10 px-4 py-3.5 text-base font-semibold text-white"
              >
                Call {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center justify-center rounded-xl border border-white/15 px-4 py-3.5 text-sm font-medium text-zinc-300"
              >
                Email for booking
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-xl px-4 py-3 text-sm text-zinc-500"
              >
                Facebook
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
