"use strict";

var crypto = require("crypto");
var SOURCE_GROUPS = ["G1", "G2", "G3", "G4", "G5"];
var REQUIRED = ["consent", "eligible", "lent_frequency", "borrowed_frequency", "largest_lent", "delayed", "documentation", "reminder", "riba", "writing", "source_group"];
var OPTIONS = {
  consent: ["نعم", "لا"], eligible: ["نعم", "لا"], age: ["18–24", "25–34", "35–44", "45–54", "55+", "أفضل عدم الإجابة"], nationality: ["سعودي", "غير سعودي", "أفضل عدم الإجابة"],
  lent_frequency: ["أبداً", "مرة", "2–3", "4 فأكثر"], borrowed_frequency: ["أبداً", "مرة", "2–3", "4 فأكثر"], largest_lent: ["لم أقرض", "أقل من 500", "500–1,999", "2,000–4,999", "5,000–9,999", "10,000+", "أفضل عدم الإجابة"],
  delayed: ["نعم", "لا", "لا أتذكر"], awkward: ["سهل جداً", "سهل نوعاً ما", "محايد", "محرج نوعاً ما", "محرج جداً"], action: ["طلبت مباشرة", "لمّحت", "انتظرت وأجلت الطلب", "توقفت عن الطلب وسامحت", "أفضل عدم الإجابة"], strain: ["أثر واضح", "أثر بسيط", "لم يؤثر", "أفضل عدم الإجابة"],
  documentation: ["اتفاق مكتوب", "تحويل بنكي بمرجع", "محادثة WhatsApp", "ملاحظة شخصية", "لا أوثّق", "أفضل عدم الإجابة"], reminder: ["تذكير مباشر", "تذكير آلي ومحايد", "شخص ثالث موثوق", "لا أريد تذكيراً", "أفضل عدم الإجابة"], riba: ["مهمة جداً", "مهمة", "محايد", "غير مهمة", "غير مهمة إطلاقاً"], writing: ["كثيراً", "نوعاً ما", "لا فرق", "أقل اطمئناناً", "لا أعرف"], concept: ["مفيدة جداً", "مفيدة", "محايد", "غير مفيدة", "غير مفيدة إطلاقاً"]
};
function parseCsvLine(line) {
  var out = [], value = "", quoted = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (ch === '"') { if (quoted && line[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted; }
    else if (ch === "," && !quoted) { out.push(value); value = ""; }
    else value += ch;
  }
  out.push(value); return out;
}
function loadResponses(csvText) {
  var lines = String(csvText).replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (!lines.length || !lines[0]) return [];
  var headers = parseCsvLine(lines[0]);
  return lines.slice(1).filter(Boolean).map(function (line) {
    var fields = parseCsvLine(line), row = {};
    /* Google exports quote comma-containing choices. This recovery keeps a
       manually copied row readable too: the only schema value with commas is
       largest_lent, immediately before delayed's closed choice set. */
    if (fields.length > headers.length) {
      var delayedAt = -1;
      for (var i = 7; i < fields.length; i++) if (["نعم", "لا", "لا أتذكر"].indexOf(fields[i]) >= 0) { delayedAt = i; break; }
      if (delayedAt > 7) fields = fields.slice(0, 7).concat([fields.slice(7, delayedAt).join(",")], fields.slice(delayedAt));
    }
    headers.forEach(function (header, i) { row[header] = fields[i] === undefined ? "" : fields[i]; });
    return row;
  });
}
function includes(key, value) { return OPTIONS[key].indexOf(value) >= 0; }
function validateResponse(row) {
  if (!row || typeof row !== "object") return { valid: false, reason: "not-an-object" };
  for (var i = 0; i < REQUIRED.length; i++) if (!row[REQUIRED[i]]) return { valid: false, reason: "missing-" + REQUIRED[i] };
  if (row.consent !== "نعم") return { valid: false, reason: "no-consent" };
  if (row.eligible !== "نعم") return { valid: false, reason: "not-eligible" };
  Object.keys(OPTIONS).forEach(function () {});
  for (var key in OPTIONS) if (row[key] && !includes(key, row[key])) return { valid: false, reason: "invalid-" + key };
  if (SOURCE_GROUPS.indexOf(row.source_group) < 0) return { valid: false, reason: "invalid-source-group" };
  var pain = ["awkward", "action", "strain"];
  if (row.delayed === "نعم") for (var j = 0; j < pain.length; j++) if (!row[pain[j]]) return { valid: false, reason: "missing-" + pain[j] };
  if (row.delayed !== "نعم") for (var k = 0; k < pain.length; k++) if (row[pain[k]]) return { valid: false, reason: "unexpected-" + pain[k] };
  return { valid: true };
}
function pct(n, base) { return base ? Math.round(n * 100 / base) : null; }
function metric(name, rows, predicate, threshold, kFloor, suppressed) {
  var base = rows.length, count = rows.filter(predicate).length;
  if (base < kFloor) { suppressed.push({ metric: name, baseN: base }); return { suppressed: true, baseN: base }; }
  return { baseN: base, count: count, percent: pct(count, base), thresholdPercent: threshold, pass: pct(count, base) >= threshold };
}
function fingerprint(row) {
  var copy = {};
  Object.keys(row).sort().forEach(function (key) { if (key !== "response_id" && key !== "timestamp") copy[key] = row[key]; });
  return crypto.createHash("sha256").update(JSON.stringify(copy)).digest("hex");
}
function summarize(rows, options) {
  options = options || {}; var kFloor = options.kFloor || 10, minPublicGroup = options.minPublicGroup || 20;
  var valid = [], invalid = [], duplicates = [], seen = {};
  rows.forEach(function (row) {
    var result = validateResponse(row);
    if (!result.valid) { invalid.push(result.reason); return; }
    var key = fingerprint(row);
    if (seen[key]) duplicates.push({ action: "flag-only" }); else seen[key] = true;
    valid.push(row);
  });
  var suppressed = [];
  var h1 = metric("H1", valid, function (r) { return r.lent_frequency !== "أبداً" || r.borrowed_frequency !== "أبداً"; }, 35, kFloor, suppressed);
  var delayed = valid.filter(function (r) { return r.delayed === "نعم"; });
  var h2a = metric("H2-awkward", delayed, function (r) { return r.awkward === "محرج نوعاً ما" || r.awkward === "محرج جداً"; }, 50, kFloor, suppressed);
  var h2b = metric("H2-avoidant", delayed, function (r) { return ["لمّحت", "انتظرت وأجلت الطلب", "توقفت عن الطلب وسامحت"].indexOf(r.action) >= 0; }, 30, kFloor, suppressed);
  var h2c = metric("H2-strain", delayed, function (r) { return ["أثر واضح", "أثر بسيط"].indexOf(r.strain) >= 0; }, 20, kFloor, suppressed);
  var lowDocs = valid.filter(function (r) { return r.documentation === "لا أوثّق"; });
  var h3 = metric("H3", lowDocs, function (r) { return ["تذكير آلي ومحايد", "شخص ثالث موثوق"].indexOf(r.reminder) >= 0; }, 40, kFloor, suppressed);
  var groups = SOURCE_GROUPS.map(function (code) { return { code: code, n: valid.filter(function (r) { return r.source_group === code; }).length }; });
  var publicGroups = groups.filter(function (g) { return g.n >= minPublicGroup; }).map(function (g) { return { code: g.code, n: g.n, percent: pct(g.n, valid.length) }; });
  var hiddenGroups = groups.filter(function (g) { return g.n < minPublicGroup; }).map(function (g) { suppressed.push({ metric: "source-group", baseN: g.n }); return { suppressed: true, baseN: g.n }; });
  var h2Pass = !h2a.suppressed && !h2b.suppressed && !h2c.suppressed && h2a.pass && h2b.pass && h2c.pass;
  var h3Pass = !h3.suppressed && h3.pass;
  var maxObservedGroupPercent = groups.reduce(function (max, g) { return Math.max(max, pct(g.n, valid.length) || 0); }, 0);
  var sampleQuality = { allSeedGroupsMinValid: groups.every(function (g) { return g.n >= 10; }), maxObservedGroupPercent: maxObservedGroupPercent, seedDistributionPass: groups.every(function (g) { return g.n >= 10 && (pct(g.n, valid.length) || 0) <= 40; }) };
  var tier = valid.length < 80 ? "exploratory" : (valid.length < 150 ? "directional-pilot" : (valid.length <= 250 ? "strong-directional-convenience" : "optional-stretch"));
  return { validN: valid.length, invalidN: invalid.length, duplicateCandidates: duplicates, evidenceTier: tier, otA1Status: valid.length < 80 ? "EXPLORATORY-NOT-CLAIMABLE" : ((h1.pass && h2Pass && h3Pass && sampleQuality.seedDistributionPass) ? "SUPPORTED-DIRECTIONAL" : "NOT-SUPPORTED"), hypotheses: { H1: h1, H2: { baseN: delayed.length, awkward: h2a, avoidantAction: h2b, anyStrain: h2c, pass: h2Pass }, H3: h3 }, sourceGroups: { public: publicGroups, suppressed: hiddenGroups }, sampleQuality: sampleQuality, suppressedCells: suppressed };
}
function show(metric) { return metric.suppressed ? "محجوب (قاعدة الخصوصية)" : metric.count + "/" + metric.baseN + " (" + metric.percent + "%)"; }
function renderMarkdown(summary) {
  return ["# نتائج استبيان الطلب المجهول", "", "- العينة الصحيحة: " + summary.validN, "- المستوى: " + summary.evidenceTier, "- OT-A1: " + summary.otA1Status, "- H1: " + show(summary.hypotheses.H1), "- H2: " + show(summary.hypotheses.H2.awkward) + "؛ " + show(summary.hypotheses.H2.avoidantAction) + "؛ " + show(summary.hypotheses.H2.anyStrain), "- H3: " + show(summary.hypotheses.H3), "", "لا تمثل هذه عينة وطنية. الخلايا دون حد الخصوصية محجوبة؛ المرشحون المكررون يراجعون يدوياً ولا يحذفون آلياً.", ""].join("\n"); }
module.exports = { loadResponses: loadResponses, validateResponse: validateResponse, summarize: summarize, renderMarkdown: renderMarkdown };
if (require.main === module) {
  var fs = require("fs");
  var input = process.argv[2];
  if (!input) {
    process.stderr.write("usage: node tools/survey/analyze-responses.cjs <private-csv> [--json]\n");
    process.exit(1);
  }
  var report = summarize(loadResponses(fs.readFileSync(input, "utf8")), { kFloor: 10, minPublicGroup: 20 });
  process.stdout.write(process.argv.indexOf("--json") >= 0 ? JSON.stringify(report, null, 2) + "\n" : renderMarkdown(report));
}
