import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, draw, stag, SPRING, EASE } from "../motion";
import { SaduPhone, SaduBand, StageCaption, Group } from "../components/SaduUi";
import { Odometer } from "../components/Odometer";

/* Beat — CLIMAX v2 (operator feedback: not dry — names, amounts, savings):
   named dots → 9 terra threads dissolve → 2 teal transfers draw WITH amount
   pills riding them → before/after cards swap → the gold savings pill lands. */

const NAMES = ["سعود", "تركي", "عبدالله", "نورة", "ريم"];
const DOTS: [number, number][] = [[280, 66], [470, 206], [400, 431], [160, 431], [90, 206]];
/* label offsets so names never sit on a thread */
const LBL: [number, number][] = [[0, -34], [52, 0], [30, 40], [-30, 40], [-52, 0]];
const NINE: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3], [2, 4], [0, 3]];
const TWO: { a: number; b: number; amt: number }[] = [{ a: 1, b: 0, amt: 500 }, { a: 3, b: 2, amt: 400 }];

const FADE_AT = (i: number) => 66 + i * 8;
const DRAW_AT = 168;
const LEN = 460;

export const SaduSettle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const afterIn = spr(frame, fps, 235, SPRING.pop);
  const beforeDim = interpolate(frame, [235, 265], [1, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const saveIn = spr(frame, fps, 300, SPRING.pop);

  const mid = (a: number, b: number): [number, number] =>
    [(DOTS[a][0] + DOTS[b][0]) / 2, (DOTS[a][1] + DOTS[b][1]) / 2];

  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, fontFamily: AR }}>
      <StageCaption k="MUQASSA · 9 → 2" title="تسعُ التزاماتٍ تنطوي إلى تحويلين" />
      <SaduPhone>
        <div style={{ padding: "70px 26px 0", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 38, fontWeight: 800 }}>المقاصّة</div>
          <SaduBand t={draw(frame, 4, 22)} h={10} />

          {/* the weave — now NAMED */}
          <Group style={{ padding: "14px 8px 6px" }}>
            <svg viewBox="0 0 560 500" style={{ width: "100%", display: "block", overflow: "visible" }}>
              {NINE.map(([a, b], i) => {
                const op = interpolate(frame, [FADE_AT(i), FADE_AT(i) + 24], [0.5, 0.07], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
                const inT = interpolate(frame, [stag(i, 8, 4), stag(i, 8, 4) + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return <line key={i} x1={DOTS[a][0]} y1={DOTS[a][1]} x2={DOTS[b][0]} y2={DOTS[b][1]}
                  stroke={S.terra} strokeWidth={3} opacity={Math.min(inT * 0.5, op)} />;
              })}
              {TWO.map(({ a, b }, i) => {
                const t = draw(frame, DRAW_AT + i * 16, 28);
                return <line key={"f" + i} x1={DOTS[a][0]} y1={DOTS[a][1]} x2={DOTS[b][0]} y2={DOTS[b][1]}
                  stroke={S.teal} strokeWidth={7} strokeLinecap="round"
                  strokeDasharray={LEN} strokeDashoffset={(1 - t) * LEN} opacity={t > 0 ? 1 : 0} />;
              })}
              {DOTS.map(([x, y], i) => {
                const t = Math.min(1, spr(frame, fps, stag(i, 0, 4), SPRING.snap));
                return (
                  <g key={i} opacity={t}>
                    <circle cx={x} cy={y} r={15 * t} fill={S.ink} opacity={0.9} />
                    <text x={x + LBL[i][0]} y={y + LBL[i][1]} fontSize={23} fontWeight={700} fill={S.ink2}
                      textAnchor="middle" dominantBaseline="middle" fontFamily={AR}>{NAMES[i]}</text>
                  </g>
                );
              })}
              {/* amount pills riding each transfer's midpoint */}
              {TWO.map(({ a, b, amt }, i) => {
                const t = Math.min(1, spr(frame, fps, DRAW_AT + 14 + i * 16, SPRING.pop));
                if (t < 0.02) return null;
                const [mx, my] = mid(a, b);
                return (
                  <g key={"p" + i} opacity={t} transform={`translate(${mx},${my - 30 * (1 - t)})`}>
                    <rect x={-92} y={-24} width={184} height={48} rx={24} fill={S.tealSoft} stroke={S.teal} strokeWidth={1.5} />
                    <text x={0} y={2} fontSize={21} fontWeight={800} fill={S.tealText} textAnchor="middle" dominantBaseline="middle" fontFamily={AR}>
                      {NAMES[a]} ← {NAMES[b]} · {amt} ر.س
                    </text>
                  </g>
                );
              })}
            </svg>
          </Group>

          {/* before / after cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "#fbeee9", border: `1px solid ${S.stopLine}`, borderRadius: S.r, padding: "16px 14px", textAlign: "center", opacity: beforeDim, transform: `scale(${interpolate(beforeDim, [0.45, 1], [0.96, 1])})` }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: S.ink3 }}>قبل</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: S.terra, marginTop: 4 }}>٩ تحويلات</div>
              <Odometer to={1800} startFrame={20} durFrames={30} size={34} color={S.ink} suffix="ر.س تتحرّك" />
            </div>
            <div style={{ background: S.tealSoft, borderRadius: S.r, padding: "16px 14px", textAlign: "center", opacity: afterIn, transform: `translateY(${(1 - Math.min(afterIn, 1)) * 24}px) scale(${0.94 + Math.min(afterIn, 1) * 0.06})` }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: S.tealText }}>بعد</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: S.teal, marginTop: 4 }}>تحويلان فقط</div>
              <Odometer from={1800} to={900} startFrame={245} durFrames={40} size={34} color={S.tealText} suffix="ر.س" />
            </div>
          </div>

          {/* the savings pill — the enticing moment */}
          <div style={{
            background: S.goldSoftBg, borderRadius: 999, padding: "16px 26px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            color: S.goldText, fontSize: 23, fontWeight: 800,
            opacity: saveIn, transform: `translateY(${(1 - Math.min(saveIn, 1)) * 30}px)`,
            boxShadow: "0 6px 24px rgba(168,134,63,.25)",
          }}>
            <span>✨</span>
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}>
              وُفِّر تحريكُ <Odometer to={900} startFrame={306} durFrames={36} size={30} color={S.goldText} /> ريال — والحقوق نفسُها بالهللة
            </span>
          </div>
        </div>
      </SaduPhone>
    </AbsoluteFill>
  );
};
