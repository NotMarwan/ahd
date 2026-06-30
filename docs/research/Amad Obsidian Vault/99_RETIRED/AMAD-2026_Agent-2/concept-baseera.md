---
title: "Concept — بصيرة Baseera (GenAI AML Investigation + SAMA Counter-Fraud Copilot)"
tags: [agent/2, status/finalist, track/regtech, track/genai, req/data, req/ai, score/81]
---

# 🔬 بصيرة · Baseera — GenAI AML Investigation + SAMA Counter-Fraud Copilot

> *Baseera (بصيرة) = "insight / clear-sightedness."* The copilot for the bank's financial-crime analyst — it triages the flood of alerts, explains *why* each fired, drafts the regulator-ready report in Arabic, and auto-assembles the new mandatory SAMA quarterly Counter-Fraud filing.

**Track:** 3 — Financial Regulations (RegTech) *(secondary: 1 — Generative AI)*
**Requirements:** **/01 Data Analysis + /02 Use of AI**
**Score:** **81 / 100**

## A. One-liner
*An explainable GenAI copilot that turns the AML analyst's 95%-false-positive alert queue into ranked, narrated cases — auto-drafting the STR/SAR in Arabic and generating the SAMA quarterly Counter-Fraud compliance report that became mandatory in 2026.*

## B. Problem
**AML compliance is a pure cost sink, and SAMA just made it heavier.**
- Legacy transaction monitoring runs at **~95% false positives**; investigating one alert can take up to **22 hours**; **77%** of institutions cite analyst staffing as their top constraint; global AML spend is **~$274B/yr**. Every false positive is paid human time.
- **SAMA's Counter-Fraud Fundamental Requirements** add a **mandatory quarterly compliance report** (required since end-Q3 2025; full compliance 13 Apr 2026) — more reporting load on the same drowning teams.
- Analysts need *triage + explanation + drafting*, not another alert generator.

## C. Solution
A copilot layer over the existing alert stream (it does **not** replace the monitoring engine — it sits on top, even on top of Mozn/FOCAL output):
- **Triage & rank** alerts by genuine risk; cluster duplicates; auto-dismiss explained false positives with a logged rationale.
- **Explainability** — for each alert, a plain-Arabic "why this fired" (which rules/features, what the network looks like) so the analyst decides in minutes, not hours.
- **Auto-draft the STR/SAR narrative** in regulator-ready Arabic, citing the evidence; analyst reviews + signs (human-in-the-loop).
- **Auto-assemble the SAMA quarterly Counter-Fraud report** from the period's activity.

**Only-possible-now:** LLMs can read heterogeneous case evidence and produce a faithful, cited narrative — the bottleneck that made investigation a 22-hour job.

## D. Mapping
- **Track (one):** 3 — Financial Regulations (RegTech). *(GenAI is the engine.)*
- **Requirements:** **/01 Data Analysis** (alert triage, clustering, network reasoning), **/02 Use of AI** (explanation + narrative + report generation).

## E. 72h build plan
**Architecture:** synthetic AML alert + transaction + customer dataset → triage/ranking model + clustering → retrieval over case evidence → LLM (**ALLaM via IBM watsonx**, Alinma's stack) for Arabic explanation + STR draft + quarterly-report assembly → analyst review UI.
**Built for real:** the analyst queue with ranked/clustered alerts, the "why" panel, an LLM-drafted Arabic STR for a selected case, and a generated quarterly-report draft.
**Mocked:** integration with a live core/monitoring system (ingest a synthetic alert feed), real regulator submission.
**Day-by-day:** D1 — synthetic alert/transaction data + triage/cluster. D2 — explainability panel + LLM STR drafting + report assembly. D3 — analyst UX polish + the "22 hours → 8 minutes" demo + deck.
**Must work:** select a flagged case → instant Arabic explanation + a clean, cited STR draft on screen.

## F. Data story
- **Data:** synthetic AML alerts/transactions with labeled true/false positives + mule rings; public AML typologies; SAMA reporting template structure.
- **Insight:** "of 1,000 alerts, 940 are explainable false positives auto-cleared; the 60 real ones are ranked and narrated — analyst time per true case drops from ~22h to minutes."
- **On screen:** the queue collapsing from 1,000 noisy alerts to 60 ranked cases; a live STR draft generating.

## G. Demo script (3 min)
1. **0:00** — "Banks pay analysts to chase alerts that are wrong 95% of the time. SAMA just added a mandatory quarterly report on top." 
2. **0:30** — Show the raw 1,000-alert queue; Baseera collapses it to 60 ranked cases, each with a one-line reason.
3. **1:30** — Open one real case → instant Arabic "why it fired" + network view → click **Draft STR** → a cited, regulator-ready Arabic narrative appears; analyst signs.
4. **2:20** — Click **Generate SAMA Quarterly Report** → assembled draft. Close: "We didn't replace the bank's fraud engine — we gave its analysts their time back and shipped the SAMA report for free."

## H. Bank-ship case
- **Cost:** the clearest hard-money ROI in the portfolio — analyst hours are a line item; cutting investigation time and false-positive load is directly costable.
- **Compliance:** produces the **mandatory SAMA quarterly Counter-Fraud report**; STRs are regulator-formatted; explainability satisfies audit/model-governance expectations.
- **Shariah:** back-office integrity tooling; *hifz al-mal* + *amanah*; no interest mechanic.
- **PDPL/SAMA:** runs inside the bank on existing alert data; human-in-the-loop (never auto-files); fully auditable.
- **On-strategy:** complements (doesn't compete with) Alinma's existing/likely FRAML stack; layers onto IBM watsonx.

## I. Differentiation
- **The risk:** Mozn/FOCAL now markets **"agentic AI autonomous case investigation"** — this is the closest competitor to any concept here.
- **The wedge:** Baseera is **explainability-first + analyst-augmenting (not autonomous) + Arabic regulator-output + tied to the brand-new SAMA quarterly-report mandate**, and it's **engine-agnostic** (sits on top of *any* monitoring output, including FOCAL's). Positioned as the analyst's copilot, not a rival FRAML engine.

## J. Risk register
1. **Mozn overlap** — "FOCAL already does autonomous investigation." → Mitigate: position as explainable *copilot on top of any engine* + the SAMA-report wedge; don't claim to replace the monitoring core.
2. **Back-office demo = lower wow** — no consumer drama. → Mitigate: the "1,000 → 60 + instant STR" collapse is a strong visual; lead with the cost number.
3. **LLM hallucination in a regulatory document.** → Mitigate: retrieval-grounded, cited, human-in-the-loop sign-off; never auto-submits.

## K. Score — **81 / 100**
| Criterion | Wt | Pts | Why |
|---|---|---|---|
| Innovation | 20 | **13** | Strong execution but closest to Mozn's agentic-investigation territory; wedge is narrow. |
| Technical | 20 | **17** | Very buildable; retrieval + LLM + triage is well-trodden and demos cleanly. |
| Data | 20 | **18** | Deepest data story — triage analytics + network + measurable false-positive reduction. |
| UX | 15 | **11** | Back-office analyst tool; functional, not delightful. |
| Feasibility | 25 | **22** | Clearest hard-money ROI + a real compliance mandate, but enterprise sales cycle + Mozn-adjacent. |

**Gates:** ✅ 72h-demoable · ✅ differentiated (explainable copilot + SAMA-report wedge, engine-agnostic) · ✅ Shariah-compliant · ✅ PDPL/SAMA (human-in-the-loop, auditable) · ✅ one track (3) + 2 requirements.

See [[concept-haseen]] (champion), [[concept-raqib]], [[saudi-fintech-terrain]].
