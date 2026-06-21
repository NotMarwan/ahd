---
title: "دَيْن Dayn — the BNPL-detox → savings graduation flywheel (incubated)"
tags: [agent/4, concept, status/incubated, track/gamification, track/financial-education, req/cx, req/sustainability, req/ai, req/data, score/84]
updated: 2026-06-18
---

# دَيْن · Dayn — "Turn the installment you owe into the savings you own."
**Track:** 6 Gamification + 4 Financial Education · **Requirements:** /03 CX + /04 Sustainability + /02 AI + /01 Data
**Gut score: ~84 / 100** · **status: incubated** — new creation; candidate **alternative #3** (more portfolio-diverse than [[concept-misnad|Misnad]], which overlaps Agent 3's Rizq) **or** a feature-module of [[concept-namaa|Namaa]].

## A. One-liner
*Dayn aggregates a user's scattered BNPL installments via open banking, gamifies a "debt-free date" countdown, and — at the exact moment a plan clears — redirects that same installment into a savings goal, converting a debt habit into a savings habit while the money is still "gone" in the user's mind.*

## B. Problem
BNPL is a youth debt machine: **15M+ Tabby users**, only **~20%** of Saudis hold a credit card, the SAMA per-consumer cap is **SAR 10,000** across up to 12 instalments, and sub-SAR-2,000 BNPL is **exempt from DTI checks** — so stacked, invisible obligations across Tabby/Tamara/others accumulate unmonitored. Customers can't see their *total* exposure; banks worry about affordability and default. Meanwhile the moment a person finishes paying off a plan, that freed cashflow silently leaks back into spending — the single best, never-captured opportunity to start saving.

## C. Solution
1. **Exposure x-ray (OB):** aggregate all BNPL/installment obligations into one view + a **debt-free date** countdown (loss aversion + goal-gradient effect drive paydown).
2. **Paydown game:** streaks, milestones, and **guaranteed hibah** on clearing a plan (zero-chance, halal — same reward engine as [[concept-namaa|Namaa]]).
3. **The graduation flywheel (the wedge):** when a plan clears, the AI offers — *"you were paying SAR 200/mo to Tabby. Keep paying it — to your future self."* One tap redirects the identical amount into a savings goal. Behaviorally optimal: the outflow was already budgeted and mentally spent, so the switch is near-frictionless (mental-accounting + inertia working *for* the saver).

**Only-now:** licensed OB makes cross-provider installment aggregation lawful; the agentic redirect at the moment of clearance is the new mechanic.

## D. Mapping
Track 6 Gamification (+4 Education). Requirements **/03** (frictionless), **/04** (debt-resilience + savings = sustainability), **/02** (AI redirect/affordability), **/01** (exposure analytics).

## E. 72h build plan
- **Built:** BNPL aggregation view + debt-free countdown, paydown game, the **clearance→redirect** flow, an affordability/exposure score.
- **Mocked/seeded:** multi-provider installment data via synthetic generator + Alinma sandbox (cross-provider BNPL data is the hardest to source live → seed a rich persona with 3 stacked plans).
- **Must work:** a plan clears → the agent's redirect offer → one-tap → the amount lands in a savings goal.

## F. Data story
Total-exposure aggregation + an **affordability/over-extension score** + a "freed-cashflow forecast" (when each plan clears and how much redirects) — a genuinely useful, bank-relevant analytic shown live.

## G. Demo script (3 min)
"20% of Saudis have a credit card; 15M use Tabby. Nobody sees their total." → x-ray loads 3 stacked plans + a debt-free date → paydown milestone hits, hibah unlocks → **a plan clears → 'pay your future self instead' → one tap → first savings goal funded.** Close: "We turn the bank's affordability risk into its next deposit."

## H. Bank-ship case
- **Responsible-lending story SAMA loves:** surfaces affordability, reduces over-extension/default risk on the bank's own book — then **converts the de-leveraged customer into a CASA depositor** (the [[concept-namaa|Namaa]] graduation). Risk-reduction *and* deposit-growth in one arc.
- **On-strategy:** ships into **"iz"**; complements Alinma's responsible-finance posture. Shariah: no riba (visibility + redirect, no new lending); hibah rewards; PDPL consent; SAMA OB rails.

## I. Differentiation
- vs **Drahim/Malaa (PFM):** they *show* debt; Dayn **gamifies graduation and captures the freed cashflow**.
- vs **Tabby/Tamara apps:** single-provider, pro-spending; Dayn is **cross-provider + pro-saving**.
- Distinct from every agent's concept (no overlap with Misnad/Rizq freelancer angle, Haseen fraud, Rushd Shariah co-pilot).

## J. Risk register
1. **Cross-provider BNPL data hard to get live.** → Seed convincingly; frame live aggregation as the OB-licensed roadmap.
2. **Demo timing (value appears after paydown).** → Use a persona with a plan about to clear so the flywheel fires on stage.
3. **Could read as "debt app, not innovation."** → Lead with the **graduation flywheel** insight, not the tracker.

## K. Why incubated, not crowned
Strong differentiation + a bank-loved risk→deposit arc, but (a) the wow materializes *after* paydown (harder 3-min demo than Namaa's instant agent-act) and (b) cross-provider BNPL data is the toughest to mock credibly. Net gut **~84** — on par with [[concept-faheem|Faheem]], below [[concept-namaa|Namaa]] (92). **Recommended use:** swap in for [[concept-misnad|Misnad]] as finalist #3 *if the operator wants maximum portfolio diversity* (Dayn collides with no one); otherwise ship as a **Dayn module inside Namaa** — the debt→savings on-ramp that feeds the same reward economy.

## Links
- [[concept-namaa]] · [[concept-misnad]] · [[raw-ideas]] · [[research]] · [[champion]] · [[master-scoreboard]]
