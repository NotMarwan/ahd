# _meta/agent-presence/ — multi-agent coordination protocol

Lightweight presence registry so concurrent Claude sessions on this project don't duplicate work or clobber
each other's files. Plain JSON files, no server, no hard locks — soft claims + a shared notes log.

## Layout
- `<AgentName>.json` — one per active/recently-active agent. Schema: `agent_id`, `session_start`,
  `last_heartbeat`, `current_task`, `files_claimed[]`, `tasks_claimed[]`, `status`
  (`starting`|`active`|`exited`), `model`, `notes`.
- `claims/` — per-file/per-task claim records.
- `coordination_notes.md` — a shared, human-and-agent-readable log of handoffs, collisions, and claims.
  **Newest entries at the top.**

## Session-start protocol
1. Read every `*.json` here. Anything with `status:"active"` and `last_heartbeat` within the last 45
   minutes is a live agent — do not duplicate its `current_task` or edit its `files_claimed`.
2. **Immediately before writing your own presence file, re-read it first.** If it changed since you last
   read it, a different session has raced you to the same identity in the last few minutes — this has
   happened in practice on this project. Treat that as an active collision (register under a suffixed name
   like `Claude-D-2`), not as a stale ghost, regardless of what a timestamp alone would suggest.
3. Anything with `last_heartbeat` >45 minutes old and `status:"active"` is a disconnected ghost — safe to
   note as stale and register over, but say so in `coordination_notes.md`.
4. Before editing any file another active agent has in `files_claimed`, coordinate in
   `coordination_notes.md` first — don't silently edit around an active claim.
5. On exit: remove your claims, set your presence `status` to `"exited"` (or delete the file), and append
   an exit note to `coordination_notes.md` (what you did, what's next, what's still open).

## Keeping `coordination_notes.md` readable
This file is meant to be read in full at the start of every session. Once it passes roughly 50 entries,
move the oldest half into `_meta/archive/coordination-notes-history/` (new timestamped file), keeping the
live file short. Don't delete history — archive it.
