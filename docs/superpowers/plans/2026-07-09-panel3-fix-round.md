# Panel #3 Fix Round Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the 10 verified findings of the 2026-07-09 judge-panel re-score (`_meta/OPEN-ITEMS.md` § "Panel #3 fix queue") — stale-number sweep, deck image repoint, impact-screen stage visibility, Findex 35.8% integration, محاكاة honesty tags, digit unification, mic-drop close, identity clause, JL-5 stage hygiene — keeping the gate green (1683/0) and the demo frozen.

**Architecture:** Text-only edits to pitch/evidence docs + two additive copy edits in `app/screens/` (create.js, settlement.js, impact.js) guarded by source-teeth assertions added FIRST (TDD, bounds.test-style). No engine, no golden function, no `demo/index.html`, no NAV_ORDER change. One commit per task; `cd tests && node run-all.cjs` green after every commit.

**Tech Stack:** Plain Node test harness (`tests/app/*.cjs`), vanilla JS screens, Markdown docs.

## Global Constraints

- Demo frozen: never touch `demo/index.html` (tripwire `e2f48467…`); golden functions called, never modified.
- Never weaken a gate assertion; additive only. Gate command: `cd tests && node run-all.cjs` → expect `AHD GATE ✅` (count grows if assertions added).
- No riba/penalty/score/fatwa copy; never assert unconfirmed approvals (OT-VAL); no US number presented as Saudi.
- Correct current counts: **core 184/0 (135+9+40) + app 1,485/0 (34 suites) + structure 14/0 = 1,683/0**. Arabic forms: **١٬٦٨٣ / ١٬٤٨٥ / ٣٤**.
- Recompute-stamp dates in count contexts become **2026-07-09**; court-data vintage labels («2020–21») stay untouched.
- Commit format `type(scope): subject` — attribution disabled, no trailers.
- Presence: heartbeat from the REAL clock (`date "+%Y-%m-%dT%H:%M:%S%z"`) if the session runs long (JL-5).

---

### Task 1: Commit the fallback-PNG resync (pre-existing, verified good)

**Files:**
- Commit only: `docs/pitch/fallback/02-linter-block.png`, `03-proof-verified.png`, `04-proof-tampered.png`, `06-open-ibra.png`

**Interfaces:** none (binary commit; shots already SHA-256-verified byte-identical to `app/screenshots/premium-after/` counterparts by the 9-Jul UX judge).

- [x] **Step 1: Confirm only the 4 PNGs are dirty**

Run: `git status --short` — expect exactly the 4 `M docs/pitch/fallback/*.png` lines.

- [x] **Step 2: Commit**

```bash
git add docs/pitch/fallback
git commit -m "docs(pitch): fallback shots resynced to premium-after reshoot (byte-verified 9 Jul panel)"
```

---

### Task 2: Stale-number sweep 1,603→1,683 (11 files, text-only)

**Files (Modify):**
- `docs/pitch/script-ar.md:28,66,79` · `docs/pitch/deck-content-v2.md:13-15,98,100,174,180` · `docs/PRESENTER-GUIDE.md:38,47,154` · `docs/evidence/EVIDENCE-BRIEF.md:122` · `docs/evidence/REBUTTAL-PLAYBOOK.md:9,118,202,207-208` · `docs/pitch/top6-cards-ar.md:3-6` · `docs/ملخص-الجديد-ببساطة.md:13` · `docs/ARCHITECTURE.md:228` · `docs/PUBLISHABLE-PRODUCT-SPEC.md:150` · `CLAUDE.md:23-24`

**Interfaces:** consumes the Global Constraints count table; produces docs consistent with the live banner.

- [x] **Step 1: Apply replacements** — in each listed line apply, preserving surrounding text exactly:
  - `1,603/0`→`1,683/0` · `1,603`→`1,683` · `1603/0`→`1683/0` · `1603 اختبار`→`1683 اختبار` · `١٬٦٠٣`→`١٬٦٨٣`
  - `1,405/0`→`1,485/0` · `1,405`→`1,485` · `١٬٤٠٥/٠`→`١٬٤٨٥/٠`
  - `33 مجموعة`→`34 مجموعة` · `(33 suites)`→`(34 suites)` · `٣٣ مجموعة`→`٣٤ مجموعة` · `33/33 green suites`→`34/34 green suites` · CLAUDE.md `# app: 33 suites`→`# app: 34 suites`
  - recompute stamps in those same lines: `2026-07-07`/`2026-07-07 مساءً`/`محدَّثة 2026-07-07 مساءً`→`2026-07-09` (deck line 15 keeps its «يُعاد حسابها عند بناء الـpptx وصباح 18 يوليو» promise).

- [x] **Step 2: Verify zero stragglers on judge-visible surfaces**

Run: `grep -rnE "1[,٬]?603|١٬٦٠٣|1[,٬]?405|١٬٤٠٥" docs/pitch docs/evidence docs/PRESENTER-GUIDE.md docs/ARCHITECTURE.md docs/PUBLISHABLE-PRODUCT-SPEC.md docs/ملخص-الجديد-ببساطة.md CLAUDE.md`
Expected: no matches (internal `docs/superpowers/plans/*` history files are exempt — do not edit them).

- [x] **Step 3: Gate + commit**

```bash
cd tests && node run-all.cjs   # expect AHD GATE ✅ 1683/0
git add -A && git commit -m "docs(pitch): number sweep 1,603/0 -> 1,683/0 across all judge-visible surfaces (panel #3 item 1)"
```

---

### Task 3: Deck image repoint → premium-after (7 refs)

**Files:**
- Modify: `docs/pitch/deck-content-v2.md:8,114,131,149,164,188-193,234`

**Interfaces:** consumes `app/screenshots/premium-after/{01-home,05-proof-verified,06-proof-tampered,09-settle,11-impact-collapsed,14-mine,15-maroof}.png` (all exist).

- [x] **Step 1: Repoint each slot** (drop every `<!-- reshoot-after-JL-2 -->` marker as you go):
  - `:114` `app/screenshots/deepening/ahd-home-capstone.png` → `app/screenshots/premium-after/01-home.png`
  - `:131` `app/screenshots/ahd-settlement.png` (برهان المقاصّة) → `app/screenshots/premium-after/11-impact-collapsed.png` and caption to `(لوحة «أثر عهد»: الانهيار ٩←٢ + مجاميع k-anonymous)` — this makes Khanah 8's words finally match its picture (panel item 3a)
  - `:149` `premium/ahd-p1-mine.png` → `premium-after/14-mine.png`
  - `:164` `premium/ahd-p1-maroof.png` → `premium-after/15-maroof.png`
  - `:188` `audit/09-proof-verified.png` → `premium-after/05-proof-verified.png`
  - `:189` `audit/10-proof-tampered.png` → `premium-after/06-proof-tampered.png`
  - `:192` `ahd-settlement.png` → `premium-after/09-settle.png`

- [x] **Step 2: Retire the reshoot rule in header+build-notes** — line 8 becomes `> كلّ اللقطات من `app/screenshots/premium-after/` (إعادة التصوير الفاخرة 2026-07-08 — 17 لقطة @2x).`; line 234 (build note about reshoot markers) becomes `- اللقطات كلّها من `premium-after/` — لا علامات reshoot باقية (أُغلقت 2026-07-09).`

- [x] **Step 3: Verify + commit**

Run: `grep -n "app/screenshots" docs/pitch/deck-content-v2.md` — every hit must contain `premium-after/`.
```bash
cd tests && node run-all.cjs
git add docs/pitch/deck-content-v2.md && git commit -m "docs(pitch): deck slots repointed to premium-after shots; Khanah-8 shows the impact dashboard (panel #3 items 2+3a)"
```

---

### Task 4: «أثر عهد» stage visibility (script beat + guide placeholder)

**Files:**
- Modify: `docs/pitch/script-ar.md:37,52-53` (insert after the `[+موسَّع ٣]` block) · `docs/PRESENTER-GUIDE.md:46,50`

**Interfaces:** consumes the real settle-screen chip label `📊 أثر عهد — الأثر عبر الدوائر` (`app/screens/settlement.js:46`) and button `شاهد الانهيار` (`app/screens/impact.js:58`).

- [x] **Step 1: script — insert new extended block after `[+موسَّع ٣]`:**

```markdown
**`[+موسَّع ٣ب]` بعد الدائرة+ (بيت البيانات الحيّ):** *(~30 ثانية)*
| قُل | افعل | الشاشة |
|---|---|---|
| «وهذا الأثر يُقاس ولا يُدّعى: «أثر عهد» — المحرّك نفسه يحسب على دوائرَ تجريبيّةٍ معلَنةٍ بصدق: كم تحويلًا وُفِّر، والمال المتحرّك ينخفض **والمراكز محفوظة**، ومجاميع k-anonymous — **أعدادٌ ووسائط فقط، لا رقم فردٍ أبدًا.** تحليلاتٌ بضمير.» | من المقاصّة اضغط **«📊 أثر عهد — الأثر عبر الدوائر»** ← اضغط **«شاهد الانهيار»** ← أشِر إلى سطر الحفظ | `impact` |
```

- [x] **Step 2: script line 37 budget honesty** — `(تضيف ~١٢٠ ثانية)` → `(الكتل الخمس ~١٥٠ ثانية — إن كان الوقت خمس دقائق تمامًا أسقِط `[+موسَّع ٣]` أوّلًا، قاعدة القصّ من الأسفل)`.

- [x] **Step 3: guide line 50** — replace the `[Front-3: … يُحقَن هنا …]` placeholder with:
`> **بيت «أثر عهد» (النسخة الموسَّعة):** بعد البيت ٥ — من المقاصّة اضغط **«📊 أثر عهد — الأثر عبر الدوائر»** ← **«شاهد الانهيار»** (النصّ الكامل: `script-ar.md` `[+موسَّع ٣ب]`).`

- [x] **Step 4: guide line 46 stale clause** — `*الانهيار المتحرّك موجودٌ في مسار العرض المجمَّد إن طُلبت «الحركة»*` → `*الانهيار المتحرّك: شريحة «📊 أثر عهد» من المقاصّة نفسها (وفي مسار العرض المجمَّد أيضًا)*`.

- [x] **Step 5: Gate + commit**

```bash
cd tests && node run-all.cjs
git add docs/pitch/script-ar.md docs/PRESENTER-GUIDE.md && git commit -m "docs(pitch): impact dashboard reaches the stage - extended beat + guide placeholder filled (panel #3 item 3)"
```

---

### Task 5: Findex 35.8% 🟢 integration (evidence brief + deck)

**Files:**
- Modify: `docs/evidence/EVIDENCE-BRIEF.md:109` (insert row after M-12) · `docs/pitch/deck-content-v2.md:77` (Khanah 5)

**Interfaces:** consumes `swarm/agent-3-official-stats/findings-claude.md` ⭐2 (35.8% / 13.7%, Little Data Book 2022 p111, primary PDF). The 19% LendingTree figure is a **US survey — deliberately NOT added** to the Saudi data slot (deck honesty ceiling: لا أرقام أمريكيّة تُنسَب للسعوديّة).

- [x] **Step 1: EVIDENCE-BRIEF — add M-13 row after M-12:**

```markdown
| **M-13** | **Interpersonal borrowing incidence (KSA)** | **35.8%** of Saudi adults (15+) borrowed from family or friends in the past 12 months — vs **13.7%** high-income-country average | [World Bank Global Findex 2021 — Little Data Book 2022, p.111](https://www.unepfi.org/wordpress/wp-content/uploads/2023/02/Findex-Data-Book-2021.pdf) · `swarm/agent-3-official-stats/findings-claude.md` ⭐2 | 🟢 | **Primary-source PDF, swarm-verified, added 2026-07-09.** 2021 vintage (Findex 2025 is out; the KSA detail sits behind JS — refresh pending). This is the *incidence* half of the demand story; interpersonal *volume* stays 🔴 (M-8 / GAPS). |
```

- [x] **Step 2: deck Khanah 5 — first bullet + header count:** change `**الأرقام الثلاثة:**` → `**الأرقام الأربعة:**` and insert as the FIRST bullet:

```markdown
- **٣٥٫٨٪ من البالغين السعوديّين** اقترضوا من الأهل أو الأصدقاء خلال ١٢ شهرًا — مقابل ١٣٫٧٪ في الدول مرتفعة الدخل: أكثر معاملةٍ ماليّةٍ شيوعًا، مقيسةً لا مُدّعاة. *(البنك الدوليّ — Findex 2021، مصدرٌ أوّليّ 🟢.)*
```

- [x] **Step 3: Gate + commit**

```bash
cd tests && node run-all.cjs
git add docs/evidence/EVIDENCE-BRIEF.md docs/pitch/deck-content-v2.md && git commit -m "docs(evidence): Findex 35.8% KSA family/friends borrowing (primary source) into brief M-13 + deck Khanah 5 (panel #3 item 4)"
```

---

### Task 6: محاكاة honesty tag on the Nafath seal (TDD)

**Files:**
- Test: `tests/app/app-dom-smoke.cjs` (additive assertion near the create-screen block)
- Modify: `app/screens/create.js:49,55` · `docs/pitch/script-ar.md:25` · `docs/PRESENTER-GUIDE.md:44,96,97`

**Interfaces:** produces button label **`اختم العهد عبر نفاذ (محاكاة)`** and seal-doc label **`الوثيقة المختومة · نفاذ (محاكاة) + SHA-256`** — script/guide cells must quote these exact strings (T8.3 rehearsal discipline).

- [x] **Step 1: Write the failing source-teeth assertion** — in `tests/app/app-dom-smoke.cjs`, find the create-screen section (grep `create` in the file); add:

```js
var crSrc = fs.readFileSync(path.join(ROOT, "app", "screens", "create.js"), "utf8");
ok(/اختم العهد عبر نفاذ \(محاكاة\)/.test(crSrc) && /نفاذ \(محاكاة\) \+ SHA-256/.test(crSrc),
  "the Nafath seal button and the sealed-doc label carry the (محاكاة) honesty tag (no unconfirmed-integration claim on the guaranteed path)");
```

(Reuse the file's existing `fs`/`path`/`ROOT` helpers — check the header; if `ROOT` is named differently, use that name.)

- [x] **Step 2: Run to verify it fails** — `cd tests && node app/run-app-tests.cjs` → expect exactly 1 new failure naming the محاكاة assertion.

- [x] **Step 3: Implement** — `app/screens/create.js`:
  - line 49: `الوثيقة المختومة · نفاذ + SHA-256` → `الوثيقة المختومة · نفاذ (محاكاة) + SHA-256`
  - line 55: `اختم العهد عبر نفاذ</button>` → `اختم العهد عبر نفاذ (محاكاة)</button>`

- [x] **Step 4: Sync the exact label in script+guide** — replace every `«اختم العهد عبر نفاذ»` with `«اختم العهد عبر نفاذ (محاكاة)»` at `script-ar.md:25`, `PRESENTER-GUIDE.md:44,96,97`; append to guide:44's verification note: `؛ وسم (محاكاة) أُضيف 2026-07-09`.

- [x] **Step 5: Gate + commit**

```bash
cd tests && node run-all.cjs   # count grows by the new assertion; all green
git add -A && git commit -m "feat(app): (محاكاة) honesty tag on the Nafath seal button + sealed-doc label, script/guide synced (panel #3 item 5, TDD)"
```

---

### Task 7: Digit-system unification on the 9→2 stat (TDD)

**Files:**
- Test: `tests/app/app-dom-smoke.cjs` (additive source-teeth)
- Modify: `app/screens/settlement.js:35` · `app/screens/impact.js:58`

**Interfaces:** consumes the existing `App.digit(n)` display map (already used at `impact.js:59`); `App` is in scope in both render functions (`App.esc` at `settlement.js:28`).

- [x] **Step 1: Write the failing assertions** (next to the existing `شاهد الانهيار` check at `app-dom-smoke.cjs:368`):

```js
var seSrc = fs.readFileSync(path.join(ROOT, "app", "screens", "settlement.js"), "utf8");
var imSrc = fs.readFileSync(path.join(ROOT, "app", "screens", "impact.js"), "utf8");
ok(/App\.digit\(v\.beforeCount\)/.test(seSrc) && /App\.digit\(v\.afterCount\)/.test(seSrc),
  "settlement headline counts route through App.digit (one numeral system, user-toggled)");
ok(!/شاهد الانهيار ٩/.test(imSrc) && /شاهد الانهيار ' \+ App\.digit\(/.test(imSrc),
  "impact collapse button digits route through App.digit (no hardcoded Arabic-Indic glyphs)");
```

- [x] **Step 2: Run to verify both fail** — `cd tests && node app/run-app-tests.cjs` → 2 new failures.

- [x] **Step 3: Implement**
  - `settlement.js:35`: `'<div class="se-big"><span>' + v.beforeCount + "</span> التزامًا <em>⟶</em> <span>" + v.afterCount + "</span> "` → `'<div class="se-big"><span>' + App.digit(v.beforeCount) + "</span> التزامًا <em>⟶</em> <span>" + App.digit(v.afterCount) + "</span> "`
  - `impact.js:58`: `'<button class="im-btn" onclick="AhdApp.impactCollapse()">شاهد الانهيار ٩ ← ٢</button>' +` → `'<button class="im-btn" onclick="AhdApp.impactCollapse()">شاهد الانهيار ' + App.digit(cp.transfersBefore) + ' ← ' + App.digit(cp.transfersAfter) + '</button>' +`

- [x] **Step 4: Gate + commit**

```bash
cd tests && node run-all.cjs
git add -A && git commit -m "fix(app): 9->2 headline stat uses App.digit on both settle + impact - one numeral system (panel #3 item 6, TDD)"
```

---

### Task 8: Mic-drop close + refusal-as-identity clause

**Files:**
- Modify: `docs/pitch/script-ar.md:29` · `docs/PRESENTER-GUIDE.md:48` · `docs/evidence/REBUTTAL-PLAYBOOK.md:132`

**Interfaces:** none new; word budget stays ≤390 spoken words (current ~370, adds ~6).

- [x] **Step 1: script line 29 — identity clause** in the قُل cell: `لا فائدة، لا رقم ائتمانيّ، والفتوى لأهلها.` → `لا فائدة؛ ولا رقمَ ائتمانيّ — **رفضُ التصنيف هويّتُنا، لا قصورًا فينا**؛ والفتوى لأهلها.`

- [x] **Step 2: script line 29 — recency lands on proof, not logo**: افعل cell `عُد إلى الرئيسيّة — الشعار ظاهرٌ خلف الجملة الأخيرة` → `ابقَ على المقاصّة — لوحة ٩←٢ خلف الكلام؛ وعلى الجملة الأخيرة وحدها عُد إلى الرئيسيّة (الشعار وحده آخر ثانيتين)`; الشاشة cell `home` → `settle → home`.

- [x] **Step 3: guide line 48 mirror** — البيت ٧ row: screen cell `الرئيسية` → `المقاصّة ← الرئيسية`, buttons cell `العودة للرئيسية` → `ابقَ على ٩←٢؛ العودة للرئيسيّة على الجملة الأخيرة فقط`.

- [x] **Step 4: Q-E4 opener (playbook line 132)** — prepend to the 30-sec answer: `**Refusing to score is our identity, not a limitation — we deliberately won't turn kindness into a rating.** And structurally it's **incapable** of being one: …` (keep the rest verbatim).

- [x] **Step 5: Gate + commit**

```bash
cd tests && node run-all.cjs
git add docs/pitch/script-ar.md docs/PRESENTER-GUIDE.md docs/evidence/REBUTTAL-PLAYBOOK.md && git commit -m "docs(pitch): close holds the 9->2 proof image + refusal-as-identity clause in close and Q-E4 (panel #3 items 7+8)"
```

---

### Task 9: JL-5 stage hygiene (guide + script warning)

**Files:**
- Modify: `docs/PRESENTER-GUIDE.md:36-38` (التجهيز قبل الصعود block) · `docs/pitch/script-ar.md:79` (mishap 6)

**Interfaces:** documents the observed failure mode (`AHD GATE ❌ 1682/1` from a stale-active presence file, seen live 2026-07-09). The *additive stage command* option stays an operator decision (JL-5 row) — this task ships only the hygiene text; the gate itself is untouched.

- [x] **Step 1: guide — add item (٤) to the pre-stage checklist:** `(٤) **نظافة البوّابة (JL-5):** تحقّق أنّ كلّ ملفّات `_meta/agent-presence/*.json` حالتها `"exited"` — ملفُّ حضورٍ «نشط» قديم (>٤٥ دقيقة) يُحمّر اللافتة لسببٍ لا علاقة له بالمنتج (حدث فعلًا 2026-07-09). ثم شغّل الأمر وأبقِ الخضراء ظاهرة.`

- [x] **Step 2: script mishap 6 — append:** `(قبل الصعود: تحقّق ألّا ملفّ حضورٍ «نشطًا» في `_meta/agent-presence/` — JL-5.)`

- [x] **Step 3: Gate + commit**

```bash
cd tests && node run-all.cjs
git add docs/PRESENTER-GUIDE.md docs/pitch/script-ar.md && git commit -m "docs(pitch): JL-5 pre-stage presence-hygiene step - stale-active file reddens the stage banner (panel #3 item 9)"
```

---

### Task 10: Close the loop — meta + vault sync

**Files:**
- Modify: `_meta/OPEN-ITEMS.md` (Panel #3 fix-queue items 1-8,10 → done marks; JL-5 stays open pending the operator's command decision) · `_meta/STATUS.md` (append DONE line) · `AmadHackathon/00 Home.md` (score-table footnotes: technical drop cause fixed) · `AmadHackathon/01 الخطة الرئيسة.md` (tick the fix-round checkbox; note JL-5 residual)

**Interfaces:** consumes the final gate banner count (re-run it; Tasks 6-7 added 3 assertions → expect **1686/0**; use the REAL printed number everywhere).

- [x] **Step 1: Final full gate** — `cd tests && node run-all.cjs` → record the exact banner (expected `AHD GATE ✅ 1686/0`; if it differs, the printed number wins).
- [x] **Step 2: Mark queue items done** in `_meta/OPEN-ITEMS.md` (strike or annotate each with `✅ 2026-07-09 fix round`; JL-5 row: note "hygiene text shipped; stage-command choice still operator's").
- [x] **Step 3: STATUS DONE line** — one entry: fix round applied, per-task commits listed by `git log --oneline`, final banner, tripwire OK.
- [x] **Step 4: Vault sync** — Home: fix-queue callout → «أُنجزت 9 يوليو مساءً (باقي قرار JL-5)»; plan: tick the fix-round checkbox. Keep count references at the REAL final banner number.
- [x] **Step 5: Commit**

```bash
git add _meta AmadHackathon && git commit -m "docs(meta): panel #3 fix round landed - queue closed (JL-5 command choice pending), gate banner + vault synced"
```

---

## Self-Review

- **Coverage:** queue items 1→T2, 2→T3, 3→T3+T4, 4→T5, 5→T6, 6→T7, 7→T8, 8→T8, 9→T9 (text half; command half operator-gated by design), 10→T1. ✔
- **Placeholders:** none — every step carries exact strings/paths/commands. ✔
- **Type/name consistency:** `App.digit` (exists, `impact.js:59`), chip label `📊 أثر عهد — الأثر عبر الدوائر` (`settlement.js:46`), button `اختم العهد عبر نفاذ (محاكاة)` used identically in T6 code+docs. ✔
- **Deliberate skips (ponytail):** 19% LendingTree (US stat near a Saudi slot — honesty ceiling), doc-count freshness auto-check (would hardcode a moving number; the 12-July sweep + pptx-build recompute rule cover it), renumbering موسَّع blocks (added ٣ب instead).
