"use client";

import { create } from "zustand";
import type Lenis from "lenis";
import type { ColorwayId } from "./colorways";

type TransitionPhase = "idle" | "covering" | "revealing";

type SiteState = {
  colorway: ColorwayId;
  anc: boolean;
  sound: boolean;
  reducedMotion: boolean;
  sceneReady: boolean;
  introDone: boolean;
  webgl: "unknown" | "ok" | "fail";
  menuOpen: boolean;
  transition: TransitionPhase;
  lenis: Lenis | null;
  setColorway: (id: ColorwayId) => void;
  setAnc: (on: boolean) => void;
  setSound: (on: boolean) => void;
  setReducedMotion: (on: boolean) => void;
  setSceneReady: () => void;
  setIntroDone: () => void;
  setWebgl: (v: "ok" | "fail") => void;
  setMenuOpen: (open: boolean) => void;
  setTransition: (phase: TransitionPhase) => void;
  setLenis: (lenis: Lenis | null) => void;
};

export const useSite = create<SiteState>((set) => ({
  colorway: "graphite",
  anc: false,
  sound: false,
  reducedMotion: false,
  sceneReady: false,
  introDone: false,
  webgl: "unknown",
  menuOpen: false,
  transition: "idle",
  lenis: null,
  setColorway: (colorway) => set({ colorway }),
  setAnc: (anc) => set({ anc }),
  setSound: (sound) => set({ sound }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setSceneReady: () => set({ sceneReady: true }),
  setIntroDone: () => set({ introDone: true }),
  setWebgl: (webgl) => set({ webgl }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setTransition: (transition) => set({ transition }),
  setLenis: (lenis) => set({ lenis }),
}));
