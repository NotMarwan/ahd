import React from "react";
import { AbsoluteFill } from "remotion";
// import { Audio, staticFile } from "remotion"; // ← music hook (see below)
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { C, DUR, TRANS, p, BACKDROP } from "./theme";
import { ColdOpen } from "./beats/ColdOpen";
import { BeatCreate } from "./beats/BeatCreate";
import { BeatDaftari } from "./beats/BeatDaftari";
import { BeatOpenLoan } from "./beats/BeatOpenLoan";
import { BeatCircle } from "./beats/BeatCircle";
import { BeatSettlement } from "./beats/BeatSettlement";
import { Close } from "./beats/Close";

const BEATS: { C: React.FC; d: number }[] = [
  { C: ColdOpen, d: DUR.cold },
  { C: BeatCreate, d: DUR.create },
  { C: BeatDaftari, d: DUR.daftari },
  { C: BeatOpenLoan, d: DUR.open },
  { C: BeatCircle, d: DUR.circle },
  { C: BeatSettlement, d: DUR.settle },
  { C: Close, d: DUR.close },
];

const T = p(TRANS);
export const PROMO_FRAMES = BEATS.reduce((s, b) => s + p(b.d), 0) - (BEATS.length - 1) * T;

// quick + confident: a clean spring (no overshoot) over 26f
const timing = springTiming({ config: { damping: 200, mass: 0.5, stiffness: 130 }, durationInFrames: T });
// brand↔screen boundaries cross-dissolve; screen→screen gets a directional RTL push
const presentationFor = (i: number) => (i === 0 || i === BEATS.length - 2 ? fade() : slide({ direction: "from-right" }));

export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BACKDROP }}>
      {/* ── Music (optional — silent by default; Marwan's call) ──────────────────
          Drop an mp3 in public/ and uncomment the import above + the line below:
          <Audio src={staticFile("music.mp3")} volume={0.55} />
      ──────────────────────────────────────────────────────────────────────────── */}
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
};
