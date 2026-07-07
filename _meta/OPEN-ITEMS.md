# _meta/OPEN-ITEMS.md — everything still unresolved (consolidated 2026-07-01)

> Supersedes `_meta/deep-work/ledger/open-threads.md` as the live open-items list. That file's OT-IDs are
> the stable references used here; see it for the original P0–P2 prioritization rationale. This file
> merges it with `docs/DECISIONS-FOR-MARWAN.md`'s "Standing items" and marks resolved items done rather
> than deleting them, so IDs stay traceable.

## JL — judge-lens gaps (win items, freeze 15 July; see `docs/JUDGE-LENS.md`)

| ID | Item | Front | Status |
|---|---|---|---|
| **JL-1** | Pitch & demo kit: deck rebuilt from `docs/DECK-DRAFT-AR.md` + 3-minute Arabic script with second-by-second demo choreography (tamper-catch on stage, Muqassa 9→2, data slide, Alinma close) + rebuttal refresh | Front 1 | open |
| **JL-2** | Premium UX pass: land the July-1 premium direction (`app/screenshots/premium/`, ui-premium-polish plan) across all 12 screens — `app/app.css` + screen markup only, zero unstyled corners | Front 2 | open |
| **JL-3** | Data-analysis story: on-spine «أثر عهد» analytics screen (netting compression, conservation proof, k-anonymous aggregates; TDD) + evidence-brief data slide | Front 3 | open |
| **JL-4** | Judge-visible depth (only if it strengthens the demo; cut first on slippage): borrower-protections panel (OT-P1other) and/or proof-pack polish | Front 4 | open |

## Genuinely still open

| ID | Item | Type | Notes |
|---|---|---|---|
| **OT-A1** | One real Saudi demand voice (relational-strain shard) — interviews/survey | Non-code, field | Team item, pre-pitch |
| **OT-A2** | "Why Alinma, not Al Rajhi" moat strategy | Strategy | Rebuttal exists; moat is a strategy to build, not yet realized |
| **OT-VAL** | Pre-production validations: Nafath-AES permission, Alinma Shariah-board fee sign-off, accredited CSP/TSA | Counsel-only | Never assert these on stage until confirmed |
| **OT-CITE** | Counsel-confirm exact Evidence-Law article numbers + M/8-vs-M/18 + refresh 2024-25 court figures | Counsel-only | |
| **OT-PATCH** | Apply the JCS-depth SEAL patch (`_meta/deep-work/backend/prototype-compute-patch.md`) + re-pin golden vectors | Post-demo, mechanical | Not yet applied - tripwire is still the pre-patch hash |
| **OT-SEAL5** | Complete the SEAL to a full 5-property chain (multi-block + TSA + bank-sig + Merkle) | v2 | ~3/5 properties today |
| **OT-DEPTH** | v2 mechanisms - **partially addressed**: dispute-export (P12) roughly built via F2 proof-pack screen; recurring-covenant (P13) roughly built via Circle-adv recurring auto-post. **Still unbuilt:** duress/coercion flag (P11), AML/collusion signal (P14), on-screen attestation-boundary panel (P15) | v2 | |
| **OT-P1other** | Borrower-side asks - **partially addressed**: grace ("يُسر") real state logic done. **Still open:** borrower-invokable إبراء (shipped as lender-owned only, not borrower-invokable) + a standalone borrower-protections panel | Product | |
| **OT-IDSTATE** | Reconcile the `ahd_id` type (ULID/UUIDv7/base32/string) and declare one binding state-name enum | Needs verification | Status unclear - the app's event-sourced fold() now uses one consistent state vocabulary in practice; hasn't been checked whether `ahd_id` generation was ever reconciled against the original ULID/UUIDv7 question |
| **OT-13** | A second, divergent handoff series reportedly exists outside this repo at a separate local path | Unverifiable from here | Outside this repo/working directory - needs the operator to confirm whether that path still exists |
| **OT-14** | Possible duplicate Agent-1 legal layer files inside the research vault | Unverified, low priority | Vault content - out of scope per this consolidation's non-goals (no physical vault merge); confirm the duplicate still exists before acting |
| **OT-LINKS** | A dangling wikilink, a dead source citation, and a stale dossier demo-hook, all inside the research vault (`contracts.md`, the growth layer, dossier section 6) | Unverified, low priority | Vault content - out of scope per this consolidation's non-goals (no physical vault merge); confirm still relevant before acting |

## Resolved (kept for traceability - do not re-open without new evidence)
- **OT-SOUL, OT-FSM, OT-CONSENT, OT-PCT, OT-RIBA, OT-STEP0, OT-X1, OT-X2, OT-X3** - closed 2026-06-19,
  see `_meta/archive/11-build-round/STATUS.md` (items B1-B8). OT-RIBA further deepened (not just closed) by
  `app/features/riba-lint.js` (0/60 adversarial-corpus misses in its own test corpus).
- **OT-RIBA-NOW** - resolved as permanent architecture, not a temporary demo-day call: the golden
  `ribaScan`'s negation false-positive is a permanent property of the frozen `demo/index.html` (golden
  functions are never modified - see `CLAUDE.md`); the real fix lives only in `app/`'s additive layer.
- **OT-M9** - closed: smartphone-penetration figure corrected 97%->99% during the evidence-brief pass
  (`docs/evidence/EVIDENCE-BRIEF.md`).
- **OT-01** (round split across two `10_Deep` trees) - addressed by this very consolidation effort
  (`docs/superpowers/specs/2026-07-01-meta-information-architecture-design.md`); `_meta/deep-work/ledger/
  00_LEDGER.md` remains the canonical cross-reference for that historical split.
- **OT-04** (two SEAL schemes coexist) - not a bug, by design; tracked via OT-PATCH above.
- **OT-12** (round-08 provenance mixed) - accepted resolution: `00_LEDGER.md` + the verification-ledger
  are canonical for that history; nothing further to do.
- **OT-15** (dossier overstated "built" features) - substance resolved: the features it referenced (state
  machine, consented Muqassa, computed trust) are now actually built and tested. Whether the dossier's own
  wording was ever updated to match hasn't been separately verified - low stakes since the underlying gap
  is closed either way.

## Links
`_meta/deep-work/ledger/open-threads.md` (original, full source rationale) · `docs/DECISIONS-FOR-MARWAN.md`
(decisions needing sign-off, distinct from open work items) · `_meta/deep-work/ledger/00_LEDGER.md`
