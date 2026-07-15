#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.join(__dirname, "..");
let Claim, Governance;
try { Claim = require(path.join(ROOT, "project", "agent-control", "claim.cjs")); } catch (_) {}
try { Governance = require(path.join(__dirname, "agent-governance.cjs")); } catch (_) {}

let passed = 0, failed = 0;
function ok(condition, name) {
  if (condition) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ " + name); }
}
function rejects(fn, pattern, name) {
  try { fn(); ok(false, name); } catch (error) { ok(pattern.test(String(error.message || error)), name); }
}
function tempDir() { return fs.mkdtempSync(path.join(os.tmpdir(), "ahd-agent-governance-")); }

console.log("agent-governance.test: dispatch, lock, path, evidence, completion");
ok(!!Claim, "claim module exists");
ok(!!Governance, "policy module exists");
if (!Claim || !Governance) {
  console.log("agent-governance.test: " + passed + " passed, " + failed + " failed");
  process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(path.join(ROOT, "project", "agent-control", "protected-paths.json"), "utf8"));
const tasksText = [
  "- [x] T001 baseline `src/base.js`",
  "- [ ] T005 governance `src/a.js`",
  "- [ ] T006 red evidence `src/b.js`",
  "- [ ] T015 checksum `tests/fixtures/demo.sha256`",
  "- [ ] T016 truth `src/truth.js`"
].join("\n");

function makeDispatch(overrides) {
  const d = Object.assign({
    schema: "ahd-controller-dispatch-v1",
    dispatch_id: "wave0-T005-unit",
    issued_by: "root",
    agent_id: "worker",
    wave: "specs/001-freeze-safety",
    task_id: "T005",
    mode: "writer",
    files: ["src/a.js"],
    depends_on: ["T001"],
    created_at: "2026-07-15T03:00:00+03:00",
    constitution_version: "2.0.0"
  }, overrides || {});
  delete d.dispatch_sha256;
  d.dispatch_sha256 = Claim.dispatchHash(d);
  return d;
}
function validate(dispatch, issued) {
  return Claim.validateDispatch(dispatch, {
    issued: issued === undefined ? dispatch : issued,
    activePackage: "specs/001-freeze-safety",
    tasksText,
    protectedContract: contract,
    controllerId: "root"
  });
}

ok(validate(makeDispatch()).ok, "accepts issued active-wave dispatch");
ok(!validate(makeDispatch({ wave: "specs/002-judge-readiness" })).ok, "rejects wrong or later active package");
ok(!validate(makeDispatch({ task_id: "T5" })).ok, "rejects malformed task ID");
ok(!validate(makeDispatch({ task_id: "T099" })).ok, "rejects unknown task");
ok(!validate(makeDispatch({ files: [] })).ok, "rejects writer without files");
ok(!validate(makeDispatch({ files: ["src/off-task.js"] })).ok, "rejects off-task file");
ok(!validate(makeDispatch({ created_at: "2026-07-15T03:00:00Z" })).ok, "rejects timestamp without explicit numeric offset");
ok(!validate(makeDispatch({ depends_on: ["T016"] })).ok, "rejects unchecked dependency");
ok(!validate(makeDispatch(), null).ok, "rejects unissued dispatch");
const mismatch = makeDispatch();
ok(!validate(mismatch, Object.assign({}, mismatch, { agent_id: "other" })).ok, "rejects issued-field mismatch");
const badHash = makeDispatch(); badHash.dispatch_sha256 = "0".repeat(64);
ok(!validate(badHash, badHash).ok, "rejects dispatch hash mismatch");
ok(!validate(makeDispatch({ files: ["src/a.js", "src/a.js/child"] })).ok, "rejects ancestor-descendant path collision");
ok(Claim.normalizeRepoPath("SRC\\A.js") === "src/a.js", "normalizes separators and case");
ok(Claim.parseTasks("- [ ] T021 guides `AGENTS.md` and `CLAUDE.md`").get("T021").paths.length === 2, "authorizes explicit root-level task files");

for (const rule of contract.rules) {
  const sample = rule.kind === "prefix" ? rule.path + "case.json" : rule.path;
  ok(!validate(makeDispatch({ files: [sample] })).ok, "protects " + rule.kind + " path " + rule.path);
}
ok(validate(makeDispatch({ task_id: "T015", dispatch_id: "wave0-T015-unit", files: ["TESTS\\FIXTURES\\DEMO.SHA256"], depends_on: ["T001"] })).ok,
  "allows only T015 checksum exception case-insensitively");

const control = tempDir();
try {
  const first = makeDispatch();
  Claim.acquireWriter({ controlDir: control, dispatch: first, issued: first, activePackage: "specs/001-freeze-safety", tasksText, protectedContract: contract, controllerId: "root" });
  const second = makeDispatch({ dispatch_id: "wave0-T005-second", agent_id: "worker-2" });
  rejects(() => Claim.acquireWriter({ controlDir: control, dispatch: second, issued: second, activePackage: "specs/001-freeze-safety", tasksText, protectedContract: contract, controllerId: "root" }), /writer.*active|lock/i,
    "rejects second writer across shared control directory");
  rejects(() => Claim.releaseWriter({ controlDir: control, agentId: "other", dispatchId: first.dispatch_id }), /owner|claim/i, "rejects release by non-owner");
  Claim.releaseWriter({ controlDir: control, agentId: first.agent_id, dispatchId: first.dispatch_id });
  ok(!fs.existsSync(path.join(control, "writer.lock")), "owner releases writer lock");
  const audit = Claim.createAudit({ controlDir: control, claim: { schema: "ahd-agent-claim-v1", agent_id: "auditor", dispatch_id: "audit-1", mode: "audit", files: [], created_at: "2026-07-15T03:01:00+03:00" } });
  ok(fs.existsSync(audit.path), "creates read-only audit claim without writer lock");
} finally { fs.rmSync(control, { recursive: true, force: true }); }

const needFix = { review_id: "R1", reviewer: "reviewer", verdict: "needs-fix", supersedes: null };
const approved = { review_id: "R2", reviewer: "reviewer", verdict: "approved", supersedes: "R1" };
ok(Claim.validateEvidenceTransition({ before: { reviews: [needFix] }, after: { reviews: [needFix, approved], implementer: "worker", status: "complete" } }).ok,
  "keeps needs-fix history and accepts superseding approval");
ok(!Claim.validateEvidenceTransition({ before: { reviews: [needFix] }, after: { reviews: [Object.assign({}, needFix, { verdict: "approved" })], implementer: "worker", status: "complete" } }).ok,
  "rejects mutation of prior review history");
ok(!Claim.validateEvidenceTransition({ before: { reviews: [] }, after: { reviews: [{ review_id: "R1", reviewer: "worker", verdict: "approved", supersedes: null }], implementer: "worker", status: "complete" } }).ok,
  "rejects self-review without owner override");
ok(Claim.validateEvidenceTransition({ before: { reviews: [] }, after: { reviews: [{ review_id: "R1", reviewer: "root", verdict: "approved", supersedes: null }], implementer: "root", status: "complete", owner_single_agent_override: true }, allowControllerValidation: true }).ok,
  "accepts explicit owner single-agent controller validation");
ok(!Governance.validateEvidenceEntry({ task_id: "T005", status: "blocked", owner: "root" }).ok, "rejects incomplete blocked metadata");
ok(Governance.validateEvidenceEntry({ task_id: "T005", status: "blocked", owner: "root", blocker_artifact: "docs/blocker.md", review_date: "2026-07-16" }).ok,
  "accepts complete blocked metadata");
ok(!Governance.validateCheckedTasks("- [x] T005 done", { tasks: [] }).ok, "rejects evidence-free task checkoff");

const completionDir = tempDir();
try {
  const tasksPath = path.join(completionDir, "tasks.md");
  const evidencePath = path.join(completionDir, "evidence.json");
  const reviewPath = path.join(completionDir, "reviews", "T005.json");
  fs.writeFileSync(tasksPath, "- [ ] T005 work\n", "utf8");
  fs.writeFileSync(evidencePath, JSON.stringify({ tasks: [] }), "utf8");
  const evidence = { task_id: "T005", implementer: "root", status: "complete", owner_single_agent_override: true, reviews: [{ review_id: "R1", reviewer: "root", verdict: "approved", supersedes: null }] };
  rejects(() => Claim.completeTask({ tasksPath, evidencePath, reviewPath, reviewArtifact: { verdict: "approved" }, taskId: "T005", evidence, allowControllerValidation: true, interruptAfterEvidence: true }), /simulated interruption/i,
    "simulates interruption after evidence write");
  ok(/- \[ \] T005/.test(fs.readFileSync(tasksPath, "utf8")) && JSON.parse(fs.readFileSync(evidencePath, "utf8")).tasks.length === 1,
    "interruption leaves evidence present and checkbox safely unchecked");
  Claim.completeTask({ tasksPath, evidencePath, reviewPath: path.join(completionDir, "reviews", "T005-approved.json"), reviewArtifact: { verdict: "approved" }, taskId: "T005", evidence, allowControllerValidation: true });
  ok(/- \[x\] T005/.test(fs.readFileSync(tasksPath, "utf8")), "completion checks task only after evidence");
} finally { fs.rmSync(completionDir, { recursive: true, force: true }); }

console.log("agent-governance.test: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
