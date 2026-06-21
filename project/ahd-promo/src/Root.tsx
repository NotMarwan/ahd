import React from 'react';
import {Composition} from 'remotion';
import {AhdPromo, DURATION} from './AhdPromo';

// Vertical, phone-native canvas. 1080x1920 @ 30fps.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AhdPromoD2"
        component={AhdPromo}
        durationInFrames={DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{direction: 2 as const}}
      />
      <Composition
        id="AhdPromoD1"
        component={AhdPromo}
        durationInFrames={DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{direction: 1 as const}}
      />
    </>
  );
};
