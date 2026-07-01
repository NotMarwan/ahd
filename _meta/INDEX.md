# _meta/INDEX.md — Ahd project entry point

One page. Start here, then follow a link.

| Doc | Purpose | Path |
|---|---|---|
| Current state | Gate status, HEAD, what's built, what's in flight | `_meta/STATUS.md` |
| Session history | Append-only log, one entry per overnight/agent session (newest first) | `_meta/overnight-log.md` |
| Open items | Everything still unresolved, prioritized | `_meta/OPEN-ITEMS.md` |
| Decisions needing sign-off | Shariah/product calls no agent should make alone | `docs/DECISIONS-FOR-MARWAN.md` |
| Handoffs | Per-session exit notes, numbered chronologically | `_meta/handoffs/` |
| Agent coordination | Presence, claims, and the collision-handling protocol | `_meta/agent-presence/README.md` |
| Architecture | How the two builds + engine + app fit together | `docs/ARCHITECTURE.md` |
| Historical research | Pre-Ahd hackathon ideation + "Operation Ahd Deep" round — archival, not live | `docs/research/README.md` |
| Archived/superseded | Closed rounds, retired builds | `_meta/archive/` |
| Quality gate | The commands that must stay green | see `CLAUDE.md` § "Hard rules" |

**Rule:** if a doc anywhere conflicts with `_meta/STATUS.md` or `docs/DECISIONS-FOR-MARWAN.md`, those two
win — they're the only two files an agent should update on every session that touches project state.
