import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEMES} from './theme';
import {PhoneFrame, PHONE_H, PHONE_W} from './PhoneFrame';
import {ScreenA} from './screens/ScreenA';
import {ScreenB} from './screens/ScreenB';
import {ScreenC} from './screens/ScreenC';
import {Brand} from './parts';
import {ramp, seg, segOpacity, tween, Segment} from './anim';
import {FONTS} from './fonts';

export const DURATION = 1395; // ~46.5s @ 30fps

// Screen-stack timeline (absolute frames). Consecutive segments overlap by the
// fade window to produce premium cross-fades.
const FADE = 22;
const SEGS = {
  aDefault: seg(0, 360, FADE),
  aSealed: seg(340, 500, FADE),
  bBefore: seg(480, 690, FADE),
  bAfter: seg(670, 900, FADE),
  c: seg(880, 1345, FADE),
};

// One screen layer inside the phone viewport: cross-fade envelope + vertical pan.
const Layer: React.FC<{frame: number; segment: Segment; pan: number; children: React.ReactNode}> = ({
  frame,
  segment,
  pan,
  children,
}) => {
  const opacity = segOpacity(frame, segment);
  if (opacity <= 0.0015) return null;
  return (
    <div style={{position: 'absolute', top: 0, left: 0, width: '100%', opacity, willChange: 'opacity, transform'}}>
      <div style={{transform: `translateY(${pan}px)`}}>{children}</div>
    </div>
  );
};

export const AhdPromo: React.FC<{direction?: 1 | 2}> = ({direction = 2}) => {
  const theme = THEMES[direction];
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phone entrance / settle / exit
  const intro = spring({frame, fps, config: {damping: 200, mass: 0.8}, durationInFrames: 40});
  const introScale = 0.9 + 0.1 * intro;
  const introOpacity = ramp(frame, 0, 26);
  const bob = Math.sin(frame / 46) * 3; // very subtle float
  const outroOpacity = tween(frame, [DURATION - 32, DURATION - 4], [1, 0]);
  const outroScale = tween(frame, [DURATION - 60, DURATION], [1, 1.015]);

  const SCALE = 1.86; // native 850 -> ~1581px tall on the 1920 canvas

  // local frames
  const fA = frame - SEGS.aDefault.start;
  const fAS = frame - SEGS.aSealed.start;
  const fBB = frame - SEGS.bBefore.start;
  const fBA = frame - SEGS.bAfter.start;
  const fC = frame - SEGS.c.start;

  // pans
  const panA = tween(fA, [60, 300], [0, -150]);
  const panAS = -150 + tween(fAS, [0, 80], [0, -14]);
  const panBB = tween(fBB, [20, 150], [0, -30]);
  const panBA = tween(fBA, [20, 150], [0, -120]);
  const panC = tween(fC, [235, 320], [0, -95]);

  const brandOutro = ramp(frame, 1318, 1352);

  return (
    <AbsoluteFill style={{background: theme.backdrop}}>
      {/* soft vignette for depth */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(70% 55% at 50% 42%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(20,30,25,.10) 100%)',
        }}
      />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            width: PHONE_W,
            height: PHONE_H,
            opacity: introOpacity * outroOpacity,
            transform: `scale(${SCALE * introScale * outroScale}) translateY(${bob}px)`,
            willChange: 'transform, opacity',
          }}
        >
          <PhoneFrame theme={theme}>
            <Layer frame={frame} segment={SEGS.aDefault} pan={panA}>
              <ScreenA theme={theme} variant="default" f={fA} press={ramp(frame, 300, 342)} seal={0} />
            </Layer>

            <Layer frame={frame} segment={SEGS.aSealed} pan={panAS}>
              <ScreenA theme={theme} variant="sealed" f={fAS} press={0} seal={ramp(fAS, 12, 86)} />
            </Layer>

            <Layer frame={frame} segment={SEGS.bBefore} pan={panBB}>
              <ScreenB theme={theme} variant="before" f={fBB} press={ramp(fBB, 150, 186)} />
            </Layer>

            <Layer frame={frame} segment={SEGS.bAfter} pan={panBA}>
              <ScreenB theme={theme} variant="after" f={fBA} press={0} />
            </Layer>

            <Layer frame={frame} segment={SEGS.c} pan={panC}>
              <ScreenC theme={theme} f={fC} />
            </Layer>

            {/* calm close — the Ahd wordmark (present in every screen) */}
            {brandOutro > 0.0015 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: theme.paper,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: brandOutro,
                  zIndex: 15,
                }}
              >
                <div style={{textAlign: 'center', transform: `scale(${tween(brandOutro, [0, 1], [0.92, 1])})`}}>
                  <div style={{fontFamily: FONTS.reem, fontWeight: 600, fontSize: 54, color: theme.accent, letterSpacing: '.01em'}}>
                    عَهد
                  </div>
                </div>
              </div>
            ) : null}
          </PhoneFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
