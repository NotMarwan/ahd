# Wave 0 Change Inventory Capture

**Task**: T001

**Dispatch**: `wave0-T001-20260715-010900`

**Planning commit at capture**: `78217709334e1300859f3f4335a073b92aa764b1`

**Active package**: `specs/001-freeze-safety`

**Capture window**: 2026-07-15 01:13-01:16 +03:00

This is a point-in-time factual capture taken before this repository file was written. It records status, topology,
gate, and frozen-demo evidence only. T002 owns path-by-path dispositions and the canonical inventory JSON; no item
is classified here.

## Observed Workspaces

| Role | Absolute path | Branch | HEAD at capture |
|---|---|---|---|
| User source, Git-visible state observed read-only | `C:\Users\wasan\Downloads\Amad Hackathon\Amad Hackathon` | `judge-lens-real-leap` | `c08089061a0fa08ec8a78f6217be601f3558477e` |
| Isolated Wave 0 candidate | `C:\Users\wasan\Downloads\Amad Hackathon Worktrees\wave0-freeze-safety-main` | `codex/wave0-freeze-safety-main` | `78217709334e1300859f3f4335a073b92aa764b1` |

No pre-existing or Git-visible source content, index, branch, stash, or worktree state changed. Controller-authorized
ignored evidence and report files were created under `.superpowers/sdd/wave0`. Re-running the NUL-safe source
status command after implementation produced the same 41,517 bytes and SHA-256
`485057fe9f45f02a076c0a86f231d695a6a542001b68681a6b694a4a2a1ef6f9` as the pre-write capture.

## NUL-Safe Status Capture

Both snapshots came from this exact command, with `--untracked-files=all` so untracked directories were expanded
to individual files:

```powershell
git status --porcelain=v1 -z --branch --untracked-files=all
```

The authoritative bytes are preserved outside Git beneath:

```text
C:\Users\wasan\Downloads\Amad Hackathon\Amad Hackathon\.superpowers\sdd\wave0
```

| Workspace | Branch record | Dirty records | Status-code counts | Raw bytes | SHA-256 |
|---|---|---:|---|---:|---|
| Source | `## judge-lens-real-leap...origin/judge-lens-real-leap [ahead 7]` | 650 | ` M` = 12; `??` = 638 | 41,517 | `485057fe9f45f02a076c0a86f231d695a6a542001b68681a6b694a4a2a1ef6f9` |
| Candidate | `## codex/wave0-freeze-safety-main` | 0 | none | 34 | `6d82775f541372ab521920b45261a74809ebc2c9fe1e97ee41f044b3cdc8b06d` |

Raw files:

- `wave0-T001-source-status.porcelain-v1.z`
- `wave0-T001-candidate-status.porcelain-v1.z`

All 650 source status records are unique. The raw NUL-delimited files, not a line-oriented rendering, are the
source of truth for T002 path expansion and classification.

## Git Topology

### Divergence

| Comparison | Exact command result | Meaning |
|---|---|---|
| Candidate `main...HEAD` | `0  3` | candidate has no main-only gap and is three commits ahead of `main` |
| Source `main...HEAD` | `14  7` | source and integrated `main` have diverged: 14 main-only and 7 source-only commits |

The integrated candidate base is:

```text
ff2de0e3fb85b501f82a8539549f5b1e55e80453
```

The three candidate commits over that base at capture were:

```text
7821770 docs(plan): harden Wave 0 execution contract
1d97431 docs(plan): add full Ahd improvement portfolio
9d265a1 docs(spec): add Ahd master product specification
```

### Recent source commits

The first ten of the 25 captured source commits were:

```text
c080890 docs(spec): complete Ahd master planning package
952fe11 docs(plan): add full Ahd improvement portfolio
c83fb2c docs(spec): add Ahd master product specification
707ceff chore(git): ignore local worktrees
6439f40 docs(brand): plan three paper-covenant logo concepts
f1da62a docs(brand): specify paper-covenant logo directions
9d6cf07 docs(spec): design Ahd master specification system
1ab1bc8 docs(judge): refresh evidence deck script and screenshot
3628f42 feat(app): add impact evidence ladder
3257d22 docs(design): plan hash-tracked Figma baseline transfer
```

### Recent candidate commits

The first ten of the 25 captured candidate commits were:

```text
7821770 docs(plan): harden Wave 0 execution contract
1d97431 docs(plan): add full Ahd improvement portfolio
9d265a1 docs(spec): add Ahd master product specification
ff2de0e docs(meta): record roadmap delivery and judge review
0fed89b fix(app): enforce care workflow actor boundaries
2bbb742 test(gate): support clean archive verification
6a0cae2 docs(gate): refresh integrated assertion counts
21e1746 feat(ux): harden Arabic typography and rehearsal assets
b64b6e9 feat(app): add bounded care workflows
277be21 feat(protocol): add second deterministic issuer fixture
```

The full 25-commit histories, source-only and main-only lists, and every local/remote branch head are in
`wave0-T001-git-context.txt`.

### Shared worktrees

| Worktree | Branch | HEAD |
|---|---|---|
| Source root | `judge-lens-real-leap` | `c08089061a0fa08ec8a78f6217be601f3558477e` |
| `.worktrees/ahd-paper-logo` | `codex/ahd-paper-logo` | `03a2dcc661d8b067dd7dc4e7b08ab614cdd02e9c` |
| `.worktrees/wave0-freeze-safety` | `codex/wave0-freeze-safety` | `952fe11bf29e9594890833b61c8267d9450fcaa5` |
| External `figma-baseline-ui` | `codex/figma-baseline-ui` | `80ddfa48cdeec6d88ddc5cfb91d52255f6264ea9` |
| External `roadmap-evidence` | `codex/roadmap-evidence` | `10867c339c806a3ab29f222dacfccfee737fc8a5` |
| External `roadmap-integration` | `codex/roadmap-integration` | `db16909c4ef6a801c5d27a1362298d4f81ce3d56` |
| External `roadmap-product` | `codex/roadmap-product` | `a5c364421061f929ec0958249286f41ba3176d3b` |
| External `roadmap-safety` | `codex/roadmap-safety` | `51f95459c59ec4d6a5fc4f44d84699b567bfee36` |
| External `wave0-freeze-safety-main` | `codex/wave0-freeze-safety-main` | `78217709334e1300859f3f4335a073b92aa764b1` |

This table records existence and identity only. T001 does not select, merge, clean, or dispose of any branch or
worktree.

### Relevant branch heads

These are the complete local and remote branch refs visible in the repository at capture time. No fetch was run.

| Ref | HEAD |
|---|---|
| `refs/heads/codex/wave0-freeze-safety-main` | `78217709334e1300859f3f4335a073b92aa764b1` |
| `refs/heads/codex/ahd-paper-logo` | `03a2dcc661d8b067dd7dc4e7b08ab614cdd02e9c` |
| `refs/heads/judge-lens-real-leap` | `c08089061a0fa08ec8a78f6217be601f3558477e` |
| `refs/heads/codex/roadmap-integration` | `db16909c4ef6a801c5d27a1362298d4f81ce3d56` |
| `refs/heads/codex/wave0-freeze-safety` | `952fe11bf29e9594890833b61c8267d9450fcaa5` |
| `refs/heads/main` | `ff2de0e3fb85b501f82a8539549f5b1e55e80453` |
| `refs/heads/codex/figma-baseline-ui` | `80ddfa48cdeec6d88ddc5cfb91d52255f6264ea9` |
| `refs/heads/codex/roadmap-product` | `a5c364421061f929ec0958249286f41ba3176d3b` |
| `refs/heads/codex/roadmap-evidence` | `10867c339c806a3ab29f222dacfccfee737fc8a5` |
| `refs/heads/codex/roadmap-safety` | `51f95459c59ec4d6a5fc4f44d84699b567bfee36` |
| `refs/remotes/origin/codex/roadmap-integration` | `9e0ca640faff4990524c825530f3f38017f81ac5` |
| `refs/remotes/origin/main` and `refs/remotes/origin/HEAD` | `ff2de0e3fb85b501f82a8539549f5b1e55e80453` |
| `refs/remotes/origin/judge-lens-real-leap` | `1ab1bc86240e00872380b52869155141a8472a35` |

## Frozen Demo Hash

Direct PowerShell SHA-256 was computed from the file bytes in both workspaces:

| Workspace | Bytes | SHA-256 | Pinned match |
|---|---:|---|---|
| Source | 102,352 | `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40` | yes |
| Candidate | 102,352 | `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40` | yes |

The two workspaces match each other and the constitutional pin. Evidence: `wave0-T001-demo-hashes.txt`.

## Live Full Gate

Executed from the isolated candidate at planning commit `78217709334e1300859f3f4335a073b92aa764b1`:

```powershell
node tests/run-all.cjs
```

Result: exit code `1`; measured wrapper duration `15,600 ms`.

```text
core logic   135 passed, 0 failed
offline        9 passed, 0 failed
dom smoke     40 passed, 0 failed
structure     14 passed, 0 failed
app suites  2780 passed, 1 failed
no-drift      11 passed, 1 failed (meta; not in product total)
smoke-live     passed
tripwire       FAILED

AHD GATE  2978 passed, 1 failed
```

This is the expected pre-repair Wave 0 baseline, not a green completion claim. The focused portability suite
reported `15 passed, 1 failed`; the failing assertion was `verifies the frozen demo hash in this checkout`.
Direct tripwire execution reported `ENOENT` for:

```text
_overnight/backup/demo.sha256
```

The checksum exists in the source workspace but not in the clean candidate. Git confirms the path is absent from
tracked files and ignored by `.gitignore:19` through `_overnight/backup/`. The direct demo hash remains correct, so
the failure is checksum portability, not demo-byte drift. T014-T015 own the test-first repair; T001 does not alter
the tripwire, checksum, or demo.

Full output and root-cause commands are preserved in:

- `wave0-T001-gate-output.txt`
- `wave0-T001-gate-stderr.txt`
- `wave0-T001-tripwire-root-cause.txt`

## External Evidence Index

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `wave0-T001-source-status.porcelain-v1.z` | 41,517 | `485057fe9f45f02a076c0a86f231d695a6a542001b68681a6b694a4a2a1ef6f9` |
| `wave0-T001-candidate-status.porcelain-v1.z` | 34 | `6d82775f541372ab521920b45261a74809ebc2c9fe1e97ee41f044b3cdc8b06d` |
| `wave0-T001-git-context.txt` | 11,273 | `742e97c854506baf7948980bf0565ccf6aff22c3d3e4ce29578895c2fd59b598` |
| `wave0-T001-demo-hashes.txt` | 629 | `06510929fb6d2695b949a5ad09063eb49fbc76c2fc9172e5cddea19e702786ba` |
| `wave0-T001-gate-output.txt` | 848 | `16478a5257cc1a784326cfe04f3d3fb20fe73232e0a13109003128c632c9eb13` |
| `wave0-T001-gate-stderr.txt` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `wave0-T001-tripwire-root-cause.txt` | 1,751 | `bd60cce92ba2f717b356758b08d5a02601cfa0f7e02192aad21a38a7cb5dfda3` |
| `wave0-T001-evidence-index.txt` | 1,513 | `7f800d56eff6c95c236979d953a96dff76c26a9fd6a7bc0c2df3fcd348d93849` |

The external evidence directory is intentionally outside the candidate Git tree and is not release content.

## T001 Boundary

- Captured before repository mutation: yes.
- Source boundary: no pre-existing or Git-visible source content, index, branch, stash, or worktree state changed;
  controller-authorized ignored evidence/report files were created under `.superpowers/sdd/wave0`; source
  Git-status bytes remained unchanged.
- Product, demo, engine, vectors, task checkboxes, evidence JSON, reviews, and cockpit mirrors modified: no.
- Branch merge, stash, cleanup, overwrite, tag, push, or release performed: no.
- Item dispositions assigned: no; T002 remains responsible.
+
## T002 Normalized Candidate Inventory

The changing source workspace is parked as one excluded epoch. No dirty source path is copied or reconciled.
The integrated master-planning commits are patch-equivalent (`git patch-id --stable` = `b0075f3f39e03c2541f0c28990e309a7fbf64742`).

```json
{
  "schema": "ahd-freeze-inventory-v1",
  "approved_base_commit": "ff2de0e3fb85b501f82a8539549f5b1e55e80453",
  "active_package": "specs/001-freeze-safety",
  "source_workspace": {
    "disposition": "park-whole-workspace",
    "candidate_input": false
  },
  "items": [
    {
      "path": "_meta/agent-presence/README.md",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T008",
      "candidate_input": true
    },
    {
      "path": "_meta/freeze/2026-07-15-change-inventory.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "_meta/freeze/2026-07-15-current-state.md",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T003",
      "candidate_input": true
    },
    {
      "path": "_meta/freeze/2026-07-15-recovery-drill.md",
      "origin": "planned-T003-T030",
      "disposition": "generated",
      "owner": "T027",
      "candidate_input": true
    },
    {
      "path": "_meta/freeze/2026-07-15-release-manifest.json",
      "origin": "planned-T003-T030",
      "disposition": "generated",
      "owner": "T031",
      "candidate_input": false
    },
    {
      "path": "_meta/freeze/2026-07-15-task-evidence.json",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "_meta/freeze/reviews/T001/review-001.json",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "_meta/INDEX.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "_meta/OPEN-ITEMS.md",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T023",
      "candidate_input": true
    },
    {
      "path": "_meta/overnight-log.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "_meta/score-leap-loop-state.md",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T022",
      "candidate_input": true
    },
    {
      "path": "_meta/STATUS.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": ".dockerignore",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": ".gitignore",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": ".specify/feature.json",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": ".specify/memory/constitution.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": ".specify/templates/plan-template.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": ".specify/templates/spec-template.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": ".specify/templates/tasks-template.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "AGENTS.md",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T008",
      "candidate_input": true
    },
    {
      "path": "AmadHackathon/00 Home.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "AmadHackathon/01 الخطة الرئيسة.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "AmadHackathon/05 حالة المشروع.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "AmadHackathon/10 المواصفة الأم.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "AmadHackathon/11 خطة التحسين الشاملة.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "CLAUDE.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "docs/ARCHITECTURE.md",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T021",
      "candidate_input": true
    },
    {
      "path": "docs/session-report-2026-07-13-ar.md",
      "origin": "planned-T022",
      "disposition": "release",
      "owner": "T022",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/plans/2026-07-12-score-leap-master-plan.md",
      "origin": "planned-T022",
      "disposition": "release",
      "owner": "T022",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/plans/2026-07-13-ceiling-break-8-9-plan.md",
      "origin": "planned-T022",
      "disposition": "release",
      "owner": "T022",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/plans/2026-07-13-four-criteria-push.md",
      "origin": "planned-T022",
      "disposition": "release",
      "owner": "T022",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/plans/2026-07-14-ahd-local-server-safety.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/plans/2026-07-14-ahd-production-readiness.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/plans/2026-07-14-ahd-spec-governance.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/plans/2026-07-14-ahd-stage-readiness.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/plans/2026-07-14-project-improvement-portfolio.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/specs/2026-07-14-ahd-master-specification-design.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "docs/superpowers/specs/2026-07-14-project-improvement-portfolio-design.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "project/agent-control/claim.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T007",
      "candidate_input": true
    },
    {
      "path": "project/agent-control/protected-paths.json",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T007",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/checklists/master-quality.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/checklists/requirements.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/clarity-review.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/contracts/local-server-api.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/contracts/open-witness-v1.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/contracts/product-surfaces.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/contracts/production-seams.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/data-model.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/plan.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/quickstart.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/research.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/spec.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-ahd-product-system/tasks.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-freeze-safety/checklists/implementation-readiness.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-freeze-safety/checklists/requirements.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-freeze-safety/contracts/release-manifest.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-freeze-safety/data-model.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-freeze-safety/plan.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-freeze-safety/quickstart.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-freeze-safety/research.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-freeze-safety/spec.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/001-freeze-safety/tasks.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/002-judge-readiness/checklists/requirements.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/002-judge-readiness/contracts/stage-path.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/002-judge-readiness/data-model.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/002-judge-readiness/plan.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/002-judge-readiness/quickstart.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/002-judge-readiness/research.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/002-judge-readiness/spec.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/002-judge-readiness/tasks.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/003-external-validation/checklists/requirements.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/003-external-validation/contracts/evidence-register.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/003-external-validation/data-model.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/003-external-validation/plan.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/003-external-validation/quickstart.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/003-external-validation/research.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/003-external-validation/spec.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/003-external-validation/tasks.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/004-production-hardening/checklists/requirements.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/004-production-hardening/contracts/service-v1.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/004-production-hardening/data-model.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/004-production-hardening/plan.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/004-production-hardening/quickstart.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/004-production-hardening/research.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/004-production-hardening/spec.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/004-production-hardening/tasks.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/005-v2-product-protocol/checklists/requirements.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/005-v2-product-protocol/contracts/open-witness-v1.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/005-v2-product-protocol/data-model.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/005-v2-product-protocol/plan.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/005-v2-product-protocol/quickstart.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/005-v2-product-protocol/research.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/005-v2-product-protocol/spec.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "specs/005-v2-product-protocol/tasks.md",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "tests/agent-governance.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T007",
      "candidate_input": true
    },
    {
      "path": "tests/agent-governance.test.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T005",
      "candidate_input": true
    },
    {
      "path": "tests/app/tripwire-portability.test.cjs",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "tests/fixtures/demo.sha256",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "tests/release-gate.cjs",
      "origin": "planned-T003-T030",
      "disposition": "generated",
      "owner": "T028",
      "candidate_input": true
    },
    {
      "path": "tests/release-gate.test.cjs",
      "origin": "planned-T028",
      "disposition": "generated",
      "owner": "T028",
      "candidate_input": true
    },
    {
      "path": "tests/release-manifest.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T013",
      "candidate_input": true
    },
    {
      "path": "tests/release-manifest.test.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T011",
      "candidate_input": true
    },
    {
      "path": "tests/release-truth-check.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T024",
      "candidate_input": true
    },
    {
      "path": "tests/release-truth-check.test.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T016",
      "candidate_input": true
    },
    {
      "path": "tests/run-all.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T009",
      "candidate_input": true
    },
    {
      "path": "tests/stage-preflight.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T020",
      "candidate_input": true
    },
    {
      "path": "tests/stage-preflight.test.cjs",
      "origin": "planned-T003-T030",
      "disposition": "release",
      "owner": "T018",
      "candidate_input": true
    },
    {
      "path": "tests/structure-check.cjs",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    },
    {
      "path": "tests/tripwire.cjs",
      "origin": "base-delta",
      "disposition": "release",
      "candidate_input": true
    }
  ]
}
```
