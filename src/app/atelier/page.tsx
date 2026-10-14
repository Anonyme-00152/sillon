import type { Metadata } from "next";
import Reveal, { Line } from "@/components/ui/Reveal";
import TransitionLink from "@/components/shell/TransitionLink";

export const metadata: Metadata = {
  title: "Atelier",
  description: "Un petit atelier lyonnais (fictif) qui conçoit des casques faits pour être réparés plutôt que remplacés.",
};

const sectionTitle = "title text-[clamp(2.6rem,5.4vw,5.2rem)]";

const STEPS = [
  ["Écouter", "Chaque projet commence par des semaines d'écoute à l'aveugle, sur des enregistrements que nous connaissons par cœur."],
  ["Sculpter", "Les formes naissent en argile, puis en aluminium. Une coque est validée quand on oublie qu'on la porte."],
  ["Accorder", "Les transducteurs sont appairés un par un sur notre banc de mesure, puis corrigés à l'oreille."],
  ["Assembler", "Pas de colle, pas de soudure inaccessible : tout est vissé ou clipsé, pour pouvoir être ouvert."],
] as const;

const REPAIR = [
  ["10 ans", "de pièces détachées garanties"],
  ["30 s", "pour changer un coussin"],
  ["2 vis", "pour remplacer la batterie"],
  ["9,4/10", "indice de réparabilité visé"],
] as const;

const NUMBERS = [
  ["2021", "Création de l'atelier"],
  ["14", "Personnes à l'atelier"],
  ["92 %", "De pièces fabriquées en Europe"],
  ["0 g", "De plastique dans l'emballage"],
] as const;

export default function Atelier() {
  return (
    <>
      <section data-zone="nuit" data-scene="atelier-hero" aria-labelledby="atelier-title" className="section items-end! max-md:min-h-[118svh]! md:items-center!">
        <div className="shell grid md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal waitIntro as="p" className="eyebrow mb-6">
              L&apos;atelier
            </Reveal>
            <Reveal waitIntro lines as="h1" id="atelier-title" className="display text-[clamp(3.4rem,9vw,8.75rem)]">
              <Line i={0}>Un petit atelier,</Line>
              <Line i={1}>
                <em>une grande écoute.</em>
              </Line>
            </Reveal>
            <Reveal waitIntro delay={380} as="p" className="lede mt-8">
              Sillon naît en 2021 sur les pentes de la Croix-Rousse, dans un ancien atelier de soierie. Trois ingénieurs du
              son, une designer industrielle, et une conviction : un bon casque se répare, il ne se remplace pas.
            </Reveal>
          </div>
        </div>
      </section>

      <section data-zone="craie" data-scene="atelier-process" aria-labelledby="process-title" className="section">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-6 md:col-start-7">
            <Reveal as="p" className="eyebrow mb-6">
              Méthode
            </Reveal>
            <Reveal lines as="h2" id="process-title" className={sectionTitle}>
              <Line i={0}>Quatre gestes,</Line>
              <Line i={1}>
                <em>dans cet ordre.</em>
              </Line>
            </Reveal>
            <ol className="mt-10 border-t border-line">
              {STEPS.map(([name, text], i) => (
                <Reveal as="li" key={name} delay={i * 90} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[4rem_1fr]">
                  <span className="mono text-xs text-accent">0{i + 1}</span>
                  <span>
                    <span className="title block text-3xl">{name}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted">{text}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section data-zone="nuit" data-scene="atelier-repair" aria-labelledby="repair-title" className="section">
        <div className="shell grid md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-6 lg:col-span-5">
            <Reveal as="p" className="eyebrow mb-6">
              Réparabilité
            </Reveal>
            <Reveal lines as="h2" id="repair-title" className={sectionTitle}>
              <Line i={0}>Réparable,</Line>
              <Line i={1}>
                <em>pour de vrai.</em>
              </Line>
            </Reveal>
            <Reveal delay={200} as="p" className="lede mt-6">
              Un tournevis, un guide illustré, des pièces vendues à prix coûtant. Et si vous préférez, l&apos;atelier
              s&apos;en charge sous 72 heures.
            </Reveal>
            <Reveal delay={300} as="dl" className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {REPAIR.map(([v, k]) => (
                <div key={k} className="bg-bg p-5">
                  <dd className="title text-4xl">{v}</dd>
                  <dt className="mt-1 text-sm text-muted">{k}</dt>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section data-zone="craie" data-scene="atelier-values" aria-labelledby="values-title" className="section">
        <div className="shell">
          <div className="max-w-3xl">
            <Reveal as="p" className="eyebrow mb-6">
              En chiffres
            </Reveal>
            <Reveal lines as="h2" id="values-title" className={sectionTitle}>
              <Line i={0}>Petits par la taille,</Line>
              <Line i={1}>
                <em>exigeants par nature.</em>
              </Line>
            </Reveal>
          </div>
          <dl className="mt-16 grid gap-x-8 gap-y-12 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {NUMBERS.map(([v, k], i) => (
              <Reveal key={k} delay={i * 90}>
                <dd className="display text-[clamp(4rem,8vw,7rem)]">{v}</dd>
                <dt className="mt-2 text-sm text-muted">{k}</dt>
              </Reveal>
            ))}
          </dl>
          <Reveal delay={200} className="mt-16 flex flex-wrap gap-3">
            <TransitionLink href="/precommande" className="btn btn-primary">
              Précommander <span className="arrow" aria-hidden="true">→</span>
            </TransitionLink>
            <TransitionLink href="/technologie" className="btn btn-ghost">
              Voir la technologie
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
