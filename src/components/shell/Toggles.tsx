"use client";

import { useSite } from "@/lib/store";
import { getAudio, playToggle } from "@/lib/sound";
import { applyMotion, applySound } from "./Preferences";

export function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSite((s) => s.sound);
  return (
    <button
      type="button"
      data-sound="off"
      aria-pressed={on}
      onClick={() => {
        const next = !on;
        if (next) getAudio();
        applySound(next);
        playToggle(next);
      }}
      className={`group inline-flex h-10 items-center gap-2.5 rounded-full px-3 text-sm transition-colors hover:bg-surface ${className}`}
    >
      <span className="eq flex h-3.5 items-end gap-[3px]" data-on={on}>
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="mono text-xs uppercase tracking-[0.12em]">
        Son <span className="sr-only">d&apos;interface</span>
        <span aria-hidden="true">{on ? "on" : "off"}</span>
      </span>
    </button>
  );
}

export function MotionToggle({ className = "" }: { className?: string }) {
  const reduced = useSite((s) => s.reducedMotion);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={reduced}
      onClick={() => applyMotion(!reduced, true)}
      className={`inline-flex items-center gap-3 text-left text-sm ${className}`}
    >
      <span className="switch" aria-hidden="true" />
      <span>Réduire les animations</span>
    </button>
  );
}
