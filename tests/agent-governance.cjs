#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const Claim = require(path.join(__dirname, "..", "project", "agent-control", "claim.cjs"));

function validateEvidenceEntry(entry) {
  const errors = [];
  if (!entry || !/^T\d{3}$/.test(String(entry.task_id || ""))) errors.push("invalid task evidence ID");
  if (entry && entry.status === "blocked") {
    if (!entry.owner) errors.push("blocked owner missing");
    if (!entry.blocker_artifact) errors.push("blocked artifact missing");
    if (!entry.review_date) errors.push("blocked review date missing");
  }
  if (entry && entry.status !== "complete" && entry.status !== "blocked") errors.push("invalid evidence status");
  return { ok: errors.length === 0, errors };
}

function validateCheckedTasks(tasksText, evidenceDocument) {
  const errors = [];
  const tasks = Claim.parseTasks(tasksText);
  const evidence = new Map((evidenceDocument && Array.isArray(evidenceDocument.tasks) ? evidenceDocument.tasks : []).map(item => [item.task_id, item]));
  tasks.forEach((task, id) => {
    if (!task.checked) return;
    const item = evidence.get(id);
    if (!item || item.status !== "complete") errors.push("checked task lacks complete evidence: " + id);
  });
  return { ok: errors.length === 0, errors };
}

function validateProtectedContract(contract) {
  const errors = [];
  if (!contract || contract.schema !== "ahd-protected-paths-v1") errors.push("protected-path schema mismatch");
  const expected = [
    ["exact", "demo/index.html"],
    ["exact", "app/engine.js"],
    ["exact", ".specify/memory/constitution.md"],
    ["exact", "tests/golden-vectors.json"],
    ["exact", "_meta/archive/the copy request/root-tree__10_Deep/Hardening/test-harness/golden-vectors.json"],
    ["exact", "tests/fixtures/demo.sha256"],
    ["prefix", "protocol/fixtures/"]
  ];
  expected.forEach(([kind, target]) => {
    const rule = contract && Array.isArray(contract.rules) && contract.rules.find(item => item.kind === kind && Claim.normalizeRepoPath(item.path) === Claim.normalizeRepoPath(target));
    if (!rule) errors.push("protected rule missing: " + target);
    else if (target === "tests/fixtures/demo.sha256" && JSON.stringify(rule.allowed_task_ids) !== JSON.stringify(["T015"])) errors.push("checksum exception mismatch");
    else if (target !== "tests/fixtures/demo.sha256" && Array.isArray(rule.allowed_task_ids) && rule.allowed_task_ids.length) errors.push("unexpected protected exception: " + target);
  });
  return { ok: errors.length === 0, errors };
}

function validateRepository(root) {
  const errors = [];
  const feature = JSON.parse(fs.readFileSync(path.join(root, ".specify", "feature.json"), "utf8"));
  const active = feature.feature_directory;
  if (!active || !fs.existsSync(path.join(root, active, "tasks.md"))) errors.push("active package missing");
  const evidence = JSON.parse(fs.readFileSync(path.join(root, "_meta", "freeze", "2026-07-15-task-evidence.json"), "utf8"));
  const taskResult = validateCheckedTasks(fs.readFileSync(path.join(root, active, "tasks.md"), "utf8"), evidence);
  errors.push(...taskResult.errors);
  const contract = JSON.parse(fs.readFileSync(path.join(root, "project", "agent-control", "protected-paths.json"), "utf8"));
  errors.push(...validateProtectedContract(contract).errors);
  const guide = fs.readFileSync(path.join(root, "CLAUDE.md"), "utf8");
  const presence = fs.readFileSync(path.join(root, "_meta", "agent-presence", "README.md"), "utf8");
  if (!guide.includes(".specify/memory/constitution.md") || !guide.includes(".specify/feature.json")) errors.push("CLAUDE authority order missing");
  if (!presence.includes("writer.lock") || !presence.toLowerCase().includes("controller")) errors.push("presence claim protocol missing");
  return { ok: errors.length === 0, errors };
}

module.exports = { validateEvidenceEntry, validateCheckedTasks, validateProtectedContract, validateRepository };

if (require.main === module) {
  const root = path.join(__dirname, "..");
  const result = validateRepository(root);
  console.log(result.ok ? "AGENT-GOVERNANCE: OK" : "AGENT-GOVERNANCE: FAILED\n- " + result.errors.join("\n- "));
  process.exit(result.ok ? 0 : 1);
}
