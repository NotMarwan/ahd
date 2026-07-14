# Research: Freeze Safety and Truth

## Decision: Inventory before mutation

**Rationale**: The worktree contains tracked user edits and many untracked artifacts. Classification is safer
than cleanup and supports explicit ownership.  
**Alternatives considered**: Stash everything; clean untracked files; clone only HEAD. Rejected because each can
hide or lose intended release work.

## Decision: Live sources govern current-state claims

**Rationale**: `tests/run-all.cjs`, screen registrations, server routes, and Git state are reproducible. Current
documentation contains stale historical descriptions.  
**Alternatives considered**: Manual number sweep. Rejected because drift recurs.

## Decision: Namespace decision identifiers

**Rationale**: `D-4` currently identifies the frozen-demo fate in the decision register and an innovation choice
in score-loop notes. One identifier cannot safely drive automation.  
**Alternatives considered**: Infer meaning from file context. Rejected because cross-document tasks lose context.

## Decision: Operator owns irreversible release actions

**Rationale**: Tag, push, delete, overwrite, and golden migration affect external or irreversible state.  
**Alternatives considered**: Automatic release after green gate. Rejected by project governance.

