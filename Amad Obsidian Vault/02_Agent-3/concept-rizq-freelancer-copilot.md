---
title: "رِزق Rizq — Freelancer Irregular-Income Co-pilot"
tags: [agent/3, concept, status/finalist, track/customer-experience, req/ai, req/cx, req/sustainability, score/84]
updated: 2026-06-18
---

# رِزق Rizq — the freelancer's money co-pilot
> *Rizq (رِزق)* = sustenance/provision. The product turns lumpy, anxious freelance income into a steady, planned, Shariah-clean livelihood.

## A. One-liner
**An AI money companion for Saudi Arabia's 2.25M freelancers that turns irregular, unpredictable income into a calm monthly plan — it forecasts your lean months, auto-buckets every payment into zakat, VAT and savings, and offers a Shariah-compliant buffer when work is thin.**

## B. Problem
- **2.25M freelancers / 220k+ licenses**, growing toward ~5% of non-oil GDP by 2030 — but banking treats them like salaried employees they are not. Income is lumpy; there's no SIMAH file; zakat + VAT are manual and error-prone; a slow month means panic. [ArabNews](https://www.arabnews.com/node/2584265) · [TASC](https://tascoutsourcing.sa/en/insights/saudi-arabia-s-workforce-revolution-how-the-gig-economy-is-reshaping-business-growth)
- **53% of Saudis are underserved; 16% unbanked (~4.3M).** Existing **Earned Wage Access (Mudad×Khazna) is payroll-tied → freelancers are structurally excluded.** [AGBI](https://www.agbi.com/opinion/banking-finance/2024/06/the-gulf-is-ripe-for-fintechs-to-serve-the-underserved/)
- **Why now:** licensed open banking (consented multi-account income view) + Alinma's **Kingdom-first Freelance Card** (2025, w/ SDB) + Arabic LLMs = the experience layer is finally buildable, and Alinma already wants this segment.

## C. Solution
- **Income radar:** connect accounts via open banking → AI classifies and de-noises freelance income, distinguishing client payments from transfers, and models the *pattern* (seasonality, client concentration, gaps).
- **Auto-buckets:** every incoming payment is split, with consent, into **zakat**, **VAT/ZATCA**, **smoothing reserve**, and **spendable** pots — so tax and zakat are never a year-end shock.
- **Lean-month forecast:** "Based on your last 9 months, August looks thin — you're ~SAR 2,400 short of your baseline; here's the plan."
- **Shariah buffer:** when a gap is forecast, offers a **Tawarruq/Murabaha** income-smoothing facility sized to *modeled* income (not a payslip) — the only halal way to bridge irregular income.
- **Only-now element:** an *experience* built on alternative income data, not a credit form. (Backend credit decisioning can plug into Agent 1's [[concept-tadfuq|Tadfuq]] engine — synergy.)

## D. Mapping
- **Track:** 2 — Customer Experience *(single track ✓)*.
- **Requirements:** **/02 AI** (income modeling/forecasting) + **/03 CX** (personalized for an excluded segment) + **/04 Sustainability** (financial resilience for the gig economy = long-term inclusion).

## E. 72h build plan
**Architecture:** Arabic RTL app → income-classification + forecasting service (gradient-boosted / simple time-series on transaction features) → LLM layer (ALLaM) for the conversational plan + explanations → bucket/pot engine → mock OB + Freelance-Card APIs.
**Built vs mocked:** *Built* — income classifier, the bucketing engine, the lean-month forecast + visualization, the conversational plan, the buffer-offer flow. *Mocked* — OB account linking (synthetic + Alinma sandbox freelancer profiles), the actual credit disbursement, ZATCA VAT filing (compute + stub).
**Day-by-day:** D1 synthetic freelancer income datasets (3 personas: designer, driver, consultant) + classifier; D2 forecast + buckets + Arabic UI; D3 buffer offer + plan narrative + polish.
**Must-work feature:** the **lean-month forecast + auto-bucket split** on a real-looking irregular income stream.

## F. Data story
- **Dataset:** synthetic freelance income streams calibrated to real gig patterns + KAPSARC POS for spend context; OB sandbox freelancer profiles.
- **Insight live:** show a jagged 12-month income chart → the AI overlays the *smoothed baseline*, flags the predicted shortfall month, and demonstrates how the buckets keep zakat+VAT covered through it. This is the strongest **data-analysis** demo of my three (genuine modeling, not classification).

## G. Demo script (3 min)
1. Connect "Noura, freelance designer." Her income chart is chaos.
2. Rizq draws the smoothed baseline + names her two riskiest months. (Insight wow.)
3. A SAR 6,000 client payment lands → watch it auto-split into zakat/VAT/save/spend with consent.
4. Rizq forecasts August short → offers a **Tawarruq** buffer sized to her modeled income, explains the structure.
5. Land it: "**4.3M unbanked, 2.25M freelancers** — Alinma already gave them a Freelance Card. Rizq is the experience that makes them *bank* with Alinma."

## H. Bank-ship case (Alinma)
- **Acquisition + deposits:** captures a fast-growing, under-banked segment Alinma already targets; smoothing reserves = sticky deposits.
- **New lending book:** alt-data income modeling opens a compliant freelancer credit book (Tawarruq) where SIMAH can't.
- **On-strategy:** direct extension of the **Freelance Card + SME/freelancer** bets. Stack: OB + ALLaM on watsonx.
- **Compliance:** PDPL + OB consent; Shariah-native buffer (no riba); SAMA responsible-lending alignment (limits sized to modeled affordability).

## I. Differentiation
- **vs EWA (Mudad×Khazna):** payroll-tied; Rizq serves the no-employer freelancer EWA *cannot*.
- **vs PFM (SANAM/Mod5r/Drahim):** they categorize salaried spend; Rizq is built around *irregular income + zakat/VAT + a halal buffer*.
- **vs Agent 1 [[concept-tadfuq|Tadfuq]]:** Tadfuq is a *bank-side underwriting engine*; Rizq is the *consumer experience layer* — they compose, not compete.

## J. Risk register
| Risk | Type | Mitigation |
|---|---|---|
| Income classification mislabels transfers as income | Technical | Conservative rules + user confirmation; show confidence; let the user correct (improves model). |
| Buffer = disguised riba concern | Shariah | Use validated Tawarruq/Murabaha structure; show the contract; Shariah-board reviewed. |
| Forecast wrong in a live demo | Demo | Pre-built personas with known patterns; forecast is deterministic on seed data. |

## K. Score — **84 / 100**
| Criterion | Wt | Score | Why |
|---|---|---|---|
| Innovation | 20 | **15** | Freelancer-experience framing is fresh in KSA; cashflow-smoothing exists abroad. |
| Technical | 20 | **16** | Real income modeling + forecasting + bucketing; buildable. |
| Data | 20 | **18** | Genuine time-series modeling of irregular income — best data story of the three. |
| UX | 15 | **13** | Clean Arabic RTL; less novel surface than Rushd. |
| Feasibility | 25 | **22** | Freelance-Card anchor + underserved mandate; needs OB-license + lending framing. |

**Gates:** 72h ✅ · Differentiated ✅ · Shariah ✅ · PDPL/SAMA ✅ · One track + req ✅ → **PASS.**

## Links
- Champion: [[concept-rushd-shariah-copilot]] · [[concept-khidma-resolution-agent]] · synergy: [[concept-tadfuq]] (Agent 1) · [[research]] · [[raw-ideas]]
