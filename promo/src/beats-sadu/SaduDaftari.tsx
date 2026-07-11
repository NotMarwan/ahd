import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, stag, draw, SPRING, EASE } from "../motion";
import { SaduPhone, NavLg, Group, StageCaption } from "../components/SaduUi";
import { Odometer } from "../components/Odometer";

/* Beat — دفتري wallet («ما لك»): the money screen the v1 film omitted.
   Net gauge sweeps, four REAL seed rows cascade with odometer amounts,
   the bank-reminds banner closes. Data = app/app.js seedRecords. */

const ROWS = [
  { n: "مقهى الحي", amt: 2500, chip: "متأخّرٌ بكرامة", chipBg: S.amberSoft, chipC: S.amber },
  { n: "سلطان", amt: 1200, chip: "قائم", chipBg: S.sandChip, chipC: S.ink2 },
  { n: "عبدالله", amt: 600, chip: "قائم", chipBg: S.sandChip, chipC: S.ink2 },
  { n: "ريم", amt: 800, chip: "ذمّة محفوظة 🤍", chipBg: S.tealSoft, chipC: S.tealText },
];

export const SaduDaftari: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* gauge: SVG arc sweep 0→272° */
  const sweep = interpolate(frame, [40, 95], [0, 272], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const R = 54, CX = 64, CY = 64;
  const arc = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [CX + R * Math.cos(rad), CY + R * Math.sin(rad)];
  };
  const [ex, ey] = arc(sweep);
  const large = sweep > 180 ? 1 : 0;

  const bannerT = spr(frame, fps, 210, SPRING.enter);

  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, fontFamily: AR }}>
      <StageCaption k="DAFTARI · MA-LAK" title="دفتري — ما لك، بعهودٍ مختومة" />
      <SaduPhone>
        <NavLg eyebrow="المصرف يُذكِّر نيابةً عنك" title="دفتري" base={12} />
        <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* net gauge + odometer */}
          {(() => {
            const t = Math.min(1, spr(frame, fps, 34, SPRING.enter));
            return (
              <Group style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 22, opacity: t, transform: `translateY(${(1 - t) * 20}px)` }}>
                <svg width={128} height={128} viewBox="0 0 128 128" style={{ flex: "none" }}>
                  <circle cx={CX} cy={CY} r={R} fill="none" stroke={S.track} strokeWidth={11} />
                  {sweep > 1 ? <path d={`M ${CX} ${CY - R} A ${R} ${R} 0 ${large} 1 ${ex} ${ey}`} fill="none" stroke={S.teal} strokeWidth={11} strokeLinecap="round" /> : null}
                  <text x={CX} y={CY + 2} fontSize={15} fontWeight={700} fill={S.ink2} textAnchor="middle" dominantBaseline="middle" fontFamily={AR}>صافي ما لك</text>
                </svg>
                <div>
                  <Odometer to={4300} startFrame={44} durFrames={50} size={52} color={S.teal} suffix="ر.س" />
                  <div style={{ fontSize: 17, color: S.ink2, marginTop: 4 }}>أربعة عهودٍ مختومةٍ قائمة</div>
                </div>
              </Group>
            );
          })()}

          {/* the ledger rows — real names, odometer amounts */}
          <Group>
            {ROWS.map((r, i) => {
              const t = Math.min(1, spr(frame, fps, stag(i, 96, 9), SPRING.snap));
              return (
                <div key={r.n} style={{
                  display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center",
                  padding: "16px 22px", borderTop: i ? `1px solid ${S.hair}` : "none",
                  opacity: t, transform: `translateY(${(1 - t) * 18}px)`,
                }}>
                  <span>
                    <span style={{ fontWeight: 700, fontSize: 23 }}>{r.n}</span>
                    <span style={{ display: "inline-block", marginInlineStart: 10, background: r.chipBg, color: r.chipC, borderRadius: 999, padding: "3px 12px", fontSize: 14, fontWeight: 700 }}>{r.chip}</span>
                  </span>
                  <Odometer to={r.amt} startFrame={stag(i, 100, 9)} durFrames={34} size={30} color={S.ink} suffix="ر.س" />
                </div>
              );
            })}
          </Group>

          <div style={{
            borderRadius: S.r, padding: "16px 20px", fontSize: 20, lineHeight: 1.9,
            display: "flex", gap: 12, background: S.goldSoftBg, color: S.goldText, fontWeight: 600,
            opacity: bannerT, transform: `translateY(${(1 - Math.min(bannerT, 1)) * 18}px)`,
          }}>
            <span>🕊️</span><span>عهدٌ يُذكِّر بالمعروف نيابةً عنك — فلا تصير أنت «المُطالِب»</span>
          </div>
        </div>
      </SaduPhone>
    </AbsoluteFill>
  );
};
