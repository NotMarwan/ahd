import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR, AR_DISPLAY, C, DUR, BACKDROP } from "../theme";
import { spr, ramp, rampOut, sRise, breathe, SPRING } from "../motion";

/* The «عهد» wordmark resolves: it springs in, a seal ring STAMPS onto it with a
   ripple (the covenant being sealed), a gold rule draws, the tagline rises. */
export const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const word = spr(f, fps, 4, SPRING.enter);
  const stamp = spr(f, fps, 14, SPRING.pop);          // seal ring presses onto the mark
  const ripple = ramp(f, 22, 44);                      // impact ripple expands out
  const ripple2 = ramp(f, 30, 50);
  const flash = interpolate(f, [20, 28, 40], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const under = ramp(f, 40, 28);
  const tag = sRise(f, fps, 58, 22, SPRING.enter);
  const out = rampOut(f, DUR.cold - 26, 22);
  const bre = breathe(f, fps, 0.01, 0.5);

  const stampScale = interpolate(stamp, [0, 1], [1.55, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BACKDROP, fontFamily: AR, alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: out, textAlign: "center", position: "relative", transform: `scale(${bre})` }}>
        {/* impact ripples */}
        <div style={{ position: "absolute", left: "50%", top: "42%", transform: `translate(-50%,-50%) scale(${ripple * 6.5})`, width: 110, height: 110, borderRadius: "50%", border: `2px solid ${C.teal}`, opacity: (1 - ripple) * 0.45 }} />
        <div style={{ position: "absolute", left: "50%", top: "42%", transform: `translate(-50%,-50%) scale(${ripple2 * 8.5})`, width: 110, height: 110, borderRadius: "50%", border: `2px solid ${C.gold}`, opacity: (1 - ripple2) * 0.3 }} />

        {/* the seal ring that stamps onto the mark */}
        <div style={{ position: "absolute", left: "50%", top: "42%", transform: `translate(-50%,-50%) scale(${stampScale})`, width: 360, height: 360, borderRadius: "50%", border: `3px solid ${C.gold}`, opacity: stamp * 0.5 }} />

        {/* wordmark */}
        <div style={{ fontFamily: AR_DISPLAY, fontSize: 268, fontWeight: 700, color: C.teal, opacity: word, transform: `scale(${0.82 + word * 0.18})`, lineHeight: 1, position: "relative", textShadow: `0 0 ${flash * 60}px rgba(154,123,39,${flash})` }}>عهد</div>

        <div style={{ height: 6, width: `${under * 280}px`, background: C.gold, borderRadius: 6, margin: "30px auto 0" }} />
        <div style={{ ...tag, fontSize: 46, fontWeight: 500, color: C.mut, marginTop: 30 }}>قرضٌ حسن — موثَّقٌ ومشهود</div>
      </div>
    </AbsoluteFill>
  );
};
