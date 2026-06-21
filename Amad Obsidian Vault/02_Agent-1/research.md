---
title: Agent 1 — Recon Log (Lane 1 · Open-Banking / Data Infrastructure)
tags: [agent/1, research, track/open-banking, req/data, req/ai]
updated: 2026-06-18
---

# 🔭 Agent 1 — Phase 1 Recon (Open-Banking / Data Infrastructure)

> Lane 1. Goal: turn multi-source financial data into a bank-monetizable capability built on the newly-licensed open-banking layer. Optimizing for /01 Data + /02 AI + criterion 5 ("Alinma could ship this").

## 1. Pain map (real, unsolved)
- **SME / freelancer credit access is the dominant pain.** GCC SME financing gap > **$250B**; KSA gap estimated **~SAR 0.5 trillion**. SME credit ≈ **9% of the total loan book** vs Vision 2030 target ~20%. Traditional lending is **collateral-based** → excludes asset-light, tech-driven, newer SMEs and the self-employed. [SME gap](https://channelcapital.io/the-gccs-sme-financing-gap/) · [BankingStack](https://www.bankingstack.com/blog/sme-business-finance-saudi-arabia-banks/) · [RedSeer: 20% by 2030](https://redseer.com/articles/ksa-sme-digital-lending-powering-20-of-sme-credit-by-2030/)
- **Thin-file population is huge and growing.** **2.35M self-employment documents** issued; freelance.sa across **120+ professions**; digital freelancers grew **40% (2020–23)**. These irregular-income earners are invisible to collateral/credit-statement underwriting. [Zawya 2.35M](https://www.zawya.com/en/economy/gcc/saudi-arabia-issues-235mln-self-employment-documents-for-freelancers-ddefiqh4) · [HRSD freelance](https://www.hrsd.gov.sa/en/ministry-services/services/1065686)
- **The bank's own pain:** serving these niches was historically not cost-effective; manual PDF-statement underwriting is slow and high-drop-off. A judge from a bank instantly recognizes "we can't profitably underwrite SMEs/freelancers." [CGAP](https://www.cgap.org/blog/how-are-fintechs-tackling-arab-worlds-123b-sme-finance-gap)

## 2. White space (what exists → where the gap is)
- **Rails / infra are TAKEN — do not rebuild:** Lean Technologies (license-holder), Tarabut Gateway (Riyadh HQ, acquired Vyne 2025), **Spare** (certified Jul), Data Insights, Bwatech, Single View. [WhiteSight](https://whitesight.net/saudi-arabias-open-banking-revolution/) · [Pragmatic Coders](https://www.pragmaticcoders.com/blog/11-must-know-open-banking-apps-in-saudi-arabia)
- **Consumer PFM is TAKEN:** **Drahim** (account aggregation + auto-categorization + robo-investing; **Al Rajhi acquired 65%**), **Hakbah** (savings/jamiya). Building "another PFM app" loses. [Drahim](https://moge.ai/product/drahim) · [Hakbah](https://hakbah.sa/?lang=en)
- **SME lending fintechs exist but are non-bank / single-signal:** erad (real-time business data, 48h, Shariah), Lendo, Sulfah (P2P Murabaha/Tawarruq/Wakala). [erad $33m](https://salaamgateway.com/story/saudi-fintech-erad-secures-33-mn-debt-round-to-tackle-gccs-250-bn-sme-credit-gap)
- **THE GAP:** A **bank-side, multi-signal underwriting/data capability** that fuses **open-banking cash flow + ZATCA e-invoices + alternative data** into a Shariah-native credit decision — owned by the bank, not a standalone lender. The application/decisioning layer on top of the new rails is thin.

## 3. The proven analog to localize (India Account Aggregator)
- AA → **cash-flow-based lending** instead of collateral. Hard metrics: **~55% of loans sourced via AA**, **~10% higher sanction rates**, **drop-offs down up to 60%** (replacing 6-month PDF statement uploads with consent flows), **<15s** real-time data fetch, **223M users**, **₹1.6 lakh crore** loans in FY25. [Accion](https://www.accion.org/article/how-indias-account-aggregator-framework-is-changing-msme-lending/) · [ACR study](https://acr-journal.com/article/the-transformative-impact-of-the-account-aggregator-framework-on-financial-inclusion-in-india-a-multi-sectoral-study-of-msmes-microfinance-and-personal-lending-1852/)
- **Localization edge KSA has that India didn't:** a **government-verified real-time revenue feed** (ZATCA) on top of bank data → richer, harder-to-game signal.

## 4. The unique KSA data-asset: ZATCA Fatoora e-invoicing
- Phase 2 "Integration" rolls out in waves; **every tax invoice is transmitted to FATOORA APIs within seconds** of creation. **Wave 24 (30 Jun 2026)** drops the threshold to **SAR 375,000**, sweeping thousands of small SMEs into real-time, structured, **government-verified revenue records**. [Qeemah guide](https://qeemahcloud.com/en/blog/complete-zatca-phase-2-einvoicing-requirements-guide/) · [Natlaw Wave 24](https://natlawreview.com/press-releases/haseem-highlights-saudi-sme-priorities-zatca-wave-24-deadline-approaches)
- **Why it matters:** open banking shows money *moving*; ZATCA shows verified *sales/receivables*. Fused, they give cash-flow underwriting a fraud-resistant ground truth that's uniquely available in KSA right now.

## 5. Regulatory ground (timely + exploitable)
- **Open banking moved into a full licensing regime (March 2026)**; **second release** of the framework issued; **PIS now live on SARIE**; categories **AIS / PIS / CAF**; security profile **FAPI** (mTLS, signed requests, strict consent lifecycle). [Clyde & Co](https://www.clydeco.com/en/insights/2026/03/sama-new-licensing-framework-for-open-banking) · [Lean: Phase 2](https://www.leantech.me/blog/shaping-the-future-of-payments-in-ksa-what-phase-2-of-the-open-banking-framework-means-for-merchants)
- **SAMA Open Banking Lab:** simulation of real bank open-banking APIs with **mock data for retail AND corporate use cases**, conformance/certification suites. → our prototype surface. [Global Gov Fintech](https://www.globalgovernmentfintech.com/saudi-central-bank-establishes-open-banking-lab/) · [openbanking.sa](https://openbanking.sa/index-en.html)
- Hard constraints any concept must respect: **PDPL**, explicit **consent management**, **SAMA** security standards, **Shariah** (no riba; **Tawarruq/commodity Murabaha** is the dominant working-capital structure — fast, flexible, compliant). [Tawarruq](https://practiceguides.chambers.com/practice-guides/islamic-finance-2025/saudi-arabia)

## 6. Alinma anchor ("could they ship it?")
- Real **developer API portal + open-banking sandbox** (`developer-ob-sb.alinma.com`) exposing **account, payments, transactions, authentication** APIs with **mock data**. [Alinma OB](https://alinma.com/en/Retail/Digital-Channels/Open-Banking) · [Developer portal](https://developer-ob-sb.alinma.com/perry/developer/welcome)
- Stack: **IBM API Connect + Cloud Pak for Integration + Red Hat OpenShift + DataPower**. Strategy: **new revenue streams + seamless digital access for corporate clients & fintech partners**. [IBM case](https://www.ibm.com/case-studies/alinma-bank) · [FintechFutures](https://www.fintechfutures.com/partnerships/saudi-arabia-s-alinma-bank-partners-ibm-to-power-new-api-platform)
- Alinma is an **Islamic bank** with existing SME/freelancer digital-banking bets → an SME working-capital data play is directly on-strategy and Shariah-native.

## 7. Data & APIs actually accessible to prototype (72h)
- **SAMA Open Banking Lab** mock data (corporate + retail use cases) + **Alinma sandbox** (account/payments/transactions/auth, mock data).
- **Saudi Open Data** (`open.data.gov.sa`, **11,439+ datasets**, CSV/JSON/XML, APIs, no registration) + **SAMA Open Data Platform** (economic/financial/monetary stats). [SDAIA open data](https://www.my.gov.sa/en/content/open-data) · [SAMA portal](https://www.sama.gov.sa/en-US/News/pages/news-722.aspx)
- **ZATCA Fatoora** sample/QR-decoded e-invoice structures (XML/JSON) for the verified-revenue signal.
- **Synthetic transaction generation** for demo volume/realism. → Live data moment is fully achievable without real core-banking access.

## 8. Bank-ship logic (Alinma's language)
- **Revenue:** new SME/freelancer lending book (closing a SAR 0.5T gap; 20%-by-2030 target) + data-product/API monetization to fintech partners.
- **Cost/risk:** automated, continuously-observed underwriting replaces manual PDF review; fraud-resistant via ZATCA ground truth; lower drop-off → higher conversion.
- **Compliance/strategy:** built on the licensed OB layer + SAMA Lab conformance; Shariah-native (Tawarruq); PDPL/consent-first; extends Alinma's IBM API platform + SME strategy.

## 9. Wow inventory (the hour-70 memory)
- **"Paste a consent → watch a fundable, Shariah-compliant credit line appear in 15 seconds, justified by a live, explainable data trail (bank cash flow + ZATCA invoices)."** A skeptical bank exec sees a deployable underwriting engine, not a slide.
- Alternatives: a **real-time SME financial-health 'credit radar'** that updates as invoices/transactions stream; an **explainable AI decision card** showing exactly which signals drove the limit.

## Links
- [[hackathon-brief]] · [[saudi-fintech-terrain]] · [[raw-ideas]] · [[champion]] · [[00_Index]]
