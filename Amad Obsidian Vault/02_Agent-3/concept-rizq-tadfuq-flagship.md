---
title: "FLAGSHIP — Tadfuq-inside-Rizq (Lane 1 × Lane 3 joint build)"
tags: [agent/3, agent/1, concept, status/flagship, track/customer-experience, track/open-banking, req/ai, req/data, req/cx, req/sustainability, score/88]
updated: 2026-06-18
---

# ⭐ FLAGSHIP — Tadfuq-inside-Rizq
> The portfolio's recommended ceiling (≈**88 calibrated**, per [[00_SYNTHESIS]] §6.1). A joint **Lane 1 × Lane 3** build: Agent 1's [[concept-tadfuq|Tadfuq]] credit engine as the backend, Agent 3's [[concept-rizq-freelancer-copilot|Rizq]] freelancer co-pilot as the human front-end. Co-credit: **Agent 1 + Agent 3.** This is not a new idea — it's the *correct packaging* of two strong ones into the build with both the data moat **and** the vivid demo.

## A. One-liner
**A freelancer co-pilot that turns lumpy, invisible income into a calm monthly plan — and the moment a lean month is forecast, underwrites a Shariah buffer from open-banking + ZATCA + POS data in under 15 seconds, with an ALLaM-explained decision card, for the 2.25M Saudis no SIMAH score can see.**

## B. Why combined > either alone (the thesis)
- **Tadfuq alone** has the uncopyable OB×ZATCA data moat and the biggest market (SAR 0.5T gap) — but B2B underwriting "doesn't make a tired judge gasp in 3 minutes" (synthesis §4).
- **Rizq alone** has the best *human* demo and genuine income-modeling — but its credit/buffer step was a stub.
- **Together:** Rizq supplies the face and the story (Noura, a real freelancer); Tadfuq supplies the engine and the moat (live <15s explainable underwrite). The combined build scores **Tadfuq's data/feasibility AND Rizq's UX/innovation** in one demo — which is why the synthesis calls it the portfolio's true ceiling.

## C. Solution (the integrated loop)
1. **Rizq front-end (Lane 3):** connect accounts via OB → AI classifies + de-noises irregular income → models the pattern → auto-buckets each payment into zakat / VAT / smoothing-reserve / spendable → forecasts the lean month.
2. **Tadfuq backend (Lane 1):** when a shortfall is forecast, Tadfuq underwrites a **Tawarruq/Murabaha** buffer sized to *modeled* income, fusing **OB cash-flow + ZATCA e-invoices + POS**, and returns an **ALLaM-explained decision card** ("limit SAR 8,400 — because your last 9 months average SAR 11k with 3 recurring clients") in <15s.
3. **Trust spine (optional, → [[00_SYNTHESIS]] §6.2 "Thiqa"):** the underwrite is expressible as a portable, consented, explainable creditworthiness score — "watch an invisible freelancer become bankable."

## D. Mapping
- **Track (one):** **2 — Customer Experience** (the win-case is the freelancer *experience*; OB + GenAI are the mechanisms). *Alt framing: Track 5 Open Banking if the panel weights the data moat.*
- **Requirements:** **/03 CX + /01 Data + /02 AI + /04 Sustainability** (4 of 4 → maps onto 4 of 5 judging criteria).

## E. 72h build plan (joint team)
**Division of labor (clean interface = the key to a joint build):**
- **Lane-1 pair** owns the Tadfuq service: OB×ZATCA×POS feature pipeline + the underwriting model + the ALLaM explanation. Exposes ONE contract: `underwrite(account) → {limit, structure, explanation, confidence}`.
- **Lane-3 pair** owns the Rizq app: Arabic RTL UX, income classifier + forecast, the bucket engine, and the buffer-offer flow that *calls* `underwrite()`.
- **Shared:** the synthetic Saudi freelancer dataset (3 personas) + deterministic demo seed + offline fallback recording.
**Built vs mocked:** *Built* — income model, forecast, buckets, the underwrite engine + explanation, the integrated UI. *Mocked* — OB/ZATCA/core rails (sandbox + synthetic), actual disbursement (logic real, settlement stubbed).
**The one feature that must work:** the **lean-month forecast → <15s explained underwrite** reveal.

## F. Data story (the strongest in the portfolio)
- Real income-pattern modeling (Rizq) + the OB×ZATCA×POS feature contributions behind the limit (Tadfuq) → two layers of genuine analysis, shown live: the jagged income chart + smoothed baseline + the "why this limit" feature breakdown. This is what lifts the Data criterion that standalone Rushd lacked.

## G. Demo script (3 min)
1. Connect **"Noura," freelance designer.** Income chart = chaos. (0:30)
2. Rizq draws the smoothed baseline, names her two riskiest months, shows the auto-buckets (zakat/VAT/save) filling as a SAR 6,000 client payment lands. (1:15)
3. Rizq forecasts **August short by SAR 2,400.** One tap → **Tadfuq underwrites a Tawarruq buffer in <15s**, ALLaM explains the limit with the data behind it, shows the structure. (2:20)
4. Close: *"4.3M unbanked, 2.25M freelancers with no credit file. We just made one of them bankable in 15 seconds — on data only Saudi Arabia has, in an experience they'll actually use. Alinma ships this into **iz Business**."* (3:00)

## H. Bank-ship case (combines both)
- **New revenue book** (Tadfuq: compliant freelancer lending where SIMAH can't) **+ sticky deposits** (Rizq: smoothing reserves) **+ acquisition** of a fast-growing under-banked segment Alinma already targets (Freelance Card, iz Business).
- **On-strategy:** OB×ZATCA moat = "new revenue streams + fintech-partner access" (Alinma's stated strategy); ships into **iz Business** (Oct 2025).
- **Compliance:** PDPL + OB consent; Tawarruq (no riba); SAMA responsible-lending (limits sized to modeled affordability); ALLaM-explained = auditable decisions.

## I. Differentiation
- vs **EWA (Mudad×Khazna):** payroll-tied; this serves no-employer freelancers.
- vs **erad/Lendo/Sulfah (SME lending):** they underwrite SMEs on docs; this underwrites *individual freelancers* on live OB×ZATCA cash-flow with a consumer-grade experience.
- vs **Malaa/Drahim (PFM):** they categorize; this *acts* (underwrites + buckets + plans) on irregular income.

## J. Risk register
| Risk | Type | Mitigation |
|---|---|---|
| Joint-build integration overhead (two teams) | Execution | ONE frozen interface (`underwrite()`) by H8; mock it first so both sides build in parallel. |
| Scope creep (two concepts' worth) | Execution | Demo is ONE loop; everything else is roadmap. Cut line enforced. |
| Underwrite looks like a "black box" | Trust | ALLaM explanation card with the data drivers is mandatory, not optional. |
| Buffer = riba concern | Shariah | Validated Tawarruq/Murabaha; structure shown; board-reviewed. |

## K. Score — **≈88 calibrated** (per [[00_SYNTHESIS]])
Inherits Tadfuq's Data (19) + Feasibility (23) and Rizq's UX/innovation/human-demo. The integration is the single highest-ceiling build in the portfolio for a **data/AI-led team** (synthesis §4 recommendation). For a **demo-led team**, [[concept-haseen|Haseen]] remains the lowest-variance #1.

## De-confliction
- If the operator builds this flagship, **do not also pitch standalone Rizq or standalone Tadfuq** (it absorbs both). Agent 4's [[concept-misnad|Misnad]] shares the segment — pick one freelancer entry.
- This is a **joint Lane-1×Lane-3 entry**; Agent 1 owns Tadfuq, Agent 3 owns Rizq. Built collaboratively.

## Links
- [[concept-rizq-freelancer-copilot]] (A3 front-end) · [[concept-tadfuq]] (A1 backend) · [[00_SYNTHESIS]] (§6.1 origin) · [[rushd-v2-sharpened]] (my standalone lane champion) · [[concept-haseen]] (the demo-led alternative)
