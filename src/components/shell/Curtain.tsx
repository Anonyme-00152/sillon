"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSite } from "@/lib/store";
import Mark from "@/components/ui/Mark";
import { registerRouter, transitionOrigin } from "./transition";

export default function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const phase = useSite((s) => s.transition);

  useEffect(() => {
    registerRouter((href) => router.push(href, { scroll: false }));
  }, [router]);

  // Nouvelle page affichée sous le rideau : on remonte en haut puis on découvre.
  useEffect(() => {
    const site = useSite.getState();
    if (site.transition !== "covering" || pathname === transitionOrigin()) return;

    if (site.lenis) site.lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    let timer = 0;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        site.setTransition("revealing");
        const main = document.getElementById("contenu");
        main?.focus({ preventScroll: true });
        timer = window.setTimeout(() => useSite.getState().setTransition("idle"), site.reducedMotion ? 300 : 900);
      }),
    );
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <div className="curtain grid place-items-center" data-phase={phase} aria-hidden="true">
      <div className="curtain-word flex items-center gap-4">
        <Mark className="size-10" />
        <span className="display text-6xl">Sillon</span>
      </div>
    </div>
  );
}
