# Quickstart: Freeze Safety and Truth

## Prerequisites

- Repository opened at the candidate branch.
- No cleanup, stash, checkout, tag, or push performed.

## Validate

```powershell
git status --short --branch
node tests/release-manifest.test.cjs
node tests/release-truth-check.cjs
node tests/stage-preflight.cjs
Set-Location tests
node run-all.cjs
```

Expected: all focused checks pass; full banner reports 2,869/0; frozen demo reports the pinned hash.

## Recovery Drill

1. Create a clean checkout at the manifest commit.
2. Restore only manifest-included generated assets.
3. Run focused checks and full gate.
4. Record results in `_meta/freeze/2026-07-15-recovery-drill.md`.
5. Stop before tag or push; obtain operator approval.

