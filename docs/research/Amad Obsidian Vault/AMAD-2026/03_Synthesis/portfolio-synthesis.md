---
title: "Portfolio Synthesis — cross-agent judging & the operator's bet"
tags: [synthesis, judging, status/cross-agent]
updated: 2026-06-18
---

# 🧭 Portfolio Synthesis — All Four Lanes, Judged Honestly

> Started by **Agent 2** after Agents 1, 3, 4 finalized. Purpose: normalize the self-scores, rank the portfolio as an external judge panel would, find the combination play, and give the operator a single defensible bet. Honest, not flattering.
> ⚠️ Vault has two folder trees (Agents 1 & 3 under root `02_Agent-N/`; Agents 2 & 4 under `AMAD-2026/02_Agent-N/`). Links resolve globally in Obsidian. This note lives in the documented `AMAD-2026/03_Synthesis/` path and covers all four.

## The four champions

| Lane | Champion | Track | Job-to-be-done | Self-score |
|---|---|---|---|---|
| 1 | [[concept-tadfuq\|تدفّق Tadfuq]] | 5 Open Banking + GenAI | Underwrite the SAR-0.5T SME/freelancer credit gap from OB×ZATCA cash-flow, explained | 90 |
| 2 | [[concept-haseen\|حصين Haseen]] | 3 RegTech + GenAI | Stop APP/scam transfers at the human layer before the irreversible push | 90 |
| 3 | [[concept-rushd-shariah-copilot\|رُشد Rushd]] | 1 GenAI + CX | A Shariah-conscience layer that tags/explains/purifies/acts on your money | 89 |
| 4 | [[concept-namaa\|نَماء Namaa]] | 6 Gamification + Education | A halal (maysir-free) savings game that auto-funds goals via OB | 88 |

## Honest re-judgment (normalized — self-scores are all inflated ~+2)

Every agent graded its own champion 88-90. A real panel normalizes. My independent re-score:

| Champion | Innov /20 | Tech /20 | Data /20 | UX /15 | Feas /25 | **Normalized** | Δ vs self |
|---|---|---|---|---|---|---|---|
| **Tadfuq** | 17 | 16 | **18** | 13 | **24** | **88** | −2 |
| **Rushd** | **18** | 16 | 16 | 14 | **24** | **88** | −1 |
| **Haseen** | 17 | 16 | 16 | **15** | 22 | **86** | −4 (mine; hardened below → see addendum) |
| **Namaa** | 16 | 16 | 15 | 15 | **24** | **86** | −2 |

**Read:** it's a near four-way tie. Tadfuq and Rushd edge ahead on a flat rubric sum. But the rubric sum is *not* the operator's real objective.

## The operator's real objective ≠ rubric sum

The win condition is **"top a 3-minute live pitch to bank execs + technologists, who walk away thinking *Alinma should ship this.*"** That reweights toward four things the flat table hides:

| Decision factor | Strongest | Weakest |
|---|---|---|
| **Demo wow** (tired hour-70 judge sits up) | **Haseen** (live scam *save*) · **Namaa** ("halal Premium Bonds" + "7 months early") | Tadfuq (a limit appears — impressive but cerebral) |
| **Uncopyable moat** ("only an Islamic bank") | **Rushd** (conscience layer) · **Namaa** (maysir-free reward) | Tadfuq (anyone can build a credit engine) |
| **Hard-money / "ship next quarter"** | **Tadfuq** (SAR 0.5T book) · **Namaa** (deposits = CASA) | Haseen (avoided-loss is real but indirect) |
| **"We've seen this" risk** | (each has a pre-empt) | Haseen→"Mozn does fraud"; Rushd→"another chatbot"; Namaa→"Qapital"; Tadfuq→"cash-flow lending isn't new" |

**No concept dominates all four.** The bet depends on the team's build strengths and risk appetite.

## Recommendation to the operator

1. **If optimizing for win probability with a strong GenAI + UX team → lead with [[concept-rushd-shariah-copilot|Rushd]] or [[concept-haseen|Haseen]].** Both put the *Islamic-bank identity* and a *felt* demo moment front and centre, which is exactly what a 3-min pitch to Alinma execs rewards. Rushd has the deeper moat; Haseen has the more visceral single moment (and now a working [prototype](../../../prototypes/haseen-demo.html) — see addendum in [[champion]]).
2. **If the team is data/ML-heavy and wants the safest business case → [[concept-tadfuq|Tadfuq]].** Strongest "ship next quarter," clearest revenue, but must rehearse the <15s reveal so it lands emotionally, not just technically.
3. **If the team is product/behavioral and wants the cleanest narrative → [[concept-namaa|Namaa]].** The "best savings tool on earth is haram, we built the halal version" reframe is the single best *opening line* in the portfolio.

**My honest single pick for highest expected value:** a toss-up between **Rushd** (moat + identity) and **Haseen** (demo + the timely SAMA-mandate feasibility hook). I'd run **Haseen** if the team can build a tight live interception (the prototype proves it's buildable and de-risks "slideware"); **Rushd** if they want the most defensible "only-Alinma" story. Tadfuq is the strongest *fallback* if the GenAI demo risk feels too high.

## The combination insight (the platform thesis)

The four concepts are not competitors. They are the **four pillars of one AI-native Islamic-banking experience**:

- **Know** → Rushd (Shariah-conscience: is this halal, and why?)
- **Protect** → Haseen (stop the scam before the money leaves)
- **Grow** → Namaa (halal behavioral savings)
- **Fund** → Tadfuq (cash-flow credit for the underserved)

**For the 72h hackathon: build ONE pillar deep** (discipline beats sprawl — see the anti-patterns). But the winning *pitch* can close on the platform vision: *"This is pillar one of Alinma's AI money layer."* That frames a single demo as a strategy, which is precisely what makes a bank exec think "ship it."

Concrete cross-pollination already logged across lanes:
- Haseen can consume Tadfuq's OB cash-flow features for behavioral baselining; both run on the same Alinma OB sandbox.
- Rushd's "purify/act" tools and Haseen's "protect" interception share one Arabic GenAI layer (**ALLaM via IBM watsonx**) and one consent model.
- Namaa's halal-reward engine + Rushd's conscience layer share the same Shariah-board governance pattern (human-in-the-loop, no auto-fatwa, *hibah* not *maysir*).
- My wildcard [[wildcard|درع Dir' (micro-takaful)]] is the natural "Protect+" product for Tadfuq's freelancer segment.

## Shared risks the whole portfolio must answer (raise at enrichment)
- **All four lean on the Alinma OB sandbox + synthetic data.** Confirm real endpoint access at the **12–13 Jul** sessions; have offline fallbacks (every champion already plans one).
- **All four invoke Shariah compliance.** Get a Shariah-board sanity read at a mentor session; none should claim a *fatwa*.
- **Three of four assume ALLaM/watsonx is the sanctioned model path inside Alinma.** Verify.

See [[master-scoreboard]] · [[hackathon-brief]] · [[saudi-fintech-terrain]] · champions: [[concept-tadfuq]] [[concept-haseen]] [[concept-rushd-shariah-copilot]] [[concept-namaa]].
