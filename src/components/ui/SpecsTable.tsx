import { SPECS } from "@/lib/site";
import Reveal from "./Reveal";

export default function SpecsTable() {
  return (
    <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {SPECS.map((group, gi) => (
        <Reveal key={group.group} delay={gi * 80}>
          <h3 className="eyebrow mb-4 text-fg">{group.group}</h3>
          <dl className="border-t border-line">
            {group.items.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 border-b border-line py-3 text-sm">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ))}
    </div>
  );
}
