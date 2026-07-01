# Meta Information Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate Ahd's sprawling status/decision/log files into one source of truth, harden the
multi-agent coordination protocol, and add three tool-enforced checks for meta-layer drift that has
already recurred (stale project-map, presence collisions, duplicate status files).

**Architecture:** Additive-first: an archive move for one fully-closed historical round, new index/
coordination docs, small consistency edits to two live docs, and one new self-contained Node script wired
into the existing test gate as a fourth explicit command. No product code changes.

**Tech Stack:** Plain Node.js (CommonJS, no dependencies — matches `tests/run-tests.cjs` et al.), Markdown.

Full rationale and evidence: `docs/superpowers/specs/2026-07-01-meta-information-architecture-design.md`.

## Global Constraints
- Demo tripwire must stay `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40` — never touch
  `demo/index.html` or any golden function.
- **Do not edit anything under `project/mcp/**`.** As of 2026-07-01T04:26+03:00 a concurrent session
  ("Claude-B") holds an active claim there for an unrelated hardening pass. Before starting this plan,
  re-read `_meta/agent-presence/coordination_notes.md` to confirm current claim status — if released, note
  that in your own coordination entry before touching anything there (only Task 9 reads a file under
  `project/mcp/`; it does not write to it).
- No physical merge of the two historical vault trees under `docs/research/Amad Obsidian Vault/`.
- Do not resolve Shariah-gated decisions (D-1, D-3 in `docs/DECISIONS-FOR-MARWAN.md`).
- The full gate must stay green throughout: from `tests/`, `node run-tests.cjs && node offline-check.cjs
  && node dom-smoke.cjs && node app/run-app-tests.cjs`.
- This repo has multiple concurrent agent sessions. Before editing any shared file (`CLAUDE.md`,
  `coordination_notes.md`, any presence file), re-read it fresh immediately before writing — per the very
  protocol Task 4 documents.
- Follow `_meta/agent-presence/` conventions per Task 4 for this plan's own execution: register a presence
  file, heartbeat, exit cleanly.

---

### Task 1: Archive the closed 11_Build round

**Files:**
- Move: `docs/specs/STATUS.md` → `_meta/archive/11-build-round/STATUS.md`
- Move: `docs/specs/build-log.md` → `_meta/archive/11-build-round/build-log.md`

**Interfaces:**
- Produces: `_meta/archive/11-build-round/{STATUS,build-log}.md`, referenced by `_meta/OPEN-ITEMS.md`
  (Task 2, written after this) and checked by `tests/structure-check.cjs` (Task 9). Do this first — later
  tasks' content assumes this path already exists.

- [ ] **Step 1: Move the files**

```bash
mkdir -p "_meta/archive/11-build-round"
git mv "docs/specs/STATUS.md" "_meta/archive/11-build-round/STATUS.md"
git mv "docs/specs/build-log.md" "_meta/archive/11-build-round/build-log.md"
```

- [ ] **Step 2: Verify the move and that nothing else in docs/specs referenced them by relative path**

Run: `test ! -f "docs/specs/STATUS.md" && test -f "_meta/archive/11-build-round/STATUS.md" && grep -rl "STATUS.md\|build-log.md" docs/specs/ 2>/dev/null; echo "exit=$?"`
Expected: the `test` conditions pass silently; the `grep` finds nothing referencing the old paths from
within `docs/specs/` (exit code 1 = no matches is fine; if it finds a match, read that file and fix the
reference before moving on).

- [ ] **Step 3: Commit**

```bash
git add -A -- "docs/specs" "_meta/archive/11-build-round"
git commit -m "chore: archive the closed 11_Build round (STATUS + build-log)"
```

---

### Task 2: Create `_meta/OPEN-ITEMS.md`

**Files:**
- Create: `_meta/OPEN-ITEMS.md`
- Read (no edits): `_meta/deep-work/ledger/open-threads.md`, `docs/DECISIONS-FOR-MARWAN.md`,
  `_meta/archive/11-build-round/STATUS.md`, `_meta/overnight-log.md`, `docs/evidence/EVIDENCE-BRIEF.md`

**Interfaces:**
- Produces: `_meta/OPEN-ITEMS.md`, linked from `_meta/INDEX.md` (Task 10) and `CLAUDE.md` (Task 11).

- [ ] **Step 1: Write the file**

Write `_meta/OPEN-ITEMS.md` with exactly this content (already cross-checked against
`_meta/archive/11-build-round/STATUS.md`'s B1–B8 closure list, `docs/DECISIONS-FOR-MARWAN.md`'s Standing
Items, and `docs/evidence/EVIDENCE-BRIEF.md` — do not re-derive, this synthesis is already done):

```markdown
# _meta/OPEN-ITEMS.md — everything still unresolved (consolidated 2026-07-01)

> Supersedes `_meta/deep-work/ledger/open-threads.md` as the live open-items list. That file's OT-IDs are
> the stable references used here; see it for the original P0–P2 prioritization rationale. This file
> merges it with `docs/DECISIONS-FOR-MARWAN.md`'s "Standing items" and marks resolved items done rather
> than deleting them, so IDs stay traceable.

## Genuinely still open

| ID | Item | Type | Notes |
|---|---|---|---|
| **OT-A1** | One real Saudi demand voice (relational-strain shard) — interviews/survey | Non-code, field | Team item, pre-pitch |
| **OT-A2** | "Why Alinma, not Al Rajhi" moat strategy | Strategy | Rebuttal exists; moat is a strategy to build, not yet realized |
| **OT-VAL** | Pre-production validations: Nafath-AES permission, Alinma Shariah-board fee sign-off, accredited CSP/TSA | Counsel-only | Never assert these on stage until confirmed |
| **OT-CITE** | Counsel-confirm exact Evidence-Law article numbers + M/8-vs-M/18 + refresh 2024-25 court figures | Counsel-only | |
| **OT-PATCH** | Apply the JCS-depth SEAL patch (`_meta/deep-work/backend/prototype-compute-patch.md`) + re-pin golden vectors | Post-demo, mechanical | Not yet applied - tripwire is still the pre-patch hash |
| **OT-SEAL5** | Complete the SEAL to a full 5-property chain (multi-block + TSA + bank-sig + Merkle) | v2 | ~3/5 properties today |
| **OT-DEPTH** | v2 mechanisms - **partially addressed**: dispute-export (P12) roughly built via F2 proof-pack screen; recurring-covenant (P13) roughly built via Circle-adv recurring auto-post. **Still unbuilt:** duress/coercion flag (P11), AML/collusion signal (P14), on-screen attestation-boundary panel (P15) | v2 | |
| **OT-P1other** | Borrower-side asks - **partially addressed**: grace ("يُسر") real state logic done. **Still open:** borrower-invokable إبراء (shipped as lender-owned only, not borrower-invokable) + a standalone borrower-protections panel | Product | |
| **OT-IDSTATE** | Reconcile the `ahd_id` type (ULID/UUIDv7/base32/string) and declare one binding state-name enum | Needs verification | Status unclear - the app's event-sourced fold() now uses one consistent state vocabulary in practice; hasn't been checked whether `ahd_id` generation was ever reconciled against the original ULID/UUIDv7 question |
| **OT-13** | A second, divergent handoff series reportedly exists outside this repo at a separate local path | Unverifiable from here | Outside this repo/working directory - needs the operator to confirm whether that path still exists |
| **OT-14** | Possible duplicate Agent-1 legal layer files inside the research vault | Unverified, low priority | Vault content - out of scope per this consolidation's non-goals (no physical vault merge); confirm the duplicate still exists before acting |
| **OT-LINKS** | A dangling wikilink, a dead source citation, and a stale dossier demo-hook, all inside the research vault (`contracts.md`, the growth layer, dossier section 6) | Unverified, low priority | Vault content - out of scope per this consolidation's non-goals (no physical vault merge); confirm still relevant before acting |

## Resolved (kept for traceability - do not re-open without new evidence)
- **OT-SOUL, OT-FSM, OT-CONSENT, OT-PCT, OT-RIBA, OT-STEP0, OT-X1, OT-X2, OT-X3** - closed 2026-06-19,
  see `_meta/archive/11-build-round/STATUS.md` (items B1-B8). OT-RIBA further deepened (not just closed) by
  `app/features/riba-lint.js` (0/60 adversarial-corpus misses in its own test corpus).
- **OT-RIBA-NOW** - resolved as permanent architecture, not a temporary demo-day call: the golden
  `ribaScan`'s negation false-positive is a permanent property of the frozen `demo/index.html` (golden
  functions are never modified - see `CLAUDE.md`); the real fix lives only in `app/`'s additive layer.
- **OT-M9** - closed: smartphone-penetration figure corrected 97%->99% during the evidence-brief pass
  (`docs/evidence/EVIDENCE-BRIEF.md`).
- **OT-01** (round split across two `10_Deep` trees) - addressed by this very consolidation effort
  (`docs/superpowers/specs/2026-07-01-meta-information-architecture-design.md`); `_meta/deep-work/ledger/
  00_LEDGER.md` remains the canonical cross-reference for that historical split.
- **OT-04** (two SEAL schemes coexist) - not a bug, by design; tracked via OT-PATCH above.
- **OT-12** (round-08 provenance mixed) - accepted resolution: `00_LEDGER.md` + the verification-ledger
  are canonical for that history; nothing further to do.
- **OT-15** (dossier overstated "built" features) - substance resolved: the features it referenced (state
  machine, consented Muqassa, computed trust) are now actually built and tested. Whether the dossier's own
  wording was ever updated to match hasn't been separately verified - low stakes since the underlying gap
  is closed either way.

## Links
`_meta/deep-work/ledger/open-threads.md` (original, full source rationale) · `docs/DECISIONS-FOR-MARWAN.md`
(decisions needing sign-off, distinct from open work items) · `_meta/deep-work/ledger/00_LEDGER.md`
```

- [ ] **Step 2: Verify every OT-ID mentioned appears in the source file**

Run: `grep -o "OT-[A-Za-z0-9]*" "_meta/OPEN-ITEMS.md" | sort -u` and `grep -o "OT-[A-Za-z0-9]*" "_meta/deep-work/ledger/open-threads.md" | sort -u`
Expected: every ID in the second list appears somewhere in the first list's output (none silently dropped).

- [ ] **Step 3: Commit**

```bash
git add _meta/OPEN-ITEMS.md
git commit -m "docs: consolidate open-threads + standing decisions into one live OPEN-ITEMS list"
```

---

### Task 3: Create `docs/research/README.md`

**Files:**
- Create: `docs/research/README.md`

**Interfaces:**
- Produces: `docs/research/README.md`, linked from `_meta/INDEX.md` (Task 10).

- [ ] **Step 1: Write the file**

```markdown
# docs/research/ — historical research (read-only)

Everything under this folder is historical: pre-Ahd hackathon ideation (the concept-selection process that
produced Ahd among other candidates) and the "Operation Ahd Deep" parallel-agent research round. None of
it is live project documentation.

**If anything here conflicts with `docs/` or `_meta/` at the repo root, the root wins.** Root docs are kept
current every session; this folder is not.

## What's in here
- `Amad Obsidian Vault/` — an Obsidian vault used during concept selection and the "Ahd Deep" research
  round. Its own `99_RETIRED/RETIREMENT-NOTICE.md` explains one retired subset; that same "historical, not
  live" status applies to the whole vault, not just that folder.
  - The vault's content is genuinely split across two nesting levels (agents 1/3 at the vault root, agents
    2/4 nested under `AMAD-2026/`) for historical reasons documented in
    `_meta/deep-work/ledger/open-threads.md` (OT-01, OT-12). This has not been physically merged — see
    `_meta/deep-work/ledger/00_LEDGER.md` for the canonical cross-reference between the two trees.
  - `AMAD-2026/.agent-presence/` here is a **dead, superseded** copy of the agent coordination system —
    the live one is `_meta/agent-presence/` at the repo root.
- `AMAD_2026_Agent_Prompt.md`, `AMAD_HACKATHON_2026_FULL_DOSSIER.md` — the original hackathon brief/dossier.
- `Arabic settlement design decisions/`, `_raw/`, `تسجيل-عهد-ماذا-أكتب.md` — early design/raw material.

## What's NOT in here
Live specs live in `docs/specs/`. Live architecture/decisions/status live in `docs/` and `_meta/` directly
— see `_meta/INDEX.md`.
```

- [ ] **Step 2: Verify it renders and paths it names exist**

Run: `test -d "docs/research/Amad Obsidian Vault" && test -f "docs/research/AMAD_2026_Agent_Prompt.md" && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add docs/research/README.md
git commit -m "docs: mark docs/research as historical, add root-wins-on-conflict rule"
```

---

### Task 4: Create `_meta/agent-presence/README.md`

**Files:**
- Create: `_meta/agent-presence/README.md`

**Interfaces:**
- Produces: `_meta/agent-presence/README.md`, linked from `_meta/INDEX.md` (Task 10) and `CLAUDE.md`
  (Task 11).

- [ ] **Step 1: Write the file**

```markdown
# _meta/agent-presence/ — multi-agent coordination protocol

Lightweight presence registry so concurrent Claude sessions on this project don't duplicate work or clobber
each other's files. Plain JSON files, no server, no hard locks — soft claims + a shared notes log.

## Layout
- `<AgentName>.json` — one per active/recently-active agent. Schema: `agent_id`, `session_start`,
  `last_heartbeat`, `current_task`, `files_claimed[]`, `tasks_claimed[]`, `status`
  (`starting`|`active`|`exited`), `model`, `notes`.
- `claims/` — per-file/per-task claim records.
- `coordination_notes.md` — a shared, human-and-agent-readable log of handoffs, collisions, and claims.
  **Newest entries at the top.**

## Session-start protocol
1. Read every `*.json` here. Anything with `status:"active"` and `last_heartbeat` within the last 45
   minutes is a live agent — do not duplicate its `current_task` or edit its `files_claimed`.
2. **Immediately before writing your own presence file, re-read it first.** If it changed since you last
   read it, a different session has raced you to the same identity in the last few minutes — this has
   happened in practice on this project. Treat that as an active collision (register under a suffixed name
   like `Claude-D-2`), not as a stale ghost, regardless of what a timestamp alone would suggest.
3. Anything with `last_heartbeat` >45 minutes old and `status:"active"` is a disconnected ghost — safe to
   note as stale and register over, but say so in `coordination_notes.md`.
4. Before editing any file another active agent has in `files_claimed`, coordinate in
   `coordination_notes.md` first — don't silently edit around an active claim.
5. On exit: remove your claims, set your presence `status` to `"exited"` (or delete the file), and append
   an exit note to `coordination_notes.md` (what you did, what's next, what's still open).

## Keeping `coordination_notes.md` readable
This file is meant to be read in full at the start of every session. Once it passes roughly 50 entries,
move the oldest half into `_meta/archive/coordination-notes-history/` (new timestamped file), keeping the
live file short. Don't delete history — archive it.
```

- [ ] **Step 2: Verify**

Run: `test -f "_meta/agent-presence/README.md" && wc -l "_meta/agent-presence/coordination_notes.md"`
Expected: file exists; note the current line count (used later if the archive-threshold rule ever triggers
— not actioned by this plan, `coordination_notes.md` is well under 50 entries today).

- [ ] **Step 3: Commit**

```bash
git add _meta/agent-presence/README.md
git commit -m "docs: write down the agent-presence protocol, incl. the read-before-write race rule"
```

---

### Task 5: Add a superseded banner to `_meta/deep-work/ledger/open-threads.md`

**Files:**
- Modify: `_meta/deep-work/ledger/open-threads.md`

- [ ] **Step 1: Add the banner**

Read the current file first (it may have shifted slightly from prior edits — re-verify the anchor text
below still matches before editing). Immediately after the line `# 🧵 OPEN-THREADS TRACKER — so nothing
falls through the cracks`, insert:

```markdown

> **Superseded by `_meta/OPEN-ITEMS.md` as of 2026-07-01** for current open/resolved status. This file is
> kept for the original P0/P1/P2/STRUCT prioritization rationale and source citations — do not treat its
> items as still-open without checking `_meta/OPEN-ITEMS.md` first.
```

- [ ] **Step 2: Verify**

Run: `grep -A2 "OPEN-THREADS TRACKER" "_meta/deep-work/ledger/open-threads.md" | head -5`
Expected: shows the new banner immediately following the H1.

- [ ] **Step 3: Commit**

```bash
git add "_meta/deep-work/ledger/open-threads.md"
git commit -m "docs: banner open-threads.md as superseded by _meta/OPEN-ITEMS.md"
```

---

### Task 6: Add today's entry to `_meta/STATUS.md`

**Files:**
- Modify: `_meta/STATUS.md`

- [ ] **Step 1: Append a new entry**

This file's convention is oldest-first, each entry appended at the bottom, separated by `---`. Read the
current end of the file first to confirm the last entry + separator, then append:

```markdown

---

DONE · 2026-07-01 · Claude-D-2 (meta information architecture) · **Consolidated docs/decisions +
hardened agent coordination + added structure-enforcement checks** · `_meta/`, `docs/`
Full rationale: `docs/superpowers/specs/2026-07-01-meta-information-architecture-design.md`. Consolidated
7+ scattered status/decision files into `_meta/INDEX.md` (entry point) + `_meta/OPEN-ITEMS.md` (live open
items, cross-checked against the archived `_meta/archive/11-build-round/STATUS.md`'s B1-B8 closures — 9 of
open-threads.md's items were already resolved without it ever being updated to say so). Archived the closed
11_Build round to `_meta/archive/11-build-round/`. Marked `docs/research/` historical (root docs win on
conflict). Documented the `_meta/agent-presence/` protocol (`_meta/agent-presence/README.md`), including a
codified read-before-write race rule after observing a live collision this session. Added
`tests/structure-check.cjs` (project-map freshness, agent-presence health, single-status-file lint) as a
fourth explicit gate command. Gate green throughout: core 184/0, app 29/29, demo tripwire unchanged. Did
not touch `project/mcp/**` (concurrent claim held by Claude-B) or any product code.
```

- [ ] **Step 2: Verify**

Run: `tail -20 "_meta/STATUS.md"`
Expected: shows the new entry as the last block in the file.

- [ ] **Step 3: Commit**

```bash
git add "_meta/STATUS.md"
git commit -m "docs: log the meta information-architecture consolidation in _meta/STATUS.md"
```

---

### Task 7: Fix stale "newest" labeling in `_meta/overnight-log.md`

**Files:**
- Modify: `_meta/overnight-log.md`

- [ ] **Step 1: Re-read the file and locate the exact current heading**

Run: `grep -n "TONIGHT — MERGE" "_meta/overnight-log.md"`
Expected: one match, currently reading `## 🌙 TONIGHT — MERGE → SPRINT → REMOTION (newest; supersedes the
summary below)`. Confirm this exact text is still present before editing (a concurrent session may have
touched this file).

- [ ] **Step 2: Replace the heading**

Change:
```
## 🌙 TONIGHT — MERGE → SPRINT → REMOTION (newest; supersedes the summary below)
```
to:
```
## 🌙 2026-06-22 — MERGE → SPRINT → REMOTION (historical — see "DEEPEN SPRINT" above for the latest)
```

Do not touch any other heading or content in this file — this is a one-line labeling fix, not a
restructure. (The file's topmost section, "DEEPEN SPRINT", already correctly is the newest and needs no
change; the section below this one, "READ ME FIRST (previous night's summary — kept for history)", already
correctly self-identifies as historical and also needs no change.)

- [ ] **Step 3: Verify**

Run: `grep -n "^## " "_meta/overnight-log.md" | head -5`
Expected: exactly one heading among the top few uses "newest"-type language (the physically first one,
"DEEPEN SPRINT"); the "MERGE → SPRINT → REMOTION" heading now reads as historical.

- [ ] **Step 4: Commit**

```bash
git add "_meta/overnight-log.md"
git commit -m "docs: fix stale newest-labeling in overnight-log.md (one heading, no restructure)"
```

---

### Task 8: Gitignore the accidentally-committed Obsidian config

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add the entry**

Read the current `.gitignore`, then add this line under the "Heavy / generated / irrelevant" section
(alongside the existing `**/node_modules/` etc. entries):

```
docs/research/**/.obsidian/
```

- [ ] **Step 2: Verify it matches the existing committed folder**

Run: `git check-ignore -v "docs/research/Amad Obsidian Vault/.obsidian/app.json"`
Expected: prints a match against the new `.gitignore` line (confirms the pattern is correct). Note: this
only prevents *future* changes to that folder from being tracked — it does not remove the files already
committed. Removing already-tracked files is a separate, more disruptive step and is intentionally NOT part
of this plan (see the spec's non-goals on not disturbing vault history unnecessarily).

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore the accidentally-committed Obsidian app-config folder"
```

---

### Task 9: Write `tests/structure-check.cjs`

**Files:**
- Create: `tests/structure-check.cjs`
- Read (no edits): `project/mcp/packages/ahd-navigator/src/project-map.json`

**Interfaces:**
- Produces: `checkProjectMapFreshness(root)`, `checkAgentPresenceHealth(root)`,
  `checkSingleStatusFile(root)` — each takes an absolute project-root path, returns a plain result object
  (shapes below), no I/O side effects beyond reading. Exported via `module.exports` for future reuse by an
  `ahd-fs` MCP tool (a later, separate piece of work gated on Claude-B releasing `project/mcp/**` — not
  part of this task).
  - `checkProjectMapFreshness(root)` → `{ missingFromMap: string[], missingOnDisk: string[] }`
  - `checkAgentPresenceHealth(root)` → `{ stale: {file,agent_id,last_heartbeat}[], duplicateClaims: [string, string[]][] }`
  - `checkSingleStatusFile(root)` → `string[]` (offending relative paths)
- Consumes: nothing from earlier tasks except that Task 1 (archive move) must already be done — otherwise
  `docs/specs/STATUS.md` still existing outside the archive will make this check correctly, but
  inconveniently, fail.

- [ ] **Step 1: Write the complete file**

```javascript
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
  const SKIP_DIR_NAMES = new Set(["node_modules", ".git", "dist"]);
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
```

- [ ] **Step 2: Run it and confirm the self-teeth pass, then read sections 1-3 against the real repo**

Run: `cd tests && node structure-check.cjs`
Expected: sections 0a/0b/0c all ✓ (proves the checkers actually detect what they claim to). Sections 1-3
against the real repo should also be all ✓ **provided Task 1 (archive move) already ran** — if section 3
fails listing `docs/specs/STATUS.md`/`docs/specs/build-log.md`, that means Task 1 hasn't happened yet;
do it first, don't weaken this check. If section 2 fails on a presence file, that's either a real stale
ghost (fine — it's doing its job, note it in `coordination_notes.md` per Task 4's protocol) or a currently
active concurrent session (do not "fix" the check to hide this — investigate for real).

Expected final line: `STRUCTURE CHECK: 9 passed, 0 failed`

- [ ] **Step 3: Commit**

```bash
git add tests/structure-check.cjs
git commit -m "test: add structure-check.cjs (project-map freshness, presence health, status-file lint)"
```

---

### Task 10: Create `_meta/INDEX.md`

**Files:**
- Create: `_meta/INDEX.md`

**Interfaces:**
- Consumes: every path in the table below must exist by this point (Tasks 1-9 all done).
- Produces: `_meta/INDEX.md`, linked from `CLAUDE.md` (Task 11).

- [ ] **Step 1: Write the file**

```markdown
# _meta/INDEX.md — Ahd project entry point

One page. Start here, then follow a link.

| Doc | Purpose | Path |
|---|---|---|
| Current state | Gate status, HEAD, what's built, what's in flight | `_meta/STATUS.md` |
| Session history | Append-only log, one entry per overnight/agent session (newest first) | `_meta/overnight-log.md` |
| Open items | Everything still unresolved, prioritized | `_meta/OPEN-ITEMS.md` |
| Decisions needing sign-off | Shariah/product calls no agent should make alone | `docs/DECISIONS-FOR-MARWAN.md` |
| Handoffs | Per-session exit notes, numbered chronologically | `_meta/handoffs/` |
| Agent coordination | Presence, claims, and the collision-handling protocol | `_meta/agent-presence/README.md` |
| Architecture | How the two builds + engine + app fit together | `docs/ARCHITECTURE.md` |
| Historical research | Pre-Ahd hackathon ideation + "Operation Ahd Deep" round — archival, not live | `docs/research/README.md` |
| Archived/superseded | Closed rounds, retired builds | `_meta/archive/` |
| Quality gate | The commands that must stay green | see `CLAUDE.md` § "Hard rules" |

**Rule:** if a doc anywhere conflicts with `_meta/STATUS.md` or `docs/DECISIONS-FOR-MARWAN.md`, those two
win — they're the only two files an agent should update on every session that touches project state.
```

- [ ] **Step 2: Verify every path in the table resolves**

Run:
```bash
for p in "_meta/STATUS.md" "_meta/overnight-log.md" "_meta/OPEN-ITEMS.md" "docs/DECISIONS-FOR-MARWAN.md" "_meta/handoffs" "_meta/agent-presence/README.md" "docs/ARCHITECTURE.md" "docs/research/README.md" "_meta/archive"; do
  test -e "$p" && echo "OK  $p" || echo "MISSING  $p"
done
```
Expected: every line prints `OK` — if anything prints `MISSING`, fix the table entry or the missing file
before committing.

- [ ] **Step 3: Commit**

```bash
git add _meta/INDEX.md
git commit -m "docs: add _meta/INDEX.md as the single project entry point"
```

---

### Task 11: Update `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Re-read the current file fresh**

Other sessions have edited this file recently. Run `git diff HEAD -- CLAUDE.md` and read the current
"Where things are" bullet list and item 4 of "Hard rules for any change here" before editing, since the
exact surrounding lines may have shifted.

- [ ] **Step 2: Add to "Where things are"**

Add these two lines to the bullet list (position: anywhere sensible in the list, e.g. right after the
`docs/research/` bullet):
```markdown
- `_meta/INDEX.md` — start here: one page linking to current status, open items, decisions, handoffs, and agent coordination.
- `_meta/agent-presence/` — multi-agent coordination (presence, claims, collision protocol); see `_meta/agent-presence/README.md`.
```

- [ ] **Step 3: Update the gate command in "Hard rules" item 4**

Find:
```
   cd tests
   node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs   # demo core: 184/0
   node app/run-app-tests.cjs                                           # app: 29 suites
```
Replace with:
```
   cd tests
   node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node structure-check.cjs   # demo core + structure: 184/0 + structure
   node app/run-app-tests.cjs                                           # app: 29 suites
```

- [ ] **Step 4: Verify**

Run: `grep -n "INDEX.md\|agent-presence\|structure-check" CLAUDE.md`
Expected: all three new references appear.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: point CLAUDE.md at _meta/INDEX.md, document agent-presence, add structure-check to the gate"
```

---

### Task 12: Full gate re-run and final verification

**Files:** none (verification only)

- [ ] **Step 1: Run the complete gate**

```bash
cd tests
node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node structure-check.cjs && node app/run-app-tests.cjs
```
Expected: every suite green — core 184/0, structure check 9/0, app 29/29 suites.

- [ ] **Step 2: Confirm the demo tripwire is unchanged**

Run (from repo root): `sha256sum demo/index.html` (or `certutil -hashfile demo/index.html SHA256` on
Windows without a Unix shell)
Expected: `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`

- [ ] **Step 3: Confirm nothing under `project/mcp/` was touched**

Run: `git diff --stat main -- project/mcp/ | tail -5` and `git log --oneline -13 -- project/mcp/`
Expected: no changes from this plan's commits appear under `project/mcp/` (only Claude-B's pre-existing,
unrelated commits/diffs, if any, should show). One sanctioned exception occurred and is documented: `9a3b2b5` fixed 4 stale entries in `project-map.json` after Claude-B's claim released — confirm no OTHER commits touch `project/mcp/`.

- [ ] **Step 4: Exit cleanly per the agent-presence protocol**

Update your own presence file to `status: "exited"`, remove any claims you took, and append an exit note
to `_meta/agent-presence/coordination_notes.md` summarizing what landed and pointing at
`_meta/INDEX.md` as the new starting point for the next session.
