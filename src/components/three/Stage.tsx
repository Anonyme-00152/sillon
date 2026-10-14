"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useSite } from "@/lib/store";
import { sceneLive } from "@/lib/scenes";
import Rig from "./Rig";
import { PARTS, labelAnchors, labelElements, pointer } from "./registry";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Signale que la scène est compilée et a rendu ses premières images. */
function ReadySignal() {
  const { gl, scene, camera } = useThree();
  const frames = useRef(0);
  const done = useRef(false);
  useEffect(() => {
    gl.compile(scene, camera);
  }, [gl, scene, camera]);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 2) {
      done.current = true;
      useSite.getState().setSceneReady();
    }
  });
  return null;
}

/** Projette les ancres 3D sur l'écran et place les étiquettes DOM. */
function LabelProjector() {
  const v = useRef(new THREE.Vector3());
  useFrame(({ camera, size }) => {
    const opacity = Math.min(sceneLive.labels, sceneLive.explode);
    for (const { id } of PARTS) {
      const el = labelElements[id];
      const anchor = labelAnchors[id];
      if (!el || !anchor) continue;
      if (opacity < 0.02) {
        if (el.style.opacity !== "0") el.style.opacity = "0";
        continue;
      }
      anchor.getWorldPosition(v.current).project(camera);
      const x = (v.current.x * 0.5 + 0.5) * size.width;
      const y = (-v.current.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = opacity.toFixed(3);
    }
  });
  return null;
}

function Fallback() {
  return (
    <div className="absolute inset-0 grid place-items-center opacity-60">
      <div className="size-[42vmin] rounded-full border border-line-strong" />
    </div>
  );
}

export default function Stage() {
  const setWebgl = useSite((s) => s.setWebgl);
  const [supported] = useState(hasWebGL);
  const [dpr, setDpr] = useState(1.5);
  const maxDpr = useRef(1.75);

  useEffect(() => {
    setWebgl(supported ? "ok" : "fail");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    maxDpr.current = coarse ? 1.5 : 1.75;
    setDpr(Math.min(window.devicePixelRatio || 1, maxDpr.current));

    if (coarse) return;
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.active = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [supported, setWebgl]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {supported ? (
        <Canvas
          dpr={dpr}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 5], fov: 30, near: 0.1, far: 50 }}
          fallback={<Fallback />}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr(1)}
            onIncline={() => setDpr(Math.min(window.devicePixelRatio || 1, maxDpr.current))}
          />
          <ambientLight intensity={0.3} />
          <directionalLight position={[3, 4, 5]} intensity={1.7} />
          <directionalLight position={[-4, 1.5, -3]} intensity={1.1} color="#ffd2b8" />
          <directionalLight position={[0, -3, 2]} intensity={0.35} color="#b8c4ff" />
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={2.6} position={[0, 3.2, 2]} rotation-x={Math.PI / 2} scale={[7, 1.4, 1]} />
            <Lightformer form="rect" intensity={1.8} position={[-4.5, 0.6, 1]} rotation-y={Math.PI / 2} scale={[5, 1.6, 1]} />
            <Lightformer
              form="rect"
              intensity={1.4}
              position={[4.5, 0, 1]}
              rotation-y={-Math.PI / 2}
              scale={[5, 1.6, 1]}
              color="#ffe1cc"
            />
            <Lightformer form="ring" intensity={0.9} position={[0, 0, -6]} scale={4} />
            <Lightformer form="rect" intensity={0.6} position={[0, -3, 0]} rotation-x={-Math.PI / 2} scale={[6, 6, 1]} />
          </Environment>
          <Rig />
          <LabelProjector />
          <ReadySignal />
        </Canvas>
      ) : (
        <Fallback />
      )}
    </div>
  );
}
