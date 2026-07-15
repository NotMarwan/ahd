#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const path = require("path");
let Gate;
try { Gate = require(path.join(__dirname, "release-gate.cjs")); } catch (_) {}

let passed = 0, failed = 0;
function ok(condition, name) {
  if (condition) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ " + name); }
}
function throws(fn, pattern, name) {
  try { fn(); ok(false, name); } catch (error) { ok(pattern.test(String(error && error.message || error)), name); }
}

console.log("release-gate.test: interface, roots, controls, restore bounds, evidence");
ok(!!Gate, "release gate exists");
if (!Gate) {
  console.log("release-gate.test: " + passed + " passed, " + failed + " failed");
  process.exit(1);
}

const options = Gate.parseArgs(["--manifest", "C:/external/draft.json", "--target", "C:/candidate", "--attestation-root", "C:/attestation"]);
ok(options.manifest === "C:/external/draft.json" && options.target === path.resolve("C:/candidate") && options.attestationRoot === path.resolve("C:/attestation"), "parses the canonical three arguments");
throws(() => Gate.parseArgs(["--manifest", "x", "--target", "y"]), /manifest.*target.*attestation|three|required/i, "rejects missing explicit root");
throws(() => Gate.parseArgs(["--manifest", "x", "--target", "y", "--attestation-root", "z", "--extra", "q"]), /unknown|exact|argument/i, "rejects unknown argument");
throws(() => Gate.parseArgs(["--manifest", "x", "--manifest", "y", "--target", "z", "--attestation-root", "a"]), /duplicate/i, "rejects duplicate argument");

const attestationRoot = path.resolve("C:/attestation");
ok(Gate.resolveManifestFile({ manifest: "C:/external/draft.json", attestationRoot }, "draft") === path.resolve("C:/external/draft.json"), "accepts an external absolute draft");
throws(() => Gate.resolveManifestFile({ manifest: "C:/external/final.json", attestationRoot }, "final"), /final.*relative/i, "rejects an absolute final manifest");
throws(() => Gate.resolveManifestFile({ manifest: "../final.json", attestationRoot }, "final"), /path|traversal/i, "rejects final-manifest traversal");
ok(Gate.resolveManifestFile({ manifest: "_meta/freeze/final.json", attestationRoot }, "final") === path.join(attestationRoot, "_meta/freeze/final.json"), "resolves final manifest below attestation root");

const manifest = {
  attestation_status: "draft",
  candidate_commit: "2".repeat(40),
  assets: [
    { path: "demo/index.html", kind: "candidate", sha256: "a".repeat(64) },
    { path: "promo/out.mp4", kind: "attestation-bundle", restore_to: "promo/out.mp4", sha256: crypto.createHash("sha256").update("video").digest("hex") }
  ],
  approved_base: { path: "_meta/freeze/base.md" },
  inventory: { path: "_meta/freeze/inventory.md" },
  checksum_source: { path: "tests/fixtures/demo.sha256" }
};
const plan = Gate.controlPlan(options);
ok(JSON.stringify(Array.from(new Set(plan.map(item => item.control)))) === JSON.stringify(["agent_governance", "manifest", "truth", "preflight", "product_gate"]), "plans every focused control in canonical order");
ok(plan[plan.length - 1].script === "tests/run-all.cjs", "runs the full product gate last");
ok(plan.some(item => item.script === "tests/release-manifest.cjs" && item.args.includes(options.manifest)), "binds manifest validation to explicit roots");

const entries = Gate.parseUntracked("?? demo/index.html\0?? promo/out.mp4\0?? notes/local.txt\0");
ok(JSON.stringify(entries) === JSON.stringify(["demo/index.html", "promo/out.mp4", "notes/local.txt"]), "parses NUL-delimited untracked paths");
ok(JSON.stringify(Gate.unexpectedGovernedPaths(entries, manifest)) === JSON.stringify(["demo/index.html"]), "allows only the exact declared restore output");
ok(Gate.verifyRestores(manifest, p => p === "promo/out.mp4", () => Buffer.from("video")).length === 0, "accepts a declared restore with matching bytes");
ok(Gate.verifyRestores(manifest, () => true, () => Buffer.from("tampered")).some(error => /hash/i.test(error)), "rejects a restore hash mismatch");

const loaded = { manifest, bytes: Buffer.from("draft"), file: "C:/external/draft.json" };
const context = { mode: "draft-precheck", targetHead: manifest.candidate_commit, attestationHead: "3".repeat(40), unexpectedGovernedShadows: [] };
let tick = 1000;
const evidence = Gate.runGate(options, {
  loaded,
  buildContext: () => Object.assign({}, context),
  validate: () => ({ ok: true, errors: [] }),
  untracked: () => [],
  exists: () => true,
  readFile: () => Buffer.from("video"),
  run: item => ({ status: 0, stdout: item.script === "tests/run-all.cjs" ? "AHD GATE ✅ 2979/0\n" : "OK\n", stderr: "" }),
  now: () => (tick += 1000),
  emit: () => {}
});
ok(evidence.candidate_commit === manifest.candidate_commit && evidence.attestation_commit === context.attestationHead, "binds evidence to resolved candidate and attestation commits");
ok(evidence.assertions === 2979 && evidence.failures === 0 && evidence.demo_ok === true, "records the authoritative product-gate result");
ok(Object.values(evidence.controls).every(Boolean) && /^[0-9a-f]{64}$/.test(evidence.manifest_blob_sha256), "records all controls and manifest blob identity");
throws(() => Gate.runGate(options, {
  loaded, buildContext: () => Object.assign({}, context), validate: () => ({ ok: true, errors: [] }), untracked: () => [],
  exists: () => true, readFile: () => Buffer.from("video"), run: item => ({ status: item.control === "truth" ? 1 : 0, stdout: "", stderr: "broken" }), now: () => 1, emit: () => {}
}), /truth.*broken/i, "fails closed on the first failed control");

console.log("release-gate.test: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
