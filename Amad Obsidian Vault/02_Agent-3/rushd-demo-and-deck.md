---
title: "Rushd — Demo Storyboard + Pitch Deck"
tags: [agent/3, deliverable, demo, pitch, track/genai]
updated: 2026-06-18
---

# 🎬 Rushd — Demo Storyboard + Pitch Deck
> The win condition is "a working demo + a deck." This is both, built around the [[rushd-v2-sharpened|Tayyib Score]] spine. Rule: **open on the score, never on a chat box.**

> ▶️ **Working prototype shipped:** `prototypes/rushd-demo.html` (project root) — single-file, 100% offline, Arabic-RTL, deterministic. Walks all 5 beats below with a judge-facing narration rail + animated Tayyib Score ring, live "halal? why? cited ruling" sheets, the purification + zakat/Murabaha actions. **Proves Rushd isn't slideware** — directly answers the "another AI chatbot" perception that split the two synthesis passes (A1: 82 vs A2: 88). Matches the prototype bar Agent 2 set with `haseen-demo.html`.

## 🎬 3-minute live demo (shot-by-shot)
Persona: **"Faisal," 31, Riyadh, salaried + side income.** One seeded, deterministic demo account. Phone mirrored to the screen, Arabic RTL UI.

| Time | On screen | What's said (Arabic-spoken, English here) | Why this beat |
|---|---|---|---|
| **0:00–0:20** | Cold open on Faisal's home: one big number — **Tayyib Score 76/100** — and two chips: *"Zakat due today: SAR 4,212"* and *"Purified this year: SAR 340."* | "Every Alinma customer carries one question their app never answers: *is my money halal?* Rushd answers it — as a score." | Hook + the memorable artifact in the first 20 seconds. No chat box. |
| **0:20–1:00** | Tap the score → drill-down: halal-income 94%, halal-spend 88%, **12% of spend at doubtful merchants** (category × time chart). Tap one flagged transaction → plain-Arabic reason + **cited board ruling**. | "It's a credit score for how *tayyib* — wholesome — your money is. Every number is explained, every ruling cited. This isn't an opinion; it's Alinma's Shariah board, in your pocket." | **Data-depth** proof (the criterion judges doubt) + the explainability/citation moat. |
| **1:00–1:45** | A live transaction streams in from a non-compliant merchant → score dips to 74, card appears: *why* + a compliant alternative. Faisal taps "use alternative." | "Watch it work in real time. A doubtful purchase — Rushd flags it, explains why, offers a halal alternative, and your score recovers." | **Wow #1** — the visceral, only-Alinma moment, now tied to the number. |
| **1:45–2:20** | The *"Purified SAR 340"* chip → SAR 13.40 interest credited in error is auto-quarantined → one-tap route to charity. Score ticks up. | "Rushd found interest credited to you by mistake — not yours to keep in Islam. It quarantined it and, with one tap, gives it to charity. Purification that used to be a once-a-year guess is now automatic." | **Wow #2** — uniquely Islamic, effortless, quantified. |
| **2:20–2:45** | The zakat chip → "Zakat due SAR 4,212, already reserved" → voice command: *"ادفع زكاتي وحوّل الفائض إلى وعاء ادخار متوافق."* Rushd shows the **Murabaha structure**, confirms, executes. | "And the year-end zakat scramble? Already computed, already set aside. One command — pay zakat, move the surplus to a halal savings pot. Done." | **Wow #3** — agentic action *in service of the score* (not sprawl) + voice. |
| **2:45–3:00** | Full-screen: Tayyib Score 81, "Zakat paid," "Surplus saved (Murabaha)." Then the close slide. | "Rushd runs on ALLaM on Alinma's own IBM watsonx stack. It grows deposits, raises NPS, and deepens the one thing no conventional bank can copy: trust that your money is halal. **Alinma could ship this next quarter.**" | Land it on the bank-ship line. |

**Demo guardrails:** every transaction is pre-seeded + deterministic; LLM responses cached + board-verified; voice behind a flag with a recorded fallback; nothing depends on a live network call (see [[rushd-architecture-buildplan]] §demo-failure).

## 🖥️ Pitch deck (10 slides, mapped to the rubric)
Final judging is a pitch — every slide earns a specific criterion.

1. **Title / one-liner.** "رُشد — a Shariah score for your money. Live, explained, and Alinma fixes it." *(sets the frame)*
2. **The problem (45 sec).** The unanswered "is my money halal?" + the year-end zakat/purification scramble + Saudi banks at −82% service sentiment. → *earns Feasibility (real pain) + sets up Innovation.*
3. **Insight / "why now".** ALLaM (Islamic-aligned Arabic LLM) + agentic AI + licensed open banking all landed in 2025–26 → the Tayyib Score is newly possible. → *Innovation.*
4. **The product — the Tayyib Score.** One screen, one number, three jobs (classify+explain / zakat / purify). → *Innovation + UX.*
5. **LIVE DEMO** (the 3 min above). → *Technical + UX + Data, proven not claimed.*
6. **Under the hood.** Architecture: ALLaM on watsonx → agent + tools → Shariah-rulings RAG + classifier → mock OB/core. What's built vs mocked (honest). → *Technical.*
7. **The data story.** The composite index + nisab/hawl zakat engine + the category×time drill-down on real KAPSARC POS data. → *Data analysis.*
8. **Differentiation.** vs Malaa / Zakaty / chatbots / robo-advisors — the bank-owned, action-taking, board-cited moat. → *Innovation + Feasibility.*
9. **Bank-ship case (the clincher).** P&L: grows low-cost deposits (closes SAMA's credit-to-deposit gap), lifts cross-sell 5–15%, raises NPS off −82%; ships into iz/iz Business on watsonx; PDPL/SAMA/Shariah governance (AI never issues fatwa). → *Feasibility.*
10. **Close.** "The halal score that pays your zakat and purifies your money — uncopyable by any conventional bank. Alinma ships this next quarter." + the Tayyib Score logo lockup.

**Deck rules:** Arabic-first or bilingual RTL; ≤15 words/slide; the demo is the centre of gravity (slides 1–4 set up, 6–10 pay off). One number (the Tayyib Score) recurs on every slide footer for memorability.

## The 3 sentences the team must be able to say cold
1. *"It's a credit score for how halal your money is — live, explained with citations, and the bank fixes it for you."*
2. *"Only an Islamic bank with a Shariah board can own this — Malaa can compute zakat, but it can't act on your money or own the ruling."*
3. *"It grows the bank's deposits and pays your zakat automatically — runs on ALLaM on Alinma's own watsonx stack."*

## Links
- [[rushd-v2-sharpened]] · [[rushd-architecture-buildplan]] · [[champion]] · [[concept-haseen]] (the bar)
