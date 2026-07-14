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
