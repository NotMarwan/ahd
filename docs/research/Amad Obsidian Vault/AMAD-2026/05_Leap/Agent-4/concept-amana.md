---
title: "أمانة Amana — Conditional trust-money (yadan-bi-yad, restored)"
tags: [agent/4, leap, concept, status/finalist, vector/new-primitive, track/customer-experience, req/cx, req/ai, score/83]
updated: 2026-06-18
---

# أمانة · Amana — "Money that releases only when the deal is done."
**Track:** 2 Customer Experience (alt: 5 Open Banking) · **Requirements:** /03 CX + /02 AI + /04 Sustainability
**Score: 83 / 100**

## A. One-liner
*Amana lets any two Saudis transact at a distance with zero leap of faith — money is held in trust and released **only** when the agreed proof arrives — digitally restoring the Islamic ideal of "yadan bi-yad" (hand-to-hand, simultaneous) exchange that online deals destroyed.*

## B. Problem
Saudi C2C commerce is enormous and trust-broken. **Haraj** (and informal WhatsApp/Instagram selling) has **no escrow or dispute resolution** — "pay a deposit, the seller disappears" is a standard scam, and sellers equally fear shipping before payment. Freelancers face the mirror problem ("deliver first or get paid first?"). The deeper point: Islamic commercial ethics prize **yadan bi-yad** — simultaneous, certain exchange that removes **gharar** (ruinous uncertainty). Remote deals shattered that ideal, and nobody rebuilt it. Existing escrow is marketplace-locked (eBay/Trade Assurance), foreign, and absent from KSA banking.

## C. Solution
A new primitive: **conditional money held in amana, released on verified proof.** Sender attaches a condition to a transfer:
- **Delivery confirmed** (QR handover code / logistics webhook / mutual tap),
- **Identity verified** (Nafath at handover),
- **Milestone met** (freelance deliverable accepted),
- **Date reached** (deposit auto-returns if the deal lapses).
The bank holds the funds as a neutral **amana** trustee (earning no interest; float optionally donated), and releases the instant the condition is met — both sides perform at once. A **trust receipt** records the honored deal.
**Only-now/only-here:** Nafath handover verification + sarie instant settlement + OB + ALLaM condition-phrasing — KSA-2026 — turned onto the C2C trust gap.

## D. Mapping
Track 2 CX (alt 5 OB). Requirements **/03** (frictionless safe deals) + **/02** (AI phrases/structures the condition + verifies proof) + **/04** (trustworthy commerce = sustainable inclusion of the informal economy).

## E. 72h build plan
- **Built:** create-conditional-transfer flow, condition types, the held-in-trust state, the **proof/verify event** (mock QR handover + Nafath-mock), conditional release via mock sarie, the trust-receipt, auto-return-on-lapse.
- **Mocked:** real logistics webhooks, Nafath, sarie settlement (seams).
- **Must-work:** buyer funds a held deal → seller delivers → buyer taps "received" (or QR) → money releases instantly → trust receipt issued. Plus the lapse/auto-refund path.

## F. Data story
Live: the **trust-state machine** visualized (funded → held → proof → released), plus an aggregate "deals honored / disputes avoided" metric and an AI **risk read** of a deal (flags over-large deposits, anomalous patterns) — analytic, not just a ledger.

## G. Demo script (3 min)
1. "20% of Saudis have a credit card; everyone uses Haraj. You pay first and pray. We fixed that — the halal way."
2. Buyer funds a SAR 3,000 phone purchase → money goes into **amana (held)**, not to the seller.
3. Handover: seller's QR scanned (Nafath-verified) → money **releases instantly** → both protected. Trust receipt issued.
4. Counter-case: seller never delivers → at the deadline, **funds auto-return** to the buyer.
5. Close: "We rebuilt *yadan bi-yad* — hand-to-hand certainty — for the digital age. Alinma becomes the trust layer of Saudi peer commerce."

## H. Bank-ship case
- **Float/deposits** on held funds; **transaction/wakala fees**; **acquisition** of both sides of every deal; positions Alinma as the **neutral trust rail** for C2C + freelance.
- **Shariah:** amana/wakala trusteeship; **removes gharar** (the opposite of contested structures); no riba/maysir. **PDPL** consent; **SAMA** rails.

## I. Differentiation
- vs **Haraj/marketplaces:** they punt trust; Amana is a bank-grade neutral rail usable on *any* deal, anywhere.
- vs **foreign escrow (eBay/Escrow.com):** marketplace-locked, non-Islamic-framed, absent in KSA.
- vs kill-list: **not Haseen** (no fraud *detection/interception* — it's a consensual trust mechanism); not Tadfuq/Rushd/Namaa.

## J. Risks
1. **Verification of "delivery" is the hard part.** → Start with mutual-confirm + QR handover + Nafath; logistics webhooks as roadmap; demo the mutual-confirm path.
2. **Dispute edge cases.** → Clear lapse/auto-refund rules + escalation to MoJ/Taradhi; Amana records, doesn't adjudicate.
3. **Overlap with "anti-scam" framing (retired Haseen).** → Frame as a *trust primitive*, not fraud detection; different mechanism.

## K. Score — 83/100
| Criterion | Wt | Score |
|---|---|---|
| Innovation | 20 | **16** (escrow exists globally; novelty = native bank primitive + yadan-bi-yad + KSA-first) |
| Technical | 20 | **17** (clean state machine, very buildable) |
| Data | 20 | **14** |
| UX | 15 | **14** |
| Feasibility | 25 | **22** (Haraj pain, float, fees; verification integrations are the watch-item) |
| **Total** | | **83** |

**Gates:** ✅ all (72h · leap · Shariah-clean/amana · not kill-list · PDPL/SAMA · one track + req).

## Links
- [[research]] · [[raw-ideas]] · [[concept-ahd]] · [[concept-takatuf]] · [[champion]]
