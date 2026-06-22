import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR, C } from "../theme";
import { ramp, rampOut, drift, clipR, EASE } from "../motion";

/* A kinetic Arabic caption — title + one line — in the lower band beneath the
   phone. The title wipes in from the trailing (RTL: right) edge, a gold rule
   draws beneath it, the line rises; it holds, then animates out before the next
   beat. Copy is the approved §6 text — typeset, never rewritten. */
export const Caption: React.FC<{ title: string; line: string; inAt?: number; outAt?: number }> = ({ title, line, inAt = 8, outAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tIn = ramp(frame, inAt, 22);
  const titleWipe = ramp(frame, inAt, 26, EASE);
  const rule = ramp(frame, inAt + 8, 26);
  const lineIn = ramp(frame, inAt + 12, 24);
  const out = outAt != null ? rampOut(frame, outAt, 16) : 1;

  const o = tIn * out;
  const driftY = drift(frame, fps, 3, 0.3);
  const exitY = outAt != null ? (1 - out) * -16 : 0;

  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", direction: "rtl",
        fontFamily: AR, opacity: o, transform: `translateY(${driftY + exitY}px)`, padding: "0 84px",
      }}
    >
      <div
        style={{
          fontSize: 64, fontWeight: 700, color: C.teal, letterSpacing: 0.5, lineHeight: 1.25,
          clipPath: clipR(titleWipe), WebkitClipPath: clipR(titleWipe),
        }}
      >
        {title}
      </div>
      <div style={{ height: 5, width: `${rule * 132}px`, background: C.gold, borderRadius: 5, margin: "18px auto 20px", opacity: 0.92 }} />
      <div style={{ fontSize: 35, fontWeight: 500, color: C.ink, lineHeight: 1.75, opacity: lineIn, transform: `translateY(${(1 - lineIn) * 14}px)` }}>{line}</div>
    </div>
  );
};
