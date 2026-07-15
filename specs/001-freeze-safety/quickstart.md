# Quickstart: Freeze Safety and Truth

## Preconditions

- Work from `codex/wave0-freeze-safety-main` or a clean checkout of the manifest's candidate commit.
- Confirm `.specify/feature.json` selects `specs/001-freeze-safety`.
- Do not clean, stash, overwrite, tag, push, or release.
- T001-T010 use the controller-owned exclusive bootstrap claim under the Git common directory. Later writers use
  controller dispatch plus the tested global claim helper. Read-only audits do not edit.

## Focused Controls

```powershell
node tests/agent-governance.test.cjs
node tests/release-manifest.test.cjs
node tests/release-truth-check.test.cjs
node tests/stage-preflight.test.cjs
```

## One-Command Release Gate

```powershell
node tests/release-gate.cjs --manifest <repository-relative-manifest> --target <candidate-checkout> --attestation-root <attestation-checkout>
```

Expected: every focused control reports zero failures; the nested live `run-all.cjs` banner reports its current
authoritative assertion count with `/0`; the tracked tripwire reports the pinned demo hash. Do not hardcode a
count in automation or instructions.

## Candidate and Attestation

1. Keep the draft manifest outside Git with pending gate fields.
2. Review and stage candidate-content files only.
3. Obtain independent review of the actual cached diff, then commit candidate content as commit `A`.
4. Run the wrapper against exact `A`; populate verified gate evidence.
5. Prepare and independently review the final manifest bytes with `candidate_commit` equal to `A`; only draft/schema
   prechecks are possible before those bytes are tracked.
6. Commit the final manifest and any declared bundle sources as later attestation commit `B`.
7. From clean `A` and `B` checkouts, run final validation with the exact canonical command and require its resolved candidate,
   attestation, and manifest-blob identities to match the final evidence.
8. Do not tag or push. Those are separate scoped operations requiring named approval.

## Recovery Drill

1. Create a clean attestation checkout at commit `B`; read the finalized manifest and bundle sources there.
2. Create a separate clean target checkout at its earlier `candidate_commit` (`A`).
3. Restore only generated assets whose source root is the clean attestation checkout and whose bytes match.
4. Require both checkouts to be clean, then run the one-command release gate with the repository-relative manifest,
   target, and attestation-root paths. Final inputs are read from the immutable Git trees, not untracked shadows.
5. Run stage preflight twice from fresh PowerShell processes.
6. Remove volatile time/duration fields and require both normalized evidence payloads to be byte-identical.
7. Record elapsed recovery time; require less than 15 minutes.
8. Record exact results in `_meta/freeze/2026-07-15-recovery-drill.md`.
9. Stop. No release, tag, push, overwrite, or cleanup is authorized.
