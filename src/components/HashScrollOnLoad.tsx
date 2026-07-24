"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HashScrollOnLoad() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const scroll = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id) scrollToId(id);
    };

    scroll();
    const afterPaint = window.setTimeout(scroll, 50);
    window.addEventListener("hashchange", scroll);
    return () => {
      window.clearTimeout(afterPaint);
      window.removeEventListener("hashchange", scroll);
    };
  }, [pathname]);

  return null;
}
