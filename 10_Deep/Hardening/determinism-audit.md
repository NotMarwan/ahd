# Determinism Audit + Lock — Ahd prototype

**Target:** `project/ahd-demo/index.html` (logic only — zero visual/styling changes)
**Owner:** Claude-Hardening · **Date:** 2026-06-19
**Goal:** the same inputs always produce the same outputs and the same screens — byte-for-byte, on every engine, every run.

**Method (safety net first).** Before touching anything I ran the *current* code in Node and froze every value-bearing output to `test-harness/golden-vectors.json` (`_capture-current.cjs`). Every change below is then proven to reproduce those golden bytes exactly (`run-tests.cjs` §2–§3, §5–§6). So "locked" is not a claim — it is a re-runnable assertion.

---

## Variance sources found and how each was locked

### 1. Locale-dependent number formatting (the silent one) — **FIXED**
`fmt()` was `Math.round(n).toLocaleString("en-US")`.
- **Why it varies:** `toLocaleString` depends on the runtime's ICU build. A full-ICU browser/Node returns `"5,000"`; a **small-ICU Node returns `"5000"`** (grouping silently dropped). Same source → different output across environments.
- **Why it's dangerous here, not cosmetic:** `fmt()` feeds `AG.terms_ar` (the signed terms), which is hashed into `terms_hash` → folded into `canonical()` → the content hash → the block **seal**. A formatting drift would silently change the legal seal. So an ICU difference between two machines could produce two different "tamper-evident" hashes for the *same* agreement.
- **Lock:** hand-rolled, Intl-free grouping — `String(n).replace(/\B(?=(\d{3})+(?!\d))/g,",")`. Byte-identical on every engine.
- **Proof:** `fmt()` matches golden (`5,000`/`1,000`); source-scan asserts **no `toLocaleString`/`Intl` in the logic region**; `terms_hash` unchanged.

### 2. Binary-float money math — **FIXED (integer minor units)**
Money was held in SAR as JS numbers; `installment = amount/months`; `canonical()` used `a.toFixed(2)` and `(a/months).toFixed(2)`; **netting compared float balances with `1e-6` epsilons**.
- **Why it varies/risks:** division + `toFixed` on non-divisible amounts drifts; epsilon comparisons are a smell that can misclassify a balance as "almost zero".
- **Lock:** a single money policy — **1 SAR = 100 halala**, all value-bearing arithmetic on integers.
  - `toMinor()` / `minorToFixed2()` helpers; `AG.amount_minor=500000`, `AG.installment_minor=100000`.
  - `canonical()` now formats principal/installment from integer halalas via `minorToFixed2()` — **byte-identical** to the old `toFixed(2)` output (golden-verified), so the seal is unchanged while the math is now integer-exact.
  - `netting()` runs an **integer-halala core** with exact `===0` comparisons (the `1e-6` epsilons are gone); results convert back to whole SAR.
- **Proof:** `canonical(null)`/`canonical(9000)` bytes unchanged vs golden; "every settlement amount is an integer", "every net balance is an integer"; conservation Σ=900 exact.

### 3. Ordering nondeterminism in the netting — **FIXED**
The greedy netting did `Object.entries(bal)` then `sort((a,b)=>b.v-a.v)` with **no tiebreaker**. On equal balances the output order is engine-dependent (and `Object.entries` order, while insertion-ordered in V8, is not something to lean on across engines/inputs).
- **Lock:** creditor/debtor lists are built in fixed `NODES` order, then sorted with a deterministic tiebreaker **by `NODES` index** — deliberately *not* `localeCompare` (which is itself locale-dependent). Equal balances now always resolve identically everywhere.
- **Proof:** `netting(IOUS)` equals golden settlement, and is **identical across 100 runs** (`run-tests.cjs` §6).

### 4. Stateful-regex hazard (latent) — **GUARDED + PINNED**
A regex with the `/g` flag carries `lastIndex` between `.test()` calls → "passes once, fails the next time" nondeterminism. The riba rules currently have **no `/g` flag**, so `ribaScan` is stateless.
- **Lock:** pinned with a test — `RIBA_RULES.every(r => !r.re.flags.includes("g"))` — and a repeat-call stability test, so a future `/g` slip fails CI instead of the stage.
- **Proof:** `run-tests.cjs` §7 ("no rule uses /g", "stable across repeated calls").

### 5. Clocks & randomness — **CONFIRMED ABSENT**
- **No `Math.random`, no `Date.now`, no `new Date`** anywhere in the logic region (source-scan test asserts this). All timestamps (`AG.timestamp`, consent `signed_at`) are **frozen string literals**.
- **SHA-256** is a from-scratch, synchronous, pure function (no `crypto.subtle`, no async, no secure-context dependency) → identical output for identical input, forever. Verified against **NIST FIPS-180-4 vectors** (`""`, `"abc"`, 448-bit, 896-bit, 1,000,000×`a`) and stable on the Arabic terms.
- **Proof:** `run-tests.cjs` §1, §8.

### 6. Animation-timing → *value* dependency — **NONE (confirmed)**
The witnessed record used to be issued from inside a `setInterval` scan, but the **values** (hashes, seal, schedule, netting) never depended on timing. Proven: a full browser **reload reproduces the identical seal `6C9410B9…`, content hash `F8D11335…`, genesis `F80FCD62…`** (real Chrome, `stability-report.md`). The timing concern was a *robustness* one (orphaned timers) — addressed in `robustness-report.md`.

---

## Deliberately out of scope (presentation, not logic)

- **SVG trust-network geometry** (`pos`/`edgeSVG`/`nodeSVG`) uses `Math.cos/sin/hypot`. Engines may differ by sub-ULP, but every coordinate is emitted through `.toFixed(1)`, which masks any such difference, and this is **rendered presentation, not logic**. Left untouched (changing it would be a visual edit → Claude Design's lane). Not a determinism risk to any computed/legal value.

---

## Bottom line

Every run-to-run variance source in the **value path** (display strings, the hashed terms, the content hash, the block seal, the settlement, the linter verdicts) is now either removed or pinned by a re-runnable test. The locked invariants:

| Invariant | Value | Pinned by |
|---|---|---|
| GENESIS | `f80fcd62…ec85` | run-tests §3 |
| content hash | `f8d11335…ce7c` | §2, §3 |
| block seal | `6c9410b9…fd18` | §3, browser reload |
| tampered seal | `0b4c5d6d…598a` | §4 |
| terms_hash | `94572857…5b84` | §1, §2 |
| net positions | نورة −900 · خالد +600 · فهد +300 | §6 |
| settlement | 9 IOUs → 2 transfers, Σ=900 | §6 |

**62/62** logic assertions green; identical on repeated load. See `test-results.md`.
