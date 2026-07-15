# Ahd Specification Governance Implementation Plan

> **Required execution mode:** Use `executing-plans` to implement this plan task-by-task. If the
> work is delegated in-session, use `subagent-driven-development` with one fresh implementer and
> one review pass per task.

**Goal:** Make the master specification, capability inventory, and requirement evidence
machine-checkable so stale prose cannot silently redefine Ahd.

**Architecture:** Add zero-dependency specification tooling under `project/spec-tools/`. Tests parse
the actual master spec and active app registries. The navigator generator derives inventory from
files and registration points. Generated traceability is deterministic and reviewed like code.

**Tech stack:** Node.js CommonJS for repository checks; TypeScript/ESM for the existing navigator
generator; current custom Node test harness; Markdown and JSON artifacts.

**Source requirements:** FR-001, DR-008, DR-013, DR-014, NFR-001, NFR-014, JR-003, JR-004.

**Do not modify:** `demo/index.html`, `app/engine.js` by hand, golden vectors, or product behavior.

---

## Task 1: Parse Normative Requirements Deterministically

**Files:**

- Create: `project/spec-tools/master-spec.cjs`
- Create: `tests/app/master-spec-contract.test.cjs`
- Read: `specs/001-ahd-product-system/spec.md`

### Step 1: Write the failing parser contract

Create `tests/app/master-spec-contract.test.cjs`:

```js
"use strict";
const fs = require("fs");
const path = require("path");
const Spec = require(path.join(__dirname, "..", "..", "project", "spec-tools", "master-spec.cjs"));

const SPEC = path.join(__dirname, "..", "..", "specs", "001-ahd-product-system", "spec.md");
const expectedFamilies = { FR: 50, SR: 18, NFR: 20, DR: 15, PR: 15, SEC: 14, JR: 10 };
const allowedStatuses = new Set([
  "BUILT", "PLANNED", "DECISION-GATED", "EXTERNAL-GATED", "DEMO-ONLY", "OUT-OF-SCOPE"
]);

let passed = 0;
let failed = 0;
function ok(condition, message) {
  if (condition) { passed++; console.log("  ✓ " + message); }
  else { failed++; console.log("  ✗ " + message); }
}

const rows = Spec.parseRequirements(fs.readFileSync(SPEC, "utf8"));
ok(rows.length === 142, "master spec declares exactly 142 normative requirements");
ok(new Set(rows.map(function (row) { return row.id; })).size === rows.length,
  "every normative requirement ID is unique");
ok(rows.every(function (row) { return allowedStatuses.has(row.status); }),
  "every requirement has one allowed lifecycle status");

Object.keys(expectedFamilies).forEach(function (family) {
  const count = rows.filter(function (row) { return row.family === family; }).length;
  ok(count === expectedFamilies[family], family + " count is " + expectedFamilies[family]);
});

console.log("\nMASTER SPEC CONTRACT: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
```

### Step 2: Run it and confirm red

Run:

```powershell
node tests/app/master-spec-contract.test.cjs
```

Expected: module-not-found failure for `project/spec-tools/master-spec.cjs`.

### Step 3: Implement the minimal parser

Create `project/spec-tools/master-spec.cjs`:

```js
"use strict";

const REQUIREMENT_ROW = /^\| ((FR|SR|NFR|DR|PR|SEC|JR)-(\d{3})) \| `(BUILT|PLANNED|DECISION-GATED|EXTERNAL-GATED|DEMO-ONLY|OUT-OF-SCOPE)` \| (.+) \|$/;

function parseRequirements(markdown) {
  return String(markdown).split(/\r?\n/).map(function (line) {
    const match = REQUIREMENT_ROW.exec(line);
    if (!match) return null;
    return {
      id: match[1],
      family: match[2],
      number: Number(match[3]),
      status: match[4],
      requirement: match[5].trim()
    };
  }).filter(Boolean);
}

module.exports = { parseRequirements: parseRequirements };
```

### Step 4: Run focused test

```powershell
node tests/app/master-spec-contract.test.cjs
```

Expected: green with 10 assertions.

### Step 5: Commit

```powershell
git add project/spec-tools/master-spec.cjs tests/app/master-spec-contract.test.cjs
git commit -m "test(spec): enforce master requirement contract"
```

---

## Task 2: Add Deterministic Requirement Traceability

**Files:**

- Create: `specs/001-ahd-product-system/traceability-source.json`
- Create: `specs/001-ahd-product-system/traceability.json`
- Create: `project/spec-tools/build-traceability.cjs`
- Modify: `tests/app/master-spec-contract.test.cjs`

### Step 1: Add a failing traceability assertion

Append to the focused test:

```js
const TRACE_SOURCE = path.join(path.dirname(SPEC), "traceability-source.json");
const trace = JSON.parse(fs.readFileSync(TRACE_SOURCE, "utf8"));
const byId = new Map(trace.requirements.map(function (item) { return [item.id, item]; }));

ok(trace.requirements.length === rows.length, "traceability covers every normative requirement");
ok(rows.every(function (row) { return byId.has(row.id); }), "no requirement is untraced");
ok(trace.requirements.every(function (item) {
  const hasEvidence = Array.isArray(item.evidence) && item.evidence.length > 0;
  const hasGap = typeof item.gap === "string" && item.gap.length > 0;
  return hasEvidence !== hasGap;
}), "each trace row has evidence XOR a declared gap");
```

Run the test. Expected: missing `traceability-source.json`.

### Step 2: Create the source structure

Create a JSON object with this exact top-level shape and one entry for every requirement:

```json
{
  "schema": "ahd-requirement-trace-v1",
  "feature": "001-ahd-product-system",
  "requirements": [
    {
      "id": "FR-001",
      "story": "US8",
      "evidence": [
        "specs/001-ahd-product-system/spec.md",
        "tests/app/master-spec-contract.test.cjs"
      ],
      "decisions": []
    },
    {
      "id": "FR-047",
      "story": "US10",
      "gap": "Approved production identity and exact-action signature flow is absent",
      "decisions": ["OT-VAL"]
    }
  ]
}
```

Do not use empty evidence and empty gap together. `BUILT` rows require evidence. `PLANNED`,
`DECISION-GATED`, and `EXTERNAL-GATED` rows require a concrete gap; decision-gated rows also require a
named decision. `OUT-OF-SCOPE` rows use a gap that states the deliberate exclusion.

### Step 3: Add stricter failing assertions

Append:

```js
ok(rows.every(function (row) {
  const item = byId.get(row.id);
  if (!item) return false;
  if (row.status === "BUILT" || row.status === "DEMO-ONLY") return item.evidence.length > 0;
  return item.gap.length > 0;
}), "traceability evidence matches lifecycle status");

ok(rows.filter(function (row) { return row.status === "DECISION-GATED"; }).every(function (row) {
  return byId.get(row.id).decisions.length > 0;
}), "every decision-gated requirement names a decision");
```

Run. Expected: failures until all 142 entries are completed.

### Step 4: Implement deterministic generation

`project/spec-tools/build-traceability.cjs` must:

1. parse `spec.md` with `master-spec.cjs`;
2. load `traceability-source.json`;
3. validate exact one-to-one IDs and status-compatible evidence/gaps;
4. sort by family order `FR, SR, NFR, DR, PR, SEC, JR` then number;
5. copy current requirement text and lifecycle status from `spec.md`; and
6. write two-space JSON plus one newline to `traceability.json`.

Core output construction:

```js
const FAMILY_ORDER = { FR: 0, SR: 1, NFR: 2, DR: 3, PR: 4, SEC: 5, JR: 6 };
const output = {
  schema: "ahd-requirement-trace-v1",
  feature: "001-ahd-product-system",
  generated_from: "specs/001-ahd-product-system/spec.md",
  requirements: rows.slice().sort(function (a, b) {
    return FAMILY_ORDER[a.family] - FAMILY_ORDER[b.family] || a.number - b.number;
  }).map(function (row) {
    return Object.assign({}, row, sourceById.get(row.id));
  })
};
```

### Step 5: Prove deterministic output

Run twice and compare hash:

```powershell
node project/spec-tools/build-traceability.cjs
$first = (Get-FileHash specs/001-ahd-product-system/traceability.json -Algorithm SHA256).Hash
node project/spec-tools/build-traceability.cjs
$second = (Get-FileHash specs/001-ahd-product-system/traceability.json -Algorithm SHA256).Hash
if ($first -ne $second) { throw "traceability output drifted" }
node tests/app/master-spec-contract.test.cjs
```

Expected: identical hashes and green focused test.

### Step 6: Commit

```powershell
git add specs/001-ahd-product-system/traceability-source.json specs/001-ahd-product-system/traceability.json project/spec-tools/build-traceability.cjs tests/app/master-spec-contract.test.cjs
git commit -m "feat(spec): add deterministic requirement traceability"
```

---

## Task 3: Detect Product Inventory Drift

**Files:**

- Create: `tests/app/product-inventory-drift.test.cjs`
- Read: `app/index.html`
- Read: `app/app.js`
- Read: `app/screens/*.js`
- Read: `app/features/*.js`
- Read: `specs/001-ahd-product-system/contracts/product-surfaces.md`

### Step 1: Write a failing inventory test

The test must derive:

- 21 screen registration keys from `App.registerScreen({ key: "..."`;
- 8 primary keys from `NAV_ORDER`;
- 34 feature files from `app/features/*.js` at the current baseline;
- screen and feature script sources from `app/index.html`; and
- the 21 key rows from `contracts/product-surfaces.md`.

Use source parsing only; do not run a browser.

Key assertions:

```js
eq(screenKeys.length, 21, "exact current screen count");
eq(navKeys.length, 8, "exact primary navigation count");
eq(featureFiles.length, 34, "exact current feature-file count");
eq(new Set(screenKeys).size, screenKeys.length, "screen keys are unique");
eq(sorted(screenKeys), sorted(contractKeys), "surface contract matches screen registry");
eq(sorted(screenScripts), sorted(screenFiles), "every screen is loaded exactly once");
eq(sorted(featureScripts), sorted(featureFiles), "every feature is loaded exactly once");
```

### Step 2: Run and confirm the real failure

```powershell
node tests/app/product-inventory-drift.test.cjs
```

Expected: fail on the current drift the test exposes, not on missing fixture code.

### Step 3: Fix only the authoritative mismatch

- If an active file is unloaded, load or remove it based on current product intent.
- If the surface contract is stale, update the contract.
- If a count changed because a legitimate feature landed, update the master spec and trace source in
  the same commit.
- Never edit the frozen demo.

### Step 4: Run focused and full inventory checks

```powershell
node tests/app/product-inventory-drift.test.cjs
node tests/structure-check.cjs
```

Expected: both green.

### Step 5: Commit

```powershell
git add tests/app/product-inventory-drift.test.cjs specs/001-ahd-product-system/contracts/product-surfaces.md
git commit -m "test(app): detect product inventory drift"
```

---

## Task 4: Repair Navigator Generation

**Files:**

- Modify: `project/mcp/packages/ahd-navigator/scripts/generate-map.ts`
- Modify: `project/mcp/packages/ahd-navigator/src/__tests__/project-map.test.ts`
- Modify: `project/mcp/packages/ahd-navigator/src/project-map.json`

### Step 1: Add failing generator-quality tests

Add exact assertions:

```ts
test('project map covers every active app feature and screen', () => {
  assert.equal(manifest.features.length, 35);
  assert.equal(manifest.features.filter((f: any) => f.screenFile).length, 21);
  assert.equal(manifest.features.filter((f: any) => f.featureFile).length, 34);
});

test('home is a screen-only unit', () => {
  const home = manifest.features.find((f: any) => f.name === 'home');
  assert.equal(home.featureFile, null);
  assert.equal(home.screenFile, 'app/screens/home.js');
});

test('layers are populated', () => {
  assert.deepEqual(manifest.layers.map((layer: any) => layer.name),
    ['frozen-core', 'domain-features', 'screen-rendering', 'local-server', 'independent-protocol']);
});
```

Replace the `app >= 29` assertion with a count derived from the test runner's discovery regex, not 63.

### Step 2: Run the navigator test and confirm red

```powershell
Push-Location project/mcp
npx tsx packages/ahd-navigator/src/__tests__/project-map.test.ts
npx tsx packages/ahd-navigator/src/__tests__/navigator.test.ts
Pop-Location
```

### Step 3: Refactor generator inputs

Keep a small override table only for semantic names/descriptions and non-basename screen mappings.
Derive file existence, screen registrations, test-file candidates, suite count, and layer membership
from active paths. Sort all arrays before JSON output.

Do not keep `app: 29` or an empty `layers` array.

### Step 4: Regenerate and verify

```powershell
Push-Location project/mcp
npm run generate-map
npx tsx packages/ahd-navigator/src/__tests__/project-map.test.ts
npx tsx packages/ahd-navigator/src/__tests__/navigator.test.ts
Pop-Location
node tests/structure-check.cjs
node tests/app/product-inventory-drift.test.cjs
```

Expected: generated JSON changes once, then stays byte-identical on a second run.

### Step 5: Commit

```powershell
git add project/mcp/packages/ahd-navigator/scripts/generate-map.ts project/mcp/packages/ahd-navigator/src/__tests__/project-map.test.ts project/mcp/packages/ahd-navigator/src/project-map.json
git commit -m "fix(navigator): derive active project inventory"
```

---

## Task 5: Synchronize Living Documentation

**Files:**

- Modify: `README.md`
- Modify: `app/README.md`
- Modify: `tests/README.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `_meta/INDEX.md`

### Step 1: Capture live facts

```powershell
node tests/app/product-inventory-drift.test.cjs
node tests/app/run-app-tests.cjs
node tests/structure-check.cjs
```

Copy no assertion total before these commands run.

### Step 2: Correct contradictions

Document:

- 21 screens, 8 primary navigation entries, 13 contextual screens;
- 34 feature files and 35 navigator units;
- auto-discovered app suite count from live output;
- current HMAC authentication and missing record/action authorization;
- public local `/list` risk;
- `/health` and required live HTTP smoke;
- durable append plus torn-tail-tolerant replay, not transactional atomicity;
- loopback-only Docker limitation; and
- master spec/traceability authority.

### Step 3: Validate no stale phrases remain

```powershell
rg -n "three screens|3 screens|eight suites|8 suites|nine app suites|no authentication|optional manual real-socket" README.md app/README.md tests/README.md docs/ARCHITECTURE.md
git diff --check -- README.md app/README.md tests/README.md docs/ARCHITECTURE.md _meta/INDEX.md
```

Expected: no stale statement remains unless explicitly quoted as historical.

### Step 4: Run focused checks

```powershell
node tests/app/master-spec-contract.test.cjs
node tests/app/product-inventory-drift.test.cjs
node tests/structure-check.cjs
```

### Step 5: Commit

```powershell
git add README.md app/README.md tests/README.md docs/ARCHITECTURE.md _meta/INDEX.md
git commit -m "docs(architecture): align living product inventory"
```

---

## Task 6: Full Verification and Memory Sync

**Files:**

- Modify: `_meta/STATUS.md`
- Modify: `_meta/overnight-log.md`
- Modify: `AmadHackathon/00 Home.md`
- Modify: `AmadHackathon/01 الخطة الرئيسة.md`
- Modify: `AmadHackathon/10 المواصفة الأم.md`

### Step 1: Run specification hygiene

```powershell
git diff --check -- specs/001-ahd-product-system project/spec-tools project/mcp/packages/ahd-navigator tests/app
$markers = @('NEEDS' + ' CLARIFICATION', '[' + 'FEATURE' + ']', '[' + 'DATE' + ']', '[' + '###')
Get-ChildItem specs/001-ahd-product-system -Recurse -File | Select-String -SimpleMatch -Pattern $markers
```

Expected: no output.

### Step 2: Run the authoritative gate

```powershell
cd tests
node run-all.cjs
cd ..
```

Expected: zero failures and unchanged frozen tripwire.

### Step 3: Update memory with live results

Record source pointers, the live gate banner, delivered files, and remaining gated work. Do not copy
unverified counts or overwrite unrelated cockpit edits.

### Step 4: Review the diff

```powershell
git status --short
git diff --check
git diff -- specs/001-ahd-product-system project/spec-tools project/mcp/packages/ahd-navigator tests/app README.md app/README.md tests/README.md docs/ARCHITECTURE.md _meta AmadHackathon
```

### Step 5: Commit

```powershell
git add _meta/STATUS.md _meta/overnight-log.md "AmadHackathon/00 Home.md" "AmadHackathon/01 الخطة الرئيسة.md" "AmadHackathon/10 المواصفة الأم.md"
git commit -m "docs(spec): record governance verification"
```

## Completion Criteria

- 142 requirements parse uniquely with one status.
- Traceability covers every requirement with evidence XOR a concrete gap.
- Decision-gated requirements name decisions.
- App/screen/feature/navigator/spec inventories agree.
- Navigator output is deterministic and contains populated layers/tests.
- Living docs match code and live test output.
- Full gate is green and frozen tripwire unchanged.
