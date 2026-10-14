"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSite } from "@/lib/store";
import { sceneLive, sceneTarget } from "@/lib/scenes";
import { pointer } from "./registry";
import Headphones from "./Headphones";
import SoundRings from "./SoundRings";

const TAU = Math.PI * 2;
const { damp } = THREE.MathUtils;

// Amortit la scène vers la cible fournie par le scroll, puis ajoute par-dessus
// les mouvements « vivants » : entrée, flottement, parallaxe et rotation continue.
export default function Rig() {
  const outer = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const live = useRef({
    px: sceneTarget.pos[0],
    py: sceneTarget.pos[1],
    pz: sceneTarget.pos[2],
    rx: sceneTarget.rot[0],
    ry: sceneTarget.rot[1],
    rz: sceneTarget.rot[2],
    scale: sceneTarget.scale,
    spin: 0,
    intro: 0,
    mx: 0,
    my: 0,
    time: 0,
  });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 10);
    const { reducedMotion, introDone } = useSite.getState();
    const l = live.current;
    const t = sceneTarget;
    const k = reducedMotion ? 9 : 3.4;

    // Adapte la composition à la largeur visible
    const aspect = state.size.width / Math.max(state.size.height, 1);
    const spread = aspect >= 0.85 ? THREE.MathUtils.clamp(aspect / 1.78, 0.62, 1.15) : 1;
    const fit = aspect >= 0.85 ? THREE.MathUtils.clamp(aspect / 1.45, 0.78, 1) : 1;

    l.px = damp(l.px, t.pos[0] * spread, k, dt);
    l.py = damp(l.py, t.pos[1], k, dt);
    l.pz = damp(l.pz, t.pos[2], k, dt);
    l.rx = damp(l.rx, t.rot[0], k, dt);
    l.ry = damp(l.ry, t.rot[1], k, dt);
    l.rz = damp(l.rz, t.rot[2], k, dt);
    l.scale = damp(l.scale, t.scale * fit, k, dt);

    sceneLive.explode = damp(sceneLive.explode, t.explode, k * 0.85, dt);
    sceneLive.rings = damp(sceneLive.rings, t.rings, 2.6, dt);
    sceneLive.labels = damp(sceneLive.labels, t.labels, 4, dt);

    if (reducedMotion) {
      l.intro = 1;
      l.spin = damp(l.spin, Math.round(l.spin / TAU) * TAU, 6, dt);
    } else {
      l.time += dt;
      l.intro = damp(l.intro, introDone ? 1 : 0, 1.8, dt);
      if (t.spin > 0.01) l.spin += t.spin * dt * (TAU / 10);
      else l.spin = damp(l.spin, Math.round(l.spin / TAU) * TAU, 2.2, dt);
      if (pointer.active) {
        l.mx = damp(l.mx, pointer.x, 2.5, dt);
        l.my = damp(l.my, pointer.y, 2.5, dt);
      }
    }

    const intro = l.intro;
    const float = reducedMotion ? 0 : Math.sin(l.time * 0.8) * 0.025;
    const enter = 1 - intro;

    outer.current.position.set(l.px, l.py + float - enter * 0.55, l.pz);
    outer.current.scale.setScalar(l.scale * (0.86 + 0.14 * intro));
    inner.current.rotation.set(
      l.rx + l.my * 0.07 + Math.sin(l.time * 0.6) * (reducedMotion ? 0 : 0.015),
      l.ry + l.spin + l.mx * 0.16 + enter * 1.1,
      l.rz,
    );
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <Headphones />
      </group>
      <SoundRings />
    </group>
  );
}
