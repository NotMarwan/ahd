/* ============================================================================
   structure-check.cjs — meta-layer drift checks: project-map freshness,
   agent-presence health, single-status-file lint. Dev/gate tooling, not
   product logic — Date.now() below is fine (app-offline.test.cjs only scans
   app/, not tests/), and is the only way to check "is this heartbeat stale".

   Run:  node structure-check.cjs
   Exit: 0 = all green, 1 = any failure.
============================================================================ */
const fs = require("fs");
const path = require("path");
const os = require("os");

let passed = 0, failed = 0;
const fails = [];
function ok(cond, name, detail) {
  if (cond) { passed++; console.log("  ✓ " + name); }
  else { failed++; fails.push(name + (detail ? "  — " + detail : "")); console.log("  ✗ " + name + (detail ? "  — " + detail : "")); }
}
function section(t) { console.log("\n" + t); }

const ROOT = path.join(__dirname, "..");

function checkProjectMapFreshness(root) {
  const mapPath = path.join(root, "project/mcp/packages/ahd-navigator/src/project-map.json");
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const mapped = new Set(map.features.flatMap(f => [f.featureFile, f.screenFile]).filter(Boolean));
  const real = new Set();
  for (const dir of ["app/features", "app/screens"]) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (f.endsWith(".js")) real.add(dir + "/" + f);
    }
  }
  return {
    missingFromMap: [...real].filter(f => !mapped.has(f)).sort(),
    missingOnDisk: [...mapped].filter(f => !real.has(f)).sort(),
  };
}

function checkAgentPresenceHealth(root) {
  const dir = path.join(root, "_meta/agent-presence");
  if (!fs.existsSync(dir)) return { stale: [], malformed: [], duplicateClaims: [] };
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  const FORTY_FIVE_MIN_MS = 45 * 60 * 1000;
  const now = Date.now();
  const stale = [];
  const claimsByKey = new Map();
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    if (data.status !== "active") continue;
    const hb = Date.parse(data.last_heartbeat);
    if (!Number.isNaN(hb) && (now - hb) > FORTY_FIVE_MIN_MS) {
      stale.push({ file: f, agent_id: data.agent_id, last_heartbeat: data.last_heartbeat });
    }
    for (const claim of (data.files_claimed || [])) {
      const key = "file:" + claim;
      if (!claimsByKey.has(key)) claimsByKey.set(key, []);
      claimsByKey.get(key).push(data.agent_id || f);
    }
    for (const claim of (data.tasks_claimed || [])) {
      const key = "task:" + claim;
      if (!claimsByKey.has(key)) claimsByKey.set(key, []);
      claimsByKey.get(key).push(data.agent_id || f);
    }
  }
  const duplicateClaims = [...claimsByKey.entries()].filter(([, agents]) => agents.length > 1);
  return { stale, duplicateClaims };
}

function checkSingleStatusFile(root) {
  const CANONICAL = new Set(["_meta/STATUS.md", "_meta/overnight-log.md"]);
  const SKIP_DIR_NAMES = new Set(["node_modules", ".git", "dist", ".claude"]);
  const SKIP_DIR_EXACT = new Set(["_meta/archive", "docs/research"]);
  const offenders = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      const abs = path.join(dir, entry.name);
      const rel = path.relative(root, abs).split(path.sep).join("/");
      if (entry.isDirectory()) {
        if (SKIP_DIR_EXACT.has(rel)) continue;
        walk(abs);
      } else if (/(^|\/)(STATUS|build-log)\.md$/i.test(rel) && !CANONICAL.has(rel)) {
        offenders.push(rel);
      }
    }
  }
  walk(root);
  return offenders.sort();
}

module.exports = { checkProjectMapFreshness, checkAgentPresenceHealth, checkSingleStatusFile };

if (require.main === module) {
  function withFixture(build, run) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-structure-check-"));
    try {
      build(dir);
      return run(dir);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  section("0a) Self-teeth — checkProjectMapFreshness catches real drift");
  {
    const result = withFixture(
      (dir) => {
        fs.mkdirSync(path.join(dir, "project/mcp/packages/ahd-navigator/src"), { recursive: true });
        fs.mkdirSync(path.join(dir, "app/features"), { recursive: true });
        fs.mkdirSync(path.join(dir, "app/screens"), { recursive: true });
        fs.writeFileSync(path.join(dir, "app/features/new-thing.js"), "// stub");
        fs.writeFileSync(
          path.join(dir, "project/mcp/packages/ahd-navigator/src/project-map.json"),
          JSON.stringify({ features: [{ name: "old", featureFile: "app/features/gone.js", screenFile: null }] })
        );
      },
      (dir) => checkProjectMapFreshness(dir)
    );
    ok(result.missingFromMap.includes("app/features/new-thing.js"), "flags a real file missing from the map");
    ok(result.missingOnDisk.includes("app/features/gone.js"), "flags a mapped file that no longer exists on disk");
  }

  section("0b) Self-teeth — checkAgentPresenceHealth catches staleness + duplicate claims");
  {
    const result = withFixture(
      (dir) => {
        const pdir = path.join(dir, "_meta/agent-presence");
        fs.mkdirSync(pdir, { recursive: true });
        const staleTs = new Date(Date.now() - 46 * 60 * 1000).toISOString();
        const freshTs = new Date().toISOString();
        fs.writeFileSync(path.join(pdir, "Ghost.json"), JSON.stringify({
          agent_id: "Ghost", status: "active", last_heartbeat: staleTs, files_claimed: [], tasks_claimed: [],
        }));
        fs.writeFileSync(path.join(pdir, "Alice.json"), JSON.stringify({
          agent_id: "Alice", status: "active", last_heartbeat: freshTs,
          files_claimed: ["shared/file.js"], tasks_claimed: [],
        }));
        fs.writeFileSync(path.join(pdir, "Bob.json"), JSON.stringify({
          agent_id: "Bob", status: "active", last_heartbeat: freshTs,
          files_claimed: ["shared/file.js"], tasks_claimed: [],
        }));
      },
      (dir) => checkAgentPresenceHealth(dir)
    );
    ok(result.stale.some(s => s.agent_id === "Ghost"), "flags a >45min-stale active presence file");
    ok(result.duplicateClaims.some(([key]) => key === "file:shared/file.js"), "flags two active agents claiming the same file");
  }

  section("0c) Self-teeth — checkSingleStatusFile catches an offender and respects exemptions");
  {
    const offenders = withFixture(
      (dir) => {
        fs.mkdirSync(path.join(dir, "_meta/archive"), { recursive: true });
        fs.mkdirSync(path.join(dir, "docs/research/old"), { recursive: true });
        fs.mkdirSync(path.join(dir, "docs/rogue"), { recursive: true });
        fs.mkdirSync(path.join(dir, "_meta"), { recursive: true });
        fs.writeFileSync(path.join(dir, "_meta/STATUS.md"), "canonical");
        fs.writeFileSync(path.join(dir, "_meta/archive/STATUS.md"), "archived, exempt");
        fs.writeFileSync(path.join(dir, "docs/research/old/STATUS.md"), "historical vault, exempt");
        fs.writeFileSync(path.join(dir, "docs/rogue/STATUS.md"), "a NEW rogue status file");
      },
      (dir) => checkSingleStatusFile(dir)
    );
    ok(offenders.length === 1 && offenders[0] === "docs/rogue/STATUS.md", "flags exactly the one rogue STATUS.md, exempting canonical/archive/research", JSON.stringify(offenders));
  }

  section("0d) Self-teeth — checkAgentPresenceHealth tolerates a missing presence dir");
  {
    let threw = false, result = null;
    try {
      result = withFixture(
        (dir) => { /* build nothing — no _meta/agent-presence dir at all */ },
        (dir) => checkAgentPresenceHealth(dir)
      );
    } catch (e) { threw = true; }
    ok(!threw && result && result.stale.length === 0 && result.duplicateClaims.length === 0,
      "returns an empty result (no throw) when _meta/agent-presence is absent",
      threw ? "threw instead of returning" : JSON.stringify(result));
  }

  section("1) Project-map freshness — ahd-navigator vs. real app/ files");
  const mapResult = checkProjectMapFreshness(ROOT);
  ok(mapResult.missingFromMap.length === 0, "every app/features|screens file is in project-map.json", mapResult.missingFromMap.join(", "));
  ok(mapResult.missingOnDisk.length === 0, "every project-map.json feature file exists on disk", mapResult.missingOnDisk.join(", "));

  section("2) Agent-presence health — staleness + duplicate claims");
  const presenceResult = checkAgentPresenceHealth(ROOT);
  ok(presenceResult.stale.length === 0, "no 'active' presence file is >45min stale", JSON.stringify(presenceResult.stale));
  ok(presenceResult.duplicateClaims.length === 0, "no two active agents claim the same file/task", JSON.stringify(presenceResult.duplicateClaims));

  section("3) Single status-file lint");
  const offenders = checkSingleStatusFile(ROOT);
  ok(offenders.length === 0, "no STATUS.md/build-log.md outside the canonical locations or archive", offenders.join(", "));

  console.log(`\n========================================================\nSTRUCTURE CHECK: ${passed} passed, ${failed} failed\n========================================================`);
  if (failed > 0) { console.log("\nFAILURES:"); fails.forEach(f => console.log("  - " + f)); }
  process.exit(failed > 0 ? 1 : 0);
}
