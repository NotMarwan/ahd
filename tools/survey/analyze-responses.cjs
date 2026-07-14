"use strict";

var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
var ROOT = path.join(__dirname, "..", "..");
var SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, "docs", "evidence", "survey", "form-spec.json"), "utf8"));
var SOURCE_GROUPS = SPEC.sourceLinks.map(function (item) { return item.code; });
var QUESTION_BY_ID = {};
var HEADER_TO_ID = {};
var ALLOWED_FIELDS = { timestamp: true, response_id: true };
SPEC.questions.forEach(function (question) {
  QUESTION_BY_ID[question.id] = question;
  HEADER_TO_ID[question.title] = question.id;
  ALLOWED_FIELDS[question.id] = true;
});
var PRIVACY = "أفضل عدم الإجابة";

function parseCsvLine(line) {
  var out = [], value = "", quoted = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) { out.push(value); value = ""; }
    else value += ch;
  }
  out.push(value);
  return out;
}
function normalizeHeader(header) {
  var clean = String(header || "").trim();
  if (clean === "Timestamp" || clean === "الطابع الزمني") return "timestamp";
  return HEADER_TO_ID[clean] || clean;
}
function loadResponses(csvText) {
  var text = String(csvText || "").replace(/^\uFEFF/, "").trim();
  if (!text) return [];
  var lines = text.split(/\r?\n/);
  var headers = parseCsvLine(lines[0]).map(normalizeHeader);
  return lines.slice(1).filter(Boolean).map(function (line) {
    var values = parseCsvLine(line), row = {};
    headers.forEach(function (header, index) { row[header] = values[index] === undefined ? "" : values[index]; });
    return row;
  });
}
function validOption(id, value) {
  return QUESTION_BY_ID[id].options.indexOf(value) >= 0;
}
function validateResponse(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return { valid: false, reason: "not-an-object" };
  var keys = Object.keys(row);
  for (var i = 0; i < keys.length; i++) if (!ALLOWED_FIELDS[keys[i]]) return { valid: false, reason: "unknown-field-" + keys[i] };
  if (row.consent !== "نعم") return { valid: false, reason: "no-consent" };
  if (row.eligible !== "نعم") return { valid: false, reason: "not-eligible" };
  var unconditional = SPEC.questions.filter(function (question) { return question.required && !question.showWhen; });
  for (var j = 0; j < unconditional.length; j++) {
    var required = unconditional[j];
    if (!row[required.id]) return { valid: false, reason: "missing-" + required.id };
  }
  for (var k = 0; k < SPEC.questions.length; k++) {
    var question = SPEC.questions[k];
    if (row[question.id] && !validOption(question.id, row[question.id])) return { valid: false, reason: "invalid-" + question.id };
  }
  var painIds = SPEC.hypotheses.H2.requiredQuestions;
  if (row.delayed_repayment === "نعم") {
    for (var p = 0; p < painIds.length; p++) if (!row[painIds[p]]) return { valid: false, reason: "missing-" + painIds[p] };
  } else {
    for (var q = 0; q < painIds.length; q++) if (row[painIds[q]]) return { valid: false, reason: "unexpected-" + painIds[q] };
  }
  return { valid: true };
}
function pct(count, base) { return base ? Math.round(count * 100 / base) : null; }
function metric(name, rows, predicate, threshold, kFloor, suppressed) {
  var base = rows.length, count = rows.filter(predicate).length;
  if (base < kFloor) {
    suppressed.push({ metric: name, baseN: base });
    return { suppressed: true, baseN: base, thresholdPercent: threshold, pass: false };
  }
  var percent = pct(count, base);
  return { baseN: base, count: count, percent: percent, thresholdPercent: threshold, pass: count * 100 >= threshold * base };
}
function fingerprint(row) {
  var copy = {};
  Object.keys(row).sort().forEach(function (key) {
    if (key !== "response_id" && key !== "timestamp") copy[key] = row[key];
  });
  return crypto.createHash("sha256").update(JSON.stringify(copy)).digest("hex");
}
function distribution(rows, id, excluded, kFloor, suppressed) {
  var baseRows = rows.filter(function (row) { return row[id] && excluded.indexOf(row[id]) < 0; });
  if (baseRows.length < kFloor) {
    suppressed.push({ metric: id, baseN: baseRows.length });
    return { suppressed: true, baseN: baseRows.length };
  }
  return {
    baseN: baseRows.length,
    values: QUESTION_BY_ID[id].options.filter(function (value) { return excluded.indexOf(value) < 0; }).map(function (value) {
      var count = baseRows.filter(function (row) { return row[id] === value; }).length;
      return { value: value, count: count, percent: pct(count, baseRows.length) };
    })
  };
}
function summarize(rows, options) {
  options = options || {};
  var kFloor = options.kFloor || 10;
  var minPublicGroup = options.minPublicGroup || 20;
  var valid = [], invalid = [], duplicates = [], seen = {};
  rows.forEach(function (row, rowIndex) {
    var result = validateResponse(row);
    if (!result.valid) { invalid.push(result.reason); return; }
    var key = fingerprint(row);
    if (Object.prototype.hasOwnProperty.call(seen, key)) {
      duplicates.push({ rowIndex: rowIndex + 1, matchesRowIndex: seen[key], action: "flag-only" });
    } else {
      seen[key] = rowIndex + 1;
    }
    valid.push(row);
  });

  var suppressed = [];
  var h1Config = SPEC.hypotheses.H1;
  var h1Rows = valid.filter(function (row) { return h1Config.denominatorValues.indexOf(row[h1Config.question]) >= 0; });
  var h1 = metric("H1", h1Rows, function (row) { return h1Config.numeratorValues.indexOf(row[h1Config.question]) >= 0; }, h1Config.thresholdPercent, kFloor, suppressed);

  var h2Config = SPEC.hypotheses.H2;
  var h2Rows = valid.filter(function (row) {
    return row[h2Config.filter.question] === h2Config.filter.equals;
  });
  function h2Metric(name, config) {
    var excludedValues = config.excludedValues || h2Config.excludedValues;
    var componentRows = h2Rows.filter(function (row) {
      return row[config.question] && excludedValues.indexOf(row[config.question]) < 0;
    });
    return metric("H2-" + name, componentRows, function (row) { return config.numeratorValues.indexOf(row[config.question]) >= 0; }, config.thresholdPercent, kFloor, suppressed);
  }
  var h2Awkward = h2Metric("awkward", h2Config.awkward);
  var h2Avoidant = h2Metric("avoidant", h2Config.avoidantAction);
  var h2Strain = h2Metric("strain", h2Config.anyStrain);
  var h2Pass = h2Awkward.pass && h2Avoidant.pass && h2Strain.pass;

  var h3Config = SPEC.hypotheses.H3;
  var h3Rows = valid.filter(function (row) {
    return h3Config.lowDocumentationValues.indexOf(row[h3Config.documentationQuestion]) >= 0 &&
      row[h3Config.reminderQuestion] && h3Config.excludedReminderValues.indexOf(row[h3Config.reminderQuestion]) < 0;
  });
  var h3 = metric("H3", h3Rows, function (row) { return h3Config.numeratorValues.indexOf(row[h3Config.reminderQuestion]) >= 0; }, h3Config.thresholdPercent, kFloor, suppressed);

  var groups = SOURCE_GROUPS.map(function (code) {
    return { code: code, n: valid.filter(function (row) { return row.source_group === code; }).length };
  });
  var publicGroups = groups.filter(function (group) { return group.n >= minPublicGroup; }).map(function (group) {
    return { code: group.code, n: group.n, percent: pct(group.n, valid.length) };
  });
  var hiddenGroups = groups.filter(function (group) { return group.n < minPublicGroup; }).map(function (group) {
    suppressed.push({ metric: "source-group", baseN: group.n });
    return { suppressed: true, baseN: group.n };
  });
  var maxObservedGroupPercent = groups.reduce(function (max, group) { return Math.max(max, pct(group.n, valid.length) || 0); }, 0);
  var sampleQuality = {
    allSeedGroupsMinValid: groups.every(function (group) { return group.n >= SPEC.sample.minValidPerSeedGroup; }),
    maxObservedGroupPercent: maxObservedGroupPercent,
    seedDistributionPass: groups.every(function (group) { return group.n >= SPEC.sample.minValidPerSeedGroup && group.n * 100 <= SPEC.sample.maxSharePerGroupPercent * valid.length; })
  };
  var tier = valid.length < SPEC.sample.minimumValid ? "exploratory" :
    (valid.length < SPEC.sample.target ? "directional-pilot" :
      (valid.length <= SPEC.sample.normalStop ? "strong-directional-convenience" :
        (valid.length <= SPEC.sample.optionalStretch ? "optional-stretch" : "above-preregistered-cap")));
  var supported = valid.length >= SPEC.sample.minimumValid && valid.length <= SPEC.sample.optionalStretch && h1.pass && h2Pass && h3.pass && sampleQuality.seedDistributionPass;
  var otA1Status = valid.length > SPEC.sample.optionalStretch ? "OUTSIDE-PREREGISTERED-RANGE" :
    (valid.length < SPEC.sample.minimumValid ? "EXPLORATORY-NOT-CLAIMABLE" : (supported ? "SUPPORTED-DIRECTIONAL" : "NOT-SUPPORTED"));

  return {
    validN: valid.length,
    invalidN: invalid.length,
    duplicateCandidates: duplicates,
    evidenceTier: tier,
    otA1Status: otA1Status,
    hypotheses: { H1: h1, H2: { awkward: h2Awkward, avoidantAction: h2Avoidant, anyStrain: h2Strain, pass: h2Pass }, H3: h3 },
    descriptive: {
      agreementPreference: distribution(valid, "agreement_preference", ["لا أعرف", PRIVACY], kFloor, suppressed),
      productPriority: distribution(valid, "product_priority", ["لا أعرف", PRIVACY], kFloor, suppressed)
    },
    sourceGroups: { public: publicGroups, suppressed: hiddenGroups },
    sampleQuality: sampleQuality,
    suppressedCells: suppressed
  };
}
function show(metric) {
  return metric.suppressed ? "محجوب (قاعدة الخصوصية)" : metric.count + "/" + metric.baseN + " (" + metric.percent + "%)";
}
function showDistribution(distributionValue) {
  if (distributionValue.suppressed) return "محجوب (قاعدة الخصوصية)";
  return distributionValue.values.map(function (item) { return item.value + ": " + item.count + "/" + distributionValue.baseN + " (" + item.percent + "%)"; }).join("؛ ");
}
function renderMarkdown(summary) {
  if (summary.validN < SPEC.sample.minimumValid) {
    return [
      "- Valid sample: " + summary.validN,
      "- Evidence tier: " + summary.evidenceTier,
      "- OT-A1: " + summary.otA1Status,
      "- Duplicate candidates: " + summary.duplicateCandidates.length,
      "",
      SPEC.sample.claim + ".",
      ""
    ].join("\n");
  }
  return [
    "# نتائج استبيان الطلب المجهول — النسخة الثانية",
    "",
    "- العينة الصحيحة: " + summary.validN,
    "- المستوى: " + summary.evidenceTier,
    "- OT-A1: " + summary.otA1Status,
    "- Duplicate candidates: " + summary.duplicateCandidates.length,
    "- H1: " + show(summary.hypotheses.H1),
    "- H2 — حرج المطالبة: " + show(summary.hypotheses.H2.awkward),
    "- H2 — التجنب: " + show(summary.hypotheses.H2.avoidantAction),
    "- H2 — أثر العلاقة: " + show(summary.hypotheses.H2.anyStrain),
    "- H3: " + show(summary.hypotheses.H3),
    "- تفضيل الاتفاق: " + showDistribution(summary.descriptive.agreementPreference),
    "- أولوية المنتج — استكشافي فقط: " + showDistribution(summary.descriptive.productPriority),
    "",
    "هذه عينة ملاءمة اتجاهية وليست ممثلة وطنيًا. سؤال المنتج استكشافي ولا يثبت المشكلة. الخلايا ذات القاعدة دون حد الخصوصية محجوبة، والمرشحون المكررون يراجعون يدويًا ولا يحذفون آليًا.",
    ""
  ].join("\n");
}

module.exports = { loadResponses: loadResponses, validateResponse: validateResponse, summarize: summarize, renderMarkdown: renderMarkdown };

if (require.main === module) {
  var input = process.argv[2];
  if (!input) {
    process.stderr.write("usage: node tools/survey/analyze-responses.cjs <private-csv> [--json]\n");
    process.exit(1);
  }
  var report = summarize(loadResponses(fs.readFileSync(input, "utf8")), { kFloor: 10, minPublicGroup: 20 });
  process.stdout.write(process.argv.indexOf("--json") >= 0 ? JSON.stringify(report, null, 2) + "\n" : renderMarkdown(report));
}
