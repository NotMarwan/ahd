# Wave 0 Recovery Drill

This runbook restores and validates one immutable candidate without using the parked source workspace.

## Two-commit lifecycle

1. Candidate-content commit `A` contains every reviewed release path except the final attestation.
2. Attestation commit `B` descends from `A` and adds only the final manifest and declared attestation metadata.
3. A clean detached checkout of `A` is the validation target.
4. A separate clean detached checkout of `B` supplies the tracked manifest and any declared bundle sources.
5. Wave 0 does not tag, push, release, overwrite, or clean up external state.

## Canonical interface

```powershell
node tests/release-gate.cjs --manifest _meta/freeze/2026-07-15-release-manifest.json --target <candidate-A-checkout> --attestation-root <attestation-B-checkout>
```

`--manifest` is repository-relative for final validation and resolves only beneath the attestation checkout.

`--target` must be a clean checkout whose `HEAD` equals candidate commit `A`.

`--attestation-root` must be a clean checkout whose `HEAD` equals attestation commit `B`, which strictly descends from `A`.

An external absolute draft manifest is accepted only while its status is `draft`; it cannot authorize release or final attestation.

## Recovery procedure

1. Read `A` and `B` from the finalized manifest and attestation history; never infer either from the parked source workspace.
2. Create separate detached worktrees for exact commits `A` and `B`.
3. Verify both worktrees have no tracked or staged changes and that their resolved `HEAD` values match the manifest identities.
4. Read governed inputs through their Git trees. Reject an untracked shadow or checkout byte mismatch.
5. Restore only assets declared as `attestation-bundle`, only from their tracked source paths under `_meta/freeze/bundles/`, and only to exact declared `restore_to` paths. If none are declared, restore nothing.
6. Run the canonical command once and require every focused control plus the full product gate to pass.
7. Record the resolved `A`, `B`, manifest blob SHA-256, exact gate output, and elapsed time. The elapsed recovery must be below 15 minutes.

## Evidence record

| Field | Result |
|---|---|
| Candidate `A` | pending T030 |
| Attestation `B` | pending T031 |
| Manifest blob SHA-256 | pending T032 |
| Restored outputs | pending T032; exact declared set only |
| Release gate | pending T032 |
| Elapsed recovery | pending T032; must be `< 15 minutes` |
| Two normalized stage preflights | pending T033 |
| Frozen demo and generated engine | pending T034 |

No tag, push, release, overwrite, cleanup, Shariah ruling, or substantive owner decision is authorized by this drill.
