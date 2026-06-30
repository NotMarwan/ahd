import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR, C, DUR, BACKDROP } from "../theme";
import { sRise, spr, ramp, draw, pulse, breathe, stag, glow, SPRING, EASE, EASE_IO } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";
import { Check } from "../components/ui";

const NAMES = ["نورة", "سارة", "خالد", "ليلى", "فهد"];
const IDX: Record<string, number> = { "نورة": 0, "سارة": 1, "خالد": 2, "ليلى": 3, "فهد": 4 };
const IOUS: [string, string][] = [
  ["نورة", "سارة"], ["سارة", "خالد"], ["نورة", "ليلى"], ["ليلى", "فهد"], ["نورة", "خالد"],
  ["نورة", "فهد"], ["سارة", "ليلى"], ["ليلى", "خالد"], ["خالد", "سارة"],
];
const TRANSFERS: [string, string, number][] = [["نورة", "خالد", 600], ["نورة", "فهد", 300]];

const CX = 300, CY = 280, R = 200, NR = 46;
const pos = (i: number) => { const a = (-90 + i * 72) * Math.PI / 180; return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) }; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ends = (an: string, bn: string) => {
  const a = pos(IDX[an]), b = pos(IDX[bn]);
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
  return { A: { x: a.x + dx / L * NR, y: a.y + dy / L * NR }, B: { x: b.x - dx / L * (NR + 13), y: b.y - dy / L * (NR + 13) } };
};

const COL = 210; // collapse begins

export const BeatSettlement: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const head = sRise(f, fps, 6, 18, SPRING.enter);
  const collapsed = f >= COL;
  const flash = pulse(f, COL + 22, 36);               // central cancellation flash
  const two = spr(f, fps, COL + 26, SPRING.pop);      // the ٢ ticks in
  const tlist = sRise(f, fps, COL + 70, 22, SPRING.enter);
  const cons = sRise(f, fps, COL + 96, 22, SPRING.enter);
  const consCheck = ramp(f, COL + 108, 20);
  const tangleNote = interpolate(f, [150, 170, COL - 4, COL + 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="settle">
        <div style={{ ...head, fontWeight: 700, fontSize: 27, marginBottom: 8 }}>المقاصّة — أقلّ التحويلات تُصفّي الجميع</div>

        {/* ٩ ⟶ ٢ counter */}
        <div style={{ direction: "ltr", textAlign: "center", fontSize: 58, fontWeight: 700, margin: "2px 0", display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
          <span style={{ color: collapsed ? C.mut : C.teal, opacity: collapsed ? 0.45 : 1, transform: `scale(${collapsed ? 0.82 : 1})`, transition: "none" }}>٩</span>
          <span style={{ color: C.mut, fontSize: 38 }}>⟶</span>
          <span style={{ color: C.teal, transform: `scale(${0.3 + two * 0.7})`, display: "inline-block", opacity: two }}>٢</span>
          <span style={{ fontSize: 26, color: C.mut, fontWeight: 500, direction: "rtl" }}>{collapsed ? "تحويلان" : "التزامًا"}</span>
        </div>

        {/* the graph */}
        <svg viewBox="0 0 600 580" style={{ width: "100%", height: 558 }}>
          <defs>
            <marker id="arT" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={C.mut} /></marker>
            <marker id="arB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={C.teal} /></marker>
            <radialGradient id="flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={C.teal} stopOpacity="0.5" /><stop offset="100%" stopColor={C.teal} stopOpacity="0" /></radialGradient>
          </defs>

          {/* central cancellation flash */}
          {flash > 0.01 ? <circle cx={CX} cy={CY} r={interpolate(flash, [0, 1], [10, 150])} fill="url(#flash)" opacity={flash} /> : null}

          {/* phase 1 — the 9-IOU tangle; draws in, then retracts to centre & fades on collapse */}
          {IOUS.map(([an, bn], j) => {
            const { A, B } = ends(an, bn);
            const dr = draw(f, 52 + j * 8, 16);
            // each edge unravels toward the centre with a slight stagger (a readable collapse)
            const colJ = ramp(f, COL + j * 1.6, 42, EASE_IO);
            const ax = lerp(A.x, CX, colJ), ay = lerp(A.y, CY, colJ);
            const bx = lerp(B.x, CX, colJ), by = lerp(B.y, CY, colJ);
            const ex = ax + (bx - ax) * dr, ey = ay + (by - ay) * dr;
            const flick = collapsed ? 1 : 0.6 + 0.2 * Math.sin((f / fps) * 6 + j);
            const op = dr * (1 - colJ) * flick;
            return <line key={j} x1={ax} y1={ay} x2={ex} y2={ey} stroke={C.mut} strokeWidth={2.4} opacity={op} markerEnd={colJ < 0.3 ? "url(#arT)" : undefined} />;
          })}

          {/* phase 2 — the 2 minimal transfers, bold, draw outward */}
          {TRANSFERS.map(([an, bn, amt], k) => {
            const { A, B } = ends(an, bn);
            const dr = draw(f, COL + 30 + k * 16, 26);
            const ex = A.x + (B.x - A.x) * dr, ey = A.y + (B.y - A.y) * dr;
            const mx = (A.x + ex) / 2, my = (A.y + ey) / 2;
            const badge = spr(f, fps, COL + 30 + k * 16 + 20, SPRING.pop);
            return (
              <g key={"t" + k} opacity={dr > 0 ? 1 : 0}>
                <line x1={A.x} y1={A.y} x2={ex} y2={ey} stroke={C.teal} strokeWidth={6.5} markerEnd="url(#arB)" strokeLinecap="round" />
                {badge > 0.05 ? (
                  <g transform={`translate(${mx},${my}) scale(${0.4 + badge * 0.6})`} opacity={badge}>
                    <circle r={27} fill={C.teal} />
                    <text y={8} fill="#fff" fontSize={23} fontWeight={700} textAnchor="middle">{amt}</text>
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* nodes */}
          {NAMES.map((n, i) => {
            const p = pos(i);
            const pop = spr(f, fps, stag(i, 10, 6), SPRING.pop);
            const bre = breathe(f, fps, 0.02, 0.5, i);
            return (
              <g key={n} transform={`translate(${p.x},${p.y}) scale(${(0.4 + pop * 0.6) * bre})`} opacity={pop}>
                <circle r={NR} fill={C.tealSoft} stroke={C.teal} strokeWidth={2.4} />
                <text y={9} fill={C.teal} fontSize={25} fontWeight={700} textAnchor="middle" style={{ fontFamily: AR }}>{n}</text>
              </g>
            );
          })}

          {/* «متشابكة» note during the tangle hold */}
          <text x={CX} y={CY + 4} fill={C.mut} fontSize={22} fontWeight={700} textAnchor="middle" opacity={tangleNote} style={{ fontFamily: AR }}>٩ التزامات متشابكة</text>
        </svg>

        {/* the 2 transfers, written + conservation proof */}
        <div style={{ ...tlist }}>
          {TRANSFERS.map(([an, bn, amt], k) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 6px", borderTop: k ? `1px solid ${C.line}` : 0, fontSize: 24 }}>
              <span><b style={{ fontWeight: 700 }}>{an}</b> تدفع <b style={{ fontWeight: 700 }}>{bn}</b></span><b style={{ color: C.teal }}>{amt} ر.س</b>
            </div>
          ))}
        </div>
        <div style={{ ...cons, marginTop: 10, background: C.tealSoft, color: C.teal, borderRadius: 14, padding: "13px 16px", fontSize: 22, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
          <Check s={24} c={C.teal} t={consCheck} /> المجموع = صفر — لا ريال يُخلق ولا يضيع، ولا فائدة
        </div>
      </Phone>

      <Caption title="المقاصّة" line="تسعة التزاماتٍ تنحلّ بتحويلين — لا ريال يُخلق ولا يضيع." inAt={18} outAt={DUR.settle - 30} />
    </AbsoluteFill>
  );
};
