# 🌙 OVERNIGHT-LOG — Ahd autonomous deepening

> Running log of the overnight session. Newest batch at the **top of the log section**.
> Maintained continuously. Harness numbers pasted are **real command output**, not claims.

---

## ⭐ READ ME FIRST (morning summary)

**Status as of last update:** 🟢 Demo safe · harness green · work isolated on a branch.

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

### Batch 0 · Orientation + isolation + baseline — IN PROGRESS
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
