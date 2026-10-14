"use client";

import type { CSSProperties } from "react";
import { PARTS, labelElements } from "@/components/three/registry";

// Étiquettes de la vue éclatée, positionnées à chaque image par la scène 3D.
// Décoratives (aria-hidden) : la section Anatomie contient la même liste en texte.
export default function AnatomyLabels() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] hidden overflow-hidden sm:block" aria-hidden="true">
      {PARTS.map((p) => {
        // Arrondis : le serveur et le navigateur doivent produire exactement la même chaîne.
        const len = Math.hypot(p.dx, p.dy).toFixed(1);
        const angle = ((Math.atan2(p.dy, p.dx) * 180) / Math.PI).toFixed(2);
        const style = { "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--len": `${len}px`, "--angle": `${angle}deg` } as CSSProperties;
        return (
          <div
            key={p.id}
            ref={(el) => void (labelElements[p.id] = el)}
            className="part-label"
            data-align={p.dx < 0 ? "end" : "start"}
            style={style}
          >
            <span className="rule" />
            <span className="dot" />
            <span className="text flex flex-col leading-tight">
              <span className="mono text-[0.7rem] uppercase tracking-[0.14em] text-fg">{p.label}</span>
              <span className="text-xs text-muted">{p.detail}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
