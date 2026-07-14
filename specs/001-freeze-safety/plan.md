# Implementation Plan: Freeze Safety and Truth

**Branch**: `codex/wave0-freeze-safety-main` | **Date**: 2026-07-15 | **Spec**: [spec.md](spec.md)

## Summary

Build Wave 0 on a fresh worktree based on integrated `main` at `ff2de0e`, with the reviewed master-spec
and portfolio planning commits applied. Establish binding agent governance first, then add test-first release
controls, truthful current-state parsing, a portable tracked tripwire, deterministic stage preflight, and a
non-self-referential candidate attestation. No product-domain or golden logic changes.

## Technical Context

**Language/Version**: Node.js 20-compatible CommonJS; PowerShell 5.1+; Markdown
**Primary Dependencies**: Node built-ins and Git only
**Storage**: Repository Markdown/JSON attestations plus ignored runtime claim files
**Testing**: Existing Node harness, focused red-green suites, mandatory release wrapper
**Target Platform**: Windows stage machine and clean Git checkout
**Project Type**: Release engineering, agent governance, and documentation control
**Performance Goals**: Preflight under 30 seconds; recovery under 15 minutes; full gate excluded from preflight budget
**Constraints**: Sequential writers; non-destructive; offline; frozen demo untouched; no unrelated staging
**Scale/Scope**: One candidate commit, one later attestation, every dirty path, every agent writer, all governed claims

## Global Constraints

- Ahd witnesses, seals, settles, and nets; it never lends, judges, charges on the loan, scores credit, or issues a fatwa.
- `demo/index.html` remains byte-identical to `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`.
- Golden functions, vectors, and `app/engine.js` internals are called or regenerated only through existing approved paths, never edited here.
- Logic remains deterministic, offline, and integer-halala; no assertion is weakened.
- Pre-existing user work is inventoried and preserved. No cleanup, overwrite, tag, push, or release occurs without scoped named approval.
- One writer task is active at a time. Read-only audits may run concurrently. Every checked task requires evidence, independent review, and a constitution result.
- Live code and command output govern current-state facts; historical statements remain explicitly historical.
- T001-T010 use one controller-owned exclusive bootstrap claim in the shared Git common directory. It expires
  after T010 or at 2026-07-15 end-of-day and is removed only after T010 is reviewed and checked; T011 is the first
  separately issued helper claim.
- To prevent every subagent from colliding on shared status files, root owns a temporary session-sync exception:
  interim truth lives in task evidence, expiry is T036/2026-07-15, and T035 finalizes all canonical/cockpit mirrors.

## Constitution Check

- [x] Spine unaffected; no Shariah behavior or ruling changes.
- [x] Frozen demo, generated engine, functions, and vectors untouched.
- [x] Determinism, integer money, offline behavior, privacy, and evidence labels preserved.
- [x] TDD, focused RED/GREEN evidence, independent review, and full release verification planned.
- [x] Judge-visible preflight, recovery, and claim evidence planned.
- [x] Dirty user changes and cockpit synchronization handled explicitly.
- [x] Human gates are scoped by operation and fail closed.

## Project Structure

```text
AGENTS.md
CLAUDE.md
project/agent-control/
├── claim.cjs
└── protected-paths.json
tests/
├── agent-governance.cjs
├── agent-governance.test.cjs
├── release-manifest.cjs
├── release-manifest.test.cjs
├── release-truth-check.cjs
├── release-truth-check.test.cjs
├── release-gate.cjs
├── stage-preflight.cjs
├── stage-preflight.test.cjs
└── fixtures/demo.sha256
_meta/agent-presence/
└── README.md
_meta/freeze/
├── 2026-07-15-change-inventory.md
├── 2026-07-15-current-state.md
├── 2026-07-15-release-manifest.json
├── 2026-07-15-recovery-drill.md
└── 2026-07-15-task-evidence.json
```

Git common directory (shared by every worktree):

```text
ahd-agent-control/
├── writer.lock             # exclusive JSON claim; one writer globally
├── audits/                 # read-only claims
└── dispatches/             # controller-issued immutable dispatch records
```

**Structure Decision**: Agent claims and dispatches are atomic runtime records under the shared Git common
directory, not worktree-local files or a second hand-edited presence authority.
Candidate content and its attestation are separate commits so the manifest can name an immutable earlier commit.

## Authority and Agent Protocol

Every supported agent reads and obeys, in order:

1. `.specify/memory/constitution.md`;
2. recorded human decisions and scoped operator approvals;
3. `docs/superpowers/plans/2026-07-14-project-improvement-portfolio.md`;
4. `.specify/feature.json`;
5. the active `spec.md`;
6. the active `plan.md`;
7. the active `tasks.md`;
8. live code and gate evidence for current-state facts;
9. status and cockpit mirrors.

Conflict means stop and reconcile; agents never choose silently. A controller dispatch binds issuer, agent,
active wave, real task, exact authorized files, caller-supplied explicit-offset time, constitution version, and
dispatch hash. The single global writer lock is created exclusively after dispatch validation, is visible across
all worktrees, and rejects any second writer even when files are disjoint. File paths are case-insensitive on
Windows, slash-normalized, constrained to the task's files, and reject protected paths or ancestor/descendant
ambiguity. Until T010 activates the tested helper, the same fields live in the exclusive bootstrap lock and
external task brief/report files.

This is a cooperative-controller boundary, not an operating-system security boundary. The dispatch hash proves
byte integrity and field consistency; it cannot authenticate one same-user process against a malicious peer with
equal filesystem rights. Root creates the dispatch and invokes claim creation before spawning a writer. Writers
never self-issue or self-claim. Validation fails on missing, unissued, field-mismatched, or hash-mismatched records.

`project/agent-control/protected-paths.json` is the tracked source of exact and prefix protections. Exact entries
cover `demo/index.html`, `app/engine.js`, `.specify/memory/constitution.md`, `tests/golden-vectors.json`, the archived
golden-vector mirror, and `tests/fixtures/demo.sha256`; a prefix entry covers `protocol/fixtures/`. Its only Wave 0
exception permits T015 to add or update the tracked checksum; no Wave 0 task may edit the other protected paths.

Task evidence binds dispatch hash, implementer, controller, commit range, focused RED/GREEN output, an append-only
`reviews[]` history, and constitution result. Each tracked review entry names its tracked artifact and hash,
reviewed commit, verdict, caller-supplied timestamp, and the prior review it supersedes. Reviewer and implementer
must differ. Rejections remain in history; completion requires a later approval that supersedes the latest rejection.
Completion compares the new array with the evidence file at `HEAD` and requires the prior array to remain an exact
prefix. Review artifact paths are create-once; overwriting or deleting an earlier artifact fails validation.

The controller-only `complete` operation is fail-safe: while holding the writer lock it validates the full review
chain and reviewer independence, atomically writes the tracked review artifact, atomically writes/renames the
evidence record, then atomically writes/renames the tasks checkbox. Interruption after evidence leaves the task
safely unchecked; a checked task can never exist without evidence. Active claims automatically authorize only the
task's review artifact, evidence file, and checkbox file in addition to the dispatch's task files.

## Bootstrap Procedure

Before T001, root creates `ahd-agent-control/writer.lock` under the absolute Git common directory using exclusive
`FileMode.CreateNew`. The JSON payload names owner `root`, active Wave 0, scope `T001-T010`, external dispatch/report
directory, explicit expiry `2026-07-15T23:59:59+03:00`, and rollback `release only after reviewed T010 is checked`.
For schema `ahd-bootstrap-writer-v1`, `scope` is a closed inclusive two-endpoint interval: `['T001','T010']`
authorizes every zero-padded task ID from T001 through T010. It is not a two-item allowlist. Bootstrap validation
must reject malformed endpoints, reversed ranges, non-zero-padded IDs, and any task outside that interval.
Existing lock creation fails without overwrite. Each T001-T010 implementer receives one controller-authored external
dispatch file with exact task and files before it is spawned. T010 is completed and checked under the bootstrap
lock; only then does the controller delete its owned bootstrap lock. The controller separately issues the first
helper dispatch and claim for T011. This runtime lock is outside every worktree and never committed.

PowerShell 5.1-compatible creation pattern:

```powershell
$common = (git rev-parse --path-format=absolute --git-common-dir).Trim()
$control = Join-Path $common 'ahd-agent-control'
New-Item -ItemType Directory -Force -Path $control | Out-Null
$lock = Join-Path $control 'writer.lock'
$payload = '{"schema":"ahd-bootstrap-writer-v1","owner":"root","wave":"specs/001-freeze-safety","scope":["T001","T010"],"dispatch_root":".superpowers/sdd/wave0","expires_at":"2026-07-15T23:59:59+03:00","rollback":"root releases only after reviewed T010 is checked; T011 starts helper claims"}'
$bytes = [Text.Encoding]::UTF8.GetBytes($payload)
$stream = [IO.File]::Open($lock, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
try { $stream.Write($bytes, 0, $bytes.Length) } finally { $stream.Dispose() }
```

## Candidate and Attestation Lifecycle

1. Park every actively changing source worktree as a whole, read-only and outside candidate inputs. Inventory the
   isolated candidate's exact base diff and planned Wave 0 outputs without copying or reconciling source dirt.
2. Implement and review controls and current-truth corrections.
3. Keep the draft manifest outside Git with pending gate fields; verify the parked source remains excluded, stage
   only reviewed candidate-content paths, and create candidate commit `A` after independent cached-diff review.
4. Re-run candidate controls against exact commit `A`, finalize the canonical command and structured input roles,
   and commit the manifest as attestation commit `B`.
5. Export the manifest and bundle root from a clean checkout of `B`. In a separate clean checkout of `A`, restore
   only declared generated assets and run the release gate with the repository-relative manifest, target, and
   attestation-root paths. The gate reads final governed bytes from the immutable `A`/`B` Git trees and emits their
   resolved identities.
6. Record recovery and preflight evidence in later metadata commits. Any release tag targets `A`, only after
   separate named approval; this plan creates no tag and performs no push.

This avoids asking a committed file to contain the hash of the commit that contains itself.

## Phase 0 Research

See [research.md](research.md). Decisions: integrated `main` is the candidate base; active Wave 0 is pinned;
atomic claims are canonical; live sources govern truth; a tracked checksum replaces workstation-only tripwire
state; candidate and attestation commits are separate; release operations remain explicit human gates.

## Phase 1 Design

- Data model: [data-model.md](data-model.md)
- Release contract: [contracts/release-manifest.md](contracts/release-manifest.md)
- Validation: [quickstart.md](quickstart.md)
- Ordered execution: [tasks.md](tasks.md)

## Human Gates

- `D-4` remains the frozen-demo decision. `INN-D4` is only an identifier namespace for the separate innovation note; its substance remains pending Marwan.
- No task approves a Shariah question, vendor, identity rail, timestamp provider, deployment, field result, release, tag, push, overwrite, or cleanup.
- Candidate construction needs reviewed inventory evidence. External actions need a separate scoped named approval object.

## Complexity Tracking

The extra agent validator, release wrapper, and attestation commit exist because three proven failure modes cannot
share one loose script: wrong-wave dispatch, path-collision edits, and self-referential release metadata. Each
file has one responsibility and uses Node/Git built-ins only.
