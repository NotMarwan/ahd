# Handoff 21 — Claude-TestHarness Exit (2026-06-21T09:30+03:00)

**Role:** test-engineering subagent. GREW the additive app test harness with property-style + robustness tests — **NEW test files only**.

## Completed
Created three new suites under `10_Deep/Hardening/test-harness/app/` (auto-discovered by `run-app-tests.cjs`):

| File | Assertions | What it proves |
|------|-----------:|----------------|
| `properties.test.cjs` | 29 | Property-style invariants over many seeded-LCG inputs: `respread` (Σ preserved, integer/non-negative, length, max−min ≤ 1) over 200 pairs; circle conservation (`circleBalances` Σ=0, organizer credit = Σ member debits, `circleToIous` excludes settled/forgiven/void/disputed) over 120 circles; OPEN→PARTIAL→KEPT driven by **composed share events**; `foldOpenLoan` conservation (paid+forgiven+remaining=principal, remaining≥0, never DEFAULTED, always clamped) over 150 sequences. |
| `determinism.test.cjs` | 28 | require → bust require-cache → require again → a 3rd load: every golden output (seal, canonical_hash, netting JSON+len, balances, circle seals/canonicals, CIRCLE_IOUS, muqassa seals, trust bands/ratios, verify ok+tamper, AG terms_hash, fold statuses) byte-identical across independent loads. Pins `SEALED.seal=6c9410b9…fd18` and `netting(IOUS).length=2`. |
| `app-offline.test.cjs` | 32 | Static offline+determinism scan of every app `.js` (engine, app, features/*, screens/*). Strips comments with a string/template/regex-aware char-walker (verified non-destructive: stripped engine still parses), then asserts NO `fetch(` / `XMLHttpRequest` / `WebSocket` / `Date.now` / `new Date` / `Math.random` / `Intl.` / `.toLocaleString` in live code. Carries its own teeth-tests + proves the comment-strip was load-bearing (removed 7 in-comment mentions). |

## Evidence
- `node app/run-app-tests.cjs` → **APP SUITES: 8/8 green**, exit 0 (APP DOM SMOKE 40 · APP-OFFLINE 32 · CIRCLE-ADV 26 · DAFTARI 44 · DETERMINISM 28 · ENGINE PARITY 37 · OPEN-LOAN 35 · PROPERTIES 29).
- Core demo harness unchanged: `run-tests` **135/0**, `offline-check` **9/0**, `dom-smoke` **40/0**, all exit 0.
- My three suites are themselves deterministic: byte-identical stdout across separate processes.
- Golden `project/ahd-demo/index.html` SHA-256 = `e2f48467…d0d1b8be40` (unchanged).

## Files changed
- NEW: `10_Deep/Hardening/test-harness/app/properties.test.cjs`, `…/determinism.test.cjs`, `…/app-offline.test.cjs`
- NEW: `handoffs/handoff-21.md`; my presence/claim/coordination note.

## Claims released
`Claude-TestHarness_app-tests` removed; presence → exited.

## Concurrency note
A concurrent agent was mid-flight on Circle-advanced: `app/circle-adv.test.cjs` appeared at 09:21:36 requiring a then-missing `features/circle-adv.js` (briefly making the runner 7/8). I did **not** touch their test and did **not** create their feature module — they landed `features/circle-adv.js` at 09:22 themselves and the suite went green. Final state 8/8.

## Next agent should
Nothing required for my deliverables. If the riba-linter negation false-positive (handoff-19) is ever revisited, a `ribaScan` property suite would slot in cleanly as another additive `*.test.cjs`.

## Open issues
None for this task.
