# Design Deep-Dive + Device Portability Implementation Plan (v2 — high-effort rewrite 2026-07-11)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Written for a low-effort executor:** every step carries verbatim code/content. Do not improvise beyond it; if a step's code conflicts with reality, STOP and report instead of adapting.

**Goal:** Take the Sadu v4 prototype from "looks right in desktop Chrome" to "provably survives a real install on the operator's own iPhone and Samsung": fix the latent device-breaking bugs (Arabic letterspacing, WCAG contrast), apply the research-study patterns, extract one token source with drift-detection teeth, write the binding RN portability contract, and prove the riskiest techniques on real devices via Expo Go.

**Architecture:** Four layers. (1) **Audit** — measured, scripted checks (contrast math, Arabic-typography scan) before any styling. (2) **Design round (v5)** — research patterns with exact markup. (3) **Contracts** — `tokens.json` + `check-tokens.cjs` teeth + `RN-MAPPING.md` risk table that the deferred skeleton build must obey. (4) **Real-device proof** — a single-file Expo app run through Expo Go on the operator's physical iPhone + Samsung (QR scan; no store, no build).

**Tech Stack:** HTML/CSS prototype (current) · Node CJS check scripts (NOT gate-discovered — they live under `application/design/`, the gate only auto-discovers `tests/app/*.test.cjs`) · target stack: Expo SDK 54+/RN New Architecture, react-native-svg, Reanimated 3.

## Global Constraints

- **Spine:** riba words only negated · trust is a word, never a number · brick-red family reserved for Shariah stop / tamper only · no `٪`/`%` glyphs in copy · integer SAR («2,500 ريال») · «(محاكاة)» stays on Nafath surfaces · Qur'anic text verbatim in ﴿﴾.
- **Gate frozen:** `cd tests && node run-all.cjs` → exactly `AHD GATE ✅ 1687/0` after every commit. Never touch `demo/`, `app/`, `tests/`. New scripts go under `application/design/` only.
- **App build stays DEFERRED.** This plan produces design + contracts + one throwaway proof app. The skeleton plan (`2026-07-10-mobile-app-skeleton.md`) executes only on the operator's explicit go.
- **Arabic typography rule (NEW, binding for every future design round):** never apply `letter-spacing` or `text-transform` to Arabic text — Arabic is a connected script and letterspacing breaks glyph joins (visible on device shaping engines even when desktop Chrome forgives it). Letterspaced/uppercase treatments are permitted ONLY on pure Latin/digit runs (e.g. `AHD-0001`, `SHA-256`).
- **Contrast bar (NEW):** every text/background pair in the prototype ≥4.5:1 (normal text) or ≥3:1 (≥18.7px bold / ≥24px). Verified by script, not by eye.
- **Platform strategy (decision, recorded here):** ONE visual language on both platforms (brand-first, Revolut-style) — no Material re-theming. But Android *behavioral* correctness is non-negotiable: hardware/predictive back, ripple/press feedback, edge-to-edge insets, status-bar contrast. iOS behavioral correctness likewise (swipe-back, safe areas, Dynamic Type).
- Prototype: `application/prototypes/dir-b-sadu.html`, ≤900 lines, no `<script`, no external URLs; artifact republished to the SAME URL each round; `DirBSadu.html` DS copy + DesignSync after each visual change.
- Calendar: Gate B judge re-score is 14 Jul and the pitch freeze is 15 Jul — Tasks 1–3 must not spill past 13 Jul; Task 4 needs ~15 min of operator phone time, schedule any day before 17 Jul. Whether v5 phone frames enter the deck appendix is the operator's call; if yes, `docs/JUDGE-LENS.md` scoring applies to them.

---

### Task 1: Measured audit — contrast script + Arabic-typography scan

**Files:**
- Create: `application/design/contrast-check.cjs`
- Modify: `application/prototypes/dir-b-sadu.html` (fix failures only — no redesign in this task)

**Interfaces:**
- Produces: PASS/FAIL table for the real color pairs; the fixed palette values Task 3 copies into `tokens.json` (so tokens are extracted AFTER fixes, never before).

- [ ] **Step 1: Write `application/design/contrast-check.cjs`:**

```js
#!/usr/bin/env node
/* contrast-check.cjs — WCAG 2.1 contrast audit for the Sadu prototype palette.
   Run: node application/design/contrast-check.cjs   (from repo root)
   NOT part of the repo gate — design tooling only. */
"use strict";

function lum(hex) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(fg, bg) {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
// every real fg/bg pair in dir-b-sadu.html — UPDATE hexes here if the palette moves
const PAIRS = [
  ["ink on card",            "#1c1812", "#ffffff", 4.5],
  ["ink on ground",          "#1c1812", "#efe9dc", 4.5],
  ["ink2 on card",           "#6d6353", "#ffffff", 4.5],
  ["ink3 small labels",      "#9b917e", "#ffffff", 4.5],   // expected FAIL pre-fix
  ["ink3 on ground",         "#9b917e", "#efe9dc", 4.5],   // expected FAIL pre-fix
  ["terra btn text",         "#ffffff", "#a1442e", 4.5],
  ["teal on teal-soft",      "#177f6d", "#e3f0eb", 4.5],   // borderline
  ["gold on gold-soft",      "#a8863f", "#f3ead2", 4.5],   // expected FAIL pre-fix
  ["stop on stop-soft",      "#7a2410", "#f6e3da", 4.5],
  ["seal ink on seal bg",    "#ece3d0", "#221d16", 4.5],
  ["seal hash on seal well", "#d8b978", "#221d16", 4.5],
];
let failed = 0;
for (const [name, fg, bg, min] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? " PASS" : "*FAIL"}  ${r.toFixed(2)}:1  (need ${min}:1)  ${name}  ${fg} on ${bg}`);
}
console.log(failed ? `\n${failed} FAILURES — fix before v5 ships` : "\nall pairs pass");
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2:** Run it: `node application/design/contrast-check.cjs`. Expect ≥3 FAIL lines (ink3 pairs, gold pair, possibly teal).
- [ ] **Step 3: Apply these exact palette fixes** in `dir-b-sadu.html` `:root`, then re-run until exit 0:
  - `--ink3: #9b917e` → `#7c7361` (tertiary text keeps its role, passes on white; if still <4.5 on `--ground`, restrict ink3 usage on ground to ≥13px 600-weight and re-grade that pair to 3:1 in the script with a comment).
  - `--gold: #a8863f` → `#8a6c2c` for TEXT uses; if the verse/covenant hue shift is too visible, split tokens: keep `--gold` decorative (emblem stroke) and add `--gold-text: #8a6c2c` used by `.verse`, `.banner.gold`, `.amt.alayk b` — update the script pair to the new token.
  - `--teal` text-on-soft: if the pair prints <4.5, add `--teal-text: #116153` for `.banner.ok`/`.verify.ok` text (keep `--teal` for fills/rings where contrast rules don't apply).
- [ ] **Step 4: Arabic-typography fix (the device-breaking one):**
  - `.sec-h`: remove `letter-spacing:2px` and `text-transform:uppercase`. Replacement treatment that keeps hierarchy: `font-size:11.5px; font-weight:700; color:var(--ink2); opacity:.85`.
  - `.official-line` (v4 footer): remove any letter-spacing on the Arabic sentence; letterspacing may remain only if the line is restructured as Arabic sentence + separate Latin run (e.g. `AHD` monogram) — spacing on the Latin run only.
  - `.status .r` and any `AHD-…`/`SHA-256` runs: letterspacing allowed (Latin/digits).
  - Grep-verify: `grep -n "letter-spacing" application/prototypes/dir-b-sadu.html` — every remaining hit must sit on a Latin-only element (stage chrome `.k` label is Latin — allowed).
- [ ] **Step 5:** Gate check (`1687/0`) + commit:

```bash
git add application/design/contrast-check.cjs application/prototypes/dir-b-sadu.html
git commit -m "fix(design): WCAG contrast fixes (scripted audit) + remove Arabic letterspacing (connected-script shaping bug)"
```

---

### Task 2: Design round v5 — research patterns, exact markup

**Files:**
- Modify: `application/prototypes/dir-b-sadu.html`

**Interfaces:**
- Consumes: Task 1's fixed palette; research doc `docs/research/ui-design-references-2026-07-10.md` §1/§4.
- Produces: the v5 visuals Task 3 tokenizes; the technique list Task 4 maps.

- [ ] **Step 1: Micro-step seal rail on screen ② (Nafath ceremony pattern — named steps, never spinners).** Insert directly under `<div class="ceremony">…</div>`'s closing tag, before `<div class="col">`:

```html
<div class="steps" aria-hidden="true">
  <span class="step done"><i>١</i>الصياغة</span>
  <span class="step-line done"></span>
  <span class="step active"><i>٢</i>الفحص</span>
  <span class="step-line"></span>
  <span class="step locked"><i>٣</i>الختم</span>
</div>
```

CSS (add near `.ceremony` rules):

```css
.steps{display:flex; align-items:center; justify-content:center; gap:6px; padding:2px 24px 0}
.step{display:flex; flex-direction:column; align-items:center; gap:3px; font-size:11.5px; font-weight:700; color:var(--ink3)}
.step i{font-style:normal; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  font-size:12.5px; background:#e8e0cf; color:var(--ink2)}
.step.done i{background:var(--teal); color:#fff}
.step.done{color:var(--teal)}
.step.active i{background:var(--terra); color:#fff; box-shadow:0 0 0 4px var(--terra-soft)}
.step.active{color:var(--terra)}
.step.locked i{background:transparent; border:1.5px dashed var(--ink3)}
.step-line{width:34px; height:2px; border-radius:2px; background:#e8e0cf; margin-bottom:16px}
.step-line.done{background:var(--teal)}
```

- [ ] **Step 2: Absher-style official document card on screen ⑥.** Replace the current `.sealdoc` inner markup with:

```html
<div class="sealdoc">
  <div class="doc-head">
    <svg viewBox="0 0 40 40" class="doc-emblem" aria-hidden="true">
      <polygon points="20,2 33,7 38,20 33,33 20,38 7,33 2,20 7,7" fill="none" stroke="#d8b978" stroke-width="1.2"/>
      <text x="20" y="24" text-anchor="middle" font-size="11" font-weight="800" fill="#ece3d0">عهد</text>
    </svg>
    <div class="doc-id">
      <div class="dt">وثيقة عهد</div>
      <div class="ds">AHD-0001</div>
    </div>
  </div>
  <div class="body">عهدُ قرضٍ حسن: نورة ← خالد · 2,500 ريال · الأجل محرّم ١٤٤٨ · شهد المصرف وختم.</div>
  <div class="hash">6c9410b9 4e1a 22f7 …  bank_seal ✓</div>
</div>
```

CSS additions (the perforation is the header's bottom border):

```css
.doc-head{display:flex; align-items:center; gap:11px; padding-bottom:11px; margin-bottom:11px;
  border-bottom:1.5px dashed rgba(216,185,120,.4)}
.doc-emblem{width:38px; height:38px; flex:none}
.doc-id .dt{font-weight:800; font-size:14.5px}
.doc-id .ds{font-family:var(--mono); direction:ltr; text-align:left; font-size:10.5px; color:var(--seal-lbl); letter-spacing:1.5px}
```

(`AHD-0001` is Latin — letterspacing allowed. The label «الوثيقة المختومة · نفاذ (محاكاة) + SHA-256» moves under `.doc-head` as-is — «(محاكاة)» must survive verbatim.)

- [ ] **Step 3: Sentence-form insight lines (N26 pattern).** Add under `.nav-lg .sub` on:
  - Screen ④: `<div class="insight">كلّ عهودك القائمة موثّقة ومختومة — لا شيء على الكلام وحده.</div>`
  - Screen ⑤: `<div class="insight">لا فوائد تتراكم عليك — المبلغ اليوم هو المبلغ غدًا.</div>`

```css
.insight{margin-top:8px; font-size:12.5px; color:var(--ink2); background:var(--card); border-radius:10px;
  padding:8px 12px; line-height:1.8; border-inline-start:3px solid var(--teal)}
```

- [ ] **Step 4: Self-checks** — greps (no `<script`, no `http`, `(محاكاة)` ≥3, ﴿﴾ intact, no ٪ in copy, no letter-spacing on Arabic), `node application/design/contrast-check.cjs` exit 0, line count ≤900.
- [ ] **Step 5: Independent design critique.** Dispatch ONE reviewer subagent with the anti-slop charter (`.claude/skills/hallmark` if present, else the research doc §2 checklist) + the file. It returns ranked findings; apply Critical/Important, log Minors in the plan's ledger entry. Re-run Step 4 checks after fixes.
- [ ] **Step 6:** Republish artifact (same path) + refresh `DirBSadu.html` DS copy + DesignSync write + gate (`1687/0`) + commit:

```bash
git add application/prototypes
git commit -m "feat(design): Sadu v5 - micro-step seal rail, official document card with serial, sentence insights (research applied, critiqued)"
```

---

### Task 3: Token contract — `tokens.json` + drift teeth

**Files:**
- Create: `application/design/tokens.json`
- Create: `application/design/check-tokens.cjs`
- Create: `application/design/README.md`
- Modify: `docs/superpowers/plans/2026-07-10-mobile-app-skeleton.md` (2 lines)

**Interfaces:**
- Consumes: v5 `:root` (post-fix hexes — copy from the FILE, not from this plan).
- Produces: the token names the skeleton's `tokens.ts` will import; `node application/design/check-tokens.cjs` as the drift alarm.

- [ ] **Step 1: `tokens.json`** — structure below; hex values MUST be read from the v5 file (Task 1 may have adjusted them). Numbers are dp/pt: the prototype's 375px frame ≈ 375pt device width, so CSS px copy 1:1 into RN — record that rule in the README so nobody double-scales.

```json
{
  "$source": "application/prototypes/dir-b-sadu.html :root — run check-tokens.cjs after any change",
  "color": {
    "ground": "<from file>", "card": "#ffffff", "hairline": "rgba(60,50,30,0.12)",
    "ink": "<from file>", "ink2": "<from file>", "ink3": "<from file>",
    "accent": "<from file>", "accentSoft": "<from file>",
    "ok": "<from file>", "okSoft": "<from file>", "okText": "<from file if split>",
    "covenant": "<from file>", "covenantText": "<from file if split>",
    "stop": "<from file>", "stopDeep": "<from file>", "stopSoft": "<from file>", "stopLine": "<from file>",
    "sealBg": "<from file>", "sealInk": "<from file>", "sealLabel": "<from file>", "sealHash": "<from file>",
    "authority": "<from file>"
  },
  "radius": { "card": 14, "sheet": 30, "pill": 999 },
  "space": [4, 8, 16, 24, 32, 48],
  "touch": { "minTarget": 44, "hitSlop": 8 },
  "type": {
    "largeTitle": { "size": 34, "weight": "800" },
    "ceremonyTitle": { "size": 24, "weight": "800" },
    "row": { "size": 15.5, "weight": "600" },
    "secondary": { "size": 12.5, "weight": "400" },
    "label": { "size": 11.5, "weight": "700" },
    "fontFamily": "IBMPlexSansArabic (bundled — never system Arabic; Samsung/iPhone shape differently)"
  },
  "shadow": {
    "card":  { "ios": { "opacity": 0.05, "radius": 2, "offsetY": 1 }, "androidElevation": 1 },
    "button":{ "ios": { "opacity": 0.28, "radius": 14, "offsetY": 4 }, "androidElevation": 4 }
  },
  "motion": {
    "enterMs": 260, "staggerMs": 80,
    "spring": { "damping": 200, "mass": 1, "stiffness": 180, "comment": "overdamped, zero overshoot (Onda SPRING_SMOOTH class)" },
    "muqassaLoopMs": 10000,
    "reducedMotion": "static-final-state"
  },
  "theme": { "darkMode": "deferred — v1 ships light-only as a brand-committed single theme (sand/paper identity); revisit post-hackathon" }
}
```

- [ ] **Step 2: `check-tokens.cjs`** — the teeth:

```js
#!/usr/bin/env node
/* check-tokens.cjs — drift alarm: every hex in tokens.json.color must appear
   verbatim in the prototype's :root block. Design tooling, not the repo gate. */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "../..");
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, "tokens.json"), "utf8"));
const html = fs.readFileSync(path.join(ROOT, "application/prototypes/dir-b-sadu.html"), "utf8");
const rootBlock = (html.match(/:root\{[\s\S]*?\}/) || [""])[0];
let bad = 0;
for (const [name, val] of Object.entries(tokens.color)) {
  if (typeof val !== "string" || !val.startsWith("#") && !val.startsWith("rgba")) continue;
  const ok = rootBlock.includes(val);
  if (!ok) { bad++; console.log(`*DRIFT  color.${name} = ${val} not found in prototype :root`); }
}
console.log(bad ? `\n${bad} drifted token(s)` : "tokens ↔ prototype in sync");
process.exit(bad ? 1 : 0);
```

- [ ] **Step 3:** Run it → `tokens ↔ prototype in sync`, exit 0. (If a token legitimately has no CSS var — e.g. shadows — it lives outside `color` and the script ignores it by design.)
- [ ] **Step 4: `README.md`** (≤20 lines): single-source rule; change protocol (tokens.json first → prototype `:root` → future `tokens.ts`; run check-tokens after each); the px≈pt 1:1 rule; the dark-mode deferral rationale; pointer to RN-MAPPING.md.
- [ ] **Step 5:** Edit the skeleton plan: Task 2 Step 2 line «copy the actual hex values» → «import values from `application/design/tokens.json` (run `check-tokens.cjs` first)»; add to its Global Constraints: «`application/design/RN-MAPPING.md` is binding; 🔴 rows block the build.»
- [ ] **Step 6:** Gate + commit: `git add application/design docs/superpowers/plans/2026-07-10-mobile-app-skeleton.md && git commit -m "feat(design): tokens.json single source + check-tokens drift teeth; skeleton plan now consumes it"`.

---

### Task 4: Portability contract — `RN-MAPPING.md`

**Files:**
- Create: `application/design/RN-MAPPING.md`

**Interfaces:**
- Consumes: grep of every CSS technique in v5; installed Expo skills as reference (`expo-native-ui`, `expo-ui`, `react-native-architecture`).
- Produces: the binding risk table + device-fitness checklist Task 5 tests and the skeleton obeys.

- [ ] **Step 1:** Write the table — these rows verbatim, then ADD any technique the grep finds that isn't listed (grep for: `gradient`, `@property`, `animation`, `backdrop`, `mask`, `grid`, `sticky`, `::before`, `dashed`, `letter-spacing`, `dominant-baseline`, `filter`):

| # | Prototype technique | RN/Expo equivalent | Risk | Note |
|---|---|---|---|---|
| 1 | repeating-linear-gradient Sadu band | `react-native-svg` `<Pattern>` fill or a 40×8 SVG strip tiled via `<Rect>` pattern | 🟡 | build one `<SaduBand/>` component, reuse everywhere |
| 2 | repeating-conic-gradient woven badge ring | SVG: 36 arc segments generated in a loop (conic gradients don't exist in RN) | 🟡 | ~15 lines of path math; do it once |
| 3 | conic/fill gauge sweep | SVG circle + animated `strokeDashoffset` (Reanimated `useAnimatedProps` + `createAnimatedComponent(Circle)`) | 🟢 | standard pattern |
| 4 | @property counting numbers | Reanimated `useDerivedValue` + text update, or `react-native-animated-numbers` | 🟢 | keep `fontVariant: ['tabular-nums']` |
| 5 | muqassa circle keyframes on SVG lines | Reanimated staggered opacity + strokeDashoffset draw on `createAnimatedComponent(Line)` | 🟡 | animating SVG props on Android: test on device (Task 5 covers) |
| 6 | hairline separators | `StyleSheet.hairlineWidth` + hairline color token | 🟢 | |
| 7 | inset-grouped list | View card + rows; optional `@expo/ui` List on iOS only | 🟢 | one component, not per-screen markup |
| 8 | CSS grid cells (`grid-template-columns`) | flexbox `flexDirection:'row'` + flex sizing (RN has no grid) | 🟢 | mechanical rewrite |
| 9 | dashed borders (perforation, locked step) | `borderStyle:'dashed'` — quirky on Android (needs borderRadius>0 on some versions); fallback: dashed SVG line | 🟡 | test on Samsung in Task 5 |
| 10 | `::before/::after` decorations | explicit child Views/SVG (no pseudo-elements in RN) | 🟢 | |
| 11 | `text-wrap: balance` | not in RN — accept ragged or manual `\n` | 🟡 | cosmetic only |
| 12 | tabular-nums | `fontVariant:['tabular-nums']` iOS; Android depends on font — bundled IBM Plex supports it | 🟡 | verify on Samsung |
| 13 | status bar / Dynamic Island / homebar chrome | DELETE — real device provides it; `expo-status-bar` + `react-native-safe-area-context` | 🟢 | by construction |
| 14 | RTL everything | `I18nManager.forceRTL(true)` + start/end props only (never left/right); Android needs `android:supportsRtl` (Expo sets it) | 🟡 | dedicated RTL QA pass on BOTH platforms — flip bugs differ |
| 15 | Arabic font | bundle IBM Plex Sans Arabic (OFL) via `expo-font` from fonts.google.com; NEVER system Arabic font | 🔴→🟢 once bundled | the single biggest Samsung-vs-iPhone rendering difference |
| 16 | prefers-reduced-motion | `AccessibilityInfo.isReduceMotionEnabled()` + Reanimated `ReducedMotion.System` | 🟢 | |
| 17 | shadows | per-platform tokens (shadow.* in tokens.json): iOS `shadow*` props, Android `elevation` | 🟡 | never copy CSS box-shadow strings |
| 18 | fixed 375×800 layout | prototype is a VISUAL spec, not a layout spec — RN screens are flex + SafeArea, sizes from tokens, no absolute frame sizes | 🟢 | write this in bold at the top of the doc |
| 19 | underline on riba term | `textDecorationLine:'underline'` | 🟢 | |
| 20 | backdrop blur (if reintroduced) | `expo-blur` — partial on Android | 🟡 | prefer solid fills |

- [ ] **Step 2: Device-fitness checklist section** (the "don't ruin it on launch" bar — Task 5 executes it):
  - Safe areas all 4 edges: notch/Dynamic Island (iPhone), punch-hole + gesture bar (Samsung), `SafeAreaProvider` everywhere.
  - Font scaling 100→200%: essential text reflows, never truncates; `allowFontScaling` stays true; test at max accessibility size.
  - Widths 375pt (SE) → 430pt (Pro Max) and a Samsung ~412dp: no overflow, no cramped rails.
  - Android hardware/predictive back ≡ iOS swipe-back: every screen exits sanely.
  - Press feedback: `android_ripple` on Android, opacity/highlight on iOS (`Pressable` handles both).
  - Edge-to-edge: Android status/navigation bar colors set from tokens; icons legible on stone ground.
  - Release-build sanity: Expo Go first (Task 5); a real `eas build` device install before any store talk (post-hackathon).
- [ ] **Step 3:** Performance note: all Reanimated work on UI thread (worklets — default in v3); no `setInterval` animations; lists use `FlatList` if any screen exceeds ~20 rows (none currently do).
- [ ] **Step 4:** Gate + commit: `git add application/design/RN-MAPPING.md && git commit -m "docs(design): RN portability contract - 20-row technique mapping, device-fitness checklist, binding for skeleton build"`.

---

### Task 5: Real-device proof — Expo Go on the operator's own phones

**Files:**
- Create: `application/design/proof-go/App.tsx` + `application/design/proof-go/package.json` (throwaway mini-app; never wired into the repo gate or the skeleton)

**Interfaces:**
- Consumes: tokens.json values (inlined with a header comment naming the source) + mapping rows 1, 3, 4, 5, 6, 9 (the risky ones).
- Produces: PASS/FAIL per technique **on real hardware** — the literal answer to "when I download it from Samsung or iPhone".

- [ ] **Step 1:** Scaffold in place: `cd application/design/proof-go && npx create-expo-app@latest . --template blank-typescript` then `npx expo install react-native-svg react-native-reanimated react-native-safe-area-context`.
- [ ] **Step 2:** Replace `App.tsx` with the proof screen (~120 lines): SafeAreaView on stone ground · `<SaduBand/>` (SVG pattern row) · fill gauge (animated strokeDashoffset, one-shot to 75%) · counting number 0→900 with tabular figures · inset-grouped card with `StyleSheet.hairlineWidth` separators and one dashed-border cell · the 5-node muqassa mini-circle with staggered line fade (rows 1/3/4/5/6/9). Header comment: `// tokens copied from application/design/tokens.json — throwaway proof, not product code`. RTL via `I18nManager` note printed on screen.
- [ ] **Step 3:** `npx expo start --tunnel` → **operator scans the QR twice: once with the iPhone camera (Expo Go), once with the Samsung (Expo Go from Play Store)**. ~10 minutes of phone time.
- [ ] **Step 4:** Record results in `RN-MAPPING.md` — a `## Device proof (date, devices)` section: per technique PASS/FAIL per device + photos if useful. Any FAIL → regrade the row 🔴 and write the redesign line.
- [ ] **Step 5:** Add `application/design/proof-go/node_modules` to the repo's ignore behavior (verify `.gitignore` covers `**/node_modules` — it does if prior JS work committed cleanly; check `git status` before adding). Commit ONLY `App.tsx`, `package.json`, and the mapping update: `git commit -m "feat(design): real-device proof (Expo Go, iPhone + Samsung) - results recorded in RN-MAPPING"`.

---

### Task 6: Close-out

- [ ] Gate `1687/0` + push.
- [ ] `_meta/STATUS.md` DONE line (repo format) + heartbeat + vault sync (Home + plan checkboxes + topical note).
- [ ] Judge-lens spot check on v5 (UX + memorability bars); <8 → `JL-` item in `_meta/OPEN-ITEMS.md`.
- [ ] One decision surfaced to the operator (not decided by the agent): do v5 phone frames enter the deck appendix for 18 Jul? If yes, schedule a reshoot of the 3 hero frames.

---

## Execution order & calendar

| Task | Needs | When |
|---|---|---|
| 1 audit + fixes | nothing | now (11 Jul) |
| 2 design round v5 | Task 1 | same session |
| 3 tokens + teeth | Task 2 | same session |
| 4 RN-MAPPING | Task 2 (grep of v5) | same session |
| 5 device proof | Task 3/4 + **operator: 15 min with both phones + Expo Go installed** | any day ≤17 Jul |
| 6 close-out | all | after 5 (or after 4 with proof marked pending) |

Hard boundary: nothing here touches Gate B (14 Jul) or freeze (15 Jul) surfaces. Self-review done against writing-plans checklist: no placeholders except explicitly-marked `<from file>` reads (deliberate — Task 1 may change hexes, plan must not fossilize them); type names consistent across tasks (`tokens.json` keys ↔ check script ↔ proof comments).
