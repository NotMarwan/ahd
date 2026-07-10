# Ahd Mobile App Skeleton (Android + iOS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `application/` — a complete, buildable React Native (Expo) skeleton for the Ahd mobile app on Android + iPhone that reuses the golden JS engine byte-faithfully, with the blueprint, screen registry, theme tokens, RTL bootstrap, and its own parity-tested harness — structure only, no feature implementation.

**Architecture:** Expo (TypeScript, New Architecture, Hermes) app in `application/ahd-mobile/`, mirroring the proven `app/` architecture: pure DI feature modules → screen registry → engine. The engine is NOT rewritten — a sync script copies `app/engine.js` (itself a parity-tested copy of the frozen demo slice) into the mobile tree, and a SHA-256 parity test proves the copy on every run. Mobile tests live in their OWN runner so the repo's `AHD GATE ✅ 1687/0` banner never changes.

**Tech Stack:** Expo SDK 54+ / React Native New Architecture (Hermes), TypeScript, expo-router, expo-font (IBM Plex Sans Arabic), `I18nManager` RTL. Research basis (2026 sources): Hermes runs the golden CJS engine verbatim — the only stack with zero engine-port risk; EAS cloud builds iOS from Windows; RTL built-in.

## Global Constraints

- **The spine** (CLAUDE.md): bank witnesses/seals/settles only; no riba/penalty/maysir/gharar; integer halalas (1 SAR = 100); trust = qualitative band, never a number; AI issues no fatwa. Every doc/stub in this skeleton restates nothing that contradicts this.
- **Never touch** `demo/index.html`, golden functions, `app/**` (read-only inputs), `tests/**` except nothing — mobile tests get their own runner OUTSIDE `tests/app/` auto-discovery.
- **Gate frozen:** `cd tests && node run-all.cjs` must print exactly `AHD GATE ✅ 1687/0` after every task.
- **Determinism in logic files:** no `Date.now`/`new Date()`/`Math.random`/`Intl`/`.toLocaleString`/float money in `application/ahd-mobile/src/features/**` (UI files may use platform APIs).
- **Skeleton means skeleton:** screen stubs render title + placeholder only; feature modules export typed signatures + `NOT_IMPLEMENTED` bodies; NO business logic beyond what the engine already provides.
- All new directories/files under `application/`; root repo files untouched except `docs/superpowers/plans/` and the vault sync at the end.
- Node ≥18 for scripts; scripts are CJS (`"use strict"`, zero deps) matching repo harness style.
- Arabic UI text: copy strings verbatim from `app/screens/*.js` when naming screens — do not invent new Arabic.

---

### Task 1: Blueprint + directory charter

**Files:**
- Create: `application/BLUEPRINT.md`
- Create: `application/README.md`

**Interfaces:**
- Produces: the screen table (17 screens: nav `home, create, daftari, timeline, open, circle, circle-adv, settle` + contextual `borrower(ما عليّ), request, proof, covenant, dispute, standing, impact, bounds, settings`) and the layer diagram every later task references.

- [ ] **Step 1: Write `application/BLUEPRINT.md`** with these sections (real content, sourced from `docs/ARCHITECTURE.md` + `app/app.js` NAV_ORDER at line 66 + `app/screens/` listing):
  1. **Mission** — mobile twin of the publishable app for AMAD 2026; Android first, iOS via EAS cloud (no Mac).
  2. **Framework decision record** — RN+Expo chosen over Flutter/KMP/MAUI/Ionic; one line per rejection (engine-port forbidden; cite Hermes-runs-CJS rationale + research URLs from the 2026-07-10 research pass).
  3. **Layer diagram** — `engine.js (golden, synced) → src/features/* (pure DI, Node-testable) → src/screens/* (React, RTL) → expo-router registry`.
  4. **Screen map table** — all 17 screens: key · Arabic title (verbatim from `app/screens/*.js`) · nav-or-contextual · source feature module.
  5. **Engine contract** — engine synced from `app/engine.js` by `scripts/sync-engine.cjs`; parity = SHA-256 equality; golden functions called, never modified; the EXPORTS list copied verbatim from `app/build-engine.cjs:18-31`.
  6. **Spine on mobile** — restate the 4 CLAUDE.md spine bullets + determinism rule for features.
  7. **Test strategy** — `application/ahd-mobile/tests/` run by `node application/ahd-mobile/tests/run-mobile-tests.cjs`; NEVER auto-discovered by the repo gate; gate stays 1687/0.
- [ ] **Step 2: Write `application/README.md`** — 20 lines: what this dir is, `npx create-expo-app` bootstrap command (Task 2), run commands, pointer to BLUEPRINT.md.
- [ ] **Step 3: Verify gate untouched**

Run: `cd tests && node run-all.cjs`
Expected: `AHD GATE ✅ 1687/0`

- [ ] **Step 4: Commit**

```bash
git add application
git commit -m "feat(mobile): application/ blueprint - RN+Expo decision record, 17-screen map, engine contract"
```

---

### Task 2: Expo scaffold + RTL/font bootstrap

**Files:**
- Create: `application/ahd-mobile/` via `npx create-expo-app@latest ahd-mobile --template blank-typescript` (run inside `application/`)
- Create: `application/ahd-mobile/src/theme/tokens.ts`
- Create: `application/ahd-mobile/src/i18n/rtl.ts`
- Modify: generated `app.json` (name «عهد», `"supportsRTL": true`), `App.tsx` → minimal RTL shell
- Create: `application/ahd-mobile/.gitignore` addition check (template ships one — confirm `node_modules/` ignored)

**Interfaces:**
- Produces: `tokens` object (`tokens.color.navy`, `tokens.color.gold`, `tokens.radius.amad`, `tokens.font.arabic`) and `ensureRTL(): void` used by every screen task.

- [ ] **Step 1: Scaffold**

Run (in `application/`): `npx create-expo-app@latest ahd-mobile --template blank-typescript`
Expected: project created; then `cd ahd-mobile && npx expo-doctor` reports no blocking issues (warnings OK, note them).

- [ ] **Step 2: `src/theme/tokens.ts`** — port the app's premium tokens (READ the `:root` block of `app/app.css` and copy the actual hex values; the names below are the contract, values must come from app.css):

```ts
// Ported from app/app.css :root — keep values byte-equal to the CSS custom properties.
export const tokens = {
  color: {
    navy: '#0d1b2a',       // ← replace with app.css --bg (read the real value)
    surface: '#132435',    // ← --surface
    gold: '#c9a227',       // ← --gold accent
    text: '#e8eef4',       // ← --text
    danger: '#e05252',     // ← riba-error red
    success: '#3fa66b',    // ← seal-green
  },
  radius: { amad: 24, card: 16, chip: 999 },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 },
  font: { arabic: 'IBMPlexSansArabic', mono: 'SpaceMono' },
} as const;
export type Tokens = typeof tokens;
```

- [ ] **Step 3: `src/i18n/rtl.ts`**

```ts
import { I18nManager } from 'react-native';

/** Force RTL once at app boot. Restart required the first time on Android. */
export function ensureRTL(): void {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
}

/** Western → Arabic-Indic digits (mirror of App.digit in app/app.js). */
export function arDigits(s: string | number): string {
  return String(s).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}
```

- [ ] **Step 4:** `app.json`: set `"name": "عهد"`, `"slug": "ahd"`, and under `expo`: `"supportsRTL": true` (Android also needs `"android": {"supportsRtl": true}` — expo handles via plugin; verify with expo-doctor). `App.tsx`: call `ensureRTL()` then render `<Text>عهد — الهيكل قيد الإنشاء</Text>` styled with tokens.
- [ ] **Step 5: Verify it typechecks**

Run: `cd application/ahd-mobile && npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 6: Gate + commit** (`cd tests && node run-all.cjs` → 1687/0)

```bash
git add application/ahd-mobile
git commit -m "feat(mobile): Expo TS scaffold + RTL bootstrap + theme tokens ported from app.css"
```

---

### Task 3: Engine sync + parity harness

**Files:**
- Create: `application/ahd-mobile/scripts/sync-engine.cjs`
- Create: `application/ahd-mobile/src/engine/engine.js` (generated)
- Create: `application/ahd-mobile/src/engine/index.ts`
- Create: `application/ahd-mobile/tests/engine-parity.test.cjs`
- Create: `application/ahd-mobile/tests/run-mobile-tests.cjs`

**Interfaces:**
- Consumes: `app/engine.js` (read-only), which exports the golden surface (`sha256`, `sealBlock`, `netting`, `ribaScan`, …).
- Produces: `import { engine } from '@/engine'` for feature tasks; `node tests/run-mobile-tests.cjs` runner all later tests plug into (auto-discovers `tests/*.test.cjs`).

- [ ] **Step 1: Write the failing parity test first** (`tests/engine-parity.test.cjs`):

```js
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

let pass = 0, fail = 0;
function ok(c, name) { console.log((c ? "  ✓ " : "  ✗ ") + name); c ? pass++ : fail++; }

const APP_ENGINE = path.join(__dirname, "../../../../app/engine.js");
const MOBILE_ENGINE = path.join(__dirname, "../src/engine/engine.js");

ok(fs.existsSync(MOBILE_ENGINE), "mobile engine.js exists");
if (fs.existsSync(MOBILE_ENGINE)) {
  const a = crypto.createHash("sha256").update(fs.readFileSync(APP_ENGINE)).digest("hex");
  const m = crypto.createHash("sha256").update(fs.readFileSync(MOBILE_ENGINE)).digest("hex");
  ok(a === m, "mobile engine is byte-identical to app/engine.js (sha256 " + a.slice(0, 8) + "…)");
  const eng = require(MOBILE_ENGINE);
  ok(typeof eng.sha256 === "function" && typeof eng.netting === "function" && typeof eng.ribaScan === "function",
    "golden surface loads under Node (sha256/netting/ribaScan callable)");
}
console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Write the runner** (`tests/run-mobile-tests.cjs`):

```js
"use strict";
/* Mobile-only test runner. Deliberately OUTSIDE tests/app/ — the repo gate
   (run-all.cjs, 1687/0) must never discover these suites. */
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const files = fs.readdirSync(__dirname).filter((f) => f.endsWith(".test.cjs")).sort();
let failed = [];
for (const f of files) {
  console.log("== " + f);
  try { cp.execSync("node " + JSON.stringify(path.join(__dirname, f)), { stdio: "inherit" }); }
  catch (e) { failed.push(f); }
}
console.log(failed.length ? "MOBILE TESTS ❌ " + failed.join(", ") : "MOBILE TESTS ✅ " + files.length + " suite(s)");
process.exit(failed.length ? 1 : 0);
```

- [ ] **Step 3: Run runner — watch parity fail** (engine not yet copied): expect `✗ mobile engine.js exists`.
- [ ] **Step 4: Write `scripts/sync-engine.cjs`**:

```js
"use strict";
/* Copies app/engine.js (itself parity-tested against the frozen demo) into the
   mobile tree BYTE-FAITHFUL. Reads only; never writes outside src/engine/. */
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "../../../app/engine.js");
const DST = path.join(__dirname, "../src/engine/engine.js");
fs.mkdirSync(path.dirname(DST), { recursive: true });
fs.copyFileSync(SRC, DST);
console.log("synced app/engine.js → src/engine/engine.js (" + fs.statSync(DST).size + " bytes)");
```

- [ ] **Step 5:** `node scripts/sync-engine.cjs`, then `src/engine/index.ts`:

```ts
// Typed doorway to the golden engine. The .js file is a byte-faithful copy —
// never edit it; run scripts/sync-engine.cjs to refresh.
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const engine = require('./engine.js') as {
  sha256(s: string): Promise<string> | string;
  sealBlock(...args: unknown[]): unknown;
  netting(...args: unknown[]): unknown;
  ribaScan(text: string): unknown;
  fmt(minor: number): string;
  [k: string]: unknown;
};
```

(Before writing, READ the top of `app/engine.js` to confirm sync/async of `sha256` and adjust the type to reality.)

- [ ] **Step 6: Run tests — green**: `node tests/run-mobile-tests.cjs` → `MOBILE TESTS ✅ 1 suite(s)`. Then repo gate: 1687/0 unchanged (nothing under tests/ was added).
- [ ] **Step 7: Commit**

```bash
git add application/ahd-mobile
git commit -m "feat(mobile): golden engine sync + sha256 parity harness (own runner, repo gate untouched)"
```

---

### Task 4: Feature-module skeletons (pure DI layer)

**Files:**
- Create: `application/ahd-mobile/src/features/types.ts`
- Create: `application/ahd-mobile/src/features/registry.ts`
- Create: 8 stubs: `src/features/{create,daftari,settlement,impact,bounds,borrower,proof,circle}.ts`
- Create: `application/ahd-mobile/tests/features-shape.test.cjs`

**Interfaces:**
- Consumes: `engine` from Task 3.
- Produces: `FeatureModule` type + `FEATURES` map keyed by screen key; each stub exports `makeViewModel(deps: { engine: typeof engine }): ViewModel` returning `{ ready: false, titleAr: string }`.

- [ ] **Step 1: `src/features/types.ts`**:

```ts
import type { engine } from '../engine';

export interface FeatureDeps { engine: typeof engine }
export interface ViewModel { ready: boolean; titleAr: string }
export interface FeatureModule { key: string; makeViewModel(deps: FeatureDeps): ViewModel }
```

- [ ] **Step 2: 8 stubs, one pattern** (example `create.ts`; repeat per file with its real Arabic title read verbatim from the matching `app/screens/*.js` header):

```ts
import type { FeatureModule } from './types';

// SKELETON: real logic ports from app/features/create.js in a later plan.
// Determinism rule applies here: no Date.now/Math.random/float money — ever.
export const createFeature: FeatureModule = {
  key: 'create',
  makeViewModel: () => ({ ready: false, titleAr: 'أنشئ عهدًا' }),
};
```

- [ ] **Step 3: `registry.ts`** — `export const FEATURES: Record<string, FeatureModule>` mapping all 8 keys.
- [ ] **Step 4: Test first-ish** (`tests/features-shape.test.cjs`) — asserts via `npx tsc` output + a Node smoke that each stub file exists and contains no banned tokens:

```js
"use strict";
const fs = require("fs"), path = require("path");
let pass = 0, fail = 0;
function ok(c, n) { console.log((c ? "  ✓ " : "  ✗ ") + n); c ? pass++ : fail++; }
const DIR = path.join(__dirname, "../src/features");
const KEYS = ["create","daftari","settlement","impact","bounds","borrower","proof","circle"];
const BANNED = [/Date\.now/, /new Date\(/, /Math\.random/, /toLocaleString/, /\bIntl\b/];
for (const k of KEYS) {
  const p = path.join(DIR, k + ".ts");
  ok(fs.existsSync(p), "feature stub exists: " + k);
  if (fs.existsSync(p)) {
    const src = fs.readFileSync(p, "utf8");
    ok(BANNED.every((re) => !re.test(src)), "no nondeterminism in " + k + ".ts");
  }
}
console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 5:** `node tests/run-mobile-tests.cjs` → `MOBILE TESTS ✅ 2 suite(s)`; `npx tsc --noEmit` → 0 errors; repo gate 1687/0.
- [ ] **Step 6: Commit**

```bash
git add application/ahd-mobile/src/features application/ahd-mobile/tests
git commit -m "feat(mobile): pure DI feature-module skeletons with determinism teeth"
```

---

### Task 5: Screen registry + 17 screen stubs (expo-router)

**Files:**
- Create: `application/ahd-mobile/app/_layout.tsx` (expo-router root: RTL + font load + tab bar for the 8 nav screens)
- Create: `application/ahd-mobile/app/(nav)/{home,create,daftari,timeline,open,circle,circle-adv,settle}.tsx`
- Create: `application/ahd-mobile/app/(contextual)/{borrower,request,proof,covenant,dispute,standing,impact,bounds,settings}.tsx`
- Create: `application/ahd-mobile/src/components/ScreenScaffold.tsx`
- Create: `application/ahd-mobile/assets/fonts/README.md` (IBM Plex Sans Arabic download instructions + OFL license note — do NOT commit font binaries without checking repo policy)

**Interfaces:**
- Consumes: `tokens`, `arDigits`, `FEATURES`.
- Produces: navigable skeleton — every screen reachable, each rendering `ScreenScaffold` with its Arabic title.

- [ ] **Step 1: `ScreenScaffold.tsx`**:

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

export function ScreenScaffold({ titleAr }: { titleAr: string }) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{titleAr}</Text>
      <Text style={styles.stub}>هيكلٌ فقط — المنطق يصل لاحقًا</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.navy, alignItems: 'center', justifyContent: 'center', gap: tokens.space.md },
  title: { color: tokens.color.text, fontSize: 28, fontFamily: tokens.font.arabic, writingDirection: 'rtl' },
  stub: { color: tokens.color.gold, fontSize: 14, writingDirection: 'rtl' },
});
```

- [ ] **Step 2:** Install expo-router per Expo docs (`npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants`), set `"main": "expo-router/entry"`. Each screen file is 4 lines: import scaffold, export default with its verbatim Arabic title (from the screen map table in BLUEPRINT.md).
- [ ] **Step 3:** `_layout.tsx` — Stack (contextual) over Tabs (8 nav keys in NAV_ORDER order, RTL — verify tab order renders right-to-left on device/emulator; note any RN RTL tab quirk in BLUEPRINT.md §risks).
- [ ] **Step 3b: Navigation animation (smooth transitions).** Install `npx expo install react-native-reanimated` (add the babel plugin per Expo docs). Configure transitions declaratively — no custom gesture code (YAGNI):
  - Stack screens (contextual): `screenOptions={{ animation: 'slide_from_left', animationDuration: 260 }}` — `slide_from_left` because RTL: content enters from the reading direction. iOS keeps its native swipe-back.
  - Tabs: cross-fade between tab screens via `screenOptions={{ animation: 'fade' }}` (expo-router Tabs v4 supports it; if the installed version doesn't, wrap `ScreenScaffold` in reanimated's `<Animated.View entering={FadeIn.duration(180)}>` instead — pick ONE mechanism, don't stack both).
  - Respect reduced motion: read `useReducedMotion()` from reanimated; when true, set `animation: 'none'` / skip `entering`. Mirrors the web app's kill-switch discipline.
- [ ] **Step 4: Verify:** `npx tsc --noEmit` → 0 errors; `npx expo export --platform android` (static export sanity build) exits 0. If an emulator is available, `npx expo start` + screenshot home; if not, note it — export success is the acceptance bar.
- [ ] **Step 4b: Design evidence for the operator.** Capture at least 4 screenshots (home tab, one contextual screen, mid-transition if capturable, tab bar) into `application/ahd-mobile/design-evidence/` via emulator or `npx expo start --web` fallback, and list them in BLUEPRINT.md §design so the operator can SEE the skeleton's look and judge it against the anti-slop charter (`docs/` design project rules) before any logic port.
- [ ] **Step 5: Gate + commit** (1687/0)

```bash
git add application/ahd-mobile
git commit -m "feat(mobile): expo-router skeleton - 17 RTL screen stubs wired to the screen map"
```

---

### Task 6: Docs close-out + vault sync

**Files:**
- Modify: `application/BLUEPRINT.md` (§risks: anything Tasks 2–5 discovered — expo-doctor warnings, RTL tab quirks)
- Modify: `_meta/OPEN-ITEMS.md` (new row: mobile skeleton built, logic-port plan = follow-up)
- Modify: `_meta/STATUS.md` (DONE line)
- Modify: vault `AmadHackathon/` Home + plan note (operator memory rule)

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1:** Update the four files (STATUS DONE line follows the repo's existing format: date · agent · title · paths · verification counts).
- [ ] **Step 2:** Final verification block, all three:

Run: `node application/ahd-mobile/tests/run-mobile-tests.cjs` → `MOBILE TESTS ✅ 2 suite(s)`
Run: `cd application/ahd-mobile && npx tsc --noEmit` → 0 errors
Run: `cd tests && node run-all.cjs` → `AHD GATE ✅ 1687/0`

- [ ] **Step 3: Commit + push**

```bash
git add application _meta AmadHackathon
git commit -m "docs(mobile): blueprint risks + status/vault sync for the application/ skeleton"
git push origin main
```

---

## Execution order & notes

Tasks strictly sequential (each consumes the previous). Task 2's scaffold needs network (npm) — first non-offline step in this repo; acceptable, it's dev tooling, the APP itself stays offline-capable. Judge-lens: this is judge-visible only if demoed — score BLUEPRINT.md against `docs/JUDGE-LENS.md` feasibility bar at Task 6.

Out of scope (deliberate, YAGNI): porting the 17 feature logics, EAS build config, app-store metadata, push notifications, font binary licensing decision.
