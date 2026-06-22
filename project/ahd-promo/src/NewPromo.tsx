import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { DUR, TRANS, p, BACKDROP } from "./theme";
import { ColdOpen } from "./beats/ColdOpen";
import { BeatRequest } from "./beats/BeatRequest";
import { BeatTimeline } from "./beats/BeatTimeline";
import { BeatProof } from "./beats/BeatProof";
import { BeatDispute } from "./beats/BeatDispute";
import { BeatSettings } from "./beats/BeatSettings";
import { Close } from "./beats/Close";

/* «ما الجديد» — the NEW-features film: witness timeline · proof-pack ·
   dispute-pause · settings/Arabic-Indic digits. Same motion system + Phone +
   Caption + palette as the main Promo; brand bookends (ColdOpen / Close). */
const BEATS: { C: React.FC; d: number }[] = [
  { C: ColdOpen, d: DUR.cold },
  { C: BeatRequest, d: DUR.request },
  { C: BeatTimeline, d: DUR.tl },
  { C: BeatProof, d: DUR.proof },
  { C: BeatDispute, d: DUR.dispute },
  { C: BeatSettings, d: DUR.settings },
  { C: Close, d: DUR.close },
];

const T = p(TRANS);
export const NEW_FRAMES = BEATS.reduce((s, b) => s + p(b.d), 0) - (BEATS.length - 1) * T;

const timing = springTiming({ config: { damping: 200, mass: 0.5, stiffness: 130 }, durationInFrames: T });
const presentationFor = (i: number) => (i === 0 || i === BEATS.length - 2 ? fade() : slide({ direction: "from-right" }));

export const NewPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BACKDROP }}>
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
