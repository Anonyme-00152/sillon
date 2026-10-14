export type ColorwayId = "graphite" | "craie" | "argile" | "sauge";

export type Colorway = {
  id: ColorwayId;
  name: string;
  note: string;
  /** Pastille affichée dans le sélecteur */
  swatch: string;
  shell: string;
  band: string;
  metal: string;
  cushion: string;
  accent: string;
};

export const COLORWAYS: Colorway[] = [
  {
    id: "graphite",
    name: "Graphite",
    note: "Aluminium sablé, cuir noir fumé",
    swatch: "#2b2a28",
    shell: "#2b2a28",
    band: "#242321",
    metal: "#9a9893",
    cushion: "#1d1c1a",
    accent: "#ff6a2b",
  },
  {
    id: "craie",
    name: "Craie",
    note: "Aluminium perle, cuir grège",
    swatch: "#e4ddd0",
    shell: "#e7e1d5",
    band: "#d9d2c5",
    metal: "#bdb6aa",
    cushion: "#cbc2b2",
    accent: "#ff6a2b",
  },
  {
    id: "argile",
    name: "Argile",
    note: "Anodisation terre cuite, laiton brossé",
    swatch: "#a9502f",
    shell: "#a9502f",
    band: "#8e4227",
    metal: "#d6c3a5",
    cushion: "#3b2a22",
    accent: "#f2e4cf",
  },
  {
    id: "sauge",
    name: "Sauge",
    note: "Anodisation vert-de-gris, acier satiné",
    swatch: "#7f8c78",
    shell: "#7f8c78",
    band: "#6e7a68",
    metal: "#c9cbc4",
    cushion: "#3f463c",
    accent: "#efe8d8",
  },
];

export const getColorway = (id: ColorwayId) =>
  COLORWAYS.find((c) => c.id === id) ?? COLORWAYS[0];
