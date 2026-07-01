/* ============================================================================
   build-engine.cjs — generate app/engine.js as a FAITHFUL copy of the
   demo's pure AHD-LOGIC region, wrapped so it loads in BOTH Node (require) and the
   browser (window.AHD).

   It READS demo/index.html and NEVER writes it. The slice is inserted
   verbatim (byte-for-byte), so engine.js is provably the same logic the presenter
   ships — the parity test (tests/app/engine-parity.cjs) enforces this on every run.

   Regenerate:  node build-engine.cjs
============================================================================ */
const fs = require("fs");
const path = require("path");
const { extractPure, readHtml } = require("../tests/load-logic.cjs");

const OUT = path.join(__dirname, "engine.js");

/* the exact public surface the demo's harness exports (load-logic.cjs FOOTER) */
const EXPORTS = [
  "sha256","sha256bytes","short","fmt","toMinor","minorToFixed2",
  "canonical","sealBlock","recomputeSeal","verifyRecord","GENESIS","SEALED",
  "AG","NODES","IOUS","BAL","SETTLE","balancesOf","netting","ribaScan","RIBA_RULES",
  "TRUST","trustSignal","TRUST_BAND_AR",
  "fold","statusLabel","STATE_AR","SEED_AHDS","ev","respread","AR_MONTHS","muqassaLegs",
  "CIRCLE_STATE_AR","shareEvents","makeCircle","circleTermsAr","circleShares","foldCircle",
  "circleToIous","circleBalances","circleCanonical","circleSeal",
  "DEMO_CIRCLE","STANDING_CIRCLE","MUQASSA_CIRCLES","CIRCLE_IOUS"
];

const HEADER =
`/* ============================================================================
   AUTO-GENERATED — DO NOT EDIT BY HAND.  Regenerate: node build-engine.cjs
   This is a BYTE-FAITHFUL copy of the pure AHD-LOGIC region of
    demo/index.html (the demo is never modified). The parity test
    tests/app/engine-parity.cjs proves this copy matches
   the demo's golden outputs and contains the exact slice.
   Reuse: Node  -> const AHD = require("./engine.js")
          Browser -> <script src="engine.js"></script> then window.AHD
============================================================================ */
`;

const FOOTER =
`
;(function(){
  var __api = { ${EXPORTS.join(", ")} };
  if (typeof module === "object" && module.exports) module.exports = __api;
  if (typeof window !== "undefined") window.AHD = __api;
  if (typeof globalThis !== "undefined") globalThis.AHD = __api;
})();
`;

const slice = extractPure(readHtml());          // verbatim bytes between the markers
const out = HEADER + slice + FOOTER;
fs.writeFileSync(OUT, out, "utf8");

console.log("engine.js generated:");
console.log("  out:        " + OUT);
console.log("  slice bytes:" + slice.length);
console.log("  total bytes:" + out.length);
console.log("  exports:    " + EXPORTS.length);

/* sanity: load it back and print the golden seal (does not replace the parity test) */
const AHD = require(OUT);
console.log("  seal:       " + AHD.SEALED.seal);
console.log("  netting:    " + AHD.netting(AHD.IOUS).length + " transfers");
