# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

**Lifecycle Scope**: Every capability MUST be labelled `BUILT`, `PLANNED`,
`DECISION-GATED`, `EXTERNAL-GATED`, `DEMO-ONLY`, or `OUT-OF-SCOPE`.

## Product Intent & Boundaries *(mandatory)*

### Problem and Outcome

[State the user problem, the intended outcome, and why this product is the appropriate boundary.]

### Actors and Authority

[Name every actor, what each actor may do, and what each actor is forbidden from doing.]

### System Surfaces

[Name current product surfaces, their authority, dependencies, and lifecycle status.]

### Explicit Exclusions

[List behavior the product will not provide. Include spine, legal, Shariah, privacy, and
scope exclusions.]

### Status Definitions

[Define the exact lifecycle labels used by this specification.]

## Ahd Constitution Constraints *(mandatory)*

- State how the feature preserves the bank-role spine and Shariah decision boundaries.
- State whether the frozen demo, generated engine, golden functions, or vectors are touched.
- State determinism, integer-halala, offline, privacy, evidence-labeling, and judge-lens constraints.
- Name every human, counsel, vendor, or irreversible decision gate.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Spine and Shariah Requirements *(mandatory for Ahd)*

- **SR-001**: [State one testable spine or Shariah boundary, its lifecycle status, evidence,
  and any decision gate.]

### Non-Functional Requirements *(mandatory)*

- **NFR-001**: [State a measurable security, privacy, accessibility, localization,
  determinism, reliability, or performance requirement.]

### Data and Evidence Requirements *(include when claims or analytics are involved)*

- **DR-001**: [State a testable data provenance, evidence grade, privacy, or claim-integrity
  requirement.]

### Production-Readiness Requirements *(include for production targets)*

- **PR-001**: [State a production seam, external dependency, failure behavior, owner, and
  current lifecycle status.]

### Judge-Visible Requirements *(include for competition surfaces)*

- **JR-001**: [State a measurable judge-facing outcome and its evidence source.]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

### State Transitions *(include when entities change state)*

[Define allowed transitions, actor authority, guards, emitted events, and forbidden
transitions.]

## Decisions, Dependencies & Traceability *(mandatory)*

### Decision Gates

[Link every unresolved owner, Shariah, legal, regulatory, privacy, pricing, golden-vector,
or irreversible decision. Never resolve it implicitly.]

### External Dependencies

[Name dependency, owner, status, failure mode, fallback, and proof required to call it ready.]

### Requirement Evidence

[For every requirement family, identify current implementation evidence or declare the gap.
Use repository-relative paths and stable open-item/decision IDs.]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Assumption about target users, e.g., "Users have stable internet connectivity"]
- [Assumption about scope boundaries, e.g., "Mobile support is out of scope for v1"]
- [Assumption about data/environment, e.g., "Existing authentication system will be reused"]
- [Dependency on existing system/service, e.g., "Requires access to the existing user profile API"]
