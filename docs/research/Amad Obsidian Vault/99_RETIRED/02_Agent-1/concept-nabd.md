---
title: Concept — Nabd al-Mansha'a (نبض المنشأة) · SME Financial-Health Radar
tags: [agent/1, concept, status/finalist, track/open-banking, req/data, req/ai, score/84]
updated: 2026-06-18
---

# 📡 Nabd al-Mansha'a (نبض المنشأة) — SME Financial-Health Radar
**Track:** 5 · Open Banking + 1 · GenAI · **Requirements:** /01 Data + /02 AI · **Score: 84/100**
*Different bet from [[concept-tadfuq]]: monitoring the existing book, not originating new credit.*

## A. One-liner
**"Nabd gives the bank a live heartbeat for every SME it lends to — streaming open-banking + ZATCA signals to flag deterioration weeks before default and surface upsell moments the day they appear."**

## B. Problem
Banks underwrite an SME **once** at origination, then fly blind until a payment is missed. By then the loss is baked in. With open banking + ZATCA now streaming continuously, that opacity is a choice — and NPLs in the SME book are a direct hit to the P&L a credit officer feels instantly.

## C. Solution
A **portfolio cockpit** for the bank's SME relationship/risk teams: each borrower gets a real-time **health score** built from OB cash-flow trends, ZATCA revenue trajectory, buyer concentration, and balance volatility. AI raises **early-warning alerts** ("revenue down 30% MoM + rising overdraft → contact in 14 days") and **opportunity alerts** ("invoice volume up 50% → eligible for a higher Tawarruq line"). Every alert is explainable. **Only-now:** continuous, consented, dual-source observation of a live book.

## D. Mapping
Track 5; /01 Data (time-series portfolio analytics) + /02 AI (anomaly detection + forecasting). Bank-facing.

## E. 72-hour build plan
- React dashboard (portfolio grid + per-SME drill-down) → service computing rolling health features over **synthetic + sandbox** OB/ZATCA streams → anomaly/forecast model → alert feed.
- *Built:* scoring + alerting + drill-down UI. *Mocked:* live bank feed (synthetic streams simulate 50–100 SMEs, a few scripted to deteriorate/grow on cue).
- Must-work feature: a borrower's score visibly **dropping in real time** as bad signals stream in, firing an explained alert.

## F. Data story
Time-series over a simulated SME book; the live insight is a **leading indicator** — show an SME's score crossing the risk line *before* a missed payment, with the contributing signals ranked. Portfolio-level heatmap = depth beyond one chart.

## G. Demo script (3 min)
Portfolio heatmap (1 healthy, 1 amber, 1 red) → click the amber SME → watch revenue/cash-flow trend + the **14-day early-warning** with recommended action → flip to a green SME firing an **upsell** alert → close: "Nabd turns Alinma's SME book from a once-a-year guess into a live, defensible risk-and-growth radar."

## H. Bank-ship case
**Cost/risk is the easiest sell:** fewer NPLs = direct P&L savings; proactive RM outreach = retention + upsell. Built on licensed OB + SAMA Lab; PDPL/consent (borrower consents at origination); Shariah-aligned (limit changes use Tawarruq/Murabaha). Fits Alinma's IBM data platform.

## I. Differentiation
Most KSA OB activity is **origination/PFM-facing**; a **continuous bank-side monitoring** layer fusing OB+ZATCA is white space. vs generic BI dashboards: real-time, consented, predictive, explainable.

## J. Risk register
1. Less visually "wow" than origination → *mitigation:* the live score-drop animation + a hard P&L number.
2. Needs believable streaming data → *mitigation:* scripted synthetic deterioration events.
3. "Is it predictive or just reporting?" → *mitigation:* show a back-tested lead-time stat on synthetic data.

## K. Score — 84/100
| Criterion | Wt | Score |
|---|---|---|
| Innovation | 20 | 15 |
| Technical | 20 | 16 |
| Data analysis | 20 | 18 |
| UX | 15 | 12 |
| Feasibility | 25 | 23 |

**Gates:** ☑ all pass (72h-demoable, differentiated, Shariah-aligned, PDPL/SAMA, 1 track + 2 reqs).

## Links
- [[concept-tadfuq]] · [[concept-misnad]] · [[research]] · [[master-scoreboard]] · [[00_Index]]
