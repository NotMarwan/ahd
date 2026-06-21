---
title: Concept — Rabt (ربط) · Embedded Lending-as-an-API  [renamed from Misnad]
tags: [agent/1, concept, status/finalist, track/open-banking, req/data, req/ai, score/76]
updated: 2026-06-18
---

# 🔌 Rabt (ربط) — Embedded Lending-as-an-API
> **Renamed** from "Misnad" on 2026-06-18 to resolve a vault collision with Agent 4's [[concept-misnad|مِسْنَد Misnad]] (a different concept). *Rabt* = "to link/connect" — fitting an embedded connector.
> **Track:** 5 · Open Banking + 1 · GenAI · **Requirements:** /01 Data + /02 AI · **Calibrated score: 76/100** *(self-score was 79; deflated under the cross-agent bar — see [[00_SYNTHESIS]])*
> A *different bet* from [[concept-tadfuq|Tadfuq]]: this is Tadfuq's **distribution layer**, not a standalone product.

## A. One-liner
**"Rabt lets any Saudi accounting/POS tool offer an SME instant, Shariah-compliant working capital the moment a ZATCA invoice is issued — Alinma's underwriting delivered as one API call from inside the software the SME already lives in."**

## B. Problem
SMEs feel a cash-flow gap *inside their ERP/POS* (right after issuing a ZATCA invoice they're still waiting to collect), not on a bank's website — and they rarely cross that gap. Banks lack low-cost distribution to the long tail. **ZATCA Wave 24 (30 Jun 2026)** just connected thousands of small SMEs to compliant accounting tools — a ready, mandated distribution surface that didn't exist a year ago.

## C. Solution
A **bank-provided "lending-as-an-API"** layer: ZATCA-integrated ERP/POS partners (Qoyod-class) embed a Rabt widget. The **invoice-issued event** is the trigger — when live OB+ZATCA data signals a fundable gap, the software surfaces a pre-approved **Tawarruq** line; one consented call returns a decision. **ALLaM** writes the in-context Arabic offer copy. Alinma monetizes via **API/data-product revenue + the lending book**.
**Only-now element:** embedded finance × licensed open banking × mass ZATCA integration converging in 2026; the offer is **event-triggered by a real invoice**, not a form.

## D. Mapping
Track 5 · /01 Data + /02 AI. B2B2B embedded-finance distribution platform. Reuses the [[concept-tadfuq|Tadfuq]] decision engine.

## E. 72-hour build plan
- A **mock Saudi ERP/POS** web app (issues a ZATCA invoice) + the **Rabt SDK/widget** + the decision API (the Tadfuq engine on sandbox/synthetic data) + ALLaM-generated offer copy.
- *Built:* the embed flow end-to-end (invoice event → eligibility → in-app offer → consented decision → partner-API dashboard). *Mocked:* real partner integrations + settlement.
- Must-work: issue an invoice in the fake ERP → an **in-context credit offer pops up** → accept → decision returned → revenue logged on the Alinma partner dashboard.

## F. Data story
The OB+ZATCA+POS underwriting is shared with Tadfuq; Rabt's *distinct* insight is **contextual triggering** — the data decides *when* to offer (post-invoice liquidity dip), not just *whether*. Show the trigger logic firing off a real invoice event with the predicted collection-gap.

## G. Demo script (3 min)
Inside a mock accounting app the SME issues a ZATCA invoice → seconds later an embedded **"You qualify for SAR 120k working capital"** card appears (Arabic, ALLaM-written) → tap → consent → approved in-app → cut to an **Alinma "partner API" dashboard** showing the call + the new revenue line. Close: *"Alinma's balance sheet, distributed everywhere Saudi SMEs already work — at near-zero CAC."*

## H. Bank-ship case
**Pure on-strategy:** Alinma explicitly wants "new revenue streams + seamless access for corporate clients & fintech partners" — Rabt *is* that, productized. Distribution at near-zero CAC; API/data monetization; Shariah-native; built on the IBM API platform + licensed OB. ZATCA-mandated tools = a ready channel.

## I. Differentiation
KSA embedded-SME-credit **triggered by ZATCA invoice events** is genuinely novel. vs Lean/Tarabut (rails, not bank-branded decisioning): Rabt is Alinma's *own* credit, embedded at the point of need.

## J. Risk register
1. **Hardest 72h build** (two apps + SDK + API) → *mitigation:* keep the ERP mock thin; reuse the Tadfuq engine wholesale.
2. **Lowest visual wow** (developer/B2B2B) → *mitigation:* the in-context invoice→offer pop is the wow; make it slick + Arabic-native.
3. Partner-dependency story → *mitigation:* frame ZATCA-integrated tools as the ready, mandated channel.

## K. Score — 76/100 (calibrated)
| Criterion | Wt | Score | Why |
|---|---|---|---|
| Innovation | 20 | 15 | ZATCA-event-triggered embedded credit is fresh. |
| Technical | 20 | 13 | Most parts of any Lane-1 concept; demo risk highest. |
| Data analysis | 20 | 15 | Reuses Tadfuq depth; adds contextual triggering. |
| UX | 15 | 11 | B2B2B/developer surface; least vivid. |
| Feasibility | 25 | 22 | Bullseye on Alinma's API-monetization strategy. |

**Gates:** ☑ all pass (tightest on 72h-demoable — scope discipline required).

## Links
- [[concept-tadfuq]] (engine) · [[concept-nabd]] · [[00_SYNTHESIS]] · [[research]] · [[master-scoreboard]] · [[00_Index]]
