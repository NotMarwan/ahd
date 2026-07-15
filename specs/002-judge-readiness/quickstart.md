# Quickstart: Judge Readiness

## Start app

```powershell
node app/_serve-app.cjs
```

Open `http://localhost:8124` on the presentation machine.

## Contract and product checks

```powershell
node tests/stage-path-contract.cjs
node tests/app/app-dom-smoke.cjs
Set-Location tests
node run-all.cjs
```

## Rehearsal

1. Close unrelated windows and start from a fresh app load.
2. Record primary run duration and every click.
3. Repeat three times.
4. Inject app, terminal, projector, and time-cut failures.
5. Ask blind reviewers for immediate scores and one-hour unaided recall.
6. Record results in `docs/pitch/rehearsal-2026-07-15.md`.

Expected: three 165-180 second clean runs; every recovery under 30 seconds; stage bundle offline.

