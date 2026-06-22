import { loadFont as loadBody } from "@remotion/google-fonts/IBMPlexSansArabic";
import { loadFont as loadDisplay } from "@remotion/google-fonts/ReemKufi";

/* ── Fonts ───────────────────────────────────────────────────────────────────
   The app itself uses a system Arabic stack (Segoe UI / Noto Naskh), which a
   headless renderer can't be trusted to have. So we load two render-blocking
   web fonts via @remotion/google-fonts (correct shaping + joining in Chrome):
   • IBM Plex Sans Arabic — the body/UI spine (clean, modern, on-brand).
   • Reem Kufi — the «عهد» brand wordmark only (a confident, seal-like display). */
export const { fontFamily: AR } = loadBody("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
});
export const { fontFamily: AR_DISPLAY } = loadDisplay("normal", {
  weights: ["500", "600", "700"],
  subsets: ["arabic", "latin"],
});
export const MONO = `"IBM Plex Mono","Consolas",monospace`;

/* ── Composition ─────────────────────────────────────────────────────────── */
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/* PACE — the single speed dial. 1 = the snappy ~36s default.
   Raise (e.g. 1.12) to slow every beat + transition uniformly; lower to speed up. */
export const PACE = 1;
export const p = (frames: number) => Math.round(frames * PACE);

/* ── Palette — copied exactly from project/ahd-app/app.css :root ───────────── */
export const C = {
  bg: "#f7f4ee", ink: "#1c2b2a", mut: "#6b7a77", line: "#e6e0d4", card: "#fffdf8",
  teal: "#0e6b5c", tealSoft: "#e3f1ed", gold: "#9a7b27", goldSoft: "#f6efd9",
  amber: "#9a5a1e", amberSoft: "#f7e9d6", mute: "#5b6b78", muteSoft: "#eceef0",
  inkDark: "#10201e", inkDark2: "#163f37",
  // derived accents used only by the promo (never on a real screen)
  bad: "#a23b22", badSoft: "#fbe6e0", hairline: "#ecdfb5",
};

/* layered shadows — depth is what separates pro from flat */
/* The promo backdrop — intentionally a touch deeper/cooler than the app's cream
   screen (#f7f4ee) so the device always reads as a complete floating object with
   its shadow, never dissolving into the background where a screen is short. */
export const BACKDROP = "radial-gradient(130% 100% at 50% 26%, #f1eee8 0%, #e8e3d9 56%, #e1dbcf 100%)";

export const SHADOW = "0 1px 2px rgba(28,43,42,.06), 0 10px 26px rgba(28,43,42,.06)";
export const CARD_SHADOW = "0 1px 2px rgba(28,43,42,.05), 0 14px 34px rgba(28,43,42,.07)";
export const SOFT_SHADOW =
  "0 2px 6px rgba(16,32,30,.12), 0 18px 44px rgba(16,32,30,.20), 0 48px 110px rgba(16,32,30,.26)";

/* ── Per-beat durations (frames @ 60fps, before PACE) + transition overlap ───
   Heroes (create, settle) run longest; the middle beats are snappier than the
   first cut. The fast feel comes from dense, continuous motion + quick (26f)
   transitions — not from a short total. Retime one beat here, or the whole film
   via PACE above. Total auto-recomputes in Promo.tsx. */
export const DUR = {
  cold: 174,    // 2.9s  — brand assembles
  create: 444,  // 7.4s  — HERO: riba linter blocks live, then seals
  daftari: 270, // 4.5s  — tiles count, ledger cascades
  open: 282,    // 4.7s  — remaining drops, ayah glows
  circle: 288,  // 4.8s  — bar fills, members settle
  settle: 456,  // 7.6s  — CLIMAX: 9-IOU tangle collapses to 2
  close: 186,   // 3.1s  — wordmark + tagline, calm fade
  // ── NEW-features promo beats (the «ما الجديد» film) ──
  tl: 234,      // 3.9s  — witness timeline cascades in
  proof: 318,   // 5.3s  — HERO: hash computes, seal locks, tamper caught
  dispute: 234, // 3.9s  — record pauses, two dignified paths
  settings: 246, // 4.1s — digits morph ٠←0, «ما لا نفعله» reveals
};
export const TRANS = 26;
