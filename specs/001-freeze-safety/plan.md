# Implementation Plan: Freeze Safety and Truth

**Branch**: `judge-lens-real-leap` | **Date**: 2026-07-14 | **Spec**: [spec.md](spec.md)

## Summary

Create a non-destructive release inventory, machine-validated release manifest, current-state
documentation checks, unique decision references, and deterministic stage preflight. No product logic changes.

## Technical Context

**Language/Version**: Node.js 20-compatible CommonJS; PowerShell 5.1+; Markdown  
**Primary Dependencies**: Node built-ins and Git only  
**Storage**: Repository Markdown/JSON manifests  
**Testing**: Existing Node harness plus new release-truth and manifest tests  
**Target Platform**: Windows stage machine and clean Git checkout  
**Project Type**: Release engineering and documentation control  
**Performance Goals**: Preflight under 30 seconds excluding the full gate  
**Constraints**: Non-destructive; offline; frozen demo untouched; no unrelated staging  
**Scale/Scope**: One competition candidate, current dirty workspace, all governed docs and stage assets

## Constitution Check

- [x] Spine unaffected; no Shariah behavior changes.
- [x] Frozen demo, generated engine, functions, and vectors untouched.
- [x] Determinism, integer money, offline behavior, privacy, and evidence labels preserved.
- [x] TDD and full gate verification planned.
- [x] Judge-visible stage preflight and evidence planned.
- [x] Dirty user changes and cockpit synchronization handled explicitly.

## Project Structure

```text
tests/
├── release-manifest.test.cjs
├── release-truth-check.cjs
└── stage-preflight.cjs
_meta/freeze/
├── 2026-07-15-change-inventory.md
├── 2026-07-15-release-manifest.json
└── 2026-07-15-recovery-drill.md
docs/
├── ARCHITECTURE.md
├── PRESENTER-GUIDE.md
└── DECISIONS-FOR-MARWAN.md
_meta/
├── STATUS.md
└── OPEN-ITEMS.md
```

**Structure Decision**: Add release-control artifacts under `_meta/freeze/`; keep automated assertions in
`tests/`; correct canonical docs in place without touching product logic.

## Phase 0 Research

See [research.md](research.md). Decisions: inventory before edits; release claims come from live code/gate;
decision IDs become globally unique; release/push/tag remain operator gates.

## Phase 1 Design

- Data model: [data-model.md](data-model.md)
- Release contract: [contracts/release-manifest.md](contracts/release-manifest.md)
- Validation: [quickstart.md](quickstart.md)

## Complexity Tracking

No constitution violations. Separate inventory, manifest, truth check, and preflight files prevent one
release script from owning unrelated concerns.

