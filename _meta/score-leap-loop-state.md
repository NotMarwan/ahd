# Score-Leap Loop — state (durable across wakes)

**Started:** 2026-07-12 · **Branch:** judge-lens-real-leap · **Orchestrator:** opus-4-8
**Build workers:** sonnet, xhigh effort. **Judges/critics:** opus-4.8, high effort (stricter, harder to fool). Via Workflow tool (per-phase, ≤4 agents). **Pacing:** /loop dynamic mode.
**Roadmap:** `docs/superpowers/plans/2026-07-12-score-leap-master-plan.md`.

## Iron rule (anti-inflation)
Owner mandate: لا تجامل، ولا ترفع، ولا تقعد تمدح — نبغى شي حقيقي، واقعي، صارم جداً.
A score delta counts **only** if ≥ a refute-mode critic cites concrete file/screen evidence. Unevidenced deltas discarded to baseline. No panel grades its own output. Single-screen change ≠ whole-app criterion move.

## Baseline → target (verified 2026-07-12, refute panel)
| Criterion | Base | Target |
|---|---|---|
| Innovation | 7 | 8 |
| UX | 6 | 8 |
| Technical | 6 | 7.5 |
| Data | 6 | 7.5 |
| Feasibility | 5 | 7 |
| Memorability | 6.5 | 8 |

## Phase order + status
- **W1 Sadu design language** (UX) — iter1 DONE (workflow `ahd-score-leap-w1`): build success, gate 2118/0. Sonnet critics scored **6→6.5, delta-partial, inflation found**. Real wins: data-driven thread-weave, hero numerals. Verified defects: (1) brand shrinks 38→30px regression; (2) `--sadu-terra` used 0×; (3) dead `.hsummary`; (4) duplicate type tokens; (5) numeral fragmentation 24/34/36/38; (6) 1/20 screens. iter2 DONE (`ahd-score-leap-w1-iter2`): gate 2141/0. **Opus-4.8 critics authoritative: UX 6→6.5** (floor of 7/6.5/6.5). Real fixes: terra now used app-wide, dead code gone, 5 numerals unified. Partial: type-scale only 2/6 tokens consolidated (~240 hardcoded px remain). Two critic errors I corrected (they ran `git show HEAD`, blind to uncommitted iter1): brand regression was REAL in iter1 working tree + healed by iter2 (not "fabricated"); home.js was iter1 not iter2 (inventory correct). iter3 LAUNCHED (`ahd-score-leap-w1-iter3`): sweep remaining 12 screens + unify scale + fix 38/36 apex.

  **UX CEILING = FONT (human-blocked):** `--font-display==--font-body==` system Segoe UI; no OFL Arabic WOFF2 vendorable offline. UX 8 unreachable until a human provides the font OR grants permission for a download attempt. **After iter3, CAP UX and pivot to W2–W6** (5 criteria still at baseline — better ROI than grinding one).

  **Doc gate-number drift to sweep later (W5/doc-sync):** live count now 1,943 app / 2,141 total; CLAUDE.md + docs still cite 1,874/2,072. No in-app banner drifts (checked).
- **W2 thin real backend (Technical) — DONE, +1 (6→7)** (`ahd-score-leap-w2`): opus floor 7, all 3 critics, **inflation=FALSE (clean)**. `server/` re-exports app/engine.js (`===` proven), reproduces both golden seals (6c9410b9… + 0463553997c8…) through the real router + a live-socket smoke, on-spine (422 riba refusal, integer halalas), gate **2254/0**, spine byte-unchanged. 5 endpoints. Caveat: parity is guaranteed-by-construction (same module instance), gated test uses pure router (live smoke not in CI). **7.5 needs real persistence/auth/deploy — a session, not this loop.**
  - *(W1 iter3 DONE: opus floor UX 6.5→**7** [7.5/7/7]. All 20 screens swept, apex 44/36, unstyled-button defect fixed, gate **2214/0**, zero regressions, spine intact. Inflation caught: G2 "one scale" is definition-only — 188/296 font-sizes still hardcoded, 12.5px×52 off-token. **W1 = real +1 (6→7), CAPPED** — more needs font + literal migration.)*
  - **HUMAN-BLOCKED (long lead — act in parallel while the loop grinds offline):** FONT (UX→8: vendor an OFL Arabic WOFF2 into app/assets/fonts/, or grant a download permission) · SURVEY (Data: distribute kit, N≥30 by Jul 15) · SCHOLAR (Feasibility: Hilah question + D-1/D-3) · D-4 PICK (Innovation: recommend ميراث الدَّين / debt-at-death).
- **W3 real data (Data) — DONE, +0.5 (6→6.5)** (`ahd-score-leap-w3`): opus floor 6.5 (7/6.5/6.5). Verdict: raised **transparency, not data quality** — deterministic sources.js + «المصادر والمنهجيّة» panel + drift-test + 0 uncited numbers, synthetic ratio subordinated. Gate 2263/0. **3 honesty defects to fix in a polish pass:** settlement.js:55 says «المقاسة» (measured) but label says «لا رقمٌ مُقاس» (contradiction); spurious precision «١٩٠٬٤١٧»/«380,834» from a ÷3 (round to «نحو ١٩٠ ألف»); synthetic-circle caveat on impact screen not on the settle card making the claim. Data 7.5 needs the survey (human). **CAPPED at 6.5.**
- **W4 shariah depth (Feasibility) — DONE, +1 (5→6)** (`ahd-score-leap-w4`): opus floor 6, all 3 critics, **issuesFatwa=false, citations accurate, on-spine** (the «لا يجوز» lines are verbatim AAOIFI standard text, not rulings on Ahd's contested Hilah question). shariah-basis.md (5 mechanics → SS-19 + Qur'an 2:282/2:280, cited/graded, never invented), «الأساس الشرعي» app screen, honest PATH-TO-PRODUCTION (backend now real; removed a stale gate count), new D-7 netting question → DECISIONS-FOR-MARWAN. Gate 2300/0. Ceiling: readiness artifact, **no external gate moved → 7 needs the human scholar step. CAPPED at 6.**
- **W5 pitch + one weave metaphor (Memorability 6.5→7.5) — LAUNCHED** (`ahd-score-leap-w5`, LAST autonomous workstream): sharpen the judge-typed tamper cascade + weave-metaphor payoff + refusal beat + 3-min script unified by «كلّ قرضٍ خيط، والسجلّ نسيج», opus critics (RED-only-for-tamper spine check). Live rehearsal (→8) human-gated. **After W5: STOP loop, deliver full scorecard.**
- W6 innovation mechanism (Innovation) — pending; needs Marwan pick (D-4)

## Resume protocol (each wake)
1. If woken by task-notification: read the finished workflow's scorecard (journal), judge strictly.
2. Update this file's status + record confirmed/discarded deltas.
3. Gate green? tripwire sealed? gate-numbers swept?
4. Launch next pending phase's workflow (sonnet xhigh + refute critics). Do NOT commit unless owner asks.
5. ScheduleWakeup (verbatim /loop prompt, ~1500s fallback).

## Autonomy directives (owner asleep 2026-07-13, no questions)
- Do NOT stop after loop 1. When W5 lands: commit loop-1 work as a checkpoint, then build + run LOOP 2, continuously.
- No AskUserQuestion, no blocking. Never self-decide spine/Shariah/irreversible items (D-4, scholar) — log to DECISIONS-FOR-MARWAN.
- **Commit checkpoints on the branch** (judge-lens-real-leap, never main, never push) to protect accumulated verified work — a future worker's `git checkout` revert-to-HEAD could otherwise destroy uncommitted W1–W5. Commit only gate-green state.
- Compaction is automatic; this file is the full handoff. Keep it current every wake.

## Loop 1 result (verified, opus refute-panels, all gate-green, spine intact)
UX 6→7 (+1) · Technical 6→7 (+1) · Data 6→6.5 (+0.5) · Feasibility 5→6 (+1) · Memorability (W5 in flight) · Innovation 7→blocked (D-4). Gate 2072→2300/0.

## LOOP 2 plan — "hardening & honest consolidation" (offline, no human deps, ≤4 agents/phase, opus critics)
1. **Full 6-criterion JUDGE-LENS panel re-score** of the committed current state (the project's required "fifth gate" before freeze) → honest current numbers + rank the highest-ROI remaining OFFLINE defects. Log any <8 as JL- items in _meta/OPEN-ITEMS.md.
2. **Fix accumulated residual defects** (all critic-verified, offline):
   - Data honesty: settlement.js «المقاسة»↔«لا رقمٌ مُقاس» contradiction; spurious precision «١٩٠٬٤١٧»/«380,834» → round; move the synthetic-circle caveat onto the settle card. (→ Data 6.5→7.)
   - Technical: wire server/smoke-live.cjs (over-the-wire parity) into the gate so CI proves HTTP parity, not just the pure router. (→ hardens Technical 7.)
   - UX: migrate remaining hardcoded font-size literals to tokens on judge-path screens (finish G2) — low judge-visibility, do only if cheap.
3. **Doc gate-number drift sweep** (gate-number-drift memory): CLAUDE.md + docs/pitch + deck + vault still cite 1874/2072; live is 2300. Single source = run-all.cjs banner.
4. **W6 Innovation** stays blocked: do NOT build ميراث الدَّين without the D-4 pick (inheritance-fiqh = spine-adjacent). At most, a proposal SPEC doc phrased as pending-approval — never wired into the app.
- Each item: sonnet build (xhigh) + opus refute critics, TDD, gate-green, commit checkpoint on success.
