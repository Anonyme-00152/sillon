import type { Metadata } from "next";
import OrderForm from "@/components/ui/OrderForm";
import Reveal, { Line } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Précommande",
  description: "Rejoindre la liste de précommande de Sillon 01 (démo : aucune donnée n'est envoyée).",
};

const FAQ = [
  [
    "Quand serai-je livré ?",
    "Les premières expéditions partent en mars 2027, dans l'ordre d'inscription. Vous recevez un e-mail une semaine avant.",
  ],
  ["Puis-je annuler ?", "À tout moment avant l'expédition, en un clic depuis l'e-mail de confirmation. Rien n'est débité avant."],
  ["Quelle garantie ?", "Cinq ans, pièces et main-d'œuvre. Les coussins et la batterie restent disponibles dix ans."],
  ["Et si je veux le réparer moi-même ?", "C'est prévu : guides illustrés, pièces à prix coûtant et aucune garantie perdue en l'ouvrant."],
] as const;

export default function Precommande() {
  return (
    <section data-zone="nuit" data-scene="order-hero" aria-labelledby="order-title" className="section">
      <div className="shell grid gap-12 md:grid-cols-12">
        <div className="m-panel max-md:mt-[30svh] md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <Reveal waitIntro as="p" className="eyebrow mb-6">
            Précommande
          </Reveal>
          <Reveal waitIntro lines as="h1" id="order-title" className="display text-[clamp(3.2rem,7vw,6.5rem)]">
            <Line i={0}>Réservez</Line>
            <Line i={1}>
              <em>le vôtre.</em>
            </Line>
          </Reveal>
          <Reveal waitIntro delay={300} className="mt-10">
            <OrderForm />
          </Reveal>

          <Reveal delay={200} className="mt-16">
            <h2 className="eyebrow mb-4">Questions fréquentes</h2>
            <div className="border-t border-line">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                    {q}
                    <span
                      aria-hidden="true"
                      className="mono text-lg text-muted transition-transform duration-500 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-muted">{a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
