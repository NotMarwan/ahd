# 🌙 OVERNIGHT-LOG — Ahd autonomous deepening

> Running log of the overnight session. Newest batch at the **top of the log section**.
> Maintained continuously. Harness numbers pasted are **real command output**, not claims.

---

## ⭐ READ ME FIRST (morning summary)

**Status as of last update:** 🟢 Demo safe · harness green (**core 184/0 + app 283/0 = 467 assertions**) · work isolated on `overnight/deepening`.

**Most valuable thing produced so far:** all **three missing consumer features** now built, tested, and on-spine — **«دفتري»** (creditor home + bank-sent gentle reminder), **«القرض المفتوح»** (open-term qard hasan + إبراء), and **Advanced Circle** (بالأصناف split · recurring auto-post · graduation قَيْد→عهد which composes into القرض المفتوح · a mode-B pledge *sketch* flagged for Shariah review). All in a parallel publishable app (`project/ahd-app/`) on a faithful, parity-tested copy of the demo engine — the demo itself is byte-for-byte untouched.

- **Your demo is untouched.** `project/ahd-demo/index.html` is byte-for-byte identical to when you went to sleep (tripwire SHA-256 `e2f48467…d1b8be40`, re-checked every batch). All night's work is **additive, in new files**, on a separate git branch.
- **Two new things you should know about (transparency, not blockers):**
  1. **Git was initialized.** The project had no git. To give you the "review-and-merge-later branch" the brief asked for, I ran `git init` (non-destructive, reversible via `rm -rf .git`). Branch **`main`** = your exact baseline (demo + harness + ledger, 184/0 green). Branch **`overnight/deepening`** = all my work. Review with `git diff main..overnight/deepening`. Nothing auto-merges into `main`.
  2. **New parallel app at `project/ahd-app/`.** Because there is no way to add screens to `index.html` without changing its bytes (which would break the demo's tripwire + risk the golden path), the *only* way to honor "demo exactly intact" is to build in new files. So the publishable surface grows in `project/ahd-app/`, reusing a **faithful, parity-tested copy** of the demo's engine. The demo stays the safe presenter build.
- **Most valuable thing produced so far:** _(updated per batch — see latest log entry)_
- **Needs your decision:** see `DECISIONS-FOR-MARWAN.md` _(0 blocking items at session start)_.

---

## Protected-core invariants (self-checked every batch)
- `project/ahd-demo/index.html` SHA-256 == `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40` (tripwire).
- Harness `node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs` ≥ **184/0**, all exit 0.
- Golden-pinned functions never modified internally (sha256, canonical, sealBlock, recomputeSeal, verifyRecord, netting core, fmt, respread, netting tiebreak).
- Determinism: no float money / Math.random / Date.now / new Date / Intl in new logic; integer halalas; pure logic separated from DOM.

---

## LOG (newest first)

### Batch 3 · Advanced Circle + Lane B test-deepening — ✅ DONE
**Built (TDD, all new files):** `features/circle-adv.js` (logic), `screens/circle-adv.js`; wired into shell.
- **بالأصناف** (by-item split): each item split via `respread` among only its assignees → Σ conserved exactly (no phantom halala/riba).
- **Recurring auto-post**: deterministic posts over given cycle keys (no `Date`); payer excluded from owing; conserved.
- **Graduation قَيْد→عهد**: a circle debt that gets serious **graduates into القرض المفتوح** (open-term witnessed عهد), sealed with the golden primitives, **provenance** linked back to the circle. Beautiful cross-feature composition.
- **Mode-B «نجمع للهدف»**: built only a **pledge sketch** (no pooled deposit held by the bank) with a visible Shariah-review guard → routed to `DECISIONS-FOR-MARWAN.md` (D-3). NOT finalized.
- **Lane B (parallel subagent):** +3 harness suites — property-style (respread/circle/open-loan invariants), reload-determinism, and a static offline/determinism scan of all app source. Confirmed my new files are offline+deterministic-clean.
- **Harness (fresh):** core `184/0`; app **8/8 suites = 283/0** (dom-smoke 49 · offline 35 · circle-adv 26 · daftari 44 · determinism 28 · parity 37 · open-loan 35 · properties 29). Demo tripwire OK. Commits `5984cac` (Lane B), `<this>` (Batch 3).

### Batch 2 · «القرض المفتوح · متى ما تيسّر» (open-term qard hasan) — ✅ DONE
**Built (TDD, all new files):** `features/open-loan.js` (logic), `screens/open-loan.js`; wired into shell.
- A first-class **open-term** type: no schedule, no due, **never overdue** (the heart). Own `openLoanCanonical` (term=open/schedule=NONE/due=none) sealed with the **golden** `sha256`/`sealBlock` (reused, not modified) — seal `b080f79e…`.
- Amount-aware `foldOpenLoan`: partial payments (clamped, no overpay), lender-owned **إبراء** full/partial → FORGIVEN. **Conservation exact** (`principal == paid+forgiven+remaining`) in every state, integer halalas.
- Quiet «المتبقّي» panel (no red, no countdown) + إبراء sheet + sealed-record tamper verify.
- **Harness (fresh):** core `184/0`; app `parity 37 + daftari 44 + open-loan 35 + dom-smoke 40 = 156/0`. Demo tripwire OK. Commit `ee885a9`.

### Batch 1 · «دفتري» creditor home + «تذكيرٌ بالمعروف» — ✅ DONE
**Built (TDD, all new files):** `project/ahd-app/features/daftari.js` (pure logic), `screens/daftari.js`, `app.js`, `app.css`, `index.html`.
- Ledger split لي/عليّ over a deterministic seed of Naif's real debts (café 2,500 overdue · سلطان 1,200 overdue · عبدالله 600 · ريم محفوظة · ماجد خلاف · owes فهد 3,000).
- Overdue computed against fixed AS_OF via a **pure civil-days algorithm** (no `Date`). Deterministic sort: most-overdue → due-soon → settled.
- «تذكيرٌ بالمعروف»: bank-as-sender templates (Tier 1/2), **no day-counter to the debtor**, both debtor buttons (سداد / مهلة), finite merciful cadence ladder (Tier1 → cooldown → Tier2 → STOP → hand back). Grace/forgive/settle route through the engine's existing fold states.
- Amber-not-red overdue chip reuses `TRUST_BAND_AR.overdue` (no new vocabulary).
- **Harness (fresh):** core `135 + 9 + 40 = 184/0`; app `parity 37 + daftari 44 + dom-smoke 27 = 108/0`. Demo tripwire `e2f48467…` OK. Commits `b73ceb7`, `0c36c6e`.
- Deferred to DECISIONS: Screen E «سجلّ وفائي» self-disclosure (`[v2]`, needs Shariah/privacy sign-off).

### Batch 0 · Orientation + isolation + baseline — ✅ DONE
**Planned:** read state, establish isolation (no git existed), confirm baseline green, scaffold the parallel app + extract a parity-tested engine copy.
- ✅ Read state: open-threads, STATUS boards, Circle build-log, harness README, full engine logic region (`index.html` 167–692).
- ✅ Baseline harness BEFORE any change: **135 + 9 + 40 = 184 passed, 0 failed** (exit 0/0/0). Pasted output retained.
- ✅ Demo backed up to `_overnight/backup/index.html.golden`; tripwire hash recorded.
- ✅ Git initialized; `main` baseline committed (382 files); working on `overnight/deepening`.
- ⏳ Next: scaffold `project/ahd-app/`, extract engine (parity test first — TDD), re-run harness, commit.

_Backlog (from brief §4, priority order):_
1. **«دفتري»** creditor home + «تذكيرٌ بالمعروف» nudge (Agent-3) — high value, missing.
2. **«القرض المفتوح — متى ما تيسّر»** open-term qard hasan + إبراء/صدقة (Agent-2).
3. **Advanced Circle**: recurring auto-post, graduation-to-عهد, بالأصناف split (Agent-4/1 v2). _(mode-B pooled deposit → `DECISIONS-FOR-MARWAN.md`, Shariah review.)_
4. **Lane B:** deepen tests (property-style respread/fold, new-screen dom-smoke, determinism re-audit).
5. **Lane C/D/E:** evidence arsenal, architecture/README/deck docs, additive hardening.
