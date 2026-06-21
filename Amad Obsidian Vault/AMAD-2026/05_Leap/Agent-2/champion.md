---
title: "Leap Champion — ذِمّة Dhimmah (red-teamed)"
tags: [agent/2, leap, status/champion, vector/invisible-saudis, score/88]
updated: 2026-06-18
---

# 👑 Leap Champion — [[concept-dhimmah|ذِمّة Dhimmah]] · 88/100

> *Before Hajj, an AI clears the one thing the faith demands first — your debts and the rights you owe others — until your screen reads **«ذمّتك بريئة».** The wallet was taken (Nusuk/SNB). The conscience was not.*

## Why it's a LEAP, not an iteration (one paragraph)
Every Round-1 concept competed on a known fintech axis (credit, fraud, savings, a halal score). Dhimmah is **not on a fintech axis at all** — it is the first product to serve a **spiritual-financial obligation**: *barā'at al-dhimmah*, the clearing of debts and returned rights that Islam requires before Hajj. It passes the leap tests: **"I've never seen this"** (no bank, anywhere, has built it); **emotional truth** (it touches the readiness to stand before God — relief, not utility); **only-here** (only an Islamic bank in the land of Hajj can credibly own it); **inevitability** ("why has no bank ever helped me clear my debts before Hajj?"). It rides the largest uniquely-Saudi event on earth, into the white space a rival left empty.

## 🔴 Red team — attack before crowning

**Per-criterion "why might judges score this LOW?"**
1. **Innovation —** *"It's Splitwise with a religious skin."* → No: a manual IOU notepad has no bank-data discovery, no radd-al-mazālim framing, no settlement, no zakat, no Hajj trigger, and isn't owned by the Islamic bank that can stand behind the rulings. The *category* is financial conscience-clearing, not debt tracking. **Fix:** in the pitch, lead with the live *discovery from real account patterns* + the *settlement actions*, never with a list.
2. **Technical —** *"Inferring 'I borrowed from my brother' from transactions is unreliable."* → Honest and true. **Disclosed + fixed:** data surfaces *candidates*; the **AI interview is the real engine** (it asks what data can't see). Framed as "discover + help you remember + settle," not omniscient inference. The settlement side (sarie repay, zakat compute+disburse, close BNPL) is concrete and real.
3. **Data —** *"It's synthetic."* → Shared with the whole field in a 72h hack; the obligation-classification + zakat math are real *methods*, shown live. Production reads first-party Alinma + OB data.
4. **UX —** *"It risks feeling preachy or manipulative."* → The single biggest design risk. **Fix:** restraint and control — the user decides every action; tone is *a respectful servant helping you fulfil your own intention*, never a judge of piety; no guilt mechanics. The «ذمّتك بريئة» reveal is quiet, not triumphant.
5. **Feasibility —** *"You can't guarantee the brother gets repaid — is this a bank product or a gesture?"* → The **bank-shippable core is fully real**: settling debts you owe (sarie), computing + disbursing zakat, closing a BNPL tail are all account actions Alinma can do today. The "reach a person" step is honest *facilitation* (draft + transfer + reminder). The strategic prize — owning the Hajj *conscience* funnel of ~20M pilgrims/yr — is real and uncopyable.

**"Is the wow real, or am I moved by my own framing?"** — The obligation is **real and universally felt** by observant Muslims (it's in the fiqh of Hajj, not invented). The risk is execution: if the live discovery is weak, it collapses into "a tracker with a religious quote." So the wow is *conditional on* a convincing discovery + a landed «ذمّتك بريئة» reveal. That is exactly where the 72h must be spent.

**"Most likely reason it loses."** A judge mentally files it as "Splitwise + religion," or the auto-discovery underwhelms. → Pre-empt in the first 30s: real bank-pattern discovery + the interview + actual settlements + the Islamic-bank-only moat.

**"What breaks in the live demo + fallback."** Discovery looks fake or the AI interview is flaky on stage. → A **deterministic seeded pilgrim + fully offline fallback recording**; ALLaM behind a stub seam; never depend on a live model at hour 70.

**Verdict:** survives. The fixes (lead-with-discovery, restraint in tone, honest facilitation framing, offline fallback) are all inside 72h scope. **Crowned.**

## De-confliction (Leap round — checked against all agents' `05_Leap/` champions, 2026-06-18)
- **vs Agent 3 (Faith-Positive) champion [[concept-athar|أثر Athar]]** (personal perpetual waqf): distinct — Athar = *giving forever* (ḥaqq Allah, endowment); Dhimmah = *settling what you owe people* (ḥuqūq al-ʿibād), Hajj-triggered. Agent 3 **explicitly ceded the pilgrim lane to me** ("A2 leads pilgrims"). ✅
- **Wasiyyah collision resolved:** Agent 3 has a stronger, integrated Wasiyyah (connected + Nafath-notarized + pairs with Athar). I **retired my Wasiyyah finalist and ceded it to A3**, diverging to [[concept-karama|Karama]] (domestic workers — a segment no other agent touches). ✅
- **vs Agent 4 (New Primitive) champion [[concept-ahd|عهد Ahd]]** (witnessed P2P "money between people," uses "ذمّة cleared" as its completion microcopy): thematically *adjacent* but genuinely distinct, and **complementary**. **Ahd = a forward rail to create + witness + auto-settle NEW interpersonal agreements** (two living app users, qard hassan, Muqassa netting). **Dhimmah = a backward, Hajj-triggered discovery + closure of your OWN scattered EXISTING obligations** (debts you forgot, lapsed zakat, unreturned mazālim) culminating in بَراءة الذِّمّة before you fly. Different trigger (Hajj life-event vs a new loan), direction (discover existing vs create new), and scope (incl. zakat + one-directional rights with no counterparty-app). They could even chain: Ahd records new debts; Dhimmah clears old ones. I will note this to A4. ✅
- **vs Agent 1 (Agentic Money — Wakeel/Majlis/Tawkeel):** unrelated (delegation/agency rail). ✅
- Distinct from the kill-list: **not Rushd** (Rushd = purify haram *income*/ḥaqq Allah; Dhimmah = settle people's *rights*/ḥuqūq al-ʿibād, Hajj-triggered) — see [[concept-dhimmah]] §I.

## Open questions to validate at enrichment (5–16 Jul)
- **Shariah board:** the radd-al-mazālim framing, the zakat computation, and "facilitate reaching a creditor" wording — get it blessed; confirm we never imply a fatwa.
- **Data (13 Jul):** what obligation signals are realistically derivable from Alinma/OB data vs must come from the interview? Lock the honest split.
- **Hajj Ministry / Nusuk:** is there an integration path (the conscience layer *complementing* the Nusuk wallet rather than competing)?
- **12 Jul AI-UX:** validate the Arabic tone reads as *service*, never judgment.

Siblings: [[concept-sawt]] · [[concept-wasiyyah]] · board: [[master-scoreboard]] · [[research]] · [[raw-ideas]] · [[wildcard]].
