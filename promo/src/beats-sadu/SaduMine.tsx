import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, glow, SPRING, EASE, draw } from "../motion";
import { SaduPhone, NavLg, Group, StageCaption } from "../components/SaduUi";
import { Odometer } from "../components/Odometer";

/* Beat — «ما عليّ» (the borrower mirror — the dignity side):
   فهد's ٣٬٠٠٠ rolls DOWN to ٢٬٥٠٠ when «ادفع ما تيسّر» presses (scale feedback,
   a floating −٥٠٠ chip), then «أحتاج وقتًا» brings the AMBER (never red) grace
   banner + the verse glowing. */

export const SaduMine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PRESS = 92;             // «ادفع ما تيسّر» press moment
  const pressT = interpolate(frame, [PRESS, PRESS + 6, PRESS + 14], [1, 0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chipT = interpolate(frame, [PRESS + 8, PRESS + 26, PRESS + 60], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const chipY = interpolate(frame, [PRESS + 8, PRESS + 60], [0, -54], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  const GRACE = 170;
  const graceBtnT = interpolate(frame, [GRACE, GRACE + 6, GRACE + 14], [1, 0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const amberT = spr(frame, fps, GRACE + 12, SPRING.enter);
  const g = glow(frame, GRACE + 24, 0.55);

  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, fontFamily: AR }}>
      <StageCaption k="MA-ALAY · DIGNITY" title="ما عليّ — بلا عدّاد، بلا تصنيف" />
      <SaduPhone>
        <NavLg eyebrow="مرآة المدين — بكرامة" title="ما عليّ" base={10} />
        <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* the debt card */}
          {(() => {
            const t = Math.min(1, spr(frame, fps, 30, SPRING.enter));
            return (
              <Group style={{ padding: "22px", textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 20}px)`, position: "relative" }}>
                <div style={{ fontSize: 19, fontWeight: 600, color: S.ink3 }}>لفهد — قرضٌ حسنٌ قائم</div>
                <div style={{ marginTop: 8 }}>
                  <Odometer from={3000} to={2500} startFrame={PRESS + 8} durFrames={38} size={62} color={S.ink} suffix="ر.س" />
                </div>
                {/* floating −500 chip */}
                {chipT > 0.02 ? (
                  <div style={{
                    position: "absolute", top: 40, insetInlineStart: 40,
                    background: S.tealSoft, color: S.tealText, fontWeight: 800, fontSize: 24,
                    borderRadius: 999, padding: "8px 20px", opacity: chipT, transform: `translateY(${chipY}px)`,
                  }}>−٥٠٠</div>
                ) : null}
              </Group>
            );
          })()}

          {/* the two dignified actions */}
          {(() => {
            const t = Math.min(1, spr(frame, fps, 56, SPRING.enter));
            return (
              <div style={{ display: "flex", gap: 12, opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
                <div style={{ flex: 1, background: S.terra, color: "#fff", borderRadius: 14, minHeight: 66, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, boxShadow: "0 4px 14px rgba(161,68,46,.28)", transform: `scale(${pressT})` }}>
                  ادفع ما تيسّر
                </div>
                <div style={{ flex: 1, background: S.terraSoft, color: S.terra, borderRadius: 14, minHeight: 66, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, transform: `scale(${graceBtnT})` }}>
                  أحتاج وقتًا
                </div>
              </div>
            );
          })()}

          {/* the AMBER grace banner — never red */}
          {amberT > 0.02 ? (
            <div style={{
              borderRadius: S.r, padding: "18px 20px", fontSize: 20, lineHeight: 1.9,
              display: "flex", gap: 12, background: "#f7e9d6", color: "#8a3f14", fontWeight: 600,
              opacity: amberT, transform: `translateY(${(1 - Math.min(amberT, 1)) * 22}px)`,
            }}>
              <span>🌿</span><span>نظرةٌ إلى ميسرة — أُبلغ المُقرِضُ بكرامة، والأمرُ إليه. لا غرامة، لا عدّاد.</span>
            </div>
          ) : null}

          {(() => {
            const t = Math.min(1, spr(frame, fps, GRACE + 30, SPRING.enter));
            return (
              <div style={{ textAlign: "center", color: S.goldText, fontSize: 21, lineHeight: 2, padding: "2px 16px", opacity: t, textShadow: `0 0 ${16 * g}px rgba(168,134,63,.35)` }}>
                ﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَة﴾
              </div>
            );
          })()}
        </div>
      </SaduPhone>
    </AbsoluteFill>
  );
};
