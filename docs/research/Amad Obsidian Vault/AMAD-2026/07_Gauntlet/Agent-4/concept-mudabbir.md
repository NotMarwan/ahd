---
title: "مدبّر Mudabbir — the autonomous treasurer for businesses with no CFO (Gauntlet · Arena 4)"
tags: [gauntlet, agent/4, concept, arena/agentic, sealed, track/open-banking, req/data, req/ai, req/sustainability, score/87]
updated: 2026-06-18
---

# مدبّر · Mudabbir — the treasurer the 99% can't afford
**Track:** 5 Open Banking (alt: 1 GenAI) · **Requirements:** /01 Data + /02 AI + /04 Sustainability · **Score: 87/100** · **SEALED**

## 1. One-liner
**"Mudabbir is an autonomous treasurer for the small business that has no CFO — it forecasts the cash crunch weeks early from your real money (bank + ZATCA + POS), ring-fences payroll, zakat and VAT before they're accidentally spent, chases the overdue invoice that closes the gap, and prepares every payment for one tap — and it never lends you a riyal."**

## 2. The category
**The autonomous treasurer** — not accounting software that *records* the past (Qoyod/Wafeq/Mezan), not a lender that underwrites a limit (retired Tadfuq). An agent that **runs the live treasury** of a micro-business: predicts, protects, sequences, chases, and prepares — the financial brain a SAR-50k/month merchant could never hire. "I've never seen the bank itself act as my CFO."

## 3. Problem & proof
The Saudi economy is built on businesses with no finance function:
- **SMEs are 99%+** of registered businesses and central to Vision 2030 — yet **82% face cash-flow problems and 1 in 3 owners don't fully understand cash flow**; **most have no defined cash buffer and operate to the edge.** *(Global Banking & Finance; Qashio; Synergy.)*
- **Chronic late payments**: suppliers/SMEs wait weeks–months on receivables while payroll and rent are due now — "profitable on paper, illiquid in fact." *(Himma; Kema MENA.)*
- They can't afford a CFO and won't learn spreadsheets; accounting tools *report* but don't **act or warn forward**.
**Why now (2026):** **AIS** (the bank money) **+ ZATCA e-invoicing reaching small SMEs (Wave 24, Jun 2026)** (verified receivables) **+ POS data + ALLaM** give, for the first time, a forward-looking, verified, multi-source view an agent can act on — and Alinma already serves this segment via **iz Business** (Oct 2025).

## 4. Solution & mechanics
A **wakala-governed treasurer** with one spine — *keep the business solvent without lending* — and four acts:
- **Forecast:** a real cash-flow model over bank inflows/outflows + ZATCA invoice due-dates + POS rhythm → a **"crunch date"** with confidence ("Aug 12: SAR 14k short for payroll").
- **Protect (the safe autonomy):** **auto-ring-fences** payroll, **zakat** and **VAT** into the business's *own* sub-accounts the moment cash lands — so obligation money is never accidentally spent. (Moves between the business's own pots → low-risk, no outbound to third parties.)
- **Chase:** identifies the overdue receivable that closes the gap and **auto-drafts a sarie Request-to-Pay** + an Arabic dunning message for one-tap send.
- **Prepare (never autonomous outbound):** sequences supplier/rent/payroll payments and **presents each for one-tap approval** — the owner approves, Mudabbir never pays out alone.
**The two sealing rules (same doctrine as [[concept-naseer|Naseer]]):** (1) **autonomy only moves money between the business's *own* accounts; all third-party payouts are propose→one-tap** → no reg/trust wall. (2) **It NEVER advances or lends cash to cover a gap** → no riba/Tawarruq (the retired trap); it prevents the crunch with forecasting + sequestration + chasing, and *hands off* to a separate Alinma financing product only if the owner chooses.

## 5. Architecture (modules under one spine)
```
 AIS (bank) ┐
 ZATCA inv. ├─►  Cash-Flow Forecast Engine (crunch-date model = Data core)
 POS feed   ┘            │
                          ├─ Protect: auto-sequester payroll/zakat/VAT → own sub-accounts
                          ├─ Chase:   pick gap-closing receivable → sarie RtP + Arabic dunning
                          └─ Prepare: sequence payouts → 1-tap approval (never auto-out)
   Wakala scope/consent  ·  Treasurer's Ledger (every act, auditable)  ·  NO-LEND guarantee
```
One product (the treasurer); each module exists to keep the business solvent; the no-lend rail is a hard boundary, not a feature.

## 6. Track + requirements
**Track 5 — Open Banking** (multi-source AIS×ZATCA×POS intelligence that acts; alt 1 GenAI). **/01 Data** (the forecast/crunch engine) + **/02 AI** (the agent + Arabic dunning) + **/04 Sustainability** (SME survival/resilience = Vision-2030 economic backbone).

## 7. 72h build plan
- **Stack:** Arabic-RTL app; AIS + ZATCA + POS from Alinma OB sandbox + a **synthetic SME generator** (lumpy receivables, payroll, seasonality); a **cash-flow forecast + crunch-date model** (real); sub-account sequestration logic; **sarie RtP draft** + ALLaM dunning (seam); propose→approve payout flow; Treasurer's Ledger.
- **Built (real):** the forecast/crunch engine, the **auto-sequester** (own-pot transfers), the receivable-pick + RtP/dunning draft, the propose→approve queue, the ledger, the **no-lend boundary**.
- **Mocked (labelled):** live ZATCA/bank settlement, live ALLaM, real RtP delivery.
- **The ONE feature that must work:** connect a merchant → Mudabbir **forecasts the crunch + names the receivable that covers it + ring-fences payroll now** → owner one-taps the chase.
- **Day cut-line:** D1 forecast engine on synthetic SME + ZATCA; D2 sequester + receivable-chase + propose-pay; D3 Arabic dashboard + the crunch-radar wow + deterministic offline demo.

## 8. Data story (earns the Data 20 — the strong vector)
Genuinely multi-source: bank cash-flow (timing) **×** ZATCA invoices (verified receivables + due dates) **×** POS (daily rhythm) → a **forward crunch-date prediction** with the **specific receivable** that closes it, plus zakat/VAT accruals tracked live. Shown on screen: a cash-runway curve dipping below the payroll line on a date, then **lifting above it** when the chase + sequester are applied — analysis that changes the future, not a report of the past. (Distinct from retired Tadfuq: same sources, but for **treasury action**, not a credit limit.)

## 9. UX
Arabic-first, owner-grade (not accountant-grade). Hero moment: the **crunch radar** — "١٢ أغسطس: نقص ١٤٬٠٠٠ ر.س للرواتب" turning green as Mudabbir shows the fix. One screen, plain language, one-tap actions. Calm authority — the steady hand a stressed owner needs.

## 10. 3-minute demo
1. **0:00 — the pain (20s):** "99% of Saudi businesses have no CFO. 82% hit cash-flow trouble. Profitable on paper, then can't make payroll."
2. **0:20 — the forecast (50s):** merchant *Dana's* books load (bank+ZATCA+POS) → **"Aug 12: SAR 14k short for payroll."** The runway curve dips under the payroll line.
3. **1:10 — it acts (70s):** Mudabbir: invoice **#1042 (SAR 22k, 40 days overdue)** covers it → **auto-drafts a sarie Request-to-Pay + Arabic reminder** (one tap to send); **payroll + this quarter's VAT + zakat are ring-fenced now** into sub-accounts (own money, moved safely). Curve lifts above the line.
4. **2:20 — the boundary (20s):** a supplier payment is **queued for one-tap approval** — "Mudabbir prepares; you approve. It moves your own money to protect you; it never pays out alone, and **it never lends you a riyal.**"
5. **2:40 — the leap (20s):** "An autonomous treasurer for the businesses that hold up the economy — on iz Business, governed by wakala, riba-free by design."
- **Fallback:** deterministic seeded merchant; offline fixture.

## 11. Business / Alinma-ship case
- **iz Business stickiness + deposits:** the sequestered payroll/zakat/VAT pots **stay in Alinma**; the treasurer lives on the primary business account.
- **Healthier book / lower default:** solvent SMEs are better customers; fewer surprise defaults.
- **Pipeline (clean):** when an owner *wants* financing, Mudabbir hands off to a **separate** Alinma halal SME product — it never becomes the lender (keeps it Shariah-clean and conflict-free).
- **Premium treasurer tier** (flat fee). **On-strategy:** extends iz Business (Oct 2025) on the OB sandbox + ALLaM/watsonx stack.

## 12. Shariah
**Wakala** (agency to manage the business's affairs — *tadbir al-mal*, sound stewardship). Auto-sequestering **zakat + VAT** is Shariah-positive (fulfils obligations). **No riba (it never lends/advances), no maysir, no gharar.** Outbound payments need the principal's approval (scope-limited agency). AI drafts dunning — **no fatwa**.

## 13. ⭐ OBJECTION-KILLER TABLE
| Vector | Worst credible attack | Sealed answer (built-in) |
|---|---|---|
| **Innovation** | "It's accounting software + a dashboard (Qoyod/Wafeq)." | Those **record & report the past**; Mudabbir **forecasts, ring-fences, chases, and prepares payments** — and it's **bank-native** (moves money between pots, sends RtP) which software can't. Treasurer, not ledger. |
| **Technical** | "Autonomous business payouts = Wakeel's reg wall ×liability." | Autonomy is **own-account-only** (sequester); **every third-party payout is propose→one-tap.** No autonomous outbound → wall removed. |
| **Data** | "Cash-flow forecasting on thin SME history is unreliable." | It fuses **three verified sources** (bank timing × ZATCA due-dates × POS) and predicts a **specific dated crunch + the exact receivable that closes it** — concrete, not a vague projection; confidence shown. |
| **UX** | "Owners don't trust software with money calls." | It **decides nothing irreversibly** — it warns, protects (own pots), and *proposes*; the owner taps. Plain Arabic, owner-grade. |
| **Feasibility** | "SAMA won't let AI pay suppliers; integration is heavy." | No autonomous outbound (so nothing to block); ring-fencing own sub-accounts is permitted today; ships on **iz Business** + OB sandbox. ZATCA/POS are read-only. |
| **Shariah** | "If it advances cash to cover a gap → riba/Tawarruq." | **Hard no-lend boundary** — Mudabbir *never* advances cash; it prevents the crunch via forecast + sequester + chase, and *hands off* financing to a separate product. Wakala + zakat/VAT sequestration = Shariah-positive. |
| **Moat** | "ERPs will add AI; Tadfuq-likes own SME data." | The moat is **bank-rail action + AIS×ZATCA×POS fusion under one wakala-governed treasurer** — an ERP can't move money or hold pots; a lender underwrites, it doesn't run your treasury. |
| **Demo** | "'It ran the books' is invisible/boring on stage." | The wow is **visual + dated**: the runway curve crossing the payroll line, then lifting — a crisis predicted and averted in 90 seconds. |
| **Adoption** | "SMEs are busy + low-trust + switching cost." | Connect = read-only first; it **shows the crunch it would prevent** before any action; ring-fencing is opt-in and obviously protective; lives where the owner already banks (iz Business). |
| **So-what** | "Is 'missed a payment' a big enough pain?" | **Missing payroll/VAT/zakat is existential** for a micro-business (82% face cash-flow trouble; late payments kill solvent firms). Preventing one crunch pays for years of the fee. |

## 14. Risk register
- **Technical (forecast accuracy):** show confidence + the *specific* receivable (falsifiable, not vague); conservative buffers; demo on a rich seeded merchant.
- **Regulatory:** no autonomous outbound; read-only ZATCA/POS; PDPL consent = the wakala grant.
- **Adoption:** proof-first (show the averted crunch); opt-in sequester; flat fee.
- **Shariah:** the **no-lend boundary** is enforced in code and stated on screen.

## 15. Score & comparison
| Criterion | Wt | Score |
|---|---|---|
| Innovation | 20 | **16** |
| Technical | 20 | **16** |
| Data | 20 | **19** |
| UX | 15 | **13** |
| Feasibility | 25 | **23** |
| **Total** | **100** | **87** |

**Beats the portfolio incumbent it critiques (Wakeel, 87) on a different axis:** Mudabbir applies the agentic idea where autonomy is **operationally welcome and reg-safe** (a business with no CFO, own-account actions only), and earns the **Data 20** with a genuine multi-source forecast — sealing Wakeel's "so-what / regulatory / thin-data" holes by changing the *user* and the *direction of action*. Distinct from [[concept-naseer|Naseer]] (consumer, recover-money-in) — different user, value, and data.

## Links
- [[teardown]] · [[attacks]] · [[concept-naseer]] · [[concept-wakeel]] (incumbent it surpasses) · [[master-scoreboard]]
