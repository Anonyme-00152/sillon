"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { useSite } from "@/lib/store";

const MODES = [
  {
    id: "silence",
    label: "Silence",
    anc: true,
    text: "Atténuation maximale. Les basses fréquences — moteurs, ventilation, roulement — disparaissent presque entièrement.",
  },
  {
    id: "transparence",
    label: "Transparence",
    anc: false,
    text: "Les micros extérieurs restituent votre environnement : une annonce en gare, une conversation, sans retirer le casque.",
  },
  {
    id: "adaptatif",
    label: "Adaptatif",
    anc: true,
    text: "Le casque ajuste l'atténuation en continu selon le niveau ambiant, pour préserver la batterie quand c'est calme.",
  },
] as const;

/** Onglets accessibles (flèches gauche/droite) qui pilotent les ondes de la scène. */
export default function AncModes() {
  const setAnc = useSite((s) => s.setAnc);
  const [active, setActive] = useState(0);
  const base = useId();

  const select = (i: number, focus = false) => {
    setActive(i);
    setAnc(MODES[i].anc);
    if (focus) document.getElementById(`${base}-tab-${i}`)?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const last = MODES.length - 1;
    if (e.key === "ArrowRight") select(active === last ? 0 : active + 1, true);
    else if (e.key === "ArrowLeft") select(active === 0 ? last : active - 1, true);
    else if (e.key === "Home") select(0, true);
    else if (e.key === "End") select(last, true);
    else return;
    e.preventDefault();
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-2 backdrop-blur-md">
      <div role="tablist" aria-label="Modes de réduction de bruit" className="grid grid-cols-3 gap-1" onKeyDown={onKey}>
        {MODES.map((m, i) => (
          <button
            key={m.id}
            id={`${base}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`${base}-panel`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => select(i)}
            className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300 hover:bg-surface aria-selected:bg-fg aria-selected:text-bg"
          >
            {m.label}
          </button>
        ))}
      </div>
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${active}`}
        className="px-3 pb-3 pt-4 text-sm leading-relaxed text-muted"
      >
        {MODES[active].text}
      </div>
    </div>
  );
}
