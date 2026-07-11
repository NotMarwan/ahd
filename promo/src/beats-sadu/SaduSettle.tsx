import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, draw, count, fmt, stag, SPRING, EASE } from "../motion";
import { SaduPhone, SaduBand, StageCaption, Group } from "../components/SaduUi";

/* Beat 5 (CLIMAX) — the muqassa weave: 9 tangled debts dissolve one by one
   (staggered), 2 teal transfers DRAW themselves, the counter collapses 9→2 and
   the money halves 1,800→900. The strongest single visual of the product. */

const DOTS: [number, number][] = [[280, 60], [470, 200], [400, 425], [160, 425], [90, 200]];
const NINE: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3], [2, 4], [0, 3]];
const TWO: [number, number][] = [[1, 0], [3, 2]];

const FADE_AT = (i: number) => 60 + i * 9;
const DRAW_AT = 175;
const LEN = 460;

export const SaduSettle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const before = count(frame, 150, 60, 9, 2);
  const money = count(frame, 165, 70, 1800, 900);
  const okT = spr(frame, fps, 262, SPRING.enter);

  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, fontFamily: AR }}>
      <StageCaption k="MUQASSA · 9 → 2" title="تسعُ التزاماتٍ تنطوي إلى تحويلين" />
      <SaduPhone>
        <div style={{ padding: "78px 26px 0", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 38, fontWeight: 800 }}>المقاصّة</div>
          <SaduBand t={draw(frame, 4, 22)} h={10} />

          {/* the weave */}
          <Group style={{ padding: "18px 10px 8px" }}>
            <svg viewBox="0 0 560 500" style={{ width: "100%", display: "block" }}>
              {NINE.map(([a, b], i) => {
                const op = interpolate(frame, [FADE_AT(i), FADE_AT(i) + 26], [0.5, 0.07], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
                const inT = interpolate(frame, [stag(i, 6, 5), stag(i, 6, 5) + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return <line key={i} x1={DOTS[a][0]} y1={DOTS[a][1]} x2={DOTS[b][0]} y2={DOTS[b][1]}
                  stroke={S.terra} strokeWidth={3} opacity={Math.min(inT * 0.5, op)} />;
              })}
              {TWO.map(([a, b], i) => {
                const t = draw(frame, DRAW_AT + i * 16, 30);
                return <line key={"f" + i} x1={DOTS[a][0]} y1={DOTS[a][1]} x2={DOTS[b][0]} y2={DOTS[b][1]}
                  stroke={S.teal} strokeWidth={7} strokeLinecap="round"
                  strokeDasharray={LEN} strokeDashoffset={(1 - t) * LEN} opacity={t > 0 ? 1 : 0} />;
              })}
              {DOTS.map(([x, y], i) => {
                const t = spr(frame, fps, stag(i, 0, 4), SPRING.snap);
                return <circle key={i} cx={x} cy={y} r={16 * Math.min(t, 1)} fill={S.ink} opacity={0.9} />;
              })}
            </svg>
          </Group>

          {/* the collapsing numbers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 10, background: S.card, borderRadius: S.r, padding: "22px 12px", textAlign: "center", boxShadow: "0 1px 2px rgba(28,24,18,.05)" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: S.ink3 }}>التزاماتٌ متشابكة</div>
              <div style={{ fontSize: 44, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: before <= 2 ? S.teal : S.ink, transform: `scale(${before <= 2 ? 1.08 : 1})` }}>{before}</div>
            </div>
            <div style={{ width: 1, height: 60, background: S.hair }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: S.ink3 }}>المال المتحرّك (ريال)</div>
              <div style={{ fontSize: 44, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: money <= 900 ? S.teal : S.ink }}>{fmt(money)}</div>
            </div>
          </div>

          <div style={{
            borderRadius: S.r, padding: "16px 20px", fontSize: 20, fontWeight: 700, lineHeight: 1.85,
            background: S.tealSoft, color: S.tealText, opacity: okT, transform: `translateY(${(1 - okT) * 20}px)`,
            display: "flex", gap: 10,
          }}>
            <span>✓</span><span>برهان الحفظ: صافي كلِّ عضوٍ قبل المقاصّة = صافيه بعدها — بالهللة، ولا فائدة</span>
          </div>
        </div>
      </SaduPhone>
    </AbsoluteFill>
  );
};
