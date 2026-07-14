"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const ANALYZER_PATH = path.join(ROOT, "tools", "survey", "analyze-responses.cjs");
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, "docs", "evidence", "survey", "form-spec.json"), "utf8"));
const FIXTURE_PATH = path.join(__dirname, "fixtures", "survey-responses.csv");
const A = require(ANALYZER_PATH);
let pass = 0, fail = 0;
function ok(condition, message) {
  if (condition) { pass++; console.log("  ✓ " + message); }
  else { fail++; console.log("  ✗ " + message); }
}
function row(overrides) {
  return Object.assign({
    response_id: "base",
    consent: "نعم",
    eligible: "نعم",
    experience_12m: "أقرضت شخصًا فقط",
    delayed_repayment: "نعم",
    asking_awkwardness: "لا هذا ولا ذاك",
    first_action: "طلبت المبلغ مباشرة",
    relationship_effect: "لم تتأثر",
    documentation_method: "محادثة عبر واتساب",
    reminder_preference: "أطلب مباشرة بنفسي",
    agreement_preference: "اتفاق مكتوب وواضح",
    product_priority: "",
    source_group: "G1"
  }, overrides || {});
}

console.log("survey-analysis.test: v2 directional evidence contract");
["loadResponses", "validateResponse", "summarize", "renderMarkdown"].forEach(function (name) {
  ok(typeof A[name] === "function", name + " is exported");
});

const csv = fs.readFileSync(FIXTURE_PATH, "utf8");
const loaded = A.loadResponses(csv);
ok(loaded.length === 4, "CSV loader returns every fixture row");
ok(loaded[0].experience_12m === "أقرضت شخصًا فقط" && loaded[0].source_group === "G1", "Google Arabic titles normalize to v2 IDs");
ok(A.validateResponse(loaded[0]).valid === true, "complete v2 fixture row validates");
ok(A.validateResponse(Object.assign({}, loaded[0], { consent: "لا" })).reason === "no-consent", "non-consenting rows are excluded");
ok(A.validateResponse(Object.assign({}, loaded[0], { eligible: "لا" })).reason === "not-eligible", "ineligible rows are excluded");
ok(A.validateResponse(Object.assign({}, loaded[0], { source_group: "G9" })).reason === "invalid-source_group", "unknown source codes are rejected");
ok(A.validateResponse(Object.assign({}, loaded[0], { lent_frequency: "مرة" })).reason === "unknown-field-lent_frequency", "v1 columns are rejected");
ok(A.validateResponse(row({ delayed_repayment: "لا", asking_awkwardness: "محرج جدًا", first_action: "", relationship_effect: "" })).reason === "unexpected-asking_awkwardness", "pain answers cannot appear outside the delayed path");
ok(A.validateResponse(row({ asking_awkwardness: "" })).reason === "missing-asking_awkwardness", "delayed rows require all conditional answers");

const actions = [
  "لمّحت بدل أن أطلب مباشرة",
  "انتظرت وأجلت الطلب",
  "لم أطلب حفاظًا على العلاقة",
  "اتفقنا على مهلة جديدة",
  "أبرأت الدين أو سامحت به برغبتي",
  "طلبت المبلغ مباشرة",
  "طلبت المبلغ مباشرة",
  "طلبت المبلغ مباشرة",
  "طلبت المبلغ مباشرة",
  "طلبت المبلغ مباشرة"
];
const docs = ["محادثة عبر واتساب", "ملاحظة شخصية", "لا أوثّق"];
const agreements = ["اتفاق مكتوب وواضح", "اتفاق شفهي فقط", "لا فرق لدي", "يعتمد على الشخص أو المبلغ"];
function makeSupportRows(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push(row({
      response_id: "s" + i,
      source_group: "G" + ((i % 5) + 1),
      first_action: actions[i % actions.length],
      asking_awkwardness: i % 10 < 5 ? SPEC.hypotheses.H2.awkward.numeratorValues[0] : row().asking_awkwardness,
      relationship_effect: i % 10 < 2 ? SPEC.hypotheses.H2.anyStrain.numeratorValues[0] : row().relationship_effect,
      documentation_method: docs[i % docs.length],
      reminder_preference: i % 10 < 4 ? SPEC.hypotheses.H3.numeratorValues[0] : row().reminder_preference,
      agreement_preference: agreements[i % agreements.length]
    }));
  }
  return rows;
}
function rowsWithSourceCounts(counts) {
  const rows = makeSupportRows(counts.reduce(function (total, count) { return total + count; }, 0));
  let rowIndex = 0;
  counts.forEach(function (count, groupIndex) {
    for (let i = 0; i < count; i++) rows[rowIndex++].source_group = "G" + (groupIndex + 1);
  });
  return rows;
}
function summarizeH1(numeratorCount, total) {
  const config = SPEC.hypotheses.H1;
  const numeratorValue = config.numeratorValues[0];
  const denominatorOnlyValue = config.denominatorValues.filter(function (value) { return config.numeratorValues.indexOf(value) < 0; })[0];
  return A.summarize(makeSupportRows(total).map(function (item, index) {
    return Object.assign({}, item, { experience_12m: index < numeratorCount ? numeratorValue : denominatorOnlyValue });
  }), { kFloor: 10, minPublicGroup: 20 });
}
const measured = actions.map(function (action, index) {
  return row({
    response_id: "m" + index,
    first_action: action,
    asking_awkwardness: index < 5 ? "محرج نوعًا ما" : "لا هذا ولا ذاك",
    relationship_effect: index < 2 ? "تأثرت سلبًا بدرجة بسيطة" : "لم تتأثر",
    documentation_method: docs[index % docs.length],
    reminder_preference: index < 4 ? "تذكير آلي ومحايد" : "أطلب مباشرة بنفسي",
    agreement_preference: agreements[index % agreements.length]
  });
});
const productOptions = SPEC.questions.filter(function (question) { return question.id === "product_priority"; })[0].options;
measured.forEach(function (item, index) { item.product_priority = productOptions[index % productOptions.length]; });
measured.push(row({
  response_id: "privacy-1",
  experience_12m: "أفضل عدم الإجابة",
  asking_awkwardness: "أفضل عدم الإجابة",
  first_action: "أفضل عدم الإجابة",
  relationship_effect: "أفضل عدم الإجابة",
  documentation_method: "لا أوثّق",
  reminder_preference: "لا أعرف"
}));
measured.push(row({
  response_id: "privacy-2",
  experience_12m: "أفضل عدم الإجابة",
  asking_awkwardness: "أفضل عدم الإجابة",
  first_action: "أفضل عدم الإجابة",
  relationship_effect: "أفضل عدم الإجابة",
  documentation_method: "ملاحظة شخصية",
  reminder_preference: "أفضل عدم الإجابة"
}));

const summary = A.summarize(measured, { kFloor: 10, minPublicGroup: 20 });
ok(summary.validN === 12 && summary.invalidN === 0, "privacy choices remain valid anonymous responses");
ok(summary.hypotheses.H1.baseN === 10 && summary.hypotheses.H1.count === 10, "H1 excludes privacy answers from its denominator");
ok(!Object.prototype.hasOwnProperty.call(summary.hypotheses.H2, "baseN"), "H2 has no misleading shared denominator");
ok(summary.hypotheses.H2.awkward.percent === 50, "H2 awkwardness uses the preregistered top two");
ok(summary.hypotheses.H2.avoidantAction.count === 3 && summary.hypotheses.H2.avoidantAction.percent === 30, "H2 avoidance counts hint, postpone, and relationship protection only");
ok(summary.hypotheses.H2.avoidantAction.count < 5, "agreed grace and voluntary forgiveness are not avoidance");
ok(summary.hypotheses.H2.anyStrain.percent === 20 && summary.hypotheses.H2.pass === true, "all H2 component thresholds pass exactly");
ok(summary.hypotheses.H3.baseN === 10 && summary.hypotheses.H3.count === 4 && summary.hypotheses.H3.percent === 40, "H3 includes WhatsApp, personal note, and no documentation but excludes unknown/privacy reminders");
ok(summary.evidenceTier === "exploratory" && summary.otA1Status === "EXPLORATORY-NOT-CLAIMABLE", "fewer than 80 valid responses cannot support OT-A1");

const mixedH2Rows = [];
for (let i = 0; i < 11; i++) {
  mixedH2Rows.push(row({
    response_id: "mixed-h2-" + i,
    first_action: i === 10 ? SPEC.hypotheses.H2.excludedValues[0] : row().first_action
  }));
}
const mixedH2 = A.summarize(mixedH2Rows, { kFloor: 10, minPublicGroup: 20 }).hypotheses.H2;
ok(mixedH2.awkward.baseN === 11 && mixedH2.avoidantAction.baseN === 10 && mixedH2.anyStrain.baseN === 11, "H2 components use separate substantive bases of 11, 10, and 11");

ok(summarizeH1(69, 200).hypotheses.H1.pass === false, "H1 fails just below 35 percent at 69/200 despite display rounding");
ok(summarizeH1(70, 200).hypotheses.H1.pass === true, "H1 passes exactly at 35 percent with 70/200");
ok(summarizeH1(71, 200).hypotheses.H1.pass === true, "H1 passes just above 35 percent with 71/200");
const sourceJustBelow = A.summarize(rowsWithSourceCounts([80, 31, 30, 30, 30]), { kFloor: 10, minPublicGroup: 20 });
const sourceExact = A.summarize(rowsWithSourceCounts([80, 30, 30, 30, 30]), { kFloor: 10, minPublicGroup: 20 });
const sourceJustAbove = A.summarize(rowsWithSourceCounts([81, 30, 30, 30, 30]), { kFloor: 10, minPublicGroup: 20 });
const sourceAtFortyOne = A.summarize(rowsWithSourceCounts([82, 30, 30, 29, 29]), { kFloor: 10, minPublicGroup: 20 });
ok(sourceJustBelow.sampleQuality.seedDistributionPass === true, "source share passes just below the 40 percent cap");
ok(sourceExact.sampleQuality.seedDistributionPass === true && sourceExact.sampleQuality.maxObservedGroupPercent === 40, "source share passes exactly at the 40 percent cap");
ok(sourceJustAbove.sampleQuality.seedDistributionPass === false && sourceJustAbove.sampleQuality.maxObservedGroupPercent === 40, "source share fails just above the cap even when display rounds to 40 percent");
ok(sourceAtFortyOne.sampleQuality.seedDistributionPass === false && sourceAtFortyOne.sampleQuality.maxObservedGroupPercent === 41, "a displayed 41 percent source group fails the cap");

const withDuplicate = measured.concat([Object.assign({}, measured[0], { response_id: "duplicate-id" })]);
const duplicateSummary = A.summarize(withDuplicate, { kFloor: 10, minPublicGroup: 20 });
ok(duplicateSummary.validN === 13 && duplicateSummary.duplicateCandidates.length === 1, "duplicate candidates are flagged but retained in the valid sample");
const fixtureDuplicateSummary = A.summarize(loaded, { kFloor: 10, minPublicGroup: 20 });
ok(JSON.stringify(fixtureDuplicateSummary.duplicateCandidates) === JSON.stringify([{ rowIndex: 4, matchesRowIndex: 1, action: "flag-only" }]), "known duplicate reports deterministic one-based positions and flag-only action");

const supportRows = [];
for (let i = 0; i < 80; i++) {
  supportRows.push(row({
    response_id: "s" + i,
    source_group: "G" + ((i % 5) + 1),
    first_action: actions[i % actions.length],
    asking_awkwardness: i % 10 < 5 ? "محرج نوعًا ما" : "لا هذا ولا ذاك",
    relationship_effect: i % 10 < 2 ? "تأثرت سلبًا بدرجة بسيطة" : "لم تتأثر",
    documentation_method: docs[i % docs.length],
    reminder_preference: i % 10 < 4 ? "تذكير من شخص ثالث موثوق" : "أطلب مباشرة بنفسي"
  }));
}
const supported = A.summarize(supportRows, { kFloor: 10, minPublicGroup: 20 });
ok(supported.sampleQuality.seedDistributionPass === true && supported.sampleQuality.maxObservedGroupPercent === 20, "five-group distribution passes at 16 valid responses each");
ok(supported.evidenceTier === "directional-pilot" && supported.otA1Status === "SUPPORTED-DIRECTIONAL", "n=80 plus passing preregistration yields directional support only");
ok(supported.sourceGroups.public.length === 0 && supported.sourceGroups.suppressed.length === 5, "subgroups below n=20 stay private even when the overall sample is usable");

const atNormalStop = A.summarize(makeSupportRows(250), { kFloor: 10, minPublicGroup: 20 });
const optionalStretchStart = A.summarize(makeSupportRows(251), { kFloor: 10, minPublicGroup: 20 });
const optionalStretchEnd = A.summarize(makeSupportRows(384), { kFloor: 10, minPublicGroup: 20 });
const abovePreregisteredCap = A.summarize(makeSupportRows(385), { kFloor: 10, minPublicGroup: 20 });
ok(atNormalStop.evidenceTier === "strong-directional-convenience", "n=250 remains the normal strong-directional stop");
ok(optionalStretchStart.evidenceTier === "optional-stretch", "n=251 begins the optional stretch range");
ok(optionalStretchEnd.evidenceTier === "optional-stretch", "n=384 remains inside the optional stretch range");
ok(abovePreregisteredCap.hypotheses.H1.pass && abovePreregisteredCap.hypotheses.H2.pass && abovePreregisteredCap.hypotheses.H3.pass && abovePreregisteredCap.sampleQuality.seedDistributionPass && abovePreregisteredCap.evidenceTier === "above-preregistered-cap" && abovePreregisteredCap.otA1Status === "OUTSIDE-PREREGISTERED-RANGE", "n=385 is outside the preregistered range even when metrics pass");

const md = A.renderMarkdown(summary);
ok(/12/.test(md) && /exploratory/.test(md) && /EXPLORATORY-NOT-CLAIMABLE/.test(md) && /Duplicate candidates: 0/i.test(md), "exploratory Markdown emits sample size, tier, status, and aggregate duplicate count");
ok(md.indexOf(SPEC.sample.claim) >= 0, "exploratory Markdown retains the non-representative caveat");
ok(!/%|\bH1\b|\bH2\b|\bH3\b/.test(md), "exploratory Markdown emits no percentages or hypothesis results");
ok(md.indexOf(summary.descriptive.agreementPreference.values[0].value) < 0 && md.indexOf(productOptions[0]) < 0, "exploratory Markdown emits no descriptive distribution values");
const supportedMd = A.renderMarkdown(supported);
ok(/\bH1\b/.test(supportedMd) && /%/.test(supportedMd) && supportedMd.indexOf(supported.descriptive.agreementPreference.values[0].value) >= 0, "n=80 Markdown may emit preregistered percentages and distributions");
const duplicateMd = A.renderMarkdown(fixtureDuplicateSummary);
ok(/Duplicate candidates: 1/i.test(duplicateMd) && !/rowIndex|matchesRowIndex|response_id|privacy-1|duplicate-id/.test(duplicateMd), "public Markdown exposes only the aggregate duplicate-candidate count");
const source = fs.readFileSync(ANALYZER_PATH, "utf8");
ok(!/Date\.now|new Date|Math\.random|Intl|fetch\s*\(/.test(source), "analysis stays offline and deterministic");

console.log("survey-analysis.test: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
