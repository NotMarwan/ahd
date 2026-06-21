---
title: "بِرّ Birr — devotion that outlives death"
tags: [gauntlet, agent/1, arena/worship, concept/birr, sealed, track/customer-experience, req/cx, req/ai, req/data]
updated: 2026-06-18
---

# 🤍 بِرّ · Birr — keep honoring your parents after they're gone
**Arena:** Worship & the Hereafter · **Track:** 2 Customer Experience · **Requirements:** /03 CX + /02 AI + /01 Data + /04 Sustainability · **Self-score 89/100 (sealed)**
> De-confliction with **A3's [[concept-waqar|Waqar]]** (banking for the *living* aging parent): Birr serves the **deceased** parent. Together = the two halves of *birr al-walidayn* — **before death (Waqar) and after (Birr)**. Complementary, not competing.

## 1. One-liner
**Birr lets you keep honoring your parents after they're gone — it helps you settle the obligations they left behind (their debts, unpaid zakat, an unperformed Hajj), then keeps giving sadaqah in their name and shows their record of reward still growing — because in Islam, your devotion to your parents does not end at the grave.**

## 2. The category
**Post-death devotion — "an account for someone you've lost that keeps doing good in their name."** Not estate planning (that's before death), not a donation (that's for the living giver) — a *relationship with the deceased*, made actionable. The honest "I've never seen this": no product has ever let a grieving child *fulfill their dead parent's financial duties and keep earning them reward.*

## 3. Problem & proof
- In Islam, when a parent dies your *birr* **continues**, and several acts are concretely **encouraged or obligatory** for the living — all unserved by any product:
  - **Debts:** a debt **imprisons the deceased** from Paradise; heirs (esp. children) should settle it. [IslamOnline](https://fiqh.islamonline.net/en/children-paying-the-debts-of-their-dead-parents/)
  - **Zakat:** does **not** die with the person — it becomes a **debt paid from the estate / on their behalf.** [IslamOnline](https://fiqh.islamonline.net/en/paying-zakah-on-behalf-of-a-deceased-parent/)
  - **Hajj / fasting:** the Prophet ﷺ instructed performing **Hajj/Umrah** and fasting missed days **on behalf of** the deceased. [hadith summary](https://islamqa.info/en/answers/42384/sadaqah-jariyah-for-the-deceased)
  - **Sadaqah / du'a:** scholars agree **sadaqah, du'a, istighfar, and sadaqah jariyah reach the deceased**; a child can give sadaqah explicitly on a parent's behalf. [IslamQA](https://islamqa.info/en/answers/42384/sadaqah-jariyah-for-the-deceased)
- **The human truth:** the wish to still *do something* for a parent you've lost is among the most powerful feelings in the human heart — and in Islam it is **actionable**, yet today it's navigated manually, ad hoc, or not at all because people don't know they can.
- **Why now:** OB (heir-authorized view of the estate) + the **zakat engine** (compute their owed zakat) + sarie + verified Hajj-badal/charity channels + Nafath/Absher heir-verification + ALLaM Arabic — all 2026.

## 4. Solution & mechanics
1. **Establish** a parent's Birr (heir-verified via Nafath/Absher seam).
2. **Settle the unfinished account:** assemble their outstanding obligations — **debts**, **unpaid zakat** (computed by the [[concept-nisab|Nisab]] engine), an **unperformed obligatory Hajj**, **missed fasts (fidya)** — and fulfill each: repay debts via sarie, discharge zakat, fund a **Hajj-badal** through a verified channel, feed for missed fasts.
3. **Continue the good:** schedule ongoing **sadaqah in their name** (monthly, Fridays, their birthday / death anniversary), optionally a **sadaqah jariyah** (a Qur'an endowment, water, a student's fees) whose reward flows to them.
4. **Their record (صحيفة):** a dignified page showing what's been settled and what's still flowing in their name — *"this month, in your father's name: settled, given, du'a."* A place to visit them.
- **Only-now / only-here:** OB + the zakat engine + Hajj-badal/charity rails + heir-verification + Arabic AI — and **only an Islamic bank, in the land of Hajj, can offer "fulfill your dead parent's Hajj."** A conventional or foreign bank literally cannot.

## 5. Architecture (composite, one spine)
```
 SPINE: "complete + continue a deceased parent's account"
 Heir-verification (Nafath/Absher) → Deceased's Obligation Ledger
     ├─ debts (sarie settle)
     ├─ zakat owed  ← reuses the [[concept-nisab|Nisab]] zakat engine (computes on the estate)
     ├─ unperformed Hajj → Hajj-badal via verified channel
     └─ missed fasts → fidya compute
   → Ongoing-Sadaqah Scheduler (in their name) → "Their Record" view + ALLaM Arabic narration
```
One hero flow demoed (establish → settle → continue). Nisab nests here cleanly — each module earns its place by completing a real duty.

## 6. Track + requirements
**Track 2 — Customer Experience** (a profoundly new, emotional service). **/03 CX** (the most consoling experience a bank can give) · **/02 AI** (obligation assembly + Arabic narration) · **/01 Data** (the obligation ledger + zakat/fidya computation) · **/04 Sustainability** (sadaqah jariyah = perpetual good in their name).

## 7. 72h build plan
- **Stack:** Arabic-RTL app → heir-verify (mock) → **deceased's obligation ledger** over synthetic estate data → settlement orchestrator (sarie stub; zakat compute via the Nisab engine; Hajj-badal/charity stub; fidya compute) → ongoing-sadaqah scheduler → the **"their record"** view → ALLaM seam.
- **Built for real:** the obligation ledger, the zakat/fidya computation, the settle-each flow, the sadaqah scheduler, the "record still flowing" timeline.
- **Mocked (labelled):** Nafath/Absher heir-verify, sarie, real Hajj-badal/charity delivery, ALLaM.
- **The ONE feature that must work:** establish a parent → their unfinished-obligation ledger assembles (debt + computed zakat + unperformed Hajj + missed fasts) → settle each → "their record" shows reward still flowing. Deterministic, offline, RTL.
- **Day cut-line:** D1 synthetic estate + obligation ledger + zakat reuse. D2 settle flow + Hajj-badal/fidya + sadaqah scheduler. D3 the "their record" view + reverent Arabic UX + offline fallback.

## 8. Data story (shown live)
The deceased's **obligation ledger computed from estate data** — outstanding debts, **zakat owed** (real per-asset computation via the Nisab engine), an unperformed obligatory Hajj flagged, **fidya** for missed fasts computed — assembling on screen, each with its basis. Genuine analytical depth (the zakat engine pointed at the estate), plus the emotional "still flowing" timeline. Not a chart: classification + computation + a settlement ledger.

## 9. UX
Reverent, calm, Arabic-first — *consoling*, never morbid. The hero: establishing a parent and seeing **"here is what we can still do for them,"** then returning to **"their record"** — a digital place to honor them. The wow is the emotional realization that you can still *act* for someone you've lost, made concrete and correct.

## 10. 3-minute demo script
1. **0:00 Hook (black screen, hadith):** *"إذا مات ابن آدم انقطع عمله إلا من ثلاث… وولد صالح يدعو له."* "In Islam your duty to your parents does not end when they die — you can still pay what they owed, give in their name, and send them reward. No one has built it. Watch."
2. **0:30 Establish:** "my father, may Allah have mercy on him" (heir-verify).
3. **1:00 His unfinished account assembles:** a **SAR 12,000 debt**, two years of **unpaid zakat — computed live, SAR 3,400**, an **obligatory Hajj he never performed**, **6 missed fasts**.
4. **1:50 Act:** repay the debt via sarie; discharge his zakat; arrange a **Hajj-badal** via a verified channel; feed for the fasts; set a **monthly sadaqah** in his name. Each completes.
5. **2:35 His record:** the page shows what's settled + the sadaqah now flowing every month in his name — *"reward still reaching him."* **Close:** "Every Saudi will lose their parents. Islam says: keep honoring them. Alinma can let a grieving child still do right by their mother and father — something **no conventional bank on earth could ever offer.**"

## 11. Business / Alinma-ship case
- **Loyalty for life:** it bonds the customer to Alinma at the most vulnerable, meaningful moment — uncopyable emotional moat; Islamic banks already handle inheritance, so it's adjacent.
- **Flows:** estate-settlement + **recurring ongoing-sadaqah** + Hajj-badal/charity = repeated, sticky transactions (seals the "frequency/retention" hole — devotion continues for *years*).
- **Strategy:** ties to AWQAF/Ehsan/Hajj channels; Vision-2030 + social halo. Uncontested Shariah-*positive*.

## 12. Shariah
Every act is **established by consensus** — settling the deceased's debts/zakat, **Hajj-badal**, fidya, and **sadaqah on their behalf** reach the deceased (cited fiqh). Birr **facilitates validated acts**; rulings (e.g., whether Hajj was obligatory on the deceased, debt priority from the estate) are **board-validated or escalated — the AI never issues a fatwa.** No riba, no maysir, no gharar. Shariah as the product's soul.

## 13. ⭐ OBJECTION-KILLER TABLE (every vector sealed)
| # | Worst credible attack | Sealed answer (built into the design) |
|---|---|---|
| 1 Innovation | "Isn't this Athar's 'dedicate to your father'?" | Athar names a *forward endowment* once. Birr is a **relationship with a specific deceased person** — it **settles their unfinished obligations** (debts/zakat/Hajj/fasts — established fiqh) then continues giving. Different spine; genuinely unseen. |
| 2 Technical | "Discovering a dead person's obligations is uncertain/too hard." | Unlike Dhimmah's risky inference on the *living*, Birr works from **heir-authorized estate data + explicit declaration** (the heir knows the debts) + **deterministic** zakat/fidya computation. It **assists, never guesses.** |
| 3 Data | "Where's the depth?" | It **nests the Nisab zakat engine** (real per-asset computation on the estate) + the obligation ledger + fidya math, shown live. Genuine analysis, not sentiment. |
| 4 UX | "A death product is morbid." | It is **reverent and consoling** — it gives a grieving child *agency* ("you can still do this for them"); the "their record" page is comfort, not grief-marketing. **Tone is the product.** |
| 5 Feasibility | "Would a bank ship a death product?" | It's the **most loyalty-bonding moment** a bank can serve; Islamic banks already do inheritance; recurring sadaqah + settlement flows; on Alinma's rails + verified Hajj/charity channels. |
| 6 Shariah | "Is acting financially for the dead valid?" | **Consensus-established** (debts/zakat/Hajj-badal/sadaqah on behalf all reach the deceased — cited); board-validated; AI never rules. Shariah-**positive**. |
| 7 Differentiation/moat | "Could anyone copy it?" | Requires **Islamic-bank credibility + the fiqh framing + settlement/Hajj rails**. A conventional/foreign bank **cannot** offer "fulfill your dead parent's Hajj." Uncopyable. |
| 8 Demo | "Is the wow real or just framing?" | The obligation ledger assembling for a deceased parent + the **live zakat compute** + the "reward still flowing" record. Emotionally the strongest beat in the portfolio; deterministic/offline — grounded in a *real, universal* duty, not invented sentiment. |
| 9 Adoption / cold-start | "Niche/rare event?" | **Every Muslim loses their parents — universal**, not niche. And birr **continues for years** (ongoing sadaqah → recurring engagement), unlike Dhimmah's once-a-year window. Distribution: the bereavement/estate moment + Ramadan (peak giving-for-the-dead). **No two-sided cold-start.** |
| 10 So-what | "Does it matter enough?" | Honoring deceased parents is among the **most spiritually + emotionally weighty acts in Islam**, currently unserved and done ad hoc. As load-bearing as finance gets. |

## 14. Risk register
1. **Heir authorization / legal** → only Nafath/Absher-verified authorized heirs may act on an estate; debts settled per inheritance law; honest scoping.
2. **Grief sensitivity** → reverent, opt-in design; zero aggressive marketing; the customer initiates.
3. **Fiqh edge cases** (Hajj-badal validity, debt priority) → board-validated; escalate, never auto-rule.
4. **Reaching real Hajj/charity channels** → verified partners only; receipts + the "record" provide transparency.
5. **Demo flakiness** → deterministic seeded estate + offline fallback.

## 15. Score & comparison
| Criterion | Wt | Pts |
|---|---|---|
| Innovation | 20 | **19** |
| Technical | 20 | 16 |
| Data | 20 | 17 |
| UX | 15 | 15 |
| Feasibility | 25 | 22 |
| **Total** | 100 | **89** |

**Beats Dhimmah (same conscience space):** Birr works from **heir-declared/estate data, not risky inference**; it makes **no false assurance** (it completes *real* acts rather than declaring an inferred account "clear"); and it is **universal + recurring** (every Muslim, for years) vs Dhimmah's seasonal, once-a-year, pre-Hajj-only window. It takes Dhimmah's emotional power and removes its ethical hole.

## Links
- [[teardown]] · [[concept-nisab]] (the zakat engine Birr reuses) · [[concept-waqar]] (A3 — the living-parent half) · [[attacks]] · [[master-scoreboard]]
