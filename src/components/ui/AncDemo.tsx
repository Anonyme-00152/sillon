"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/store";
import { getAudio, getNoiseBuffer } from "@/lib/sound";

// Démo interactive de la réduction de bruit : une ambiance de ville synthétisée
// (bruit brun + brouhaha filtré) recouvre un accord doux. Activer la réduction
// de bruit filtre l'ambiance et laisse la musique au premier plan.

type Graph = {
  ctx: AudioContext;
  out: GainNode;
  analyser: AnalyserNode;
  ancFilter: BiquadFilterNode;
  noiseGain: GainNode;
  sources: AudioScheduledSourceNode[];
  chordTimer: number;
};

const CHORDS = [
  [220, 277.18, 329.63],
  [185, 220, 277.18],
  [146.83, 220, 293.66],
  [164.81, 246.94, 329.63],
];

function makeBrownNoise(ctx: AudioContext) {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

export default function AncDemo() {
  const anc = useSite((s) => s.anc);
  const setAnc = useSite((s) => s.setAnc);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const graph = useRef<Graph | null>(null);

  const stop = useCallback(() => {
    const g = graph.current;
    if (!g) return;
    graph.current = null;
    const now = g.ctx.currentTime;
    g.out.gain.cancelScheduledValues(now);
    g.out.gain.setTargetAtTime(0, now, 0.08);
    clearInterval(g.chordTimer);
    window.setTimeout(() => {
      g.sources.forEach((s) => {
        try {
          s.stop();
        } catch {}
      });
      g.out.disconnect();
    }, 400);
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;
    const { ctx } = audio;
    const now = ctx.currentTime;
    const ancOn = useSite.getState().anc;

    const out = ctx.createGain();
    out.gain.value = 0;
    out.connect(ctx.destination);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.connect(out);
    const mix = ctx.createGain();
    mix.connect(analyser);

    // Ambiance urbaine
    const brown = ctx.createBufferSource();
    brown.buffer = makeBrownNoise(ctx);
    brown.loop = true;
    const rumble = ctx.createBiquadFilter();
    rumble.type = "lowpass";
    rumble.frequency.value = 900;
    const white = ctx.createBufferSource();
    white.buffer = getNoiseBuffer(ctx);
    white.loop = true;
    const chatter = ctx.createBiquadFilter();
    chatter.type = "bandpass";
    chatter.frequency.value = 850;
    chatter.Q.value = 0.9;
    const chatterGain = ctx.createGain();
    chatterGain.gain.value = 0.1;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.27;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 0.07;
    lfo.connect(lfoDepth).connect(chatterGain.gain);

    const ancFilter = ctx.createBiquadFilter();
    ancFilter.type = "lowpass";
    ancFilter.frequency.value = ancOn ? 200 : 16000;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = ancOn ? 0.06 : 0.9;
    brown.connect(rumble).connect(ancFilter);
    white.connect(chatter).connect(chatterGain).connect(ancFilter);
    ancFilter.connect(noiseGain).connect(mix);

    // Accord doux qui change toutes les 3,2 s
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 1800;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.05;
    padFilter.connect(padGain).connect(mix);
    const oscs = CHORDS[0].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? "triangle" : "sine";
      o.frequency.value = f;
      o.detune.value = (i - 1) * 4;
      o.connect(padFilter);
      return o;
    });
    let step = 0;
    const chordTimer = window.setInterval(() => {
      step = (step + 1) % CHORDS.length;
      const t = ctx.currentTime;
      oscs.forEach((o, i) => o.frequency.setTargetAtTime(CHORDS[step][i], t, 0.25));
    }, 3200);

    const sources: AudioScheduledSourceNode[] = [brown, white, lfo, ...oscs];
    sources.forEach((s) => s.start(now));
    out.gain.setTargetAtTime(0.32, now, 0.15);

    graph.current = { ctx, out, analyser, ancFilter, noiseGain, sources, chordTimer };
    setPlaying(true);
  }, []);

  // Bascule de la réduction de bruit pendant la lecture
  useEffect(() => {
    const g = graph.current;
    if (!g) return;
    const t = g.ctx.currentTime;
    g.ancFilter.frequency.setTargetAtTime(anc ? 200 : 16000, t, 0.16);
    g.noiseGain.gain.setTargetAtTime(anc ? 0.06 : 0.9, t, 0.16);
  }, [anc]);

  // Visualisation + arrêt automatique quand la démo sort de l'écran
  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const g2d = cv.getContext("2d");
    if (!g2d) return;
    let visible = false;
    let raf = 0;
    let amp = useSite.getState().anc ? 0.08 : 0.7;
    let time = 0;
    let last = performance.now();
    const samples = new Float32Array(1024);

    const draw = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const { anc: ancOn, reducedMotion } = useSite.getState();
      if (!reducedMotion) time += dt;
      amp += ((ancOn ? 0.07 : 0.7) - amp) * Math.min(1, dt * 5);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (cv.width !== Math.round(w * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      g2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      g2d.clearRect(0, 0, w, h);
      const styles = getComputedStyle(el);
      g2d.strokeStyle = styles.getPropertyValue("--line").trim() || "rgba(128,128,128,.2)";
      g2d.lineWidth = 1;
      g2d.beginPath();
      g2d.moveTo(0, h / 2);
      g2d.lineTo(w, h / 2);
      g2d.stroke();

      g2d.strokeStyle = styles.getPropertyValue("--accent").trim() || "#ff6a2b";
      g2d.lineWidth = 1.6;
      g2d.beginPath();
      const live = graph.current;
      if (live) live.analyser.getFloatTimeDomainData(samples);
      const n = 220;
      for (let i = 0; i <= n; i++) {
        const x = (i / n) * w;
        let v: number;
        if (live) {
          v = samples[Math.floor((i / n) * (samples.length - 1))] * 1.6;
        } else {
          const p = i / n;
          v =
            (Math.sin(p * 18 + time * 3.1) * 0.5 +
              Math.sin(p * 47 - time * 5.3) * 0.3 +
              Math.sin(p * 93 + time * 8.7) * 0.2) *
            amp;
        }
        const y = h / 2 - Math.max(-1, Math.min(1, v)) * (h / 2 - 4);
        if (i === 0) g2d.moveTo(x, y);
        else g2d.lineTo(x, y);
      }
      g2d.stroke();
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
      if (!visible && graph.current) stop();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stop]);

  useEffect(() => stop, [stop]);

  return (
    <div ref={root} className="rounded-2xl border border-line bg-surface p-4 backdrop-blur-md sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          data-sound="off"
          aria-pressed={playing}
          onClick={() => (playing ? stop() : start())}
          className="btn btn-ghost btn-sm"
        >
          <span aria-hidden="true" className="mono text-xs">
            {playing ? "■" : "▶"}
          </span>
          {playing ? "Arrêter la démo" : "Écouter la démo"}
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={anc}
          onClick={() => setAnc(!anc)}
          className="inline-flex items-center gap-3 text-sm font-medium"
        >
          <span className="switch" aria-hidden="true" />
          Réduction de bruit
        </button>
      </div>
      <canvas ref={canvas} className="mt-4 block h-24 w-full" aria-hidden="true" />
      <div className="mono mt-3 flex flex-wrap justify-between gap-2 text-[0.7rem] uppercase tracking-[0.12em] text-muted">
        <span>
          Bruit ambiant <span className="text-fg">{anc ? "−42 dB" : "0 dB"}</span>
        </span>
        <span>Son synthétisé en direct · volume modéré</span>
      </div>
      <p className="sr-only" aria-live="polite">
        {anc ? "Réduction de bruit activée." : "Réduction de bruit désactivée."}
      </p>
    </div>
  );
}
