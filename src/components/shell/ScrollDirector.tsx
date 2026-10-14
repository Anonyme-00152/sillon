"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_SCENE, SCENES, sceneTarget, type SceneState, type Vec3 } from "@/lib/scenes";

const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixVec = (out: Vec3, a: Vec3, b: Vec3, t: number) => {
  out[0] = mix(a[0], b[0], t);
  out[1] = mix(a[1], b[1], t);
  out[2] = mix(a[2], b[2], t);
};

function resolve(key: string | undefined, portrait: boolean): SceneState {
  const s = (key && SCENES[key]) || DEFAULT_SCENE;
  if (!portrait || !s.portrait) return s;
  return {
    ...s,
    pos: s.portrait.pos ?? s.pos,
    rot: s.portrait.rot ?? s.rot,
    scale: s.portrait.scale ?? s.scale,
  };
}

// Lit les sections [data-scene] visibles et calcule :
// - l'état 3D cible (interpolé entre la section courante et la suivante) ;
// - le thème clair/sombre de la zone au centre de l'écran.
function compute() {
  const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-zone]"));
  const scenes = zones.filter((el) => el.dataset.scene);
  if (!scenes.length) return;

  const vh = window.innerHeight;
  const mid = vh / 2;
  const portrait = window.innerWidth / vh < 0.85;

  const items = scenes.map((el) => {
    const r = el.getBoundingClientRect();
    const h = Math.min(r.height, vh) * 0.7;
    return { key: el.dataset.scene, start: r.top + h / 2, end: r.bottom - h / 2 };
  });

  let a = items[0];
  let b = items[0];
  let t = 0;
  const last = items[items.length - 1];
  if (mid >= last.end) {
    a = b = last;
  } else if (mid > items[0].start) {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const next = items[i + 1];
      if (mid >= it.start && mid <= it.end) {
        a = b = it;
        break;
      }
      if (next && mid > it.end && mid < next.start) {
        a = it;
        b = next;
        t = smooth((mid - it.end) / Math.max(next.start - it.end, 1));
        break;
      }
    }
  }

  const A = resolve(a.key, portrait);
  const B = resolve(b.key, portrait);
  mixVec(sceneTarget.pos, A.pos, B.pos, t);
  mixVec(sceneTarget.rot, A.rot, B.rot, t);
  sceneTarget.scale = mix(A.scale, B.scale, t);
  sceneTarget.explode = mix(A.explode, B.explode, t);
  sceneTarget.rings = mix(A.rings, B.rings, t);
  sceneTarget.spin = mix(A.spin, B.spin, t);
  sceneTarget.labels = mix(A.labels, B.labels, t);

  // Thème : la zone qui occupe le centre de l'écran
  let theme = zones[0].dataset.zone ?? "nuit";
  for (const el of zones) {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) {
      theme = el.dataset.zone ?? theme;
      break;
    }
    if (r.top > mid) break;
    theme = el.dataset.zone ?? theme;
  }
  const html = document.documentElement;
  if (html.dataset.theme !== theme) html.dataset.theme = theme;
}

export default function ScrollDirector() {
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      compute();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, [pathname]);

  return null;
}
