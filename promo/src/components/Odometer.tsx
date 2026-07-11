import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { EASE } from "../motion";
import { AR } from "../theme";

/* ── Odometer — the fintech digit-roll (fixed digit slots, vertical 0-9 strips,
   tabular width so nothing reflows). PIXEL-based rows: em-based heights clip
   with Arabic-font ascenders in headless Chrome, so every row is `H`px with
   matching lineHeight. Frame-driven, deterministic. ─────────────────────────── */

const Digit: React.FC<{ d: number; size: number; color: string }> = ({ d, size, color }) => {
  const H = Math.round(size * 1.3);
  return (
    <span style={{ display: "inline-block", height: H, overflow: "hidden" }}>
      <span style={{ display: "block", transform: `translateY(${-d * H}px)` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} style={{
            display: "block", height: H, lineHeight: `${H}px`, textAlign: "center",
            fontSize: size, fontWeight: 800, color, fontVariantNumeric: "tabular-nums",
            width: Math.ceil(size * 0.62),
          }}>{n}</span>
        ))}
      </span>
    </span>
  );
};

export const Odometer: React.FC<{
  from?: number; to: number; startFrame?: number; durFrames?: number;
  size?: number; color?: string; suffix?: string; suffixSize?: number;
}> = ({ from = 0, to, startFrame = 0, durFrames = 40, size = 44, color = "#1c1812", suffix, suffixSize }) => {
  const frame = useCurrentFrame();
  const H = Math.round(size * 1.3);
  const value = Math.round(interpolate(frame, [startFrame, startFrame + durFrames], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  }));
  const slots = String(Math.max(Math.abs(from), Math.abs(to))).length;
  const str = String(Math.abs(value)).padStart(slots, "0");
  const firstSig = Math.max(0, str.length - String(Math.abs(value)).length); // leading zeros hidden
  const out: React.ReactNode[] = [];
  for (let i = 0; i < str.length; i++) {
    const fromEnd = str.length - i;
    const hidden = i < firstSig;
    if (i > 0 && fromEnd % 3 === 0 && !hidden) {
      out.push(<span key={"c" + i} style={{ fontSize: size, fontWeight: 800, color, lineHeight: `${H}px`, height: H, display: "inline-block" }}>,</span>);
    }
    if (!hidden) out.push(<Digit key={i} d={Number(str[i])} size={size} color={color} />);
  }
  return (
    <span style={{ direction: "ltr", display: "inline-flex", alignItems: "center", gap: 1, fontFamily: AR, verticalAlign: "middle" }}>
      {out}
      {suffix ? <span style={{ fontSize: suffixSize ?? Math.round(size * 0.42), fontWeight: 600, color, marginInlineStart: 8 }}>{suffix}</span> : null}
    </span>
  );
};
