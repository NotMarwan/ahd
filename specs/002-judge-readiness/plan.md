# Implementation Plan: Judge Readiness

**Branch**: `judge-lens-real-leap` | **Date**: 2026-07-14 | **Spec**: [spec.md](spec.md)

## Summary

Freeze one rehearsed three-minute narrative, expose one memorable sourced data insight, remove judge-path
readability defects, synchronize deck/script/media, and prove recovery paths through timed rehearsals.

## Technical Context

**Language/Version**: Existing HTML/CSS/JavaScript; Markdown; presentation tooling already in repository  
**Primary Dependencies**: Existing app and offline screenshot/presentation workflow; approved font file only  
**Storage**: Repository docs, screenshots, deck artifact, rehearsal evidence  
**Testing**: App suites, DOM smoke, stage-path contract, full gate, Judge Lens panel  
**Target Platform**: Presentation laptop and projector; Arabic RTL web app  
**Project Type**: Judge-visible product and presentation  
**Performance Goals**: Primary path 165-180 seconds; recovery under 30 seconds  
**Constraints**: Frozen demo untouched; no unsupported claims; no unlicensed assets; offline stage  
**Scale/Scope**: Primary, extended, 90-second, and failure paths; judge-path screens only

## Constitution Check

- [x] Spine and pending Shariah claims preserved.
- [x] Frozen demo and golden engine untouched.
- [x] Determinism, integer money, privacy, and claim labels preserved.
- [x] TDD and full gate planned for visible behavior changes.
- [x] Six-lens review, tired-judge recall, and rehearsals planned.
- [x] Shared-file edits wait for Wave 0 inventory.

## Project Structure

```text
docs/pitch/
├── script-ar.md
├── deck-content-v2.md
├── top6-cards-ar.md
├── fallback/
└── rehearsal-2026-07-15.md
docs/
├── PRESENTER-GUIDE.md
└── evidence/EVIDENCE-BRIEF.md
app/
├── app.css
├── assets/fonts/
└── screens/{home,proof,settlement,impact}.js
tests/
├── stage-path-contract.cjs
└── app/app-dom-smoke.cjs
```

**Structure Decision**: Limit product edits to judge-path rendering and CSS. Keep narrative, deck, fallback,
and rehearsal evidence together under `docs/pitch/`.

## Phase 0 Research

See [research.md](research.md). Decisions: canned tamper remains timed-path default; judge typing moves to
extended path; one insight combines measured prevalence with clearly synthetic netting sensitivity; font is
conditional on an approved OFL file; final screen holds proof or mercy visual.

## Phase 1 Design

- Data model: [data-model.md](data-model.md)
- Stage-path contract: [contracts/stage-path.md](contracts/stage-path.md)
- Validation: [quickstart.md](quickstart.md)

## Complexity Tracking

No constitution violation. Separate timed and judge-driven tamper paths prevent audience interaction from
making the primary path unreliable.

