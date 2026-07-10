#!/usr/bin/env node
/* build-prototype.cjs — concatenates src/ partials into the single self-contained
   prototype (same idiom as app/build-engine.cjs). Edit partials, never the output. */
"use strict";
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, "dir-b-sadu.html");
const ORDER = [
  "head.html",
  "s01-home.html","s02-create.html","s03-settle.html","s04-daftari.html",
  "s05-borrower.html","s06-proof.html","s07-impact.html",
  // بقيّة الملامح — appended by later tasks:
  // "s08-request.html","s09-open.html","s10-timeline.html","s11-circle.html",
  // "s12-circle-adv.html","s13-standing.html","s14-covenant.html","s15-dispute.html",
  // "s16-bounds.html","s17-settings.html",
  "foot.html",
];
const parts = ORDER.map((f) => {
  const p = path.join(SRC, f);
  if (!fs.existsSync(p)) { console.error("MISSING PARTIAL: " + f); process.exit(1); }
  return fs.readFileSync(p, "utf8");
});
const out = parts.join("\n");
fs.writeFileSync(OUT, out);
console.log("built dir-b-sadu.html (" + out.split("\n").length + " lines, " + (ORDER.length - 2) + " screens)");
