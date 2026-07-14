# Ahd Demand Survey v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the long v1 survey toolchain with the approved 9/12-question Arabic v2, deterministic analysis, and a privacy-safe launch workflow.

**Architecture:** `form-spec.json` is the single source of truth for wording, routing, sampling, and hypotheses. A schema-driven Node renderer emits the Google Apps Script, while an offline Node analyzer normalizes Google CSV headers and calculates preregistered aggregate metrics. A separate exporter strips private Form and Sheet URLs before any public link artifact is committed.

**Tech Stack:** Node.js CommonJS, Google Apps Script (`FormApp`, `SpreadsheetApp`), JSON, CSV, Markdown, project-native test harness.

## Global Constraints

- Never modify `demo/index.html`, `app/engine.js`, or golden-function internals.
- Use TDD: observe each scoped test fail before adding the corresponding behavior.
- Keep `docs/evidence/survey/form-spec.json` at schema version `2.0.0` and make it the only source of Arabic prompts, options, routing, hypotheses, and sample thresholds.
- Create a new v2 Google Form and private linked Sheet; never rewrite the existing v1 Form or combine v1 responses with v2 responses.
- Collect no name, email, phone, national ID, bank/account data, IP address, or free-text financial detail.
- Raw responses, timestamps, editor URL, and response-Sheet URL stay under `private/survey/` and are never committed.
- Track only the public Form URL and G1–G5 prefilled URLs.
- Keep the evidence directional: `<80` exploratory, `80–149` directional pilot, `150–250` strong directional convenience evidence; never claim national representativeness.
- Public subgroups require `n >= 20`; metric bases below `k = 10` are suppressed; possible duplicates are flagged and never auto-deleted.
- Analyzer logic must not use `Date`, `Math.random`, `Intl`, `fetch`, floating money, or network access.
- Do not modify the evidence brief with survey percentages until real v2 responses have been collected and checked.
- Run Judge Lens once, at final integration only; do not spend evaluation tokens during Tasks 1–3.
- Stage only the exact files named by each task. Never stage `graphify-out/`, raw CSV, caches, logs, or unrelated user-owned files.

## File Structure

- Modify `docs/evidence/survey/form-spec.json` — canonical v2 instrument, sections, routing, analysis, and sampling contract.
- Modify `tools/survey/render-google-form.cjs` — validate the schema and deterministically render Apps Script.
- Regenerate `tools/survey/build-google-form.gs` — create the v2 Form, private Sheet, branches, and prefilled links.
- Modify `tests/app/survey-form.test.cjs` — exact v2 wording, route, privacy, and generated-script contract.
- Modify `tools/survey/analyze-responses.cjs` — v2 validation, Google-header normalization, aggregation, suppression, and Markdown.
- Replace `tests/app/fixtures/survey-responses.csv` — v2-only anonymous test rows.
- Modify `tests/app/survey-analysis.test.cjs` — hypothesis denominators, forgiveness/grace exclusion, low-documentation inclusion, duplicates, and tiers.
- Create `tools/survey/export-public-links.cjs` — whitelist public URLs and discard private URLs.
- Create `tests/app/survey-publication.test.cjs` — regression guard for tracked link privacy and owner workflow.
- Modify `docs/evidence/survey/OWNER-RUNBOOK.md` — versioned pretest, launch, privacy, and analysis procedure.
- Create `docs/evidence/survey/PRETEST-CHECKLIST.md` — short cognitive-pretest and soft-launch checklist.
- Modify `docs/evidence/survey/live-links.json` and `docs/evidence/survey/live-links.md` — sanitize and label the existing v1 links as a superseded pilot.
- Modify `_meta/OPEN-ITEMS.md`, `_meta/score-leap-loop-state.md`, `AmadHackathon/00 Home.md`, `AmadHackathon/06 قائمتك.md`, and `AmadHackathon/10 Demand Survey v2.md` — record tool readiness without claiming responses.

---

### Task 1: Canonical v2 Schema and Google Form Builder

**Files:**
- Modify: `tests/app/survey-form.test.cjs`
- Modify: `docs/evidence/survey/form-spec.json`
- Modify: `tools/survey/render-google-form.cjs`
- Regenerate: `tools/survey/build-google-form.gs`

**Interfaces:**
- Consumes: the approved design at `docs/superpowers/specs/2026-07-14-demand-survey-v2-design.md`.
- Produces: `loadSpec(file) -> object`, `validateSpec(spec) -> object`, and `render(spec) -> string`.
- Produces: generated Apps Script function `buildAhdDemandSurveyV2()`.

- [ ] **Step 1: Replace the form test with the exact v2 contract**

Use this complete test:

```js
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
```

- [ ] **Step 2: Run the form test and observe the v1 failure**

Run:

```powershell
node tests/app/survey-form.test.cjs
```

Expected: FAIL because the schema is `1.0.0`, contains 17 fields, and the renderer does not export `validateSpec` or create a linked Sheet.

- [ ] **Step 3: Replace `form-spec.json` with the canonical v2 schema**

Use this exact structure and content:

```json
{
  "version": "2.0.0",
  "language": "ar",
  "estimatedMinutes": "2-3",
  "title": "استبيان مجهول عن التعاملات المالية دون فائدة بين المعارف",
  "responseSpreadsheetTitle": "Ahd Demand Survey v2 — PRIVATE RESPONSES",
  "description": "استبيان بحثي مجهول يستغرق نحو دقيقتين إلى ثلاث. لا نجمع الاسم أو البريد أو رقم الهاتف أو الهوية أو بيانات الحساب. نستخدم النتائج المجمعة فقط، وهذه عينة اتجاهية وليست ممثلة لسكان المملكة.",
  "confirmationMessage": "شكرًا لمشاركتك. لا تجمع هذه الدراسة بيانات تعريفية، وتُحلل الإجابات بصورة مجمعة فقط.",
  "settings": {
    "collectEmail": false,
    "requireLogin": false,
    "limitOneResponse": false,
    "collectIp": false,
    "rawDataLocation": "private/survey",
    "randomizeChoices": false,
    "nationallyRepresentativeClaim": false
  },
  "sample": {
    "pretestMin": 5,
    "pretestMax": 8,
    "softLaunchValid": 20,
    "minimumValid": 80,
    "target": 150,
    "normalStop": 250,
    "optionalStretch": 384,
    "seedGroups": 5,
    "minValidPerSeedGroup": 10,
    "maxSharePerGroupPercent": 40,
    "claim": "عينة ملاءمة اتجاهية وليست ممثلة وطنيًا"
  },
  "hypotheses": {
    "H1": {
      "question": "experience_12m",
      "denominatorValues": ["أقرضت شخصًا فقط", "اقترضت من شخص فقط", "أقرضت واقترضت", "لم يحدث أي منهما"],
      "numeratorValues": ["أقرضت شخصًا فقط", "اقترضت من شخص فقط", "أقرضت واقترضت"],
      "thresholdPercent": 35
    },
    "H2": {
      "filter": { "question": "delayed_repayment", "equals": "نعم" },
      "requiredQuestions": ["asking_awkwardness", "first_action", "relationship_effect"],
      "excludedValues": ["أفضل عدم الإجابة"],
      "awkward": { "question": "asking_awkwardness", "numeratorValues": ["محرج نوعًا ما", "محرج جدًا"], "thresholdPercent": 50 },
      "avoidantAction": { "question": "first_action", "numeratorValues": ["لمّحت بدل أن أطلب مباشرة", "انتظرت وأجلت الطلب", "لم أطلب حفاظًا على العلاقة"], "thresholdPercent": 30 },
      "anyStrain": { "question": "relationship_effect", "numeratorValues": ["تأثرت سلبًا بدرجة بسيطة", "تأثرت سلبًا بدرجة واضحة"], "thresholdPercent": 20 }
    },
    "H3": {
      "documentationQuestion": "documentation_method",
      "lowDocumentationValues": ["محادثة عبر واتساب", "ملاحظة شخصية", "لا أوثّق"],
      "reminderQuestion": "reminder_preference",
      "excludedReminderValues": ["لا أعرف", "أفضل عدم الإجابة"],
      "numeratorValues": ["تذكير آلي ومحايد", "تذكير من شخص ثالث موثوق"],
      "thresholdPercent": 40
    }
  },
  "sourceLinks": [
    { "code": "G1", "label": "مجموعة نشر 1" },
    { "code": "G2", "label": "مجموعة نشر 2" },
    { "code": "G3", "label": "مجموعة نشر 3" },
    { "code": "G4", "label": "مجموعة نشر 4" },
    { "code": "G5", "label": "مجموعة نشر 5" }
  ],
  "sections": [
    { "id": "consent", "title": "المشاركة المجهولة", "questionIds": ["consent"] },
    { "id": "eligibility", "title": "الأهلية", "questionIds": ["eligible"] },
    { "id": "behavior", "title": "التجربة خلال آخر 12 شهرًا", "questionIds": ["experience_12m", "delayed_repayment"] },
    { "id": "delay_experience", "title": "التجربة عند تأخر السداد", "questionIds": ["asking_awkwardness", "first_action", "relationship_effect"] },
    { "id": "documentation_and_fit", "title": "التوثيق والتفضيلات", "questionIds": ["documentation_method", "reminder_preference", "agreement_preference", "product_priority", "source_group"] }
  ],
  "questions": [
    { "id": "consent", "title": "هل توافق على المشاركة الطوعية في هذا الاستبيان المجهول واستخدام إجاباتك بصورة مجمعة لأغراض هذا المشروع البحثي؟", "type": "choice", "options": ["نعم", "لا"], "required": true, "route": { "نعم": "eligibility", "لا": "SUBMIT" } },
    { "id": "eligible", "title": "هل عمرك 18 سنة أو أكثر وتقيم حاليًا في المملكة العربية السعودية؟", "type": "choice", "options": ["نعم", "لا"], "required": true, "route": { "نعم": "behavior", "لا": "SUBMIT" } },
    { "id": "experience_12m", "title": "خلال آخر 12 شهرًا، أيٌّ من الآتي حدث لك مع شخص تعرفه، دون فائدة؟", "type": "choice", "options": ["أقرضت شخصًا فقط", "اقترضت من شخص فقط", "أقرضت واقترضت", "لم يحدث أي منهما", "أفضل عدم الإجابة"], "required": true },
    { "id": "delayed_repayment", "title": "هل سبق أن تأخر شخص تعرفه في إعادة مبلغ أقرضته له؟", "type": "choice", "options": ["نعم", "لا", "لم أقرض شخصًا", "لا أتذكر", "أفضل عدم الإجابة"], "required": true, "route": { "نعم": "delay_experience", "لا": "documentation_and_fit", "لم أقرض شخصًا": "documentation_and_fit", "لا أتذكر": "documentation_and_fit", "أفضل عدم الإجابة": "documentation_and_fit" } },
    { "id": "asking_awkwardness", "title": "في آخر مرة تأخر فيها السداد، كيف كان شعورك عند طلب المبلغ؟", "type": "choice", "options": ["غير محرج إطلاقًا", "غير محرج نوعًا ما", "لا هذا ولا ذاك", "محرج نوعًا ما", "محرج جدًا", "أفضل عدم الإجابة"], "required": true, "showWhen": { "question": "delayed_repayment", "equals": "نعم" } },
    { "id": "first_action", "title": "في آخر مرة تأخر فيها السداد، ماذا فعلت أولًا؟", "type": "choice", "options": ["طلبت المبلغ مباشرة", "لمّحت بدل أن أطلب مباشرة", "انتظرت وأجلت الطلب", "اتفقنا على مهلة جديدة", "أبرأت الدين أو سامحت به برغبتي", "لم أطلب حفاظًا على العلاقة", "أفضل عدم الإجابة"], "required": true, "showWhen": { "question": "delayed_repayment", "equals": "نعم" } },
    { "id": "relationship_effect", "title": "بعد تلك التجربة، كيف تأثرت علاقتك بالشخص؟", "type": "choice", "options": ["تحسنت", "لم تتأثر", "تأثرت سلبًا بدرجة بسيطة", "تأثرت سلبًا بدرجة واضحة", "أفضل عدم الإجابة"], "required": true, "showWhen": { "question": "delayed_repayment", "equals": "نعم" } },
    { "id": "documentation_method", "title": "عند الإقراض أو الاقتراض بين المعارف، كيف توثّق الاتفاق عادة؟", "type": "choice", "options": ["اتفاق مكتوب يوضح المبلغ والشروط", "تحويل بنكي مع مرجع", "محادثة عبر واتساب", "ملاحظة شخصية", "لا أوثّق", "لم يسبق لي التعامل", "أفضل عدم الإجابة"], "required": true },
    { "id": "reminder_preference", "title": "إذا تأخر السداد، ما طريقة التذكير الأكثر راحة لك؟", "type": "choice", "options": ["أطلب مباشرة بنفسي", "تذكير آلي ومحايد", "تذكير من شخص ثالث موثوق", "أفضل عدم التذكير", "لا أعرف", "أفضل عدم الإجابة"], "required": true },
    { "id": "agreement_preference", "title": "عند قرض جديد بينك وبين شخص تعرفه، أي خيار يجعلك أكثر اطمئنانًا؟", "type": "choice", "options": ["اتفاق مكتوب وواضح", "اتفاق شفهي فقط", "لا فرق لدي", "يعتمد على الشخص أو المبلغ", "لا أعرف", "أفضل عدم الإجابة"], "required": true },
    { "id": "product_priority", "title": "تخيّل خدمة تحفظ اتفاق القرض، وترسل تذكيرًا متفقًا عليه، وتثبت السداد، دون أن تقرض المال أو تفرض فائدة أو غرامة أو تحكم بين الطرفين. ما الخيار الأكثر قيمة لك؟", "type": "choice", "options": ["توثيق الاتفاق", "التذكير المحايد", "إثبات السداد", "طلب مهلة أو إبراء الدين", "لا أرى قيمة في الخدمة", "لا أعرف", "أفضل عدم الإجابة"], "required": false },
    { "id": "source_group", "title": "رمز مجموعة النشر — اتركه كما هو", "type": "choice", "options": ["G1", "G2", "G3", "G4", "G5"], "required": true }
  ]
}
```

- [ ] **Step 4: Replace the renderer with schema validation and deterministic section generation**

Use this complete module:

```js
"use strict";

var fs = require("fs");
var path = require("path");

function js(value) { return JSON.stringify(value); }
function safeId(value) {
  if (!/^[a-z][a-z0-9_]*$/.test(value)) throw new Error("unsafe id: " + value);
  return value;
}
function indexBy(items, key, label) {
  var out = {};
  items.forEach(function (item) {
    var value = item[key];
    if (out[value]) throw new Error("duplicate " + label + ": " + value);
    out[value] = item;
  });
  return out;
}
function validateSpec(spec) {
  if (!spec || spec.version !== "2.0.0") throw new Error("survey schema must be 2.0.0");
  if (!Array.isArray(spec.sections) || !Array.isArray(spec.questions)) throw new Error("sections and questions are required");
  var sections = indexBy(spec.sections, "id", "section");
  var questions = indexBy(spec.questions, "id", "question");
  var assigned = {};
  spec.sections.forEach(function (section, sectionIndex) {
    safeId(section.id);
    if (!Array.isArray(section.questionIds) || !section.questionIds.length) throw new Error("empty section: " + section.id);
    section.questionIds.forEach(function (id) {
      if (!questions[id]) throw new Error("unknown question in section: " + id);
      if (assigned[id]) throw new Error("question assigned twice: " + id);
      assigned[id] = section.id;
    });
    if (sectionIndex === 0 && section.id !== "consent") throw new Error("consent must be the first section");
  });
  spec.questions.forEach(function (question) {
    safeId(question.id);
    if (!assigned[question.id]) throw new Error("unassigned question: " + question.id);
    if (question.type !== "choice" || !Array.isArray(question.options) || !question.options.length) throw new Error("choice options required: " + question.id);
    if (question.route) {
      question.options.forEach(function (option) {
        if (!Object.prototype.hasOwnProperty.call(question.route, option)) throw new Error("missing route for choice: " + question.id + ":" + option);
      });
      Object.keys(question.route).forEach(function (option) {
        var target = question.route[option];
        if (question.options.indexOf(option) < 0) throw new Error("route option missing from choices: " + question.id + ":" + option);
        if (target !== "SUBMIT" && !sections[target]) throw new Error("unknown route target: " + target);
        if (target === spec.sections[0].id) throw new Error("route cannot target the first section");
      });
    }
  });
  if (Object.keys(assigned).length !== spec.questions.length) throw new Error("every question must be assigned once");
  if (spec.sourceLinks.map(function (item) { return item.code; }).join(",") !== "G1,G2,G3,G4,G5") throw new Error("source groups must be G1-G5");
  return spec;
}
function addQuestion(lines, question) {
  var id = safeId(question.id);
  var base = "  var " + id + " = form.addMultipleChoiceItem().setTitle(" + js(question.title) + ").setRequired(" + question.required + ");";
  lines.push(base);
  if (!question.route) lines.push("  " + id + ".setChoiceValues(" + js(question.options) + ");");
}
function targetExpression(target) {
  return target === "SUBMIT" ? "FormApp.PageNavigationType.SUBMIT" : "page_" + safeId(target);
}
function render(spec) {
  validateSpec(spec);
  var questions = indexBy(spec.questions, "id", "question");
  var lines = [
    "/* Generated from docs/evidence/survey/form-spec.json. Do not edit by hand. */",
    "function buildAhdDemandSurveyV2() {",
    "  var form = FormApp.create(" + js(spec.title) + ");",
    "  form.setDescription(" + js(spec.description) + ");",
    "  form.setCollectEmail(false);",
    "  form.setLimitOneResponsePerUser(false);",
    "  form.setConfirmationMessage(" + js(spec.confirmationMessage) + ");",
    "  var responseSheet = SpreadsheetApp.create(" + js(spec.responseSpreadsheetTitle) + ");",
    "  form.setDestination(FormApp.DestinationType.SPREADSHEET, responseSheet.getId());"
  ];
  spec.sections.forEach(function (section, index) {
    if (index > 0) lines.push("  var page_" + safeId(section.id) + " = form.addPageBreakItem().setTitle(" + js(section.title) + ");");
    section.questionIds.forEach(function (id) { addQuestion(lines, questions[id]); });
  });
  spec.questions.filter(function (question) { return !!question.route; }).forEach(function (question) {
    var choices = question.options.map(function (option) {
      return question.id + ".createChoice(" + js(option) + ", " + targetExpression(question.route[option]) + ")";
    });
    lines.push("  " + question.id + ".setChoices([" + choices.join(", ") + "]);");
  });
  lines.push("  var links = {};");
  lines.push("  " + js(spec.sourceLinks.map(function (item) { return item.code; })) + ".forEach(function (code) { links[code] = form.createResponse().withItemResponse(source_group.createResponse(code)).toPrefilledUrl(); });");
  lines.push("  Logger.log(JSON.stringify({ editUrl: form.getEditUrl(), responseSheetUrl: responseSheet.getUrl(), publishedUrl: form.getPublishedUrl(), sourceLinks: links }));");
  lines.push("}");
  return lines.join("\n") + "\n";
}
function loadSpec(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }

module.exports = { loadSpec: loadSpec, validateSpec: validateSpec, render: render };

if (require.main === module) {
  var root = path.join(__dirname, "..", "..");
  var spec = loadSpec(path.join(root, "docs", "evidence", "survey", "form-spec.json"));
  var out = process.argv[2] || path.join(__dirname, "build-google-form.gs");
  fs.writeFileSync(out, render(spec), "utf8");
  process.stdout.write(out + "\n");
}
```

- [ ] **Step 5: Regenerate the Apps Script from the schema**

Run:

```powershell
node tools/survey/render-google-form.cjs
```

Expected: prints `tools\survey\build-google-form.gs`; the generated file contains `buildAhdDemandSurveyV2`, five Form sections, and a linked private response Sheet.

- [ ] **Step 6: Run the scoped form test**

Run:

```powershell
node tests/app/survey-form.test.cjs
```

Expected: PASS with zero failures.

- [ ] **Step 7: Commit the schema and builder**

```powershell
git add -- docs/evidence/survey/form-spec.json tools/survey/render-google-form.cjs tools/survey/build-google-form.gs tests/app/survey-form.test.cjs
git commit -m "feat(evidence): build concise Arabic survey v2"
```

---
### Task 2: Deterministic v2 Response Analyzer

**Files:**
- Modify: `tests/app/survey-analysis.test.cjs`
- Replace: `tests/app/fixtures/survey-responses.csv`
- Modify: `tools/survey/analyze-responses.cjs`

**Interfaces:**
- Consumes: schema v2 from Task 1.
- Produces: `loadResponses(csvText) -> Array<object>` with Google Arabic headers normalized to schema IDs.
- Produces: `validateResponse(row) -> { valid: boolean, reason?: string }`.
- Produces: `summarize(rows, { kFloor: number, minPublicGroup: number }) -> Summary`.
- Produces: `renderMarkdown(summary) -> string`.

- [ ] **Step 1: Replace the analyzer test with exact denominator and privacy cases**

Use this complete test. It deliberately proves that mercy is not avoidance and that all three low-documentation methods enter H3.

```js
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
ok(summary.hypotheses.H2.baseN === 10, "H2 uses complete substantive delayed cases only");
ok(summary.hypotheses.H2.awkward.percent === 50, "H2 awkwardness uses the preregistered top two");
ok(summary.hypotheses.H2.avoidantAction.count === 3 && summary.hypotheses.H2.avoidantAction.percent === 30, "H2 avoidance counts hint, postpone, and relationship protection only");
ok(summary.hypotheses.H2.avoidantAction.count < 5, "agreed grace and voluntary forgiveness are not avoidance");
ok(summary.hypotheses.H2.anyStrain.percent === 20 && summary.hypotheses.H2.pass === true, "all H2 component thresholds pass exactly");
ok(summary.hypotheses.H3.baseN === 10 && summary.hypotheses.H3.count === 4 && summary.hypotheses.H3.percent === 40, "H3 includes WhatsApp, personal note, and no documentation but excludes unknown/privacy reminders");
ok(summary.evidenceTier === "exploratory" && summary.otA1Status === "EXPLORATORY-NOT-CLAIMABLE", "fewer than 80 valid responses cannot support OT-A1");

const withDuplicate = measured.concat([Object.assign({}, measured[0], { response_id: "duplicate-id" })]);
ok(A.summarize(withDuplicate, { kFloor: 10, minPublicGroup: 20 }).duplicateCandidates.length === 1, "duplicate candidates are flagged but retained");

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

const md = A.renderMarkdown(summary);
ok(/12/.test(md) && /EXPLORATORY-NOT-CLAIMABLE/.test(md) && /30%/.test(md), "Markdown prints base n, honest status, and whole percentages");
ok(!/response_id|privacy-1|duplicate-id/.test(md), "Markdown never emits row identifiers");
const source = fs.readFileSync(ANALYZER_PATH, "utf8");
ok(!/Date\.now|new Date|Math\.random|Intl|fetch\s*\(/.test(source), "analysis stays offline and deterministic");

console.log("survey-analysis.test: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Replace the CSV fixture with four v2 rows using actual Google column titles**

Use this exact CSV. The final row intentionally duplicates the first response apart from timestamp.

```csv
Timestamp,هل توافق على المشاركة الطوعية في هذا الاستبيان المجهول واستخدام إجاباتك بصورة مجمعة لأغراض هذا المشروع البحثي؟,هل عمرك 18 سنة أو أكثر وتقيم حاليًا في المملكة العربية السعودية؟,"خلال آخر 12 شهرًا، أيٌّ من الآتي حدث لك مع شخص تعرفه، دون فائدة؟",هل سبق أن تأخر شخص تعرفه في إعادة مبلغ أقرضته له؟,"في آخر مرة تأخر فيها السداد، كيف كان شعورك عند طلب المبلغ؟","في آخر مرة تأخر فيها السداد، ماذا فعلت أولًا؟","بعد تلك التجربة، كيف تأثرت علاقتك بالشخص؟","عند الإقراض أو الاقتراض بين المعارف، كيف توثّق الاتفاق عادة؟","إذا تأخر السداد، ما طريقة التذكير الأكثر راحة لك؟","عند قرض جديد بينك وبين شخص تعرفه، أي خيار يجعلك أكثر اطمئنانًا؟","تخيّل خدمة تحفظ اتفاق القرض، وترسل تذكيرًا متفقًا عليه، وتثبت السداد، دون أن تقرض المال أو تفرض فائدة أو غرامة أو تحكم بين الطرفين. ما الخيار الأكثر قيمة لك؟",رمز مجموعة النشر — اتركه كما هو
2026/07/14 10:00,نعم,نعم,أقرضت شخصًا فقط,نعم,محرج جدًا,لمّحت بدل أن أطلب مباشرة,تأثرت سلبًا بدرجة واضحة,محادثة عبر واتساب,تذكير آلي ومحايد,اتفاق مكتوب وواضح,توثيق الاتفاق,G1
2026/07/14 10:01,نعم,نعم,اقترضت من شخص فقط,لم أقرض شخصًا,,,,ملاحظة شخصية,تذكير من شخص ثالث موثوق,يعتمد على الشخص أو المبلغ,إثبات السداد,G2
2026/07/14 10:02,نعم,نعم,لم يحدث أي منهما,لا,,,,لا أوثّق,لا أعرف,لا فرق لدي,,G3
2026/07/14 10:03,نعم,نعم,أقرضت شخصًا فقط,نعم,محرج جدًا,لمّحت بدل أن أطلب مباشرة,تأثرت سلبًا بدرجة واضحة,محادثة عبر واتساب,تذكير آلي ومحايد,اتفاق مكتوب وواضح,توثيق الاتفاق,G1
```

- [ ] **Step 3: Run the analyzer test and observe the v1 failure**

Run:

```powershell
node tests/app/survey-analysis.test.cjs
```

Expected: FAIL because the current analyzer requires v1 IDs, cannot normalize Arabic Google headers, counts forgiveness as avoidance, and excludes WhatsApp/personal notes from H3.

- [ ] **Step 4: Refactor the analyzer around the v2 schema**

Implement these exact rules in `tools/survey/analyze-responses.cjs`:

```js
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
  return { baseN: base, count: count, percent: percent, thresholdPercent: threshold, pass: percent >= threshold };
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
  rows.forEach(function (row) {
    var result = validateResponse(row);
    if (!result.valid) { invalid.push(result.reason); return; }
    var key = fingerprint(row);
    if (seen[key]) duplicates.push({ action: "flag-only" });
    else seen[key] = true;
    valid.push(row);
  });

  var suppressed = [];
  var h1Config = SPEC.hypotheses.H1;
  var h1Rows = valid.filter(function (row) { return h1Config.denominatorValues.indexOf(row[h1Config.question]) >= 0; });
  var h1 = metric("H1", h1Rows, function (row) { return h1Config.numeratorValues.indexOf(row[h1Config.question]) >= 0; }, h1Config.thresholdPercent, kFloor, suppressed);

  var h2Config = SPEC.hypotheses.H2;
  var h2Rows = valid.filter(function (row) {
    return row[h2Config.filter.question] === h2Config.filter.equals && h2Config.requiredQuestions.every(function (id) {
      return row[id] && h2Config.excludedValues.indexOf(row[id]) < 0;
    });
  });
  function h2Metric(name, config) {
    return metric("H2-" + name, h2Rows, function (row) { return config.numeratorValues.indexOf(row[config.question]) >= 0; }, config.thresholdPercent, kFloor, suppressed);
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
    seedDistributionPass: groups.every(function (group) { return group.n >= SPEC.sample.minValidPerSeedGroup && (pct(group.n, valid.length) || 0) <= SPEC.sample.maxSharePerGroupPercent; })
  };
  var tier = valid.length < SPEC.sample.minimumValid ? "exploratory" : (valid.length < SPEC.sample.target ? "directional-pilot" : (valid.length <= SPEC.sample.normalStop ? "strong-directional-convenience" : "optional-stretch"));
  var supported = valid.length >= SPEC.sample.minimumValid && h1.pass && h2Pass && h3.pass && sampleQuality.seedDistributionPass;

  return {
    validN: valid.length,
    invalidN: invalid.length,
    duplicateCandidates: duplicates,
    evidenceTier: tier,
    otA1Status: valid.length < SPEC.sample.minimumValid ? "EXPLORATORY-NOT-CLAIMABLE" : (supported ? "SUPPORTED-DIRECTIONAL" : "NOT-SUPPORTED"),
    hypotheses: { H1: h1, H2: { baseN: h2Rows.length, awkward: h2Awkward, avoidantAction: h2Avoidant, anyStrain: h2Strain, pass: h2Pass }, H3: h3 },
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
  return [
    "# نتائج استبيان الطلب المجهول — النسخة الثانية",
    "",
    "- العينة الصحيحة: " + summary.validN,
    "- المستوى: " + summary.evidenceTier,
    "- OT-A1: " + summary.otA1Status,
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
```

- [ ] **Step 5: Run the analyzer test**

Run:

```powershell
node tests/app/survey-analysis.test.cjs
```

Expected: PASS with zero failures, including exact-threshold H1–H3, Google-header normalization, mercy exclusion, duplicate flagging, and `SUPPORTED-DIRECTIONAL` only at `n >= 80`.

- [ ] **Step 6: Run both survey suites together**

```powershell
node tests/app/survey-form.test.cjs
node tests/app/survey-analysis.test.cjs
```

Expected: both exit `0`.

- [ ] **Step 7: Commit the analyzer**

```powershell
git add -- tools/survey/analyze-responses.cjs tests/app/survey-analysis.test.cjs tests/app/fixtures/survey-responses.csv
git commit -m "feat(evidence): analyze survey v2 responses reproducibly"
```

---

### Task 3: Privacy-Safe Publication and Launch Runbook

**Files:**
- Create: `tools/survey/export-public-links.cjs`
- Create: `tests/app/survey-publication.test.cjs`
- Modify: `docs/evidence/survey/OWNER-RUNBOOK.md`
- Create: `docs/evidence/survey/PRETEST-CHECKLIST.md`
- Modify: `docs/evidence/survey/live-links.json`
- Modify: `docs/evidence/survey/live-links.md`

**Interfaces:**
- Consumes: the private JSON object logged by `buildAhdDemandSurveyV2()`.
- Produces: `sanitizeLinks(payload, { schemaVersion, status }) -> PublicLinks`.
- Produces: `renderMarkdown(publicLinks) -> string`.
- Guarantees: public output contains only `schemaVersion`, `status`, `publishedUrl`, and ordered `sourceLinks.G1` through `sourceLinks.G5`.

- [ ] **Step 1: Write the failing public-link privacy test**

Create `tests/app/survey-publication.test.cjs`:

```js
"use strict";

const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const EXPORTER_PATH = path.join(ROOT, "tools", "survey", "export-public-links.cjs");
const LIVE_JSON = path.join(ROOT, "docs", "evidence", "survey", "live-links.json");
const LIVE_MD = path.join(ROOT, "docs", "evidence", "survey", "live-links.md");
const RUNBOOK = path.join(ROOT, "docs", "evidence", "survey", "OWNER-RUNBOOK.md");
const PRETEST = path.join(ROOT, "docs", "evidence", "survey", "PRETEST-CHECKLIST.md");
let pass = 0, fail = 0;
function ok(condition, message) {
  if (condition) { pass++; console.log("  ✓ " + message); }
  else { fail++; console.log("  ✗ " + message); }
}

console.log("survey-publication.test: public-link and launch privacy contract");
ok(fs.existsSync(EXPORTER_PATH), "public-link exporter exists");
ok(fs.existsSync(PRETEST), "pretest checklist exists");
if (!fs.existsSync(EXPORTER_PATH) || !fs.existsSync(PRETEST)) process.exit(1);

const Exporter = require(EXPORTER_PATH);
const privatePayload = {
  editUrl: "https://docs.google.com/forms/d/private-edit/edit",
  responseSheetUrl: "https://docs.google.com/spreadsheets/d/private-sheet/edit",
  publishedUrl: "https://docs.google.com/forms/d/e/public/viewform",
  sourceLinks: {
    G1: "https://docs.google.com/forms/d/e/public/viewform?entry=G1",
    G2: "https://docs.google.com/forms/d/e/public/viewform?entry=G2",
    G3: "https://docs.google.com/forms/d/e/public/viewform?entry=G3",
    G4: "https://docs.google.com/forms/d/e/public/viewform?entry=G4",
    G5: "https://docs.google.com/forms/d/e/public/viewform?entry=G5"
  }
};
const publicPayload = Exporter.sanitizeLinks(privatePayload, { schemaVersion: "2.0.0", status: "pretest-passed-active" });
ok(Object.keys(publicPayload).join("|") === "schemaVersion|status|publishedUrl|sourceLinks", "exporter uses an exact public-key whitelist");
ok(Object.keys(publicPayload.sourceLinks).join("|") === "G1|G2|G3|G4|G5", "exporter preserves only ordered source groups");
ok(!/private-edit|private-sheet|editUrl|responseSheetUrl/.test(JSON.stringify(publicPayload)), "private Form and Sheet URLs are discarded");
ok(!/private-edit|private-sheet|editUrl|responseSheetUrl/.test(Exporter.renderMarkdown(publicPayload)), "public Markdown cannot contain private URLs");
let badHostRejected = false;
try { Exporter.sanitizeLinks(Object.assign({}, privatePayload, { publishedUrl: "https://example.com/form" }), { schemaVersion: "2.0.0", status: "active" }); }
catch (error) { badHostRejected = /Google Forms URL/.test(error.message); }
ok(badHostRejected, "non-Google public URLs are rejected");

const trackedJson = fs.readFileSync(LIVE_JSON, "utf8");
const trackedMd = fs.readFileSync(LIVE_MD, "utf8");
ok(!/editUrl|responseSheetUrl|sheetUrl|spreadsheets\/d\//i.test(trackedJson + trackedMd), "tracked live-link artifacts contain no editor or Sheet URL");
const legacy = JSON.parse(trackedJson);
ok(legacy.schemaVersion === "1.0.0" && legacy.status === "superseded-pilot-do-not-distribute", "existing v1 links are preserved and clearly retired");

const runbook = fs.readFileSync(RUNBOOK, "utf8");
ok(/5–8/.test(runbook) && /20/.test(runbook) && /80/.test(runbook) && /150/.test(runbook) && /250/.test(runbook), "runbook states pretest, launch, minimum, target, and stop sizes");
ok(/do not combine|never combine/i.test(runbook) && /private\/survey/.test(runbook), "runbook separates v1/v2 and keeps raw data private");
ok(/cognitive|paraphrase/i.test(fs.readFileSync(PRETEST, "utf8")), "pretest checks respondent comprehension, not just completion");

console.log("survey-publication.test: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run the publication test and verify it fails**

Run:

```powershell
node tests/app/survey-publication.test.cjs
```

Expected: FAIL because the exporter and pretest checklist do not exist and tracked v1 JSON still contains `editUrl`.

- [ ] **Step 3: Implement the exact public-link whitelist exporter**

Create `tools/survey/export-public-links.cjs`:

```js
"use strict";

var fs = require("fs");
var CODES = ["G1", "G2", "G3", "G4", "G5"];

function googleFormUrl(value) {
  var parsed;
  try { parsed = new URL(value); }
  catch (error) { throw new Error("invalid Google Forms URL"); }
  if (parsed.protocol !== "https:" || parsed.hostname !== "docs.google.com" || parsed.pathname.indexOf("/forms/") !== 0) {
    throw new Error("invalid Google Forms URL");
  }
  return value;
}
function sanitizeLinks(payload, metadata) {
  if (!payload || !metadata || !metadata.schemaVersion || !metadata.status) throw new Error("payload and publication metadata are required");
  var sources = {};
  CODES.forEach(function (code) {
    if (!payload.sourceLinks || !payload.sourceLinks[code]) throw new Error("missing source link: " + code);
    sources[code] = googleFormUrl(payload.sourceLinks[code]);
  });
  return {
    schemaVersion: metadata.schemaVersion,
    status: metadata.status,
    publishedUrl: googleFormUrl(payload.publishedUrl),
    sourceLinks: sources
  };
}
function renderMarkdown(publicLinks) {
  var active = publicLinks.status === "pretest-passed-active";
  var lines = [
    "# Ahd demand survey public links",
    "",
    "- Schema: `" + publicLinks.schemaVersion + "`",
    "- Status: `" + publicLinks.status + "`",
    "- Distribution: " + (active ? "approved after pretest" : "do not distribute"),
    "- Public Form: " + publicLinks.publishedUrl,
    "",
    "## Prefilled source links",
    ""
  ];
  CODES.forEach(function (code) { lines.push("- " + code + ": " + publicLinks.sourceLinks[code]); });
  lines.push("");
  lines.push("Editor and response-Sheet URLs are private and intentionally absent.");
  lines.push("");
  return lines.join("\n");
}

module.exports = { sanitizeLinks: sanitizeLinks, renderMarkdown: renderMarkdown };

if (require.main === module) {
  var input = process.argv[2], jsonOutput = process.argv[3], markdownOutput = process.argv[4];
  var schemaVersion = process.argv[5], status = process.argv[6];
  if (!input || !jsonOutput || !markdownOutput || !schemaVersion || !status) {
    process.stderr.write("usage: node tools/survey/export-public-links.cjs <private-json> <public-json> <public-md> <schema-version> <status>\n");
    process.exit(1);
  }
  var raw = JSON.parse(fs.readFileSync(input, "utf8"));
  var clean = sanitizeLinks(raw, { schemaVersion: schemaVersion, status: status });
  fs.writeFileSync(jsonOutput, JSON.stringify(clean, null, 2) + "\n", "utf8");
  fs.writeFileSync(markdownOutput, renderMarkdown(clean), "utf8");
}
```

- [ ] **Step 4: Sanitize the tracked v1 artifact in place without copying any URL by hand**

Run this command. The script reads the existing object before overwriting it, preserves its public Form and G1–G5 values, discards `editUrl`, and labels the links retired.

```powershell
node tools/survey/export-public-links.cjs docs/evidence/survey/live-links.json docs/evidence/survey/live-links.json docs/evidence/survey/live-links.md 1.0.0 superseded-pilot-do-not-distribute
```

Expected: both tracked artifacts contain the existing public links, `schemaVersion: 1.0.0`, and `superseded-pilot-do-not-distribute`; neither contains an editor or Sheet URL.

- [ ] **Step 5: Replace the owner runbook with the versioned launch procedure**

Use these exact operational rules:

```markdown
# Anonymous demand survey v2 — owner runbook

This is a directional convenience survey, never a nationally representative study. It contains no free text and collects no name, email, phone, national ID, bank/account data, or IP address.

## Build

1. Run `node tools/survey/render-google-form.cjs` and confirm `node tests/app/survey-form.test.cjs` passes.
2. Paste `tools/survey/build-google-form.gs` into a new Google Apps Script project and run `buildAhdDemandSurveyV2`.
3. Keep the logged editor and response-Sheet URLs private. Copy the complete logged JSON only to `private/survey/v2-build-log.json`.
4. Do not edit or replace the v1 Form. Never combine v1 and v2 responses because wording and analytical categories differ.

## Pretest and launch

5. Complete `PRETEST-CHECKLIST.md` with 5–8 adults. Discard those responses.
6. Correct any comprehension or routing defect in `form-spec.json`, increment the schema version, regenerate the script, and create a fresh Form.
7. Soft-launch the frozen wording to 20 valid responses. If wording changes, create another Form and exclude the earlier responses.
8. After the pretest passes, publish sanitized links with:
   `node tools/survey/export-public-links.cjs private/survey/v2-build-log.json docs/evidence/survey/live-links.json docs/evidence/survey/live-links.md 2.0.0 pretest-passed-active`
9. Use five unrelated seed groups. Seek at least 10 valid responses per group and stop distributing to a group before it exceeds 40% of valid responses.
10. Hard minimum: 80 valid responses. Target: 150. Normal stop: 250. Use the optional 384 stretch only while recruitment diversity remains acceptable.

## Private analysis

11. Keep the linked Sheet private. Export raw CSV only to `private/survey/responses-v2.csv`; never commit raw rows, timestamps, screenshots of rows, editor URLs, Sheet URLs, or contact data.
12. Run `node tools/survey/analyze-responses.cjs private/survey/responses-v2.csv > docs/evidence/survey/aggregate-results.md`.
13. Review duplicate candidates manually; never auto-delete them. Publish no subgroup below `n = 20` and suppress metric bases below `n = 10`.
14. Below 80 valid responses, publish no headline percentage. At 80–149 label evidence a directional pilot; at 150–250 label it strong directional convenience evidence.
15. Survey-only evidence can be `SUPPORTED-DIRECTIONAL` only when H1, all three H2 components, H3, and source-distribution rules pass. It never closes OT-A1 or establishes Saudi national representativeness.
16. Report the concept question separately as exploratory. It cannot prove that the underlying problem exists.
```

- [ ] **Step 6: Create the cognitive-pretest and soft-launch checklist**

Create `docs/evidence/survey/PRETEST-CHECKLIST.md`:

```markdown
# Demand survey v2 pretest checklist

## Cognitive pretest — 5–8 adults

- [ ] Open each G1–G5 prefilled URL once and confirm the source code remains selected.
- [ ] Confirm “no consent” submits immediately without showing eligibility.
- [ ] Confirm “not eligible” submits immediately without showing behavior questions.
- [ ] Confirm only delayed-repayment “yes” shows the three pain questions.
- [ ] Confirm non-delay path shows 9 fields and delay path shows 12, including source code.
- [ ] Ask every participant to paraphrase Q3, Q4, Q6, Q9, and Q11 in their own words.
- [ ] Ask which answer, if any, was difficult to select and why.
- [ ] Confirm “agreed grace,” “voluntary forgiveness,” and “did not ask to protect the relationship” are understood as different actions.
- [ ] Confirm “automatic neutral reminder” does not imply collection, punishment, or judgment.
- [ ] Confirm the product question feels optional and allows a comfortable “no value” answer.
- [ ] Record only issue counts and wording/routing defects; record no participant names or financial stories.
- [ ] Discard all pretest responses before launch.

## Soft launch — 20 valid responses

- [ ] Confirm every eligible row has `experience_12m`, `delayed_repayment`, documentation, reminder, agreement, and source group.
- [ ] Confirm every delayed “yes” row has all three pain answers and all other rows have those cells blank.
- [ ] Confirm G1–G5 codes arrive correctly and no single source exceeds 40%.
- [ ] Run the analyzer and inspect invalid reasons, suppressed bases, and duplicate flags.
- [ ] Confirm raw data remains only under `private/survey/`.
- [ ] Freeze wording before broader distribution; any wording change requires a new Form and separate dataset.
```

- [ ] **Step 7: Run the publication and survey tests**

```powershell
node tests/app/survey-publication.test.cjs
node tests/app/survey-form.test.cjs
node tests/app/survey-analysis.test.cjs
```

Expected: all three exit `0`; tracked artifacts contain no private URL.

- [ ] **Step 8: Commit the launch workflow**

```powershell
git add -- tools/survey/export-public-links.cjs tests/app/survey-publication.test.cjs docs/evidence/survey/OWNER-RUNBOOK.md docs/evidence/survey/PRETEST-CHECKLIST.md docs/evidence/survey/live-links.json docs/evidence/survey/live-links.md
git commit -m "feat(evidence): harden survey launch privacy"
```

---

### Task 4: Final Integration, Honest State, and Handoff

**Files:**
- Modify: `_meta/OPEN-ITEMS.md`
- Modify: `_meta/score-leap-loop-state.md`
- Modify: `AmadHackathon/00 Home.md`
- Modify: `AmadHackathon/06 قائمتك.md`
- Modify: `AmadHackathon/10 Demand Survey v2.md`

**Interfaces:**
- Consumes: the three green commits from Tasks 1–3.
- Produces: a verified, committed v2 toolchain ready for human pretesting.
- Does not produce: responses, traction, national estimates, approval, or a Data-score increase.

- [ ] **Step 1: Run the survey suites and full project gate before evaluation**

```powershell
node tests/app/survey-form.test.cjs
node tests/app/survey-analysis.test.cjs
node tests/app/survey-publication.test.cjs
node tests/run-all.cjs
```

Expected: every scoped suite and the full gate exit `0`; use the live assertion total from stdout and do not estimate it in advance.

- [ ] **Step 2: Verify the frozen surfaces are untouched**

Resolve the task baseline from this plan's unique commit message, then compare the protected files against it:

```powershell
$SURVEY_BASE = (git rev-list -n 1 --grep='^docs(plan): add demand survey v2 implementation plan$' HEAD).Trim()
if (-not $SURVEY_BASE) { throw 'Survey implementation-plan commit was not found' }
git diff --exit-code $SURVEY_BASE -- demo/index.html app/engine.js
$hash = (Get-FileHash -Algorithm SHA256 -LiteralPath 'demo/index.html').Hash.ToLowerInvariant()
if ($hash -ne 'e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40') { throw "Frozen demo hash changed: $hash" }
```

Expected: no diff output and no exception.

- [ ] **Step 3: Perform one final Judge Lens review only**

Use `docs/JUDGE-LENS.md` once after the green gate. Evaluate only what this change can honestly affect:

- Data rigor: improved instrument and preregistration readiness, but no new empirical evidence and no score increase before responses.
- UX: lower respondent burden and safer routing; this is survey UX, not a new judge-facing app screen.
- Feasibility: reproducible Form/Sheet/analyzer workflow, still awaiting human pretest and fielding.
- Spine: no lending, judging, interest, penalties, scoring, heir liability, or fatwa language introduced.

If any currently visible criterion remains below 8, keep its existing `JL-` item open. Create a new `JL-` item only for a newly discovered defect; do not duplicate JL-14.

- [ ] **Step 4: Update project state without claiming field evidence**

Apply these exact state changes:

- In `_meta/OPEN-ITEMS.md`, append to JL-14: `Survey v2 toolchain ready: 9/12 path, private linked Sheet, deterministic analyzer, and pretest checklist. Still open until real responses are collected and analyzed.`
- In `_meta/score-leap-loop-state.md`, append a dated note: `Demand Survey v2 implementation improves readiness only. No responses were collected; OT-A1, JL-14, and the Data-score ceiling remain unchanged.`
- In `AmadHackathon/00 Home.md`, replace the Survey v2 status sentence with: `Survey v2 toolchain verified; cognitive pretest 5–8 and soft launch 20 are the next human steps. No demand result exists yet.`
- In `AmadHackathon/06 قائمتك.md`, keep the survey checkbox open and change its next action to: `Run the 5–8-person cognitive pretest; then soft-launch to 20 valid responses before broad distribution.`
- In `AmadHackathon/10 Demand Survey v2.md`, set status to: `Implementation verified; human cognitive pretest pending.` and link the runbook and pretest checklist.

- [ ] **Step 5: Commit the honest state update**

```powershell
git add -- _meta/OPEN-ITEMS.md _meta/score-leap-loop-state.md 'AmadHackathon/00 Home.md' 'AmadHackathon/06 قائمتك.md' 'AmadHackathon/10 Demand Survey v2.md'
git commit -m "docs(evidence): record survey v2 readiness"
```

- [ ] **Step 6: Run the final gate from the worktree and a clean committed archive**

```powershell
node tests/run-all.cjs
$archiveRoot = Join-Path $env:TEMP ("ahd-survey-v2-" + [guid]::NewGuid().ToString('N'))
$zip = $archiveRoot + '.zip'
git archive --format=zip HEAD -o $zip
Expand-Archive -LiteralPath $zip -DestinationPath $archiveRoot
Push-Location $archiveRoot
node tests/run-all.cjs
Pop-Location
```

Expected: both gates exit `0`, including the portable frozen-demo tripwire. The unique temporary archive need not be reused.

- [ ] **Step 7: Refresh Graphify without staging its generated output**

```powershell
$py = (Get-Content -LiteralPath 'graphify-out/.graphify_python' -Raw).Trim()
& $py -m graphify . --update
```

Expected: the graph includes the v2 schema, exporter, and three survey suites. Do not add `graphify-out/` to Git.

- [ ] **Step 8: Confirm the publication boundary and final diff**

```powershell
git status --short
git diff --name-only $SURVEY_BASE..HEAD
rg -n "editUrl|responseSheetUrl|spreadsheets/d/" docs/evidence/survey
rg -n "Date\.now|new Date|Math\.random|Intl|fetch\s*\(" tools/survey/analyze-responses.cjs
```

Expected:

- No staged or modified implementation files remain.
- `graphify-out/` may remain untracked and must not be staged.
- The survey diff contains only the whitelisted files in this plan.
- Both `rg` privacy/determinism scans return no matches.
- `demo/index.html` and `app/engine.js` are absent from the diff.

## Human Launch Handoff

Implementation completion stops before fielding. The owner then:

1. Runs the generated Apps Script to create a new v2 Form and private Sheet.
2. Completes the 5–8-person cognitive pretest.
3. Creates a fresh Form if any wording changes.
4. Soft-launches to 20 valid responses.
5. Publishes sanitized v2 links only after the pretest passes.
6. Targets 150 valid responses while maintaining five-group diversity.

No survey result, Judge Lens Data-score increase, or `OT-A1` closure may be claimed before those human steps and the preregistered analysis pass.
