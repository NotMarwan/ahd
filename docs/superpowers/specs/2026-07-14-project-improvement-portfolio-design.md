# Ahd Full-Improvement Portfolio Design

**Date:** 2026-07-14  
**Status:** Approved  
**Owner:** Marwan  
**Mission:** Improve every active project dimension without violating the Ahd spine or risking the
18 July 2026 judging path.

## 1. Problem

Ahd is technically strong and gate-green, but remaining work spans five different delivery systems:
release safety, judge experience, human validation, production engineering, and post-hackathon product
depth. Treating these as one feature would create unclear ownership, mixed decision authority, and a
plan that cannot be tested incrementally.

## 2. Chosen Approach

Use a portfolio of five ordered Spec Kit packages. Each package has its own specification, research,
data model, contracts, quickstart, plan, and dependency-ordered tasks. A portfolio index coordinates
cross-wave gates. Work may proceed in parallel only after shared release-safety foundations are closed.
The portfolio treats `specs/001-ahd-product-system/spec.md` as the parent product specification and
decomposes its planned, decision-gated, and external-gated requirements into executable waves.

Rejected approaches:

- One master feature specification: easier to browse, but too broad for independent acceptance.
- Parallel big-bang delivery: faster in theory, but unsafe with a dirty worktree and human-gated items.

## 3. Portfolio Waves

### Wave 0: Freeze Safety and Truth

Protect user work, reconcile live code with documentation, prove the 2,869/0 gate, freeze stage assets,
and prepare a release candidate without modifying the frozen demo. This wave blocks all judge-visible
or release work.

### Wave 1: Judge Readiness

Create a rehearsed three-minute path, current deck and fallback media, readable Arabic judge-path UI,
one memorable data insight, reliable tamper choreography, and an honest six-lens re-score.

### Wave 2: External Validation

Field primary Saudi demand research, obtain written scholar answers for open Shariah decisions, verify
legal and regulatory claims, validate the commercial model, and seek a bounded pilot signal. Nothing
may be labeled approved or measured before evidence exists.

### Wave 3: Production Hardening

Turn the localhost proof slice into a production-shaped service: formal threat model, rate and size
limits, durable transactional storage, authorization, idempotency, concurrency control, observability,
backup/restore, TLS deployment, privacy controls, and operational runbooks. Golden engine code remains
an imported dependency, never reimplemented.

### Wave 4: V2 Product and Protocol

Resolve and build deferred mechanisms only after their decision gates: full five-property SEAL,
Open-Witness governance and interoperability, approved Circle mode B, borrower-invokable release,
duress and collusion safeguards, canonical identifiers and states, mobile transfer, and evidence-safe
advanced analytics.

## 4. Dependency Model

1. Wave 0 blocks release, stage, and shared-file edits.
2. Wave 1 may run after Wave 0; its rehearsal and freeze outputs are time-critical.
3. Wave 2 begins immediately as human lead-time work, but its claims cannot enter Wave 1 until verified.
4. Wave 3 starts after the competition freeze unless a security defect affects the stage build.
5. Wave 4 starts after relevant Wave 2 decisions and Wave 3 foundations.

The frozen `demo/index.html`, golden engine functions, vectors, and tripwire sit outside every normal
workstream. `OT-PATCH` is a separately approved migration, not ordinary cleanup.

## 5. Component Boundaries

- **Portfolio control:** canonical sequencing, ownership, risks, gate evidence, and cross-wave status.
- **Specifications:** user outcomes, measurable acceptance, scope, and decision gates.
- **Plans:** technical context, file ownership, contracts, and test strategy.
- **Tasks:** TDD-sized execution units with exact paths and dependency markers.
- **Evidence register:** separates measured, modeled, synthetic, estimated, and approved claims.
- **Decision register:** prevents agents from deciding Shariah, golden-vector, vendor, or irreversible
  questions.

## 6. Data and State

Planning state uses stable identifiers:

- `W0` through `W4` for waves.
- `FR-###` and `SC-###` inside each specification.
- `T###` inside each task package.
- Existing `JL-*`, `OT-*`, and `D-*` identifiers remain authoritative and are mapped, never renamed.

Every task has one of four states: `pending`, `ready`, `blocked`, or `complete`. A blocked task names its
owner and required evidence. Human-gated tasks never become complete from code alone.

## 7. Failure Handling

- Gate failure stops release progression; no assertion may be weakened.
- Judge-path failure restores the last green stage bundle; it never patches the frozen demo.
- Missing evidence keeps the claim labeled synthetic, modeled, estimated, or pending.
- Missing scholar or counsel answer keeps the mechanism disabled and the decision open.
- Vendor failure uses a documented fallback; fallback artifacts cannot be represented as production
  integrations.
- Dirty-file collision stops edits to that file until ownership is resolved.

## 8. Verification

Every behavior change follows failing-test-first TDD. Each wave has an independent quickstart. Final
technical verification runs:

```powershell
Set-Location tests
node run-all.cjs
```

Expected result: `AHD GATE` green, 2,869 product assertions, zero failures, demo tripwire intact, live
HTTP parity green. Judge-visible work additionally requires rehearsal evidence and Judge Lens scores.

## 9. Success

The portfolio succeeds when:

- stage release is reproducible and recoverable;
- every live open item is closed, explicitly deferred with owner/date, or blocked by named external
  evidence;
- judge path completes repeatedly within three minutes without missed clicks;
- claims are sourced and correctly labeled;
- production service passes its security, durability, privacy, and recovery acceptance tests;
- approved v2 mechanisms ship without altering the spine or golden engine;
- architecture, status, open items, and cockpit match live code and gate output.

## 10. Self-Review

- Placeholders: none.
- Scope: decomposed into five independently testable packages.
- Contradictions: competition freeze precedes production and v2 changes; human gates remain explicit.
- Ambiguity: “all” means every active `JL-*`, `OT-*`, and `D-*` item is mapped to a wave, including
  external and post-hackathon work; closed historical items are verified, not reopened.
