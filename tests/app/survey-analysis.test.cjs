const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const ANALYZER_PATH = path.join(ROOT, "tools", "survey", "analyze-responses.cjs");
const FIXTURE_PATH = path.join(__dirname, "fixtures", "survey-responses.csv");
let pass = 0, fail = 0;
function ok(condition, message) {
  if (condition) { pass++; console.log("  ✓ " + message); }
  else { fail++; console.log("  ✗ " + message); }
}

console.log("survey-analysis.test: private, k-safe directional pilot analysis");
ok(fs.existsSync(ANALYZER_PATH), "offline response analyzer exists");
ok(fs.existsSync(FIXTURE_PATH), "anonymized fixture exists");
if (!fs.existsSync(ANALYZER_PATH) || !fs.existsSync(FIXTURE_PATH)) {
  console.log("survey-analysis.test: " + pass + " passed, " + fail + " failed");
  process.exit(1);
}

const A = require(ANALYZER_PATH);
["loadResponses", "validateResponse", "summarize", "renderMarkdown"].forEach(function (name) { ok(typeof A[name] === "function", name + " is exported"); });
const csv = fs.readFileSync(FIXTURE_PATH, "utf8");
const rows = A.loadResponses(csv);
ok(rows.length === 20, "CSV loader returns all fixture rows");
const invalid = Object.assign({}, rows[0], { consent: "لا" });
ok(A.validateResponse(invalid).valid === false, "validator rejects non-consenting rows");
ok(A.validateResponse(Object.assign({}, rows[0], { delayed: "لا", awkward: "محرج جداً" })).valid === false, "validator rejects pain answers without a delayed repayment");
ok(A.validateResponse(Object.assign({}, rows[0], { response_id: "x", source_group: "G9" })).valid === false, "validator rejects unknown source group");

const summary = A.summarize(rows, { kFloor: 10, minPublicGroup: 20 });
ok(summary.validN === 20 && summary.invalidN === 0, "summary keeps valid anonymous records only");
ok(summary.hypotheses.H1.pass === true && summary.hypotheses.H1.percent === 100, "H1 uses whole-number percentage and preregistered threshold");
ok(summary.hypotheses.H2.pass === true && summary.hypotheses.H2.baseN === 11, "H2 keeps duplicate candidates flagged, not deleted, in its delayed-case base");
ok(summary.hypotheses.H3.pass === true && summary.hypotheses.H3.baseN === 10, "H3 evaluates low-documenters only");
ok(summary.evidenceTier === "exploratory" && summary.otA1Status === "EXPLORATORY-NOT-CLAIMABLE", "below-80 sample stays exploratory and cannot claim OT-A1 support");
ok(summary.duplicateCandidates.length === 1 && summary.duplicateCandidates[0].action === "flag-only", "duplicates are flagged, never deleted automatically");
ok(summary.sourceGroups.public.length === 1 && summary.sourceGroups.suppressed.length === 4, "public groups need minPublicGroup; low groups suppress");
ok(summary.suppressedCells.every(function (cell) { return cell.baseN < 10; }), "cells under kFloor suppress");
ok(!!summary.sampleQuality && summary.sampleQuality.seedDistributionPass === false && summary.sampleQuality.maxObservedGroupPercent === 100, "sample-quality report catches a seed group above the 40% cap");
const md = A.renderMarkdown(summary);
ok(typeof md === "string", "Markdown renderer returns a string for CLI output");
ok(/20/.test(md) && /100%/.test(md) && /EXPLORATORY-NOT-CLAIMABLE/.test(md), "Markdown contains base n, whole percentage, and honest status");
ok(!/response_id|respondent|G2:|G3:/.test(md), "Markdown excludes row identifiers and suppressed group details");
const src = fs.readFileSync(ANALYZER_PATH, "utf8");
ok(!/Date\.now|new Date|Math\.random|Intl|fetch\s*\(/.test(src), "analysis is offline and deterministic");

console.log("survey-analysis.test: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
