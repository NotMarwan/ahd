# Ahd — Stability Test Harness

Proves every computational claim in `project/ahd-demo/index.html` is **correct** and **identical every run**. Offline, deterministic, re-runnable.

## Run everything (zero dependencies — needs only Node ≥ 18)

```bash
# --- demo core (project/ahd-demo/index.html) ---
node run-tests.cjs      # 135 logic assertions (SHA-256 NIST, seal, tamper, Muqassa, riba, Circle)
node offline-check.cjs  #   9 offline invariants (no network in the demo path)
node dom-smoke.cjs      #  40 headless render + robustness checks (incl. Circle G1–G4)
# core total: 135 + 9 + 40 = 184, all exit 0

# --- parallel app (project/ahd-app/) — ADDITIVE; the demo above is never touched ---
node app/run-app-tests.cjs   # auto-discovers the 9 app/ suites (~332 assertions):
                             # engine-parity · daftari · open-loan · circle-adv · create
                             # · properties · determinism · app-offline · app-dom-smoke
```

> The `app/` suites cover the new publishable surface (`project/ahd-app/`). `engine-parity.cjs`
> proves `ahd-app/engine.js` is a byte-faithful copy of the demo's pure logic, so the app can
> reuse the engine without ever editing the demo.

Each exits `0` on all-green, `1` on any failure (CI-friendly).

## Real-browser smoke (optional, needs Playwright once)

```bash
npm i -D playwright && npx playwright install chromium
node browser-smoke.mjs  # real Chromium: 0 console errors, offline, determinism, tamper, settle, Muqassa
```
Exits `2` if Playwright isn't installed (with the install hint). The same checks were run live via the Playwright MCP — see `../stability-report.md`.

## What's here

| File | Purpose |
|---|---|
| `load-logic.cjs` | Slices the **real** pure-logic region from `index.html` (between the `AHD-LOGIC:BEGIN/END` markers) and runs it in an isolated `vm` context. **No copy of the logic** — tests the exact shipped bytes, so they can never drift. |
| `run-tests.cjs` | The headless assertion suite (fixed vectors). |
| `offline-check.cjs` | Static proof of zero network seams in the demo path. |
| `dom-smoke.cjs` | Runs the whole `<script>` under a minimal fake DOM; drives the full flow + robustness paths; asserts nothing throws. |
| `browser-smoke.mjs` | Real-Chromium flow (Playwright). |
| `golden-vectors.json` | The frozen pre-hardening outputs (hashes, canonical bytes, balances, settlement). The refactor is proven to reproduce these byte-for-byte. |
| `_capture-current.cjs` | One-off generator for `golden-vectors.json` (kept for reproducibility). |

## How drift is made impossible

The harness extracts the logic live from `index.html` on every run. If anyone edits a hash input, the netting, or a riba rule and the output changes, `run-tests.cjs` fails against the golden vectors. "It works the same every time" is therefore a **test**, not a hope.
