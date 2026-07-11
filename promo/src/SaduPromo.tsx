import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { p, TRANS } from "./theme";
import { SADU_BACKDROP, SDUR } from "./sadu";
import { SaduCold } from "./beats-sadu/SaduCold";
import { SaduHome } from "./beats-sadu/SaduHome";
import { SaduCreate } from "./beats-sadu/SaduCreate";
import { SaduProof } from "./beats-sadu/SaduProof";
import { SaduSettle } from "./beats-sadu/SaduSettle";
import { SaduClose } from "./beats-sadu/SaduClose";

/* ════════════════════════════════════════════════════════════════════════════
   SADU PROMO — the dir-b (السدو) direction come alive. Hero + 4 main features:
   cold open → home hero → riba-guard/seal (HERO) → tamper proof → 9→2 (CLIMAX)
   → calm close. Brand↔screen boundaries cross-dissolve; screen→screen gets the
   directional RTL spring push (spatial continuity — the phone reads as one
   object whose content advances).
   ════════════════════════════════════════════════════════════════════════════ */

const BEATS: { C: React.FC; d: number }[] = [
  { C: SaduCold, d: SDUR.cold },
  { C: SaduHome, d: SDUR.home },
  { C: SaduCreate, d: SDUR.create },
  { C: SaduProof, d: SDUR.proof },
  { C: SaduSettle, d: SDUR.settle },
  { C: SaduClose, d: SDUR.close },
];

const T = p(TRANS);
export const SADU_FRAMES = BEATS.reduce((s, b) => s + p(b.d), 0) - (BEATS.length - 1) * T;

const timing = springTiming({ config: { damping: 200, mass: 0.5, stiffness: 130 }, durationInFrames: T });
const presentationFor = (i: number) =>
  i === 0 || i === BEATS.length - 2 ? fade() : slide({ direction: "from-right" });

export const SaduPromo: React.FC = () => (
  <AbsoluteFill style={{ background: SADU_BACKDROP }}>
    <TransitionSeries>
      {BEATS.map((b, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={p(b.d)}>
            <b.C />
          </TransitionSeries.Sequence>
          {i < BEATS.length - 1 ? (
            <TransitionSeries.Transition timing={timing} presentation={presentationFor(i)} />
          ) : null}
        </React.Fragment>
      ))}
    </TransitionSeries>
  </AbsoluteFill>
);
