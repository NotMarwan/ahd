# Front 4 (JL-4) — «الضمانات والحدود» panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Operator pulled development
> forward (2026-07-08): product depth BEFORE the deck. This one screen closes OT-P1other (standalone
> borrower-protections panel) + OT-DEPTH P15 (on-screen attestation-boundary panel) together.

**Goal:** One contextual screen a presenter opens when a judge asks «وايش يحمي الأطراف؟» — three columns
of guarantees (للمدين · للدائن · حدود المصرف) where **every guarantee names the exact test/rule that
enforces it in code**. Guarantees-as-code: nobody on that stage can copy this slide honestly.

**Architecture:** House pattern exactly (mirror features/impact.js + screens/impact.js): pure content/view-model
module (Node-testable) + innerHTML screen, contextual registration (NO NAV_ORDER change), reachable from
home card + a chip on `mine` and on `proof`. TDD; project-map entry; additive dom-smoke.

## Global Constraints (hard stops)
- Determinism: no Date/Math.random/Intl/floats. No `%`/`٪` glyphs in rendered text. Amber-not-red rules.
- **Shariah guard:** borrower-invokable إبراء stays OUT (lender-owned; changing it is D-territory —
  `DECISIONS-FOR-MARWAN.md`). This panel DESCRIBES existing guarantees; it changes zero semantics.
- Every `enforcedBy` must reference a REAL file/rule that exists (verify each with grep before writing it).
- Gate green at end: `cd tests && node run-all.cjs` + tripwire. Never weaken an assertion. Commit per task, no push.

### Task 1: TDD feature module `app/features/bounds.js`
**Files:** Create `tests/app/bounds.test.cjs` FIRST, then `app/features/bounds.js`.

**Contract:**
```js
Bounds.SECTIONS // exactly 3: { key:"borrower"|"lender"|"bank", titleAr, items:[{ text, enforcedBy }] }
// borrower (للمدين، الحدّ الأدنى 5 بنود): لا غرامة تأخير أبدًا (enforcedBy: engine ribaScan + riba-lint corpus)
//   · «أحتاج وقت» إعادة جدولة بلا زيادة هللة (borrower feature grace, 2:280) · «ادفع ما تيسّر» مقبول دائمًا
//   · لا عدّاد تأخير أحمر، متأخّر = كهرمانيّ (dom-smoke tone-amber invariant) · الخلاف يوقف التذكير فورًا (dispute)
// lender (الحدّ الأدنى 4): وثيقة مختومة تفضح أيّ عبث (sealBlock/verifyRecord + tamper vectors)
//   · المصرف يُذكِّر نيابةً عنك — لا تصير «المُطالِب» (daftari reminder) · الإبراء بيدك وحدك يُغلق بكرامة
//   · المقاصّة لا تغيّر صافي حقّك هللةً (settlement conservation tests)
// bank (الحدّ الأدنى 5): يشهد ولا يُقرض · لا يحكم في خلاف · لا يأخذ على القرض شيئًا · لا رقم ائتمانيّ
//   ولا تصدير (trust band qualitative) · الذكاء يصوغ ولا يُفتي (rule engine, not fatwa)
Bounds.describeAr() // -> { heroLine, footerLine } — hero: «ضماناتٌ مكتوبةٌ في الكود، لا في الشعارات» flavor;
                    // footer: «كلّ بندٍ أعلاه يحرسه اختبارٌ آليّ يعمل دون إنترنت — اطلب تشغيله.»
```
- [ ] Tests (≥35 assertions, AAA, house harness style): 3 sections exactly · min item counts · every item has
  non-empty `text` + `enforcedBy` · **every `enforcedBy` path that looks like a file exists on disk**
  (fs.existsSync from the test — that's the teeth) · no `%`/`٪`/«ربا-implying» wording in any text ·
  determinism (two calls → identical JSON) · module source contains no Date/Math.random (scan like app-offline).
- [ ] Watch fail → implement → suite green (34 total suites).
- [ ] Commit: `feat(app): bounds feature — الضمانات والحدود، كل ضمانة باختبارها (JL-4, TDD)`

### Task 2: Screen + wiring
**Files:** Create `app/screens/bounds.js`; modify `app/index.html` (script tag), `app/screens/home.js`
(one card «🧭 الضمانات والحدود»), `app/screens/borrower.js` + `app/screens/proof.js` (one link chip each),
`app/app.css` (append `.bd-*` block matching the premium system), `project-map.json` (entry),
`tests/app/app-dom-smoke.cjs` (additive: renders · 3 section heads · an enforcedBy visible · no ٪ · chips exist).
- [ ] Screen: key `bounds`, label «الضمانات والحدود», icon 🧭, contextual (NOT in NAV_ORDER). Layout: hero
  line → three premium cards (borrower/lender/bank) → each item: النصّ + سطر صغير رمادي `يحرسه: <enforcedBy>`
  → footer line + chip «شغّل الحزمة الآن» (opens nothing — a printed command line `cd tests && node run-all.cjs`,
  mono, LTR) + chips to `mine`/`proof`/`home`.
- [ ] Full gate + tripwire green. Commit: `feat(app): «الضمانات والحدود» screen — OT-P1other + P15 closed (JL-4)`

### Task 3: Record
- [ ] `_meta/OPEN-ITEMS.md`: JL-4 → built; OT-P1other → panel done (borrower-invokable إبراء still open, D-gated);
  OT-DEPTH → P15 done. `_meta/STATUS.md` DONE line (house format, gate numbers). Commit. No push.
