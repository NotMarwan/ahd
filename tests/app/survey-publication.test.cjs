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
