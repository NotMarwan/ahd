# Plan · Deepen-07 — القرض المفتوح: the «متى ما تيسّر» journey made visible

**Lane:** open-term qard hasan. **Mode:** additive pure logic + screen surfacing. **Spine:** no due, never
overdue, no countdown; إبراء is the lender's صدقة; integer halalas; conservation exact; reuse golden seal.

## Where it is now
`foldOpenLoan` already tracks paid/forgiven/remaining + status + partial pay + إبراء (full/partial), sealed
with the golden sha256/sealBlock. The screen shows only «المتبقّي» + actions + the sealed doc. The *journey*
(how the loan was eased over time) and the *breakdown* are invisible.

## Deepen (TDD first, `app/open-loan-progress.test.cjs`)
1. **`openLoanProgress(loan)`** → `{principalMinor, paidMinor, forgivenMinor, remainingMinor, paidFrac,
   forgivenFrac, remainingFrac}`. **Conservation exact:** `paid + forgiven + remaining === principal`; the
   three fractions sum to 1 (for a proportional bar — NO % text). Integer halalas.
2. **`openLoanHistory(loan)`** → the chronological «متى ما تيسّر» JOURNEY: `{kind, amountMinor, ar}` for each
   meaningful event (sealed · paid · forgiven-partial · forgiven-all · kept), with dignified on-spine copy.

## Surface (the screen)
3. `screens/open-loan.js`: a **proportional progress bar** (paid teal · صدقة gold · باقٍ muted) using
   `flex-grow` fractions (no % text/score) + a legend in amounts («سُدِّد 5,000 · صدقة 3,000 · باقٍ 12,000 · من
   20,000 ر.س»), and the **journey** as a dotted mini-timeline. Keeps the quiet, no-due, no-countdown heart.

## Guards
- Existing `open-loan.test.cjs` (35) stays green. New logic TDD'd; DOM-smoke grown for the bar + journey + the
  no-% guard.
- Golden seal/canonical reused, untouched; no number/score (the bar is proportional, amounts are money);
  determinism + offline preserved.
- Real-browser: the bar + legend + journey render after pay/إبراء; 0 console errors; Arabic correct; no %.
