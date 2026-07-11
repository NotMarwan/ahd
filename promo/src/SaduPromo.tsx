import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { p, TRANS } from "./theme";
import { SADU_BACKDROP, SDUR } from "./sadu";
import { SaduCold } from "./beats-sadu/SaduCold";
import { SaduHome } from "./beats-sadu/SaduHome";
import { SaduDaftari } from "./beats-sadu/SaduDaftari";
import { SaduMine } from "./beats-sadu/SaduMine";
import { SaduCreate } from "./beats-sadu/SaduCreate";
import { SaduProof } from "./beats-sadu/SaduProof";
import { SaduSettle } from "./beats-sadu/SaduSettle";
import { SaduMontage } from "./beats-sadu/SaduMontage";
import { SaduClose } from "./beats-sadu/SaduClose";

/* ════════════════════════════════════════════════════════════════════════════
   SADU PROMO v2 — hero + wallet + main features + rapid montage.
   The device is STATIC (v2); between phone beats the film uses a directional
   WIPE (from-left = RTL forward) so it reads as one steady phone whose screen
   advances — not a flying frame. Brand ends stay cross-fades.
   ════════════════════════════════════════════════════════════════════════════ */

const BEATS: { C: React.FC; d: number }[] = [
  { C: SaduCold, d: SDUR.cold },
  { C: SaduHome, d: SDUR.home },
  { C: SaduDaftari, d: SDUR.daftari },
  { C: SaduMine, d: SDUR.mine },
  { C: SaduCreate, d: SDUR.create },
  { C: SaduProof, d: SDUR.proof },
  { C: SaduSettle, d: SDUR.settle },
  { C: SaduMontage, d: SDUR.montage },
  { C: SaduClose, d: SDUR.close },
];

const T = p(TRANS);
export const SADU_FRAMES = BEATS.reduce((s, b) => s + p(b.d), 0) - (BEATS.length - 1) * T;

const timing = springTiming({ config: { damping: 200, mass: 0.5, stiffness: 130 }, durationInFrames: T });
const presentationFor = (i: number) =>
  i === 0 || i === BEATS.length - 2 ? fade() : wipe({ direction: "from-left" });

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
