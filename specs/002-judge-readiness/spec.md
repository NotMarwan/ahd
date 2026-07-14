# Feature Specification: Judge Readiness

**Feature Branch**: `judge-lens-real-leap`  
**Created**: 2026-07-14  
**Status**: Ready for planning  
**Input**: Make the 18 July pitch and live demonstration reliable, readable, honest, and memorable.

## Ahd Constitution Constraints

- Judge impact never overrides the bank-role or Shariah spine.
- The frozen demo and golden engine remain unchanged.
- Claims remain measured, modeled, synthetic, estimated, or pending as applicable.
- Arabic-first accessibility, offline execution, privacy, and deterministic outputs remain mandatory.
- Font licensing, team names, final deck template, and choreography choices are named human gates.

## User Scenarios & Testing

### User Story 1 - Deliver the Three-Minute Story (Priority: P1)

As presenter, I can deliver one coherent story from tamper proof to mercy-first settlement to a clear
close within three minutes, without searching through screens or improvising claims.

**Why this priority**: The primary judging experience has the highest competitive leverage.

**Independent Test**: Record three consecutive timed rehearsals from cold start and verify duration,
click sequence, spoken claims, final screen, and recovery behavior.

**Acceptance Scenarios**:

1. **Given** the stage bundle, **When** the presenter follows the primary script, **Then** every click and
   spoken claim matches the live product and completes within three minutes.
2. **Given** a judge requests manual tampering, **When** the presenter switches to the extended path,
   **Then** the judge can enter a value and see deterministic verification without disturbing the timed path.

### User Story 2 - Remember One Insight (Priority: P1)

As a tired judge, I can retell Ahd in one sentence and recall one on-screen data insight an hour later.

**Independent Test**: Show the pitch to reviewers without context; after one hour, collect unaided recall
of the bank role, proof moment, and data insight.

**Acceptance Scenarios**:

1. **Given** the primary path, **When** the settlement insight appears, **Then** its headline is readable,
   sourced, and clearly distinguishes measured national context from synthetic model output.
2. **Given** the final close, **When** the presentation ends, **Then** the proof or mercy visual remains on
   screen rather than returning to a generic home view.

### User Story 3 - Recover Without Losing the Room (Priority: P2)

As presenter, I can recover from app, terminal, projector, or timing failure using current fallback
assets and a short alternate script.

**Independent Test**: Inject each listed failure during rehearsal and complete the fallback within 30 seconds.

**Acceptance Scenarios**:

1. **Given** the live app fails, **When** fallback is invoked, **Then** current screenshots preserve the
   narrative and disclose that the live path is unavailable.
2. **Given** time is cut to 90 seconds, **When** the emergency script is used, **Then** the spine, proof,
   insight, and ask remain intact.

### Edge Cases

- The approved Arabic font is unavailable before freeze.
- Projector rendering changes contrast or line wrapping.
- A judge wants to type during the 25-second cold open.
- The terminal gate is slow or a process-presence check is stale.
- Team names or official slide template arrive late.
- A measured data claim changes after deck screenshots are captured.

## Requirements

### Functional Requirements

- **FR-001**: The primary script MUST fit within 180 seconds at rehearsed speaking pace.
- **FR-002**: Every primary-path action MUST name the exact visible control and expected outcome.
- **FR-003**: The path MUST include tamper detection, mercy-first identity, one data insight, and a closing ask.
- **FR-004**: The primary path MUST avoid human typing when it materially raises stage-failure risk.
- **FR-005**: A judge-driven tamper path MUST remain available in the extended or question path.
- **FR-006**: Every numeric claim MUST link to its evidence grade and source.
- **FR-007**: Synthetic model output MUST be labeled on the same screen as the result.
- **FR-008**: Judge-path screens MUST meet readable Arabic contrast, hierarchy, and target-size requirements.
- **FR-009**: A font change MUST use an approved redistributable license and include a system fallback.
- **FR-010**: Deck, screenshots, fallback media, script, and product labels MUST remain synchronized.
- **FR-011**: The stage bundle MUST include primary, extended, emergency, and failure-recovery paths.
- **FR-012**: A six-lens review MUST score evidence, identify the weakest moment, and record remediation.
- **FR-013**: Any unconfirmed external approval MUST be phrased as a request or pending validation.
- **FR-014**: The final visual MUST reinforce the chosen memorable idea.

### Key Entities

- **Presentation Beat**: Time box, spoken line, action, expected visual, evidence source, and fallback.
- **Stage Bundle**: Product build, deck, script, media, commands, and manifest.
- **Judge Claim**: Text, evidence grade, source, owner, and allowed phrasing.
- **Rehearsal Result**: Duration, errors, recovery time, recall result, and reviewer score.
- **Fallback Path**: Trigger, asset sequence, alternate narration, and recovery endpoint.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Three consecutive cold-start rehearsals complete in 165-180 seconds.
- **SC-002**: Rehearsals contain zero missed clicks, stale labels, or unsupported claims.
- **SC-003**: Every injected failure reaches a coherent fallback in under 30 seconds.
- **SC-004**: 100% of numeric claims have an evidence grade and traceable source.
- **SC-005**: At least 80% of blind reviewers recall the bank-witness sentence after one hour.
- **SC-006**: At least 70% of blind reviewers recall the chosen data insight after one hour.
- **SC-007**: Every judge-visible surface scores at least 8/10 after remediation or retains a named blocker.
- **SC-008**: The stage bundle reproduces offline on the presentation machine.

## Assumptions

- The canned tamper control remains the timed-path default; judge typing is offered afterward.
- If no licensed font arrives, readability fixes use the existing system stack without unapproved downloads.
- External validation from Wave 2 enters the pitch only after evidence is received and reviewed.
- Competition work freezes before production or v2 implementation begins.

