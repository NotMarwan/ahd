#!/usr/bin/env node
/* stage-preflight.cjs — morning-of-stage hygiene check (JL-5).
   Additive tooling: verifies the gate CANNOT redden for a non-product reason before
   «شغّلها الآن أمامك». Not part of run-all.cjs — the gate stays 1687/0.
   Usage:  cd tests && node stage-preflight.cjs        (before going on stage)
           node stage-preflight.cjs --self-test        (manual teeth)             */
"use strict";
var fs = require("fs");
var os = require("os");
var path = require("path");
var cp = require("child_process");

var ROOT = path.join(__dirname, "..");

function checkPresenceAllExited(root) {
  var dir = path.join(root, "_meta/agent-presence");
  var offenders = [];
  if (!fs.existsSync(dir)) return { offenders: offenders };
  fs.readdirSync(dir).filter(function (f) { return f.endsWith(".json"); }).forEach(function (f) {
    var data;
    try { data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); }
    catch (e) { offenders.push({ file: f, reason: "unparseable JSON" }); return; }
    if (data.status !== "exited") {
      offenders.push({ file: f, agent_id: data.agent_id || null, status: data.status || null, reason: "status is not \"exited\"" });
    }
  });
  return { offenders: offenders };
}

function checkTripwire(root) {
  try {
    var out = cp.execSync("sha256sum -c _overnight/backup/demo.sha256", { cwd: root, encoding: "utf8" });
    return /:\s*OK/.test(out);
  } catch (e) { return false; }
}

function selfTest() {
  var failures = 0;
  function ok(cond, name) {
    console.log((cond ? "  ✓ " : "  ✗ ") + name);
    if (!cond) failures++;
  }
  function inTemp(build, assert) {
    var dir = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-preflight-"));
    try {
      var pdir = path.join(dir, "_meta/agent-presence");
      fs.mkdirSync(pdir, { recursive: true });
      build(pdir);
      assert(checkPresenceAllExited(dir));
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  }
  inTemp(function (pdir) {
    fs.writeFileSync(path.join(pdir, "claude-a.json"), JSON.stringify({ agent_id: "A", status: "exited" }));
    fs.writeFileSync(path.join(pdir, "claude-b.json"), JSON.stringify({ agent_id: "B", status: "exited" }));
  }, function (r) { ok(r.offenders.length === 0, "all-exited presence dir passes"); });
  inTemp(function (pdir) {
    // fresh heartbeat on purpose: preflight must flag ACTIVE even when the gate wouldn't (yet)
    fs.writeFileSync(path.join(pdir, "claude-c.json"), JSON.stringify({ agent_id: "C", status: "active", last_heartbeat: new Date().toISOString() }));
  }, function (r) { ok(r.offenders.length === 1 && r.offenders[0].agent_id === "C", "fresh ACTIVE file is flagged (stricter than the 45-min gate)"); });
  inTemp(function (pdir) {
    fs.writeFileSync(path.join(pdir, "broken.json"), "{not json");
  }, function (r) { ok(r.offenders.length === 1 && r.offenders[0].reason === "unparseable JSON", "unparseable presence file is flagged"); });
  var emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-preflight-"));
  try { ok(checkPresenceAllExited(emptyDir).offenders.length === 0, "missing _meta/agent-presence dir does not throw"); }
  finally { fs.rmSync(emptyDir, { recursive: true, force: true }); }
  console.log(failures === 0 ? "\nself-test: all passed" : "\nself-test: " + failures + " FAILED");
  process.exit(failures === 0 ? 0 : 1);
}

if (process.argv.indexOf("--self-test") !== -1) selfTest();
else {
  var presence = checkPresenceAllExited(ROOT);
  presence.offenders.forEach(function (o) {
    console.log("  ✗ presence: " + o.file + " — " + o.reason + (o.agent_id ? " (agent " + o.agent_id + ", status " + o.status + ")" : ""));
  });
  if (presence.offenders.length === 0) console.log("  ✓ presence: every agent file is \"exited\"");
  var tripOk = checkTripwire(ROOT);
  console.log((tripOk ? "  ✓ " : "  ✗ ") + "tripwire: demo/index.html " + (tripOk ? "OK (e2f48467…)" : "FAILED"));
  console.log("\n============================================================");
  if (presence.offenders.length === 0 && tripOk) {
    console.log("  READY FOR STAGE ✅  — run-all.cjs cannot redden for a non-product reason");
  } else {
    console.log("  NOT READY ❌  — fix the lines above, then re-run");
  }
  console.log("============================================================");
  process.exit(presence.offenders.length === 0 && tripOk ? 0 : 1);
}
