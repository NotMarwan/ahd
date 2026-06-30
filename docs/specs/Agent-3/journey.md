# رحلة المستخدم — نايف · The Freelancer's Journey
**Agent 3 · Persona: The freelancer / small earner · عَهد (Ahd)**
*Design + persona research only. No code edited. Lane: `12_Consumer/Agent-3/`.*

---

## 0 · مَن هو نايف؟ — Meet the person (not "a user")

**نايف القحطاني · Naif Al-Qahtani · 29 · الرياض.**

Naif is a freelance motion/graphic designer. He cuts wedding videos, makes logos for small cafés and online stores, and does the occasional reels package for a clinic. He is good. He is also, financially, **always slightly off-balance** — not poor, just *lumpy*.

A typical quarter:
- A wedding package lands **8,000 ر.س** in one week → he feels rich.
- Then three quiet weeks. مايو كان ميت (May was dead).
- A café client owes him **2,500 ر.س** for a logo + menu he delivered *last month*. Every time he asks: «إن شاء الله الأسبوع الجاي». It's been four "next weeks."
- His cousin سلطان borrowed **1,200 ر.س** for a car repair — «أرجّعها لك أول ما ينزل الراتب». That was two salaries ago.
- A friend, عبدالله, took **600 ر.س** the night they traveled. Naif has honestly half-forgotten, and feels weird bringing up 600 riyals.
- Meanwhile **Naif himself owes** his older brother فهد **3,000 ر.س** from a slow month. فهد has never once asked. That silence makes Naif feel it *more*, not less.

**What Naif is owed right now, scattered across his head and his WhatsApp:** roughly **4,300+ ر.س** across 3–4 people. **What he owes:** 3,000 to one person. He could not tell you these numbers without scrolling chats. He has no ledger. His "records" are WhatsApp screenshots and memory.

### His money personality
- **He is the one who WAITS.** His defining financial emotion is not "should I lend?" — it's *"متى بترجع لي فلوسي؟"* (when do I get my money back?). He is structurally a **creditor-in-waiting**.
- **He hates being the bad guy.** Chasing money makes him feel cheap, needy, جشِع. So he *doesn't* chase — and then quietly resents it, and the friendship erodes anyway. The non-ask costs him the relationship *and* the money.
- **He's been burned and had no proof.** Last year a client ghosted on **4,000 ر.س**. All Naif had was chat screenshots and a feeling. He didn't even know if those would count anywhere. He never saw that money.
- **He's pious and anxious about it.** «هل هذا حلال؟» runs under everything. He will not touch anything that smells like ربا, even a "late fee" in his own favor.
- **He lives on his phone, distrusts paperwork.** STC Pay, mada, WhatsApp. If a thing takes more than a screen, he won't finish it.
- **He has good standing he can't prove.** Naif *always* pays فهد back eventually. He is reliable. But there is nowhere that *shows* he's reliable — so a new client treats him like a stranger, and asks for 50% upfront, which strains his lumpy cash.

> Naif's one-line summary of his money life: **"كل فلوسي عند الناس، وأنا أكره أطالب."**
> *("All my money is with other people, and I hate to ask for it.")*

---

## 1 · نايف يفتح التطبيق — walking the prototype as Naif

I opened `project/ahd-demo/index.html` and went screen by screen **as Naif** — what lights him up, where he hesitates, where he'd quit, what he wishes existed.

### Screen 0 — «أكثر تعاملٍ ماليٍّ شيوعًا… بلا منتج» (the problem)
**يضيء (lights up).** He reads *58.6% من طلبات التنفيذ سنداتٌ لأمر* and freezes. **هذا أنا.** He remembers the 4,000 client. He remembers standing in front of ناجز confused. Someone finally named *his* exact pain.

He reads the آية البقرة ٢٨٢ — «إذا تداينتم بدينٍ إلى أجلٍ مسمًّى فاكتبوه» — and something settles in him: *this isn't me being cheap, this is literally the longest verse in the Qur'an telling me to write the debt down.* The shame lifts a little. This is huge for Naif specifically — it reframes "asking for my money" from جشَع to دين.

**يتردّد (hesitates).** Then the next line: «لنبدأ — قرضٌ بين صديقتين». A loan that نورة *gives*. And his stomach does the familiar thing:

> *«حلو… بس أنا مو نورة. أنا مو اللي أعطي وأنا مبسوط. أنا اللي ينتظر فلوسه ويعض على شفته.»*
> *("Nice… but I'm not Noura. I'm not the one happily giving. I'm the one waiting for his money, biting his lip.")*

He's not sure yet if this app is *for the giver* or *for the one who's owed.*

### Screen 1 — إنشاء العهد + فاحص الربا (create + riba linter)
**يضيء.** The riba linter is *exactly* his anxiety, handled. He types a fake «غرامة تأخير ٥٪» and watches Ahd **block it** and offer the halal alternative «نظرة إلى ميسرة». His shoulders drop. *لو كل شي حلال صار أهون.* For a piety-anxious user this single interaction earns enormous trust.

He can imagine using this the day he lends سلطان the 1,200 — قرض حسن، مكتوب، حلال. Good.

**يتردّد.** But the whole screen is authored from the **giver's** chair: "نورة تُقرض"، "أرسِل العهد". His instinct goes hunting for a button that isn't there:

> *«وين الزر اللي يقول: فلان يدين لي، وأبي أوثّقه؟»*
> *("Where's the button that says: someone owes ME, and I want to record it?")*

The café client owes him for *work already delivered*. The friend owes him an old float. Those debts already exist — Naif doesn't want to "lend," he wants to **write down a debt that's already real** (which is *exactly* what 2:282 is about — كتابة الدَّين). The create flow assumes money flows out *now*, from him, generously. His reality is the inverse.

### Screen 2 — «وصلتك بسلامة» (borrower receipt)
**يضيء (for the future lend).** The borrower receives the deed as **أمانة، لا مطالبة**. Beautiful. The day he lends سلطان, this is how he'd want سلطان to feel — no إحراج. He notices Ahd is *protecting the borrower's dignity*, and thinks: *if Ahd is this gentle to the one who owes, maybe it can ask on my behalf gently too.* (Seed of the wish.)

**يتردّد.** After سارة confirms, نورة — the creditor — simply… disappears from the story. The flow has *nothing for the person waiting to be paid.* That's the chair Naif lives in, and the app empties it right after creation.

### Screen 3 — الإشهاد + التحقّق من العبث + حالات أخرى (Nafath seal + tamper verifier + seed عهود)
**يضيء بقوّة (lights up hard — this is his moment).** He presses **«🧪 جرّب العبث بالمبلغ»**, changes 5,000 → 9,000, presses تحقّق, and watches the seal scream **«✗ عبثٌ مكشوف!»**.

> *«يا الله. لو كان عندي هذا قبل سنة… العميل اللي نكر الأربعة آلاف، كان ما قدر ينكر.»*

This is **proof** — the thing he never had. And then «مهيّأة كدليل إلكتروني · نظام الإثبات ٢٠٢٢». For a guy who once stood helpless at ناجز with screenshots, this is the single most reassuring sentence in the app.

Then the **seed عهود** toggle: he opens it and sees a **متعثّر** case — *"تعثّر بعد مهلةٍ بالمعروف — بلا غرامة؛ السجلّ مهيّأٌ للقضاء عند الحاجة."* and a **محلّ خلاف** case — *"«عهد» يكتب ويشهد ويحفظ، ولا يحكم."* He exhales. If it goes bad, he has a clean, court-ready record **and no riba on it**. The structure he's been missing.

**يتردّد — and this is the key gap he feels.** These other عهود are shown as a **demo toggle inside the seal screen**, three example cards. His brain immediately wants the *real* version of this:

> *«طيب… وين دفتري أنا؟ وين أشوف كل العهود اللي لي — مين دفع، مين تأخّر، مين باقي — بدون ما أفتح كل وحدة لحالها؟»*
> *("Okay… but where's MY ledger? Where do I see all the عهود owed to me — who paid, who's late, who's left — without opening each one separately?")*

He's looking at a beautiful single-record viewer and a 3-card demo, and he wants a **home base** for everything he's owed. It isn't there.

### Screen 4 — السداد عبر سريع + «أحتاج وقت» (auto-settle + grace)
**يضيء (both sides).**
- As the one owed: «يُسوّي عهد الأقساط تلقائيًا — بلا تذكير محرج». The dream sentence. *Money comes to me without me having to text anyone.* This is the promise he wants — but he immediately senses the catch (below).
- As the one who owes (his 3,000 to فهد): **«🌿 أحتاج وقت»** → reschedule **بلا غرامة**, with face-saving copy to the lender. *لو كان هذا موجود وقت الشهر الميّت، كان طلبت مهلة من أخوي بكرامة بدل ما أتهرّب.* On a tight month he'd actually *use* this instead of going silent.

**يتردّد / would-quit risk.** The catch hits him:

> *«التسوية تلقائية… بس بس لو الطرف الثاني ركّب التحويل. عميلي اللي يماطل، ما راح يركّب شي. الفلوس ما بتتحرّك لحالها. وأنا… أنا وش أسوي؟ أنتظر بصمت زي العادة؟»*

The auto-settle assumes the debtor *set up* the sarie transfer. For Naif's **ghosting café client**, no transfer exists, so the money never moves — and the app, so attentive to the *borrower* (it offers him «أحتاج وقت»), offers **the creditor nothing**: no visibility into "is this just late or am I being ghosted?", no gentle way to prompt, no next step. The screen is single-agreement, so even if 4 people owe him, he's flipping between 4 timelines with no overview of *who's due this week, who's overdue.*

This is the exact moment Naif's old helplessness comes back — and the app, which had been so good, **goes quiet on his side precisely when he needs it.**

### Screen 5 — المقاصّة + حلقات الثقة (Muqassa + trust rings)
**يضيء (one specific thing).** He sees the reputation rings — **«وفّى بعهوده»**, **«جديد»**, **«عليه وعدٌ متأخّر»** — qualitative, not a score. And he has two instant reactions:

1. *«هذا اللي أبيه أشوفه قبل لا أقرض سلطان — مو بعد ما تتلخبط الأمور.»* He wants reliability **before** he commits, not buried at the end of a circle demo.
2. *«وأنا — وين سمعتي أنا؟ أنا دايمًا أرجّع لأخوي. ليش ما أقدر أوريها للعميل الجديد عشان ما يطلب نص المبلغ مقدّم؟»* He wants to **show his own good record** as a trust gesture — it's an asset he currently can't prove.

**يتردّد.** The Muqassa netting itself is clever, but **his life isn't a tidy ring of 5 friends** who all owe each other. It's a *scattered list of one-off debts* — a café, a cousin, a travel buddy, a brother — that will never net into a neat circle. Muqassa is the **organizer's** home (Agent 4), not his. For Naif it's a beautiful screen that isn't shaped like his problem.

---

## 2 · ما الذي ينقص نايف؟ — The one missing thing

Walking it as Naif, the pattern is unmistakable. The app is **excellent at the single transaction, authored from the giver-then-wait point of view.** But Naif's entire money life is the part the app keeps emptying:

| Naif's reality | What the app gives him |
|---|---|
| He's owed by **several** people at once | One agreement on screen at a time |
| He's a **creditor who waits** | A flow that ends for the creditor right after creation |
| He **hates chasing** but the money won't move on its own | Auto-settle that only fires if the *debtor* set it up; **nothing** for the creditor when they don't |
| He needs **proof + structure** | ✅ He actually gets this (the seal/verifier) — the one need fully met |
| He wants to know **who's reliable**, up front | Trust signal shown only at the very end, about a fixed demo circle |
| He wants to **prove his own** reliability | No way to surface his own good record |

There is **no "my side" home** in Ahd. No place Naif opens on a Tuesday to see *who owes me, how much, what's due, who's late* — and no dignified way to get a quiet debtor to move **without Naif becoming the bad guy.**

> ### The missing thing (spec'd in `feature.md`):
> **«دفتري» — a creditor's home (everything owed to me / by me at a glance) + «تذكيرٌ بالمعروف» — the bank, as neutral witness, sends the gentle nudge *on Naif's behalf*, so he gets paid back with dignity and never has to send the awkward «وينك؟» text.**

It's the feature that turns Ahd from *"a beautiful way to record one loan"* into **Naif's accounts-receivable, his proof vault, and his awkwardness-eliminator — the thing he opens every week.**

— *Agent 3, as Naif. On to `feature.md`.*
