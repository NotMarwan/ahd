---
title: "عهد · Ahd — DECISIONS REGISTER (every decision + rationale + source)"
tags: [ahd, ledger, decisions, 10_Deep, agent/Claude-Ledger]
owner: Claude-Ledger (PROMPT 5)
status: sealed-v1
updated: 2026-06-19
---

# 🧭 DECISIONS REGISTER — no decision is a black box

> Every meaningful decision made by any agent this round (plus the load-bearing corrections from round 08
> that this round depends on): **the decision · who/what made it · the reasoning · the source/evidence.**
> Recorded faithfully — not re-litigated.

---

## A. The 15 load-bearing claim-verdicts (round-08 verification-ledger — the spine everything rests on)

> Source: `08_Ahd_Deep/00_Shared/verification-ledger.md` (authored by Claude-Workflow). **3 hold · 11 partial
> · 1 refuted.** These are the corrections the *dossier* adopted; Review (P1) found several never reached the
> *source layers* (see §D). Compressed here; full primary sources in [[sources-ledger]].

| # | Claim | Verdict | The decision adopted |
|---|---|---|---|
| **C1** | Nafath-bound e-iqrar admissible under Evidence Law M/43; e-sig = handwritten effect. | partial | **Citation fix:** signature-equivalence = **ETL Art. 14**, not Art. 8 (Art. 8 = integrity test). Evidence is **presumptive/rebuttable**, burden on the challenger. |
| **C2** | Flat amount-independent fee on a separate wakala contract isn't riba. | partial | Say **actual DIRECT cost**; the two-contract device is the **most contestable** element (AAOIFI SS-19 cl.7/8 Hilah); **Alinma's board must approve**; free/float sidesteps it. |
| **C3** | Ahd engages no finance licence; only payments. | partial | Finance-licence point holds; **in-flight funds = Safeguarded Funds** (PSP-grade duties); the **Sandbox is time-boxed** → run as agent on the bank's licensed rails. |
| **C4** | Guest e-signing for tourists powers virality. | **mostly refuted** | **Tourists have no Iqama → no Nafath → no AES.** Re-scope growth to **~35M Nafath-eligible residents**; tourist tier = thin fallback. |
| **C5** | The SEAL satisfies M/43 integrity. | partial | "unequivocally clear…" is **law-firm commentary, not statute** (cite ETL Art.8 imported by M/43 Art.57); crypto integrity ≠ certified-signature — needs **accredited PKI/CSP**. |
| **C6** | sarie ≤ SAR 20k, credit-push, standing-mandate-or-confirm. | **holds** | Holds; "no daily cap" is scheme-level only; >SAR 20k must split. |
| **C7** | Flat actual-cost fee clean; %-of-loan = riba. | partial | **actual DIRECT cost**; soften "structurally forbidden"; board approval still needed. |
| **C8** | Greedy netting ≤ n−1, O(E+n log n), not the minimum (NP-hard). | **holds** | Holds; prototype uses a sorted two-pointer sweep (same complexity/result). |
| **C9** | A non-customer can complete a binding e-signature via Nafath alone. | partial | **Nafath alone = authentication → presumptive evidence only**; full QES weight needs a **licensed-CSP certificate**. (Cited basis staff4all.org = 404.) |
| **C10** | Musaned e-salary mandate **forces both sides** of the rail, fixing k<1. | **REFUTED** | **The single biggest correction.** Mandate is **one-sided (employer→closed WPS wallet)**; guarantees mass wallet/KYC presence (lowers onboarding friction) but does **NOT** create a two-sided interpersonal rail or fix k<1 — needs a separate GTM. |
| **C11** | Organic k≈0.36 (<1) → not viral, and honesty beats "viral." | partial | State **k ≲ 0.36 under generous assumptions (realistic 0.10–0.36)**; separate the Musaned regulatory channel from organic k. |
| **C12** | Integrity-chained e-record "original" under M/43. | partial | **Mis-attribution fix:** original-vs-presumptive dichotomy is **ETL Arts. 8–9, not M/43**. |
| **C13** | A bank may fee a qard only as a flat actual-cost charge. | partial | **actual DIRECT cost**; **Alinma-specific premise UNVERIFIED** → state conditionally; pick the **wakala/amana basis**. |
| **C14** | Nafath authenticates; the weighted e-signature is issued by a CST/DGA-licensed TSP. | **holds** | Holds; emdha issues an **AES** (max tier QES); emdha is one TSP not the only path. |
| **C15** | Greedy guarantees each party settles **exactly once** (≤ P−1). | partial | **WRONG: "exactly once."** Counterexample [+1,+2,+3,+4,−5,−5]. Correct: **≤ P−1**, a party may appear in >1 transfer. Soften copy "fewest" → "few/efficient." |

---

## B. PROMPT 4 (Hardening) decisions

| # | Decision | Who | Rationale | Source/evidence |
|---|---|---|---|---|
| **D-01** | **Capture golden vectors of the current build *before* touching anything.** | Claude-Hardening | "Locked" must be a re-runnable assertion, not a claim; gives a regression net for every later edit. | `test-harness/_capture-current.cjs` → `golden-vectors.json`. |
| **D-02** | **Replace `fmt()`'s `toLocaleString` with Intl-free grouping.** | Claude-Hardening | `toLocaleString` is ICU-build-dependent (small-ICU Node drops grouping) and `fmt` feeds the **signed terms → terms_hash → seal** — so a formatting drift would silently change a "tamper-evident" legal hash. | `determinism-audit.md §1`; pinned in `run-tests.cjs §5,§8`. |
| **D-03** | **Move all money to integer halalas (1 SAR = 100); exact `===0` netting (drop the 1e-6 epsilons).** | Claude-Hardening | Float division + `toFixed` drift; epsilon comparisons can misclassify a balance as "almost zero." | `determinism-audit.md §2`; matches Backend's `amount_halalas`. |
| **D-04** | **Deterministic netting tiebreak by NODES index (not `localeCompare`).** | Claude-Hardening | Equal balances otherwise resolve engine-dependently; `localeCompare` is itself locale-dependent. | `determinism-audit.md §3`; `netting` identical across 100 runs. |
| **D-05** | **One state machine `S` owning all timers; cancel timers before every transition.** | Claude-Hardening | Kills the orphaned-`setInterval`-writes-to-detached-DOM crash (the named bug class) when a presenter navigates mid-scan. | `robustness-report.md F1`; `dom-smoke.cjs`. |
| **D-06** | **Wrap every render in try/catch → an offline `renderFallback` card.** | Claude-Hardening | Hour-70/bad-Wi-Fi: even a total failure must have a clean recoverable path, never a blank/broken page. | `robustness-report.md F6`. |
| **D-07** | **Do NOT change any styling/CSS/markup/copy; hand visual fixes (incl. S9 `%`) to Design.** | Claude-Hardening | Explicit prompt guardrail; preserve byte-identical on-screen output; appearance is Design's lane. | `stability-report.md` "changed vs not". |
| **D-08** | **Leave the SVG trig geometry (`pos`/`edgeSVG`/`nodeSVG`) untouched.** | Claude-Hardening | `Math.cos/sin` may differ sub-ULP across engines, but every coord is `.toFixed(1)`-masked and is *rendered presentation*, not a computed/legal value; editing it would be a visual change. | `determinism-audit.md` "out of scope". |

---

## C. PROMPT 2 (Backend) decisions

| # | Decision | Who | Rationale | Source/evidence |
|---|---|---|---|---|
| **D-09** | **Hand off the JCS-SEAL + computed-trust upgrades as a patch; do NOT edit `index.html`.** | Claude-Backend | Hardening had just frozen the logic behind a 92-assertion golden-vector harness; the upgrades are **depth-additive, not corrective** — force-applying would change demo-verified hashes (`6c9410b9…` → `f7999f87…`) and break golden vectors on demo day. Two of the three planned compute edits (integer money, exact Muqassa) were already delivered by Hardening. | `prototype-compute-patch.md` "Why"; `coordination_notes.md` 13:46; `handoff-20 §4`. |
| **D-10** | **Use RFC-8785 JCS (not ad-hoc `JSON.stringify`) for canonicalization.** | Claude-Backend | Two servers must hash the same agreement to the same bytes; ad-hoc stringify is non-deterministic (key order, whitespace, number/Unicode form). Integer-only domain makes JCS's hard float cases vanish; Node+Chrome share V8 → byte-identical. | `seal-scheme-spec.md §2`. |
| **D-11** | **Net per-currency, never cross-net currencies.** | Claude-Backend | Cross-currency offset would force the bank to set an FX rate — a pricing/trading act outside the amana/wakala posture and a gharar risk. | `muqassa-deep.md §7.2`. |
| **D-11b** | **Execute Muqassa as a 2-phase-commit saga with per-leg consent (novation); never a silent counterparty swap.** | Claude-Backend | Each netted leg is a consented hawala/novation — the fiqh/legal validity keystone; a mid-cycle default rolls back to the original sealed bilateral debts (no party worse off). | `muqassa-deep.md §7.3, §8`; `backend-architecture.md §3.3`. |
| **D-11c** | **Make the trust signal structurally incapable of being a credit score (4 enforced properties); expose `band`, never a number.** | Claude-Backend | Compliance shield + moat: no cross-party inference, no PD semantics, no bureau export, no underwriting — each a machine-checkable guard flag. | `trust-signal-and-graph-analytics.md A2`; contract S9. |
| **D-11d** | **Adopt RFC-6962 (Certificate Transparency) Merkle hashing verbatim, with 0x00/0x01 domain separation.** | Claude-Backend | Court/audit-recognised; the prefixes block second-preimage leaf↔node swaps; anti-rewrite even by the bank. | `seal-scheme-spec.md §4`. |

---

## D. PROMPT 1 (Review) decisions / dispositions

| # | Decision | Who | Rationale | Source/evidence |
|---|---|---|---|---|
| **D-12** | **Flag, never edit — every issue is for its owner.** | Claude-C | Reviewer independence; avoid clobber across the multi-agent project. | `consistency-report.md` rule; presence file. |
| **D-13** | **Rank the prototype-truthfulness fixes (P1–P5) highest because each closes a build gap + a consistency contradiction + a red-team hit simultaneously.** | Claude-C | Maximum leverage per build-hour; converts three red-team partials into running code for ~1.5–2 days. | `proposed-additions.md` Tier-1. |
| **D-14** | **Name the three cheapest highest-value text fixes: propagate C10, C15, C1 into the source layers.** | Claude-C | The dossier was corrected; the *layers it cites* still carry the refuted versions — a judge who opens a layer finds the wrong claim. ~30 min of edits removes three live, judge-catchable contradictions. | `consistency-report.md §A` X1/X2/X3. |
| **D-15** | **On finding the parallel Arsenal lane mid-review, update the overstated flags rather than leave them.** | Claude-C | Honesty: A1 is now largely closed and Art.14/M18 are independently confirmed by Arsenal — say so, don't leave G8/G9/P6/P7 overstated. | `full-review.md §6`; addenda in all 4 Review files. |
| **D-16** | **Treat red-team "seals" resting on unbuilt C1/C2 as "sealed-in-design," not sealed.** | Claude-C | A6/A10 marked SEALED depend on screens go-no-go itself lists as P0-to-build; a seal that isn't realized in code is a design intention. | `gap-register.md §D` G-RT1/2. |

---

## E. PROMPT 3 (Arsenal) decisions

| # | Decision | Who | Rationale | Source/evidence |
|---|---|---|---|---|
| **D-17** | **Lead the demand case with KSA-PRIMARY data; relabel US relational %s "illustrative, KSA pending."** | "Arsenal" | Re-sourcing *scale* is not *demand proof* (the red-team's own caveat); KSA court/registry data on the documentation *habit* is the defensible foundation. | `demand-evidence-ksa.md`; `ARSENAL-INDEX §1`. |
| **D-18** | **Resolve ETL decree: official = M/18 (27 Mar 2007, laws.boe.gov.sa); M/8 = a legacy/secondary variant.** | "Arsenal" | A real source disagreement (BoE vs MCIT/WIPO) — resolve to the official BoE text so the citation stops drifting. | `legal-shariah-citations.md` L-2; confirms ledger C1/C12. |
| **D-19** | **Grade every load-bearing claim 🟢/🟡/🔴; name the 6 remaining 🔴 as validation steps, never bluff.** | "Arsenal" | "Candor scores; bluffing loses" — own the gaps as named closing actions, not redesigns. | `ARSENAL-INDEX §4, §5`. |
| **D-20** | **Answer A2 (Al Rajhi) as concede-then-wedge, graded 🟡 (contingent on execution).** | "Arsenal" (+ round-09 Agent 4) | The tech is copyable and "Islamic-ness" is shared; the honest moat is category land-grab + own «عهد» + ≥1 exclusive distribution partner + circle network-lock-in — a strategy, not a realized moat, so grade it 🟡. | `rebuttal-playbook.md` A2; `09 final-verdict §2`. |

---

## F. Cross-round structural / coordination decisions

| # | Decision | Who | Rationale | Source |
|---|---|---|---|---|
| **D-21** | **Round 08 ran SOLO (Claude-A) after the parallel dispatch left only shared seeds** — "one coherent dossier, not four disconnected docs." | operator + Claude-A | Best fit for the win condition. (A separate parallel 20-agent workflow nonetheless completed and interleaved — provenance is mixed; the verification-ledger is uniquely its output, recommended kept canonical.) | `BUILD-LOG`; `coordination_notes` (Claude-Workflow). |
| **D-22** | **Yield/partition on every file collision rather than override an active claim.** | Orchestrator→A (08); Backend↔Hardening (10) | Agent-awareness protocol: never override an active claim; partition by function-region or yield the slice. Result: zero clobber all round. | `coordination_notes.md` throughout. |
| **D-23** | **Take a stale+expired claim cleanly (Hardening took `index.html` from Orchestrator).** | Claude-Hardening | Orchestrator heartbeat >3h stale, claim expired 12:01, build task COMPLETE — protocol permits a documented takeover. | `coordination_notes.md` 13:21; `handoff-19 §5`. |
| **D-24** | **Round-09 call: 🟢 GO with 2 conditions (prove demand; answer Al Rajhi).** | Agent 4 (Integrator) | Thesis unbreakable on defensibility but over-built relative to demand evidence + firm-specific moat; both closable before the build. | `09 go-no-go.md`. |

---

## Links
- [[00_LEDGER]] · [[change-log]] · [[sources-ledger]] · [[open-threads]]
- Spine: `08_Ahd_Deep/00_Shared/verification-ledger.md` · `08_Ahd_Deep/00_Shared/contracts.md` (S1–S15)
