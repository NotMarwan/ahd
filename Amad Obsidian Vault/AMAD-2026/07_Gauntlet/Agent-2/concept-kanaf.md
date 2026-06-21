---
title: "Gauntlet Concept — كَنَف Kanaf (the family-care treasury)"
tags: [gauntlet, concept/kanaf, arena/social-fabric, sealed, agent/2, track/cx, score/89]
updated: 2026-06-18
---

# 🏠 كَنَف · Kanaf — "Care for them, together, fairly, with dignity."

*Kanaf (كَنَف) = the shelter/embrace of care — "نشأ في كنف والديه." The product is the digital embrace in which a family shelters its own.*

## 1. One-liner
**Kanaf lets a family care for an aging parent (or any dependent) together: each child's fair share is clear, the money is collected and disbursed automatically, the parent receives with total dignity, and the bank is the neutral steward that ends the awkwardness of "who paid this month."**

## 2. The category
**Collective family provision** — multi-contributor, single-beneficiary care with fair-share governance + a dignity layer. Not a joint account (blunt, trust-fraught, no accountability), not remittance, not an allowance app. "I have never seen a bank help siblings split caring for their mother fairly, without anyone feeling shamed or burdened."

## 3. Problem & proof
- Caring for parents is a **religious obligation + cultural cornerstone** in Saudi (**نفقة الوالدين** = the duty of maintenance; **بِرّ الوالدين** = a supreme virtue). It is not optional and not occasional — it is monthly, lifelong.
- Today it runs on **informal, uneven, awkward** coordination: one child (often the eldest or the nearest) silently carries more; "did Khalid send his share?" is a recurring family friction; money is handed as cash; and the **parent's dignity is eroded** (feeling like a tracked burden).
- Saudi Arabia is **aging fast** — the dependency ratio rises through the 2030s (Vision 2030 social-development data); the multi-sibling eldercare-coordination problem is about to scale sharply.
- **Why now:** Nafath verifies the family graph; OB sees each contributor's standing orders; sarie moves fair shares instantly; ALLaM handles the delicate Arabic coordination ("nudge Khalid gently?") that humans avoid.
- *Sources to cite:* Saudi family-support norms + بِرّ الوالدين centrality; Vision-2030 ageing/social-development projections; the absence of any fair-share family-provision product in KSA.

## 4. Solution & mechanics
A family opens a **Kanaf circle** for a beneficiary; members are Nafath-verified family.
1. **Set the need** — a monthly amount, or itemized (rent, medicine, a domestic helper, utilities).
2. **Fair-Share Engine** — shares computed *fairly*: equal, or **capacity-weighted** (via OB-visible income), or family-agreed; **transparent to all members** (who paid, who's pending — privately, gently). No silent carrying, no invisible free-riding.
3. **Auto-collect** — each member's share via sarie standing order into the care pool.
4. **Dignity Layer** — the parent simply *receives*: a funded Mada card or direct disbursement; their screen says **«عائلتك معك»** — no numbers, no monitoring, no sense of being managed.
5. **Coordinate gently** — ALLaM nudges late shares privately, proposes a fair rebalance if someone genuinely can't pay this month, and keeps an **append-only Care Ledger**.
- **Core loop:** set need → fair shares → auto-collect → provide with dignity → transparent ledger → recurring.
- **Only-possible-in-2026:** Nafath family-verification + OB capacity signal + sarie standing shares + ALLaM Arabic coordination, fused into one warm flow.

## 5. Architecture (modules → one spine)
ONE product ("the family that shelters its own") with four modules, each closing a hole:
- **Fair-Share Engine** (closes: unevenness/awkwardness) — compute + track shares.
- **Dignity Layer** (closes: the parent feeling managed) — recipient receives normally, shielded from mechanics.
- **Coordination Assistant** (closes: the awkward conversations) — ALLaM nudges + rebalance proposals.
- **Care Ledger** (closes: "did he pay?") — transparent, append-only, shame-free.
Hero demo = ONE flow: set up → a sibling falls behind → fair rebalance → parent receives with dignity.

## 6. Track + requirements
**Track 2 — Customer Experience** (the win-case is the family experience). **/03 CX** + **/01 Data** (fair-share + timeliness + coverage analytics) + **/02 AI** (the coordination assistant).

## 7. 72h build plan
**Stack:** Arabic RTL web app; light backend; sarie + Nafath + OB mocked behind clean seams; ALLaM coordination stubbed deterministically.
- **Built for real:** the Fair-Share Engine (equal / capacity-weighted / custom — real math), the Care Ledger, the parent **Dignity Layer** view, the **behind-share → fair-rebalance** flow, contribution metrics.
- **Mocked (labeled):** Nafath family-link, sarie settlement, live OB income.
- **The one feature that must work:** set a care need → fair shares computed + shown across N siblings → one pays → ledger + parent balance update → a behind-share gently flagged + fairly covered.
- **Day cut-line:** D1 circle + members + Fair-Share Engine. D2 sarie-collect + Care Ledger + parent Dignity view. D3 Coordination Assistant + rebalance + Arabic polish + **offline deterministic fallback**.

## 8. Data story (shown live)
The fair-share computation (capacity-weighted vs equal, side by side), contribution-timeliness, and the **parent's "care coverage"** (needs met vs gap). Live: the share split across 3 siblings; a gap opens when one is behind; a fair rebalance closes it. Real computation, not heuristic inference.

## 9. UX
Arabic-first, calm, warm. The emotional spine: **dignity for the parent + fairness among siblings + the end of awkwardness.** Wow moment: two screens side by side — the **siblings** see a fair, transparent, drama-free ledger; the **parent** sees only **«عائلتك معك»**. Same money, opposite emotional design.

## 10. 3-minute demo script
1. **0:00** — "Every Saudi family cares for its parents. Unevenly. Awkwardly. In cash. Watch a family do it fairly, together, with dignity." 
2. **0:30** — Create Kanaf for *the mother*; 3 siblings; monthly need SAR 4,500; **fair shares computed** (capacity-weighted: the one earning more carries more, by agreement).
3. **1:15** — Auto-collect; Care Ledger fills; the mother's card is funded; her screen: **«عائلتك معك»** (no numbers, no shame).
4. **2:00** — Khalid falls behind; Kanaf flags it **privately + gently**, proposes a fair temporary rebalance the others accept in a tap. No drama, no confrontation.
5. **2:40** — Close: "بِرّ الوالدين, made effortless and even. Alinma becomes the trusted steward of the Saudi family." **Fallback:** deterministic seeded family, fully offline.

## 11. Business / Alinma-ship case
- **The stickiest relationship in banking:** Kanaf captures the **entire family graph across three generations** (the parent + every sibling + their dependents) — multi-account acquisition + retention that a competitor cannot easily unwind.
- **Recurring deposit flows** (the care pool) = stable balances.
- **Cross-sell** across the family graph; a future **care-services marketplace** (pharmacy, home-care, helper payroll) is a natural extension.
- **On-strategy:** Alinma as *the family's Islamic bank*. Ships next quarter on existing rails.

## 12. Shariah
**Uncontested + positive.** **نفقة** (maintenance of parents/dependents) is an obligation; **بِرّ الوالدين** a supreme virtue. Kanaf only **coordinates and disburses the family's own money** fairly. **No riba, no lending, no contract, no maysir/gharar.** ALLaM **coordinates, never rules** — the "fair share" is set by family agreement, not a fatwa.

## 13. ⭐ OBJECTION-KILLER TABLE (the centerpiece)
| # | Vector | Worst credible attack | Sealed answer (built into the design) |
|---|---|---|---|
| 1 | Innovation | "A shared family pot isn't new." | The novelty is the **fair-share governance + dignity layer + shame-free transparency** for a single beneficiary — no product does eldercare *fairly among siblings*. Category, not feature. |
| 2 | Technical | "It's just transfers." | The **Fair-Share Engine** (capacity-weighting + rebalance) is real deterministic computation, fully built in 72h; rails honestly mocked. |
| 3 | Data | "Thin." | Capacity-weighted shares + timeliness + parent **coverage gap** = genuine live analytics, not a single chart. |
| 4 | UX | "Monitoring a parent's money is undignified." | The **Dignity Layer** is the answer: the parent only *receives* («عائلتك معك»), shielded from all mechanics; mechanics live on the siblings' side. |
| 5 | Feasibility | "Would a bank ship it?" | It captures the **3-generation family graph + recurring deposits** — the highest-LTV relationship in retail banking. Obvious yes. |
| 6 | Shariah | "Any issue?" | نفقة + بِرّ = **positive**; it moves the family's own money. No riba/lending/chance. AI never rules. |
| 7 | Moat | "Copyable / why not a joint account?" | A joint account has no fair-share, no accountability, no dignity layer; and the **family-graph lock-in** is structurally bank-only + sticky. |
| 8 | Demo | "Wow is framing." | The **two-screens reveal** (transparent siblings vs dignified parent) + the live fair-rebalance is a built, visceral wow. |
| 9 | Adoption / cold-start | "Two-sided?" | **The family already exists as a coordinating unit.** The one child carrying it alone invites the siblings they *already* coordinate with → pull, not push. Warm, not cold. Sealed (the exact hole Ahd failed). |
| 10 | So-what | "Nice-to-have?" | Caring for parents is **universal, monthly, lifelong, religiously mandated** — the opposite of discretionary. |

## 14. Risk register
- **Family conflict (a sibling refuses):** Kanaf surfaces gently + lets others fairly cover; it **never adjudicates** a family dispute (explicit boundary). 
- **Privacy among siblings:** per-member visibility is configurable; the parent is always shielded.
- **Nafath family-link verification:** mocked for demo; cite Nafath's verified-relationship capability for production.
- **Demo dependence:** deterministic seeded family + offline fallback.

## 15. Score & comparison
**89/100** (Innovation 18 · Technical 17 · Data 17 · UX 15 · Feasibility 22).
**Beats Ahd (the concept I critiqued in this space):** Ahd dies on cold-start (formalizing a friend-loan feels distrustful) and "so-what" (rare per person). Kanaf is **warm, multi-party-by-nature, monthly, and religiously mandated**, and it captures the entire family graph — a far deeper moat than a witnessed IOU. Every vector Ahd left open, Kanaf seals.

Sibling concept (different direction): [[concept-sanad|سَنَد Sanad]]. Teardown: [[teardown]]. Attacks: [[attacks]].
