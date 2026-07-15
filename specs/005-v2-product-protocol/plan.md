# Implementation Plan: V2 Product and Protocol

**Spec Kit Feature**: `005-v2-product-protocol` | **Checkout Branch**: `judge-lens-real-leap` | **Date**: 2026-07-14 | **Spec**: [spec.md](spec.md)

## Summary

Deliver Wave 4 through three independently testable packages plus one shared decision/compatibility foundation:
an additive five-property Open-Witness verifier and conformance exchange; deterministic approval gates around
approved protective mechanisms and identity/state adapters; and an Expo SDK 57 Arabic mobile twin with
byte-faithful web-core reuse. External approvals and vendor credentials remain named gates. The frozen demo,
golden functions, golden vectors, and `app/engine.js` slice are never modified by this package.

## Technical Context

**Language/Version**: Node.js >=22.13 CommonJS for protocol/tests; browser ES5-compatible JavaScript for `app/`;
TypeScript 6.x, React 19.2.3, React Native 0.86, and Expo SDK 57 for mobile
**Primary Dependencies**: Node `fs`/`crypto` for the independent verifier; owner/security-approved pinned
RFC-3161/CMS adapter for trusted time; Expo Router, Localization, Font, SQLite, Splash Screen, Status Bar,
Dev Client, Safe Area Context, SVG, and Reanimated installed through `expo install`; Jest Expo and React Native
Testing Library for native tests
**Storage**: Immutable JSON proof/conformance fixtures; versioned approval/identity registries; Expo SQLite for
mobile records, UI state, and noncanonical outbox intents
**Testing**: Existing Node suites; five-property persistent tamper matrix; clean-room cross-issuer exchange;
approval/conservation/rollback suites; byte/source/journey parity; Expo exports; iPhone and Samsung accessibility
and airplane-mode evidence; full repository gate
**Target Platform**: Independent Node CLI verifier, fully offline web app, iOS >=16.4, Android >=7/API 36
**Project Type**: Open protocol + offline web product extensions + Expo Router mobile application
**Performance Goals**: Local proof verification under 2 seconds for the conformance fixture set; mobile core action
feedback under 2 seconds on both acceptance devices; no network on offline-core paths
**Constraints**: Integer halalas; fixed injected time; no `Date.now`, `new Date`, `Math.random`, `Intl`, locale money,
interest, penalty, lending, judging, scoring, or AI fatwa; no production claim from fixture keys/TSA/Expo Go
**Scale/Scope**: Five proof properties, two independent issuers exchanging three records each, eight gated
capabilities/registries, 21 mobile routes, six core journey parity fixtures

## Constitution Check

| Gate | Pre-design evidence | Post-design disposition |
|---|---|---|
| Spine and Shariah authority | Current Rifq/Circle primitives have consent/review flags but no approval-artifact gate | New activation contract is inert by default; exact external approvals are required and no plan decides a ruling |
| Frozen demo/golden engine | Tripwire and engine parity exist | All extensions are additive; `OT-PATCH` remains a separate project |
| Determinism/integer money | Existing app scanner and halala tests exist | All new logic receives `asOf`, validates supplied IDs, and uses integer minor units |
| TDD/full gate | Existing app and protocol suites are green | Every behavior task begins with a focused failing test and ends with full gate/tripwire |
| Independent verification | One independent verifier proves four mechanics | Profile-driven five-property results, persistent fixtures, and a clean-room second issuer are required |
| Privacy/no scoring | Aggregate protections exist but public org suppression is incomplete | `K_FLOOR=3`, fixed public keys, and no IDs/trust/scores are contractually tested |
| Judge Lens/evidence honesty | Prototype and production gaps are documented | Mobile/protocol claims stay fixture/prototype until external and device gates pass |
| Decision uniqueness | `D-4` collision exists | Namespaced canonical decisions plus checked historical aliases precede activation |

No constitutional violation is accepted. External gates block promotion or activation, not unrelated pure adapters,
schemas, tests, fixtures, or offline UI work.

## Project Structure

```text
protocol/
|-- profiles/
|   |-- protocol-profiles.json
|   |-- issuer-profiles.json
|   `-- timestamp-trust-profiles.json
|-- timestamp/
|   |-- adapter-contract.cjs
|   `-- fixture-adapter.cjs
|-- conformance/
|   |-- run-conformance.cjs
|   |-- fixtures/
|   `-- results/
|-- issuers/reference-2/
|   |-- issue.cjs
|   |-- verify.cjs
|   `-- README.md
|-- fixtures/conformance/
`-- verify-ahd-seal.cjs

app/features/
|-- approval-gate.js
|-- decision-registry.js
|-- rifq-approved.js
|-- circle-mode-b.js
|-- borrower-release.js
|-- duress.js
|-- collusion-signal.js
|-- identity-state.js
`-- analytics-public.js

tests/app/
|-- approval-artifact.test.cjs
|-- rifq-approval.test.cjs
|-- circle-mode-b.test.cjs
|-- borrower-release.test.cjs
|-- duress.test.cjs
|-- collusion-signal.test.cjs
|-- identity-state.test.cjs
|-- analytics-privacy-v2.test.cjs
`-- open-witness-conformance.test.cjs

application/ahd-mobile/
|-- scripts/sync-web-core.cjs
|-- src/app/
|-- src/navigation/screen-registry.ts
|-- src/generated/
|-- src/core/
|-- src/state/
|-- src/design/
|-- src/components/
|-- tests/
`-- design-evidence/
```

**Structure Decision**: Protocol code never imports application code. Existing product primitives remain unchanged
and receive new approval adapters. Mobile consumes generated exact-byte copies behind TypeScript adapters and has
no business logic in route components. The 17-part Sadu source and four supplemental route designs remain the
visual authority.

## Delivery Packages and Order

### Shared foundation: Decision and compatibility contracts

1. Resolve the `D-4` collision into namespaced canonical IDs with non-destructive aliases.
2. Define approval artifact, activation, identity binding, state vocabulary, and rollback contracts.
3. Add inert-default, collision, migration, privacy, and backward-reader tests.

This track enables product adapters and protocol governance but never creates an approval.

### Package 1: Five-property protocol and governance

1. Make current four properties mandatory under explicit profiles and localize every property result.
2. Add strict sequence/envelope checks and a real `--record|--package|--chain` CLI.
3. Integrate the approved timestamp adapter over raw sealed-seal bytes; fixture adapter remains non-evidentiary.
4. Add issuer/log lifecycle registries and persistent tamper fixtures.
5. Build the clean-room second issuer and record three-by-three exchange results.
6. Publish governance/security/versioning only after owner license/governance approval.

Production issuance remains disabled until accredited TSA and HSM/KMS gates pass.

### Package 2: Approval-gated protective capabilities

1. Wrap existing Rifq with conjunctive D-7/D-8 successor approvals.
2. Activate exactly one approved Circle mode-B profile; never Ahd custody.
3. Add request-only borrower release with lender-bound consent.
4. Add neutral duress and collusion-review holds.
5. Add canonical identity/state adapters and aggregate suppression.
6. Prove rollback disables future actions without rewriting history or rights.

Each capability may ship as tested inert infrastructure while its external decision remains open.

### Package 3: Arabic mobile parity

1. Reconcile the dirty Sadu output with its 17 source partials and add non-writing check mode.
2. Complete baseline evidence and obtain supplemental approval for the four uncovered routes.
3. Create a clean SDK 57 Router product; keep SDK 56 `proof-go` historical.
4. Register all 21 keys with four tabs and 17 stack routes.
5. Generate/hash the engine, required features, and tokens; prove Node and Metro/Hermes parity.
6. Implement SQLite offline state and six core journeys.
7. Apply static RTL, approved IBM Arabic fonts, tokens, safe areas, vector icons, and reduced motion.
8. Pass native export plus physical iPhone/Samsung accessibility and airplane-mode acceptance.

## Phase 0 Research

See [research.md](research.md). All technical unknowns have an explicit decision or external gate. Provider,
license, approval, font, baseline, and device choices are delivery gates
whose owners and evidence are named; they are not assumptions filled by an agent.

## Phase 1 Design

- Entities and transitions: [data-model.md](data-model.md)
- Proof/CLI/conformance contract: [contracts/open-witness-v1.md](contracts/open-witness-v1.md)
- Approval/protective contract: [contracts/approval-artifact-v1.md](contracts/approval-artifact-v1.md)
- Mobile parity contract: [contracts/mobile-parity-v1.md](contracts/mobile-parity-v1.md)
- End-to-end validation: [quickstart.md](quickstart.md)

## Detailed Execution Plans

The requirements span independent subsystems, so execution is split into plans that each deliver working,
testable software:

- `docs/superpowers/plans/2026-07-14-open-witness-five-property.md`
- `docs/superpowers/plans/2026-07-14-approval-gates-protective-features.md`
- `docs/superpowers/plans/2026-07-14-arabic-mobile-parity.md`

The product-gate plan may complete its schemas, inert adapters, and tests while named approvals remain blocked.
It must not enable a production capability using synthetic artifacts.

## Requirement Traceability

| Requirements | Execution owner | Independent exit evidence |
|---|---|---|
| FR-001–FR-004 | Open-Witness Tasks 1–6 | Five property statuses, real/offline timestamp fixture after approval, persistent tamper matrix |
| FR-005–FR-009 | Product Tasks 2–6 | Inert-default spies, exact approvals, consent/conservation, neutral holds |
| FR-010 | Product Task 7 | URN/binding collision and state-vocabulary migration suite |
| FR-011 | Excluded `OT-PATCH` project | Golden tripwire/parity remain unchanged in this package |
| FR-012–FR-013 | Mobile Tasks 1–10 | Six journey parity fixtures, 21 routes, native exports, two-device evidence |
| FR-014–FR-015 | Open-Witness Tasks 7–8 | Approved licenses/governance plus three-by-three clean-room exchange |
| FR-016 | Product Task 8 | `K_FLOOR=3`, fixed public keys, no ID/trust/score output |
| FR-017 | Product Task 1 | Canonical `DEC-*` registry and collision-safe historical aliases |
| FR-018 | All three plans | Issuance/action disable paths, old verifier/readers, append-only history |
| SC-001–SC-002 | Open-Witness Tasks 6–8 | Manifest-driven conformance and exchange JSON |
| SC-003–SC-005 | Product Tasks 2–9 | 100% inert without approval, integer conservation, backward readers |
| SC-006–SC-007 | Mobile Tasks 4–10 | Exact web/mobile output plus iPhone/Samsung accessibility matrix |
| SC-008 | Open-Witness Task 8 | Completeness test for license, governance, ownership, compatibility |

## Complexity Tracking

| Complexity | Why it is required | Simpler alternative rejected because |
|---|---|---|
| Three delivery packages plus a shared foundation | Protocol, governance-gated behavior, and native delivery have independent gates; decision/compatibility rules feed all three | One sequence would hide blockers and prevent independent acceptance |
| Timestamp adapter dependency | Node/OpenSSL cannot safely verify RFC-3161/CMS in the current environment | Hand-written ASN.1/CMS is a security risk; local clock is not trusted time |
| Clean-room second issuer | FR-015 requires interoperability, not self-consistency | Existing fixture builder imports Ahd implementation code |
| Namespaced decision aliases | Flat `D-*` IDs have a live collision | Destructive renaming loses historical references |
| Separate mobile application | Native routing, offline persistence, and device accessibility are explicit outcomes | Responsive web or Expo Go screenshots do not prove native parity |
| Generated CJS core behind TS adapters | Golden and feature parity must be byte-faithful | TypeScript rewrites or cross-root Metro imports create logic/packaging drift |

## Post-design Constitution Re-check

- No task modifies `demo/index.html`, golden function internals, vectors, or the generated engine slice.
- Every product capability has an inert default and exact approval/profile gate.
- Trusted time, issuer custody, licensing, fonts, and mobile distribution remain externally owned gates.
- Historical proofs, rights, IDs, states, and events remain backward-readable and append-only.
- TDD, persistent tamper fixtures, source/journey parity, device evidence, Judge Lens, and the full gate are explicit.
- No plan creates interest, penalty, bank lending, judgment, individual score, exported trust signal, or AI fatwa.

The design passes the constitution. Implementation may begin only inside the detailed plan boundaries and must
stop at each named external gate.
