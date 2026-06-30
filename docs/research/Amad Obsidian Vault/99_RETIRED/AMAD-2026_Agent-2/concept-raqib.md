---
title: "Concept — رقيب Raqib (Open-Banking Consent-Fraud Firewall)"
tags: [agent/2, status/finalist, track/regtech, track/open-banking, req/data, req/ai, score/82]
---

# 🧿 رقيب · Raqib — Open-Banking Consent-Fraud Firewall

> *Raqib (رقيب) = "the watcher / guardian."* The risk layer for the brand-new licensed open-banking regime — it watches *who* a customer grants data/payment consent to, and catches rogue or over-broad third-party access **before** it becomes a breach.

**Track:** 3 — Financial Regulations (RegTech) *(secondary: 5 — Open Banking)*
**Requirements:** **/01 Data Analysis + /02 Use of AI**
**Score:** **82 / 100**

## A. One-liner
*A consent-firewall that scores every open-banking AIS/PIS consent request and TPP for risk, gives the customer a plain-Arabic "consent receipt" with granular toggles and one-tap revoke, and flags anomalous data-scraping or rogue-TPP behavior to the bank — the missing risk layer for a regime that's only 3 months old.*

## B. Problem
**Saudi open banking became a *licensed* activity on 26 Mar 2026 — creating an entire attack surface that didn't exist four months ago, with no incumbent guarding it.**
- Once a customer grants consent, their data is routed through a chain of TPPs, aggregators, analytics, and brokers. One real audit found **47 third parties** touching customer data — **half not in any contract**.
- Consent UIs are crude — usually **"Accept All / Reject All"** — so customers over-share by default. Malicious or compromised TPPs can over-collect, scrape, manipulate payment initiations, or facilitate laundering.
- SAMA's OB rules **require** explicit, informed, **revocable** consent and an **analytical fraud tool** for banks/TPPs — but the *tooling to operationalize consent-risk and TPP-behavior monitoring* is unbuilt.
- **Why now:** the regime is new; Lean holds licence #1; the consent-fraud category has **no Mozn, no incumbent** — first credible tool defines it.

## C. Solution
A dual-sided layer:
- **Customer side:** a **consent receipt** in plain Arabic — "App X requested *6 months of transactions + payment initiation up to 10,000 SAR*; you can share *balances only* instead" — with **granular per-scope toggles**, expiry, and one-tap revoke. Each request gets a **risk badge** (TPP reputation, scope vs. stated purpose, over-broad/over-long red flags).
- **Bank side:** a monitoring console that scores TPP behavior post-consent — unusual aggregation frequency, scope-creep, data-pull spikes, access from anomalous patterns — and detects **consent-farming** (many thin consents funneling to one endpoint). AI summarizes each TPP's risk posture and drafts the SAMA-facing record.

**Only-possible-now:** the licensed AIS/PIS/CAF consent objects + FAPI consent lifecycle are the raw material — they exist as of March 2026.

## D. Mapping
- **Track (one):** 3 — Financial Regulations (RegTech). *(Open Banking, track 5, is the substrate.)*
- **Requirements:** **/01 Data Analysis** (consent + access-pattern analytics), **/02 Use of AI** (TPP-risk scoring + AI summarization of consent posture).

## E. 72h build plan
**Architecture:** OB consent simulator (model AIS/PIS consent objects per the SAMA framework) → consent-risk scorer (rules + reputation features) → Arabic consent-receipt UI (RTL) → bank console with TPP-behavior anomaly detection on a synthetic access log → LLM (ALLaM/watsonx) to summarize risk + draft the consent record.
**Built for real:** the consent-receipt UX with granular toggles + revoke; the risk badge; the bank-side anomaly console on synthetic TPP access logs.
**Mocked:** real licensed TPPs (use named mock TPPs), real FAPI handshake (simulate the consent object), live SAMA reporting.
**Day-by-day:** D1 — consent object model + simulator + synthetic TPP access logs. D2 — risk scorer + Arabic receipt UI + anomaly console. D3 — harden the "rogue TPP caught" demo + deck.
**Must work:** the moment a customer is about to "Accept All" and Raqib shows the over-broad scope + downgrades it to minimal consent.

## F. Data story
- **Data:** SAMA OB framework consent schema; synthetic TPP registry + access logs (normal vs. scraping/consent-farming patterns); SAMA OB Lab mock data.
- **Insight:** "8% of consent grants are over-broad for the TPP's stated purpose, and those account for 60% of the post-consent data volume."
- **On screen:** a live access-pattern graph where a rogue TPP's scraping spike lights up and gets throttled.

## G. Demo script (3 min)
1. **0:00** — "Open banking went live in Saudi 3 months ago. Here's the risk nobody's guarding." 
2. **0:30** — Customer connects a budgeting app; the default ask is "all data + payment initiation." Raqib shows the **consent receipt** + risk badge and downgrades it to balances-only in one tap.
3. **1:30** — Flip to the bank console: a "free credit-score" TPP starts pulling full transaction history every 10 min across hundreds of consents → the anomaly graph flags **consent-farming**; access throttled; SAMA record auto-drafted.
4. **2:30** — Close: "PDPL and SAMA *require* revocable consent and a fraud tool. Raqib is that tool — and the category has no incumbent."

## H. Bank-ship case
- **Compliance:** directly satisfies SAMA OB consent rules (granular, revocable) + the "analytical fraud tool" requirement + PDPL; produces the SAMA-facing audit trail.
- **Risk/cost:** contains the bank's liability for downstream TPP misuse; protects the brand as OB scales.
- **Shariah:** consent transparency + protecting customer data aligns with *amanah* (trust/stewardship); no interest mechanic.
- **On-strategy:** extends Alinma's OB sandbox; positions Alinma as the consumer-trust leader in a 3-month-old market.

## I. Differentiation
- **vs Mozn/FOCAL & all KSA RegTech:** they monitor *transactions/identities*, not **OB consent grants + TPP behavior** — a surface that didn't exist before March 2026. No incumbent.
- **vs generic consent dashboards (UK):** Raqib adds the **bank-side TPP-behavior anomaly detection + AI risk summarization**, not just a customer toggle screen.

## J. Risk register
1. **Abstractness** — consent-fraud is less visceral than a stolen 50k. → Mitigate: lead the demo with the customer "Accept All" save, then the rogue-TPP catch.
2. **No real TPP ecosystem to point at yet** — regime is new. → Mitigate: named mock TPPs + synthetic logs; frame as "ready for when the ecosystem scales."
3. **Demo data realism** — synthetic logs can look fake. → Mitigate: ground patterns in documented OB-fraud typologies (scope-creep, scraping, consent-farming).

## K. Score — **82 / 100**
| Criterion | Wt | Pts | Why |
|---|---|---|---|
| Innovation | 20 | **18** | A genuinely new, unowned category created by the March-2026 licensing regime. |
| Technical | 20 | **16** | Buildable in 72h on simulated consent objects; solid but more simulation than Haseen. |
| Data | 20 | **15** | Good access-pattern analytics, but on synthetic TPP logs (no live ecosystem). |
| UX | 15 | **12** | Clean consent-receipt UX, but two-sided (consumer + bank console) splits polish. |
| Feasibility | 25 | **21** | Strongly compliant + on-strategy, but the deploy depends on a TPP ecosystem still maturing. |

**Gates:** ✅ 72h-demoable · ✅ differentiated (no incumbent) · ✅ Shariah-compliant · ✅ PDPL/consent/SAMA — *it IS the consent-compliance tool* · ✅ one track (3) + 2 requirements.

See [[concept-haseen]] (champion), [[concept-baseera]], [[saudi-fintech-terrain]].
