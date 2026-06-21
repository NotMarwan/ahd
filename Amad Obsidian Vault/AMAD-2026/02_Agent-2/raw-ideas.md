---
title: Agent 2 — Raw Ideas (divergent set)
tags: [agent/2, ideation, regtech]
---

# 💡 Agent 2 — Phase 2 Diverge (Lane 2: RegTech / Risk / Fraud)

20 raw concepts before judging. Gut scores 1–5 on **Nov** (novelty) and **Feas** (72h feasibility). Ideation lens in brackets. Finalists ⭐.

| # | Concept | What it is | Nov | Feas | Lens |
|---|---|---|---|---|---|
| 1 ⭐ | **حصين Haseen** | In-app pre-payment scam **circuit breaker**: CoP name-match + scam-pattern classifier + GenAI Arabic interrogation, fires *before* the irreversible sarie push | 5 | 4 | pain-inversion |
| 2 ⭐ | **رقيب Raqib** | **OB consent-fraud firewall**: scores AIS/PIS consent requests + rogue-TPP behavior; plain-Arabic consent receipt w/ granular toggles | 5 | 4 | trend-collision |
| 3 ⭐ | **بصيرة Baseera** | GenAI **AML investigation copilot** + auto-drafts SAR/STR + auto-generates the new **SAMA quarterly Counter-Fraud report** | 3 | 4 | AI-native |
| 4 | CoP-as-a-Service | Standalone **Confirmation of Payee** name-match registry for sarie/IBAN (KSA has none) | 4 | 4 | analog (UK) |
| 5 | Deepfake-voice interceptor | Real-time voice-clone detection on phone-banking / scam calls | 4 | 2 | AI-native |
| 6 | Mule-ring graph hunter | Network-graph that lights up mule rings (dormant→tester→spike) | 3 | 3 | data-asset |
| 7 | Explainable TM | False-positive-killing transaction monitoring w/ SHAP-style reasons | 2 | 3 | jobs-to-be-done |
| 8 | Shariah contract auditor | LLM flags *riba*/*gharar* in product contracts vs Shariah board rules | 4 | 3 | constraint-driven |
| 9 | Arabic sanctions/PEP screener | Name-matching vs sanctions/PEP lists | 1 | 4 | (Mozn owns — kill) |
| 10 | SAMA report auto-gen | Bot that compiles the mandatory quarterly Counter-Fraud report | 3 | 4 | jobs-to-be-done |
| 11 | Fake-app / smishing detector | Detect fake Alinma apps + phishing links targeting customers | 3 | 3 | pain-inversion |
| 12 | OTP-leak circuit breaker | Detects when a user is about to read an OTP aloud on a call | 4 | 2 | pain-inversion |
| 13 | Invoice/BEC fraud detector | Cross-check ZATCA e-invoices vs payment beneficiary to catch supplier-swap | 4 | 3 | data-asset |
| 14 | Federated mule blocklist | Cross-bank shared mule-account intelligence (privacy-preserving) | 4 | 2 | analog |
| 15 | Behavioral-biometrics ATO guard | Typing/swipe anomaly → account-takeover score | 3 | 2 | (BioCatch/Mozn — weak) |
| 16 | Elder/family guard mode | Delegated co-approval on large transfers for vulnerable customers | 4 | 4 | jobs-to-be-done |
| 17 | Romance/investment-scam detector | In-app chat + transaction pattern → scam typing | 4 | 3 | pain-inversion |
| 18 | Charity/zakat-scam verifier | Verify a charity's legitimacy before donating | 3 | 3 | constraint-driven |
| 19 | SME fake-supplier guard | OB + e-invoicing cross-check on new payee for SMEs | 4 | 3 | data-asset |
| 20 | OB consent dashboard | PDPL-native "who sees my data" + one-tap revoke | 3 | 4 | analog (UK Which?) |

## Clusters
- **A — Consumer scam interception** (1,4,11,12,16,17,18): the human-layer gap. *Strongest, most visceral.*
- **B — Open-banking-native risk** (2,20): brand-new attack surface; only-now.
- **C — Back-office AML/compliance automation** (3,7,9,10): real money pain, but Mozn-adjacent.
- **D — Identity / deepfake** (5,15): timely but hard to genuinely build in 72h.
- **E — SME / merchant fraud** (13,19): underserved, good but narrower demo.

## Convergence rationale → 3 finalists
- **#1 Haseen** (cluster A) — best wow + most differentiated from Mozn + strongest "only-now/Alinma-ships-it". Absorbs #4 (CoP), partly #12, #16, #17.
- **#2 Raqib** (cluster B) — only-now OB regime; unowned space. Absorbs #20.
- **#3 Baseera** (cluster C) — biggest hard-money pain ($274B AML / 22h-per-alert). Absorbs #7, #9, #10.
- **Cut**: deepfake/biometrics (#5,#15 — feasibility gate: can't build a real model in 72h, would be slideware). Pure screening (#9 — differentiation gate: Mozn owns it). SME/charity (#13,#18,#19 — good, narrower demo than Haseen).

See [[concept-haseen]], [[concept-raqib]], [[concept-baseera]], and out-of-lane [[wildcard]].

#agent/2 #track/regtech
