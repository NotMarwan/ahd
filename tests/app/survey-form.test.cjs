"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const SPEC_PATH = path.join(ROOT, "docs", "evidence", "survey", "form-spec.json");
const RENDERER_PATH = path.join(ROOT, "tools", "survey", "render-google-form.cjs");
const GENERATED_PATH = path.join(ROOT, "tools", "survey", "build-google-form.gs");
let pass = 0, fail = 0;
function ok(condition, message) {
  if (condition) { pass++; console.log("  ✓ " + message); }
  else { fail++; console.log("  ✗ " + message); }
}

console.log("survey-form.test: concise Arabic v2 survey contract");
const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
const Render = require(RENDERER_PATH);

const ids = spec.questions.map(function (q) { return q.id; });
const expectedIds = [
  "consent", "eligible", "experience_12m", "delayed_repayment",
  "asking_awkwardness", "first_action", "relationship_effect",
  "documentation_method", "reminder_preference", "agreement_preference",
  "product_priority", "source_group"
];
ok(spec.version === "2.0.0", "schema version is 2.0.0");
ok(spec.language === "ar" && spec.estimatedMinutes === "2-3", "form is Arabic and targets 2–3 minutes");
ok(ids.join("|") === expectedIds.join("|"), "the instrument has exactly 12 fields in approved order");
ok(spec.sections.map(function (s) { return s.id; }).join("|") === "consent|eligibility|behavior|delay_experience|documentation_and_fit", "five routing sections are separate and ordered");

function q(id) { return spec.questions.filter(function (item) { return item.id === id; })[0]; }
function pathCount(delayed) { return expectedIds.filter(function (id) {
  return ["asking_awkwardness", "first_action", "relationship_effect"].indexOf(id) < 0 || delayed;
}).length; }

ok(pathCount(false) === 9 && pathCount(true) === 12, "eligible paths contain 9 or 12 visible fields");
ok(q("consent").route["لا"] === "SUBMIT" && q("consent").route["نعم"] === "eligibility", "declined consent submits from its own section");
ok(q("eligible").route["لا"] === "SUBMIT" && q("eligible").route["نعم"] === "behavior", "ineligible respondents submit from a separate section");
ok(q("delayed_repayment").route["نعم"] === "delay_experience", "only delayed-repayment yes enters the pain section");
ok(["لا", "لم أقرض شخصًا", "لا أتذكر", "أفضل عدم الإجابة"].every(function (value) { return q("delayed_repayment").route[value] === "documentation_and_fit"; }), "all other delayed answers skip the pain section");
ok(q("product_priority").required === false && q("source_group").required === true, "product priority is optional and source code is required");
ok(q("first_action").options.indexOf("اتفقنا على مهلة جديدة") >= 0 && q("first_action").options.indexOf("أبرأت الدين أو سامحت به برغبتي") >= 0, "grace and voluntary forgiveness remain distinct choices");
ok(q("product_priority").options.indexOf("لا أرى قيمة في الخدمة") >= 0, "product question offers comfortable rejection");
ok(spec.settings.collectEmail === false && spec.settings.requireLogin === false && spec.settings.limitOneResponse === false && spec.settings.collectIp === false, "privacy settings disable identity collection");
ok(spec.sample.pretestMin === 5 && spec.sample.pretestMax === 8 && spec.sample.softLaunchValid === 20, "pretest and soft-launch sizes are frozen");
ok(spec.sample.minimumValid === 80 && spec.sample.target === 150 && spec.sample.normalStop === 250, "field sample thresholds are frozen");
ok(spec.questions.every(function (item) { return item.type === "choice"; }), "the form contains choice fields only");
ok(!/الاسم|البريد|الهاتف|الهوية|الحساب البنكي/.test(spec.questions.map(function (item) { return item.title; }).join(" ")), "prompts request no personal or banking identifiers");
ok(typeof Render.validateSpec === "function" && typeof Render.render === "function", "renderer exports validation and rendering interfaces");
ok(Render.validateSpec(spec) === spec, "approved schema validates");

const gs = Render.render(spec);
ok((gs.match(/addPageBreakItem/g) || []).length === 4, "generated Form has five sections without an empty first page");
ok(/SpreadsheetApp\.create/.test(gs) && /setDestination\(FormApp\.DestinationType\.SPREADSHEET/.test(gs), "generated script creates a linked response Sheet");
ok(/PageNavigationType\.SUBMIT/.test(gs) && /page_delay_experience/.test(gs) && /page_documentation_and_fit/.test(gs), "generated script emits terminal and conditional routing");
ok(/setCollectEmail\(false\)/.test(gs) && /setLimitOneResponsePerUser\(false\)/.test(gs), "generated script preserves privacy settings");
ok(!/addTextItem|addParagraphTextItem|setCollectEmail\(true\)/.test(gs), "generated script cannot collect free text or email");
ok(gs === fs.readFileSync(GENERATED_PATH, "utf8"), "tracked Apps Script exactly matches deterministic renderer output");

const broken = JSON.parse(JSON.stringify(spec));
broken.questions[3].route["نعم"] = "missing_section";
let rejected = false;
try { Render.validateSpec(broken); } catch (error) { rejected = /unknown route target/.test(error.message); }
ok(rejected, "renderer rejects a route to an unknown section");

console.log("survey-form.test: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
