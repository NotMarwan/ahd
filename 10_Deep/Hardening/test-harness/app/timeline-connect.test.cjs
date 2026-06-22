/* ============================================================================
   timeline-connect.test.cjs — TDD for «سِجلّ الشهادة» as the CONNECTIVE TISSUE:
   richer event model + per-عهد story grouping + connective links (proof/dispute/
   record). On-spine: witness not judge, amber not red, no score, integer halalas.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", ...p);
const E = require(P("engine.js"));
const T = require(P("features", "timeline.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

const ev = (t, x) => Object.assign({ type: t }, x || {});
const sealed = () => [ev("AHD_DRAFTED", { installments: 1 }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")];
const rec = (id, lender, borrower, amountSAR, dueISO, extra) => ({ id, lender, borrower, amountSAR, installments: [{ dueISO, amountSAR }], events: sealed().concat(extra || []) });
const VIEWER = "نايف", AS_OF = "2026-06-21";

const records = [
  rec("R-KEPT", "نايف", "ريم", 800, "2026-04-01", [ev("ALL_SETTLED")]),
  rec("R-DISP", "نايف", "ماجد", 900, "2026-05-20", [ev("DISPUTE_RAISED")]),
  rec("R-ABD", "نايف", "عبدالله", 600, "2026-07-01"),
  rec("R-MUQ", "نايف", "سعود", 1500, "2026-06-10", [ev("SETTLEMENT_INITIATED"), ev("SETTLEMENT_SETTLED")]), // settled via مقاصّة
  rec("R-PART", "نايف", "تركي", 2000, "2026-06-05", [ev("PARTIAL")])  // partial payment
];
const reminderHistory = { "R-ABD": [{ tier: 1, atISO: "2026-06-21" }] };
const tl = T.buildTimeline(records, reminderHistory, E, VIEWER, AS_OF);

console.log("timeline-connect.test: richer events + per-عهد story + connective links");

/* ---- richer event model: the new types surface with dignified copy ---- */
ok(tl.some(x => x.recordId === "R-MUQ" && /مقاصّة/.test(x.ar) && x.kind === "kept"), "SETTLEMENT_SETTLED → a «kept» entry that names the مقاصّة");
ok(tl.some(x => x.recordId === "R-MUQ" && /مقاصّة|تراض/.test(x.ar) && x.stage === 2), "SETTLEMENT_INITIATED → a settlement-started entry");
ok(tl.some(x => x.recordId === "R-PART" && /جزئيّ|المتبقّي/.test(x.ar)), "PARTIAL → a «سدادٌ جزئيّ» entry");
ok(tl.some(x => x.recordId === "R-PART" && x.tone !== "red"), "partial payment is never red (dignity)");
ok(!tl.some(x => x.tone === "red"), "NO entry is ever red");

/* ---- groupByAhd: one story per عهد, feed order preserved ---- */
ok(typeof T.groupByAhd === "function", "groupByAhd exists");
const groups = T.groupByAhd(tl);
ok(Array.isArray(groups), "groupByAhd returns an array");
ok(groups.length === records.length, "one story group per عهد (" + groups.length + ")");
const ids = groups.map(g => g.recordId);
ok(new Set(ids).size === ids.length, "no عهد is duplicated across groups");
/* coverage: every feed entry belongs to exactly one group */
const totalEntries = groups.reduce((a, g) => a + g.entries.length, 0);
ok(totalEntries === tl.length, "grouping preserves every entry (no loss/dupe)");
/* order preserved: first group is the latest-due عهد (R-ABD due 2026-07-01) */
ok(groups[0].recordId === "R-ABD", "groups keep the feed's due-date order (latest due first)");
/* each group carries the عهد header + an outcome */
const gKept = groups.find(g => g.recordId === "R-KEPT");
ok(gKept && /ريم/.test(gKept.who) && gKept.amountMinor === E.toMinor(800), "group carries who + integer-halala amount");
ok(gKept && gKept.outcome && /محفوظة/.test(gKept.outcome.ar), "group outcome reflects the terminal event (kept → ذمّة محفوظة)");
ok(groups.find(g => g.recordId === "R-DISP").disputed === true, "a disputed عهد's group is flagged disputed");
ok(gKept.kept === true, "a kept عهد's group is flagged kept");
/* entries within a group are ordered latest-stage first (the story reads newest-first) */
const gMuq = groups.find(g => g.recordId === "R-MUQ");
ok(gMuq.entries[0].stage >= gMuq.entries[gMuq.entries.length - 1].stage, "entries within a group are ordered latest-stage first");

/* ---- ahdActions: the connective links ---- */
ok(typeof T.ahdActions === "function", "ahdActions exists");
const aDisp = T.ahdActions(groups.find(g => g.recordId === "R-DISP")).map(a => a.key);
ok(aDisp.indexOf("proof") >= 0, "every story links to its proof-pack (حافظة الإثبات)");
ok(aDisp.indexOf("record") >= 0, "every story links back to the دفتر");
ok(aDisp.indexOf("dispute") >= 0, "a disputed story links to محلّ خلاف");
const aKept = T.ahdActions(gKept).map(a => a.key);
ok(aKept.indexOf("dispute") < 0, "a non-disputed story does NOT offer a dispute link");
ok(T.ahdActions(gKept).every(a => a.label && a.icon && a.key), "each action carries {key,label,icon}");

/* ---- determinism + safety ---- */
ok(JSON.stringify(T.groupByAhd(tl)) === JSON.stringify(T.groupByAhd(tl)), "groupByAhd is deterministic");
ok(JSON.stringify(T.groupByAhd([])) === "[]", "empty feed → no groups (no throw)");
ok(!groups.some(g => /\d{1,3}\s*[%٪]/.test(JSON.stringify(g))), "no percentage/score in any story");

console.log("\n========================================================");
console.log("TIMELINE-CONNECT: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
