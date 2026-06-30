---
title: "مِسْنَد Misnad — behavioral wellness for irregular income"
tags: [agent/4, concept, status/finalist, track/financial-education, track/gamification, req/cx, req/sustainability, req/ai, req/data, score/82]
updated: 2026-06-18
---

# مِسْنَد · Misnad — "Steady money for unsteady income."
**Track:** 4 Financial Education + 6 Gamification · **Requirements:** /04 Sustainability + /03 CX + /02 AI + /01 Data
**Total score: 82 / 100**

## A. One-liner
*Misnad turns feast-or-famine freelance income into a steady financial life — AI predicts your lean months, auto-sets aside zakat + a buffer the moment you get paid, and gamifies a "stability score" that climbs as you smooth the curve.*

## B. Problem
KSA has **150,000+ registered freelancers** (مستقل alone), 225 permitted professions, skewed 25–34 — a Vision-2030 priority segment. Their core pain isn't earning; it's **volatility**: "some months great, others dry, no safety net." They have **no automatic payday** to anchor a savings habit, **no employer GOSI auto-deduction**, and a **zakat** obligation they must self-manage (no personal income tax, but zakat applies). Existing tools (Drahim/Malaa) track spend but don't **smooth irregular income** or **pre-empt the dry month**. **Why now:** OB exposes the gig-income stream; GenAI can forecast lean periods from past cashflow and act on payday — and Alinma just launched **"iz Business" (Oct 2025) for exactly this segment**, so the distribution exists.

## C. Solution
A financial-wellness layer for irregular earners:
- **Lean-month forecast:** AI reads gig-income history (OB) and predicts the next dry stretch, with a confidence band.
- **Pay-day autopilot (SMarT for gigs):** the instant a gig payment lands, Misnad auto-splits it — **zakat set-aside**, **buffer top-up**, **goal**, spendable — with a **"save more next gig"** escalation when a big invoice clears (Save-More-Tomorrow localized: present-bias defeated because you commit *before* the windfall).
- **Stability score (the game):** a single climbing score = months-of-runway + buffer health + zakat-readiness. Streaks for "covered next lean month"; **hibah** milestone rewards (not a draw) for hitting runway tiers; an optional **anonymized peer cohort** of similar freelancers.
- **Zakat companion:** auto-tracks the zakatable base and the ZATCA due-date so it's never a year-end scramble.

**Only-possible-now element:** OB-driven lean-month prediction + payday-triggered auto-allocation for the self-employed.

## D. Mapping
- **Track:** 4 Financial Education (primary) + 6 Gamification (stability score/streaks).
- **Requirements:** **/04** (resilience/sustainability — strongest in lane) + **/03** (CX for an underserved segment) + **/02** (forecast AI) + **/01** (cashflow analytics). Hits 4 of 5 criteria.

## E. 72h build plan
- **Stack:** RN/Flutter (RTL); cashflow forecast (simple time-series / heuristic + LLM narrative); allocation engine; seeded gig-income feed; ZATCA zakat rules encoded.
- **Built for real:** the forecast + confidence band, the **payday auto-split engine**, the **stability score**, the zakat tracker.
- **Mocked/seeded:** OB gig-income via Alinma sandbox + synthetic "freelancer with lumpy income" persona.
- **Cut-line:** D1 cashflow model + persona. D2 auto-split + stability score + zakat. D3 Arabic polish + the lean-month wow + fallback.
- **The one feature that must work:** the **lean-month prediction + the auto-buffer that covers it**, visualized.

## F. Data story
- **Data:** OB gig-income (sandbox/synthetic) + ZATCA zakat parameters + GOSI optional-contribution data.
- **Insight live:** a volatile income curve **smoothed** into a steady "available to live on" line, with a flagged dry month now pre-funded; stability score moving from red→green.

## G. Demo script (3 min)
1. **0:00:** "150,000 Saudi freelancers. Great months, dry months, zero safety net. Alinma built iz Business for them — Misnad gives them the financial brain."
2. **0:40:** persona's lumpy income loads; AI flags "August will be dry — 62% confidence."
3. **1:20 — wow:** a SAR 9,000 invoice lands → auto-split animates (zakat, buffer, goal) → the dry month turns green, **pre-funded**.
4. **2:10:** stability score climbs; a hibah runway-milestone reward unlocks (gift, not draw).
5. **2:45:** "This is financial inclusion as a product — and Alinma's iz Business already owns the channel."

## H. Bank-ship case
- **On-strategy bullseye:** plugs straight into **"iz Business"** (freelancers/SME, launched Oct 2025) — the channel already exists.
- **Revenue:** stickier primary-account relationship for a fast-growing segment; buffer/goal balances = **deposits**; natural path to halal SME finance cross-sell once stability is proven (alt-data underwriting).
- **Inclusion / Vision 2030:** the strongest **/04 sustainability** and financial-inclusion narrative in the lane — directly serves a gig-economy population the FSDP wants banked.
- **Shariah:** zakat-native; rewards as **hibah**; no riba. **PDPL:** explicit OB consent; **SAMA:** licensed OB rails.

## I. Differentiation
- vs **Drahim/Malaa (PFM):** they track; Misnad **forecasts + acts on payday + smooths volatility** — built for irregular, not salaried, income.
- vs **Hakbah:** group savings, not income-smoothing.
- vs generic budgeting: the **lean-month prediction + zakat autopilot** for the self-employed is unserved in KSA.
- **vs [[concept-rizq-freelancer-copilot|Agent 3's Rizq]] (same segment — de-conflicted):** Rizq is a *conversational CX co-pilot* (advice/actions, Track 2). Misnad is a *gamified behavior-change engine* (stability-score game + payday autopilot + streaks, Tracks 4+6). Same freelancer pain, **different mechanic and track** — complementary, not redundant: Misnad's auto-allocation + stability score could be the behavioral layer *under* a Rizq-style co-pilot. The operator should pick by judging emphasis (gamification/education vs CX) and not pitch both.
- Limit: narrower addressable segment than Namaa (freelancers vs all youth) → caps the deposit-growth ceiling.

## J. Risk register
1. **Forecast accuracy in 72h / on thin history.** → Mitigate: show a confidence band, frame as a planning aid not a guarantee; demo on a rich persona.
2. **Segment size skepticism.** → Mitigate: 150k registered + 3M+ women interested + Vision-2030 priority; position as the on-ramp, expandable to all variable-income earners (commission/sales).
3. **Demo complexity (many moving parts).** → Mitigate: one clean persona, one dry month, one invoice — resist feature sprawl on stage.

## K. Score (100)
| Criterion | Wt | Score | Why |
|---|---|---|---|
| Innovation & creativity | 20 | **16** | Lean-month forecast + payday autopilot + zakat for gig workers is fresh in KSA. |
| Technical implementation | 20 | **15** | Forecast + allocation + zakat in 72h is ambitious; lean on heuristics + seeded data. |
| Data analysis | 20 | **16** | Income-volatility analytics + smoothing is a clean, legible data story. |
| User experience (UX) | 15 | **13** | Strong, but more utilitarian than Namaa's game feel. |
| Real-world feasibility | 25 | **22** | iz Business hook + inclusion narrative are excellent; narrower segment caps deposit upside. |
| **Total** | **100** | **82** | |

**Gates:** ✅ 72h-demoable · ✅ differentiated (forecast + payday autopilot + zakat) · ✅ Shariah-compliant (zakat-native, hibah, no riba) · ✅ PDPL+consent+SAMA · ✅ one track + ≥1 req.

## Links
- [[research]] · [[raw-ideas]] · [[concept-namaa]] · [[concept-faheem]] · [[champion]] · [[master-scoreboard]]
