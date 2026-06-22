/* ============================================================================
   new-features-edge.test.cjs — degenerate-input hardening for the Phase-2 NEW
   features (timeline · proof · dispute · settings). Mirrors edge-cases.test.cjs:
   feed every new module the nasty inputs (empty / missing fields / no-op amounts)
   and assert it stays graceful, deterministic, and ON-SPINE (no penalty, no score).
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", ...p);
const E = require(P("engine.js"));
const T = require(P("features", "timeline.js"));
const PF = require(P("features", "proof.js"));
const DP = require(P("features", "dispute.js"));
const S = require(P("features", "settings.js"));

let pass = 0, fail = 0;
const ok = (c, m, d) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m + (d ? "  — " + d : "")); } };
const noThrow = (fn, m) => { try { const r = fn(); ok(true, m); return r; } catch (e) { ok(false, m, e && e.message); } };
const ev = (t, x) => Object.assign({ type: t }, x || {});

console.log("new-features-edge.test: degenerate-input hardening\n");

/* ---- timeline ---- */
ok(JSON.stringify(T.buildTimeline([], {}, E, "نايف", "2026-06-21")) === "[]", "timeline: empty ledger → []");
ok(JSON.stringify(T.buildTimeline([{ id: "X", lender: "أ", borrower: "ب", amountSAR: 100, events: [] }], {}, E, "أ", "2026-06-21")) === "[]", "timeline: a record with no significant events → no entries");
const tNoInst = noThrow(() => T.buildTimeline([{ id: "Y", lender: "نايف", borrower: "ريم", amountSAR: 50, events: [ev("RECORD_SEALED")] }], {}, E, "نايف", "2026-06-21"), "timeline: record with NO installments/dueISO does not throw");
ok(Array.isArray(tNoInst) && tNoInst.length === 1 && tNoInst[0].dueISO === "", "timeline: missing dueISO degrades to empty dueISO (still one sealed entry)");
const tOther = T.buildTimeline([{ id: "Z", lender: "خالد", borrower: "فهد", amountSAR: 70, installments: [{ dueISO: "2026-09-01", amountSAR: 70 }], events: [ev("RECORD_SEALED")] }], {}, E, "نايف", "2026-06-21");
ok(/خالد/.test(tOther[0].who) && /فهد/.test(tOther[0].who), "timeline: viewer is neither party → shows both names");
ok(JSON.stringify(T.timelineCounts([])) === JSON.stringify({ sealed: 0, kept: 0, mercy: 0, neutral: 0, amber: 0 }), "timeline: counts of [] are all zero");

/* ---- proof ---- */
const openRec = { id: "OPEN-X", lender: "منيرة", borrower: "ماجد", amountSAR: 20000, installments: [{ dueISO: null, amountSAR: 20000 }], events: [ev("RECORD_SEALED")] };
const op = noThrow(() => PF.buildProofPack(openRec, E), "proof: open-term record (dueISO null) builds a pack");
ok(/schedule=1:open:/.test(op.canonical), "proof: a null-due installment serialises as «open» in the canonical");
ok(/^[0-9a-f]{64}$/.test(op.seal), "proof: open record still yields a valid 64-hex seal");
const same = PF.verifyProof(openRec, E, 20000);
ok(same.ok === true, "proof: 'tampering' to the SAME amount is not tampering → still ✓");
const diff = PF.verifyProof(openRec, E, 1);
ok(diff.ok === false, "proof: any real amount change → ✗");
ok(PF.buildProofPack(openRec, E).seal === PF.buildProofPack(openRec, E).seal, "proof: deterministic on the same record");
ok(PF.buildProofPack({ id: "E", lender: "أ", borrower: "ب", amountSAR: 0, events: [] }, E).seal.length === 64, "proof: zero-amount, no-installments record still seals (no throw)");

/* ---- dispute ---- */
ok(DP.isDisputed({ events: [] }) === false, "dispute: isDisputed([]) → false");
ok(DP.isDisputed({}) === false, "dispute: isDisputed(no events field) → false (no throw)");
ok(DP.isDisputed(null) === false, "dispute: isDisputed(null) → false (no throw)");
const dv = DP.disputeView({ id: "N", lender: "نورة", borrower: "ماجد", amountSAR: 900, events: [] }, E);
ok(dv.disputed === false && dv.paused === true && dv.noPenalty === true, "dispute: a non-disputed record still yields paused+noPenalty (graceful)");
ok(dv.amountMinor === E.toMinor(900), "dispute: amount is NEVER inflated — no penalty added");
ok(dv.paths.length === 2 && dv.paths.filter(p => p.encouraged).length === 1, "dispute: always exactly 2 paths, صلح the one encouraged");
ok(!/\d{1,3}\s*[%٪]/.test(JSON.stringify(dv)), "dispute: never a percentage/score");

/* ---- settings (Arabic-Indic digit map) ---- */
ok(S.toArabicDigits("1,234,567") === "١,٢٣٤,٥٦٧", "settings: multi-group number maps every digit, keeps commas");
ok(S.applyDigits(null, "arabic") === "", "settings: applyDigits(null) → '' (no throw)");
ok(S.applyDigits(undefined, "western") === "", "settings: applyDigits(undefined) → '' ");
ok(S.toArabicDigits(0) === "٠" && S.toArabicDigits(2026) === "٢٠٢٦", "settings: accepts a number, maps its digits");
ok(S.applyDigits("9", "arabic") === S.applyDigits("9", "arabic"), "settings: deterministic");
ok(S.toArabicDigits("ر.س ٥٠٠ + 500") === "ر.س ٥٠٠ + ٥٠٠", "settings: idempotent on mixed (already-Arabic stays, western converts)");

console.log("\n" + "=".repeat(56));
console.log("NEW-FEATURES-EDGE: " + pass + " passed, " + fail + " failed");
console.log("=".repeat(56));
process.exit(fail ? 1 : 0);
