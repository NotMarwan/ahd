/* ============================================================================
   settings.test.cjs — «الإعدادات» Arabic-Indic digit layer (resolves D-2 as a
   user choice, not a unilateral call). A pure, deterministic display map applied
   app-wide on TOP of the engine's golden fmt() — the engine bytes never change;
   only the rendered glyphs do. Default stays Western (engine-consistent).
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const S = require(P("features", "settings.js"));

let pass = 0, fail = 0;
const ok = (c, m, d) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m + (d ? "  — " + d : "")); } };

console.log("settings.test: the Arabic-Indic digit layer (D-2)\n");

/* ---- the digit map: 0-9 → ٠-٩, everything else untouched ---- */
ok(S.toArabicDigits("0123456789") === "٠١٢٣٤٥٦٧٨٩", "maps each Western digit to its Arabic-Indic glyph");
ok(S.toArabicDigits("1,200") === "١,٢٠٠", "keeps the grouping comma, maps the digits (1,200 → ١,٢٠٠)");
ok(S.toArabicDigits("5,000 ر.س") === "٥,٠٠٠ ر.س", "leaves Arabic letters/units intact");
ok(S.toArabicDigits("abc-XYZ") === "abc-XYZ", "non-digit text is unchanged");
ok(S.toArabicDigits("") === "", "empty string → empty string");

/* ---- applyDigits gates on the mode ---- */
ok(S.applyDigits("9,500", "western") === "9,500", "western mode is a pure pass-through (engine-consistent default)");
ok(S.applyDigits("9,500", "arabic") === "٩,٥٠٠", "arabic mode maps the digits");
ok(S.applyDigits("9,500", undefined) === "9,500", "unknown/undefined mode defaults to western (safe)");

/* ---- deterministic + reversible round-trip via the inverse ---- */
ok(S.applyDigits("2026", "arabic") === S.applyDigits("2026", "arabic"), "applyDigits is deterministic");
ok(S.toArabicDigits(S.toArabicDigits("42")) === S.toArabicDigits("42"), "idempotent on already-mapped output (no double-map corruption)");

/* ---- the «ما لا نفعله» manifesto content (on-spine, testable) ---- */
ok(Array.isArray(S.SPINE_NO) && S.SPINE_NO.length === 4, "exposes the «ما لا نفعله» manifesto (4 pillars)");
ok(S.SPINE_NO.every(x => x.t && x.d), "each manifesto pillar has a title + description");
ok(!/\d/.test(JSON.stringify(S.SPINE_NO)), "the manifesto carries no numbers (it's a stance, not a score)");

console.log("\n" + "=".repeat(56));
console.log("SETTINGS: " + pass + " passed, " + fail + " failed");
console.log("=".repeat(56));
process.exit(fail ? 1 : 0);
