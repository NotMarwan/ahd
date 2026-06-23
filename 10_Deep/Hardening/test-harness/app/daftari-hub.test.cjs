/* ============================================================================
   daftari-hub.test.cjs — TDD for the «دفتري becomes the hub» deepening:
   grouped ledger, exact net reconciliation (integer halalas), and filtering.
   Pure logic over the parity-proven engine. Deterministic, fixed AS_OF.
============================================================================ */
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "engine.js"));
const D = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "features", "daftari.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

const AS_OF = "2026-06-21";
const ev = engine.ev;
const sealedActive = [ev("AHD_DRAFTED", { installments: 1 }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")];
const rec = (id, lender, borrower, amountSAR, dueISO, events) => ({ id, lender, borrower, amountSAR, installments: [{ dueISO, amountSAR }], events: events || sealedActive });

const cafe = rec("R-CAFE", "نايف", "مقهى الحي", 2500, "2026-06-01");                  // overdue
const sultan = rec("R-SULTAN", "نايف", "سلطان", 1200, "2026-05-15");                   // overdue
const abdullah = rec("R-ABD", "نايف", "عبدالله", 600, "2026-07-01");                   // active/future
const fahd = rec("R-FAHD", "فهد", "نايف", 3000, "2026-07-10");                         // I owe
const kept = rec("R-KEPT", "نايف", "ريم", 800, "2026-04-01", sealedActive.concat(ev("ALL_SETTLED")));  // closed
const disputed = rec("R-DISP", "نايف", "ماجد", 900, "2026-05-20", sealedActive.concat(ev("DISPUTE_RAISED"))); // disputed
const ALL = [cafe, sultan, abdullah, fahd, kept, disputed];
const led = D.buildLedger(ALL, "نايف", engine, AS_OF);

console.log("daftari-hub.test: grouped + reconciling ledger");

/* ---- groupLedger: dignified sections, sorted, empty omitted ---- */
ok(typeof D.groupLedger === "function", "groupLedger exists");
const g = D.groupLedger(led.owedToMe);
const keys = g.map(s => s.key);
eq(keys.join(","), "overdue,disputed,active,closed", "sections in dignified order (overdue→disputed→active→closed)");
g.forEach(s => ok(typeof s.label === "string" && s.label.length > 0, "section «" + s.key + "» has a label"));
const overdue = g.find(s => s.key === "overdue");
eq(overdue.rows[0].id, "R-SULTAN", "overdue section keeps sort: most-overdue (سلطان) first");
eq(overdue.rows.length, 2, "overdue section has café + سلطان");
ok(!/متأخّر.*\d|يومًا/.test(overdue.label), "overdue label stays dignified (no day-counter in the label)");
eq(g.find(s => s.key === "disputed").rows.length, 1, "disputed section isolates the dispute (ماجد)");
eq(g.find(s => s.key === "active").rows[0].id, "R-ABD", "active section holds the on-track عهد (عبدالله)");
eq(g.find(s => s.key === "closed").rows[0].id, "R-KEPT", "closed section holds the kept عهد (ريم)");
/* empty sections omitted */
const gOwe = D.groupLedger(led.iOwe);
ok(gOwe.every(s => s.rows.length > 0), "no empty sections are emitted");
eq(D.groupLedger([]).length, 0, "empty ledger side → no sections");

/* every row appears exactly once across sections (no loss/dupe) */
const flat = g.reduce((a, s) => a.concat(s.rows.map(r => r.id)), []);
eq(flat.length, led.owedToMe.length, "grouping preserves every row (no loss)");
eq(new Set(flat).size, flat.length, "grouping never duplicates a row");

/* ---- netPosition: exact reconciliation in integer halalas ---- */
ok(typeof D.netPosition === "function", "netPosition exists");
const net = D.netPosition(led, engine);
const liveMe = 2500 + 1200 + 600 + 900;   // KEPT excluded
const liveOn = 3000;
eq(net.meMinor, engine.toMinor(liveMe), "meMinor = sum of LIVE owed-to-me (KEPT excluded)");
eq(net.onMinor, engine.toMinor(liveOn), "onMinor = sum of LIVE I-owe");
eq(net.netMinor, net.meMinor - net.onMinor, "netMinor reconciles EXACTLY (integer halalas)");
eq(net.side, "lak", "side = lak when owed-to-me exceeds I-owe");
eq(net.netSAR, Math.abs(net.meMinor - net.onMinor) / 100, "netSAR is |net| in riyals");
ok(Number.isInteger(net.meMinor) && Number.isInteger(net.onMinor) && Number.isInteger(net.netMinor), "all net figures are integer halalas (no float money)");

/* balanced + alayk sides */
const balLed = D.buildLedger([rec("A", "نايف", "س", 1000, "2026-07-01"), rec("B", "ع", "نايف", 1000, "2026-07-01")], "نايف", engine, AS_OF);
eq(D.netPosition(balLed, engine).side, "balanced", "equal both ways → balanced");
const oweLed = D.buildLedger([rec("C", "ع", "نايف", 5000, "2026-07-01")], "نايف", engine, AS_OF);
eq(D.netPosition(oweLed, engine).side, "alayk", "only-I-owe → alayk");
eq(D.netPosition(D.buildLedger([], "نايف", engine, AS_OF), engine).netMinor, 0, "empty ledger → net 0");

/* ---- filterRows: total, pure ---- */
ok(typeof D.filterRows === "function", "filterRows exists");
eq(D.filterRows(led.owedToMe, "all").length, led.owedToMe.length, "filter all → everything");
eq(D.filterRows(led.owedToMe, "overdue").length, 2, "filter overdue → 2");
eq(D.filterRows(led.owedToMe, "disputed").length, 1, "filter disputed → 1");
eq(D.filterRows(led.owedToMe, "kept").length, 1, "filter kept → 1 (closed)");
eq(D.filterRows(led.owedToMe, "active").length, 1, "filter active → 1 (عبدالله: live, non-overdue, non-disputed)");
eq(D.filterRows(led.owedToMe, "nonsense").length, led.owedToMe.length, "unknown filter is a safe no-op (returns all)");
ok(D.filterRows([], "overdue").length === 0, "empty input → empty (no throw)");

/* ---- code-review fix: summaryTiles sums INTEGER halalas (no float drift) ----
   a 1,000 SAR loan over 3 installments leaves non-integer remainders (666.67…);
   float accumulation would drift — the total must be exact. */
const fakeLedger = { owedToMe: [
  { remainingSAR: 0.1, statusKey: "ACTIVE" },
  { remainingSAR: 0.2, statusKey: "ACTIVE" }
], iOwe: [] };
eq(D.summaryTiles(fakeLedger).me.amountSAR, 0.3, "summaryTiles sums integer halalas EXACTLY (0.10 + 0.20 == 0.30, no float drift)");

/* ---- determinism ---- */
eq(JSON.stringify(D.groupLedger(led.owedToMe)), JSON.stringify(D.groupLedger(led.owedToMe)), "groupLedger is deterministic");

console.log("\n========================================================");
console.log("DAFTARI-HUB: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
