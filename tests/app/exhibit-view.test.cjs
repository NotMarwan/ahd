/* ============================================================================
   exhibit-view.test.cjs — TDD for features/exhibit-view.js: the on-screen
   projection of the NEUTRAL court exhibit (CovenantLog.exhibitFor). ON-SPINE:
   the rendered lines must contain NO score / band / number-as-reputation and
   NO day-counter — parties, terms-hash, sealed timeline, final status only.
============================================================================ */
const path = require("path");
const ROOT = path.join(__dirname, "..", "..", "app");
const engine = require(path.join(ROOT, "engine.js"));
const C = require(path.join(ROOT, "features", "covenant-log.js"));
const EV = require(path.join(ROOT, "features", "exhibit-view.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("exhibit-view.test: the neutral exhibit rendered as Arabic lines");

const evn = (t, x) => Object.assign({ type: t }, x || {});
const record = {
  id: "R-EXH", lender: "نايف", borrower: "مقهى الحي", amountSAR: 2500,
  installments: [{ dueISO: "2026-06-01", amountSAR: 2500 }],
  events: [evn("AHD_DRAFTED", { installments: 1 }), evn("LENDER_SIGNED"), evn("COUNTERPARTY_SIGNED"),
    evn("RECORD_SEALED", { atISO: "2026-05-01" }), evn("ACTIVATED"),
    evn("GRACE_GRANTED", { atISO: "2026-06-10" })]
};
const log = C.buildCovenantLog(record, {}, engine, "2026-06-21");
const sealed = C.sealCovenantLog(log, record, engine);
const exhibit = C.exhibitFor(sealed, record, engine);
const lines = EV.exhibitLinesAr(exhibit);

(function shape() {
  ok(Array.isArray(lines.headerLines) && lines.headerLines.length >= 3, "header has doc-type, parties, terms-hash lines");
  ok(lines.timelineLines.length === exhibit.timeline.length, "one line per sealed timeline entry");
  ok(Array.isArray(lines.footerLines) && lines.footerLines.length >= 2, "footer has final status + head seal");
})();

(function content() {
  const all = lines.headerLines.concat(lines.timelineLines, lines.footerLines).join("\n");
  ok(all.indexOf("نايف") >= 0 && all.indexOf("مقهى الحي") >= 0, "parties named");
  ok(all.indexOf(exhibit.termsHash.slice(0, 16)) >= 0, "terms-hash surfaced (prefix)");
  ok(all.indexOf(exhibit.head.slice(0, 16)) >= 0, "head seal surfaced (prefix)");
  ok(all.indexOf("2:280") >= 0 || all.indexOf("٢٨٠") >= 0, "basis (Quran 2:280) named");
})();

(function spine() {
  const all = lines.headerLines.concat(lines.timelineLines, lines.footerLines).join("\n");
  ok(!/سمعة تُقيَّم|تصنيف|نقاط|score|band/i.test(all), "NO reputation vocabulary anywhere");
  ok(all.indexOf("%") < 0 && all.indexOf("٪") < 0, "no percentage glyph");
  ok(!/يوم(ًا)? متأخّ|أيام تأخ/.test(all), "no day-counter shaming");
})();

(function determinism() {
  const b = EV.exhibitLinesAr(C.exhibitFor(sealed, record, engine));
  ok(JSON.stringify(lines) === JSON.stringify(b), "deterministic (identical on re-run)");
})();

console.log("\n========================================================");
console.log("EXHIBIT-VIEW: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
