/* ════════════════════════════════════════════════════════════════════════════
   SADU direction theme — copied exactly from application/prototypes/src/head.html
   :root (dir-b-sadu v3, THE base design per Marwan 2026-07-11).
   The promo stage uses the prototype's own dark stage (#131109) so the film
   reads as the Sadu prototype come alive.
   ════════════════════════════════════════════════════════════════════════════ */
export const S = {
  ground: "#efe9dc", card: "#ffffff", hair: "rgba(60,50,30,.12)",
  ink: "#1c1812", ink2: "#6d6353", ink3: "#6f6555",
  terra: "#a1442e", terraSoft: "#f4e2da",
  teal: "#177f6d", tealSoft: "#e3f0eb", tealText: "#116153",
  gold: "#a8863f", goldText: "#7a5f27", goldSoftBg: "#f3ead2",
  stop: "#7a2410", stopDeep: "#5e1a0a", stopSoft: "#f6e3da", stopLine: "#e0bcab",
  sealBg: "#221d16", sealInk: "#ece3d0", sealLbl: "#b3a789", sealHash: "#d8b978",
  auth: "#12312b", sandChip: "#e8e0cf", track: "#e2d7c0", icoSand: "#efe8d8",
  amber: "#8a3f14", amberSoft: "#f7e9d6",
  stage: "#131109", r: 14,
} as const;

/* the dark stage backdrop — a faint warm radial so the phone floats, not sinks */
export const SADU_BACKDROP =
  "radial-gradient(120% 90% at 50% 22%, #1d1910 0%, #131109 58%, #0d0b07 100%)";

/* the sadu band gradient (the signature weave) — identical layers to .sadu */
export const SADU_BAND =
  `repeating-linear-gradient(135deg, ${S.terra} 0 5px, transparent 5px 10px),` +
  `repeating-linear-gradient(45deg, ${S.ink} 0 5px, transparent 5px 10px),` +
  `${S.track}`;

/* Approved primary mark, checked in at promo/public/logo/ahd-mark.png. */
export const USE_LOGO_ASSET = true;

/* per-beat durations (frames @60fps, before PACE) — heroes run longest.
   v2 pacing (reference scout): 3s hook, beats 1.5-3s/idea, montage accelerates, calm close. */
export const SDUR = {
  cold: 190,    // 3.2s — emblem draws, band weaves (the hook)
  home: 240,    // 4.0s — hero screen assembles
  daftari: 300, // 5.0s — wallet: gauge + real rows + odometer amounts
  mine: 260,    // 4.3s — ما عليّ: pay-eased roll + amber grace
  create: 400,  // 6.7s — riba stop → seal ceremony (HERO)
  proof: 280,   // 4.7s — hash locks, tamper caught
  settle: 400,  // 6.7s — CLIMAX: named 9→2 + savings pill
  montage: 300, // 5.0s — 4 rapid screens (circle · سلفة · متى ما تيسر · المعروف)
  close: 190,   // 3.2s — calm close
};
