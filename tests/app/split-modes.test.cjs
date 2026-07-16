const path = require("path");
let SM, Split;
try {
  SM = require(path.join(__dirname, "..", "..", "app", "features", "split-modes.js"));
  Split = require(path.join(__dirname, "..", "..", "app", "features", "split.js"));
} catch (e) { console.log("SPLITMODES RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));

const P = ["أنت", "سالم", "نورة"];

/* exact mode: caller supplies minor amounts, must sum to the total */
const ex = SM.make({ mode: "exact", totalMinor: 10000, payer: "أنت", participants: P, values: [5000, 3000, 2000] });
ok(ex.shares.map(s => s.amountMinor).join(",") === "5000,3000,2000", "exact mode keeps the supplied amounts");
ok(ex.qaidDrafts.length === 2 && ex.qaidDrafts.every(d => d.name !== "أنت"), "payer excluded from qaid drafts (exact)");
const exBad = SM.validate({ mode: "exact", totalMinor: 10000, payer: "أنت", participants: P, values: [5000, 3000, 1000] });
ok(exBad.ok === false && exBad.errorAr.indexOf("المجموع لا يساوي الأصل") >= 0, "exact validate rejects a sum mismatch with a clear Arabic error");

/* percent mode: integer percents summing to 100, halala-conserving largest remainder */
const pc = SM.make({ mode: "percent", totalMinor: 10001, payer: "أنت", participants: P, values: [33, 33, 34] });
ok(pc.shares.reduce((a, s) => a + s.amountMinor, 0) === 10001, "percent mode conserves every halala on 33/33/34 of 10001");
const pcBad = SM.validate({ mode: "percent", totalMinor: 10000, payer: "أنت", participants: P, values: [33, 33, 33] });
ok(pcBad.ok === false && pcBad.errorAr.indexOf("100") >= 0, "percent validate rejects sums ≠ 100");

/* shares mode: positive integer weights, proportional + largest remainder */
const sh = SM.make({ mode: "shares", totalMinor: 6000, payer: "أنت", participants: P, values: [1, 2, 3] });
ok(sh.shares.map(s => s.amountMinor).join(",") === "1000,2000,3000", "shares 1/2/3 of 6000 → 1000/2000/3000");
ok(sh.shares.reduce((a, s) => a + s.amountMinor, 0) === 6000, "shares mode conserves the total");
const shOdd = SM.make({ mode: "shares", totalMinor: 10001, payer: "أنت", participants: P, values: [1, 1, 1] });
ok(shOdd.shares.reduce((a, s) => a + s.amountMinor, 0) === 10001, "shares mode conserves on an odd total (largest remainder)");

/* equal mode delegates to the existing Split.makeSplit exactly */
const eq = SM.make({ mode: "equal", totalMinor: 48001, payer: "أنت", participants: P });
const eqRef = Split.makeSplit({ totalMinor: 48001, payer: "أنت", participants: P });
ok(JSON.stringify(eq.shares) === JSON.stringify(eqRef.shares), "equal mode delegates to Split.makeSplit byte-for-byte");

/* validate never throws — always {ok} or {ok:false, errorAr} */
const vUnknown = SM.validate({ mode: "wat", totalMinor: 100, payer: "أ", participants: ["أ", "ب"], values: [] });
ok(vUnknown.ok === false && vUnknown.errorAr.length > 0, "unknown mode → Arabic error, no exception");
const vNeg = SM.validate({ mode: "exact", totalMinor: 100, payer: "أ", participants: ["أ", "ب"], values: [200, -100] });
ok(vNeg.ok === false, "negative share rejected");
const vOk = SM.validate({ mode: "percent", totalMinor: 10000, payer: "أنت", participants: P, values: [50, 25, 25] });
ok(vOk.ok === true, "a correct spec validates ok");

/* determinism */
ok(JSON.stringify(SM.make({ mode: "percent", totalMinor: 10001, payer: "أنت", participants: P, values: [33, 33, 34] })) === JSON.stringify(pc), "deterministic output");

console.log(`\nSPLITMODES: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
