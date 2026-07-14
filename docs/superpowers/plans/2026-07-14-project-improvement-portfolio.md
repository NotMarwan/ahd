# Ahd Full-Improvement Portfolio

**Date:** 2026-07-14  
**Scope:** Competition freeze, judge readiness, external validation, production hardening, and v2  
**Design:** [Portfolio design](../specs/2026-07-14-project-improvement-portfolio-design.md)  
**Parent product specification:** [Ahd Product System](../../../specs/001-ahd-product-system/spec.md)  
**Constitution:** [Ahd Spec Kit constitution](../../../.specify/memory/constitution.md)

## Goal

Close every active project gap without risking the 18 July judging path, modifying the frozen demo,
inventing evidence, or letting an agent decide Shariah, golden, vendor, or irreversible questions.
The parent product specification defines the complete system and lifecycle statuses; the five packages
below are its independently executable delivery decomposition.

## Portfolio Order

| Wave | Package | Window | Exit gate |
|------|---------|--------|-----------|
| W0 | [Freeze Safety](../../../specs/001-freeze-safety/) | 14-15 Jul | Clean reproducible candidate; truth checks green; operator release approval |
| W1 | [Judge Readiness](../../../specs/002-judge-readiness/) | 14-17 Jul | Three clean rehearsals; current stage bundle; six-lens review |
| W2 | [External Validation](../../../specs/003-external-validation/) | Start 14 Jul; human lead time | Survey/interviews; written review decisions; pilot evidence or explicit blockers |
| W3 | [Production Hardening](../../../specs/004-production-hardening/) | Post-freeze/post-event | Authz, transactions, abuse limits, recovery, TLS deployment, security gate |
| W4 | [V2 Product and Protocol](../../../specs/005-v2-product-protocol/) | After relevant approvals | Five-property proof, conformance, approved features, mobile parity |

W0 blocks shared-file and release work. W1 is competition-critical. W2 starts immediately but cannot
promote claims before evidence. W3 and W4 do not modify the frozen competition candidate.

## Task Inventory

| Wave | Tasks | Primary owners |
|------|------:|----------------|
| W0 | 27 | Release owner, maintainer, presenter |
| W1 | 28 | Presenter, product/design, evidence owner |
| W2 | 30 | Research owner, scholar, counsel, partnerships |
| W3 | 40 | Backend, security, platform, privacy |
| W4 | 47 | Protocol, product, mobile, governance |
| **Total** | **172** | Mixed; human gates named in each package |

## Complete Backlog Coverage

| Existing item | Wave | Planned disposition |
|---------------|------|---------------------|
| JL-1 | W1 | Rehearse, build official deck, re-score |
| JL-2 | W1 | Current screenshots and judge-path polish |
| JL-3 | W1 | Regression plus one memorable data beat |
| JL-4 | W0/W1 | Closed; preserve bounds/proof regression |
| JL-5 | W0 | Closed; verify stage-preflight regression |
| JL-6 | W0 | Closed; preserve no-drift teeth |
| JL-7 | W1 | Approved Arabic font if supplied; otherwise readability remediation and named blocker |
| JL-8 / OT-A1 | W2 | Field 150+ survey responses and 8+ interviews |
| JL-9 | W1 | Canned timed path; judge typing in extended path; rehearsal evidence decides promotion |
| JL-10 | W2 | Replace data ceiling with measured primary evidence |
| JL-11 | W1 | Arabic scanability, density, font, rehearsal |
| JL-12 | W2 | Written scholar/regulatory/pilot artifacts |
| OT-A2 | W2 | Validate the Alinma-specific moat externally |
| OT-VAL | W2 | Nafath-AES, Shariah fee, CSP/TSA validation |
| OT-CITE | W2 | Counsel-confirm law references and current figures |
| OT-PATCH | W4 separate | Dedicated approved golden-migration spec; excluded from normal v2 implementation |
| OT-SEAL5 | W4 | Complete timestamp profile and production key-custody gate |
| OT-DEPTH | W4 | Duress and collusion protective holds; no judgments or scores |
| OT-P1other | W4 | Approval-gated borrower release request flow |
| OT-IDSTATE | W4 | Canonical identifier and binding state vocabulary with migration |
| OT-13 / OT-14 / OT-LINKS | W0 | Verify, close, or retain with evidence |
| OT-RIFQ | W4 | Built; regression plus scholar consent disposition |
| OT-STD1 | W4 | License, governance, second issuer, conformance |
| OT-FINDEX25 | W2 | Verify full series integration and evidence register |
| OT-MKT / OT-LOANSIZE / OT-MOJ | W2 | Measured/proxy market band; human MoJ retrieval; precise amount from survey |
| OT-RATELIMIT | W3 | Deterministic fixed-window limits with injected clock |
| OT-THREATMODEL | W3 | STRIDE and LINDDUN with residual owners |
| OT-BANKSIG | W4 | Crypto built; production HSM/KMS lifecycle gate |
| OT-TSA | W4 | Demo fixture plus accredited production provider gate |
| OT-DEPLOY | W3 | Real TLS deployment, health, recovery, rollback evidence |
| D-1 | W2/W4 | Reviewer decision, then optional self-disclosure implementation |
| D-2 | W0 | Addressed; display-toggle regression only |
| D-3 | W2/W4 | Reviewer decision, then approved pledge or custody profile only |
| D-4 demo fate | W0 | Preserve frozen fallback; verify decision remains resolved |
| Inheritance proposal also called D-4 | W0/W2/W4 | Rename to unique ID, obtain owner/scholar decision, then implement or close |
| D-5 | W0/W4 | Preserve conservative riba-linter behavior; scholar-debatable clauses remain unruled |
| D-6 / D-6a | W2 | Written fee-model review before public approval or billing implementation |
| D-7 / D-8 | W2/W4 | Written multilateral-settlement and mercy-consent decisions before behavior changes |
| Figma/mobile transfer | W4 | Hash-tracked baseline, Expo parity, device evidence, then visual v2 |
| Architecture/status drift | W0 | Live-source checks and corrected canonical docs |
| Dirty worktree/untracked assets | W0 | Inventory, ownership, manifest, no deletion |

Closed historical items remain covered by existing regression tests. They are not rebuilt unless a live
verification proves regression.

## Critical Path to 18 July

1. Finish W0 inventory, truth check, clean recovery drill.
2. Freeze candidate only with operator approval.
3. Complete W1 script/deck/media synchronization.
4. Run three clean rehearsals and four failure injections.
5. Start W2 survey/review outreach immediately; integrate only received evidence.
6. Run final full gate and six-lens review.
7. Stop product changes after freeze; preserve last green bundle.

## Human Gate Board

| Gate | Owner | Unlocks |
|------|-------|---------|
| Release/tag/push | Marwan/operator | W0 release |
| Team names and official deck template | Marwan/team | W1 official deck |
| OFL Arabic font file/license | Design owner | W1 typography ceiling |
| Survey distribution and interview access | Research owner | W2 primary evidence |
| Shariah review | Qualified scholar/board | D-1, D-3, D-6, D-7, D-8, inheritance proposal |
| Legal/regulatory review | Counsel/providers | OT-CITE, OT-VAL |
| Pilot artifact | Partnerships owner | JL-12 feasibility proof |
| Database/dependencies/hosting | Marwan/platform owner | W3 implementation |
| TSA and HSM/KMS | Accredited vendors | W4 production seal profile |
| Open-Witness license/governance | Marwan | W4 standard publication |
| Mobile dependencies/distribution | Marwan/mobile owner | W4 mobile build |

## Portfolio Completion Rule

Portfolio is complete only when each mapped item is `complete`, `rejected`, `superseded`, or `blocked`
with named owner, required artifact, and next review date. “Planned” alone is not completion.
