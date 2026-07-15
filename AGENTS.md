# Ahd Agent Execution Contract

Read authority in this order:

1. `.specify/memory/constitution.md`
2. Recorded human decisions and scoped approvals
3. `docs/superpowers/plans/2026-07-14-project-improvement-portfolio.md`
4. `.specify/feature.json`
5. Active `spec.md`, then `plan.md`, then `tasks.md`
6. Live code and gate evidence
7. Status and cockpit mirrors

Only the active package supplies executable tasks. One controller-authorized writer may hold the shared Git-common-dir `ahd-agent-control/writer.lock`; audit claims are read-only. Dispatches bind task, files, wave, controller, explicit-offset time, constitution version, and SHA-256. Missing, mismatched, off-task, colliding, or protected paths fail closed.

Every checked task needs task evidence, controller validation, focused tests, and a constitution result. This owner-directed run permits one controller to implement and validate only with `owner_single_agent_override=true`; this never approves a Shariah, legal, regulatory, external, release, tag, push, overwrite, or cleanup gate.

Never edit `demo/index.html`, golden logic, vectors, or float money. Use `node tests/run-all.cjs` at phase end. See `CLAUDE.md` for project topology and `_meta/agent-presence/README.md` for claim operations.
