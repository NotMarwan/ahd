# Fix Deferred Gate-Robustness Findings — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, this session)
> to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the two robustness findings in `tests/structure-check.cjs` that the meta-information-architecture
final review logged as "accepted non-blocking, not fixed" — so the project's own health gate can't crash on a
missing presence dir (A1) and can't silently pass an `active` agent whose heartbeat is unparseable (A2).

**Architecture:** `tests/structure-check.cjs` is dev/gate tooling (not product logic). It exposes three pure
checker functions plus an inline self-teeth harness (sections `0a`/`0b`/`0c`) that proves each checker catches
synthetic drift. We follow that exact TDD pattern: add a failing self-teeth assertion for each new behavior,
watch it fail, add the minimal guard, watch it pass — then surface the new signal in the real gate section.

**Tech Stack:** Node.js CommonJS, `fs`/`path`/`os`, no dependencies, no test framework (hand-rolled `ok()`).

## Global Constraints

- **Spine untouched.** No product logic, no `demo/index.html`, no golden functions, no `app/` files, no
  golden vectors. This plan touches ONLY `tests/structure-check.cjs` and (Task 3) one comment in `CLAUDE.md`.
- **`Date.now()` is allowed in this file only** — its header documents that `app-offline.test.cjs` scans
  `app/`, not `tests/`; staleness detection genuinely needs the wall clock. Do not add `Date.now()` anywhere else.
- **Strengthen, never weaken.** Every existing assertion stays; we only ADD checks. The full gate must end
  green: core 184/0, app 29/29, structure-check green (count rises as new checks are added), tripwire
  `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40` unchanged.
- **Match existing idiom.** Use `(x || fallback)` (as the file already does for `files_claimed || []`), the
  `withFixture(build, run)` helper, and the `ok(cond, name, detail)` reporter. No new helpers unless needed.

---

### Task 1: A1 — `checkAgentPresenceHealth` tolerates a missing presence dir

**Files:**
- Modify: `tests/structure-check.cjs` (function `checkAgentPresenceHealth`, ~line 42-44; self-teeth after section `0c`)

**Interfaces:**
- Consumes: existing `checkAgentPresenceHealth(root)`, `withFixture(build, run)`, `ok(cond, name, detail)`.
- Produces: `checkAgentPresenceHealth(root)` now returns `{ stale, malformed, duplicateClaims }` and returns
  the empty shape `{ stale: [], malformed: [], duplicateClaims: [] }` (no throw) when
  `<root>/_meta/agent-presence` does not exist. (The `malformed` field is added in Task 2; in Task 1 the empty
  shape may omit it — Task 2 finalizes the shape. To avoid churn, add `malformed: []` to the guard now.)

- [ ] **Step 1: Write the failing self-teeth.** Insert a new section immediately AFTER section `0c`'s closing
  `}` (before `section("1) Project-map freshness...")`), matching the surrounding style:

```js
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
```

- [ ] **Step 2: Run to verify it fails.**

Run: `cd tests && node structure-check.cjs`
Expected: the `0d` line prints `✗ ... returns an empty result (no throw) ...  — threw instead of returning`
(because `fs.readdirSync` on a non-existent dir throws `ENOENT`), and the run exits non-zero.

- [ ] **Step 3: Add the minimal guard.** In `checkAgentPresenceHealth`, immediately after
  `const dir = path.join(root, "_meta/agent-presence");` and BEFORE the `readdirSync` line, insert:

```js
  if (!fs.existsSync(dir)) return { stale: [], malformed: [], duplicateClaims: [] };
```

(This mirrors the existing guard in `checkProjectMapFreshness`: `if (!fs.existsSync(abs)) continue;`.)

- [ ] **Step 4: Run to verify it passes.**

Run: `cd tests && node structure-check.cjs`
Expected: the `0d` line prints `✓ returns an empty result (no throw) when _meta/agent-presence is absent`.
(The final count/exit is finalized in Task 2; other sections remain green.)

- [ ] **Step 5: Commit.**

```bash
git add tests/structure-check.cjs
git commit -m "test(gate): guard checkAgentPresenceHealth against a missing presence dir (A1)"
```

---

### Task 2: A2 — surface an unparseable `last_heartbeat` as its own finding

**Files:**
- Modify: `tests/structure-check.cjs` (function `checkAgentPresenceHealth` loop, ~line 52-55; new self-teeth
  section `0e`; real gate `section("2) ...")` ~line 174-177)

**Interfaces:**
- Consumes: `checkAgentPresenceHealth` from Task 1 (already returns `malformed: []` in its missing-dir guard).
- Produces: `checkAgentPresenceHealth(root)` returns `{ stale, malformed, duplicateClaims }` where
  `malformed` is an array of `{ file, agent_id, last_heartbeat }` for every `status:"active"` agent whose
  `last_heartbeat` fails `Date.parse` (i.e. `NaN`). Such an agent is NO LONGER silently treated as healthy.

- [ ] **Step 1: Write the failing self-teeth.** Insert a new section AFTER the Task-1 `0d` block:

```js
  section("0e) Self-teeth — checkAgentPresenceHealth surfaces an unparseable last_heartbeat");
  {
    const result = withFixture(
      (dir) => {
        const pdir = path.join(dir, "_meta/agent-presence");
        fs.mkdirSync(pdir, { recursive: true });
        fs.writeFileSync(path.join(pdir, "Broken.json"), JSON.stringify({
          agent_id: "Broken", status: "active", last_heartbeat: "not-a-real-date",
          files_claimed: [], tasks_claimed: [],
        }));
      },
      (dir) => checkAgentPresenceHealth(dir)
    );
    ok(result.malformed.some(m => m.agent_id === "Broken"),
      "flags an active agent whose last_heartbeat cannot be parsed", JSON.stringify(result.malformed));
    ok(result.stale.every(s => s.agent_id !== "Broken"),
      "a malformed heartbeat is reported as malformed, not miscounted as stale", JSON.stringify(result.stale));
  }
```

- [ ] **Step 2: Run to verify it fails.**

Run: `cd tests && node structure-check.cjs`
Expected: the first `0e` assertion fails — with Task 1's guard, `result.malformed` is `[]` on this fixture
(the loop still swallows `NaN`), so `.some(...)` is false → `✗ flags an active agent whose last_heartbeat
cannot be parsed  — []`.

- [ ] **Step 3: Implement the minimal change.** In the loop, declare a `malformed` array next to `stale`
  (add `const malformed = [];` right after `const stale = [];`), then REPLACE the staleness `if` block:

```js
    const hb = Date.parse(data.last_heartbeat);
    if (!Number.isNaN(hb) && (now - hb) > FORTY_FIVE_MIN_MS) {
      stale.push({ file: f, agent_id: data.agent_id, last_heartbeat: data.last_heartbeat });
    }
```

with:

```js
    const hb = Date.parse(data.last_heartbeat);
    if (Number.isNaN(hb)) {
      malformed.push({ file: f, agent_id: data.agent_id, last_heartbeat: data.last_heartbeat || null });
    } else if ((now - hb) > FORTY_FIVE_MIN_MS) {
      stale.push({ file: f, agent_id: data.agent_id, last_heartbeat: data.last_heartbeat });
    }
```

Then change the final `return { stale, duplicateClaims };` to `return { stale, malformed, duplicateClaims };`.

- [ ] **Step 4: Surface it in the real gate.** In `section("2) ...")`, update the header text and add the
  assertion between the `stale` and `duplicateClaims` checks:

```js
  section("2) Agent-presence health — staleness + malformed heartbeats + duplicate claims");
  const presenceResult = checkAgentPresenceHealth(ROOT);
  ok(presenceResult.stale.length === 0, "no 'active' presence file is >45min stale", JSON.stringify(presenceResult.stale));
  ok(presenceResult.malformed.length === 0, "every 'active' presence file has a parseable last_heartbeat", JSON.stringify(presenceResult.malformed));
  ok(presenceResult.duplicateClaims.length === 0, "no two active agents claim the same file/task", JSON.stringify(presenceResult.duplicateClaims));
```

- [ ] **Step 5: Run to verify all green.**

Run: `cd tests && node structure-check.cjs`
Expected: both `0e` assertions pass; `section 2`'s new "parseable last_heartbeat" assertion passes (every
real presence file uses ISO timestamps); final line `STRUCTURE CHECK: 13 passed, 0 failed`, exit 0.

- [ ] **Step 6: Run the FULL gate to confirm nothing regressed.**

Run: `cd tests && node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node structure-check.cjs && node app/run-app-tests.cjs`
Expected: 135/0, 9/0, 40/0, 13/0, `APP SUITES: 29/29 green`. Then tripwire:
`cd .. && sha256sum -c _overnight/backup/demo.sha256` → `demo/index.html: OK`.

- [ ] **Step 7: Commit.**

```bash
git add tests/structure-check.cjs
git commit -m "test(gate): surface unparseable last_heartbeat instead of silently passing it (A2)"
```

---

### Task 3: Doc accuracy — state structure-check's own count in the CLAUDE.md gate comment

**Files:**
- Modify: `CLAUDE.md` (the fenced gate command block under "Hard rules", the `# demo core + structure` comment)

**Interfaces:**
- Consumes: the verified structure-check count from Task 2 Step 5 (13/0). Do this ONLY after that count is real.

- [ ] **Step 1: Update the comment to match the verified count.** Replace the gate-block comment
  `# demo core + structure: 184/0 + structure` so it names structure-check's own pass count (the
  `progress.md` final-review Minor note: the comment "doesn't state structure-check's own pass count").
  New text: `# demo core 184/0 + structure-check 13/0`. (Matches the repo's explicit-count convention, e.g.
  `184/0`, `app: 29 suites`.)

- [ ] **Step 2: Verify no other CLAUDE.md count drifted.** Confirm the block still reads `app: 29 suites`
  and the four commands are unchanged; only the one comment changed.

Run: `git diff CLAUDE.md`
Expected: exactly one changed line (the comment).

- [ ] **Step 3: Commit.**

```bash
git add CLAUDE.md
git commit -m "docs: state structure-check's pass count in the CLAUDE.md gate comment"
```

---

## Self-Review

**Spec coverage:** A1 → Task 1 (existsSync guard + `0d` teeth). A2 → Task 2 (`malformed` finding + `0e` teeth
+ gate assertion). The `progress.md` doc nit (gate comment lacks structure count) → Task 3. A3
(`.gitignore`/`.obsidian` no-op) is deliberately OUT of scope — documented decision below. OT-IDSTATE is a
productionization design choice (no runtime id generator exists; `ahd_id` is a fixed demo constant), not a
code defect — stays in `_meta/OPEN-ITEMS.md`.

**Placeholder scan:** none — every step shows exact code/commands and expected output.

**Type consistency:** `checkAgentPresenceHealth` returns `{ stale, malformed, duplicateClaims }` consistently
after Task 1's guard (which pre-adds `malformed: []`) and Task 2's loop. The gate section reads
`presenceResult.malformed`. Self-teeth read `result.malformed` / `result.stale`. All aligned.

**Explicitly declined (decide-by-yourself calls, logged for traceability):**
- **A3 — `.gitignore` `docs/research/**/.obsidian/` no-op (5 already-tracked files).** NOT fixed. `git rm
  --cached` would untrack them (correct hygiene) but on the next pull git would delete those files from other
  machines' working trees (per-machine Obsidian UI state), and the line already correctly blocks *future*
  `.obsidian/` additions. Marginal benefit, real cross-machine side-effect, and a prior deliberate deferral
  ("non-goal: not disturbing the vault"). Left as-is; one-liner if the operator ever wants it.
- All spine/Shariah/golden/counsel items (D-1, D-3, D-5, OT-VAL, OT-CITE, OT-PATCH, OT-A1/A2) — Marwan's.
