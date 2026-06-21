---
title: Agent 2 — Research / Recon Log
tags: [agent/2, research, regtech]
---

# 🔎 Agent 2 — Phase 1 Recon (Lane 2: RegTech / Risk / Fraud)

12 live searches, deep in lane. Findings below; cross-cutting intel pushed to [[saudi-fintech-terrain]].

## A. Pain map (who hurts, how big)

**Saudi retail customers**
- **APP / social-engineering scams** are the sharpest unsolved pain. KSA APP-fraud losses **~$81.5M**; payments via **sarie are instant + irreversible**, so once authorized the money is gone. The bank's fraud engine sees an *authenticated, customer-approved* transfer and lets it through — the loss happens at the **human layer**, which back-office scoring doesn't own.
- **+300% AI scams** YoY and **+600% deepfakes** (KSA, Q1 2024). Voice-clone "your son needs money" / fake-bank-officer / fake-investment scams. NCA runs "Kafalah" + OTP-never-share campaigns — i.e. the State has *conceded the human layer is the weak point*.

**SMEs / freelancers**
- **Business email compromise / fake-supplier (invoice redirection)** fraud — pay a "supplier" whose IBAN was swapped. No name-match on the beneficiary to catch it.
- Compliance overhead disproportionately hits small finance companies now in scope of SAMA Counter-Fraud Requirements (Apr 2026).

**The bank itself (the P&L pain a judge recognizes instantly)**
- **AML false positives ~95%**; **~22 hrs/alert**; **77%** cite analyst staffing as top constraint; global AML spend **~$274B/yr**. Every false positive is paid analyst time.
- **Coming reimbursement liability**: UK already mandates APP reimbursement (£85k cap, 50/50 sender/receiver). KSA's SAMA Counter-Fraud regime + customer-warning mandate is the on-ramp to the same liability. Banks that *prevent* APP fraud avoid the future payout.
- **New OB attack surface**: licensed open banking (Mar 2026) creates consent-abuse / rogue-TPP / data-scraping risk that didn't exist 4 months ago.

> The pain a **bank exec recognizes in 5 seconds**: "a customer got scammed into an instant transfer and now wants us to refund it" — and "my analysts drown in false alerts."

## B. White space (what already exists → where the gap is)
- **Mozn / FOCAL** owns back-office FRAML (sanctions, transaction scoring, network analysis, agentic case investigation, Payment Intelligence). **Rebuilding any of that loses the differentiation gate.**
- **GAP 1 — consumer-side APP-scam interception**: nobody in KSA intervenes on the *human* in-app before they authorize. No **Confirmation of Payee** exists in KSA (UK has 2B+ checks/yr); sarie confirms account details but not payee-name-match.
- **GAP 2 — OB consent-fraud monitoring**: the licensed regime is 3 months old; consent-abuse/rogue-TPP detection is unowned.
- **GAP 3 — explainable + Shariah-aware compliance copilot**: FOCAL automates investigation but the *explainability + brand-new SAMA quarterly reporting + Islamic-finance framing* is a narrow wedge.
- **Unfair edge available right now**: build natively on the **just-licensed OB layer** + the **Apr-2026 Counter-Fraud mandate** → "timely + compliant + Alinma already has the sandbox."

## C. Feasibility envelope (72h, small team)
- **Build for real**: a web/mobile app shell (Arabic-first, RTL), a rules + ML scam-risk scorer, a GenAI conversational "circuit breaker" (LLM, Arabic), a graph/behavioral visualizer, an analyst dashboard.
- **Mock/fake credibly**: live sarie settlement, real cross-bank name registry (use Alinma sandbox mock + synthetic data), real deepfake-audio model (out of scope in 72h — design around it, don't depend on it).
- **Smallest slice that wows**: one end-to-end "scam attempt → live interception → money saved" flow against the **Alinma OB sandbox** mock data + a synthetic transaction stream.

## D. Data & APIs (actually accessible to prototype)
- **Alinma OB sandbox** `developer-ob-sb.alinma.com` — account/payments/transactions/auth APIs + mock data + sample code (register a dev account).
- **SAMA Open Banking Lab** — mock-bank APIs + conformance suites.
- **Synthetic transaction generation** for volume + labeled scam/mule patterns (e.g. PaySim-style + hand-crafted KSA scam typologies).
- Open data: `open.data.gov.sa`, SAMA statistics, World Bank Findex.
- **Live data moment**: a transaction stream where a flagged scam payment lights up the risk feature contributions in real time, then the GenAI intervention fires.

## E. Bank-ship logic (why Alinma deploys — in their language)
- **Revenue/cost**: prevents future APP-reimbursement payouts; cuts analyst hours on false positives; protects retention (scammed customers churn + erode trust).
- **Compliance**: directly operationalizes **SAMA Counter-Fraud Fundamental Requirements** (real-time monitoring + customer warnings, mandatory 13 Apr 2026) and the OB consent rules. Auto-generates the **mandatory SAMA quarterly compliance report**.
- **On-strategy**: extends Alinma's OB sandbox; Shariah-native (*hifz al-mal* = preservation of wealth, a maqasid of Shariah) — a *differentiator* for an Islamic bank, not just a constraint.

## F. Wow inventory (what a tired hour-70 judge remembers)
- **The save**: on screen, a customer is mid-scam, taps "send 50,000 SAR" to a mule account — and the app *interrupts*, names the exact scam typology in Arabic, shows the payee-name mismatch, and the money never leaves. Visceral, human, unforgettable.

## Sources
- SAMA Rulebook — Counter-Fraud Framework & Fundamental Requirements (mandatory 13 Apr 2026): https://rulebook.sama.gov.sa/en/counter-fraud-fundamental-requirements
- SAMA Open Banking commencement of licensing (26 Mar 2026) — Clyde & Co: https://www.clydeco.com/en/insights/2026/03/sama-new-licensing-framework-for-open-banking
- openbanking.sa (SAMA OB Lab, mock data, conformance, consent): https://openbanking.sa/index-en.html
- Alinma Open Banking developer portal/sandbox: https://alinma.com/en/Retail/Digital-Channels/Open-Banking
- ACI Worldwide — APP fraud scale incl. KSA ~$81.5M: https://www.aciworldwide.com/app-fraud
- Mozn FOCAL — unified FRAML / Payment Intelligence: https://www.mozn.ai/focal · https://fintech.global/2026/02/10/the-inside-story-of-mozns-unified-approach-to-fraud-and-aml/
- AML false positives / cost — Silent Eight / Hawk AI / Retail Banker Intl: https://www.silenteight.com/blog/2025-trends-in-aml-and-financial-crime-compliance-a-data-centric-perspective-and-deep-dive-into-transaction-monitoring
- Deepfake explosion META/KSA — AGBI: https://www.agbi.com/tech/2025/10/uae-minister-and-tech-experts-warn-of-deepfake-explosion/
- UK PSR mandatory APP reimbursement + Confirmation of Payee — PSR: https://www.psr.org.uk/information-for-consumers/app-fraud-reimbursement-protections/
- Money mule detection (graph + behavioral, APP×AML convergence) — AMLWatcher / Feedzai: https://amlwatcher.com/blog/money-mule-detection-app-fraud-aml/
- Open banking consent/TPP fraud risks — Tyk / NICE Actimize / Brankas: https://tyk.io/learning-center/open-banking-security/
- KSA fraud-detection & RegTech market sizing — market reports / Tracxn (Mozn, Fintor, STAMP): https://tracxn.com/d/explore/regtech-startups-in-gcc/

#agent/2 #req/data #req/ai #track/regtech
