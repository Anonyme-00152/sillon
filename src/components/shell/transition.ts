"use client";

import { useSite } from "@/lib/store";
import { playWhoosh } from "@/lib/sound";

let push: ((href: string) => void) | null = null;
let fromPath = "";

export const registerRouter = (fn: (href: string) => void) => {
  push = fn;
};

export const transitionOrigin = () => fromPath;

/** Couvre l'écran avec le rideau, puis change de page. */
export function startNavigation(href: string) {
  const site = useSite.getState();
  if (site.transition !== "idle" || !push) return;
  fromPath = window.location.pathname;
  playWhoosh();
  site.setMenuOpen(false);
  site.setTransition("covering");
  const go = push;
  window.setTimeout(() => go(href), site.reducedMotion ? 200 : 720);
}
