/* ============================================================================
   timeline.test.cjs — «سِجلّ الشهادة» (the witness timeline) pure-logic suite.
   The bank WITNESSES → the timeline is that witness made human: one feed of the
   significant, witnessed events across all the viewer's عهود. On-spine:
   late = amber (never red), disputes are NEUTRAL (bank shows, never judges),
   no score / no %, deterministic, integer halalas.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const E = require(P("engine.js"));
const T = require(P("features", "timeline.js"));

let pass = 0, fail = 0;
const ok = (c, m, d) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m + (d ? "  — " + d : "")); } };

console.log("timeline.test: the witness timeline (سِجلّ الشهادة)\n");

/* ---- deterministic fixtures (records like app.js seeds) ---- */
const ev = (t, x) => Object.assign({ type: t }, x || {});
const sealed = () => [ev("AHD_DRAFTED", { installments: 1 }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")];
const rec = (id, lender, borrower, amountSAR, dueISO, extra) => ({
  id, lender, borrower, amountSAR,
  installments: [{ dueISO, amountSAR }],
  events: sealed().concat(extra || [])
});
const VIEWER = "نايف";
const records = [
  rec("R-KEPT", "نايف", "ريم", 800, "2026-04-01", [ev("ALL_SETTLED")]),         // kept
  rec("R-SULTAN", "نايف", "سلطان", 1200, "2026-05-15", [ev("GRACE_GRANTED")]),  // mercy (grace)
  rec("R-DISP", "نايف", "ماجد", 900, "2026-05-20", [ev("DISPUTE_RAISED")]),      // neutral (dispute)
  rec("R-ABD", "نايف", "عبدالله", 600, "2026-07-01"),                            // sealed only
  rec("R-FAHD", "فهد", "نايف", 3000, "2026-07-10"),                              // نايف is borrower (من فهد)
  rec("R-GIVE", "نايف", "خالد", 500, "2026-03-01", [ev("FORGIVEN")])             // mercy (إبراء)
];
const reminderHistory = { "R-ABD": [{ tier: 1, atISO: "2026-06-21" }] };

const tl = T.buildTimeline(records, reminderHistory, E, VIEWER, "2026-06-21");
const byKind = (id, kind) => tl.find(x => x.recordId === id && x.kind === kind);

/* ---- structure: a significant entry per witnessed event + each reminder ---- */
ok(Array.isArray(tl), "buildTimeline returns an array");
ok(!!byKind("R-KEPT", "kept"), "settled عهد → a «kept» entry");
ok(!!byKind("R-SULTAN", "mercy"), "graced عهد → a «mercy» entry");
ok(!!byKind("R-DISP", "neutral"), "disputed عهد → a «neutral» entry (NOT amber/red)");
ok(!!byKind("R-GIVE", "mercy"), "forgiven عهد → a «mercy» entry");
ok(!!byKind("R-ABD", "reminder"), "a bank-sent reminder in history → a «reminder» entry");
ok(tl.filter(x => x.kind === "sealed").length === records.length, "every عهد contributes one «sealed» entry");

/* ---- noise events are excluded (only the meaningful ones surface) ---- */
ok(!tl.some(x => /LENDER_SIGNED|COUNTERPARTY_SIGNED|ACTIVATED|AHD_DRAFTED/.test(x.kind || "")), "lifecycle noise (signed/activated/drafted) is NOT in the feed");

/* ---- tones: amber not red; dispute neutral; never a 'red' tone anywhere ---- */
ok(byKind("R-ABD", "reminder").tone === "amber", "a reminder is AMBER (a gentle nudge), never red");
ok(byKind("R-DISP", "neutral").tone === "neutral", "a dispute is NEUTRAL — «عهدٌ يشهد ولا يحكم»");
ok(!tl.some(x => x.tone === "red"), "NO entry is ever red (dignity)");
ok(byKind("R-KEPT", "kept").tone === "kept" && byKind("R-SULTAN", "mercy").tone === "mercy", "kept→kept tone, grace→mercy tone");

/* ---- on-spine copy ---- */
ok(/ذمّة محفوظة/.test(byKind("R-KEPT", "kept").ar), "kept entry says «ذمّة محفوظة»");
ok(/يشهد ولا يحكم/.test(byKind("R-DISP", "neutral").ar), "dispute entry says «يشهد ولا يحكم»");
ok(/صدقة|تصدّقوا/.test(byKind("R-GIVE", "mercy").ar), "forgive entry frames it as صدقة");
ok(/نظرة إلى ميسرة|٢٨٠/.test(byKind("R-SULTAN", "mercy").ar), "grace entry cites نظرة إلى ميسرة (2:280)");
ok(/بالنيابة عنك/.test(byKind("R-ABD", "reminder").ar), "reminder entry says «بالنيابة عنك» (bank-sent)");

/* ---- NO score / NO percentage anywhere (spine) ---- */
ok(!tl.some(x => /\d{1,3}\s*[%٪]/.test(JSON.stringify(x))), "no percentage/score in any entry");

/* ---- direction (لـ / من) relative to the viewer ---- */
ok(/لـ\s*ريم|لـريم/.test(byKind("R-KEPT", "kept").who), "outgoing عهد shows «لـ {borrower}»");
ok(/من\s*فهد/.test(byKind("R-FAHD", "sealed").who), "incoming عهد (viewer is borrower) shows «من {lender}»");

/* ---- integer halalas (money via engine.toMinor) ---- */
ok(byKind("R-KEPT", "kept").amountMinor === E.toMinor(800), "amountMinor is integer halalas via engine.toMinor (800 → 80000)");
ok(tl.every(x => Number.isInteger(x.amountMinor)), "every entry's amountMinor is an integer (no float money)");

/* ---- deterministic ordering: عهد due latest first, latest lifecycle stage first ---- */
ok(tl[0].recordId === "R-FAHD", "feed is ordered by due date (most recent عهد first): R-FAHD (2026-07-10) leads");
const dispIdx = tl.findIndex(x => x.recordId === "R-DISP" && x.kind === "neutral");
const sealIdx = tl.findIndex(x => x.recordId === "R-DISP" && x.kind === "sealed");
ok(dispIdx >= 0 && sealIdx >= 0 && dispIdx < sealIdx, "within one عهد, the later event (dispute) appears above its sealing");

/* ---- determinism: same inputs → byte-identical feed ---- */
ok(JSON.stringify(tl) === JSON.stringify(T.buildTimeline(records, reminderHistory, E, VIEWER, "2026-06-21")), "buildTimeline is deterministic (identical on re-run)");

/* ---- counts helper for the header ---- */
const counts = T.timelineCounts(tl);
ok(counts.kept === 1 && counts.mercy === 2 && counts.neutral === 1 && counts.amber === 1, "timelineCounts tallies kept/mercy/neutral/amber correctly");

/* ---- empty input is graceful ---- */
ok(JSON.stringify(T.buildTimeline([], {}, E, VIEWER, "2026-06-21")) === "[]", "empty ledger → empty feed (no throw)");

console.log("\n" + "=".repeat(56));
console.log("TIMELINE: " + pass + " passed, " + fail + " failed");
console.log("=".repeat(56));
process.exit(fail ? 1 : 0);
