#!/usr/bin/env node
"use strict";

const path = require("path");
let Truth;
try { Truth = require(path.join(__dirname, "release-truth-check.cjs")); } catch (_) {}

let passed = 0, failed = 0;
function ok(condition, name) {
  if (condition) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ " + name); }
}

console.log("release-truth-check.test: live architecture and claim truth");
ok(!!Truth, "truth validator exists");
if (!Truth) {
  console.log("release-truth-check.test: " + passed + " passed, " + failed + " failed");
  process.exit(1);
}

const facts = {
  screens: 21,
  suites: 69,
  routes: 6,
  auth: "hmac-default-on",
  liveSmoke: true,
  deployment: "local-prototype"
};
const clean = {
  "architecture.md": "Ahd app has 21 screens and 6 routes. HMAC auth is enabled by default on the live local server. Deployment status: local prototype. Live HTTP smoke is gate-wired.",
  "status.md": "Current: 21 screens; 69 suites; 6 routes; local prototype; HMAC default-on; live HTTP smoke enabled.",
  "guide.md": "Run the local prototype. The live server uses HMAC authentication by default and the gate runs live HTTP smoke.",
  "source.cjs": "/* current gate count is discovered at runtime; 21 screens */"
};
ok(Truth.checkClaims(clean, facts).ok, "accepts current architecture, status, guide, and source claims");
ok(!Truth.checkClaims(Object.assign({}, clean, { "architecture.md": "Ahd app has 20 screens and 6 routes." }), facts).ok, "rejects stale screen count");
ok(!Truth.checkClaims(Object.assign({}, clean, { "status.md": "Current app uses 68 suites." }), facts).ok, "rejects stale suite count");
ok(!Truth.checkClaims(Object.assign({}, clean, { "architecture.md": "The server exposes 5 routes." }), facts).ok, "rejects stale route count");
ok(!Truth.checkClaims(Object.assign({}, clean, { "guide.md": "The server has no authentication." }), facts).ok, "rejects stale authentication claim");
ok(!Truth.checkClaims(Object.assign({}, clean, { "guide.md": "No live HTTP smoke exists." }), facts).ok, "rejects stale live-smoke claim");
ok(!Truth.checkClaims(Object.assign({}, clean, { "status.md": "Ahd is deployed to production." }), facts).ok, "rejects false production deployment claim");
ok(!Truth.checkClaims(Object.assign({}, clean, { "source.cjs": "/* gate stays 1687/0; app has 20 screens */" }), facts).ok, "rejects stale source comment");
ok(!Truth.checkDecisionIds([
  { id: "D-4", subject: "frozen-demo decision", status: "active" },
  { id: "D-4", subject: "inheritance innovation", status: "active" }
]).ok, "rejects duplicated active decision identifier");
ok(Truth.checkDecisionIds([
  { id: "D-4", subject: "frozen-demo decision", status: "active" },
  { id: "INN-D4", subject: "inheritance innovation", status: "active" },
  { id: "D-4", subject: "historical snapshot", status: "historical" }
]).ok, "accepts namespaced innovation and historical citation");

const liveFacts = Truth.collectLiveFacts(path.join(__dirname, ".."));
ok(liveFacts.screens === 21, "derives 21 screen registrations from live code");
ok(liveFacts.suites === 69, "derives 69 app suites from discovery rules");
ok(liveFacts.routes === 6, "derives 6 server routes from live router");
ok(liveFacts.auth === "hmac-default-on", "derives live server auth default");
ok(liveFacts.liveSmoke === true, "derives run-all live HTTP smoke wiring");
const live = Truth.validateRepository(path.join(__dirname, ".."));
ok(live.ok, "repository current-state claims match live code and decision identities" + (live.ok ? "" : ": " + live.errors.join("; ")));

console.log("release-truth-check.test: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
