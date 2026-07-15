---
description: "Dependency index for the three detailed v2 execution plans"
---

# Tasks: V2 Product and Protocol

This file is the cross-track dependency index. Exact TDD steps, code, commands, expected output, and commit
boundaries live in:

- `docs/superpowers/plans/2026-07-14-open-witness-five-property.md`
- `docs/superpowers/plans/2026-07-14-approval-gates-protective-features.md`
- `docs/superpowers/plans/2026-07-14-arabic-mobile-parity.md`

## Phase 0: Human and External Gates

- [ ] T001 Owner approves collision-free canonical decision IDs and historical aliases; no destructive rename
- [ ] T002 Owner records unique decision IDs for borrower release, duress, and collusion review
- [ ] T003 Qualified authorities record exact approvals for netting/Rifq, Circle mode B, release, duress, and collusion
- [ ] T004 Owner/security team approves a pinned RFC-3161/CMS adapter and accredited TSA trust profile
- [ ] T005 Platform owner records non-exportable HSM/KMS issuer-key custody and lifecycle metadata
- [ ] T006 Owner chooses Open-Witness specification/code licenses, governance authority, and security contact
- [ ] T007 Owner accepts the Sadu baseline reconciliation and four supplemental route design states
- [ ] T008 Design owner approves IBM Plex Sans Arabic source, license, and exact weights
- [ ] T009 Mobile owner approves Expo SDK 57 dependencies, build services, and distribution credentials
- [ ] T010 Device owner supplies one iOS 16.4+ iPhone and one Android 7+ Samsung/Android phone

Gates do not block pure schemas, inert adapters, tests, fixture tooling, or route inventory. They block production
activation, publication, visual-parity claims, and external-service claims.

## Track A: Open-Witness Five-Property Protocol

- [ ] T011 [P] Add strict protocol profiles and per-property result assembly
- [ ] T012 Add sequence/envelope continuity enforcement and explicit `--record|--package|--chain` CLI modes
- [ ] T013 [P] Add trusted-time adapter contract and fixture-only fail-closed adapter
- [ ] T014 Integrate the owner/security-approved RFC-3161/CMS adapter after T004
- [ ] T015 [P] Add issuer key and authenticated checkpoint lifecycle registries
- [ ] T016 Persist valid, missing, unsupported, and property-specific tampered conformance fixtures
- [ ] T017 Build clean-room `reference-2` issuer/verifier and exchange three records in each direction
- [ ] T018 Publish governance, security, conformance, registries, and licenses after T006
- [ ] T019 Correct protocol-status drift in Open-Witness, production-path, and open-item documents

Track exit: five mandatory properties are valid for the complete fixture, every property tamper localizes, legacy
fixtures remain valid, two independent implementations pass three-by-three exchange, and production profiles stay
disabled until T004/T005.

## Track B: Approval Gates and Protective Features

- [ ] T020 Add canonical `DEC-*` registry and collision-safe legacy aliases after T001
- [ ] T021 Add deterministic approval validation, lifecycle, condition checks, and inert execution
- [ ] T022 Wrap existing Rifq with conjunctive netting/Rifq approvals; do not modify `rifq.js`
- [ ] T023 Add exact-profile Circle mode B; never permit Ahd pooled custody
- [ ] T024 Add borrower-requested release and lender-bound consent
- [ ] T025 [P] Add neutral duress signal/hold state machine
- [ ] T026 [P] Add privacy-safe structural collusion review/hold state machine
- [ ] T027 Add issuer-scoped canonical identity bindings and versioned state vocabularies
- [ ] T028 Add `K_FLOOR=3` public aggregate suppression and fixed safe output keys
- [ ] T029 Add rollback/backward-reader cases for every capability
- [ ] T030 Wire only capabilities whose real approvals exist; keep contextual screens out of primary navigation

Track exit: 100% of unapproved capabilities are inert; approved test profiles preserve exact principal and consent;
no neutral safeguard judges or scores; old records/states/proofs remain readable; no production capability is
enabled by a fixture artifact.

## Track C: Arabic Mobile Parity

- [ ] T031 Add non-writing Sadu check mode and reconcile the dirty output only after T007
- [ ] T032 Create a clean Expo SDK 57 Router product; retain SDK 56 `proof-go` as historical evidence
- [ ] T033 Register exactly 21 keys with four tabs and 17 stack routes
- [ ] T034 Generate/hash the engine, required features, and design tokens into the mobile tree
- [ ] T035 Prove source bytes, golden seal, 9-to-2 netting, respread, riba negation, and Metro/Hermes bundling
- [ ] T036 Add versioned Expo SQLite state and noncanonical `needs_connection` outbox intents
- [ ] T037 Configure static RTL, approved fonts, tokens, safe areas, vector icons, and reduced motion after T008
- [ ] T038 Implement exact request, create, proof, ledger, grace, and settlement journey fixtures
- [ ] T039 Port the 17 approved Sadu screens and keep four truthful baseline-pending routes until T007 completes
- [ ] T040 Pass 21-route reachability, 200% text, screen-reader, target-size, contrast, and reduced-motion tests
- [ ] T041 Build development clients and complete the physical iPhone/Samsung device matrix after T009/T010

Track exit: six core journeys match web canonical/seal/money/state results; all 21 routes are reachable; external
offline actions never fake success; both native exports and both physical-device accessibility/offline matrices pass.

## Final V2 Gate

- [ ] T042 Run every focused protocol/product/mobile suite
- [ ] T043 Run `node tests/app/run-app-tests.cjs` and record the live suite result
- [ ] T044 Run `cd tests; node run-all.cjs`; require zero failures and intact demo tripwire
- [ ] T045 Run independent security, privacy, Shariah-boundary, and Judge Lens reviews
- [ ] T046 Update architecture, product spec, status, open items, and Obsidian cockpit with exact evidence labels
- [ ] T047 Obtain explicit owner release approval before production TSA/HSM, capability activation, standard publication, or mobile distribution

## Dependencies

- T011-T013, T015-T016, T020-T021, T027-T029, T031, T033-T036, and automated route tests may proceed without
  external approval because they are additive, inert, fixture-only, or read-only.
- T014 depends on T004. Production issuer activation depends on T005.
- T018 depends on T006.
- T022-T026 production activation depends on the exact subset of T001-T003 relevant to that capability.
- T032/T037/T041 depend on T007-T010 as stated; no dependency is replaced with Expo Go or synthetic evidence.
- T030 depends on real approval artifacts and never registers an unapproved action.
- T042-T047 depend on every selected track being complete or visibly blocked with owner and required evidence.
- `OT-PATCH` is outside this package. No task changes golden canonicalization or repins a vector.
