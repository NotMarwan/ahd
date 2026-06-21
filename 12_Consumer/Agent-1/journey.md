# Agent 1 — Journey: The Young Renter / Flatmate

> Persona walkthrough of `project/ahd-demo/index.html`. I am one specific person, not "users."
> Goal: find the **one** missing thing that flips this person from "nice demo" to "I open Ahd every week."

---

## 1 · Meet سعود — becoming him, fully

**سعود الشهري، ٢٤ سنة.** First job out of college — junior at a mid-size company in Riyadh, take-home ≈ **٧٬٠٠٠ ر.س/شهر**. Shares **«شقة الملقا»** (a 3-bedroom flat in north Riyadh) with two roommates: **تركي** (his college friend) and **عبدالله** (تركي's cousin, he barely knew him before the lease). Lives on his phone: mada + Apple Pay, STC Pay, جاهز/HungerStation most nights, splits everything.

### His real money life (this is the whole point)
سعود does not make 5,000-riyal loans. سعود makes **twenty 50–300 riyal floats a month**, and they're all tangled with people he has to see at breakfast:

- **الإيجار:** ٣٬٦٠٠ ر.س total, due on the 1st. The contract is in تركي's name, so تركي pays the landlord and the other two owe him **١٬٢٠٠ each**. Every month.
- **الفواتير:** الكهرباء + الماء land on عبدالله's account; the النت (STC) is on سعود's card. Each of them is "the one who paid" for a different bill, so nobody's even — ever.
- **البقالة:** whoever's at بنده/التميمي that day pays the whole basket (٢٠٠–٤٠٠) and says *«احسبوها وأنا أقسّمها عليكم»*. It never gets split. It just… evaporates.
- **طلبات جاهز:** one card pays the group order, everyone "will send their share later." Later never comes.
- **الفزعات الصغيرة:** *«طوّف عليّ ٣٠٠ لين الراتب»* between him and تركي, both directions, constantly.

### The tool he uses today (and why it's broken)
A **Notes-app list** titled *«اللي لي واللي عليّ»* that is always out of date, that he's embarrassed to open in front of the guys, and that he eventually deletes because chasing ٨٥ ريال from a friend feels worse than eating the ٨٥ ريال. So he eats it. Resentment quietly accrues. **This is the exact pain Ahd claims to solve — at exactly the scale Ahd's demo never touches.**

### Why سعود is the hardest test for Ahd
Every number in the prototype is **big, formal, and one-off**: نورة يقرض سارة ٥٬٠٠٠ ريال، عقد، بصمة نفاذ، وثيقة مختومة. سعود's life is **small, casual, and relentless**. If Ahd is only worth the ceremony when the amount is big, سعود will admire it once and never come back. The question his whole segment asks is: **"وين حياتي اليومية في هذا التطبيق؟"**

---

## 2 · Walking the app as سعود — screen by screen

### Screen 0 — «أكثر تعاملٍ ماليٍّ شيوعًا… بلا منتج»
**Lights up.** *«إيه والله — هذا أنا بالضبط. هذا اللي أسوّيه كل يوم وأنا أكره إني أطالب.»* The headline names his life.

**…then hesitates.** The stats are محاكم التنفيذ، سندات لأمر، ١١٥ مليار ريال. *«بس هذي مشاكل ناس ديونهم كبيرة وراحت المحكمة. أنا ديوني صغيرة وكثيرة، ما أبي أوصّل أحد للمحكمة — أبي بس أعرف مين عليه كم.»* The problem framing is for the **creditor with a big claim**, not the flatmate with forty tiny ones. He's still in, but he's quietly waiting to see *his* size of money.

### Screen 1 — إنشاء العهد (نورة تُقرض سارة ٥٬٠٠٠)
**Hesitates hard.** *«خمسة آلاف؟ أنا عمري ما أقرض أحد خمسة آلاف دفعة وحدة. أنا أحسب البقالة بـ ٨٥.»* The ALLaM Arabic terms are genuinely beautiful — *«يُقِرّ الطرفان…»* — but they read like a **contract**, and you don't write a contract for *«نصيبك من الكهرباء ٢٠٠ ريال»*. The riba linter (try adding «غرامة تأخير ٥٪») impresses him intellectually but is irrelevant to his life — nobody charges their roommate late fees; they just get annoyed.

**Inner voice:** *«حلو، بس هذا حق صفقة كبيرة. ما هو حق طلبات جاهز.»*

### Screen 2 — «وصلتك بسلامة 🤍» (the borrower receives it)
**Lights up — emotionally.** This is the warmest screen. *«ما يجي على شكل مطالبة، يجي على شكل أمانة. حلو.»* The dignity is exactly what's missing from his Notes-app shakedowns. He files it under "nice," but it's still wrapped around one big loan.

### Screen 3 — الإشهاد عبر نفاذ → الوثيقة المختومة
**Would quit (for daily use).** The tamper-evident SHA-256 record is the most *impressive* thing in the app — *«وثيقة ما تنعبث فيها، يستند لها القاضي. قوي.»* — and simultaneously the **wall** for سعود's real life:

> *«أوثّق ببصمة نفاذ، الطرفين، وثيقة مختومة… عشان ٨٥ ريال بقالة؟ مستحيل. لين أخلّص الخطوات يكون عدّى الأسبوع.»*

The ceremony that makes Ahd legally serious is precisely what makes it **unusable forty times a month**. For a real ٥٬٠٠٠ loan he'd happily do it. For his actual daily money, this is where he closes the app.

### Screen 4 — السداد التلقائي + «أحتاج وقت» (يُسر / 2:280)
**Lights up — this is real.** سعود *has been* the broke roommate at month-end. The «أحتاج وقت» grace — reschedule بالمعروف، لا غرامة، ﴿فنظرة إلى ميسرة﴾ — lands hard. *«هذا اللي أحتاجه أكون فيه الطرفين: مرة محتاج مهلة، ومرة عطيت مهلة.»* But again: it's grace on **one tracked loan**, not on the messy rolling tab that is his actual relationship with تركي.

### Screen 5 — المقاصّة (٥ أصدقاء، ديون متشابكة → تحويلين)
**Lights up the HARDEST. This is the moment.**

> *«لا لا لا — هذا بالضبط شقتنا!! خمسة ملفّين ديون، ونطلع بتحويلين بس. هذا اللي أحاول أسوّيه بالـ Notes كل شهر وأفشل.»*

The Muqassa graph, the conservation proof, the «دائرة» — this is the single screen that speaks سعود's native language: **many people, many small debts, settle the whole circle at once.** He's sold.

**…then the floor drops out.** It's a **demo with frozen numbers**. نورة، سارة، خالد، ليلى، فهد — strangers with hardcoded IOUs. And سعود asks the three questions that decide everything:

1. **«وين شقتي؟»** — There's no *my* circle. No «شقة الملقا» with تركي and عبدالله that I come back to.
2. **«وين أضيف ديوني؟»** — There's no way to say *«حسبت البقالة اليوم ٢٤٠، اقسمها على الثلاثة»*. The IOUs are given, not captured.
3. **«وكل شهر من جديد؟»** — Rent and bills repeat every single month with the same people and the same shares. Nothing here repeats. Nothing persists.

**The wish, in his words:**
> *«أبي هالدائرة تكون شقتي — ثابتة، أحدّثها كل ما حد حسب شي، الإيجار والفواتير تتكرر لحالها، وآخر الشهر تتقاص الدائرة كلها بضغطة. وما أوثّق ببصمة إلا لما المبلغ يكبر فعلاً.»*

---

## 3 · The crystallized gap

The prototype is a **notary for one serious loan.** سعود needs a **living tab for forty trivial ones** — that only becomes a notarized عهد when the money gets big enough to deserve it.

Everything Ahd needs already exists in the build — Muqassa nets a circle, sarie settles, the trust band reads kept-promises, 2:280 grants grace. **What's missing is the everyday on-ramp that feeds them:** a *persistent household circle* where small splits are logged in one tap (no Nafath ceremony per item), recurring bills auto-post, the balance nets continuously, and any single debt can "graduate" into the full witnessed عهد when it matters.

That on-ramp is the feature. It's specified in `feature.md` as **«الدائرة» — the Standing Circle**.

**The one-line test:** today Ahd is something سعود would use **2–3 times a year** (the rare big loan). The Standing Circle is something he'd open **every week** — and bring تركي, عبدالله, and his whole ربع into. That is the difference between a beautiful demo and a daily product.
