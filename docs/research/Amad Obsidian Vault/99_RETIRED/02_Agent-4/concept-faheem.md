---
title: "فَهيم Faheem — contextual AI literacy on your real money"
tags: [agent/4, concept, status/finalist, track/financial-education, track/gamification, req/ai, req/cx, req/data, score/83]
updated: 2026-06-18
---

# فَهيم · Faheem — "Duolingo for the money you actually have."
**Track:** 4 Financial Education (primary) + 6 Gamification · **Requirements:** /02 AI + /03 CX + /01 Data + /04 Sustainability
**Total score: 83 / 100**

## A. One-liner
*Faheem reads your real spending through open banking and, at the exact moment a lesson matters, an AI fires a 30-second Arabic micro-lesson tied to a one-tap fix — financial literacy you live, not lessons you forget.*

## B. Problem
**~38% adult financial literacy** (62% lack basics). Existing fixes fail two ways: (1) **brochures/courses are abstract** — people don't transfer "compound interest" to their own life; (2) **Duolingo-style finance apps teach generic content** disconnected from the user's money, so retention and behavior change are weak. KSA mandated a school finance course in 2023 — but the **adult population missed it**. The teachable moment is *the transaction itself*: the instant you overspend on dining, take a third BNPL, or leave idle cash, a lesson would actually land. Nothing in KSA teaches **on your own live data**. **Why now:** licensed OB gives lawful access to the transaction stream; GenAI can generate a *personalized Arabic lesson per event* — impossible to author by hand at scale two years ago.

## C. Solution
An AI literacy layer that watches (with consent) your categorized spend and triggers **event-driven micro-lessons**:
- **Trigger → teach → act:** "You've put 40% of this month on dining — here's the 2-minute why, and tap to set a dining envelope." Each lesson is 30–60s, Arabic-first, and **ends in a single concrete action** (set a rule, move money, cancel a renewal).
- **Generative, not templated:** the LLM writes the lesson from *your* numbers (your merchants, your amounts), so it's never generic.
- **Gamified mastery:** streaks, skill-trees (budgeting → debt → saving → investing-halal), and **levels tied to demonstrated behavior** (did the dining envelope actually hold?). Mastery is measured by *money outcomes*, not quiz scores.
- **BNPL guardrail module:** detects stacked Tabby/Tamara installments and teaches the overextension math in-context.

**Only-possible-now element:** per-transaction, personalized, Arabic lesson generation from live OB data.

## D. Mapping
- **Track:** 4 Financial Education. Secondary 6 Gamification (streaks/skill-tree).
- **Requirements:** **/02** (AI lesson generation) + **/03** (personalized CX) + **/01** (spend analysis) + **/04** (durable literacy). 4 of 5 criteria touched.

## E. 72h build plan
- **Stack:** RN/Flutter (RTL); LLM lesson-generation service with a curated KSA finance knowledge base (zakat, Murabaha, BNPL math) for grounding; transaction categorizer; seeded OB feed.
- **Built for real:** the categorizer + trigger engine, the **live lesson generation**, the skill-tree/streak UI, the one-tap action hooks.
- **Mocked/seeded:** OB feed via Alinma sandbox + synthetic generator (a demo persona with juicy teachable transactions).
- **Cut-line:** D1 categorize + trigger rules. D2 LLM lesson-gen grounded + skill-tree. D3 Arabic polish + the showcase persona + fallback.
- **The one feature that must work:** a transaction → a freshly-generated Arabic lesson → a one-tap fix, live.

## F. Data story
- **Data:** OB transactions (sandbox/synthetic) + a KSA finance content corpus for grounding.
- **Insight live:** spend categorization + a personalized "literacy gap" map (which money concepts *this* user is losing money to), and a before/after on a behavior the user fixed in-app.

## G. Demo script (3 min)
1. **0:00:** "Everyone's building a finance Duolingo. They all teach lessons no one applies. We teach the lesson your *last transaction* needed."
2. **0:30:** demo persona's OB feed loads; Faheem flags a 3rd BNPL + heavy dining.
3. **1:10 — wow:** an Arabic micro-lesson **generates live from the persona's actual numbers**, ending in a one-tap dining envelope.
4. **2:00:** skill-tree levels up *because the envelope held* (behavior, not a quiz).
5. **2:40:** "This is the literacy KPI SAMA wants — delivered at the only moment it sticks."

## H. Bank-ship case
- **On-strategy:** ships into **"iz"** as the youth literacy layer; advances FSDP/SAMA **financial-literacy KPI** (regulator credit, Vision 2030).
- **Retention/CX:** contextual coaching deepens app engagement and trust (the #1 Gen Z adoption driver in KSA studies).
- **Indirect revenue:** better-coached customers → less default, more cross-sell of halal savings/invest products; nudges can surface Alinma products at the teachable moment.
- **Shariah:** content is Shariah-first (teaches Murabaha/zakat, flags riba); no reward mechanic to clear. **PDPL:** explicit OB consent; data used only to teach.

## I. Differentiation
- vs **Duolingo-style finance apps / generic literacy:** they teach abstract content; Faheem teaches **on your own live transactions** — context is the moat.
- vs **Drahim/Malaa (PFM):** they *show* you charts; Faheem *teaches and changes behavior* at the event, with measured outcomes.
- Weaker spot: "education" reads as softer business value than deposits → see risk #1.

## J. Risk register
1. **Feasibility skepticism: "education doesn't make money."** → Mitigate: frame as retention + default-reduction + cross-sell + the regulator's literacy KPI; quantify lower BNPL-default exposure.
2. **LLM hallucination on financial/Shariah facts.** → Mitigate: retrieval-grounded generation against a vetted KSA corpus; Shariah claims from a fixed approved set, never free-generated.
3. **Demo lesson-gen latency/quality.** → Mitigate: pre-warmed prompts + a deterministic showcase persona.

## K. Score (100)
| Criterion | Wt | Score | Why |
|---|---|---|---|
| Innovation & creativity | 20 | **17** | Live, per-transaction Arabic lesson-gen is a fresh, only-now wedge. |
| Technical implementation | 20 | **16** | Grounded lesson-gen + categorizer + skill-tree in 72h; some LLM-quality risk. |
| Data analysis | 20 | **17** | Strong: categorization + per-user literacy-gap map + outcome tracking. |
| User experience (UX) | 15 | **14** | Arabic-first, frictionless, teachable-moment delivery. |
| Real-world feasibility | 25 | **19** | On-strategy + regulator KPI, but softer (indirect) revenue case than Namaa. |
| **Total** | **100** | **83** | |

**Gates:** ✅ 72h-demoable · ✅ differentiated (contextual, on real data) · ✅ Shariah-compliant (Shariah-first content, no reward mechanic) · ✅ PDPL+consent+SAMA · ✅ one track (Financial Education) + ≥1 req.

## Links
- [[research]] · [[raw-ideas]] · [[concept-namaa]] · [[concept-misnad]] · [[champion]] · [[master-scoreboard]]
