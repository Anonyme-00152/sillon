import { NAV, SITE } from "@/lib/site";
import TransitionLink from "./TransitionLink";
import { MotionToggle, SoundToggle } from "./Toggles";
import BackToTop from "./BackToTop";

export default function Footer() {
  return (
    <footer data-zone="nuit" data-scene="outro" className="relative z-10 overflow-hidden border-t border-line text-fg">
      <div className="shell grid gap-12 pb-10 pt-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="title max-w-md text-4xl sm:text-5xl">
            Fait pour durer, <em>pensé pour être réparé.</em>
          </p>
        </div>

        <nav aria-label="Pied de page" className="md:col-span-2 md:col-start-7">
          <h2 className="eyebrow mb-5">Navigation</h2>
          <ul className="flex flex-col gap-2.5">
            {[...NAV, { href: "/precommande", label: "Précommande" }].map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="link-underline">
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className="eyebrow mb-5">Le projet</h2>
          <p className="text-sm leading-relaxed text-muted">
            Sillon est une marque fictive imaginée pour un projet de portfolio. Aucun produit n&apos;est vendu, aucune
            donnée n&apos;est collectée. Le casque est modélisé entièrement en code.
          </p>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow mb-5">Confort</h2>
          <div className="flex flex-col items-start gap-4">
            <MotionToggle />
            <SoundToggle className="-ml-3" />
          </div>
        </div>
      </div>

      <div className="shell overflow-hidden">
        <p
          aria-hidden="true"
          className="display select-none pt-6 text-center text-[min(34vw,36rem)] leading-[0.86] tracking-[-0.045em] text-fg/90"
        >
          Sillon
        </p>
      </div>

      <div className="border-t border-line">
        <div className="shell mono flex flex-col gap-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {SITE.name} · Conception & développement{" "}
            <a href={SITE.authorUrl} className="link-underline text-fg" target="_blank" rel="noreferrer">
              {SITE.author}
            </a>
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
