# Trust Weave Mobile Implementation Plan

**Design:** `docs/superpowers/specs/2026-07-16-trust-weave-mobile-design.md`
**Active package:** `specs/002-judge-readiness`
**Execution:** three screens per bounded task, red-green-refactor, live screenshot review after each batch.

## T132 — system + reference batch 1

1. Add failing token and screen-contract tests.
2. Replace old mobile tokens and rebuild shared primitives.
3. Implement Home, Open Loan, and Settlement from batch 1 while preserving live actions.
4. Run focused tests, typecheck, lint, and warm web render checks.
5. Capture the three live screens at 394×878 and record controller evidence.

## T133 — reference batch 2

Implement Create/Review, Daftari, and Proof with the stitched document, person filters, payment confirmation, night seal, hash chain, and tamper-only red.

## T134 — reference batch 3

Implement Mine, Maroof, and Jamiya with remaining balance, next action, mercy trail, neutral proof, circle progress, member rail, and consent card.

## T135+ — remaining product routes

Apply the same grammar in three-screen batches, remove visible no-op controls, exercise the real repository/store paths, verify RTL/accessibility/performance, then produce the Android build artifact when the build environment is available.

## Verification contract

- Focused Jest tests must be observed red before implementation and green after.
- `npm run typecheck`, `npm run lint`, and `npm test -- --runInBand` run inside the mobile app.
- Phase end runs `node tests/run-all.cjs` at repository root.
- Native performance is measured on an emulator or CI emulator; web timing is reported separately and never called native performance.
