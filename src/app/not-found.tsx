import TransitionLink from "@/components/shell/TransitionLink";

export default function NotFound() {
  return (
    <section data-zone="nuit" data-scene="lost" aria-labelledby="lost-title" className="section items-end!">
      <div className="shell flex flex-col items-center text-center">
        <p className="eyebrow mb-6">Erreur 404</p>
        <h1 id="lost-title" className="display text-[clamp(3.2rem,8vw,7.5rem)]">
          Ce sillon ne mène <em>nulle part.</em>
        </h1>
        <p className="lede mt-6">La page demandée n&apos;existe pas, ou plus. Le casque, lui, est toujours là.</p>
        <TransitionLink href="/" className="btn btn-primary mt-8">
          Retour à l&apos;accueil <span className="arrow" aria-hidden="true">→</span>
        </TransitionLink>
      </div>
    </section>
  );
}
