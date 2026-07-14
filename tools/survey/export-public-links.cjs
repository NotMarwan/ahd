"use strict";

var fs = require("fs");
var CODES = ["G1", "G2", "G3", "G4", "G5"];

function googleFormUrl(value, expectedPath, sourceCode) {
  var parsed;
  try { parsed = new URL(value); }
  catch (error) { throw new Error("invalid Google Forms URL"); }
  if (parsed.protocol !== "https:" || parsed.host !== "docs.google.com" || !/^\/forms\/d\/e\/[^/]+\/viewform$/.test(parsed.pathname)) {
    throw new Error("invalid Google Forms URL");
  }
  if (expectedPath && parsed.pathname !== expectedPath) throw new Error("invalid Google Forms URL: mismatched Form ID");
  if (sourceCode) {
    var matchingPrefill = false;
    parsed.searchParams.forEach(function (parameterValue, parameterName) {
      if (/^entry\..+$/.test(parameterName) && parameterValue === sourceCode) matchingPrefill = true;
    });
    if (!matchingPrefill) throw new Error("invalid Google Forms URL: missing or mismatched source prefill");
  }
  return parsed;
}
function sanitizeLinks(payload, metadata) {
  if (!payload || !metadata || !metadata.schemaVersion || !metadata.status) throw new Error("payload and publication metadata are required");
  var published = googleFormUrl(payload.publishedUrl);
  var sources = {};
  CODES.forEach(function (code) {
    if (!payload.sourceLinks || !payload.sourceLinks[code]) throw new Error("missing source link: " + code);
    googleFormUrl(payload.sourceLinks[code], published.pathname, code);
    sources[code] = payload.sourceLinks[code];
  });
  return {
    schemaVersion: metadata.schemaVersion,
    status: metadata.status,
    publishedUrl: payload.publishedUrl,
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
