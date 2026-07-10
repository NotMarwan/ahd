# Freeze-Week Close Implementation Plan (JL-5 preflight · pptx · rehearsal · Gate B)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every remaining pre-freeze item: JL-5 stage-preflight guard (operator chose: keep `run-all.cjs` on stage + additive preflight), the .pptx build (B1/B2 confirmed available), rehearsal kit + screenshot refresh, and the 14-July Gate B re-score.

**Architecture:** Everything additive. The frozen demo (`demo/index.html`, tripwire `e2f48467…`) and golden functions are never touched. The gate banner **must stay exactly `AHD GATE ✅ 1687/0`** — no new auto-discovered test suite (a count change would force another number sweep across 14 pitch files). The preflight therefore lives at `tests/stage-preflight.cjs` (NOT `*.test.cjs`, NOT in `tests/app/`) with self-teeth behind a `--self-test` flag run manually, never by the gate.

**Tech Stack:** Node ≥16 CJS (matches existing harness style: `"use strict"`, `var`/`const`, zero deps), python-pptx for the deck build (scratchpad script, not committed), headless Chrome for screenshots (same pipeline as the 8-Jul reshoot).

## Global Constraints

- Gate banner stays `1687/0` + tripwire `e2f48467… OK` after every commit — verify with `cd tests && node run-all.cjs`.
- Never edit `demo/index.html`, golden functions, or weaken any assertion (CLAUDE.md hard rules 1–4).
- No `Date.now`/`new Date()` **in app logic** — the preflight is dev tooling (like `structure-check.cjs`, which already uses wall-clock), so `Date.now()` is allowed there but nowhere under `app/`.
- All judge-visible copy changes get scored against `docs/JUDGE-LENS.md` before session end (hard rule 6).
- Anything Shariah/spine/irreversible → `docs/DECISIONS-FOR-MARWAN.md`, don't decide alone.
- Operator inputs consumed at execution time: **B1** = official .pptx template path, **B2** = final team names. Ask for both at Task 3 step 1; do not invent placeholders in the deck.
- Presence protocol: register as an agent in `_meta/agent-presence/`, exit cleanly (ironic given JL-5 — a leftover file here reddens the gate).

---

### Task 1: `tests/stage-preflight.cjs` — pre-stage hygiene guard

**Files:**
- Create: `tests/stage-preflight.cjs`

**Interfaces:**
- Consumes: `_meta/agent-presence/*.json` (schema: `{agent_id, status, last_heartbeat, files_claimed, tasks_claimed}`), `_overnight/backup/demo.sha256`.
- Produces: exit 0 + `READY FOR STAGE ✅` when every presence file has `status:"exited"` AND tripwire OK; exit 1 + named offenders otherwise. `node stage-preflight.cjs --self-test` runs its own teeth (manual only — never wired into the gate).

Stricter than the gate on purpose: the gate reddens only on *stale* (>45 min) active files; preflight fails on **any** non-exited file, because a fresh active file will become the stage's red banner 45 minutes later.

- [ ] **Step 1: Write the file with self-teeth first, watch them fail**

```js
#!/usr/bin/env node
/* stage-preflight.cjs — morning-of-stage hygiene check (JL-5).
   Additive tooling: verifies the gate CANNOT redden for a non-product reason before
   «شغّلها الآن أمامك». Not part of run-all.cjs — the gate stays 1687/0.
   Usage:  cd tests && node stage-preflight.cjs        (before going on stage)
           node stage-preflight.cjs --self-test        (manual teeth)             */
"use strict";
var fs = require("fs");
var os = require("os");
var path = require("path");
var cp = require("child_process");

var ROOT = path.join(__dirname, "..");

function checkPresenceAllExited(root) {
  var dir = path.join(root, "_meta/agent-presence");
  var offenders = [];
  if (!fs.existsSync(dir)) return { offenders: offenders };
  fs.readdirSync(dir).filter(function (f) { return f.endsWith(".json"); }).forEach(function (f) {
    var data;
    try { data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); }
    catch (e) { offenders.push({ file: f, reason: "unparseable JSON" }); return; }
    if (data.status !== "exited") {
      offenders.push({ file: f, agent_id: data.agent_id || null, status: data.status || null, reason: "status is not \"exited\"" });
    }
  });
  return { offenders: offenders };
}

function checkTripwire(root) {
  try {
    var out = cp.execSync("sha256sum -c _overnight/backup/demo.sha256", { cwd: root, encoding: "utf8" });
    return /:\s*OK/.test(out);
  } catch (e) { return false; }
}

function selfTest() {
  var failures = 0;
  function ok(cond, name) {
    console.log((cond ? "  ✓ " : "  ✗ ") + name);
    if (!cond) failures++;
  }
  function inTemp(build, assert) {
    var dir = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-preflight-"));
    try {
      var pdir = path.join(dir, "_meta/agent-presence");
      fs.mkdirSync(pdir, { recursive: true });
      build(pdir);
      assert(checkPresenceAllExited(dir));
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  }
  inTemp(function (pdir) {
    fs.writeFileSync(path.join(pdir, "claude-a.json"), JSON.stringify({ agent_id: "A", status: "exited" }));
    fs.writeFileSync(path.join(pdir, "claude-b.json"), JSON.stringify({ agent_id: "B", status: "exited" }));
  }, function (r) { ok(r.offenders.length === 0, "all-exited presence dir passes"); });
  inTemp(function (pdir) {
    // fresh heartbeat on purpose: preflight must flag ACTIVE even when the gate wouldn't (yet)
    fs.writeFileSync(path.join(pdir, "claude-c.json"), JSON.stringify({ agent_id: "C", status: "active", last_heartbeat: new Date().toISOString() }));
  }, function (r) { ok(r.offenders.length === 1 && r.offenders[0].agent_id === "C", "fresh ACTIVE file is flagged (stricter than the 45-min gate)"); });
  inTemp(function (pdir) {
    fs.writeFileSync(path.join(pdir, "broken.json"), "{not json");
  }, function (r) { ok(r.offenders.length === 1 && r.offenders[0].reason === "unparseable JSON", "unparseable presence file is flagged"); });
  var emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-preflight-"));
  try { ok(checkPresenceAllExited(emptyDir).offenders.length === 0, "missing _meta/agent-presence dir does not throw"); }
  finally { fs.rmSync(emptyDir, { recursive: true, force: true }); }
  console.log(failures === 0 ? "\nself-test: all passed" : "\nself-test: " + failures + " FAILED");
  process.exit(failures === 0 ? 0 : 1);
}

if (process.argv.indexOf("--self-test") !== -1) selfTest();
else {
  var presence = checkPresenceAllExited(ROOT);
  presence.offenders.forEach(function (o) {
    console.log("  ✗ presence: " + o.file + " — " + o.reason + (o.agent_id ? " (agent " + o.agent_id + ", status " + o.status + ")" : ""));
  });
  if (presence.offenders.length === 0) console.log("  ✓ presence: every agent file is \"exited\"");
  var tripOk = checkTripwire(ROOT);
  console.log((tripOk ? "  ✓ " : "  ✗ ") + "tripwire: demo/index.html " + (tripOk ? "OK (e2f48467…)" : "FAILED"));
  console.log("\n============================================================");
  if (presence.offenders.length === 0 && tripOk) {
    console.log("  READY FOR STAGE ✅  — run-all.cjs cannot redden for a non-product reason");
  } else {
    console.log("  NOT READY ❌  — fix the lines above, then re-run");
  }
  console.log("============================================================");
  process.exit(presence.offenders.length === 0 && tripOk ? 0 : 1);
}
```

To watch the teeth fail first (TDD spirit on tooling): write the file with `checkPresenceAllExited` returning `{ offenders: [] }` unconditionally, run step 2, see teeth 2–3 fail, then fill in the real body above.

- [ ] **Step 2: Run self-test**

Run: `cd tests && node stage-preflight.cjs --self-test`
Expected (stub body): `✗ fresh ACTIVE file is flagged…` — FAIL. Then with real body: 4/4 `✓`, `self-test: all passed`.

- [ ] **Step 3: Run the real preflight against the live repo**

Run: `cd tests && node stage-preflight.cjs`
Expected: if this very session's presence file is active, it must appear as `✗` (that's the tool working). After exiting/parking it: `READY FOR STAGE ✅`, exit 0.

- [ ] **Step 4: Prove the gate count is untouched**

Run: `cd tests && node run-all.cjs`
Expected: `AHD GATE ✅ 1687/0` + tripwire OK (preflight is not auto-discovered — confirm `run-app-tests.cjs` output still says 34 suites).

- [ ] **Step 5: Commit**

```bash
git add tests/stage-preflight.cjs
git commit -m "feat(stage): JL-5 stage-preflight hygiene guard - additive, gate count untouched (1687/0)"
```

---

### Task 2: Point the presenter guide + open-items at the preflight

**Files:**
- Modify: `docs/PRESENTER-GUIDE.md:39-41` (hygiene step ٤) — replace the manual "check every presence JSON" instruction with the one command; also the mishap-6 note that references the same procedure.
- Modify: `_meta/OPEN-ITEMS.md` JL-5 row + Panel-#3 item 9 — mark resolved (option a+b hybrid: full gate on stage, preflight as the hygiene teeth).

**Interfaces:**
- Consumes: `tests/stage-preflight.cjs` from Task 1 (exact command `cd tests && node stage-preflight.cjs`).
- Produces: guide text; no code.

- [ ] **Step 1: Edit guide step ٤** — keep the existing Arabic warning (lines 39-41), append the command:

```markdown
> **الأمر الجاهز:** `cd tests && node stage-preflight.cjs` — يفحص ملفّات الحضور + ختم العرض ويطبع
> `READY FOR STAGE ✅`. شغّله صباح يوم ١٨ يوليو **قبل** الصعود، ثم أكّد اللافتة الخضراء بـ `node run-all.cjs`.
```

Mirror one line in the mishap-6 entry (grep `مصيبة` in the guide to locate it).

- [ ] **Step 2: Update `_meta/OPEN-ITEMS.md`** — JL-5 row status `open` → `closed 2026-07-10 (stage-preflight.cjs + guide step ٤; run-all.cjs stays the stage command)`; Panel #3 item 9 gets the same note.

- [ ] **Step 3: Gate + commit**

Run: `cd tests && node run-all.cjs` — expect `1687/0`.

```bash
git add docs/PRESENTER-GUIDE.md _meta/OPEN-ITEMS.md
git commit -m "docs(stage): guide step 4 + JL-5 closed - preflight command wired into the morning-of checklist"
```

---

### Task 3: .pptx build from deck-content-v2 (B1 template + B2 names)

**Files:**
- Create: `docs/pitch/ahd-deck.pptx` (committed deliverable)
- Create (scratchpad only, not committed): `<scratchpad>/build_deck.py`
- Read: `docs/pitch/deck-content-v2.md` (all 14 slots — content is final post-panel-#3, images already repointed to `app/screenshots/premium-after/`)

**Interfaces:**
- Consumes: operator inputs **B1** (template .pptx path) and **B2** (team names) — request both from the operator before step 2; deck copy verbatim from `deck-content-v2.md` (numbers already swept to 1,687/0 — copy, never retype).
- Produces: 14-slide RTL Arabic deck on the official template.

- [ ] **Step 1: Collect B1 + B2 from operator.** Stop and ask if not provided. Verify the template opens (`python -c "from pptx import Presentation; Presentation(r'<B1>')"`); `pip install python-pptx` if missing.

- [ ] **Step 2: Write `build_deck.py` in the scratchpad.** Parse `deck-content-v2.md` slot-by-slot (slots are `## خانة N` headings; image refs are markdown paths; each `<!-- -->` comment is build guidance, not content). Rules: template's own layouts/masters (that's the point of B1); RTL paragraph alignment; IBM Plex Sans Arabic if the template doesn't already set it; images from `app/screenshots/premium-after/` at their referenced filenames; team names (B2) only on the slot that asks for them; **no invented text — every visible string must exist in deck-content-v2.md or B2.**

- [ ] **Step 3: Build + verify.**

Run: `python build_deck.py`
Then verify: 14 slides (`python -c "from pptx import Presentation; print(len(Presentation(r'docs/pitch/ahd-deck.pptx').slides))"` → `14`); every embedded image resolves from `premium-after/` (script should hard-fail on a missing file, never skip); spot-open in PowerPoint — RTL direction, Arabic-Indic numerals rendering, Khanah 8 shows `11-impact-collapsed.png`, the proof/tamper slide shows the red-verdict shot.

- [ ] **Step 4: Judge-lens spot check.** Score the deck against `docs/JUDGE-LENS.md` five bars — this is a judge-visible surface (hard rule 6). Any bar <8 → `JL-` item in `_meta/OPEN-ITEMS.md`.

- [ ] **Step 5: Commit deliverable only**

```bash
git add docs/pitch/ahd-deck.pptx
git commit -m "feat(pitch): build 14-slide .pptx on the official template - content verbatim from deck-content-v2, premium-after images"
```

Update `_meta/OPEN-ITEMS.md` JL-1 row: pptx residual → done; rehearsal remains.

---

### Task 4: Screenshot refresh + rehearsal kit

The panel-#3 fixes changed visible copy after the 8-Jul reshoot: `(محاكاة)` tag on the create-screen seal button + sealed-doc label, and the unified `App.digit` 9→2 stat on settle + impact. Any premium-after/fallback shot showing those states is stale — and would flow into the pptx (do this task **before or with** Task 3 step 3; re-embed if after).

**Files:**
- Modify: `app/screenshots/premium-after/*.png` (only shots whose screens changed: create seal state, sealed-doc, settlement, impact — identify by filename against the 16-shot list from the 8-Jul reshoot)
- Modify: `docs/pitch/fallback/*.png` (resync any counterpart of a reshot image — byte-identical rule from panel #3 item 10)
- Create: `docs/pitch/rehearsal-checklist.md`

**Interfaces:**
- Consumes: `node app/_serve-app.cjs` (port 8124), the 8-Jul headless-Chrome pipeline (@2x), `docs/pitch/script-ar.md` beats (3-min primary + `[+موسَّع]` beats), `docs/PRESENTER-GUIDE.md` click path.
- Produces: fresh shots; a one-page printable checklist the operator drives rehearsal from.

- [ ] **Step 1: Serve + reshoot changed screens** at the same viewport/scale as the 8-Jul run; overwrite only the stale filenames.

- [ ] **Step 2: Resync fallback** — for each reshot image with a fallback counterpart, copy byte-identical; verify:

Run (Git Bash): `for f in docs/pitch/fallback/*.png; do cmp -s "$f" "app/screenshots/premium-after/$(basename "$f" | sed 's/^..-//').png" || echo "DIVERGES: $f"; done`
(Adjust the name mapping to the real fallback↔premium-after pairing — read the fallback dir first; expected: no output.)

- [ ] **Step 3: Write `docs/pitch/rehearsal-checklist.md`** — one row per script beat: timestamp budget · exact screen · exact button label (labels verified 8-Jul, plus the two fixed ones «🧪 شرط غرامة» / «أزِل الشرط وأعد الصياغة») · the sentence being spoken · ✅ box. Append the morning-of block: preflight command (Task 2) → `run-all.cjs` green → fallback folder open in a viewer as safety net.

- [ ] **Step 4: Golden-path click-through** in a real browser, checklist in hand, 0 console errors, every label matches. Fix any drift found (script/guide text only — copy fixes, no logic).

- [ ] **Step 5: Gate + commit**

Run: `cd tests && node run-all.cjs` — expect `1687/0`.

```bash
git add app/screenshots/premium-after docs/pitch/fallback docs/pitch/rehearsal-checklist.md
git commit -m "feat(pitch): post-panel3 screenshot refresh + fallback resync + rehearsal checklist"
```

If Task 3 already built the pptx from stale images, re-run `build_deck.py` and amend-commit the deck (new commit, not `--amend`).

---

### Task 5: Gate B judge re-score (due 14 July)

**Files:**
- Modify: `_meta/OPEN-ITEMS.md`, `_meta/STATUS.md` (DONE line), vault `AmadHackathon/` (Home + plan + topical note)
- Read: `docs/JUDGE-LENS.md` (panel procedure), all pitch surfaces

**Interfaces:**
- Consumes: everything above landed; gate `1687/0` confirmed at panel start AND end (panel #3 lesson: run preflight first so a presence file can't pollute the banner mid-review).
- Produces: six-lens scores + fix queue (if any) in `_meta/OPEN-ITEMS.md`; freeze go/no-go recommendation for 15 July.

- [ ] **Step 1:** `cd tests && node stage-preflight.cjs && node run-all.cjs` — both green before spawning judges.
- [ ] **Step 2:** Run the `docs/JUDGE-LENS.md` six-agent panel procedure (innovation · technical · data · UX · feasibility · memorability), same file-based methodology as panels #1–#3, **including the new surfaces: ahd-deck.pptx, rehearsal-checklist, preflight**. Skeptic-verify every finding file/line before queuing (panel #3 discipline).
- [ ] **Step 3:** Score table + fix queue → `_meta/OPEN-ITEMS.md`; only fixes that are copy/text or clearly additive land before the 15-July freeze — anything gate-adjacent gets parked with rationale.
- [ ] **Step 4:** Append the DONE line to `_meta/STATUS.md`; sync the Obsidian vault (Home + plan checkboxes + topical note); exit presence file.
- [ ] **Step 5: Commit**

```bash
git add _meta docs AmadHackathon
git commit -m "docs(judge): Gate B re-score - six-lens panel on the frozen candidate"
```

---

## Execution order & blockers

| Task | Blocker | When |
|---|---|---|
| 1 preflight | none | now |
| 2 guide wiring | Task 1 | now |
| 4 reshoot + rehearsal kit | Tasks 1–2 (checklist references preflight) | now — **before Task 3 embeds images** |
| 3 pptx | B1 + B2 from operator (confirmed available) + Task 4 shots | on input |
| 5 Gate B | Tasks 1–4 | 14 July |

Out of scope (tracked elsewhere, not this plan): OT-A1 field survey (operator, non-code) · OT-VAL/OT-CITE (counsel-only) · borrower-invokable إبراء (D-gated, Marwan) · OT-PATCH/OT-SEAL5 (post-demo v2).
