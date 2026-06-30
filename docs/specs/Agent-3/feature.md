# الميزة — «دفتري» + «تذكيرٌ بالمعروف»
**The Creditor's Home + the Bank-Delivered Gentle Nudge**
**Agent 3 · Persona: The freelancer (نايف القحطاني) · عَهد (Ahd)**
*Design + spec only. No code edited. Lane: `12_Consumer/Agent-3/`. Look-and-feel = Claude Design's job later; this is flow + logic + copy.*

---

## 1 · The feature in one breath

A **creditor-first home** inside Ahd called **«دفتري»** (*my ledger*) — every عهد Naif is part of, split into **«لي»** (owed *to* me) and **«عليّ»** (I owe), with status, due date, and an overdue flag, all at a glance — plus **«تذكيرٌ بالمعروف»**: when a debt sits past its date, **Ahd, as the neutral witness, sends a soft, dignified, scripture-grounded reminder to the debtor on Naif's behalf**, with a one-tap path to *grace* (not penalty). Naif gets paid back **without ever becoming the bad guy** — and the whole time he's looking at proof, not screenshots.

Two tightly-coupled halves, one idea: **see what I'm owed; let the bank ask for it kindly.**

---

## 2 · The need — why *Naif* specifically needs this

From `journey.md`, Naif's defining trait among the four personas is that he is a **creditor-in-waiting with scattered debts who refuses to chase.** The current app:

1. Shows **one** agreement at a time → he has 3–4 live debts and no overview.
2. Goes **silent on the creditor's side** right after creation → he's the one who waits, and the app stops talking to him.
3. Auto-settles **only if the debtor acts** → his ghosting client never acts, and the app offers the creditor *no* next move.
4. Makes him choose between **two bad options he already lives with**: send the awkward «وينك؟» text (cheapens him, erodes the friendship) or stay silent (loses the money *and* the friendship).

**The insight that makes this on-spine and warm:** *a reminder from a neutral witness is kinder to the relationship than a reminder from the friend.* When **عهد** says «تذكير بالمعروف»، it isn't Naif being needy — it's the bank doing what both parties already agreed it would do at signing. The bank absorbs the awkwardness. Naif keeps the friendship *and* gets paid. That is the qard-hasan soul — *"your word, honored; your relationship, protected"* — finally extended to the **person waiting to be repaid.**

---

## 3 · Where it lives & how you reach it

A new **persistent home tab** — **«دفتري»** — reachable from anywhere (not buried in a single agreement). In the demo's step model it sits *outside* the linear 0→5 flow as a standing screen (think: a 📔 button in the header). Conceptually it is the screen Naif opens on a Tuesday with no agreement in mind.

> **Hand to Design:** a header entry point (icon + label «دفتري»), and a small unread/overdue indicator dot when something needs attention. Visual language only — logic is below.

---

## 4 · The full flow, screen by screen (described, not styled)

### Screen A — «دفتري» (the home / portfolio)

**Top:** two soft summary tiles (reuse the existing `.stat` pattern), each a plain Arabic phrase, **never a credit-looking number-on-a-pedestal**:

- Tile «لي» (owed to me): **«لك عند الناس»** — `<مبلغ> ر.س · <عدد> عهود`
- Tile «عليّ» (I owe): **«عليك للناس»** — `<مبلغ> ر.س · <عدد> عهود`

**Two tabs:** **«لي»** (default — this is the freelancer; his world is what he's owed) · **«عليّ»**.

**Under «لي»**, a list — one row per عهد where Naif is the lender/creditor. Each row reuses the existing `.inst` / `.doc` visual grammar and shows:

- Counterparty name + first-letter avatar (existing `.ava`).
- The amount and what's left: **«٢٬٥٠٠ ر.س · باقٍ كامل»** / **«١٬٢٠٠ ر.س · باقٍ ٦٠٠»**.
- A **status chip** reusing the existing `statusBadge()` words exactly (no new vocabulary):
  - On track / not yet due → **«نشِط»** (ok / teal).
  - Settled → **«ذمّة محفوظة — وُفِّي به»** (ok / gold).
  - Rescheduled by grace → **«مؤجّل بالتراضي»** (gold).
  - Past its date → **«عليه وعدٌ متأخّر»** (gold — *warm amber, never red/danger*; late is not a crime).
  - In dispute → **«محلّ خلاف — للقضاء»** (the existing DISPUTED state).
- A **due line**: **«القسط القادم: ١ يوليو»** or, when overdue, **«تأخّر عن ١ يونيو — ١٨ يومًا»** *(the day-count is shown to **Naif only**, as information for his decision — it is **never** shown to the debtor and **never** drives a fee; see §6).* 

**Sort order** (deterministic, no `Date.now`): overdue first (by days overdue desc), then due-soon, then on-track, then settled. So the thing needing attention is always on top.

**Empty state** (Naif has no عهود yet): **«دفترك نظيف. أول ما تكتب عهدًا — قرضًا لك أو عليك — يظهر هنا، محفوظًا.»**

**Tapping a row** → opens that عهد's existing sealed-record view (Screen 3 of the current app). *Nothing re-implemented — دفتري is an index over records that already exist.*

---

### Screen B — the row action sheet (what Naif can do about one debt)

Tapping the **«…»** on an overdue «لي» row opens a small sheet. **Every option is dignity-preserving by construction — there is deliberately no "send angry reminder" anywhere.** Options:

1. **«تذكيرٌ بالمعروف 🤍»** — *(primary; only shown when due/overdue)* → Screen C.
2. **«اطمئن، أمهِله» (do nothing yet)** — closes; Ahd will keep the gentle cadence if auto-reminders are on.
3. **«اقترِح إعادة جدولة» (offer to reschedule)** — routes into the **existing grace branch** (`graceReschedule()` from Screen 4): Naif *proactively offers* the debtor more time. Beautiful inversion — the creditor extending mercy *first*, 2:280 made social.
4. **«أبرئ ما تبقّى» (forgive the remainder)** — صدقة; routes to the existing **FORGIVEN** state. Copy: **«تتصدّق بما تبقّى؟ ﴿وأن تصدّقوا خيرٌ لكم﴾ — يُسجَّل إبراءً، ويُشكر له.»**
5. **«صدّر السجلّ» (export the sealed record)** — only after the gentle ladder is exhausted (see §6); routes to the **existing escalation/export** path (court-ready evidence). Copy is sober, never threatening: **«تصدير الوثيقة المختومة — مهيّأةٌ كدليلٍ إلكتروني، إن احتجت.»**

---

### Screen C — «تذكيرٌ بالمعروف» (compose & send the gentle nudge)

This is the heart. Naif does **not** write the message — that's the point; writing it is the awkward part. **Ahd pre-writes it**, warm and neutral, and Naif just confirms. He picks a *tone tier* (all kind; he cannot be harsh):

**Tier 1 — «تذكيرٌ ودود» (friendly reminder)** — default:
> **عهد · تذكيرٌ بالمعروف**
> «السلام عليكم 🤍 — تذكيرٌ لطيف فقط: عهدُك مع نايف (٢٬٥٠٠ ر.س) موعده كان ١ يونيو. لا عجلة ولا مطالبة — متى ما تيسّر. وإن احتجت وقتًا، عهد يعيد الجدولة بالمعروف، بلا أيّ زيادة.»
> *[زرّان للمستلِم: «أسدّد الآن عبر سريع» · «أحتاج وقت 🌿»]*

**Tier 2 — «تذكيرٌ بعد طول انتظار» (after a long wait)** — only unlockable after Tier 1 + a cooldown:
> «تذكيرٌ ثانٍ بالمعروف من عهد: لا يزال عهدُك مع نايف (٢٬٥٠٠ ر.س) قائمًا. نعلم أنّ الظروف تختلف — اختر ما يناسبك: السداد، أو طلب مهلة، ودون أيّ حرج. ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.»
> *[نفس الزرّين]*

**Critically — what the message is and isn't:**
- **From «عهد»، not from Naif.** The sender is the neutral witness. Naif's name appears only as a fact of the record, never as «نايف يطالبك».
- **No day-counter, no «متأخّر ١٨ يومًا», no «مستحق فورًا».** The debtor never sees a shaming clock.
- **No amount of "extra."** The figure is always the original principal/remainder — *zero* riba, *zero* late fee, by construction (it reuses the sealed terms; there is no field where a surcharge could exist).
- **Always carries the exit.** Every reminder includes the «أحتاج وقت» button that routes to grace. The nudge and the mercy ship together.

**After Naif confirms:** Ahd shows him a quiet receipt — **«أرسل عهد تذكيرًا لطيفًا بالنيابة عنك 🤍 — بقي الأمر بينك وبينه على خير.»** He did not have to be the bad guy. That sentence is the product for him.

**The debtor's side of the reminder** is the same warmth the app already uses in Screen 2 («وصلتك بسلامة»): the note arrives as *care*, with the two soft buttons:
- **«أسدّد الآن عبر سريع»** → fires the existing `settleNext()` sarie settlement.
- **«أحتاج وقت 🌿»** → fires the existing `graceReschedule()` — reschedule, no penalty, Naif informed kindly with the existing face-saving copy.

---

### Screen D — «النيابة في التذكير» (set-and-forget auto-reminders) — *[v2 part]*

At signing (or later from a row), the creditor can opt **once** into letting Ahd handle reminders automatically, so Naif never even has to open Screen C:

> **«تخلّى عهد عن التذكير نيابةً عنك؟»**
> «إن تأخّر السداد، يرسل عهد تذكيرًا لطيفًا واحدًا، ثم — بعد مهلةٍ — تذكيرًا ثانيًا، ثم يتوقّف ويعود إليك. لا إلحاح، لا غرامة، لا مطالبة. أنت تقرّر بعدها.»
> *[تشغيل · إيقاف]* — **default OFF** (consent-first; the bank never nudges anyone's contacts without explicit opt-in).

**The escalation ladder (gentle, finite, merciful — never punitive):**
`due → (cadence) Tier-1 reminder → cooldown → Tier-2 reminder → STOP → hand back to Naif` with the three non-punitive choices (keep waiting · forgive · export). **There is no automatic penalty, no automatic dispute, no automatic anything-harsh** at the end of the ladder. Mercy is the default terminal state; the courtroom is a *manual, last-resort, creditor-chosen* door.

---

### Screen E — «سجلّ وفائي» (show my own record) — *the reliability piece, owner-controlled*

Naif's own asset he currently can't prove. Two halves:

1. **Naif sees his own trust band** (reusing the existing `trustSignal()` → `TRUST_BAND_AR` words: «وفّى بعهوده» etc.) at the top of the «عليّ» tab. His own mirror, computed from his own sealed history. **Never a number, never a score** — the existing qualitative band only.
2. **«أظهر سجلّ وفائي» (share my record)** — an **opt-in, owner-initiated** badge Naif can attach when he proposes a new عهد, e.g. to a new client who wants 50% upfront: *"here's that I keep my word."* It shows **only the qualitative band word**, only **with Naif's explicit tap to share**, and is **owner-pushed, never counterparty-pulled** — i.e. nobody can look Naif up; Naif chooses to show it.

> ⚠️ **Spine guardrail (flagged for the spine-keepers):** the trust signal in the engine is documented as *own-history only, never exported, never underwrites.* Screen E stays inside that rule because it is **owner-initiated disclosure of one's own band**, not the bank exporting or anyone querying a third party. **No "check his reliability before you lend" pull is built** — that would breach no-export. The reliability value Naif wants ("know who's reliable before lending") is met *only* through what each person chooses to show about *themselves*. **This piece is `[v2]` and should get a Shariah/privacy sign-off before build.**

---

## 5 · Exact Arabic copy — the strings a builder can paste

**دفتري — home**
- Tab labels: `لي` · `عليّ`
- Summary tiles: `لك عند الناس` · `عليك للناس`
- Empty: `دفترك نظيف. أول ما تكتب عهدًا — قرضًا لك أو عليك — يظهر هنا، محفوظًا.`
- Due line (on track): `القسط القادم: ١ يوليو`
- Due line (overdue, Naif-only): `تأخّر عن ١ يونيو`  *(day-count optional, Naif-only, informational)*
- Status chips (reuse existing): `نشِط` · `ذمّة محفوظة — وُفِّي به` · `مؤجّل بالتراضي` · `عليه وعدٌ متأخّر` · `محلّ خلاف — للقضاء`

**Row action sheet**
- `تذكيرٌ بالمعروف 🤍` · `اطمئن، أمهِله` · `اقترِح إعادة جدولة` · `أبرئ ما تبقّى` · `صدّر السجلّ`
- Forgive: `تتصدّق بما تبقّى؟ ﴿وأن تصدّقوا خيرٌ لكم﴾ — يُسجَّل إبراءً، ويُشكر له.`
- Export: `تصدير الوثيقة المختومة — مهيّأةٌ كدليلٍ إلكتروني، إن احتجت.`

**Reminder — Tier 1 (from عهد, to the debtor)**
`السلام عليكم 🤍 — تذكيرٌ لطيف فقط: عهدُك مع نايف (٢٬٥٠٠ ر.س) موعده كان ١ يونيو. لا عجلة ولا مطالبة — متى ما تيسّر. وإن احتجت وقتًا، عهد يعيد الجدولة بالمعروف، بلا أيّ زيادة.`

**Reminder — Tier 2**
`تذكيرٌ ثانٍ بالمعروف من عهد: لا يزال عهدُك مع نايف (٢٬٥٠٠ ر.س) قائمًا. نعلم أنّ الظروف تختلف — اختر ما يناسبك: السداد، أو طلب مهلة، ودون أيّ حرج. ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.`

**Debtor's two buttons:** `أسدّد الآن عبر سريع` · `أحتاج وقت 🌿`

**Naif's receipt after sending:** `أرسل عهد تذكيرًا لطيفًا بالنيابة عنك 🤍 — بقي الأمر بينك وبينه على خير.`

**Auto-reminder opt-in (Screen D):** `إن تأخّر السداد، يرسل عهد تذكيرًا لطيفًا واحدًا، ثم — بعد مهلةٍ — تذكيرًا ثانيًا، ثم يتوقّف ويعود إليك. لا إلحاح، لا غرامة، لا مطالبة. أنت تقرّر بعدها.`

**Share-my-record (Screen E):** `أظهر سجلّ وفائي` → badge word only, e.g. `وفّى بعهوده`.

---

## 6 · States & edge cases

| Case | Behavior — always merciful, never shaming |
|---|---|
| Debt **on track / not yet due** | Row shows «نشِط» + due date. Reminder action hidden. |
| Debt **just past date** | Chip → «عليه وعدٌ متأخّر» (amber, not red). «تذكيرٌ بالمعروف» becomes available. Day-count visible to **Naif only**. |
| Debtor **taps «أسدّد الآن»** | Existing `settleNext()` sarie flow → row → «ذمّة محفوظة». |
| Debtor **taps «أحتاج وقت»** | Existing `graceReschedule()` → «مؤجّل بالتراضي», remainder re-spread, **Σ unchanged (no riba)**, Naif informed with face-saving copy. |
| Debtor **ignores all reminders** | Ladder ends after Tier 2 → **STOP**. No auto-penalty, no auto-dispute. Hand back to Naif with: keep waiting · forgive · export. |
| Naif **tries to send too often** | Cadence cap (e.g. min cooldown between reminders). Tier 2 is gated behind Tier 1 + cooldown. The product *protects the debtor from Naif's frustration.* |
| Naif **is the debtor** («عليّ» tab) | He sees what he owes, due dates, and can proactively «أسدّد» or «أطلب مهلة» — dignity for him too. |
| Debt is **disputed** by the debtor | Routes to existing **DISPUTED** state; reminders pause. «عهد يكتب ويشهد ويحفظ، ولا يحكم.» |
| Debtor has **no sarie autopay set up** | «أسدّد الآن» initiates a one-tap transfer within the existing sarie limit; if over limit, falls to manual — the reminder still did its job (got them to act). |
| **No debts at all** | Clean empty state; no fake numbers. |
| **Determinism** (demo) | Overdue computed against a fixed `AS_OF` constant (matching `TRUST_CFG.AS_OF` style), **never `Date.now()`** — preserves the prototype's determinism invariant. |
| **Privacy** | Naif sees only عهود he is a party to. No third-party lookup. Trust band is own-history; sharing is owner-initiated only. |

---

## 7 · On-spine + Shariah check

| Spine / Shariah rule | How «دفتري» + «تذكير بالمعروف» honors it |
|---|---|
| **Bank lends nothing** | دفتري only *indexes* عهود between people; the bank moves no principal of its own. ✅ |
| **Bank judges nothing** | Reminders are neutral notices, not verdicts. Disputes route to the existing DISPUTED/court path; Ahd «لا يحكم». ✅ |
| **Bank charges nothing on the loan** | The reminder carries the **original** amount only. There is *no field* in the flow where a late fee or surcharge could exist. ✅ (A flat *service* fee, if ever, would be on the rail — never on the debt — consistent with the existing riba rule engine's `fix` copy.) |
| **No riba / maysir / gharar** | No interest, no late penalty (penalty = riba, explicitly blocked by the existing `RIBA_RULES`); amount is fixed and known (no gharar); no chance/speculation. ✅ |
| **2:282 (write the debt)** | This is literally the verse Naif quotes — *write down the debt for its fixed term.* دفتري makes "the written record" a living home, not a one-time act. ✅ |
| **2:280 (grace for the struggling)** | Every reminder ships with «أحتاج وقت» → grace; forgiveness is a first-class action; the ladder *ends in mercy*, not punishment. ✅ |
| **AI issues no fatwa** | Reminder copy is fixed, human-written templates — not AI-generated rulings. The riba check stays the existing deterministic rule engine. ✅ |
| **Trust signal ≠ credit score** | Qualitative band words only, own-history, owner-initiated sharing, never exported/pulled/underwritten. Reliability "before lending" is met *only* via self-disclosure. ✅ (flagged for sign-off) |
| **No shaming / no penalty mechanic** | No day-counter to the debtor, no red, no public exposure, no auto-escalation, frequency-capped. The neutral-witness framing makes the nudge *less* shaming than the status quo (the friend texting). ✅ |

**The one thing to watch (flagged honestly):** the *frequency and tone* of reminders is where this could drift toward harassment if mis-built. The spec defends against it structurally — bank-as-sender, fixed warm templates, hard cadence cap, mercy always attached, finite ladder, owner cannot author harsh text. Keep those guardrails non-negotiable at build time.

---

## 8 · How it composes with what already exists (almost nothing new is invented)

- **Rows** = existing sealed records (Screen 3). دفتري is an *index*, not a new record type.
- **Status chips** = existing `fold()` / `statusLabel()` / `statusBadge()` vocabulary — zero new states.
- **«أسدّد الآن»** = existing `settleNext()` sarie settlement.
- **«أحتاج وقت» / «اقترِح إعادة جدولة»** = existing `graceReschedule()` — *reused on both sides* (debtor asks; creditor offers).
- **«أبرئ»** = existing **FORGIVEN** state.
- **«صدّر السجلّ»** = existing escalation/court-export path.
- **Reliability band** = existing `trustSignal()` + `TRUST_BAND_AR`.
- **Seed data already supports it:** `SEED_AHDS` (متعثّر / محلّ خلاف / أُبرئ) can populate دفتري immediately — the demo's "other عهود" toggle becomes a *real* home.

**Net new to build:** one list/index screen, one action sheet, the reminder compose+templates, an overdue sort, and (v2) the auto-cadence + self-disclosure. The hard machinery (seal, settle, grace, trust, states) is **all reused.**

---

## 9 · The case — why this makes Ahd a product *everyone* uses

- **Retention / frequency (the big one):** the current app is event-driven — you open it the day you make a loan, then forget it. **دفتري is habit-driven.** Naif opens it *weekly* to see what he's owed — the way people open their banking app to check balance. This is the single change that converts Ahd from "a thing I used once" to "a thing on my home screen." A creditor home is the **retention spine** Ahd currently lacks.
- **It completes the loop the app already starts.** Ahd brilliantly handles *create → witness → settle*. But "settle" silently assumes the debtor pays on time. دفتري + تذكير is the missing **"…and what happens when they don't"** — answered with mercy instead of a void.
- **It's not just for freelancers.** Everyone is owed money by someone and hates to ask. The parent owed by an adult child, the flatmate owed for last month's bills, the organizer owed by stragglers — **all of them inherit "let the bank ask, kindly."** Naif's feature is the **awkwardness-eliminator for every persona.** (It dovetails especially with Agent 4's group collections: a circle treasurer chasing stragglers is the same need at scale.)
- **Trust payoff:** the neutral-witness reminder is a genuinely new social primitive — it makes *asking for your money back* halal, gentle, and relationship-safe. That's a sentence no competitor can say, and it's pure qard-hasan soul.
- **Proof, finally usable:** the seal/verifier Naif loved becomes *operational* — not a clever demo toggle, but his actual receivables vault, court-ready if it ever must be.

---

## 10 · Build tag & effort

- **`[demo-now]` — the core:** the **«دفتري» home** (two tabs, summary tiles, rows over `SEED_AHDS`, overdue sort) + **one «تذكيرٌ بالمعروف» interaction** (Screen C, Tier 1 template, the two debtor buttons routing into existing `settleNext()` / `graceReschedule()`). This is mostly **reuse + one new screen + copy**, fully on the existing engine. **Effort: ~M** (one focused build session; no new core logic — an index view, a sort, a template, and wiring to functions that already exist).
- **`[v2]` — the depth:** auto-reminder cadence + escalation ladder (Screen D), the proactive creditor-offers-grace path, and **«سجلّ وفائي» self-disclosure** (Screen E — *gate behind Shariah/privacy sign-off*). **Effort: ~M–L**, and the v2 reliability piece needs a spine review before build.

> **One-line pitch for the demo:** *"Ahd already witnesses the loan and settles it. **دفتري** is the part the freelancer actually lives in — every riyal he's owed, in one place, and when someone's late, **the bank asks for it gently on his behalf, so he never has to.** Your word, honored — and your money, returned, without losing the friend."*

---

### Notes handed to Claude Design (look-and-feel only)
- Header entry point for «دفتري» (📔) with a soft overdue indicator dot.
- Amber, never red, for «عليه وعدٌ متأخّر» — late is gentle, not alarming.
- The reminder should *read like a message from a kind third party*, visually distinct from a banking alert — warm, BCQ-style (`.ayah` family), not transactional.
- Summary tiles as plain phrases, not score-pedestals — reinforce "this is a ledger, not a rating."

*— Agent 3, as Naif Al-Qahtani. End of spec.*
