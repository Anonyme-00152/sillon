"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useSite } from "@/lib/store";

// Scroll fluide, désactivé quand les animations sont réduites.
export default function SmoothScroll() {
  const reduced = useSite((s) => s.reducedMotion);
  const menuOpen = useSite((s) => s.menuOpen);
  const setLenis = useSite((s) => s.setLenis);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -72 } });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced, setLenis]);

  useEffect(() => {
    const lenis = useSite.getState().lenis;
    if (menuOpen) lenis?.stop();
    else lenis?.start();
  }, [menuOpen]);

  return null;
}
