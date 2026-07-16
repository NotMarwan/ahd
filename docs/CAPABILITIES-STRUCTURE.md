# هيكل القدرات — مرجع إضافات موجة 16 يوليو 2026

> **ما هذا الملف:** التوثيق الهيكلي الكامل للقدرات التسع المضافة في موجة «تبنّي قدرات
> المنافسين» (مدموجة في main، البوابة `AHD GATE ✅ 3380/0`). يشرح: الوحدة، الواجهة البرمجية
> بتواقيعها الدقيقة، شكل الحالة، الأفعال، نقاط الربط في الشاشات، أصناف CSS (كمقابض للمصمم)،
> الاختبارات، والثوابت. **لا يتكلم عن التصميم البصري** — المصمم حر في كل الشكل ما دام
> يحترم «الثوابت الدلالية» في §2.

---

## 1. الهيكل العام (كيف تتركب أي قدرة في عهد)

كل قدرة تمر بأربع طبقات، من الأسفل للأعلى:

```
app/engine.js            المحرك الذهبي (نسخة مطابقة للديمو — يُستدعى ولا يُعدّل أبدًا)
      ↑
app/features/<name>.js   وحدة القدرة: منطق نقي، UMD، تعمل في Node والمتصفح، بلا DOM
      ↑
app/app.js               الحالة (<name>State) + الأفعال (AhdApp.<action>) + rerender
      ↑
app/screens/<screen>.js  توليد HTML كسلاسل نصية (innerHTML) + استدعاء الأفعال onclick
```

**نمط وحدة القدرة (UMD)** — كل الوحدات الجديدة على هذا القالب حرفيًا:

```js
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ModuleName = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  /* منطق نقي */
  return { api: api };
});
```

**قواعد صارمة تسري على كل وحدة:**
- **حتمية كاملة:** لا `Date.now`، لا `new Date`، لا `Math.random`، لا `Intl`. التاريخ الثابت
  `AS_OF = "2026-06-21"`. المعرّفات عدّادات تسلسلية (`PC-1`, `DR-1`, `JC-1`…).
- **المال هللات صحيحة** (`amountMinor`، 1 ريال = 100 هللة). لا أعداد عائمة في المنطق.
- **اللاتغيّر (immutability):** كل انتقال حالة يعيد نسخة جديدة؛ الحالة الأصلية لا تُمس.
- **الأخطاء بالعربية:** `throw new Error("رسالة عربية واضحة")` أو `{ ok:false, errorAr }`.
- **التسجيل في `app/index.html`:** سطر `<script src="features/<name>.js">` بالترتيب قبل `app.js`.
- **كل وحدة لها ملف اختبار** في `tests/app/<name>.test.cjs` (يُكتشف آليًا).

## 2. الثوابت الدلالية (يحترمها أي شكل مهما تغيّر)

هذه ليست قرارات تصميم — هذه هوية المنتج، والاختبارات تحرسها:

1. **الأحمر للعبث المشفّر فقط** (كسر الختم). التأخر في السداد = كهرمان دائمًا، مهما كان.
2. **لا عدّادات أيام، لا أرقام ثقة، لا نسب مئوية على شخص.** إشارة الثقة كلمة («وفّى بعهوده»).
3. **الرصيد لا يتغيّر صامتًا أبدًا** — كل تغيير يمر بفعل صريح من صاحب الحق.
4. **الرفض دائمًا مسبب ومحفوظ** — لا حذف لقرار أي طرف.
5. **كل محاكاة موسومة «(محاكاة)»** في نص الزر نفسه — لا ادعاء تكامل غير مؤكد.
6. **عربي أولًا RTL**؛ الأرقام والبصمات جزر LTR داخل النص.

---

## 3. القدرات التسع — التفاصيل الكاملة

### 3.1 شريط «وش الوضع؟» — NextStep (المرجع: Zirtue + ناجز)

| البند | القيمة |
|---|---|
| الوحدة | `app/features/next-step.js` → `window.NextStep` |
| الاختبار | `tests/app/next-step.test.cjs` (16 تأكيدًا) |
| الفكرة | كل عهد يجيب ثلاثة أسئلة: المتفق عليه؟ ما حدث؟ ما التالي؟ + رقم مرجعي |

**الواجهة البرمجية:**
```js
NextStep.refOf(id)          // "R-CAFE" → "عهد-CAFE" · "NEW-1" → "عهد-NEW-1"
NextStep.fromRow(row)       // يستهلك صف دفتري (ناتج Daftari.rowFor) — لا يعرف المحرك
// → { ref, agreedAr, happenedAr, nextAr, tone }
// tone ∈ "ok" | "warm" | "attention"   (attention = كهرمان، ليس أحمر)
NextStep.NEXT               // قاموس جمل «التالي» الثابتة لكل حالة/دور
```
شكل صف الدخل: `{ id, role:"lender"|"borrower", counterparty, amountSAR, remainingSAR, statusKey, isOverdue, graced, nextDueLabel, daysOverdue }`.

**الربط:** الرئيسية (`home.js`) تعرض بطاقة للعهد الأكثر إلحاحًا (أول متأخر وإلا أول حي)؛
كل صف في `daftari.js` و`borrower.js` يحمل سطر «التالي» + المرجع؛ رأس `proof.js` يعرض
«المرجع … · آخر إجراء …». **لا حالة ولا أفعال جديدة في app.js** — قراءة فقط.

**مقابض CSS:** `.nsx` (+ `.attention`/`.warm`)، `.nsx-head`، `.nsx-title`، `.nsx-ref`،
`.nsx-line` (+ `.next`)، `.row-next`.

### 3.2 مراجعة قبل الختم — ReviewGate (المرجع: ناجز + DocuSign)

| البند | القيمة |
|---|---|
| الوحدة | `app/features/review-gate.js` → `window.ReviewGate` |
| الاختبار | `tests/app/review-gate.test.cjs` (13) |
| الفكرة | لا شيء يُختم أو يُرسل قبل ملخص ثابت + قائمة «ما ليس في هذا العهد» |

**الواجهة البرمجية:**
```js
ReviewGate.build(draft, termsAr)
// draft: { lender, borrower, amountMinor, months, open }
// → { lines: [{k, v}...],            // المُقرِض/المقترض/المبلغ/السداد/النص
//     absentAr: [3 سلاسل ثابتة],     // لا فائدة · لا غرامة · لا خصم آلي ولا حيازة
//     fingerprint }                   // 8 hex
ReviewGate.fingerprint(str)   // djb2 — «بصمة معاينة» فقط، ليست الختم المشفّر (SHA-256 يأتي بعد التأكيد)
ReviewGate.ABSENT             // القائمة الثابتة
```

**الحالة والأفعال (app.js):** `createState.reviewing` و`requestState.reviewing` (boolean).
أفعال: `createOpenReview()` / `createBackFromReview()` / `requestOpenReview()` /
`requestBackFromReview()`. **`createSeal()` لم تتغير دلالتها** — بطاقة المراجعة تستدعيها.

**التدفق:** «راجع قبل الختم» → بطاقة المراجعة (سطور + absent + بصمة) → «أكّد واختم عبر
نفاذ (محاكاة)» أو «عدّل». نفس النمط في «اطلب عهدًا» («راجع قبل الإرسال» → «أكّد وأرسِل»).
فحص الربا يسبق المراجعة دائمًا.

**مقابض CSS:** `.rv-card`، `.rv-abshead`، `.rv-abs`، `.rv-fp`.

### 3.3 تصديق السداد — PayConfirm (المرجع: ناجز «تصديق سداد خارج المحكمة»)

| البند | القيمة |
|---|---|
| الوحدة | `app/features/pay-confirm.js` → `window.PayConfirm` |
| الاختبار | `tests/app/pay-confirm.test.cjs` (18) + تدفق كامل في `app-dom-smoke` |
| الفكرة | المدين يدّعي دفعة بمؤيد → الدائن يصدّق (عندها فقط يتحرك الرصيد) أو يرفض بسبب ثابت → الرفض يفتح «محلّ خلاف» |

**آلة الحالة:**
```js
PayConfirm.makeState()                    // { claims: [], seq: 0 }
PayConfirm.claim(state, { recordId, amountMinor, evidenceAr, byAr })
//   → حالة جديدة؛ المطالبة { id:"PC-n", status:"pending", reasonAr:null, opensDispute:false }
//   يرمي: مبلغ ليس هللات صحيحة موجبة · مؤيد فارغ
PayConfirm.accept(state, claimId)         // → { state, accepted }   status:"accepted"
PayConfirm.reject(state, claimId, reasonKey)
//   → { state, rejected }   status:"rejected", reasonAr من القاموس, opensDispute:true
PayConfirm.REASONS   // { amount:"المبلغ لا يطابق", notReceived:"لم يصلني",
                     //   duplicate:"دفعة مكررة", other:"سبب آخر مذكور" }
PayConfirm.pendingFor(state, recordId)    // مطالبات معلقة لسجل
PayConfirm.byId(state, id)
// مطالبة مغلقة (accepted/rejected) ترمي عند أي انتقال ثانٍ: "لا يمكن تصديق دفعة مغلقة"
```

**الحالة والأفعال (app.js):** `payConfirmState` (آلة الحالة) + `pcState.formId` (النموذج
المفتوح). أفعال: `pcOpenForm(id)` / `pcCancelForm()` / `pcClaim(recordId, amountSAR, evidenceAr)` /
`pcAccept(claimId)` / `pcReject(claimId, reasonKey)`. **القبول هو الوحيد الذي يحرك الرصيد**،
عبر المسار الموجود `Borrower.payWhatEased` (حدث `PRINCIPAL_PAID` مختوم). قارئ DOM:
`App.pcSubmitClaim(recordId)` في `borrower.js` (يقرأ `#pc-amount` و`#pc-evidence`)،
و`App.pcRejectFromSelect(claimId)` في `daftari.js` (يقرأ `#pc-reason-<id>`).

**الربط:** «ما عليّ» — زر «سجّلت دفعة — اطلب تصديقها» → نموذج مبلغ+مؤيد → شارة
«بانتظار تصديق فلان» + صف محاكاة الطرف الآخر (صدّق/ارفض). «دفتري» (تبويب «لي») —
صندوق «دفعات بانتظار تصديقك»: تصديق أو select سبب + رفض؛ المرفوضة تعرض «افتح محلّ خلاف»
(`openDispute(recordId)` الموجود).

**مقابض CSS:** `.pc-box`، `.pc-title`، `.pc-claim` (+ `.rejected`)، `.pc-body`، `.pc-ev`،
`.pc-act`، `.pc-note`، `.pc-pending`، `.pc-form`.

### 3.4 أنماط التقسيم — SplitModes (المرجع: Splitwise)

| البند | القيمة |
|---|---|
| الوحدة | `app/features/split-modes.js` → `window.SplitModes` (فوق `split.js` — لا تعديل عليها) |
| الاختبار | `tests/app/split-modes.test.cjs` (13) |
| الفكرة | متساوٍ / مبالغ محددة / نسب / حصص — كلها تحفظ كل هللة (أكبر باقٍ للأسبق) |

**الواجهة البرمجية:**
```js
SplitModes.make(spec)
// spec: { mode:"equal"|"exact"|"percent"|"shares", totalMinor, payer, participants, values }
//   equal   → تفويض بايت-ببايت إلى Split.makeSplit
//   exact   → values هللات لكل مشارك، ومجموعها يجب أن يساوي الأصل
//   percent → values أعداد صحيحة مجموعها 100، توزيع أكبر-باقٍ
//   shares  → values أوزان صحيحة موجبة، توزيع تناسبي بأكبر-باقٍ
// → { totalMinor, payer, participants, shares:[{name, amountMinor}], qaidDrafts, mode }
//   qaidDrafts: قيود «alayya» لغير الدافع فقط (نفس عقد Split.makeSplit)
SplitModes.validate(spec)   // لا يرمي أبدًا → { ok:true } أو { ok:false, errorAr }
SplitModes.MODES
```

**الربط (اليومي `daily.js`):** حقل `#daily-split-mode` (select) + `#daily-split-values`
(قيم بالفاصلة، يظهر لغير المتساوي) + زر «عاين الحصص قبل الحفظ» (`dailySplitPreview()` —
معاينة رقائق أو رسالة خطأ) + «طبّق القسمة» معطّل عند خطأ معاينة. حالة إضافية في
`dailyState`: `splitMode`, `splitPreview`, `splitPreviewError`. فعل: `dailySplitMode()`.

### 3.5 مرشح الشخص — دفتري (المرجع: Splitwise)

**إضافة على وحدة موجودة** (`app/features/daftari.js` — تصدير إضافي، لا تعديل على القائم):
```js
Daftari.peopleOf(rows)            // أسماء الأطراف الفريدة بترتيب أول ظهور
Daftari.filterByPerson(rows, name) // «الكل» أو null = تمرير الكل؛ لا يغيّر المصفوفة الأصلية
// يتركّب مع مرشح الحالة الموجود: filterRows(filterByPerson(rows, p), status)
```
اختبار مستقل: `tests/app/daftari-person-filter.test.cjs` (6).
**الحالة والفعل:** `daftariState.person` + `daftariPerson(name)`.
**الربط:** صف رقائق أشخاص فوق القائمة (يظهر فقط إذا كان هناك أكثر من طرف).
**مقبض CSS:** `.dperson` (على صف `.dfilter`).

### 3.6 دعوات الجمعية — JamiyaInvite (المرجع: Hakbah)

| البند | القيمة |
|---|---|
| الوحدة | `app/features/jamiya-invite.js` → `window.JamiyaInvite` |
| الاختبار | `tests/app/jamiya-invite.test.cjs` (12) + بوابة حية في smoke الشاشة |
| الفكرة | بطاقة دعوة بكل الشروط لكل عضو؛ الختم لا يفتح إلا بقبولات فردية مسجلة بالإجماع؛ اعتذار واحد يعيد قفله |

**الواجهة البرمجية:**
```js
JamiyaInvite.build({ members, monthlyMinor, startMonth, orderAgreed })
// → { termsAr:[{k,v}...],          // المساهمة/المدة/قيمة الاستلام/البداية/الترتيب
//     absentAr:[3],                 // لا رسوم · لا حيازة · لا سند تنفيذي وتقييم مخاطر
//     perMember:[{name, round}] }   // دور كل عضو (1-based)
JamiyaInvite.makeState(members)      // { decisions:{}, membersKey }
JamiyaInvite.accept(state, name)     // يرمي لغير الأعضاء؛ تغيير الرأي قبل الختم مسموح
JamiyaInvite.decline(state, name, reasonAr)
JamiyaInvite.allAccepted(state, members)   // إجماع فعلي، false لقائمة فارغة
JamiyaInvite.summaryAr(state, members)     // "قَبِل n · اعتذر n · بانتظار n"
```

**الحالة والأفعال:** `jamiyaState.inviteState`؛ `jamInviteAccept(name)` / `jamInviteDecline(name)`.
**البوابة:** `jamiyaCreate()` يرمي «لا تُختَم الجمعية حتى يقبل كل عضو دعوته — …» ما لم
يتحقق الإجماع؛ زر الختم نفسه `disabled` حتى الإجماع (يستبدل checkbox «الكل وافق» القديم).

**مقابض CSS:** `.ji-box`، `.ji-title`، `.ji-sum`، `.ji-row`، `.ji-name`،
`.chip.good` / `.chip.amber` / `.chip.mute` (حالات قَبِل/اعتذر/بانتظار).

### 3.7 سجل تغييرات الجمعية — JamiyaChanges (المرجع: Hakbah)

| البند | القيمة |
|---|---|
| الوحدة | `app/features/jamiya-changes.js` → `window.JamiyaChanges` |
| الاختبار | `tests/app/jamiya-changes.test.cjs` (9) |
| الفكرة | سجل إلحاقي مرقّم لا يُمحى: تبديل دورين بالتراضي، انسحاب بسبب — والتحقق يكشف أي حذف/إعادة ترتيب |

**الواجهة البرمجية:**
```js
JamiyaChanges.makeLog()                        // { entries:[], seq:0 }
JamiyaChanges.swapRounds(log, jam, nameA, nameB)
// → { log, orderAfter }   قيد { id:"JC-n", type:"swap", bothConsent:true, detailAr }
JamiyaChanges.withdraw(log, jam, name, reasonAr)  // → { log, member }
JamiyaChanges.verify(log)                      // { ok } أو { ok:false, whyAr } — سلسلة JC-1..JC-n
```

**نمط مهم — إعادة الختم بعد التبديل:** `jamSwapDemo()` في `jamiya.js` يبدّل آخر دورين
(مستقبليين)، ثم **يعيد بناء العقد ويختمه نسخة جديدة** (`makeJamiya` + `jamiyaSeal`)
**ويعيد تشغيل كل الدفعات المختومة** (`recordPayment({round, member})` — مفتاحها مستقل عن
الترتيب) — فلا تُفقد دفعة ولا يُعبث بختم. القيد يُسجل في اللوج قبل ذلك.

**مقابض CSS:** `.jam-changes` (بطاقة السجل).

### 3.8 هدف الجمعية والسيناريوهات — JamiyaGoal (المرجع: MoneyFellows، مُكيَّف)

| البند | القيمة |
|---|---|
| الوحدة | `app/features/jamiya-goal.js` → `window.JamiyaGoal` |
| الاختبار | `tests/app/jamiya-goal.test.cjs` (8) |
| الفكرة | هدف وصفي + تقدم، وسطر «لا وعد مالي» ثابت لا يُحذف؛ مقارنة سيناريوهات قبل الدعوة |

**الواجهة البرمجية:**
```js
JamiyaGoal.describe(goalAr, jam)
// → { goalAr, progress:{ done, total, pct }, promiseFreeAr }
//   done = عدد الدفعات المختومة · total = n²  · pct صحيح 0..100
//   promiseFreeAr ثابت: "هدف وصفي — لا وعد مالي ولا عائد"
JamiyaGoal.scenarios(monthlyMinor, monthsOptions)
// → [{ months, perRoundMinor, totalMinor }]   يحفظ: total = perRound × months
JamiyaGoal.PROMISE_FREE
```
**الحالة:** `jamiyaState.goalAr`. **الربط:** قسم الهدف أعلى الشاشة + جدول «قارن
السيناريوهات قبل الدعوة» داخل نموذج الإنشاء.
**المرفوض عمدًا (لا يُضاف):** مطابقة مالية، رسوم حسب الدور، قنوات استلام.
**مقابض CSS:** `.jam-goal`، `.jam-scen`.

### 3.9 المسودات — Drafts (المرجع: Splitwise) + موافقات المقاصّة — SettleConsent

**Drafts** (`app/features/drafts.js` → `window.Drafts`، اختبار `drafts.test.cjs` — 10):
```js
Drafts.makeState()                   // { items:[], seq:0 }
Drafts.propose(state, item)          // { id:"DR-n", status:"proposed", reasonAr:null, ...item }
Drafts.approve(state, id)            // → { state, item } — مرة واحدة فقط؛ المغلقة ترمي
Drafts.decline(state, id, reasonAr)  // status:"declined" + السبب محفوظ
Drafts.pending(state)
```
**الربط (الدائرة+):** كل دورة من `CircleAdv.recurringPosts` تدخل كمسودة (تُبذر مرة واحدة
في أول render — حارس `!st.draftsState`)؛ لا تُنشر دورة إلا بـ«اعتمد وانشر». الحالة:
`circleAdvState.draftsState`؛ الأفعال: `circleDraftApprove(id)` / `circleDraftDecline(id)`.
المفتاح الرابط بين المسودة والدورة: `cycleKey` (مثل `"2026-07"`).

**SettleConsent** (`app/features/settle-consent.js` → `window.SettleConsent`،
اختبار `settle-consent.test.cjs` — 11):
```js
SettleConsent.makeState(transfers)   // transfers = ناتج المقاصّة الذهبية [{from,to,amount}]
// → { legs:[{ from, to, amount, consents:{} }] }
SettleConsent.consent(state, index, party)  // party يجب أن يكون طرف الرِّجل وإلا رمى
SettleConsent.legReady(leg)          // موافقة الطرفين معًا
SettleConsent.allReady(state)        // كل الأرجل جاهزة (false لقائمة فارغة)
SettleConsent.impactAr(leg, party)   // سطر أثر الحوالة على هذا الطرف
```
**الربط (المقاصّة):** كل حوالة دنيا بطاقة بموافقتَي طرفيها + سطرَي الأثر؛ زر
«اعتماد المقاصّة — بعد موافقة الكل» `disabled` حتى `allReady`. الحالة:
`settleState.scState` + `scSealed`؛ الأفعال: `scConsent(index, party)` / `scSeal()`.
**تغيير الـ preset يصفّر جولة الموافقات** (`settlePreset` يعيد `scState = null`).
برهان الحفظ (قبل/بعد لكل عضو) لم يُمس.

**مقابض CSS:** `.se-consent` (+ `.ready`)، `.se-impact`، `.se-consent-act`،
`.se-consent-gate`، `.se-gate-note`، `.se-approved`.

---

## 4. تغييرات النبرة (نصوص فقط — سُجّلت هنا للاكتمال)

- hero الرئيسية: «… بلا فوائد، بلا غرامات، بلا تصنيف.» (كانت «بلا ربا، بلا غرامة، بلا تصنيف»
  بصياغة أثقل). سطر الهوية «قرضٌ حسن — مكتوبٌ ومشهود، بكرامة.» لم يتغير.
- شريط الآيات في الرئيسية → زر واحد `.hbasis-link` يفتح شاشة «الأساس الشرعي». الآيات باقية
  في مواضعها الدلالية: شاشة الأساس الشرعي، أفعال الإبراء، استشهاد الإثبات (2:282).

## 5. خريطة الملفات الكاملة لهذه الموجة

```
app/features/next-step.js        جديد   app/screens/home.js          معدَّل (شريط nsx + رابط الأساس)
app/features/review-gate.js      جديد   app/screens/create.js        معدَّل (خطوة المراجعة)
app/features/pay-confirm.js      جديد   app/screens/request.js       معدَّل (خطوة المراجعة)
app/features/split-modes.js      جديد   app/screens/daftari.js       معدَّل (pc-box + شخص + row-next)
app/features/jamiya-invite.js    جديد   app/screens/borrower.js      معدَّل (تصديق + row-next)
app/features/jamiya-changes.js   جديد   app/screens/daily.js         معدَّل (أنماط التقسيم + معاينة)
app/features/jamiya-goal.js      جديد   app/screens/jamiya.js        معدَّل (دعوات + هدف + سجل تغييرات)
app/features/drafts.js           جديد   app/screens/circle-adv.js    معدَّل (مسودات المتكرر)
app/features/settle-consent.js   جديد   app/screens/settlement.js    معدَّل (موافقات الأرجل)
app/features/daftari.js          معدَّل (peopleOf/filterByPerson إضافيًا)
app/screens/proof.js             معدَّل (سطر المرجع وآخر إجراء)
app/app.js                       معدَّل (حالات + أفعال — مفصلة أعلاه)   app/app.css  معدَّل (أصناف جديدة فقط)
app/index.html                   معدَّل (9 أسطر <script>)

tests/app/  عشرة ملفات اختبار جديدة + تقوية app-dom-smoke / daily-screen-smoke / jamiya-screen-smoke
project/mcp/packages/ahd-navigator/src/project-map.json   +9 قدرات (بوابة structure-check)
```

## 6. كيف تضيف قدرة عاشرة (الوصفة المختصرة)

1. اختبار فاشل أولًا: `tests/app/<name>.test.cjs` بنمط العدّاد (§1).
2. الوحدة: `app/features/<name>.js` بنمط UMD، نقية، حتمية، لا-تغيّرية، أخطاء عربية.
3. `app/index.html`: سطر `<script>` قبل `app.js`.
4. `app/app.js`: `var X = window.X` + خاصية + `<x>State` + أفعال ترجع `this.rerender()`.
5. الشاشة: HTML سلاسل + `onclick="AhdApp.<فعل>(...)"`؛ قراءة DOM عبر دالة `App.<x>FromInputs` داخل ملف الشاشة.
6. أصناف CSS جديدة بأحجام من `--sadu-type-*` (حد literals ≤ 200 محروس ببوابة).
7. `project-map.json`: قيد القدرة (وإلا سقطت بوابة structure-check).
8. تقوية smoke الشاشة (لا تُضعف تأكيدًا) ثم: `cd tests && node run-all.cjs` — لافتة خضراء.
9. تحديث بانرات الأرقام إن تغيّر المجموع (بوابة gate-drift تكشف أي تخلّف).
