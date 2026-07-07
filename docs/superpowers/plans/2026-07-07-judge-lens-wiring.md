# Judge Lens Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make "would this beat 999 other projects in front of the AMAD judges?" a permanent, written standard that every future session and agent applies — wired into JUDGE-LENS.md, README, CLAUDE.md, OPEN-ITEMS, and assistant memory.

**Architecture:** Pure documentation + memory wiring; zero product code. One new canonical file (`docs/JUDGE-LENS.md`) holds the standard; every other touched file carries a one-line pointer to it (single source of truth, no duplicated rubric text). Spec: `docs/superpowers/specs/2026-07-07-judge-lens-win-standard-design.md`.

**Tech Stack:** Markdown, git, Claude memory files. Verification via `tests/structure-check.cjs` (the only gate command docs can break) + demo tripwire.

## Global Constraints

- Judging: 18 July 2026, pitch + live demo, Tuwaiq Academy; 1st prize 250,000 SAR; ~1000 projects.
- The five criteria (verbatim from the dossier): الابتكار والإبداع · التطبيق التقني · تحليل البيانات · تجربة المستخدم · قابلية التنفيذ الفعلي في القطاع المالي.
- The lens NEVER overrides the spine (no riba/penalty/scoring/fatwa; frozen demo `e2f48467…`; golden functions). Conflicts → `docs/DECISIONS-FOR-MARWAN.md`.
- Never edit `demo/index.html`. Never weaken a gate assertion.
- All timestamps in coordination notes use `+03:00` local time.
- Commit messages: conventional commits, no attribution footer.

---

### Task 1: Create `docs/JUDGE-LENS.md` (the standard)

**Files:**
- Create: `docs/JUDGE-LENS.md`

**Interfaces:**
- Produces: the canonical standard file every later task points to. Section anchors used by later tasks: `## The five bars`, `## Scoring protocol`, `## Judge-panel review`, `## Spine guard`.

- [ ] **Step 1: Write the file** with exactly this content:

```markdown
# JUDGE-LENS — the competitive gate · عدسة التحكيم

**Mission: 1st place at AMAD Hackathon 2026.** Judging **18 July 2026** — a pitch + live demo in front
of the panel at Tuwaiq Academy, Riyadh. 1st prize **250,000 SAR** (pool 500k: 250/150/100). ~**1000
competing projects**. «نصف مليون في انتظار الأفضل».

This file is the project's **fifth gate**. The four technical gate commands prove the product is
*correct*; this one asks whether it **wins**. Every session that touches anything a judge can see runs
its work through this lens before exiting. Being good is the entry fee — the bar is *unforgettable*.

## The five bars (from the published criteria — dossier §4)

| # | Criterion | First-place bar — the work is NOT done until… |
|---|---|---|
| 1 | **الابتكار والإبداع** — innovation | A judge who has seen 60 projects today says "I haven't seen this before" AND can retell it in one sentence: «البنك يشهد ولا يُقرض». |
| 2 | **التطبيق التقني** — technical | One live moment makes an engineer-judge nod: tamper a sealed record on stage; the seal catches it. Depth (1,200+ automated assertions, byte-determinism, integer halalas, offline-complete) is *stated in numbers, not narrated*. |
| 3 | **تحليل البيانات** — data analysis | A real dataset + insight narrative ON SCREEN: in-product analytics (netting compression, conservation proof, k-anonymous cohort aggregates) + the KSA market/court numbers from `docs/evidence/EVIDENCE-BRIEF.md`. **Never an individual's number, never a trust score — aggregates only** (spine). |
| 4 | **تجربة المستخدم** — UX | Every screen a judge can reach photographs like a shipped Saudi fintech product. Arabic-first RTL typography, motion that clarifies, zero unstyled corners. The demo path feels choreographed, not clicked-through. |
| 5 | **قابلية التنفيذ الفعلي** — feasibility | "Alinma could ship this": two-contract model, Shariah framing, integration path — with honest caveats. **Never assert unconfirmed approvals on stage** (OT-VAL/OT-CITE). |

## The memorability question

Every review ends by answering, in writing: **"Does this make a tired judge remember us an hour
later?"** If the honest answer is a shrug, the work is not done — find the moment, sharpen it.

## Judge-visibility rule

Effort is prioritized by what the panel experiences, in order:
**① the 3-minute pitch → ② the demo-path screens → ③ evidence/data shown on screen → ④ everything else.**
Internal excellence a judge cannot perceive is *maintenance*, not *progress*, until 18 July.
Slippage rule: cut from the bottom of the four fronts, never from the pitch.

## Scoring protocol

Any session touching a judge-visible surface scores it **1–10 per criterion** with one line of evidence
each, in its STATUS/handoff note. Any judge-visible surface **below 8** becomes an open item in
`_meta/OPEN-ITEMS.md` with a `JL-` id. Don't self-grade generously: the panel won't.

## Judge-panel review (repeatable procedure)

Run at the end of every front and before the 15-July freeze:
1. **Six parallel reviewer agents**: one per criterion + one "tired judge" (has seen 60 projects,
   scores only memorability). Each receives the demo path (screens/flow), the deck, and the script.
2. Each returns: score 1–10 · the single weakest moment · one concrete fix.
3. A skeptic agent adversarially verifies findings before they consume build time.
4. **Pass bar: every judge-visible surface ≥ 8, memorability ≥ 8.** Below bar → `JL-` item + fix round.

## Spine guard (non-negotiable)

The lens never overrides the spine. No riba, no penalty, no maysir/gharar, no trust numbers, no
credit scoring, no fatwa-issuing; the demo stays frozen (`e2f48467…`); golden functions are called,
never modified. Winning cannot compromise the soul. Any conflict between this lens and the spine goes
to `docs/DECISIONS-FOR-MARWAN.md` — it is Marwan's call, never a session's.

## Where the sprint lives

Spec: `docs/superpowers/specs/2026-07-07-judge-lens-win-standard-design.md` (four fronts + schedule).
Open gaps: `_meta/OPEN-ITEMS.md` (`JL-` ids). Deadline structure: **freeze 15 July**, onsite 16–18.
```

- [ ] **Step 2: Verify** — run from `tests/`: `node structure-check.cjs`. Expected: `STRUCTURE CHECK: 14 passed, 0 failed` (the file is plain docs; nothing should trip the single-status-file lint).

- [ ] **Step 3: Commit**

```bash
git add docs/JUDGE-LENS.md
git commit -m "docs: add JUDGE-LENS.md — the permanent competitive gate (AMAD, 18 July)"
```

### Task 2: README mission banner

**Files:**
- Modify: `README.md` (top block, after the Soul line, before the first `---`)

**Interfaces:**
- Consumes: `docs/JUDGE-LENS.md` from Task 1 (link target must exist).

- [ ] **Step 1: Edit** — insert between the `> Soul: …` line and the first `---`:

```markdown

> 🏆 **Mission — AMAD Hackathon 2026:** this repo exists to take **1st place (250,000 SAR)** on
> **18 July 2026** against ~1000 projects. Every change is reviewed through the five published judging
> criteria — **[docs/JUDGE-LENS.md](docs/JUDGE-LENS.md)** — before it counts as done. Good is the entry
> fee; the bar is *unforgettable*.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs(readme): mission banner — 1st place at AMAD via the judge lens"
```

### Task 3: CLAUDE.md — mission line + hard rule + map row

**Files:**
- Modify: `CLAUDE.md` (three precise insertions)

**Interfaces:**
- Consumes: `docs/JUDGE-LENS.md` (pointer target).
- Produces: the rule text every future agent session loads.

- [ ] **Step 1: Edit — mission line.** In the header paragraph (`**What this is.** …`), append after the sentence ending `«كلمتك محفوظة، وعلاقتك محميّة».`:

```markdown
 **Mission: 1st place at AMAD Hackathon 2026 (judging 18 July, 250k SAR, ~1000 rivals) — see `docs/JUDGE-LENS.md`.**
```

- [ ] **Step 2: Edit — hard rule.** In `## Hard rules for any change here`, after rule 5 add:

```markdown
6. **The judge lens is the fifth gate:** any change a judge could see (app screens, deck, script,
   evidence, demo path) gets scored against `docs/JUDGE-LENS.md` (five criteria, 1–10, evidence)
   before the session ends; <8 on a judge-visible surface → a `JL-` item in `_meta/OPEN-ITEMS.md`.
   The lens never overrides the spine.
```

- [ ] **Step 3: Edit — map row.** In `## Where things are`, after the `_meta/INDEX.md` bullet add:

```markdown
- `docs/JUDGE-LENS.md` — the competitive gate: mission, five judging bars, scoring protocol, judge-panel review procedure.
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude): judge lens as hard rule 6 + mission line + map row"
```

### Task 4: Seed the `JL-` items in OPEN-ITEMS

**Files:**
- Modify: `_meta/OPEN-ITEMS.md` (new section between the header blockquote and `## Genuinely still open`)

- [ ] **Step 1: Edit** — insert:

```markdown
## JL — judge-lens gaps (win items, freeze 15 July; see `docs/JUDGE-LENS.md`)

| ID | Item | Front | Status |
|---|---|---|---|
| **JL-1** | Pitch & demo kit: deck rebuilt from `docs/DECK-DRAFT-AR.md` + 3-minute Arabic script with second-by-second demo choreography (tamper-catch on stage, Muqassa 9→2, data slide, Alinma close) + rebuttal refresh | Front 1 | open |
| **JL-2** | Premium UX pass: land the July-1 premium direction (`app/screenshots/premium/`, ui-premium-polish plan) across all 12 screens — `app/app.css` + screen markup only, zero unstyled corners | Front 2 | open |
| **JL-3** | Data-analysis story: on-spine «أثر عهد» analytics screen (netting compression, conservation proof, k-anonymous aggregates; TDD) + evidence-brief data slide | Front 3 | open |
| **JL-4** | Judge-visible depth (only if it strengthens the demo; cut first on slippage): borrower-protections panel (OT-P1other) and/or proof-pack polish | Front 4 | open |
```

- [ ] **Step 2: Verify + commit**

Run from `tests/`: `node structure-check.cjs` → `14 passed, 0 failed`.

```bash
git add _meta/OPEN-ITEMS.md
git commit -m "docs(meta): seed JL-1..JL-4 judge-lens gap items"
```

### Task 5: Assistant memory (every future session of the assistant)

**Files:**
- Create: `<memory-dir>/amad-judge-lens.md` (the assistant's project memory directory)
- Modify: `<memory-dir>/MEMORY.md` (add index line)

- [ ] **Step 1: Write `amad-judge-lens.md`:**

```markdown
---
name: amad-judge-lens
description: MISSION — 1st place at AMAD (18 July 2026, 250k SAR, ~1000 rivals); review EVERYTHING through docs/JUDGE-LENS.md
metadata:
  type: project
---

**The mission overrides comfort: Ahd must take 1st place at AMAD Hackathon 2026.** Judging is a
pitch + live demo on 2026-07-18 (Tuwaiq Academy); 1st prize 250,000 SAR; ~1000 competing projects.

**Why:** The operator asked (2026-07-07) that every session and agent hold this bar: "this should be
huge and earn respect from judges to win."

**How to apply:** Start every session knowing the five judging criteria (innovation · technical ·
data analysis · UX · feasibility). Any judge-visible work is scored 1–10 against `docs/JUDGE-LENS.md`
(CLAUDE.md hard rule 6) — below 8 → `JL-` item in `_meta/OPEN-ITEMS.md`. Prioritize by judge
visibility: pitch → demo screens → on-screen evidence → internals. Freeze 15 July. The lens never
overrides the spine. Sprint spec: `docs/superpowers/specs/2026-07-07-judge-lens-win-standard-design.md`.

Related: [[agent-presence-convention]], [[github-access]]
```

- [ ] **Step 2: Add to `MEMORY.md` index (first line of the list, it's the most important memory):**

```markdown
- [AMAD judge lens — MISSION](amad-judge-lens.md) — 1st place 18 July 2026; score all judge-visible work via docs/JUDGE-LENS.md
```

### Task 6: Coordination note, STATUS line, gate, push

**Files:**
- Modify: `_meta/agent-presence/coordination_notes.md` (new entry at top, `+03:00` timestamp)
- Modify: `_meta/STATUS.md` (append DONE line at end)

- [ ] **Step 1: Coordination note** (adapt timestamp):

```markdown
## <NOW>+03:00 — Claude-E → all (JUDGE LENS live: the competitive gate every session must apply)

Operator direction (2026-07-07): the goal is explicit — 1st place at AMAD (judging 18 July, 250k SAR,
~1000 projects) — and every session/agent must review through that bar. Shipped the wiring:
`docs/JUDGE-LENS.md` (five judging bars + scoring protocol + judge-panel procedure + spine guard),
README mission banner, CLAUDE.md hard rule 6, JL-1..JL-4 in `_meta/OPEN-ITEMS.md`. Sprint spec:
`docs/superpowers/specs/2026-07-07-judge-lens-win-standard-design.md`. Freeze 15 July. Fronts begin
with JL-1 (pitch & demo kit). The lens never overrides the spine.

---
```

- [ ] **Step 2: STATUS DONE line** (append at file end, after the last entry's `---`):

```markdown
DONE · 2026-07-07 · Claude-E · **Judge Lens wired as the permanent competitive gate** · `docs/`, `_meta/`
Operator set the bar: 1st place at AMAD 2026 (18 July, 250k SAR, ~1000 rivals). Added `docs/JUDGE-LENS.md`
(the five published criteria as first-place bars, scoring protocol, six-agent judge-panel procedure,
spine guard), README mission banner, CLAUDE.md hard rule 6 + map row, JL-1..JL-4 seeded in
`_meta/OPEN-ITEMS.md`, assistant memory updated. Docs-only change; gate untouched and green
(structure-check 14/0, tripwire `e2f48467… OK`). Spec: `docs/superpowers/specs/2026-07-07-judge-lens-
win-standard-design.md`. Next: JL-1 pitch & demo kit (Front 1).

---
```

- [ ] **Step 3: Verify** — from `tests/`: `node structure-check.cjs` → `14 passed, 0 failed`; from root: `sha256sum -c _overnight/backup/demo.sha256` → `demo/index.html: OK`.

- [ ] **Step 4: Commit + push**

```bash
git add _meta/agent-presence/coordination_notes.md _meta/STATUS.md
git commit -m "docs(meta): coordination note + STATUS line for the judge-lens wiring"
git push origin main
```
