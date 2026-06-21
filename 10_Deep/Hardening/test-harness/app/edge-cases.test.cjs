/* ============================================================================
   edge-cases.test.cjs — degenerate-input robustness for the feature modules.
   Proves the new logic degrades gracefully (empty ledgers, settled loans, empty
   tangles, no-member splits) without crashing or violating conservation.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", ...p);
const E = require(P("engine.js"));
const D = require(P("features", "daftari.js"));
const OL = require(P("features", "open-loan.js"));
const CA = require(P("features", "circle-adv.js"));
const CR = require(P("features", "create.js"));
const S = require(P("features", "settlement.js"));
const M = E.toMinor;

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");
const noThrow = (fn, m) => { try { fn(); ok(true, m); } catch (e) { ok(false, m + " — " + (e && e.message)); } };

console.log("edge-cases.test: degenerate-input robustness");

/* دفتري — empty ledger */
const empty = D.buildLedger([], "نايف", E, "2026-06-21");
eq(empty.owedToMe.length, 0, "empty records → empty owedToMe");
eq(empty.iOwe.length, 0, "empty records → empty iOwe");
const et = D.summaryTiles(empty);
eq(et.me.amountSAR, 0, "empty ledger → tile me = 0");
eq(et.on.count, 0, "empty ledger → tile on count = 0");
eq(D.canSendReminder({ statusKey: "ACTIVE", isOverdue: false }, [], "2026-06-21").allowed, false, "not-overdue row → no reminder");
eq(D.selfBand([], false, E).band, "new", "no history → band «new» (never throws on empty)");

/* القرض المفتوح — a fully-settled loan clamps further actions to 0 */
let loan = OL.makeOpenLoan({ id: "X", lender: "أ", borrower: "ب", amountSAR: 1000 });
loan = Object.assign({}, loan, { events: loan.events.concat(E.ev("ALL_SETTLED")) });
eq(OL.foldOpenLoan(loan).remainingMinor, 0, "settled open loan → remaining 0");
eq(OL.payEvent(loan, 500, E).amountMinor, 0, "paying a settled loan clamps to 0 (no negative remaining)");
eq(OL.forgiveEvent(loan, 500, E).amountMinor, 0, "forgiving a settled loan clamps to 0");

/* الدائرة+ — empty/degenerate splits stay conserved */
const bc0 = CA.byCategorySplit([], [], E);
eq(bc0.totalMinor, 0, "no items → total 0");
eq(bc0.conserved, true, "no items → trivially conserved");
eq(CA.recurringPosts({ members: ["أ"], amountMinor: M(100), payer: "أ" }, []).length, 0, "no cycle keys → no posts");
const ps1 = CA.pledgeSketch({ name: "x", goalMinor: M(500) }, ["أ"], E);
eq(ps1.pledges.length, 1, "single-member pledge sketch → 1 pledge");
eq(ps1.pledges[0].amountMinor, M(500), "single member pledges the whole goal");

/* المقاصّة — empty tangle is well-formed + conserved */
const sv0 = S.settlementView([], E);
eq(sv0.beforeCount, 0, "empty tangle → 0 before");
eq(sv0.afterCount, 0, "empty tangle → 0 transfers");
eq(sv0.conserved, true, "empty tangle → conserved (Σ 0)");
noThrow(() => S.settlementView([], E), "settlementView([]) does not throw");

/* create — empty terms read clean; single-installment schedule */
eq(CR.ribaCheck("", E).verdict, "clean", "empty terms → clean (no false positive)");
const d1 = CR.makeDraft({ id: "Y", lender: "أ", borrower: "ب", amountSAR: 500, months: 1 });
eq(CR.draftSchedule(d1, E).length, 1, "months=1 → a single installment");
eq(CR.toDaftariRecord(d1, E).amountSAR, 500, "created record flows its amount through");

console.log("\n========================================================");
console.log("EDGE-CASES: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
