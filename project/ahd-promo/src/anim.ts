import {Easing, interpolate} from 'remotion';

// Convert Western digits in a string to Arabic-Indic numerals (matches the HTML,
// e.g. "9:41" -> "٩:٤١"). Only used for numerals that already exist in the screens.
const AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
export const toArabic = (input: string | number): string =>
  String(input).replace(/[0-9]/g, (d) => AR[Number(d)]);

const EASE = Easing.bezier(0.22, 1, 0.36, 1); // gentle, premium ease-out

// A timeline segment that owns part of the phone-screen stack. Consecutive
// segments overlap by `fade` frames to produce a soft cross-fade.
export interface Segment {
  start: number;
  end: number;
  fade: number;
}

export const seg = (
  start: number,
  end: number,
  fade = 20
): Segment => ({start, end, fade});

// Opacity envelope for a segment (fade in at start, fade out at end).
export const segOpacity = (frame: number, s: Segment): number => {
  const fin = interpolate(frame, [s.start, s.start + s.fade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const fout = interpolate(frame, [s.end - s.fade, s.end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return Math.min(fin, fout);
};

// Eased 0..1 ramp between two absolute frames.
export const ramp = (
  frame: number,
  from: number,
  to: number,
  easing = EASE
): number =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

// Eased numeric interpolation with clamping.
export const tween = (
  frame: number,
  range: [number, number],
  out: [number, number],
  easing = EASE
): number =>
  interpolate(frame, range, out, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export {EASE};
