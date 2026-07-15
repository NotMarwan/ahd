---
description: "Dependency-ordered external validation work"
---

# Tasks: External Validation

## Phase 1: Setup

- [ ] T001 Name human owners for survey distribution, interviews, Shariah review, legal review, regulatory contacts, and pilot outreach in `docs/evidence/external-validation-register.md`
- [ ] T002 Create the evidence-grade register structure in `docs/evidence/external-validation-register.md` using `contracts/evidence-register.md`
- [ ] T003 Confirm Wave 0 resolved the decision-ID collision before issuing reviewer packets

## Phase 2: Foundational Privacy and Tests

- [ ] T004 [P] Write failing schema, consent, eligibility, and direct-identifier rejection tests in `tests/app/demand-survey-analysis.test.cjs`
- [ ] T005 [P] Write failing claim-grade and pending-claim rejection tests in `tests/app/evidence-propagation.test.cjs`
- [ ] T006 Run both focused suites and record expected failures in `docs/evidence/external-validation-register.md`
- [ ] T007 Define allowed fields, value ranges, exclusions, and retention in `docs/evidence/demand-survey-data-dictionary.md`

## Phase 3: User Story 1 - Saudi Demand Evidence (P1)

**Independent Test**: Reproduce aggregate findings from consented, eligible, de-identified responses.

- [ ] T008 [P] [US1] Finalize consent, sampling frame, duplicate handling, and distribution script in `docs/evidence/DEMAND-SURVEY-KIT.md`
- [ ] T009 [P] [US1] Create a privacy-safe interview guide in `docs/evidence/interview-guide.md` covering relationship strain, safeguards, amounts, and adoption barriers
- [ ] T010 [US1] Implement deterministic CSV validation and aggregate analysis in `tools/analyze-demand-survey.cjs` until T004 passes
- [ ] T011 [US1] Pilot the survey with 10 eligible respondents; fix ambiguous questions without changing the analysis contract
- [ ] T012 [US1] Field the approved survey to at least 150 eligible respondents and store de-identified rows only in the approved encrypted research location outside Git; keep `docs/evidence/demand-survey-results.template.csv` empty
- [ ] T013 [US1] Conduct at least eight consented interviews and record de-identified themes in `docs/evidence/interview-themes.md`
- [ ] T014 [US1] Generate `docs/evidence/demand-survey-analysis.md` with denominator, missingness, uncertainty, channel bias, and allowed claims
- [ ] T015 [US1] Add approved measured findings to `docs/evidence/external-validation-register.md`; retain sub-target findings as directional only

## Phase 4: User Story 2 - Shariah and Legal Decisions (P1)

**Independent Test**: Every open decision has a written answer artifact or remains blocked.

- [ ] T016 [P] [US2] Write one-question-per-section Shariah packet in `docs/evidence/shariah-review-packet.md` for D-1, D-3, D-6/D-6a, D-7, D-8, and the renamed inheritance proposal
- [ ] T017 [P] [US2] Write legal/regulatory packet in `docs/evidence/legal-regulatory-review-packet.md` for Evidence Law citations, court figures, Nafath-AES, SAMA path, PDPL residency, CSP/TSA, and fee disclosures
- [ ] T018 [US2] Obtain dated written responses from qualified reviewers and store them under `docs/evidence/external-reviews/`
- [ ] T019 [US2] Record reviewer identity, qualifications, exact answers, conditions, and allowed wording in `docs/DECISIONS-FOR-MARWAN.md`
- [ ] T020 [US2] Keep unanswered, rejected, or conditional features blocked in `_meta/OPEN-ITEMS.md`
- [ ] T021 [US2] Add counsel-confirmed citations and remove or downgrade any unconfirmed citation in `docs/evidence/EVIDENCE-BRIEF.md`

## Phase 5: User Story 3 - External Feasibility (P2)

**Independent Test**: Every feasibility claim points to a dated artifact and commitment level.

- [ ] T022 [P] [US3] Test the Alinma-specific moat through five structured expert or stakeholder conversations and summarize objections in `docs/evidence/alinma-moat-validation.md`
- [ ] T023 [P] [US3] Prepare a bounded institution-SaaS pilot brief in `docs/evidence/pilot-evidence/pilot-brief.md` with scope, privacy, zero-loan-charge model, success measures, and exit terms
- [ ] T024 [US3] Seek one dated written partner artifact and classify it precisely in `docs/evidence/external-validation-register.md`
- [ ] T025 [US3] Record provider and regulatory responses as planned, permitted, tested, or production-approved without promotion

## Final Phase: Evidence Propagation

- [ ] T026 Implement register-driven checks in `tests/app/evidence-propagation.test.cjs` until T005 passes
- [ ] T027 Propagate only approved wording to `app/features/sources.js`, `docs/pitch/deck-content-v2.md`, `docs/pitch/script-ar.md`, `docs/evidence/EVIDENCE-BRIEF.md`, and `docs/evidence/REBUTTAL-PLAYBOOK.md`
- [ ] T028 Run focused evidence tests, all app suites, and `cd tests && node run-all.cjs`
- [ ] T029 Re-score Data and Feasibility through `docs/JUDGE-LENS.md`; update `JL-10`, `JL-12`, `OT-A1`, `OT-VAL`, and `OT-CITE`
- [ ] T030 Update canonical status and `AmadHackathon/` cockpit with measured results and remaining human gates

## Dependencies

- T001-T007 block field collection and public claims.
- US1 and US2 may run concurrently through separate human owners.
- US3 may start outreach early but cannot claim progress without artifacts.
- T026-T030 require reviewed findings and decisions.
