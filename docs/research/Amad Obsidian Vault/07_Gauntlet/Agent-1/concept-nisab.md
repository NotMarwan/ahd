---
title: "نِصاب Nisab — the zakat engine that never sleeps"
tags: [gauntlet, agent/1, arena/worship, concept/nisab, sealed, track/open-banking, req/data, req/ai]
updated: 2026-06-18
---

# 🟢 نِصاب · Nisab — the living zakat engine
**Arena:** Worship & the Hereafter · **Track:** 5 Open Banking · **Requirements:** /01 Data + /02 AI + /04 Sustainability · **Self-score 89/100 (sealed)**

## 1. One-liner
**Nisab is the first zakat engine that never sleeps — it connects to all your wealth, watches each asset cross the nisab and complete its hawl, computes your zakat to the riyal by the Hanbali method, and discharges it to a verified channel the day it falls due. The pillar, fulfilled exactly, automatically, every year.**

## 2. The category
**"Zakat that runs itself."** Not a calculator you fill in once a year and hope — a *connected, continuous, self-computing, self-discharging* fulfillment of the third pillar. The honest "I've never seen this": every existing tool is a static form; none *knows* your zakatable wealth or acts on the right day.

## 3. Problem & proof
- **Zakat is fard** on every Muslim whose wealth exceeds nisab for a lunar year — and **computing it correctly is genuinely hard**: which assets count, the nisab (≈ **SAR 50,826** gold-standard, KSA/Hanbali; ≈ SAR 6,743 silver), per-asset **hawl** (Hijri), 2.5%, which debts deduct, which gold is exempt (worn jewelry, Hanbali) vs zakatable (stored/investment). [nisab/hawl](https://islamcalculator.com/zakat-calculator/saudi-arabia/) · [zakatable assets](https://blog.matwproject.org/zakat-on-savings-gold-investments-2026/)
- **Every existing tool is a static, manual, one-shot calculator** — ZATCA's **ZAKATY**, Al Rajhi/SNB in-app calculators, dozens of web calculators. You type your assets once a year and guess; nobody tracks hawl, connects to your wealth, or discharges. [ZAKATY](https://my.gov.sa/en/services/272192) · [ZATCA calc](https://zatca.gov.sa/en/eServices/Pages/eServices_306.aspx)
- **Result:** people under-pay (miss assets), over-pay (zakat worn jewelry, forget to deduct debts), miss their hawl date, or skip it in confusion. A pillar, done wrong or not at all.
- **Why now:** licensed **Open Banking (AIS)** exposes cash, savings, investment and **gold-investment** account balances → the zakat base can be computed *continuously*; ALLaM gives Arabic guidance; sarie + verified channels discharge it. The pieces only exist together in 2026.

## 4. Solution & mechanics
1. **Connect** your accounts (OB AIS) → Nisab **classifies** every holding (zakatable cash/savings/stocks/gold-investment/business/receivables vs exempt worn jewelry; deductible short-term debts).
2. **Track** nisab-crossing + **per-asset hawl** on a **Hijri** state machine (each lot has its own anniversary).
3. **Compute** the zakat base (zakatable assets − short-term liabilities) × **2.5%**, by a **board-validated Hanbali ruleset**, showing its working.
4. **Discharge** the day it's due: present the exact amount + breakdown → one tap to a **verified channel** (or auto-discharge with standing consent) → a **zakat-year ledger + certificate**.
- **Only-now element:** continuous OB asset visibility + a Hijri hawl engine + Arabic AI guidance. Impossible with a static calculator.

## 5. Architecture (modules, one spine)
```
                 ┌─────────────────────────────────────────────┐
 SPINE: "compute + discharge the pillar, continuously & correctly"
                 └─────────────────────────────────────────────┘
 OB AIS connectors → Asset Classifier → Nisab+Hawl state machine (Hijri, per-lot)
        → Zakat Computation Engine (Hanbali ruleset, board-validated, shows working)
        → Discharge Orchestrator (sarie → verified channels) → Ledger + Certificate
        → ALLaM Arabic explainer (guidance, never a fatwa)
```
Each module earns its place; the demo shows ONE flow (connect → compute → discharge).

## 6. Track + requirements
**Track 5 — Open Banking** (continuous AIS asset aggregation, for a purpose). **/01 Data** (the signature: classification + hawl + computation) · **/02 AI** (classification + Arabic guidance) · **/04 Sustainability** (zakat = the original sustainable wealth-circulation; recurring annual fulfillment).

## 7. 72h build plan
- **Stack:** Arabic-RTL app → asset classifier + **Hijri hawl state machine** + **zakat computation engine** (deterministic Hanbali ruleset over a finite asset taxonomy) → discharge stub → ledger/certificate → ALLaM seam (Arabic explanation).
- **Built for real:** classification, nisab/hawl tracking, the full computation with deductions + exemptions, the breakdown, the discharge flow, the ledger/certificate, and the **calculator-error contrast** (§8).
- **Mocked (labelled):** live OB (synthetic multi-asset Saudi profiles), real sarie discharge, the board ruleset (curated Hanbali subset), live gold price (seeded).
- **The ONE feature that must work:** connect → the engine computes the **exact** zakat across mixed assets with per-asset Hijri hawl + "due in N days" + a one-tap discharge. Deterministic, offline, RTL.
- **Day cut-line:** D1 synthetic profiles + classifier + nisab/hawl. D2 computation engine + deductions/exemptions + the error-contrast. D3 discharge + certificate + Arabic UX + offline fallback.

## 8. Data story (the portfolio's deepest — by design)
On screen, the engine **shows its working**: asset-by-asset classification (✅ this is zakatable; ❌ your spouse's worn gold is exempt per Hanbali; ➖ this short-term debt is deductible), the nisab line, **per-asset hawl timers** (Hijri), the zakat base, the 2.5%, the exact SAR. The wow is a **correctness contrast**: "a normal calculator told you **SAR 5,100** — you'd have **overpaid SAR 900** because it zakated worn jewelry and ignored your deductible debt. Your real zakat is **SAR 4,212**." This is genuine analysis, not a chart — and it lands exactly where the rest of the portfolio is thin.

## 9. UX
Calm, reverent, Arabic-first. A "your zakat year" dashboard with quiet hawl timers; the hero moment — *"your zakat is due in 12 days: SAR 4,212 — here's exactly why,"* with the asset breakdown — then a one-tap discharge and a beautiful certificate. The feeling: **relief + certainty** that a pillar is fulfilled exactly.

## 10. 3-minute demo script
1. **0:00 Hook:** "Zakat is a pillar — fard on every Muslim with wealth. Getting it right is hard: which assets, the nisab, the hawl, what to deduct. So people guess, overpay, or miss it. Every tool out there is a form you fill once a year and hope. Watch a zakat engine that never sleeps."
2. **0:30 Connect:** accounts link → the engine classifies live (cash, a gold-investment account, stocks; flags worn jewelry exempt; deducts a short-term debt).
3. **1:15 The compute (the wow):** nisab crossed, per-asset hawl timers, base, 2.5% → "**SAR 4,212, due in 12 days, by the Hanbali method.**" The contrast: "a calculator said SAR 5,100 — you'd have **overpaid SAR 900.**"
4. **2:10 Discharge:** one tap to a verified channel → certificate → the zakat-year ledger.
5. **2:40 Close:** "Zakat is billions of riyals a year in the Kingdom, owed by everyone, computed correctly by almost no one. Alinma can make every Saudi's third pillar **exact and effortless — continuously.**"

## 11. Business / Alinma-ship case
- **Deposit gravity:** to compute zakat it reads *all* your wealth → it pulls the customer's full financial picture onto Alinma = primary-bank stickiness; the **discharge flow** runs through Alinma.
- **Revenue/strategy:** a premium **"Zakat by Alinma"** service; partnership with verified channels (Ehsan/AWQAF); a Vision-2030 + Ramadan halo; aggregate (anonymized) zakat-flow insight.
- **Uncontested Shariah, only-Islamic-bank credibility.** Ships on Alinma's OB sandbox + ALLaM stack **next quarter** (it's computation + discharge, not a new regulated instrument).

## 12. Shariah
Zakat is **fard, uncontested**. Nisab applies a **board-validated Hanbali ruleset** and **shows its working**; genuine edge cases (disputed asset classes, madhhab choice) **escalate to a human/board — the AI never issues a fatwa.** No riba, no maysir, no gharar (it computes + gives the user's own obligation).

## 13. ⭐ OBJECTION-KILLER TABLE (every vector sealed)
| # | Worst credible attack | Sealed answer (built into the design) |
|---|---|---|
| 1 Innovation | "Zakat calculators are everywhere (ZAKATY, bank apps)." | Those are **static, manual, one-shot** forms. Nisab is **connected + continuous + per-asset Hijri-hawl + auto-discharge** — the first engine that *knows* your zakatable wealth and acts on the right day. Category, not calculator. |
| 2 Technical | "Mixed-asset zakat in 72h is too much." | The ruleset is a **bounded, deterministic** Hanbali engine over a finite taxonomy (cash/gold/stocks/business/receivables − short-term debt); built + tested on synthetic profiles; OB/discharge behind seams. Demonstrably scoped. |
| 3 Data | "Where's the depth?" | **This is the deep-data concept** — classification + nisab + per-lot hawl state machines + base + deductions/exemptions, shown live with a calculator-error contrast. Strongest data story in the portfolio (fixes its shared weakness). |
| 4 UX | "Tax-like = boring." | Reframed as **relief + worship** ("your third pillar, exact and handled"), Arabic-first, a certificate moment — not a form. |
| 5 Feasibility | "Would a bank ship a zakat engine?" | Deposit gravity + discharge flow + premium service + Vision-2030/Ramadan halo; calculators are already bolted into Al Rajhi/SNB — Alinma ships the **engine**, on its OB sandbox + ALLaM. |
| 6 Shariah | "AI issuing zakat rulings = fatwa risk." | Applies a **board-validated ruleset** + **shows working**; edge cases **escalate to a human/board**; never invents a ruling. Zakat itself is uncontested fard. |
| 7 Differentiation/moat | "Al Rajhi copies the calculator." | The moat is **continuous OB aggregation + correctness + discharge rails + the Hijri-hawl engine + Islamic-bank trust** — not a form. First-mover on "zakat that runs itself." |
| 8 Demo | "Is the wow real?" | The **calculator-vs-Nisab error contrast** ("you'd have overpaid SAR 900") + live mixed-asset compute + "due in 12 days." Deterministic, offline. |
| 9 Adoption / cold-start | "Why switch from a free calculator?" | It's **not** a form you fill — it's connected and **correct without effort**, and it **discharges**. The annual dread becomes zero-effort. Distribution: Alinma's base + the universal annual zakat moment + Ramadan. No two-sided cold-start. |
| 10 So-what | "Nice-to-have?" | Zakat is a **pillar of Islam, fard**, owed by ~every Saudi with savings, **every year**, currently done wrong or skipped. As load-bearing as worship gets — and the bank captures the discharge flow. |

## 14. Risk register
1. **Market/gold price accuracy** → live price feed seam + seeded demo; conservative rounding.
2. **OB can't see all wealth** (cash under the mattress, foreign assets) → user can add holdings manually; honest "we compute what we can see + what you add," never claims omniscience.
3. **Madhhab differences** → default Hanbali/KSA, user-selectable, each path board-validated.
4. **Discharge integrity** → only verified channels (Ehsan/AWQAF-class); receipt + certificate; never an opaque transfer.
5. **Demo flakiness** → deterministic seeded profiles + offline fallback recording.

## 15. Score & comparison
| Criterion | Wt | Pts |
|---|---|---|
| Innovation | 20 | 17 |
| Technical | 20 | 17 |
| Data | 20 | **19** |
| UX | 15 | 13 |
| Feasibility | 25 | 23 |
| **Total** | 100 | **89** |

**Beats Athar (same worship space):** Nisab's hero action is **real and fully completable in the 72h demo** (compute + discharge to the riyal), and it is the portfolio's **deepest data story** — exactly where Athar (15/20 data, a mocked "forever" fund) is thinnest. Where Athar promises something the build can't keep, Nisab *proves correctness live.*

## Links
- [[teardown]] · [[concept-birr]] (composes — Birr reuses this zakat engine for the deceased) · [[attacks]] · [[master-scoreboard]]
