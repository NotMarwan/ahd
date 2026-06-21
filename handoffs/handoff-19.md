# Handoff 19 — Operation Ahd · PERFORMANCE HARDENING (prototype reliability pass)

**Date:** 2026-06-19 (~13:51 +03:00)
**My role this session:** **Claude-Hardening** — staff-engineer reliability pass (PROMPT 4)
**Project:** `C:\Users\PCD\Desktop\هاكاثون امد\`
**My namespace (exclusive):** `10_Deep/Hardening/**` + logic of `project/ahd-demo/index.html`
**Continues:** the prototype built by Claude-Orchestrator (handoff/coord notes) and verified by Claude-A.

---

## 1. TL;DR

Took the Ahd demo prototype from "works + verified" to **provably deterministic, robust, and stage-stable** — with **zero visual/styling changes**. Every reliability claim is now backed by a re-runnable test: **92 automated assertions, 0 failures**, byte-identical run-to-run, plus a clean real-Chrome pass (0 console errors, fully offline, seal identical across reload).

Crucially: **every hash, balance, and verdict the audience sees is byte-identical to the pre-hardening build** (golden-pinned). I changed the engine, not the paint.

## 2. What I changed in `project/ahd-demo/index.html` (logic/robustness ONLY)

- **Determinism locked:** `fmt()` no longer uses `toLocaleString` (ICU-dependent → could silently change the hashed terms); money moved to **integer halalas** (no float); netting runs an **integer core with a deterministic tiebreak**; riba regexes confirmed stateless (no `/g`); no `Math.random`/`Date.now`/`Intl` in the logic region.
- **Robustness:** one **state machine `S`** owns all timers; `go()` **cancels every timer before each transition** (kills the orphaned-`setInterval`-writes-to-detached-DOM bug); **double-tap guard** on Nafath confirm; record issues **exactly once**; **all** DOM access null-guarded; **offline fallback** screen on any thrown render; **Esc/Home** keyboard reset; navigation **clamped** so you can't reach an unbuilt screen.
- **Structure:** pure DOM-free logic region (between `// ===AHD-LOGIC:BEGIN/END===` markers) vs render region; named pure `sealBlock`/`verifyRecord`; riba engine relocated into the pure region; only `window.go`/`window.confirmPerson` exposed (no global leakage).

## 3. Test harness (`10_Deep/Hardening/test-harness/`)

Run: `node run-tests.cjs` (62) · `node offline-check.cjs` (9) · `node dom-smoke.cjs` (21). All exit 0, byte-identical across runs. `browser-smoke.mjs` is the Playwright real-browser script (needs `npx playwright install`); I ran the equivalent live via the Playwright MCP.
The harness **slices the real shipped logic** from `index.html` (no copy) so tests can never drift, and asserts against frozen `golden-vectors.json`.

## 4. Deliverables (`10_Deep/Hardening/`)

`README.md` · `determinism-audit.md` · `robustness-report.md` · `function-contracts.md` · `test-results.md` · `stability-report.md` (incl. the **exact presenter click-path**) · `test-harness/` · `evidence/` (3 real-Chrome screenshots). DONE line appended to `10_Deep/STATUS.md`.

## 5. Coordination

- Took `project/ahd-demo/index.html` from **Claude-Orchestrator** cleanly: it was **stale** (hb 10:05+03:00, >3h) and its claim had **expired** (12:01+03:00); its build task was marked COMPLETE. Removed the dead claim, logged the takeover in `coordination_notes.md`. I touched **logic only** — its markup/styling is untouched.
- Did **not** touch `08_Ahd_Deep/**` (Claude-A) or `10_Deep/Backend/**` (the JCS backend ref by another lane). Note: the Backend ref uses `amount_halalas` integer minor units — **consistent** with my money policy (different serialization scheme by design; I did not reconcile the two — they are separate artifacts).

## 6. Open / for next agent

- **Known FP (product/Design, not applied on demo day):** the riba linter over-blocks clean phrases under negation (`بلا فائدة`, `دون زيادة`). Pinned as `[known FP]` tests; recommended negation-guard patch is in `robustness-report.md`. Apply off-stage with the existing vectors as the regression net.
- An existing static server is running on `:8123` (not mine — I reused it for the browser pass).
- If `index.html` logic changes again, re-run the harness; the golden vectors will catch any unintended hash/netting drift.
