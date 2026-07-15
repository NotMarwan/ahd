#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function read(file) { return fs.readFileSync(file, "utf8"); }

function collectLiveFacts(root) {
  const screenDir = path.join(root, "app", "screens");
  const screens = fs.readdirSync(screenDir).filter(file => file.endsWith(".js")).reduce((count, file) => count + ((read(path.join(screenDir, file)).match(/\.registerScreen\s*\(/g) || []).length), 0);
  const suiteDir = path.join(root, "tests", "app");
  const suites = fs.readdirSync(suiteDir).filter(file => /(\.test|-parity|-smoke)\.cjs$/.test(file) && file !== "run-app-tests.cjs").length;
  const routerSource = read(path.join(root, "server", "router.cjs"));
  const routes = (routerSource.match(/\{\s*method:\s*"(?:GET|POST|PUT|PATCH|DELETE)"\s*,\s*path:/g) || []).length;
  const httpSource = read(path.join(root, "server", "http.cjs"));
  const runAll = read(path.join(root, "tests", "run-all.cjs"));
  const auth = /function defaultAuthConfig[\s\S]*?enabled:\s*true/.test(httpSource) ? "hmac-default-on" : "unknown";
  const liveSmoke = /smoke-live\.cjs/.test(runAll) && /smoke-live\s+\(over-the-wire parity\)/.test(runAll);
  return { screens, suites, routes, auth, liveSmoke, deployment: "local-prototype" };
}

function checkClaims(documents, facts) {
  const errors = [];
  const entries = Object.entries(documents || {});
  const joined = entries.map(entry => entry[1]).join("\n");
  function countClaims(pattern, expected, label) {
    entries.forEach(([file, text]) => {
      text = text.split(/\r?\n/).filter(line => !/\b(?:original|initial|earlier|historical|then-live)\b/i.test(line)).join("\n");
      let match;
      const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
      while ((match = re.exec(text))) if (Number(match[1]) !== expected) errors.push(file + " stale " + label + " claim: " + match[1] + " != " + expected);
    });
  }
  countClaims(/\b(\d+)\s+(?:registered\s+)?screens?\b/gi, facts.screens, "screen");
  countClaims(/\b(\d+)\s+(?:app\s+)?suites?\b/gi, facts.suites, "suite");
  countClaims(/\b(\d+)\s+(?:server\s+)?routes?\b/gi, facts.routes, "route");
  entries.forEach(([file, text]) => {
    if (/\b(?:no|without) authentication(?: or authorization)?\b/i.test(text)) errors.push(file + " stale authentication claim");
    if (/\bno live HTTP smoke\b|not invoked by `?run-all\.cjs`?/i.test(text)) errors.push(file + " stale live-smoke claim");
    if (/\bis deployed (?:to )?production\b|\bproduction-deployed\b/i.test(text)) errors.push(file + " false production deployment claim");
    if (/gate stays\s+\d+\/0|app has\s+\d+\s+screens/i.test(text) && file.endsWith(".cjs")) errors.push(file + " stale source comment");
  });
  if (!new RegExp("\\b" + facts.screens + "\\s+(?:registered\\s+)?screens?\\b", "i").test(joined)) errors.push("current screen claim missing");
  if (!new RegExp("\\b" + facts.suites + "\\s+(?:app\\s+)?suites?\\b", "i").test(joined)) errors.push("current suite claim missing");
  if (!new RegExp("\\b" + facts.routes + "\\s+(?:server\\s+)?routes?\\b", "i").test(joined)) errors.push("current route claim missing");
  if (facts.auth === "hmac-default-on" && !/HMAC[\s\S]{0,80}default(?:-on| on|s on)|default(?:-on| on)[\s\S]{0,80}HMAC/i.test(joined)) errors.push("current HMAC default-on claim missing");
  if (facts.liveSmoke && !/live HTTP smoke|live smoke gate-wired|gate-wired live HTTP smoke/i.test(joined)) errors.push("current live-smoke claim missing");
  if (facts.deployment === "local-prototype" && !/local prototype|not production|not a production/i.test(joined)) errors.push("local-not-production claim missing");
  return { ok: errors.length === 0, errors };
}

function checkDecisionIds(entries) {
  const errors = [], seen = new Map();
  (entries || []).filter(entry => entry.status !== "historical").forEach(entry => {
    if (!entry.id) return;
    if (seen.has(entry.id) && seen.get(entry.id) !== entry.subject) errors.push("duplicate active decision identifier " + entry.id + ": " + seen.get(entry.id) + " / " + entry.subject);
    else seen.set(entry.id, entry.subject);
  });
  return { ok: errors.length === 0, errors };
}

function currentPrefix(text) {
  const index = text.indexOf("\n---");
  return index >= 0 ? text.slice(0, index) : text;
}

function validateRepository(root) {
  const facts = collectLiveFacts(root);
  const documents = {
    "CLAUDE.md": read(path.join(root, "CLAUDE.md")),
    "AGENTS.md": read(path.join(root, "AGENTS.md")),
    "docs/ARCHITECTURE.md": read(path.join(root, "docs", "ARCHITECTURE.md")),
    "_meta/STATUS.md": currentPrefix(read(path.join(root, "_meta", "STATUS.md"))),
    "_meta/score-leap-loop-state.md": read(path.join(root, "_meta", "score-leap-loop-state.md")).split(/^## /m)[0],
    "tests/stage-preflight.cjs": read(path.join(root, "tests", "stage-preflight.cjs"))
  };
  const claims = checkClaims(documents, facts);
  const decisionText = read(path.join(root, "docs", "DECISIONS-FOR-MARWAN.md"));
  const openText = read(path.join(root, "_meta", "OPEN-ITEMS.md"));
  const scoreText = read(path.join(root, "_meta", "score-leap-loop-state.md"));
  const decisions = [];
  for (const match of decisionText.matchAll(/^###\s+(D-\d+)\s+·\s+(.+)$/gm)) decisions.push({ id: match[1], subject: match[2], status: "active" });
  if (/\bINN-D4\b/.test(openText + scoreText)) decisions.push({ id: "INN-D4", subject: "inheritance innovation proposal", status: "active" });
  if (/(?<!INN-)\bD-4\b[^\n]*(?:inheritance|innovation|ميراث)|(?:inheritance|innovation|ميراث)[^\n]*(?<!INN-)\bD-4\b/i.test(openText + "\n" + scoreText)) decisions.push({ id: "D-4", subject: "inheritance innovation proposal", status: "active" });
  const decisionResult = checkDecisionIds(decisions);
  return { ok: claims.ok && decisionResult.ok, errors: claims.errors.concat(decisionResult.errors), facts, decisions };
}

module.exports = { collectLiveFacts, checkClaims, checkDecisionIds, validateRepository };

if (require.main === module) {
  const root = path.join(__dirname, "..");
  const result = validateRepository(root);
  console.log(result.ok ? "RELEASE-TRUTH: OK — " + result.facts.screens + " screens, " + result.facts.suites + " suites, " + result.facts.routes + " routes" : "RELEASE-TRUTH: FAILED\n- " + result.errors.join("\n- "));
  process.exit(result.ok ? 0 : 1);
}
