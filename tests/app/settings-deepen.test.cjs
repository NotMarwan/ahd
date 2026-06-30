/* ============================================================================
   settings-deepen.test.cjs — TDD for the DEEPENED الإعدادات: a deterministic,
   display-only «إخفاء المبالغ» privacy mask (byte-safe — never touches the engine
   or a seal) + the «ما يفعله عهد» counterpart to «ما لا نفعله». No numbers/score.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const S = require(P("features", "settings.js"));
const E = require(P("engine.js"));
const PF = require(P("features", "proof.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("settings-deepen.test: privacy mask + «ما يفعله عهد»");

/* ---- maskAmount: a pure, display-only privacy mask ---- */
ok(typeof S.maskAmount === "function", "maskAmount exists");
ok(S.maskAmount("1,200", false) === "1,200", "not hidden → pass-through");
ok(S.maskAmount("1,200", true) === "•••", "hidden → «•••» (no digits leak)");
ok(S.maskAmount("٥,٠٠٠", true) === "•••", "hidden masks Arabic-Indic digits too");
ok(S.maskAmount("9,500", undefined) === "9,500", "undefined mode → not hidden (safe default)");
ok(!/\d/.test(S.maskAmount("123456", true)), "masked output leaks NO digit");
ok(S.maskAmount("1,200", true) === S.maskAmount("1,200", true), "maskAmount is deterministic");

/* ---- byte-safety: privacy is DISPLAY-only — a seal never depends on it ----
   proof.js computes seals from the engine canonical, never from a masked string,
   so a record's seal is identical no matter the (app-level) privacy choice. */
const rec = { id: "R-PV", lender: "نايف", borrower: "سلطان", amountSAR: 1200,
  installments: [{ dueISO: "2026-07-01", amountSAR: 1200 }],
  events: [E.ev("RECORD_SEALED")] };
const seal = PF.buildProofPack(rec, E).seal;
ok(/^[0-9a-f]{64}$/.test(seal), "the seal is a real SHA-256 (golden sealBlock)");
ok(PF.buildProofPack(rec, E).seal === seal, "the seal is independent of any display/privacy layer (byte-safe)");

/* ---- «ما يفعله عهد» — the positive counterpart to «ما لا نفعله» ---- */
ok(Array.isArray(S.SPINE_YES) && S.SPINE_YES.length >= 4, "exposes «ما يفعله عهد» (what عهد DOES)");
ok(S.SPINE_YES.every(x => x.t && x.d), "each «يفعله» item has a title + description");
ok(!/\d/.test(JSON.stringify(S.SPINE_YES)), "the «يفعله» list carries no numbers (a stance, not a score)");
/* on-spine: it must NOT claim lending/judging/scoring/interest */
ok(!/نُقرض|نحكم|فائدة|نُصنّف|درجة ائتمان/.test(JSON.stringify(S.SPINE_YES)), "«يفعله» never claims lending/judging/scoring/interest");

console.log("\n" + "=".repeat(56));
console.log("SETTINGS-DEEPEN: " + pass + " passed, " + fail + " failed");
console.log("=".repeat(56));
process.exit(fail ? 1 : 0);
