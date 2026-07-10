# RN Portability Contract

**The prototype is a VISUAL spec, not a layout spec.** RN screens are built with flex + SafeArea, sizes pulled from `tokens.json`, never absolute frame sizes copied from the 375×800 prototype canvas. Every row below exists to keep the visual intent while rebuilding the layout natively — do not port fixed pixel geometry.

## Technique mapping (verbatim from plan, +1 row added from grep)

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
| 9 | dashed borders (perforation, locked step, step-rail dashed circle, doc-head dashed border-bottom) | `borderStyle:'dashed'` — quirky on Android (needs borderRadius>0 on some versions); fallback: dashed SVG line | 🟡 | test on Samsung in Task 5; v5 adds two more dashed uses (`.step.locked i` circle border, `.doc-head` border-bottom) — same fallback applies |
| 10 | `::before/::after` decorations | explicit child Views/SVG (no pseudo-elements in RN) | 🟢 | |
| 11 | `text-wrap: balance` | not in RN — accept ragged or manual `\n` | 🟡 | cosmetic only |
| 12 | tabular-nums | `fontVariant:['tabular-nums']` iOS; Android depends on font — bundled IBM Plex supports it | 🟡 | verify on Samsung |
| 13 | status bar / Dynamic Island / homebar chrome | DELETE — real device provides it; `expo-status-bar` + `react-native-safe-area-context` | 🟢 | by construction |
| 14 | RTL everything | `I18nManager.forceRTL(true)` + start/end props only (never left/right); Android needs `android:supportsRtl` (Expo sets it) | 🟡 | dedicated RTL QA pass on BOTH platforms — flip bugs differ |
| 15 | Arabic font | bundle IBM Plex Sans Arabic (OFL) via `expo-font` from fonts.google.com; NEVER system Arabic font | 🔴→🟢 once bundled | the single biggest Samsung-vs-iPhone rendering difference |
| 16 | prefers-reduced-motion | `AccessibilityInfo.isReduceMotionEnabled()` + Reanimated `ReducedMotion.System` | 🟢 | |
| 17 | shadows | per-platform tokens (`shadow.*` key in `application/design/tokens.json`): iOS `shadow*` props, Android `elevation` | 🟡 | never copy CSS box-shadow strings |
| 18 | fixed 375×800 layout | prototype is a VISUAL spec, not a layout spec — RN screens are flex + SafeArea, sizes from tokens, no absolute frame sizes | 🟢 | write this in bold at the top of the doc |
| 19 | underline on riba term | `textDecorationLine:'underline'` | 🟢 | |
| 20 | backdrop blur (if reintroduced) | `expo-blur` — partial on Android | 🟡 | prefer solid fills |
| 21 | `dominant-baseline` on emblem SVG text | `alignmentBaseline` prop on `react-native-svg` `<Text>` | 🟡 | partial Android support — verify vertical centering on Samsung in Task 5 |
| 22 | emoji icons | @expo/vector-icons or bundled SVG set — emoji render differently per platform | 🟡 | swap at port time, one icon component |

Grep of `application/prototypes/dir-b-sadu.html` (v5) for `gradient`, `@property`, `animation`, `backdrop`, `mask`, `grid`, `sticky`, `::before`, `dashed`, `letter-spacing`, `dominant-baseline`, `filter` found no uses of `mask`, `sticky`, or `filter`, and no new categories beyond rows 1–20 plus the `dominant-baseline` use captured as row 21 above.

## Device-fitness checklist

The "don't ruin it on launch" bar — Task 5 executes it:

- Safe areas all 4 edges: notch/Dynamic Island (iPhone), punch-hole + gesture bar (Samsung), `SafeAreaProvider` everywhere.
- Font scaling 100→200%: essential text reflows, never truncates; `allowFontScaling` stays true; test at max accessibility size.
- Widths 375pt (SE) → 430pt (Pro Max) and a Samsung ~412dp: no overflow, no cramped rails.
- Android hardware/predictive back ≡ iOS swipe-back: every screen exits sanely.
- Press feedback: `android_ripple` on Android, opacity/highlight on iOS (`Pressable` handles both).
- Edge-to-edge: Android status/navigation bar colors set from tokens; icons legible on stone ground.
- Release-build sanity: Expo Go first (Task 5); a real `eas build` device install before any store talk (post-hackathon).

## Performance note

All Reanimated work runs on the UI thread (worklets — default in v3); no `setInterval`-driven animations. Lists use `FlatList` if any screen exceeds ~20 rows (none currently do).
