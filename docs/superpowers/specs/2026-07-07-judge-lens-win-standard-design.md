# Judge Lens + Four-Front Sprint — design

**Date:** 2026-07-07 · **Status:** approved approach, spec under operator review
**Goal:** 1st place (250,000 SAR) at AMAD Hackathon 2026 — judging 18 July 2026, Tuwaiq Academy, Riyadh, ~1000 competing projects. 11 days remain. Pre-built work is allowed.

## Problem

Ahd has a merciless *technical* gate (1,200+ assertions + tripwire) but **no competitive gate**: nothing in
the project ever asks *"would this beat 999 other projects in front of a judge?"* The operator's own
read — confirmed across all four dimensions — is that the product is good but not first-place caliber:
wow factor, pitch moment, data-analysis story, and judge-visible depth all fall short of a 250k win.

The judges score five published criteria (AMAD dossier §4): **innovation & creativity · technical
implementation · data analysis · UX · real-world feasibility in the financial sector**. The deliverable
on 18 July is a **pitch + live demo** in front of the panel. Today, "data analysis" is essentially
unaddressed — a scored criterion at zero.

## Design overview

Two deliverables, in order:

1. **The Judge Lens** — a permanent, written competitive standard that every future session and agent
   applies, wired into the files agents actually read.
2. **The Four-Front Sprint** — an 11-day, judge-visibility-ordered attack on the four gaps, each front
   closed by an adversarial judge-panel review.

---

## Part 1 — The Judge Lens (permanent standard)

### 1a. `docs/JUDGE-LENS.md` (new file — the standard itself)

Contents:

- **Mission header:** 1st place · 250k SAR · judging 18 July 2026 (pitch + live demo, Tuwaiq Academy)
  · ~1000 competitors · «نصف مليون في انتظار الأفضل».
- **The five criteria as first-place bars** (each with a concrete, testable bar):
  | Criterion | First-place bar |
  |---|---|
  | الابتكار والإبداع | A judge who has seen 60 projects says "I haven't seen this before" AND can retell the idea in one sentence («البنك يشهد ولا يُقرض»). |
  | التطبيق التقني | One live moment that makes an engineer-judge nod: tamper a sealed record on stage, watch the seal catch it. Depth (1,200+ assertions, determinism, integer halalas) stated, not narrated. |
  | تحليل البيانات | A real dataset + insight narrative ON SCREEN: in-product analytics (netting compression, conservation proofs, k-anonymous cohorts) + the KSA market/court numbers from the evidence brief. Never a trust number for an individual — aggregates only (spine rule). |
  | تجربة المستخدم | Premium Arabic-first UI that photographs beautifully. Zero unstyled corners on any screen a judge can reach. The demo path feels choreographed, not clicked-through. |
  | قابلية التنفيذ الفعلي | "Alinma could ship this" — two-contract model, Shariah framing, integration path, and honest pre-production caveats (OT-VAL: never assert unconfirmed approvals on stage). |
- **The memorability question** — every review ends by answering: *"Does this make a tired judge
  remember us an hour later?"* If the answer is a shrug, the work is not done.
- **Judge-visibility rule** — effort is prioritized by what the panel experiences, in order:
  ① the 3-minute pitch ② the demo path screens ③ evidence/data shown on screen ④ everything else.
  Internal excellence that no judge can perceive is *maintenance*, not *progress*, until 18 July.
- **Scoring protocol** — any session that touches a judge-visible surface scores it 1–10 per criterion,
  with one line of evidence each. Any judge-visible surface below 8 becomes an open item in
  `_meta/OPEN-ITEMS.md` (prefix `JL-`). Scores are recorded in the session's STATUS/handoff note.
- **Judge-panel review procedure** — how to run the adversarial review (see Part 3).
- **Spine guard (non-negotiable)** — the lens NEVER overrides the spine. No riba, no penalty, no trust
  numbers, no fatwa-issuing, frozen demo, golden functions — winning cannot compromise the soul. On any
  conflict: `docs/DECISIONS-FOR-MARWAN.md`, not a unilateral call.

### 1b. Wiring (what every session/agent actually reads)

| File | Change |
|---|---|
| `README.md` | Mission banner at the very top: the tournament, the date, the bar ("this repo's goal is 1st place; every change is reviewed through `docs/JUDGE-LENS.md`"). |
| `CLAUDE.md` | One mission line in the header + a new hard rule: *"Judge-visible changes get a judge-lens score (see `docs/JUDGE-LENS.md`) before the session ends."* + a row in "Where things are." |
| Claude memory (`memory/`) | A `project` memory: mission, date, criteria, standing instruction to review through the lens every session. Indexed in `MEMORY.md`. |
| `_meta/OPEN-ITEMS.md` | New `JL-` section seeded with the four confirmed gaps (JL-1 pitch/demo kit, JL-2 premium UX, JL-3 data story, JL-4 judge-visible depth). |
| `_meta/agent-presence/coordination_notes.md` | Session note announcing the standard (normal protocol). |

`CLAUDE.md` is the load-bearing file — every agent reads it. README is for humans/GitHub. Memory is for
this assistant's future sessions. All three carry the same one-sentence core so no reader misses it.

---

## Part 2 — The Four-Front Sprint (11 days, judge-visibility order)

Deadline structure: **freeze product by 15 July** (pitch-craft enrichment session day; hackathon days
16–18 are onsite polish/rehearsal, not feature work). That leaves **8 working days** of build.

### Front 1 — Pitch & demo kit (start immediately; iterate daily)
The panel sees 3 minutes. This is the highest-leverage surface in the repo.
- Rebuild the deck from `docs/DECK-DRAFT-AR.md` + `_meta/amad2026-deck-prompt-for-claude-design.md`
  into a presentable artifact (deck-pitch/pptx skills; Arabic-first).
- Write the **3-minute Arabic script** with second-by-second demo choreography: the one-sentence hook,
  the on-stage tamper-catch, the Muqassa 9→2 moment, the data slide, the Alinma close.
- Q&A prep: refresh `docs/evidence/REBUTTAL-PLAYBOOK.md` against the five criteria; add a "hostile
  judge" round to the judge-panel review.
- Update `docs/PRESENTER-GUIDE.md` to match the final choreography.

### Front 2 — Premium UX pass (the planned-but-never-landed polish)
- Land the premium-UI direction whose tokens/screenshots are already on `main` (July-1 WIP:
  `app/screenshots/premium/`, `docs/superpowers/plans/2026-07-01-ui-premium-polish.md`).
- Scope: `app/app.css` + screen markup ONLY — no logic, no engine, no demo. Frozen demo stays frozen.
- Bar: every screen on the demo path photographs like a shipped Saudi fintech product; RTL typography,
  motion that clarifies, zero unstyled corners. Real-Chromium screenshots at each milestone.
- Gate stays green throughout (dom-smoke will need additive updates alongside markup changes).

### Front 3 — Data-analysis story (the unscored criterion, from zero to scored)
Two halves, both on-spine:
- **In-product:** a new analytics/impact screen («أثر عهد») built additively in `app/` — netting
  compression (transfers before/after, money-moved reduction), conservation proof visualized,
  k-anonymous cohort aggregates (counts/medians only, never an individual's number, never a trust
  score). Deterministic fixture data, integer halalas, TDD like every feature.
- **In-pitch:** one data slide from `docs/evidence/EVIDENCE-BRIEF.md` (KSA court volumes, informal
  lending prevalence, smartphone penetration) with sources — the "insight narrative" the dossier says
  judges want. Counsel-gated numbers (OT-CITE) presented with the confidence they've earned, not more.

### Front 4 — Judge-visible depth (only if it strengthens the demo)
- Pick from `_meta/OPEN-ITEMS.md` strictly by demo value; candidates: borrower-protections panel
  (OT-P1other) and dispute proof-pack polish (OT-DEPTH/P12 surface).
- Explicitly NOT: internal refactors, MCP work, new engine capability — nothing a judge can't see.

### Schedule skeleton
| Days (July) | Focus |
|---|---|
| 7–9 | Front 1 draft (deck v1 + script v1) in parallel with Front 2 (premium UX) |
| 10–12 | Front 3 (data story: screen + slide) · Front 2 completes · deck v2 |
| 13–14 | Front 4 (if time) · judge-panel review round on everything · fix round |
| 15 | FREEZE. Pitch-craft session. Full rehearsal against the final kit. |
| 16–18 | Onsite: rehearse, adapt to revealed constraints, present. |

Slippage rule: cut from the bottom (Front 4 first), never from Front 1.

---

## Part 3 — Judge-panel review (the repeatable mechanism)

Documented in `JUDGE-LENS.md`; run at the end of every front and before freeze:

- **Six parallel reviewer agents**: one per criterion (5) + one "tired judge" who has seen 60 projects
  and scores only memorability. Each gets the demo path (screenshots + flow), the deck, and the script.
- Each returns: score 1–10, the single weakest moment, and one concrete fix.
- **Pass bar:** every judge-visible surface ≥8; memorability ≥8. Below bar → `JL-` open item + fix round.
- Findings are adversarially verified (a skeptic agent tries to refute each) before they consume build
  time — same discipline as the code-review harness.

## Error handling / risks

- **Time slippage** → priority order + the slippage rule above.
- **Spine conflicts** (e.g., a "data" idea that smells like scoring) → refuse, route to
  `DECISIONS-FOR-MARWAN.md`. The lens has a written spine guard for exactly this.
- **On-stage rule changes** (16–18 July reveal constraints) → the kit keeps a 90-second cut of the
  pitch and an offline-only demo path (the app is already fully offline — an advantage; rehearse it).
- **Gate breakage** → unchanged hard rule: never weaken an assertion; all product work TDD'd.

## Testing

- Product work (Fronts 2–4): existing harness discipline — failing test first, gate green, tripwire
  intact, dom-smoke extended additively.
- Non-code artifacts (deck, script): the judge-panel review IS the test; scores recorded in STATUS.
- The lens wiring itself: `tests/structure-check.cjs` untouched (no new gate assertions in this design —
  the lens is a review standard, not a CI check; revisit after the tournament).

## Explicitly out of scope

- Editing the frozen demo or golden functions (never).
- Committing the judging decision to any Shariah-gated open item (D-1, D-3, D-5 stay Marwan's).
- Post-tournament concerns (OT-PATCH, OT-SEAL5, v2 mechanisms) unless they surface in a front.
