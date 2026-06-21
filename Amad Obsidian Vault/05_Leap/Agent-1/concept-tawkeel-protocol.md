---
title: "Concept — توكيل Tawkeel Protocol · the Islamic standard for AI money-agents"
tags: [agent/1, leap, concept, status/finalist, lane/agentic-money, score/78]
updated: 2026-06-18
---

# 🌐 توكيل Tawkeel Protocol — the Islamic standard for agentic money
**Track:** 5 · Open Banking (infrastructure) · **Requirements:** /02 AI + /01 Data · **Score: 78/100**
*Different bet: the infrastructure leap — not an app, a **standard**. Highest vision ceiling, lowest 3-min demo-wow.*

## A. One-liner
**"Tawkeel is a signed, revocable *wakala mandate* that any AI agent must present to act on an Alinma account — the faith-native answer to Google's AP2 and Mastercard's Agentic Tokens, making Alinma the bank that defines how AI agents are trusted with money in the Muslim world."**

## B. Problem
The whole industry is racing to solve **one** problem: *how do you let an AI agent move money safely, with provable consent and bounded authority?* Google (AP2 "Intent/Cart Mandates"), Mastercard (Agentic Tokens), Visa (TAP) are each inventing a trust layer from scratch. Banks will soon be flooded with third-party agents (Cleo-likes, shopping agents) asking to transact — **with no standard for scoped, auditable, revocable authority.**

## C. Solution
A bank-issued **Tawkeel mandate**: a cryptographically-signed credential, modelled on the **wakala contract**, that encodes *principal → agent → permissible scope → caps → expiry → revocation*. Any agent (Alinma's own [[concept-wakeel|Wakeel]], or a third party) must present a valid Tawkeel to initiate via PIS; the bank enforces the scope and logs an auditable trail. **It's AP2's Intent-Mandate idea — but grounded in a 1,400-year-old governance contract with built-in permissible-only + fiduciary (amana) + revocability conditions.**
**Only-now:** licensed PIS + the 2026 explosion of consumer AI agents + the absence of any *Islamic* agentic-trust standard.

## D. Mapping
Track 5 (Open Banking infra); /02 AI + /01 Data. A protocol + reference implementation + a developer console.

## E. 72h build plan
A **Tawkeel issuer + verifier** (signed mandate objects), a demo third-party agent that requests/presents one, and a bank-side **enforcement + audit console** showing a scoped PIS call allowed vs an out-of-scope one **blocked**. *Built:* the mandate format, sign/verify, scope enforcement, audit log. *Mocked:* real PKI/registry, real PIS. **Must-work:** an agent presents a Tawkeel → an in-scope payment clears, an out-of-scope one is refused, both audited.

## F. Data story
The audit/enforcement layer: every agent action checked against its mandate scope; a live console of allowed/blocked/escalated agent calls — governance made visible.

## G. Demo script (3 min)
Show two AI agents hitting an Alinma account: one with a valid Tawkeel (scoped to "pay utilities ≤ SAR 1,000") → its utility payment **clears**; it then tries a SAR 5,000 transfer → **blocked, logged**. Revoke the mandate live → the agent is locked out instantly. Close: "Every bank will need this. We built it on the contract Islam already had — and Alinma can set the standard for two billion people."

## H. Alinma-ship case
Positions Alinma as **the infrastructure layer for Islamic agentic finance** — a platform play (third-party agents, fees, ecosystem) + the strongest possible regulatory/Shariah story. Directly answers the global autonomous-finance oversight bar.

## I. Differentiation
The **Islamic** agentic-trust standard is genuinely unclaimed; AP2/Agentic Tokens are secular + Western. Not on kill-list (infra, not credit/score/game). Composes under [[concept-wakeel|Wakeel]] (Wakeel runs *on* Tawkeel).

## J. Risk register
1. **Lowest demo-wow** (infra/B2B) → *mitigation:* the live "allowed vs blocked vs revoked" moment is the wow; keep it visceral.
2. "Is this a standard or a hack in 72h?" → *mitigation:* ship a clean, real sign/verify/enforce loop; frame the standard ambition honestly.
3. Adoption depends on an ecosystem → *mitigation:* pitch as the rails Alinma's own Wakeel uses on day one.

## K. Score — 78/100
| Criterion | Wt | Score |
|---|---|---|
| Innovation | 20 | 18 |
| Technical | 20 | 14 |
| Data | 20 | 13 |
| UX | 15 | 11 |
| Feasibility | 25 | 22 |

**Gates:** ☑ all pass (huge leap + Shariah-clean + not kill-list; weakest on 3-min demo vividness).

## Links
- [[concept-wakeel]] (runs on this) · [[concept-majlis]] · [[champion]] · [[00_Index]]
