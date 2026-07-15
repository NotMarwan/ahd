#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

let atomicCounter = 0;

function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  return "{" + Object.keys(value).sort().map(key => JSON.stringify(key) + ":" + canonical(value[key])).join(",") + "}";
}

function normalizeRepoPath(value) {
  let text = String(value || "").trim().replace(/\\/g, "/");
  while (text.startsWith("./")) text = text.slice(2);
  if (!text || text.startsWith("/") || /^[A-Za-z]:\//.test(text)) throw new Error("path must be repository-relative");
  const parts = text.split("/").filter(Boolean);
  if (parts.some(part => part === "." || part === "..")) throw new Error("path traversal rejected");
  return parts.join("/").toLowerCase();
}

function hasExplicitOffset(value) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?[+-]\d{2}:\d{2}$/.test(String(value || ""));
}

function dispatchHash(dispatch) {
  const value = Object.assign({}, dispatch);
  delete value.dispatch_sha256;
  return crypto.createHash("sha256").update(canonical(value)).digest("hex");
}

function parseTasks(tasksText) {
  const tasks = new Map();
  String(tasksText || "").split(/\r?\n/).forEach(line => {
    const match = /^- \[([ xX])\] (T\d{3})\b(.*)$/.exec(line);
    if (!match) return;
    const paths = [];
    let token;
    const re = /`([^`]+)`/g;
    while ((token = re.exec(match[3]))) {
      if ((/[\\/]/.test(token[1]) || /\.[A-Za-z0-9]+$/.test(token[1])) && !/^https?:/.test(token[1]) && !token[1].startsWith("--")) {
        try { paths.push(normalizeRepoPath(token[1])); } catch (_) {}
      }
    }
    tasks.set(match[2], { checked: match[1].toLowerCase() === "x", paths, line });
  });
  return tasks;
}

function ruleFor(file, contract) {
  const normalized = normalizeRepoPath(file);
  const rules = contract && Array.isArray(contract.rules) ? contract.rules : [];
  return rules.find(rule => {
    const target = normalizeRepoPath(rule.path);
    return rule.kind === "prefix" ? normalized.startsWith(target.endsWith("/") ? target : target + "/") : normalized === target;
  }) || null;
}

function protectedDecision(file, taskId, contract) {
  const rule = ruleFor(file, contract);
  if (!rule) return { protected: false, allowed: true, rule: null };
  const allowed = Array.isArray(rule.allowed_task_ids) && rule.allowed_task_ids.includes(taskId);
  return { protected: true, allowed, rule };
}

function pathsCollide(a, b) {
  const left = normalizeRepoPath(a), right = normalizeRepoPath(b);
  return left === right || left.startsWith(right + "/") || right.startsWith(left + "/");
}

function validateDispatch(dispatch, context) {
  const errors = [];
  const ctx = context || {};
  const tasks = parseTasks(ctx.tasksText);
  if (!dispatch || typeof dispatch !== "object") return { ok: false, errors: ["dispatch missing"] };
  if (dispatch.schema !== "ahd-controller-dispatch-v1") errors.push("invalid dispatch schema");
  if (dispatch.issued_by !== ctx.controllerId) errors.push("dispatch issuer is not controller");
  if (dispatch.wave !== ctx.activePackage) errors.push("dispatch wave is not active package");
  if (!/^T\d{3}$/.test(String(dispatch.task_id || ""))) errors.push("invalid task ID");
  const task = tasks.get(dispatch.task_id);
  if (!task) errors.push("task does not exist in active tasks");
  else if (task.checked) errors.push("task is already checked");
  if (dispatch.mode !== "writer") errors.push("writer dispatch required");
  if (!hasExplicitOffset(dispatch.created_at)) errors.push("created_at requires explicit numeric offset");
  if (!ctx.issued) errors.push("controller-issued dispatch record missing");
  else if (canonical(ctx.issued) !== canonical(dispatch)) errors.push("issued dispatch fields mismatch");
  if (dispatch.dispatch_sha256 !== dispatchHash(dispatch)) errors.push("dispatch hash mismatch");

  const files = Array.isArray(dispatch.files) ? dispatch.files : [];
  if (!files.length) errors.push("writer files missing");
  const normalized = [];
  files.forEach(file => {
    try { normalized.push(normalizeRepoPath(file)); } catch (error) { errors.push(error.message); }
  });
  if (new Set(normalized).size !== normalized.length) errors.push("duplicate normalized file");
  for (let i = 0; i < normalized.length; i++) for (let j = i + 1; j < normalized.length; j++) {
    if (pathsCollide(normalized[i], normalized[j])) errors.push("claimed paths collide");
  }
  normalized.forEach(file => {
    const decision = protectedDecision(file, dispatch.task_id, ctx.protectedContract);
    if (decision.protected && !decision.allowed) errors.push("protected path rejected: " + file);
    const taskAllows = task && task.paths.includes(file);
    if (!taskAllows && !(decision.protected && decision.allowed)) errors.push("off-task file rejected: " + file);
  });
  (Array.isArray(dispatch.depends_on) ? dispatch.depends_on : []).forEach(id => {
    const dependency = tasks.get(id);
    if (!dependency || !dependency.checked) errors.push("unchecked dependency: " + id);
  });
  return { ok: errors.length === 0, errors };
}

function writeCreateOnce(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const fd = fs.openSync(filePath, "wx");
  try { fs.writeFileSync(fd, value, "utf8"); } finally { fs.closeSync(fd); }
}

function acquireWriter(options) {
  const result = validateDispatch(options.dispatch, options);
  if (!result.ok) throw new Error(result.errors.join("; "));
  const lockPath = path.join(options.controlDir, "writer.lock");
  try { writeCreateOnce(lockPath, JSON.stringify(Object.assign({ schema: "ahd-agent-claim-v1", status: "active" }, options.dispatch), null, 2) + "\n"); }
  catch (error) {
    if (error && error.code === "EEXIST") throw new Error("writer lock already active");
    throw error;
  }
  return { path: lockPath };
}

function releaseWriter(options) {
  const lockPath = path.join(options.controlDir, "writer.lock");
  const claim = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  if (claim.agent_id !== options.agentId || claim.dispatch_id !== options.dispatchId) throw new Error("claim owner mismatch");
  fs.unlinkSync(lockPath);
  return { released: true };
}

function createAudit(options) {
  const claim = options.claim || {};
  if (claim.mode !== "audit" || !Array.isArray(claim.files) || claim.files.length !== 0) throw new Error("audit claim must be read-only");
  if (!hasExplicitOffset(claim.created_at)) throw new Error("audit timestamp requires explicit numeric offset");
  const safe = String(claim.dispatch_id || "").replace(/[^A-Za-z0-9._-]/g, "_");
  if (!safe) throw new Error("audit dispatch ID missing");
  const filePath = path.join(options.controlDir, "audits", safe + ".json");
  writeCreateOnce(filePath, JSON.stringify(Object.assign({}, claim, { status: "active" }), null, 2) + "\n");
  return { path: filePath };
}

function validateEvidenceTransition(options) {
  const errors = [];
  const before = options.before || { reviews: [] }, after = options.after || {};
  const prior = Array.isArray(before.reviews) ? before.reviews : [];
  const next = Array.isArray(after.reviews) ? after.reviews : [];
  if (next.length < prior.length) errors.push("prior reviews deleted");
  prior.forEach((review, index) => { if (canonical(review) !== canonical(next[index])) errors.push("prior review mutated"); });
  next.forEach(review => {
    const override = options.allowControllerValidation && after.owner_single_agent_override === true;
    if (review.reviewer === after.implementer && !override) errors.push("self-review rejected");
  });
  if (after.status === "complete") {
    const last = next[next.length - 1];
    if (!last || last.verdict !== "approved") errors.push("completion requires approved review");
    if (next.length > 1 && next[next.length - 2].verdict === "needs-fix" && last.supersedes !== next[next.length - 2].review_id) errors.push("approval must supersede needs-fix");
  }
  return { ok: errors.length === 0, errors };
}

function atomicWrite(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temp = filePath + ".tmp-" + process.pid + "-" + (++atomicCounter);
  fs.writeFileSync(temp, text, "utf8");
  fs.renameSync(temp, filePath);
}

function completeTask(options) {
  const document = JSON.parse(fs.readFileSync(options.evidencePath, "utf8"));
  if (!Array.isArray(document.tasks)) document.tasks = [];
  const index = document.tasks.findIndex(item => item.task_id === options.taskId);
  const before = index >= 0 ? document.tasks[index] : { reviews: [] };
  const validation = validateEvidenceTransition({ before, after: options.evidence, allowControllerValidation: options.allowControllerValidation });
  if (!validation.ok) throw new Error(validation.errors.join("; "));
  writeCreateOnce(options.reviewPath, JSON.stringify(options.reviewArtifact, null, 2) + "\n");
  if (index >= 0) document.tasks[index] = options.evidence; else document.tasks.push(options.evidence);
  atomicWrite(options.evidencePath, JSON.stringify(document, null, 2) + "\n");
  if (options.interruptAfterEvidence) throw new Error("simulated interruption after evidence");
  const tasksText = fs.readFileSync(options.tasksPath, "utf8");
  const pattern = new RegExp("(^- \\[) \\] (" + options.taskId + "\\b)", "m");
  if (!pattern.test(tasksText)) throw new Error("unchecked task not found");
  atomicWrite(options.tasksPath, tasksText.replace(pattern, "$1x] $2"));
  return { completed: true };
}

module.exports = {
  canonical,
  normalizeRepoPath,
  hasExplicitOffset,
  dispatchHash,
  parseTasks,
  protectedDecision,
  pathsCollide,
  validateDispatch,
  acquireWriter,
  releaseWriter,
  createAudit,
  validateEvidenceTransition,
  completeTask
};

if (require.main === module) {
  const command = process.argv[2];
  if (command === "hash" && process.argv[3]) {
    const dispatch = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
    console.log(dispatchHash(dispatch));
  } else {
    console.error("usage: node project/agent-control/claim.cjs hash <dispatch.json>");
    process.exit(2);
  }
}
