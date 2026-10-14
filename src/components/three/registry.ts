import type { Object3D } from "three";

// Ponts entre la scène 3D et le DOM, sans passer par React à chaque image.

export type PartId = "band" | "cushion" | "driver" | "shell" | "plate";

/** dx / dy : décalage du texte de l'étiquette par rapport au point, en pixels. */
export const PARTS: { id: PartId; label: string; detail: string; dx: number; dy: number }[] = [
  { id: "band", label: "Arceau", detail: "Acier à ressort gainé de cuir", dx: 70, dy: -36 },
  { id: "plate", label: "Plaque sillonnée", detail: "Aluminium tourné, 212 sillons", dx: 56, dy: 96 },
  { id: "shell", label: "Coque", detail: "Aluminium 6061 usiné d'un bloc", dx: 72, dy: -78 },
  { id: "driver", label: "Transducteur", detail: "40 mm, membrane biocellulose", dx: -24, dy: 186 },
  { id: "cushion", label: "Coussin", detail: "Mousse à mémoire, cuir protéiné", dx: -64, dy: -104 },
];

/** Points d'ancrage 3D de chaque étiquette (renseignés par le casque). */
export const labelAnchors: Partial<Record<PartId, Object3D | null>> = {};

/** Éléments DOM des étiquettes (renseignés par AnatomyLabels). */
export const labelElements: Partial<Record<PartId, HTMLElement | null>> = {};

/** Position normalisée du pointeur (-1 → 1), lue par la scène pour la parallaxe. */
export const pointer = { x: 0, y: 0, active: false };
