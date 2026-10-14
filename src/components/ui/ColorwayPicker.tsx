"use client";

import { COLORWAYS, getColorway } from "@/lib/colorways";
import { useSite } from "@/lib/store";

export default function ColorwayPicker({ name = "teinte" }: { name?: string }) {
  const colorway = useSite((s) => s.colorway);
  const setColorway = useSite((s) => s.setColorway);
  const current = getColorway(colorway);

  return (
    <fieldset>
      <legend className="eyebrow mb-4">
        Teinte — <span className="text-fg">{current.name}</span>
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {COLORWAYS.map((c) => (
          <label key={c.id} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={c.id}
              checked={colorway === c.id}
              onChange={() => setColorway(c.id)}
              className="peer sr-only"
            />
            <span className="flex items-center gap-3 rounded-full border border-line py-1.5 pl-1.5 pr-4 transition-colors duration-300 hover:border-line-strong peer-checked:border-fg peer-checked:bg-surface peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent">
              <span
                className="size-8 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15),inset_0_6px_10px_rgb(255_255_255/0.18)]"
                style={{ background: c.swatch }}
              />
              <span className="text-sm font-medium">{c.name}</span>
            </span>
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {current.note}
      </p>
    </fieldset>
  );
}
