import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR, C, DUR, BACKDROP } from "../theme";
import { sRise, spr, count, fmt, ramp, pulse, glow, breathe, SPRING } from "../motion";
import { Phone } from "../components/Phone";
import { Caption } from "../components/Caption";
import { Chip, Btn, Check } from "../components/ui";

const PAY = 156; // partial payment fires here

export const BeatOpenLoan: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const head = sRise(f, fps, 6, 18, SPRING.enter);
  const panel = spr(f, fps, 16, SPRING.enter);
  const chip = spr(f, fps, 40, SPRING.snap);
  const note = sRise(f, fps, 50, 16, SPRING.enter);
  const ayah = sRise(f, fps, 64, 20, SPRING.enter);
  const acts = sRise(f, fps, 78, 18, SPRING.enter);

  const rem = f < PAY ? 20000 : count(f, PAY, 34, 20000, 15000);
  const press = f >= PAY - 8 && f < PAY + 8 ? 0.95 : 1;
  const payPulse = pulse(f, PAY, 30);
  const deltaT = ramp(f, PAY, 40);           // the −5,000 delta rises & fades
  const ay = glow(f, 70, 0.6);
  const breN = breathe(f, fps, 0.01, 0.4);

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR }}>
      <Phone active="open">
        <div style={{ ...head, fontSize: 26, color: C.mut, marginBottom: 16, textAlign: "center" }}>قرضٌ مفتوحٌ بينك وبين ماجد — متى ما تيسّر</div>

        <div style={{ opacity: panel, transform: `translateY(${(1 - panel) * 22}px) scale(${(0.97 + panel * 0.03) * (1 + payPulse * 0.015)})` }}>
          <div style={{ position: "relative", background: C.card, border: `1px solid ${C.line}`, borderRadius: 30, boxShadow: "0 1px 2px rgba(28,43,42,.05), 0 16px 40px rgba(28,43,42,.08)", padding: 34, textAlign: "center", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: payPulse * 0.5, background: `radial-gradient(70% 100% at 50% 50%, ${C.tealSoft}, transparent)` }} />
            <div style={{ color: C.mut, fontSize: 24, position: "relative" }}>المتبقّي</div>
            <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.05, position: "relative" }}>
              {fmt(rem)} <span style={{ fontSize: 30, fontWeight: 400, color: C.mut }}>ر.س</span>
            </div>
            {/* −5,000 delta rises out of the number */}
            {f >= PAY && f < PAY + 44 ? (
              <div style={{ position: "absolute", left: 0, right: 0, top: 70, color: C.teal, fontSize: 34, fontWeight: 700, opacity: (1 - deltaT) * 1, transform: `translateY(${-deltaT * 40}px)` }}>
                −٥٬٠٠٠
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <span style={{ display: "inline-block", transform: `scale(${0.6 + chip * 0.4})` }}>
            <Chip kind="teal" style={{ fontSize: 23, padding: "8px 20px" }}>نشِط — مفتوح، متى ما تيسّر</Chip>
          </span>
        </div>

        <div style={{ ...note, color: C.mut, fontSize: 23, textAlign: "center", lineHeight: 1.7, marginBottom: 16 }}>لا موعد، لا تذكير منك، لا حرج. حين ييسّر الله، يردّ.</div>

        <div style={{ ...ayah, textAlign: "center", margin: "6px 0 24px" }}>
          <div style={{ display: "inline-block", color: C.gold, fontSize: 31, padding: "14px 24px", borderRadius: 16, background: C.goldSoft, border: `1px solid ${C.hairline}`, transform: `scale(${breN})`, boxShadow: `0 0 ${ay * 40}px rgba(154,123,39,${ay * 0.5})` }}>
            ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾
          </div>
        </div>

        <div style={{ ...acts, display: "flex", gap: 12 }}>
          <div style={{ flex: 1, transform: `scale(${press})` }}>
            <Btn tone="teal">سدِّد جزءًا الآن (٥٬٠٠٠)</Btn>
          </div>
          <Btn tone="gold" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            اجعلها صدقة
          </Btn>
        </div>
      </Phone>

      <Caption title="القرض المفتوح" line="متى ما تيسّر — بلا موعد، بلا غرامة. ﴿فنظرةٌ إلى ميسرة﴾." inAt={20} outAt={DUR.open - 30} />
    </AbsoluteFill>
  );
};
