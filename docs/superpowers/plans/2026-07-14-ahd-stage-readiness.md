# Ahd Stage Readiness Implementation Plan

> **Required execution mode:** Use `executing-plans` task-by-task. This plan owns the competition
> path; do not combine it with product redesign or production integration work.

**Goal:** Produce a timed, truthful, recoverable three-minute presentation whose live commands,
fallback media, claims, and Judge Lens evidence match the current product.

**Architecture:** Treat the stage path as a release artifact. A manifest binds each fallback image to
its source screen and current commit. Static tests catch missing/stale references. A rehearsal log
records time, failures, gate banner, fallback use, and Judge Lens scores. Stage freeze occurs only after
preflight and full gate pass.

**Tech stack:** Node.js built-ins, existing stage preflight/full gate, current offline app, local bank
walkthrough, Markdown/JSON, current PNG fallbacks.

**Source requirements:** FR-045, FR-046, DR-008, DR-009, JR-001–JR-010.

---

## Task 1: Remove Stale Stage-Tool Documentation

**Files:**

- Modify: `tests/stage-preflight.cjs`
- Modify: `docs/PRESENTER-GUIDE.md`
- Modify: `docs/pitch/rehearsal-checklist.md`

### Step 1: Add a failing static assertion

Create a section in a new `tests/app/stage-artifact-drift.test.cjs` that rejects obsolete hard-coded
gate totals in active stage instructions and source comments. It may allow history files such as
`docs/pitch/overnight-representation-log.md` only when a line is explicitly labelled superseded.

Current active paths scanned:

```js
const ACTIVE_STAGE_DOCS = [
  "tests/stage-preflight.cjs",
  "docs/PRESENTER-GUIDE.md",
  "docs/pitch/script-ar.md",
  "docs/pitch/rehearsal-checklist.md",
  "docs/pitch/top6-cards-ar.md",
  "docs/pitch/deck-content-v2.md",
  "docs/pitch/presentation.html"
];
```

The test must not require a specific assertion total. It compares any active claim to the last parsed
`run-all.cjs` banner supplied through a generated stage manifest.

### Step 2: Run red

```powershell
node tests/app/stage-artifact-drift.test.cjs
```

Expected: missing manifest/test support or stale `1687/0` comment in `stage-preflight.cjs`.

### Step 3: Correct wording

- Replace stale totals in tool comments with “live full-gate banner”.
- Keep the active presenter guide's current number only if the live gate is rerun in the same release.
- State that `stage-preflight.cjs` checks presence/tripwire hygiene; `run-all.cjs` remains the product gate.
- Preserve Arabic bidi formatting.

### Step 4: Run preflight self-test

```powershell
cd tests
node stage-preflight.cjs --self-test
node stage-preflight.cjs
cd ..
```

Expected: self-test green and `READY FOR STAGE` when no active presence file blocks it.

### Step 5: Commit

```powershell
git add tests/stage-preflight.cjs tests/app/stage-artifact-drift.test.cjs docs/PRESENTER-GUIDE.md docs/pitch/rehearsal-checklist.md
git commit -m "test(stage): reject stale release instructions"
```

---

## Task 2: Create a Fallback Artifact Manifest

**Files:**

- Create: `docs/pitch/stage-artifact-source.json`
- Create: `docs/pitch/stage-artifact-manifest.json`
- Create: `project/spec-tools/build-stage-manifest.cjs`
- Modify: `tests/app/stage-artifact-drift.test.cjs`

### Step 1: Create the exact source mapping

```json
{
  "schema": "ahd-stage-artifacts-v1",
  "artifacts": [
    {
      "id": "home",
      "screen_key": "home",
      "fallback": "docs/pitch/fallback/01-home.png",
      "source": "app/screenshots/premium-after/01-home.png",
      "lifecycle": "BUILT"
    },
    {
      "id": "riba-block",
      "screen_key": "create",
      "fallback": "docs/pitch/fallback/02-linter-block.png",
      "source": "app/screenshots/premium-after/03-create-blocked.png",
      "lifecycle": "BUILT"
    },
    {
      "id": "proof-valid",
      "screen_key": "proof",
      "fallback": "docs/pitch/fallback/03-proof-verified.png",
      "source": "app/screenshots/premium-after/05-proof-verified.png",
      "lifecycle": "BUILT"
    },
    {
      "id": "proof-tampered",
      "screen_key": "proof",
      "fallback": "docs/pitch/fallback/04-proof-tampered.png",
      "source": "app/screenshots/premium-after/06-proof-tampered.png",
      "lifecycle": "BUILT"
    },
    {
      "id": "settle-9to2",
      "screen_key": "settle",
      "fallback": "docs/pitch/fallback/05-settle-9to2.png",
      "source": "app/screenshots/premium-after/09-settle.png",
      "lifecycle": "BUILT"
    },
    {
      "id": "open-ibra",
      "screen_key": "open",
      "fallback": "docs/pitch/fallback/06-open-ibra.png",
      "source": "app/screenshots/premium-after/08-open-ibra.png",
      "lifecycle": "BUILT"
    }
  ]
}
```

### Step 2: Add failing manifest assertions

Require:

- six unique IDs and existing files;
- every screen key exists in the product registry;
- PNG signature bytes are correct;
- fallback and source SHA-256 values are recorded in generated output;
- current Git commit is recorded;
- lifecycle is present; and
- script/rehearsal fallback references resolve to the manifest.

### Step 3: Implement generator

`build-stage-manifest.cjs` reads the source JSON, validates paths under the repository, computes SHA-256
with Node `crypto`, reads `git rev-parse HEAD`, and writes deterministic JSON sorted by ID.

Generated artifact shape adds:

```json
{
  "generated_from_commit": "40-hex Git commit",
  "fallback_sha256": "64-hex SHA-256",
  "source_sha256": "64-hex SHA-256"
}
```

### Step 4: Generate and test

```powershell
node project/spec-tools/build-stage-manifest.cjs
node tests/app/stage-artifact-drift.test.cjs
```

Expected: green. A difference between source and fallback bytes is allowed because fallbacks may be
cropped/optimized; both hashes must be explicit.

### Step 5: Commit

```powershell
git add docs/pitch/stage-artifact-source.json docs/pitch/stage-artifact-manifest.json project/spec-tools/build-stage-manifest.cjs tests/app/stage-artifact-drift.test.cjs
git commit -m "feat(stage): bind fallback artifacts to product state"
```

---

## Task 3: Rehearse and Record the Primary Path

**Files:**

- Create: `docs/pitch/rehearsal-log.md`
- Modify: `docs/pitch/rehearsal-checklist.md`
- Modify: `docs/pitch/script-ar.md` only if the timed run proves drift

### Step 1: Prepare the exact environment

Terminal A:

```powershell
node app/_serve-app.cjs
```

Terminal B:

```powershell
cd tests
node stage-preflight.cjs
node run-all.cjs
```

Optional Q&A terminal:

```powershell
node server/demo-bank-node.cjs
```

### Step 2: Record rehearsal metadata before starting

The log entry requires:

```text
Date/time and timezone
Operator
Git commit
App URL
Primary script version
Stage manifest hash
Preflight result
Full-gate banner
Device/display/browser
Network state
```

### Step 3: Run the three-minute path without pausing the timer

Required story beats:

1. live tamper detection;
2. one-line identity: the bank witnesses but does not lend;
3. relationship/dignity and grace;
4. consented netting/conservation;
5. evidence/data grade honesty; and
6. explicit production/approval boundary.

Record timestamps for each beat, mis-clicks, load failures, wrong labels, stale claims, and any fallback.

### Step 4: Run the emergency path

Simulate:

- app refresh;
- app unavailable, frozen demo used;
- computer/display failure, six fallbacks used; and
- judge requests the full gate or local server walkthrough.

Record recovery time and whether spoken claims stayed accurate.

### Step 5: Fix only evidenced drift

If the primary path exceeds three minutes, cut lower-priority narration first. Do not add screens. If an
asset is stale, recapture only that artifact and regenerate the manifest. If a label is wrong, fix through
TDD and rerun the full gate.

### Step 6: Commit rehearsal evidence

```powershell
git add docs/pitch/rehearsal-log.md docs/pitch/rehearsal-checklist.md docs/pitch/script-ar.md docs/pitch/stage-artifact-manifest.json docs/pitch/fallback
git commit -m "docs(stage): record timed Ahd rehearsal"
```

Do not stage unchanged media or unrelated pitch work.

---

## Task 4: Run the Judge Lens Panel

**Files:**

- Modify: `docs/pitch/rehearsal-log.md`
- Modify: `_meta/OPEN-ITEMS.md` if any score is below 8

### Step 1: Score six perspectives independently

Collect one review each for:

1. innovation;
2. technical implementation;
3. data analysis;
4. user experience;
5. feasibility; and
6. tired-judge memorability.

Each returns:

```text
Score 1–10
One evidence line
Single weakest moment
One concrete fix
Any spine or claim-integrity concern
```

### Step 2: Run skeptic reconciliation

Check every proposed fix against:

- master spec status;
- evidence grade;
- Ahd spine;
- decision/external gates;
- three-minute budget; and
- regression risk before freeze.

Reject any fix that relies on a false approval, score, loan charge, judgment, AI fatwa, or unverified
data claim.

### Step 3: Record scores

Add the six reviews and the final reconciled score table to the rehearsal entry. Do not average away a
low score; each dimension must reach 8.

### Step 4: Create open items

For every score below 8, add a unique `JL-` row to `_meta/OPEN-ITEMS.md` with owner, evidence, exact fix,
and verification run. A score is not closed by editing the score; it needs a new rehearsal.

### Step 5: Commit

```powershell
git add docs/pitch/rehearsal-log.md _meta/OPEN-ITEMS.md
git commit -m "docs(judge): score frozen Ahd stage path"
```

---

## Task 5: Freeze and Verify the Stage Release

**Files:**

- Modify: `_meta/STATUS.md`
- Modify: `_meta/overnight-log.md`
- Modify: `AmadHackathon/00 Home.md`
- Modify: `AmadHackathon/01 الخطة الرئيسة.md`
- Modify: `AmadHackathon/02 عدسة التحكيم.md`

### Step 1: Run preflight

```powershell
cd tests
node stage-preflight.cjs
cd ..
```

Expected: `READY FOR STAGE`.

### Step 2: Verify manifest and artifacts

```powershell
node project/spec-tools/build-stage-manifest.cjs
git diff --exit-code -- docs/pitch/stage-artifact-manifest.json
node tests/app/stage-artifact-drift.test.cjs
```

Expected: no regenerated drift and focused test green.

### Step 3: Run full gate

```powershell
cd tests
node run-all.cjs
cd ..
```

Expected: zero failures and tripwire unchanged.

### Step 4: Run the exact independent verifier commands

```powershell
node protocol/verify-ahd-seal.cjs protocol/fixtures/main-record.json
node protocol/verify-ahd-seal.cjs protocol/fixtures/new1-record.json
node protocol/verify-ahd-seal.cjs protocol/fixtures/main-record-tampered.json
```

Expected: first two `VALID`/exit 0; tampered `TAMPERED`/exit 1.

### Step 5: Record freeze

Record commit, gate banner, manifest hash, rehearsal duration, fallback readiness, six Judge Lens scores,
and remaining external gates. No hard-coded test number becomes authoritative beyond this run.

### Step 6: Review and commit

```powershell
git status --short
git diff --check
git add _meta/STATUS.md _meta/overnight-log.md "AmadHackathon/00 Home.md" "AmadHackathon/01 الخطة الرئيسة.md" "AmadHackathon/02 عدسة التحكيم.md"
git commit -m "chore(stage): freeze verified Ahd presentation"
```

## Completion Criteria

- Active stage instructions contain no stale claim.
- Six fallbacks exist, are hashed, mapped to current screens, and opened successfully.
- The primary path completes within three minutes.
- Emergency recovery paths are rehearsed.
- Every Judge Lens and memorability score is at least 8, or a `JL-` item remains open.
- Preflight and full gate are green.
- Golden tripwire and independent verifier pass.
- Production and approval gaps remain explicit on stage.
