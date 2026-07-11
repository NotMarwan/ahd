# Judge-Depth Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface five already-built-but-invisible depths so a judge sees interactive proof, not static claims: impact per-circle drill-down, the neutral court exhibit rendered, bounds guards expandable, settlement preset tangles, and honest recurring-panel controls.

**Architecture:** Every task = one new pure feature file (Node-testable, dual-module IIFE) + a display-only screen edit + one new test suite in `tests/app/`. Golden engine functions are called, never modified. All state lives on `AhdApp` (app.js) as plain deterministic objects; screens render innerHTML strings; actions are `AhdApp.*` methods (house pattern).

**Tech Stack:** Vanilla ES5 JS (var, IIFE dual-module `module.exports` / `window.X`), no build step, tests are plain `.cjs` files auto-discovered by `tests/app/run-app-tests.cjs`.

## Global Constraints

- **NEVER touch** `demo/index.html`, `app/engine.js` internals, or any golden function (`sha256, canonical, sealBlock, recomputeSeal, verifyRecord, netting core + tiebreak, fmt, respread`). Call only.
- **Determinism:** no `Date.now` / `new Date` / `Math.random` / `Intl` / `.toLocaleString` / float money in logic. Integer halalas (1 SAR = 100). Enforced by `tests/app/app-offline.test.cjs` static scan — it scans `app/features/*.js`, so new feature files must pass it.
- **Spine:** no riba/penalty copy, no numeric trust signal, no percentage glyphs (٪/%) in product stats, red = tamper-fail only, late = amber, Qur'an in ﴿﴾ verbatim.
- **TDD:** failing test first, every task.
- **Gate after every task:** `cd tests && node app/run-app-tests.cjs` → all suites green (currently 35/35; grows to 40/40). Full gate at the end: `node run-all.cjs`.
- New browser files must be added as `<script>` tags in `app/index.html` (load feature files BEFORE `app.js`, screens AFTER).
- Commit message format: `feat: <what>` / `test: <what>` (conventional commits, no attribution footer).
- All UI copy is Arabic, dignified register, matches existing screens. Copy strings in this plan are final — use them verbatim.

---

### Task 1: Impact per-circle drill-down («أثر عهد» clickable buckets)

**Files:**
- Create: `app/features/impact-drill.js`
- Test: `tests/app/impact-drill.test.cjs`
- Modify: `app/screens/impact.js` (bucket rows become buttons; expanded bucket renders circle rows)
- Modify: `app/app.js` (add `impactState` + `impactBucket` handler, near the other state/action blocks)
- Modify: `app/index.html` (script tag for the new feature file)

**Interfaces:**
- Consumes: `Impact.FIXTURE_CIRCLES`, `Impact.computeCircleImpact(circle, settleFn)`, `Impact.makeSettleFn(engine)`, `Impact.K_FLOOR` from `app/features/impact.js` (all existing).
- Produces: `ImpactDrill.circlesForBucket(size, circles, settleFn)` → array of `{ id, label, size, obligationsCount, transfersAfter, transfersAvoided, savedSAR, conservationOk }`; `ImpactDrill.describeCircleAr(row, fmtN)` → one Arabic line string. `AhdApp.impactBucket(size)` toggles `AhdApp.impactState.bucket` (number|null) and rerenders.

- [ ] **Step 1: Write the failing test**

Create `tests/app/impact-drill.test.cjs`:

```js
/* ============================================================================
   impact-drill.test.cjs — TDD for features/impact-drill.js: the per-circle
   drill-down under an «أثر عهد» size-bucket. Pure projection over the existing
   Impact fixtures + the GOLDEN netting via Impact.makeSettleFn (call, never
   modify). k-anonymity is respected structurally: drill-down exists ONLY for
   exposed buckets (count >= K_FLOOR); labels are honest test-fixture labels.
============================================================================ */
const path = require("path");
const ROOT = path.join(__dirname, "..", "..", "app");
const engine = require(path.join(ROOT, "engine.js"));
const Impact = require(path.join(ROOT, "features", "impact.js"));
const Drill = require(path.join(ROOT, "features", "impact-drill.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("impact-drill.test: per-circle drill-down under a bucket");

const settle = Impact.makeSettleFn(engine);

(function bucketRows() {
  const rows = Drill.circlesForBucket(3, Impact.FIXTURE_CIRCLES, settle);
  eq(rows.length, 3, "size-3 bucket exposes its 3 test circles");
  ok(rows.every(r => r.size === 3), "every row is a size-3 circle");
  ok(rows.every(r => r.conservationOk === true), "conservation holds on every drilled circle");
  ok(rows.every(r => Number.isInteger(r.savedSAR)), "savedSAR is integer whole-SAR");
  ok(rows.every(r => r.transfersAfter <= r.obligationsCount), "netting never adds transfers");
  eq(rows[0].id, "TC-01", "rows keep fixture order (deterministic)");
  ok(typeof rows[0].label === "string" && rows[0].label.length > 0, "row carries the honest fixture label");
})();

(function kFloorGuard() {
  const rows = Drill.circlesForBucket(6, Impact.FIXTURE_CIRCLES, settle);
  eq(rows.length, 0, "suppressed bucket (size 6, count 1 < K_FLOOR) returns NO rows — k-anonymity");
})();

(function describeLine() {
  const rows = Drill.circlesForBucket(3, Impact.FIXTURE_CIRCLES, settle);
  const line = Drill.describeCircleAr(rows[0], String);
  ok(line.indexOf(rows[0].label) >= 0, "Arabic line names the circle label");
  ok(line.indexOf("%") < 0 && line.indexOf("٪") < 0, "no percentage glyph (spine)");
  ok(/محفوظة/.test(line), "line states conservation in words");
})();

(function determinism() {
  const a = JSON.stringify(Drill.circlesForBucket(4, Impact.FIXTURE_CIRCLES, settle));
  const b = JSON.stringify(Drill.circlesForBucket(4, Impact.FIXTURE_CIRCLES, settle));
  eq(a, b, "drill-down is deterministic (identical on re-run)");
})();

console.log("\n========================================================");
console.log("IMPACT-DRILL: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd "C:\Users\wasan\Downloads\Amad Hackathon\Amad Hackathon" && node tests/app/impact-drill.test.cjs`
Expected: FAIL — `Cannot find module '.../app/features/impact-drill.js'`

- [ ] **Step 3: Write the feature file**

Create `app/features/impact-drill.js`:

```js
/* ============================================================================
   features/impact-drill.js — per-circle drill-down under an «أثر عهد» bucket.
   Pure projection: reuses Impact.computeCircleImpact VERBATIM over the same
   honest fixtures; the k-anonymity floor is enforced STRUCTURALLY (a bucket
   below K_FLOOR yields zero rows, so the screen cannot even try to show it).
   Integer halalas → whole SAR only; no date/randomness/locale primitive.
   Dual module: Node `require`, browser `window.ImpactDrill`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./impact.js"));
  else root.ImpactDrill = factory(root.Impact);
})(typeof self !== "undefined" ? self : this, function (Impact) {
  "use strict";

  /* integer halalas → whole SAR (fixture amounts are whole-SAR multiples of 100) */
  function sarOf(h) { return (h - (h % 100)) / 100; }

  function circlesForBucket(size, circles, settleFn) {
    var inBucket = (circles || []).filter(function (c) { return c.size === size; });
    if (inBucket.length < Impact.K_FLOOR) return []; // k-anonymity: suppressed bucket has no drill-down
    return inBucket.map(function (c) {
      var p = Impact.computeCircleImpact(c, settleFn);
      return {
        id: p.id, label: c.label, size: p.size,
        obligationsCount: p.obligationsCount,
        transfersAfter: p.transfersAfter,
        transfersAvoided: p.transfersAvoided,
        savedSAR: sarOf(p.savedH),
        conservationOk: p.conservationOk
      };
    });
  }

  function describeCircleAr(row, fmtN) {
    var f = fmtN || function (n) { return String(n); };
    return "«" + row.label + "» (دائرة تجريبيّة): من " + f(row.obligationsCount) +
      " التزاماتٍ إلى " + f(row.transfersAfter) + " — وُفِّر تحريكُ " + f(row.savedSAR) +
      " ر.س، والمراكز محفوظة";
  }

  return { circlesForBucket: circlesForBucket, describeCircleAr: describeCircleAr };
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app/impact-drill.test.cjs`
Expected: PASS — `IMPACT-DRILL: 12 passed, 0 failed`

- [ ] **Step 5: Wire state + handler in app.js**

In `app/app.js`, directly under the line `circleState: { reminder: false },` add:

```js
    /* «أثر عهد» drill-down: which size-bucket is expanded (number|null) */
    ImpactDrill: (typeof window !== "undefined" ? window.ImpactDrill : null),
    impactState: { bucket: null },
```

And in the actions region, directly under the `circleReminderToggle` method, add:

```js
    /* ---- أثر عهد: expand/collapse one k-anonymous size-bucket ---- */
    impactBucket: function (size) {
      var s = Number(size);
      this.impactState.bucket = (this.impactState.bucket === s) ? null : s;
      return this.rerender();
    },
```

- [ ] **Step 6: Render drill-down in the impact screen**

In `app/screens/impact.js`, replace the `rows` block (the `var rows = agg.buckets.map(...)` statement) with:

```js
    var drill = (typeof window !== "undefined") ? window.ImpactDrill : null;
    var openBucket = app.impactState ? app.impactState.bucket : null;
    var rows = agg.buckets.map(function (b, i) {
      var t = b.avgTransfersAvoidedTenths;
      var isOpen = (openBucket === b.size);
      var head = '<button class="im-row' + (isOpen ? " on" : "") + '" onclick="AhdApp.impactBucket(' + b.size + ')">' +
        '<span class="im-row-l">' + App.esc(d.bucketLines[i]) + '</span>' +
        '<span class="im-bar" aria-hidden="true"><i style="flex-grow:' + t + '"></i><em style="flex-grow:' + (maxT - t) + '"></em></span>' +
        '<span class="im-caret" aria-hidden="true">' + (isOpen ? "▾" : "◂") + "</span></button>";
      var body = "";
      if (isOpen && drill) {
        var circles = drill.circlesForBucket(b.size, Impact.FIXTURE_CIRCLES, Impact.makeSettleFn(e));
        body = '<div class="im-drill">' + circles.map(function (c) {
          return '<div class="im-circle">' + App.esc(drill.describeCircleAr(c, function (n) { return App.fmtN(n); })) +
            ' <span class="chip ' + (c.conservationOk ? "teal" : "bad") + '">' + (c.conservationOk ? "✓" : "✗") + "</span></div>";
        }).join("") + "</div>";
      }
      return head + body;
    }).join("");
```

And in `app/index.html`, add (before the `app.js` script tag, next to the other feature scripts):

```html
  <script src="features/impact-drill.js"></script>
```

And in `app/app.css`, append:

```css
/* «أثر عهد» drill-down (bucket rows are now buttons) */
.im-row{display:flex;align-items:center;gap:8px;width:100%;text-align:inherit;background:none;border:0;cursor:pointer;padding:6px 0;font:inherit;color:inherit}
.im-row.on .im-row-l{font-weight:700}
.im-caret{color:var(--mut)}
.im-drill{padding:4px 12px 10px;border-inline-start:2px solid var(--line)}
.im-circle{padding:4px 0;font-size:var(--t-sm,13px)}
```

- [ ] **Step 7: Run the app suites**

Run: `cd tests && node app/run-app-tests.cjs`
Expected: all suites green (36/36 — the new suite joins). If `app-dom-smoke` or `app-offline` fails, the failure text names the exact violated rule — fix the new code, not the test.

- [ ] **Step 8: Commit**

```bash
git add app/features/impact-drill.js app/screens/impact.js app/app.js app/app.css app/index.html tests/app/impact-drill.test.cjs
git commit -m "feat: impact per-circle drill-down under k-anonymous buckets (JL-3 data depth)"
```

---

### Task 2: Render the neutral court exhibit («سِجلّ المعروف» export)

**Files:**
- Create: `app/features/exhibit-view.js`
- Test: `tests/app/exhibit-view.test.cjs`
- Modify: `app/screens/covenant.js` (render the exhibit block when `covenantState.exhibit` is true)
- Modify: `app/app.js` (`covenantExport` toggles `exhibit` instead of only flashing; `openCovenant` resets it)
- Modify: `app/index.html` (script tag)

**Interfaces:**
- Consumes: `CovenantLog.exhibitFor(sealed, record, engine)` (existing — returns `{ docType, ahdId, parties:{lender,borrower}, termsHash, basis, timeline:[{kind,atISO,amountFixed2,seal}], finalStatus, head }`), `CovenantLog.covenantTermsAr(record, engine)`.
- Produces: `ExhibitView.exhibitLinesAr(exhibit)` → `{ headerLines: string[], timelineLines: string[], footerLines: string[] }` (pure strings, pre-escaped-safe — screen escapes). `AhdApp.covenantState.exhibit` boolean.

- [ ] **Step 1: Write the failing test**

Create `tests/app/exhibit-view.test.cjs`:

```js
/* ============================================================================
   exhibit-view.test.cjs — TDD for features/exhibit-view.js: the on-screen
   projection of the NEUTRAL court exhibit (CovenantLog.exhibitFor). ON-SPINE:
   the rendered lines must contain NO score / band / number-as-reputation and
   NO day-counter — parties, terms-hash, sealed timeline, final status only.
============================================================================ */
const path = require("path");
const ROOT = path.join(__dirname, "..", "..", "app");
const engine = require(path.join(ROOT, "engine.js"));
const C = require(path.join(ROOT, "features", "covenant-log.js"));
const EV = require(path.join(ROOT, "features", "exhibit-view.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("exhibit-view.test: the neutral exhibit rendered as Arabic lines");

const evn = (t, x) => Object.assign({ type: t }, x || {});
const record = {
  id: "R-EXH", lender: "نايف", borrower: "مقهى الحي", amountSAR: 2500,
  installments: [{ dueISO: "2026-06-01", amountSAR: 2500 }],
  events: [evn("AHD_DRAFTED", { installments: 1 }), evn("LENDER_SIGNED"), evn("COUNTERPARTY_SIGNED"),
    evn("RECORD_SEALED", { atISO: "2026-05-01" }), evn("ACTIVATED"),
    evn("GRACE_GRANTED", { atISO: "2026-06-10" })]
};
const log = C.buildCovenantLog(record, {}, engine, "2026-06-21");
const sealed = C.sealCovenantLog(log, record, engine);
const exhibit = C.exhibitFor(sealed, record, engine);
const lines = EV.exhibitLinesAr(exhibit);

(function shape() {
  ok(Array.isArray(lines.headerLines) && lines.headerLines.length >= 3, "header has doc-type, parties, terms-hash lines");
  ok(lines.timelineLines.length === exhibit.timeline.length, "one line per sealed timeline entry");
  ok(Array.isArray(lines.footerLines) && lines.footerLines.length >= 2, "footer has final status + head seal");
})();

(function content() {
  const all = lines.headerLines.concat(lines.timelineLines, lines.footerLines).join("\n");
  ok(all.indexOf("نايف") >= 0 && all.indexOf("مقهى الحي") >= 0, "parties named");
  ok(all.indexOf(exhibit.termsHash.slice(0, 16)) >= 0, "terms-hash surfaced (prefix)");
  ok(all.indexOf(exhibit.head.slice(0, 16)) >= 0, "head seal surfaced (prefix)");
  ok(all.indexOf("2:280") >= 0 || all.indexOf("٢٨٠") >= 0, "basis (Quran 2:280) named");
})();

(function spine() {
  const all = lines.headerLines.concat(lines.timelineLines, lines.footerLines).join("\n");
  ok(!/سمعة|تصنيف|نقاط|score|band/i.test(all), "NO reputation vocabulary anywhere");
  ok(all.indexOf("%") < 0 && all.indexOf("٪") < 0, "no percentage glyph");
  ok(!/يوم(ًا)? متأخّ|أيام تأخ/.test(all), "no day-counter shaming");
})();

(function determinism() {
  const b = EV.exhibitLinesAr(C.exhibitFor(sealed, record, engine));
  ok(JSON.stringify(lines) === JSON.stringify(b), "deterministic (identical on re-run)");
})();

console.log("\n========================================================");
console.log("EXHIBIT-VIEW: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/app/exhibit-view.test.cjs`
Expected: FAIL — `Cannot find module '.../app/features/exhibit-view.js'`

- [ ] **Step 3: Write the feature file**

Create `app/features/exhibit-view.js`:

```js
/* ============================================================================
   features/exhibit-view.js — Arabic line projection of the NEUTRAL court
   exhibit (CovenantLog.exhibitFor). Pure strings for the covenant screen to
   escape + render. ON-SPINE: parties + terms-hash + sealed timeline + final
   status ONLY — no reputation vocabulary, no day-counter, no percentage.
   Dual module: Node `require`, browser `window.ExhibitView`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ExhibitView = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* exhibit timeline kind → dignified Arabic noun (mirrors CovenantLog.EVENT_KIND kinds) */
  var KIND_AR = {
    sealed: "خُتم العهد", reminder: "تذكيرٌ لطيف", grace_requested: "طُلبت نظرةٌ إلى ميسرة",
    grace_granted: "أُعيدت الجدولة بالمعروف", paid: "دفعةٌ حين تيسّر",
    forgiven_partial: "إبراءٌ جزئيٌّ صدقةً", forgiven_all: "إبراءُ ما تبقّى صدقةً",
    settled: "وُفِّي به — ذمّة محفوظة", dispute: "محلّ خلاف — وثيقة محايدة"
  };

  function shortHash(h) { return String(h || "").slice(0, 16); }

  function exhibitLinesAr(x) {
    var headerLines = [
      "وثيقة بيّنة محايدة — " + x.docType,
      "الطرفان: «" + x.parties.lender + "» و«" + x.parties.borrower + "» — عهد " + x.ahdId,
      "بصمة الشروط (terms-hash): " + shortHash(x.termsHash) + "…",
      "الأساس: قرضٌ حسنٌ دون أيّ زيادة — " + x.basis + " ﴿فنظرةٌ إلى ميسرة﴾"
    ];
    var timelineLines = (x.timeline || []).map(function (t, i) {
      return String(i + 1) + ". " + (KIND_AR[t.kind] || t.kind) +
        (t.atISO ? " — " + t.atISO : "") + " — " + t.amountFixed2 + " ر.س — SEAL " + t.seal + "…";
    });
    var footerLines = [
      "الحالة النهائيّة: " + (x.finalStatus || "قائم"),
      "رأس السلسلة (head): " + shortHash(x.head) + "…",
      "لا تحوي هذه البيّنة تقييمًا ولا سمعةً ولا عدَّ أيّامٍ — وقائع مختومة فقط (نظام الإثبات ٢٠٢٢)."
    ];
    return { headerLines: headerLines, timelineLines: timelineLines, footerLines: footerLines };
  }

  return { exhibitLinesAr: exhibitLinesAr, KIND_AR: KIND_AR };
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app/exhibit-view.test.cjs`
Expected: PASS — `EXHIBIT-VIEW: 12 passed, 0 failed`

- [ ] **Step 5: Wire handler + render**

In `app/app.js`:
1. Change `openCovenant` state reset line to include the flag:
```js
    openCovenant: function (id) { if (this.recordById(id)) { this.covenantState = { recordId: id, tamper: false, flash: null, exhibit: false }; this.daftariState.sheetId = null; return this.go("maroof"); } return this.rerender(); },
```
2. Replace the `covenantExport` method with:
```js
    covenantExport: function () {
      this.covenantState.exhibit = !this.covenantState.exhibit;
      this.covenantState.flash = this.covenantState.exhibit
        ? "هذه هي البيّنة المحايدة نفسُها — كما تُصدَّر دليلًا."
        : null;
      return this.rerender();
    },
```
3. Also update the seeded initial state (`covenantState: { recordId: "R-CAFE", tamper: false, flash: null },`) to add `exhibit: false`.

In `app/screens/covenant.js`, inside `render`, after the `var ver = ...` / `var broke = ...` block, add:

```js
    var exhibitBlock = "";
    if (st.exhibit && window.ExhibitView) {
      var ex = C.exhibitFor(sealed, r, e);
      var L = window.ExhibitView.exhibitLinesAr(ex);
      exhibitBlock = '<div class="cv-exhibit">' +
        L.headerLines.map(function (l) { return '<div class="cv-ex-h">' + App.esc(l) + "</div>"; }).join("") +
        '<div class="cv-ex-tl">' + L.timelineLines.map(function (l) { return '<div class="cv-ex-row">' + App.esc(l) + "</div>"; }).join("") + "</div>" +
        L.footerLines.map(function (l) { return '<div class="cv-ex-f">' + App.esc(l) + "</div>"; }).join("") +
      "</div>";
    }
```

Then in the returned HTML, insert `exhibitBlock +` immediately after the `'<div class="cv-act">' + ... + "</div>" +` block (i.e. the exhibit renders under the buttons), and change the export button label to reflect the toggle:

```js
        '<button class="primary" onclick="AhdApp.covenantExport()">' + (st.exhibit ? "أخفِ البيّنة" : "📤 صدِّرها كبيّنة محايدة") + "</button>" +
```

In `app/index.html`, add before `app.js`:

```html
  <script src="features/exhibit-view.js"></script>
```

In `app/app.css`, append:

```css
/* the rendered neutral exhibit («سِجلّ المعروف») */
.cv-exhibit{margin-top:10px;padding:12px;border:1px solid var(--line);border-radius:var(--r-md,10px);background:var(--card)}
.cv-ex-h{font-weight:700;padding:2px 0}
.cv-ex-tl{margin:8px 0;padding:6px 10px;border-inline-start:2px solid var(--line)}
.cv-ex-row{font-size:var(--t-sm,13px);padding:2px 0;direction:rtl}
.cv-ex-f{color:var(--mut);font-size:var(--t-sm,13px);padding:2px 0}
```

- [ ] **Step 6: Run the app suites**

Run: `cd tests && node app/run-app-tests.cjs`
Expected: all green (37/37).

- [ ] **Step 7: Commit**

```bash
git add app/features/exhibit-view.js app/screens/covenant.js app/app.js app/app.css app/index.html tests/app/exhibit-view.test.cjs
git commit -m "feat: render the neutral court exhibit on-screen (covenant export made visible)"
```

---

### Task 3: Bounds guards become expandable live checklist

**Files:**
- Create: `app/features/bounds-detail.js`
- Test: `tests/app/bounds-detail.test.cjs`
- Modify: `app/screens/bounds.js` (each بند becomes a `<details>` disclosure — the Sadu prototype idiom)
- Modify: `app/index.html` (script tag)

**Interfaces:**
- Consumes: `Bounds.SECTIONS` items' `enforcedBy` strings, format `"path/one.js · path/two.cjs"` (existing).
- Produces: `BoundsDetail.parseEnforcedBy(str)` → `{ files: string[], runCmd: string|null }` where `runCmd` is `"node <first tests/… path>"`; `BoundsDetail.detailAr(item)` → `{ files: string[], runCmd: string|null, invite: string }`.

- [ ] **Step 1: Write the failing test**

Create `tests/app/bounds-detail.test.cjs`:

```js
/* ============================================================================
   bounds-detail.test.cjs — TDD for features/bounds-detail.js: parse each
   guarantee's «يحرسه» line into its real guard files + the one command that
   runs that guard. Every parsed file must EXIST on disk (same teeth as
   bounds.test.cjs) — the screen's disclosure never names a ghost file.
============================================================================ */
const path = require("path");
const fs = require("fs");
const ROOT = path.join(__dirname, "..", "..");
const Bounds = require(path.join(ROOT, "app", "features", "bounds.js"));
const BD = require(path.join(ROOT, "app", "features", "bounds-detail.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("bounds-detail.test: enforcedBy → files + run command");

(function parsing() {
  const d = BD.parseEnforcedBy("app/engine.js · tests/app/proof.test.cjs");
  eq(d.files.length, 2, "splits on the middle dot");
  eq(d.files[0], "app/engine.js", "first file kept verbatim");
  eq(d.runCmd, "node tests/app/proof.test.cjs", "runCmd targets the tests/ file");
})();

(function noTestFile() {
  const d = BD.parseEnforcedBy("tests/app/app-dom-smoke.cjs");
  eq(d.files.length, 1, "single-file line parses");
  eq(d.runCmd, "node tests/app/app-dom-smoke.cjs", "a tests/ single file still gets a runCmd");
})();

(function allSectionsParse() {
  let items = 0, allExist = true, allHaveCmd = true;
  Bounds.SECTIONS.forEach(sec => sec.items.forEach(it => {
    items++;
    const d = BD.parseEnforcedBy(it.enforcedBy);
    d.files.forEach(f => { if (!fs.existsSync(path.join(ROOT, f))) allExist = false; });
    if (!d.runCmd) allHaveCmd = false;
  }));
  ok(items >= 14, "all sections' items parsed (" + items + ")");
  ok(allExist, "EVERY parsed guard file exists on disk (teeth)");
  ok(allHaveCmd, "every item yields a runnable guard command");
})();

(function arabicDetail() {
  const item = Bounds.SECTIONS[0].items[0];
  const d = BD.detailAr(item);
  ok(d.invite.indexOf("شغّل") >= 0 || d.invite.indexOf("اطلب") >= 0, "invite line invites running the guard");
  ok(d.files.length >= 1 && d.runCmd, "detailAr carries files + runCmd through");
})();

console.log("\n========================================================");
console.log("BOUNDS-DETAIL: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/app/bounds-detail.test.cjs`
Expected: FAIL — `Cannot find module '.../app/features/bounds-detail.js'`

- [ ] **Step 3: Write the feature file**

Create `app/features/bounds-detail.js`:

```js
/* ============================================================================
   features/bounds-detail.js — parse a guarantee's «يحرسه» line into its guard
   files + the ONE offline command that runs that guard. Pure string work; the
   files' existence is proven by tests/app/bounds-detail.test.cjs (same teeth
   as bounds.test.cjs). Honesty: the screen INVITES running the guard — it
   never claims a live pass it did not run.
   Dual module: Node `require`, browser `window.BoundsDetail`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BoundsDetail = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function parseEnforcedBy(str) {
    var files = String(str || "").split("·").map(function (s) { return s.trim(); }).filter(Boolean);
    var testFile = null;
    for (var i = 0; i < files.length; i++) {
      if (files[i].indexOf("tests/") === 0) { testFile = files[i]; break; }
    }
    return { files: files, runCmd: testFile ? "node " + testFile : null };
  }

  function detailAr(item) {
    var d = parseEnforcedBy(item.enforcedBy);
    return {
      files: d.files, runCmd: d.runCmd,
      invite: "شغّل حارسَه بنفسك دون إنترنت — الاختبار يفشل إن خالف الكودُ هذا الوعد."
    };
  }

  return { parseEnforcedBy: parseEnforcedBy, detailAr: detailAr };
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app/bounds-detail.test.cjs`
Expected: PASS — `BOUNDS-DETAIL: 10 passed, 0 failed`

- [ ] **Step 5: Screen — each بند becomes a no-JS `<details>` disclosure**

In `app/screens/bounds.js`, replace the whole `itemHTML` function with:

```js
  function itemHTML(it) {
    var BD = (typeof window !== "undefined") ? window.BoundsDetail : null;
    var d = BD ? BD.detailAr(it) : null;
    var body = "";
    if (d) {
      body = '<div class="bd-detail">' +
        d.files.map(function (f) { return '<div class="bd-file"><code>' + App.esc(f) + "</code></div>"; }).join("") +
        (d.runCmd ? '<div class="bd-cmd" dir="ltr">' + App.esc(d.runCmd) + "</div>" : "") +
        '<div class="bd-invite">' + App.esc(d.invite) + "</div>" +
      "</div>";
    }
    return '<details class="bd-item"><summary>' + App.esc(it.text) +
      '<span class="bd-guard">يحرسه: <code>' + App.esc(it.enforcedBy) + "</code></span></summary>" +
      body +
    "</details>";
  }
```

In `app/app.css`, append:

```css
/* bounds guards as no-JS disclosures (Sadu prototype idiom) */
details.bd-item{padding:6px 0}
details.bd-item summary{cursor:pointer;list-style:none}
details.bd-item summary::-webkit-details-marker{display:none}
details.bd-item .bd-guard{display:block;color:var(--mut);font-size:var(--t-xs,12px);margin-top:2px}
.bd-detail{margin:6px 0 2px;padding:6px 10px;border-inline-start:2px solid var(--line)}
.bd-file code{font-size:var(--t-xs,12px)}
.bd-cmd{font-family:var(--mono,monospace);direction:ltr;text-align:left;background:var(--seal-well,#f3f3f0);padding:4px 8px;border-radius:6px;margin:4px 0;font-size:var(--t-xs,12px)}
.bd-invite{color:var(--mut);font-size:var(--t-xs,12px)}
```

In `app/index.html`, add before `app.js`:

```html
  <script src="features/bounds-detail.js"></script>
```

- [ ] **Step 6: Run the app suites**

Run: `cd tests && node app/run-app-tests.cjs`
Expected: all green (38/38). Watch `bounds.test.cjs` and `app-dom-smoke.cjs` specifically — the `bd-guard` line must still contain the verbatim `enforcedBy` string (it does: it moved inside `<summary>`).

- [ ] **Step 7: Commit**

```bash
git add app/features/bounds-detail.js app/screens/bounds.js app/app.css app/index.html tests/app/bounds-detail.test.cjs
git commit -m "feat: bounds guards expand to their real files + run command (guarantees-as-code, literally)"
```

---

### Task 4: Settlement preset tangles («المقاصّة» becomes pokeable)

**Files:**
- Create: `app/features/settle-presets.js`
- Test: `tests/app/settle-presets.test.cjs`
- Modify: `app/screens/settlement.js` (preset chips above the header; selected preset feeds the SAME golden pipeline)
- Modify: `app/app.js` (add `settleState` + `settlePreset` handler)
- Modify: `app/index.html` (script tag)

**Interfaces:**
- Consumes: `engine.IOUS` (the golden 9-IOU tangle), `engine.NODES` (the golden five names), `Settlement.settlementView(edges, engine)`, `Settlement.conservationProof(edges, engine)` (both already take an arbitrary edge list).
- Produces: `SettlePresets.PRESETS` → array of `{ key, labelAr, edges|null }` where `edges: null` means "use the golden `engine.IOUS`"; `SettlePresets.edgesFor(key, engine)` → the edge list (`{from,to,amount}` whole SAR, names ⊆ `engine.NODES`). `AhdApp.settleState.preset` (string key, default `"golden"`), `AhdApp.settlePreset(key)`.

- [ ] **Step 1: Write the failing test**

Create `tests/app/settle-presets.test.cjs`:

```js
/* ============================================================================
   settle-presets.test.cjs — TDD for features/settle-presets.js: alternative
   demo tangles for «المقاصّة». Every preset uses ONLY the golden five names
   (no roster shim needed), whole-SAR integer amounts, and must (a) conserve
   every member's net through the GOLDEN netting and (b) never increase the
   transfer count. Default preset "golden" IS engine.IOUS byte-identically.
============================================================================ */
const path = require("path");
const ROOT = path.join(__dirname, "..", "..", "app");
const engine = require(path.join(ROOT, "engine.js"));
const S = require(path.join(ROOT, "features", "settlement.js"));
const P = require(path.join(ROOT, "features", "settle-presets.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("settle-presets.test: alternative tangles through the golden netting");

(function goldenDefault() {
  eq(P.PRESETS[0].key, "golden", "first preset is the golden tangle");
  const edges = P.edgesFor("golden", engine);
  ok(edges === engine.IOUS, "golden preset returns engine.IOUS ITSELF (byte-identical, no copy)");
})();

(function presetShape() {
  ok(P.PRESETS.length >= 3, "at least 3 presets (golden + 2 alternatives)");
  P.PRESETS.forEach(p => {
    const edges = P.edgesFor(p.key, engine);
    ok(edges.length > 0, p.key + ": has edges");
    ok(edges.every(t => engine.NODES.indexOf(t.from) >= 0 && engine.NODES.indexOf(t.to) >= 0),
      p.key + ": every name is one of the golden five (no roster shim)");
    ok(edges.every(t => Number.isInteger(t.amount) && t.amount > 0), p.key + ": whole-SAR integer amounts");
    ok(typeof p.labelAr === "string" && p.labelAr.length > 0, p.key + ": has an Arabic label");
  });
})();

(function conservationEverywhere() {
  P.PRESETS.forEach(p => {
    const edges = P.edgesFor(p.key, engine);
    const cp = S.conservationProof(edges, engine);
    ok(cp.conserved && cp.netsPreserved, p.key + ": golden netting conserves every member's net");
    const v = S.settlementView(edges, engine);
    ok(v.afterCount <= v.beforeCount, p.key + ": netting never adds transfers (" + v.beforeCount + "→" + v.afterCount + ")");
  });
})();

(function reductionIsVisible() {
  // the alternative presets must actually DEMONSTRATE reduction (not 3→3)
  P.PRESETS.filter(p => p.key !== "golden").forEach(p => {
    const v = S.settlementView(P.edgesFor(p.key, engine), engine);
    ok(v.afterCount < v.beforeCount, p.key + ": visibly reduces (" + v.beforeCount + "→" + v.afterCount + ")");
  });
})();

(function unknownKeyFallsBack() {
  ok(P.edgesFor("nope", engine) === engine.IOUS, "unknown key falls back to the golden tangle");
})();

console.log("\n========================================================");
console.log("SETTLE-PRESETS: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/app/settle-presets.test.cjs`
Expected: FAIL — `Cannot find module '.../app/features/settle-presets.js'`

- [ ] **Step 3: Write the feature file**

Create `app/features/settle-presets.js`. NOTE: it references the golden five names via `engine.NODES` indices at call time (never hardcodes name strings), so it can never drift from the engine roster:

```js
/* ============================================================================
   features/settle-presets.js — alternative demo tangles for «المقاصّة», so a
   judge can poke the netting instead of watching one canned result. Every
   preset uses ONLY the golden five (engine.NODES, by index — never a copied
   name string), whole-SAR integer amounts; the netting itself stays the
   GOLDEN engine.netting via features/settlement.js (call, never modify).
   Preset "golden" returns engine.IOUS itself — the default view is
   byte-identical to before this file existed.
   Dual module: Node `require`, browser `window.SettlePresets`.
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SettlePresets = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* edge builder over golden roster indices — amounts are whole SAR integers */
  function E(i, j, amount) { return { i: i, j: j, amount: amount }; }

  /* the two alternative tangles, as roster-index triples:
     - "chain": a 5-member payment chain + a back edge → collapses hard
     - "hub": everyone owes one member different amounts → nets to few legs */
  var ALT = {
    chain: [E(0, 1, 500), E(1, 2, 500), E(2, 3, 500), E(3, 4, 500), E(4, 0, 300), E(0, 2, 200)],
    hub: [E(1, 0, 400), E(2, 0, 250), E(3, 0, 350), E(4, 0, 150), E(0, 4, 100)]
  };

  var PRESETS = [
    { key: "golden", labelAr: "شبكة العرض (٩ التزامات)" },
    { key: "chain", labelAr: "سلسلة تسديد (٦ التزامات)" },
    { key: "hub", labelAr: "الكلّ يدين لواحد (٥ التزامات)" }
  ];

  function edgesFor(key, engine) {
    var alt = ALT[key];
    if (!alt) return engine.IOUS;
    return alt.map(function (t) {
      return { from: engine.NODES[t.i], to: engine.NODES[t.j], amount: t.amount };
    });
  }

  return { PRESETS: PRESETS, edgesFor: edgesFor };
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app/settle-presets.test.cjs`
Expected: PASS — `SETTLE-PRESETS: ~20 passed, 0 failed`. If `reductionIsVisible` fails for a preset, adjust that preset's amounts until the golden netting visibly reduces — do NOT touch the netting.

- [ ] **Step 5: Wire state + handler + screen**

In `app/app.js`, under `Settlement: Settlement,` add:

```js
    SettlePresets: (typeof window !== "undefined" ? window.SettlePresets : null),
    settleState: { preset: "golden" },
```

Under the `circleReminderToggle` method add:

```js
    /* ---- المقاصّة: switch the demo tangle (golden netting unchanged) ---- */
    settlePreset: function (key) {
      var P = this.SettlePresets;
      var known = P && P.PRESETS.some(function (p) { return p.key === key; });
      this.settleState.preset = known ? key : "golden";
      return this.rerender();
    },
```

In `app/screens/settlement.js`, replace the two lines

```js
    var v = S.settlementView(e.IOUS, e);
    var cp = S.conservationProof(e.IOUS, e);
```

with:

```js
    var P = (typeof window !== "undefined") ? window.SettlePresets : null;
    var presetKey = (app.settleState && app.settleState.preset) || "golden";
    var edges = P ? P.edgesFor(presetKey, e) : e.IOUS;
    var v = S.settlementView(edges, e);
    var cp = S.conservationProof(edges, e);
    var chips = P ? '<div class="se-presets">' + P.PRESETS.map(function (p) {
      var on = p.key === presetKey;
      return '<button class="fchip' + (on ? " on" : "") + '" onclick="AhdApp.settlePreset(\'' + p.key + '\')">' + App.esc(p.labelAr) + "</button>";
    }).join("") + "</div>" : "";
```

and insert `chips +` right after the `'<div class="se-head">...</div>' +` line in the returned HTML.

NOTE: `screens/impact.js` `collapseHTML` still uses `e.IOUS` directly — leave it; the impact collapse is pinned to the golden tangle by design.

In `app/index.html`, add before `app.js`:

```html
  <script src="features/settle-presets.js"></script>
```

In `app/app.css`, append:

```css
.se-presets{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}
```

- [ ] **Step 6: Run the app suites**

Run: `cd tests && node app/run-app-tests.cjs`
Expected: all green (39/39). `app-dom-smoke.cjs` renders with default state → default view stays byte-equivalent to the pre-task render except the new chips row.

- [ ] **Step 7: Commit**

```bash
git add app/features/settle-presets.js app/screens/settlement.js app/app.js app/app.css app/index.html tests/app/settle-presets.test.cjs
git commit -m "feat: settlement preset tangles - judges can poke the golden netting live"
```

---

### Task 5: Honest recurring panel («الدائرة+» — real أوقف/استأنف, no dead-button copy)

**Files:**
- Modify: `app/screens/circle-adv.js` (recurring panel gets a working stop/resume button; note copy stops advertising a nonexistent «عدّل»)
- Modify: `app/app.js` (`circleAdvState` gains `recStopped`; new `circleRecurringToggle` handler)
- Test: `tests/app/circle-adv-honest.test.cjs` (static source scan — the pattern `riba-lint-corpus`/`app-offline` already use)

**Interfaces:**
- Consumes: `CircleAdv.recurringPosts(tmpl, cycleKeys)` (existing, pure).
- Produces: `AhdApp.circleAdvState.recStopped` boolean (default `false`), `AhdApp.circleRecurringToggle()`.

- [ ] **Step 1: Write the failing test**

Create `tests/app/circle-adv-honest.test.cjs`:

```js
/* ============================================================================
   circle-adv-honest.test.cjs — the recurring panel must not advertise controls
   that do not exist (a judge clicking dead copy is the worst moment). Static
   source scan (the house pattern): the screen must wire a real stop/resume
   handler, app.js must define it + its state, and the old dead-copy line
   («عدّل» / «أوقف» متاحة دائمًا) must be gone.
============================================================================ */
const path = require("path");
const fs = require("fs");
const ROOT = path.join(__dirname, "..", "..", "app");
const screenSrc = fs.readFileSync(path.join(ROOT, "screens", "circle-adv.js"), "utf8");
const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("circle-adv-honest.test: no dead controls in the recurring panel");

ok(screenSrc.indexOf("AhdApp.circleRecurringToggle()") >= 0, "screen wires the stop/resume handler");
ok(appSrc.indexOf("circleRecurringToggle:") >= 0, "app.js defines circleRecurringToggle");
ok(appSrc.indexOf("recStopped") >= 0, "circleAdvState carries recStopped");
ok(screenSrc.indexOf("«عدّل» / «أوقف» متاحة دائمًا") < 0, "old dead-copy line removed");
ok(screenSrc.indexOf("recStopped") >= 0, "screen renders both stopped and running states");
ok(!/غرامة\s+تأخير|فائدة\s+شهريّة/.test(screenSrc), "no riba copy introduced (spine)");

console.log("\n========================================================");
console.log("CIRCLE-ADV-HONEST: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/app/circle-adv-honest.test.cjs`
Expected: FAIL — 4 of 6 assertions fail (handler, state, copy line, recStopped render all missing).

- [ ] **Step 3: Implement**

In `app/app.js`:
1. Change `circleAdvState: { graduated: null, flash: null },` to:
```js
    circleAdvState: { graduated: null, recStopped: false, flash: null },
```
2. Under `circleAdvDismiss`, add:
```js
    /* recurring قِسْمة: stop/resume — stopping is honest (future cycles only, no retro effect) */
    circleRecurringToggle: function () {
      this.circleAdvState.recStopped = !this.circleAdvState.recStopped;
      this.circleAdvState.flash = this.circleAdvState.recStopped
        ? "أُوقفت القِسْمة الدائمة — لا أثر رجعيًّا، وما نُشر يبقى كما هو."
        : "استُؤنفت القِسْمة الدائمة — تُنشَر تلقائيًّا كلَّ شهر.";
      return this.rerender();
    },
```

In `app/screens/circle-adv.js`, replace the whole `/* 2 · recurring */` block (from `var tmpl = ...` through the `pRec = ...` statement) with:

```js
    /* 2 · recurring — with a REAL stop/resume control (no advertised-but-dead buttons) */
    var tmpl = { name: "الإيجار", amountMinor: e.toMinor(3600), payer: "تركي", members: ["سعود", "تركي", "عبدالله"], split: "equal" };
    var stopped = !!st.recStopped;
    var posts = stopped ? [] : CA.recurringPosts(tmpl, ["2026-07", "2026-08", "2026-09"]);
    var recBody = stopped
      ? '<div class="ca-line ca-stopped"><span>القِسْمة مُوقَفة — لا تُنشَر دوراتٌ جديدة، وما نُشر سابقًا يبقى كما هو.</span></div>'
      : posts.map(function (p) {
          return '<div class="ca-line"><span>' + arMonth(p.cycleKey, e) + "</span><span>نصيب سعود وعبدالله: " + App.fmtN(p.owed["سعود"] / 100) + " ر.س لكلٍّ</span></div>";
        }).join("");
    var pRec = '<div class="ca-card"><div class="ca-h">قِسْمة دائمة · الإيجار</div>' +
      '<div class="ca-sub">' + App.fmtN(tmpl.amountMinor / 100) + ' ر.س · كل شهر · يدفع تركي ثم تُقسَّم بالتساوي</div>' +
      recBody +
      '<button class="mini" onclick="AhdApp.circleRecurringToggle()">' + (stopped ? "استأنف القِسْمة" : "أوقف القِسْمة") + "</button>" +
      '<div class="ca-note">تُنشَر تلقائيًّا كلَّ شهر ما دامت جارية — بلا فائدةٍ ولا غرامة.</div></div>';
```

In `app/app.css`, append:

```css
.ca-stopped span{color:var(--mut)}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app/circle-adv-honest.test.cjs`
Expected: PASS — `CIRCLE-ADV-HONEST: 6 passed, 0 failed`

- [ ] **Step 5: Run the app suites**

Run: `cd tests && node app/run-app-tests.cjs`
Expected: all green (40/40).

- [ ] **Step 6: Commit**

```bash
git add app/screens/circle-adv.js app/app.js app/app.css tests/app/circle-adv-honest.test.cjs
git commit -m "feat: real stop/resume for recurring split - no advertised-but-dead controls"
```

---

### Task 6: Full gate, browser verification, judge-lens note, vault sync

**Files:**
- Modify: `_meta/OPEN-ITEMS.md` (JL-3 note: drill-down shipped)
- Modify: `AmadHackathon/05 حالة المشروع.md` (dated entry)

**Interfaces:** none — verification and bookkeeping.

- [ ] **Step 1: Full harness**

Run: `cd tests && node run-all.cjs`
Expected: single green banner, assertion count grows from 1687/0 (new suites add ~50 assertions), tripwire `e2f48467… OK`. Any red → fix the code, never the assertion.

- [ ] **Step 2: Browser verification (serve + click through)**

Run: `node app/_serve-app.cjs` then open `http://localhost:8124` in the Browser pane and verify, screen by screen:
1. أثر عهد → click a distribution bucket → circle rows expand with ✓ chips; click again → collapses.
2. دفتري → R-CAFE row → سِجلّ المعروف → «صدِّرها كبيّنة محايدة» → the exhibit block renders (parties, terms-hash, sealed timeline, head); button now reads «أخفِ البيّنة».
3. الضمانات والحدود → click a بند → discloses files + `node tests/...` command (LTR mono).
4. المقاصّة → chips «سلسلة تسديد» / «الكلّ يدين لواحد» switch the tangle; numbers + conservation proof recompute; «شبكة العرض» restores the golden 9→2.
5. الدائرة+ → «أوقف القِسْمة» empties future cycles + flash; «استأنف القِسْمة» restores.
Take one screenshot per screen as proof.

- [ ] **Step 3: Judge-lens score note**

Append to `_meta/OPEN-ITEMS.md` under the JL section:

```
- JL-3 depth: per-circle drill-down shipped (2026-07-11) — «أثر عهد» buckets now expand to
  anonymized per-circle rows (k-floor respected structurally). Re-score data criterion at
  the 14-Jul Gate-B panel; target ≥8 (was 7.5).
```

- [ ] **Step 4: Vault sync**

Append to `AmadHackathon/05 حالة المشروع.md` (above the الروابط line) a dated section:

```
## 2026-07-11 — تعميق خمس شاشات (عدسة التحكيم)
- 📊 أثر عهد: الفئات تتوسّع لدوائر مجهّلة (يهاجم معيار البيانات 7.5)
- 🕊️ سِجلّ المعروف: البيّنة المحايدة تُعرَض كاملةً على الشاشة
- 🧭 الضمانات: كلّ بندٍ ينفتح على ملفّاته وأمر تشغيل حارسه
- 🔗 المقاصّة: ثلاث شبكاتٍ يجرّبها المحكّم بنفسه — والخوارزميّة الذهبيّة نفسها
- 🔁 الدائرة+: «أوقف/استأنف» حقيقيّة — لا أزرار ميّتة
- الحزمة: 40/40 خضراء + البوّابة الكاملة
```

and bump `updated:` in its frontmatter to the current date.

- [ ] **Step 5: Commit**

```bash
git add _meta/OPEN-ITEMS.md "AmadHackathon/05 حالة المشروع.md"
git commit -m "docs: judge-lens JL-3 depth note + vault sync for five deepened screens"
```

---

## Self-Review (done at plan time)

- **Coverage:** the five gaps from the audit (impact drill-down, exhibit render, bounds checklist, settlement presets, dead buttons) each have a task; judge-lens rule 6 (score note) covered by Task 6.
- **Placeholders:** none — every step carries the actual code/copy.
- **Type consistency:** `ImpactDrill.circlesForBucket/describeCircleAr`, `ExhibitView.exhibitLinesAr`, `BoundsDetail.parseEnforcedBy/detailAr`, `SettlePresets.PRESETS/edgesFor`, `AhdApp.impactBucket/settlePreset/circleRecurringToggle` are named identically in feature, screen, app.js, and test steps.
- **Known risk:** exact suite counts (36→40) may drift if unrelated suites exist; the invariant is "all green, count grows by exactly 1 per task". `app-offline.test.cjs` static scan applies to the four new feature files — they contain no banned primitive.
