"use client";

import dynamic from "next/dynamic";
import AnatomyLabels from "./AnatomyLabels";
import Curtain from "./Curtain";
import Preferences from "./Preferences";
import Preloader from "./Preloader";
import ScrollDirector from "./ScrollDirector";
import SmoothScroll from "./SmoothScroll";

// La scène WebGL n'est chargée que côté navigateur, après le premier rendu HTML.
const Stage = dynamic(() => import("@/components/three/Stage"), { ssr: false });

export default function ClientChrome() {
  return (
    <>
      <Preferences />
      <SmoothScroll />
      <ScrollDirector />
      <Stage />
      <AnatomyLabels />
      <Curtain />
      <Preloader />
    </>
  );
}
