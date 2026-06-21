---
title: "عهد · Ahd — CHANGE-LOG (every file touched this round + what changed + why)"
tags: [ahd, ledger, change-log, 10_Deep, agent/Claude-Ledger]
owner: Claude-Ledger (PROMPT 5)
status: sealed-v1
updated: 2026-06-19
---

# 📒 CHANGE-LOG — every file the 10_Deep round touched

> A diff-level summary in plain language, so the operator sees the project's whole evolution at a glance.
> **N** = newly created this round · **E** = edited in place · **·** = pre-existing, untouched (listed where it
> matters for context). Each row: *who · what changed · why.* Paths are relative to the project root
> `C:\Users\PCD\Desktop\هاكاثون امد\`; vault paths are prefixed `vault:` = `Amad Obsidian Vault\AMAD-2026\`.

---

## A. The live artifact — `project/ahd-demo/index.html`  ⚠️ the only shared file edited

| | File | Who | What changed | Why |
|---|---|---|---|---|
| **E** | `project/ahd-demo/index.html` | **Claude-Hardening** (P4) | **Logic/robustness only, ZERO visual change.** `fmt()` ICU `toLocaleString` → hand-rolled Intl-free grouping; money → integer halalas (`toMinor`/`minorToFixed2`, `AG.amount_minor=500000`); `canonical()` formats from integer halalas (byte-identical to old `toFixed(2)`); `netting()` → integer core, exact `===0` (epsilons removed), deterministic NODES-index tiebreak; named pure `sealBlock`/`verifyRecord`; riba engine relocated into a pure region behind `// ===AHD-LOGIC:BEGIN/END===` markers; single state machine `S` owning all timers; `go()` cancels timers + clamps + try/catch→`renderFallback`; double-tap guard; record issues once; exhaustive null-guards; Esc/Home reset; only `window.go`/`window.confirmPerson` exposed. | Make the demo provably deterministic, robust, offline & stage-stable for hour-70/bad-Wi-Fi conditions — **without** altering any on-screen hash/balance/verdict (all golden-pinned). |
| **·** | `project/ahd-demo/index.html` | **Claude-Backend** (P2) | **NOT edited.** Its two compute upgrades (JCS-depth SEAL, computed trust signal) were handed off as `Backend/prototype-compute-patch.md` instead. | Hardening had just frozen the logic behind a 92-assertion golden-vector harness; force-applying would change demo-verified hashes and break the golden vectors on demo day. |
| **·** | `project/ahd-demo/index.html` | **Claude-C** (P1) | **NOT edited** — only its *logic* was read & audited. | Reviewer mandate is flag-don't-fix; every prototype gap is a flag for the owner. |
| **·** | `project/ahd-demo/README.md` | — | Untouched this round (last write 2026-06-19 02:11, round 08/09). | — |

> **Net effect on the demo:** identical to the eye, deterministic underneath. Final mtime 2026-06-19 13:36;
> 49,604 bytes (vs the 48,776-byte pre-edit snapshot at `Backend/ref/index.html.orig`).

---

## B. PROMPT 1 · Review lane — `vault:10_Deep/Review/` (all NEW, by Claude-C)

| | File | What it is | Why created |
|---|---|---|---|
| **N** | `vault:10_Deep/Review/full-review.md` | End-to-end map of how Ahd works + an honest solid-vs-handwaved table per layer + the red-team "are the open items actually closed?" cross-check. | The cold-read audit deliverable; the one-line verdict + per-layer state. |
| **N** | `vault:10_Deep/Review/gap-register.md` | G1–G16 substance/build gaps (severity-rated) + G-RT1–5 "sealed-that-isn't" red-team cross-check. | Itemise every gap with locus, why-it-matters, severity, and a suggested fix. |
| **N** | `vault:10_Deep/Review/consistency-report.md` | X1–X18 internal contradictions / stale citations / drift, each with exact locus + the correct fix text. | The "two files disagree" set — the cheapest, highest-value fixes (the dossier was corrected, the source layers weren't). |
| **N** | `vault:10_Deep/Review/proposed-additions.md` | P1–P15 substance additions ranked by impact × effort; the build-now five (P1–P5). | What would make Ahd materially stronger (mechanisms, not styling). |

*No source files edited by this lane.*

---

## C. PROMPT 2 · Backend lane — `10_Deep/Backend/` (all NEW, by Claude-Backend)

| | File | What it is | Why created |
|---|---|---|---|
| **N** | `10_Deep/Backend/muqassa-deep.md` | Formal netting model + proofs (conservation, ≤P−1, single-sided) + honest NP-hard optimality + machine-found worst case + exact solver + partial/multi-currency/default-saga/revocation cases. | Take the netting from "runs in the demo" to a proven, edge-case-complete spec. |
| **N** | `10_Deep/Backend/seal-scheme-spec.md` | The SEAL to byte depth: JCS rules + every hash preimage + RFC-6962 Merkle + worked inclusion proof + tamper-localising verify procedure. | Convert "tamper-evident, court-admissible" from a label into a machine-checkable fact. |
| **N** | `10_Deep/Backend/trust-signal-and-graph-analytics.md` | Non-credit trust signal (windowed decayed kept-ratio) + 4-point structural non-credit-score proof + graph analytics (cycles, efficiency, k-anonymous aggregates). | The /01 Data criterion as real, specified, testable computation. |
| **N** | `10_Deep/Backend/backend-architecture.md` | Services + append-only data model (`status=fold(events)`) + complete state machine + 4 seams w/ sequence flows + trust boundary + REST APIs. | The production form behind the prototype's seams. |
| **N** | `10_Deep/Backend/test-vectors.md` | Every computed claim, reproducible from one command, w/ the cross-engine note. | Make every number re-derivable, not hand-typed. |
| **N** | `10_Deep/Backend/prototype-compute-patch.md` | Logic-only drop-in: Patch A (computed trust signal replacing static `REP`), Patch B (JCS-depth SEAL). | Hand the two remaining compute upgrades to the file owner without clobbering the frozen build. |
| **N** | `10_Deep/Backend/ref/ahd-ref.mjs` | The runnable Node reference engine (`jcs`, `buildSchedule`, SEAL preimages, `greedyNetting`, `conservation`, `findCycles`, `efficiency`, `minTransfersExact`, `verifyPlan`, `trustSignal`, Merkle). | Browser-independent source of truth for every vector. |
| **N** | `10_Deep/Backend/ref/generate-vectors.mjs` | Emits §0–§6 of `test-vectors.md` (human + `--json`). | One-command reproduction. |
| **N** | `10_Deep/Backend/ref/vectors.json` | The generated machine-readable vectors. | Pinned output. |
| **N** | `10_Deep/Backend/ref/index.html.orig` | A pre-edit snapshot of the prototype (48,776 B). | Audit baseline / safety copy before the compute upgrades were (not) applied. |

*No source files edited by this lane; `index.html` deliberately not touched (see §A).*

---

## D. PROMPT 3 · Arsenal lane — `vault:10_Deep/Arsenal/` (all NEW, by "Arsenal")

| | File | What it is | Why created |
|---|---|---|---|
| **N** | `vault:10_Deep/Arsenal/demand-evidence-ksa.md` | KSA-primary demand pack (سند = 58.6% of execution requests / SAR 115.4B; 43M Najiz; Nafith 800k; remittances; freelancers; SAMA سند restriction) + a 3-tier primary-data plan; US %s relabeled. | Close red-team **A1** (demand void) with Saudi-primary, not US-proxy, evidence. |
| **N** | `vault:10_Deep/Arsenal/market-and-stats-arsenal.md` | Market macro arsenal (population, Nafath reach, cashless %, Findex, sarie, Vision-2030, FSDP, SAMA Sandbox) + TAM/SAM/SOM labelled MODEL. | Answer "is it real / niche?" + feasibility with sourced macro facts. |
| **N** | `vault:10_Deep/Arsenal/legal-shariah-citations.md` | Counsel-grade legal/Shariah pack; **resolves** ETL = M/18, signature = Art.14, M/43 burden-shift, emdha TSP, PDPL, AAOIFI SS-19, Qur'anic grounding — each sourced or 🔴-tagged. | Make the legal grilling survivable + fix the citation drift the dossier carried. |
| **N** | `vault:10_Deep/Arsenal/rebuttal-playbook.md` | The Q&A war-room: ~26 questions (A–H) incl. the A2 concede-then-wedge. | Arm the room for every objection. |
| **N** | `vault:10_Deep/Arsenal/ARSENAL-INDEX.md` | Master index (by fact / by objection / by confidence) + the 6 pitch-carrying facts + the 🔴 confidence ledger. | One place to find any fact in seconds during a pitch. |

*No source files edited by this lane.*

---

## E. PROMPT 4 · Hardening lane — `10_Deep/Hardening/` (all NEW, by Claude-Hardening)

| | File | What it is |
|---|---|---|
| **N** | `10_Deep/Hardening/README.md` | Read-order + one-line proof + cross-references to Review/Backend. |
| **N** | `10_Deep/Hardening/determinism-audit.md` | Every run-to-run variance source found (locale `fmt`, float money, netting order, stateful-regex, clocks) + how each was locked; the locked-invariant table. |
| **N** | `10_Deep/Hardening/robustness-report.md` | Failure modes F1–F7 + guards + the offline proof; the documented riba-linter negation FP + a negation-guard patch sketch (not applied). |
| **N** | `10_Deep/Hardening/function-contracts.md` | The pure-vs-render split, the state machine `S`, and a contract per pure function. |
| **N** | `10_Deep/Hardening/test-results.md` | All suites green (62+9+21=92), reproducible; the real-Chrome live table. |
| **N** | `10_Deep/Hardening/stability-report.md` | The headline evidence + the **exact presenter click-path** + the changed-vs-not list. |
| **N** | `10_Deep/Hardening/test-harness/run-tests.cjs` | 62 logic assertions (SHA-256 NIST, canonical golden, seal/chain, tamper, fmt, Muqassa, riba, determinism guards, reload). |
| **N** | `10_Deep/Hardening/test-harness/offline-check.cjs` | 9 offline-invariant assertions (no external script/style/font/img, no fetch/XHR/etc.). |
| **N** | `10_Deep/Hardening/test-harness/dom-smoke.cjs` | 21 headless render+robustness assertions (clamp, double-tap, timer-clear, fallback). |
| **N** | `10_Deep/Hardening/test-harness/browser-smoke.mjs` | Playwright real-browser script (run live via Playwright MCP). |
| **N** | `10_Deep/Hardening/test-harness/load-logic.cjs` | Slices the *real shipped* logic region out of `index.html` for the Node harness. |
| **N** | `10_Deep/Hardening/test-harness/_capture-current.cjs` | Froze the pre-hardening outputs to `golden-vectors.json` (the safety net). |
| **N** | `10_Deep/Hardening/test-harness/golden-vectors.json` | The frozen golden vectors every change is proven against. |
| **N** | `10_Deep/Hardening/test-harness/README.md` | How to run the harness. |
| **N** | `10_Deep/Hardening/evidence/ahd-hardening-01-verified.png` | Real-Chrome: clean record verified ✓ سليمة. |
| **N** | `10_Deep/Hardening/evidence/ahd-hardening-02-tamper-caught.png` | Real-Chrome: tamper → ✗ عبثٌ مكشوف. |
| **N** | `10_Deep/Hardening/evidence/ahd-hardening-03-conservation.png` | Real-Chrome: Muqassa conservation, Σ=900. |

---

## F. Coordination + status files (appended-to, not rewritten)

| | File | Who | What changed |
|---|---|---|---|
| **E** | `10_Deep/STATUS.md` (root) | Claude-Hardening, Claude-Backend | Each appended **one DONE line** (P4 then P2). Append-only board. |
| **E** | `vault:10_Deep/STATUS.md` | "Arsenal", Claude-C | Each appended its DONE line (Arsenal P3, Reviewer P1). |
| **E** | `.agent-presence/coordination_notes.md` | Hardening, Backend, Claude-C (+ prior: Orchestrator, Claude-A, Claude-Workflow) | Coordination entries: Hardening's takeover of `index.html` (13:21), Backend's function-level partition (13:46), both clean exits (13:52, 14:06); Claude-C's reviewer exit (~11:40). |
| **E/N** | `.agent-presence/Claude-Hardening.json`, `Claude-Backend.json`, `Claude-C.json` | each agent | Presence/heartbeat records (all now `exited`). `Claude-A.json`, `Claude-Orchestrator.json` are prior-round. |
| **N** | `handoffs/handoff-19.md` | Claude-Hardening | The P4 handoff. |
| **N** | `handoffs/handoff-20.md` | Claude-Backend | The P2 handoff. |
| **E** | `10_Deep/STATUS.md` (root) + `vault:10_Deep/STATUS.md` | **Claude-Ledger** (P5) | This ledger's DONE line(s) — see [[00_LEDGER]] §0. |

> **Note on handoffs:** Review (P1) and Arsenal (P3) did **not** add numbered handoffs — they handed off via
> the vault `STATUS.md` DONE lines + `coordination_notes.md`. Only Hardening (19) and Backend (20) added
> numbered handoffs this round. A *separate* divergent handoff series exists outside the project (see
> [[open-threads]] OT-13).

---

## G. What was explicitly NOT changed (and by whose discipline)

- **The thesis (`08_Ahd_Deep/**`) — untouched this round.** Review/Backend/Arsenal all flagged the source-layer drifts (Musaned C10, "each party once" C15, ETL Art.14, the "minimum" netting) but **edited nothing** — those remain for the layer owners. (See [[open-threads]] OT-05.)
- **All visual styling/CSS/markup/copy of the prototype — untouched.** Hardening changed the engine, not the paint; every shown hash/balance/verdict is byte-identical to pre-hardening. The S9 `%`→band-word swap is handed to Design, not applied.
- **`99_RETIRED_DO-NOT-OPEN/` and `project/99_RETIRED_DO-NOT-OPEN/`** — not opened/changed (retired tadfuq-rizq work).

---

## Links
- [[00_LEDGER]] · [[decisions-register]] · [[sources-ledger]] · [[open-threads]]
