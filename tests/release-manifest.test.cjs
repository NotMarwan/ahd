#!/usr/bin/env node
"use strict";

const path = require("path");
let Release;
try { Release = require(path.join(__dirname, "release-manifest.cjs")); } catch (_) {}

let passed = 0, failed = 0;
function ok(condition, name) {
  if (condition) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ " + name); }
}
function clone(value) { return JSON.parse(JSON.stringify(value)); }

console.log("release-manifest.test: identity, inventory, assets, gate, approvals");
ok(!!Release, "release manifest validator exists");
if (!Release) {
  console.log("release-manifest.test: " + passed + " passed, " + failed + " failed");
  process.exit(1);
}

const BASE = "1".repeat(40), CANDIDATE = "2".repeat(40), ATTESTATION = "3".repeat(40);
const HASH = "a".repeat(64), DEMO = "e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40";
const COMMAND = "node tests/release-gate.cjs --manifest <manifest> --target <candidate-checkout> --attestation-root <attestation-checkout>";

function validFixture() {
  const manifest = {
    schema: "ahd-release-attestation-v1",
    candidate_id: "2026-07-15-freeze-rc1",
    attestation_status: "draft",
    base_commit: BASE,
    approved_base: { path: "_meta/freeze/2026-07-15-current-state.md", sha256: HASH },
    candidate_commit: CANDIDATE,
    branch: "codex/wave0-freeze-safety-main",
    created_at: "2026-07-15T04:10:00+03:00",
    operation: "candidate",
    inventory: { path: "_meta/freeze/2026-07-15-change-inventory.md", sha256: HASH },
    parked_source: { record: "_meta/freeze/2026-07-15-change-inventory.md", candidate_input: false },
    gate: {
      status: "pending", command: COMMAND, inputs: null, assertions: null, failures: null, duration_ms: null, demo_ok: null,
      controls: { agent_governance: null, manifest: null, truth: null, preflight: null, product_gate: null }
    },
    demo_sha256: DEMO,
    checksum_source: { path: "tests/fixtures/demo.sha256", sha256: HASH },
    assets: [{ path: "demo/index.html", sha256: DEMO, kind: "candidate", source: { root: "candidate", path: "demo/index.html" } }],
    included_paths: ["AGENTS.md"],
    excluded_paths: [{ path: "notes/local.txt", disposition: "ignore", reason: "local-only note" }],
    approvals: []
  };
  const context = {
    mode: "draft-precheck",
    manifestPath: "C:/external/release-manifest.draft.json",
    targetHead: CANDIDATE,
    attestationHead: ATTESTATION,
    baseExists: true,
    candidateExists: true,
    baseIsStrictAncestor: true,
    attestationDescendsFromCandidate: true,
    targetClean: true,
    attestationClean: true,
    approvedBaseText: "```json\n{\"approved_base_commit\":\"" + BASE + "\"}\n```",
    hashes: {
      "candidate:_meta/freeze/2026-07-15-current-state.md": HASH,
      "candidate:_meta/freeze/2026-07-15-change-inventory.md": HASH,
      "candidate:tests/fixtures/demo.sha256": HASH,
      "candidate:demo/index.html": DEMO
    },
    tracked: [
      "candidate:_meta/freeze/2026-07-15-current-state.md",
      "candidate:_meta/freeze/2026-07-15-change-inventory.md",
      "candidate:tests/fixtures/demo.sha256",
      "candidate:demo/index.html",
      "candidate:AGENTS.md"
    ],
    checkoutMatchesTree: true,
    unexpectedGovernedShadows: [],
    diffPaths: ["AGENTS.md"],
    inventoryData: {
      schema: "ahd-freeze-inventory-v1",
      source_workspace: { disposition: "park-whole-workspace", candidate_input: false },
      items: [
        { path: "AGENTS.md", disposition: "release", reason: "governed guide", owner: "T008" },
        { path: "notes/local.txt", disposition: "ignore", reason: "local-only note", owner: "project" }
      ]
    },
    completedTasks: ["T008"],
    attestationDeltaPaths: [],
    allowedAttestationMetadata: [],
    manifestTrackedAtAttestation: false,
    manifestCheckoutMatchesTree: true,
    approvalEvidence: {}
  };
  return { manifest, context };
}

function result(changeManifest, changeContext) {
  const fixture = validFixture();
  if (changeManifest) changeManifest(fixture.manifest, fixture.context);
  if (changeContext) changeContext(fixture.context);
  return Release.validate(fixture.manifest, fixture.context);
}
function bad(changeManifest, changeContext, pattern, name) {
  const r = result(changeManifest, changeContext);
  ok(!r.ok && r.errors.some(error => pattern.test(error)), name);
}

ok(result().ok, "accepts valid draft precheck");
bad(m => delete m.schema, null, /schema/i, "rejects missing schema");
bad(m => m.attestation_status = "ready", null, /attestation_status/i, "rejects invalid attestation status");
bad(m => m.base_commit = "bad", null, /base_commit/i, "rejects malformed base commit");
bad(m => m.candidate_commit = BASE, null, /unequal|different/i, "rejects base equal to candidate");
bad(null, c => c.baseIsStrictAncestor = false, /ancestor/i, "rejects bad ancestry");
bad(null, c => c.approvedBaseText = "{}", /approved_base_commit/i, "rejects missing approved base record");
bad(m => m.approved_base.sha256 = "b".repeat(64), null, /approved base.*hash/i, "rejects approved-base hash mismatch");
bad(null, c => c.targetClean = false, /target.*clean/i, "rejects dirty tracked target");
bad(null, c => c.unexpectedGovernedShadows = ["demo/index.html"], /shadow/i, "rejects governed-path shadow");
bad(m => m.included_paths = [], null, /diff|included/i, "rejects incomplete base-to-candidate diff paths");
bad(m => m.included_paths.push("extra.txt"), null, /diff|included/i, "rejects extra included path");
bad(null, c => c.inventoryData.items = [], /inventory.*mapping|bijection/i, "rejects inventory omission");
bad(m => m.excluded_paths.push({ path: "AGENTS.md", disposition: "ignore", reason: "duplicate" }), null, /double|both|overlap/i, "rejects double disposition");
bad(m => m.excluded_paths[0].disposition = "park", null, /disposition/i, "rejects disposition mismatch");
bad(m => m.excluded_paths[0].reason = "", null, /reason/i, "rejects empty exclusion reason");
bad(null, c => c.inventoryData.source_workspace.candidate_input = true, /parked|candidate_input/i, "rejects parked source as candidate input");
bad(m => m.included_paths = ["../AGENTS.md"], null, /path|traversal/i, "rejects traversal path");
bad(m => m.excluded_paths.push({ path: "agents.md", disposition: "ignore", reason: "case duplicate" }), null, /duplicate|case|both/i, "rejects case-insensitive duplicate");
bad(m => { m.included_paths = ["folder"]; m.excluded_paths = [{ path: "folder/file", disposition: "ignore", reason: "nested" }]; }, null, /ancestor|overlap/i, "rejects ancestor-descendant overlap");
bad(null, c => c.completedTasks = [], /owning task|incomplete task/i, "rejects incomplete planned-output task");
bad(m => m.assets[0].kind = "url", null, /asset kind/i, "rejects invalid asset kind");
bad(m => m.assets[0].source.root = "network", null, /candidate source/i, "rejects non-candidate asset source");
bad(m => m.assets[0].sha256 = "b".repeat(64), null, /asset.*hash/i, "rejects candidate asset hash mismatch");
bad(m => m.checksum_source.path = "C:/local/demo.sha256", null, /checksum.*path|absolute/i, "rejects workstation checksum path");
bad(m => m.checksum_source.sha256 = "b".repeat(64), null, /checksum.*hash/i, "rejects checksum hash mismatch");
bad(m => m.demo_sha256 = "b".repeat(64), null, /demo/i, "rejects wrong demo hash");
bad(m => m.gate.command = "node other.cjs", null, /gate command/i, "rejects non-canonical gate command");
bad(m => m.gate.failures = 0, null, /pending.*null/i, "rejects populated draft gate evidence");
bad(m => m.operation = "release", null, /approval/i, "rejects non-candidate operation without approval");

function makeFinal(manifest, context) {
  manifest.attestation_status = "final";
  manifest.gate = {
    status: "verified", command: COMMAND,
    inputs: { manifest_path: "_meta/freeze/release.json", base_commit: BASE, candidate_commit: CANDIDATE, target_role: "candidate-clean-tree", attestation_role: "attestation-clean-tree" },
    assertions: 2979, failures: 0, duration_ms: 12000, demo_ok: true,
    controls: { agent_governance: true, manifest: true, truth: true, preflight: true, product_gate: true }
  };
  context.mode = "final";
  context.manifestPath = "_meta/freeze/release.json";
  context.manifestTrackedAtAttestation = true;
  context.attestationDeltaPaths = ["_meta/freeze/release.json"];
  context.allowedAttestationMetadata = ["_meta/freeze/release.json"];
}
ok(result(makeFinal).ok, "accepts valid final attestation context");
bad(makeFinal, c => c.targetHead = BASE, /target HEAD/i, "rejects final target identity mismatch");
bad(makeFinal, c => c.attestationDescendsFromCandidate = false, /attestation.*descend/i, "rejects attestation ancestry mismatch");
bad(makeFinal, c => c.manifestTrackedAtAttestation = false, /manifest.*tracked/i, "rejects untracked final manifest");
bad((m, c) => makeFinal(m, c), c => c.attestationDeltaPaths.push("undeclared.txt"), /attestation delta/i, "rejects undeclared attestation delta");
bad(m => { makeFinal(m, validFixture().context); m.gate.controls.truth = false; }, c => { c.mode = "final"; c.manifestPath = "_meta/freeze/release.json"; c.manifestTrackedAtAttestation = true; c.attestationDeltaPaths = ["_meta/freeze/release.json"]; c.allowedAttestationMetadata = ["_meta/freeze/release.json"]; }, /control/i, "rejects failed final control");
bad((m, c) => { makeFinal(m, c); m.gate.inputs.candidate_commit = BASE; }, null, /gate inputs/i, "rejects structured input mismatch");
bad((m, c) => { makeFinal(m, c); m.operation = "push"; m.approvals = [{ approver: "", scope: "push", target_commit: CANDIDATE, approved_at: "2026-07-15T04:20:00+03:00", evidence: "docs/approval.md" }]; }, null, /approver/i, "rejects empty approver");
bad((m, c) => { makeFinal(m, c); m.operation = "push"; m.approvals = [{ approver: "owner", scope: "tag", target_commit: CANDIDATE, approved_at: "2026-07-15T04:20:00+03:00", evidence: "docs/approval.md" }]; }, null, /scope/i, "rejects wrong approval scope");
bad((m, c) => { makeFinal(m, c); m.operation = "push"; m.approvals = [{ approver: "owner", scope: "push", target_commit: BASE, approved_at: "2026-07-15T04:20:00+03:00", evidence: "docs/approval.md" }]; }, null, /target/i, "rejects wrong approval target");
bad((m, c) => { makeFinal(m, c); m.operation = "push"; m.approvals = [{ approver: "owner", scope: "push", target_commit: CANDIDATE, approved_at: "2026-07-15T04:20:00Z", evidence: "docs/approval.md" }]; }, null, /approval.*time/i, "rejects approval time without numeric offset");
bad((m, c) => { makeFinal(m, c); m.operation = "push"; m.approvals = [{ approver: "owner", scope: "push", target_commit: CANDIDATE, approved_at: "2026-07-15T04:20:00+03:00", evidence: "../approval.md" }]; }, null, /approval.*path|traversal/i, "rejects traversal approval evidence");

console.log("release-manifest.test: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
