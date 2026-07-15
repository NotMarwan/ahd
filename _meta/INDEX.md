# _meta/INDEX.md — Ahd project entry point

One page. Start here, then follow a link.

| Doc | Purpose | Path |
|---|---|---|
| Current state | Gate status, HEAD, what's built, what's in flight | `_meta/STATUS.md` |
| Session history | Append-only log, one entry per overnight/agent session (newest first) | `_meta/overnight-log.md` |
| Open items | Everything still unresolved, prioritized | `_meta/OPEN-ITEMS.md` |
| Decisions needing sign-off | Shariah/product calls no agent should make alone | `docs/DECISIONS-FOR-MARWAN.md` |
| Master specification | Product intent, lifecycle status, requirements, gates, and traceability | `specs/001-ahd-product-system/spec.md` |
| Master clarity review | Findings, amendments, counts, and zero-critical analysis result | `specs/001-ahd-product-system/clarity-review.md` |
| Master implementation plan | Architecture, research, data model, contracts, and gated delivery strategy | `specs/001-ahd-product-system/plan.md` |
| Master task portfolio | 124 dependency-ordered TDD tasks covering all 142 requirements | `specs/001-ahd-product-system/tasks.md` |
| W0 immutable release reference | Candidate A, attestation B, clean-recovery evidence, and exact release gate | `_meta/freeze/2026-07-15-release-manifest.json` · `_meta/freeze/2026-07-15-recovery-drill.md` |
| Handoffs | Per-session exit notes, numbered chronologically | `_meta/handoffs/` |
| Agent coordination | Presence, claims, and the collision-handling protocol | `_meta/agent-presence/README.md` |
| Architecture | How the two builds + engine + app fit together | `docs/ARCHITECTURE.md` |
| Historical research | Pre-Ahd hackathon ideation + "Operation Ahd Deep" round — archival, not live | `docs/research/README.md` |
| Archived/superseded | Closed rounds, retired builds | `_meta/archive/` |
| Quality gate | The commands that must stay green | see `CLAUDE.md` § "Hard rules" |

**Rule:** current implementation state comes from `_meta/STATUS.md`; gated decisions come from
`docs/DECISIONS-FOR-MARWAN.md`; system-wide normative product intent comes from
`specs/001-ahd-product-system/spec.md`; and `.specify/feature.json` identifies only the current
execution target. Resolve any conflict explicitly instead of choosing a historical document.
