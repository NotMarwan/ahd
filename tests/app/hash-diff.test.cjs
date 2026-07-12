/* ============================================================================
   hash-diff.test.cjs — TDD for the pure hex-nibble diff (Front C, technical).
   The judge-driven tamper shows the recomputed seal beside the original with the
   DIVERGING characters highlighted — so an engineer-judge sees the avalanche,
   not a color word. Pure + deterministic; null-safe; unequal-length-safe.
============================================================================ */
const path = require("path");
const HashDiff = require(path.join(__dirname, "..", "..", "app", "features", "hash-diff.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eqA = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), m + "  (got " + JSON.stringify(a) + ")");

console.log("hash-diff.test: diverging hex nibbles for the judge-driven tamper (Front C)");

eqA(HashDiff.diverging("abcd", "abce"), [3], "one differing nibble at the end");
eqA(HashDiff.diverging("0000", "ffff"), [0, 1, 2, 3], "all four nibbles differ");
eqA(HashDiff.diverging("deadbeef", "deadbeef"), [], "identical → no divergence");
eqA(HashDiff.diverging("abc", "abcdef"), [3, 4, 5], "unequal length → the extra tail counts as changed");

const s = HashDiff.spans("abce", [3]);
ok(s.length === 4, "spans covers every character");
ok(s[3].changed === true && s[0].changed === false, "spans marks only the diverging nibble");
ok(s[3].ch === "e", "spans carries the character for rendering");

ok(HashDiff.count("00", "0f") === 1, "count returns how many nibbles moved");
ok(Array.isArray(HashDiff.diverging(null, undefined)) && HashDiff.diverging(null, undefined).length === 0, "null-safe");

console.log("\nhash-diff: " + pass + "/" + (pass + fail) + (fail ? "  (" + fail + " FAILED)" : ""));
process.exit(fail ? 1 : 0);
