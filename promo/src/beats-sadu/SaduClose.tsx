import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, AR_DISPLAY } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, draw, glow, SPRING } from "../motion";
import { SaduBand, Emblem } from "../components/SaduUi";

/* Beat 6 — close: end as we began (spatial symmetry): emblem, wordmark, band,
   the soul line. Calm — the quiet is part of the message. */
export const SaduClose: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tEm = spr(frame, fps, 6, SPRING.soft);
  const tWord = spr(frame, fps, 22, SPRING.enter);
  const tBand = draw(frame, 42, 34);
  const tSoul = spr(frame, fps, 66, SPRING.enter);
  const tFoot = spr(frame, fps, 96, SPRING.enter);
  const g = glow(frame, 50, 0.45);

  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, direction: "rtl", fontFamily: AR, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, transform: "translateY(-40px)" }}>
        <div style={{ opacity: tEm, transform: `scale(${0.85 + tEm * 0.15})`, filter: `drop-shadow(0 0 ${14 * g}px rgba(216,185,120,.4))` }}>
          <Emblem size={170} dark />
        </div>
        <div style={{ fontFamily: AR_DISPLAY, fontSize: 120, fontWeight: 700, color: S.sealInk, lineHeight: 1, opacity: tWord, transform: `translateY(${(1 - tWord) * 24}px)` }}>عهد</div>
        <div style={{ width: 480 }}><SaduBand t={tBand} h={12} /></div>
        <div style={{ fontSize: 32, color: "#f3e7cf", fontWeight: 700, opacity: tSoul, transform: `translateY(${(1 - tSoul) * 16}px)` }}>
          «كلمتهم محفوظة، وعلاقتهم محميّة»
        </div>
        <div style={{ fontSize: 20, color: "#8f8878", opacity: tFoot }}>
          وثيقةٌ تُختم ولا تُروى — عهد
        </div>
      </div>
    </AbsoluteFill>
  );
};
