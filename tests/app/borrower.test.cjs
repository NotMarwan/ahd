/* ============================================================================
   borrower.test.cjs — TDD for features/borrower.js (F1 «ما عليّ» borrower home).
   The borrower's OWN obligations («عليّ»), dignified + amber (never red, no
   day-counter). Borrower-invokable grace request (fixed enum, adds NOTHING) and
   pay-what-eased (clamped to remaining, conservation exact, integer halalas).
   No score / band / number-as-reputation anywhere. Deterministic — no Date.
============================================================================ */
const assert = require("assert");
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const B = require(path.join(__dirname, "..", "..", "app", "features", "borrower.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");
const M = engine.toMinor;
const ev = engine.ev;

console.log("borrower.test: «ما عليّ» borrower home + grace/pay");

/* ---- deterministic fixtures: the exact runtime record shape (app.js `rec`) ---- */
const AS_OF = "2026-06-21";
const VIEWER = "نايف";
const sealedActive = (n) => [ev("AHD_DRAFTED", { installments: n || 1 }), ev("LENDER_SIGNED"),
  ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")];
const rec = (id, lender, borrower, amountSAR, dueISO, extra) => ({
  id: id, lender: lender, borrower: borrower, amountSAR: amountSAR,
  installments: [{ dueISO: dueISO, amountSAR: amountSAR }],
  events: sealedActive(1).concat(extra || [])
});

/* viewer (نايف) is the BORROWER on FAHD/SULTAN/ABD; the LENDER on CAFE (excluded). */
const R_FAHD = rec("R-FAHD", "فهد", VIEWER, 3000, "2026-07-10");                    // on-track (future due)
const R_SULT = rec("R-SULTAN", "سلطان", VIEWER, 1200, "2026-05-15");                // overdue
const R_ABD = rec("R-ABD", "عبدالله", VIEWER, 600, "2026-06-24");                   // due-soon (within days)
const R_KEPT = rec("R-KEPT", "ريم", VIEWER, 800, "2026-04-01", [ev("ALL_SETTLED")]);// settled → last
const R_CAFE = rec("R-CAFE", VIEWER, "مقهى الحي", 2500, "2026-06-01");              // نايف is LENDER → excluded
const RECORDS = [R_FAHD, R_SULT, R_ABD, R_KEPT, R_CAFE];

/* ============================ obligations ============================ */
const obs = B.borrowerObligations(RECORDS, VIEWER, engine, AS_OF);

/* only «عليّ» debts (viewer is the borrower); the CAFE row (viewer lends) is excluded */
ok(obs.every(o => o.record.borrower === VIEWER), "every obligation is one the viewer OWES (borrower===viewer)");
ok(!obs.some(o => o.record.id === "R-CAFE"), "a debt owed TO the viewer (R-CAFE) is EXCLUDED");
eq(obs.length, 4, "four obligations surfaced (FAHD, SULTAN, ABD, KEPT)");

/* sorted overdue-first; settled last; deterministic */
eq(obs[0].record.id, "R-SULTAN", "overdue debt sorts FIRST");
eq(obs[obs.length - 1].record.id, "R-KEPT", "settled debt sorts LAST");
ok(obs[0].urgencyRank <= obs[1].urgencyRank, "urgencyRank is non-decreasing (overdue→due→open→settled)");
eq(obs[0].urgencyRank, 0, "overdue urgencyRank === 0");
eq(obs[obs.length - 1].urgencyRank, 3, "settled urgencyRank === 3");

/* tie-break by record id: two overdue records with the same rank order by id */
const tieA = rec("R-ZZ", "دائن", VIEWER, 500, "2026-05-01");   // overdue
const tieB = rec("R-AA", "دائن", VIEWER, 500, "2026-05-01");   // overdue, same due
const tied = B.borrowerObligations([tieA, tieB], VIEWER, engine, AS_OF);
eq(tied.map(o => o.record.id).join(","), "R-AA,R-ZZ", "ties broken by record id (stable, deterministic)");

/* obligation carries a remaining (integer halalas) and a status key */
eq(obs.find(o => o.record.id === "R-FAHD").remainingMinor, M(3000), "remainingMinor is integer halalas (3000 → 300000)");
ok(obs.every(o => o.remainingMinor % 1 === 0), "every remainingMinor is an integer (no float)");
ok(typeof obs[0].statusKey === "string" && obs[0].statusKey.length > 0, "each obligation exposes a statusKey");

/* ============================ grace reasons enum ============================ */
eq(B.GRACE_REASONS.length, 4, "GRACE_REASONS has exactly 4 reasons");
const keys = B.GRACE_REASONS.map(r => r.key);
["salary_delay", "medical", "urgent_obligation", "unspecified"].forEach(k =>
  ok(keys.indexOf(k) >= 0, "GRACE_REASONS includes key «" + k + "»"));
ok(B.GRACE_REASONS.every(r => typeof r.ar === "string" && r.ar.length > 0), "each reason carries dignified Arabic copy");
ok(Object.isFrozen(B.GRACE_REASONS), "GRACE_REASONS is frozen (immutable enum)");

/* ============================ graceRequest (adds NOTHING) ============================ */
const g = B.graceRequest(R_FAHD, "salary_delay", AS_OF);
eq(g.type, "GRACE_REQUESTED", "graceRequest → type GRACE_REQUESTED");
eq(g.reasonKey, "salary_delay", "graceRequest carries the chosen reasonKey");
eq(g.atISO, AS_OF, "graceRequest stamps the fixed asOf (deterministic, no Date)");
eq(B.graceRequest(R_FAHD, "not_a_real_key", AS_OF).reasonKey, "unspecified", "unknown reasonKey falls back to «unspecified»");
eq(B.graceRequest(R_FAHD, null, AS_OF).reasonKey, "unspecified", "missing reasonKey falls back to «unspecified»");

/* grace adds NO amount and does NOT change the remaining (fold before == fold after for principal) */
ok(!("amountMinor" in g) && !("amount" in g), "GRACE_REQUESTED carries NO amount field (grace adds nothing)");
const remBefore = B.borrowerObligations([R_FAHD], VIEWER, engine, AS_OF)[0].remainingMinor;
const R_FAHD_graced = Object.assign({}, R_FAHD, { events: R_FAHD.events.concat(g) });
const remAfter = B.borrowerObligations([R_FAHD_graced], VIEWER, engine, AS_OF)[0].remainingMinor;
eq(remAfter, remBefore, "remaining is UNCHANGED after a grace request (no riba, no surcharge)");

/* no penalty/surcharge field may exist on the grace event */
ok(!/penalty|surcharge|fee|غرامة|فائدة/.test(JSON.stringify(g)), "grace event has NO penalty/surcharge/fee/غرامة field");

/* ============================ payWhatEased (clamp + conservation) ============================ */
const p1 = B.payWhatEased(R_FAHD, 99999, engine);   // huge overpay
eq(p1.type, "PRINCIPAL_PAID", "payWhatEased → type PRINCIPAL_PAID");
eq(p1.amountMinor, M(3000), "overpay is CLAMPED to the remaining (3000), never above");
ok(p1.amountMinor <= M(3000), "clamped payment never exceeds the principal remaining");

/* two pays never drive remaining below 0 */
const R1 = Object.assign({}, R_FAHD, { events: R_FAHD.events.concat(B.payWhatEased(R_FAHD, 2000, engine)) });
const rem1 = B.borrowerObligations([R1], VIEWER, engine, AS_OF)[0].remainingMinor;
eq(rem1, M(1000), "after paying 2000 of 3000 → remaining 1000");
const R2 = Object.assign({}, R1, { events: R1.events.concat(B.payWhatEased(R1, 5000, engine)) }); // overpay the rest
const rem2 = B.borrowerObligations([R2], VIEWER, engine, AS_OF)[0].remainingMinor;
eq(rem2, 0, "second (over)payment clamps to remaining → 0, never negative");
ok(rem2 >= 0, "remaining never drops below zero");

/* conservation in integer halalas: paid + remaining == principal (nothing forgiven here) */
const paidTotal = M(2000) + M(1000);   // 2nd pay clamped to the remaining 1000
eq(paidTotal + rem2, M(3000), "conservation: paid + remaining == principal (integer halalas)");

/* bad input is a no-op-safe event (never NaN, never negative) */
const pBad = B.payWhatEased(R_FAHD, "abc", engine);
ok(pBad.type === "PRINCIPAL_PAID" && pBad.amountMinor === 0 && pBad.amountMinor % 1 === 0, "bad amount → safe no-op event (amountMinor 0)");
ok(B.payWhatEased(R_FAHD, -50, engine).amountMinor === 0, "negative amount → clamped to 0 (no negative pay)");

/* ============================ summary (integers, NO score) ============================ */
const sum = B.borrowerSummary(RECORDS, VIEWER, engine, AS_OF);
ok(Number.isInteger(sum.owedCount), "summary.owedCount is an integer");
ok(Number.isInteger(sum.totalRemainingMinor), "summary.totalRemainingMinor is an integer (halalas)");
ok(Number.isInteger(sum.inGraceCount), "summary.inGraceCount is an integer");
eq(sum.owedCount, 3, "owedCount counts only LIVE obligations (3 open; the settled KEPT excluded)");

/* totalRemainingMinor equals the sum of the row remainings */
const sumOfRows = obs.reduce((a, o) => a + o.remainingMinor, 0);
eq(sum.totalRemainingMinor, sumOfRows, "summary.totalRemainingMinor === Σ row remainingMinor");

/* inGraceCount reflects graced obligations */
const gracedRecords = [Object.assign({}, R_SULT, { events: R_SULT.events.concat(ev("GRACE_GRANTED")) }), R_FAHD];
eq(B.borrowerSummary(gracedRecords, VIEWER, engine, AS_OF).inGraceCount, 1, "inGraceCount counts graced obligations");

/* ============================ makeBorrowerView + NO number-reputation ============================ */
const view = B.makeBorrowerView(RECORDS, VIEWER, engine, AS_OF);
ok(Array.isArray(view.rows) && view.rows.length === 4, "makeBorrowerView.rows is the 4 obligations");
ok(view.summary && Number.isInteger(view.summary.totalRemainingMinor), "makeBorrowerView.summary carries integer totals");

/* the spine guard: NO score/band/percent/rating token anywhere in the serialized view */
const serial = JSON.stringify(view);
ok(!/\b(band|score|percent|rating)\b/i.test(serial), "serialized view has NO band/score/percent/rating KEY OR VALUE");
ok(serial.indexOf("٪") < 0 && serial.indexOf("%") < 0, "serialized view has NO percent glyph (٪ / %)");

/* determinism: two identical calls are deep-equal */
assert.deepStrictEqual(B.makeBorrowerView(RECORDS, VIEWER, engine, AS_OF),
  B.makeBorrowerView(RECORDS, VIEWER, engine, AS_OF));
ok(true, "makeBorrowerView is deterministic (two calls deep-equal)");
assert.deepStrictEqual(B.borrowerObligations(RECORDS, VIEWER, engine, AS_OF),
  B.borrowerObligations(RECORDS, VIEWER, engine, AS_OF));
ok(true, "borrowerObligations is deterministic (two calls deep-equal)");

/* no day-counter is surfaced to the borrower (amber, not a red countdown) */
ok(!/daysOverdue|dayCount|countdown/.test(JSON.stringify(view.rows.map(r => Object.keys(r)))), "no daysOverdue/countdown key exposed on borrower rows");

console.log("\n========================================================");
console.log("BORROWER: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
