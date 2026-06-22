import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AR, C, SOFT_SHADOW } from "../theme";
import { spr, breathe, drift, EASE, SPRING } from "../motion";
import { Nav } from "./ui";

export const PHONE_W = 690;
export const PHONE_H = 1304;
export const PHONE_TOP = 150;
const BEZEL = 15;

/* The device — layered soft shadow + a gentle continuous float and a barely-there
   3D parallax (so it has presence, not a flat rectangle), with a spring entrance
   (rise + scale 0.92→1 + a tilt that resolves to flat). A soft specular highlight
   sweeps the glass. Children render inside the RTL screen. */
export const Phone: React.FC<{ active: string; children: React.ReactNode; enterDelay?: number }> = ({ active, children, enterDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spr(frame, fps, enterDelay, SPRING.soft);
  const settle = interpolate(enter, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // continuous life (only fully present once settled)
  const floatY = drift(frame, fps, 9, 0.22) * settle;
  const parX = Math.sin((frame / fps) * 0.18 * Math.PI * 2) * 0.7 * settle;   // rotateX
  const parZ = Math.sin((frame / fps) * 0.13 * Math.PI * 2 + 1) * 0.35 * settle; // rotateZ
  const bre = breathe(frame, fps, 0.004, 0.22);

  const enterTilt = (1 - settle) * 3.2;
  const scale = (0.92 + settle * 0.08) * bre;
  const y = (1 - settle) * 58 + floatY;

  // specular sweep across the glass
  const sweep = ((frame / fps) * 0.08) % 1;
  const sweepX = interpolate(sweep, [0, 1], [-40, 140]);

  return (
    <div
      style={{
        position: "absolute", left: "50%", top: PHONE_TOP, width: PHONE_W, height: PHONE_H,
        opacity: settle,
        transform: `translateX(-50%) translateY(${y}px) scale(${scale}) perspective(1500px) rotateX(${enterTilt + parX}deg) rotateZ(${parZ}deg)`,
        transformOrigin: "center top",
        willChange: "transform",
      }}
    >
      {/* contact shadow (separate so it stays soft under the float) */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 62, boxShadow: SOFT_SHADOW }} />

      {/* bezel */}
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 62, background: "linear-gradient(150deg,#16302c,#0a1513 60%)", padding: BEZEL }}>
        {/* notch */}
        <div style={{ position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)", width: 156, height: 30, background: "#0a1513", borderRadius: 20, zIndex: 8 }} />

        {/* screen */}
        <div style={{ width: "100%", height: "100%", borderRadius: 47, background: C.bg, overflow: "hidden", position: "relative", direction: "rtl", fontFamily: AR, color: C.ink }}>
          <div style={{ padding: "20px 24px 0" }}>
            <Nav active={active} />
          </div>
          <div style={{ padding: "2px 24px 24px" }}>{children}</div>

          {/* inner edge vignette for glass realism */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 47, boxShadow: "inset 0 0 1px rgba(28,43,42,.25), inset 0 2px 22px rgba(28,43,42,.05)", pointerEvents: "none", zIndex: 9 }} />
          {/* specular sweep */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweepX}%`, width: "26%", background: "linear-gradient(105deg, transparent, rgba(255,255,255,.10), transparent)", transform: "skewX(-12deg)", pointerEvents: "none", zIndex: 10 }} />
        </div>
      </div>
    </div>
  );
};
