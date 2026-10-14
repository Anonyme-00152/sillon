export const SITE = {
  name: "Sillon",
  product: "Sillon 01",
  price: "449 €",
  shipping: "Expéditions à partir de mars 2027",
  author: "Anonyme-00152",
  authorUrl: "https://github.com/Anonyme-00152",
  description:
    "Sillon 01 — casque à réduction de bruit hybride, transducteurs 40 mm, 60 h d'autonomie. Marque fictive, projet de portfolio.",
};

export const NAV = [
  { href: "/", label: "Produit" },
  { href: "/technologie", label: "Technologie" },
  { href: "/atelier", label: "Atelier" },
] as const;

export const SPECS: { group: string; items: [string, string][] }[] = [
  {
    group: "Acoustique",
    items: [
      ["Transducteurs", "40 mm, membrane biocellulose"],
      ["Réponse en fréquence", "4 Hz – 40 kHz"],
      ["Distorsion", "< 0,08 % à 94 dB SPL"],
      ["Impédance", "32 Ω"],
    ],
  },
  {
    group: "Réduction de bruit",
    items: [
      ["Architecture", "Hybride, 8 microphones"],
      ["Atténuation", "jusqu'à −42 dB"],
      ["Modes", "Silence · Transparence · Adaptatif"],
    ],
  },
  {
    group: "Batterie",
    items: [
      ["Autonomie", "60 h (40 h avec réduction de bruit)"],
      ["Charge rapide", "10 min = 6 h d'écoute"],
      ["Cellule", "Remplaçable, 1 200 cycles"],
    ],
  },
  {
    group: "Connectivité",
    items: [
      ["Bluetooth", "5.4, multipoint"],
      ["Codecs", "LDAC · aptX Adaptive · AAC · LC3"],
      ["Filaire", "USB-C audio 24 bits / 96 kHz"],
    ],
  },
  {
    group: "Fabrication",
    items: [
      ["Poids", "268 g"],
      ["Coque", "Aluminium 6061 recyclé, anodisé"],
      ["Coussins", "Cuir protéiné, mousse à mémoire"],
    ],
  },
];
