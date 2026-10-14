import AncDemo from "@/components/ui/AncDemo";
import ColorwayPicker from "@/components/ui/ColorwayPicker";
import Counter from "@/components/ui/Counter";
import Reveal, { Line } from "@/components/ui/Reveal";
import SpecsTable from "@/components/ui/SpecsTable";
import TransitionLink from "@/components/shell/TransitionLink";
import { PARTS } from "@/components/three/registry";
import { SITE } from "@/lib/site";

const sectionTitle = "title text-[clamp(2.6rem,5.6vw,5.4rem)]";

export default function Home() {
  return (
    <>
      {/* Héros */}
      <section
        data-zone="nuit"
        data-scene="home-hero"
        aria-labelledby="hero-title"
        className="section items-end! max-md:min-h-[128svh]! md:items-center!"
      >
        <div className="shell grid md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-6">
            <Reveal waitIntro as="p" className="eyebrow mb-6">
              Modèle 01 · Casque à réduction de bruit
            </Reveal>
            <Reveal waitIntro lines as="h1" id="hero-title" className="display text-[clamp(3.6rem,10.4vw,10rem)]">
              <Line i={0}>Le silence,</Line>
              <Line i={1}>taillé sur</Line>
              <Line i={2}>
                <em>mesure.</em>
              </Line>
            </Reveal>
            <Reveal waitIntro delay={420} className="mt-8 flex flex-col gap-8">
              <p className="lede">
                Un transducteur de 40 mm accordé à la main, une réduction de bruit hybride à huit micros et soixante
                heures d&apos;autonomie, dans une coque en aluminium usinée d&apos;un seul bloc.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#conception" className="btn btn-ghost">
                  Découvrir <span className="arrow" aria-hidden="true">↓</span>
                </a>
                <TransitionLink href="/precommande" className="btn btn-primary">
                  Précommander · {SITE.price} <span className="arrow" aria-hidden="true">→</span>
                </TransitionLink>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 hidden md:block">
          <Reveal waitIntro delay={700} className="shell mono flex items-end justify-between pb-6 text-xs uppercase tracking-[0.14em] text-muted">
            <span>Conçu et accordé à Lyon</span>
            <span className="flex flex-col items-center gap-3">
              <span className="scroll-cue" aria-hidden="true" />
              Défiler
            </span>
            <span>Éd. 2026 — 01/04</span>
          </Reveal>
        </div>
      </section>

      {/* 01 — Conception */}
      <section id="conception" data-zone="nuit" data-scene="home-design" aria-labelledby="design-title" className="section">
        <div className="shell grid md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-5 md:col-start-8">
            <Reveal as="p" className="eyebrow mb-6">
              01 — Conception
            </Reveal>
            <Reveal lines as="h2" id="design-title" className={sectionTitle}>
              <Line i={0}>Un objet,</Line>
              <Line i={1}>
                <em>pas un gadget.</em>
              </Line>
            </Reveal>
            <Reveal delay={200} as="p" className="lede mt-6">
              Un arceau en acier à ressort, des fourches en aluminium d&apos;une seule pièce, aucune vis apparente.
              268 grammes répartis pour se faire oublier au bout de dix minutes.
            </Reveal>
            <Reveal delay={320} as="dl" className="mt-10 grid grid-cols-3 border-t border-line">
              {[
                ["268 g", "Poids total"],
                ["6061", "Aluminium recyclé"],
                ["0", "Vis apparente"],
              ].map(([v, k]) => (
                <div key={k} className="border-r border-line py-5 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4">
                  <dd className="title text-4xl">{v}</dd>
                  <dt className="mt-1 text-sm text-muted">{k}</dt>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 02 — Anatomie (vue éclatée) */}
      <section
        data-zone="nuit"
        data-scene="home-anatomy"
        aria-labelledby="anatomy-title"
        className="section min-h-[150svh]! items-stretch!"
      >
        <div className="shell flex flex-col justify-between">
          <div className="sticky top-[calc(var(--header-h)+2rem)] max-w-md">
            <Reveal as="p" className="eyebrow mb-6">
              02 — Anatomie
            </Reveal>
            <Reveal lines as="h2" id="anatomy-title" className={sectionTitle}>
              <Line i={0}>Cinq couches,</Line>
              <Line i={1}>
                <em>zéro colle.</em>
              </Line>
            </Reveal>
            <Reveal delay={200} as="p" className="lede mt-6">
              Tout s&apos;emboîte, rien n&apos;est collé : chaque pièce se démonte, se remplace et se recycle séparément.
            </Reveal>
          </div>
          <Reveal as="ol" className="mt-16 grid gap-3 self-end sm:sr-only">
            {PARTS.map((p, i) => (
              <li key={p.id} className="flex gap-4 border-t border-line pt-3 text-sm">
                <span className="mono text-xs text-accent">0{i + 1}</span>
                <span>
                  <strong className="font-semibold">{p.label}</strong>
                  <span className="text-muted"> — {p.detail}</span>
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 03 — Silence actif */}
      <section data-zone="nuit" data-scene="home-silence" aria-labelledby="silence-title" className="section">
        <div className="shell grid md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-6 lg:col-span-5">
            <Reveal as="p" className="eyebrow mb-6">
              03 — Silence actif
            </Reveal>
            <Reveal lines as="h2" id="silence-title" className={sectionTitle}>
              <Line i={0}>Le bruit s&apos;efface.</Line>
              <Line i={1}>
                <em>La musique reste.</em>
              </Line>
            </Reveal>
            <Reveal delay={200} as="p" className="lede mt-6">
              Huit micros écoutent votre environnement 48 000 fois par seconde et lui opposent une onde inverse. Jusqu&apos;à
              −42 dB sur les basses : métro, cabine d&apos;avion, open space.
            </Reveal>
            <Reveal delay={320} className="mt-8">
              <AncDemo />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 — Finitions */}
      <section data-zone="craie" data-scene="home-finish" aria-labelledby="finish-title" className="section">
        <div className="shell grid md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-5 md:col-start-8">
            <Reveal as="p" className="eyebrow mb-6">
              04 — Finitions
            </Reveal>
            <Reveal lines as="h2" id="finish-title" className={sectionTitle}>
              <Line i={0}>Quatre teintes,</Line>
              <Line i={1}>
                <em>une main.</em>
              </Line>
            </Reveal>
            <Reveal delay={200} as="p" className="lede mt-6">
              Chaque coque est sablée puis anodisée par petites séries. Les coussins sont en cuir protéiné, sans PVC ni
              solvant.
            </Reveal>
            <Reveal delay={320} className="mt-10">
              <ColorwayPicker />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 — Autonomie */}
      <section data-zone="craie" data-scene="home-battery" aria-labelledby="battery-title" className="section">
        <div className="shell grid md:grid-cols-12">
          <div className="m-panel max-md:mt-[30svh] md:col-span-6">
            <Reveal as="p" className="eyebrow mb-2">
              05 — Autonomie
            </Reveal>
            <Reveal as="p" className="display text-[clamp(8rem,22vw,19rem)] leading-[0.78]!" aria-hidden="true">
              <Counter value={60} />
              <span className="ml-3 align-top text-[0.32em] italic text-accent">h</span>
            </Reveal>
            <Reveal lines as="h2" id="battery-title" className={`${sectionTitle} mt-4`}>
              <span className="sr-only">60 heures d&apos;autonomie. </span>
              <Line i={0}>Une semaine de trajets,</Line>
              <Line i={1}>
                <em>une seule charge.</em>
              </Line>
            </Reveal>
            <Reveal delay={240} as="dl" className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
              {[
                ["40 h", "avec la réduction de bruit"],
                ["10 min", "de charge pour 6 h d'écoute"],
                ["1 200", "cycles avant 80 % de capacité"],
              ].map(([v, k]) => (
                <div key={k}>
                  <dd className="title text-4xl">{v}</dd>
                  <dt className="mt-1 text-sm text-muted">{k}</dt>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 06 — Fiche technique */}
      <section data-zone="nuit" data-scene="home-specs" aria-labelledby="specs-title" className="section">
        <div className="shell">
          <div className="mb-14 grid items-end gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <Reveal as="p" className="eyebrow mb-6">
                06 — Fiche technique
              </Reveal>
              <Reveal lines as="h2" id="specs-title" className={sectionTitle}>
                <Line i={0}>Les chiffres,</Line>
                <Line i={1}>
                  <em>sans détour.</em>
                </Line>
              </Reveal>
            </div>
            <Reveal delay={200} className="md:col-span-4 md:col-start-9">
              <p className="lede">Mesurés en laboratoire, publiés en entier. Les courbes complètes sont sur la page technologie.</p>
              <TransitionLink href="/technologie" className="btn btn-ghost mt-6">
                Toute la technologie <span className="arrow" aria-hidden="true">→</span>
              </TransitionLink>
            </Reveal>
          </div>
          <SpecsTable />
        </div>
      </section>

      {/* Appel à l'action */}
      <section data-zone="nuit" data-scene="home-cta" aria-labelledby="cta-title" className="section items-end!">
        <div className="shell flex flex-col items-center text-center">
          <Reveal lines as="h2" id="cta-title" className="display text-[clamp(3.4rem,9vw,8.5rem)]">
            <Line i={0}>
              Écoutez <em>moins.</em>
            </Line>
            <Line i={1}>
              Entendez <em>mieux.</em>
            </Line>
          </Reveal>
          <Reveal delay={240} as="p" className="mono mt-8 text-xs uppercase tracking-[0.14em] text-muted">
            {SITE.price} · {SITE.shipping} · Garantie 5 ans
          </Reveal>
          <Reveal delay={340} className="mt-8 flex flex-wrap justify-center gap-3">
            <TransitionLink href="/precommande" className="btn btn-primary">
              Précommander {SITE.product} <span className="arrow" aria-hidden="true">→</span>
            </TransitionLink>
            <TransitionLink href="/atelier" className="btn btn-ghost">
              Découvrir l&apos;atelier
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
