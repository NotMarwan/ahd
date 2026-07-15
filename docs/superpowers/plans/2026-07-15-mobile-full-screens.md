# Mobile App Full Screens + Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `application/ahd-mobile` (Expo, 6 screens today) to full parity with the 23-screen web app, fix the settlement demo (currently nets 1→0 because foreign member names), add real tab icons, compact the tab bar, put الرئيسية leftmost, lower the logo, and make the whole simulation demo-perfect.

**Architecture:** Expo Router (SDK 57), screens in `src/screens/*.tsx` + thin route files in `src/app/`. Shariah engine is the byte-copied `src/generated/engine.js` (NEVER modify) + feature view-models in `src/generated/features/*.js`. State via `AhdJourneyStore` (`src/state/journey-store.ts`). All money integer halalas. No `Date.now`/`Math.random`/`Intl` in logic.

**Tech Stack:** TypeScript, React Native 0.86, Expo Router, react-native-svg (already a dependency), jest-expo + @testing-library/react-native.

## Global Constraints

- **Never modify** `src/generated/engine.js` or `src/generated/features/*.js` internals — call only.
- Engine netting/balances only recognize members: `نورة، سارة، خالد، ليلى، فهد` (`engine.NODES`). Settlement demos MUST use these names or `engine.IOUS` seed.
- Money: integer halalas via `ahdCore.parseSarTextToMinor` / `formatMinorSar`. Never float.
- Determinism: no `Date.now`, `new Date()`, `Math.random`, `Intl`, `.toLocaleString` in app logic. Fixed `AS_OF` from `ahdCore`.
- RTL forced (`app.json` extra.forcesRTL). All text `textAlign: 'right'` unless layout-mirrored.
- No riba/penalty/maysir/gharar wording anywhere; AI issues no fatwa; trust band qualitative only.
- Tests: jest (`npm test` inside `application/ahd-mobile`), suites must stay green: 27 existing assertions.
- Judge lens: every screen scored vs `docs/JUDGE-LENS.md` before session end.
- Commit format: `<type>: <description>` (feat/fix/refactor/docs/test/chore).

## Source Map (web → mobile port)

Web screens live in `app/screens/*.js` (innerHTML strings + DI feature modules in `app/features/*.js`). Port CONTENT + feature calls, not DOM. Mobile equivalents:

| # | Mobile route | Screen file to create | Web source | Feature module used |
|---|---|---|---|---|
| 1 | `/timeline` | `TimelineScreen.tsx` | `app/screens/timeline.js` | `engine.SEED_AHDS`, `engine.fold`, `engine.statusLabel` |
| 2 | `/open` | `OpenLoanScreen.tsx` | `app/screens/open-loan.js` | `engine.respread` |
| 3 | `/circle` | `CircleScreen.tsx` | `app/screens/circle.js` | `engine.DEMO_CIRCLE`, `circleShares`, `foldCircle` |
| 4 | `/circle-adv` | `CircleAdvScreen.tsx` | `app/screens/circle-adv.js` | `engine.MUQASSA_CIRCLES`, `circleToIous`, `netting` |
| 5 | `/mine` | `MineScreen.tsx` | `app/screens/borrower.js` | `engine.SEED_AHDS` filtered by borrower |
| 6 | `/request` | `RequestScreen.tsx` | `app/screens/request.js` | `ahdCore.prepareDraft` (reverse direction) |
| 7 | `/maroof` | `MaroofScreen.tsx` | `app/screens/daily.js` | `engine.TRUST`, `trustSignal`, `TRUST_BAND_AR` |
| 8 | `/dispute` | `DisputeScreen.tsx` | `app/screens/dispute.js` | static content + `verifyRecord` |
| 9 | `/standing` | `StandingScreen.tsx` | `app/screens/standing.js` | `engine.STANDING_CIRCLE` |
| 10 | `/impact` | `ImpactScreen.tsx` | `app/screens/impact.js` | `engine.SEED_AHDS` aggregates |
| 11 | `/bounds` | `BoundsScreen.tsx` | `app/screens/bounds.js` | static content |
| 12 | `/settings` | `SettingsScreen.tsx` | `app/screens/settings.js` | static + D-1 self-disclosure toggle (display only) |
| 13 | `/refusal` | `RefusalScreen.tsx` | `app/screens/refusal.js` | static content (what Ahd never does) |
| 14 | `/shariah` | `ShariahScreen.tsx` | `app/screens/shariah-basis.js` | static content (2:282, 2:280, citations) |
| 15 | `/plans` | `PlansScreen.tsx` | `app/screens/plans.js` | static content (fee model, no riba) |
| 16 | `/org` | `OrgScreen.tsx` | `app/screens/org.js` | `engine.IOUS` org view |
| 17 | `/jamiya` | `JamiyaScreen.tsx` | `app/screens/jamiya.js` + `app/features/jamiya.js` | port `jamiya.js` feature (pure JS, Node-testable) |

Registry `src/navigation/screen-registry.ts` already declares 1–16 (missing `jamiya` — add it).

---

## Phase A — Fixes (do first, judge-visible)

### Task A1: Settlement demo uses real engine members (fix 1→0 bug)

**Files:**
- Modify: `application/ahd-mobile/src/screens/SettlementScreen.tsx`
- Test: `application/ahd-mobile/src/screens/__tests__/settlement-demo.test.tsx` (create)

**Interfaces:**
- Consumes: `engine.IOUS` (seed tangle of 5 transfers among نورة/سارة/خالد/ليلى/فهد), `Settlement.settlementView(ious, engine)` from `src/generated/features/settlement.js`, `ahdCore` minor helpers.
- Produces: settlement screen shows الشبكة قبل (5 تحويلات) → بعد (أقل)، «المجموع محفوظ» chip green, per-member balances list.

- [ ] **Step 1: Write failing test**

```tsx
// src/screens/__tests__/settlement-demo.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SettlementScreen } from '../SettlementScreen';
import { AhdStoreProvider } from '@/state';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../../generated/engine.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Settlement = require('../../generated/features/settlement.js');

test('settlement demo nets the seed tangle and conserves totals', () => {
  const view = Settlement.settlementView(engine.IOUS, engine);
  expect(view.conserved).toBe(true);
  expect(view.afterCount).toBeLessThan(view.beforeCount);
});

test('settlement screen shows conserved verdict after running demo', async () => {
  render(
    <AhdStoreProvider>
      <SettlementScreen />
    </AhdStoreProvider>,
  );
  fireEvent.press(await screen.findByText('شغّل مقاصّة الشبكة'));
  expect(await screen.findByText('المجموع محفوظ')).toBeTruthy();
});
```

- [ ] **Step 2: Run** `npm test -- --testPathPatterns=settlement-demo` — expect FAIL (button text absent).

- [ ] **Step 3: Rewrite SettlementScreen demo section.** Replace the single sealed-record transfer with the seed tangle. Key changes inside `SettlementScreen.tsx`:

```tsx
// top of file, after imports
// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SettlementFeature = require('../generated/features/settlement.js');

type NetView = {
  before: { from: string; to: string; amount: number }[];
  after: { from: string; to: string; amount: number }[];
  balances: Record<string, number>;
  beforeCount: number;
  afterCount: number;
  conserved: boolean;
};

// inside component: local state, no journey-step dependency
const [view, setView] = useState<NetView | null>(null);
const runSettlement = () => {
  setView(SettlementFeature.settlementView(engine.IOUS, engine) as NetView);
};
```

Render: before list (`view.before` rows `from ← to amount ر.س`), button `شغّل مقاصّة الشبكة`, result section with `StatusChip label={view.conserved ? 'المجموع محفوظ' : 'تحتاج مراجعة'}`, counts `قبل: N تحويلات / بعد: M`, and only show `حُفظ مجموع الالتزامات` line when `view.conserved` (removes today's contradiction). Amounts from engine are SAR numbers — format with `ahdCore.formatMinorSar(engine.toMinor(amount))`.

- [ ] **Step 4: Run** `npm test -- --testPathPatterns=settlement-demo` — expect PASS. Run full `npm test` — 27+ green (update `vertical-journey.test.tsx` if it asserted old button label `تنفيذ المقاصّة`).

- [ ] **Step 5: Commit** `fix: settlement demo uses engine seed tangle, conserves totals`

### Task A2: Tab icons + compact tab bar + الرئيسية leftmost

**Files:**
- Create: `application/ahd-mobile/src/components/tab-icon.tsx`
- Modify: `application/ahd-mobile/src/app/(tabs)/_layout.tsx`
- Test: `application/ahd-mobile/src/components/__tests__/tab-icon.test.tsx`

**Interfaces:**
- Produces: `TabIcon({ name: 'home' | 'create' | 'daftari' | 'settle' | 'more', color: string, size?: number })` — react-native-svg paths, no external assets.

- [ ] **Step 1: Failing test**

```tsx
// src/components/__tests__/tab-icon.test.tsx
import { render } from '@testing-library/react-native';
import { TabIcon } from '../tab-icon';

test.each(['home', 'create', 'daftari', 'settle', 'more'] as const)(
  'renders %s icon',
  (name) => {
    const { toJSON } = render(<TabIcon name={name} color="#000" />);
    expect(toJSON()).toBeTruthy();
  },
);
```

- [ ] **Step 2: Run** `npm test -- --testPathPatterns=tab-icon` — FAIL (module missing).

- [ ] **Step 3: Implement `tab-icon.tsx`**

```tsx
import Svg, { Path } from 'react-native-svg';

const PATHS: Record<string, string> = {
  home: 'M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z',
  create: 'M12 5v14M5 12h14',
  daftari: 'M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 5h7M8 12h7M8 16h5',
  settle: 'M12 3v18M7 7h10M5 7l-2 5a3.5 3.5 0 0 0 7 0L8 7m11 0-2 5a3.5 3.5 0 0 0 7 0l-2-5',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
};

export function TabIcon({ name, color, size = 22 }: { name: keyof typeof PATHS; color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={PATHS[name]} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
```

(`settle` = ميزان; adjust paths to taste, keep stroke style consistent.)

- [ ] **Step 4: Wire into `(tabs)/_layout.tsx`** — add `tabBarIcon` per screen, compact bar, and REVERSE the visual order so الرئيسية lands leftmost under forced RTL (RTL renders first child rightmost, so declare home LAST):

```tsx
<Tabs
  backBehavior="history"
  screenOptions={{
    headerShown: false,
    sceneStyle: { backgroundColor: colors.ground },
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.inkSecondary,
    tabBarLabelStyle: { fontFamily: fontFamilies.body, fontSize: 11, fontWeight: '700' },
    tabBarStyle: { height: 56, paddingBottom: 4, backgroundColor: colors.card, borderTopColor: colors.hairline },
  }}
>
  <Tabs.Screen name="settle" options={{ title: 'المقاصّة', tabBarIcon: ({ color }) => <TabIcon name="settle" color={color} /> }} />
  <Tabs.Screen name="daftari" options={{ title: 'دفتري', tabBarIcon: ({ color }) => <TabIcon name="daftari" color={color} /> }} />
  <Tabs.Screen name="create" options={{ title: 'أنشئ عهدًا', tabBarIcon: ({ color }) => <TabIcon name="create" color={color} /> }} />
  <Tabs.Screen name="home" options={{ title: 'الرئيسية', tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
</Tabs>
```

Keep `initialRouteName: 'home'` on the Tabs component (`<Tabs initialRouteName="home" …>`) so declaration order doesn't change the start screen. VERIFY on device which side home lands; if RTL doesn't flip as expected, restore original order instead — the requirement is «الرئيسية يسار», not a specific declaration order.

- [ ] **Step 5: Run** `npm test` all green. **Step 6: Commit** `feat: tab icons, compact bar, home leftmost`

### Task A3: Home layout — logo lower, tighter hero

**Files:**
- Modify: `application/ahd-mobile/src/screens/HomeScreen.tsx` (styles only)

- [ ] **Step 1:** In `styles.brand` add `marginTop: spacing.x6` (or ~48) and reduce logo size if it dominates (`logo: { width: 96, height: 96 }`). Center hero block vertically: wrap brand+header in a `View` with `justifyContent: 'center', minHeight: '45%'`.
- [ ] **Step 2:** `npm test` green (styles don't break tests). Visual check in Expo Go.
- [ ] **Step 3: Commit** `fix: home hero spacing, logo lowered`

---

## Phase B — Port the missing 17 screens

Pattern identical per screen. Task B1 is the fully-worked exemplar; B2–B17 repeat it with the Source Map row. Each screen: (1) failing smoke test, (2) screen component reading its feature module, (3) route file, (4) registry check, (5) commit. Every screen links from a new «المزيد» hub.

### Task B0: «المزيد» hub tab (5th tab, gateway to all stack screens)

**Files:**
- Create: `application/ahd-mobile/src/screens/MoreScreen.tsx`
- Create: `application/ahd-mobile/src/app/(tabs)/more.tsx`
- Modify: `application/ahd-mobile/src/app/(tabs)/_layout.tsx` (add screen, icon `more`, declare FIRST so it lands rightmost… i.e. before `settle` in the reversed order)
- Modify: `src/navigation/screen-registry.ts` (add `{ key: 'more', label: 'المزيد', route: '/more', surface: 'tab', baseline: null }` and `{ key: 'jamiya', label: 'الجمعية', route: '/jamiya', surface: 'stack', baseline: null }`)
- Test: `src/screens/__tests__/more-screen.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from '@testing-library/react-native';
import { MoreScreen } from '../MoreScreen';

test('more hub lists every contextual screen', () => {
  render(<MoreScreen />);
  for (const label of ['السجلّ', 'قرضٌ مفتوح', 'الدائرة', 'الأساس الشرعي', 'الإعدادات']) {
    expect(screen.getByText(label)).toBeTruthy();
  }
});
```

- [ ] **Step 2:** FAIL. **Step 3: Implement** — `MoreScreen` maps `CONTEXTUAL_SCREENS` from the registry into `RowGroup` rows, each row a `Pressable` with label + chevron, `router.push(screen.route)`. Route file:

```tsx
// src/app/(tabs)/more.tsx
import { MoreScreen } from '@/screens/MoreScreen';
export default function MoreRoute() { return <MoreScreen />; }
```

- [ ] **Step 4:** PASS + full suite green. **Step 5: Commit** `feat: more hub tab linking all contextual screens`

### Task B1 (exemplar): Timeline screen `/timeline`

**Files:**
- Create: `src/screens/TimelineScreen.tsx`
- Create: `src/app/(stack)/timeline.tsx`
- Test: `src/screens/__tests__/timeline-screen.test.tsx`

**Interfaces:**
- Consumes: `engine.SEED_AHDS` (array of seeded ahd records), `engine.fold(record)` (folds events to current state), `engine.statusLabel(state)` (Arabic label), `engine.AR_MONTHS`.
- Produces: default-export route component; screen lists each seed ahd: id, parties, amount (`ahdCore.formatMinorSar(engine.toMinor(a.amountSAR))`), status chip.

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from '@testing-library/react-native';
import { TimelineScreen } from '../TimelineScreen';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../../generated/engine.js');

test('timeline lists every seed ahd with its status', () => {
  render(<TimelineScreen />);
  for (const ahd of engine.SEED_AHDS) {
    expect(screen.getByText(ahd.id)).toBeTruthy();
  }
});
```

- [ ] **Step 2:** FAIL. **Step 3: Implement**

```tsx
// src/screens/TimelineScreen.tsx
import { StyleSheet, Text, View } from 'react-native';
import { AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js');

type SeedAhd = { id: string; lender: string; borrower: string; amountSAR: number; events?: unknown[] };

export function TimelineScreen() {
  const seeds = engine.SEED_AHDS as SeedAhd[];
  return (
    <AppShell testID="timeline-screen">
      <ScreenHeader eyebrow="السجلّ" title="مسار كل عهد" subtitle="سجلّ زمني للعهود المشهودة، من الإنشاء إلى الوفاء." />
      <Section title="العهود">
        <RowGroup>
          {seeds.map((ahd) => {
            const folded = engine.fold(ahd);
            return (
              <View key={ahd.id} style={styles.row}>
                <View style={styles.heading}>
                  <Text style={styles.id}>{ahd.id}</Text>
                  <StatusChip label={engine.statusLabel(folded.state)} tone={folded.state === 'fulfilled' ? 'verified' : 'neutral'} />
                </View>
                <Text style={styles.body}>{ahd.lender} ← {ahd.borrower}</Text>
                <Text style={styles.amount}>{ahdCore.formatMinorSar(engine.toMinor(ahd.amountSAR))}</Text>
              </View>
            );
          })}
        </RowGroup>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.x1, padding: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  heading: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  id: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body },
  body: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  amount: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
});
```

NOTE: verify actual `SEED_AHDS` field names and `fold`/`statusLabel` signatures against `app/screens/timeline.js` before coding — the web screen is the ground truth for how they're called. Adjust `tone` mapping to the real state strings (`STATE_AR` keys).

Route file:

```tsx
// src/app/(stack)/timeline.tsx
import { TimelineScreen } from '@/screens/TimelineScreen';
export default function TimelineRoute() { return <TimelineScreen />; }
```

- [ ] **Step 4:** PASS + suite green. **Step 5: Commit** `feat: timeline screen`

### Tasks B2–B17: remaining screens

Repeat Task B1's exact 5-step cycle for every Source Map row (2–17). For each:

- Test asserts the screen's distinctive Arabic strings/data from its web source (open the web source file first; copy its copy — do NOT invent copy).
- Static-content screens (bounds, refusal, shariah, plans, dispute, settings): no engine calls; port the Arabic sections into `Section`+`RowGroup` blocks; test asserts 3+ key headings.
- Engine-backed screens: call the same engine/feature functions the web screen calls (grep the web source for `engine.` / feature module usage).
- `/jamiya` additionally: copy `app/features/jamiya.js` to `src/generated/features/jamiya.js` VERBATIM (byte-faithful, like other features) and require it; its Node tests exist at `tests/app/jamiya-core.test.cjs` — mirror 2–3 assertions in jest.
- Commit per screen: `feat: <key> screen`.

### Task B18: Registry/parity guard

**Files:**
- Modify: `src/navigation/__tests__/screen-registry.test.ts`

- [ ] Add test: every registry route has a matching route file.

```ts
import * as fs from 'fs';
import * as path from 'path';
import { SCREEN_REGISTRY } from '../screen-registry';

test('every registered route has a route file', () => {
  const appDir = path.join(__dirname, '..', '..', 'app');
  for (const screen of SCREEN_REGISTRY) {
    const name = screen.route.slice(1);
    const candidates = [
      path.join(appDir, '(tabs)', `${name}.tsx`),
      path.join(appDir, '(stack)', `${name}.tsx`),
      path.join(appDir, '(stack)', name, 'index.tsx'),
    ];
    expect(candidates.some((p) => fs.existsSync(p))).toBe(true);
  }
});
```

- [ ] Commit `test: registry-route parity guard`

---

## Phase C — Perfect simulation (guided demo)

### Task C1: Demo autopilot banner

**Files:**
- Create: `src/components/demo-guide.tsx`
- Modify: `src/components/app-shell.tsx` (render guide when active)
- Create: `src/state/demo-script.ts`
- Test: `src/state/__tests__/demo-script.test.ts`

**Interfaces:**
- Produces: `DEMO_STEPS: { route: string; title: string; hint: string }[]` — ordered walkthrough: home → create (prefilled) → فحص → ختم → دفتري → تفاصيل → مقاصّة → إثبات → المزيد. `useDemoGuide()` returns `{ step, next, skip, active, start }`.

- [ ] **Step 1: Failing test** — `demo-script.test.ts`: steps cover the 8 core routes in order; `next()` advances; `skip()` deactivates.
- [ ] **Step 2:** FAIL. **Step 3:** Implement `DEMO_STEPS` const + tiny zustand-free store (module state + `useSyncExternalStore` or existing store pattern — follow `journey-store` style: class + provider). Banner component: fixed bottom-above-tabs strip showing `hint`, buttons «التالي» (router.push next route) and «إنهاء».
- [ ] **Step 4:** PASS. Manual run in Expo Go: full walkthrough hands-free except taps on «التالي».
- [ ] **Step 5: Commit** `feat: guided demo walkthrough`

### Task C2: Create-form quick-fill

**Files:**
- Modify: `src/screens/CreateAhdScreen.tsx`

- [ ] Add small `Pressable` under the form: «تعبئة تجريبية» — fills the four fields with the default demo values in one tap (they're already the useState defaults; button restores them after user edits). One test in existing screen test file: press button, expect input values restored.
- [ ] Commit `feat: demo quick-fill on create form`

---

## Verification (end of every phase)

1. `cd application/ahd-mobile && npm test` — all suites green.
2. `npx tsc --noEmit` — clean.
3. `npx expo lint` — clean.
4. Expo Go on device: walk all tabs + المزيد + 3 random stack screens; RTL correct; no red screen.
5. Root harness untouched: `cd tests && node run-all.cjs` still 3067/0 (mobile app lives outside its scope, but confirm nothing at root was touched).
6. Judge lens: score changed surfaces vs `docs/JUDGE-LENS.md`; <8 → JL- item in `_meta/OPEN-ITEMS.md`.
7. Update `AmadHackathon/` vault (Home + plan + topical note) before session end.
