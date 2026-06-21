---
title: "Gauntlet Concept — سَنَد Sanad (your circle is your collateral)"
tags: [gauntlet, concept/sanad, arena/social-fabric, sealed, agent/2, track/open-banking, score/88]
updated: 2026-06-18
---

# 🤝 سَنَد · Sanad — "Trust, made into access."

*Sanad (سَنَد) = the one who backs/supports you ("أنت سندي"). The product turns the people who believe in you into collateral the bank can act on.*

## 1. One-liner
**Sanad turns your social capital into financial access: your circle collectively *guarantees* one specific commitment (a rental deposit, a tuition installment, a work-tool) via Islamic kafāla — so the credit-invisible get the chance, the bank lends nothing, and no one pays a riyal unless things actually go wrong.**

## 2. The category
**The distributed social guarantee (kafāla) as a consumer primitive** — trust-as-access without debt. Not a loan (the bank lends nothing), not a savings pool, not escrow. "I have never seen your uncle and two friends co-sign your first apartment with a tap, with zero money moving and zero riba."

## 3. Problem & proof
- **~4–6.9M Saudis are credit-invisible** (no SIMAH file): young people, freelancers, students, newcomers. They are locked out of the deposits that gate adult life — a **rental deposit**, a **delivery-job vehicle/phone**, a **tuition installment**.
- They have **social capital** (family/friends who genuinely trust them) but **no financial capital** — and trust isn't bankable today.
- The classical Islamic answer to "no collateral" is **kafāla / ḍamān** (a third party guarantees the obligation) — **uncontested fiqh** — but it lives in paper favors and personal embarrassment, never as a product.
- **Why now:** Nafath verifies guarantors; OB reads the requester's real cashflow (responsible sizing); sarie executes a fair draw only on default; **Evidence Law 2022** makes a distributed digital kafāla enforceable.
- *Sources:* SIMAH credit-invisibility + unbanked figures; rental-deposit & gig-onboarding friction; kafāla/ḍamān in classical fiqh.

## 4. Solution & mechanics
1. **State the need** — a defined commitment (e.g., SAR 6,000 rental deposit; a 4-month tuition plan; a delivery-vehicle deposit).
2. **Invite your circle** — each backer pledges a **portion** of the guarantee (e.g., 3 people × SAR 2,000) and confirms via **Nafath**. The bank holds the **distributed kafāla**.
3. **Responsible sizing (OB)** — Sanad reads the requester's cashflow to confirm they can realistically *fulfill* (the anti-predatory safeguard — you cannot guarantee someone into a commitment they can't carry).
4. **Access unlocked — no money moves.** The deposit is released to the landlord / the plan approved, backed by the social guarantee, not a loan.
5. **Two paths:** **fulfil** → the guarantee dissolves, *no one paid anything*, and the requester earns a **real, portable financial track record** (graduating to mainstream access). **Default** → a **fair draw** collects each guarantor's *exact pledged portion* via sarie (never joint-and-several).
- **Core loop:** need → distributed kafāla → access → fulfil (track record) / fair-draw (on default).
- **Only-possible-in-2026:** distributed digital kafāla on Nafath + OB capacity + sarie draw + Evidence-Law enforceability.

## 5. Architecture (modules → one spine)
ONE primitive ("your circle is your collateral") with four modules, each closing a hole:
- **Kafāla Ledger** (closes: enforceability) — who backs what portion; Nafath-confirmed; Evidence-Law admissible.
- **Capacity Check (OB)** (closes: predatory/over-exposure) — responsible sizing of what can be guaranteed.
- **Track-Record Builder** (closes: "then what?") — each fulfilled commitment → portable creditworthiness → graduation.
- **Fair-Draw** (closes: guarantor fear) — on default, each pays only their portion, never the whole.
Hero flow: a credit-invisible youth unlocks a rental deposit via 3 backers → fulfils → a financial identity is born.

## 6. Track + requirements
**Track 5 — Open Banking** (the OB capacity-check + the cashflow-built portable track record are the data spine). **/01 Data** (capacity + track record) + **/02 AI** (responsible sizing) + **/03 CX** (the access experience).

## 7. 72h build plan
**Stack:** Arabic RTL web app; backend; Nafath + sarie + landlord/merchant mocked behind seams; OB capacity on synthetic cashflow.
- **Built for real:** the **Kafāla Ledger** (distributed portions, confirm flow), the **OB Capacity Check + responsible sizing**, the **Track-Record Builder**, the **Fair-Draw** computation (proportional, capped).
- **Mocked (labeled):** Nafath confirm, sarie draw, landlord/merchant + SIMAH write.
- **The one feature that must work:** requester invites 3 backers → each backs a portion → guarantee assembled + access unlocked (no money moved) → fulfil path shows a track record emerging; default path shows the fair proportional draw.
- **Day cut-line:** D1 request + backers + Kafāla Ledger. D2 OB capacity-check + access-unlock + Track-Record. D3 Fair-Draw + Arabic polish + **offline deterministic fallback**.

## 8. Data story (shown live)
The **OB capacity-check** (can this person realistically fulfil? → responsible sizing — the safeguard), the distributed-guarantee composition, and the **track record graduating** the requester from invisible to creditworthy. Live: a credit-invisible profile → 3 backers → an OB-validated responsible limit → fulfilled → a real score appears where there was none.

## 9. UX
Arabic-first. Emotional spine: **belonging + dignity + opportunity without debt-shame** — "the people who love you have your back, on the record." Wow: a young man with no SIMAH score gets his first apartment, backed by his uncle and two friends; six months later he has a financial identity — and **no one ever paid a riyal.**

## 10. 3-minute demo script
1. **0:00** — "Millions of Saudis have no credit file. They have people who believe in them. But trust isn't bankable. Until now." 
2. **0:30** — Faisal, freelancer, no SIMAH, needs a SAR 6,000 rental deposit.
3. **1:00** — He invites his uncle + 2 friends; each backs SAR 2,000 (Nafath confirm); the bank holds the **distributed kafāla**; OB confirms Faisal can carry the rent (responsible sizing).
4. **1:50** — Deposit unlocked. **No one paid anything.** Time-skip: 6 months of on-time rent → a real **financial track record** is born; the guarantee dissolves.
5. **2:35** — Close: "Trust, made into access. No riba, no one out of pocket, no contested contract. **كفالة, reborn as a product.**" **Fallback:** deterministic, offline.

## 11. Business / Alinma-ship case
- **A new acquisition + graduation funnel:** the credit-invisible become banked, tracked, and **graduate into mainstream Alinma products** — the future deposit/finance book, reached via *social guarantee* instead of a contested contract.
- **Guarantors are/become customers**; the whole circle is captured.
- **Low risk:** distributed + OB-capacity-sized + fair-draw; on-strategy with Vision-2030 financial inclusion.
- **Revenue:** graduation to mainstream products + deposit growth (no fee on the kafāla — see Shariah).

## 12. Shariah
**Kafāla / ḍamān (guarantee) is classical, uncontested fiqh.** **No riba** (the guarantee bears no interest; on default a guarantor pays exactly the principal portion, nothing more). **No gharar** (defined amount, defined commitment, defined trigger). **No maysir.** Critically, to sidestep the scholarly debate on *charging a fee for kafāla*, **the bank takes NO fee on the guarantee** — it monetizes via graduation + deposits. Distinct from the retired Tadfuq: **no lending, no Tawarruq, no underwriting-to-a-loan** — a distributed guarantee where money moves only on default.

## 13. ⭐ OBJECTION-KILLER TABLE (the centerpiece)
| # | Vector | Worst credible attack | Sealed answer (built into the design) |
|---|---|---|---|
| 1 | Innovation | "Guarantors/co-signers exist." | A **distributed, digital, portion-based kafāla that builds a graduation track record** is new; classical co-signing is one person on paper. Category, not feature. |
| 2 | Technical | "Hard part hand-waved." | Kafāla Ledger + Fair-Draw + OB capacity are **real deterministic computation**, built in 72h; rails honestly mocked. |
| 3 | Data | "Thin." | OB capacity-sizing + a **portable cashflow track record** = genuine, defensible analytics (the responsible-access engine). |
| 4 | UX | "Clunky / shameful." | Framed as **belonging, not begging**: your circle backs you; no money moves; you graduate to independence. |
| 5 | Feasibility | "Would a bank ship it?" | It is an **inclusion acquisition + graduation funnel** into the mainstream book, at low (distributed, sized) risk. Vision-2030 on-strategy. |
| 6 | Shariah | "Kafāla-for-a-fee is contested." | **No fee on the guarantee** → the debate is sidestepped entirely; kafāla itself is uncontested; no riba/gharar/maysir. |
| 7 | Moat | "Copyable?" | Only a **bank** can hold + enforce (Evidence Law) a distributed guarantee, run the OB capacity-check, and **write the track record that graduates the user** — an app cannot. |
| 8 | Demo | "Wow is framing." | The **"no money moved + a score is born"** reveal is a built, visceral wow on real computation. |
| 9 | Adoption / cold-start | "Two-sided?" | **One-sided motivation:** the requester has an acute need and drives it; backers are their loving circle (warm). Beats Ahd's symmetric cold ask. |
| 10 | So-what | "Nice-to-have?" | Housing / work / education access for the credit-invisible is **life-changing + urgent** — the opposite of discretionary. |
| — | vs kill-list | "It's Tadfuq/lending renamed." | **No.** The bank lends nothing; this is **kafāla** (guarantee), money moves only on default, drawn from guarantors — different mechanism *and* different (uncontested) Shariah structure. |
| — | Predatory risk | "You'll pressure people to back / over-expose them." | OB **capacity-check** + **fair-draw (portion-only)** + explicit consent + per-backer caps + cooling-off. |

## 14. Risk register
- **Guarantor over-exposure:** fair-draw (portion-only, never joint-and-several) + per-backer caps + capacity-check.
- **Requester default:** distributed across the circle + OB-sized responsibly; bank exposure minimal.
- **Social pressure to back:** consent + cooling-off + caps; backing is opt-in and private.
- **Legal enforceability of distributed kafāla:** Nafath-confirmed + Evidence Law 2022; demo mocks, production cites precedent.
- **Demo dependence:** deterministic seeded circle + offline fallback.

## 15. Score & comparison
**88/100** (Innovation 18 · Technical 16 · Data 17 · UX 15 · Feasibility 22).
**Beats Ahd (and the retired Tadfuq) in this space:** Ahd records a *loan that already exists* (cold, two-sided, low-stakes); Sanad **unlocks access that doesn't exist yet** via the warm, one-sided-motivated social guarantee — higher stakes, real inclusion, and a structural bank-only moat (hold + enforce + graduate). It delivers Tadfuq's inclusion dream **without** Tawarruq or solo underwriting.

Sibling concept (different direction — money DOWN to dependents, vs trust TO a person): [[concept-kanaf|كَنَف Kanaf]]. Teardown: [[teardown]]. Attacks: [[attacks]].
