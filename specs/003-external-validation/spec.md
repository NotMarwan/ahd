# Feature Specification: External Validation

**Feature Branch**: `judge-lens-real-leap`  
**Created**: 2026-07-14  
**Status**: Ready for planning  
**Input**: Replace evidence ceilings with real Saudi demand, written Shariah and legal review, and pilot proof.

## Ahd Constitution Constraints

- No AI output is treated as a fatwa, legal opinion, regulatory permission, or market validation.
- Unconfirmed items remain pending and cannot unlock product behavior or public claims.
- Research requires informed consent, data minimization, and aggregate reporting.
- Individual trust data, loan records, or sensitive narratives are never exported.
- Scholar, counsel, regulator, bank, and pilot decisions are human-owned gates.

## User Scenarios & Testing

### User Story 1 - Hear Saudi Demand Directly (Priority: P1)

As product owner, I can use consented Saudi survey and interview evidence to understand prevalence,
relational strain, desired safeguards, and realistic amount ranges without exposing respondents.

**Why this priority**: Primary demand evidence is the largest remaining data ceiling.

**Independent Test**: Field the approved instrument, validate consent and sampling, then reproduce an
aggregate report from de-identified responses.

**Acceptance Scenarios**:

1. **Given** a consented respondent, **When** responses are collected, **Then** no unnecessary direct
   identifier or individual trust score is stored.
2. **Given** the completed sample, **When** analysis runs, **Then** results distinguish measured findings,
   uncertainty, non-response, and limitations.

### User Story 2 - Resolve Shariah and Legal Decisions (Priority: P1)

As product owner, I can send a concise decision packet to qualified reviewers and receive written,
traceable answers that determine which claims and mechanisms may proceed.

**Independent Test**: For each open decision, verify a question, cited basis, reviewer identity, dated
answer, conditions, and resulting product disposition.

**Acceptance Scenarios**:

1. **Given** an unresolved Shariah question, **When** no written answer exists, **Then** the dependent
   feature remains disabled or explicitly pending.
2. **Given** written reviewer guidance, **When** it is recorded, **Then** dependent claims and tasks adopt
   its exact conditions without broadening the ruling.

### User Story 3 - Prove Feasibility Externally (Priority: P2)

As sponsor or judge, I can see a bounded pilot signal, verified integration path, and honest commercial
model rather than an implied approval.

**Independent Test**: Inspect the evidence register and confirm every feasibility claim points to a dated
artifact from the named external party.

**Acceptance Scenarios**:

1. **Given** a bank, fund, or community partner conversation, **When** interest is documented, **Then** the
   artifact states scope, non-binding status, and next action.
2. **Given** no regulator or provider permission, **When** roadmap material is shown, **Then** it remains a
   planned gate rather than a completed integration.

### Edge Cases

- Sample size falls below target before judging.
- Survey respondents are concentrated in one demographic or channel.
- Scholar answers only part of a compound question.
- Counsel identifies conflicting Evidence Law references.
- A partner expresses verbal interest but will not provide written confirmation.
- A vendor confirms capability but not permission for production use.

## Requirements

### Functional Requirements

- **FR-001**: The research instrument MUST capture consent, eligibility, lending context, relational strain,
  desired safeguards, and amount-range information.
- **FR-002**: Research MUST minimize direct identifiers and publish only aggregate results.
- **FR-003**: Sampling, exclusions, missingness, and limitations MUST be reported.
- **FR-004**: Measured survey results MUST remain separate from national statistics and synthetic models.
- **FR-005**: The decision packet MUST cover self-disclosure, Circle pooling, fee separation, multilateral
  settlement, mercy-first consent, and any inheritance-related proposal.
- **FR-006**: Each reviewer answer MUST record reviewer qualification, date, exact question, answer, conditions,
  and allowed public phrasing.
- **FR-007**: Legal review MUST verify Evidence Law references and current court figures before publication.
- **FR-008**: Regulatory validation MUST distinguish sandbox path, provider permission, and production approval.
- **FR-009**: Commercial validation MUST test the Alinma-specific moat and institution-paid software model.
- **FR-010**: Pilot evidence MUST state whether it is interest, intent, trial, signed pilot, or paid contract.
- **FR-011**: No unresolved external gate MAY be represented as completed.
- **FR-012**: Evidence changes MUST propagate to product, deck, script, brief, rebuttals, and source ledger.
- **FR-013**: Human reviewers MUST approve any claim that depends on their authority before public use.
- **FR-014**: Rejected or conditional guidance MUST remain visible in the decision history.

### Key Entities

- **Research Response**: Consent, eligibility, de-identified answers, collection channel, and quality flags.
- **Evidence Finding**: Metric or theme, sample, uncertainty, limitations, grade, and permitted claim.
- **Review Decision**: Question, authority, answer, conditions, status, and affected features.
- **External Gate**: Organization, requested action, evidence required, owner, status, and expiry.
- **Pilot Signal**: Counterparty, scope, commitment level, artifact, date, and next step.

## Success Criteria

### Measurable Outcomes

- **SC-001**: At least 150 eligible Saudi responses pass consent and quality checks.
- **SC-002**: At least 8 qualitative interviews produce de-identified relational-strain themes.
- **SC-003**: 100% of published survey findings include sample size and limitations.
- **SC-004**: Every active Shariah question has a written answer or remains explicitly blocked.
- **SC-005**: Every legal citation used publicly is counsel-confirmed or removed.
- **SC-006**: Every integration claim is classified as planned, permitted, tested, or production-approved.
- **SC-007**: At least one external partner supplies a dated written pilot or non-binding interest artifact.
- **SC-008**: Evidence propagation produces zero stale or overstated public claims.

## Assumptions

- Human lead time may exceed competition deadlines; partial samples remain directional and labeled.
- Qualified reviewers determine their own authority; the project records qualifications without inflating them.
- No personal loan details are needed for demand validation.
- Production integrations remain out of scope until provider and regulatory gates are satisfied.

