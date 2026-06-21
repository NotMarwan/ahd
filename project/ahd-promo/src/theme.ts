// Two visual directions, ported verbatim from "Ahd Directions.dc.html".
// Switch the whole video between them with ONE constant (DIRECTION below),
// or render each composition (AhdPromoD1 / AhdPromoD2) directly.

export type ThemeMode = 'warm' | 'documentary';

export interface Theme {
  id: 1 | 2;
  mode: ThemeMode;
  // surfaces
  backdrop: string; // behind the phone
  paper: string; // phone screen background
  frame: string; // phone bezel gradient
  notch: string;
  ink: string; // primary heading colour
  // accents
  accent: string; // primary brand green / olive
  accentDark: string;
  brass: string;
  mint: string; // soft success surface
  brandText: string; // the "عَهد" wordmark colour on paper
  // cards
  cardBg: string;
  cardBorder: string;
  subText: string;
  // verse (Quran 2:280) card
  verseBg: string;
  verseBorder: string;
  verseInk: string;
  verseSub: string;
  // graph (Muqassa) colours
  graph: {
    tangle: string;
    transfer: string;
    kept: string;
    overdue: string;
    newNode: string;
    nodeFill: string;
    nodeStroke: string;
    ring: string; // faint base ring
    label: string;
    labelStroke: string;
  };
}

export const THEMES: Record<1 | 2, Theme> = {
  1: {
    id: 1,
    mode: 'warm',
    backdrop:
      'radial-gradient(125% 90% at 50% 22%, #f3edde 0%, #e7e0cf 55%, #d8cfb9 100%)',
    paper: '#F7F1E4',
    frame: 'linear-gradient(160deg,#39322a,#241f19)',
    notch: '#241f19',
    ink: '#2B2622',
    accent: '#7E8B58',
    accentDark: '#5d6840',
    brass: '#C99A3F',
    mint: '#EEF0DF',
    brandText: '#0E7C66',
    cardBg: '#FFFDF8',
    cardBorder: '#e3dcc7',
    subText: '#7c7264',
    verseBg: '#FCEFC4',
    verseBorder: '#D9A441',
    verseInk: '#5a4a1f',
    verseSub: '#917b3f',
    graph: {
      tangle: '#d8cdb8',
      transfer: '#C99A3F',
      kept: '#7E8B58',
      overdue: '#C58A3D',
      newNode: '#bdb19a',
      nodeFill: '#FFFDF8',
      nodeStroke: '#cdbfa6',
      ring: '#e3dccb',
      label: '#2B2622',
      labelStroke: '#FBF8EF',
    },
  },
  2: {
    id: 2,
    mode: 'documentary',
    backdrop:
      'radial-gradient(125% 90% at 50% 20%, #eef0ea 0%, #dfe3dc 55%, #cdd3ca 100%)',
    paper: '#F4F3EE',
    frame: 'linear-gradient(160deg,#1c2a25,#0d1714)',
    notch: '#0d1714',
    ink: '#14201C',
    accent: '#0E5C46',
    accentDark: '#0a4133',
    brass: '#B08A2E',
    mint: '#E6EEEA',
    brandText: '#0E5C46',
    cardBg: '#ffffff',
    cardBorder: '#d6d2c4',
    subText: '#5b6b66',
    verseBg: '#FBF6E7',
    verseBorder: '#e9dcb6',
    verseInk: '#5c4a18',
    verseSub: '#9a7c2e',
    graph: {
      tangle: '#cdd6cf',
      transfer: '#B08A2E',
      kept: '#0E5C46',
      overdue: '#B08A2E',
      newNode: '#aeb6ae',
      nodeFill: '#ffffff',
      nodeStroke: '#0a4133',
      ring: '#e6e3d6',
      label: '#14201C',
      labelStroke: '#ffffff',
    },
  },
};

// One-line switch for the default render.
export const DIRECTION: 1 | 2 = 2;
