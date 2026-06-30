---
title: "خِدمة Khidma — Closed-Loop Resolution Agent"
tags: [agent/3, concept, status/finalist, track/customer-experience, req/ai, req/cx, score/81]
updated: 2026-06-18
---

# خِدمة Khidma — the support agent that actually resolves
> *Khidma (خِدمة)* = service. The honest version of "AI customer service" — it *fixes the thing*, in Arabic, instead of deflecting you to a queue.

## A. One-liner
**A Khaleeji-Arabic AI support agent that doesn't just answer — it resolves: it disputes the transaction, reissues the card, reverses the failed transfer, and adjusts the limit end-to-end, escalating to a human only on true exceptions — and turns every resolved case into a proactive one-tap fix for the next 400 customers who'll hit it.**

## B. Problem
- Saudi banks score **−82.1% net sentiment on customer service** and **−81.1% on digital experience** — driven by app downtime and **extended resolution times**; today's "chatbots" deflect, then dump you into a queue. [Zawya](https://www.zawya.com/en/business/banking-and-insurance/saudi-banks-score-low-on-customer-service-digital-experience-analysis-a1gb3pme)
- Customers describe problems in dialect, with emojis, one-word rage ("لا يعمل"); current bots fail on Khaleeji intent + can't take action. Support cost (call centers, branches) is a real opex line.
- **Why now:** agentic AI can now *execute* against core systems — Monzo + Gradient Labs resolves **90% of queries** with high QA; the tech is proven, just not localized for Arabic + Islamic banking. [Deloitte](https://www.deloitte.com/us/en/insights/industry/financial-services/agentic-ai-banking.html)

## C. Solution
- **Understand (dialect-robust):** ALLaM-based intent on messy Khaleeji input incl. voice + screenshots (multimodal: "my transfer failed" + screenshot → reads the error).
- **Resolve (closed loop):** tool-calling against (mocked) core-banking — `dispute_txn`, `reissue_card`, `reverse_transfer`, `adjust_limit`, `explain_fee` — completes the action and confirms, with a human handoff only when policy/risk thresholds trip.
- **Learn → prevent:** clusters resolved cases; when a pattern spikes ("400 customers hit a failed SARIE transfer to merchant X"), it **proactively pushes a one-tap fix** to affected customers before they complain. (The "closed loop" = the innovation twist over a support bot.)

## D. Mapping
- **Track:** 2 — Customer Experience *(single ✓)*.
- **Requirements:** **/02 AI** (agentic resolution + dialect NLU) + **/03 CX** (frictionless service). Touches **/01 Data** (case clustering for prevention).

## E. 72h build plan
**Architecture:** Arabic RTL chat/voice UI → ALLaM intent + multimodal (OCR for screenshots) → agent with 4–5 resolution tools → mock core-banking + ticketing → a case-clustering job feeding the proactive-fix feed.
**Built vs mocked:** *Built* — dialect intent, the resolution agent + 4 tools, the case-clustering → proactive-fix loop, the Arabic UI. *Mocked* — core-banking actions (return success/exception states), the human-agent handoff (stub), ticketing.
**Day-by-day:** D1 intent + 2 tools + UI; D2 remaining tools + screenshot path + exception/handoff; D3 clustering → proactive feed + polish.
**Must-work feature:** a messy Khaleeji complaint → a *completed* dispute + confirmation, on stage.

## F. Data story
- **Dataset:** synthetic support-ticket corpus in Khaleeji dialect (generated) + a synthetic transaction set to ground disputes; KAPSARC merchant data for realism.
- **Insight live:** dashboard — first-contact resolution rate, avg handle time, and the **clustering view** that surfaces an emerging systemic issue → proves the prevent-not-just-resolve loop. (Data story is operational, not analytical — its weaker axis.)

## G. Demo script (3 min)
1. Customer types in dialect + a screenshot: "حوّلت لأخوي وما وصلت 😡".
2. Khidma reads the screenshot, identifies the failed SARIE transfer, **reverses it**, confirms — in Arabic, ~15 seconds.
3. Cut to the ops view: Khidma has noticed 400 others hit the same merchant issue → it **pushes them a one-tap fix proactively.**
4. Land it: "Sector service sentiment is **−82%**. Monzo's AI resolves **90%** of queries. Khidma does that in Arabic, *and* prevents the next wave. It cuts Alinma's support cost and lifts NPS — shippable on watsonx."

## H. Bank-ship case (Alinma)
- **Cost:** the clearest "saves the bank money" case of my three — deflects call-center + branch load (industry: 20–40% service-cost cut). [Deloitte](https://www.deloitte.com/us/en/insights/industry/financial-services/agentic-ai-banking.html)
- **NPS:** attacks the *measured* −82% pain directly; fastest sentiment win.
- **Stack:** ALLaM on watsonx; integrates with Alinma's API Connect + existing channels.
- **Compliance:** PDPL (handles account data under consent); SAMA consumer-protection aligned; risk-gated actions with human-in-the-loop on exceptions; full audit log.

## I. Differentiation
- **vs Al Rajhi "Rajhi" + generic bots:** they *answer/deflect*; Khidma *executes the fix* and *prevents recurrence*.
- **Unfair edge:** closed-loop (resolve → cluster → proactively prevent) + true Khaleeji-dialect + multimodal (screenshots) — most bots do none of these.
- *Honest note:* lowest-innovation of my three; its case rests on **certainty + measurable ROI**, not novelty.

## J. Risk register
| Risk | Type | Mitigation |
|---|---|---|
| Agent takes a wrong action (reverses valid txn) | Technical/risk | Risk thresholds + confirmation + human handoff on high-value/ambiguous; full audit + reversal. |
| Reads as "just a chatbot" | Innovation perception | Demo must *complete an action* + show the proactive-prevention loop, not Q&A. |
| Dialect NLU misfires live | Demo | Curated dialect test set; deterministic demo inputs; confidence floor → escalate. |

## K. Score — **81 / 100**
| Criterion | Wt | Score | Why |
|---|---|---|---|
| Innovation | 20 | **13** | Closed-loop resolve→prevent + dialect + multimodal is a real twist, but support agents are common. |
| Technical | 20 | **17** | Robust agentic execution + clustering; very demoable. |
| Data | 20 | **14** | Operational metrics + clustering; less of an analytical "wow." |
| UX | 15 | **14** | Dialect + voice + screenshot input = genuinely frictionless Arabic CX. |
| Feasibility | 25 | **23** | Strongest hard-ROI + measured-pain case; clear deploy path. |

**Gates:** 72h ✅ · Differentiated ✅ (closed-loop + dialect) · Shariah ✅ (neutral) · PDPL/SAMA ✅ · One track + req ✅ → **PASS.**

## Links
- Champion: [[concept-rushd-shariah-copilot]] · [[concept-rizq-freelancer-copilot]] · [[research]] · [[raw-ideas]]
