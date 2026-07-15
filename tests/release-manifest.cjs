#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const DEMO_HASH = "e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40";
const COMMAND = "node tests/release-gate.cjs --manifest <manifest> --target <candidate-checkout> --attestation-root <attestation-checkout>";
const SHA40 = /^[0-9a-f]{40}$/;
const SHA64 = /^[0-9a-f]{64}$/;
const OPERATIONS = new Set(["candidate", "release", "tag", "push", "overwrite", "cleanup"]);
const EXCLUDED = new Set(["park", "generated", "ignore", "owner-decision"]);

function normalize(value) {
  let text = String(value || "").trim().replace(/\\/g, "/");
  while (text.startsWith("./")) text = text.slice(2);
  if (!text || text.startsWith("/") || /^[A-Za-z]:\//.test(text)) throw new Error("absolute or empty path");
  const parts = text.split("/").filter(Boolean);
  if (parts.some(part => part === "." || part === "..")) throw new Error("path traversal");
  return parts.join("/");
}

function key(value) { return normalize(value).toLowerCase(); }
function sameSet(left, right) {
  try {
    const a = Array.from(new Set(left.map(key))).sort(), b = Array.from(new Set(right.map(key))).sort();
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (_) { return false; }
}
function collides(a, b) {
  const left = key(a), right = key(b);
  return left === right || left.startsWith(right + "/") || right.startsWith(left + "/");
}
function explicitOffset(value) { return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?[+-]\d{2}:\d{2}$/.test(String(value || "")); }
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }

function validate(manifest, context) {
  const errors = [];
  const ctx = context || {};
  function fail(message) { errors.push(message); }
  function validPath(value, label) {
    try { return normalize(value); } catch (error) { fail(label + " path invalid: " + error.message); return null; }
  }
  if (!manifest || typeof manifest !== "object") return { ok: false, errors: ["manifest missing"] };
  if (manifest.schema !== "ahd-release-attestation-v1") fail("schema must be ahd-release-attestation-v1");
  if (!manifest.candidate_id) fail("candidate_id missing");
  if (!new Set(["draft", "final"]).has(manifest.attestation_status)) fail("attestation_status invalid");
  if (!SHA40.test(String(manifest.base_commit || ""))) fail("base_commit must be lowercase 40-hex");
  if (!SHA40.test(String(manifest.candidate_commit || ""))) fail("candidate_commit must be lowercase 40-hex");
  if (manifest.base_commit === manifest.candidate_commit) fail("base and candidate must be unequal");
  if (!ctx.baseExists || !ctx.candidateExists) fail("base or candidate commit does not exist");
  if (!ctx.baseIsStrictAncestor) fail("base must be strict ancestor of candidate");
  if (!explicitOffset(manifest.created_at)) fail("created_at requires explicit numeric offset");

  const approvedPath = manifest.approved_base && validPath(manifest.approved_base.path, "approved base");
  if (approvedPath !== "_meta/freeze/2026-07-15-current-state.md") fail("approved base path mismatch");
  if (!manifest.approved_base || !SHA64.test(String(manifest.approved_base.sha256 || ""))) fail("approved base hash malformed");
  else if (ctx.hashes && ctx.hashes["candidate:" + approvedPath] !== manifest.approved_base.sha256) fail("approved base hash mismatch");
  const baseMatches = String(ctx.approvedBaseText || "").match(/"approved_base_commit"\s*:\s*"([0-9a-f]{40})"/g) || [];
  if (baseMatches.length !== 1 || !baseMatches[0].includes(manifest.base_commit)) fail("approved_base_commit missing, duplicated, or unequal");

  if (!ctx.targetClean) fail("target tracked/staged tree is not clean");
  if (!ctx.attestationClean) fail("attestation tracked/staged tree is not clean");
  if (Array.isArray(ctx.unexpectedGovernedShadows) && ctx.unexpectedGovernedShadows.length) fail("unexpected governed-path shadow");
  if (ctx.checkoutMatchesTree === false) fail("checkout bytes do not match Git tree");
  if (manifest.attestation_status === "final") {
    if (ctx.mode !== "final") fail("final manifest requires final validation mode");
    if (ctx.targetHead !== manifest.candidate_commit) fail("final target HEAD mismatch");
    if (!ctx.attestationDescendsFromCandidate || ctx.attestationHead === manifest.candidate_commit) fail("attestation must descend from and differ from candidate");
    if (!ctx.manifestTrackedAtAttestation || ctx.manifestCheckoutMatchesTree === false) fail("final manifest must be tracked and checkout-identical");
    const allowedDelta = Array.isArray(ctx.allowedAttestationMetadata) ? ctx.allowedAttestationMetadata.slice() : [];
    (manifest.assets || []).filter(asset => asset.kind === "attestation-bundle" && asset.source).forEach(asset => allowedDelta.push(asset.source.path));
    (manifest.approvals || []).forEach(approval => allowedDelta.push(approval.evidence));
    if (!sameSet(ctx.attestationDeltaPaths || [], allowedDelta)) fail("attestation delta contains undeclared or missing path");
  }

  const inventoryPath = manifest.inventory && validPath(manifest.inventory.path, "inventory");
  if (!manifest.inventory || !SHA64.test(String(manifest.inventory.sha256 || ""))) fail("inventory hash malformed");
  else if (ctx.hashes && ctx.hashes["candidate:" + inventoryPath] !== manifest.inventory.sha256) fail("inventory hash mismatch");
  const inventory = ctx.inventoryData;
  if (!inventory || inventory.schema !== "ahd-freeze-inventory-v1" || !Array.isArray(inventory.items)) fail("inventory canonical JSON missing or invalid");
  if (!inventory || !inventory.source_workspace || inventory.source_workspace.disposition !== "park-whole-workspace" || inventory.source_workspace.candidate_input !== false || !manifest.parked_source || manifest.parked_source.candidate_input !== false) fail("parked source candidate_input must be false");

  const included = Array.isArray(manifest.included_paths) ? manifest.included_paths : [];
  const excluded = Array.isArray(manifest.excluded_paths) ? manifest.excluded_paths : [];
  const normalizedIncluded = [], normalizedExcluded = [];
  included.forEach(value => { const p = validPath(value, "included"); if (p) normalizedIncluded.push(p); });
  excluded.forEach(item => {
    const p = item && validPath(item.path, "excluded");
    if (p) normalizedExcluded.push(p);
    if (!item || !EXCLUDED.has(item.disposition)) fail("excluded disposition invalid");
    if (!item || !String(item.reason || "").trim()) fail("excluded reason missing");
  });
  const allKeys = normalizedIncluded.concat(normalizedExcluded).map(value => value.toLowerCase());
  if (new Set(allKeys).size !== allKeys.length) fail("path appears in both sets or duplicates case-insensitively");
  for (let i = 0; i < normalizedIncluded.length; i++) for (let j = 0; j < normalizedExcluded.length; j++) if (collides(normalizedIncluded[i], normalizedExcluded[j])) fail("included/excluded ancestor overlap");
  if (!sameSet(normalizedIncluded, ctx.diffPaths || [])) fail("included paths do not equal base-to-candidate diff");

  if (inventory && Array.isArray(inventory.items)) {
    const itemMap = new Map();
    inventory.items.forEach(item => {
      let itemKey;
      try { itemKey = key(item.path); } catch (_) { fail("inventory item path invalid"); return; }
      if (itemMap.has(itemKey)) fail("inventory mapping is not one-to-one");
      itemMap.set(itemKey, item);
    });
    const mapped = new Set(allKeys);
    if (mapped.size !== itemMap.size || Array.from(mapped).some(value => !itemMap.has(value))) fail("inventory mapping is not a bijection");
    normalizedIncluded.forEach(value => {
      const item = itemMap.get(value.toLowerCase());
      if (!item || item.disposition !== "release") fail("included inventory disposition mismatch");
      if (item && /^T\d{3}$/.test(String(item.owner || "")) && !(ctx.completedTasks || []).includes(item.owner)) fail("owning task incomplete");
    });
    excluded.forEach(item => {
      let mappedItem;
      try { mappedItem = itemMap.get(key(item.path)); } catch (_) {}
      if (!mappedItem || mappedItem.disposition !== item.disposition) fail("excluded inventory disposition mismatch");
    });
  }

  if (manifest.demo_sha256 !== DEMO_HASH) fail("demo hash mismatch");
  const tracked = new Set(Array.isArray(ctx.tracked) ? ctx.tracked.map(String) : []);
  const checksumPath = manifest.checksum_source && validPath(manifest.checksum_source.path, "checksum");
  if (!manifest.checksum_source || !SHA64.test(String(manifest.checksum_source.sha256 || ""))) fail("checksum hash malformed");
  else if (!tracked.has("candidate:" + checksumPath)) fail("checksum source is not tracked");
  else if (ctx.hashes && ctx.hashes["candidate:" + checksumPath] !== manifest.checksum_source.sha256) fail("checksum hash mismatch");

  if (!Array.isArray(manifest.assets) || !manifest.assets.length) fail("assets missing");
  (manifest.assets || []).forEach(asset => {
    const assetPath = validPath(asset && asset.path, "asset");
    if (!asset || !new Set(["candidate", "attestation-bundle"]).has(asset.kind)) { fail("asset kind invalid"); return; }
    if (!SHA64.test(String(asset.sha256 || ""))) fail("asset hash malformed");
    if (asset.kind === "candidate") {
      if (!asset.source || asset.source.root !== "candidate" || key(asset.source.path) !== key(assetPath)) fail("candidate source mismatch");
      else if (!tracked.has("candidate:" + assetPath)) fail("candidate asset is not tracked");
      else if (ctx.hashes && ctx.hashes["candidate:" + assetPath] !== asset.sha256) fail("candidate asset hash mismatch");
      if (asset.restore_to !== undefined) fail("candidate asset cannot restore_to");
    } else {
      const sourcePath = asset.source && validPath(asset.source.path, "bundle source");
      if (!asset.source || asset.source.root !== "attestation" || !sourcePath || !sourcePath.startsWith("_meta/freeze/bundles/") || key(asset.restore_to) !== key(assetPath)) fail("attestation bundle source/restore mismatch");
      else if (!tracked.has("attestation:" + sourcePath) || (ctx.hashes && ctx.hashes["attestation:" + sourcePath] !== asset.sha256)) fail("attestation bundle missing or hash mismatch");
    }
  });

  const gate = manifest.gate || {};
  if (gate.command !== COMMAND) fail("gate command is not canonical");
  const controlNames = ["agent_governance", "manifest", "truth", "preflight", "product_gate"];
  if (manifest.attestation_status === "draft") {
    if (ctx.mode !== "draft-precheck") fail("draft requires explicit precheck mode");
    if (gate.status !== "pending" || gate.inputs !== null || gate.assertions !== null || gate.failures !== null || gate.duration_ms !== null || gate.demo_ok !== null || controlNames.some(name => !gate.controls || gate.controls[name] !== null)) fail("pending gate fields and controls must be null");
    if (manifest.operation !== "candidate" || !Array.isArray(manifest.approvals) || manifest.approvals.length) fail("draft candidate cannot carry approvals");
  } else if (manifest.attestation_status === "final") {
    if (gate.status !== "verified" || !Number.isSafeInteger(gate.assertions) || gate.assertions <= 0 || gate.failures !== 0 || !Number.isSafeInteger(gate.duration_ms) || gate.duration_ms <= 0 || gate.demo_ok !== true || controlNames.some(name => !gate.controls || gate.controls[name] !== true)) fail("final verified gate control/result invalid");
    const inputs = gate.inputs || {};
    if (inputs.manifest_path !== ctx.manifestPath || inputs.base_commit !== manifest.base_commit || inputs.candidate_commit !== manifest.candidate_commit || inputs.target_role !== "candidate-clean-tree" || inputs.attestation_role !== "attestation-clean-tree") fail("gate inputs mismatch");
  }

  if (!OPERATIONS.has(manifest.operation)) fail("operation invalid");
  const approvals = Array.isArray(manifest.approvals) ? manifest.approvals : [];
  if (manifest.operation !== "candidate" && !approvals.length) fail("operation requires approval");
  const approvalKeys = new Set();
  approvals.forEach(approval => {
    if (!String(approval.approver || "").trim()) fail("approver missing");
    if (approval.scope !== manifest.operation) fail("approval scope mismatch");
    if (approval.target_commit !== manifest.candidate_commit) fail("approval target mismatch");
    if (!explicitOffset(approval.approved_at)) fail("approval time requires explicit numeric offset");
    const evidence = validPath(approval.evidence, "approval evidence");
    if (evidence && ctx.approvalEvidence && ctx.approvalEvidence[evidence] !== true) fail("approval evidence missing or mismatched");
    const approvalKey = approval.scope + ":" + approval.target_commit;
    if (approvalKeys.has(approvalKey)) fail("conflicting duplicate approval");
    approvalKeys.add(approvalKey);
  });
  return { ok: errors.length === 0, errors };
}

function git(root, args, options) {
  return cp.execFileSync("git", ["-C", root].concat(args), Object.assign({ encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }, options || {}));
}
function gitBuffer(root, commit, file) { return cp.execFileSync("git", ["-C", root, "show", commit + ":" + file], { encoding: null, stdio: ["ignore", "pipe", "pipe"] }); }
function existsCommit(root, commit) { try { git(root, ["cat-file", "-e", commit + "^{commit}"]); return true; } catch (_) { return false; } }
function trackedBuffer(root, commit, file) { try { return gitBuffer(root, commit, file); } catch (_) { return null; } }
function parseInventory(text) {
  const marker = text.indexOf("ahd-freeze-inventory-v1");
  if (marker < 0) return null;
  const before = text.lastIndexOf("```json", marker), after = text.indexOf("```", marker);
  if (before < 0 || after < 0) return null;
  try { return JSON.parse(text.slice(before + 7, after)); } catch (_) { return null; }
}

function buildContext(manifest, options) {
  const target = path.resolve(options.target), attestation = path.resolve(options.attestationRoot);
  const finalMode = manifest.attestation_status === "final";
  const manifestPath = finalMode ? normalize(options.manifest) : options.manifest;
  const candidate = manifest.candidate_commit, base = manifest.base_commit;
  const targetHead = git(target, ["rev-parse", "HEAD"]).trim();
  const attestationHead = git(attestation, ["rev-parse", "HEAD"]).trim();
  let ancestor = false;
  try { git(target, ["merge-base", "--is-ancestor", base, candidate]); ancestor = base !== candidate; } catch (_) {}
  const governed = [manifest.approved_base && manifest.approved_base.path, manifest.inventory && manifest.inventory.path, manifest.checksum_source && manifest.checksum_source.path]
    .concat((manifest.assets || []).filter(asset => asset.kind === "candidate").map(asset => asset.path)).filter(Boolean).map(normalize);
  const hashes = {}, tracked = [], checkoutComparisons = [];
  governed.forEach(file => {
    const bytes = trackedBuffer(target, candidate, file);
    if (!bytes) return;
    tracked.push("candidate:" + file); hashes["candidate:" + file] = sha256(bytes);
    const checkout = path.join(target, file);
    checkoutComparisons.push(fs.existsSync(checkout) && Buffer.compare(bytes, fs.readFileSync(checkout)) === 0);
  });
  (manifest.assets || []).filter(asset => asset.kind === "attestation-bundle" && asset.source).forEach(asset => {
    const file = normalize(asset.source.path), bytes = trackedBuffer(attestation, attestationHead, file);
    if (!bytes) return;
    tracked.push("attestation:" + file); hashes["attestation:" + file] = sha256(bytes);
  });
  const approvedBytes = trackedBuffer(target, candidate, normalize(manifest.approved_base.path));
  const inventoryBytes = trackedBuffer(target, candidate, normalize(manifest.inventory.path));
  const active = JSON.parse(gitBuffer(target, candidate, ".specify/feature.json").toString("utf8")).feature_directory;
  const tasksText = gitBuffer(target, candidate, active + "/tasks.md").toString("utf8");
  const completedTasks = Array.from(tasksText.matchAll(/^- \[[xX]\] (T\d{3})\b/gm)).map(match => match[1]);
  const approvalEvidence = {};
  (manifest.approvals || []).forEach(approval => {
    try {
      const file = normalize(approval.evidence), bytes = gitBuffer(attestation, attestationHead, file), checkout = path.join(attestation, file);
      approvalEvidence[file] = fs.existsSync(checkout) && Buffer.compare(bytes, fs.readFileSync(checkout)) === 0;
      tracked.push("attestation:" + file);
    } catch (_) { approvalEvidence[String(approval.evidence)] = false; }
  });
  let manifestTrackedAtAttestation = false, manifestCheckoutMatchesTree = true;
  if (finalMode) {
    const treeManifest = trackedBuffer(attestation, attestationHead, manifestPath);
    const checkoutManifest = path.join(attestation, manifestPath);
    manifestTrackedAtAttestation = !!treeManifest;
    manifestCheckoutMatchesTree = !!treeManifest && fs.existsSync(checkoutManifest) && Buffer.compare(treeManifest, fs.readFileSync(checkoutManifest)) === 0;
  }
  return {
    mode: finalMode ? "final" : "draft-precheck",
    manifestPath,
    targetHead,
    attestationHead,
    baseExists: existsCommit(target, base),
    candidateExists: existsCommit(target, candidate),
    baseIsStrictAncestor: ancestor,
    attestationDescendsFromCandidate: (() => { try { git(attestation, ["merge-base", "--is-ancestor", candidate, attestationHead]); return true; } catch (_) { return false; } })(),
    targetClean: git(target, ["status", "--porcelain", "--untracked-files=no"]).trim() === "",
    attestationClean: git(attestation, ["status", "--porcelain", "--untracked-files=no"]).trim() === "",
    approvedBaseText: approvedBytes ? approvedBytes.toString("utf8") : "",
    hashes,
    tracked,
    checkoutMatchesTree: checkoutComparisons.every(Boolean),
    unexpectedGovernedShadows: [],
    diffPaths: git(target, ["diff", "--name-only", base + ".." + candidate]).trim().split(/\r?\n/).filter(Boolean),
    inventoryData: inventoryBytes ? parseInventory(inventoryBytes.toString("utf8")) : null,
    completedTasks,
    attestationDeltaPaths: finalMode ? git(attestation, ["diff", "--name-only", candidate + ".." + attestationHead]).trim().split(/\r?\n/).filter(Boolean) : [],
    allowedAttestationMetadata: finalMode ? [manifestPath].concat(manifest.attestation_metadata || []) : [],
    manifestTrackedAtAttestation,
    manifestCheckoutMatchesTree,
    approvalEvidence
  };
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith("--") || argv[i + 1] === undefined) throw new Error("arguments require --manifest, --target, and --attestation-root");
    out[argv[i].slice(2)] = argv[i + 1];
  }
  if (!out.manifest || !out.target || !out["attestation-root"]) throw new Error("arguments require --manifest, --target, and --attestation-root");
  return { manifest: out.manifest, target: out.target, attestationRoot: out["attestation-root"] };
}

module.exports = { validate, buildContext, parseInventory, normalize, parseArgs, COMMAND, DEMO_HASH };

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const manifestFile = path.isAbsolute(options.manifest) ? options.manifest : path.join(options.attestationRoot, options.manifest);
    const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
    const result = validate(manifest, buildContext(manifest, options));
    console.log(result.ok ? "RELEASE-MANIFEST: OK" : "RELEASE-MANIFEST: FAILED\n- " + result.errors.join("\n- "));
    process.exit(result.ok ? 0 : 1);
  } catch (error) {
    console.error("RELEASE-MANIFEST: FAILED\n- " + (error && error.message ? error.message : String(error)));
    process.exit(1);
  }
}
