---
description: "Dependency-ordered v2 product and protocol work"
---

# Tasks: V2 Product and Protocol

## Phase 1: Setup and Decisions

- [ ] T001 Resolve the decision-ID collision identified in Wave 0 before linking any v2 approval
- [ ] T002 Record owner decisions for Open-Witness license, governance, issuer profile, mobile dependency set, and whether the inheritance proposal proceeds in `docs/DECISIONS-FOR-MARWAN.md`
- [ ] T003 Record vendor gates for accredited TSA, HSM/KMS, identity provider, and mobile build services in `docs/DECISIONS-FOR-MARWAN.md`
- [ ] T004 Keep `OT-PATCH` in a separate migration specification; do not include demo or golden changes in this package

## Phase 2: Foundational Approval and Conformance

- [ ] T005 [P] Implement approval-artifact schema tests in `tests/app/approval-artifact.test.cjs` with missing, rejected, expired, tampered, and condition-mismatch fixtures
- [ ] T006 [P] Write property-localization and version-compatibility failures in `tests/app/open-witness-conformance.test.cjs`
- [ ] T007 [P] Create independent second-issuer fixture contract under `protocol/issuers/reference-2/README.md`
- [ ] T008 Run T005-T007 tests and confirm the intended failures before implementation

## Phase 3: User Story 1 - Complete Open Seal (P1)

**Independent Test**: Independent verifier passes all five valid properties and localizes every tamper.

- [ ] T009 [P] [US1] Add valid and tampered RFC-3161 fixtures under `protocol/fixtures/timestamp/` using a demo provider only; label them non-evidentiary
- [ ] T010 [P] [US1] Add issuer key-rotation, revocation, wrong-key, and signature-tamper fixtures under `protocol/fixtures/issuer/`
- [ ] T011 [P] [US1] Add Merkle path, checkpoint, reorder, omission, and wrong-root fixtures under `protocol/fixtures/merkle/`
- [ ] T012 [US1] Extend `protocol/verify-ahd-seal.cjs` with profile/version dispatch and property-specific results without importing Ahd code
- [ ] T013 [US1] Add external timestamp verification that never enters canonical business logic
- [ ] T014 [US1] Add issuer key lifecycle verification using Node cryptographic primitives and approved public metadata
- [ ] T015 [US1] Make `tests/app/open-witness-conformance.test.cjs` pass for valid, tampered, missing, and unsupported cases
- [ ] T016 [US1] Build a second independent implementation under `protocol/issuers/reference-2/` and exchange three fixtures in each direction
- [ ] T017 [US1] Publish version, license, governance, conformance, security considerations, and compatibility in `docs/specs/open-witness-v1.md`
- [ ] T018 [US1] Keep production TSA and HSM/KMS profiles disabled until provider evidence is recorded

## Phase 4: User Story 2 - Approved Protective Features (P1)

**Independent Test**: Each feature is inert without approval and preserves principal, consent, neutrality, and rollback after approval.

- [ ] T019 [P] [US2] Write failing borrower-requested release tests in `tests/app/borrower-release.test.cjs` covering request-only semantics, lender consent, decline, and conservation
- [ ] T020 [P] [US2] Write failing duress hold tests in `tests/app/duress.test.cjs` covering request, neutral hold, dispute, withdrawal, and no-guilt language
- [ ] T021 [P] [US2] Write failing collusion-signal tests in `tests/app/collusion-signal.test.cjs` covering privacy-safe structural signals, false positives, holds, and no score output
- [ ] T022 [P] [US2] Write failing Circle mode B tests in `tests/app/circle-mode-b.test.cjs` for disabled, pledge-only, custody-approved, rollback, and no bank-fund states
- [ ] T023 [P] [US2] Write failing ID/state migration tests in `tests/app/identity-state.test.cjs` for legacy mappings, uniqueness, vocabulary version, and backward verification
- [ ] T024 [US2] Implement approval parsing and inert defaults in `app/features/approval.js` until T005 passes
- [ ] T025 [US2] Implement borrower release requests in `app/features/borrower-release.js` and contextual rendering in `app/screens/borrower-release.js` only after exact approval
- [ ] T026 [US2] Implement neutral duress holds in `app/features/duress.js` and `app/screens/duress.js` only after exact approval
- [ ] T027 [US2] Implement privacy-safe structural collusion signals in `app/features/collusion-signal.js` without numbers, underwriting, or verdicts only after exact approval
- [ ] T028 [US2] Implement only the approved Circle mode B profile in `app/features/circle-mode-b.js` and `app/screens/circle-mode-b.js`
- [ ] T029 [US2] Implement canonical identifier and state vocabulary migration in `app/features/identity-state.js` with old-record verification
- [ ] T030 [US2] Run all focused feature suites, DOM smoke, privacy tests, engine parity, and full gate

## Phase 5: User Story 3 - Mobile Parity (P2)

**Independent Test**: Core web and mobile journeys match canonical outputs and seals on iOS and Android.

- [ ] T031 [US3] Reconcile `docs/superpowers/plans/2026-07-10-mobile-app-skeleton.md` with the current 21-screen registry and approved dependencies
- [ ] T032 [US3] Complete hash-tracked Figma baseline transfer and record approved screen hashes in `application/design/README.md`
- [ ] T033 [P] [US3] Write failing mobile engine parity and determinism tests in `application/ahd-mobile/tests/engine-parity.test.cjs`
- [ ] T034 [P] [US3] Write failing journey parity fixtures in `application/ahd-mobile/tests/journey-parity.test.cjs` for request, create, verify, ledger, grace, and settlement
- [ ] T035 [US3] Scaffold approved Expo/TypeScript mobile application under `application/ahd-mobile/` without modifying `app/` or `tests/app/`
- [ ] T036 [US3] Implement read-only engine sync from `app/engine.js` to `application/ahd-mobile/src/engine/engine.js` until parity passes
- [ ] T037 [US3] Port design tokens from `application/design/tokens.json` and RTL rules from `application/design/RN-MAPPING.md`
- [ ] T038 [US3] Implement core journeys as pure feature consumers and native screens; make journey parity pass
- [ ] T039 [US3] Run accessibility and offline fallback checks on one iOS and one Android device; store evidence under `application/ahd-mobile/design-evidence/`

## Phase 6: User Story 4 - Standard Governance (P2)

**Independent Test**: Two implementations verify each other's supported fixtures and reject incompatible versions.

- [ ] T040 [P] [US4] Add conformance profile, algorithm registry, version lifecycle, security contact, and errata process to `docs/specs/open-witness-v1.md`
- [ ] T041 [P] [US4] Add approved open-source license files and contributor/governance policy under `protocol/`
- [ ] T042 [US4] Publish conformance fixtures and machine-readable result summaries under `protocol/conformance/`
- [ ] T043 [US4] Run cross-implementation exchange and record all incompatibilities before claiming interoperability

## Final Phase: V2 Gate

- [ ] T044 Run protocol, feature, mobile, parity, privacy, and full repository gates; confirm frozen demo remains pinned
- [ ] T045 Conduct independent security, Shariah-boundary, privacy, and Judge Lens reviews for every visible v2 surface
- [ ] T046 Update `docs/ARCHITECTURE.md`, `docs/PUBLISHABLE-PRODUCT-SPEC.md`, `_meta/OPEN-ITEMS.md`, `_meta/STATUS.md`, and `AmadHackathon/` cockpit with exact approved/built/pending states
- [ ] T047 Obtain named approval before enabling production TSA/HSM, gated product behavior, mobile distribution, or any golden migration

## Dependencies

- T001-T004 block the portfolio.
- T005-T008 establish approval and conformance teeth.
- US1 protocol can proceed with demo profiles; production profiles remain vendor-gated.
- US2 tasks are individually blocked by their exact approval artifacts.
- US3 begins after mobile dependency approval and Figma baseline acceptance.
- US4 depends on US1 conformance assets and owner license decision.
- T044-T047 require every selected story complete or explicitly blocked.
