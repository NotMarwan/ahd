"use strict";

var fs = require("fs");
var path = require("path");

function js(value) { return JSON.stringify(value); }
function question(spec, id) {
  for (var i = 0; i < spec.questions.length; i++) if (spec.questions[i].id === id) return spec.questions[i];
  throw new Error("missing question: " + id);
}
function addChoice(varName, q) {
  return "var " + varName + " = form.addMultipleChoiceItem().setTitle(" + js(q.title) + ").setChoiceValues(" + js(q.options) + ").setRequired(" + q.required + ");";
}
function render(spec) {
  var consent = question(spec, "consent"), eligible = question(spec, "eligible"), delayed = question(spec, "delayed");
  var lines = [
    "/* Generated from docs/evidence/survey/form-spec.json. Do not edit by hand. */",
    "function buildAhdDemandSurvey() {",
    "  var form = FormApp.create(" + js(spec.title) + ");",
    "  form.setDescription(" + js(spec.description) + ");",
    "  form.setCollectEmail(false);",
    "  form.setLimitOneResponsePerUser(false);",
    "  form.setConfirmationMessage(" + js("شكراً لمشاركتك. لا تجمع هذه الدراسة بيانات تعريفية، وتُحلل الإجابات مجمعة فقط.") + ");",
    "  var consent = form.addMultipleChoiceItem().setTitle(" + js(consent.title) + ").setRequired(true);",
    "  consent.setChoices([consent.createChoice(" + js("نعم") + ", FormApp.PageNavigationType.CONTINUE), consent.createChoice(" + js("لا") + ", FormApp.PageNavigationType.SUBMIT)]);",
    "  var eligible = form.addMultipleChoiceItem().setTitle(" + js(eligible.title) + ").setRequired(true);",
    "  eligible.setChoices([eligible.createChoice(" + js("نعم") + ", FormApp.PageNavigationType.CONTINUE), eligible.createChoice(" + js("لا") + ", FormApp.PageNavigationType.SUBMIT)]);"
  ];
  ["age", "nationality", "lent_frequency", "borrowed_frequency", "largest_lent"].forEach(function (id) { lines.push("  " + addChoice(id, question(spec, id))); });
  lines.push("  var delayed = form.addMultipleChoiceItem().setTitle(" + js(delayed.title) + ").setRequired(true);");
  lines.push("  var painPage = form.addPageBreakItem().setTitle(" + js("التجربة عند التأخر") + ");");
  ["awkward", "action", "strain"].forEach(function (id) { lines.push("  " + addChoice(id, question(spec, id))); });
  lines.push("  var afterPainPage = form.addPageBreakItem().setTitle(" + js("التوثيق والتفضيلات") + ");");
  ["documentation", "reminder", "riba", "writing", "concept", "source_group"].forEach(function (id) { lines.push("  " + addChoice(id, question(spec, id))); });
  lines.push("  delayed.setChoices([delayed.createChoice(" + js("نعم") + ", painPage), delayed.createChoice(" + js("لا") + ", afterPainPage), delayed.createChoice(" + js("لا أتذكر") + ", afterPainPage)]);");
  lines.push("  var links = {};" );
  lines.push("  [" + spec.sourceLinks.map(function (s) { return js(s.code); }).join(", ") + "].forEach(function (code) { links[code] = form.createResponse().withItemResponse(source_group.createResponse(code)).toPrefilledUrl(); });");
  lines.push("  Logger.log(JSON.stringify({ editUrl: form.getEditUrl(), publishedUrl: form.getPublishedUrl(), sourceLinks: links }));");
  lines.push("}");
  return lines.join("\n") + "\n";
}
function loadSpec(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
module.exports = { render: render, loadSpec: loadSpec };
if (require.main === module) {
  var root = path.join(__dirname, "..", "..");
  var spec = loadSpec(path.join(root, "docs", "evidence", "survey", "form-spec.json"));
  var out = process.argv[2] || path.join(__dirname, "build-google-form.gs");
  fs.writeFileSync(out, render(spec), "utf8");
  process.stdout.write(out + "\n");
}
