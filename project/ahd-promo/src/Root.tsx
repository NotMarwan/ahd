import React from "react";
import { Composition } from "remotion";
import { Promo, PROMO_FRAMES } from "./Promo";
import { NewPromo, NEW_FRAMES } from "./NewPromo";
import { FPS, WIDTH, HEIGHT } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Promo"
        component={Promo}
        durationInFrames={PROMO_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AhdNew"
        component={NewPromo}
        durationInFrames={NEW_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
