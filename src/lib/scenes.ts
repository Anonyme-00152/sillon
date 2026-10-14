// États de la scène 3D, associés aux sections via l'attribut data-scene.
// Le ScrollDirector interpole entre deux états selon la position de scroll ;
// la scène amortit ensuite ces valeurs à chaque image.
//
// Repères (écran 16:10, caméra à z = 5) : x ≈ ±1 place le casque dans la moitié
// gauche ou droite de l'écran, à côté d'une colonne de texte.

export type Vec3 = [number, number, number];

export type SceneState = {
  pos: Vec3;
  rot: Vec3;
  scale: number;
  /** 0 = casque assemblé, 1 = vue éclatée */
  explode: number;
  /** intensité des ondes sonores autour du casque */
  rings: number;
  /** vitesse de rotation continue (tours / 10 s) */
  spin: number;
  /** affiche les étiquettes de la vue éclatée */
  labels: number;
  /** surcharge pour les écrans en portrait */
  portrait?: { pos?: Vec3; rot?: Vec3; scale?: number };
};

const base: SceneState = {
  pos: [0, 0, 0],
  rot: [0.12, -0.55, 0],
  scale: 0.82,
  explode: 0,
  rings: 0,
  spin: 0,
  labels: 0,
};

const s = (patch: Partial<SceneState>): SceneState => ({ ...base, ...patch });

/** En portrait : casque réduit dans le haut de l'écran, au-dessus du texte. */
const TOP = { pos: [0, 0.66, 0] as Vec3, scale: 0.38 };

/** Casque à gauche, texte à droite */
const left = (patch: Partial<SceneState> = {}) =>
  s({ pos: [-1.02, -0.04, 0], rot: [0.1, 0.6, -0.02], scale: 0.76, portrait: TOP, ...patch });

/** Casque à droite, texte à gauche */
const right = (patch: Partial<SceneState> = {}) =>
  s({ pos: [1.0, -0.02, 0], rot: [0.1, -0.5, 0.02], scale: 0.76, portrait: TOP, ...patch });

/** Casque rangé hors champ (sections pleine largeur) */
const parked = (patch: Partial<SceneState> = {}) =>
  s({ pos: [1.7, -2.6, -0.4], rot: [0.5, -1.4, 0.2], scale: 0.5, spin: 0.5, portrait: { pos: [0.8, -2.4, -0.4], scale: 0.4 }, ...patch });

/** Vue éclatée, avec étiquettes */
const exploded = (patch: Partial<SceneState> = {}) =>
  s({
    pos: [-0.22, -0.02, 0],
    rot: [0.22, -0.78, 0.03],
    scale: 0.7,
    explode: 1,
    labels: 1,
    portrait: { pos: [0, -0.52, 0], rot: [0.3, -1.15, 0], scale: 0.36 },
    ...patch,
  });

export const SCENES: Record<string, SceneState> = {
  // Accueil
  "home-hero": s({
    pos: [0.66, 0.02, 0],
    rot: [0.16, -0.62, 0.04],
    scale: 0.84,
    portrait: { pos: [0, 0.44, 0], scale: 0.5 },
  }),
  "home-design": left({ rot: [0.04, 0.95, -0.04], scale: 0.8 }),
  "home-anatomy": exploded(),
  "home-silence": right({ rot: [0.08, -0.35, 0], scale: 0.72, rings: 1 }),
  "home-finish": left({ rot: [0.12, 0.55, 0.02] }),
  "home-battery": right({ pos: [1.05, -0.06, 0], rot: [0.3, -2.45, 0.08], scale: 0.72 }),
  "home-specs": parked(),
  "home-cta": s({
    pos: [0, 0.64, 0],
    rot: [0.14, 0, 0],
    scale: 0.44,
    spin: 1,
    portrait: { pos: [0, 0.68, 0], scale: 0.38 },
  }),

  // Technologie
  "tech-hero": right({ pos: [0.82, 0, 0], rot: [0.18, -1.3, 0], scale: 0.78, explode: 0.35, portrait: { pos: [0, 0.62, 0], scale: 0.42 } }),
  "tech-driver": exploded({ pos: [-1.12, 0, 0], scale: 0.56, labels: 0, portrait: { pos: [0, 0.66, 0], rot: [0.3, -1.15, 0], scale: 0.34 } }),
  "tech-anc": right({ rot: [0.08, -0.25, 0], scale: 0.72, rings: 1 }),
  "tech-battery": left({ rot: [0.28, 2.6, -0.06], scale: 0.74 }),
  "tech-materials": right({ pos: [1.05, 0, 0], rot: [-0.25, -0.75, 0.15], scale: 0.74 }),
  "tech-specs": parked(),

  // Atelier
  "atelier-hero": right({ pos: [0.98, 0.02, 0], rot: [0.1, -2.2, 0], scale: 0.72, spin: 0.25 }),
  "atelier-process": left({ rot: [0.16, 0.7, 0], scale: 0.74 }),
  "atelier-repair": right({ pos: [1.0, 0, 0], rot: [0.24, -0.9, 0], scale: 0.56, explode: 0.75, portrait: { pos: [0, 0.66, 0], scale: 0.34 } }),
  "atelier-values": parked(),

  // Précommande
  "order-hero": left({ pos: [-1.0, 0, 0], rot: [0.14, 0.6, 0.02], scale: 0.8, portrait: { pos: [0, 0.66, 0], scale: 0.4 } }),

  // Pied de page : le casque sort par le haut
  outro: s({ pos: [0, 2.6, -0.5], rot: [0.3, 0.6, 0], scale: 0.42, spin: 1, portrait: { pos: [0, 2.4, -0.5], scale: 0.4 } }),

  // 404
  lost: s({
    pos: [0, 0.55, 0],
    rot: [0.6, 0.4, 0.9],
    scale: 0.52,
    explode: 0.6,
    spin: 0.4,
    portrait: { pos: [0, 0.62, 0], scale: 0.36 },
  }),
};

export const DEFAULT_SCENE = SCENES["home-hero"];

/** Cible courante, écrite par le ScrollDirector et lue par la scène. */
export const sceneTarget: SceneState = structuredClone(DEFAULT_SCENE);

/** Valeurs amorties réellement affichées (lues par les étiquettes et les ondes). */
export const sceneLive = { explode: 0, labels: 0, rings: 0 };
