"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/store";

const RING = 2 * Math.PI * 46;

// Court préchargement (≈ 1,2 s), uniquement à la première visite de la session.
// La progression suit le chargement réel des polices et de la scène 3D.
export default function Preloader() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");
  const count = useRef<HTMLSpanElement>(null);
  const arc = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const site = useSite.getState();
    const html = document.documentElement;
    // Déjà vu dans la session (ou animations réduites) : le CSS le masque déjà.
    if (html.dataset.intro === "skip") {
      site.setIntroDone();
      return;
    }

    let fonts = false;
    document.fonts?.ready.then(() => (fonts = true));
    const t0 = performance.now();
    let shown = 0;
    let raf = 0;
    let exitTimer = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      try {
        sessionStorage.setItem("sillon:intro", "1");
      } catch {}
      setPhase("out");
      useSite.getState().setIntroDone();
      exitTimer = window.setTimeout(() => setPhase("done"), 1100);
    };
    // Si requestAnimationFrame est suspendu (onglet en arrière-plan), on termine quand même.
    const safety = window.setTimeout(finish, 5000);

    const tick = () => {
      const st = useSite.getState();
      const elapsed = performance.now() - t0;
      const scene = st.sceneReady || st.webgl === "fail";
      let target = 0.2 + (fonts ? 0.2 : 0) + (scene ? 0.6 : 0);
      target = Math.min(target, elapsed / 1200);
      if (elapsed > 4500) target = 1;
      shown += (target - shown) * 0.14;
      if (target >= 1 && shown > 0.994) shown = 1;

      const pct = Math.round(shown * 100);
      if (count.current) count.current.textContent = String(pct).padStart(3, "0");
      if (arc.current) arc.current.style.strokeDashoffset = String(RING * (1 - shown));

      if (shown >= 1) return finish();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearTimeout(safety);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="preloader" data-state={phase} aria-hidden="true">
      <div className="shell flex h-full flex-col justify-between py-6">
        <div className="eyebrow flex justify-between" style={{ color: "#a49d91" }}>
          <span>Sillon — Modèle 01</span>
          <span>Accordage</span>
        </div>
        <div className="flex flex-col items-center gap-8">
          <svg viewBox="0 0 100 100" className="size-36 -rotate-90 sm:size-44">
            {[46, 38, 30, 22].map((r, i) => (
              <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#eee8dd" strokeOpacity={0.1 + i * 0.04} strokeWidth="0.6" />
            ))}
            <circle
              ref={arc}
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#ff6a2b"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING}
            />
            <circle cx="50" cy="50" r="3" fill="#ff6a2b" />
          </svg>
          <p className="display text-5xl sm:text-6xl">Sillon</p>
        </div>
        <div className="mono flex items-end justify-between text-sm" style={{ color: "#a49d91" }}>
          <span>
            <span ref={count} style={{ color: "#eee8dd" }}>
              000
            </span>{" "}
            %
          </span>
          <span>Lyon — 2026</span>
        </div>
      </div>
    </div>
  );
}
