---
title: "نَماء Namaa — the Shariah-native behavioral-savings game (v2)"
tags: [agent/4, concept, status/finalist, status/champion, track/gamification, track/financial-education, req/cx, req/sustainability, req/ai, req/data, score/92]
updated: 2026-06-18
---

# نَماء · Namaa — "Make saving a habit. The halal way." (v2)
**Track:** 6 Gamification (primary) + 4 Financial Education · **Requirements:** /03 CX + /04 Sustainability + /02 AI + /01 Data
**Total score: 92 / 100** · **CHAMPION** · *(v1 was 88; v2 sharpens innovation + grounds the business case — changelog at bottom.)*

## A. One-liner
*Namaa makes a halal savings account as compelling as a conventional interest account — without riba and without the contested prize-draws — by pairing a zero-chance Shariah rewards economy with an agentic AI that finds how much you can really save and auto-executes the move every payday.*

## B. Problem (sharpened)
Saudi households save **≈1.6%** of income — vs the ~10% global floor and Vision 2030's own 6%→10% target. The usual diagnosis ("low literacy," 62% lack basics) is only half of it. The deeper, un-named cause: **for an observant Saudi, saving is structurally unattractive.**
- A *halal* (Mudarabah) savings account pays **0.1–3.6%, not guaranteed** — weak, uncertain incentive.
- The one mechanic proven to fix this — **prize-linked savings** (UK Premium Bonds, US Long Game: +30% savings in young cohorts) — is **maysir (gambling)**. The GCC workaround, **ADIB's "Ghina"** (AED 1M monthly prize draw, justified as *hibah*), is **openly Shariah-contested** — and **Saudi scholarship is stricter than the UAE's** on chance. So a conservative Saudi saver is left with: a low halal rate, a contested prize account, or conventional (haram) interest. Most choose **not to save**.

**Why now:** licensed open banking (26 Mar 2026) lets an app *see income and act on it*; agentic AI (the 2026 banking frontier — Deloitte/Oracle: +10–30% revenue from hyper-personal financial agents) lets it *act autonomously*; and a zero-chance reward economy can be engineered to clear even the strictest Saudi Shariah bar. None of this was possible 24 months ago.

## C. Solution
A mobile savings game with three only-now pillars:
1. **The uncontested halal reward economy (the moat).** Rewards are **guaranteed hibah tiers** (the bank gifts a bonus to *everyone* who hits a behavior), **skill/effort challenges** (finish a lesson, hold a streak), and **merchant-funded cashback**. **Zero chance element → zero maysir → clears the strictest Saudi bar**, where Ghina's draw does not. This is the conservatively-halal evolution of prize-linked savings — the un-clonable core.
2. **The agentic AI saver (only-now).** An Arabic-first agent that (a) estimates each user's **true savings capacity** (income − committed spend − essentials) from OB cashflow, (b) computes the **next-best nudge** (the round-up rule / "save-more-next-payday" escalation / goal tweak with the largest marginal deposit for *this* user), and (c) **proposes → user one-tap approves → executes** the move each payday. (Full autonomy is roadmap; demo runs human-in-the-loop.) SMarT pre-commitment (lifts savings 3.5%→13.6% in field trials) defeats present-bias.
3. **The behavioral game.** Goal → savings **streak** → **anonymized peer-cohort league** ("people your age/income save X — you're 30th percentile") → reward. Social comparison + streaks durably beat solo willpower; rewards attach to *real deposits*, so the effect doesn't decay like points-only gamification.

## D. Mapping
- **Track:** 6 Gamification (one track) · secondary 4 Financial Education (embedded micro-lessons).
- **Requirements:** **/03** + **/04** + **/02** + **/01** — covers 4 of 4 themes → maps onto 4 of 5 judging criteria directly.

## E. 72h build plan
- **Stack:** React Native (Arabic/RTL-first); FastAPI/Node; Postgres; Claude for the agent (capacity estimation narrative + Arabic coaching) with a tool-calling loop for the propose→execute action; a lightweight uplift/next-best-nudge ranker; seeded OB data.
- **Built for real (must work):** game loop (goal/streak/league), the **agentic propose→approve→execute** flow, the **savings-capacity + projection** models, the **reward ledger** showing hibah tiers, the cohort-benchmark screen.
- **Mocked/seeded:** OB income/spend via **Alinma OB sandbox** (`developer-ob-sb.alinma.com`) + a **synthetic transaction generator** → a deterministic demo account. No live OB call on stage.
- **Day cut-line:** D1 = data model + seeded cashflow + streak loop + capacity model. D2 = agentic action loop + next-best-nudge + league + reward engine. D3 = Arabic UX polish + demo hardening + fixed fallback.
- **The one feature that must work:** the **agent proposes the optimal payday move → one-tap approve → projection snaps months earlier** on the seeded account.

## F. Data story (deepened)
- **Datasets/APIs:** Alinma OB sandbox transactions + synthetic generator; SAMA savings-rate stats + World Bank Findex for cohort baselines.
- **Three models, shown live (depth beyond one chart):**
  1. **Savings-capacity estimator** — segments income vs committed/essential spend → "you can sustainably save SAR X/month" (credible, not arbitrary goals).
  2. **Next-best-nudge / uplift ranker** — predicts which intervention yields the largest marginal deposit for this user (real personalization, not one-size rules).
  3. **Forward projection** — the goal-completion curve that visibly snaps earlier when the user accepts the agent's move.
- Plus **saver-archetype segmentation** + **streak-retention analytics** + **marginal-deposit-per-nudge** as the bank-facing dashboard.

## G. Demo script (3 min)
1. **0:00 — Reframe the category:** "Premium Bonds lifts savings 30% — it's gambling, haram. ADIB's halal version uses a prize draw — Shariah-contested, and Saudi scholars are stricter. So the best savings tool on earth still doesn't exist for a Saudi who saves by conscience. We built it."
2. **0:30 — Problem on screen:** demo user, 1.6%-saver; OB feed loads; cohort screen: "30th percentile."
3. **1:00 — The agent acts:** AI estimates capacity ("you can save SAR 600/mo"), proposes the payday split + "save more next payday" → **one-tap approve** → round-ups + commitment animate in → streak ignites → league rank climbs.
4. **1:50 — The wow:** projection curve **snaps 7 months earlier**; Arabic coach explains why.
5. **2:25 — The reward reveal:** a **guaranteed hibah** badge unlocks — on screen: *"a gift from the bank for your habit — no draw, no chance, no maysir."*
6. **2:50 — The close:** "Alinma grew CASA 20% last year and lives on it. Namaa is a CASA-growth engine that also moves the national savings rate — and clears the strictest Shariah bar."

## H. Bank-ship case (grounded in Alinma's own numbers)
- **It feeds the exact metric Alinma optimizes.** 2024: customer deposits **SAR 210.5bn**, **CASA SAR 109bn (51.6% ratio, +20% YoY)**, NPM 3.7%. Retail savings = the cheapest funding; Namaa is a **CASA-growth engine** aimed at the youth segment with the worst savings rate.
- **Illustrative unit math (assumptions flagged):** if Namaa retains even **SAR 200/mo** extra per active user across, say, a **200k "iz" youth base**, that's **~SAR 480M/yr** of new low-cost CASA — material against a SAR 109bn base, funding the 3.7%-NPM book and saving wholesale-funding spread. *(User count illustrative; the mechanism — incremental CASA — is the point.)*
- **Who funds the rewards (the unit-economics answer execs demand):** the bank already pays a cost of funds on deposits. Namaa **redirects a capped slice of that funding-cost budget into guaranteed hibah + game rewards**, which carry **higher perceived value per riyal than basis points**, and **merchant-funded cashback** offloads cost to merchants buying footfall. Net: saving *feels* more rewarding than a conventional interest account while costing Alinma **less than matching conventional rates**.
- **On-strategy:** reuses the proven **Alinma Fantasy** engagement engine (now tied to real money) + ships into **"iz"** (youth). **Precedent de-risks it:** ADIB Ghina proves a halal rewards-savings account ships and clears a Shariah board — Namaa ships the *uncontested* version.
- **Regulator credit:** advances **SAMA's National Savings Strategy** (1.6%→10%) + FSDP inclusion/literacy KPIs → Vision-2030 goodwill.
- **Shariah / compliance:** hibah (gift, not a condition, **no draw**), Mudarabah/Qard savings, **no riba, no maysir** → clears strict Saudi review. PDPL-clean (explicit, revocable OB consent); SAMA-licensed OB rails; low risk (deposits, not lending).

## I. Differentiation
- **vs ADIB Ghina (the key new benchmark):** Ghina uses a **chance draw** (Shariah-*contested*, especially under stricter Saudi scholarship); Namaa is **zero-chance → uncontested**, and adds an agentic saver + behavioral game Ghina lacks. Namaa is "Ghina, but it clears the strict bar and actually changes behavior."
- **vs Alinma Fantasy:** Fantasy gamifies football (engagement, zero deposits); Namaa gamifies the customer's own balance (engagement **+ CASA + a national KPI**).
- **vs Hakbah:** group jam'iyah vs individual habit + agentic AI + halal reward economy.
- **vs STC Bank round-up / Qapital / Acorns:** they automate a rule; none has a **Shariah reward economy** + **agentic capacity-aware saver** + **peer league**. In an Islamic market the reward economy is the un-copyable edge.

## J. Risk register (expanded — see [[champion]] for full red team)
1. **"It's Qapital/Ghina-with-a-hijab" (innovation skepticism).** → Lead with the **halal-attractiveness reframe + the uncontested-vs-Ghina edge + agentic AI**; the novelty is the *halal economy + agent*, not the streak.
2. **Agentic auto-execution = trust/safety/72h risk.** → Demo **human-in-the-loop** (propose → one-tap approve); full autonomy is roadmap. Keeps the gate (72h-demoable) intact while showing the frontier.
3. **"Who pays for the rewards / is it sustainable?"** → the funding-cost-redirect + merchant-funded model above; rewards cost less than matching conventional rates.
4. **Gamification decay.** → Rewards attach to real deposits + SMarT commitment → structural stickiness beyond points.
5. **Live demo / OB / LLM failure.** → Deterministic seeded account; pre-warmed constrained prompts; Shariah copy from a fixed approved set (never free-generated).

## K. Score (100) — honest, with sensitivity
| Criterion | Wt | Score | Why | Skeptic floor |
|---|---|---|---|---|
| Innovation & creativity | 20 | **18** | Halal-attractiveness reframe + uncontested-vs-Ghina + agentic saver = novel, only-now. | 16 ("savings app") |
| Technical implementation | 20 | **18** | Agentic propose→execute + 3 models + game in 72h on seeded data. | 16 (agentic risk) |
| Data analysis | 20 | **18** | Capacity + uplift + projection models shown live; bank dashboard. | 16 |
| User experience (UX) | 15 | **14** | Arabic-first "calm gamification," bank-grade restraint. | 13 |
| Real-world feasibility | 25 | **24** | Feeds Alinma's CASA KPI (real numbers); Ghina precedent; conservative-halal; deposits=P&L. | 22 |
| **Total** | **100** | **92** | | **83 floor** |

**Honest read:** confident **88–92** band; **92** if the pitch lands the halal-attractiveness + uncontested-vs-Ghina insight in the first 30 seconds and the agentic demo fires cleanly; ~83 if judges read it as "a polished savings app." The whole game is framing Innovation correctly up front.

**Gates:** ✅ 72h-demoable (seeded, human-in-loop agent) · ✅ differentiated (uncontested halal reward economy + agent) · ✅ Shariah-compliant (hibah, no riba/maysir, no draw) · ✅ PDPL+consent+SAMA (licensed OB) · ✅ one track (Gamification) + ≥1 req.

## Changelog v1→v2
- Reframed problem from "low literacy" to the **structural halal-savings-attractiveness gap** (low Mudarabah rate + contested prize accounts).
- Added **ADIB Ghina** as the precise differentiation benchmark (shipped but contested; Namaa = uncontested).
- Made the AI **agentic** (capacity → next-best-nudge → propose/approve/execute).
- Grounded the business case in **Alinma's real 2024 CASA numbers** + a **who-funds-the-rewards** unit-economics answer.
- Re-scored 88→**92** with an explicit skeptic floor.

## Links
- [[research]] · [[raw-ideas]] · [[champion]] · [[concept-faheem]] · [[concept-misnad]] · [[concept-dayn]] · [[master-scoreboard]] · [[saudi-fintech-terrain]]
