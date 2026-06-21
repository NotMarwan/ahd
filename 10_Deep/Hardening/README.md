# 10_Deep / Hardening — Ahd prototype reliability pass

**Owner:** Claude-Hardening · **Scope:** determinism + robustness + structure + tests for `project/ahd-demo/index.html` (logic only — **no visual/styling changes**).

## Read in this order
1. **`stability-report.md`** — the headline evidence + the exact presenter click-path.
2. **`determinism-audit.md`** — every run-to-run variance source found and how it was locked.
3. **`robustness-report.md`** — failure modes, guards, and the offline proof.
4. **`function-contracts.md`** — pure-vs-render split, the state machine, function contracts.
5. **`test-results.md`** — all suites, all green, reproducible.
6. **`test-harness/`** — the runnable Node suites + the Playwright real-browser smoke (`test-harness/README.md`).
7. **`evidence/`** — real-Chrome screenshots (verified record · tamper caught · conservation proof).

## One-line proof
```bash
cd test-harness && node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs
# 62 + 9 + 21 = 92 assertions, 0 failures, byte-identical every run
```

## Cross-references (other lanes)
The Full Review in `10_Deep/Review/` flagged prototype gaps including **"no FSM"** and **"keyword-only linter."** This pass **closes the FSM gap** (single state machine `S` + `go()`; see `function-contracts.md`) and **documents the keyword-linter limitation** with a ready negation-guard patch (`robustness-report.md`) — applied off-stage to avoid demo-day risk. The integer-halala money policy here is consistent with the backend reference (`10_Deep/Backend/ref/` uses `amount_halalas`).

## Guarantee
Every hash, balance, and verdict the audience sees is **byte-identical** to the pre-hardening build (golden-pinned) — appearance untouched — while the code underneath is now deterministic, offline-proof, null-guarded, and provably stable.
