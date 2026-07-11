import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { AR, MONO, SOFT_SHADOW } from "../theme";
import { S, SADU_BAND, USE_LOGO_ASSET } from "../sadu";
import { spr, draw, SPRING } from "../motion";

/* ── the sadu band — THE transition object: appears in every beat ─────────── */
export const SaduBand: React.FC<{ t?: number; h?: number; style?: React.CSSProperties }> = ({ t = 1, h = 8, style }) => (
  <div style={{ height: h, borderRadius: 2.5, overflow: "hidden", background: S.track, ...style }}>
    <div style={{ width: "100%", height: "100%", background: SADU_BAND, clipPath: `inset(0 ${(1 - t) * 100}% 0 0)` }} />
  </div>
);

/* ── the octagonal «عهد» emblem — strokes draw in (SVG dash reveal) ────────── */
export const Emblem: React.FC<{ size?: number; drawT?: number; textT?: number; dark?: boolean }> = ({ size = 40, drawT = 1, textT = 1, dark = false }) => {
  const dash = 120;
  if (USE_LOGO_ASSET) {
    return <Img src={staticFile("logo/ahd-mark.png")} style={{ width: size, height: size, display: "block", opacity: Math.max(drawT, textT) }} />;
  }
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: "block" }}>
      <polygon points="20,3 32,8 37,20 32,32 20,37 8,32 3,20 8,8" fill="none"
        stroke={S.gold} strokeWidth={1.1} strokeDasharray={dash} strokeDashoffset={(1 - drawT) * dash} />
      <polygon points="20,7 29,11 33,20 29,29 20,33 11,29 7,20 11,11" fill="none"
        stroke={dark ? S.sealHash : S.auth} strokeWidth={0.75} opacity={0.6 * drawT}
        strokeDasharray={dash} strokeDashoffset={(1 - drawT) * dash} />
      <text x={20} y={21} fontSize={12.5} fontWeight={800} fill={dark ? S.sealInk : S.auth}
        textAnchor="middle" dominantBaseline="middle" opacity={textT} fontFamily={AR}>عهد</text>
    </svg>
  );
};

/* ── the Sadu device — dark bezel, island, warm ground screen. Persists across
      beats: screens change INSIDE it (spatial continuity). ─────────────────── */
export const PHONE_W = 660;
export const PHONE_H = 1370;
/* v2: STATIC device (operator feedback — float read as jitter). One spring
   entrance (~45f), then the transform is CONSTANT: screens move, device never. */
export const SaduPhone: React.FC<{ children: React.ReactNode; enterDelay?: number; top?: number }> = ({ children, enterDelay = 0, top = 250 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = Math.min(1, spr(frame, fps, enterDelay, SPRING.soft));
  return (
    <div style={{
      position: "absolute", left: "50%", top, width: PHONE_W, height: PHONE_H,
      opacity: enter,
      transform: `translateX(-50%) translateY(${(1 - enter) * 60}px) scale(${0.93 + enter * 0.07})`,
      transformOrigin: "center top",
    }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 58, boxShadow: SOFT_SHADOW }} />
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 58, background: "#0d0b08", padding: 12, boxShadow: "inset 0 0 0 2px #2b241b" }}>
        <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", width: 150, height: 34, background: "#0d0b08", borderRadius: 999, zIndex: 8 }} />
        <div style={{ width: "100%", height: "100%", borderRadius: 47, background: S.ground, overflow: "hidden", position: "relative", direction: "rtl", fontFamily: AR, color: S.ink }}>
          {children}
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", width: 160, height: 7, borderRadius: 999, background: "rgba(28,24,18,.28)", zIndex: 9 }} />
        </div>
      </div>
    </div>
  );
};

/* ── large-title header (nav-lg) with animated band + rising title ─────────── */
/* v2 header — explicit flex column, three clean rows (emblem / eyebrow / title):
   no negative margins, no absolute positioning, zero collision (operator's red circle). */
export const NavLg: React.FC<{ eyebrow: string; title: string; sub?: string; base?: number }> = ({ eyebrow, title, sub, base = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tEye = spr(frame, fps, base, SPRING.enter);
  const tTit = spr(frame, fps, base + 5, SPRING.enter);
  const tBand = draw(frame, base + 12, 26);
  const tSub = spr(frame, fps, base + 18, SPRING.enter);
  return (
    <div style={{ padding: "70px 34px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ opacity: tEye }}><Emblem size={54} drawT={tEye} textT={tEye} /></div>
      <div style={{ fontSize: 20, fontWeight: 600, color: S.ink3, lineHeight: 1.4, opacity: tEye, transform: `translateY(${(1 - tEye) * 14}px)` }}>{eyebrow}</div>
      <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.25, opacity: tTit, transform: `translateY(${(1 - tTit) * 20}px)` }}>{title}</div>
      <SaduBand t={tBand} h={12} style={{ marginTop: 4 }} />
      {sub ? <div style={{ fontSize: 20, color: S.ink2, marginTop: 4, lineHeight: 1.8, opacity: tSub, transform: `translateY(${(1 - tSub) * 12}px)` }}>{sub}</div> : null}
    </div>
  );
};

/* ── inset-grouped cell (the iOS list row) ─────────────────────────────────── */
export const Cell: React.FC<{ ico: string; icoBg?: string; t: string; s: string; first?: boolean }> = ({ ico, icoBg = S.terraSoft, t, s, first }) => (
  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center", minHeight: 78, padding: "14px 22px", position: "relative", borderTop: first ? "none" : `1px solid ${S.hair}` }}>
    <span style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, background: icoBg }}>{ico}</span>
    <span><span style={{ fontWeight: 600, fontSize: 23 }}>{t}<span style={{ display: "block", color: S.ink2, fontSize: 17, fontWeight: 400, marginTop: 2 }}>{s}</span></span></span>
    <span style={{ color: S.ink3, fontSize: 24, paddingBottom: 3 }}>‹</span>
  </div>
);

/* ── group container ───────────────────────────────────────────────────────── */
export const Group: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: S.card, borderRadius: S.r, overflow: "hidden", boxShadow: "0 1px 2px rgba(28,24,18,.05)", ...style }}>{children}</div>
);

/* ── the sealed dark document ──────────────────────────────────────────────── */
export const SealDoc: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: S.sealBg, color: S.sealInk, borderRadius: S.r, padding: 24, ...style }}>{children}</div>
);

/* ── monospace hash line (LTR inside RTL) ──────────────────────────────────── */
export const Hash: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div style={{ fontFamily: MONO, direction: "ltr", textAlign: "left", fontSize: 15, color: S.sealHash, wordBreak: "break-all", background: "rgba(0,0,0,.3)", borderRadius: 9, padding: "13px 15px", letterSpacing: 0.5, ...style }}>{text}</div>
);

/* ── big beat caption under/over the phone (stage text) ────────────────────── */
/* v2: fixed top band (64..214 — inside the top 12% safe zone); the phone starts
   at top:250, so caption and device can never collide. Holds >= 2s by beat design. */
export const StageCaption: React.FC<{ k: string; title: string; base?: number }> = ({ k, title, base = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tK = spr(frame, fps, base, SPRING.enter);
  const tT = spr(frame, fps, base + 6, SPRING.enter);
  return (
    <div style={{ position: "absolute", top: 64, height: 150, left: 40, right: 40, textAlign: "center", direction: "rtl", fontFamily: AR, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
      <div style={{ fontSize: 22, letterSpacing: 6, color: "#c9a688", fontWeight: 600, opacity: tK }}>{k}</div>
      <div style={{ fontSize: 46, fontWeight: 800, color: "#f3e7cf", lineHeight: 1.3, opacity: tT, transform: `translateY(${(1 - tT) * 18}px)` }}>{title}</div>
    </div>
  );
};

/* deterministic pseudo-hash text (scramble→settle by progress 0..1) */
const HEX = "0123456789abcdef";
export const scrambleHash = (final: string, t: number, frame: number) => {
  const settled = Math.floor(final.length * t);
  let out = "";
  for (let i = 0; i < final.length; i++) {
    if (i < settled) out += final[i];
    else out += HEX[(i * 7 + frame * 3 + i * i) % 16];
  }
  return out;
};

export const easedT = (v: number) => interpolate(v, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
