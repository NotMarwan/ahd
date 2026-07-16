# Ahd Mobile Pilot MVP Implementation Plan

**Design:** `docs/superpowers/specs/2026-07-16-mobile-pilot-mvp-design.md`
**Active package:** `specs/002-judge-readiness`
**Branch:** `codex/mobile-pilot-mvp`

## Global constraints

- One controller-authorized writer; reviewers are read-only.
- Red-green-refactor for every behavior change.
- Focused tests after each slice; the full repository gate runs once at the end.
- `demo/index.html`, golden logic, vectors, and float-free money remain untouched.
- No client runtime import from prototypes, design proof, pitch, handoff, or root `app/`.
- No external server, analytics, tracking, cloud sync, or sensitive identity collection.
- External actions stay `needs_connection` and never change balances.
- Three live screenshots are captured after every UI batch, then work continues.

## T133 — Pilot foundation

1. Preserve the baseline failure proving generated `daftari.js` drift, then run the existing sync
   generator and make parity green.
2. Add a boundary contract and package command that fail on forbidden runtime imports.
3. Add versioned `profile`, `journey`, `daily`, `jamiya`, and `settings` slices.
4. Add in-memory and Expo SQLite repositories with serialized writes, deterministic export, and
   atomic delete-all semantics.
5. Add a hydration gate that mounts no product route before storage is ready and shows local recovery
   on corruption.
6. Remove the demo guide, demo script, and demo-fill entry points from the client.
7. Add `/welcome`, persist acceptance, and route first launch to it.
8. Set Android package `sa.ahd.mobile` and white launch surfaces.

## T134 — Core journey and UI batches 1–3

1. Batch 1: welcome, Home, Create Ahd. Remove prefilled names and demo-fill; provide clear empty-state
   actions.
2. Batch 2: seal review, Daftari, record detail. Persist created records and route by real record ID.
3. Batch 3: open Ahd, settlement, proof. Use actual stored record data; consent gates settlement.
4. Add `ShareEnvelopeV1` export/share/import and local tamper verification.
5. Capture and attach three screenshots after each batch.

## T135 — Customer flows and UI batches 4–6

1. Batch 4: Mine, Maroof, timeline from local events.
2. Batch 5: Jamiya, Circle, Circle+ from the `jamiya` slice with unanimous consent.
3. Batch 6: Request, Standing, Dispute with no no-op buttons or false completion claims.
4. Keep external delivery actions at `needs_connection`.

## T136 — Supporting flows and UI batches 7–9

1. Batch 7: Impact, Bounds, Refusal with honest measured/modelled labels.
2. Batch 8: Org, Plans, Settings with local export/delete controls.
3. Batch 9: Shariah, More, Daily with locally persisted qaids.
4. Remove remaining seeded runtime reads from client screens.

## T137 — Android release preview

1. Add `eas.json`, GitHub Actions, emulator journey, performance collection, and `logcat` checks.
2. Build `artifacts/ahd-pilot-v1.apk` and `artifacts/ahd-pilot-v1.apk.sha256`.
3. Run final mobile checks, `expo-doctor`, Android export, and one repository gate.
4. Run independent whole-branch review and close every Critical or Important finding.
5. Commit and push only `codex/mobile-pilot-mvp`; do not merge, tag, or publish to a store.

## Verification commands

```powershell
Set-Location application\ahd-mobile
npm.cmd run check:core
npm.cmd run check:boundaries
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npx.cmd expo-doctor@latest
npx.cmd expo export --platform android

Set-Location ..\..\tests
node run-all.cjs
```
