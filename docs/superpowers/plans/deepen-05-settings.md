# Plan · Deepen-05 — الإعدادات beyond the digit toggle (the 5th new feature)

**Lane:** settings. **Mode:** additive pure logic + a single-point display gate. **Spine:** display-only, never
touches the engine/seal; no number/score; the manifesto stays sharp; integer halalas untouched.

## Where it is now
Just the Arabic-Indic digit toggle (D-2) + the «ما لا نفعله» manifesto + the basis verses.

## Deepen (TDD first, `app/settings-deepen.test.cjs`)
1. **`maskAmount(s, hide)`** — a pure, deterministic, display-only privacy mask: returns «•••» (no digit leaks)
   when hidden, else the string unchanged. Lives in `settings.js` so it is unit-testable.
2. **`SPINE_YES`** — the positive counterpart to `SPINE_NO`: what عهد DOES (the four verbs — نكتب/نشهد، نحفظ،
   نُسوّي، نُذكّر، نُيسّر). No numbers; must never claim lending/judging/scoring/interest.

## Weave + wire
3. `App.fmtN` gains a single privacy gate (format → digit-map → mask) so «إخفاء المبالغ» applies **app-wide**
   from one point. `app.js` gains `privacy` state + `setPrivacy`.
4. **Byte-safety (the spine guard):** `proof.js`/seals compute from the engine canonical, never from `fmtN`,
   so a record's seal is identical whether privacy is on or off — asserted in the test + DOM-smoke.
5. Screen: a privacy toggle (إظهار / إخفاء •••), the «ما يفعله عهد» section, and a **model note** (the
   two-contract separation: qard hasan with no زيادة between the parties + a flat service fee to the bank,
   no percentage, no increase on delay) — the Shariah point a bank judge looks for.

## Guards
- Existing `settings.test.cjs` (13) stays green. New logic TDD'd; DOM-smoke grown for privacy + byte-safety.
- Golden `fmt()` + the digit toggle untouched; determinism + offline preserved; no number/score.
- Real-browser: privacy hides amounts on دفتري/home and restores; seal byte-stable; 0 console errors.
