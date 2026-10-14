"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useSite } from "@/lib/store";
import { startNavigation } from "./transition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Lien interne qui joue la transition de page (rideau). */
export default function TransitionLink({ href, onClick, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== "_self") return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    e.preventDefault();

    if (url.pathname === window.location.pathname) {
      useSite.getState().setMenuOpen(false);
      if (url.hash) {
        document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      const lenis = useSite.getState().lenis;
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    startNavigation(url.pathname + url.search + url.hash);
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
