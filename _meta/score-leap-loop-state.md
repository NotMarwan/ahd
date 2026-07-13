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

## Loop 1 result — COMPLETE, committed `dc25ffb` (branch only, not pushed)
UX 6→7 (+1) · Technical 6→7 (+1) · Data 6→6.5 (+0.5) · Feasibility 5→6 (+1) · Memorability 6.5→7 (+0.5) · Innovation 7→7 (0, D-4 blocked). **+4.0 across 5 criteria.** Gate 2072→**2317/0**, spine intact, all opus-verified.
W5 Memorability cap: strongest new visual (home-weave tearing red) is OFF the default 3-min script path — presenter-choreography decision left to owner (force into cold open vs optional doorway).

## Loop 2 progress
**CURRENT LIVE GATE = 2322/0** (single source of truth — supersedes any earlier count mentioned anywhere in this file).
- **iter1 DONE** (`ahd-score-leap-L2-iter1`): **Data 6.5→7** (opus floor, all 3 critics 7, no inflation) — «مقاسة» contradiction removed, projections rounded («نحو ١٩٠/٣٨٠ ألف»), on-card synthetic caveat added; gate-number drift swept from ~23 judge-facing files (CLAUDE/README/docs/deck/vault) to live 2322. Spine intact. Data underlying ceiling (synthetic circles / no survey) unchanged → capped <7.5.
- **iter2 DONE — pre-freeze panel** (`ahd-score-leap-L2-panel`, 4 opus critics, whole-app refute). It DOWN-CORRECTED the per-front loop's tally: per-workstream critics scored "did this change help?"; the whole-app panel scores "where does a judge on 18 July land?" — harsher, because the deciding pillar in UX/Tech/Mem is human-gated.

### HONEST FINAL SCORECARD — panel-verified conservative floor (the real number)
| Criterion | Base | Verified | Real Δ | Ceiling blocker |
|---|---|---|---|---|
| UX | 6 | **6.5** | +0.5 | bundled OFL Arabic font absent (rubric's 1st pillar; ships system Tahoma) |
| Technical | 6 | **6.5** | +0.5 | server slice is judge-invisible; no persistence/auth/deploy |
| Data | 6 | **6.5** | +0.5 | still synthetic circles, no primary survey |
| Feasibility | 5 | **6** | +1 | no actual scholar sign-off |
| Memorability | 6.5 | **6.5** | **+0** | no live rehearsal; weave-tear payoff optional/off default path |
| Innovation | 7 | **7** | 0 | D-4 mechanism pick (owner) |
**Real whole-app gain ≈ +2.5, NOT the +4.5 the per-front critics tallied** (that gap was mild echo-relative-to-judge inflation; the panel corrected it — «لا نجامل»). Cross-check critic gave UX/Tech 7; primaries gave 6.5; floor taken. **SPINE: all 8 axes PASS** (demo e2f48467 frozen, gate 2322/0, no riba/score/fatwa, trust qualitative, integer halalas, determinism, golden called-not-modified).

### #1 leverage (panel-unanimous): the FONT — blocked on a file/permission
Vendor a real OFL Arabic display+text .woff2 → app/assets/fonts/ + @font-face + swap family names in sadu-tokens.css:74-75 (wiring already staged). Offline-shippable in principle, but obtaining the .woff2 needs a human to drop it OR download permission (owner asleep, download is permission-gated) → stays blocked here. (= JL-7.)

### Loop 2 iter3 — DONE (`ahd-score-leap-L2-iter3` + orchestrator fix), gate **2436/0**, committed
- **JL-6 no-drift gate test — CLOSED.** `tests/gate-drift-check.cjs`, wired as run-all step 6, single-source live count (env from run-all's own sum), meta-excluded from the product total. Caught 3 REAL pre-existing drifts (deck:100,176 · rebuttal:118). Opus critic found a real Arabic-Indic gap (trailing `\b` is ASCII-only → `١٨٤/٠` + `تأكيد` unscanned); **I fixed it inline** (digit-lookaheads, not `\b`) + added self-teeth 0j/0k (now 12/meta). Scans ASCII + Arabic-Indic both directions.
- **JL-8 k-floor — CLOSED (code half).** impact-drill.js aggregate-only past K_FLOOR (no id/label leak, any bucket size) + no-leak regression (fail-before/pass-after proven via git-stash). Data-sourcing half (survey = OT-A1) stays human-gated.
- Both opus-verified: JL-8 solid, JL-6 solid-after-fix; spine intact, tripwire e2f48467, no weakened assertion.

## FOCUS NARROWED TO 4 (owner, 2026-07-13) — ACTIVE
Push **Technical · Data · Feasibility · Innovation** only (UX + Memorability parked — font/delivery ceilinged).
Full plan: `docs/superpowers/plans/2026-07-13-four-criteria-push.md`. **Reframe:** the panel's ceilings are real
but each has an OFFLINE lever under it the earlier loop under-exploited — especially Technical (persistence/auth/
deploy is a BUILD, not a human gate). Execution order: T1 persistence → T2 auth → I1 Open-Witness protocol+verifier
→ T3 server-judge-visible → D1+D2 data rigor → F2 roadmap+F3 economics → T4 CI parity+T5 deploy → D3 fixtures →
full 4-criteria re-score. Human residue (flag, don't fake): D-4 pick (Innovation→8), scholar (Feas→8), survey (Data→8).
**PROGRESS (committed, opus-verified, gate green, spine PASS):**
- iter4 UX font-stack → UX 6.9 (banked, out-of-focus) — `6c7f1a3`
- T1 durable persistence (JSONL event log + restart-replay) → **Technical 6.5→7** — `16a8553`
- T2 real HMAC session-token auth (opt-in, forged→401, teeth) → **Technical 7→7.2** — `5592bd5`
- I1 Open-Witness protocol + standalone engine-independent verifier (reproduces both golden seals, zero engine import) → **Innovation 7→7.5** — `5469d62`
- **T3 make backend+protocol JUDGE-VISIBLE — DONE** (`wba8murnb`, 3 opus refute-critics, all delta-confirmed, **inflation=FALSE**). `server/demo-bank-node.cjs`: one command, exit 0, over a real ephemeral socket — real 401 on unauth POST, minted HMAC token, sealed NEW-1 = golden `0463553997c8…` live, `/verify` VALID+INVALID (server tamper-evidence), 2-line fsync'd log on disk, then the **independent** `protocol/verify-ahd-seal.cjs` (zero Ahd code) recomputes VALID + INVALID-on-+1-SAR. Presenter beats Q&A-only (never in 3-min path). **Conservative floor: Technical 7.2→7.6, Innovation 7.5→7.6** (critics: 7.6/7.7/7.8 tech, 7.6/7.7/7.7 innov — Math.min taken). I re-verified myself: gate 2517/0, tripwire e2f48467 INTACT (portable Get-FileHash — the run-all RED was only PowerShell lacking `sha256sum`), demo exit 0, offline 9/0, spine PASS. **Honest cap (critic-named, kept):** it's a terminal moment a presenter runs by hand (not in-app), NOT gate-wired (only static-scanned +1), durability step asserts ≥2 lines but doesn't restart-replay in-run. Committed `fa30bdf`.
- **D1+D2 data rigor — DONE** (`wuhjbzqss`, 3 opus refute-critics, all delta-confirmed, **inflation=FALSE**). D1: `app/features/impact-band.js` — the settle card's single fragile ÷3 point is REPLACED as headline by a p10/p50/p90 sensitivity band over 200 deterministic seeded-LCG synthetic circles, netted via the golden engine through impact.js's DI shim (never reimplemented); band honestly WIDE (p10=0, p50≈307k, p90≈475k of 571,251 — old ~190k point demoted to a labelled interior reference), 54 TDD assertions. D2: real primary Findex 35.8% (KSA family/friends borrowing vs 13.7% high-income, World Bank Little Data Book 2022 p111, 2021, verbatim vs swarm/agent-3) added MEASURED to sources.js + EVIDENCE-BRIEF D-11 + impact «المصادر» panel; D-1 refreshed with corroborating 2022/2023 court series. **Conservative floor: Data 6.5→7.0** (all 3 critics 7.0). Re-verified myself: gate 2575/0 (bash), tripwire e2f48467 INTACT, offline 9/0, HEAD unchanged, golden byte-frozen. Committed `cfade54`.
  - **Honest caps (critic-named, kept):** band is synthetic-circle rigor, not new real data; wide band ≈ near-uninformative-but-honest; Findex is one 2021 stat, demand-ADJACENT (prevalence, not the relational-strain «why» — D-9 stays 🔴); real survey n≥150 (OT-A1) is the only lever to Data 8+.
  - **Known residuals (flagged, not faked):** (a) `tests/app/app-dom-smoke.cjs` FILES list omits impact-band.js → the gate renders the OLD fallback path; band-in-screen render is unit-tested + live-wired only, NOT gate-covered — fix in a polish pass. (b) deck-content-v2 Khanah-5 demand slide not yet rewritten to surface Findex (optional). (c) `findex_indicators.json` (untracked 92KB WB API dump at repo root, unreferenced) — gitignore/remove, never commit. (d) pre-existing run-all.cjs count quirk (suites whose summary line lacks the word "passed" — sources/impact-national — are excluded from the cited total; pass/fail unaffected).
- **F2+F3 feasibility — DONE** (`wjzrs9coi`, 3 opus refute-critics, all delta-confirmed, **inflation=FALSE**, docs-only 2 files). F2: PATH-TO-PRODUCTION.md Row 1 refreshed to the now-real T1 durable JSONL / T2 HMAC auth / T3 judge-visible demo / I1 verifier (was stale "in-memory/no-auth"), still honest about what's NOT built (cloud/PKI-TSA/Nafath/relational-DB); Row 2's five bare gate-names became concrete sequenced CITED checklists (SAMA sandbox cohort/exit/entity, Nafath-AES two-layer interface + L-11 🔴 assumed, RFC-3161 TSA post-sealBlock point + OT-SEAL5, PDPL data-residency). F3: new docs/evidence/unit-economics.md — every revenue figure computed LIVE from the shipped billing.js (per-seal 5 SAR flat, org 120/360/800/2000/2900 SAR/mo, bank 250k SAR/yr), two-contract/no-riba (loanChargeHalalas:0, margin can be 0 by design per AAOIFI SS-19 10/3/2), cost soft-lines all labeled 🔴 ESTIMATE, honestly a MODEL with zero signed customers. **Conservative floor: Feasibility 6→7.0** (all 3 critics 7.0). Re-verified myself: gate 2575/0 (bash), HEAD unchanged, critics independently ran the demo + grepped for granted-approval overclaims (none). **Cap held: the +1 is real runnable-backend substance + concrete roadmap, NOT moved gates — scholar/SAMA/Nafath/TSA/signed-pilot all at zero (human-gated, cap 7→8).** Committed `ddd3c0e`.
- **T4+T5+polish — DONE** (`wng3zrkxy`, 3 opus refute-critics, all delta-confirmed, **inflation=FALSE**). T4: `server/smoke-live.cjs` rewritten to bind ephemeral port 0 (no fixed-8225 collision), real HTTP round-trip reproducing both golden seals (main 6c9410b9… + NEW-1 0463…), wired into run-all.cjs as a META step (own line, excluded from product total, red-banners on fail) — proven non-flaky (worker 5+5 runs; I re-ran gate 2× = 2586/0 both). T5: additive public GET /health (static {ok:true}, mutating:false, TDD 5–6 assertions), zero-dep Dockerfile (pinned node:20.11.1-alpine, HEALTHCHECK), .dockerignore, honest README «localhost-hardened NOT cloud». Polish: impact-band.js added to app-dom-smoke FILES → band-in-screen now gate-covered (asserts band renders + old fallback headline GONE). Product 2575→**2586** (+11: health +5/6, dom-smoke band +6; suites 57→58), all citations swept, gate-drift 12/0. **Conservative floor: Technical 7.6→7.8** (all 3 critics 7.8). **Cap held honest: a Dockerfile is not a deployment (not build-tested — no docker binary; loopback-only bind), no cloud/TLS/residency, no full 5-property SEAL, no threat model → the +0.2 is CI-wire-parity + /health + coverage, not new capability.** Committed `<T4T5>`.
- **CEILING-BREAK RESEARCH PLAN LANDED** (`docs/superpowers/plans/2026-07-13-ceiling-break-8-9-plan.md`, separate research session, committed separately). Reopens a LARGE offline lever set the four-criteria plan missed — my earlier "offline exhausted / wind-down" call was PREMATURE. Verified the plan myself: rigorous, prior-art-checked, honestly gated, scores nothing. New offline levers now queued:
- **REVISED OFFLINE QUEUE (research-informed, ROI-ranked):**
  1. **رِفْق / OT-RIFQ** (Innovation→8) — mercy-first clearing: معسِر self-declares hardship + creditor co-witness → excluded from FORCED set-off, grace sealed as first-class event. Autonomous-safe as declared+consented ADDITIVE wrapper (pre-filter معسِر edges out, net the rest with golden UNCHANGED, defer+grace-seal excluded); no scoring (declared not inferred); log muqāṣṣa-consent fiqh question to DECISIONS-FOR-MARWAN (rule nothing). Biggest offline Innovation mover + memorability beat.
  2. **Seal-chain block** (Technical→8) — multi-block chain + Merkle RFC-6962 (direct, NOT merkletreejs default) + Ed25519 bank-sig (Node built-in, W3C-VC-DataIntegrity shape) + **rate-limiting** (OT-RATELIMIT, new grep-verified gap) + STRIDE/LINDDUN threat model (OT-THREATMODEL).
  3. **Data-rigor block** (Data→8) — full Findex decade series (OT-FINDEX25: 2024=30.4%, emergency-backstop rose to 38%) + bottom-up market band (OT-MKT, proxy-anchored loan-size 1k/5k/18k) + GASTAT-grounded fixtures (D3) + Nafith 34× proxy.
  4. **freeTSA live moment** (OT-TSA demo-grade) + **Open-Witness-as-standard** (OT-STD1: version/license/interop).
Live gate now **2586/0**. Human-gated (flag, never fake): D-4 pick ميراث الدَّين (Innov 8.5/9), scholar (muqāṣṣa consent + Hilah, Feas 8), survey OT-A1 (Data 8.5/9), emdha TSA/HSM/SAMA (Technical 8.5/9). Naming fix from research: **Nafith** not "e-SANAD"; confirm emdha cites RFC-3161 before relying.

## 4-criteria running scorecard (conservative floor, opus-refute-verified)
| Criterion | Panel base | Now | Committed levers |
|---|---|---|---|
| Technical | 6.5 | **7.8** | T1 persistence + T2 auth + T3 judge-visible + T4 CI wire-parity + T5 Dockerfile/health |
| Innovation | 7 | **7.6** | I1 Open-Witness protocol + verifier + T3 live-perceivable |
| Data | 6.5 | **7.0** | D1 sensitivity band + D2 real Findex stat |
| Feasibility | 6 | **7.0** | F1 real backend + F2 concrete cited roadmap + F3 two-contract economics |

**Commits on `judge-lens-real-leap` (branch only, never pushed): dc25ffb (loop1) · 26514ef (L2 data+docs) · 60c79aa (panel scorecard) · L2-iter3 · 6c7f1a3 (UX font) · 16a8553 (T1) · 5592bd5 (T2) · 5469d62 (I1) · fa30bdf (T3) · cfade54 (D1+D2) · ddd3c0e (F2+F3).**

### Human-gated unblocks (do any → the loop resumes real gains instantly)
1. FONT (UX→7.5+): drop an OFL Arabic woff2 in app/assets/fonts/, or authorize a download. (JL-7)
2. D-4 innovation pick (Innovation→8): choose the mechanism (recommend ميراث الدَّين).
3. Survey data (Data→7.5): distribute the kit, N≥30. (JL-8/OT-A1)
4. Scholar sign-off (Feasibility→7): Hilah + D-1/D-3/D-7.
5. Real persistence/auth/deploy (Technical→7.5): a build session, not a loop iteration.
6. Live rehearsal + decide weave-tear on default path (Memorability→7.5+). (JL-9)

### Wind-down rule
After iter3, autonomous offline leverage IS exhausted (verified against OPEN-ITEMS JL table). Keep a long-cadence watch (per owner "don't stop"), but spawn NO more workers until an unblock lands — «لا تقعد تمدح، نبغى شي حقيقي».

## LOOP 2 plan — "hardening & honest consolidation" (offline, no human deps, ≤4 agents/phase, opus critics)
1. **Full 6-criterion JUDGE-LENS panel re-score** of the committed current state (the project's required "fifth gate" before freeze) → honest current numbers + rank the highest-ROI remaining OFFLINE defects. Log any <8 as JL- items in _meta/OPEN-ITEMS.md.
2. **Fix accumulated residual defects** (all critic-verified, offline):
   - Data honesty: settlement.js «المقاسة»↔«لا رقمٌ مُقاس» contradiction; spurious precision «١٩٠٬٤١٧»/«380,834» → round; move the synthetic-circle caveat onto the settle card. (→ Data 6.5→7.)
   - Technical: wire server/smoke-live.cjs (over-the-wire parity) into the gate so CI proves HTTP parity, not just the pure router. (→ hardens Technical 7.)
   - UX: migrate remaining hardcoded font-size literals to tokens on judge-path screens (finish G2) — low judge-visibility, do only if cheap.
3. **Doc gate-number drift sweep** (gate-number-drift memory): CLAUDE.md + docs/pitch + deck + vault still cite 1874/2072; live is 2300. Single source = run-all.cjs banner.
4. **W6 Innovation** stays blocked: do NOT build ميراث الدَّين without the D-4 pick (inheritance-fiqh = spine-adjacent). At most, a proposal SPEC doc phrased as pending-approval — never wired into the app.
- Each item: sonnet build (xhigh) + opus refute critics, TDD, gate-green, commit checkpoint on success.
