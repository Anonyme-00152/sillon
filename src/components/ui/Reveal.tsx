"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useSite } from "@/lib/store";

type Tag = "div" | "p" | "h1" | "h2" | "h3" | "span" | "ul" | "ol" | "dl" | "li" | "figure";

type Props = {
  as?: Tag;
  children: ReactNode;
  className?: string;
  /** délai en millisecondes */
  delay?: number;
  /** anime ligne par ligne (enfants <Line>) au lieu d'un fondu */
  lines?: boolean;
  /** attend la fin du préchargement (héros) */
  waitIntro?: boolean;
  id?: string;
};

export default function Reveal({ as = "div", children, className, delay = 0, lines, waitIntro, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const introDone = useSite((s) => s.introDone);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const on = seen && (!waitIntro || introDone);
  // Le type réel varie (h1, p, ul…) ; "div" sert seulement à typer la ref.
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      id={id}
      className={[className, on ? "is-in" : ""].filter(Boolean).join(" ") || undefined}
      style={{ "--d": delay } as CSSProperties}
      data-reveal={lines ? undefined : ""}
      data-lines={lines ? "" : undefined}
    >
      {children}
    </Tag>
  );
}

/** Une ligne masquée qui glisse vers le haut (dans un <Reveal lines>). */
export function Line({ children, i = 0 }: { children: ReactNode; i?: number }) {
  return (
    <span className="line" style={{ "--i": i } as CSSProperties}>
      <span>{children}</span>
    </span>
  );
}
