const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const SPEC_PATH = path.join(ROOT, "docs", "evidence", "survey", "form-spec.json");
const RENDERER_PATH = path.join(ROOT, "tools", "survey", "render-google-form.cjs");
let pass = 0, fail = 0;
function ok(condition, message) {
  if (condition) { pass++; console.log("  ✓ " + message); }
  else { fail++; console.log("  ✗ " + message); }
}

console.log("survey-form.test: anonymous Arabic demand-survey contract");
ok(fs.existsSync(SPEC_PATH), "canonical form spec exists");
ok(fs.existsSync(RENDERER_PATH), "Google Forms renderer exists");
if (!fs.existsSync(SPEC_PATH) || !fs.existsSync(RENDERER_PATH)) {
  console.log("survey-form.test: " + pass + " passed, " + fail + " failed");
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
const Render = require(RENDERER_PATH);
ok(spec.language === "ar" && spec.estimatedMinutes === "3-4", "form is Arabic and 3–4 minutes");
ok(spec.settings.collectEmail === false && spec.settings.requireLogin === false && spec.settings.limitOneResponse === false && spec.settings.collectIp === false, "form disables email, login, one-response, and IP collection");
ok(spec.settings.rawDataLocation === "private/survey", "raw data location is private/survey");
ok(spec.sample.minimumValid === 80 && spec.sample.target === 150 && spec.sample.normalStop === 250 && spec.sample.optionalStretch === 384, "sample rules are preregistered");
ok(spec.sample.seedGroups === 5 && spec.sample.minValidPerSeedGroup === 10 && spec.sample.maxSharePerGroupPercent === 40, "five-source anti-monoculture rule is present");
ok(spec.hypotheses.H1.thresholdPercent === 35 && spec.hypotheses.H2.awkwardTopTwoPercent === 50 && spec.hypotheses.H2.avoidantActionPercent === 30 && spec.hypotheses.H2.anyStrainPercent === 20 && spec.hypotheses.H3.neutralReminderPercent === 40, "H1–H3 thresholds are preregistered");
ok(Array.isArray(spec.sourceLinks) && spec.sourceLinks.map(function (x) { return x.code; }).join(",") === "G1,G2,G3,G4,G5", "five prefilled source groups exist");

function byId(id) { return spec.questions.filter(function (q) { return q.id === id; })[0]; }
const requiredIds = ["consent", "eligible", "lent_frequency", "borrowed_frequency", "largest_lent", "delayed", "documentation", "reminder", "riba", "writing", "source_group"];
ok(requiredIds.every(function (id) { return byId(id) && byId(id).required === true; }), "core questions are required");
ok(byId("age").required === false && byId("nationality").required === false && byId("concept").required === false, "age, nationality, concept are optional");
ok(byId("consent").endOn === "لا" && byId("eligible").endOn === "لا", "negative consent and eligibility end the form");
["awkward", "action", "strain"].forEach(function (id) {
  ok(byId(id).showWhen.question === "delayed" && byId(id).showWhen.equals === "نعم", id + " appears only after delayed repayment");
});
ok(spec.questions.every(function (q) { return q.type !== "text" && q.type !== "paragraph"; }), "form contains no free-text collection");
ok(spec.questions.map(function (q) { return q.title; }).join(" ").indexOf("الاسم") < 0 && spec.questions.map(function (q) { return q.title; }).join(" ").indexOf("البريد") < 0 && spec.questions.map(function (q) { return q.title; }).join(" ").indexOf("الهاتف") < 0 && spec.questions.map(function (q) { return q.title; }).join(" ").indexOf("الهوية") < 0 && spec.questions.map(function (q) { return q.title; }).join(" ").indexOf("الحساب") < 0, "form excludes personal and bank data prompts");
ok(byId("lent_frequency").options.join(",") === "أبداً,مرة,2–3,4 فأكثر", "lending-frequency options are exact");
ok(byId("reminder").options.join(",") === "تذكير مباشر,تذكير آلي ومحايد,شخص ثالث موثوق,لا أريد تذكيراً,أفضل عدم الإجابة", "reminder options are exact");
ok(typeof Render.render === "function", "renderer exports render");
const gs = Render.render(spec);
ok(/FormApp\.create/.test(gs) && /setCollectEmail\(false\)/.test(gs) && /G1/.test(gs) && /تذكير آلي ومحايد/.test(gs), "renderer emits deterministic Google Apps Script with privacy settings and Arabic choices");
ok(!/addTextItem|addParagraphTextItem|setCollectEmail\(true\)/.test(gs), "generated Apps Script never creates free text or email collection");

console.log("survey-form.test: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
