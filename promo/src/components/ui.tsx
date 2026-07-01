import React from "react";
import { C, SHADOW, CARD_SHADOW, AR, MONO } from "../theme";

/* App UI primitives — ported from app/app.css, sized up for 1080-wide
   video. These render INSIDE the phone screen (≈660px wide). Palette is exact. */

export const chipColors: Record<string, { bg: string; fg: string; bd?: string }> = {
  teal: { bg: C.tealSoft, fg: C.teal },
  gold: { bg: C.goldSoft, fg: C.gold, bd: C.hairline },
  amber: { bg: C.amberSoft, fg: C.amber },
  mute: { bg: C.muteSoft, fg: C.mute },
};

export const Chip: React.FC<{ kind: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ kind, children, style }) => {
  const c = chipColors[kind] || chipColors.mute;
  return (
    <span style={{ background: c.bg, color: c.fg, border: c.bd ? `1px solid ${c.bd}` : undefined, fontSize: 20, padding: "6px 16px", borderRadius: 999, whiteSpace: "nowrap", fontWeight: 600, ...style }}>
      {children}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 26, boxShadow: CARD_SHADOW, padding: 22, ...style }}>{children}</div>
);

export const Avatar: React.FC<{ name: string; tone?: string; style?: React.CSSProperties }> = ({ name, tone = "teal", style }) => {
  const c = chipColors[tone] || chipColors.teal;
  return (
    <span style={{ width: 60, height: 60, flex: "0 0 60px", borderRadius: "50%", background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 26, ...style }}>
      {String(name).slice(0, 1)}
    </span>
  );
};

export const Tile: React.FC<{ label: string; value: React.ReactNode; sub?: string; style?: React.CSSProperties }> = ({ label, value, sub, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 24, boxShadow: CARD_SHADOW, padding: 22, flex: 1, ...style }}>
    <div style={{ color: C.mut, fontSize: 22 }}>{label}</div>
    <div style={{ fontSize: 44, fontWeight: 700, marginTop: 4, color: C.ink, letterSpacing: -0.5 }}>{value} <span style={{ fontSize: 22, fontWeight: 400, color: C.mut }}>ر.س</span></div>
    {sub ? <div style={{ color: C.mut, fontSize: 19, marginTop: 4 }}>{sub}</div> : null}
  </div>
);

export const Btn: React.FC<{ children: React.ReactNode; tone?: "teal" | "gold" | "ghost" | "disabled"; style?: React.CSSProperties }> = ({ children, tone = "teal", style }) => {
  const map: Record<string, React.CSSProperties> = {
    teal: { background: C.teal, color: "#fff", border: 0, boxShadow: "0 8px 20px rgba(14,107,92,.22)" },
    gold: { background: C.goldSoft, color: C.gold, border: `1px solid ${C.gold}` },
    ghost: { background: "#fff", color: C.ink, border: `1px solid ${C.line}` },
    disabled: { background: "#b8c6c2", color: "#eef3f1", border: 0 },
  };
  return (
    <div style={{ borderRadius: 18, padding: "18px 22px", fontWeight: 600, fontSize: 26, textAlign: "center", ...map[tone], ...style }}>{children}</div>
  );
};

export const Bar: React.FC<{ pct: number; style?: React.CSSProperties }> = ({ pct, style }) => (
  <div style={{ height: 16, background: C.muteSoft, borderRadius: 999, overflow: "hidden", ...style }}>
    <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, pct))}%`, background: `linear-gradient(90deg, ${C.inkDark2}, ${C.teal})`, borderRadius: 999 }} />
  </div>
);

/* the app's top nav — text-only pills (render-safe; no emoji), active one teal.
   RTL container ⇒ items flow right→left with the home pill at the right. */
export const Nav: React.FC<{ active: string }> = ({ active }) => {
  const items = [
    { k: "home", t: "الرئيسية" }, { k: "create", t: "أنشئ عهداً" }, { k: "daftari", t: "دفتري" },
    { k: "timeline", t: "السجلّ" }, { k: "open", t: "القرض المفتوح" }, { k: "circle", t: "الدائرة" }, { k: "settle", t: "المقاصّة" },
  ];
  return (
    <div style={{ display: "flex", gap: 9, justifyContent: "flex-start", padding: "4px 0 16px", overflow: "hidden", maskImage: "linear-gradient(90deg, transparent 0, #000 28px)" }}>
      {items.map((it) => {
        const on = it.k === active;
        return (
          <div key={it.k} style={{ flex: "0 0 auto", border: `1px solid ${on ? C.teal : C.line}`, background: on ? C.teal : C.card, color: on ? "#fff" : C.ink, borderRadius: 999, padding: "9px 16px", fontSize: 19, fontWeight: on ? 700 : 500, boxShadow: on ? "0 6px 16px rgba(14,107,92,.20)" : "none", whiteSpace: "nowrap" }}>{it.t}</div>
        );
      })}
    </div>
  );
};

/* the dark "sealed record" panel (matches .ol-seal / create seal). */
export const SealPanel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: `linear-gradient(155deg, ${C.inkDark2}, ${C.inkDark})`, color: "#dfeee9", borderRadius: 24, padding: 22, fontFamily: AR, boxShadow: "0 14px 34px rgba(16,32,30,.22)", ...style }}>{children}</div>
);

export const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ fontFamily: MONO, ...style }}>{children}</span>
);

/* Render-safe inline-SVG marks (no emoji / dingbat fonts — those are unreliable
   in headless Chrome; Arabic correctness is the priority). */
export const Check: React.FC<{ s?: number; c?: string; t?: number; style?: React.CSSProperties }> = ({ s = 26, c = C.teal, t = 1, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flex: "0 0 auto", ...style }}>
    <path d="M4 12.5 L10 18.5 L20 6" stroke={c} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, t))} />
  </svg>
);

export const Cross: React.FC<{ s?: number; c?: string; style?: React.CSSProperties }> = ({ s = 26, c = C.bad, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flex: "0 0 auto", ...style }}>
    <path d="M6 6 L18 18 M18 6 L6 18" stroke={c} strokeWidth={2.6} strokeLinecap="round" />
  </svg>
);

export const Lock: React.FC<{ s?: number; c?: string; open?: number; style?: React.CSSProperties }> = ({ s = 26, c = "#fff", open = 0, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flex: "0 0 auto", ...style }}>
    {/* shackle — lifts slightly when `open` */}
    <path d={`M8 10 V${8 - open * 1.5} a4 4 0 0 1 8 0 V10`} stroke={c} strokeWidth={2} strokeLinecap="round" />
    <rect x="5" y="10" width="14" height="10" rx="2.4" fill={c} />
  </svg>
);
