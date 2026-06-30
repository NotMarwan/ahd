---
title: "عهد · Ahd — OPEN-THREADS TRACKER (every unresolved item, deduplicated + prioritized)"
tags: [ahd, ledger, open-threads, todo, 10_Deep, agent/Claude-Ledger]
owner: Claude-Ledger (PROMPT 5)
status: sealed-v1
updated: 2026-06-19
---

# 🧵 OPEN-THREADS TRACKER — so nothing falls through the cracks

> Every unresolved item, flag-for-counsel, pending validation, "demo-now vs v2" addition, and residual risk
> surfaced anywhere this round — **consolidated, deduplicated, prioritized**, each with its source file and
> owner. Many items were raised by *multiple* lanes (Review + Backend + 09 go-no-go all flag the same
> citation drift, etc.); those are merged into one row noting every source. **OT-IDs are stable references**
> used across the other ledger files.
>
> **Priority key:** 🔴 **P0** = round-decider / close before the pitch · 🟠 **P1** = strongly recommended
> (prototype-truthfulness / cheap high-value) · 🟡 **P2** = depth, housekeeping, pre-production validation ·
> ⚙️ **STRUCT** = project-structure/coordination hygiene.

---

## 🔴 P0 — round-deciders (close before the pitch)

| ID | Open thread | Why it matters | Owner | Source(s) |
|---|---|---|---|---|
| **OT-A1** | **One shard of *primary KSA demand*** (relational-strain): 15–20 interviews / Arabic-Splitwise & wallet review mining / a tiny survey — *one real Saudi voice* on the warmth axis. | The whole thesis rests on demand. Arsenal closed the *documentation-habit/scale* half (D-1…D-7); this is the residual relational shard **D-9**. Re-sourcing scale ≠ demand proof. | Team (pre-pitch, non-code) | Review G8/P6 · Arsenal D-9 / §5 plan · 09 go-no-go P0-1 · red-team A1 |
| **OT-A2** | **The firm-specific "why Alinma, not Al Rajhi" answer** in the deck + demo close: category land-grab + own «عهد» + ≥1 exclusive distribution partner (HRSD/Musaned or property-manager) + circle network-lock-in. | A2 was graded **FATAL**; silence loses the round. The rebuttal exists (🟡) but the moat is a *strategy to build*, not yet realized. | Team/strategy | Review G9/P7 · Arsenal rebuttal A2 · 09 final-verdict §2 / go-no-go P0-2 · red-team A2 |
| **OT-SOUL** | **Build the two soul screens — C1 (gift-receipt invite) + C2 (يُسر safety net).** | The emotional center Track-2 CX scores; they *seal* red-team A6 + A10 (currently "sealed-in-design only," because the screens aren't built). ~1–1.5 build-days. | Build team | 09 go-no-go P0-3 / Consumer C1/C2 · Review G-RT1/G-RT2/P9 |

---

## 🟠 P1 — prototype-truthfulness (each closes a build gap + a contradiction + a red-team hit)

> Review's Tier-1 (P1–P5) — the highest-leverage ~1.5–2 build-days; "make the prototype tell the truth about
> itself." All are **logic/back-end**, additive to the Arsenal/docs.

| ID | Open thread | Closes | Effort | Source |
|---|---|---|---|---|
| **OT-PCT** | **Kill the numeric `%` reputation ring → a self-facing 3-band glyph; make the ratio a *computed* windowed kept-ratio** (not a hardcoded `REP` table). | G3 + G5 + contract **S9** + consumer C8 — the rings *are* the credit-score display the thesis swears it doesn't have. | Low | Review P1/G3/G5/X7/X16 · Backend Patch A + `trust-signal` A3 · Hardening (flagged to Design) · Backend handoff-20 §5-2 |
| **OT-FSM** | **Build the real event-sourced state machine** (`events[]` + `fold→status`) + seed a **DEFAULTED** and a **DISPUTED** ahd. | G1 + red-team A3 + K20 ("show me a defaulted/disputed agreement"); dossier §9 lists "state machine = Real (built)" which is currently false (it's a `step` counter). | Medium | Review P2/G1/X14 · Backend `backend-architecture §3` |
| **OT-CONSENT** | **Add the per-member consent step to Muqassa** (consented novation) before the "after" graph commits. | G2 — the fiqh/legal validity keystone of netting; "consented Muqassa" is claimed built + demo-v2 narrates consent cards that don't exist. | Low–Med | Review P3/G2/X15 · Backend `muqassa-deep §8` |
| **OT-RIBA** | **Negation-proof the riba-linter** (a leading `بلا/دون/بدون/عدم/لا` flips a hit to clean). | G4 — the centerpiece can be made to fail live (`بلا فائدة` → wrongly BLOCKED); it even fails its own seeded terms. | Low | Review P4/G4/X17 · Hardening `robustness-report` (known FP, patch sketched, **not applied on demo day** — see OT-RIBA-NOW) |
| **OT-STEP0** | **Update prototype step 0 to lead with the KSA demand anchor**; label any US figure "illustrative, KSA pending." | G7 — step 0 still shows unlabeled US stats, re-committing A1 on the opening screen + contradicting demo-v2 Beat 0. | Low | Review P5/G7/X18 · 09 fixup (relabel) |
| **OT-RIBA-NOW** | *Decision note (not a bug):* the riba negation FP was **deliberately left in for demo day** (fixing Arabic negation day-of risks the must-block penalty path). Apply OT-RIBA **off-stage** with the pinned `[known FP]` tests as the net. | Demo-day safety. | — | Hardening `robustness-report` / decision **D-12** |

### P1 — cheap source-layer text fixes (≈30 min total; flagged by 2+ lanes independently)
| ID | Open thread | Owner | Source |
|---|---|---|---|
| **OT-X1** | Propagate **C10**: growth layer §3.5/§3.7/§8 still say Musaned "forces both sides / fixes k<1" — the single biggest refutation. Rewrite to the C10 form. | Agent-3 (growth) owner | Review X1/G-list · Backend handoff-20 §5-4 · ledger C10 |
| **OT-X2** | Propagate **C15**: product layer §7/§8 still say "each party settles exactly once" (self-contradicts its own §3.6). → "≤ P−1; a party may appear in >1 transfer." | Agent-4 (product) owner | Review X2 · ledger C15 |
| **OT-X3** | Propagate **C1**: legal layer §3.1/§5 still cite ETL **Art. 8** for signature-equivalence → **Art. 14** (Arsenal L-2 + ledger C1 agree; the layer is now the *lone* outlier). Also §4.2 "minimum" → "≤ P−1 (NP-hard)". | Agent-1 (legal) owner | Review X3/X4 · Arsenal L-2 · ledger C1 |
| **OT-P1other** | Borrower's standalone reason to sign (A11): make «ذِمّة محفوظة» a **borrower-invokable release** (إبراء) + a borrower-protections panel. Build the **يُسر grace** as real state logic. Re-weight the deck to CX (A8). | Build/product | Review P8/P9 · 09 go-no-go P1 · red-team A8/A11 |

---

## 🟡 P2 — depth, housekeeping, pre-production validation

| ID | Open thread | Owner | Source |
|---|---|---|---|
| **OT-PATCH** | **Apply `Backend/prototype-compute-patch.md` post-demo** (Patch A computed trust signal + Patch B JCS-depth SEAL) and **re-pin Hardening's golden vectors** to the new seal `f7999f87…`. One mechanical apply. | Build (post-demo) | Backend `prototype-compute-patch` / handoff-20 §5-1 |
| **OT-SEAL5** | Complete the SEAL to a true multi-block chain + labeled RFC-3161 TSA + bank-sig + Merkle (the prototype is ~3/5 properties). | Build (v2) | Review P10/G6 · Backend `seal-scheme-spec` |
| **OT-DEPTH** | v2 mechanisms: duress/coercion flag (T1, P11) · dispute-export bundle button (P12) · recurring-covenant object (P13) · AML/collusion signal (P14) · on-screen attestation-boundary panel (P15). | Build (v2) | Review P11–P15 · Backend `backend-architecture §5` |
| **OT-VAL** | **Pre-production validations (name honestly, never assert on stage):** Nafath-AES permission for interpersonal debt (A9/L-9) · Alinma Shariah-board sign-off on the fee + two-contract separation (L-4) · accredited CSP/TSA for full signature weight (A4/C5/L-10). | Team / counsel | Arsenal §4 · 09 go-no-go P2 · ledger C2/C5/C13 |
| **OT-CITE** | Counsel-confirm the **exact Evidence-Law article numbers + publication date** and finalize **M/8↔M/18** everywhere (Arsenal resolved official=M/18; the objection-killer A.#2 + legal §3.1 diagram still carry bare "M/8"). Refresh the **2024–25 court promissory-note** breakdown (D-1 is 2020–21). | Counsel / Agent-1 | Arsenal §4 / L-1/L-2 · Review X8/X9/X10 · ledger C5 |
| **OT-IDSTATE** | Reconcile the **`ahd_id` type** (ULID vs UUIDv7 vs base32 vs the prototype string) and the **state-name vocabulary** (C4 vs S5 vs tech vs product; decide whether FORGIVEN/إبراء is a first-class state). Declare S5 the binding enum. | Contracts owner | Review X5/X6 |
| **OT-LINKS** | Fix the dangling wikilink `contracts.md:74 [[../Agent-2/layer-tech]]` → `layer-tech-security`; re-anchor the dead `staff4all.org` Nafath-reach source (404) in growth §3.1/§5 + business-case; point dossier §6 demo-hook at demo-v2 (still uses the US hook). | Contracts / Agent-3 / dossier owners | Review X11/X12/X13 · ledger C9 |
| **OT-M9** | Refresh the exact smartphone-penetration figure (~97%) pre-pitch (M-9 is "refresh"). | Team | Arsenal M-9 |

---

## ⚙️ STRUCT — project-structure & coordination hygiene (operator-level)

| ID | Open thread | Why it matters | Source |
|---|---|---|---|
| **OT-01** | **The round is split across two `10_Deep` trees with two separate `STATUS.md` boards** (root: Backend+Hardening; vault: Review+Arsenal). Neither is complete alone. *Consider consolidating into one tree, or keep this ledger as the single index.* | An operator reading one STATUS misses half the round. | This ledger §0 / §5-1 |
| **OT-04** | **Two SEAL schemes / two hash sets coexist** — shipped demo (custom canonical, seal `6c9410b9…`) vs Backend spec/patch (JCS, leaf `f7999f87…`). Intentional on demo day; resolve via OT-PATCH. | Anyone diffing the spec vs the demo will see different hashes; document, don't "fix" before the demo. | This ledger §5-2 · sources-ledger §5/§6 |
| **OT-12** | **Round-08 provenance is mixed** — Claude-A (solo) and a parallel 20-agent Claude-Workflow both wrote `08_Ahd_Deep/**` (interleaved); two synthesis passes (85→~93 and ~92) co-exist, reconciled to the ledger; the **verification-ledger is uniquely Claude-Workflow's**. Keep that ledger + its corrections canonical. Nothing lost. | A future editor should know `08_Ahd_Deep` has two voices and which document is whose. | `coordination_notes` (Claude-Workflow) · BUILD-LOG |
| **OT-13** | **A second, divergent handoff series exists** at `C:\Users\PCD\Desktop\دما نوثاكاه\handoffs\` (handoff-14/15), separate from the project series `…\هاكاثون امد\handoffs\` (1–20). Consolidate to one canonical series. | Two diverged handoff trails are easy to lose. | handoff-18 "Location note" |
| **OT-14** | **Dedup the two Agent-1 legal layer files** (`layer-legal.md` + `layer-legal-shariah-regulatory.md`); the gem-merge was logged then **corrected as NOT executed**. Pick one canonical, update BUILD-LOG table + dossier links. | Housekeeping; two files invite drift. | BUILD-LOG "Correction + status" · Claude-A presence note |
| **OT-15** | **dossier §9 "Real (built)" overstates the code** — lists state machine + consented Muqassa + computed trust as built. Either build (OT-FSM/OT-CONSENT/OT-PCT) **or** soften §9 to "specified; prototype demonstrates the spine." | A judge who opens §9 then inspects the code sees the gap (red-team A3). | Review §3/§4/G1 |

---

## Dedup notes (so the same item isn't chased twice)
- **A1/demand** appears as red-team A1, Review G8/P6, Arsenal D-9, 09 go-no-go P0-1 → all merged into **OT-A1**.
- **A2/Al Rajhi** = red-team A2, Review G9/P7, Arsenal rebuttal A2, 09 §2 → **OT-A2**.
- **The `%` trust ring** = Review G3/G5/X7/X16/P1, Backend Patch A, Hardening Design-flag, 09 C8/embrace-#8 → **OT-PCT**.
- **Riba negation FP** = Review G4/P4, Hardening known-FP, Backend handoff-20 §5-3 → **OT-RIBA** (+ the demo-day decision **OT-RIBA-NOW**).
- **Citation drift (Art.14 / M18 / date)** = Review X3/X8/X9/X10, Arsenal L-2, ledger C1/C5/C12, 09 fixup residual → **OT-X3** + **OT-CITE**.
- **Pre-production validations (A4/A9 + board)** = Arsenal §4, 09 go-no-go P2, ledger C2/C5 → **OT-VAL**.

---

## Links
- [[00_LEDGER]] · [[change-log]] · [[decisions-register]] · [[sources-ledger]]
- Punch-lists this consolidates: `Review/gap-register.md` · `Review/proposed-additions.md` · `Review/consistency-report.md` · `Arsenal/ARSENAL-INDEX.md §4` · `09_Finish/FINAL/go-no-go.md` · `handoffs/handoff-20.md §5`
