/* ============================================================================
   proof-provenance.test.cjs — TDD for the DEEPENED حافظة الإثبات: structured
   provenance + a precise tamper report (names the changed field + diverging
   hashes). Reuses the GOLDEN sha256/sealBlock/GENESIS — never alters them.
   Deterministic, integer halalas, no score.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const E = require(P("engine.js"));
const PF = require(P("features", "proof.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

const ev = (t, x) => Object.assign({ type: t }, x || {});
const sealed = [ev("AHD_DRAFTED", { installments: 3 }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")];
const record = {
  id: "R-PROV", lender: "نايف", borrower: "سلطان", amountSAR: 1200,
  installments: [{ dueISO: "2026-07-01", amountSAR: 400 }, { dueISO: "2026-08-01", amountSAR: 400 }, { dueISO: "2026-09-01", amountSAR: 400 }],
  events: sealed
};

console.log("proof-provenance.test: provenance + precise tamper report");

/* ---- provenance: structured, display-ready, integer halalas ---- */
ok(typeof PF.provenance === "function", "provenance exists");
const pv = PF.provenance(record, E);
eq(pv.lender, "نايف", "provenance carries the lender");
eq(pv.borrower, "سلطان", "provenance carries the borrower");
eq(pv.principalMinor, E.toMinor(1200), "principal is integer halalas (1200 → 120000)");
ok(Number.isInteger(pv.principalMinor), "principalMinor is an integer (no float money)");
eq(pv.schedule.length, 3, "provenance carries the full 3-installment schedule");
ok(pv.schedule.every(s => Number.isInteger(s.amountMinor)), "every schedule amount is integer halalas");
ok(/2:282/.test(pv.basis), "provenance cites the basis verse (2:282 — write the debt)");
ok(/نفاذ|Nafath/i.test(pv.witnessedVia) && /SHA-?256/i.test(pv.witnessedVia), "provenance names how it was witnessed (نفاذ + SHA-256)");
eq(pv.contentHash, PF.buildProofPack(record, E).contentHash, "provenance content hash matches the proof pack (same canonical)");
ok(/false/.test(JSON.stringify(pv.riba || "")), "provenance asserts the riba-free flags");
ok(!/\d{1,3}\s*[%٪]/.test(JSON.stringify(pv)), "no percentage/score in the provenance (money only)");
ok(JSON.stringify(PF.provenance(record, E)) === JSON.stringify(pv), "provenance is deterministic");

/* ---- tamperReport: names the changed field + shows diverging hashes/seals ---- */
ok(typeof PF.tamperReport === "function", "tamperReport exists");
const clean = PF.tamperReport(record, E);
eq(clean.ok, true, "untouched record → ok (seal matches)");
eq(clean.before, clean.after, "untouched → before == after");
eq(clean.hashBefore, clean.hashAfter, "untouched → content hash unchanged");
eq(clean.sealBefore, clean.sealAfter, "untouched → seal unchanged");

const bad = PF.tamperReport(record, E, 9999);
eq(bad.ok, false, "tampered amount → NOT ok (seal breaks)");
eq(bad.field, "principal", "tamperReport names the changed field (principal)");
eq(bad.before, 1200, "tamperReport shows the original amount");
eq(bad.after, 9999, "tamperReport shows the tampered amount");
ok(bad.hashBefore !== bad.hashAfter, "tampering diverges the content hash");
ok(bad.sealBefore !== bad.sealAfter, "tampering diverges the block seal");
ok(/^[0-9a-f]{64}$/.test(bad.hashAfter), "the recomputed hash is a real SHA-256");
ok(JSON.stringify(PF.tamperReport(record, E, 9999)) === JSON.stringify(bad), "tamperReport is deterministic");

/* ---- golden reuse: the seal equals the golden sealBlock over GENESIS ---- */
eq(clean.sealBefore, E.sealBlock(E.GENESIS, clean.hashBefore, 1), "seal is the GOLDEN sealBlock(GENESIS, contentHash, 1) — reused, not reinvented");

console.log("\n========================================================");
console.log("PROOF-PROVENANCE: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
