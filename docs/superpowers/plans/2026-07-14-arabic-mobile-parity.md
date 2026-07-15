# Arabic Mobile Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Expo SDK 57 Arabic-first mobile product that preserves all 21 web screen keys, reproduces six core web journeys exactly, works honestly offline, and passes physical iPhone and Samsung accessibility gates.

**Architecture:** Start from a clean Expo Router product rather than the SDK 56 proof. Generate exact-byte copies of the golden engine, required pure features, and design tokens into the mobile tree; place typed adapters and view models above them, then use four judge-path tabs plus 17 stack routes backed by versioned SQLite state.

**Tech Stack:** Node.js >=22.13, Expo SDK 57, React Native 0.86, React 19.2.3, TypeScript 6.x, Expo Router/Localization/Font/SQLite/Dev Client, Reanimated, SVG, Safe Area Context, Jest Expo, React Native Testing Library.

## Global Constraints

- Never modify `demo/index.html`, golden functions/vectors, or hand-edit generated engine bytes.
- Keep `application/design/proof-go/` as historical SDK 56 technique evidence; copy no source or package file into the product.
- Use a clean `application/ahd-mobile/` SDK 57 Router scaffold; Node.js floor is 22.13.
- Preserve exactly 21 web keys. Tabs are exactly `home`, `create`, `daftari`, `settle`; all other keys are stack routes.
- Business logic lives only in generated web-core files and typed adapters; route components contain presentation/orchestration only.
- All money is integer halalas; all deterministic logic receives fixed `AS_OF`; no clock/random/locale money in core paths.
- Offline external identity, Nafath, TSA, issuer signature, checkpoint, or submission returns `needs_connection` and never mutates sealed/canonical state.
- Static Arabic RTL, real safe areas, vector icons, reduced motion, and token parity are mandatory. Approved IBM Plex Sans Arabic files/license are mandatory for the final visual-parity and device gates; Phase 1 may use the documented fallback stack without claiming font parity.
- Sadu currently covers 17 screens. `refusal`, `shariah`, `plans`, and `org` need supplemental baseline approval before full visual-parity claims.
- Final evidence requires development builds on one physical iPhone (iOS >=16.4) and one physical Samsung/Android phone (Android >=7), not Expo Go screenshots.
- On this Windows environment use `npm.cmd` and `npx.cmd`; PowerShell blocks `npm.ps1`.

---

## Owner-Approved Phase 1 Vertical Slice (2026-07-15)

The owner approved staged execution. Tasks 2-7 are executed first only far enough to deliver this complete route:

```text
home -> create -> riba check -> seal -> daftari -> record detail -> settle -> proof verification
```

Phase 1 navigation has exactly four tabs: `home`, `create`, `daftari`, and `settle`. The registry still declares
all 21 product keys, but the remaining 17 keys are contextual destinations and are not implemented as a batch.
Task 8 cannot begin until the Phase 1 gate below passes.

The current Sadu prototype reconciliation in Task 1 is not a Phase 1 blocker. Phase 1 treats
`application/prototypes/**` and `application/design/proof-go/**` as read-only owner work and builds only inside the new
`application/ahd-mobile/**` tree plus additive tests and documentation.

### Phase 1 interface boundary

- Route files render and orchestrate only; they never compute money, canonical content, hashes, seals, or netting.
- `src/core/ahd-core.ts` is the only UI-facing adapter over generated `engine.js`, `create.js`, `riba-lint.js`,
  `daftari.js`, `settlement.js`, and `proof.js`.
- `src/state/ahd-store.tsx` owns the user journey and delegates persistence to the SQLite repository.
- A record is stored only after the riba check returns `clean` and the generated create feature returns its seal.
- External identity remains `needs_connection`; Phase 1 labels the local seal as a deterministic prototype and never
  claims production Nafath, TSA, issuer-signature, or checkpoint evidence.

### Phase 1 file ownership

| Worker | Exclusive files | Deliverable |
|---|---|---|
| `Terra` | `src/navigation/**`, `src/components/**`, `src/theme/**`, layout files | Four-tab shell, RTL, safe areas, spacing, reusable primitives |
| `Luna` | `scripts/**`, `src/generated/**`, `src/core/**`, `src/state/**`, core/state tests | Byte-faithful core, typed adapter, integer state, SQLite boundary, parity |
| `Sol` | route leaf files, `src/screens/**`, screen tests | Home/create/ledger/detail/settle/proof composition and Arabic empty states |
| Coordinator | scaffold/package files, cross-lane integration, repository gates, docs | Collision-free merge and final acceptance |

No worker edits another worker's exclusive files. Shared package or configuration changes are requested from the
coordinator rather than edited concurrently.

### Phase 1 design constraints

- One column with `16px` mobile horizontal padding and `20px` on widths at least `390px`.
- One filled primary action per screen.
- No card contains another card.
- Repeated records render as rows inside one `RowGroup`.
- Technical proof detail is collapsed by default; the verification verdict remains visible.
- Every control has at least a `44px` target.
- The phase uses the existing fallback font stack until approved font files and license exist; it makes no portable-
  font parity claim.

### Phase 1 acceptance gate

```powershell
Set-Location application/ahd-mobile
npm.cmd run check:core
npm.cmd run test:mobile
npm.cmd run test:ui
npm.cmd run typecheck
npx.cmd expo export --platform android --platform ios
Set-Location ../../tests
node run-all.cjs
```

Expected: generated sources match exact bytes; the vertical journey passes; all money remains integer minor units;
the created seal verifies; the route tests prove only four tabs; TypeScript and both native exports pass; the full
repository gate is green and the frozen-demo tripwire remains intact. Physical iPhone/Samsung acceptance remains
Task 9 and cannot be replaced by the export result.

---

## File Structure

| Path | Responsibility |
|---|---|
| `application/prototypes/build-prototype.cjs` | Build or non-writing parity-check the 17 Sadu partials |
| `application/design/baseline-manifest.json` | Owner-approved baseline hashes and four supplemental-gate states |
| `application/ahd-mobile/src/app/` | Expo Router route files only |
| `application/ahd-mobile/src/navigation/screen-registry.ts` | Exact 21-key route/baseline inventory |
| `application/ahd-mobile/scripts/sync-web-core.cjs` | Copy/hash engine, features, and tokens |
| `application/ahd-mobile/src/generated/` | Generated exact-byte sources and manifest |
| `application/ahd-mobile/src/core/` | Type adapters and journey view models |
| `application/ahd-mobile/src/state/` | Versioned SQLite envelope, migrations, outbox |
| `application/ahd-mobile/src/design/` | Token, typography, RTL, and motion adapters |
| `application/ahd-mobile/src/components/` | Safe screen, Sadu, icons, accessible controls |
| `application/ahd-mobile/tests/` | Source, engine, journey, state, design, route, accessibility tests |
| `application/ahd-mobile/design-evidence/` | Device matrix and physical acceptance reports |

### Task 1: Protect and reconcile the Sadu source baseline

**External gate:** `application/prototypes/dir-b-sadu.html` is currently dirty and differs from the 17-part build.
Before any write, the owner chooses whether the dirty output changes are accepted back into partials or rejected in
favor of the partial source. Never run the current write-mode builder against the dirty output before this choice.

**Files:**
- Modify: `application/prototypes/build-prototype.cjs`
- Create: `tests/app/sadu-prototype-parity.test.cjs`
- Create after owner choice: `application/design/baseline-manifest.json`
- Modify only after owner choice: `application/prototypes/src/*.html` or `application/prototypes/dir-b-sadu.html`

**Interfaces:**
- Consumes: ordered 17 Sadu partials and current output bytes.
- Produces: `node application/prototypes/build-prototype.cjs --check` with no writes and an approved hash manifest.

- [ ] **Step 1: Write the failing non-writing parity test**

```js
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const ROOT = path.join(__dirname, "..", "..");
const out = path.join(ROOT, "application", "prototypes", "dir-b-sadu.html");
const script = path.join(ROOT, "application", "prototypes", "build-prototype.cjs");
const source = fs.readFileSync(script, "utf8");
assert.strictEqual(source.includes('process.argv.includes("--check")'), true, "builder must declare check mode before it is safe to invoke");
const before = fs.readFileSync(out);
const run = spawnSync(process.execPath, [script, "--check"], { encoding: "utf8" });
const after = fs.readFileSync(out);
assert.strictEqual(before.equals(after), true, "--check must not write output");
assert.strictEqual([0, 1].includes(run.status), true);
assert.strictEqual(run.stdout.includes("screens=17"), true);
```

- [ ] **Step 2: Run and confirm check mode is absent without touching the output**

Run: `node tests/app/sadu-prototype-parity.test.cjs`
Expected: FAIL on `builder must declare check mode before it is safe to invoke`. The assertion fails before spawning
the current builder, so the dirty output is not touched.

- [ ] **Step 3: Add pure build and non-writing check mode**

```js
// Replace the write tail of application/prototypes/build-prototype.cjs.
const crypto = require("crypto");
function buildBytes() { return Buffer.from(parts.join("\n"), "utf8"); }
function sha256(bytes) { return crypto.createHash("sha256").update(bytes).digest("hex"); }
const built = buildBytes();
const check = process.argv.includes("--check");
if (check) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT) : Buffer.alloc(0);
  const equal = current.equals(built);
  console.log(`prototype parity=${equal ? "PASS" : "FAIL"} screens=${ORDER.length - 2} expected=${sha256(built)} actual=${sha256(current)}`);
  process.exit(equal ? 0 : 1);
}
fs.writeFileSync(OUT, built);
console.log(`built dir-b-sadu.html (${built.toString("utf8").split("\n").length} lines, ${ORDER.length - 2} screens, sha256=${sha256(built)})`);
```

- [ ] **Step 4: Reconcile only after the owner choice and record exact hashes**

Run: `git diff -- application/prototypes/dir-b-sadu.html application/prototypes/src`
Expected: reviewable accepted/rejected deltas with no unrelated file.

After reconciliation, run: `node application/prototypes/build-prototype.cjs --check`
Expected: exit `0`, `prototype parity=PASS screens=17`.

Write `baseline-manifest.json` with schema `ahd-sadu-baseline-v1`, the approved output SHA-256, each partial
SHA-256, `approved_by`, `approved_at`, and supplemental route states for `refusal`, `shariah`, `plans`, `org`.

- [ ] **Step 5: Commit the protected baseline only with owner approval**

```bash
git add application/prototypes/build-prototype.cjs application/prototypes/src application/prototypes/dir-b-sadu.html application/design/baseline-manifest.json tests/app/sadu-prototype-parity.test.cjs
git commit -m "test(design): pin the approved Sadu baseline"
```

### Task 2: Scaffold the clean Expo SDK 57 product

**External gate:** Confirm mobile dependency/distribution approval and that `application/ahd-mobile/` does not
contain user work. Use an isolated execution worktree because scaffolding creates many files and downloads packages.

**Files:**
- Create: `application/ahd-mobile/` from the SDK 57 default template
- Modify: `application/ahd-mobile/package.json`
- Modify: `application/ahd-mobile/app.json`
- Create: `application/ahd-mobile/README.md`
- Create: `application/ahd-mobile/tests/run-mobile-tests.cjs`

**Interfaces:**
- Consumes: Node.js >=22.13 and approved Expo dependency set.
- Produces: a clean SDK 57 Router app with deterministic validation scripts.

- [ ] **Step 1: Record environment and make scaffold absence the first check**

Run: `node -v`
Expected: `v22.13.0` or newer; the planning machine reports `v24.15.0`.

Run: `Test-Path application/ahd-mobile`
Expected: `False`. If `True`, stop and inspect ownership; do not overwrite.

- [ ] **Step 2: Create the SDK 57 Router template**

Run: `npx.cmd create-expo-app@latest application/ahd-mobile --template default@sdk-57`
Expected: project created with Expo SDK 57 and Expo Router.

- [ ] **Step 3: Install only the approved SDK-compatible dependencies**

Run from `application/ahd-mobile`:

```powershell
npx.cmd expo install expo-router expo-localization expo-font expo-splash-screen expo-status-bar expo-sqlite expo-dev-client react-native-safe-area-context react-native-svg react-native-reanimated
npx.cmd expo install --dev jest-expo @testing-library/react-native @types/jest
```

Expected: Expo selects SDK 57-compatible versions; `npm.cmd install` completes with no manual transitive pin.

Add exact scripts:

```json
{
  "scripts": {
    "sync:core": "node scripts/sync-web-core.cjs",
    "check:core": "node scripts/sync-web-core.cjs --check",
    "test:mobile": "node tests/run-mobile-tests.cjs",
    "test:ui": "jest --runInBand",
    "typecheck": "tsc --noEmit",
    "doctor": "expo-doctor"
  }
}
```

- [ ] **Step 4: Verify the empty product scaffold**

Run: `npm.cmd run typecheck`
Expected: PASS.

Run: `npx.cmd expo-doctor@latest`
Expected: all checks pass or every environment-only warning is recorded with an owner.

Run: `npx.cmd expo export --platform android`
Expected: Android bundle export succeeds under the New Architecture.

- [ ] **Step 5: Commit the clean scaffold**

```bash
git add application/ahd-mobile
git commit -m "feat(mobile): scaffold Expo SDK 57 product"
```

### Task 3: Define and generate the exact 21-route inventory

**Files:**
- Create: `application/ahd-mobile/src/navigation/screen-registry.ts`
- Create: `application/ahd-mobile/scripts/generate-routes.cjs`
- Delete: `application/ahd-mobile/app/` (SDK template examples only, after resolved-path verification)
- Create: `application/ahd-mobile/src/app/_layout.tsx`
- Create: `application/ahd-mobile/src/app/index.tsx`
- Create: `application/ahd-mobile/src/app/(tabs)/_layout.tsx`
- Create: `application/ahd-mobile/src/app/(stack)/_layout.tsx`
- Generate: 21 route files under `application/ahd-mobile/src/app/`
- Create: `application/ahd-mobile/tests/navigation-registry.test.cjs`

**Interfaces:**
- Consumes: exact web keys and baseline mapping from the mobile contract.
- Produces: typed `SCREEN_REGISTRY`, `ScreenKey`, four tab files, and 17 stack files.

- [ ] **Step 1: Write the failing exact-key/navigation test**

```js
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const expected = ["home", "create", "daftari", "timeline", "open", "circle", "circle-adv", "settle", "mine", "request", "proof", "maroof", "dispute", "standing", "impact", "bounds", "settings", "refusal", "shariah", "plans", "org"].sort();
const registryText = fs.readFileSync(path.join(ROOT, "src", "navigation", "screen-registry.ts"), "utf8");
const keys = [...registryText.matchAll(/key: '([^']+)'/g)].map((m) => m[1]).sort();
assert.deepStrictEqual(keys, expected);
assert.strictEqual((registryText.match(/surface: 'tab'/g) || []).length, 4);
for (const key of expected) assert.strictEqual(fs.existsSync(path.join(ROOT, key === "home" || key === "create" || key === "daftari" || key === "settle" ? `src/app/(tabs)/${key}.tsx` : `src/app/(stack)/${key}.tsx`)), true, key);
```

- [ ] **Step 2: Run and confirm the registry/routes are absent**

Run from `application/ahd-mobile`: `node tests/navigation-registry.test.cjs`
Expected: FAIL with missing registry.

- [ ] **Step 3: Add the complete registry and deterministic route generator**

```ts
// src/navigation/screen-registry.ts
export const SCREEN_REGISTRY = [
  { key: 'home', label: 'الرئيسية', route: '/home', surface: 'tab', baseline: 's01' },
  { key: 'create', label: 'أنشئ عهدًا', route: '/create', surface: 'tab', baseline: 's02' },
  { key: 'daftari', label: 'دفتري', route: '/daftari', surface: 'tab', baseline: 's04' },
  { key: 'settle', label: 'المقاصّة', route: '/settle', surface: 'tab', baseline: 's03' },
  { key: 'timeline', label: 'السجلّ', route: '/timeline', surface: 'stack', baseline: 's10' },
  { key: 'open', label: 'قرضٌ مفتوح', route: '/open', surface: 'stack', baseline: 's09' },
  { key: 'circle', label: 'الدائرة', route: '/circle', surface: 'stack', baseline: 's11' },
  { key: 'circle-adv', label: 'الدائرة+', route: '/circle-adv', surface: 'stack', baseline: 's12' },
  { key: 'mine', label: 'ما عليّ', route: '/mine', surface: 'stack', baseline: 's05' },
  { key: 'request', label: 'اطلب عهدًا', route: '/request', surface: 'stack', baseline: 's08' },
  { key: 'proof', label: 'الإثبات', route: '/proof', surface: 'stack', baseline: 's06' },
  { key: 'maroof', label: 'سِجلّ المعروف', route: '/maroof', surface: 'stack', baseline: 's14' },
  { key: 'dispute', label: 'محلّ خلاف', route: '/dispute', surface: 'stack', baseline: 's15' },
  { key: 'standing', label: 'سُلفة بالمعروف', route: '/standing', surface: 'stack', baseline: 's13' },
  { key: 'impact', label: 'أثر عهد', route: '/impact', surface: 'stack', baseline: 's07' },
  { key: 'bounds', label: 'الضمانات والحدود', route: '/bounds', surface: 'stack', baseline: 's16' },
  { key: 'settings', label: 'الإعدادات', route: '/settings', surface: 'stack', baseline: 's17' },
  { key: 'refusal', label: 'ما لا يفعله عهد', route: '/refusal', surface: 'stack', baseline: null },
  { key: 'shariah', label: 'الأساس الشرعي', route: '/shariah', surface: 'stack', baseline: null },
  { key: 'plans', label: 'الأجرة والخطط', route: '/plans', surface: 'stack', baseline: null },
  { key: 'org', label: 'لوحة المؤسسة', route: '/org', surface: 'stack', baseline: null }
] as const;
export type ScreenKey = typeof SCREEN_REGISTRY[number]['key'];
```

```js
// scripts/generate-routes.cjs
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const entries = [
  ["home", "tab"], ["create", "tab"], ["daftari", "tab"], ["settle", "tab"],
  ["timeline", "stack"], ["open", "stack"], ["circle", "stack"], ["circle-adv", "stack"],
  ["mine", "stack"], ["request", "stack"], ["proof", "stack"], ["maroof", "stack"],
  ["dispute", "stack"], ["standing", "stack"], ["impact", "stack"], ["bounds", "stack"],
  ["settings", "stack"], ["refusal", "stack"], ["shariah", "stack"], ["plans", "stack"], ["org", "stack"]
];
entries.forEach(([key, surface]) => {
  const dir = path.join(ROOT, "src", "app", surface === "tab" ? "(tabs)" : "(stack)");
  fs.mkdirSync(dir, { recursive: true });
  const body = `import { MappedScreen } from '../../screens/MappedScreen';\nexport default function Route() { return <MappedScreen screenKey="${key}" />; }\n`;
  fs.writeFileSync(path.join(dir, `${key}.tsx`), body, "utf8");
});
```

Remove only the newly scaffolded example routes after verifying the target:

```powershell
$expected = [IO.Path]::GetFullPath((Join-Path (Get-Location) 'app'))
$target = (Resolve-Path -LiteralPath app).Path
if ($target -ne $expected) { throw 'SCAFFOLD_APP_PATH_MISMATCH' }
Remove-Item -LiteralPath $target -Recurse
```

```tsx
// src/app/_layout.tsx
import { Stack } from 'expo-router';
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /><Stack.Screen name="(stack)" /></Stack>;
}
```

```tsx
// src/app/index.tsx
import { Redirect } from 'expo-router';
export default function Index() { return <Redirect href="/(tabs)/home" />; }
```

```tsx
// src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
export default function TabLayout() {
  return <Tabs screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="home" options={{ title: 'الرئيسية' }} />
    <Tabs.Screen name="create" options={{ title: 'أنشئ عهدًا' }} />
    <Tabs.Screen name="daftari" options={{ title: 'دفتري' }} />
    <Tabs.Screen name="settle" options={{ title: 'المقاصّة' }} />
  </Tabs>;
}
```

```tsx
// src/app/(stack)/_layout.tsx
import { Stack } from 'expo-router';
export default function ContextLayout() { return <Stack screenOptions={{ headerBackTitle: 'رجوع' }} />; }
```

- [ ] **Step 4: Generate, test, and typecheck routes**

Run: `node scripts/generate-routes.cjs`
Expected: 21 deterministic route files.

Run: `node tests/navigation-registry.test.cjs`
Expected: PASS with exactly 21 keys, four tabs, unique routes, and all files present.

Run: `npx.cmd tsc --noEmit`
Expected: PASS after adding a typed `MappedScreen` shell that rejects unknown keys.

- [ ] **Step 5: Commit route inventory**

```bash
git add application/ahd-mobile/src/navigation application/ahd-mobile/src/app application/ahd-mobile/src/screens/MappedScreen.tsx application/ahd-mobile/scripts/generate-routes.cjs application/ahd-mobile/tests/navigation-registry.test.cjs
git commit -m "feat(mobile): register all 21 Ahd routes"
```

### Task 4: Generate and prove the exact web core

**Files:**
- Create: `application/ahd-mobile/core-sources.json`
- Create: `application/ahd-mobile/scripts/sync-web-core.cjs`
- Generate: `application/ahd-mobile/src/generated/engine.js`
- Generate: `application/ahd-mobile/src/generated/features/*.js`
- Generate: `application/ahd-mobile/src/generated/tokens.json`
- Generate: `application/ahd-mobile/src/generated/source-manifest.json`
- Create: `application/ahd-mobile/src/core/engine.ts`
- Create: `application/ahd-mobile/tests/source-parity.test.cjs`
- Create: `application/ahd-mobile/tests/engine-parity.test.cjs`

**Interfaces:**
- Consumes: repository-relative allow-list in `core-sources.json`.
- Produces: exact-byte generated files, SHA-256 manifest, and typed `AhdEngine` adapter.

- [ ] **Step 1: Write failing source and golden parity tests**

```js
const assert = require("assert"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const MOBILE = path.join(__dirname, "..");
const REPO = path.join(MOBILE, "..", "..");
const manifest = require(path.join(MOBILE, "src", "generated", "source-manifest.json"));
for (const entry of manifest.files) {
  const source = fs.readFileSync(path.join(REPO, entry.source));
  const generated = fs.readFileSync(path.join(MOBILE, entry.generated));
  assert.strictEqual(source.equals(generated), true, entry.source);
  assert.strictEqual(crypto.createHash("sha256").update(generated).digest("hex"), entry.sha256);
}
const web = require(path.join(REPO, "app", "engine.js"));
const mobile = require(path.join(MOBILE, "src", "generated", "engine.js"));
assert.strictEqual(mobile.SEALED.seal, web.SEALED.seal);
assert.strictEqual(JSON.stringify(mobile.netting(mobile.IOUS)), JSON.stringify(web.netting(web.IOUS)));
assert.strictEqual(mobile.ribaScan("بلا فائدة").verdict, "clean");
```

- [ ] **Step 2: Run and confirm generated core is absent**

Run: `node tests/source-parity.test.cjs`
Expected: FAIL with missing manifest.

- [ ] **Step 3: Implement deterministic copy/check mode**

```json
{
  "sources": [
    "app/engine.js",
    "app/features/request.js",
    "app/features/create.js",
    "app/features/proof.js",
    "app/features/daftari.js",
    "app/features/borrower.js",
    "app/features/rifq.js",
    "app/features/impact.js",
    "app/features/riba-lint.js",
    "app/features/settlement.js",
    "application/design/tokens.json"
  ]
}
```

```js
// scripts/sync-web-core.cjs
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const MOBILE = path.join(__dirname, ".."), REPO = path.join(MOBILE, "..", "..");
const config = require(path.join(MOBILE, "core-sources.json"));
const check = process.argv.includes("--check"), files = [];
for (const source of config.sources) {
  const src = path.join(REPO, source);
  const generated = source === "app/engine.js" ? "src/generated/engine.js" : source === "application/design/tokens.json" ? "src/generated/tokens.json" : `src/generated/features/${path.basename(source)}`;
  const dst = path.join(MOBILE, generated), bytes = fs.readFileSync(src), sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  if (check) { if (!fs.existsSync(dst) || !fs.readFileSync(dst).equals(bytes)) { console.error(`DRIFT ${source}`); process.exitCode = 1; } }
  else { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.writeFileSync(dst, bytes); }
  files.push({ source, generated, bytes: bytes.length, sha256 });
}
const manifestPath = path.join(MOBILE, "src", "generated", "source-manifest.json");
const manifestBytes = Buffer.from(JSON.stringify({ schema: "ahd-mobile-source-manifest-v1", files }, null, 2) + "\n");
if (check) { if (!fs.existsSync(manifestPath) || !fs.readFileSync(manifestPath).equals(manifestBytes)) { console.error("DRIFT source-manifest.json"); process.exitCode = 1; } }
else fs.writeFileSync(manifestPath, manifestBytes);
if (!process.exitCode) console.log(`mobile core ${check ? "check" : "sync"}=PASS files=${files.length}`);
```

- [ ] **Step 4: Sync, prove Node parity, and prove Metro/Hermes bundling**

Run: `node scripts/sync-web-core.cjs`
Expected: generated manifest with exact source bytes.

Run: `node tests/source-parity.test.cjs && node tests/engine-parity.test.cjs`
Expected: PASS for bytes, hashes, API, golden seal/hash, 9-to-2 netting, respread, and riba negation.

Run: `npx.cmd expo export --platform android` and `npx.cmd expo export --platform ios`
Expected: both exports succeed; generated CommonJS resolves under Metro/Hermes.

- [ ] **Step 5: Commit generated parity proof**

```bash
git add application/ahd-mobile/core-sources.json application/ahd-mobile/scripts/sync-web-core.cjs application/ahd-mobile/src/generated application/ahd-mobile/src/core/engine.ts application/ahd-mobile/tests/source-parity.test.cjs application/ahd-mobile/tests/engine-parity.test.cjs
git commit -m "feat(mobile): sync the byte-faithful Ahd core"
```

### Task 5: Add versioned SQLite state and honest offline intents

**Files:**
- Create: `application/ahd-mobile/src/state/schema.ts`
- Create: `application/ahd-mobile/src/state/mobile-store.ts`
- Create: `application/ahd-mobile/src/state/migrations.ts`
- Create: `application/ahd-mobile/src/state/seed.ts`
- Create: `application/ahd-mobile/src/state/outbox.ts`
- Create: `application/ahd-mobile/tests/offline-state.test.ts`
- Create: `application/ahd-mobile/tests/state-migration.test.ts`

**Interfaces:**
- Consumes: Expo SQLite KV store and fixed `AS_OF`.
- Produces: `MobileStore`, transactional migrations, and `enqueueExternalIntent` with `needs_connection`.

- [ ] **Step 1: Write failing cold-start, migration, and external-boundary tests**

```ts
import { createMemoryStore } from '../src/state/mobile-store';
import { migrateEnvelope } from '../src/state/migrations';
import { enqueueExternalIntent } from '../src/state/outbox';

test('persists explicit as-of and migrates deterministically', async () => {
  const store = createMemoryStore();
  await store.save({ schema_version: 1, as_of: '2026-06-21', records: [], ui_state: {}, outbox_intents: [] });
  expect(await store.load()).toEqual({ schema_version: 1, as_of: '2026-06-21', records: [], ui_state: {}, outbox_intents: [] });
  expect(migrateEnvelope(await store.load(), 2)).toEqual(migrateEnvelope(await store.load(), 2));
});

test('external work never fakes canonical success offline', () => {
  const state = { schema_version: 2, as_of: '2026-06-21', records: [], ui_state: {}, outbox_intents: [] };
  const next = enqueueExternalIntent(state, { type: 'TSA_REQUEST', record_id: 'R-1' });
  expect(next.outbox_intents[0].status).toBe('needs_connection');
  expect(next.records).toEqual(state.records);
});
```

- [ ] **Step 2: Run and confirm the state modules are absent**

Run: `npm.cmd test -- --runInBand tests/offline-state.test.ts tests/state-migration.test.ts`
Expected: FAIL with missing state modules.

- [ ] **Step 3: Implement a small repository contract and deterministic outbox**

```ts
// src/state/schema.ts
export type ExternalIntent = { intent_id: string; type: 'NAFATH' | 'IDENTITY' | 'TSA_REQUEST' | 'ISSUER_SIGNATURE' | 'CHECKPOINT' | 'SUBMIT'; record_id: string; status: 'needs_connection' };
export type MobileEnvelope = { schema_version: number; as_of: string; records: readonly unknown[]; ui_state: Readonly<Record<string, unknown>>; outbox_intents: readonly ExternalIntent[] };
```

```ts
// src/state/outbox.ts
import type { ExternalIntent, MobileEnvelope } from './schema';
export function enqueueExternalIntent(state: MobileEnvelope, input: Omit<ExternalIntent, 'intent_id' | 'status'> & { intent_id?: string }): MobileEnvelope {
  const intent_id = input.intent_id ?? `intent:${input.type}:${input.record_id}:${state.outbox_intents.length}`;
  const intent: ExternalIntent = { intent_id, type: input.type, record_id: input.record_id, status: 'needs_connection' };
  return { ...state, outbox_intents: [...state.outbox_intents, intent] };
}
```

`mobile-store.ts` exports a memory adapter for tests and an Expo SQLite KV adapter for devices. `migrations.ts`
contains one pure function per version and never drops old records/readers. The SQLite adapter writes the full
envelope inside one transaction.

- [ ] **Step 4: Run state and airplane-mode contract tests**

Run: `npm.cmd test -- --runInBand tests/offline-state.test.ts tests/state-migration.test.ts`
Expected: PASS for cold start, read/write, deterministic v1-to-v2 migration, rollback reader, draft/ledger/proof
offline use, `needs_connection`, and unchanged canonical records.

- [ ] **Step 5: Commit offline state boundaries**

```bash
git add application/ahd-mobile/src/state application/ahd-mobile/tests/offline-state.test.ts application/ahd-mobile/tests/state-migration.test.ts
git commit -m "feat(mobile): add versioned offline state"
```

### Task 6: Implement the Arabic design system and accessibility primitives

**External gate:** Bundle IBM Plex Sans Arabic files only after the owner confirms source, OFL license, and exact
weights. If weight 800 is unavailable, record `FONT-02` mapping to 700 before code uses that mapping.

**Files:**
- Modify: `application/ahd-mobile/app.json`
- Create after approval: `application/ahd-mobile/assets/fonts/IBMPlexSansArabic-Regular.otf`
- Create after approval: `application/ahd-mobile/assets/fonts/IBMPlexSansArabic-SemiBold.otf`
- Create after approval: `application/ahd-mobile/assets/fonts/IBMPlexSansArabic-Bold.otf`
- Create after approval: `application/ahd-mobile/assets/fonts/OFL.txt`
- Create: `application/ahd-mobile/src/design/tokens.ts`
- Create: `application/ahd-mobile/src/design/typography.ts`
- Create: `application/ahd-mobile/src/components/Screen.tsx`
- Create: `application/ahd-mobile/src/components/Icon.tsx`
- Create: `application/ahd-mobile/src/components/SaduBand.tsx`
- Create: `application/ahd-mobile/tests/design-token-parity.test.cjs`
- Create: `application/ahd-mobile/tests/rtl-contract.test.tsx`

**Interfaces:**
- Consumes: generated tokens, static RTL config, approved font files.
- Produces: typed tokens, accessible safe-area screen, vector icon, Sadu ornament, reduced-motion contract.

- [ ] **Step 1: Write failing token, RTL, icon, and font tests**

```js
const assert = require("assert"), fs = require("fs"), path = require("path");
const MOBILE = path.join(__dirname, "..");
const generated = require(path.join(MOBILE, "src", "generated", "tokens.json"));
const source = require(path.join(MOBILE, "..", "design", "tokens.json"));
assert.deepStrictEqual(generated, source);
const app = require(path.join(MOBILE, "app.json"));
assert.strictEqual(app.expo.extra.supportsRTL, true);
assert.strictEqual(app.expo.extra.forcesRTL, true);
const componentText = ["Screen.tsx", "Icon.tsx", "SaduBand.tsx"].map((f) => fs.readFileSync(path.join(MOBILE, "src", "components", f), "utf8")).join("\n");
assert.strictEqual(/[😀-🙏]/u.test(componentText), false);
```

- [ ] **Step 2: Run and confirm design primitives/config are absent**

Run: `node tests/design-token-parity.test.cjs`
Expected: FAIL with missing design components or RTL config.

- [ ] **Step 3: Configure static RTL and add typed primitives**

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      ["expo-localization", { "supportedLocales": { "ios": ["ar"], "android": ["ar"] } }],
      ["expo-font", { "fonts": ["./assets/fonts/IBMPlexSansArabic-Regular.otf", "./assets/fonts/IBMPlexSansArabic-SemiBold.otf", "./assets/fonts/IBMPlexSansArabic-Bold.otf"] }]
    ],
    "extra": { "supportsRTL": true, "forcesRTL": true }
  }
}
```

```tsx
// src/components/Screen.tsx
import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space } from '../design/tokens';
export function Screen({ children }: PropsWithChildren) {
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{children}</ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.ground }, content: { paddingStart: space[4], paddingEnd: space[4], paddingBottom: space[8] } });
```

`Icon.tsx` maps a closed icon-name union to `react-native-svg` paths and marks decorative icons inaccessible.
`SaduBand.tsx` renders the approved vector pattern and uses the system reduced-motion setting for any motion.

- [ ] **Step 4: Run tokens, RTL, contrast, and native exports**

Run: `node tests/design-token-parity.test.cjs`
Expected: PASS.

Run: `npm.cmd test -- --runInBand tests/rtl-contract.test.tsx`
Expected: PASS for RTL, start/end layout, font families/weights, 44-point controls, label/role/state, no emoji, and
reduced motion.

Run: `node ../design/check-tokens.cjs && node ../design/contrast-check.cjs` from `application/ahd-mobile` parent context as appropriate.
Expected: token sync and every contrast pair PASS.

Run: `npx.cmd expo export --platform android && npx.cmd expo export --platform ios`
Expected: both exports include fonts/SVG and succeed.

- [ ] **Step 5: Commit approved Arabic design primitives**

```bash
git add application/ahd-mobile/app.json application/ahd-mobile/assets/fonts application/ahd-mobile/src/design application/ahd-mobile/src/components application/ahd-mobile/tests/design-token-parity.test.cjs application/ahd-mobile/tests/rtl-contract.test.tsx
git commit -m "feat(mobile): add Arabic RTL design primitives"
```

### Task 7: Implement the six parity journeys above generated features

**Files:**
- Create: `application/ahd-mobile/src/core/features/request.ts`
- Create: `application/ahd-mobile/src/core/features/create.ts`
- Create: `application/ahd-mobile/src/core/features/proof.ts`
- Create: `application/ahd-mobile/src/core/features/ledger.ts`
- Create: `application/ahd-mobile/src/core/features/grace.ts`
- Create: `application/ahd-mobile/src/core/features/settlement.ts`
- Create: `application/ahd-mobile/tests/fixtures/journeys/*.json`
- Create: `application/ahd-mobile/tests/journey-parity.test.cjs`
- Create: `application/ahd-mobile/tests/determinism.test.cjs`
- Modify: matching route renderers under `application/ahd-mobile/src/screens/`

**Interfaces:**
- Consumes: generated engine/features, fixed journey JSON, MobileStore.
- Produces: typed view models and exact web/mobile outcome fixtures for request/create/proof/ledger/grace/settlement.

- [ ] **Step 1: Write failing manifest-driven journey parity tests**

```js
const assert = require("assert"), path = require("path");
const manifest = require("./fixtures/journeys/manifest.json");
const mobile = require(path.join(__dirname, "..", "dist-test", "journey-runner.cjs"));
const web = require(path.join(__dirname, "..", "..", "..", "app", "engine.js"));
for (const fixturePath of manifest.fixtures) {
  const fixture = require(path.join(__dirname, "fixtures", "journeys", fixturePath));
  const first = mobile.runJourney(fixture);
  const second = mobile.runJourney(fixture);
  assert.deepStrictEqual(first, second, fixture.journey_id);
  if (fixture.expected_seal) assert.strictEqual(first.seal, fixture.expected_seal);
  if (fixture.expected_canonical) assert.strictEqual(first.canonical, fixture.expected_canonical);
  Object.values(first.money_minor || {}).forEach((value) => assert.strictEqual(Number.isInteger(value), true));
  assert.strictEqual(first.golden_seal, web.SEALED.seal);
}
```

- [ ] **Step 2: Run and confirm journey adapters/fixtures are absent**

Run: `node tests/journey-parity.test.cjs`
Expected: FAIL with missing journey manifest or runner.

- [ ] **Step 3: Implement typed adapters as direct generated-function calls**

```ts
// src/core/features/create.ts
const CreateAhd = require('../../generated/features/create.js') as {
  makeDraft(input: object): object;
  createCanonical(draft: object, engine: object): string;
  createSeal(draft: object, engine: object): { canonical_hash: string; seal: string };
};
const AHD = require('../../generated/engine.js') as {
  toMinor(value: number): number;
  SEALED: { seal: string };
};
export type CreateInput = { id: string; lender: string; borrower: string; amountMinor: number; months: number };
export function createJourney(input: CreateInput) {
  if (!Number.isInteger(input.amountMinor) || input.amountMinor <= 0) throw new Error('AMOUNT_MINOR_INVALID');
  const draft = CreateAhd.makeDraft({ ...input, amountSAR: input.amountMinor / 100 });
  const canonical = CreateAhd.createCanonical(draft, AHD);
  const sealed = CreateAhd.createSeal(draft, AHD);
  return { draft, canonical, canonical_hash: sealed.canonical_hash, seal: sealed.seal, principal_minor: input.amountMinor };
}
```

Each other adapter follows its actual generated module exports and returns a closed view-model type. It does not
duplicate calculations. `journey-runner.cjs` dispatches the six fixture IDs to compiled adapters. The grace adapter
uses approval state: without real production approval it exposes request/inert state, not active production Rifq.

- [ ] **Step 4: Run all six journeys, determinism, and source checks**

Run: `node tests/journey-parity.test.cjs && node tests/determinism.test.cjs`
Expected: PASS for exact canonical/seal where applicable, integer money, expected state, fixed `AS_OF`, byte-identical
repeat output, and offline behavior.

Run: `node scripts/sync-web-core.cjs --check`
Expected: PASS with no generated drift.

- [ ] **Step 5: Commit core journeys**

```bash
git add application/ahd-mobile/src/core/features application/ahd-mobile/src/screens application/ahd-mobile/tests/fixtures/journeys application/ahd-mobile/tests/journey-parity.test.cjs application/ahd-mobile/tests/determinism.test.cjs
git commit -m "feat(mobile): reproduce six core Ahd journeys"
```

### Task 8: Port the 17 approved visuals and gate four supplemental screens

**External gate:** Task 1 baseline must pass. The four null-baseline routes require supplemental approval before
they receive production visuals or contribute to a full visual-parity claim.

**Files:**
- Create: `application/ahd-mobile/src/screens/s01-home.tsx` through `s17-settings.tsx`
- Create: `application/ahd-mobile/src/screens/BaselinePendingScreen.tsx`
- Create: `application/ahd-mobile/src/screens/screen-renderers.ts`
- Modify: `application/ahd-mobile/src/screens/MappedScreen.tsx`
- Create: `application/ahd-mobile/tests/baseline-coverage.test.cjs`
- Create: `application/ahd-mobile/tests/navigation-reachability.test.tsx`

**Interfaces:**
- Consumes: 17 approved Sadu partials and the four supplemental gate states.
- Produces: renderer for every registry key, with explicit baseline state and no unreachable route.

- [ ] **Step 1: Write failing 17/4 coverage and reachability tests**

```js
const assert = require("assert"), fs = require("fs"), path = require("path");
const MOBILE = path.join(__dirname, "..");
const renderers = fs.readFileSync(path.join(MOBILE, "src", "screens", "screen-renderers.ts"), "utf8");
for (let n = 1; n <= 17; n += 1) assert.strictEqual(renderers.includes(`s${String(n).padStart(2, "0")}`), true);
for (const key of ["refusal", "shariah", "plans", "org"]) assert.strictEqual(renderers.includes(`${key}: BaselinePendingScreen`), true);
assert.strictEqual((renderers.match(/BaselinePendingScreen/g) || []).length, 5); // import plus four entries
```

- [ ] **Step 2: Run and confirm renderer coverage is absent**

Run: `node tests/baseline-coverage.test.cjs`
Expected: FAIL with missing `screen-renderers.ts`.

- [ ] **Step 3: Build focused native components from each approved partial**

Each screen file receives one typed view model, composes shared primitives, and reproduces hierarchy/copy/actions
from its named partial. CSS constructs map exactly through `application/design/RN-MAPPING.md`: flex instead of grid,
SVG for Sadu/gauge/netting, safe-area layout, and no simulated browser/device chrome.

```tsx
// src/screens/BaselinePendingScreen.tsx
import { Text } from 'react-native';
import { Screen } from '../components/Screen';
export function BaselinePendingScreen({ label }: { label: string }) {
  return <Screen><Text accessibilityRole="header">{label}</Text><Text>التصميم التفصيلي لهذه الشاشة بانتظار اعتماد خط الأساس.</Text></Screen>;
}
```

The pending screen is truthful and read-only. It contains no feature action and is replaced only after supplemental
design approval. `screen-renderers.ts` maps all 21 keys explicitly; unknown keys throw in development.

- [ ] **Step 4: Run baseline and route reachability tests**

Run: `node tests/baseline-coverage.test.cjs`
Expected: PASS for 17 approved renderer IDs, four explicit pending renderers, and manifest hashes.

Run: `npm.cmd test -- --runInBand tests/navigation-reachability.test.tsx`
Expected: PASS; every route is reachable from home or a contextual link, Android back and iOS stack order are
defined, and required actions remain visible at 375, 412, and 430 logical-point widths.

- [ ] **Step 5: Commit approved visuals without overstating four pending baselines**

```bash
git add application/ahd-mobile/src/screens application/ahd-mobile/tests/baseline-coverage.test.cjs application/ahd-mobile/tests/navigation-reachability.test.tsx
git commit -m "feat(mobile): port the approved Sadu screen set"
```

### Task 9: Pass automated accessibility and physical-device acceptance

**Files:**
- Create: `application/ahd-mobile/tests/accessibility-contract.test.tsx`
- Create: `application/ahd-mobile/design-evidence/device-matrix.json`
- Create: `application/ahd-mobile/design-evidence/accessibility-report.md`
- Create: `application/ahd-mobile/design-evidence/offline-report.md`
- Create: `application/ahd-mobile/design-evidence/ios/`
- Create: `application/ahd-mobile/design-evidence/android/`

**Interfaces:**
- Consumes: development builds, six core journeys, approved devices.
- Produces: automated accessibility result plus signed/dated iPhone and Samsung evidence matrix.

- [ ] **Step 1: Write failing accessibility contracts**

```tsx
import { render } from '@testing-library/react-native';
import { MappedScreen } from '../src/screens/MappedScreen';
for (const screenKey of ['home', 'create', 'daftari', 'settle', 'proof', 'mine'] as const) {
  test(`${screenKey} exposes a heading and reachable controls`, () => {
    const view = render(<MappedScreen screenKey={screenKey} />);
    expect(view.getAllByRole('header').length).toBeGreaterThan(0);
    for (const button of view.queryAllByRole('button')) {
      expect(button.props.accessibilityLabel).toBeTruthy();
      expect(button.props.accessibilityState?.disabled).not.toBeUndefined();
    }
  });
}
```

- [ ] **Step 2: Run and identify missing roles/labels/states**

Run: `npm.cmd test -- --runInBand tests/accessibility-contract.test.tsx`
Expected: FAIL on the first missing heading, label, role, state, hint, target-size contract, or required action.

- [ ] **Step 3: Fix the primitives/screens and create an exact device matrix**

`device-matrix.json` uses schema `ahd-mobile-device-matrix-v1` and records actual device model, OS, build ID,
screen width, tester, date, six journey outcomes, 100%/200% text, VoiceOver/TalkBack, RTL focus order, reduced
motion, Android back/iOS swipe-back, and airplane-mode cold start. Boolean evidence fields cannot be omitted.

Build development clients:

```powershell
eas build --profile development --platform android
eas build --profile development --platform ios
```

- [ ] **Step 4: Run automated, export, and physical acceptance gates**

Run: `node tests/run-mobile-tests.cjs`
Expected: every source/engine/journey/state/route/design test PASS.

Run: `npm.cmd test -- --runInBand && npx.cmd tsc --noEmit && npx.cmd expo-doctor@latest`
Expected: PASS.

Run: `npx.cmd expo export --platform android && npx.cmd expo export --platform ios`
Expected: PASS.

On both physical devices, complete the matrix. Expected: six journeys reachable, Arabic readable at 200%, screen
reader order correct, no clipped required action, reduced motion honored, gestures/back correct, offline cold start
works, and external actions remain `needs_connection`.

- [ ] **Step 5: Commit evidence only after both devices pass**

```bash
git add application/ahd-mobile/tests/accessibility-contract.test.tsx application/ahd-mobile/design-evidence
git commit -m "test(mobile): record iOS and Android acceptance"
```

### Task 10: Run repository gates, reconcile docs, and score the UI

**Files:**
- Modify: `application/design/README.md`
- Modify: `application/design/RN-MAPPING.md`
- Modify: `docs/PUBLISHABLE-PRODUCT-SPEC.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `_meta/OPEN-ITEMS.md`
- Modify: `_meta/STATUS.md`

**Interfaces:**
- Consumes: live mobile gates and physical evidence.
- Produces: truthful architecture/status and Judge Lens score; no production/mobile-parity claim exceeds evidence.

- [ ] **Step 1: Run the mobile gate from a clean generated state**

Run from `application/ahd-mobile`:

```powershell
node scripts/sync-web-core.cjs --check
node tests/run-mobile-tests.cjs
npm.cmd test -- --runInBand
npx.cmd tsc --noEmit
npx.cmd expo-doctor@latest
npx.cmd expo export --platform android
npx.cmd expo export --platform ios
```

Expected: every command exits `0`.

- [ ] **Step 2: Run design-source gates**

Run from repository root:

```powershell
node application/prototypes/build-prototype.cjs --check
node application/design/check-tokens.cjs
node application/design/contrast-check.cjs
```

Expected: 17-part baseline parity, token sync, and contrast PASS.

- [ ] **Step 3: Run the full repository gate and frozen-demo tripwire**

Run: `cd tests && node run-all.cjs`
Expected: `AHD GATE` green with zero failures and frozen-demo SHA-256 intact; record the live assertion count.

- [ ] **Step 4: Update truth docs and conduct Judge Lens review**

Document SDK 57, 21-route model, generated-core boundary, offline external-action boundary, actual device matrix,
17/21 or 21/21 visual-baseline status, and remaining distribution credentials. Score every visible surface using
`docs/JUDGE-LENS.md`; any score below `8/10` creates a `JL-*` item.

Run:

```powershell
rg -n "SDK 5[456]|17 screens|21 screens|Expo Go|mobile parity|physical device" docs _meta AmadHackathon
```

Expected: every mobile claim agrees with the SDK 57 implementation, the 21-key registry, and the dated
physical-device matrix; no document claims parity before its evidence row passes. Then record all five scores from
`docs/JUDGE-LENS.md`; each score is at least `8/10` or has a linked `JL-*` item in `_meta/OPEN-ITEMS.md`.

- [ ] **Step 5: Commit final mobile truth state**

```bash
git add application/design/README.md application/design/RN-MAPPING.md docs/PUBLISHABLE-PRODUCT-SPEC.md docs/ARCHITECTURE.md _meta/OPEN-ITEMS.md _meta/STATUS.md
git commit -m "docs(mobile): record parity and device evidence"
```

## Plan Self-Review

- **Spec coverage:** Tasks 1-10 cover FR-012, FR-013, mobile portions of FR-018, and SC-006/SC-007. All 21 routes
  are registered, while the six core journeys carry exact behavior parity.
- **Baseline honesty:** The plan preserves the dirty user artifact, requires an owner choice, and distinguishes the
  17 existing visual baselines from four supplemental gates.
- **Type consistency:** Route keys, generated manifest fields, offline states, journey fields, and platform floors
  match the Spec Kit mobile contract/data model.
- **Completion boundary:** Node parity, Expo export, screenshots, and Expo Go are insufficient alone; both physical
  device reports and accessibility/offline checks are required.
