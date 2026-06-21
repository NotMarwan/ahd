---
title: "عهد · Ahd — THE LEDGER (master forensic record of the 10_Deep round)"
tags: [ahd, ledger, forensic, recall, 10_Deep, agent/Claude-Ledger]
owner: Claude-Ledger (PROMPT 5 — the Ledger; exclusive owner of 10_Deep/Ledger/)
status: sealed-v1
updated: 2026-06-19
scope: "Every action of Prompts 1–4 (Review · Backend · Arsenal · Hardening) + the prior Ahd rounds (08_Ahd_Deep, 09_Finish) they build on. Read-only on every other lane — recorded, never edited."
---

# 🧾 THE LEDGER — total recall of the Ahd 10_Deep round

> **What this is.** One complete, trustworthy record of *everything every agent actually did* in the
> 10_Deep round — every file made/edited, every web source used, every test run, every decision and
> its reasoning, and every thread left open — verified against the real artifacts (not summarised from
> memory or the handoffs alone). If an agent did it and it isn't here, that's a defect.
>
> **The four companion files** drill into each axis: [[change-log]] (every file touched), [[decisions-register]]
> (every decision + why), [[sources-ledger]] (every source/stat/vector + confidence), [[open-threads]]
> (every unresolved item, prioritised).

---

## 0. OPERATOR SUMMARY — the whole picture in two minutes

**What this round was.** Phase **10_Deep** is the "go deeper + arm the room" round that sits *on top of*
the already-sealed Ahd thesis (round 08, the deepening sprint) and the stress-test (round 09, the
"Finish Line"). It was run as **four independent prompts**, each an exclusive-owner lane:

| Prompt | Lane | Agent | Did what, in one line | Output folder | DONE? |
|---|---|---|---|---|---|
| **1** | 🔬 Review | **Claude-C** | Cold-read audit of the whole thesis + the prototype's logic; found 7 build gaps, 18 consistency drifts, 15 ranked additions. | `Amad Obsidian Vault/AMAD-2026/10_Deep/Review/` (4 files) | ✅ (vault STATUS) |
| **2** | 🗄️ Backend | **Claude-Backend** | Took the data + back-end to implementation depth: 5 specs + a runnable Node reference engine + reproducible vectors + a prototype patch. | `10_Deep/Backend/` (6 docs + `ref/`) | ✅ (root STATUS) |
| **3** | 🎯 Arsenal | **"Arsenal"** (unnamed) | Built the citation-backed ammunition stockpile: KSA-primary demand, market macro, counsel-grade legal/Shariah, a 26-question Q&A war-room, a master index. | `Amad Obsidian Vault/AMAD-2026/10_Deep/Arsenal/` (5 files) | ✅ (vault STATUS) |
| **4** | 🛡️ Hardening | **Claude-Hardening** | Made the prototype provably deterministic, robust, offline & stage-stable — logic only, **zero** visual change; 92 automated assertions, 0 fail. | `10_Deep/Hardening/` (6 docs + `test-harness/` + `evidence/`) | ✅ (root STATUS) |
| **5** | 🧾 Ledger | **Claude-Ledger** | *This.* Captured the complete action trail of 1–4 + the prior rounds. | `10_Deep/Ledger/` | ✅ (this file) |

**The one structural fact the operator must know first — the round is split across TWO `10_Deep` folders.**
This is the single most important reconciliation finding in this ledger:

- **Prompts 2 & 4 (Backend, Hardening)** wrote to the **root** tree: `…\هاكاثون امد\10_Deep\` — with its own `STATUS.md` (2 DONE lines).
- **Prompts 1 & 3 (Review, Arsenal)** wrote to the **vault** tree: `…\هاكاثون امد\Amad Obsidian Vault\AMAD-2026\10_Deep\` — with its *own separate* `STATUS.md` (2 DONE lines).
- The prior rounds (`08_Ahd_Deep`, `09_Finish`) also live in the **vault** tree.
- **Neither STATUS.md is complete on its own.** A reader of the root STATUS never sees Review/Arsenal; a reader of the vault STATUS never sees Backend/Hardening. **This ledger is the only place all four lanes are recorded together.** (It lives in the root tree, alongside Backend/Hardening, because that is the working directory and where the most recent lanes posted.)

**What changed on disk this round (the short list — full detail in [[change-log]]):**
1. **Two new doc lanes in the vault** — `10_Deep/Review/` (4 audit files) and `10_Deep/Arsenal/` (5 ammunition files). *No source thesis files were edited by either.*
2. **One new doc + code lane in the root** — `10_Deep/Backend/` (5 specs + `test-vectors.md` + a runnable `ref/` engine + a `prototype-compute-patch.md`).
3. **One new hardening lane in the root** — `10_Deep/Hardening/` (6 reports + an 8-file Node/Playwright `test-harness/` + 3 real-Chrome screenshots).
4. **The live prototype `project/ahd-demo/index.html` was hardened in place** (logic/robustness only, by Claude-Hardening) — *every on-screen hash/balance/verdict is byte-identical to before*. A pre-edit snapshot was preserved at `10_Deep/Backend/ref/index.html.orig`.
5. **Two STATUS boards + the coordination log** got their DONE/coordination lines.

**The state of the thesis after this round (honest):** **🟢 strong and now well-armed, with the same two
round-deciders still open** that round 09 named — **(A1) a shard of *primary Saudi demand*** and
**(A2) a firm-specific "why Alinma, not Al Rajhi" moat**. The Arsenal (P3) *substantially closed A1's
documentation-demand half* with KSA-primary court/registry data and gave A2 a rehearsed rebuttal; the
Review (P1) confirmed the thesis is "championship-grade and unusually honest" but flagged that **the
prototype claims more than it builds** (no real FSM, Muqassa has no consent step, a forbidden `%` trust
ring) and that **several refuted claims never propagated from the dossier back into the source layers**.
Hardening (P4) made the demo unbreakable; Backend (P2) gave the data/crypto real proofs and a runnable
engine. **Nothing was lost; the open items are validation steps and prototype-truthfulness fixes, not redesigns.**

**What to do next (from the agents' own punch-lists — consolidated in [[open-threads]]):**
- **Before the pitch (non-code, round-deciders):** get one shard of primary KSA demand (15–20 interviews / Arabic-Splitwise review mining); put the Al-Rajhi concede-then-wedge answer in the deck.
- **Prototype-truthfulness (≈1.5–2 build-days, each closes a gap + a contradiction + a red-team hit):** kill the `%` trust ring → 3-band; build the real event-sourced FSM + a seeded DEFAULTED/DISPUTED ahd; add Muqassa per-member consent; negation-proof the riba-linter; put the KSA anchor on step 0.
- **Cheap, high-value text fixes (≈30 min):** propagate three corrections into the source layers — Musaned "forces both sides" (C10), "each party settles exactly once" (C15), ETL Art. 8 → **Art. 14** (C1).
- **Optional depth (post-demo):** apply `10_Deep/Backend/prototype-compute-patch.md` (JCS-depth SEAL + computed trust signal) and re-pin Hardening's golden vectors to the new seal `f7999f87…`.

**Where everything lives:** §3 (this file) is the per-agent action trail with links; [[change-log]] is the
file-by-file diff; [[decisions-register]] is every decision; [[sources-ledger]] is every source/stat/vector;
[[open-threads]] is the consolidated to-do.

---

## 1. The cast — who was active, and what each owned

Reconstructed from `.agent-presence/*.json`, `.agent-presence/coordination_notes.md`, the two STATUS
boards, the 20 handoffs, and the artifacts themselves. **Six agents touched this round; six more (sub)agents
ran in the prior rounds.** All ran on `claude-opus-4-8`.

### This round (10_Deep)
| Agent | Session | Role | Exclusive namespace | Touched the shared prototype? |
|---|---|---|---|---|
| **Claude-C** | 10:30–11:40 | Full Reviewer (P1) | vault `10_Deep/Review/` | Read-only (audited its logic; edited nothing) |
| **Claude-Hardening** | 13:21–13:52 | Reliability/hardening (P4) | root `10_Deep/Hardening/` + the **JS logic** of `index.html` | ✅ Edited logic/robustness only (zero styling) |
| **Claude-Backend** | 13:22–14:06 | Data & Back-end (P2) | root `10_Deep/Backend/` | ❌ Did **not** edit it (handed off a patch instead) |
| **"Arsenal"** | (vault STATUS, 2026-06-19) | Evidence/ammunition (P3) | vault `10_Deep/Arsenal/` | No |
| **Claude-Ledger** | this session | Forensic recorder (P5) | root `10_Deep/Ledger/` | Read-only everywhere |

### Prior rounds (context — full trail in §4)
| Agent | Round | Role | Namespace |
|---|---|---|---|
| **Claude-A** | 08 | Solo author + integrator of the deep thesis | `08_Ahd_Deep/**` (layers, dossier, shared) |
| **Claude-Workflow** | 08 | A *parallel 20-agent workflow* that also wrote 08 (interleaved with Claude-A) | `08_Ahd_Deep/**` (incl. the verification-ledger) |
| **Claude-Orchestrator** | 08 | Built/deepened the prototype | `project/ahd-demo/**` |
| **Agent 1–4** | 09 | Red-Team · Fix-up · Consumer-Soul · Integrator | `09_Finish/{RedTeam,Fixup,Consumer,FINAL}/` |

> **Coordination headline:** the operator repeatedly launched **multiple sessions with overlapping
> mandates** (solo-vs-parallel in round 08; "one editor" that actually ran as parallel sessions in round
> 09; two logic agents on one file in round 10). **Every collision was avoided by the agent-awareness
> protocol** — claims, heartbeats, stale-claim takeovers, and function-level partitions logged in
> `coordination_notes.md`. **No clobber is recorded anywhere.** The one durable artefact of the round-08
> overlap: provenance of `08_Ahd_Deep/**` is *mixed* between Claude-A and Claude-Workflow (both wrote it),
> with the **verification-ledger** uniquely Claude-Workflow's. (See [[open-threads]] OT-12.)

---

## 2. Round map — how 08 → 09 → 10 fit together

```
08_Ahd_Deep  (the DEEPENING SPRINT)            → vault tree
   Claude-A (solo) + Claude-Workflow (20-agent parallel, interleaved) + Claude-Orchestrator (prototype)
   Output: 4 layer docs, 00_MASTER_DOSSIER, 00_Shared/{contracts S1–S15, objection-killer,
           verification-ledger (15 verdicts: 3 hold/11 partial/1 refuted), BUILD-LOG, …}
           + project/ahd-demo/index.html (SHA-256 chain + tamper verifier + Muqassa + trust viz)
   Score self-assessed 85 → ~92/100.

09_Finish    (the FINISH LINE / stress-test)   → vault tree
   4 hard-locked lanes: Red-Team (12 attacks, 1 FATAL) · Fix-up (KSA stats + live riba-linter)
                        · Consumer-Soul (C1 gift-receipt + C2 يُسر = the missing soul) · Integrator
   Verdict: 🟢 GO with 2 conditions (prove demand; answer Al Rajhi). Round-deciders = A1, A2.

10_Deep      (THIS round — deeper + armed)      → SPLIT across both trees
   P1 Review (vault)  — audits 08+09+prototype; finds the build is thinner than claimed.
   P2 Backend (root)  — makes the data/crypto real & reproducible (engine + vectors).
   P3 Arsenal (vault) — builds the evidence/rebuttal stockpile; closes most of A1.
   P4 Hardening (root)— makes the prototype unbreakable & deterministic.
   P5 Ledger  (root)  — records all of it (this).
```

The four 10_Deep lanes are **complementary, not overlapping**: Arsenal *builds the ammunition*, Review
*audits the thesis + prototype + cross-file consistency*, Backend *proves the compute*, Hardening *locks
the demo*. Each lane cross-referenced the others (Review §6 reconciles with Arsenal; Backend's patch
defers to Hardening's freeze; Hardening's README cites Review's FSM/linter flags).

---

## 3. THE ACTION TRAIL — what each Prompt-1–4 agent actually did

> Captured at the level of *actions and reasoning*, not just outcomes. Every artifact is linked; every
> claim here was checked against the file.

### 3.1 — PROMPT 1 · 🔬 The Full Review (Claude-C)
**Asked to:** cold-read the entire Ahd thesis + the prototype's *logic* and report what's solid vs
hand-waved, the gaps, the cross-file inconsistencies, and ranked substance additions — **flag, never edit.**

**Concrete actions taken:**
- **Read** the master dossier, all 4 deep layers, the shared `contracts`/`objection-killer`/`verification-ledger`, all of `09_Finish`, and the *running logic* of `index.html` (SHA-256, canonicalization, the chain+verifier, netting, the riba-linter, the "state machine").
- **Wrote 4 files** to `10_Deep/Review/` (exclusive lane): [[../Review/full-review|full-review.md]] (end-to-end map + an honest solid-vs-handwaved table per layer), [[../Review/gap-register|gap-register.md]] (G1–G16 + a red-team "sealed-that-isn't" cross-check G-RT1–5), [[../Review/consistency-report|consistency-report.md]] (X1–X18, exact loci + the correct fix text), [[../Review/proposed-additions|proposed-additions.md]] (P1–P15, ranked by impact × effort).
- **Discovered the parallel Arsenal lane mid-review** and added reconciliation addenda to all four files (it closes A1/A2 and independently confirms the Art.14 / M/18 citations) — *updating its own overstated flags rather than leaving them.*
- **Appended its DONE line** to the **vault** `10_Deep/STATUS.md`. Logged a clean exit in `coordination_notes.md` (~11:40). **Edited nobody's files.**

**Key findings delivered (the substance):**
- **The build is thinner than the docs claim (7 gaps):** no event-sourced FSM (it's a `step` counter) [G1]; Muqassa runs *without the consent step* the fiqh depends on [G2]; the reputation rings render a forbidden numeric **`%`** (violates contract S9) [G3]; the riba-linter is keyword-only → false-blocks "بلا فائدة" [G4]; the trust signal is a hardcoded table, not a computation [G5]; the SEAL is ~3 of its 5 specified properties (single-block chain, no TSA/bank-sig/Merkle) [G6]; step 0 still shows unlabeled US stats [G7].
- **Refuted/corrected claims never propagated to the source layers (the highest-value, cheapest fixes):** Musaned "forces both sides" still live in growth §3.5/§3.7/§8 [X1/C10]; "each party settles exactly once" still in product §7/§8 [X2/C15]; ETL signature-equivalence still cited as **Art. 8** not **Art. 14** in legal §3.1 [X3/C1]; Muqassa still called "minimum" in legal §4.2 [X4].
- **Red-team "seals" cross-check:** A6/A10 marked SEALED rest on the C1/C2 screens that *aren't built*; A2 "ANSWERED" is a *plan to build* a moat; A1 is now *largely closed* by the Arsenal lane (only the relational-strain shard remains); A9/A11 honestly open.
- **One-line verdict:** "championship-grade thinking, the honesty is the moat — but make the prototype tell the truth about itself, and propagate the ledger's corrections back into the layers."

**Left open:** all flags are for their owners (it fixed nothing). Top-5 build-now = P1–P5.

---

### 3.2 — PROMPT 2 · 🗄️ The Data & Back-end (Claude-Backend)
**Asked to:** take Ahd's data + back-end from "sound concept, proof partly missing" to **implementation
depth**, with a runnable reference and reproducible vectors, and strengthen the prototype's computational
truth (logic only, never styling).

**Concrete actions taken:**
- **Wrote 6 specs** to `10_Deep/Backend/` (exclusive lane):
  - [[../Backend/muqassa-deep|muqassa-deep.md]] — formal netting model; **proofs** of conservation, the ≤P−1 bound, single-sidedness; **honest NP-hard optimality** + a *machine-found* worst case (greedy 4 vs optimal 3, both plans `verifyPlan`-checked) + an exact solver; partial payments, multi-currency (net per-currency, never cross-net), mid-cycle default (2-phase-commit saga + compensation), consent-revocation rollback.
  - [[../Backend/seal-scheme-spec|seal-scheme-spec.md]] — the SEAL to byte depth: RFC-8785 JCS rules + conformance vectors, the **exact preimage of every hash** (terms→h, Nafath binding, TSA, envelope, leaf, bank-sig, with `_t` domain-separation tags), RFC-6962 Merkle checkpoint + a worked inclusion proof, and a machine-checkable, tamper-*localising* verification procedure (intact / single-field / reorder / key-reorder-control / replay).
  - [[../Backend/trust-signal-and-graph-analytics|trust-signal-and-graph-analytics.md]] — the non-credit trust signal (windowed, time-decayed kept-ratio) + a **4-point structural proof it cannot become a credit score**; graph analytics (cycle detection feeding Muqassa, settlement-efficiency metrics, k-anonymous bank aggregates).
  - [[../Backend/backend-architecture|backend-architecture.md]] — services; the **append-only** data model (immutable header + event log, `status = fold(events)`); the **complete** state machine (every transition · guard · emitted event); the four seams (Nafath/TSP/sarie/RFC-3161) with sequence flows; the exact trust boundary; the REST APIs.
  - [[../Backend/test-vectors|test-vectors.md]] — every computed claim, reproducible from one command, with the cross-engine note.
  - [[../Backend/prototype-compute-patch|prototype-compute-patch.md]] — a ready-to-apply logic-only drop-in (Patch A: computed trust signal; Patch B: JCS-depth SEAL) handed to the file's owner.
- **Built a runnable Node reference engine** in `ref/`: `ahd-ref.mjs`, `generate-vectors.mjs`, generated `vectors.json`, and `index.html.orig` (a pre-edit snapshot of the prototype). `node ref/generate-vectors.mjs` reproduces every vector.
- **Ran verification:** Node — SHA-256 NIST self-test PASS; every vector regenerates; Merkle proof verifies + rejects a forged leaf; intact/tamper/reorder/replay behave; Muqassa conservation holds; the worst-case greedy>optimal found & both plans verified; trust bands compute. **Real Chrome (read-only)** — 0 console errors; the integrated demo computes seal `6c9410b9…`, balances نورة−900/خالد+600/فهد+300, netting 9→2, tamper caught. **Cross-engine proof** — injected its JCS-SEAL into the *live page* via the page's own from-scratch SHA-256 → reproduced the documented vectors byte-identical (`terms_hash ceedb1e9…`, `leaf f7999f87…`, `bank_sig 8f1d28a5…`, `MATCHES_VECTORS:true`) ⇒ **Node ≡ Chrome**.
- **Coordinated, then chose NOT to edit `index.html`:** spotted the collision with Claude-Hardening on the same file, partitioned by function-region in `coordination_notes.md` (13:46), then — once Hardening exited 13:52 having *already* delivered integer-halalas money + exact-integer Muqassa (2 of its 3 planned compute edits) behind a frozen 92-assertion golden-vector harness — **decided to hand off** the remaining 2 upgrades as a patch rather than break the demo-day golden vectors. (See [[decisions-register]] D-09.)
- **Appended its DONE line** to the **root** `10_Deep/STATUS.md`; wrote `handoffs/handoff-20.md`; exited clean (14:06).

**Left open:** apply `prototype-compute-patch.md` post-demo (and re-pin Hardening's golden vectors to seal `f7999f87…`); S9 `%`→band-word swap (handed to Design); the riba-linter FP (Hardening's lane); the source-layer citation drifts (Review's lane).

---

### 3.3 — PROMPT 3 · 🎯 The Arsenal (exclusive owner "Arsenal")
**Asked to:** build an always-ready, citation-backed ammunition stockpile that closes the round-deciders
(A1 demand, A2 "why Alinma") and arms every room (deck · Q&A · judges · Shariah board · SAMA · investors),
with every load-bearing claim graded 🟢 solid / 🟡 proxy / 🔴 pending — no invented citations.

**Concrete actions taken (5 files in vault `10_Deep/Arsenal/`):**
- [[../Arsenal/demand-evidence-ksa|demand-evidence-ksa.md]] — the **KSA-primary demand pack** that closes red-team **A1**: promissory notes = **58.6% of 571,251 execution-court enforcement requests / SAR 115.4B over 11 months** (Argaam, 2020–21); 43M+ Najiz e-services (H1 2024); Nafith 800k digital سند; SAR 213B remittances; 2.25M+ freelancers; SAMA's consumer-promissory-note restriction — and **relabels the US relational %s "illustrative, KSA pending"** with a 3-tier primary-data plan (interviews / survey / court-refresh) to close the residual relational-strain shard (D-9).
- [[../Arsenal/market-and-stats-arsenal|market-and-stats-arsenal.md]] — the market macro arsenal (population 35.3M / 44.4% expat; Nafath 23.5M / ~75%; 79% cashless; Findex ~74%; sarie ≤SAR 20k; Vision-2030 80%-cashless + 525-fintech targets; SAMA Sandbox 50 permitted/19 active) with **TAM/SAM/SOM labelled MODEL** and bank-economics labelled illustrative.
- [[../Arsenal/legal-shariah-citations|legal-shariah-citations.md]] — the counsel-grade legal/Shariah pack that **RESOLVED** the long-standing drifts: ETL official decree = **M/18** (27 Mar 2007 per laws.boe.gov.sa; M/8 = a legacy variant); signature-equivalence = **Art. 14** (not Art. 8); Evidence-Law M/43 burden-shift (Art. 58); emdha = CST/DGA-licensed TSP; PDPL enforceable 14-Sep-2024; AAOIFI SS-19 (actual-direct-cost cl.10/3/2, Hilah cl.7/8); 2:282/2:280 grounding — each with a named/linked source or an honest 🔴 pending/counsel tag.
- [[../Arsenal/rebuttal-playbook|rebuttal-playbook.md]] — the Q&A war-room: ~26 hard questions (A–H) incl. the **A2 concede-then-wedge** answer (graded 🟡, contingent on execution).
- [[../Arsenal/ARSENAL-INDEX|ARSENAL-INDEX.md]] — the master index sorting every fact three ways (by fact / by objection / by confidence), the "6 facts that carry the pitch," and a confidence ledger naming the 6 remaining 🔴 validation items.

**Verification posture:** every claim carries 🟢/🟡/🔴. **No invented citations** — 🔴 items are named as validation steps, not papered over. (See [[sources-ledger]] for the full source list with links.)

**Left open:** 6 named 🔴 validation items — the KSA relational-strain demand shard (D-9), Nafath-AES permission for private debt (L-9), Alinma board fee sign-off, accredited CSP/TSA binding, exact Evidence-Law article numbers + date, and a 2024–25 court promissory-note refresh.

---

### 3.4 — PROMPT 4 · 🛡️ The Performance Hardening (Claude-Hardening)
**Asked to:** make the prototype `index.html` provably deterministic, robust, offline, and stage-stable —
**logic/robustness only, ZERO visual/styling changes.**

**Concrete actions taken:**
- **Safety net first:** ran the *current* code in Node and froze every value-bearing output to `test-harness/golden-vectors.json` (`_capture-current.cjs`), so every later change is *proven* to reproduce the original bytes.
- **Edited `project/ahd-demo/index.html` (logic/robustness only):**
  - **Determinism locked** — replaced ICU-dependent `fmt()` (`toLocaleString`) with hand-rolled Intl-free grouping (a silent cross-engine hash-drift risk, since `fmt` feeds the *signed* terms); moved money to **integer halalas** (no float; `toMinor`/`minorToFixed2`); converted netting to an **integer core with a deterministic NODES-index tiebreak**; pinned the riba regexes as stateless (no `/g`); confirmed **no `Math.random`/`Date.now`/`new Date`/`Intl`** in the logic region.
  - **Robustness guards** — a single **state machine `S`** owning all timers; `go()` **cancels every timer before each transition** (kills the orphaned-`setInterval`-writes-to-detached-DOM bug, F1); a **double-tap guard** on Nafath confirm + record issues **exactly once**; **exhaustive null-guards** on every DOM write; an **offline fallback** card on any thrown render (F6); **Esc/Home** reset; navigation **clamped** to valid screens.
  - **Structure** — split a pure DOM-free logic region (`// ===AHD-LOGIC:BEGIN/END===` markers) from the render region; named pure `sealBlock`/`verifyRecord`; relocated the stateless riba engine; exposed only `window.go`/`window.confirmPerson`.
- **Wrote 6 reports + a test harness + evidence** to `10_Deep/Hardening/`: `README.md`, `determinism-audit.md`, `robustness-report.md`, `function-contracts.md`, `test-results.md`, `stability-report.md` (incl. the **exact presenter click-path**); `test-harness/` (`run-tests.cjs` 62 · `offline-check.cjs` 9 · `dom-smoke.cjs` 21 · `browser-smoke.mjs` · `load-logic.cjs` · `_capture-current.cjs` · `golden-vectors.json`); `evidence/` (3 real-Chrome screenshots).
- **Ran tests:** **92 automated assertions, 0 failures** (62 + 9 + 21), **byte-identical run-to-run** (`diff` clean), the harness *slicing the real shipped logic* and pinning it to frozen golden vectors. **Real Chrome (Playwright MCP):** 0 console errors/warnings; exactly **1** network request (the page); seal `6C9410B9…` **identical across reload**; tamper caught; settlement → ذمّة محفوظة; Muqassa 9→2, Σ=900; clamps + Esc reset work.
- **Coordination:** took `index.html` cleanly from Claude-Orchestrator (stale heartbeat 10:05, claim expired 12:01, build task COMPLETE) — logged the takeover; touched logic only; left `08_Ahd_Deep/**` and `10_Deep/Backend/**` untouched. **Appended its DONE line** to the **root** `10_Deep/STATUS.md`; wrote `handoffs/handoff-19.md`; exited 13:52.

**Deliberate non-change (documented):** the riba-linter's negation false-positive (`بلا فائدة` → over-blocks)
was **left as-is on demo day** — fixing Arabic negation the day-of risks the one behaviour that *must* hold
(the penalty chip must block); the FPs are pinned as `[known FP]` tests and a negation-guard patch sketch is
handed to product/Design. (See [[decisions-register]] D-12.)

**Left open:** the riba-linter negation FP (patch sketched, not applied); re-run the harness if logic changes again.

---

## 4. The prior rounds — condensed action trail (context for the above)

### 4.1 — Round 08 · the Deepening Sprint (`08_Ahd_Deep/`)
- **Claude-A (solo author + integrator).** Web-grounded the load-bearing facts (Evidence Law M/43, ETL, Nafath, sarie, AAOIFI fee, KSA market) and locked them into `contracts.md`; authored all four deep layers (Legal/Shariah, Tech/Security, Growth, Product), then **fused `00_MASTER_DOSSIER.md`** and consolidated the objection-killer. **Independently verified the prototype** (headless 14/14 NIST + invariants; real-Chrome 0-console) and applied honesty fixes to `index.html` (admissibility wording ×3, Muqassa wording, favicon). Self-assessed score **85 → ~92**. (`handoffs/handoff-13`.)
- **Claude-Workflow (a parallel 20-agent run).** Began *before any presence file existed*, so it never saw Claude-A's claim; ran 20 agents to completion and wrote the full `08_Ahd_Deep` (4 layers, 4 shared files, the dossier) interleaved with Claude-A — and uniquely produced the **`verification-ledger.md`** (15 load-bearing claims vs primary sources: **3 hold / 11 partial / 1 refuted**), the round's fingerprint. It then stood down to avoid further clobber.
- **Claude-Orchestrator (the prototype).** Deepened `project/ahd-demo/` — the real from-scratch **SHA-256 hash-chain + live tamper verifier**, the **Muqassa conservation proof** (9→2), and the **trust-network SVG + kept-promises rings** — and browser-verified it (0 console errors, NIST vectors pass, tamper detected). Later went stale; Hardening took the file over cleanly.
- **The verification-ledger's 15 verdicts (C1–C15)** are the spine of everything downstream — full table in [[decisions-register]] §A and [[sources-ledger]].

### 4.2 — Round 09 · the Finish Line (`09_Finish/`)
Four hard-locked lanes (each an exclusive folder; one DONE line each in `09_Finish/STATUS.md`):
- **Agent 1 · Red-Team** — 12 attacks (**1 FATAL: A2 Al Rajhi**, 9 serious, 2 cosmetic); 4 NEW HOLES (A1 demand unvalidated, A2 moat, A8 depth mis-allocated vs Track-2 CX, A10 dunning-vs-warmth). `RedTeam/red-team-report.md`.
- **Agent 2 · Fix-up** — re-sourced the lending stats to KSA anchors (سند لأمر, 43M Najiz e-services, SAR 213B remittances; US %s relabeled); **built + browser-verified the LIVE riba-linter** in the prototype (10/10 checks, 0 console errors); housekeeping. `Fixup/fixup-log.md` (+ edits to `index.html`, dossier §2/§10, growth layer, business-case, BUILD-LOG).
- **Agent 3 · Consumer-Soul** — walked the real prototype as 3 personas; named **C1 (gift-receipt invite) + C2 (يُسر safety net)** as the product's missing soul (both seal A6/A10). `Consumer/{consumer-journey,embrace-additions}.md`.
- **Agent 4 · Integrator** — triaged all 12 attacks, answered the orphaned A2 with a firm-specific wedge, re-weighted the demo to the CX panel, and called **🟢 GO with 2 conditions** (prove demand; answer Al Rajhi). `FINAL/{final-verdict,demo-v2,go-no-go}.md`. (`handoffs/handoff-18`.)

---

## 5. Reconciliation findings (things the operator would otherwise have to reconstruct)

1. **The split round (two `10_Deep` trees, two STATUS files).** Documented in §0. *Usability fix:* read both STATUS boards, or read this ledger. (See [[open-threads]] OT-01.)
2. **Two SEAL schemes coexist, with two different hash sets.** The **shipped/frozen** prototype uses the round-08 custom newline `canonical()` → content `f8d11335…`, **seal `6c9410b9…`**, terms_hash `94572857…`. The **Backend spec + patch** uses RFC-8785 **JCS** → terms_hash `ceedb1e9…`, **leaf `f7999f87…`**, bank_sig `8f1d28a5…`. They are *deliberately* not reconciled on demo day (applying the patch would change demo-verified hashes and break the golden vectors). The patch + re-pin is a documented post-demo step. (OT-04.)
3. **`index.html` was edited by Hardening but NOT by Backend.** Final on-disk mtime 2026-06-19 13:36; logic owned by Hardening; styling/markup untouched since the Orchestrator/round-09 build. A pre-edit snapshot is preserved at `Backend/ref/index.html.orig` (48,776 B vs the shipped 49,604 B — a real diff exists, useful for audit).
4. **Round-08 provenance is mixed** (Claude-A + Claude-Workflow both wrote `08_Ahd_Deep/**`); the verification-ledger is uniquely Claude-Workflow's. Two synthesis passes (85→~93 and ~92) co-exist, reconciled to the ledger. Nothing lost. (OT-12.)
5. **A second, divergent handoff series exists** at `C:\Users\PCD\Desktop\دما نوثاكاه\handoffs\` (handoff-14/15), separate from the project series at `…\هاكاثون امد\handoffs\` (1–20). handoff-18 flags this and recommends consolidation. (OT-13.)
6. **The Review (P1) and Backend (P2) both flagged the same source-layer drifts** (Musaned C10, "each party once" C15, ETL Art.14) — independent confirmation that those three text fixes are the cheapest high-value action. (OT-05.)

---

## 6. Verification statement (how this ledger was built)
Every entry above was checked against the real files, opened this session: both `STATUS.md` boards; all 5
`.agent-presence/*.json` + `coordination_notes.md`; the 4 Review files; the 5 Arsenal files; the 6 Backend
specs + the `ref/` inventory; the 6 Hardening reports + the `test-harness/` + `evidence/` inventory; the
08 `verification-ledger`, `BUILD-LOG`, and 09 `STATUS`/`final-verdict`/`go-no-go`; and handoffs 18/19/20.
File inventories and sizes were taken directly from disk. Where a presence file or handoff *claimed* something
(e.g. Claude-C's "DONE line in 10_Deep/STATUS.md"), the claim was reconciled against the actual file and the
**split-tree** truth recorded rather than the claim. **This ledger records what happened; it changed nothing
in any other lane.**

---

## Links
- Companion files: [[change-log]] · [[decisions-register]] · [[sources-ledger]] · [[open-threads]]
- This round (root): [[../Backend/backend-architecture]] · [[../Hardening/README]] · `10_Deep/STATUS.md`
- This round (vault): `Amad Obsidian Vault/AMAD-2026/10_Deep/{Review,Arsenal}/` + its own `STATUS.md`
- Prior rounds (vault): `08_Ahd_Deep/00_MASTER_DOSSIER.md` · `08_Ahd_Deep/00_Shared/verification-ledger.md` · `09_Finish/FINAL/go-no-go.md`
- The artifact: `project/ahd-demo/index.html` (+ `Backend/ref/index.html.orig` pre-edit snapshot)
