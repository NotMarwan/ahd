---
title: Agent 1 — Recon (Lane 1 · Agentic Money)
tags: [agent/1, leap, research, lane/agentic-money]
updated: 2026-06-18
---

# 🔭 Agent 1 — Phase 1 Recon · Agentic Money
> Lane mandate: autonomous AI that **acts**, not advises — with human-in-the-loop consent, on 2026 KSA rails. Hunting a category, not a feature. Shariah-clean by design.

## 1. The category is real and 2026 is the inflection point
- **Cleo Autopilot** just shipped: "moves from analysis to **action** … does it for you within guardrails you set." 2026 = the year agentic AI "crosses from pilot to production … doesn't just suggest, it **executes**." → The category (autonomous money agents) is being born *now*, mostly Western/individualistic ("optimize my spending"). [Cleo Autopilot](https://web.meetcleo.com/blog/introducing-autopilot) · [Deloitte agentic banking](https://www.deloitte.com/us/en/insights/industry/financial-services/agentic-ai-banking.html)
- **The leak in the global category = trust/control.** Autonomous finance's #1 blocker is oversight, authority limits, auditability — TrustX for Finance launched specifically for this; US regulators urge strong governance before agents act. [Responsible AI / TrustX](https://www.prnewswire.com/news-releases/responsible-ai-institute-launches-trustx-for-finance-to-bring-verifiable-trust-to-autonomous-ai-in-financial-services-302800668.html)

## 2. ⭐ The unfair edge nobody is using: WAKALA (وكالة)
- **Wakala = the Islamic agency contract.** A *muwakkil* (principal) appoints a *wakil* (agent) to act on their behalf in lawful, clearly-defined matters. **Scholarly consensus** on permissibility (Quran + Sunnah). [AIMS](https://aims.education/study-online/wakala-islamic-finance/) · [SeekersGuidance conditions](https://seekersguidance.org/answers/fiqh-answers-2/what-are-the-conditions-for-a-valid-agency-wakala-in-islam/)
- **Its conditions ARE the governance architecture the West is scrambling to invent:** (a) **permissible subject matter** only (no riba/gambling/haram), (b) **delegable financial tasks** explicitly include *buying, selling, paying debts, gifting, returning deposits*, (c) a **trustworthy, competent agent** (amana/fiduciary), (d) **clearly limited authority**, (e) **revocable**. The principal **stays the owner**.
- **The insight:** the West is bolting consent protocols onto AI agents from scratch — **Google AP2** "Intent Mandate + Cart Mandate" (signed, auditable), **Mastercard Agent Pay** "Agentic Tokens" binding agent+merchant+consent, **Visa TAP**. Islamic civilization has had the **delegated-agency governance contract for 1,400 years.** [AP2](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol) · [Visa/MC agentic](https://www.digitalcommerce360.com/2025/10/16/visa-mastercard-both-launch-agentic-ai-payments-tools/)
- → **An AI financial agent literally IS a digital wakil.** Framing the agent as a **wakala-governed wakil** turns the category's hardest problem (trust) into Islamic finance's home turf. Only an Islamic bank can own this. *(Distinct from retired Rushd: that was a halal-SCORE/advisory conscience layer; this is an ACTING agent under an agency contract — execution, not judgment.)*

## 3. The execution rail exists now: PIS
- **Payment Initiation Services (PIS)** lets an authorised third party **initiate a payment directly from a customer's account** — licensed activity since **26 Mar 2026**, built on **SARIE** (real-time, ≤20,000 SAR). [Fiskil KSA](https://www.fiskil.com/open-finance-tracker/saudi-arabia) · [Lean Phase 2](https://www.leantech.me/blog/shaping-the-future-of-payments-in-ksa-what-phase-2-of-the-open-banking-framework-means-for-merchants)
- → Without PIS, an agent in KSA could only *read* (AIS) and advise. **With PIS (2026), it can ACT.** This is the only-now/only-here unlock.

## 4. The emotional truth: obligations, not optimization
- **Birr al-walidayn** (kindness/duty to parents): supporting parents financially when in need is a **binding Islamic duty (fard), not charity** — mentioned in the Quran immediately after worship of Allah. Family is the central pillar of Saudi society; reciprocal cross-generational care. [Cultural Atlas — family](https://culturalatlas.sbs.com.au/saudi-arabian-culture/saudi-arabian-culture-family) · [duty not sadaqah](https://ibwaqf.org.uk/news/blog/is-giving-money-to-parents-sadaqah)
- → The Saudi agent's highest job is **not** "optimize my spending" (Cleo). It's **"never let me fail a duty"**: keep the monthly support to parents flowing, pay what's owed on time, set aside zakat, give the sadaqah I intend. **"Money that keeps your promises."** Pride, relief, faith, dignity — emotion a budgeting autopilot can't touch.
- Supporting context: SADAD handles recurring bills; e-payments hit ~70% of retail (2023) → the rails for autonomous bill action are mature. [Statista KSA payments](https://www.statista.com/topics/11813/digital-payments-in-saudi-arabia/)

## 5. The brain: ALLaM (Arabic agent reasoning, on Alinma's stack)
- **ALLaM** (SDAIA→HUMAIN) live on **IBM watsonx** — Alinma's actual stack; **ALLaM 34B** = top Arab-built Arabic LLM; HUMAIN Chat adds real-time search + **Arabic dialect voice**. [ALLaM on watsonx](https://www.middleeastainews.com/p/sdaias-allam-arabic-llm-live-on-watsonx) · [HUMAIN Chat 34B](https://www.middleeastainews.com/p/humain-chat-live-allam-34b-llm)
- Honest note: public docs don't detail ALLaM tool-calling/agentic function-use. → Design the agent as **ALLaM for Arabic understanding/explanation + a deterministic, rule-bounded tool/guardrail layer** that actually executes (the autonomy is *scoped & permissioned*, not free-roaming). This is also the safe, Shariah-faithful design (the wakil acts only within granted scope).

## 6. Alinma-ship logic
- Alinma is a **Shariah bank** with a real **OB sandbox** (`developer-ob-sb.alinma.com`, account/payments/transactions/auth) + the **IBM watsonx/ALLaM** stack + youth (iz) and family focus. A wakala-governed agent is *on-brand to the core* and runs on rails Alinma already exposes.
- **Vision ceiling:** Alinma could define the **Islamic standard for AI agents acting on money** — exportable to ~2B Muslims worldwide. The West will need a trust framework for agentic finance; wakala is a ready-made, faith-native one.

## 7. Buildable-in-72h data/APIs
- Alinma/SAMA OB sandbox (AIS read + **PIS initiate**, mock) · synthetic Saudi household transaction streams · ALLaM via watsonx (or a stubbed seam) for Arabic · a deterministic **mandate/guardrail engine** (the wakala scope rules) — fully demoable offline with seeded personas.

## Links
- [[raw-ideas]] · [[concept-wakeel]] · [[concept-majlis]] · [[concept-tawkeel-protocol]] · [[champion]] · [[saudi-fintech-terrain]] · [[00_Index]]
