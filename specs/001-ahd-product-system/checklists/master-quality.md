# Ahd Master Requirements Quality Checklist

**Purpose**: Unit tests for the clarity, completeness, consistency, measurability, and
traceability of the Ahd master specification

**Created**: 2026-07-14

**Audience**: Product, engineering, Shariah, legal, privacy, and judge-package reviewers

**Timing**: Before implementation planning and after every material specification amendment

**Depth**: Formal release gate

## Requirement Completeness

- [x] CHK001 Are every actor's permitted actions, forbidden actions, and decision authority explicitly documented? [Completeness, Spec §Actors and Authority]
- [x] CHK002 Are all 21 current screens and all non-screen product surfaces assigned an unambiguous lifecycle status? [Completeness, Spec §System Surfaces, Spec §Current App Capability Inventory]
- [x] CHK003 Are prototype, production, commercial, evidence, protocol, and presentation boundaries all specified? [Coverage, Spec §System Surfaces]
- [x] CHK004 Are explicit exclusions complete for lending, judging, loan charging, scoring, custody, AI fatwa, and unsupported claims? [Completeness, Spec §Explicit Exclusions]
- [x] CHK005 Does every functional domain identified in the user stories have at least one normative requirement? [Traceability, Spec §User Scenarios, Spec §Functional Requirements]
- [x] CHK006 Are production identity, trusted time, key custody, hosting, residency, security, pilot, and approval requirements all present? [Completeness, Spec §Production-Readiness Requirements]

## Requirement Clarity

- [x] CHK007 Are all six lifecycle labels defined so one requirement cannot reasonably receive two labels? [Clarity, Spec §Status Definitions]
- [x] CHK008 Is “neutral evidence” defined by included facts, excluded conclusions, provenance, verification, and limitations? [Clarity, Spec §FR-030, Spec §Evidence Bundle]
- [x] CHK009 Is “dignified” translated into observable requirements such as no shame counter, no red alarm, no public naming, and a grace path? [Clarity, Spec §FR-013–FR-016, Spec §NFR-010]
- [x] CHK010 Is the distinction between drafting assistance, vocabulary screening, Shariah review, and fatwa authority explicit? [Clarity, Spec §FR-003–FR-005, Spec §SR-008]
- [x] CHK011 Is “approved documentary evidence” defined sufficiently for every external gate's future closure? [Clarity, Spec §External Dependencies, Spec §SC-012]
- [x] CHK012 Are the current conservative rules for multilateral netting and hardship deferral distinguishable from unresolved Shariah framing? [Clarity, Spec §FR-028, Spec §SR-014–SR-015]

## Requirement Consistency

- [x] CHK013 Are fee and organization proposal requirements consistent with the no-loan-charge and free-core exclusions? [Consistency, Spec §FR-040–FR-041, Spec §SR-013, Spec §SR-018]
- [x] CHK014 Is open-term behavior consistently excluded from due, overdue, and reminder-cadence requirements? [Consistency, Spec §US3/AC3, Spec §FR-018]
- [x] CHK015 Are trust-band requirements consistent across privacy, analytics, organization, disclosure, and underwriting boundaries? [Consistency, Spec §FR-032, Spec §SR-007, Spec §SR-011, Spec §DR-005]
- [x] CHK016 Are current screen status and gated commercial behavior represented without calling the screen itself unavailable? [Consistency, Spec §Current App Capability Inventory, Spec §FR-040–FR-041]
- [x] CHK017 Are current event-state semantics consistent with the declared need for one future binding enum? [Consistency, Spec §State Transitions, Spec §NFR-015]

## Acceptance Criteria Quality

- [x] CHK018 Can every `BUILT` requirement be objectively verified through a named current-evidence area? [Measurability, Spec §Current Requirement Evidence]
- [x] CHK019 Can every `DECISION-GATED` requirement be verified as disabled or visibly pending before its decision closes? [Measurability, Spec §Decision Gates]
- [x] CHK020 Can every `EXTERNAL-GATED` requirement be verified through named documentary evidence rather than an agent assertion? [Measurability, Spec §External Dependencies]
- [x] CHK021 Are time-based success criteria explicit about start, stop, participants, repetitions, and failure conditions? [Acceptance Criteria, Spec §SC-001, Spec §SC-011]
- [x] CHK022 Are zero-failure, exact-conservation, byte-identity, offline, and evidence-grade outcomes objectively measurable? [Acceptance Criteria, Spec §SC-004–SC-010]

## Scenario Coverage

- [x] CHK023 Are primary flows covered for agreement creation, lifecycle, reminders, netting, Circles, verification, evidence, presentation, server demo, and production gates? [Coverage, Spec §User Scenarios]
- [x] CHK024 Are alternate flows covered for open-term repayment, grace, partial forgiveness, reconciliation, and fallback presentation? [Coverage, Spec §US2, Spec §US3, Spec §US8]
- [x] CHK025 Are exception flows covered for unsafe terms, missing consent, tampering, dispute, privacy-floor failure, and unavailable external services? [Coverage, Spec §Edge Cases]
- [x] CHK026 Are recovery flows defined for rendering failure, external-attestation absence, stage interaction failure, and controlled server restart? [Coverage, Spec §NFR-011, Spec §US6, Spec §US8, Spec §US9]
- [x] CHK027 Are non-functional scenarios covered for determinism, accessibility, RTL, privacy, security, reliability, and production operations? [Coverage, Spec §Non-Functional Requirements]

## Edge Case Coverage

- [x] CHK028 Are all monetary boundary cases defined without permitting float money, overpayment, over-forgiveness, mixed currency, or lost remainder halalas? [Edge Case, Spec §Edge Cases, Spec §SR-005]
- [x] CHK029 Are duplicate, revoked, missing, unauthorized, and misattributed consent cases specified? [Edge Case, Spec §Edge Cases, Spec §FR-006]
- [x] CHK030 Are duplicate, out-of-order, post-closure, and unauthorized lifecycle events specified? [Edge Case, Spec §Edge Cases, Spec §FR-009–FR-010]
- [x] CHK031 Are low-cardinality, re-identification, trust-leak, stale-source, and geographic-mismatch data cases specified? [Edge Case, Spec §Edge Cases, Spec §DR-001–DR-007]

## Non-Functional Requirements

- [x] CHK032 Are accessibility requirements quantified wherever a universal numeric threshold is appropriate? [Measurability, Spec §NFR-008–NFR-009]
- [x] CHK033 Are production availability, recovery, capacity, and latency explicitly blocked pending approved measurable targets? [Completeness, Spec §NFR-016]
- [x] CHK034 Are identity, authorization, exact-action consent, replay, non-enumeration, validation, abuse limits, audit, custody, residency, data lifecycle, incident response, supply chain, and privacy harm specified as separate obligations? [Completeness, Spec §SEC-001–SEC-014]
- [x] CHK035 Are privacy requirements complete for minimization, access, retention, deletion, legal hold, residency, breach response, and analytics? [Coverage, Spec §DR-004–DR-005, Spec §DR-015, Spec §PR-010]

## Dependencies & Assumptions

- [x] CHK036 Does every external dependency name an owner, lifecycle status, failure behavior, fallback, and closure evidence? [Completeness, Spec §External Dependencies]
- [x] CHK037 Are all Shariah, legal, regulatory, vendor, field-study, and owner assumptions visibly non-authoritative? [Assumption, Spec §Assumptions]
- [x] CHK038 Are migration dependencies explicit for identifiers, state vocabulary, canonical content, seal properties, and golden vectors? [Dependency, Spec §NFR-015, Spec §PR-011]

## Ambiguities & Conflicts

- [x] CHK039 Is the agreement identifier explicitly opaque and byte-preserved, with generator and migration choices kept out of current sealed-profile semantics? [Clarity, Spec §NFR-015, Spec §OT-IDSTATE, Data Model §Shared Scalar Types]
- [x] CHK040 Is public Shariah framing prevented from outrunning the separately built technical behavior? [Conflict, Spec §SR-014–SR-015, Spec §PR-002]
- [x] CHK041 Is “commercial behavior disabled” consistent with every current fee receipt, plan, and organization-screen statement? [Conflict, Spec §FR-040–FR-041]
- [x] CHK042 Is the boundary between current offline app, local service demo, and future production service impossible to misread? [Ambiguity, Spec §System Surfaces, Spec §US9, Spec §US10]

## Traceability

- [x] CHK043 Are requirement IDs unique, sequential within each family, and stable across linked artifacts? [Traceability, Spec §Requirements]
- [x] CHK044 Does every decision-gated requirement appear in the Decision Gates table? [Traceability, Spec §Decision Gates]
- [x] CHK045 Does every production external gate appear in both normative requirements and the External Dependencies table? [Traceability, Spec §Production-Readiness Requirements, Spec §External Dependencies]
- [x] CHK046 Can every success criterion be traced to at least one requirement or user scenario? [Traceability, Spec §Success Criteria]
- [x] CHK047 Is the live registry or executable gate identified whenever prose counts can drift? [Traceability, Spec §Current App Capability Inventory, Spec §DR-008]

## Review Result

Record reviewer, date, failed item IDs, specification amendments, and approval evidence here.
Do not mark this checklist complete by assumption.

- **Reviewer**: Codex cross-artifact review using SpecKit analysis and repository evidence
- **Reviewed**: 2026-07-14
- **Result**: 47/47 passed; failed item IDs: none
- **Amendments**: Added exact external-gate closure evidence, complete `BUILT` evidence coverage,
  direct requirement-to-task coverage, task paths, and explicit constitution binding.
- **Approval evidence**: `clarity-review.md`, `plan.md`, `tasks.md`, and the zero-critical
  analysis snapshot recorded in those artifacts.
