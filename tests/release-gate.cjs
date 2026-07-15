#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const Release = require("./release-manifest.cjs");

const ARGUMENTS = new Set(["manifest", "target", "attestation-root"]);

function parseArgs(argv) {
  const values = {};
  if (!Array.isArray(argv) || argv.length % 2 !== 0) throw new Error("exactly --manifest, --target, and --attestation-root are required");
  for (let index = 0; index < argv.length; index += 2) {
    const flag = String(argv[index] || "");
    if (!flag.startsWith("--") || !ARGUMENTS.has(flag.slice(2))) throw new Error("unknown release-gate argument: " + flag);
    const key = flag.slice(2);
    if (Object.prototype.hasOwnProperty.call(values, key)) throw new Error("duplicate release-gate argument: " + flag);
    if (!String(argv[index + 1] || "").trim()) throw new Error("release-gate argument value missing: " + flag);
    values[key] = argv[index + 1];
  }
  if (Object.keys(values).length !== 3 || !values.manifest || !values.target || !values["attestation-root"]) throw new Error("exactly --manifest, --target, and --attestation-root are required");
  return { manifest: values.manifest, target: path.resolve(values.target), attestationRoot: path.resolve(values["attestation-root"]) };
}

function resolveManifestFile(options, status) {
  const absolute = path.isAbsolute(options.manifest);
  if (status === "final" && absolute) throw new Error("final manifest must be repository-relative");
  if (absolute) return path.resolve(options.manifest);
  const normalized = Release.normalize(options.manifest);
  const root = path.resolve(options.attestationRoot), resolved = path.resolve(root, normalized);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) throw new Error("manifest path escapes attestation root");
  return resolved;
}

function loadManifest(options) {
  const provisional = path.isAbsolute(options.manifest) ? path.resolve(options.manifest) : resolveManifestFile(options, "draft");
  const bytes = fs.readFileSync(provisional), manifest = JSON.parse(bytes.toString("utf8"));
  const file = resolveManifestFile(options, manifest.attestation_status);
  if (path.resolve(file) !== path.resolve(provisional)) throw new Error("manifest resolution changed after status validation");
  return { manifest, bytes, file };
}

function controlPlan(options) {
  const roots = ["--manifest", options.manifest, "--target", options.target, "--attestation-root", options.attestationRoot];
  return [
    { control: "agent_governance", script: "tests/agent-governance.cjs", args: [] },
    { control: "manifest", script: "tests/release-manifest.test.cjs", args: [] },
    { control: "manifest", script: "tests/release-manifest.cjs", args: roots },
    { control: "truth", script: "tests/release-truth-check.test.cjs", args: [] },
    { control: "truth", script: "tests/release-truth-check.cjs", args: [] },
    { control: "preflight", script: "tests/stage-preflight.test.cjs", args: [] },
    { control: "preflight", script: "tests/stage-preflight.cjs", args: [] },
    { control: "product_gate", script: "tests/run-all.cjs", args: [] }
  ];
}

function parseUntracked(output) {
  return String(output || "").split("\0").filter(Boolean).filter(entry => entry.startsWith("?? ")).map(entry => Release.normalize(entry.slice(3)));
}

function collides(left, right) {
  const a = Release.normalize(left).toLowerCase(), b = Release.normalize(right).toLowerCase();
  return a === b || a.startsWith(b + "/") || b.startsWith(a + "/");
}

function governedPaths(manifest) {
  const paths = [manifest.approved_base && manifest.approved_base.path, manifest.inventory && manifest.inventory.path, manifest.checksum_source && manifest.checksum_source.path];
  (manifest.assets || []).filter(asset => asset.kind === "candidate").forEach(asset => paths.push(asset.path));
  return paths.filter(Boolean).map(Release.normalize);
}

function unexpectedGovernedPaths(untracked, manifest) {
  const allowed = new Set((manifest.assets || []).filter(asset => asset.kind === "attestation-bundle").map(asset => Release.normalize(asset.restore_to)).map(value => value.toLowerCase()));
  const governed = governedPaths(manifest);
  return (untracked || []).map(Release.normalize).filter(file => !allowed.has(file.toLowerCase()) && governed.some(target => collides(file, target)));
}

function verifyRestores(manifest, exists, readFile) {
  const errors = [];
  (manifest.assets || []).filter(asset => asset.kind === "attestation-bundle").forEach(asset => {
    const target = Release.normalize(asset.restore_to);
    if (!exists(target)) { errors.push("declared restore output missing: " + target); return; }
    const actual = crypto.createHash("sha256").update(readFile(target)).digest("hex");
    if (actual !== asset.sha256) errors.push("declared restore hash mismatch: " + target);
  });
  return errors;
}

function defaultUntracked(target) {
  return parseUntracked(cp.execFileSync("git", ["-C", target, "status", "--porcelain=v1", "-z", "--untracked-files=all"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
}

function defaultRun(item, options) {
  return cp.spawnSync(process.execPath, [item.script].concat(item.args), {
    cwd: options.target, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024
  });
}

function trackedManifestBytes(loaded, options, context) {
  if (loaded.manifest.attestation_status !== "final") return loaded.bytes;
  const relative = Release.normalize(options.manifest);
  return cp.execFileSync("git", ["-C", options.attestationRoot, "show", context.attestationHead + ":" + relative], { encoding: null, stdio: ["ignore", "pipe", "pipe"] });
}

function runGate(options, dependencies) {
  const deps = dependencies || {}, loaded = deps.loaded || loadManifest(options), manifest = loaded.manifest;
  const context = (deps.buildContext || Release.buildContext)(manifest, options);
  const untracked = (deps.untracked || defaultUntracked)(options.target);
  context.unexpectedGovernedShadows = unexpectedGovernedPaths(untracked, manifest);
  const validation = (deps.validate || Release.validate)(manifest, context);
  if (!validation.ok) throw new Error("release manifest invalid: " + validation.errors.join("; "));

  const exists = deps.exists || (relative => fs.existsSync(path.join(options.target, relative)));
  const readFile = deps.readFile || (relative => fs.readFileSync(path.join(options.target, relative)));
  const restoreErrors = verifyRestores(manifest, exists, readFile);
  if (restoreErrors.length) throw new Error(restoreErrors.join("; "));

  const now = deps.now || (() => Date.now()), emit = deps.emit || (value => process.stdout.write(value));
  const runner = deps.run || ((item) => defaultRun(item, options)), plan = controlPlan(options);
  const controls = { agent_governance: false, manifest: false, truth: false, preflight: false, product_gate: false };
  const remaining = {};
  plan.forEach(item => { remaining[item.control] = (remaining[item.control] || 0) + 1; });
  const started = now();
  let productOutput = "";
  for (const item of plan) {
    const result = runner(item, options) || {};
    const stdout = String(result.stdout || ""), stderr = String(result.stderr || "");
    if (stdout) emit(stdout); if (stderr) emit(stderr);
    if (result.error || result.status !== 0) throw new Error(item.control + " control failed: " + String(result.error && result.error.message || stderr || stdout || "exit " + result.status).trim());
    remaining[item.control]--;
    if (remaining[item.control] === 0) controls[item.control] = true;
    if (item.control === "product_gate") productOutput += stdout;
  }
  const match = /AHD GATE[^\r\n]*?(\d+)\s*\/\s*0/.exec(productOutput);
  if (!match) throw new Error("product_gate output missing authoritative assertion count");
  const manifestBytes = deps.manifestBytes ? deps.manifestBytes(loaded, options, context) : trackedManifestBytes(loaded, options, context);
  return {
    schema: "ahd-release-gate-evidence-v1",
    mode: manifest.attestation_status === "final" ? "final" : "draft-precheck",
    manifest_path: manifest.attestation_status === "final" ? Release.normalize(options.manifest) : loaded.file,
    candidate_commit: manifest.candidate_commit,
    attestation_commit: context.attestationHead,
    manifest_blob_sha256: crypto.createHash("sha256").update(manifestBytes).digest("hex"),
    assertions: Number(match[1]),
    failures: 0,
    duration_ms: Math.max(1, now() - started),
    demo_ok: true,
    controls
  };
}

module.exports = { parseArgs, resolveManifestFile, loadManifest, controlPlan, parseUntracked, governedPaths, unexpectedGovernedPaths, verifyRestores, runGate };

if (require.main === module) {
  try {
    const evidence = runGate(parseArgs(process.argv.slice(2)));
    console.log("RELEASE-GATE: OK");
    console.log(JSON.stringify(evidence, null, 2));
  } catch (error) {
    console.error("RELEASE-GATE: FAILED\n- " + String(error && error.message || error));
    process.exit(1);
  }
}
