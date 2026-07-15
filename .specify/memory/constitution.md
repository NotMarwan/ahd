<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Added principles: Spine and Shariah Safety; Frozen Engine and Additive Change;
  Determinism and Money Integrity; Test-First Verification; Judge-Visible Quality;
  Evidence, Privacy, and Claim Honesty; Modular Delivery and Living Documentation
- Added sections: Project Constraints; Development Workflow and Quality Gates
- Removed sections: unresolved template placeholders
- Templates requiring updates:
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: none
-->

# Ahd Project Constitution

## Core Principles

### I. Spine and Shariah Safety

Ahd MUST witness, seal, settle, and net interpersonal benevolent loans without lending bank
money, judging disputes, charging interest or penalties, scoring credit, or issuing AI fatwas.
The system MUST reject riba, penalty, maysir, and material gharar. Trust signals MUST remain
qualitative, based only on the person's own history, never exported, and never used for
underwriting. Unresolved Shariah questions MUST be cited and recorded in
`docs/DECISIONS-FOR-MARWAN.md`; implementation MUST stop at the decision boundary.

### II. Frozen Engine and Additive Change

`demo/index.html` MUST remain byte-identical to the pinned SHA-256
`e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`.
Golden functions and vectors MUST be called, never modified. `app/engine.js` MUST remain a
byte-faithful generated copy of the demo engine slice. New behavior MUST be additive in new or
approved non-golden files. Any proposed engine or vector migration requires explicit Marwan
approval, a recorded decision, new vectors, and a re-pinned tripwire.

### III. Determinism and Money Integrity

Logic MUST use integer halalas, never floating-point money. Logic MUST NOT use `Date.now`,
`new Date`, `Math.random`, `Intl`, `toLocaleString`, or network-dependent computation.
Time-dependent behavior MUST use a fixed injected `AS_OF`. Canonicalization, hashing,
settlement, and netting MUST reproduce identical outputs across runs and surfaces.

### IV. Test-First Verification

Every behavior change MUST begin with a failing test, followed by minimal implementation and a
passing focused test. Existing assertions MUST NOT be weakened or removed to make a change pass.
Before completion, the full gate MUST pass through `cd tests && node run-all.cjs`, including the
demo tripwire, engine parity, offline checks, structure checks, app suites, drift checks, and live
HTTP parity. The live gate banner is the only authoritative assertion count.

### V. Judge-Visible Quality

Before 18 July 2026, work MUST prioritize the three-minute pitch, demo-path screens, on-screen
evidence, and stage reliability. Every judge-visible change MUST be scored against
`docs/JUDGE-LENS.md`. Any criterion or tired-judge score below 8 MUST remain a `JL-` item in
`_meta/OPEN-ITEMS.md`. Technical depth that judges cannot perceive MUST NOT displace higher-impact
stage work before freeze.

### VI. Evidence, Privacy, and Claim Honesty

Measured, modeled, synthetic, estimated, and externally validated claims MUST be labeled
distinctly. Unconfirmed approval, integration, traction, legal interpretation, or Shariah sign-off
MUST NOT be presented as fact. Individual analytics MUST NOT expose scores or identifiable records;
aggregate outputs MUST enforce the documented anonymity floor. Sources MUST be traceable to the
evidence ledger or primary artifact.

### VII. Modular Delivery and Living Documentation

Feature logic MUST remain pure, dependency-injected, deterministic, and Node-testable. Rendering
MUST remain separate from business rules. Server and protocol additions MUST reuse the golden engine
through adapters instead of reimplementing it. Any session changing project state MUST update the
canonical status/open-items documents and the `AmadHackathon/` cockpit without overwriting unrelated
user work. Architecture and gate documentation MUST match live code.

## Project Constraints

- Runtime code MUST remain offline-capable and dependency-minimal unless a dependency or service is
  explicitly approved and recorded.
- `app/` is the publishable product; `demo/` is the frozen presenter fallback.
- `protocol/` MUST remain independently verifiable and MUST NOT import `app/`, `demo/`, or the Ahd
  engine when claiming independent verification.
- Security, privacy, legal, Shariah, and irreversible decisions require an explicit named owner.
- Dirty worktree changes belong to the user unless proven otherwise; automation MUST preserve them.
- Arabic prose and bidirectional content MUST follow repository `AGENTS.md` formatting rules.

## Development Workflow and Quality Gates

1. Read `_meta/INDEX.md`, `_meta/STATUS.md`, `_meta/OPEN-ITEMS.md`,
   `docs/DECISIONS-FOR-MARWAN.md`, and `docs/JUDGE-LENS.md` before planning.
2. Map dependencies through `graphify-out/` before broad code exploration.
3. Write or update an approved specification before implementation.
4. Plan work as independently testable slices with exact file ownership and decision gates.
5. Use red-green-refactor; run focused tests after each slice.
6. Run the full gate and judge lens before claiming completion.
7. Update canonical documentation and cockpit mirrors; commit only intended files.

## Governance

This constitution supersedes generated Spec Kit defaults and lower-authority planning artifacts.
Amendments require a written rationale, semantic-version change, sync-impact review, and explicit
Marwan approval when they affect the spine, Shariah boundaries, golden artifacts, or irreversible
state. Every specification, plan, task list, review, and release MUST include a constitution check.
Non-compliance blocks implementation or release; exceptions require a documented owner, expiry, and
rollback path.

**Version**: 1.0.0 | **Ratified**: 2026-07-14 | **Last Amended**: 2026-07-14
