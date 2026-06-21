# Engine Extraction + App Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:test-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Stand up a parallel, publishable app surface at `project/ahd-app/` that reuses a *faithful, parity-tested copy* of the demo's pure engine — without ever editing `project/ahd-demo/index.html`.

**Architecture:** A build tool slices the exact `AHD-LOGIC:BEGIN/END` bytes from the demo and wraps them with a dual (CommonJS + browser-global) export footer into `project/ahd-app/engine.js`. A parity test proves engine.js is byte-faithful to the demo slice AND reproduces the golden outputs (seal, netting, circle seal). New feature modules and screens import this engine; the demo stays untouched.

**Tech Stack:** Vanilla JS (no deps), Node ≥18 for tests (matches existing harness), the existing `load-logic.cjs` slicer.

## Global Constraints
- **NEVER** edit `project/ahd-demo/index.html` (tripwire SHA-256 `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`).
- **NEVER** modify golden-pinned function internals; call them only.
- Existing harness `run-tests.cjs`/`offline-check.cjs`/`dom-smoke.cjs` must stay ≥184/0. New tests are added, never substituted.
- Determinism: no float money / Math.random / Date.now / new Date / Intl in new logic; integer halalas; pure logic free of DOM.
- All new files; nothing auto-merges into `main`.

---

### Task 1: Faithful engine extraction + parity gate

**Files:**
- Create: `project/ahd-app/build-engine.cjs` (generator)
- Create: `project/ahd-app/engine.js` (generated artifact, committed)
- Test: `10_Deep/Hardening/test-harness/app/engine-parity.cjs`

**Interfaces:**
- Produces: `require('project/ahd-app/engine.js')` → the full `__AHD` API object (sha256, canonical, sealBlock, verifyRecord, fold, netting, makeCircle, foldCircle, circleSeal, fmt, respread, …) usable in Node and, via `window.AHD`, in the browser.

- [ ] **Step 1 (RED):** Write `app/engine-parity.cjs` asserting engine.js (a) loads, (b) reproduces demo golden outputs (`SEALED.seal`, `netting(IOUS)`, `circleSeal(DEMO_CIRCLE)`, `verifyRecord` ok/tamper), and (c) literally contains the exact demo `AHD-LOGIC` slice (byte-faithful).
- [ ] **Step 2 (verify RED):** `node app/engine-parity.cjs` → FAIL ("engine.js not generated yet").
- [ ] **Step 3 (GREEN):** Write `build-engine.cjs` (slices via load-logic, wraps with dual export footer), run it to emit `engine.js`.
- [ ] **Step 4 (verify GREEN):** `node app/engine-parity.cjs` → PASS.
- [ ] **Step 5 (full gate):** `node run-tests.cjs && node offline-check.cjs && node dom-smoke.cjs && node app/engine-parity.cjs` → all green, demo tripwire unchanged.
- [ ] **Step 6:** Commit on `overnight/deepening`.

## Self-Review
- Spec coverage: reuses engine (✓ via faithful copy), demo untouched (✓ generator reads, never writes the demo), harness grows (✓ new parity test added). 
- No placeholders. Types consistent (engine API == `__AHD` export list from load-logic FOOTER).
