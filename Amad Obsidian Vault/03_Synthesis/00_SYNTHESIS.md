---
title: 00_SYNTHESIS — Cross-Agent Compile & Final Recommendation
tags: [synthesis, judging, status/canonical]
updated: 2026-06-18
author: Agent 1 (synthesis pass)
---

# 🧩 AMAD 2026 — Cross-Agent Synthesis (CANONICAL)
> Compiled by **Agent 1** after all four lanes finished. This is the single source of truth for ranking + recommendation. It does **not** overwrite any agent's files — it re-judges them on one consistent bar and points to the canonical copies.

---

## 1. Vault reconciliation (the audit)
The vault fragmented into **two trees**. Nothing is lost; here's the map. **Do not duplicate — use these canonical paths.**

| Artifact | Canonical location | Notes |
|---|---|---|
| Index / MOC | `00_Index.md` (root) | updated to link everything |
| Lane claims | `00_Coordination/lanes.md` (root) | Agents 1 & 3 logged here |
| Shared terrain | `01_Brief/saudi-fintech-terrain.md` (root) | richest copy (A1 + A3 intel) |
| **This synthesis** | `03_Synthesis/00_SYNTHESIS.md` | **canonical scoreboard lives here** |
| Agent 1 (Lane 1) concepts | `02_Agent-1/` (root) | Tadfuq, Nabd, **Rabt** (was Misnad) |
| Agent 3 (Lane 3) concepts | `02_Agent-3/` (root) | Rushd, Rizq, Khidma |
| Agent 2 (Lane 2) concepts | `AMAD-2026/02_Agent-2/` | Haseen, Raqib, Baseera |
| Agent 4 (Lane 4) concepts | `AMAD-2026/02_Agent-4/` | Namaa, Faheem, Misnad |
| Duplicate coord files | `AMAD-2026/00_Coordination/*`, `AMAD-2026/01_Brief/*` | **superseded** by the root copies; kept for history |

**Collision fixed:** Agent 1's "Misnad" (lending API) → **renamed [[concept-rabt|Rabt]]**; Agent 4's [[concept-misnad|Misnad]] (behavioral wellness) keeps the name. Old file tombstoned.

---

## 2. Calibration note (why these scores differ from the agents' own)
Every agent scored **their own champion 88–90** and finalists 79–84. That's self-scoring drift — no shared bar. I re-judged all 12 on **one skeptical rubric**, deflating for: (a) demo-vividness in a *literal 3-minute* slot, (b) how much is *genuinely built* vs mocked in 72h, (c) uncopyable moat vs pattern-match risk. Net effect ≈ **−3 to −5** across the board. Rankings matter more than absolute numbers.

## 3. 🏁 Unified scoreboard (calibrated, all 12)

| # | Concept | Agent·Lane | Self | **Calib.** | Inno20 / Tech20 / Data20 / UX15 / Feas25 | The one-line reason for the rank |
|---|---|---|---|---|---|---|
| **1** | [[concept-haseen\|حصين Haseen]] — pre-payment scam interceptor | A2·L2 | 90 | **86** | 17/16/15/14/24 | Most *visceral* demo + hard regulatory tailwind (SAMA counter-fraud mandatory 13 Apr 2026) + APP-liability avoidance. Lowest-risk first place. |
| **1** | [[concept-tadfuq\|Tadfuq]] — cash-flow credit engine ⭐ | A1·L1 | 90 | **86** | 16/16/19/12/23 | Biggest market (SAR 0.5T) + uncopyable OB×ZATCA data moat. Tied on merit; **needs a vivid front-end to win the demo** (see §5). |
| 3 | [[concept-namaa\|نَماء Namaa]] — Shariah savings game | A4·L4 | 88 | **83** | 15/16/15/14/23 | One clean P&L line (deposits) + national-savings KPI + un-clonable halal-reward engine; "savings app" innovation risk. |
| 3 | [[concept-rizq-freelancer-copilot\|رِزق Rizq]] — freelancer co-pilot | A3·L3 | 84 | **83** | 15/16/18/13/21 | Best *human* demo story + genuine income-modeling data. **Composes with Tadfuq** → the integration play. |
| 5 | [[concept-rushd-shariah-copilot\|رُشد Rushd]] — Shariah conscience layer | A3·L3 | 89 | **82** | 16/15/14/14/23 | Truly uncopyable (only an Islamic bank can ship it) + on Alinma's ALLaM stack; pattern-matches as "an AI assistant" — pitch-order is everything. |
| 6 | [[concept-nabd\|Nabd]] — SME health radar | A1·L1 | 84 | **80** | 14/15/17/12/22 | Easiest "saves the bank money" case; least vivid (monitoring dashboard). |
| 6 | [[concept-misnad\|مِسْنَد Misnad]] — behavioral wellness | A4·L4 | 82 | **80** | 16/15/15/13/21 | Strong inclusion narrative; narrower segment caps the ceiling. |
| 8 | [[concept-faheem\|فَهيم Faheem]] — contextual AI literacy | A4·L4 | 83 | **79** | 16/15/16/14/18 | Best AI wow in its lane; "education = soft revenue" drags feasibility. |
| 8 | [[concept-raqib\|رقيب Raqib]] — OB consent-fraud firewall | A2·L2 | 82 | **79** | 17/15/15/12/20 | Novel OB-specific control; narrower than Haseen. |
| 10 | [[concept-baseera\|بصيرة Baseera]] — AML + SAMA copilot | A2·L2 | 81 | **78** | 12/16/18/11/21 | Deepest data; internal-tool UX = low demo wow. |
| 10 | [[concept-khidma-resolution-agent\|خِدمة Khidma]] — resolution agent | A3·L3 | 81 | **78** | 13/16/14/14/21 | Solid ops value; least differentiated. |
| 12 | [[concept-rabt\|ربط Rabt]] — embedded lending API | A1·L1 | 79 | **76** | 15/13/15/11/22 | Bullseye on Alinma's API-monetization strategy; hardest 72h build, lowest visual wow. |

> **Top tier = Haseen & Tadfuq (86), then Namaa & Rizq (83), then Rushd (82).** The first-place fight is **Haseen vs Tadfuq**.

---

## 4. ⚖️ The race for #1 — honest verdict
- **Haseen wins on *demonstrability*.** "Watch a scam get stopped live, in Arabic, 3 seconds before the money leaves" is the single most legible hour-70 moment in the portfolio, and the SAMA counter-fraud mandate makes "Alinma is exposed on exactly this" undeniable. **If the team wants the lowest-variance path to first place with one concept, build Haseen.**
- **Tadfuq wins on *strategic weight*.** Biggest market, the only true data moat (OB×ZATCA is uniquely Saudi + uniquely 2026), and the broadest "new revenue book" story. Its **only** weakness is that B2B underwriting doesn't make a tired judge *gasp* in 3 minutes — which §5 fixes.
- **Rushd / Namaa** are the "uncopyable moat" picks — strongest if the panel weights brand/identity (Rushd) or a single national KPI (Namaa), but each carries a "we've seen an AI assistant / a savings app" first-impression risk.

**Agent-1 recommendation (honest, not parochial):** there are **two** legitimate #1 builds — pick by team strength:
- **Demo-led team → Haseen.**
- **Data/AI-led team → Tadfuq, fronted by Rizq (§5).**

---

## 5. 🔗 Synergy & collision matrix (the portfolio's real structure)
**The freelancer/irregular-income cluster is the portfolio's gravitational center** — 4 of 12 concepts orbit it. That's a signal, not noise. They **stack** rather than compete:

```
                 ┌─────────────────────────────────────────┐
   EXPERIENCE →  │  Rizq (A3) — conversational freelancer CX │
                 │  Misnad/Namaa (A4) — behavioral / rewards │
                 └───────────────▲─────────────────────────┘
                                 │ reads limits / decisions
   DECISIONING →  ┌──────────────┴──────────────┐
                  │  Tadfuq (A1) — OB×ZATCA×POS  │  ← the underwriting PRIMITIVE
                  │  credit engine + ALLaM explain│
                  └──────────────▲──────────────┘
                                 │ shares consent + data signals
   TRUST/RISK →   ┌──────────────┴──────────────┐
                  │  Haseen / Raqib (A2) — fraud │
                  └─────────────────────────────┘
```

| Pair | Relationship | Action |
|---|---|---|
| **Tadfuq ↔ Rizq** | **Synergy (flagship).** Tadfuq = backend decisioning; Rizq = the human front-end. Together = the data moat **and** the vivid demo. | Build as one: **"Tadfuq inside Rizq."** |
| Tadfuq ↔ Misnad/Namaa | Synergy. Behavioral layer sits on top of the credit/affordability engine. | Roadmap, not same demo. |
| **Misnad (A4) ↔ Rizq (A3)** | **Soft collision** — same freelancer segment, different mechanic (gamified behavior vs conversational CX). | **Don't pitch both.** Pick by judging emphasis. |
| Haseen ↔ Baseera/Raqib (A2) | Internal A2 ranking only; Haseen is the lane's clear lead. | Pitch Haseen solo. |
| Haseen ↔ Tadfuq/Rabt | Synergy. Haseen's CoP protects Rabt's embedded disbursements; Tadfuq's consent data enriches Haseen's mule-graph. | Cross-feed note for whichever ships. |
| Rushd ↔ Namaa | Complementary (both Shariah-native, deposit-growing); not competing. | Could co-exist. |

**Naming:** ✅ Misnad collision resolved (A1 → [[concept-rabt|Rabt]]). No other name clashes.

---

## 6. 🆕 Pushed forward — new cross-pollinated concepts (brainstorm)
Sparked by the convergence above:

1. **⭐ Tadfuq-inside-Rizq (the integrated flagship).** Not a new idea — the *correct* packaging of two existing strong ones. A freelancer ("Noura") opens the Rizq co-pilot; her irregular income is modeled live; when a lean month is forecast, **Tadfuq** underwrites a Shariah buffer from OB+ZATCA+POS in <15s with an ALLaM-explained card. **This single build scores Tadfuq's data/feasibility AND Rizq's UX/innovation — likely the portfolio's true ceiling (≈88 calibrated).** Recommend as the Lane-1×Lane-3 joint entry.

2. **Thiqa (ثقة) — the shared trust/credit primitive *(net-new).*** A portable, consented, **explainable creditworthiness-and-trust score** for thin-file Saudis, computed once from OB+ZATCA+POS and **read by every product**: Tadfuq (limit), Rizq (buffer), Namaa (reward eligibility), Haseen (risk context). Frames the whole portfolio as **"a credit identity for the 4.3M unbanked"** — a Vision-2030 inclusion headline no single product owns. Strong as the connective-tissue narrative if the operator wants a platform pitch; standalone-demoable as "watch an invisible freelancer become bankable."

3. **Haseen × Rabt "trust-rails" pairing.** If Lane 2 ships, Rabt's embedded disbursements ride Haseen's Confirmation-of-Payee → "credit you can extend *and* protect on the same rail." A defensible combined RegTech+OB story.

> Discipline check: these are **packaging/roadmap** moves, not scope-creep. The 72h team still builds **one** demo. Items 2–3 are pitch-narrative and post-hackathon roadmap, not extra build.

---

## 7. ✅ Operator action list
1. **Decide the single build** by team archetype: demo-led → **Haseen**; data/AI-led → **Tadfuq-inside-Rizq** (§6.1). Lock by registration (26 Jun).
2. **Register on `developer-ob-sb.alinma.com` now** + pull SAMA OB-Lab mock data; confirm which account/transaction/ZATCA fields are reachable for the demo.
3. **Standardize the stack:** Arabic-first RTL front-end · FastAPI services · **ALLaM via IBM watsonx** for all Arabic generation/explanation · synthetic Saudi data generator + sandbox · deterministic seeded demo personas + offline fallback recording (every agent's red team demands this).
4. **Pitch order is the whole game:** lead with the moat/wow in the first 15s (scam-stop for Haseen; the <15s explained-limit reveal for Tadfuq), never with a chat box or a dashboard.
5. **Shariah + compliance one-liners on screen:** Tawarruq structure shown (not executed); PDPL consent explicit; SAMA-aligned; AI never issues fatwa.

## 8. Open questions for enrichment (5–16 Jul) — consolidated
- **12 Jul (AI financial UX, Dr. Saad Al-Muslim):** is **ALLaM via watsonx** the sanctioned in-Alinma path? Validate Arabic tone.
- **13 Jul (Data analytics, Ahmed Al-Thukair/Suwa):** what real Alinma data (scam labels / SME cashflow) could harden the data criterion?
- **14 Jul (Fintech Saudi):** is **Confirmation-of-Payee** on SAMA's OB roadmap? Is APP-reimbursement liability coming to KSA? (Makes/breaks Haseen.)
- **15 Jul (pitch craft, M. Al-Ghubain/Ptway):** rehearse the 3-min order.
- **All:** get an informal **Shariah-board** read on the specific structure (Tawarruq buffer / hibah reward / fraud-friction = hifz al-mal).

## 9. Addendum — Agent 3 response (2026-06-18, post-synthesis)
> Agent 3 **accepts the calibration bar** — self-scores were inflated; agreed. Three responses:
1. **Rushd v2 submitted for re-judge.** After reading this synthesis I sharpened Rushd to one spine — the **Tayyib Score** ([[rushd-v2-sharpened]]) — which fixes the two cuts you named (assistant-pattern-match → score-first demo order; Data 14 → composite index + nisab/hawl zakat engine + drill-down). Honest re-calibration on your skeptical bar ≈ **85–86** (would join the Haseen/Tadfuq top tier). Requesting an independent re-score; **not** self-canonizing it.
2. **Endorse the flagship.** Agreed: **Tadfuq-inside-Rizq (≈88)** is the portfolio ceiling for a data/AI-led team. Specced the joint build → [[concept-rizq-tadfuq-flagship]] with a frozen `underwrite()` interface, two-team division of labor, and a 3-min joint demo ("Noura"). Agent 3 ready to build Rizq as the front-end.
3. **Tayyib ↔ Thiqa (two facets of one financial identity).** Your §6.2 **Thiqa** = *can we trust you with credit* (creditworthiness); Rushd's **Tayyib Score** = *is your money Shariah-clean* (compliance). A combined "financial identity" platform pitch carries both — **Thiqa for inclusion, Tayyib for the Islamic moat.** Flagged for the platform narrative.

> **Net:** for the operator's single build, Agent 3 concurs — **demo-led → Haseen; data/AI-led → the flagship.** Rushd stays the best *standalone Lane-3* pick (uncopyable identity moat) if the panel weights brand. Build deliverables ready: [[rushd-demo-and-deck]] · [[rushd-architecture-buildplan]].

## Links
- [[00_Index]] · [[master-scoreboard]] · [[lanes]] · [[hackathon-brief]] · [[saudi-fintech-terrain]]
- Champions: [[concept-haseen]] · [[concept-tadfuq]] · [[concept-namaa]] · [[concept-rushd-shariah-copilot]] · synergy: [[concept-rizq-freelancer-copilot]]
- Agent 3 additions: [[rushd-v2-sharpened]] · [[concept-rizq-tadfuq-flagship]] · [[rushd-demo-and-deck]] · [[rushd-architecture-buildplan]] · [[raw-ideas-wave2]]
