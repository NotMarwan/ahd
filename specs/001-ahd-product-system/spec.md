# Feature Specification: Ahd Product System

**Feature Branch**: `judge-lens-real-leap`

**Created**: 2026-07-14

**Status**: Draft for stakeholder review

**Input**: Review the whole Ahd project and create a crystal-clear, structured specification
covering the current prototype, target product, external gates, and improvement work.

**Lifecycle Scope**: Every capability is labelled `BUILT`, `PLANNED`, `DECISION-GATED`,
`EXTERNAL-GATED`, `DEMO-ONLY`, or `OUT-OF-SCOPE`.

## Product Intent & Boundaries

### Problem and Outcome

Interest-free loans between relatives, friends, colleagues, and community members are often
informal. Unclear terms, uncomfortable reminders, fragmented proof, and late conflict can
damage relationships even when neither party intended harm.

Ahd provides a neutral bank-operated witness for interpersonal qard hasan. It helps people
write known terms, record consent, seal evidence, follow the obligation with dignity, grant
grace, settle directly or through consented netting, and export neutral proof when needed.

The intended outcome is not more lending. It is clearer obligations, verifiable records,
fewer relationship-damaging collection moments, and dignified resolution without interest,
penalty, judgment, or credit scoring.

### Product Promise

> Ahd keeps your word and protects your relationship.

Ahd witnesses, seals, settles, and nets. It never lends its own money, judges a dispute,
charges interest or delay penalties, or scores a person.

### Actors and Authority

| Actor | May | Must not |
|---|---|---|
| Lender | Offer funds, accept terms, consent to settlement, send a reminder through Ahd, grant grace, forgive, export evidence | Add interest or a delay penalty; alter a sealed obligation silently; use Ahd as a credit score |
| Borrower | Request a qard hasan, consent to terms, view obligations, pay any permitted amount, request grace, raise a dispute | Be scored, shamed, or charged an increase for time |
| Circle organizer | Define an occasion, record shares, send a group-safe reminder, initiate consented settlement | Expose a late member publicly; create a pooled bank deposit without approval |
| Circle member | Consent to a share, view their own obligation, pay, request grace, consent to a replacement settlement leg | See another member's private history or trust signal |
| Ahd bank operator | Witness, seal, verify, store, notify neutrally, propose netting, export evidence | Lend bank principal, rule on facts, impose a verdict, add a loan charge, score, or issue a fatwa |
| Organization operator | Administer an approved institutional program and view permitted aggregates | Access individual trust bands or turn Ahd into underwriting infrastructure |
| Judge or court | Receive and assess a neutral evidence bundle under applicable law | Receive an Ahd verdict or automated legal conclusion |
| Shariah reviewer | Review named structures and approve, reject, or condition a proposal | Be represented by an AI-generated ruling |
| Legal or regulatory reviewer | Review evidence, identity, privacy, custody, deployment, and licensing requirements | Be represented as having approved anything without documentary evidence |
| Presenter or judge | Inspect the prototype, run verification, challenge claims, and review evidence grades | Treat a labelled fixture, model, proposal, or pending gate as measured production fact |
| AI drafting assistant | Draft plain-language terms and identify vocabulary requiring review | Issue a fatwa, approve a contract, infer hardship, decide a dispute, or score a person |

### System Surfaces

| Surface | Status | Authority and boundary |
|---|---|---|
| Publishable Arabic app | `BUILT` | Current interactive product prototype. Fully local and deterministic; no production identity or money rail |
| Frozen presenter demo | `DEMO-ONLY` | Byte-pinned reference for the original golden flow. It is not an editable product surface |
| Open-Witness verifier and fixtures | `BUILT` | Independent verification artifact for sealed records; no app dependency |
| Local bank server walkthrough | `DEMO-ONLY` | Separate localhost demonstration with persistence and authenticated mutations; not used by the offline app |
| Evidence and pitch package | `BUILT` | Supports graded claims and stage delivery; cannot upgrade a claim's evidence grade |
| Mobile/Figma transfer | `PLANNED` | Approved baseline-transfer work; not proof of a shipped native app |
| Production Ahd service | `EXTERNAL-GATED` | Requires identity, trusted time, key custody, security, residency, regulatory, Shariah, legal, and pilot gates |
| Fee charging and paid plans | `DECISION-GATED` | Visual proposal only. No one is charged until the fee structure and payer are approved |

### Current App Capability Inventory

This inventory is a 2026-07-14 current-state snapshot derived from the registered product
surfaces. The screen registry, not a prose count, is authoritative. The app currently registers
21 screens and the project navigator maps 35 feature units.

| Screen | Reachability | Status | User value and boundary |
|---|---|---|---|
| Home | Primary navigation | `BUILT` | Product promise, live summary, and entry points |
| Create agreement | Primary navigation | `BUILT` | Draft, screen, consent, and seal a qard hasan |
| My ledger | Primary navigation | `BUILT` | Amounts owed to and by the viewer; gentle reminder entry |
| Witness timeline | Primary navigation | `BUILT` | Ordered significant events across the viewer's agreements |
| Open-term loan | Primary navigation | `BUILT` | No due date, partial payment, lender forgiveness, exact conservation |
| Circle | Primary navigation | `BUILT` | Occasion shares, private member states, group-safe reminder |
| Advanced Circle | Primary navigation | `BUILT` | Item split, recurring shares, graduation, gated no-custody proposal |
| Settlement | Primary navigation | `BUILT` | Deterministic netting, consent legs, conservation, mercy constraint |
| What Ahd refuses | Contextual | `BUILT` | Visible refusal to lend, score, or judge |
| Request an agreement | Contextual | `BUILT` | Borrower-initiated dignified request flow |
| Ahd impact | Contextual | `BUILT` | Labelled aggregate fixtures, drill-down aggregates, evidence, market band |
| Evidence proof | Contextual | `BUILT` | Covered content, integrity proof, judge-controlled tamper input |
| Dispute | Contextual | `BUILT` | Neutral pause, reconciliation path, court export, no verdict |
| Settings | Contextual | `BUILT` | Digit display, privacy mask, and product-boundary controls |
| What I owe | Contextual | `BUILT` | Borrower-focused obligations, grace request, eased payment |
| Good-faith record | Contextual | `BUILT` | Sealed mercy and good-faith events as neutral evidence |
| Standing qard hasan | Contextual | `BUILT` | Repeated bilateral agreement posts over explicit cycle identifiers |
| Guarantees and limits | Contextual | `BUILT` | Borrower, lender, and bank guarantees linked to proof |
| Shariah basis | Contextual | `BUILT` | Mechanic-specific sources separated from open questions |
| Fees and plans | Contextual | `BUILT` screen; `DECISION-GATED` commercial behavior | Proposed separate services; no charging |
| Organization dashboard | Contextual | `BUILT` screen; `DECISION-GATED` program behavior | Proposed institution view with restricted data authority |

### Explicit Exclusions

- Ahd will not originate or fund a loan from bank principal.
- Ahd will not charge interest, a delay penalty, a percentage of principal, or an increase
  linked to time.
- Ahd will not adjudicate disputes or issue legal conclusions.
- Ahd will not publish, export, sell, or underwrite from a credit score or numeric trust score.
- Ahd will not infer insolvency, hardship, guilt, intent, or religious validity from behavior.
- Ahd will not hold pooled Circle money in the current approved scope.
- Ahd will not call a fixture, sensitivity model, proposal, or secondary estimate measured
  product usage.
- Ahd will not claim production identity, accredited time, cloud readiness, regulatory
  approval, Shariah approval, or pilot traction before documentary evidence exists.
- This specification does not modify the frozen demo or choose a new golden seal scheme.

### Status Definitions

- `BUILT`: Current repository evidence implements and verifies the capability.
- `PLANNED`: The target is approved for design or implementation but is not present now.
- `DECISION-GATED`: Work or public framing requires a named owner or specialist decision.
- `EXTERNAL-GATED`: Completion depends on a regulator, reviewer, vendor, pilot, or field study.
- `DEMO-ONLY`: Real prototype behavior that lacks production authority or infrastructure.
- `OUT-OF-SCOPE`: Intentionally prohibited or excluded.

## Ahd Constitution Constraints

- The bank-role and Shariah spine governs every requirement.
- The frozen demo, golden functions, and pinned vectors remain unchanged.
- Money uses integer halalas. Pure logic is deterministic.
- The app remains offline unless a later, explicitly approved surface is specified.
- Trust signals remain qualitative, private, own-history-only, and non-underwriting.
- Pending Shariah, legal, privacy, regulatory, pricing, and external decisions remain visible.
- Judge-visible claims retain evidence grade and prototype status.
- Implementation work uses failing-test-first TDD and never weakens the quality gate.

## User Scenarios & Testing

### User Story 1 - Write and Seal a Clear Qard Hasan (Priority: P1)

As two people entering a qard hasan, we want known, plain terms witnessed and sealed after
explicit consent so neither person's memory or private notes are the only record.

**Why this priority**: This is the foundation of every other Ahd capability.

**Independent Test**: Complete one agreement from draft through consent and receive a sealed
record whose original content verifies and whose changed content fails verification.

**Acceptance Scenarios**:

1. **Given** two identified parties, a positive fixed amount, and interest-free terms,
   **When** both parties consent, **Then** Ahd creates one immutable witnessed record.
2. **Given** a term containing an interest or delay-penalty condition, **When** sealing is
   requested, **Then** Ahd blocks the seal and identifies the unsafe condition without a fatwa.
3. **Given** a sealed record, **When** any covered field is changed, **Then** verification reports
   that the record is not intact.
4. **Given** missing consent from either affected party, **When** sealing is requested, **Then**
   no final obligation is created.

### User Story 2 - Follow an Obligation With Dignity (Priority: P1)

As a lender or borrower, I want one neutral history of the obligation, payments, grace,
forgiveness, reminders, and disputes so I can act without shame or hidden changes.

**Why this priority**: Relationship protection depends on the life after sealing.

**Independent Test**: Follow one sealed obligation through payment, grace, forgiveness, and
dispute events and derive the same state from the same ordered history every time.

**Acceptance Scenarios**:

1. **Given** an active obligation, **When** a valid payment is recorded, **Then** remaining value
   decreases by exactly that amount and never becomes negative.
2. **Given** hardship, **When** the borrower requests grace, **Then** Ahd offers a no-increase path
   without inferring guilt or financial capacity.
3. **Given** a lender grants partial forgiveness, **When** it is recorded, **Then** principal is
   conserved across paid, forgiven, and remaining amounts.
4. **Given** either party raises a dispute, **When** it is recorded, **Then** Ahd pauses affected
   actions and offers neutral evidence, not a verdict.

### User Story 3 - Remind Without Becoming a Collector (Priority: P1)

As a lender, I want Ahd to send a finite, kind reminder carrying only the original obligation
so I do not have to pressure someone I know.

**Why this priority**: The painful reminder moment is a primary relational problem.

**Independent Test**: Start with one overdue scheduled obligation and exhaust the permitted
reminder cadence without adding money, exposing a shame counter, or continuing indefinitely.

**Acceptance Scenarios**:

1. **Given** a scheduled obligation is overdue, **When** a reminder is sent, **Then** Ahd is the
   sender and the borrower receives payment and grace options.
2. **Given** the reminder cadence reaches its final step, **When** another reminder is requested,
   **Then** automation stops and only non-punitive lender choices remain.
3. **Given** an open-term obligation, **When** time passes, **Then** it never becomes overdue and
   receives no overdue cadence.

### User Story 4 - Settle a Network With Consent (Priority: P1)

As members with mutual obligations, we want a smaller set of settlement transfers that
preserves every person's net position and requires consent to each replacement leg.

**Why this priority**: Consented netting is Ahd's strongest technical and practical differentiator.

**Independent Test**: Submit a fixed obligation network, produce a deterministic plan, confirm
conservation, and refuse commitment until every affected party consents.

**Acceptance Scenarios**:

1. **Given** a valid single-currency network, **When** netting is calculated, **Then** every
   participant's net position is unchanged and no value is created or lost.
2. **Given** one affected party has not consented, **When** commit is attempted, **Then** the new
   settlement plan remains uncommitted.
3. **Given** a declared hardship event under the conservative built rule, **When** the affected
   creditor has not consented to deferral, **Then** the ordinary netting result remains unchanged.
4. **Given** identical inputs, **When** netting is repeated, **Then** the same ordered legs result.

### User Story 5 - Manage a Circle Without Public Shame (Priority: P2)

As a Circle organizer or member, I want occasion shares recorded as individual obligations,
split exactly, and reminded privately so the group can reconcile without inventing a pooled
financial product.

**Why this priority**: Circles provide an everyday on-ramp while preserving bilateral clarity.

**Independent Test**: Create one Circle, divide items among assigned members, verify exact sum
preservation, and send a group-safe reminder that identifies no late member.

**Acceptance Scenarios**:

1. **Given** item totals and assigned members, **When** shares are calculated, **Then** the sum of
   all shares equals the exact item total in halalas.
2. **Given** one member is late, **When** a group reminder is sent, **Then** no late member is named.
3. **Given** a serious share is graduated, **When** a separate open-term agreement is created,
   **Then** its provenance links to the originating Circle share.
4. **Given** a proposed collect-before-spend mode, **When** it is viewed, **Then** it remains a
   no-custody proposal visibly pending Shariah review.

### User Story 6 - Verify Evidence Independently (Priority: P2)

As a counterparty, reviewer, or court, I want to verify a record without trusting the Ahd
application so integrity evidence is portable.

**Why this priority**: Independent verification turns a product claim into inspectable proof.

**Independent Test**: Verify the published intact fixture outside the app and reject the paired
tampered fixture.

**Acceptance Scenarios**:

1. **Given** a conforming record and its evidence, **When** an independent verifier checks it,
   **Then** it reports integrity and the covered verification properties.
2. **Given** changed content, reordered sequence, or invalid inclusion evidence, **When** verified,
   **Then** the verifier fails closed and identifies the failed property.
3. **Given** a property not supplied, **When** verified, **Then** the verifier reports it as absent,
   not satisfied.

### User Story 7 - Inspect Claims and Impact Honestly (Priority: P2)

As a judge or stakeholder, I want every market, impact, and readiness claim labelled by source
quality and measurement status so I can distinguish proof from illustration.

**Why this priority**: Credibility is a judging criterion and a production prerequisite.

**Independent Test**: Review every headline claim and trace it to a primary source, secondary
source, model assumption, fixture, proposal, or declared gap.

**Acceptance Scenarios**:

1. **Given** synthetic Circle data, **When** impact is shown, **Then** it is labelled synthetic and
   is not described as customer usage.
2. **Given** a modelled market band, **When** shown, **Then** input ranges, evidence grades, and
   scope limits are visible.
3. **Given** insufficient privacy group size, **When** analytics are requested, **Then** the result
   is suppressed or aggregated rather than exposing a record.
4. **Given** an external approval is pending, **When** a stage claim is produced, **Then** it uses
   pending language and identifies the gate.

### User Story 8 - Demonstrate the Product Under Challenge (Priority: P2)

As a hackathon presenter, I want a rehearsed path that proves integrity, mercy, netting, data
honesty, and feasibility inside the time limit with safe fallbacks.

**Why this priority**: The product must be understandable and memorable under live judging.

**Independent Test**: Complete the primary stage path within three minutes, run the live quality
gate, and recover from each documented failure mode without making a false claim.

**Acceptance Scenarios**:

1. **Given** the stage environment passes preflight, **When** the primary path runs, **Then** every
   promised interaction appears with matching copy and evidence.
2. **Given** a live interaction fails, **When** the presenter uses a fallback, **Then** the fallback
   shows the same labelled product state without upgrading its status.
3. **Given** the live gate total changes, **When** judge documents are validated, **Then** stale
   hard-coded totals are rejected before presentation.

### User Story 9 - Operate a Controlled Local Bank Walkthrough (Priority: P3)

As a technical reviewer, I want a separate durable local walkthrough for issuing, sealing,
listing, verifying, and netting records so I can inspect server behavior without pretending
the offline app is connected to production.

**Why this priority**: It proves a server seam while preserving prototype honesty.

**Independent Test**: Start the local service, authenticate a mutation, persist a sealed record,
restart, retrieve it, and verify it independently.

**Acceptance Scenarios**:

1. **Given** no valid mutation credential, **When** a record-changing operation is requested,
   **Then** it is rejected.
2. **Given** a valid sealed record, **When** the local service restarts, **Then** the record remains
   retrievable and verifiable.
3. **Given** the offline app is inspected, **When** network seams are scanned, **Then** no hidden
   dependency on the local service exists.

### User Story 10 - Progress to Production Through Explicit Gates (Priority: P3)

As a product owner, I want a dependency-ordered readiness path so no prototype seam is mistaken
for a licensed, secure, Shariah-approved production service.

**Why this priority**: Safe scaling requires external authority and operational controls.

**Independent Test**: Review the readiness matrix and show that each production claim remains
blocked until its named evidence exists.

**Acceptance Scenarios**:

1. **Given** identity integration is simulated, **When** production readiness is assessed,
   **Then** attributable party consent remains blocked.
2. **Given** no accredited timestamp, HSM custody, TLS endpoint, residency evidence, or regulator
   decision, **When** production status is assessed, **Then** Ahd remains non-production.
3. **Given** a proposed service fee, **When** no Shariah approval exists, **Then** charging remains
   disabled and public language remains explicitly proposed.
4. **Given** no field study or pilot, **When** demand or traction is discussed, **Then** only sourced
   context and the declared research gap are stated.

### Edge Cases

- Amount is zero, negative, non-integer, outside supported bounds, or expressed in mixed currency.
- The same person appears as both parties or a required party is absent.
- Terms are empty, contradictory, ambiguous, or contain disguised increase-for-time language.
- Consent is duplicated, revoked before commit, absent, or attributed to the wrong party.
- A covered field, sequence number, previous hash, signature, or inclusion proof is changed.
- Events arrive duplicated, out of order, after closure, or from an unauthorized actor.
- Payment exceeds the remaining amount or forgiveness exceeds lender authority.
- A scheduled loan is overdue while an open-term loan has no due state.
- A reminder is requested during cooldown, after the final cadence step, or during dispute.
- Hardship is self-declared but affected-creditor consent required by the current conservative
  netting rule is absent.
- A Circle split leaves a remainder halala, has an empty assignee list, or includes the payer.
- Netting receives disconnected nodes, zero balances, self-obligations, or inconsistent currency.
- Analytics group size is below the privacy floor or a drill-down could reveal one record.
- A source is stale, secondary, inaccessible, or inconsistent with the claim's geography.
- A fee is displayed without a visible pending-review label.
- An external identity, timestamp, storage, or hosting service is unavailable.
- A judge-visible count, screenshot, label, or flow no longer matches the current product.

## Requirements

Status applies to the requirement as written. A built prototype can coexist with a separate
production requirement that remains gated.

### Functional Requirements

| ID | Status | Requirement |
|---|---|---|
| FR-001 | `BUILT` | Ahd MUST identify every current capability with one lifecycle status and MUST preserve that status in stakeholder communication. |
| FR-002 | `BUILT` | Ahd MUST create an agreement only from distinct parties, a positive known amount, known currency, and explicit qard-hasan terms. |
| FR-003 | `BUILT` | Ahd MUST allow drafting assistance to propose plain-language terms while clearly limiting the assistant to drafting and flagging. |
| FR-004 | `BUILT` | Ahd MUST screen terms for interest, delay penalty, percentage-of-principal return, disguised time-based increase, and related prohibited conditions before sealing. |
| FR-005 | `BUILT` | Ahd MUST prevent final sealing while a prohibited condition remains. |
| FR-006 | `BUILT` | Ahd MUST require explicit affected-party consent before creating or replacing an obligation. |
| FR-007 | `BUILT` | Ahd MUST produce deterministic canonical agreement content before sealing. |
| FR-008 | `BUILT` | Ahd MUST verify intact covered content and reject changed covered content. |
| FR-009 | `BUILT` | Ahd MUST represent post-seal lifecycle changes as append-only events rather than silent edits. |
| FR-010 | `BUILT` | Ahd MUST derive agreement state from the ordered valid event history. |
| FR-011 | `BUILT` | Ahd MUST show a party a chronological witness timeline for agreements in which that party participates. |
| FR-012 | `BUILT` | Ahd MUST separate amounts owed to the viewer from amounts owed by the viewer and present remaining obligation and status. |
| FR-013 | `BUILT` | Ahd MUST allow a lender to ask Ahd to send a neutral reminder containing no monetary increase. |
| FR-014 | `BUILT` | Reminder cadence MUST be finite, honor cooldown, expose a grace path, and stop after the declared final step. |
| FR-015 | `BUILT` | Ahd MUST allow a borrower to request grace without requiring a public reason or inferring hardship. |
| FR-016 | `BUILT` | A borrower MUST be able to view their own obligations and record eased payment without viewing another person's private history. |
| FR-017 | `BUILT` | Payment MUST be limited to the remaining obligation and preserve exact monetary conservation. |
| FR-018 | `BUILT` | Ahd MUST support an open-term agreement with no schedule, no due date, and no overdue state. |
| FR-019 | `BUILT` | Ahd MUST allow the lender to grant full or partial forgiveness while preserving paid, forgiven, and remaining conservation. |
| FR-020 | `BUILT` | A Circle MUST remain an aggregation of individually attributable shares rather than a new pooled debt primitive. |
| FR-021 | `BUILT` | A group reminder MUST NOT identify a late member to the group. |
| FR-022 | `BUILT` | Item-based Circle allocation MUST divide each item only among its assigned members and preserve the exact total. |
| FR-023 | `BUILT` | Recurring Circle shares MUST use explicit cycle identifiers and MUST exclude the payer from owing themselves. |
| FR-024 | `BUILT` | A Circle share MAY graduate into a separately consented open-term agreement with provenance to the source share. |
| FR-025 | `DECISION-GATED` | Collect-before-spend Circle behavior MUST NOT hold pooled money at Ahd and MUST remain unavailable until the D-3 structure is approved. |
| FR-026 | `BUILT` | Netting MUST preserve each participant's net position exactly in a single currency and produce deterministic ordered legs. |
| FR-027 | `BUILT` | A proposed replacement settlement plan MUST remain uncommitted until every affected party consents. |
| FR-028 | `BUILT` | The current mercy-first netting variant MUST defer a declared-hardship obligation only with explicit affected-creditor consent and MUST leave ordinary netting unchanged otherwise. |
| FR-029 | `BUILT` | A dispute event MUST pause affected reminder and settlement actions. |
| FR-030 | `BUILT` | Ahd MUST export a neutral evidence bundle containing covered content, provenance, lifecycle history, and verification results. |
| FR-031 | `BUILT` | Dispute handling MUST offer reconciliation and court-export paths without producing an Ahd verdict. |
| FR-032 | `BUILT` | A trust band MUST be a qualitative word derived only from the viewer's own history and MUST not expose its numeric basis. |
| FR-033 | `BUILT` | Users MUST be able to select supported digit display and privacy masking without changing sealed content. |
| FR-034 | `BUILT` | Ahd MUST provide a visible explanation of the actions it refuses: lending, scoring, and judging. |
| FR-035 | `BUILT` | Ahd MUST present mechanic-specific Shariah sources separately from unresolved review questions. |
| FR-036 | `BUILT` | Impact analytics MUST use aggregate outputs, visible fixture/model labels, and exact conservation. |
| FR-037 | `BUILT` | Analytics MUST suppress or aggregate results below the declared privacy floor and MUST NOT reveal per-record rows after the floor is reached. |
| FR-038 | `BUILT` | Every market and evidence claim MUST retain source grade, geography, period, and scope limits. |
| FR-039 | `BUILT` | Market sizing MUST show a bounded range and distinguish sourced inputs from illustrative assumptions. |
| FR-040 | `DECISION-GATED` | Fee and plan surfaces MUST remain proposals, charge nobody, and visibly state pending Shariah review until D-6 is approved. |
| FR-041 | `DECISION-GATED` | Organization use MUST remain a demonstration until payer, data access, program authority, and Shariah boundaries are approved. |
| FR-042 | `BUILT` | A conforming sealed record MUST be independently verifiable without trusting the interactive app. |
| FR-043 | `DEMO-ONLY` | The local service MUST support authenticated creation and sealing, verification, listing, netting, and deterministic health inspection for demonstration. |
| FR-044 | `DEMO-ONLY` | Local mutating operations MUST require authentication and sealed records MUST survive a controlled restart. |
| FR-045 | `BUILT` | The stage package MUST provide a primary product path and labelled fallbacks for fragile live interactions. |
| FR-046 | `PLANNED` | The approved design-transfer workflow MUST preserve the baseline before any redesign and MUST retain a verifiable mapping to current product behavior. |
| FR-047 | `EXTERNAL-GATED` | Production consent MUST bind the party, exact displayed terms, action, and time through an approved identity and signature flow. |
| FR-048 | `EXTERNAL-GATED` | Production evidence MUST attach trusted time from an approved provider without making deterministic business logic depend on live time. |
| FR-049 | `EXTERNAL-GATED` | Production service access MUST require a secure externally reachable deployment with approved residency, transport security, key custody, and operations. |
| FR-050 | `EXTERNAL-GATED` | Demand and traction claims MUST remain contextual until the Saudi field study or pilot supplies approved evidence. |

### Spine and Shariah Requirements

| ID | Status | Requirement |
|---|---|---|
| SR-001 | `BUILT` | Ahd MUST NOT lend bank principal. |
| SR-002 | `BUILT` | Ahd MUST NOT judge or decide a dispute. |
| SR-003 | `BUILT` | Ahd MUST NOT add interest, delay penalty, or time-linked increase to an obligation. |
| SR-004 | `BUILT` | Ahd MUST NOT create maysir or materially unknown monetary consideration. |
| SR-005 | `BUILT` | Ahd MUST use integer halalas and exact conservation for all monetary operations. |
| SR-006 | `BUILT` | Ahd MUST NOT create or export a credit score. |
| SR-007 | `BUILT` | A trust band MUST remain own-history-only, qualitative, private, and non-underwriting. |
| SR-008 | `BUILT` | AI output MUST remain drafting or flagged review material and MUST NOT be represented as a fatwa. |
| SR-009 | `BUILT` | Hardship and delay MUST expose grace and MUST NOT cause an increase. |
| SR-010 | `BUILT` | Forgiveness MUST remain an explicit lender action in the current approved model. |
| SR-011 | `DECISION-GATED` | Owner-initiated trust-band disclosure MUST remain unavailable until D-1 privacy and Shariah approval. |
| SR-012 | `DECISION-GATED` | A collect-before-spend model MUST remain unavailable until D-3 Shariah approval. |
| SR-013 | `DECISION-GATED` | Charging any service fee MUST remain unavailable until D-6 approves the separate contract, payer, amount basis, and free core boundary. |
| SR-014 | `DECISION-GATED` | Public Shariah framing of multilateral netting MUST remain qualified until D-7 is reviewed. |
| SR-015 | `DECISION-GATED` | Public Shariah framing of mercy-first netting consent MUST remain qualified until D-8 is reviewed. |
| SR-016 | `OUT-OF-SCOPE` | Ahd MUST NOT hold pooled Circle deposits in the approved current scope. |
| SR-017 | `OUT-OF-SCOPE` | Ahd MUST NOT sell access to individual reliability history or permit third-party lookup. |
| SR-018 | `OUT-OF-SCOPE` | Ahd MUST NOT make repayment, grace, evidence access, or neutral dispute export conditional on a paid plan. |

### Non-Functional Requirements

| ID | Status | Requirement |
|---|---|---|
| NFR-001 | `BUILT` | The same valid inputs MUST produce byte-identical canonical content, seals, states, splits, and netting order. |
| NFR-002 | `BUILT` | Current app behavior MUST remain fully usable without network access. |
| NFR-003 | `BUILT` | No current pure business rule may depend on wall-clock time, randomness, locale APIs, or floating-point money. |
| NFR-004 | `BUILT` | The publishable product and frozen reference MUST use behaviorally identical golden logic. |
| NFR-005 | `BUILT` | Independent verification MUST fail closed on malformed or inconsistent evidence. |
| NFR-006 | `BUILT` | Arabic MUST be the primary user-facing language and layout MUST support RTL and safe bidirectional rendering. |
| NFR-007 | `BUILT` | Supported digit display changes MUST be presentation-only. |
| NFR-008 | `BUILT` | Interactive controls MUST expose keyboard focus, accessible names, and a minimum touch target of 44 by 44 CSS pixels. |
| NFR-009 | `BUILT` | Reduced-motion preferences MUST disable non-essential motion without hiding information. |
| NFR-010 | `BUILT` | Late and hardship presentation MUST use dignified, non-punitive language and MUST avoid red alarm treatment. |
| NFR-011 | `BUILT` | A rendering failure MUST produce a recoverable user message rather than a blank or corrupted surface. |
| NFR-012 | `BUILT` | Current app and protocol validation MUST require no third-party runtime dependency. |
| NFR-013 | `BUILT` | The frozen reference tripwire MUST detect any byte change. |
| NFR-014 | `BUILT` | Every implemented spine guarantee MUST have named executable evidence. |
| NFR-015 | `PLANNED` | The canonical agreement identifier and lifecycle enum MUST be declared once and reused across every future surface. |
| NFR-016 | `EXTERNAL-GATED` | Production availability, recovery time, recovery point, capacity, and latency targets MUST be approved before launch. |
| NFR-017 | `EXTERNAL-GATED` | Production personal and financial data MUST remain within approved Saudi residency and retention boundaries. |
| NFR-018 | `EXTERNAL-GATED` | Production services MUST provide rate limiting, abuse controls, monitoring, incident response, and audit trails. |
| NFR-019 | `EXTERNAL-GATED` | Production cryptographic keys MUST use approved custody, rotation, revocation, and separation of duties. |
| NFR-020 | `EXTERNAL-GATED` | Production interfaces MUST define versioning, compatibility, idempotency, retries, and failure recovery. |

### Data and Evidence Requirements

| ID | Status | Requirement |
|---|---|---|
| DR-001 | `BUILT` | Every displayed external statistic MUST identify source, period, geography, and evidence grade. |
| DR-002 | `BUILT` | Primary, secondary, modelled, fixture, proposed, and missing evidence MUST use distinguishable labels. |
| DR-003 | `BUILT` | Synthetic obligations MUST NOT be described as user, bank, or national transactional data. |
| DR-004 | `BUILT` | Impact analytics MUST publish the privacy floor and suppress or aggregate unsafe groups. |
| DR-005 | `BUILT` | Analytics MUST NOT expose personal identifiers, trust bands, or agreement-level history. |
| DR-006 | `BUILT` | Market sizing MUST expose low, base, and high assumptions rather than one false-precision total. |
| DR-007 | `BUILT` | A national illustration MUST state the category mismatch between enforcement cases and Ahd-eligible interpersonal obligations. |
| DR-008 | `BUILT` | The live quality gate is the authority for current assertion totals; documentation totals are derived display values. |
| DR-009 | `BUILT` | Judge screenshots and fallback media MUST identify the product state they represent and be refreshed when visible behavior changes. |
| DR-010 | `EXTERNAL-GATED` | A Saudi relational-demand claim requires approved field evidence from the survey or pilot. |
| DR-011 | `EXTERNAL-GATED` | A precise informal-loan-size claim requires field evidence; proxy bands MUST remain labelled proxies. |
| DR-012 | `EXTERNAL-GATED` | Legal article and court-volume claims requiring counsel confirmation MUST remain qualified until OT-CITE closes. |
| DR-013 | `PLANNED` | Every requirement MUST trace to acceptance criteria, current evidence or a declared gap, and any blocking decision. |
| DR-014 | `PLANNED` | Stale capability inventories MUST be detected against the current screen and feature registries. |
| DR-015 | `EXTERNAL-GATED` | Production data retention, deletion, subject access, and breach-notification rules require approved legal and regulatory policy. |

### Production-Readiness Requirements

| ID | Status | Requirement |
|---|---|---|
| PR-001 | `EXTERNAL-GATED` | The owner MUST obtain and record the applicable Saudi regulatory path before external launch. |
| PR-002 | `EXTERNAL-GATED` | Qualified Shariah review MUST resolve D-1, D-3, D-6, D-7, and D-8 before the affected capability or public promise is enabled. |
| PR-003 | `EXTERNAL-GATED` | Counsel MUST confirm the evidence-law framing, identity attribution, privacy role, and court-export claims. |
| PR-004 | `EXTERNAL-GATED` | Production party attribution MUST use an approved Nafath-compatible or equivalent identity and signing flow. |
| PR-005 | `EXTERNAL-GATED` | Production trusted time MUST use an approved timestamp provider and verifiable token retention. |
| PR-006 | `EXTERNAL-GATED` | Production signing keys MUST use approved HSM or KMS custody and documented recovery and revocation. |
| PR-007 | `EXTERNAL-GATED` | Production hosting MUST provide Saudi residency evidence, TLS, secret management, backups, monitoring, and incident response. |
| PR-008 | `PLANNED` | A formal threat model MUST cover spoofing, tampering, repudiation, information disclosure, denial of service, privilege escalation, linkability, and non-repudiation privacy harm. |
| PR-009 | `PLANNED` | Public mutation and verification interfaces MUST define rate limits and abuse behavior. |
| PR-010 | `PLANNED` | Production records MUST define retention, deletion constraints, legal hold, export, and recovery behavior. |
| PR-011 | `PLANNED` | A versioned migration plan MUST precede any change to canonical content, seal properties, or state vocabulary. |
| PR-012 | `EXTERNAL-GATED` | A pilot MUST define cohort, consent, support, incident, success, and stop criteria before handling live obligations. |
| PR-013 | `EXTERNAL-GATED` | Charging MUST remain disabled until the approved payer, service boundary, cost basis, disclosure, accounting, and refund rules are documented. |
| PR-014 | `PLANNED` | Production operations MUST define service ownership, escalation, disaster recovery, reconciliation, and audit review. |
| PR-015 | `PLANNED` | A launch readiness review MUST prove every external gate with documentary evidence and leave no pending item represented as complete. |

### Judge-Visible Requirements

| ID | Status | Requirement |
|---|---|---|
| JR-001 | `BUILT` | The primary story MUST prove tamper detection, relationship protection, mercy, and consented netting rather than list features. |
| JR-002 | `BUILT` | Every stage claim MUST retain its current evidence grade and lifecycle status. |
| JR-003 | `BUILT` | The presenter MUST be able to run a one-command quality gate after preflight. |
| JR-004 | `BUILT` | Stale hard-coded gate totals MUST be rejected before stage use. |
| JR-005 | `BUILT` | Fragile live moments MUST have current labelled fallback evidence. |
| JR-006 | `PLANNED` | The full primary path MUST be rehearsed end-to-end before the competition freeze. |
| JR-007 | `EXTERNAL-GATED` | Team names, official presentation template, and any organizer-required final files require owner input. |
| JR-008 | `BUILT` | A judge-visible surface MUST be reviewed against innovation, technical implementation, data use, user experience, and feasibility. |
| JR-009 | `BUILT` | A judge-visible criterion below 8 MUST remain an open `JL-` item with evidence and an owner. |
| JR-010 | `OUT-OF-SCOPE` | The presentation MUST NOT imply regulator, scholar, bank, identity-provider, timestamp-provider, or customer approval without evidence. |

### Key Entities

- **Person**: A human party with a stable internal reference, display identity, role, and
  explicit consent records; production identity attribution is externally gated.
- **Agreement**: One bilateral qard-hasan obligation with fixed principal, currency, terms,
  parties, type, lifecycle status, and provenance.
- **Consent**: A party's explicit agreement to exact displayed content or a replacement
  settlement leg, including scope and attribution evidence.
- **Canonical Record**: Deterministic covered content used to compute integrity evidence.
- **Seal Block**: Sequence, prior reference, covered-content digest, seal, and available
  independent attestations.
- **Lifecycle Event**: Append-only fact with type, authorized actor, agreement reference,
  amount when applicable, provenance, and integrity evidence.
- **Derived Agreement State**: Deterministic fold result including status, paid, forgiven,
  remaining, schedule, and dispute state.
- **Reminder Cadence**: Finite neutral-notification state with cooldown and stop conditions.
- **Hardship Declaration**: Borrower-originated request for grace; not an inferred score or
  adjudicated insolvency finding.
- **Circle**: Occasion container for individually attributable shares, members, items, and
  provenance.
- **Circle Share**: One member's exact bilateral obligation arising from a Circle.
- **Netting Plan**: Deterministic proposed replacement legs that conserve participant net
  positions and require consent.
- **Settlement Leg**: One proposed or committed transfer between two parties.
- **Dispute**: Neutral pause state and evidence-export context without an Ahd verdict.
- **Evidence Bundle**: Covered content, seal data, provenance, event history, verification
  result, limitations, and export metadata.
- **Trust Band**: Private qualitative word derived from the subject's own history.
- **Impact Aggregate**: Privacy-bounded synthetic or measured group statistic with evidence
  and measurement labels.
- **Evidence Source**: Citation, period, geography, grade, scope, and claim bindings.
- **Fee Proposal**: Proposed separate service, payer, amount basis, disclosure, and approval
  status; not a loan increase.
- **Organization Program**: Proposed institution-managed usage boundary, participant cohort,
  permitted aggregates, and approval status.
- **External Attestation**: Identity signature, trusted timestamp, bank signature, or other
  production evidence supplied by an approved external authority.

### State Transitions

The binding vocabulary for future production work must be finalized under `NFR-015`. Current
product behavior observes these semantic transitions:

| From | Event | Authority | To | Guard |
|---|---|---|---|---|
| Draft | Both parties consent and seal | Both parties | Active | Terms pass screening; amount and parties valid |
| Active | Valid payment | Paying party with witnessed receipt | Active or Kept | Payment does not exceed remaining |
| Active | Grace granted | Lender after borrower request or lender offer | Grace | No increase; remaining conserved |
| Grace | Valid payment | Paying party | Grace or Kept | Payment does not exceed remaining |
| Active or Grace | Partial forgiveness | Lender | Active, Grace, or Forgiven | Forgiveness does not exceed remaining |
| Active or Grace | Full forgiveness | Lender | Forgiven | Remaining becomes zero exactly |
| Active or Grace | Dispute raised | Either party | Disputed | Event is attributable; affected actions pause |
| Disputed | Reconciliation accepted | Both affected parties | Prior lawful state or Kept | Replacement terms require explicit consent |
| Active or Grace | Full settlement | Both parties or verified rail evidence | Kept | Paid plus forgiven equals principal |
| Circle share | Graduation accepted | Both share parties | New open-term agreement | New agreement sealed; provenance retained |
| Proposed netting | All affected consents recorded | All affected parties | Committed settlement | Conservation and consent complete |

Forbidden transitions include silent principal increase, unilateral replacement-leg commit,
payment beyond remaining, forgiveness by an unauthorized actor, disputed-to-verdict by Ahd,
and open-term-to-overdue.

## Decisions, Dependencies & Traceability

### Decision Gates

| Decision | Affected requirements | Current rule |
|---|---|---|
| D-1 owner-initiated trust disclosure | SR-011 | Not available |
| D-3 collect-before-spend Circle mode | FR-025, SR-012 | No pooled custody; proposal only |
| D-4 frozen demo fate | NFR-013 | Keep frozen reference in place |
| D-5 disputed riba-linter interpretations | FR-004, SR-008 | Conservative flagging; AI does not rule |
| D-6 and D-6a fee model and surfaces | FR-040, FR-041, SR-013, PR-013 | Display proposal only; no charge |
| D-7 multilateral netting Shariah framing | FR-026, SR-014, PR-002 | Technical capability remains; public ruling stays qualified |
| D-8 mercy-first consent condition | FR-028, SR-015, PR-002 | Conservative creditor-consented rule |
| OT-IDSTATE identifier and state vocabulary | NFR-015, PR-011 | Must be resolved before production contracts |
| OT-A1 field demand evidence | FR-050, DR-010, PR-012 | No demand or traction claim beyond sourced context |
| OT-VAL production validation | PR-001 through PR-007 | No approval claim |
| OT-CITE counsel confirmation | DR-012, PR-003 | Qualify affected legal and court claims |
| OT-PATCH deeper seal migration | PR-011 | Do not apply during frozen-demo scope |

### External Dependencies

| Dependency | Owner | Status | Failure behavior and fallback |
|---|---|---|---|
| Qualified Shariah review | Product owner and appointed board/reviewer | `EXTERNAL-GATED` | Keep capability disabled or framing qualified |
| Saudi legal and privacy counsel | Product owner and counsel | `EXTERNAL-GATED` | Keep legal claims qualified; do not launch affected flow |
| Regulatory pathway | Product owner and regulator | `EXTERNAL-GATED` | Remain prototype or controlled pilot only |
| Nafath-compatible identity and signing | Product owner and approved provider | `EXTERNAL-GATED` | Use explicit simulation label; no production attribution claim |
| Accredited timestamping | Product owner and approved provider | `EXTERNAL-GATED` | Report trusted-time property absent; local logic remains deterministic |
| HSM/KMS custody | Security owner and approved provider | `EXTERNAL-GATED` | No production signing claim |
| Saudi hosting and operations | Technology owner and provider | `EXTERNAL-GATED` | Remain localhost/offline demonstration |
| Field survey and pilot | Product team | `EXTERNAL-GATED` | Preserve evidence gap; use only sourced context and labelled models |
| Official competition assets and team data | Product owner | `EXTERNAL-GATED` | Use draft package; do not invent names or organizer requirements |

For this specification, approved documentary evidence means an attributable, dated artifact
from the authority named in the dependency row. Examples include a signed reviewer decision,
legal opinion, regulator communication, executed provider agreement, security certification,
production test report, or approved pilot report. A meeting note, agent summary, draft,
simulation, or verbal expectation does not close an external gate.

### Current Requirement Evidence

Repository paths below prove current status; they do not define future implementation design.

| Requirement IDs | Requirement area | Current evidence |
|---|---|---|
| NFR-001–NFR-005, NFR-012–NFR-014, SR-005 | Frozen core, parity, determinism, money, app behavior | `demo/index.html`, `app/engine.js`, `tests/run-all.cjs`, `tests/app/` |
| FR-002–FR-008, SR-003–SR-005, SR-008 | Agreement creation and riba screening | `app/features/create.js`, `app/features/riba-lint.js`, corresponding tests |
| FR-009–FR-019, SR-009–SR-010 | Ledger, borrower, open-term, reminders, grace, forgiveness | `app/features/daftari.js`, `borrower.js`, `open-loan.js`, corresponding tests |
| FR-020–FR-025, SR-012, SR-016 | Circle and recurring shares | `app/features/circle.js`, `circle-adv.js`, corresponding tests |
| FR-026–FR-028, SR-014–SR-015 | Settlement, consent, conservation, mercy constraint | `app/features/settlement.js`, `rifq.js`, corresponding tests |
| FR-011, FR-029–FR-031, FR-042, NFR-005 | Timeline, dispute, evidence, independent verification | `app/features/timeline.js`, `dispute.js`, `proof.js`, `protocol/`, corresponding tests |
| FR-032–FR-035, SR-001–SR-002, SR-006–SR-008, SR-011, SR-017 | Trust, privacy bounds, refusal, Shariah framing | `app/features/settings.js`, `bounds.js`, `refusal.js`, `shariah-basis.js`, corresponding tests |
| FR-036–FR-039, DR-001–DR-009 | Impact, evidence grades, market model | `app/features/impact.js`, `impact-drill.js`, `sources.js`, `market-model.js`, `data-rigor.js`, corresponding tests |
| FR-040–FR-041, SR-013, SR-018 | Fee and organization proposals | `app/features/billing.js`, `fee-receipt.js`, `org.js`, `docs/DECISIONS-FOR-MARWAN.md` |
| FR-043–FR-044 | Local service demonstration | `server/`, `tests/app/server-*.test.cjs`, `server/smoke-live.cjs` |
| FR-047–FR-050, NFR-016–NFR-020, PR-001–PR-015 | Production path and external gates | `docs/evidence/PATH-TO-PRODUCTION.md`, `_meta/OPEN-ITEMS.md` |
| FR-045–FR-046, JR-001–JR-010 | Judge requirements and evidence package | `docs/JUDGE-LENS.md`, `docs/pitch/`, `docs/evidence/`, stage gate checks |

## Success Criteria

### Measurable Outcomes

- **SC-001**: A new reviewer can identify Ahd's purpose, actors, prohibited behavior, current
  prototype status, and production gates from this specification in 15 minutes or less.
- **SC-002**: 100% of normative requirements have a stable ID, one lifecycle status, and an
  acceptance path or explicit external gate.
- **SC-003**: 100% of decision-gated requirements link to a named decision or open item.
- **SC-004**: An intact published record passes independent verification and each paired
  tampered record fails the relevant integrity property.
- **SC-005**: All monetary acceptance vectors preserve exact integer-halala conservation.
- **SC-006**: Repeating current deterministic scenarios produces byte-identical outputs.
- **SC-007**: The current publishable app completes its primary journeys with zero network calls.
- **SC-008**: The complete executable quality gate reports zero failures before any completion
  claim, and no existing assertion is weakened.
- **SC-009**: 100% of judge-visible quantitative claims identify their evidence grade and
  measurement status.
- **SC-010**: No judge-visible statement presents a pending regulator, scholar, counsel, vendor,
  customer, or pilot gate as approved or completed.
- **SC-011**: The three-minute primary presentation path completes without a wrong label, stale
  screenshot, stale gate total, or unrecoverable interaction in two consecutive rehearsals.
- **SC-012**: Production launch remains blocked until every requirement from PR-001 through
  PR-007 and PR-012 through PR-015 has approved documentary evidence.
- **SC-013**: Cross-artifact analysis reports zero critical constitution conflicts and zero
  untraced core requirements before implementation planning is approved.

## Assumptions

- The scope is the full Ahd product system, not one isolated screen.
- The repository state on 2026-07-14 is the authority for `BUILT` status.
- The live test banner is authoritative for assertion totals; prose counts are not.
- Existing fixtures remain synthetic unless a source explicitly proves otherwise.
- The frozen demo remains unchanged throughout this specification cycle.
- The current app remains an offline prototype even where a separate server demonstration exists.
- Shariah, legal, regulatory, production-vendor, field-study, and owner decisions remain
  outside autonomous agent authority.
- The specification defines target behavior; technical choices belong in the implementation plan.
- Arabic remains the source language for end-user copy, with English used for technical review.
