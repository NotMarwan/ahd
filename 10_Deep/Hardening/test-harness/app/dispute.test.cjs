/* ============================================================================
   dispute.test.cjs — «محلّ خلاف» (the dispute-pause flow) suite. The only screen
   that DEMONSTRATES the spine pillar "the bank never judges": when a عهد is
   disputed, عهد PAUSES (no reminders, NO penalty ever), preserves the sealed
   record as a NEUTRAL exhibit for both sides, and offers two dignified paths —
   تراضٍ (encouraged) and قضاء (the sealed doc as neutral evidence). «يشهد ولا يحكم».
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", ...p);
const E = require(P("engine.js"));
const DP = require(P("features", "dispute.js"));

let pass = 0, fail = 0;
const ok = (c, m, d) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m + (d ? "  — " + d : "")); } };

console.log("dispute.test: the dispute-pause flow (محلّ خلاف — «يشهد ولا يحكم»)\n");

const ev = (t, x) => Object.assign({ type: t }, x || {});
const base = () => [ev("AHD_DRAFTED", { installments: 1 }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")];
const disputed = { id: "R-DISP", lender: "نايف", borrower: "ماجد", amountSAR: 900, installments: [{ dueISO: "2026-05-20", amountSAR: 900 }], events: base().concat(ev("DISPUTE_RAISED")) };
const plain = { id: "R-OK", lender: "نايف", borrower: "ريم", amountSAR: 800, installments: [{ dueISO: "2026-04-01", amountSAR: 800 }], events: base() };

/* ---- isDisputed detects the DISPUTE_RAISED event ---- */
ok(DP.isDisputed(disputed) === true, "isDisputed → true for a record with DISPUTE_RAISED");
ok(DP.isDisputed(plain) === false, "isDisputed → false for a normal record");

const v = DP.disputeView(disputed, E);

/* ---- the bank pauses + NEVER penalises (spine) ---- */
ok(v.paused === true, "the bank PAUSES while disputed (no reminders)");
ok(v.noPenalty === true, "NO penalty — ever, even in dispute (no riba/غرامة)");
ok(v.amountMinor === E.toMinor(900), "the amount is unchanged — no penalty/extra added (900 SAR, integer halalas)");
ok(Number.isInteger(v.amountMinor), "amountMinor is an integer (no float money)");

/* ---- the bank shows, never judges ---- */
ok(/يشهد ولا يحكم/.test(v.stance), "stance states «عهدٌ يشهد ولا يحكم»");
ok(/لا يقضي|لا يحكم/.test(v.stance), "stance is explicit the bank does NOT rule between them");
ok(v.neutralExhibit && v.neutralExhibit.available === true, "the sealed record stays available as a NEUTRAL exhibit");
ok(/محايد/.test(v.neutralExhibit.ar), "the exhibit is described as neutral (محايد)");

/* ---- two dignified paths; صلح is the encouraged one ---- */
ok(Array.isArray(v.paths) && v.paths.length === 2, "offers exactly two paths");
const keys = v.paths.map(p => p.key);
ok(keys.indexOf("reconcile") >= 0 && keys.indexOf("court") >= 0, "the paths are تراضٍ (reconcile) + قضاء (court)");
ok(v.paths.filter(p => p.encouraged).length === 1, "exactly one path is encouraged");
const rec = v.paths.find(p => p.key === "reconcile");
const court = v.paths.find(p => p.key === "court");
ok(rec.encouraged === true && court.encouraged === false, "تراضٍ is the encouraged path; قضاء is offered, not pushed");
ok(/الصلح خير|صلح/.test(rec.note), "the reconcile path cites ﴿والصلح خير﴾");
ok(/دليل|الإثبات/.test(court.note), "the court path frames the sealed doc as neutral evidence");

/* ---- no score / percentage anywhere (spine) ---- */
ok(!/\d{1,3}\s*[%٪]/.test(JSON.stringify(v)), "no percentage/score anywhere in the dispute view");

/* ---- deterministic ---- */
ok(JSON.stringify(v) === JSON.stringify(DP.disputeView(disputed, E)), "disputeView is deterministic (identical on re-run)");

/* ---- robust: a non-disputed record still yields a coherent (paused-ready) view without throwing ---- */
ok(DP.disputeView(plain, E).disputed === false, "disputeView on a non-disputed record marks disputed:false (no throw)");

console.log("\n" + "=".repeat(56));
console.log("DISPUTE: " + pass + " passed, " + fail + " failed");
console.log("=".repeat(56));
process.exit(fail ? 1 : 0);
