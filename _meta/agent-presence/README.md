# `_meta/agent-presence/` — execution coordination

Presence JSON is informational. Binding coordination lives under the shared Git common directory in `ahd-agent-control/`, so every worktree sees the same state.

## Authority

Read the constitution, recorded human decisions, portfolio, active pointer, active spec/plan/tasks, live code/gates, then mirrors. Conflict stops execution until reconciled. Only active-wave unchecked tasks authorize writes.

## Claims

- Controller issues an immutable dispatch with agent, task, active wave, exact files, explicit-offset timestamp, constitution version, and SHA-256.
- `project/agent-control/claim.cjs` validates the dispatch before exclusively creating `writer.lock`.
- One writer exists globally, even for disjoint files or another worktree. Audit claims contain no files and never grant writes.
- Missing, unissued, mismatched, off-task, ancestor/descendant-colliding, or protected paths fail closed.
- Only the matching claim owner may release `writer.lock`.

## Completion

Task evidence and create-once review evidence are written before the active `tasks.md` checkbox. Interruption after evidence leaves the checkbox safely open. Prior reviews are append-only; a `needs-fix` result stays and requires a superseding approval. The owner-directed single-agent override is explicit evidence, not authority for any human or irreversible gate.

Presence files should be set to `exited` after work. They never replace the binding lock or task evidence.
