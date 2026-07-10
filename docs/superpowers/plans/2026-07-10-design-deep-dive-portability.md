# Design Deep-Dive + Device Portability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the Sadu v4 prototype from "looks right in a browser" to "survives a real install on iPhone and Samsung": apply the research-study patterns (Nafath ceremony, Absher document-cards, micro-steps), extract one portable token source, and prove every visual trick has a working React Native equivalent BEFORE the skeleton build.

**Architecture:** Three layers. (1) Design round on the prototype file using the research doc. (2) A single `application/design/tokens.json` both the HTML prototype and the future Expo app consume — one source of truth, no drift. (3) A feasibility contract: `RN-MAPPING.md` maps every CSS technique in the prototype to its Expo/RN implementation with a risk grade; anything ungraded may not ship in a screen design.

**Tech Stack:** HTML/CSS prototype (current) · tokens.json (style-dictionary-style flat JSON) · target stack Expo SDK 54+/RN New Architecture, react-native-svg, Reanimated 3 (per the deferred skeleton plan `2026-07-10-mobile-app-skeleton.md`).

## Global Constraints

- Spine: no riba copy except negated · trust is a word · red reserved (Shariah stop / tamper) · no `٪`/`%` glyphs in copy · integer SAR · «(محاكاة)» kept · verses verbatim ﴿﴾.
- Repo gate stays exactly `AHD GATE ✅ 1687/0` (`cd tests && node run-all.cjs`) after every commit; never touch demo/, app/, tests/.
- App build stays DEFERRED — this plan produces design + contracts + at most one throwaway proof (Task 4), not the app.
- Prototype file: `application/prototypes/dir-b-sadu.html`, ≤900 lines, no JS, no external URLs; artifact republished to the SAME URL each round.
- Research doc is the pattern source: `docs/research/ui-design-references-2026-07-10.md` §1 (adopt list) + §4 prompt.
- Portability bar (the user's requirement, verbatim intent): nothing in the design may depend on a capability with no RN/Expo equivalent; every screen must respect notch/Dynamic Island + Android status bar + gesture bars (safe areas), font scaling up to 200%, and both platforms' navigation conventions.

---

### Task 1: Design round — research patterns applied (v5)

**Files:**
- Modify: `application/prototypes/dir-b-sadu.html`

**Interfaces:**
- Consumes: research doc §1 patterns + §4 ready prompt.
- Produces: v5 prototype the token extraction (Task 2) reads values from.

- [ ] **Step 1:** Screen ② (riba stop) gains the **micro-step rail** (Nafath/2026-baseline pattern): a 3-step indicator above the terms card — «١ الصياغة → ٢ الفحص → ٣ الختم» with step ٢ active and step ٣ visually locked. CSS: a horizontal 3-dot rail, active dot terracotta, locked dot outlined with a small ⏸ glyph. No spinner anywhere.
- [ ] **Step 2:** Screen ⑥ (proof) becomes an **Absher-style official document card**: give `.sealdoc` a document header row (emblem-mini + «وثيقة عهد» + serial `AHD-0001` mono LTR) and a perforated edge (dashed border-top) between header and body — reads as a filed government record.
- [ ] **Step 3:** Screens ④⑤ get **sentence-form insight lines** (N26 pattern) replacing nothing — one line under the header sub, e.g. ④ «كلّ عهودك القائمة موثّقة ومختومة — لا شيء على الكلام وحده.» ⑤ «لا فوائد تتراكم عليك — المبلغ اليوم هو المبلغ غدًا.» (real content rule; keep integers/spine).
- [ ] **Step 4:** Self-check greps (no `<script`, no `http`, `(محاكاة)`, ﴿﴾, no ٪ in copy) + line count ≤900.
- [ ] **Step 5:** Republish artifact (same path) + refresh `DirBSadu.html` DS copy (marker line, group `Mobile / Directions`) + DesignSync write + commit:

```bash
git add application/prototypes
git commit -m "feat(design): Sadu v5 - micro-step seal rail, Absher-style document card, sentence insights (research study applied)"
```

---

### Task 2: One token source — `tokens.json`

**Files:**
- Create: `application/design/tokens.json`
- Create: `application/design/README.md`

**Interfaces:**
- Consumes: the `:root` block of `dir-b-sadu.html` (v5) — values copied byte-exact.
- Produces: the token names Task 3 maps and the deferred skeleton's `src/theme/tokens.ts` will import (skeleton plan Task 2 to be updated to read this file instead of hardcoding).

- [ ] **Step 1:** Write `tokens.json` — flat, platform-neutral:

```json
{
  "color": {
    "ground": "#efe9dc", "card": "#ffffff", "hairline": "rgba(60,50,30,0.12)",
    "ink": "#1c1812", "ink2": "#6d6353", "ink3": "#9b917e",
    "accent": "#a1442e", "accentSoft": "#f4e2da",
    "ok": "#177f6d", "okSoft": "#e3f0eb", "covenant": "#a8863f",
    "stop": "#7a2410", "stopDeep": "#5e1a0a", "stopSoft": "#f6e3da", "stopLine": "#e0bcab",
    "sealBg": "#221d16", "sealInk": "#ece3d0", "sealLabel": "#b3a789", "sealHash": "#d8b978",
    "authority": "#12312b"
  },
  "radius": { "card": 14, "sheet": 30, "pill": 999 },
  "space": [4, 8, 16, 24, 32, 48],
  "type": {
    "largeTitle": { "size": 34, "weight": 800 },
    "title": { "size": 24, "weight": 800 },
    "body": { "size": 15.5, "weight": 600 },
    "footnote": { "size": 12, "weight": 400 },
    "label": { "size": 11, "weight": 600, "letterSpacing": 2 }
  },
  "motion": {
    "enter": { "duration": 260, "easing": "ease-out" },
    "stagger": 80,
    "loopMuqassa": 10000,
    "reducedMotion": "static-final-state"
  }
}
```
(Verify every hex against the v5 `:root` before writing — the file is the contract, drift is a bug.)

- [ ] **Step 2:** `README.md` (15 lines): tokens.json is the single source; prototype `:root` and future `tokens.ts` must match it; change protocol = edit tokens.json first, then both consumers.
- [ ] **Step 3:** Commit: `git commit -m "feat(design): portable tokens.json - single source for prototype and future Expo app"`.

---

### Task 3: The portability contract — `RN-MAPPING.md`

**Files:**
- Create: `application/design/RN-MAPPING.md`

**Interfaces:**
- Consumes: every CSS technique actually used in v5 (grep the file); Expo skills installed locally (`expo-ui`, `expo-native-ui`, `react-native-architecture`) as reference.
- Produces: the risk table the skeleton build must obey; any 🔴 item must be redesigned BEFORE the skeleton lands.

- [ ] **Step 1:** Build the mapping table — one row per technique. Seed rows (verify + complete against the real file):

| Prototype technique | RN/Expo equivalent | Risk |
|---|---|---|
| repeating-linear-gradient Sadu band | `react-native-svg` `<Pattern>` or pre-rendered SVG strip component | 🟡 build SVG once, reuse |
| conic-gradient fill gauge | `react-native-svg` arc path + Reanimated `useAnimatedProps` on strokeDashoffset | 🟢 standard |
| @property counting numbers | Reanimated `useDerivedValue` + `runOnJS` text update, or `react-native-animated-numbers` | 🟢 |
| CSS keyframe muqassa circle (9→2) | Reanimated staggered opacity + `react-native-svg` line draw (strokeDashoffset) | 🟢 |
| hairline separators (1px rgba) | `StyleSheet.hairlineWidth` + platform hairline color | 🟢 |
| inset-grouped list | plain View card + rows (or `@expo/ui` List on iOS) | 🟢 |
| backdrop blur (if any) | `expo-blur` — Android support partial | 🟡 avoid or degrade to solid |
| `text-wrap:balance` | not in RN — manual line breaks or accept ragged | 🟡 cosmetic only |
| tabular-nums | `fontVariant: ['tabular-nums']` (iOS) / font choice (Android) | 🟡 verify on Samsung |
| status bar / island chrome | REAL device chrome — delete from app; `expo-status-bar` + `SafeAreaView` | 🟢 by construction |
| RTL layout | `I18nManager.forceRTL(true)` + logical props; test BOTH platforms — Android RTL flips differently | 🟡 explicit QA task |
| fonts (Segoe/Noto Naskh) | ship IBM Plex Sans Arabic via `expo-font`; NEVER rely on system Arabic font (Samsung ≠ iPhone rendering) | 🔴 must bundle font |
| prefers-reduced-motion | `AccessibilityInfo.isReduceMotionEnabled()` + Reanimated `ReducedMotion` config | 🟢 |
| shadows | iOS shadow* props vs Android `elevation` — define both in tokens per surface | 🟡 |

- [ ] **Step 2:** Add the **device-fitness checklist** section (the "don't ruin it on launch" bar): safe-area insets on all 4 edges (notch, Dynamic Island, Android punch-hole, gesture bar) · font scaling 100→200% reflow (no truncation of essential text) · 375pt (SE) to 430pt widths · Android hardware/gesture back = iOS swipe-back parity · both light rendering engines (no CSS-only assumptions) · release-build test on one real Samsung + one real iPhone before the demo (operator task, listed as such).
- [ ] **Step 3:** Update `docs/superpowers/plans/2026-07-10-mobile-app-skeleton.md`: Task 2 Step 2 now reads tokens from `application/design/tokens.json`; add a line to Global Constraints: "RN-MAPPING.md is binding; 🔴 items block the build."
- [ ] **Step 4:** Commit: `git commit -m "docs(design): RN portability contract - technique mapping, risk grades, device-fitness checklist"`.

---

### Task 4: Proof-of-port — one screen, throwaway Snack

**Files:**
- Create: `application/design/proof-snack/App.tsx` (single file, self-contained, NOT wired into anything)

**Interfaces:**
- Consumes: tokens.json values (hardcoded copy with a header comment naming the source) + RN-MAPPING equivalents.
- Produces: evidence the riskiest 4 techniques actually work in RN: Sadu band as SVG pattern, conic gauge as SVG arc, counting number, hairline grouped list. ~150 lines.

- [ ] **Step 1:** Write `App.tsx` rendering ONE screen (دفتري) with those 4 techniques using react-native-svg + Reanimated, RTL, SafeAreaView.
- [ ] **Step 2:** Verify: paste into https://snack.expo.dev (operator or agent browser), run on the iOS + Android web simulators, screenshot both into `application/design/proof-snack/`. If any technique fails, downgrade it in RN-MAPPING (🟡→🔴) and note the redesign needed.
- [ ] **Step 3:** Commit: `git commit -m "feat(design): proof-of-port snack - 4 riskiest techniques verified on both simulators"`.

---

### Task 5: Close-out

- [ ] Gate `1687/0` + push + heartbeat + vault sync (Home + plan note) + `_meta/STATUS.md` DONE line.
- [ ] Judge-lens spot check: does the v5 prototype raise UX/memorability toward 9? Any bar <8 → JL item.

## Order & notes

1 → 2 → 3 (fast, same day) → 4 (needs Snack, can slip) → 5. The actual skeleton build stays deferred per your instruction — after this plan, the day you say "build it," the design ports with zero surprises: tokens are one file, every trick has a proven equivalent, and the device-fitness bar is written down.
