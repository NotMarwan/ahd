/* ============================================================================
   load-logic.cjs — extract the REAL pure-logic region from the shipped
   project/ahd-demo/index.html and make it callable in Node.

   We do NOT keep a copy of the logic here (a copy would silently drift from the
   demo). Instead we slice the exact bytes between the // ===AHD-LOGIC:BEGIN/END===
   markers and evaluate them. The region is DOM-free, so the only host capability
   it needs (TextEncoder / typed arrays / Math) is already global in Node.
   => Every test below runs the same code the presenter ships.
============================================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const HTML_PATH = path.join(__dirname, "..", "..", "..", "project", "ahd-demo", "index.html");

function readHtml() {
  return fs.readFileSync(HTML_PATH, "utf8");
}

/* slice the code strictly between the two comment markers */
function extractPure(html) {
  const b = html.indexOf("AHD-LOGIC:BEGIN");
  const e = html.indexOf("AHD-LOGIC:END");
  if (b < 0 || e < 0) throw new Error("AHD-LOGIC markers not found in index.html");
  const afterBegin = html.indexOf("*/", b) + 2;       // end of the BEGIN comment block
  const beforeEnd = html.lastIndexOf("/*", e);         // start of the END comment block
  if (afterBegin < 2 || beforeEnd < 0 || beforeEnd <= afterBegin)
    throw new Error("AHD-LOGIC marker bounds invalid");
  return html.slice(afterBegin, beforeEnd);
}

const FOOTER = `
;globalThis.__AHD = {
  sha256, sha256bytes, short, fmt, toMinor, minorToFixed2,
  canonical, sealBlock, recomputeSeal, verifyRecord, GENESIS, SEALED,
  AG, NODES, IOUS, BAL, SETTLE, balancesOf, netting, ribaScan, RIBA_RULES,
  TRUST, trustSignal, TRUST_BAND_AR,
  fold, statusLabel, STATE_AR, SEED_AHDS, ev, respread, AR_MONTHS, muqassaLegs,
  CIRCLE_STATE_AR, shareEvents, makeCircle, circleTermsAr, circleShares, foldCircle,
  circleToIous, circleBalances, circleCanonical, circleSeal,
  DEMO_CIRCLE, STANDING_CIRCLE, MUQASSA_CIRCLES, CIRCLE_IOUS
};`;

/* load a FRESH evaluation of the sliced logic in its OWN vm context, so repeated
   loads never collide on top-level `const` declarations (proves reload determinism). */
function loadLogic() {
  const code = extractPure(readHtml()) + FOOTER;
  const sandbox = {
    TextEncoder, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float64Array,
    ArrayBuffer, DataView, Math, Array, Object, JSON, String, Number, Boolean,
    RegExp, Error, parseInt, parseFloat, isNaN, isFinite, console,
  };
  vm.createContext(sandbox);                       // sandbox becomes the context global
  vm.runInContext(code, sandbox, { filename: "ahd-logic-slice.js" });
  return sandbox.__AHD;                            // FOOTER assigned globalThis.__AHD == sandbox.__AHD
}

/* strip comments so source-level scans see executable code only, not prose */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
}

module.exports = { loadLogic, extractPure, readHtml, stripComments, HTML_PATH };
