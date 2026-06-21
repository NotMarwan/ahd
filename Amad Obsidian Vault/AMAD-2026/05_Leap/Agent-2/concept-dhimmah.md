---
title: "Concept — ذِمّة Dhimmah (clear your account before Hajj)"
tags: [agent/2, leap, status/champion, vector/invisible-saudis, track/genai, req/ai, req/data, req/cx, score/88]
updated: 2026-06-18
---

# 🕋 ذِمّة · Dhimmah — "Stand before God with a clear account."

> The *dhimmah* in Islamic law is the moral-legal account that holds your obligations and the rights others have over you. Before Hajj, a Muslim is meant to attain **بَراءة الذِّمّة** — to clear it: settle debts, return what is owed, discharge zakat. *"The believer's soul remains suspended by his debt until it is paid."* **No bank has ever built for this. Dhimmah does.**

**Segment (Invisible Saudis):** the ~20M/yr Hajj+Umrah pilgrims whose *financial preparation* no bank serves (the wallet is Nusuk's; the *conscience* is empty).
**Track:** 1 — Generative AI for FinTech · **Requirements:** /02 AI + /01 Data + /03 CX
**Score:** **88 / 100** · champion → [[champion]]

## A. One-liner
*An AI that, before you depart for Hajj, reads your accounts and gently interviews you to surface every debt and unreturned right you carry, then helps you settle each one and discharge your zakat, until your screen reads **ذمّتك بريئة** — your account is clear.*

## B. Problem (the unserved human truth)
Every year ~1.67M perform Hajj and ~18M perform Umrah. Before they go, observant Muslims carry a real, heavy obligation that is **not optional in the faith**: to **clear their debts and return the rights of others (radd al-mazālim)** so their *dhimmah* is clear before they stand at Arafah. The Prophet ﷺ tied the believer's very soul to unsettled debt. Yet people **forget, lose track, or never knew** what they owe: money borrowed from a brother years ago, a final wage never paid to a worker, lapsed zakat, a forgotten BNPL tail, a promise of money unkept. Today there is **nothing** that helps. Manual IOU apps are toy notepads. Nusuk gives them a wallet. The single most spiritually-loaded financial moment in a Saudi Muslim's life is **completely unserved.**

## C. Solution
A guided pre-Hajj journey, in Arabic, with one sacred output: **بَراءة الذِّمّة**.
1. **Discover (data).** With OB consent, Dhimmah scans the pilgrim's accounts for obligation-shaped signals: standing debts, recurring repayment patterns, a large inflow from a relative never reciprocated, remaining BNPL installments, balances that imply **lapsed zakat** vs the nisab.
2. **Interview (AI).** An ALLaM-style Arabic agent fills what data can't see — *"Did anyone lend you money you haven't returned? Is there a wage or promise still owed? Any trust (amānah) you're holding?"* — and assembles a **صحيفة الذِّمّة (ledger of obligations)**: each item with its evidence, the person/entity, the amount, and the ruling category (debt / returned-right / zakat).
3. **Settle (action).** One item at a time: pay a debt via **sarie**, compute and disburse **zakat** to a verified channel, or — when the right belongs to a person — draft a respectful message + transfer to **reach and make it right** (seeking their halal-ness/forgiveness). Each cleared item fills the **clearance bar**.
4. **The clearance.** When the ledger is settled, the screen turns to **«ذمّتك بريئة»** with a dua for an accepted Hajj. The pilgrim departs unburdened.
- **Only-possible-now/only-here:** OB (read obligations) + ALLaM (Arabic interview + rulings) + sarie/Nafath (settle + verify) + the Hajj trigger — all 2026 Saudi infrastructure. And **only an Islamic bank, in the land of Hajj, can credibly own *barā'at al-dhimmah*.** A conventional bank cannot.

## D. Mapping
- **Track (one):** 1 — Generative AI for FinTech (the agent that discovers, reconstructs, explains, and orchestrates).
- **Requirements:** **/02 AI** (the agentic interview + obligation classification) · **/01 Data** (OB obligation-discovery + zakat computation) · **/03 CX** (the most dignified, emotional pilgrim experience imaginable).

## E. 72h build plan
**Architecture:** Arabic RTL app → ALLaM-style agent (stubbed deterministic seam for the demo) for the interview + rulings → an **obligation-discovery engine** over synthetic pilgrim accounts (rules + patterns flag debts/zakat/BNPL/relative-inflows) → the **ledger** UI → a settlement orchestrator (sarie transfer stub + zakat compute + "reach the person" message draft) → the **ذمّتك بريئة** reveal.
**Built for real:** the obligation-discovery over OB data, the ledger assembly, the Arabic interview flow, zakat computation, the settle-one-by-one + clearance-bar, the reveal.
**Mocked (labeled):** live sarie settlement, real external-creditor delivery, real ALLaM (behind a clean seam), real Shariah-board ruling store (curated subset).
**Must-work feature:** connect → ledger assembles from data + a 3-question interview → settle each → screen reaches **«ذمّتك بريئة»**.
**Day cut-line:** D1 synthetic pilgrim accounts w/ planted obligations + discovery engine. D2 Arabic agent interview + ledger + settle flow + zakat. D3 the reveal, Arabic UX polish, offline fallback recording.
> 🛠️ **Working prototype built AND browser-verified (2026-06-18):** `prototypes/dhimmah-demo.html` (offline, single-file, Arabic RTL, deterministic). Runs the full flow — connect → scan → the **صحيفة الذِّمّة** assembles from data + a 3-question interview → settle each via sarie → the gold **«ذمّتك بريئة»** reveal — with a live engine panel (discovery log, zakat computation, براءة-الذمّة %). Verified end-to-end in Chrome (intro / ledger / 100%-clear reveal screenshotted; zero console errors). Evidence: `prototypes/dhimmah-demo-reveal.png`. This is the first prototype across all rounds verified in a real browser, not just authored.

## F. Data story (shown live)
- **Data:** Alinma OB sandbox + synthetic pilgrim profiles with planted obligations (a SAR loan from a brother never repaid; an unpaid final wage; lapsed zakat above nisab; a BNPL tail). A deterministic zakat computation from balances.
- **The insight on screen:** the ledger *builds itself* from the account data — "we found 4 things standing between you and a clear account" — each row with its evidence (the transaction that implies it) and amount; the clearance bar climbing from 0% to **ذمّتك بريئة** as each is settled. Depth beyond a chart: obligation classification (debt vs returned-right vs zakat) + zakat math + the settle ledger.

## G. Demo script (3 min) — the wow is emotional, not technical
1. **0:00 Hook.** "In three days, this man stands at Arafah. His faith says he cannot go with unsettled debts and unreturned rights. No bank has ever helped a Muslim do the one thing Hajj demands first. Watch." 
2. **0:30 Discover.** He connects his Alinma account. Dhimmah: *"Let's clear your account before you go."* The **صحيفة الذِّمّة** assembles live: SAR 6,000 his brother lent him in 2024, an unpaid final wage to a worker, lapsed zakat, a forgotten BNPL tail.
3. **1:30 Settle.** Tap by tap: repay the brother via sarie + a message seeking his halal-ness; compute + give zakat to a verified channel; settle the wage; close the BNPL. The clearance bar climbs.
4. **2:30 The clearance.** The screen turns: **«ذمّتك بريئة — تقبّل الله حجّك».** "He boards the plane unburdened. This is the moment only an Islamic bank could give him." 
5. **2:50 Close.** "Twenty million pilgrims a year. The wallet was taken. The soul was not. **Alinma owns بَراءة الذِّمّة.**"

## H. Alinma-ship case (incl. uncontested Shariah)
- **Why Alinma:** as a Shariah bank in the land of Hajj, Alinma can own a faith act that **no conventional or foreign bank can touch** — an uncopyable, brand-defining moat tied to the world's largest religious gathering. Deepens trust, deposits (zakat/settlement flows), and acquisition around the Hajj/Umrah funnel SNB only entered with a wallet.
- **Shariah — clean *and positive* by design:** it merely **moves the customer's own money to settle real obligations** (paying debts, returning rights, discharging zakat). **No riba, no Tawarruq, no lending, no chance/gharar.** It actively *serves* a core obligation (radd al-mazālim, zakat) → faith as the product, not a constraint. Zakat math + any ruling surfaced is **Shariah-board-validated; the AI never issues a fatwa.**
- **Compliance:** PDPL + explicit OB consent; sarie rails; SAMA-aligned; human-in-the-loop on rulings.

## I. Differentiation (incl. distinct from the kill-list)
- **vs toy IOU apps (Splitwise, "Who Owes Me"):** those are manual notepads with no bank data, no Islamic framing, no settlement, no reaching the rights-holder. Dhimmah **auto-discovers from real accounts, frames it as radd al-mazālim, and settles.**
- **vs Nusuk Wallet (SNB):** that's pilgrim *payments*. Dhimmah is the pilgrim's *conscience* — an entirely different category, in the white space Nusuk left empty.
- **vs the retired Rushd/Tayyib (kill-list):** Rushd purified *haram income* — a property of money's **source** (ḥaqq Allah, riba). Dhimmah settles *the rights of people* — ḥuqūq al-ʿibād (debts, owed wages, unkept promises, zakat) — a property of your **obligations to others**, triggered by the Hajj life-event, ending in بَراءة الذِّمّة. Different theology, trigger, and mechanic. **Not Rushd in disguise.**

## J. Risk register
1. **Can't force external settlement** (the brother, the worker). → Mitigate: Dhimmah *facilitates* (drafts the message, sends the transfer, records the intent + a reminder) — it clears what's clearable and honestly marks what needs the other party. It is "discover + settle + reach," not a guarantee.
2. **Data can't see every obligation.** → The AI interview is the explicit gap-filler; framed honestly as "we surface what we can find and help you remember the rest," not omniscience.
3. **Shariah accuracy (zakat, rulings).** → Curated, board-validated ruling set; human-in-the-loop; never an auto-fatwa.
4. **Demo failure / "is the wow real or am I moved by my own framing?"** → Offline deterministic fallback; and the emotional beat is grounded in a *real, universally-felt* Islamic obligation, not invented sentiment (see [[champion]] red-team).

## K. Score — **88 / 100**
| Criterion | Wt | Pts | Why |
|---|---|---|---|
| Innovation | 20 | **19** | Genuinely never-seen; a new category (financial conscience-clearing); uniquely Islamic + uniquely Saudi. Passes the "I've never seen this" test. |
| Technical | 20 | **16** | Obligation-discovery + agentic interview + settle orchestration buildable in 72h on sandbox + synthetic; ALLaM stubbed behind a seam. |
| Data | 20 | **17** | Real OB obligation-discovery + zakat computation, shown live as the ledger self-assembles. |
| UX | 15 | **14** | The most emotional pilgrim experience imaginable; Arabic-first; the «ذمّتك بريئة» reveal. |
| Feasibility | 25 | **22** | Only an Islamic bank can own it; Shariah-positive; runs on Alinma's OB sandbox + ALLaM + sarie. (−3: external-creditor reach is facilitated, not guaranteed.) |

**Gates:** ✅ 72h-demoable · ✅ passes the leap bar (surprise + category + emotion) · ✅ **Shariah-clean & positive by design** (no contested contract, no maysir/gharar) · ✅ not on the kill-list (distinct from Rushd) · ✅ PDPL/consent/SAMA · ✅ one track + 3 requirements.

→ red-team + why-it-leaps in [[champion]]. Siblings: [[concept-sawt]] · [[concept-wasiyyah]] · [[research]] · [[raw-ideas]].
