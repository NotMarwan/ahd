/* ============================================================================
   daftari.test.cjs — TDD for project/ahd-app/features/daftari.js (pure logic).
   Reuses the parity-proven engine. Deterministic: fixed AS_OF, no Date.now.
============================================================================ */
const assert = require("assert");
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "engine.js"));
const D = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "features", "daftari.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

const AS_OF = "2026-06-21";
const ev = engine.ev;
const sealedActive = [ev("AHD_DRAFTED",{installments:1}),ev("LENDER_SIGNED"),ev("COUNTERPARTY_SIGNED"),ev("RECORD_SEALED"),ev("ACTIVATED")];
const rec = (id, lender, borrower, amountSAR, dueISO, events, installments) => ({
  id, lender, borrower, amountSAR,
  installments: installments || [{ dueISO, amountSAR }],
  events: events || sealedActive
});

/* Naif's real ledger (from journey.md), deterministic */
const cafe   = rec("R-CAFE","نايف","مقهى الحي",2500,"2026-06-01");                 // overdue 20d
const sultan = rec("R-SULTAN","نايف","سلطان",1200,"2026-05-15");                    // overdue 37d
const abdullah = rec("R-ABD","نايف","عبدالله",600,"2026-07-01");                    // on-track (future)
const fahd   = rec("R-FAHD","فهد","نايف",3000,"2026-07-10");                        // Naif OWES (عليّ)
const keptOne = rec("R-KEPT","نايف","ريم",800,"2026-04-01",
  sealedActive.concat(ev("SETTLEMENT_SETTLED")));                                   // KEPT (1/1)
const disputed = rec("R-DISP","نايف","ماجد",900,"2026-05-20",
  sealedActive.concat(ev("DISPUTE_RAISED")));                                       // DISPUTED
const graced = rec("R-GRACE","نايف","تركي",1000,"2026-05-10",
  sealedActive.concat(ev("GRACE_GRANTED")));                                        // rescheduled

const ALL = [cafe, sultan, abdullah, fahd, keptOne, disputed, graced];

console.log("daftari.test: creditor-home pure logic");

/* --- civil-days math (deterministic, no Date) --- */
eq(D.daysBetween("2026-06-21","2026-06-01"), 20, "daysBetween same-month = 20");
eq(D.daysBetween("2026-06-21","2026-05-15"), 37, "daysBetween cross-month = 37");
eq(D.daysBetween("2026-01-01","2025-12-31"), 1, "daysBetween cross-year = 1");
eq(D.daysBetween("2024-03-01","2024-02-28"), 2, "daysBetween leap-year Feb = 2");
eq(D.daysBetween("2026-06-01","2026-06-21"), -20, "daysBetween negative when earlier-later swapped");

/* --- rowFor --- */
const rCafe = D.rowFor(cafe, "نايف", engine, AS_OF);
eq(rCafe.counterparty, "مقهى الحي", "café row counterparty");
eq(rCafe.role, "lender", "café row role = lender (owed TO me)");
eq(rCafe.remainingSAR, 2500, "café remaining = full 2500");
eq(rCafe.isOverdue, true, "café is overdue");
eq(rCafe.daysOverdue, 20, "café daysOverdue = 20");
ok(/يونيو/.test(rCafe.nextDueLabel||""), "café due label is in يونيو");
eq(rCafe.chipLabel, "عليه وعدٌ متأخّر", "overdue chip uses warm «عليه وعدٌ متأخّر» (reuses TRUST_BAND_AR, amber)");

const rAbd = D.rowFor(abdullah, "نايف", engine, AS_OF);
eq(rAbd.isOverdue, false, "abdullah not overdue (future due)");
eq(rAbd.daysOverdue, 0, "abdullah daysOverdue = 0");
eq(rAbd.chipLabel, rAbd.status, "non-overdue chip == statusLabel");

const rKept = D.rowFor(keptOne, "نايف", engine, AS_OF);
eq(rKept.statusKey, "KEPT", "kept row statusKey = KEPT");
eq(rKept.remainingSAR, 0, "kept row remaining = 0");
eq(rKept.isOverdue, false, "kept row not overdue");

const rGrace = D.rowFor(graced, "نايف", engine, AS_OF);
eq(rGrace.isOverdue, false, "graced row not overdue (rescheduled, dignified)");
ok(rGrace.status.indexOf("مؤجّل بالتراضي") >= 0, "graced row status = مؤجّل بالتراضي");

const rFahd = D.rowFor(fahd, "نايف", engine, AS_OF);
eq(rFahd.role, "borrower", "fahd row role = borrower (I owe)");
eq(rFahd.counterparty, "فهد", "fahd row counterparty = فهد");

/* --- buildLedger + sort --- */
const led = D.buildLedger(ALL, "نايف", engine, AS_OF);
eq(led.owedToMe.length, 6, "owedToMe has 6 rows (all where نايف is lender)");
eq(led.iOwe.length, 1, "iOwe has 1 row (فهد)");
eq(led.owedToMe[0].id, "R-SULTAN", "sort: most-overdue (سلطان, 37d) first");
eq(led.owedToMe[1].id, "R-CAFE", "sort: next-overdue (café, 20d) second");
eq(led.owedToMe[led.owedToMe.length-1].id, "R-KEPT", "sort: settled (KEPT) last");

/* --- summaryTiles (live debts only) --- */
const tiles = D.summaryTiles(led);
eq(tiles.me.amountSAR, 2500+1200+600+900+1000, "tile «لك عند الناس» sums LIVE owed (excl. KEPT)");
eq(tiles.me.count, 5, "tile «لي» count = 5 live (KEPT excluded)");
eq(tiles.on.amountSAR, 3000, "tile «عليك للناس» = 3000");
eq(tiles.on.count, 1, "tile «عليّ» count = 1");

/* --- reminder templates: warm, bank-sent, NO day-counter (dignity guard) --- */
const t1 = D.reminderTemplate(1, { creditor:"نايف", amountSAR:2500, dueLabel:"١ يونيو" });
ok(t1.indexOf("نايف") >= 0, "Tier1 names the creditor as a fact");
ok(t1.indexOf("عهد") >= 0, "Tier1 sent from «عهد» (neutral witness)");
ok(t1.indexOf(engine.fmt(2500)) >= 0, "Tier1 carries the ORIGINAL amount (2,500)");
ok(t1.indexOf("بلا أيّ زيادة") >= 0, "Tier1 states zero surcharge");
ok(t1.indexOf("متأخّر") < 0 && t1.indexOf("يومًا") < 0, "Tier1 has NO day-counter to the debtor (dignity)");
const t2 = D.reminderTemplate(2, { creditor:"نايف", amountSAR:2500, dueLabel:"١ يونيو" });
ok(t2.indexOf("نظرةٌ إلى ميسرة") >= 0, "Tier2 carries 2:280 mercy ayah");
ok(t2.indexOf("متأخّر") < 0 && t2.indexOf("يومًا") < 0, "Tier2 has NO day-counter either");

/* --- canSendReminder: finite, merciful cadence ladder --- */
eq(D.canSendReminder(rCafe, [], AS_OF).nextTier, 1, "overdue + no history → Tier1 allowed");
eq(D.canSendReminder(rAbd, [], AS_OF).allowed, false, "on-track row → reminder hidden");
eq(D.canSendReminder(rCafe, [{tier:1, atISO:"2026-06-20"}], AS_OF).allowed, false, "Tier1 sent yesterday → cooldown blocks");
eq(D.canSendReminder(rCafe, [{tier:1, atISO:"2026-06-01"}], AS_OF).nextTier, 2, "Tier1 sent 20d ago → Tier2 allowed");
eq(D.canSendReminder(rCafe, [{tier:1, atISO:"2026-06-01"},{tier:2, atISO:"2026-06-15"}], AS_OF).allowed, false, "after Tier2 → STOP, hand back to Naif");
eq(D.canSendReminder(D.rowFor(disputed,"نايف",engine,AS_OF), [], AS_OF).allowed, false, "DISPUTED → reminders paused (عهد لا يحكم)");

console.log("\n========================================================");
console.log("DAFTARI: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
