"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV, SITE } from "@/lib/site";
import { useSite } from "@/lib/store";
import Mark from "@/components/ui/Mark";
import TransitionLink from "./TransitionLink";
import { MotionToggle, SoundToggle } from "./Toggles";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = useSite((s) => s.menuOpen);
  const setMenuOpen = useSite((s) => s.setMenuOpen);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobile : le reste de la page devient inerte, Échap referme.
  useEffect(() => {
    const outside = [document.getElementById("contenu"), document.querySelector("footer")];
    outside.forEach((el) => el?.toggleAttribute("inert", menuOpen));
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, [setMenuOpen]);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-50" data-scrolled={scrolled || menuOpen}>
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <TransitionLink href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} — accueil`}>
            <Mark className="size-7" />
            <span className="display text-[1.85rem] leading-none" aria-hidden="true">
              Sillon
            </span>
          </TransitionLink>

          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-9 text-[0.95rem]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="link-underline py-1"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <SoundToggle className="hidden sm:inline-flex" />
            <TransitionLink href="/precommande" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Précommander
            </TransitionLink>
            <button
              ref={toggleRef}
              type="button"
              className="btn btn-ghost btn-sm md:hidden"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "Fermer" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Hors du <header> : son backdrop-filter enfermerait ce panneau fixe dans sa hauteur. */}
      <div
        id="menu-mobile"
        hidden={!menuOpen}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-bg md:hidden"
        data-lenis-prevent
      >
        <nav aria-label="Menu mobile" className="shell flex min-h-full flex-col justify-between gap-10 py-10">
          <ul className="flex flex-col gap-2">
            {[...NAV, { href: "/precommande", label: "Précommander" }].map((item, i) => (
              <li key={item.href} style={{ animation: `menu-in 0.7s var(--ease) ${i * 60}ms both` }}>
                <TransitionLink
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="title flex items-baseline justify-between border-b border-line py-3 text-5xl aria-[current=page]:text-accent"
                >
                  {item.label}
                  <span className="mono text-xs text-muted" aria-hidden="true">
                    0{i + 1}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-5">
            <SoundToggle className="-ml-3 self-start" />
            <MotionToggle />
            <p className="text-sm text-muted">Sillon est une marque fictive — projet de portfolio.</p>
          </div>
        </nav>
      </div>
    </>
  );
}
