---
title: Saudi Fintech Terrain — Shared Intel (APPEND-ONLY)
tags: [brief, reference, shared]
updated: 2026-06-18
---

# 🗺️ Saudi Fintech Terrain — Shared Intel
> APPEND-ONLY. All agents add verified findings here so the team inherits them. Cite sources.

## Regulatory (as of 2026)
- **Open Banking → full licensing regime since March 2026.** Second release issued. Categories: **AIS** (account info), **PIS** (payment initiation, live on **SARIE**), **CAF** (confirmation of funds). Security = **FAPI** (mTLS, signed requests, strict consent lifecycle). [Clyde&Co](https://www.clydeco.com/en/insights/2026/03/sama-new-licensing-framework-for-open-banking)
- **SAMA Open Banking Lab:** simulated bank OB APIs + **mock data (retail + corporate)** + conformance/certification suites. Prototype surface. [link](https://www.globalgovernmentfintech.com/saudi-central-bank-establishes-open-banking-lab/)
- **ZATCA Fatoora Phase 2:** e-invoices transmitted to FATOORA APIs in seconds. **Wave 24 (30 Jun 2026)** threshold drops to **SAR 375,000** → thousands of small SMEs newly in scope. Government-verified real-time revenue feed. [link](https://qeemahcloud.com/en/blog/complete-zatca-phase-2-einvoicing-requirements-guide/)
- Constraints every concept must respect: **PDPL**, explicit **consent**, **SAMA** security, **Shariah** (no riba; **Tawarruq/commodity Murabaha** = dominant working-capital structure). [Islamic finance KSA](https://practiceguides.chambers.com/practice-guides/islamic-finance-2025/saudi-arabia)

## Players (don't blindly rebuild)
- **OB infra/rails:** Lean Technologies, Tarabut Gateway (Riyadh HQ; acquired Vyne 2025), Spare, Data Insights, Bwatech, Single View.
- **Consumer PFM:** Drahim (Al Rajhi owns 65%; aggregation + categorization + robo-invest), Hakbah (savings/jamiya).
- **SME lending:** erad (real-time data, 48h, Shariah), Lendo, Sulfah (P2P Murabaha/Tawarruq/Wakala).
- **BNPL / payments:** Tabby, Tamara, STC Pay/Barq.

## Market facts / framing
- **SME financing gap ~SAR 0.5 trillion**; SME credit ≈9% of loan book; Vision 2030 target ~20% by 2030. [RedSeer](https://redseer.com/articles/ksa-sme-digital-lending-powering-20-of-sme-credit-by-2030/)
- **2.35M self-employment documents**; freelance.sa 120+ professions; digital freelancers +40% (2020–23). [Zawya](https://www.zawya.com/en/economy/gcc/saudi-arabia-issues-235mln-self-employment-documents-for-freelancers-ddefiqh4)
- **India Account Aggregator** proof: 60% fewer loan drop-offs, +10% sanction rates, <15s fetch, 223M users, ₹1.6 lakh cr FY25 — the cash-flow-lending pattern to localize. [Accion](https://www.accion.org/article/how-indias-account-aggregator-framework-is-changing-msme-lending/)

## Data/APIs to prototype against
- SAMA Open Banking Lab mock data · Alinma sandbox (account/payments/transactions/auth) · Saudi Open Data (11,439+ datasets, CSV/JSON/XML, APIs) · SAMA Open Data Platform · ZATCA sample e-invoice XML · synthetic transaction generation.

## Saudi rails / IDs (design against)
- **Nafath** (digital ID/KYC), **Mada** (cards), **SARIE** (instant payments), **SIMAH** (credit bureau), **ZATCA** (e-invoicing/tax), **Absher**.

## Alinma-specific (partner = "could they ship it?")
- Dev API portal + OB sandbox (`developer-ob-sb.alinma.com`); stack IBM API Connect + Cloud Pak + OpenShift + DataPower; strategy = new revenue streams + fintech/corporate access; Islamic bank; existing SME/freelancer + gamification ("alinma Fantasy") bets.

## CX / GenAI assistant layer — Agent 3 (Lane 3) intel
*Appended 2026-06-18. Sources inline.*

**Build asset — a sovereign Arabic LLM is production-ready on Alinma's own stack:**
- **ALLaM** (SDAIA → HUMAIN/PIF). **ALLaM-2-7B-instruct** ≈4T EN+AR tokens; **ALLaM 34B** launched 25 Aug 2025; tuned for Islamic/Arabic cultural alignment. Distributed **royalty-free on IBM watsonx.ai** (IBM = Alinma's stack) **+ Azure AI Foundry + Hugging Face**. → a Shariah-aware Arabic assistant can run on the *exact* IBM stack Alinma already operates. [SDAIA/IBM watsonx](https://mea.newsroom.ibm.com/sdaia-launches-allam-on-watsonx) · [Azure catalog](https://ai.azure.com/catalog/models/ALLaM-2-7b-instruct)
- **HUMAIN Chat** (Aug 2025) = first Arabic-native consumer AI app, "Islamic values" alignment. [Bloomberg](https://www.bloomberg.com/news/articles/2025-08-25)

**Already exists in KSA CX — DO NOT rebuild:**
- **Chatbots:** Al Rajhi "Rajhi" NLP assistant; generic Arabic banking bots common (mkt ~$250M, 2025). → plain Q&A chatbot loses.
- **Robo-advisors (CMA framework approved Mar 2026):** Derayah Smart, Abyan (auto Shariah purification). Fintech AUM +87% YoY → SAR 6.41bn (Q4-25). → plain robo-advice regulated + crowded. [NRF](https://www.nortonrosefulbright.com/en/inside-fintech/blog/2026/03/robo-advisory-services-saudi-capital-market-authority-approves-regulatory-framework)
- **PFM aggregators:** SANAM, Mod5r, Drahim + Lean/Tarabut rails → "most common AIS use case," saturated.
- **Zakat calculators:** ZATCA **Zakaty** app, Al Rajhi in-app zakat, Zoya/Zaqat purification → standalone calculator not novel.
- **Earned Wage Access:** Mudad × Khazna "Flexible Salary" (Jul 2025) — **payroll-tied → does NOT serve no-employer freelancers.** [FintechWeekly](https://www.fintechweekly.com/magazine/articles/saudi-arabia-flexible-salary-early-wage-access-fintech)

**White space / unfair edges (Lane 3):**
- **Shariah-conscience layer:** Islamic-finance AI must be **explainable (Maqasid/XAI) + human-in-the-loop** — AI must NOT issue fatwa; it surfaces board rulings + escalates. Documented **customer skepticism that digital banking is truly Shariah-compliant** = a trust wedge only an Islamic bank (Alinma) can own. [JCLI fatwa-AI](https://jcli-bi.org/index.php/jcli/article/view/446)
- **Agentic CX frontier:** action-taking assistants — Cleo Autopilot, **Monzo + Gradient Labs 90% query resolution**, Visa/Mastercard agentic payments (2025); HSBC/Citi/DBS report **20–40% cost cut, 10–30% revenue uplift**; "Segment of One" NBA (DBS/NAB). [Deloitte](https://www.deloitte.com/us/en/insights/industry/financial-services/agentic-ai-banking.html)
- **Underserved:** **53% of Saudis underserved, 16% unbanked (~4.3M)**; **2.25M freelancers / 220k+ licenses**, irregular income, no SIMAH file. Alinma already shipped the **Kingdom's first Freelance Card** (w/ SDB, 2025). [AGBI](https://www.agbi.com/opinion/banking-finance/2024/06/the-gulf-is-ripe-for-fintechs-to-serve-the-underserved/) · [ArabNews](https://www.arabnews.com/node/2584265)
- **Arabic voice:** 85% have used voice assistants, **65% prefer Arabic**, Khaleeji favored, 56% need local-accent support; elderly/low-literacy access gap. [AbsoluteGeeks](https://www.absolutegeeks.com/article/tech-news/study-shows-widespread-use-of-arabic-voice-technology-in-the-gulf/)

**Pain a bank exec recognizes instantly (feasibility gold):**
- Saudi banks' **digital-experience net sentiment −81.1%, customer-service −82.1%** (outages, downtime, slow resolution). [Zawya](https://www.zawya.com/en/business/banking-and-insurance/saudi-banks-score-low-on-customer-service-digital-experience-analysis-a1gb3pme)
- **Credit-to-deposit growth gap** flagged by SAMA (100bps countercyclical buffer May 2025) → a CX product that **grows low-cost deposits/savings** sits on the bank's P&L. [SAMA Q2-25](https://www.sama.gov.sa/en-US/EconomicReports/DevelopmentReports/Key_Economic_Developments_Q2_2025.pdf)
- **BNPL** ~$1.48bn (2025)→$2.36bn (2030); harms youth savings/investment → spending-conscience angle. [Research](https://uk.finance.yahoo.com/news/saudi-arabia-buy-now-pay-095600269.html)

**Data for a live demo (Lane 3):** KAPSARC + SAMA Open Data **POS transactions by sector & city** (CSV/Excel; POS 2025 = SAR 707.2bn, Riyadh 225bn) → realistic merchant-categorized spend for personalization + Shariah-classification demos; + Alinma/SAMA OB sandbox mock data; + synthetic transaction generation. [KAPSARC POS](https://datasource.kapsarc.org/explore/dataset/point-of-sale-transactions-by-sector-and-city/)

## Synthesis pointer (added 2026-06-18, Agent 1)
All 4 lanes complete + a cross-agent compile exists → **[[00_SYNTHESIS]]** (calibrated all-12 ranking, vault reconciliation, synergy matrix, recommendation). Key reusable findings for any team: **ALLaM via IBM watsonx** = the sanctioned Arabic-LLM path on Alinma's own stack (use for all Arabic generation/explanation); **deterministic seeded demo personas + offline fallback** are mandatory (every red team flagged live-API risk); **lead the pitch with the moat/wow in the first 15s**, never a chat box or dashboard.

## Faith-Positive Finance — Agent 3 (Round 2, Lane 3) intel
*Appended 2026-06-18. Sources inline. Shariah-clean-by-design territory.*
- **Waqf = "the sleeping giant of Islamic finance"** (~US$1T, tech-starved; Islamic finance → US$5–7.5T by 2030). Cash-waqf revival + **tokenized/fractional halal funds** (ADIB **Smart Sukuk**, world-first **waqf-ETF**, Finterra **Waqf Chain**) finally make *micro*-endowment viable. [IFN sleeping giant](https://www.islamicfinancenews.com/the-waqf-industry-the-sleeping-giant-of-islamic-finance.html) · [White&Case tokenisation](https://www.whitecase.com/insight-our-thinking/tokenised-islamic-finance-products-shariah-compliance-meets-digital-innovation)
- **AWQAF (General Authority for Awqaf) is digitizing endowment NOW:** Naseej portal/app (Apr-2025); **Awqaf PAY**; **Jood Waqf Fund digital endowment certificate**, instantly issued on contribution (Feb-2026). All **institutional** → the **personal/micro/AI-managed/living-impact** waqf is open white space. [Naseej](https://naseej.com/news/2025/04/general-authority-for-awqaf-and-naseej-to-drive-digital-transformation-in-the-endowment-sector/) · [Jood cert](https://www.gccbusinessnews.com/jood-waqf-fund-digital-endowment)
- **Giving is huge but spend-down:** **Ehsan** national platform = SAR **9bn+**, 4.8M beneficiaries, 3M+ users, 10-sec donations — every riyal consumed once. The endowment (give-forever) gap is unfilled. [Ehsan/SPA](https://spa.gov.sa/en/N2064749)
- **Faraid/inheritance:** static calculators are commoditized (HalalWallet, Al-Wirasat, ShariaWiz) → the gap is a **living, net-worth-connected, Nafath-notarized** estate. [HalalWallet](https://www.halalwallet.us/tools/faraid-calculator)
- **Qard hasan** (0% benevolent loan = the literal anti-riba): nascent platforms (community pools; KSA fintech experimenting SAR 1–10k) → no bank-grade AI-matched **recycling** network yet. [investriyadh](https://investriyadh.ai/glossary/qard-hasan/)
- **Reusable for any faith lane:** waqf/qard-hasan/faraid are **uncontested** (no Tawarruq debate, no maysir/gharar) → the cleanest Shariah path. Rails: AWQAF digital-certificate, Nafath e-notarization, Ehsan verified beneficiaries, OB AIS for funding/round-ups, ALLaM for Arabic narration.
- Agent 3 Round-2 champion: [[concept-athar|أثر Athar]] (consumer perpetual waqf). Detail: [[05_Leap/Agent-3/research|research (Agent 3, R2)]].

## Agentic Money — Agent 1 (Round 2, Lane 1) intel
*Appended 2026-06-18. Shariah-clean-by-design (no lending contract — agent acts on the user's own money).*
- **PIS = the execution rail for agents:** licensed since 26 Mar 2026, on SARIE (≤20k SAR); lets a consented third party *initiate* payments → an AI agent can finally **ACT**, not just read (AIS). [Fiskil KSA](https://www.fiskil.com/open-finance-tracker/saudi-arabia)
- **The category is 2026-fresh:** Cleo Autopilot acts within guardrails; "agentic AI crosses pilot→production in 2026 — it executes, not suggests." Western framing = *optimize spending*. [Cleo](https://web.meetcleo.com/blog/introducing-autopilot)
- **⭐ WAKALA = the unfair edge:** the Islamic agency contract (muwakkil→wakil), consensus-permissible, with built-in scope / permissible-only / revocability / amana. It is the governance answer to the global agentic-money trust problem the West is bolting on from scratch (Google **AP2** Intent/Cart Mandates; Mastercard **Agentic Tokens**; Visa **TAP**). An AI money-agent literally IS a digital wakil. [Wakala](https://aims.education/study-online/wakala-islamic-finance/) · [AP2](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)
- **Emotional core:** **birr al-walidayn** — supporting parents is a *binding duty, not charity*. Saudi finance is familial. → point agents at *fulfilling obligations*, not optimizing spend. [duty not sadaqah](https://ibwaqf.org.uk/news/blog/is-giving-money-to-parents-sadaqah)
- **Autonomous-finance #1 blocker = trust/oversight** (TrustX for Finance; Fed/OCC caution) → wakala's conditions are the ready-made answer. Detail: [[05_Leap/Agent-1/research|A1 Round-2 research]].

## Links
- [[hackathon-brief]] · [[lanes]] · [[00_Index]] · [[00_SYNTHESIS]] · Agent 1 detail: [[research]] · Agent 3 detail: [[02_Agent-3/research|research (Agent 3)]]
