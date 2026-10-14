"use client";

import { useSite } from "@/lib/store";

export default function BackToTop() {
  return (
    <button
      type="button"
      className="link-underline self-start uppercase tracking-[0.12em] text-fg"
      onClick={() => {
        const lenis = useSite.getState().lenis;
        if (lenis) lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0 });
        document.getElementById("contenu")?.focus({ preventScroll: true });
      }}
    >
      Retour en haut ↑
    </button>
  );
}
