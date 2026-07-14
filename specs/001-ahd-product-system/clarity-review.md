# Ahd Master Specification — Clarity Review

**Review date:** 2026-07-14  
**Reviewed against:** Current repository, Graphify graph, project constitution, decision
register, open items, Judge Lens, product surfaces, server, protocol, evidence, and tests

## Outcome

The new master specification is ready for stakeholder review. It replaces the previous
implicit model of “built versus future” with six explicit lifecycle states and connects the
product promise, actors, journeys, requirements, decisions, evidence, and production gates.

No critical ambiguity requires an immediate stakeholder answer. High-impact uncertainty is
preserved as named decision or external gates rather than hidden in vague wording.

## Material Findings From the Second Review

| ID | Severity | Finding | Specification response |
|---|---|---|---|
| CR-01 | High | Capability counts drifted: current registry has 21 screens, while existing prose states 12, 20, or three | Added the complete 21-screen inventory and made the registry authoritative |
| CR-02 | High | Built, planned, demo-only, proposal, and approval-gated behavior were mixed across documents | Added one mandatory lifecycle status per requirement and capability |
| CR-03 | High | The product spine existed as prose but not one complete normative requirement family | Added 18 `SR-` requirements including explicit exclusions and decision gates |
| CR-04 | High | Production readiness was described separately from product intent | Added 15 `PR-` requirements and a dependency table with owners, failure behavior, and closure evidence |
| CR-05 | High | Shariah-sensitive technical behavior could be mistaken for an approved public ruling | Separated built mechanics from D-1, D-3, D-6, D-7, and D-8 framing gates |
| CR-06 | Medium | User authority was distributed across screens and design notes | Added one actors-and-authority table plus transition authority and forbidden transitions |
| CR-07 | Medium | Data evidence grades and synthetic labels were judge artifacts, not product requirements | Added 15 `DR-` requirements and evidence-focused acceptance scenarios |
| CR-08 | Medium | Judge integrity was a process rule but not part of product readiness | Added 10 `JR-` requirements and measurable rehearsal/claim-integrity outcomes |
| CR-09 | Medium | Current implementation evidence did not map cleanly to requirement families | Added an ID-ranged current-evidence matrix |
| CR-10 | Medium | Agreement identifier and lifecycle enum remain unresolved | Isolated the gap as `NFR-015`, `PR-011`, and `OT-IDSTATE`; no format was invented |
| CR-11 | Medium | “Approved evidence” could be interpreted loosely | Defined attributable, dated closure artifacts and explicitly rejected drafts, simulations, and verbal expectations |
| CR-12 | Low | Accessibility touch-target language was vague | Quantified the current requirement at 44 by 44 CSS pixels |

## Improvements Already Applied

- Created an Ahd constitution with eight non-negotiable principles.
- Synchronized Spec Kit specification, plan, and task templates.
- Defined 10 independently testable user stories with acceptance scenarios.
- Defined 128 unique normative requirements:
  - 50 functional;
  - 18 spine and Shariah;
  - 20 non-functional;
  - 15 data and evidence;
  - 15 production readiness;
  - 10 judge-visible.
- Defined 13 measurable success criteria.
- Defined 21 current screens, 21 domain entities, semantic transitions, and forbidden
  transitions.
- Linked every decision-gated requirement to the decision register.
- Added a 24-item specification validation checklist and a 47-item formal review checklist.
- Removed all placeholders and clarification markers.

## Remaining Improvements for Planning

These are not specification-writing defects. They are planned design, external, or evidence
work and must remain visible:

1. Resolve `OT-IDSTATE`: choose one agreement identifier format and one binding state enum.
2. Produce the technical data model, schemas, invariants, and versioning rules.
3. Define contracts for product surfaces, Open-Witness, local server, and production seams.
4. Produce a formal threat model and separate rate-limit, abuse, audit, privacy, recovery,
   custody, and incident requirements into executable tasks.
5. Approve measurable production SLOs for availability, latency, capacity, RTO, and RPO.
6. Close D-1, D-3, D-6, D-7, and D-8 with qualified Shariah review.
7. Close `OT-VAL` and `OT-CITE` with regulator, provider, and counsel evidence.
8. Field `OT-A1` research before claiming Saudi relational demand or traction.
9. Reconcile stale product documentation against the new specification without editing the
   frozen demo.
10. Generate the requirement-to-task coverage matrix and run cross-artifact analysis after
    planning.

## Validation Snapshot

- Registered screen inventory: 21.
- Navigator feature-unit inventory: 35.
- Normative requirements: 128 unique declarations.
- Success criteria: 13.
- Placeholders or clarification markers: 0.
- Specification quality checklist: 24 of 24 passing.
- Formal reviewer checklist: 47 items ready for independent review.

## Judge Lens Review

This specification is a review artifact, not the timed presentation. Scores assess whether it
strengthens a judge-visible explanation without changing product behavior.

| Criterion | Score | Evidence |
|---|---:|---|
| Innovation | 8.0 | Makes mercy-first netting, independent witnessing, and refusal to score explicit product requirements rather than isolated claims |
| Technical implementation | 9.0 | Separates frozen core, app, independent protocol, local service, production seams, invariants, and current evidence |
| Data use | 8.5 | Requires evidence grades, synthetic labels, privacy floors, model ranges, geography, period, and no-leak behavior |
| User experience | 8.0 | Defines actor authority, 10 end-to-end journeys, dignity rules, accessibility, RTL, recovery, and explicit exclusions |
| Feasibility | 8.5 | Converts production ambition into dependency-ordered regulatory, Shariah, identity, timestamp, custody, hosting, security, and pilot gates |

No criterion is below 8. No new `JL-` item is required for this specification artifact.
