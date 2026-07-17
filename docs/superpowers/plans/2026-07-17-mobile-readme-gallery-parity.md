# Mobile README Gallery Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Replace the Sadu-era README gallery with twenty React Native image assets covering all twenty-four mobile screens, using the Web App canonical showcase story.

**Architecture:** showcase-data.ts remains the single deterministic source for synthetic mobile records. A new pure gallery manifest maps twenty final assets to every screen-registry key and capture state. Screens continue to prefer real local data; screenshots are captured from the running Expo app at a phone viewport, paired where required, and the public README consumes only the final assets.

**Tech Stack:** Expo 57, React Native 0.86, Expo Router, TypeScript, Jest, Testing Library, React Native Web browser capture, GitHub Markdown.

## Global Constraints

- Never edit demo/index.html, golden vectors, generated core logic, or float money.
- Canonical mobile showcase copy and values come from webapp/index.html at commit 6d48b22 or later.
- All showcase IDs and dates are fixed. The reference date is 2026-06-21.
- All screenshot numerals are Western digits.
- Every synthetic result visibly says بيانات تجريبية or عرض تجريبي.
- Fixtures never persist on render; real local data always wins.
- Preserve the existing modified APK and checksum until source, screenshot, and delivery verification finish.
- Stage only files owned by this plan; ignore unrelated graphify-out files.

---

### Task 1: Lock the twenty-asset, twenty-four-screen contract

**Files:**
- Create: application/ahd-mobile/src/showcase/gallery-manifest.ts
- Create: application/ahd-mobile/src/showcase/__tests__/gallery-manifest.test.ts

**Interfaces:**
- Consumes: SCREEN_REGISTRY and ScreenKey from src/navigation/screen-registry.ts.
- Produces: MOBILE_README_GALLERY, a readonly array of file, screens, and states.

- [ ] **Step 1: Write the failing manifest test**

    import { SCREEN_REGISTRY } from '@/navigation/screen-registry';
    import { MOBILE_README_GALLERY } from '../gallery-manifest';

    test('twenty assets cover every registered mobile screen', () => {
      expect(MOBILE_README_GALLERY).toHaveLength(20);
      expect(new Set(MOBILE_README_GALLERY.map((item) => item.file)).size).toBe(20);
      const covered = new Set(MOBILE_README_GALLERY.flatMap((item) => item.screens));
      expect([...covered].sort()).toEqual(SCREEN_REGISTRY.map((screen) => screen.key).sort());
      expect(MOBILE_README_GALLERY.find((item) => item.screens.includes('proof'))?.states)
        .toEqual(['verified', 'tampered']);
    });

- [ ] **Step 2: Run RED**

    npx jest --runInBand src/showcase/__tests__/gallery-manifest.test.ts

Expected: FAIL because gallery-manifest.ts does not exist.

- [ ] **Step 3: Implement the exact mapping**

    import type { ScreenKey } from '@/navigation/screen-registry';

    type GalleryItem = {
      readonly file: string;
      readonly screens: readonly ScreenKey[];
      readonly states: readonly string[];
    };

    export const MOBILE_README_GALLERY = [
      { file: '01-home.png', screens: ['home'], states: ['default'] },
      { file: '02-create-refusal.png', screens: ['create', 'refusal'], states: ['riba-guard', 'refusal'] },
      { file: '03-daftari-timeline.png', screens: ['daftari', 'timeline'], states: ['default', 'default'] },
      { file: '04-proof.png', screens: ['proof'], states: ['verified', 'tampered'] },
      { file: '05-settlement.png', screens: ['settle'], states: ['9-to-2'] },
      { file: '06-capabilities.png', screens: ['more'], states: ['all'] },
      { file: '07-open-loan.png', screens: ['open'], states: ['default'] },
      { file: '08-mine.png', screens: ['mine'], states: ['default'] },
      { file: '09-request.png', screens: ['request'], states: ['default'] },
      { file: '10-standing.png', screens: ['standing'], states: ['default'] },
      { file: '11-circle.png', screens: ['circle'], states: ['default'] },
      { file: '12-circle-advanced.png', screens: ['circle-adv'], states: ['default'] },
      { file: '13-jamiya.png', screens: ['jamiya'], states: ['default'] },
      { file: '14-daily.png', screens: ['daily'], states: ['default'] },
      { file: '15-maroof.png', screens: ['maroof'], states: ['default'] },
      { file: '16-dispute.png', screens: ['dispute'], states: ['default'] },
      { file: '17-impact.png', screens: ['impact'], states: ['default'] },
      { file: '18-bounds-shariah.png', screens: ['bounds', 'shariah'], states: ['rejected-term', 'default'] },
      { file: '19-plans-org.png', screens: ['plans', 'org'], states: ['default', 'default'] },
      { file: '20-settings.png', screens: ['settings'], states: ['western-digits'] },
    ] as const satisfies readonly GalleryItem[];

- [ ] **Step 4: Run GREEN and commit**

    npx jest --runInBand src/showcase/__tests__/gallery-manifest.test.ts
    git add application/ahd-mobile/src/showcase/gallery-manifest.ts application/ahd-mobile/src/showcase/__tests__/gallery-manifest.test.ts
    git commit -m "test: lock the mobile gallery manifest"

Expected: one passing suite and one passing test.

---

### Task 2: Lock Web App fixture parity in failing tests

**Files:**
- Modify: application/ahd-mobile/src/screens/__tests__/showcase-experience.test.tsx
- Modify: application/ahd-mobile/src/screens/__tests__/settlement-demo.test.tsx
- Modify: focused screen tests that still assert the Noura/Layla create story.

**Interfaces:**
- Consumes: existing exports from src/showcase/showcase-data.ts.
- Produces: executable expectations for the canonical Naif story and unchanged golden settlement.

- [ ] **Step 1: Replace create and settings expectations**

    expect(view.getByLabelText('صاحب المال').props.value).toBe('نايف العتيبي');
    expect(view.getByLabelText('المستفيد').props.value).toBe('سلطان');
    expect(view.getByLabelText('مبلغ العهد بالريال').props.value).toBe('1200');
    expect(view.getByLabelText('غرض العهد').props.value).toContain('قرض حسن');
    expect(view.getByLabelText('تاريخ الاتفاق').props.value).toBe('2026-02-15');
    expect(settings.getByLabelText('اسم العرض').props.value).toBe('نايف العتيبي');

- [ ] **Step 2: Require the six Web App ledger records and zero writes**

    for (const party of ['مقهى الحيّ', 'سلطان', 'عبدالله', 'ريم', 'ماجد', 'فهد']) {
      expect(daftari.getByText(party)).toBeTruthy();
    }
    expect(daftari.getByText('عرض تجريبي')).toBeTruthy();
    expect(journeyStore.getState().records).toHaveLength(0);

- [ ] **Step 3: Keep settlement names and exact outputs pinned**

    expect(view.getByText('قبل: 9')).toBeTruthy();
    expect(view.getByText('بعد: 2')).toBeTruthy();
    expect(view.getByText(/1,800/)).toBeTruthy();
    expect(view.getByText(/600/)).toBeTruthy();
    expect(view.getByText(/300/)).toBeTruthy();

- [ ] **Step 4: Run RED**

    npx jest --runInBand src/screens/__tests__/showcase-experience.test.tsx src/screens/__tests__/settlement-demo.test.tsx

Expected: FAIL on the old Noura, Layla, 4800, and three-record fixture values.

---

### Task 3: Implement the canonical Web App showcase module

**Files:**
- Modify: application/ahd-mobile/src/showcase/showcase-data.ts
- Modify: screens that need a derived fixture export instead of duplicated literals.

**Interfaces:**
- Produces: SHOWCASE_PROFILE_NAME, SHOWCASE_DATE, SHOWCASE_CREATE, SHOWCASE_RECORDS, SHOWCASE_LEDGER_META, proof, open-loan, standing, Jamiya, and existing settlement exports.

- [ ] **Step 1: Set canonical profile and create values**

    export const SHOWCASE_PROFILE_NAME = 'نايف العتيبي';
    export const SHOWCASE_DATE = '2026-06-21';

    export const SHOWCASE_CREATE = {
      lender: SHOWCASE_PROFILE_NAME,
      borrower: 'سلطان',
      amountSarText: '1200',
      purpose: 'قرض حسن بالمعروف بلا زيادة',
      repaymentMode: 'scheduled' as const,
      monthsText: '3',
      firstDueMonth: '2026-03',
      agreementDate: '2026-02-15',
    } as const;

- [ ] **Step 2: Build the six ledger records only through the real core**

    const LEDGER_INPUTS = [
      ['AHD-CAFE', 'نايف العتيبي', 'مقهى الحيّ', 250_000, 'دعم تجهيز المقهى'],
      ['AHD-SULTAN', 'نايف العتيبي', 'سلطان', 120_000, 'قرض حسن بالمعروف'],
      ['AHD-ABD', 'نايف العتيبي', 'عبدالله', 60_000, 'حاجة أسرية'],
      ['AHD-KEPT', 'نايف العتيبي', 'ريم', 80_000, 'عهد سُدّد كاملًا'],
      ['AHD-DISPUTE', 'نايف العتيبي', 'ماجد', 90_000, 'عهد محل خلاف'],
      ['AHD-FAHD', 'فهد', 'نايف العتيبي', 300_000, 'قرض حسن قائم'],
    ] as const;

- [ ] **Step 3: Add presentation metadata without mutating sealed records**

    export const SHOWCASE_LEDGER_META = {
      'AHD-SULTAN': { due: '2026-05-15', daysLate: 37, state: 'late' },
      'AHD-CAFE': { due: '2026-06-01', daysLate: 20, state: 'late' },
      'AHD-KEPT': { due: 'سُدّد كاملًا', daysLate: 0, state: 'kept' },
      'AHD-DISPUTE': { due: 'محلّ خلاف', daysLate: 0, state: 'disputed' },
    } as const;

- [ ] **Step 4: Align Jamiya, standing support, open loan, daily, request, dispute, and bounds fixtures with the approved spec**

Keep the exact golden settlement inputs and participants unchanged because they already match the Web App.

- [ ] **Step 5: Run GREEN and affected suites**

    npx jest --runInBand src/screens/__tests__/showcase-experience.test.tsx src/screens/__tests__/settlement-demo.test.tsx src/screens/__tests__/open-screen.test.tsx src/screens/__tests__/standing-screen.test.tsx src/screens/__tests__/jamiya-screen.test.tsx src/screens/__tests__/circle-screen.test.tsx src/screens/__tests__/circle-adv-screen.test.tsx src/screens/__tests__/request-screen.test.tsx src/screens/__tests__/maroof-screen.test.tsx

Expected: all selected suites pass with zero writes on render.

- [ ] **Step 6: Commit**

    git add application/ahd-mobile/src/showcase application/ahd-mobile/src/screens application/ahd-mobile/src/components
    git commit -m "feat: align mobile showcase data with the Diwan"

---

### Task 4: Make every capture explain its feature in the first viewport

**Files:**
- Modify only affected files under application/ahd-mobile/src/screens/.
- Modify focused tests beside each changed screen.

**Interfaces:**
- Consumes: canonical fixture exports from Task 3.
- Produces: twenty-four readable first-viewport states with Western digits and visible showcase labels.

- [ ] **Step 1: Add failing assertions for the decisive stories**

Require Sultan 37, proof 2,500, settlement 9 and 2, Jamiya 1,000 and 6,000, standing 800 and 1,600, and open loan 20,000.

- [ ] **Step 2: Run focused tests and verify RED**

    npx jest --runInBand src/screens/__tests__/showcase-experience.test.tsx src/screens/__tests__/open-screen.test.tsx src/screens/__tests__/standing-screen.test.tsx src/screens/__tests__/jamiya-screen.test.tsx

- [ ] **Step 3: Apply the exact first-viewport changes**

- HomeScreen selects SHOWCASE_RECORDS only when state.records is empty, renders ShowcaseNotice, and leads with سلطان · 1,200 ر.س · متأخر 37 يومًا before the aggregate board.
- CreateAhdScreen keeps SHOWCASE_CREATE as its initial state and surfaces the riba-guard result above the fold after review.
- DaftariScreen renders all six showcase records and keeps detail actions disabled for non-persisted IDs.
- ProofScreen initializes from SHOWCASE_SHARE_ENVELOPE and exposes both verify and tamper actions without importing on render.
- OpenLoanScreen and StandingScreen consume SHOWCASE_OPEN_RECORD and SHOWCASE_STANDING instead of selecting unrelated ledger records.
- JamiyaScreen, CircleScreen, and CircleAdvScreen consume the six-member جمعية أهل الحي fixture.
- MineScreen, TimelineScreen, MaroofScreen, DisputeScreen, ImpactScreen, OrgScreen, and PlansScreen derive display rows from the canonical fixture and never duplicate party or amount literals.
- SettingsScreen starts its showcase digit preference in Western mode without writing the preference until the user presses Save.

Use existing ScreenHeader, ShowcaseNotice, Section, RowGroup, and StatusChip components. Do not add navigation or persistence paths.

- [ ] **Step 4: Run GREEN, typecheck, and lint**

    npm test -- --runInBand
    npm run typecheck
    npm run lint

Expected: Jest, TypeScript, and lint exit zero.

- [ ] **Step 5: Commit**

    git add application/ahd-mobile/src/screens application/ahd-mobile/src/components
    git commit -m "feat: sharpen mobile showcase storytelling"

---

### Task 5: Capture and review the twenty final assets

**Files:**
- Create: application/ahd-mobile/screenshots/readme/*.png, exactly twenty files.
- Do not commit raw intermediate captures.

**Interfaces:**
- Consumes: MOBILE_README_GALLERY and the running Expo application.
- Produces: twenty deterministic PNG assets.

- [ ] **Step 1: Start the actual Expo app**

    npx expo start --web --port 8081

Use real Expo Router routes and a 394×878 phone viewport. Hide browser chrome and wait for fonts and layout to settle.

- [ ] **Step 2: Capture all single and paired states**

Navigate directly to manifest routes. Capture verified and tampered Proof, the riba-guard Create state, the rejected Bounds state, and Western-digit Settings.

- [ ] **Step 3: Assemble paired boards**

Paired boards are 02, 03, 04, 18, and 19. Place two equal phone captures side by side on a neutral background with a short Arabic label above each. Add no fake device or browser chrome.

- [ ] **Step 4: Review at README display size**

Verify readable Arabic, Western digits, visible showcase label, correct fixture values, no clipped CTA, no keyboard or debug overlay, no misleading claim, and no duplicate coverage.

- [ ] **Step 5: Add a filesystem check and commit**

The test resolves every manifest filename under application/ahd-mobile/screenshots/readme/ and verifies exactly twenty PNG files.

---

### Task 6: Replace the Sadu gallery in the public README

**Files:**
- Modify: README.md
- Modify: tests/readme-judge-contract.cjs
- Delete: app/screenshots/readme/*.png

**Interfaces:**
- Consumes: twenty final assets from Task 5.
- Produces: public README with no Sadu path and complete mobile coverage.

- [ ] **Step 1: Write the failing README contract**

Require all twenty application/ahd-mobile/screenshots/readme paths and reject app/screenshots/readme/.

- [ ] **Step 2: Run RED**

    node tests/readme-judge-contract.cjs

Expected: FAIL because README still references old Sadu paths.

- [ ] **Step 3: Replace gallery markup and captions**

Keep the desktop Web App section and live link unchanged. Group the twenty mobile assets into the three-step story and complete capability tour in manifest order.

- [ ] **Step 4: Remove old Sadu assets and run GREEN**

    node tests/readme-judge-contract.cjs

Expected: README JUDGE CONTRACT OK.

- [ ] **Step 5: Commit**

    git add README.md tests/readme-judge-contract.cjs application/ahd-mobile/screenshots/readme
    git add -u app/screenshots/readme
    git commit -m "docs: replace the Sadu gallery with the mobile app"

---

### Task 7: Verify, integrate, and publish

**Files:**
- Preserve: application/ahd-mobile/artifacts/ahd-pilot-v1.apk
- Preserve: application/ahd-mobile/artifacts/ahd-pilot-v1.apk.sha256
- Modify governance evidence only if the active package requires it.

- [ ] **Step 1: Run complete mobile checks**

    npm test -- --runInBand
    npm run typecheck
    npm run lint
    npm run check:core
    npm run check:boundaries

- [ ] **Step 2: Run complete repository gate**

    node tests/run-all.cjs

Expected: zero failed assertions and frozen demo hash unchanged.

- [ ] **Step 3: Review final diff and preserve unrelated work**

Do not stage graphify-out. Do not overwrite pre-existing APK modifications unless a fresh verified build is explicitly produced.

- [ ] **Step 4: Integrate the mobile branch into latest local main without force**

Resolve README conflicts in favor of the new twenty-image gallery plus the existing desktop Web App section and link.

- [ ] **Step 5: Re-run README contract and repository gate on main**

Only after both pass, push main to origin and verify the raw GitHub README contains new paths and no Sadu paths.
