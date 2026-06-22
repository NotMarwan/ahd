import { interpolate, spring, Easing } from "remotion";

/* ════════════════════════════════════════════════════════════════════════════
   ONE MOTION LANGUAGE — defined once, reused by every beat.
   Principles: nothing linear; entrances accelerate then settle with weight;
   nothing sits perfectly still (subtle continuous life); the data animates the
   *moment*, not the end-state.
   ════════════════════════════════════════════════════════════════════════════ */

/* Easings — out-expo settle is the signature; never linear. */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);      // confident settle (entrances)
export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1); // softer out-cubic
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);  // symmetric (loops, glows)
export const EASE_IN = Easing.bezier(0.5, 0, 0.75, 0);   // accelerate away (exits)

/* Spring configs — give motion physical weight. Lower damping ⇒ a little
   overshoot that "settles into place". */
export const SPRING = {
  soft: { damping: 200, mass: 1.1, stiffness: 90 },   // no overshoot — the device float/enter
  enter: { damping: 18, mass: 0.9, stiffness: 120 },  // slight overshoot — element reveals
  snap: { damping: 14, mass: 0.7, stiffness: 190 },   // snappy — chips, tiles landing
  pop: { damping: 11, mass: 0.6, stiffness: 210 },    // bigger overshoot — counters, the seal lock
} as const;

/* ── primitives ──────────────────────────────────────────────────────────── */

/** eased 0→1 over [start, start+dur] (clamped). */
export const ramp = (frame: number, start: number, dur = 22, easing = EASE) =>
  interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** eased 1→0 over [start, start+dur]. */
export const rampOut = (frame: number, start: number, dur = 16, easing = EASE_IN) =>
  interpolate(frame, [start, start + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** raw spring 0→1. */
export const spr = (frame: number, fps: number, delay = 0, cfg: object = SPRING.enter) =>
  spring({ frame: frame - delay, fps, config: cfg });

/** spring-driven "rise + fade" — the staple element reveal (settles with weight). */
export const sRise = (frame: number, fps: number, delay = 0, dist = 26, cfg: object = SPRING.enter): React.CSSProperties => {
  const t = spr(frame, fps, delay, cfg);
  return { opacity: interpolate(t, [0, 1], [0, 1], { extrapolateRight: "clamp" }), transform: `translateY(${(1 - t) * dist}px)` };
};

/** ease-driven rise (when a spring isn't wanted) — opacity + translateY. */
export const rise = (frame: number, start: number, dur = 22, dist = 18): React.CSSProperties => {
  const t = ramp(frame, start, dur);
  return { opacity: t, transform: `translateY(${(1 - t) * dist}px)` };
};

/** stagger: the delay (frames) for child i in a cascade. */
export const stag = (i: number, base = 0, step = 5) => base + i * step;

/** count a number up/down over [start, start+dur], eased. */
export const count = (frame: number, start: number, dur: number, from: number, to: number, easing = EASE) =>
  Math.round(interpolate(frame, [start, start + dur], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing }));

/** comma grouping — identical to the app engine's fmt(). */
export const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* ── continuous life — so nothing is ever dead-static ──────────────────────── */

/** a tiny perpetual breathe (scale ~±amt) keyed off frame; phase varies it per element. */
export const breathe = (frame: number, fps: number, amt = 0.006, hz = 0.5, phase = 0) =>
  1 + Math.sin((frame / fps) * hz * Math.PI * 2 + phase) * amt;

/** a slow vertical drift in px (parallax / float). */
export const drift = (frame: number, fps: number, amt = 4, hz = 0.45, phase = 0) =>
  Math.sin((frame / fps) * hz * Math.PI * 2 + phase) * amt;

/** a one-shot accent pulse 0→1→0. */
export const pulse = (frame: number, at: number, dur = 24) =>
  interpolate(frame, [at, at + dur / 2, at + dur], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IO });

/** a soft repeating glow 0..1 (for the ayah / kept-gold moments). */
export const glow = (frame: number, start: number, hz = 0.7) => {
  if (frame < start) return 0;
  return 0.5 + 0.5 * Math.sin(((frame - start) / 60) * hz * Math.PI * 2 - Math.PI / 2);
};

/* ── special moments ───────────────────────────────────────────────────────── */

/** decaying shake — px x-offset that rings out over `dur`. Used for the riba BLOCK. */
export const shake = (frame: number, at: number, dur = 26, mag = 9) => {
  if (frame < at || frame > at + dur) return 0;
  const t = (frame - at) / dur;            // 0→1
  return Math.sin(t * Math.PI * 7) * mag * (1 - t); // ring out
};

/** SVG draw progress 0→1 (eased) for line/stroke reveals. */
export const draw = (frame: number, start: number, dur = 18) => ramp(frame, start, dur, EASE_OUT);

/** clip-path inset for a kinetic reveal that wipes from the trailing (RTL: right) edge. */
export const clipR = (t: number) => `inset(0 0 0 ${(1 - t) * 100}%)`;
