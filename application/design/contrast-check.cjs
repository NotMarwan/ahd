#!/usr/bin/env node
/* contrast-check.cjs — WCAG 2.1 contrast audit for the Sadu prototype palette.
   Run: node application/design/contrast-check.cjs   (from repo root)
   NOT part of the repo gate — design tooling only. */
"use strict";

function lum(hex) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(fg, bg) {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
// every real fg/bg pair in dir-b-sadu.html — UPDATE hexes here if the palette moves
const PAIRS = [
  ["ink on card",            "#1c1812", "#ffffff", 4.5],
  ["ink on ground",          "#1c1812", "#efe9dc", 4.5],
  ["ink2 on card",           "#6d6353", "#ffffff", 4.5],
  ["ink3 small labels",      "#6f6555", "#ffffff", 4.5],
  ["ink3 on ground",         "#6f6555", "#efe9dc", 4.5],
  ["terra btn text",         "#ffffff", "#a1442e", 4.5],
  ["teal-text on teal-soft", "#116153", "#e3f0eb", 4.5],
  ["gold-text on gold-soft", "#7a5f27", "#f3ead2", 4.5],
  ["stop on stop-soft",      "#7a2410", "#f6e3da", 4.5],
  ["seal ink on seal bg",    "#ece3d0", "#221d16", 4.5],
  ["seal hash on seal well", "#d8b978", "#221d16", 4.5],
  ["official footer",        "#4a5a52", "#efe9dc", 4.5],
];
let failed = 0;
for (const [name, fg, bg, min] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? " PASS" : "*FAIL"}  ${r.toFixed(2)}:1  (need ${min}:1)  ${name}  ${fg} on ${bg}`);
}
console.log(failed ? `\n${failed} FAILURES — fix before v5 ships` : "\nall pairs pass");
process.exit(failed ? 1 : 0);
