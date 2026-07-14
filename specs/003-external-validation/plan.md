# Implementation Plan: External Validation

**Branch**: `judge-lens-real-leap` | **Date**: 2026-07-14 | **Spec**: [spec.md](spec.md)

## Summary

Field a privacy-minimized Saudi survey and interviews, assemble concise scholar/counsel decision packets,
record external validation with strict evidence grades, test the Alinma moat, and obtain a bounded pilot signal.

## Technical Context

**Language/Version**: Markdown and CSV; Node.js 20-compatible deterministic analysis scripts  
**Primary Dependencies**: Existing survey kit and Node built-ins; human reviewers and field channels  
**Storage**: Encrypted access-controlled research store outside Git; repository keeps schemas, aggregate
reports, evidence register, decisions, and dated external artifacts  
**Testing**: Schema tests, consent/data-minimization tests, deterministic analysis fixtures, claim propagation checks  
**Target Platform**: Offline analysis workstation; approved survey distribution channel  
**Project Type**: Research, governance, and evidence operations  
**Performance Goals**: Directional results within 48 hours of field start; full target as responses arrive  
**Constraints**: No fatwa/legal inference; no unconsented personal data; no invented approvals  
**Scale/Scope**: 150+ survey responses, 8+ interviews, all active Shariah/legal/regulatory/pilot gates

## Constitution Check

- [x] AI never becomes authority; all rulings and approvals are human-owned.
- [x] Frozen artifacts and product logic untouched by evidence collection.
- [x] Analysis remains deterministic and aggregate; privacy floor preserved.
- [x] Tests precede analysis automation and claim propagation.
- [x] Verified evidence may inform judge surfaces; unverified claims remain blocked.
- [x] Canonical evidence, decisions, and cockpit updates are planned.

## Project Structure

```text
docs/evidence/
├── DEMAND-SURVEY-KIT.md
├── demand-survey-data-dictionary.md
├── demand-survey-results.template.csv
├── demand-survey-analysis.md
├── interview-guide.md
├── interview-themes.md
├── external-validation-register.md
├── shariah-review-packet.md
├── legal-regulatory-review-packet.md
└── pilot-evidence/
tools/
└── analyze-demand-survey.cjs
tests/app/
├── demand-survey-analysis.test.cjs
└── evidence-propagation.test.cjs
docs/DECISIONS-FOR-MARWAN.md
_meta/OPEN-ITEMS.md
```

**Structure Decision**: Keep row-level research outside Git in an encrypted access-controlled store. Commit
only the data dictionary, empty template, aggregate analysis, review packets, and allowed external artifacts.
Public claims are promoted only through the evidence register.

## Phase 0 Research

See [research.md](research.md). Decisions: target 150 eligible responses; use explicit consent and minimal
fields; treat sub-target samples as directional; send compound decisions as separate yes/no/conditional
questions; classify partner evidence by commitment strength.

## Phase 1 Design

- Data model: [data-model.md](data-model.md)
- Evidence contract: [contracts/evidence-register.md](contracts/evidence-register.md)
- Validation: [quickstart.md](quickstart.md)

## Complexity Tracking

No constitution violation. Human decisions and measured research remain separate from code and synthetic
models to prevent authority or evidence leakage.
