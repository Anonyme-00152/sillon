"use client";

import { useEffect } from "react";
import { useSite } from "@/lib/store";
import { playClick, playHover } from "@/lib/sound";

const INTERACTIVE = "a, button, [role='radio'], [role='switch'], summary";

export function applyMotion(reduce: boolean, persist: boolean) {
  const html = document.documentElement;
  if (reduce) html.dataset.motion = "reduce";
  else delete html.dataset.motion;
  useSite.getState().setReducedMotion(reduce);
  if (persist) {
    try {
      localStorage.setItem("sillon:motion", reduce ? "reduce" : "full");
    } catch {}
  }
}

export function applySound(on: boolean) {
  useSite.getState().setSound(on);
  try {
    localStorage.setItem("sillon:sound", on ? "on" : "off");
  } catch {}
}

// Restaure les préférences (animations, son) et branche les sons d'interface.
export default function Preferences() {
  useEffect(() => {
    const html = document.documentElement;
    useSite.getState().setReducedMotion(html.dataset.motion === "reduce");
    try {
      if (localStorage.getItem("sillon:sound") === "on") useSite.getState().setSound(true);
    } catch {}

    // Suit la préférence système tant que l'utilisateur n'a rien choisi sur le site
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("sillon:motion");
      } catch {}
      if (!stored) applyMotion(mq.matches, false);
    };
    mq.addEventListener("change", onChange);

    let hovered: Element | null = null;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest(INTERACTIVE) ?? null;
      if (el && el !== hovered) playHover();
      hovered = el;
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest(INTERACTIVE);
      if (el && !el.closest("[data-sound='off']")) playClick();
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      mq.removeEventListener("change", onChange);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
