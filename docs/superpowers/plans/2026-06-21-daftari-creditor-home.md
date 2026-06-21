# «دفتري» Creditor Home + «تذكيرٌ بالمعروف» Implementation Plan

> REQUIRED SUB-SKILL: superpowers:test-driven-development.

**Goal:** A creditor-first home that indexes every عهد a viewer is party to — split «لي» (owed to me) / «عليّ» (I owe) — with status, due, deterministic overdue sort, plus the bank-as-neutral-witness gentle reminder («تذكيرٌ بالمعروف») with a finite merciful cadence ladder.

**Architecture:** Pure, DI logic in `project/ahd-app/features/daftari.js` (engine functions passed in; Node-testable). Render in `project/ahd-app/screens/daftari.js` over the app shell. App-level deterministic seed = Naif's real ledger from the journey. Demo (`index.html`) never touched; engine reused via the parity-proven `engine.js`.

**Tech Stack:** Vanilla JS, no deps. Node ≥18 tests.

## Global Constraints
- No edits to `project/ahd-demo/index.html` (tripwire `e2f48467…`). Core harness stays ≥184/0.
- Determinism: overdue computed against a **fixed `AS_OF`**; no `Date.now`/`new Date`/`Intl`/`Math.random`/float money. Day math via pure civil-days algorithm. Amounts via engine `fmt`/`toMinor` (integer halalas).
- Reminders: **bank-as-sender**, original amount only (no surcharge field exists), **no day-counter to the debtor**, every reminder carries the «أحتاج وقت» exit, ladder is finite (Tier1→cooldown→Tier2→STOP→hand back). No shaming, no auto-penalty.
- Reuse engine vocabulary only (`fold`/`statusLabel`/`trustSignal`/`respread`); invent no new states.

---

### Task 1: daftari pure logic (TDD)
**Files:** Create `project/ahd-app/features/daftari.js` · Test `10_Deep/Hardening/test-harness/app/daftari.test.cjs`

**Interfaces — Produces:**
- `daysFromCivil(y,m,d)` / `daysBetween(isoLater, isoEarlier)` → integer days (pure, no Date).
- `rowFor(record, viewer, engine, asOf)` → `{id, counterparty, role, amountSAR, remainingSAR, status, statusKey, nextDueISO, isOverdue, daysOverdue, graced}`.
- `buildLedger(records, viewer, engine, asOf)` → `{owedToMe:[row], iOwe:[row]}` (sorted: overdue desc → due-soon asc → settled last; id tiebreak).
- `summaryTiles(ledger)` → `{me:{amountSAR,count}, on:{amountSAR,count}}` (live debts only).
- `reminderTemplate(tier, ctx)` → fixed warm string; `ctx={creditor, amountSAR, dueLabel}`; no day-counter; carries exit.
- `canSendReminder(row, history, asOf)` → `{allowed, nextTier, reason}` (Tier1 when due; Tier2 after Tier1+cooldown; STOP after Tier2).

record shape: `{id, lender, borrower, amountSAR, installments:[{dueISO, amountSAR}], events:[engine events]}`.

Steps: RED test → verify fail → implement `daftari.js` → verify pass → full harness → commit.

### Task 2: app shell + دفتري screen (fake-DOM smoke)
**Files:** Create `project/ahd-app/index.html`, `app.css`, `app.js` (registry+helpers+AS_OF+Naif seed), `screens/daftari.js` · Test `app/app-dom-smoke.cjs`.
Steps: RED dom-smoke (loads shell+screen under fake DOM, asserts tiles/rows/reminder render, no throw) → build → green → full harness → commit.

## Self-Review
- Covers §4 home (tabs/tiles/rows/sort/empty), §5 copy, §6 edge cases (overdue amber, grace, forgive, dispute pause, cadence cap, Naif-as-debtor), §7 spine (index-only, original amount, no penalty). Screen E (self-disclosure) is `[v2]` + Shariah-gated → deferred to DECISIONS, not built now.
