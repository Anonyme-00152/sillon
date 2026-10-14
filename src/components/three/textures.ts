import * as THREE from "three";

// Textures procédurales dessinées dans un canvas : aucun fichier image à charger.

/** Sillons concentriques pour la plaque extérieure (bump + rugosité). */
export function makeGrooveTexture(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  const c = size / 2;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, size, size);
  for (let r = 4; r < c; r += 1.6) {
    const shade = 112 + Math.round(Math.sin(r * 0.9) * 22 + (Math.random() - 0.5) * 18);
    g.strokeStyle = `rgb(${shade},${shade},${shade})`;
    g.lineWidth = 1;
    g.beginPath();
    g.arc(c, c, r, 0, Math.PI * 2);
    g.stroke();
  }
  // Anneau plein autour du logo
  g.fillStyle = "#6a6a6a";
  g.beginPath();
  g.arc(c, c, size * 0.06, 0, Math.PI * 2);
  g.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

/** Tissage fin pour le tissu acoustique. */
export function makeWovenTexture(size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  g.fillStyle = "#6f6f6f";
  g.fillRect(0, 0, size, size);
  const step = 4;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const odd = (x / step + y / step) % 2 === 0;
      const v = odd ? 150 : 95;
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(x, y, odd ? step : step - 1, odd ? step - 1 : step);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = 4;
  return tex;
}

/** Lettre L / R imprimée au centre du tissu acoustique. */
export function makeSideTexture(letter: "L" | "R", size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  g.clearRect(0, 0, size, size);
  g.fillStyle = "rgba(238,232,221,0.55)";
  g.font = `500 ${size * 0.11}px ui-monospace, monospace`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(letter, size / 2, size / 2);
  g.strokeStyle = "rgba(238,232,221,0.35)";
  g.lineWidth = size * 0.006;
  g.beginPath();
  g.arc(size / 2, size / 2, size * 0.1, 0, Math.PI * 2);
  g.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
