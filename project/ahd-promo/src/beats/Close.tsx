import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, AR_DISPLAY, C, DUR, BACKDROP } from "../theme";
import { spr, ramp, rampOut, sRise, breathe, SPRING } from "../motion";

/* The wordmark + tagline «كلمتك محفوظة، وعلاقتك محمية» resolve, then a calm fade. */
export const Close: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const word = spr(f, fps, 6, SPRING.enter);
  const ring = ramp(f, 14, 40);
  const under = ramp(f, 26, 30);
  const tag = sRise(f, fps, 38, 24, SPRING.enter);
  const fade = rampOut(f, DUR.close - 46, 42);
  const bre = breathe(f, fps, 0.008, 0.45);

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR, alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: fade, textAlign: "center", position: "relative", transform: `scale(${bre})` }}>
        <div style={{ position: "absolute", left: "50%", top: "40%", transform: `translate(-50%,-50%) scale(${ring * 7})`, width: 110, height: 110, borderRadius: "50%", border: `2px solid ${C.gold}`, opacity: (1 - ring) * 0.3 }} />
        <div style={{ fontFamily: AR_DISPLAY, fontSize: 224, fontWeight: 700, color: C.teal, opacity: word, transform: `scale(${0.86 + word * 0.14})`, lineHeight: 1 }}>عهد</div>
        <div style={{ height: 5, width: `${under * 220}px`, background: C.gold, borderRadius: 6, margin: "26px auto 0" }} />
        <div style={{ ...tag, fontSize: 54, fontWeight: 600, color: C.ink, marginTop: 32 }}>كلمتك محفوظة، وعلاقتك محمية</div>
      </div>
    </AbsoluteFill>
  );
};
