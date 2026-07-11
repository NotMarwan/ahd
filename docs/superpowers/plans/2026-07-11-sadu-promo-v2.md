# SaduPromo v2 — Motion Film Fix + Deepen Plan

> **For agentic workers:** execute task-by-task; verify each task with `npx remotion still` frames
> before moving on. No test harness here — stills + final render ARE the verification.
> Project: `promo/` (Remotion 4, 1080×1920@60). Composition: `SaduPromo`.

**Goal:** Fix the three reported problems (logo placeholder, caption collisions, distracting
phone float), make the settle beat enticing (names + amounts + savings), and add the wallet
beats (دفتري «ما لك» / «ما عليّ») the v1 film omitted.

**Reference findings baked in (scout 2026-07-11):**
- Safe zones: top ~12% for stage caption only; phone never enters it. Text ≥48px @1080w, ≤10 words, hold ≥2s (120f).
- Best promos keep the device **static**; screens change INSIDE via directional wipe/push (~90-120f per screen), parallax layers optional.
- Numbers = odometer digit-rolls (tabular nums, fixed digit slots, 500-800ms roll, hold 1.5-2s), highlight pills, before/after cards.
- Pacing: 3s hook carries 71% of retention; early beats 1.5-3s per idea, accelerate near the end; final 2-3s = calm CTA hold.

## Global constraints
- Sadu tokens only (`promo/src/sadu.ts` — copied from dir-b head.html; never invent colors).
- Spine in copy: no ٪ glyphs, no score/rating words, red only for tamper/stop, verses verbatim ﴿﴾.
- Names/amounts = the app's real seed data (`app/app.js` seedRecords): مقهى الحي ٢٬٥٠٠ · سلطان ١٬٢٠٠ · عبدالله ٦٠٠ · ريم ٨٠٠ (ذمّة محفوظة) · فهد ٣٬٠٠٠ (عليك). Settle five = the golden demo five.
- Deterministic (no Date.now/random in components — Remotion frame-driven only).
- After every task: `npx remotion still` the affected beat frame(s), eyeball, then continue.
- Commit per task (`feat(promo): ...`).

---

## Task 1 — Logo slot (awaiting Gemini asset) + emblem fallback polish
**Files:** `promo/src/components/SaduUi.tsx`, `promo/public/` (asset drop-point)

The operator is generating a real logo (prompt delivered separately). Until it lands:
1. Add `promo/public/logo/` directory + README line: drop `ahd-mark.png` (transparent, 1:1) here.
2. `Emblem` component gains an `src?` prop: if `staticFile("logo/ahd-mark.png")` exists (pass a
   boolean from a tiny build-time `fs.existsSync` in sadu.ts — Remotion allows Node in config
   files only, so instead: try/catch `<Img>` with `onError` fallback is NOT deterministic —
   **simplest deterministic route: a `USE_LOGO_ASSET = false` flag in sadu.ts** the operator
   flips to `true` after dropping the file).
3. When flag on: render `<Img src={staticFile("logo/ahd-mark.png")}>` in ColdOpen/Close/NavLg
   instead of the octagon SVG. When off: current SVG emblem (keep — it's the fallback).

**Verify:** still frame 60 (cold open) with flag off = unchanged; no missing-asset crash.

## Task 2 — Kill the float: static phone
**Files:** `promo/src/components/SaduUi.tsx` (SaduPhone)

1. Remove `drift`, `breathe`, rotateX parallax from `SaduPhone`. Keep ONLY the spring
   entrance (rise+scale, ~45f) then **frozen** (`transform` constant after settle).
2. Keep the soft shadow static (no shadow animation).
3. Entrance happens once per beat mount — acceptable (beats already crossfade/push).

**Verify:** stills at frames 300, 320, 340 — phone pixel-identical across the three.

## Task 3 — Caption system: no collisions, safe zones
**Files:** `promo/src/components/SaduUi.tsx` (StageCaption, NavLg)

1. `StageCaption`: fixed top band `top: 64, height: 150` (inside top 12%); phone `top` moves
   to 250 so caption and device NEVER overlap. Kicker 26px, title 46px, both center, hold ≥2s.
2. `NavLg` header rebuild (the red-circle collision): emblem inline-start (right in RTL) in its
   OWN row, then eyebrow row, then title row — explicit flex column, `gap: 10`, no negative
   margins, no absolute positioning. Title 46px (was 52 — colliding), `lineHeight 1.25`,
   `paddingInlineEnd: 0` and eyebrow `fontSize 20` with `marginTop 0`.
3. Reduce `NavLg` top padding to 70 (island clearance) — content column gains room.

**Verify:** still at the SaduHome mid-beat: emblem/eyebrow/«أهلًا نورة» three clean rows,
zero overlap; caption clear of phone.

## Task 4 — Odometer component (the enticing-numbers engine)
**Files:** `promo/src/components/Odometer.tsx` (new)

Digit-strip roll, reference pattern: each digit column is a vertical strip `0-9` translated by
`digit * lineHeight`, eased per-digit with slight stagger (deeper digits settle first).
Tabular width via fixed `ch` boxes. API:

```tsx
<Odometer value={n} size={44} color={S.teal} durFrames={40} startFrame={f0} suffix="ر.س" />
```

- `value` interpolated from `from` (default 0) → `to` with EASE; each rendered digit derived
  from the interpolated value (Remotion-deterministic, no state).
- Comma grouping via existing `fmt()`; commas render as static separators between digit boxes.
- Used by Tasks 5-7 everywhere a number appears (no more bare text counters).

**Verify:** temp still harness — render an Odometer mid-roll; digits misaligned = fail.

## Task 5 — Settle beat v2: names, amounts, savings (the climax earns it)
**Files:** `promo/src/beats-sadu/SaduSettle.tsx`

1. **Names on dots** (golden-demo five): سعود · تركي · عبدالله · نورة · ريم — 22px labels
   beside each dot, fade in with dot spring.
2. **Teal transfer labels**: when each of the 2 transfers draws, a pill rides its midpoint:
   «تركي ← سعود · ٥٠٠ ر.س» style (Odometer inside pill, rolls up as the line draws).
3. **Before/after cards** replace the dry split: two cards —
   right «قبل: ٩ تحويلات · ١٬٨٠٠ ر.س تتحرّك» (terra tint) crossfades/scales down as
   left «بعد: تحويلان · ٩٠٠ ر.س» (teal tint) pops in. Both use Odometer.
4. **Savings pill** (the enticing moment): after collapse settles, a gold pill slides up:
   «✨ وُفِّر تحريكُ ٩٠٠ ريال — والحقوق نفسُها بالهللة» with the ٩٠٠ odometer-rolling.
5. Duration: 340 → 400f (needs the extra beat for labels to read; still inside pacing budget).

**Verify:** stills at local frames ~120 (tangle labeled), ~220 (transfers + pills), ~330 (savings pill).

## Task 6 — NEW beat: دفتري wallet («ما لك» — the money screen)
**Files:** `promo/src/beats-sadu/SaduDaftari.tsx` (new), `sadu.ts` (SDUR.daftari = 300), `SaduPromo.tsx` (insert after Home, before Create)

Real seed rows, real amounts (لك):
- مقهى الحي — ٢٬٥٠٠ ر.س (متأخّر بكرامة — كهرماني)
- سلطان — ١٬٢٠٠ ر.س
- عبدالله — ٦٠٠ ر.س
- ريم — ٨٠٠ ر.س · ذمّة محفوظة 🤍 (teal chip)

Choreography: NavLg «دفتري — ما لك» → **net gauge** (conic ring, SVG arc sweep 0→272°, the
prototype's gauge) with «صافي ما لك» + Odometer ٤٬٣٠٠ → rows cascade (row-in stagger 8f),
each amount odometer-rolls in place → «المصرف يُذكِّر بالمعروف نيابةً عنك» gold banner.

**Verify:** still mid-beat — gauge swept, 4 rows, amounts aligned tabular.

## Task 7 — NEW beat: ما عليّ (borrower mirror — dignity side)
**Files:** `promo/src/beats-sadu/SaduMine.tsx` (new), `sadu.ts` (SDUR.mine = 260), `SaduPromo.tsx` (insert after Daftari)

- Header «ما عليّ — بلا عدّاد، بلا تصنيف».
- One card: فهد — Odometer ٣٬٠٠٠ ر.س.
- «ادفع ما تيسّر» tapped (press-scale feedback) → amount rolls ٣٬٠٠٠ → ٢٬٥٠٠ with a teal
  «-٥٠٠» chip floating up + fading (the physical payment moment).
- «أحتاج وقتًا» chip → amber (never red) banner «نظرةٌ إلى ميسرة — أُبلغ المُقرِض بكرامة»
  + verse ﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَة﴾ glow.

**Verify:** stills at roll moment + amber banner.

## Task 7b — NEW beat: rapid montage (the screens the operator pasted 2026-07-11)
**Files:** `promo/src/beats-sadu/SaduMontage.tsx` (new), `sadu.ts` (SDUR.montage = 300)

Reference pacing: sub-1s accelerating cuts before the close. Four mini-screens, ~72f each,
hard wipes between, each ONE hero element + one number:
1. **الدائرة** — «جُمع ٣٬٢٠٠ من ٨٬٠٠٠» odometer + ring arc + member chips (لُجين دفعت عن الجميع).
2. **سُلفة بالمعروف** — «في كلّ دورة: ٨٠٠ ر.س · ٤ دورات» + cycle rows cascade.
3. **متى ما تيسّر** — remaining ١٬٥٠٠ + segmented progress bar (سُدّد/صدقة/باقٍ) fills.
4. **سِجلّ المعروف** — covenant dots cascade down the dashed spine + «السلسلة سليمة ✓».
Caption for the whole beat: «وأكثر — كلُّه مختوم».

## Task 8 — In-phone screen wipes (film flows as ONE device)
**Files:** `promo/src/SaduPromo.tsx`

1. Beat order v2: Cold → Home → **Daftari → Mine** → Create → Proof → Settle → Close.
2. Between phone beats use `wipe({direction:"from-left"})` (RTL forward) at 22f instead of
   full-frame slide — with Task 2's static phone the wipe reads as the SCREEN advancing
   inside one steady device (reference pattern). Brand boundaries (first/last) stay `fade`.
3. Re-derive `SADU_FRAMES`; total lands ~44s — inside the 30-60s window; if over 46s, trim
   `SDUR.home` to 240 and `SDUR.proof` to 280 (the two most padded).

**Verify:** stills straddling two transitions (e.g. Home→Daftari midpoint): phone frame
continuous, only screen content wiping.

## Task 9 — Full render + review + vault
1. `npm run render:sadu` → `out/ahd-sadu-promo.mp4` (overwrites v1).
2. Extract 8 spot frames (`remotion still` at each beat midpoint) — check: no text collision
   anywhere, phone static, numbers aligned, savings pill lands.
3. Vault: dated line in `AmadHackathon/05 حالة المشروع.md`; commit.

---

## Beat sheet v2 (target ~44s)

| # | Beat | Frames | Content |
|---|---|---|---|
| 1 | Cold open (hook) | 190 | emblem/logo draws → «عهد» → band → «يَشهد… لا يُقرض» |
| 2 | Home hero | 250 | header (fixed layout) → cells cascade → trust word glow |
| 3 | دفتري wallet | 300 | gauge sweep → 4 real rows, odometer amounts → reminder banner |
| 4 | ما عليّ | 260 | فهد ٣٬٠٠٠ → pay-eased roll → amber grace + verse |
| 5 | Create (HERO) | 400 | type → riba slam+shake → ceremony rail → sealed doc + hash |
| 6 | Proof | 280 | hash settles → tamper flip red → restore teal |
| 7 | Settle (CLIMAX) | 400 | named dots → 9 dissolve → 2 labeled transfers → before/after → savings pill |
| 8 | Close | 190 | emblem + band + soul line, calm hold |

Transitions: 22f wipes inside phone, fades at brand ends. Total ≈ 2270 − 7×22 ≈ 2116f ≈ 35s. ✓
