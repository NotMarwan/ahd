# Test Results — Ahd prototype (all green, reproducible)

**Owner:** Claude-Hardening · **Date:** 2026-06-19 · **Node:** v24.14.1 · **Browser:** headless Chromium (Playwright MCP)

| Suite | Command | Result | Exit |
|---|---|---|---|
| Logic (fixed vectors) | `node run-tests.cjs` | **62 passed, 0 failed** | 0 |
| Offline invariants | `node offline-check.cjs` | **9 passed, 0 failed** | 0 |
| Headless render + robustness | `node dom-smoke.cjs` | **21 passed, 0 failed** | 0 |
| Real Chrome (Playwright MCP) | live flow | **all green, 0 console errors** | — |
| **Total (automated, offline)** | | **92 passed, 0 failed** | |

**Reproducibility:** two consecutive `run-tests.cjs` runs produce **byte-identical** output (`diff` clean). The harness slices the logic live from `index.html`, so these assertions track the shipped code, not a copy.

---

## 1) `node run-tests.cjs` — 62/62

```
1) SHA-256 — NIST FIPS-180-4 test vectors (real hashing, offline)
  ✓ sha256("") = NIST empty
  ✓ sha256("abc") = NIST
  ✓ sha256(448-bit) = NIST
  ✓ sha256(896-bit) = NIST
  ✓ sha256(1,000,000 × 'a') = NIST (multi-block + length-encode)
  ✓ sha256(Arabic terms) stable == golden terms_hash
2) Canonical serialization is byte-identical to the frozen golden
  ✓ canonical(null) bytes unchanged by hardening
  ✓ canonical(9000) bytes unchanged by hardening
  ✓ terms_hash unchanged
3) Seal / hash-chain reproducibility
  ✓ GENESIS hash stable      ✓ content hash stable      ✓ block seal stable
  ✓ sealBlock() reproduces the sealed value
  ✓ recomputeSeal(clean) == sealed
  ✓ recomputeSeal is deterministic across 50 runs
4) Tamper detection (the live verifier's core)
  ✓ verifyRecord(clean) -> ok = true
  ✓ verifyRecord(tampered 5000->9000) -> ok = false
  ✓ tampered seal == golden (0b4c5d6d…)
  ✓ tampered seal differs from sealed value
  ✓ clean recompute equals sealed value
5) fmt — deterministic, locale-free thousands grouping
  ✓ fmt(5000)=5,000  fmt(1000)=1,000  fmt(900)=900  fmt(9000)=9,000  fmt(0)=0  fmt(1234567)=1,234,567
  ✓ matches golden ✓ toMinor(5000)=500000 ✓ minorToFixed2(500000)=5000.00 ✓ minorToFixed2(100000)=1000.00
6) Muqassa — conservation + minimal-transfer bound (real algorithm)
  ✓ balancesOf(IOUS) == golden net positions
  ✓ netting(IOUS) == golden settlement
  ✓ transfer count 2 <= P-1 (4)   ✓ 9 IOUs -> 2 transfers
  ✓ every settlement amount is an integer   ✓ every net balance is an integer
  ✓ every party's net is fully preserved (before - moved == 0)
  ✓ Σ paid == Σ received   ✓ Σ paid == 900
  ✓ netting is identical across 100 runs (order-stable, tie-broken)
  ✓ scenario-2 net positions correct (model check)
7) Riba linter — rule hits / misses + statelessness
  ✓ empty -> clean   ✓ plain repayment clause -> clean
  ✓ demo penalty chip -> block (the must-not-break case)   ✓ penalty chip >= 1 hit
  ✓ interest -> block (r1)  ✓ late penalty -> block (r2)  ✓ percentage -> block (r3)  ✓ commission -> block (r4)
  ✓ no rule uses the /g flag (stateless .test)
  ✓ ribaScan verdict stable across repeated calls (no lastIndex carry-over)
  ✓ [known FP] '...بلا فائدة' over-blocks (negation not handled)
  ✓ [known FP] '...دون أي زيادة' over-blocks (negation not handled)
8) Source-level determinism guards
  ✓ no Math.random   ✓ no Date.now / new Date   ✓ no toLocaleString / Intl   ✓ no network primitives
9) Reload determinism — a fresh evaluation yields identical values
  ✓ seal identical on a fresh load   ✓ netting identical   ✓ sha256 identical

RESULT: 62 passed, 0 failed  (total 62)
```

## 2) `node offline-check.cjs` — 9/9

```
✓ no <script src=…>                       ✓ every <link href> is a data: URI (favicon embedded)
✓ no <img> remote URL                     ✓ no CSS @import        ✓ no CSS url(http…)
✓ no web fonts (system stack only)        ✓ no fetch/XHR/WebSocket/EventSource/Worker/sendBeacon
✓ favicon is an embedded data: SVG        ✓ no http(s) URL other than the W3C SVG namespace
OFFLINE CHECK: 9 passed, 0 failed
```

## 3) `node dom-smoke.cjs` — 21/21

```
✓ page boots without error
✓ R[0..4] all render   ✓ issueRecord/renderDoc/runVerify render   ✓ tamper toggle renders
✓ settleNext × 6 (ذمّة محفوظة) renders   ✓ runMuqassa (conservation proof) renders
✓ go(99) clamps to last screen   ✓ go(-5) clamps to first screen   (neither throws)
✓ double-tap on a confirm is ignored (no second timer)
✓ confirmPerson('ZZ') unknown party is a safe no-op
✓ go() cleared all in-flight timers on navigation
✓ a throwing screen is caught by the offline fallback (no crash)
DOM SMOKE: 21 passed, 0 failed
```

## 4) Real Chrome (Playwright MCP) — live

| Check | Result |
|---|---|
| Console errors / warnings on load and after the full flow | **0 / 0** |
| Network requests | **1** (`GET /` — the page); 0 external |
| Public API (`window.go`, `window.confirmPerson`) | present |
| Dual Nafath confirm → witnessed record | issued |
| Verifier on clean record | **سليمة** (valid) |
| On-screen seal / content / genesis hashes | `6C9410B9…` / `F8D11335…` / `F80FCD62…` (= golden) |
| Tamper 5,000→9,000 | **عبثٌ مكشوف** (caught) |
| Settlement (6 installments) | **ذمّة محفوظة** |
| Muqassa | 2 transfers, **صفر صافٍ**, Σ=900 |
| `go(99)` / `go(-5)` | clamp to last / first screen (no throw) |
| Esc keyboard reset | returns to step 0 |
| Riba linter | clean→sign enabled; +5% penalty→block + sign disabled; clear→re-enabled |
| Horizontal overflow | none |
| **Reload → seal byte-identical** | `6C9410B9…` both times ✓ |

Evidence: `evidence/ahd-hardening-01-verified.png`, `…-02-tamper-caught.png`, `…-03-conservation.png`.
