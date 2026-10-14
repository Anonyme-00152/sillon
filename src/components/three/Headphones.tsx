"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useSite } from "@/lib/store";
import { getColorway } from "@/lib/colorways";
import { sceneLive } from "@/lib/scenes";
import { makeGrooveTexture, makeSideTexture, makeWovenTexture } from "./textures";
import { labelAnchors } from "./registry";

// Casque modélisé entièrement en code. Repère : arceau en haut, oreillettes sur ±X,
// face avant vers +Z. Chaque oreillette est construite autour d'un axe local Y
// orienté vers l'intérieur (vers la tête), ce qui simplifie la vue éclatée.

const CUP_Y = -0.62;
const YOKE_X = 0.88;
const BAND_CY = 0.12;
const BAND_R = 0.88;
const OVAL: [number, number, number] = [1.12, 1, 0.94];

function arc(radius: number, a0: number, a1: number, z = 0) {
  const pts: THREE.Vector3[] = [];
  const n = 72;
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * (i / n);
    pts.push(new THREE.Vector3(Math.cos(a) * radius, BAND_CY + Math.sin(a) * radius, z));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function useGeometries() {
  return useMemo(() => {
    const shellProfile = [
      [0, 0],
      [0.25, 0],
      [0.33, 0.008],
      [0.385, 0.03],
      [0.415, 0.065],
      [0.43, 0.11],
      [0.432, 0.16],
      [0.425, 0.2],
      [0.41, 0.226],
      [0.39, 0.236],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const coneProfile = [
      [0.035, 0.02],
      [0.07, 0.034],
      [0.12, 0.058],
      [0.17, 0.082],
      [0.2, 0.094],
      [0.212, 0.096],
    ].map(([r, y]) => new THREE.Vector2(r, y));

    const stitchR = BAND_R + 0.0185;
    return {
      shell: new THREE.LatheGeometry(shellProfile, 96),
      plate: new THREE.CylinderGeometry(0.31, 0.31, 0.024, 96),
      logo: new THREE.TorusGeometry(0.11, 0.0045, 8, 96),
      cushion: new THREE.TorusGeometry(0.33, 0.085, 28, 96),
      fabric: new THREE.CircleGeometry(0.335, 64),
      chamber: new THREE.CylinderGeometry(0.3, 0.3, 0.012, 64),
      magnet: new THREE.CylinderGeometry(0.085, 0.085, 0.05, 48),
      frame: new THREE.TorusGeometry(0.205, 0.011, 12, 96),
      cone: new THREE.LatheGeometry(coneProfile, 64),
      cap: new THREE.SphereGeometry(0.05, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      yoke: new THREE.TorusGeometry(0.5, 0.021, 16, 96, Math.PI),
      pivot: new THREE.CylinderGeometry(0.032, 0.032, 0.07, 24),
      slider: new THREE.CylinderGeometry(0.012, 0.012, 0.22, 16),
      band: new THREE.TubeGeometry(arc(BAND_R, -0.1, Math.PI + 0.1), 180, 0.024, 20, false),
      pad: new THREE.TubeGeometry(arc(BAND_R - 0.05, 0.52, Math.PI - 0.52), 120, 0.03, 20, false),
      stitchA: new THREE.TubeGeometry(arc(stitchR, 0.3, Math.PI - 0.3, 0.05), 120, 0.0032, 6, false),
      stitchB: new THREE.TubeGeometry(arc(stitchR, 0.3, Math.PI - 0.3, -0.05), 120, 0.0032, 6, false),
      button: new THREE.CylinderGeometry(0.02, 0.02, 0.03, 20),
      led: new THREE.SphereGeometry(0.009, 12, 8),
      port: new THREE.BoxGeometry(0.03, 0.022, 0.075),
    };
  }, []);
}

type Geos = ReturnType<typeof useGeometries>;

function useMaterials() {
  return useMemo(() => {
    const groove = makeGrooveTexture();
    const woven = makeWovenTexture();
    const c = getColorway("graphite");
    const sheen = new THREE.Color("#ffffff");
    return {
      shell: new THREE.MeshPhysicalMaterial({
        color: c.shell,
        roughness: 0.36,
        metalness: 0.3,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        side: THREE.DoubleSide,
      }),
      band: new THREE.MeshPhysicalMaterial({
        color: c.band,
        roughness: 0.46,
        metalness: 0.12,
        clearcoat: 0.35,
        clearcoatRoughness: 0.4,
      }),
      metal: new THREE.MeshStandardMaterial({ color: c.metal, metalness: 1, roughness: 0.26 }),
      plate: new THREE.MeshStandardMaterial({
        color: c.metal,
        metalness: 1,
        roughness: 0.34,
        bumpMap: groove,
        bumpScale: 1.4,
        roughnessMap: groove,
      }),
      cushion: new THREE.MeshPhysicalMaterial({
        color: c.cushion,
        roughness: 0.7,
        sheen: 1,
        sheenRoughness: 0.5,
        sheenColor: sheen,
      }),
      fabric: new THREE.MeshStandardMaterial({
        color: "#3b3936",
        roughness: 0.95,
        map: woven,
        side: THREE.DoubleSide,
      }),
      cone: new THREE.MeshStandardMaterial({ color: "#cbbda5", roughness: 0.82, side: THREE.DoubleSide }),
      magnet: new THREE.MeshStandardMaterial({ color: "#2c2c2e", metalness: 0.9, roughness: 0.3 }),
      dark: new THREE.MeshStandardMaterial({ color: "#121110", roughness: 0.55, metalness: 0.2 }),
      accent: new THREE.MeshStandardMaterial({
        color: c.accent,
        emissive: c.accent,
        emissiveIntensity: 0.3,
        roughness: 0.35,
        metalness: 0.2,
      }),
      sideL: new THREE.MeshBasicMaterial({ map: makeSideTexture("L"), transparent: true, depthWrite: false }),
      sideR: new THREE.MeshBasicMaterial({ map: makeSideTexture("R"), transparent: true, depthWrite: false }),
    };
  }, []);
}

type Mats = ReturnType<typeof useMaterials>;

function Cup({ side, geos, mats }: { side: 1 | -1; geos: Geos; mats: Mats }) {
  const assembly = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const plate = useRef<THREE.Group>(null!);
  const shell = useRef<THREE.Group>(null!);
  const magnet = useRef<THREE.Mesh>(null!);
  const driver = useRef<THREE.Group>(null!);
  const fabric = useRef<THREE.Group>(null!);
  const cushion = useRef<THREE.Mesh>(null!);
  const isRight = side === 1;

  useFrame(() => {
    const e = sceneLive.explode;
    assembly.current.position.x = side * (YOKE_X + 0.42 * e);
    inner.current.position.x = side * (0.12 + 0.14 * e);
    plate.current.position.y = -0.012 - 0.58 * e;
    shell.current.position.y = -0.25 * e;
    magnet.current.position.y = 0.07 + 0.13 * e;
    driver.current.position.y = 0.33 * e;
    fabric.current.position.y = 0.236 + 0.58 * e;
    cushion.current.position.y = 0.275 + 0.8 * e;
  });

  // Angle (dans le plan de l'oreillette) qui pointe vers l'arrière-bas, pour les boutons.
  const detail = (theta: number, r = 0.432, y = 0.13) =>
    [Math.cos(theta) * r, y, Math.sin(theta) * r] as [number, number, number];
  const radial = (theta: number) => [0, -theta, -Math.PI / 2] as [number, number, number];

  return (
    <group ref={assembly} position={[side * YOKE_X, CUP_Y, 0]}>
      {/* Fourche */}
      <mesh geometry={geos.yoke} material={mats.metal} rotation={[0, Math.PI / 2, 0]} scale={[0.96, 1.12, 1]} />
      <mesh geometry={geos.pivot} material={mats.metal} position={[0, 0, 0.455]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={geos.pivot} material={mats.metal} position={[0, 0, -0.455]} rotation={[Math.PI / 2, 0, 0]} />
      <RoundedBox args={[0.07, 0.06, 0.1]} radius={0.018} smoothness={3} position={[0, 0.56, 0]} material={mats.metal} />

      {/* Oreillette : axe local Y orienté vers la tête */}
      <group ref={inner} position={[side * 0.12, 0, 0]} rotation={[0, 0, isRight ? Math.PI / 2 : -Math.PI / 2]}>
        <group scale={OVAL}>
          <group ref={plate} position={[0, -0.012, 0]}>
            <mesh geometry={geos.plate} material={mats.plate} />
            <mesh geometry={geos.logo} material={mats.accent} position={[0, -0.0125, 0]} rotation={[Math.PI / 2, 0, 0]} />
            {isRight && (
              <object3D ref={(o) => void (labelAnchors.plate = o)} position={[0.3, -0.012, 0]} />
            )}
          </group>

          <group ref={shell}>
            <mesh geometry={geos.shell} material={mats.shell} />
            {isRight ? (
              <>
                <mesh geometry={geos.button} material={mats.metal} position={detail(-2.2)} rotation={radial(-2.2)} />
                <mesh geometry={geos.button} material={mats.metal} position={detail(-2.55)} rotation={radial(-2.55)} />
                <mesh geometry={geos.led} material={mats.accent} position={detail(-1.85, 0.43, 0.12)} />
                <object3D ref={(o) => void (labelAnchors.shell = o)} position={[0.43, 0.12, 0]} />
              </>
            ) : (
              <mesh geometry={geos.port} material={mats.dark} position={detail(0, 0.425, 0.12)} />
            )}
          </group>

          <mesh geometry={geos.chamber} material={mats.dark} position={[0, 0.03, 0]} />
          <mesh ref={magnet} geometry={geos.magnet} material={mats.magnet} position={[0, 0.07, 0]} />

          <group ref={driver}>
            <mesh geometry={geos.frame} material={mats.metal} position={[0, 0.195, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <mesh geometry={geos.cone} material={mats.cone} position={[0, 0.1, 0]} />
            <mesh geometry={geos.cap} material={mats.accent} position={[0, 0.115, 0]} />
            {isRight && <object3D ref={(o) => void (labelAnchors.driver = o)} position={[0.2, 0.19, 0]} />}
          </group>

          <group ref={fabric} position={[0, 0.236, 0]}>
            <mesh geometry={geos.fabric} material={mats.fabric} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh
              geometry={geos.fabric}
              material={isRight ? mats.sideR : mats.sideL}
              position={[0, 0.001, 0]}
              rotation={[-Math.PI / 2, 0, isRight ? Math.PI / 2 : -Math.PI / 2]}
            />
          </group>

          <mesh
            ref={cushion}
            geometry={geos.cushion}
            material={mats.cushion}
            position={[0, 0.275, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1, 1, 0.75]}
          >
            {isRight && <object3D ref={(o) => void (labelAnchors.cushion = o)} position={[0.41, 0, 0]} />}
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Slider({ side, geos, mats }: { side: 1 | -1; geos: Geos; mats: Mats }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(() => {
    const e = sceneLive.explode;
    ref.current.position.set(side * (YOKE_X + 0.22 * e), -0.01 + 0.2 * e, 0);
  });
  return (
    <group ref={ref} position={[side * YOKE_X, -0.01, 0]}>
      <mesh geometry={geos.slider} material={mats.metal} position={[0, 0, 0.03]} />
      <mesh geometry={geos.slider} material={mats.metal} position={[0, 0, -0.03]} />
    </group>
  );
}

export default function Headphones() {
  const geos = useGeometries();
  const mats = useMaterials();
  const band = useRef<THREE.Group>(null!);
  const colorway = useSite((s) => s.colorway);

  const targets = useMemo(() => {
    const c = getColorway(colorway);
    return {
      shell: new THREE.Color(c.shell),
      band: new THREE.Color(c.band),
      metal: new THREE.Color(c.metal),
      cushion: new THREE.Color(c.cushion),
      accent: new THREE.Color(c.accent),
    };
  }, [colorway]);

  useEffect(
    () => () => {
      Object.values(geos).forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => {
        if ("map" in m && m.map) m.map.dispose();
        if ("bumpMap" in m && m.bumpMap) m.bumpMap.dispose();
        m.dispose();
      });
    },
    [geos, mats],
  );

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 5);
    mats.shell.color.lerp(targets.shell, k);
    mats.band.color.lerp(targets.band, k);
    mats.metal.color.lerp(targets.metal, k);
    mats.plate.color.lerp(targets.metal, k);
    mats.cushion.color.lerp(targets.cushion, k);
    mats.accent.color.lerp(targets.accent, k);
    mats.accent.emissive.lerp(targets.accent, k);
    band.current.position.y = 0.4 * sceneLive.explode;
  });

  return (
    <group>
      <group ref={band}>
        <mesh geometry={geos.band} material={mats.band} scale={[1, 1, 3.2]} />
        <mesh geometry={geos.pad} material={mats.cushion} scale={[1, 1, 2.2]} />
        <mesh geometry={geos.stitchA} material={mats.accent} />
        <mesh geometry={geos.stitchB} material={mats.accent} />
        <object3D ref={(o) => void (labelAnchors.band = o)} position={[0.32, BAND_CY + BAND_R * 0.94 + 0.02, 0]} />
      </group>
      <Slider side={1} geos={geos} mats={mats} />
      <Slider side={-1} geos={geos} mats={mats} />
      <Cup side={1} geos={geos} mats={mats} />
      <Cup side={-1} geos={geos} mats={mats} />
    </group>
  );
}
