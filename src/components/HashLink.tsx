"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", `#${id}`);
}

export function HashLink({ href, onClick, ...rest }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const hashIndex = href.indexOf("#");
  const path = hashIndex >= 0 ? href.slice(0, hashIndex) || "/" : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !hash) return;

    const targetPath = path === "" ? "/" : path;

    if (pathname === targetPath || (pathname === "/" && targetPath === "/")) {
      event.preventDefault();
      scrollToHash(hash);
      return;
    }

    event.preventDefault();
    router.push(`${targetPath}${hash}`);
  };

  return <Link href={href} onClick={handleClick} scroll={false} {...rest} />;
}
