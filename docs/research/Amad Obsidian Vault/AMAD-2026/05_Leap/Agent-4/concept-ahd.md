---
title: "عهد Ahd — Witnessed Money (the primitive for money between people)"
tags: [agent/4, leap, concept, status/champion, vector/new-primitive, track/customer-experience, req/cx, req/ai, req/sustainability, score/85]
updated: 2026-06-18
---

# عهد · Ahd — "Write it, and it's kept."
**Track:** 2 Customer Experience (primary; alt: 5 Open Banking) · **Requirements:** /03 CX + /02 AI + /04 Sustainability (+ /01 via the netting graph)
**Score: 85 / 100** · **CHAMPION (the leap)**

## A. One-liner
*Ahd is the first money rail built for money **between people** — turn a loan to a friend, an IOU, or a promise into a fair, plain-Arabic agreement that Alinma witnesses, records as legal evidence, and settles automatically — exactly as the Quran's verse of debt (2:282) commands: "write it down."*

## B. Problem
The most common financial act on earth — **money between two people** — has no product. It runs on memory and trust, and it breaks both: **~31%** are owed money by a loved one, **1 in 6** say money has *ruined* a relationship, **~50% never write the loan down**, half set no repayment date, and **30% of borrowers never repay**. Banks treat it as out-of-scope; Splitwise just *counts* (no Arabic, no settlement); sarie moves money but records no *terms*. Yet a billion Muslims are scripturally instructed to **record and witness their debts** (Ayat al-Dayn, Quran 2:282 — the longest verse in the Quran) — and **no one has ever built the product for it.** The gap is a civilization-old command meeting a sector that ignored it.

## C. Solution
A new primitive: **a witnessed, auto-settling agreement layer for interpersonal money.** Two people open Ahd and create an *ahd* (covenant):
1. **Pick the kind:** قرض حسن (interest-free loan), a shared cost, a deferred payment, or a promise/gift.
2. **AI drafts fair terms in plain Arabic** (ALLaM): amount, schedule, and — critically — keeps it **qard-hassan-clean** (flags any drift toward interest or penalty; suggests fair, halal phrasing).
3. **Both confirm via Nafath** → a tamper-evident record that is **legally admissible** (Evidence Law 2022).
4. **Alinma auto-settles** the installments/conditions via sarie, sends gentle reminders, and on completion marks both parties' **ذمّة (dhimmah) cleared** — a quiet, dignified moment.
5. **مقاصّة Muqassa (debt-netting):** within a circle, tangled mutual debts net out automatically — "you→Ali→Sara→you" collapses, so a web of 8 IOUs settles in 2 transfers.

**Only-possible-now / only-here:** Nafath biometric e-sign + **Evidence Law 2022** admissibility + sarie auto-settlement + ALLaM Arabic drafting — all KSA-2026 — meeting a uniquely Islamic mandate. This could not have been built two years ago, and only makes cultural sense here first.

## D. Mapping
- **Track:** 2 Customer Experience (a wholly new consumer relationship with money). *Alt: 5 Open Banking — settlement/verification rails.*
- **Requirements:** **/03** (a frictionless, deeply personal experience) + **/02** (AI term-drafting + riba-clean check + netting) + **/04** (sustains social/financial trust — long-term inclusion of the cash economy) + **/01** (the netting/trust-graph analytics).

## E. 72h build plan
- **Stack:** Arabic-first/RTL web app; lightweight backend; ALLaM/watsonx seam for term drafting (stubbed deterministically for the demo); a hash-chained record store; a graph module for Muqassa netting; sarie + Nafath **mocked** behind clean seams.
- **Built for real:** the agreement-creation flow, the AI Arabic term draft + **riba/penalty checker**, two-party confirm, the tamper-evident record + verification, reminders, the **auto-settle** event, the "dhimmah cleared" state, and the **Muqassa netting algorithm** (real graph reduction, shown live).
- **Mocked/seeded:** Nafath confirm (mock biometric tap), sarie settlement (stub), legal e-filing. Deterministic demo personas.
- **Cut-line:** D1 agreement model + record + confirm flow. D2 AI drafting + riba-checker + auto-settle + dhimmah-cleared. D3 Muqassa netting viz + Arabic polish + fallback seed.
- **The one feature that MUST work:** create a qard-hassan agreement between two people → witnessed record → auto-settle an installment → both see "kept."

## F. Data story (shown live)
- **The Muqassa netting graph:** a 5-person circle with 8 tangled mutual debts → the algorithm collapses it to **2 settlements**; the graph visibly simplifies on screen. Real algorithm, real reduction — depth beyond a chart.
- **Trust capital (non-credit):** an aggregate "agreements kept" reputation per person (deliberately *not* a credit score — Ahd never underwrites). Plus an AI **fairness read** of proposed terms.

## G. Demo script (3 min)
1. **0:00 — The truth:** "The most common money move on earth is lending a friend. Half of us never write it down. One in six of us lose a friendship over it. The Quran told us 1,400 years ago: *write it down.* Nobody built it. We did."
2. **0:30:** Noura lends Sara **SAR 5,000** (qard hassan). Pick "قرض حسن" → **ALLaM drafts fair, interest-free Arabic terms** → both **confirm via Nafath** → a witnessed record is issued (admissible evidence).
3. **1:25:** Time-skip → Ahd **auto-reminds + auto-settles** an installment via sarie → both see **"ذمّة محفوظة"** (the obligation kept). Quiet, dignified.
4. **2:05 — the wow:** a 5-friend circle of tangled IOUs → tap **Muqassa** → the debt graph collapses 8 transfers into 2. "The whole circle, settled, fairly, in one tap."
5. **2:45 — close:** "Money between people — finally clear, fair, and kept. Alinma becomes the trusted **witness** of every Saudi's word. Only an Islamic bank could own this."

## H. Bank-ship case (Alinma)
- **Float / deposits:** amounts in-flight (held for settlement) = low-cost balances.
- **Acquisition (viral by construction):** every agreement *requires a second person* → each user invites the next; non-customers join via guest Nafath e-sign, then convert.
- **Engagement:** universal + daily — everyone has money owed to/from someone.
- **Brand moat:** Alinma = "the trusted witness of money between people," a category **only an Islamic bank can credibly own** (Ayat al-Dayn, amana, qard hassan).
- **Shariah (uncontested superpower):** the product *is* the sunnah of documentation; **qard hassan** (no riba, no penalty); bank acts as **amana/wakala** trustee for a flat fee or free — **no Tawarruq, no maysir, no gharar.**
- **Compliance:** explicit two-party consent (PDPL); records admissible under **Evidence Law 2022**; rides licensed sarie/OB rails; disputes escalate to existing MoJ/Taradhi (Ahd records, it doesn't adjudicate).

## I. Differentiation (incl. distinct from the kill-list)
- vs **Splitwise/Tricount:** they *track* (no Arabic, no settlement, no witness, no enforcement). Ahd *records, witnesses, and settles*.
- vs **Najiz/MoJ:** notarizes POAs/property — **not** ordinary interpersonal money. Ahd is the money-native witness.
- vs **sarie:** raw, irreversible, unconditional. Ahd adds terms, record, and conditional auto-settlement.
- vs **qard-hassan fintech:** those are institution→person loans. Ahd is **P2P record+witness+settle** (the bank lends nothing).
- **Not on the kill-list:** not Tadfuq (no underwriting/lending), not Haseen (not fraud detection), not Rushd (not a halal-score), not Namaa (not savings). A genuinely new primitive.

## J. Risk register
1. **"Is the bank legally a witness/enforcer?"** → It's a **record-keeper + settlement agent (wakala)**; the e-record is admissible evidence (Evidence Law 2022); Ahd does **not** adjudicate disputes — it escalates to MoJ/Taradhi. Frame precisely in the pitch.
2. **Both-party requirement (cold start).** → Viral invite; guest Nafath e-sign for non-customers; the lender alone can issue and the borrower accepts.
3. **"Recording a friend-loan feels cold."** → Framing flips it: recording *protects* the relationship (the data proves trust survives when terms are clear); gentle, optional, faith-rooted tone.
4. **Demo dependence on Nafath/sarie.** → Both mocked behind seams; deterministic seeded personas; never a live call on stage.

## K. Score — 85/100 (honest)
| Criterion | Wt | Score | Why |
|---|---|---|---|
| Innovation & creativity | 20 | **18** | A new category framed on Ayat al-Dayn — passes the "I've never seen this" test; uncontested + emotional. |
| Technical implementation | 20 | **16** | Two-party flow + AI drafting + tamper-evident record + Muqassa netting buildable in 72h on mocked rails. |
| Data analysis | 20 | **15** | The netting graph + trust-capital + fairness read; genuine but lighter than an ML-heavy concept (the soft spot). |
| User experience (UX) | 15 | **14** | Arabic-first, emotionally resonant; the "dhimmah cleared" moment; restraint over flash. |
| Real-world feasibility | 25 | **22** | Rides Nafath/Evidence-Law/sarie; float + viral acquisition + brand moat; only-Islamic-bank fit. Legal-role framing is the watch-item. |
| **Total** | **100** | **85** | |

**Gates:** ✅ 72h-demoable · ✅ **leap (surprise + category + emotion)** · ✅ **Shariah-clean by design** (qard hassan/amana/wakala; no Tawarruq/maysir/gharar) · ✅ not on the kill-list · ✅ PDPL/consent + Evidence-Law + SAMA rails · ✅ one track + ≥1 requirement.

## Links
- [[research]] (leap) · [[raw-ideas]] (leap) · [[champion]] (leap) · [[concept-amana]] · [[concept-takatuf]] · [[wildcard]] · [[master-scoreboard]]
