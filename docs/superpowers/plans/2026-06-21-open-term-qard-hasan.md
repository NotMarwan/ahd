# «القرض المفتوح · متى ما تيسّر» Implementation Plan

> REQUIRED SUB-SKILL: superpowers:test-driven-development.

**Goal:** A first-class **open-term** qard-hasan record type — no schedule, no due date, **never overdue** — settled by partial payments "whenever eased," closed by full settle (KEPT) or by a lender-owned **إبراء/صدقة** (full or partial → FORGIVEN). Reuses the golden seal/verify primitives without touching them.

**Architecture:** New pure module `project/ahd-app/features/open-loan.js` with its OWN `openLoanCanonical` (term=open; schedule=NONE; due=none), sealed via the engine's golden `sha256`/`sealBlock`/`GENESIS` (reused, never modified). A new amount-aware reducer `foldOpenLoan` (the engine's `fold` counts installments, not partial amounts). Screen `screens/open-loan.js`: the quiet «المتبقّي» panel (no red, no countdown), partial pay, and the إبراء sheet.

## Global Constraints
- No edits to `ahd-demo/index.html` or to `engine.js` internals (golden `canonical`/`sealBlock`/`sha256`/`verifyRecord` are CALLED only).
- Determinism: integer halalas; fixed timestamps; no `Date.now`/`Intl`/float money/`Math.random`.
- **Invariant:** an open loan can NEVER be `DEFAULTED`/overdue (no due date). Conservation: `principal == paid + forgiven + remaining` exactly, every state.
- Reuse engine `FORGIVEN`/`KEPT`/`ACTIVE` states; open-specific phrasing is display projection only (like `graced→RESCHEDULED`).

---

### Task 1: open-loan pure logic (TDD)
**Files:** Create `project/ahd-app/features/open-loan.js` · Test `app/open-loan.test.cjs`
**Produces:** `makeOpenLoan(spec)`, `foldOpenLoan(loan)→{statusKey,paidMinor,forgivenMinor,remainingMinor,sealed}`, `openLoanStatusAr`, `openLoanTermsAr`, `openLoanCanonical(loan,engine,overrideMinor?)`, `openLoanSeal`, `verifyOpenLoan(loan,engine,tamperSAR?)`, `payEvent(loan,amountSAR,engine)` (clamped to remaining), `forgiveEvent(loan,amountSAR|null,engine)`.
Steps: RED → implement → GREEN → full harness → commit.

### Task 2: open-loan screen (dom-smoke)
**Files:** Create `screens/open-loan.js` · extend `app/app-dom-smoke.cjs`
Quiet remaining panel (no due/red/countdown) · partial-pay sim · إبراء full/partial sheet · sealed-record + tamper verify. Register as a screen; seed منيرة→ماجد 20,000.
Steps: RED dom-smoke additions → build → GREEN → full harness → commit.

## Self-Review
- Covers §3 (type selector is a create-flow concern → screen shows the open record + lifecycle), §4 states+edges (overpay clamp, partial forgive leaves open remainder, long silence stays ACTIVE), §5 spine (no riba, gharar-rebuttal noted in terms), §6 composition (own canonical, reused seal). v2 (borrower-initiated request, ورثة) deferred.
