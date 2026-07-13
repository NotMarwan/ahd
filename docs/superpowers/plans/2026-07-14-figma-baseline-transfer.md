# Ahd Figma Baseline Transfer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transfer the complete 17-screen Sadu HTML prototype into a hash-tracked, pixel-reviewed Figma baseline without redesign, then produce the exact handoff that unlocks the existing Expo mobile plan and a separate V2 redesign.

**Architecture:** The HTML partials remain the transfer source until approval. A repository manifest maps every source partial to one Figma frame; deterministic HTML and Figma exports sit beside a review ledger whose approvals are tied to source and token hashes. Figma uses variables and components for maintainability, but each baseline frame carries a locked reference overlay. After the gate passes, Figma becomes the visual source of truth; V2 stays isolated.

**Tech Stack:** HTML/CSS partials, Node.js CommonJS validation, optional local Playwright capture, Figma Design variables/components/prototyping, existing Expo/React Native portability contract.

## Global Constraints

- Follow `docs/superpowers/specs/2026-07-14-figma-baseline-transfer-design.md` verbatim.
- Never edit `demo/index.html` or golden engine internals.
- Do not redesign, shorten copy, correct Arabic, change density, or swap typography during baseline transfer.
- Rendered HTML wins over descriptive docs when they conflict during Phase A.
- `application/prototypes/src/head.html` plus `s01-home.html` through `s17-settings.html` are the baseline sources.
- Regenerate `application/prototypes/dir-b-sadu.html`; never hand-edit the generated output.
- Frame size is exactly 375 × 800 for baseline comparison.
- Arabic remains RTL. Latin hashes/serials remain LTR.
- Money remains integer halalas in logic. Visual transfer copies displayed values verbatim.
- Trust remains qualitative. No number, percentage, score, export, or underwriting use.
- Late state uses amber. Red is reserved for structural/Shariah stop or tamper.
- AI gives no fatwa. No new ruling or Shariah conclusion is introduced.
- Baseline pages remain locked after approval. V2 changes occur only in `20_V2_WORKBENCH`.
- Every visible mismatch over 2 px, every stroke mismatch over 1 px, and every normalized platform difference requires an exception ID.
- Do not re-review an approved screen when its source hash and token hash are unchanged.
- Run the judge lens before close-out. A score below 8 creates a `JL-` item.
- Any project-state change updates the Obsidian cockpit before exit.
- Existing user changes are preserved. Stage only files owned by this plan.

## Reasoning and model routing

- **Medium is the default executor:** follow the written steps for Tasks 1–9 when repository/Figma reality matches this plan.
- **High reasoning is escalation-only:** use it when source inventory conflicts with the manifest, Figma cannot represent the specified taxonomy, a new exception is required, Arabic/spine intent is ambiguous, or Tasks 10–11 need final visual/judge approval.
- **Low-cost deterministic worker:** use it for Tasks 2 and 3 commands, hashes, captures, exports, and unchanged-screen checks.
- Low-cost workers may not change Arabic copy, variables, component taxonomy, layout hierarchy, exception policy, or approval status.
- Model switching is manual. Stop at the next task boundary and ask the controller to switch when the stated level changes.

## Locked file structure

Files created by this plan:

```text
application/design/figma-baseline/
  README.md
  manifest.json
  review-ledger.json
  check-baseline.cjs
  capture-reference.mjs
  captures/
    html/
    figma/
  reports/
    baseline-gate.md
tests/app/
  figma-baseline.test.cjs
docs/superpowers/plans/
  2026-07-14-figma-baseline-transfer.md
```

The Figma file is external but fixed by name:

```text
Ahd — Baseline v1 — Sadu
```

---

### Task 1: Create the baseline contract and structural gate

**Reasoning level:** Medium execution. Escalate to high only if source inventory conflicts with this contract.

**Files:**

- Create: `application/design/figma-baseline/README.md`
- Create: `application/design/figma-baseline/manifest.json`
- Create: `application/design/figma-baseline/review-ledger.json`
- Create: `application/design/figma-baseline/check-baseline.cjs`
- Create: `tests/app/figma-baseline.test.cjs`

**Interfaces:**

- Consumes: prototype partials and `application/design/tokens.json`.
- Produces: `validate({ requireApproved }) -> { ok, errors, warnings, manifest, ledger }`.
- Produces: structural command and final approval command.

```text
node application/design/figma-baseline/check-baseline.cjs
node application/design/figma-baseline/check-baseline.cjs --gate
```

- [ ] **Step 1: Write the failing structural test**

Create `tests/app/figma-baseline.test.cjs`:

```js
"use strict";
const assert = require("assert");
const path = require("path");

const ROOT = path.join(__dirname, "../..");
const checkerPath = path.join(ROOT, "application/design/figma-baseline/check-baseline.cjs");

assert.doesNotThrow(() => require(checkerPath), "baseline checker module loads");
const checker = require(checkerPath);
const structural = checker.validate({ requireApproved: false });

assert.strictEqual(structural.ok, true, structural.errors.join("\n"));
assert.strictEqual(structural.manifest.baselineId, "sadu-baseline-v1");
assert.strictEqual(structural.manifest.screens.length, 17);
assert.deepStrictEqual(
  structural.manifest.screens.map((s) => s.id),
  Array.from({ length: 17 }, (_, i) => "B" + String(i + 1).padStart(2, "0"))
);
assert.strictEqual(new Set(structural.manifest.screens.map((s) => s.key)).size, 17);
assert.strictEqual(structural.ledger.screens.length, 17);

const finalGate = checker.validate({ requireApproved: true });
assert.strictEqual(finalGate.ok, false, "final gate stays red until Figma review completes");
assert(finalGate.errors.some((e) => e.includes("not approved")));

console.log("figma baseline structural contract: PASS");
```

- [ ] **Step 2: Run the test and confirm failure**

```text
node tests/app/figma-baseline.test.cjs
```

Expected decisive failure:

```text
Cannot find module
```

- [ ] **Step 3: Create the exact manifest**

Create `application/design/figma-baseline/manifest.json`:

```json
{
  "$schema": "ahd-figma-baseline-v1",
  "baselineId": "sadu-baseline-v1",
  "figmaFileName": "Ahd — Baseline v1 — Sadu",
  "sourceBoard": "application/prototypes/dir-b-sadu.html",
  "sourceHead": "application/prototypes/src/head.html",
  "tokens": "application/design/tokens.json",
  "frame": { "width": 375, "height": 800 },
  "screens": [
    { "id": "B01", "key": "home", "titleAr": "الرئيسيّة", "sourcePartial": "application/prototypes/src/s01-home.html" },
    { "id": "B02", "key": "create", "titleAr": "أنشئ عهدًا", "sourcePartial": "application/prototypes/src/s02-create.html" },
    { "id": "B03", "key": "settle", "titleAr": "المقاصّة", "sourcePartial": "application/prototypes/src/s03-settle.html" },
    { "id": "B04", "key": "daftari", "titleAr": "دفتري", "sourcePartial": "application/prototypes/src/s04-daftari.html" },
    { "id": "B05", "key": "borrower", "titleAr": "ما عليّ", "sourcePartial": "application/prototypes/src/s05-borrower.html" },
    { "id": "B06", "key": "proof", "titleAr": "حافظة الإثبات", "sourcePartial": "application/prototypes/src/s06-proof.html" },
    { "id": "B07", "key": "impact", "titleAr": "أثر عهد", "sourcePartial": "application/prototypes/src/s07-impact.html" },
    { "id": "B08", "key": "request", "titleAr": "اطلب عهدًا", "sourcePartial": "application/prototypes/src/s08-request.html" },
    { "id": "B09", "key": "open", "titleAr": "قرضٌ مفتوح", "sourcePartial": "application/prototypes/src/s09-open.html" },
    { "id": "B10", "key": "timeline", "titleAr": "سِجلّ الشهادة", "sourcePartial": "application/prototypes/src/s10-timeline.html" },
    { "id": "B11", "key": "circle", "titleAr": "الدائرة", "sourcePartial": "application/prototypes/src/s11-circle.html" },
    { "id": "B12", "key": "circle-adv", "titleAr": "الدائرة+", "sourcePartial": "application/prototypes/src/s12-circle-adv.html" },
    { "id": "B13", "key": "standing", "titleAr": "سُلفة بالمعروف", "sourcePartial": "application/prototypes/src/s13-standing.html" },
    { "id": "B14", "key": "covenant", "titleAr": "سِجلّ المعروف", "sourcePartial": "application/prototypes/src/s14-covenant.html" },
    { "id": "B15", "key": "dispute", "titleAr": "محلّ خلاف", "sourcePartial": "application/prototypes/src/s15-dispute.html" },
    { "id": "B16", "key": "bounds", "titleAr": "الضمانات والحدود", "sourcePartial": "application/prototypes/src/s16-bounds.html" },
    { "id": "B17", "key": "settings", "titleAr": "الإعدادات", "sourcePartial": "application/prototypes/src/s17-settings.html" }
  ]
}
```

- [ ] **Step 4: Create the exact pending ledger**

Create `application/design/figma-baseline/review-ledger.json` with this object shape and all 17 IDs:

```json
{
  "$schema": "ahd-figma-review-v1",
  "baselineId": "sadu-baseline-v1",
  "figmaFileUrl": null,
  "tokensSha256": null,
  "screens": [
    { "id": "B01", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B01-home.png", "figmaCapture": "captures/figma/B01-home.png", "exceptions": [] },
    { "id": "B02", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B02-create.png", "figmaCapture": "captures/figma/B02-create.png", "exceptions": [] },
    { "id": "B03", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B03-settle.png", "figmaCapture": "captures/figma/B03-settle.png", "exceptions": [] },
    { "id": "B04", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B04-daftari.png", "figmaCapture": "captures/figma/B04-daftari.png", "exceptions": [] },
    { "id": "B05", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B05-borrower.png", "figmaCapture": "captures/figma/B05-borrower.png", "exceptions": [] },
    { "id": "B06", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B06-proof.png", "figmaCapture": "captures/figma/B06-proof.png", "exceptions": [] },
    { "id": "B07", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B07-impact.png", "figmaCapture": "captures/figma/B07-impact.png", "exceptions": [] },
    { "id": "B08", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B08-request.png", "figmaCapture": "captures/figma/B08-request.png", "exceptions": [] },
    { "id": "B09", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B09-open.png", "figmaCapture": "captures/figma/B09-open.png", "exceptions": [] },
    { "id": "B10", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B10-timeline.png", "figmaCapture": "captures/figma/B10-timeline.png", "exceptions": [] },
    { "id": "B11", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B11-circle.png", "figmaCapture": "captures/figma/B11-circle.png", "exceptions": [] },
    { "id": "B12", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B12-circle-adv.png", "figmaCapture": "captures/figma/B12-circle-adv.png", "exceptions": [] },
    { "id": "B13", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B13-standing.png", "figmaCapture": "captures/figma/B13-standing.png", "exceptions": [] },
    { "id": "B14", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B14-covenant.png", "figmaCapture": "captures/figma/B14-covenant.png", "exceptions": [] },
    { "id": "B15", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B15-dispute.png", "figmaCapture": "captures/figma/B15-dispute.png", "exceptions": [] },
    { "id": "B16", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B16-bounds.png", "figmaCapture": "captures/figma/B16-bounds.png", "exceptions": [] },
    { "id": "B17", "status": "pending", "sourceSha256": null, "htmlCapture": "captures/html/B17-settings.png", "figmaCapture": "captures/figma/B17-settings.png", "exceptions": [] }
  ],
  "exceptionDefinitions": {
    "FONT-01": "Baseline uses the actual HTML font render; Expo later uses bundled IBM Plex Sans Arabic.",
    "CHROME-01": "Baseline contains simulated phone chrome; Expo removes it for real safe areas.",
    "EMOJI-01": "Baseline preserves source emoji; Expo later uses a vector icon component.",
    "SHADOW-01": "Numeric shadow values match; browser and Figma rasterization may visibly differ by at most 2 px."
  }
}
```

- [ ] **Step 5: Implement the checker**

Create `application/design/figma-baseline/check-baseline.cjs`:

```js
#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = __dirname;
const ROOT = path.join(DIR, "../../..");
const MANIFEST_PATH = path.join(DIR, "manifest.json");
const LEDGER_PATH = path.join(DIR, "review-ledger.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function hash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function absolute(rel) {
  return path.join(ROOT, rel);
}

function validate(options) {
  const requireApproved = !!(options && options.requireApproved);
  const errors = [];
  const warnings = [];
  const manifest = readJson(MANIFEST_PATH);
  const ledger = readJson(LEDGER_PATH);

  if (manifest.baselineId !== "sadu-baseline-v1") errors.push("baselineId must be sadu-baseline-v1");
  if (!manifest.frame || manifest.frame.width !== 375 || manifest.frame.height !== 800) errors.push("baseline frame must be 375x800");
  if (!Array.isArray(manifest.screens) || manifest.screens.length !== 17) errors.push("manifest must contain 17 screens");
  if (!Array.isArray(ledger.screens) || ledger.screens.length !== 17) errors.push("ledger must contain 17 screens");

  const ids = new Set();
  const keys = new Set();
  const ledgerById = new Map((ledger.screens || []).map((s) => [s.id, s]));
  const tokenPath = absolute(manifest.tokens);
  const currentTokensHash = fs.existsSync(tokenPath) ? hash(tokenPath) : null;

  for (let i = 0; i < (manifest.screens || []).length; i++) {
    const screen = manifest.screens[i];
    const expectedId = "B" + String(i + 1).padStart(2, "0");
    if (screen.id !== expectedId) errors.push("screen order mismatch: expected " + expectedId + " got " + screen.id);
    if (ids.has(screen.id)) errors.push("duplicate screen id: " + screen.id);
    if (keys.has(screen.key)) errors.push("duplicate screen key: " + screen.key);
    ids.add(screen.id);
    keys.add(screen.key);

    const source = absolute(screen.sourcePartial);
    if (!fs.existsSync(source)) errors.push("missing source partial: " + screen.sourcePartial);
    const review = ledgerById.get(screen.id);
    if (!review) {
      errors.push("missing ledger row: " + screen.id);
      continue;
    }

    if (requireApproved) {
      if (review.status !== "approved") errors.push(screen.id + " not approved");
      if (!fs.existsSync(source) || review.sourceSha256 !== hash(source)) errors.push(screen.id + " source hash stale");
      if (!ledger.tokensSha256 || ledger.tokensSha256 !== currentTokensHash) errors.push(screen.id + " token hash stale");
      if (!fs.existsSync(path.join(DIR, review.htmlCapture))) errors.push(screen.id + " HTML capture missing");
      if (!fs.existsSync(path.join(DIR, review.figmaCapture))) errors.push(screen.id + " Figma capture missing");
      if (!Array.isArray(review.exceptions)) errors.push(screen.id + " exceptions must be an array");
      for (const id of review.exceptions || []) {
        if (!ledger.exceptionDefinitions || !ledger.exceptionDefinitions[id]) errors.push(screen.id + " unknown exception: " + id);
      }
    }
  }

  if (requireApproved && !ledger.figmaFileUrl) errors.push("figmaFileUrl missing");
  if (!requireApproved && (ledger.screens || []).some((s) => s.status === "approved" && !s.sourceSha256)) {
    warnings.push("approved ledger rows need source hashes");
  }

  return { ok: errors.length === 0, errors, warnings, manifest, ledger };
}

if (require.main === module) {
  const result = validate({ requireApproved: process.argv.includes("--gate") });
  for (const warning of result.warnings) console.log("WARN " + warning);
  for (const error of result.errors) console.error("FAIL " + error);
  console.log(result.ok ? "FIGMA BASELINE PASS" : "FIGMA BASELINE FAIL");
  process.exit(result.ok ? 0 : 1);
}

module.exports = { validate, hash };
```

- [ ] **Step 6: Write the package README**

Create `application/design/figma-baseline/README.md`:

```markdown
# Ahd Figma baseline

Canonical process: `docs/superpowers/plans/2026-07-14-figma-baseline-transfer.md`.

- `manifest.json` maps 17 HTML partials to Figma frames.
- `review-ledger.json` stores approvals tied to source and token hashes.
- `captures/html/` contains deterministic source captures.
- `captures/figma/` contains 1× exports from approved Figma frames.
- `reports/baseline-gate.md` records the final human gate.

Structural check:

    node application/design/figma-baseline/check-baseline.cjs

Final gate:

    node application/design/figma-baseline/check-baseline.cjs --gate

Never place V2 work inside baseline pages.
```

- [ ] **Step 7: Run tests**

```text
node tests/app/figma-baseline.test.cjs
node application/design/figma-baseline/check-baseline.cjs
```

Expected:

```text
figma baseline structural contract: PASS
FIGMA BASELINE PASS
```

- [ ] **Step 8: Run the full project gate**

```text
cd tests
node run-all.cjs
```

Expected: exit 0 and the current assertion banner. Do not hard-code a stale count.

- [ ] **Step 9: Commit only owned files**

```text
git add application/design/figma-baseline tests/app/figma-baseline.test.cjs docs/superpowers/specs/2026-07-14-figma-baseline-transfer-design.md docs/superpowers/plans/2026-07-14-figma-baseline-transfer.md
git commit -m "docs(design): freeze Figma baseline transfer contract and hash gate"
```

---

### Task 2: Add deterministic HTML screen capture

**Reasoning level:** Low-cost deterministic worker.

**Files:**

- Create: `application/design/figma-baseline/capture-reference.mjs`
- Create: directories `application/design/figma-baseline/captures/html/` and `captures/figma/`
- Test: `tests/app/figma-baseline.test.cjs`

**Interfaces:**

- Consumes: `manifest.json` and generated Sadu board.
- Produces: 17 PNG files at exact 375 × 800.

- [ ] **Step 1: Extend the existing test before writing the script**

Append to `tests/app/figma-baseline.test.cjs`:

```js
const fs = require("fs");
const captureScript = path.join(ROOT, "application/design/figma-baseline/capture-reference.mjs");
assert.strictEqual(fs.existsSync(captureScript), true, "reference capture script exists");
const captureSource = fs.readFileSync(captureScript, "utf8");
assert(captureSource.includes(".phone"), "capture script targets the phone frame");
assert(captureSource.includes("375") && captureSource.includes("800"), "capture dimensions are pinned");
```

- [ ] **Step 2: Run the test and verify failure**

```text
node tests/app/figma-baseline.test.cjs
```

Expected decisive failure:

```text
reference capture script exists
```

- [ ] **Step 3: Write the capture script**

Create `application/design/figma-baseline/capture-reference.mjs`:

```js
#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright unavailable. Install it in the execution environment, then rerun this script.");
  process.exit(2);
}

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:\/)/, "$1"));
const ROOT = path.resolve(DIR, "../../..");
const manifest = JSON.parse(fs.readFileSync(path.join(DIR, "manifest.json"), "utf8"));
const board = path.join(ROOT, manifest.sourceBoard);
const outDir = path.join(DIR, "captures/html");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(pathToFileURL(board).href, { waitUntil: "load" });

const phones = page.locator(".phone-slot .phone");
const count = await phones.count();
if (count !== manifest.screens.length) throw new Error("expected 17 phone frames, found " + count);

for (let i = 0; i < count; i++) {
  const screen = manifest.screens[i];
  const phone = phones.nth(i);
  const box = await phone.boundingBox();
  if (!box || Math.round(box.width) !== 375 || Math.round(box.height) !== 800) {
    throw new Error(screen.id + " expected 375x800, got " + JSON.stringify(box));
  }
  const filename = screen.id + "-" + screen.key + ".png";
  await phone.screenshot({ path: path.join(outDir, filename) });
  console.log("captured " + filename);
}

await browser.close();
```

- [ ] **Step 4: Build and verify design tooling before capture**

```text
node application/prototypes/build-prototype.cjs
node application/design/check-tokens.cjs
node application/design/contrast-check.cjs
```

Expected: all commands exit 0.

- [ ] **Step 5: Capture all references**

```text
node application/design/figma-baseline/capture-reference.mjs
```

Expected: 17 `captured` lines and 17 PNG files.

- [ ] **Step 6: Commit capture tooling and immutable HTML captures**

```text
git add application/design/figma-baseline/capture-reference.mjs application/design/figma-baseline/captures/html tests/app/figma-baseline.test.cjs
git commit -m "test(design): add deterministic 17-screen HTML reference captures"
```

---

### Task 3: Freeze hashes and reference evidence

**Reasoning level:** Low-cost deterministic worker.

**Files:**

- Modify: `application/design/figma-baseline/review-ledger.json`

**Interfaces:**

- Consumes: current source partials and `tokens.json`.
- Produces: exact hashes that later cache approval.

- [ ] **Step 1: Print current hashes**

Run from repository root:

```text
node -e "const fs=require('fs'),c=require('crypto'),m=require('./application/design/figma-baseline/manifest.json'); const h=p=>c.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); console.log('TOKENS '+h(m.tokens)); for(const s of m.screens) console.log(s.id+' '+h(s.sourcePartial));"
```

Expected: one `TOKENS` line plus 17 screen lines.

- [ ] **Step 2: Patch the ledger with those exact values**

Set `tokensSha256` to the printed token hash.

Set each screen's `sourceSha256` to the printed hash for that ID.

Leave every `status` as `pending`.

Do not type or guess hashes manually. Copy only command output.

- [ ] **Step 3: Prove the structural gate stays green and final gate stays red**

```text
node application/design/figma-baseline/check-baseline.cjs
node application/design/figma-baseline/check-baseline.cjs --gate
```

Expected: first exits 0. Second exits 1 with 17 `not approved` failures and missing Figma exports/URL.

- [ ] **Step 4: Commit the freeze point**

```text
git add application/design/figma-baseline/review-ledger.json
git commit -m "chore(design): freeze Sadu baseline source and token hashes"
```

Do not change baseline source partials after this commit. If any source must change, stop transfer, regenerate captures, refresh only affected hashes, and return its ledger status to `pending`.

---

### Task 4: Create and lock the Figma file architecture

**Reasoning level:** Medium execution. Escalate to high only if Figma cannot represent the locked page/variable architecture.

**Files:**

- Modify: `application/design/figma-baseline/review-ledger.json`
- External: Figma file `Ahd — Baseline v1 — Sadu`

**Interfaces:**

- Produces: fixed pages, variable collections, owner-visible URL, and locked reference page.

- [ ] **Step 1: Require real Figma access**

Create the file using Figma Design or a Figma-capable connector. If the executor lacks Figma access, stop here and ask the owner to open/create the file. Do not substitute HTML, SVG, Canva, Framer, or another tool.

- [ ] **Step 2: Create pages in this exact order**

```text
00_README
01_FOUNDATIONS
02_COMPONENTS
03_BASELINE_17
04_JUDGE_FLOW
90_HTML_REFERENCES
99_EXCEPTIONS
20_V2_WORKBENCH
```

- [ ] **Step 3: Lock V2 before any visual work**

On `20_V2_WORKBENCH`, add a single locked frame containing:

```text
LOCKED — opens only after FIGMA BASELINE PASS
```

Do not add alternatives, moodboards, or redesign notes to this page.

- [ ] **Step 4: Build the README page**

Add four blocks:

```text
SOURCE: application/prototypes/src/*.html
BASELINE RULE: transfer without redesign
FRAME: 375 × 800
GATE: 17 approved screens + hash ledger + judge lens
```

Add the four predefined exception IDs and their definitions from `review-ledger.json`.

- [ ] **Step 5: Import reference captures**

Place all 17 files from `captures/html/` on `90_HTML_REFERENCES` in ID order.

Each image name must equal its filename without `.png`.

Set every reference image to 375 × 800. Lock the page after placement.

- [ ] **Step 6: Store the actual Figma URL**

Patch `review-ledger.json` so `figmaFileUrl` contains the actual file URL. Do not store an access token.

- [ ] **Step 7: Create variable collections**

Create these empty collections now; values land in Task 5:

```text
AHD/Primitive
AHD/Semantic
AHD/Layout
AHD/Typography
AHD/Motion
```

- [ ] **Step 8: Commit the URL only**

```text
git add application/design/figma-baseline/review-ledger.json
git commit -m "chore(design): register locked Ahd Figma baseline file"
```

---

### Task 5: Transfer foundations without visual decisions

**Reasoning level:** Medium.

**Files:**

- Read: `application/design/tokens.json`
- Read: `application/prototypes/src/head.html`
- External: Figma pages `01_FOUNDATIONS` and variable collections

**Interfaces:**

- Produces: exact variables and styles consumed by every component.

- [ ] **Step 1: Create primitive color variables**

For every entry under `tokens.json.color`, create one variable named:

```text
primitive/color/<token-key>
```

Copy the value exactly. Preserve alpha values in `rgba` tokens.

- [ ] **Step 2: Create semantic aliases**

Create these aliases, not duplicated raw values:

```text
semantic/background/ground       = primitive/color/ground
semantic/background/card         = primitive/color/card
semantic/text/primary            = primitive/color/ink
semantic/text/secondary          = primitive/color/ink2
semantic/text/tertiary           = primitive/color/ink3
semantic/action/primary          = primitive/color/accent
semantic/action/primary-soft     = primitive/color/accentSoft
semantic/state/kept              = primitive/color/ok
semantic/state/kept-soft         = primitive/color/okSoft
semantic/state/late              = primitive/color/late
semantic/state/late-soft         = primitive/color/lateSoft
semantic/state/stop              = primitive/color/stop
semantic/state/stop-soft         = primitive/color/stopSoft
semantic/seal/background         = primitive/color/sealBg
semantic/seal/text               = primitive/color/sealInk
semantic/seal/hash               = primitive/color/sealHash
```

- [ ] **Step 3: Create layout variables**

Create numeric variables from `tokens.json`:

```text
layout/space/04
layout/space/08
layout/space/16
layout/space/24
layout/space/32
layout/space/48
layout/radius/card
layout/radius/sheet
layout/radius/pill
layout/touch/min-target
layout/touch/hit-slop
layout/frame/width   = 375
layout/frame/height  = 800
```

- [ ] **Step 4: Create typography styles**

Baseline styles use the actual HTML render priority:

```text
Baseline/LargeTitle
Baseline/CeremonyTitle
Baseline/Row
Baseline/Secondary
Baseline/Label
Baseline/Mono
```

Use `Segoe UI` for Arabic baseline frames when available, matching the current HTML font stack. Record `FONT-01` on all frames later ported with IBM Plex.

Never apply tracking to Arabic styles. Tracking is allowed only on pure Latin/digit styles such as serials and hashes.

- [ ] **Step 5: Create the foundations specimen**

On `01_FOUNDATIONS`, display:

- every primitive color;
- every semantic color alias;
- spacing/radius specimens;
- all typography styles using real Arabic source strings;
- correct and forbidden status examples;
- the Sadu band at 375 px width.

- [ ] **Step 6: Inspect against source values**

Use Figma inspect fields and `tokens.json` side by side. No AI visual review is needed. Verify raw values only.

Acceptance: zero unaliased colors in later components except documented SVG/detail colors already present in source.

---

### Task 6: Build the baseline component library

**Reasoning level:** Medium execution. Escalate to high only if the specified taxonomy cannot reproduce a source state without detaching instances.

**Files:**

- Read: `application/prototypes/src/head.html`
- External: Figma page `02_COMPONENTS`

**Interfaces:**

- Produces: component prefix `AHD/Baseline/v1/` used by Tasks 7–9.

- [ ] **Step 1: Create component taxonomy before drawing screens**

Create these components and no additional component without recording why:

```text
AHD/Baseline/v1/PhoneShell
AHD/Baseline/v1/StatusBar
AHD/Baseline/v1/HomeIndicator
AHD/Baseline/v1/SaduBand
AHD/Baseline/v1/NavLarge
AHD/Baseline/v1/SectionHeader
AHD/Baseline/v1/InsetGroup
AHD/Baseline/v1/Cell
AHD/Baseline/v1/Chip
AHD/Baseline/v1/Button
AHD/Baseline/v1/Callout
AHD/Baseline/v1/SealDocument
AHD/Baseline/v1/StepRail
AHD/Baseline/v1/ProgressBar
AHD/Baseline/v1/AmountBlock
AHD/Baseline/v1/TabControl
AHD/Baseline/v1/BottomSheet
AHD/Baseline/v1/TimelineItem
AHD/Baseline/v1/EmptyState
```

- [ ] **Step 2: Define variants explicitly**

Use these properties:

```text
Chip: tone = neutral | kept | covenant | late | stop
Button: emphasis = primary | tinted | plain; state = enabled | disabled
Callout: tone = neutral | kept | covenant | late | stop
Cell: accessory = none | chip | amount | chevron | toggle
StepRail: state = draft | scan | sealed
ProgressBar: kind = repayment | circle | gauge
TabControl: selection = first | second
BottomSheet: state = closed | open
```

- [ ] **Step 3: Build with Auto Layout**

Use Auto Layout for all content groups.

Use fixed width only where the source is fixed: 375 px screen, 44 px minimum touch targets, fixed seal/SVG art.

Use `Hug contents` for labels and chips. Use `Fill container` for cards, rows, and primary actions.

Use right-to-left visual ordering. Do not simulate RTL by reversing Arabic strings.

- [ ] **Step 4: Reproduce source states**

Create one specimen for every visible state present across the 17 source partials.

Do not create hover-only web states as product states. Baseline may show them on the specimen page only if the HTML source defines them.

- [ ] **Step 5: Validate shared geometry**

Overlay each component specimen against one representative HTML crop.

Acceptance:

- strokes differ by no more than 1 px;
- padding/position differ by no more than 2 px;
- raw colors match variables;
- no detached baseline instances are needed in Tasks 7–9.

- [ ] **Step 6: Lock the component page**

Lock finished specimen groups. Leave only component masters editable.

No repository commit occurs until the first batch export in Task 7.

---

### Task 7: Transfer baseline screens B01–B06

**Reasoning level:** Medium.

**Files:**

- Read: `application/prototypes/src/s01-home.html` through `s06-proof.html`
- Create exports: `application/design/figma-baseline/captures/figma/B01-home.png` through `B06-proof.png`
- Modify: `application/design/figma-baseline/review-ledger.json`
- External: Figma page `03_BASELINE_17`

**Interfaces:**

- Consumes: approved foundations/components.
- Produces: six assembled frames and six review rows.

- [ ] **Step 1: Create frames in exact order**

```text
B01/Home — الرئيسيّة
B02/Create — أنشئ عهدًا
B03/Settle — المقاصّة
B04/Daftari — دفتري
B05/Borrower — ما عليّ
B06/Proof — حافظة الإثبات
```

Each frame is 375 × 800 and an instance of `PhoneShell`.

- [ ] **Step 2: Add locked reference layers**

Behind each screen content, place its matching HTML capture at x=0, y=0, width=375, height=800.

Name the layer `REF/<screen-id>`.

Set opacity to 0 during normal editing. Use 50% or Difference blend only during comparison. Lock it permanently.

- [ ] **Step 3: Assemble only from approved components**

Copy Arabic text verbatim from the source partial.

Preserve visible phone chrome, Sadu pattern, hierarchy, grouping, states, and action emphasis.

No wording or spacing improvement is allowed.

- [ ] **Step 4: Run per-screen overlay review**

For each screen verify:

- outer frame exact;
- major blocks align within 2 px;
- strokes align within 1 px;
- copy and digit forms match;
- correct status colors;
- no score/percentage trust signal;
- no unjustified detached instance.

Add only applicable predefined exception IDs. New exception IDs require high-reasoning review.

- [ ] **Step 5: Export at 1×**

Export each full baseline frame as PNG with the exact filenames already declared by the ledger.

Copy exports into `captures/figma/`.

- [ ] **Step 6: Approve ledger rows**

Change B01–B06 `status` from `pending` to `approved` only after overlay review and export.

Do not alter the frozen `sourceSha256` values.

- [ ] **Step 7: Verify cache integrity**

```text
node application/design/figma-baseline/check-baseline.cjs
```

Expected: structural pass. Final `--gate` still fails for B07–B17.

- [ ] **Step 8: Commit batch evidence**

```text
git add application/design/figma-baseline/captures/figma application/design/figma-baseline/review-ledger.json
git commit -m "feat(design): Figma baseline batch 1 approved B01-B06"
```

---

### Task 8: Transfer baseline screens B07–B12

**Reasoning level:** Medium.

**Files:**

- Read: `application/prototypes/src/s07-impact.html` through `s12-circle-adv.html`
- Create exports: `captures/figma/B07-impact.png` through `B12-circle-adv.png`
- Modify: `review-ledger.json`
- External: Figma page `03_BASELINE_17`

**Interfaces:** same contract as Task 7.

- [ ] **Step 1: Create frames in exact order**

```text
B07/Impact — أثر عهد
B08/Request — اطلب عهدًا
B09/Open — قرضٌ مفتوح
B10/Timeline — سِجلّ الشهادة
B11/Circle — الدائرة
B12/CircleAdv — الدائرة+
```

- [ ] **Step 2: Add and lock matching reference layers**

Use files B07–B12 from `captures/html/` at exact 375 × 800 coordinates.

- [ ] **Step 3: Assemble from the existing component library**

Copy source text verbatim.

If a missing component is discovered, return to Task 6, add it once, list dependent screens, and invalidate only those screens. Do not detach instances to bypass the library.

- [ ] **Step 4: Verify sensitive states**

Mandatory checks:

- Impact contains only aggregate/anonymous visual language.
- Request remains a dignified request, not bank lending.
- Open loan has no deadline pressure or penalty language.
- Timeline uses amber for lateness and neutral dispute styling.
- Circle reminder names no late individual.
- Circle+ keeps the Shariah-review seam visible and does not imply bank-held pooled money.

- [ ] **Step 5: Overlay, export, and approve B07–B12**

Apply Task 7 tolerances and exact filenames.

- [ ] **Step 6: Run structural checker and partial final gate**

```text
node application/design/figma-baseline/check-baseline.cjs
node application/design/figma-baseline/check-baseline.cjs --gate
```

Expected: structural pass; final gate fails only for B13–B17.

- [ ] **Step 7: Commit batch evidence**

```text
git add application/design/figma-baseline/captures/figma application/design/figma-baseline/review-ledger.json
git commit -m "feat(design): Figma baseline batch 2 approved B07-B12"
```

---

### Task 9: Transfer baseline screens B13–B17

**Reasoning level:** Medium.

**Files:**

- Read: `application/prototypes/src/s13-standing.html` through `s17-settings.html`
- Create exports: `captures/figma/B13-standing.png` through `B17-settings.png`
- Modify: `review-ledger.json`
- External: Figma page `03_BASELINE_17`

**Interfaces:** same contract as Task 7.

- [ ] **Step 1: Create frames in exact order**

```text
B13/Standing — سُلفة بالمعروف
B14/Covenant — سِجلّ المعروف
B15/Dispute — محلّ خلاف
B16/Bounds — الضمانات والحدود
B17/Settings — الإعدادات
```

- [ ] **Step 2: Add and lock matching reference layers**

Use files B13–B17 from `captures/html/` at exact 375 × 800 coordinates.

- [ ] **Step 3: Assemble from approved components**

Copy text verbatim. Preserve disclosures, accordions, audit labels, neutral dispute framing, settings digit controls, and visible boundaries.

- [ ] **Step 4: Verify spine-sensitive screens**

Mandatory checks:

- Standing qard never implies interest or a bank loan.
- Covenant remains a neutral chronological record, never a score.
- Dispute states that the bank witnesses and does not judge.
- Bounds preserves all bank limitations and test-backed language.
- Settings preserves the “what Ahd does / does not do” posture.

- [ ] **Step 5: Overlay, export, and approve B13–B17**

Apply Task 7 tolerances and exact filenames.

- [ ] **Step 6: Run final automated gate**

```text
node application/design/figma-baseline/check-baseline.cjs --gate
```

Expected:

```text
FIGMA BASELINE PASS
```

- [ ] **Step 7: Commit batch evidence**

```text
git add application/design/figma-baseline/captures/figma application/design/figma-baseline/review-ledger.json
git commit -m "feat(design): Figma baseline batch 3 approved B13-B17"
```

---

### Task 10: Build the judge flow and run the human baseline gate

**Reasoning level:** High.

**Files:**

- Create: `application/design/figma-baseline/reports/baseline-gate.md`
- External: Figma page `04_JUDGE_FLOW`
- External: Figma page `99_EXCEPTIONS`

**Interfaces:**

- Consumes: approved B01–B17 frames.
- Produces: a clickable critical flow without changing baseline frames.

- [ ] **Step 1: Duplicate instances, never masters**

On `04_JUDGE_FLOW`, create instances or linked copies of these approved states:

```text
J01 Home
J02 Create — clean terms
J03 Create — riba stop
J04 Create — sealed success
J05 Proof — intact
J06 Proof — tampered
J07 Settlement — nine obligations
J08 Settlement — two transfers
```

All screen content must come from approved components and baseline states. Do not edit the baseline page to make the flow easier.

- [ ] **Step 2: Link interactions**

Use simple tap transitions with existing motion values.

Flow:

```text
J01 -> J02 -> J03 -> J02 -> J04 -> J05 -> J06 -> J05 -> J07 -> J08
```

No new copy. No fake loading. No unbounded animation loop.

- [ ] **Step 3: Populate the exception page**

For every exception used in `review-ledger.json`, add one card containing:

- exception ID;
- affected screen IDs;
- source behavior;
- Figma behavior;
- measured delta;
- reason accepted;
- approver/date;
- Expo consequence.

If an exception card is absent, remove the exception from the ledger or fail the gate.

- [ ] **Step 4: Write the gate report**

Create `reports/baseline-gate.md` with real results using this structure:

```markdown
# Ahd Figma Baseline Gate

- Baseline ID: `sadu-baseline-v1`
- Figma file: actual URL from `review-ledger.json`
- Source screens: 17
- Approved screens: 17
- Frame: 375 × 800
- Structural checker: PASS
- Overlay review: PASS
- Copy/spine review: PASS
- Exceptions used: list exact IDs, or `none`
- Judge flow: J01–J08 linked
- Reviewer: actual reviewer name/model
- Reviewed at: actual ISO date

## Decision

Baseline approved. `03_BASELINE_17` is locked. Expo handoff may begin. V2 remains locked until the first Expo judge flow passes on a real device.
```

Do not write the report before the review. Replace every instruction phrase above with actual values.

- [ ] **Step 5: Lock baseline pages**

Lock `01_FOUNDATIONS`, `02_COMPONENTS`, `03_BASELINE_17`, `04_JUDGE_FLOW`, `90_HTML_REFERENCES`, and `99_EXCEPTIONS`.

Leave only `00_README` editable for metadata.

- [ ] **Step 6: Run all relevant checks**

```text
node application/design/figma-baseline/check-baseline.cjs --gate
node application/design/check-tokens.cjs
node application/design/contrast-check.cjs
cd tests
node run-all.cjs
```

Expected: all commands exit 0.

- [ ] **Step 7: Commit the gate report**

```text
git add application/design/figma-baseline/reports/baseline-gate.md
git commit -m "docs(design): approve and lock Ahd Figma baseline v1"
```

---

### Task 11: Update Expo handoff, judge lens, and project memory

**Reasoning level:** High for handoff and judge score; low-cost worker for file synchronization after decisions.

**Files:**

- Modify: `docs/superpowers/plans/2026-07-10-mobile-app-skeleton.md`
- Modify: `_meta/STATUS.md`
- Modify: `_meta/overnight-log.md`
- Modify if needed: `_meta/OPEN-ITEMS.md`
- Modify: `AmadHackathon/00 Home.md`
- Modify: `AmadHackathon/01 الخطة الرئيسة.md`
- Create: `AmadHackathon/09 نقل التصميم إلى Figma.md`

**Interfaces:**

- Consumes: approved Figma URL and gate report.
- Produces: zero-ambiguity handoff for the next, cheaper executor.

- [ ] **Step 1: Patch the mobile plan source rule**

In `docs/superpowers/plans/2026-07-10-mobile-app-skeleton.md`, add this binding block immediately after its Global Constraints:

```markdown
## Approved visual source

- Figma baseline: read the actual URL from `application/design/figma-baseline/review-ledger.json`.
- Baseline gate: `application/design/figma-baseline/reports/baseline-gate.md` must say approved.
- Implement the judge flow first: home, create/riba-stop, proof/tamper, settlement.
- Figma controls visual intent. `application/design/RN-MAPPING.md` controls native normalization.
- Never copy simulated phone chrome into Expo.
- Use `FONT-01`, `CHROME-01`, and `EMOJI-01` as explicit native normalization records, not visual bugs.
```

Remove or correct any mobile-plan token names that conflict with current `application/design/tokens.json`. Do not leave the obsolete navy/gold sample values.

- [ ] **Step 2: Run the judge lens**

Score the approved baseline against all five criteria in `docs/JUDGE-LENS.md` with evidence.

If any relevant score is below 8, append a new `JL-` item to `_meta/OPEN-ITEMS.md`. Do not improve the baseline during this task.

- [ ] **Step 3: Update canonical project state**

Add dated entries to `_meta/STATUS.md` and `_meta/overnight-log.md` naming:

- Figma file;
- 17-screen approval;
- checker command;
- exception IDs;
- judge-lens result;
- Expo next action.

- [ ] **Step 4: Update the Obsidian cockpit**

Create `AmadHackathon/09 نقل التصميم إلى Figma.md` as a summary with source pointers only.

Update `00 Home.md` with one current-status line.

Add one completed baseline checkbox and one pending Expo checkbox to `01 الخطة الرئيسة.md`.

- [ ] **Step 5: Final verification**

```text
node application/design/figma-baseline/check-baseline.cjs --gate
cd tests
node run-all.cjs
git diff --check
git status --short
```

Expected: checks pass. `git status` shows only intended plan/state files plus unrelated pre-existing user changes.

- [ ] **Step 6: Commit only owned close-out files**

```text
git add docs/superpowers/plans/2026-07-10-mobile-app-skeleton.md _meta/STATUS.md _meta/overnight-log.md _meta/OPEN-ITEMS.md AmadHackathon
git commit -m "docs(design): hand approved Figma baseline to Expo and sync project memory"
```

Do not stage `_meta/OPEN-ITEMS.md` when it was not changed.

---

## Execution order and stop conditions

Tasks are sequential:

```text
1 contract
2 capture tooling
3 source freeze
4 Figma file
5 foundations
6 components
7 batch B01-B06
8 batch B07-B12
9 batch B13-B17
10 judge flow and gate
11 Expo handoff and memory
```

Stop immediately when:

- Figma access is unavailable at Task 4;
- a source partial changes after Task 3;
- a component fix would change already-approved screens without invalidation;
- Arabic copy differs and the source does not resolve it;
- a new exception requires a product or Shariah decision;
- the final checker is red;
- the project gate or demo tripwire fails.

## Token-saving review protocol

1. Structural scripts run first.
2. Approved screens with unchanged hashes are skipped.
3. Shared-component changes invalidate only declared dependent screens.
4. Overlay review occurs once per screen per source hash.
5. Full high-reasoning review occurs only at Tasks 1, 4, 6 taxonomy, 10, and 11.
6. Never send all 17 screens back through a vision model after approval.
7. Never compare HTML, Figma, and Expo simultaneously. Compare HTML to Figma first; later compare Figma to Expo.

## Self-review

- Spec coverage: source precedence, 17-screen transfer, Figma architecture, matching, cached review, token routing, judge flow, Expo handoff, V2 lock, and project memory all map to explicit tasks.
- Unresolved-marker scan: no deferred marker, “similar to”, or unnamed error-handling step remains. Dynamic Figma URL, hashes, reviewer, date, and scores are produced by exact prior commands/reviews and must be written as actual values.
- Interface consistency: manifest IDs, capture filenames, ledger IDs, Figma frame names, and batch ranges match across every task.
- Scope: baseline transfer is the executable plan. Expo remains governed by its existing dedicated plan, unlocked and corrected only after baseline approval. V2 remains deliberately locked.
