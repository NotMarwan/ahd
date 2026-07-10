# Sadu Full-Coverage Prototype (fix + improve + 17 screens) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Written for a low-effort executor:** verbatim code where it matters; where content comes from source files, the exact source path is named and inventing Arabic is forbidden.

**Goal:** One round that (a) fixes every P1/P2 from the Impeccable audit, (b) upgrades the affordance system (no banned patterns), and (c) extends the prototype from 7 to **17 screens — every feature the product has** — via a partials+build architecture that lets agents work in parallel without file collisions.

**Architecture:** `application/prototypes/src/` holds `head.html` (stage open + CSS in one `<style>`), one partial per screen (`s01-home.html` … `s17-settings.html`), and `foot.html`. `application/prototypes/build-prototype.cjs` concatenates them (in the NAV order below) into the single self-contained `dir-b-sadu.html` — same idiom as the repo's `build-engine.cjs`. Artifact + cloud DS keep consuming the one output file at the same URL/card. `check-tokens.cjs`/`contrast-check.cjs` keep watching the OUTPUT.

**Tech Stack:** HTML/CSS partials, Node CJS build script (zero deps), existing design scripts.

## Global Constraints

- **Spine:** riba words only negated · trust is a word · red family reserved for Shariah stop/tamper · no `٪`/`%` in copy · integer SAR · «(محاكاة)» on Nafath/sarie surfaces · verses verbatim ﴿﴾ · lateness is amber-family, never red · no numeric trust anywhere.
- **Gate frozen:** `cd tests && node run-all.cjs` → exactly `AHD GATE ✅ 1687/0` after every commit. Build script lives in `application/prototypes/`, never `tests/`.
- **Arabic typography rule:** no `letter-spacing`/`text-transform` on Arabic; Latin/digit runs only.
- **Content rule (hard):** every Arabic string in new screens is copied verbatim from the matching `app/screens/<key>.js` / `app/features/<key>.js` or from the existing prototype. Inventing copy = task failure. Exception: ≤1 short subtitle line per screen following existing register, flagged in the report.
- **Size caps:** each screen partial ≤120 lines · `head.html` ≤520 lines · OUTPUT `dir-b-sadu.html` ≤1,800 lines (cap raised from 900 by this plan — the old cap assumed 7 screens).
- **Affordance system (replaces side-stripes, binding):** callout cards = tinted background + full 1px hairline border + leading icon glyph. No `border-inline-start` accents >1px anywhere.
- **Checks after every task:** `node application/design/contrast-check.cjs` exit 0 · `node application/design/check-tokens.cjs` exit 0 · greps (no `<script`, no `http`, `(محاكاة)` present, ﴿﴾ intact, no `٪` in copy, no Arabic letterspacing) · gate `1687/0`.
- Emoji icons stay in the prototype by decision (repo precedent: web app skipped emoji→SVG deliberately); the port contract carries the fix (Task 1 adds RN-MAPPING row 22).
- Artifact republished to the SAME URL (`dir-b-sadu.html` path) after Tasks 2, 5 and 6; DS copy `DirBSadu.html` refreshed alongside (controller does artifact/DS — implementers never publish).

**Screen order (output + stage grouping):** section «الأساس» = ① home ② create/riba ③ settle ④ daftari ⑤ borrower ⑥ proof ⑦ impact (existing). Section «بقيّة الملامح» = ⑧ request ⑨ open ⑩ timeline ⑪ circle ⑫ circle-adv ⑬ standing ⑭ covenant ⑮ dispute ⑯ bounds ⑰ settings (new).

---

### Task 1: Partials restructure + build script (no visual change)

**Files:**
- Create: `application/prototypes/build-prototype.cjs`
- Create: `application/prototypes/src/head.html`, `src/s01-home.html` … `src/s07-impact.html`, `src/foot.html` (split of the CURRENT file)
- Regenerate: `application/prototypes/dir-b-sadu.html`

**Interfaces:**
- Produces: `node application/prototypes/build-prototype.cjs` → writes the output file; the manifest order inside the script is the screen registry every later task appends to.

- [ ] **Step 1:** Split the current `dir-b-sadu.html`: everything from `<title>` through `</style>` plus `<div class="stage">` + `.stage-head` → `src/head.html`; each `<!-- ① … -->` phone-slot block → its `src/s0N-<key>.html`; `.stage-foot` + closing tags → `src/foot.html`. Byte-preserve content — this task changes ZERO rendered pixels.
- [ ] **Step 2:** Write `build-prototype.cjs`:

```js
#!/usr/bin/env node
/* build-prototype.cjs — concatenates src/ partials into the single self-contained
   prototype (same idiom as app/build-engine.cjs). Edit partials, never the output. */
"use strict";
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, "dir-b-sadu.html");
const ORDER = [
  "head.html",
  "s01-home.html","s02-create.html","s03-settle.html","s04-daftari.html",
  "s05-borrower.html","s06-proof.html","s07-impact.html",
  // بقيّة الملامح — appended by later tasks:
  // "s08-request.html","s09-open.html","s10-timeline.html","s11-circle.html",
  // "s12-circle-adv.html","s13-standing.html","s14-covenant.html","s15-dispute.html",
  // "s16-bounds.html","s17-settings.html",
  "foot.html",
];
const parts = ORDER.map((f) => {
  const p = path.join(SRC, f);
  if (!fs.existsSync(p)) { console.error("MISSING PARTIAL: " + f); process.exit(1); }
  return fs.readFileSync(p, "utf8");
});
const out = parts.join("\n");
if (/<script|https?:\/\//i.test(out.replace(/https?:\/\/(?=[^"']*")/g, ""))) { /* belt-and-braces scan happens below anyway */ }
fs.writeFileSync(OUT, out);
console.log("built dir-b-sadu.html (" + out.split("\n").length + " lines, " + (ORDER.length - 2) + " screens)");
```

(Remove the dead `if` line if it confuses — the real scans are the design-check greps; keep the script minimal: read, join, write, count.)

- [ ] **Step 3:** Build; open the output vs `git show HEAD:application/prototypes/dir-b-sadu.html` — allow only whitespace-join differences; all checks (Global Constraints list) pass; gate `1687/0`.
- [ ] **Step 4:** Add RN-MAPPING row 22: `| 22 | emoji icons | @expo/vector-icons or bundled SVG set — emoji render differently per platform | 🟡 | swap at port time, one icon component |`
- [ ] **Step 5:** Commit: `git add application/prototypes application/design/RN-MAPPING.md && git commit -m "refactor(design): prototype split into partials + build script (no visual change); RN-MAPPING row 22 emoji icons"`

---

### Task 2: Audit fix round (P1/P2) in the partials

**Files:**
- Modify: `src/head.html` (CSS), `src/s01…s07` (markup where stripes/labels sit)
- Modify: `application/design/tokens.json`, `application/design/contrast-check.cjs` (PAIRS)
- Regenerate output via build script

**Interfaces:**
- Produces: the upgraded callout idiom (`.callout`) all new screens use.

- [ ] **Step 1: Kill the side-stripes.** In `head.html` replace `.fix`, `.insight`, and `.stopcard`'s `border-inline-start` accents with the callout idiom:

```css
.callout{border-radius:11px; padding:10px 13px; font-size:12.5px; line-height:1.85; display:flex; gap:9px; align-items:flex-start; border:1px solid var(--hair)}
.callout .ci{flex:none; font-size:14px; margin-top:2px}
.callout.fixv{background:var(--okSoftBg, var(--teal-soft)); color:var(--ink)} .callout.fixv b{color:var(--teal-text)}
.callout.insight{background:var(--card); color:var(--ink2)}
```

Markup: `.fix` → `<div class="callout fixv"><span class="ci">🌿</span><span>…same text…</span></div>`; `.insight` → `<div class="callout insight"><span class="ci">💡</span><span>…</span></div>`. `.stopcard`: delete only its `border-inline-start:4px solid var(--stop)` (it keeps full border + tint + ⛔ icon — already compliant).
- [ ] **Step 2: Type floor.** `.gauge .lbl` 9px→10.5px (shorten label to «صافي» if it overflows); `.amt small`, `.ds`, `.st .k`, `.official-line` → ≥11px where informational (`.ds` serial may stay 10.5px — decorative Latin).
- [ ] **Step 3: Official line contrast.** Remove `opacity:.72`; set solid `color:#4a5a52` (pre-blended equivalent) and add PAIRS row `["official footer", "#4a5a52", "#efe9dc", 4.5]` — adjust hex until the script passes.
- [ ] **Step 4: Stray hexes → tokens.** Add to `:root` and use everywhere they occur: `--sand-chip:#e8e0cf; --track:#e2d7c0; --ico-sand:#efe8d8; --gold-soft-bg:#f3ead2; --disabled:#cbbfa9; --plain-soft:#ece5d4;` Then mirror the six into `tokens.json` `color` (names: sandChip, track, icoSand, covenantSoft, disabled, plainSoft) — `check-tokens.cjs` must exit 0.
- [ ] **Step 5:** Rebuild, all checks, gate, commit: `git commit -m "fix(design): audit round - callout idiom replaces side-stripes, type floor 11px, official-line contrast, stray hexes tokenized"`

---

### Task 3: New screens batch A — «طلب وارد» ⑧ · «القرض المفتوح» ⑨ · «سِجلّ الشهادة» ⑩

**Files:**
- Create: `src/s08-request.html`, `src/s09-open.html`, `src/s10-timeline.html`
- Modify: `build-prototype.cjs` ORDER (uncomment the three), `src/head.html` (only if a screen needs ≤15 new CSS lines — reuse existing idioms first)

**Interfaces:**
- Consumes: content from `app/screens/request.js`, `app/screens/open-loan.js`, `app/screens/timeline.js` (+ their `app/features/*` for wording) — Arabic verbatim.
- Produces: three phone-slot partials in the established structure (`phone-slot > slot-lbl + phone > glass > island/status/viewport/homebar`).

Per-screen spec (idioms to reuse; numbers/labels from the source files):
- **⑧ request:** nav-lg header «طلب وارد»-style title from source · one `.group` with the requester cell · a `.quote` with the requested terms · `.steps` rail reused (٢ الفحص active) · actions: prominent «أقبل وأختم عبر نفاذ (محاكاة)» + tinted decline — labels verbatim from `request.js` (it already carries the (محاكاة) tag — keep).
- **⑨ open:** ceremony-style big amount (`.st .v` scale) «متى ما تيسّر» · segmented progress bar (paid/صدقة/remaining) as three flex segments with legend — NO percent text (flex-grow proportions) · journey list as `.group` cells · gold verse ﴿فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾ · actions: «سدّد ما تيسّر» + ghost «🤍 اجعلها صدقة» (label verbatim from open-loan.js).
- **⑩ timeline:** nav-lg «سِجلّ الشهادة» · count chips row (reuse `.chip` variants — sealed teal, kept/mercy gold, amber late) · feed as `.group` cells with tone icon + line + meta (tones from timeline.js; lateness amber never red).
- [ ] **Step 1:** Read the three source screen files; extract titles, labels, chips, button texts.
- [ ] **Step 2:** Write the three partials (≤120 lines each), uncomment ORDER entries, rebuild.
- [ ] **Step 3:** All checks + gate; visual sanity: open the built file in a browser, screenshot the 3 new phones (0 console errors).
- [ ] **Step 4:** Commit: `git commit -m "feat(design): screens 8-10 - request, open-loan, witness timeline (content verbatim from app/screens)"`

---

### Task 4: New screens batch B — «الدائرة» ⑪ · «الدائرة+» ⑫ · «سُلفة بالمعروف» ⑬

**Files:** `src/s11-circle.html`, `src/s12-circle-adv.html`, `src/s13-standing.html`; ORDER update.

**Interfaces:** content from `app/screens/circle.js`, `app/screens/circle-adv.js`, `app/screens/standing.js`.

Per-screen spec:
- **⑪ circle:** nav-lg title from source · progress card: `.gauge` reused (sweep ∝ collected/target — pick the real fixture numbers from circle.js) + collected/target as `.split` panel · member `.group` (paid=teal chip, pending=plain chip) · reminder button (tinted).
- **⑫ circle-adv:** pledge/recurring cards as `.group` cells + `.callout insight` for the counsel-seam note (wording verbatim — it references OT-VAL honestly) · seal line in mono.
- **⑬ standing:** parties pill row (two `.chip.teal` + gold arrow) · 3-cell ledger as `.tiles` (paid teal / remaining gold / cycle) · sealed posts as `.group` cells with mono hash line (`.hash` idiom, LTR) · seam note as amber `.callout` (create `.callout.amber{background:var(--amber-soft,#f7e9d6); …}` if no amber tokens exist yet: add `--amber:#a9571a; --amber-soft:#f7e9d6;` to :root + tokens.json + PAIRS `["amber on amber-soft","#a9571a","#f7e9d6",4.5]` — if it fails, darken to pass and note).
- [ ] Steps mirror Task 3 (read sources → write ≤120-line partials → ORDER → rebuild → checks+gate → screenshot → commit `feat(design): screens 11-13 - circle, circle-adv, standing qard`).

---

### Task 5: New screens batch C — «سِجلّ المعروف» ⑭ · «محلّ خلاف» ⑮ · «الضمانات والحدود» ⑯ · «الإعدادات» ⑰

**Files:** `src/s14-covenant.html`, `src/s15-dispute.html`, `src/s16-bounds.html`, `src/s17-settings.html`; ORDER completes.

**Interfaces:** content from `app/screens/covenant.js`, `app/screens/dispute.js`, `app/screens/bounds.js`, `app/screens/settings.js` (+ `app/features/bounds.js` for the three-column guarantee texts).

Per-screen spec:
- **⑭ covenant:** vertical mercy trail — dashed inline-start guide line (structural, not a banned accent stripe: it's a timeline spine, 2px dashed `--hair`) + gold dots + entry lines with mono seal snippets · intro `.callout insight` · court-exhibit note (neutral wording verbatim).
- **⑮ dispute:** stance card («المصرف يعرض ولا يحكم» — exact line from dispute.js) as `.banner plain` scaled up · paused note dashed card · two path cards as `.group` cells with primary/ghost actions.
- **⑯ bounds:** three `.group` sections للمدين/للدائن/حدود المصرف (bank section: gold hairline top border) · each بند = cell with text + mono LTR «يحرسه: tests/…» line (11px, `--mono`) · footer: the printed `cd tests && node run-all.cjs` command well (reuse `.hash` well idiom on light: create `.cmd{font-family:var(--mono); direction:ltr; …}`).
- **⑰ settings:** digit-system segmented control (`.tabs` idiom: ٠١٢٣ vs 0123) · «ما لا نفعله» manifesto as `.group` cells with ⛔-family icons (NOT stripes) · «ما نفعله» with ✓ icons · about/basis lines gold.
- [ ] Steps mirror Task 3 (read → write ≤120 each → ORDER → rebuild → checks+gate → screenshot all 4 → commit `feat(design): screens 14-17 - covenant trail, dispute, bounds, settings (full 17-screen coverage)`).

---

### Task 6: Re-audit + publish + close-out

- [ ] **Step 1:** Re-run the Impeccable audit dimensions on the OUTPUT (contrast script + anti-pattern greps: `border-inline-start:[^;]*[2-9]px` must return ONLY the covenant timeline spine (structural, documented) or nothing; no gradient-text/glassmorphism; type floor respected). Target: Anti-patterns 2→4, A11y 3→4, total ≥17/20. Record scores in the report.
- [ ] **Step 2:** Controller publishes: artifact (same URL) + DS copy refresh + DesignSync.
- [ ] **Step 3:** `_meta/STATUS.md` DONE line · vault Home line · heartbeat · push.
- [ ] **Step 4:** Judge-lens spot check (UX/memorability); <8 → JL item. Surface to operator: 17-screen board is now deck-appendix-ready — their call.

---

## Execution order & parallelism

Task 1 → Task 2 sequential (same files). Tasks 3, 4, 5 are **parallel-safe** (disjoint partials; ORDER merge is trivial — each uncomments only its own lines; if the same ORDER block conflicts, controller resolves). Task 6 last. All before 13 Jul; no Gate-B/freeze surface touched.

## Self-review (writing-plans checklist)
- Coverage: audit P1s (stripes, gauge label, emoji-contract) ✓ P2s (type floor, official-line, hexes, PAIRS) ✓ improve-not-fix (callout idiom, partials architecture, build registry) ✓ all-features screens (10 named, sources named) ✓.
- Placeholders: per-screen content deliberately sourced from named files instead of inlined (content-rule makes inventing impossible); build script code complete; callout CSS complete.
- Consistency: `.callout` names match across Tasks 2-5; ORDER filenames match partial names; token names match check-tokens expectations.
