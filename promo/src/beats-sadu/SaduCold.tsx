import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, AR_DISPLAY } from "../theme";
import { S, SADU_BACKDROP } from "../sadu";
import { spr, draw, rise, glow, SPRING } from "../motion";
import { SaduBand, Emblem } from "../components/SaduUi";

/* Beat 1 — cold open: the emblem strokes DRAW themselves, «عهد» rises through
   the octagon, the sadu band weaves across the full stage. Dark, ceremonial. */
export const SaduCold: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tDraw = draw(frame, 8, 46);
  const tWord = spr(frame, fps, 40, SPRING.pop);
  const tBand = draw(frame, 66, 40);
  const tTag = spr(frame, fps, 92, SPRING.enter);
  const tSoul = spr(frame, fps, 116, SPRING.enter);
  const g = glow(frame, 100, 0.5);

  return (
    <AbsoluteFill style={{ background: SADU_BACKDROP, direction: "rtl", fontFamily: AR, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, transform: "translateY(-60px)" }}>
        <div style={{ filter: `drop-shadow(0 0 ${18 * g}px rgba(216,185,120,.45))` }}>
          <Emblem size={230} drawT={tDraw} textT={0} dark />
        </div>
        <div style={{
          fontFamily: AR_DISPLAY, fontSize: 150, fontWeight: 700, color: S.sealInk, lineHeight: 1,
          marginTop: -195, opacity: tWord, transform: `translateY(${(1 - tWord) * 30}px) scale(${0.9 + tWord * 0.1})`,
          textShadow: `0 0 ${26 * g}px rgba(216,185,120,.35)`,
        }}>عهد</div>
        <div style={{ width: 560, marginTop: 40 }}><SaduBand t={tBand} h={14} /></div>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#f3e7cf", ...rise(frame, 92, 24, 20), opacity: tTag }}>
          يَشهد… لا يُقرض
        </div>
        <div style={{ fontSize: 24, color: "#a9a294", opacity: tSoul, transform: `translateY(${(1 - tSoul) * 14}px)` }}>
          «كلمتك محفوظة، وعلاقتك محميّة»
        </div>
      </div>
    </AbsoluteFill>
  );
};
