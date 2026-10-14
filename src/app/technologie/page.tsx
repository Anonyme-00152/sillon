import type { Metadata } from "next";
import AncModes from "@/components/ui/AncModes";
import Counter from "@/components/ui/Counter";
import Reveal, { Line } from "@/components/ui/Reveal";
import SpecsTable from "@/components/ui/SpecsTable";
import TransitionLink from "@/components/shell/TransitionLink";

export const metadata: Metadata = {
  title: "Technologie",
  description: "Transducteur 40 mm, réduction de bruit hybride, batterie remplaçable : ce qu'il y a sous la coque de Sillon 01.",
};

const sectionTitle = "title text-[clamp(2.6rem,5.4vw,5.2rem)]";

const MATERIALS = [
  ["Aluminium 6061", "Recyclé à 100 %, usiné puis anodisé. Coque, fourches et plaque."],
  ["Acier à ressort", "L'arceau garde sa tension pendant des années, sans fatigue."],
  ["Cuir protéiné", "Une alternative au cuir animal, respirante, sans PVC ni solvant."],
  ["Mousse à mémoire", "Deux densités : souple au contact, ferme pour l'isolation."],
  ["Textile recyclé", "Le tissu acoustique est tissé à partir de bouteilles collectées."],
] as const;

export default function Technologie() {
  return (
    <>
      <section data-zone="nuit" data-scene="tech-hero" aria-labelledby="tech-title" className="section items-end! max-md:min-h-[118svh]! md:items-center!">
        <div className="shell grid md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-6">
            <Reveal waitIntro as="p" className="eyebrow mb-6">
              Technologie
            </Reveal>
            <Reveal waitIntro lines as="h1" id="tech-title" className="display text-[clamp(3.6rem,10vw,9.5rem)]">
              <Line i={0}>Sous la</Line>
              <Line i={1}>
                <em>coque.</em>
              </Line>
            </Reveal>
            <Reveal waitIntro delay={380} as="p" className="lede mt-8">
              Quatre ans de prototypes, trois cents écoutes à l&apos;aveugle et une règle : chaque composant doit pouvoir
              s&apos;expliquer, se mesurer et se remplacer.
            </Reveal>
          </div>
        </div>
      </section>

      <section data-zone="nuit" data-scene="tech-driver" aria-labelledby="driver-title" className="section min-h-[130svh]!">
        <div className="shell grid md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-5 md:col-start-8">
            <Reveal as="p" className="eyebrow mb-6">
              Transducteur
            </Reveal>
            <Reveal lines as="h2" id="driver-title" className={sectionTitle}>
              <Line i={0}>40 mm accordés</Line>
              <Line i={1}>
                <em>à l&apos;oreille.</em>
              </Line>
            </Reveal>
            <Reveal delay={200} as="p" className="lede mt-6">
              Une membrane en biocellulose, rigide et légère, montée sur un aimant néodyme. Chaque paire est appairée en
              atelier à ±0,5 dB près, puis écoutée par une personne avant de partir.
            </Reveal>
            <Reveal delay={300} as="dl" className="mt-10 grid grid-cols-3 border-t border-line">
              {[
                ["4 Hz", "à 40 kHz"],
                ["0,08 %", "de distorsion"],
                ["±0,5 dB", "d'appairage"],
              ].map(([v, k]) => (
                <div key={k} className="border-r border-line py-5 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4">
                  <dd className="title text-3xl sm:text-4xl">{v}</dd>
                  <dt className="mt-1 text-sm text-muted">{k}</dt>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section data-zone="nuit" data-scene="tech-anc" aria-labelledby="anc-title" className="section">
        <div className="shell grid md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-6 lg:col-span-5">
            <Reveal as="p" className="eyebrow mb-6">
              Réduction de bruit hybride
            </Reveal>
            <Reveal lines as="h2" id="anc-title" className={sectionTitle}>
              <Line i={0}>Trois modes,</Line>
              <Line i={1}>
                <em>un seul geste.</em>
              </Line>
            </Reveal>
            <Reveal delay={200} as="p" className="lede mt-6">
              Quatre micros extérieurs anticipent le bruit, quatre micros intérieurs corrigent ce qui passe encore. Un
              appui long sur la coque droite change de mode.
            </Reveal>
            <Reveal delay={320} className="mt-8">
              <AncModes />
            </Reveal>
          </div>
        </div>
      </section>

      <section data-zone="craie" data-scene="tech-battery" aria-labelledby="tech-battery-title" className="section">
        <div className="shell grid md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-6 md:col-start-7">
            <Reveal as="p" className="eyebrow mb-2">
              Batterie
            </Reveal>
            <Reveal as="p" className="display text-[clamp(7rem,18vw,15rem)] leading-[0.8]!" aria-hidden="true">
              <Counter value={1200} />
            </Reveal>
            <Reveal lines as="h2" id="tech-battery-title" className={`${sectionTitle} mt-4`}>
              <span className="sr-only">1 200 cycles de charge. </span>
              <Line i={0}>Une batterie</Line>
              <Line i={1}>
                <em>qui se change.</em>
              </Line>
            </Reveal>
            <Reveal delay={200} as="p" className="lede mt-6">
              La cellule se loge derrière le coussin gauche, tenue par deux vis standard. Comptez deux minutes pour la
              remplacer — et 1 200 cycles avant d&apos;en avoir besoin.
            </Reveal>
          </div>
        </div>
      </section>

      <section data-zone="craie" data-scene="tech-materials" aria-labelledby="materials-title" className="section">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-6">
            <Reveal as="p" className="eyebrow mb-6">
              Matières
            </Reveal>
            <Reveal lines as="h2" id="materials-title" className={sectionTitle}>
              <Line i={0}>Choisies</Line>
              <Line i={1}>
                <em>pour durer.</em>
              </Line>
            </Reveal>
            <Reveal as="ul" delay={200} className="mt-10 border-t border-line">
              {MATERIALS.map(([name, text], i) => (
                <li key={name} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[3rem_12rem_1fr] sm:gap-4">
                  <span className="mono text-xs text-accent">0{i + 1}</span>
                  <span className="font-semibold">{name}</span>
                  <span className="text-sm text-muted">{text}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section data-zone="nuit" data-scene="tech-specs" aria-labelledby="tech-specs-title" className="section">
        <div className="shell">
          <div className="mb-14 grid items-end gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <Reveal as="p" className="eyebrow mb-6">
                Fiche technique complète
              </Reveal>
              <Reveal lines as="h2" id="tech-specs-title" className={sectionTitle}>
                <Line i={0}>Tout,</Line>
                <Line i={1}>
                  <em>noir sur blanc.</em>
                </Line>
              </Reveal>
            </div>
            <Reveal delay={200} className="md:col-span-4 md:col-start-9">
              <TransitionLink href="/precommande" className="btn btn-primary">
                Précommander <span className="arrow" aria-hidden="true">→</span>
              </TransitionLink>
            </Reveal>
          </div>
          <SpecsTable />
        </div>
      </section>
    </>
  );
}
