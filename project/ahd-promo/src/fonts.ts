// Load the EXACT same Google Fonts the source HTML uses, with the Arabic subset,
// so glyphs and RTL shaping match the design 1:1.
//   Headings  -> Amiri (serif)
//   Body      -> IBM Plex Sans Arabic
//   Brand mark-> Reem Kufi
import {loadFont as loadAmiri} from '@remotion/google-fonts/Amiri';
import {loadFont as loadPlex} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadReem} from '@remotion/google-fonts/ReemKufi';

const amiri = loadAmiri('normal', {
  weights: ['400', '700'],
  subsets: ['arabic', 'latin'],
});

const plex = loadPlex('normal', {
  weights: ['300', '400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
});

const reem = loadReem('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
});

export const FONTS = {
  amiri: `${amiri.fontFamily}, serif`,
  plex: `${plex.fontFamily}, sans-serif`,
  reem: `${reem.fontFamily}, sans-serif`,
};

// Block rendering until every glyph is available.
export const fontsReady = Promise.all([
  amiri.waitUntilDone(),
  plex.waitUntilDone(),
  reem.waitUntilDone(),
]);
