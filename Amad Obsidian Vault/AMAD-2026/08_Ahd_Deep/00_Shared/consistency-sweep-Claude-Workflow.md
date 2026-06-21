---
title: "08_Ahd_Deep — Consistency Sweep (post-collision reconciliation)"
tags: [ahd, consistency-sweep, agent/workflow]
updated: 2026-06-19
---

# 🧹 Consistency Sweep — Claude-Workflow

> Operator-approved pass to reconcile the dossier after three sessions (this parallel workflow + solo Claude-A + the prototype builder) interleaved writes in `08_Ahd_Deep/`. The master dossier was already correct; these fixes bring the **source-layer docs** into line and ground two contested legal citations via web sources. Logged here (not in `BUILD-LOG.md`) to avoid colliding with Claude-A's live use of that file.

## Fixes applied (all surgical, grounded, Edit-guarded)

| # | File · locus | Was | Now (corrected) | Why |
|---|---|---|---|---|
| 1 | `Agent-4/layer-product-demo.md` §3.6 L125 | "كل طرفٍ يدفع أو يقبض **مرّةً واحدة فقط**" / "everyone pays-or-receives **exactly once**" | "كل طرفٍ **إمّا يدفع فقط أو يقبض فقط**… بما لا يتجاوز (عدد الأطراف − ١) تحويلًا" / "only pays **or** only receives, never both; ≤ (parties−1) transfers" | **Factual error.** "Exactly once" is false — a star pattern (one hub paying N spokes) makes the hub appear in N transfers. The provable property is *single-side* + *≤ P−1 total*, not *once per party*. (Verification ledger C15.) |
| 2 | `Agent-4/layer-product-demo.md` §3.6 L128 | "(each party appears in ≤1 output edge once balances are netted to a single sign)" | "netting to a single signed balance puts each party on exactly one side (payer xor receiver); each greedy step zeroes ≥1 party → ≤ P−1 transfers; a party may still appear in >1 transfer" | Same error restated in the proof gloss; corrected to the true invariant. |
| 3 | `Agent-1/layer-legal-shariah-regulatory.md` §5 L202 | "Law of Evidence 2022 (M/43, **in force 23 June 2022**)" | "M/43 — issued 26/5/1443H ≈ 31 Dec 2021, published 7 Jan 2022, **in force 7 July 2022**" | **Factual error.** Grounded: published 7 Jan 2022, effective ~7–8 July 2022 (180 days). "23 June" unsupported. |
| 4 | `Agent-1/layer-legal-shariah-regulatory.md` §5 L203 | "Electronic Transactions Law 2007 (**M/8**)" | "M/18 per the official Bureau of Experts portal laws.boe.gov.sa; cited M/8 by MCIT & WIPO Lex — decree-no. variant, counsel to confirm" | **Citation drift** (the dossier contradicted itself: M/8 here vs M/18 in objection-killer). Real-world ambiguity — standardized to an honest both-cited form. |
| 5 | `00_Shared/contracts.md` C7 L82 | "Electronic Transactions Law 2007 (**M/8**, 8 Rabīʿ I 1428H)" | "M/18 per BoE laws.boe.gov.sa; cited M/8 by MCIT/WIPO — variant, confirm w/ counsel; 1428H" | Reconciles the canonical contract with the same honest form (kills the M/8↔M/18 self-contradiction). |

## Grounding sources (web-verified this pass)
- **Electronic Transactions Law:** laws.boe.gov.sa (Bureau of Experts) → *Royal Decree M/18, 27 Mar 2007*; MCIT official text & WIPO Lex → *M/8, 8 Rabīʿ I 1428H / 26 Mar 2007*. **Genuine source disagreement on the decree number** — both retained, flagged for counsel.
- **Law of Evidence 2022:** Royal Decree **M/43**, issued 26/5/1443H (31 Dec 2021), published in the Gazette 7 Jan 2022, **in force 7–8 July 2022** (Al Tamimi; Ghazzawi; eastlaws). The "23 June 2022" date was wrong.

## Verified already-consistent (no change needed)
- **Scorecard = 92/100** in both `00_MASTER_DOSSIER.md` (§7, "~92, range 91–93") and `BUILD-LOG.md` ("85 → 92/100"). The earlier ~93 worry is resolved.
- **Agent-1 duplicate layer file** (`layer-legal.md`) — already merged by Claude-A; only `layer-legal-shariah-regulatory.md` remains.
- **demo-3min.md** already uses "≤ عدد الأطراف − ١", never "أقل عدد".
- **Prototype** (`project/ahd-demo/`) already rebuilt with a real SHA-256 hash-chain + live tamper verifier + Muqassa conservation table (Claude-Orchestrator), browser-verified.

## Residual (left intentionally — low value / owner's call)
- `Agent-1/layer-…` L31: the ASCII LAYER-2 diagram still shows the short "M/8" label (editing inside the aligned table risks breaking it; the authoritative §5 citation now carries the variant note).
- The exact ETL decree number (M/8 vs M/18) and the precise Evidence-Law in-force day (7 vs 8 July) remain a **pre-production counsel confirmation** item, as the dossier already flags.

*— Claude-Workflow, post-completion consistency pass. Master dossier + layers + verification-ledger were this run's output; this pass only reconciled source-layer drift and grounded two citations. No other files touched.*
