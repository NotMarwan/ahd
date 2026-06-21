---
title: Concept — Tadfuq (تدفّق) · Cash-Flow Credit Engine
tags: [agent/1, concept, status/finalist, track/open-banking, req/data, req/ai, score/90]
updated: 2026-06-18
---

# ⭐ Tadfuq (تدفّق) — The Cash-Flow Credit Engine
**Track:** 5 · Open Banking (primary) — fused with 1 · Generative AI · **Requirements:** /01 Data + /02 AI · **Self-score: 90/100 · Calibrated cross-agent score: 86** (see [[00_SYNTHESIS]])

## 🔁 v2 — Pushed forward (2026-06-18, post cross-agent review)
**New intel folded in** (from [[saudi-fintech-terrain]] / Agent 3 & Agent 4):
- **ALLaM on IBM watsonx** (sovereign Saudi-Arabic LLM, royalty-free on Alinma's *exact* stack) now generates the **explainable decision card** and the **RM "deal-memo"** in native Arabic — this kills two red-team risks at once: the "translated-English tool" UX weakness **and** the "is the explanation real?" credibility objection.
- **Alinma's Kingdom-first Freelance Card** (2025, w/ Social Development Bank) is the concrete on-ramp: Tadfuq turns that *card* into an actual *credit line*. Reframes feasibility from "new product" → "monetize an existing Alinma bet."
- **Quantified thin-file thesis:** 53% of Saudis underserved, **16% unbanked (~4.3M)**, **2.25M freelancers with no SIMAH file** → the addressable gap is now national-priority and sized.
- **POS data** (KAPSARC/SAMA, POS 2025 = **SAR 707.2bn**) added as a 3rd underwriting signal + sector benchmark → deeper data story than OB+ZATCA alone.

**Repositioning — Tadfuq is the portfolio's underwriting PRIMITIVE, not just one product.**
Cross-agent review surfaced **three** irregular-income concepts (this, [[concept-rizq-freelancer-copilot|Rizq]] A3, [[concept-misnad|Misnad]] A4). They don't compete — they **stack on one engine**: Tadfuq = decisioning backend · Rizq = consumer CX · Misnad/Namaa = behavioral layer. **Strategic recommendation:** demo Tadfuq *through* a vivid freelancer front-end ("Noura the designer gets a halal limit in 15s") to neutralize Tadfuq's only weak criterion — B2B demo-vividness — while keeping its data moat. This **Tadfuq-inside-Rizq** play is the portfolio's strongest *combined* Lane-1×Lane-3 bet → full case in [[00_SYNTHESIS]].

## A. One-liner
**"Tadfuq turns 15 seconds of consent into a fundable, Shariah-compliant working-capital limit for any Saudi SME or freelancer — underwritten live from their open-banking cash flow and their government-verified ZATCA invoices, with every riyal of the decision explained."**

## B. Problem
Saudi SMEs and the **2.35M self-employed** are starved of credit: a **~SAR 0.5 trillion** gap, SME credit stuck at **~9% of the loan book** vs the Vision-2030 ~20% target. The root cause is **collateral-based, document-heavy underwriting** — asset-light and irregular-income borrowers are invisible to it, and manual 6-month-PDF-statement review is slow, costly, and high-drop-off. Banks *want* this book but can't underwrite it profitably. **Why now:** open banking became a **licensed** activity (Mar 2026) and **ZATCA Wave 24 (Jun 2026)** just put thousands of small SMEs onto real-time e-invoicing — for the first time the two signals needed to underwrite cash flow safely both exist and are accessible.

## C. Solution
A **bank-side decisioning engine** (Alinma-owned) that, on customer consent:
1. Pulls **open-banking AIS** data (balances, inflows/outflows, salary/revenue rhythm, volatility).
2. Pulls **ZATCA e-invoice** data (verified sales, buyer concentration, receivables) — the **fraud-resistant ground truth** that bank data alone lacks.
3. Runs an **AI underwriting model** that outputs a **limit + price + recommended Shariah structure (Tawarruq/Murabaha)** in seconds.
4. Renders an **explainable decision card** ("your limit is SAR X because: stable 9-month revenue, invoice-verified, 1.4× cash-flow coverage, low buyer concentration") — satisfying the customer, the **Shariah board**, and **SAMA** auditability in one artifact.
**Only-possible-now element:** the **OB × ZATCA fusion**. Open banking shows money *moving*; ZATCA shows verified *sales*. Together they make cash-flow underwriting hard to game — a moat unavailable in the India/UK analogs.

## D. Mapping
- **Track:** Open Banking (5). **Requirements:** /01 Data Analysis (dual-source cash-flow analytics) **and** /02 Use of AI (the underwriting + explainability model). Hits **3 of 5** judge criteria structurally (innovation, data, feasibility) before UX/technical execution.

## E. 72-hour build plan
- **Architecture:** React/Next (Arabic-first/RTL) front end → FastAPI service → (a) **OB connector** against **SAMA Open Banking Lab / Alinma sandbox** mock data, (b) **ZATCA parser** for sample e-invoice XML/JSON, (c) **feature engine** (rolling revenue, volatility, coverage ratio, buyer concentration, DSO), (d) **scoring model** (gradient-boosted on synthetic+sandbox data) with **SHAP-style explanations**, (e) **Shariah-structure selector** (rules → Tawarruq for cash, Murabaha for asset).
- **Built vs mocked:** *Built* — the full consent→fetch→feature→score→explain→offer pipeline + UI. *Mocked* — live bank connection (use sandbox + synthetic transaction generator for volume) and actual commodity-Tawarruq settlement (show the structure, don't execute).
- **Day cut-line:** D1 data pipeline + features on sandbox/synthetic data; D2 model + explainability + Shariah selector; D3 polished RTL UI + demo script + fallback recording.
- **The one feature that MUST work:** consent → **explainable limit in <15s** on screen.

## F. Data story
- **Sources:** SAMA OB Lab mock data + Alinma sandbox (account/transactions) + ZATCA sample invoices + synthetic transaction generator (for realistic volume) + Saudi Open Data / SAMA stats (sector benchmarks for context).
- **The insight shown live:** a real-time, dual-source cash-flow profile that produces a *defensible* limit — e.g., "bank inflows say SAR 180k/mo, ZATCA-verified sales confirm SAR 165k/mo → consistent, fundable; flag if they diverged (revenue inflation)." On-screen: an explainability panel ranking the signals that drove the number — **depth beyond a single chart.**

## G. Demo script (3 minutes)
1. **0:00 — The pain (15s):** "A delivery-fleet SME and a freelance designer both need SAR 150k. Today the bank says: upload 6 months of statements, wait days. ~60% drop off." 
2. **0:15 — The magic (45s):** SME taps **consent** (Nafath-style). Live: balances + ZATCA invoices stream in. **<15s later** a limit appears.
3. **1:00 — The depth (60s):** Open the **explainable decision card** — coverage ratio, revenue stability, invoice verification, buyer concentration; flip to the **Shariah structure** (Tawarruq) and the **SAMA/Shariah audit trail**.
4. **2:00 — The range (40s):** Switch to the freelancer profile → a smaller but real limit, same engine. "One engine, the whole long tail of Saudi finance."
5. **2:40 — The close (20s):** "Built on the licensed open-banking layer and ZATCA — **Alinma can ship this on its IBM API platform next quarter.** This is the SAR 0.5-trillion book, finally underwritable."

## H. Bank-ship case (Alinma's language)
- **Revenue:** opens the SME/freelancer lending book (Vision-2030 20%-by-2030 target) + future **data-product/API monetization** to fintech partners — on Alinma's stated strategy ("new revenue streams + fintech/corporate access").
- **Cost/risk:** automated underwriting replaces manual review; **ZATCA ground truth** cuts revenue-inflation fraud; explainability lowers audit cost.
- **Compliance:** built on the **licensed OB layer** + **SAMA Lab conformance**; **Shariah-native** (Tawarruq, no riba); **PDPL/consent-first**; deployable on Alinma's **IBM API Connect / OpenShift** stack.

## I. Differentiation
- vs **erad/Lendo/Sulfah** (non-bank lenders, mostly single-signal): Tadfuq is **bank-owned** and **multi-signal (OB + ZATCA)** with **explainability** baked in for the Shariah board.
- vs **Drahim/PFM**: not a consumer money-manager — a **credit-origination engine**.
- vs **Lean/Tarabut** (rails): Tadfuq is the **decisioning layer on top** of the rails, not another pipe.
- **Unfair edge:** the **OB × ZATCA fusion** is uniquely available in KSA *right now* (both regimes matured in 2026) and is hard to replicate without both data rights.

## J. Risk register
1. **Technical (demo):** sandbox/ZATCA data thin → *mitigation:* synthetic transaction generator seeded to realistic Saudi SME patterns; pre-recorded fallback of the <15s flow.
2. **Regulatory:** Tawarruq structuring nuance → *mitigation:* show structure + audit trail, don't claim execution; cite SAMA/Shariah governance; keep PDPL consent explicit on screen.
3. **Credibility:** "is the model real?" → *mitigation:* show feature importances + a back-test slide on synthetic data; frame as a working prototype of a deployable engine, not a finished risk model.

## K. Score — 90/100
| Criterion | Wt | Score | Why |
|---|---|---|---|
| Innovation & creativity | 20 | **17** | OB×ZATCA fusion + explainable Shariah underwriting; not a clone; only-now angle. |
| Technical implementation | 20 | **17** | Full pipeline genuinely buildable in 72h on sandbox+synthetic; robust live demo. |
| Data analysis | 20 | **19** | Dual-source, real features, live explainable insight — depth beyond a chart. |
| User experience (UX) | 15 | **13** | Arabic-first/RTL, clean decision card; B2B but visually demoable. |
| Real-world feasibility | 25 | **24** | Squarely on Alinma strategy + stack; compliant; clearest "ship next quarter" path. |

**Gates:** ☑ 72h-demoable ☑ Differentiated ☑ Shariah-compliant (Tawarruq) ☑ PDPL/consent/SAMA ☑ 1 track + 2 reqs → **ALL PASS.**

## Links
- [[champion]] (red-team lives there) · [[research]] · [[raw-ideas]] · [[concept-nabd]] · [[concept-misnad]] · [[master-scoreboard]] · [[00_Index]]
