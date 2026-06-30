# Agent 1 — Feature: «الدائرة» · The Standing Circle
### The everyday shared-money layer that makes Ahd سعود's weekly habit

> **One-line:** A *persistent household/crew circle* where small splits are logged in one tap (no Nafath per item), recurring bills auto-post, the balance nets continuously via the existing Muqassa, grace covers the broke month — and any single debt can **graduate** into the full witnessed عهد the instant it deserves one.
>
> **Tag:** core slice **[demo-now]** · recurring + graduation **[v2]** · effort estimates in §9.

---

## 1 · The need (for سعود specifically)

سعود's money life is **high-frequency, low-amount, same-people, repeating** (see `journey.md`): rent + bills + groceries + جاهز orders split with تركي and عبدالله, twenty times a month. Ahd today is a **notary for one serious loan** — and a notary is the wrong tool for *«نصيبك من الكهرباء ٢٠٠ ريال»*. The full ceremony (ALLaM terms → dual Nafath → SHA-256 record) that makes Ahd *legally serious* is exactly what makes it *unusable forty times a month*.

The missing thing is not another feature on the loan — it's the **layer underneath the loan**: a place where everyday money lives, lightly, until it grows up. Without it, سعود uses Ahd ~2–3×/year. With it, he opens it weekly and drags his whole flat in.

**This is genuinely missing.** The demo's Muqassa nets a circle of strangers with *hardcoded* IOUs — there is no way to (a) create *your* circle, (b) *capture* a real split into it, (c) make a bill *repeat*, or (d) keep a *living* balance. The Standing Circle adds the on-ramp; it does not re-spec Muqassa, it *feeds* it.

---

## 2 · The key design idea — two tiers of trust (this is what keeps it on-spine)

Ahd's ceremony is the **gold standard** for obligations that matter. Forcing it onto an 85-riyal grocery split is the friction that kills daily use. So the Standing Circle introduces a **second, lighter tier** that lives on the *same* rail:

| | **Tier 1 — قَيْد (a logged split)** | **Tier 2 — عهد موثّق (witnessed agreement, EXISTS today)** |
|---|---|---|
| **What** | A shared-ledger entry: "I paid X, your share is Y" | A full qard-hasan deed |
| **Ceremony** | One tap to log · one tap to acknowledge («أوافق») | ALLaM terms → **dual Nafath** → SHA-256 witnessed record |
| **Identity** | In-app acknowledgment (light) | Nafath biometric, both parties |
| **Tamper-evidence** | Sealed **in batch** at monthly settlement (one monthly SHA-256 seal, not 40) | Per-deed SHA-256 hash-chain (unchanged) |
| **For** | الإيجار، الفواتير، البقالة، طلبات | the float that got big, the formal loan, the exit balance |
| **Becomes Tier 2 by** | **graduation** (§6) — one tap, when it matters | — |

> **Why this is honest, not a loophole:** a قَيْد is still a *recorded, mutually-visible, append-only* ledger entry — it just doesn't burn a full Nafath ceremony on every 85 riyals. When money actually accumulates (monthly settlement, or a single debt crossing a threshold, or someone leaving the flat), it **crystallizes into a witnessed record**. Lightness on the way in; full witnessing at the moment of consequence. The bank still **writes, witnesses, records, settles, nets** — just at the *right altitude* for the amount.

**Vocabulary سعود actually uses** (hand these to Design as the canonical strings):
- **الدائرة** — a standing circle (his flat / his ربع).
- **قِسْمة** — one split ("اقسمها علينا").
- **قَيْد** — the resulting ledger entry per person.
- **الميزان** — the living balance ("من له ومن عليه").
- **سوّوا الدائرة** — run the monthly settlement (Muqassa).

---

## 3 · Where it lives & how you enter it

A new home surface: **«دوائري»** (My Circles) — the everyday front door, *before* the loan flow. The existing single-عهد creation becomes one of two paths from a circle, not the whole app.

```
دوائري  (My Circles)
 ├─ شقة الملقا · ٣ أعضاء         ← standing circle (household)
 │    الميزان: لك ٢٤٠ ر.س صافٍ   ← live net, computed by existing balancesOf()
 ├─ ربع البر · ٥ أعضاء           ← a friends circle (trips/dinners)
 │    الميزان: عليك ٦٠ ر.س
 └─ + دائرة جديدة
```

Tapping a circle opens its **لوحة الدائرة** (circle board): the live balance, the feed of recent قِسْمات, the recurring splits, and the two action buttons **«+ قِسْمة»** and **«سوّوا الدائرة»**.

---

## 4 · The flows, screen by screen (with exact Arabic copy)

### Flow A — إنشاء دائرة (create a circle) · one-time, light
**Screen A1 — دائرة جديدة**
- Field: **اسم الدائرة** — placeholder *«مثال: شقة الملقا»*.
- Field: **النوع** (just shapes defaults): `سكن مشترك` / `ربع وأصدقاء` / `رحلة/مناسبة` / `عائلة`.
- **الأعضاء:** add by contact / phone / Nafath-verified handle. سعود adds تركي و عبدالله.
- Copy: *«الدائرة دفترٌ مشترك بينكم — كلٌّ يرى نفس الأرقام. «عهد» يكتب ويحفظ، ولا يطّلع عليها أحدٌ من خارج الدائرة.»*
- CTA: **أنشئ الدائرة**.

> Members get: *«ضمّك سعود إلى دائرة «شقة الملقا» — دفترٌ مشترك للمصاريف بينكم. تنضمّ؟»* → **انضمّ** (a one-time light join; Nafath optional here, required only at graduation).

---

### Flow B — قِسْمة (split an expense) · the everyday core, ONE tap to log
**Screen B1 — قِسْمة جديدة**
- **وش صرفت؟** placeholder *«فاتورة الكهرباء»* (free text + quick chips: `إيجار` `كهرباء` `ماء` `نت` `بقالة` `طلبات` `فزعة`).
- **المبلغ:** `٦٠٠` ر.س.
- **مين دفع؟** default = أنت (سعود); selectable to any member.
- **نقسمها على:** members pre-checked (default الكل). Toggle anyone out (*«أنا ما طلبت من جاهز اليوم»*).
- **طريقة القسمة:**
  - **بالتساوي** (default) → ٢٠٠ لكل واحد.
  - **حصص** (custom amounts per person — البقالة where one bought extra).
  - **نسب** (%) — rare, for uneven rooms/usage.
- Live preview: *«تركي ٢٠٠ · عبدالله ٢٠٠ · أنت دفعت ٦٠٠ → لك ٤٠٠»*.
- CTA: **سجّل القِسْمة**.

**On submit** → creates **قيود** (one per ower). No contract, no Nafath. Confirmation:
> *«تمّت القِسْمة 🤍 — أُضيفت إلى ميزان «شقة الملقا». تركي وعبدالله وصلهم إشعار لطيف.»*

**Screen B2 — the other member's view (تركي's phone)** — a *light* acknowledgment, NOT the heavy «وصلتك بسلامة» ceremony:
> **قِسْمة جديدة في «شقة الملقا»**
> *سعود دفع فاتورة الكهرباء (٦٠٠ ر.س)، ونصيبك **٢٠٠ ر.س**.*
> [ **أوافق** ]  [ **عندي ملاحظة** ]

- **أوافق** → قيد becomes `acknowledged`; balance firms up. (Tone: *«تمام، صار في ميزان الشقة 🤍»*.)
- **عندي ملاحظة** → light dispute (§7) — *not* an accusation, a *«راجِع القِسْمة»*.
- **No-op default:** if تركي doesn't tap, the قيد stays `logged` (visible, counts in the tab, flagged «بانتظار تأكيد تركي») — honest, not silently binding. It firms at acknowledgment or at settlement consent.

---

### Flow C — قِسْمة دائمة (recurring split) · rent & bills that repeat **[v2]**
**Screen C1 — قِسْمة تتكرّر**
- Same as B1 + **التكرار:** `كل شهر` / `كل أسبوع` · **يبدأ:** `١ يوليو` · **الدافع الثابت:** تركي (rent is in his name).
- Example set up once: *«الإيجار · ٣٬٦٠٠ ر.س · ١ من كل شهر · بالتساوي · يدفع تركي ثم يقسمها»*.
- Each cycle auto-posts the قيود and notifies — *«حلّ موعد الإيجار: نصيبك ١٬٢٠٠ ر.س لـ تركي. (قِسْمة متكرّرة)»* — with **«عدّل»** / **«أوقف»** always one tap away.
- Edge handled: amount changes (rent ↑) → edit affects next cycle only; member leaves → recurring re-derives shares from next cycle (§7).

---

### Flow D — الميزان (the living balance) · the thing his Notes app could never be
**Screen D1 — لوحة الدائرة**
- Top: **ميزان شقة الملقا** — per-member net, computed by the **existing** `balancesOf()`:
  - *أنت: **لك ٢٤٠** صافٍ* · *تركي: عليه ١٨٠* · *عبدالله: عليه ٦٠*.
- Feed of recent قِسْمات (who/what/when/share), each with its state chip (`بانتظار تأكيد` / `موافَق` / `سُوّي`).
- Recurring splits section with next-due dates.
- Two CTAs: **«+ قِسْمة»** and **«سوّوا الدائرة»**.
- Always-visible reassurance: *«لا فوائد، لا رسوم على المبالغ بينكم. «عهد» يكتب ويحسب، والمال مالكم.»*

---

### Flow E — سوّوا الدائرة (monthly settlement) · reuses Muqassa + sarie + the monthly seal
This is the **existing Muqassa screen, fed by real data** instead of hardcoded IOUs.

**Screen E1 — تسوية الدائرة**
- *«ميزان هذا الشهر: ٧ قِسْمات بين الثلاثة. «عهد» يحسب أقلّ تحويلات تُصفّي الدائرة.»*
- Tap → existing `netting()` runs on the month's قيود → existing **consent step** (each member approves their new leg) → existing graph (`before` → `after`) + conservation proof → **sarie** transfers.
- **New on-spine touch — the monthly seal:** at commit, the settled batch is hashed into **one** SHA-256 witnessed record (reusing `canonical()` / `sealBlock()`): *«خُتمت تسوية شهر يوليو — وثيقةٌ واحدةٌ تشهد على ٧ قِسْمات. #A1B2C3»*. → **Tier-1 lightness on the way in, Tier-2 witnessing at the moment of consequence.** The tab resets to zero; trust bands update.
- End state: *«صُفّيت الدائرة 🤝 — ذمم محفوظة، والشهر بدأ من جديد.»*

---

## 5 · States

| State | Meaning | Copy |
|---|---|---|
| `logged` | قيد created, not yet acknowledged | «بانتظار تأكيد تركي» |
| `acknowledged` | ower tapped أوافق | «موافَق 🤍» |
| `disputed` | ower tapped «عندي ملاحظة» | «قيد المراجعة — لا يُحتسب حتى تتّفقوا» |
| `settled` | cleared in a Muqassa run (or marked cash-paid) | «سُوّي عبر سريع» / «سُوّي نقدًا» |
| `graduated` | promoted to a witnessed عهد | «صار عهدًا موثّقًا — انتقل إلى الوثيقة» |
| `forgiven` | creditor waived it | «أُبرئ — ﴿وأن تصدّقوا خيرٌ لكم﴾» |

Circle-level: `active` / `dormant` (no activity 60+ days → gentle «دائرتكم هادئة، فيها رصيد غير مُسوّى؟»).

---

## 6 · Graduation — the bridge that keeps the spine (قَيْد → عهد) **[v2]**

The everyday tab earns its place *because* it knows when to stop being lightweight.

**Triggers (any one):**
1. A **single** debt to one person crosses a threshold the circle sets (default **١٬٠٠٠ ر.س**) — e.g. سعود floats تركي ١٬٥٠٠ for his car استمارة.
2. A balance **rolls over** unsettled for N cycles (someone's share keeps not clearing).
3. **Anyone taps** «وثّقها كعهد» on a قيد — *«حسّيت إنها صارت كبيرة؟ وثّقها.»*

**Flow:** Ahd offers, never forces —
> *«المبلغ بينك وبين تركي صار ١٬٥٠٠ ر.س. تحبّ توثّقونه كعهدٍ مكتوب — يحفظ حقّكما بكرامة؟»*  [ **وثّقها كعهد** ] [ **خلّها في الميزان** ]

**«وثّقها كعهد»** → drops straight into the **existing** create-عهد flow (Screen 1) pre-filled (lender/borrower/amount/plain-Arabic ALLaM terms), then the **existing** dual-Nafath seal (Screen 3), schedule, grace, the works. The قيد's state → `graduated`; the witnessed record links back to the originating قِسْمات (provenance preserved).

> This is the product's growth engine *and* its integrity: people arrive for the easy split, and the app **upgrades them into the witnessed rail precisely when their money gets serious** — with full dignity and 2:280 grace intact.

---

## 7 · Edge cases (and how each stays warm + on-spine)

- **«هذا مو نصيبي» (wrong amount / not mine):** «عندي ملاحظة» → قيد goes `disputed`, is **excluded from settlement** until resolved, and the logger can edit. Copy: *«تراجعونها بينكم — «عهد» يكتب ويحفظ، وما يحكم بينكم.»* (Mirrors the existing DISPUTED handling exactly: write & witness, never judge.)
- **دفعت نصيبي نقدًا (settled off-rail):** ower taps «دفعت نقدًا» → logger confirms → قيد → `settled (نقدًا)`. Keeps the ledger honest without forcing every halal cash payment through sarie.
- **العضو المعسر هذا الشهر (the broke month — 2:280):** ower taps **«أحتاج وقت»** on their share → it rolls to next cycle, **no penalty, no increase** (reuses the existing `respread()` grace), creditor told gently: *«عبدالله يحتاج مهلة بسيطة — وهذا من المعروف.»*
- **عضو يطلع من الشقة وعليه رصيد (member leaves with a balance):** the natural "formalize on exit" moment → Ahd prompts graduation of the residual to a witnessed عهد at departure (write it down *now*, while everyone's still friends).
- **حصص غير متساوية:** custom حصص / نسب per line (exclude me from the soda, by-room rent).
- **قِسْمة بالغلط (mistake):** logger can void a `logged`/`disputed` قيد (void event, append-only — nothing is silently deleted); an `acknowledged` one needs the ower's ok to void.
- **الخصوصية:** balances visible only inside the circle; trust band is each person's **own** history (never exported — unchanged from today).
- **idempotency / double-tap:** logging is event-sourced (append-only قيد events) like the existing `fold()` lifecycle — same guarantees, no double counts.

---

## 8 · On-spine + Shariah check ✅

| Spine / value | How the Standing Circle holds it |
|---|---|
| **Bank lends nothing** | Splits are between flatmates; sarie only moves *their own* money. Ahd never fronts a halala. |
| **Bank judges nothing** | Disputes go `disputed` and wait for the parties; Ahd writes & witnesses, never rules. |
| **No fee on the loan** | قِسْمات and settlement carry **zero** interest/fee. (A *fixed service fee* could attach to the platform later, never a % of the amount — the existing riba linter already enforces this if anyone tries.) |
| **No credit score** | The trust signal stays the **qualitative band** («وفّى بعهوده» / «جديد»). Everyday قيود make the band richer, but it remains a 3-word social mirror — **never a number, never exported, never underwrites** (unchanged `trustSignal()`). |
| **2:280 mercy** | «أحتاج وقت» grace applies to the tab via the existing `respread()`; rescheduling adds nothing. |
| **No riba / maysir / gharar** | Splitting a *known* bill = no gharar; no interest anywhere; no gambling. |
| **AI issues no fatwa** | ALLaM only drafts plain-Arabic terms at graduation; the riba *linter* is a deterministic rule engine, not a fatwa. |
| **Soul: «your word honored, your relationship protected»** | The light قيد protects the ٨٥-riyal friendship the Notes-app shakedown was destroying; graduation protects the ١٬٥٠٠ one. |

---

## 9 · How it composes + the «why everyone uses it» case + tags

### Composition (it's mostly *wiring existing engines to real input*)
- **Muqassa** (`netting`, `balancesOf`, `muqassaLegs`, consent, conservation proof, graph): **reused as-is**, now fed live قيود instead of hardcoded `IOUS`. *This finally gives the demo's prettiest screen a real data source.*
- **Settlement seal** (`canonical`, `sealBlock`, `verifyRecord`): **reused** for the once-a-month batch seal.
- **Grace** (`respread`, `GRACE_GRANTED`): **reused** for per-share «أحتاج وقت».
- **Trust band** (`trustSignal`, `TRUST_BAND_AR`): **reused**, enriched by everyday kept/late قيود.
- **Lifecycle** (`fold`, event-sourcing): the قيد uses the **same** append-only pattern.
- **Create-عهد + dual Nafath + record** (Screens 1 & 3): **reused** as the graduation target.
- **New code is thin:** a circle object, a قِسْمة/قيد capture form, the قيود feed + live balance view, the light-acknowledgment screen, and the graduation prompt. The hard math already ships.

### Why this makes Ahd a product *everyone* uses
- **Frequency → habit:** one-off عهد ≈ 2–3×/year. The Standing Circle ≈ weekly (every bill, every grocery run, every order). **This is the retention engine** — the reason the app earns a home-screen spot.
- **Acquisition → virality:** every قِسْمة pulls 1–4 other people into a circle. Households and ربع onboard *each other*. The flat is a 3-seat install.
- **It rescues the best demo screen:** Muqassa today wows judges then dead-ends («وين أضيف ديوني؟»). With circles it becomes a *thing you live in*.
- **It lifts all four personas, born from one:** the family lender gets a household circle, the freelancer a recurring client circle, the organizer a trip circle — but the daily-grind *engine* is سعود's. One feature, four segments, no collision.
- **It funnels into the moat:** lightness on top is the on-ramp; the witnessed عهد underneath is the defensibility. Graduation is the conveyor from one to the other — Ahd grows users *into* its serious product instead of waiting for them to need it.

### Tags & effort (for the later single-session builder)
- **[demo-now] — core slice (~½ day):** one seeded circle «شقة الملقا» → **«+ قِسْمة»** (capture B1) → live **الميزان** (D1) → **«سوّوا الدائرة»** routing into the **existing** Muqassa screen with the captured قيود → **monthly seal**. This alone closes the journey's killer gap and makes Muqassa real on stage. Reuses ~90% existing logic.
- **[v2] — recurring قِسْمة دائمة (~1 day):** the standing scheduler + change/leave handling.
- **[v2] — graduation قَيْد→عهد (~1 day):** threshold/rollover triggers + pre-filled hand-off into the existing create+Nafath flow + provenance link.
- **[v2] — light acknowledgment + dispute states (~½ day):** B2 + the `disputed`/cash-paid/grace edges.

### Hand to Design (not my lane — flagged only)
- The **«دوائري» home** and **لوحة الدائرة** as the new front door (the loan flow demotes to a path inside a circle).
- A visual language that makes a **قيد feel lighter than an عهد** (so the two tiers read instantly — small chip vs. sealed document).
- The قِسْمة capture as a **2-tap, thumb-reachable** sheet (this is the 40×/month surface — every extra tap costs daily use).
- The graduation prompt's tone: an *offer to protect*, never a *demand to formalize*.
