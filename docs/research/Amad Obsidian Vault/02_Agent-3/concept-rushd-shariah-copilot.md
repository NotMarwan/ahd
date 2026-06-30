---
title: "رُشد Rushd — Shariah-aware Money Co-pilot"
tags: [agent/3, concept, status/finalist, status/champion, track/genai, req/ai, req/cx, score/89]
updated: 2026-06-18
---

# 👑 رُشد Rushd — the Shariah-aware money co-pilot
> *Rushd (رُشد)* = in Islamic jurisprudence, the maturity/competence to manage one's own wealth (Qur'an 4:6, "آنستم منهم رُشدًا"). The product gives every customer that *rushd*.

## A. One-liner
**An action-taking AI co-pilot inside the Alinma app that keeps your money Shariah-aligned — it tags every transaction and product as halal *and explains why*, quietly purifies incidental non-compliant income, and executes Shariah-native money moves on your command, all in Arabic.**

## B. Problem
- Islamic-bank customers carry a quiet, unanswered anxiety: *"Is what I'm actually doing halal?"* — interest credited by mistake, a non-compliant merchant, an investment of uncertain status. Today they either ignore it or queue for a scholar. Documented **skepticism that digital banking is truly Shariah-compliant** keeps people in branches. [JCLI](https://jcli-bi.org/index.php/jcli/article/view/446)
- Generic banking apps are passive dashboards; "personalization" is a banner ad. Saudi banks score **−81% digital-experience / −82% service** sentiment. [Zawya](https://www.zawya.com/en/business/banking-and-insurance/saudi-banks-score-low-on-customer-service-digital-experience-analysis-a1gb3pme)
- **Why now:** three things landed in 2025–26 at once — a **sovereign, Islamic-aligned Arabic LLM (ALLaM)** on Alinma's own IBM stack, the **agentic-AI** wave (assistants that *act*), and the **licensed open-banking** layer (consented multi-source data). The conscience layer was impossible 24 months ago.

## C. Solution
A co-pilot with one defensible spine: **the Shariah Conscience Layer.**
1. **Tag + explain.** Every transaction, product, and holding gets a Shariah status (compliant / doubtful / non-compliant) with a **plain-Arabic reason and a cited board ruling** — tap to see the *why*. Never a black box.
2. **Purify.** Detects incidental non-compliant income (e.g., erroneous interest) → quarantines it → routes to charity with **one-tap consent** (auto-purification, the way Islamic finance is *supposed* to work but never does in practice).
3. **Act.** On command (typed or Khaleeji voice) it executes Shariah-native moves: "move my surplus to a Murabaha savings pot," "is this car finance halal — set it up if so." Each action shows the **Islamic structure used** before it runs.
4. **Guard the line (the rule that makes it shippable):** the AI **never issues a fatwa.** Novel/ambiguous questions are escalated to Alinma's **human Shariah board** (human-in-the-loop); the model only surfaces *existing* rulings. This is exactly what Maqasid/XAI scholarship demands. [JCLI](https://jcli-bi.org/index.php/jcli/article/view/446)
- **Only-now element:** ALLaM (Islamic-aligned Arabic reasoning) + agent tool-calling + consented open-banking data, fused into a *continuous conscience* — not a chatbot you visit, a layer that rides with you.

## D. Mapping
- **Track:** 1 — Generative AI for FinTech *(single track ✓)*.
- **Requirements:** **/02 Use of AI** (agentic reasoning + Shariah classification) + **/03 Improve CX** (proactive, explainable, Arabic-first). Touches **/01 Data** via transaction classification.

## E. 72h build plan
**Architecture:** Arabic-first RTL React/Next front-end → orchestration layer (LangGraph-style agent) → **ALLaM-2-7B served via IBM watsonx.ai or Azure AI Foundry** (Alinma's stack) → tools: `classify_shariah(txn)`, `explain(ruling_id)`, `purify(amount)`, `move_to_pot(amount, structure)`, `escalate_to_scholar(q)` → mock core-banking + OB APIs (SAMA OB Lab / Alinma sandbox) + a small **RAG store of Shariah rulings + Alinma product catalog**.
**Built vs mocked:**
- *Built:* the agent + tool-calling, the Shariah-classifier (merchant→category→status using a curated rules + RAG), the explainable UI cards, RTL Arabic UX, 3 working actions, the purification flow.
- *Mocked:* core-banking + OB calls (synthetic + KAPSARC POS data), Nafath login screen, the human-scholar escalation (stubbed "pending review" with a canned ruling).
**Day-by-day cut line:**
- **D1:** data + synthetic transaction feed (incl. a planted non-compliant merchant + an erroneous-interest event); Shariah classifier + RAG; Arabic UI shell.
- **D2:** agent orchestration + 3 tools; the "halal? why?" card; the purification flow.
- **D3:** the surplus→Murabaha-pot action; voice mode (optional, behind a flag); demo polish + fallback recording.
**The one feature that must work:** the live **"halal? + why + cited ruling"** card on a streamed transaction. Everything else is upside.

## F. Data story
- **Dataset:** KAPSARC/SAMA **POS-by-sector-and-city** (real, CSV) → realistic merchant-categorized spend; + synthetic feed for edge cases. [KAPSARC](https://datasource.kapsarc.org/explore/dataset/point-of-sale-transactions-by-sector-and-city/)
- **Insight shown live:** a streaming transaction feed where the classifier tags each item's Shariah status in real time, surfaces a "12% of your spend this month was at doubtful merchants — here's the breakdown," and triggers the purification + savings actions. Depth beyond one chart: category × Shariah-status × time, with an explainable drill-down per ruling.

## G. Demo script (3 minutes)
1. **0:00 — Hook.** "Every Islamic-bank customer asks one question the app never answers: *is this halal?*" Open Rushd in Arabic.
2. **0:25 — Wow #1.** A live purchase streams in from a non-compliant merchant. Rushd flags it, says *why* in plain Arabic, cites the board ruling, and suggests a compliant alternative. (Judge sees the moat.)
3. **1:10 — Wow #2.** Rushd spots SAR 13.40 of interest credited in error → "this isn't yours to keep" → one-tap purify to charity. (Islamic finance, effortless.)
4. **1:50 — Wow #3.** Voice: "حوّل الفائض إلى وعاء ادخار متوافق." Rushd shows the **Murabaha structure**, confirms, executes. Savings balance ticks up.
5. **2:35 — Land it.** "Rushd runs on ALLaM on Alinma's own IBM watsonx stack. It grows deposits, raises NPS, and deepens the one thing no conventional bank can copy: trust that your money is halal. **Alinma could ship this next quarter.**"

## H. Bank-ship case (Alinma)
- **Revenue + retention:** grows low-cost **savings deposits** (Murabaha pots) → closes SAMA's credit-to-deposit gap; lifts cross-sell 5–15% with explainable, trusted recommendations; raises NPS off a sector floor of −82%.
- **Identity moat:** Shariah-native CX *is* Alinma's brand; a conscience layer is **structurally uncopyable by conventional banks.**
- **Stack fit:** **ALLaM is royalty-free on IBM watsonx** — Alinma already runs IBM API Connect + Cloud Pak + OpenShift + DataPower. Saudi-sovereign model = **data residency ✓**.
- **Compliance:** PDPL + explicit OB consent lifecycle; SAMA-aligned; **AI never issues fatwa** (human Shariah board in the loop) → governance story a bank exec trusts. Stays clear of CMA robo-advisory licensing by scoping to *Shariah classification + education + execution of the bank's own products*, not regulated investment advice.

## I. Differentiation
- **vs Al Rajhi "Rajhi" / generic Arabic chatbots:** they answer FAQs; Rushd *classifies, explains with citations, and acts*. Not a bot you visit — a conscience that rides along.
- **vs robo-advisors (Derayah, Abyan):** they purify *investment portfolios*; Rushd purifies and guides *daily money + behavior + products*, conversationally and proactively.
- **vs zakat apps (Zakaty, Zoya):** a calculator is a destination; Rushd is ambient and action-taking.
- **Unfair edge:** the Shariah-conscience layer can *only* be owned by an Islamic bank with a Shariah board — Alinma is exactly that.

## J. Risk register
| Risk | Type | Mitigation |
|---|---|---|
| AI "issues a fatwa" / wrong ruling → reputational | Regulatory/Shariah | Hard rule: model surfaces *existing* board rulings only; ambiguous → human escalation; every claim cited; confidence threshold gates auto-actions. |
| Looks like "just another AI chatbot" | Demo perception | Lead the demo with the *halal-why + purification + action* loop, not chat; never show a blank chat box first. |
| Live LLM/voice flakiness on stage | Demo-failure | Pre-seed deterministic demo transactions; cache model responses; voice behind a flag with a recorded fallback. |

## K. Score — **89 / 100**
| Criterion | Wt | Score | Why |
|---|---|---|---|
| Innovation | 20 | **18** | Shariah-conscience + agentic action = genuinely novel "only-now" wedge; small deduction for fighting the "AI assistant" perception. |
| Technical | 20 | **17** | Real agent orchestration + classifier + RAG + actions; ambitious but scoped. |
| Data | 20 | **16** | Live classified transaction feed with explainable drill-down; depth good, not a heavy analytics piece. |
| UX | 15 | **14** | Arabic-first RTL, explainable cards, optional voice — strong and on-brand. |
| Feasibility | 25 | **24** | Uniquely Alinma; ALLaM-on-watsonx stack fit; trust wedge; clear deploy + governance path. |

**Gates:** Demo-able 72h ✅ · Differentiated ✅ · Shariah-compliant ✅ (it *is* the Shariah feature) · PDPL/consent/SAMA ✅ · One track + ≥1 req ✅ → **PASS.**

## Links
- 👑 Red-team + why-it-wins: [[champion]] · Other finalists: [[concept-rizq-freelancer-copilot]] · [[concept-khidma-resolution-agent]] · [[research]] · [[raw-ideas]]
