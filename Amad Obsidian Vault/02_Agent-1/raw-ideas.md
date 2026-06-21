---
title: Agent 1 — Raw Ideas (Diverge, Lane 1)
tags: [agent/1, ideation, track/open-banking]
updated: 2026-06-18
---

# 💥 Agent 1 — Raw Divergent Set (Lane 1)
> 18 concepts. Scores are gut 1–5 (N=novelty, F=feasibility-in-72h). Quantity-first; judging happens in [[#converge]].

| # | Concept | What it is | Lens | N | F |
|---|---|---|---|---|---|
| 1 | **Tadfuq — Cash-Flow Credit Engine** ⭐ | Bank-side AI underwriting fusing open-banking AIS cash flow **+ ZATCA e-invoices** → instant **Shariah (Tawarruq)** working-capital limit for SMEs/freelancers, with an explainable decision card. | Analog+Data | 4 | 4 |
| 2 | **Sanad — Invoice-backed instant finance** | Connect ZATCA+OB; AI verifies a specific unpaid receivable; offers Murabaha financing against it (Shariah factoring). | Data-asset | 3 | 4 |
| 3 | **Nabd — SME Financial-Health Radar** ⭐ | Real-time creditworthiness + early-warning score streaming from OB+ZATCA+POS; the bank monitors its SME book continuously (NPL prevention). | JTBD(bank) | 4 | 4 |
| 4 | **15-Second Consent-to-Credit** | Replace the 6-month PDF-statement upload with a consent flow + instant AI underwrite; pure conversion play. | Constraint | 3 | 5 |
| 5 | **Dakhli — Freelancer income-smoothing** | AI models irregular freelance income from OB data; offers a Shariah income-based limit / smoothing advance for the 2.35M self-employed. | JTBD(freelancer) | 4 | 3 |
| 6 | SME treasury cockpit + PIS auto-sweep | Aggregate all bank accounts (AIS) into one liquidity view + AI forecast + PIS sweep to optimize balances. | JTBD(treasury) | 3 | 3 |
| 7 | Alt-credit bureau for thin-file | AI score from OB+ZATCA+open-data for SIMAH-invisible borrowers; bank-consumable API. | Data-asset | 4 | 3 |
| 8 | Explainable Shariah underwriting (RegTech) | Credit engine where every decision is explainable + auditable for the Shariah board + SAMA. | Trend-collision | 4 | 3 |
| 9 | **Rabt — Lending-as-an-API (embedded)** ⭐ | Bank exposes OB-powered credit decisioning as an API that **ZATCA-integrated ERP/POS tools** (Qoyod-class) embed → point-of-need SME credit + data-product revenue. | Embedded finance | 4 | 3 |
| 10 | Consent "data passport" | PDPL-first consent dashboard + portable financial data passport the customer controls; trust as differentiator. | Pain inversion | 3 | 3 |
| 11 | Dynamic Shariah overdraft | A revolving Tawarruq line whose limit recalculates daily from live OB+ZATCA cash flow. | AI-native | 4 | 3 |
| 12 | Supply-chain financing graph | Use the ZATCA invoice graph (who invoices whom) + OB for anchor/supply-chain finance + network risk. | Data-asset(graph) | 5 | 2 |
| 13 | Synthetic-data sandbox for credit models | Generate realistic synthetic OB+ZATCA datasets to train/test underwriting safely (PDPL). | Constraint/infra | 4 | 3 |
| 14 | AI "deal memo" for RMs | Auto-generate a one-page credit memo + recommended Shariah structure for the credit committee from OB+ZATCA. | GenAI+JTBD(staff) | 3 | 4 |
| 15 | SME "switch & save" | Analyze OB data → recommend best financing/account product + auto-switch via PIS. | Analog(UK CMA) | 2 | 3 |
| 16 | Onboarding ground-truthing | Cut SME-onboarding fraud: cross-verify declared revenue vs ZATCA vs OB inflows. | Trend-collision | 3 | 3 |
| 17 | Zakat × cash-flow assistant | Compute zakat from OB+ZATCA and fold into cash-flow planning (uniquely Saudi, Shariah-native). | AI-native | 4 | 3 |
| 18 | Portfolio early-warning (NPL) | Stream OB+ZATCA for existing borrowers; flag deterioration before default. | Data-asset(P&L) | 3 | 3 |

## Clusters
- **A · Cash-flow underwriting / instant credit:** 1, 2, 4, 5, 11, 14 ← strongest, most demoable
- **B · Bank-side risk radar / monitoring:** 3, 18, 8
- **C · Alt-data scoring / data infrastructure:** 7, 12, 13, 10
- **D · Treasury / liquidity / embedded distribution:** 6, 9, 15
- **E · Adjacent:** 16 (onboarding/fraud — leans Lane 2), 17 (zakat — leans Lane 4)

## Converge — 3 advanced to full evaluation
1. **[[concept-tadfuq]]** (#1) — beats #2/#4/#5/#11 by covering all 5 criteria at once with the strongest wow + the ZATCA ground-truth moat. Cluster A champion.
2. **[[concept-nabd]]** (#3, absorbs #18/#8) — a *different bet*: bank-facing monitoring with the easiest "saves the bank money" feasibility case. Cluster B champion.
3. **[[concept-rabt]]** (#9) — a *different bet*: embedded distribution + API monetization = exactly Alinma's stated "new revenue streams + fintech-partner access" strategy. Cluster D champion.

### Why the cuts were cut (one line each)
- #6 treasury cockpit → collides with corporate-cash tools + Drahim adjacency; weaker differentiation.
- #12 supply-chain graph → **gate fail**: not credibly demoable in 72h (needs network-scale data).
- #13 synthetic sandbox → tooling play, weak pitch wow for a bank exec.
- #15 switch&save → low novelty (commodity).
- #17 zakat → drifts into Financial Education lane (Agent 4's turf).
- #10 consent passport → real but weaker standalone wow; folded into Tadfuq's consent UX.
- #5 Dakhli (freelancer) → strong, but narrower than Tadfuq, which already serves freelancers as a segment.

## Links
- [[research]] · [[concept-tadfuq]] · [[concept-nabd]] · [[concept-rabt]] · [[wildcard]] · [[00_Index]]
