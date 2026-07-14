# Implementation Plan: V2 Product and Protocol

**Branch**: `judge-lens-real-leap` | **Date**: 2026-07-14 | **Spec**: [spec.md](spec.md)

## Summary

Complete the additive five-property seal and Open-Witness conformance suite, then implement only externally
approved deferred product mechanisms. Build the mobile twin from the approved Sadu baseline with byte-parity
engine reuse. Keep golden migration `OT-PATCH` isolated as its own approval-gated compatibility project.

## Technical Context

**Language/Version**: Node.js 20 CommonJS; browser JavaScript; proposed Expo SDK 54+ / TypeScript after approval  
**Primary Dependencies**: Node built-ins for protocol; approved RFC-3161 provider and HSM/KMS for production;
Expo dependencies only after mobile approval  
**Storage**: Versioned proof packages, fixtures, approval artifacts, app event logs, mobile local state  
**Testing**: Protocol conformance/tamper suites, feature TDD, engine parity, web/mobile journey parity, device QA  
**Target Platform**: Independent Node verifier, offline web app, iOS and Android mobile app  
**Project Type**: Open protocol, web product extensions, mobile application  
**Performance Goals**: Local proof verification under 2 seconds; core mobile actions visibly complete under 2 seconds  
**Constraints**: Approval-first; additive protocol; no golden edits; integer money; offline core; privacy floor  
**Scale/Scope**: Protocol v1.x, two independent issuers, deferred feature set, 21-screen mobile mapping

## Constitution Check

- [x] Every Shariah-adjacent feature has an inert pre-approval state.
- [x] Frozen demo and golden engine remain untouched; `OT-PATCH` is separate.
- [x] Protocol and product logic remain deterministic and integer-based.
- [x] TDD, tamper fixtures, parity, full gate, and device evidence planned.
- [x] Post-hackathon sequencing prevents stage risk.
- [x] License, provider, identity, mobile dependency, and irreversible migration gates are explicit.

## Project Structure

```text
protocol/
├── OPEN-WITNESS-v1.md
├── verify-ahd-seal.cjs
├── conformance/
├── issuers/
└── fixtures/
app/features/
├── rifq.js
├── borrower-release.js
├── duress.js
├── collusion-signal.js
├── circle-mode-b.js
└── identity-state.js
app/screens/
├── borrower-release.js
├── duress.js
└── circle-mode-b.js
application/ahd-mobile/
├── app/
├── src/
├── tests/
└── design-evidence/
tests/app/
├── seal-properties.test.cjs
├── open-witness-conformance.test.cjs
├── borrower-release.test.cjs
├── duress.test.cjs
├── collusion-signal.test.cjs
├── circle-mode-b.test.cjs
└── identity-state.test.cjs
```

**Structure Decision**: Protocol conformance stays independent. Each deferred mechanism receives one pure
feature module, one focused suite, and an optional contextual screen. Mobile remains a separate generated
engine consumer with its own parity runner.

## Phase 0 Research

See [research.md](research.md). Decisions: external timestamp is an attestation outside canonical product
logic; Ed25519 signature uses production custody only after HSM/KMS approval; Open-Witness gets semantic
versioning and a permissive license after owner choice; product mechanisms compile to disabled without approval;
mobile follows Figma baseline parity before visual v2.

## Phase 1 Design

- Data model: [data-model.md](data-model.md)
- Protocol and approval contract: [contracts/open-witness-v1.md](contracts/open-witness-v1.md)
- Validation: [quickstart.md](quickstart.md)

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Separate mobile application | Native device proof and mobile UX are explicit goals | Responsive web cannot prove iOS/Android parity or native identity flows |
| External TSA and HSM/KMS | Trusted time and production signing custody require independent trust | Demo keys and free TSA are not evidentiary production controls |

Both remain blocked until named approvals.

