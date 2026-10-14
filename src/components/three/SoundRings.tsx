"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSite } from "@/lib/store";
import { sceneLive } from "@/lib/scenes";

// Ondes qui rayonnent autour du casque. Sans réduction de bruit, elles sont
// déformées et amples ; avec, elles redeviennent des cercles calmes.

const COUNT = 5;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uNoise;
  uniform float uRadius;
  uniform float uSeed;
  void main() {
    vec3 p = position;
    float a = atan(p.y, p.x);
    float r = length(p.xy);
    float w = sin(a * 5.0 + uTime * 1.3 + uSeed) * 0.07
            + sin(a * 9.0 - uTime * 2.1 + uSeed * 2.0) * 0.04
            + sin(a * 15.0 + uTime * 3.3 + uSeed * 0.5) * 0.02;
    float R = uRadius * (r + uNoise * w);
    p.xy = vec2(cos(a), sin(a)) * R;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    gl_FragColor = vec4(uColor, uOpacity);
    #include <colorspace_fragment>
  }
`;

const NUIT = new THREE.Color("#eee8dd");
const CRAIE = new THREE.Color("#15130f");

export default function SoundRings() {
  const group = useRef<THREE.Group>(null!);
  const geometry = useMemo(() => new THREE.RingGeometry(1, 1.012, 256, 1), []);
  const color = useMemo(() => NUIT.clone(), []);
  const materials = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) =>
        new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
          uniforms: {
            uTime: { value: 0 },
            uNoise: { value: 1 },
            uRadius: { value: 1 },
            uSeed: { value: i * 1.7 },
            uColor: { value: color },
            uOpacity: { value: 0 },
          },
        }),
      ),
    [color],
  );
  const state = useRef({ time: 0, calm: 0 });

  useFrame((_, dt) => {
    const amount = sceneLive.rings;
    group.current.visible = amount > 0.005;
    if (!group.current.visible) return;

    const { anc, reducedMotion } = useSite.getState();
    const s = state.current;
    s.calm = THREE.MathUtils.damp(s.calm, anc ? 1 : 0, 2.4, dt);
    if (!reducedMotion) s.time += dt * THREE.MathUtils.lerp(1, 0.45, s.calm);

    const light = document.documentElement.dataset.theme === "craie";
    color.lerp(light ? CRAIE : NUIT, 1 - Math.exp(-dt * 4));

    const speed = 0.11;
    const rMax = THREE.MathUtils.lerp(1.5, 1.08, s.calm);
    const noise = THREE.MathUtils.lerp(0.75, 0.02, s.calm);
    const base = THREE.MathUtils.lerp(0.34, 0.2, s.calm);

    materials.forEach((m, i) => {
      const phase = reducedMotion ? (i + 0.5) / COUNT : (s.time * speed + i / COUNT) % 1;
      const eased = 1 - Math.pow(1 - phase, 2);
      m.uniforms.uTime.value = s.time;
      m.uniforms.uNoise.value = noise;
      m.uniforms.uRadius.value = THREE.MathUtils.lerp(0.62, rMax, eased);
      m.uniforms.uOpacity.value = Math.sin(phase * Math.PI) * base * amount;
    });
  });

  return (
    <group ref={group} position={[0, -0.12, -0.35]}>
      {materials.map((m, i) => (
        <mesh key={i} geometry={geometry} material={m} renderOrder={-1} />
      ))}
    </group>
  );
}
