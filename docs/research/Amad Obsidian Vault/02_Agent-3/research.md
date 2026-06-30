---
title: Agent 3 — Recon Log (Phase 1, Lane 3 GenAI CX)
tags: [agent/3, research, track/genai, track/customer-experience, req/ai, req/cx]
updated: 2026-06-18
---

# 🔭 Agent 3 — Phase 1 Recon (GenAI Customer Experience)
> 20 live searches, deep in lane. Shared findings pushed to [[saudi-fintech-terrain]]. Lane = Tracks 1 (GenAI) + 2 (CX); /02 AI + /03 CX.

## A. Pain map (who hurts, how big, what a bank exec recognizes)
**Retail customers**
- **Trust gap — "is my banking actually halal?"** Documented skepticism that digital banking is genuinely Shariah-compliant; many still prefer face-to-face for assurance. For an *Islamic* bank this is the deepest, most ownable pain. [JCLI](https://jcli-bi.org/index.php/jcli/article/view/446)
- **Awful service experience.** Saudi banks' **digital-experience net sentiment −81.1%, customer-service −82.1%** — outages, app downtime, slow issue resolution. A bank exec feels this in NPS + call-center cost. [Zawya](https://www.zawya.com/en/business/banking-and-insurance/saudi-banks-score-low-on-customer-service-digital-experience-analysis-a1gb3pme)
- **Passive, generic apps.** Customers get static dashboards, not proactive guidance; personalization is shallow.
- **Behavioral overspend.** BNPL ($1.48bn 2025) erodes youth savings/investment; low financial self-regulation. [Research](https://uk.finance.yahoo.com/news/saudi-arabia-buy-now-pay-095600269.html)

**SMEs / freelancers**
- **2.25M freelancers / 220k+ licenses**, irregular "lumpy" income, no SIMAH credit file, manual zakat/VAT, no cashflow visibility → financial anxiety. **53% of Saudis underserved, 16% unbanked (~4.3M).** [AGBI](https://www.agbi.com/opinion/banking-finance/2024/06/the-gulf-is-ripe-for-fintechs-to-serve-the-underserved/) · [ArabNews](https://www.arabnews.com/node/2584265)
- Existing **Earned Wage Access (Mudad×Khazna, Jul-2025) is payroll-tied → leaves freelancers out.**

**The bank itself**
- **Service cost** (call centers, branch load) + **−82% service sentiment** = retention + opex bleed.
- **Credit-to-deposit growth gap** (SAMA, 100bps countercyclical buffer May-25): credit outpaces deposits → the bank needs **low-cost deposit/savings growth**. A CX product that grows savings is on the P&L. [SAMA Q2-25](https://www.sama.gov.sa/en-US/EconomicReports/DevelopmentReports/Key_Economic_Developments_Q2_2025.pdf)
- **Cross-sell** of the right Shariah product at the right moment (personalization lifts revenue 5–15%). [Tredence](https://www.tredence.com/blog/hyper-personalization-banking)

## B. White space (what already exists → don't rebuild)
| Already in KSA | Players | Why a clone loses |
|---|---|---|
| Arabic chatbot | Al Rajhi "Rajhi"; HUMAIN Chat | Q&A bots are commodity; AMAD anti-pattern #1 |
| Robo-advisor | Derayah Smart, Abyan (CMA-licensed Mar-26) | Regulated + crowded; AUM +87% YoY |
| PFM aggregator | SANAM, Mod5r, Drahim, Lean/Tarabut | "Most common AIS use case" — saturated |
| Zakat calculator | ZATCA Zakaty, Al Rajhi, Zoya/Zaqat | Standalone calc not novel |
| Earned Wage Access | Mudad×Khazna "Flexible Salary" | Payroll-tied; freelancers excluded |

**Unfair edges available right now (2025–26):**
1. **Shariah-conscience layer** — explainable, human-in-the-loop "is this halal & why" + auto-purification + Shariah-native action. Only an Islamic bank can own it. *No one has it.*
2. **Agentic action** — assistants that *do*, not just answer (Cleo Autopilot, Monzo 90% resolution, Visa/Mastercard agentic 2025). [Deloitte](https://www.deloitte.com/us/en/insights/industry/financial-services/agentic-ai-banking.html)
3. **ALLaM on watsonx** — a sovereign, Islamic-aligned Arabic LLM on Alinma's *exact* IBM stack, royalty-free. [IBM](https://mea.newsroom.ibm.com/sdaia-launches-allam-on-watsonx)
4. **Freelancer experience layer** — irregular income + auto zakat/VAT + cashflow, riding Alinma's new Freelance Card.

## C. Feasibility envelope (build vs mock in 72h)
- **Genuinely build:** the LLM agent (ALLaM-2-7B via watsonx/Azure or a hosted Arabic model), tool-calling orchestration, RAG over a Shariah-rulings + product corpus, transaction classifier (merchant→category→Shariah status), Arabic-first RTL UI, 2–3 real agentic actions wired to a mock core-banking API.
- **Mock/fake credibly:** core-banking + open-banking calls → use **SAMA OB Lab / Alinma sandbox mock data** + **synthetic transactions** + KAPSARC POS data; Nafath login screen; the Shariah-board escalation (stubbed human-in-the-loop). Mocking the *rails* is expected and credible.
- **Smallest slice that still wows:** one customer persona + a live transaction feed → the assistant (a) flags a non-compliant merchant pre-purchase with a *why*, (b) detects surplus and moves it to a Murabaha savings pot *with an explained Shariah structure*, (c) all in Arabic. That single loop is the demo.

## D. Data & APIs (what's actually accessible)
- **KAPSARC + SAMA Open Data — POS transactions by sector & city** (CSV/Excel; POS 2025 SAR 707.2bn, Riyadh 225bn) → realistic merchant-categorized spend. [KAPSARC](https://datasource.kapsarc.org/explore/dataset/point-of-sale-transactions-by-sector-and-city/)
- **SAMA Open Banking Lab** (mock retail/corporate OB APIs + conformance) · **Alinma OB sandbox** (`developer-ob-sb.alinma.com`: account/payments/transactions/auth, mock data).
- **ALLaM-2-7B** on watsonx / Azure AI Foundry / Hugging Face (royalty-free) for the Arabic+Islamic reasoning layer.
- **Synthetic transaction generation** for demo volume + edge cases (a "barely-non-compliant" merchant to trigger the wow).
- **Live data moment:** stream a tagged transaction feed; show the Shariah classifier + personalization fire in real time on screen.

## E. Bank-ship logic (why Alinma deploys — in their language)
- **Identity moat:** Shariah-native CX *is* Alinma's brand; a conscience layer deepens the Islamic-bank differentiation no conventional bank can copy.
- **Stack fit:** runs on **IBM watsonx + API Connect + OpenShift** — Alinma's existing infrastructure; ALLaM is royalty-free and Saudi-sovereign (data residency ✓).
- **P&L:** grows low-cost deposits (savings pots) → closes SAMA's credit-to-deposit gap; cuts service cost (resolution agent); lifts cross-sell revenue 5–15%; raises NPS (currently sector −82%).
- **Compliance:** PDPL + explicit consent (OB consent lifecycle), SAMA-aligned, **AI never issues fatwa** (human-in-the-loop Shariah board) → defensible governance.
- **On-strategy:** extends Alinma's stated "exceed customer expectations" + Freelance Card + gamification bets.

## F. Wow inventory (what a tired judge at hour 70 remembers)
1. **The "halal? why?" moment** — assistant intercepts a live purchase, says *"this merchant isn't Shariah-compliant — here's why, and here's a compliant alternative,"* citing a board ruling. Visceral + uniquely Alinma.
2. **Auto-purification** — assistant detects incidental non-compliant income (e.g., interest credited in error), quarantines it, and routes it to charity *with the customer's one-tap consent* — Islamic finance made effortless.
3. **Speak Arabic, money moves** — Khaleeji voice command → an explained, Shariah-structured action executes in seconds.

## Open questions → validate at enrichment (5–16 Jul)
- **12 Jul · Dr. Saad Al-Muslim — "Designing digital financial experiences in the age of AI"** → directly test the Rushd concept; ask about Alinma's AI-CX roadmap + ALLaM use.
- **13 Jul · Ahmed Al-Thukair (Suwa) — data analysis for decision-making** → sharpen the live data story.
- **14 Jul · Fintech Saudi meetup** → confirm OB consent + robo-advice licensing boundaries (does "Shariah guidance + product execution" stay clear of CMA robo-advisory licensing?).
- **15 Jul · pitch-craft sessions** → rehearse the 3-min demo path.
- Confirm: can a hackathon team get **Alinma sandbox** + **ALLaM watsonx** trial credentials during enrichment?

## Links
- [[raw-ideas]] · [[concept-rushd-shariah-copilot]] · [[concept-rizq-freelancer-copilot]] · [[concept-khidma-resolution-agent]] · [[champion]] · [[wildcard]] · [[saudi-fintech-terrain]] · [[hackathon-brief]]
