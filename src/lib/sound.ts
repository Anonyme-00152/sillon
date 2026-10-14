"use client";

// Sons d'interface synthétisés en direct (aucun fichier audio).
// Désactivés par défaut ; l'AudioContext n'est créé qu'après une action de l'utilisateur.

import { useSite } from "./store";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

export function getAudio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master! };
}

export function getNoiseBuffer(audio: AudioContext) {
  if (noiseBuffer) return noiseBuffer;
  const length = audio.sampleRate * 2;
  noiseBuffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

const enabled = () => useSite.getState().sound;

function blip(freqFrom: number, freqTo: number, duration: number, volume: number, type: OscillatorType = "sine", delay = 0) {
  const audio = getAudio();
  if (!audio) return;
  const { ctx: c, master: out } = audio;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqFrom, t);
  osc.frequency.exponentialRampToValueAtTime(freqTo, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export function playHover() {
  if (!enabled()) return;
  blip(2600, 1900, 0.05, 0.018);
}

export function playClick() {
  if (!enabled()) return;
  blip(900, 620, 0.08, 0.05, "triangle");
  blip(1800, 1500, 0.06, 0.02, "sine", 0.035);
}

export function playToggle(on: boolean) {
  if (!enabled()) return;
  if (on) {
    blip(660, 990, 0.09, 0.04, "triangle");
  } else {
    blip(990, 520, 0.09, 0.04, "triangle");
  }
}

export function playWhoosh() {
  if (!enabled()) return;
  const audio = getAudio();
  if (!audio) return;
  const { ctx: c, master: out } = audio;
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = getNoiseBuffer(c);
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.4;
  filter.frequency.setValueAtTime(260, t);
  filter.frequency.exponentialRampToValueAtTime(2600, t + 0.55);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.07, t + 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
  src.connect(filter).connect(gain).connect(out);
  src.start(t);
  src.stop(t + 0.75);
}
