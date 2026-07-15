# Wave 0 Current State

Observed from the isolated candidate worktree. The changing source workspace remains parked and is not candidate input.

```json
{"approved_base_commit":"ff2de0e3fb85b501f82a8539549f5b1e55e80453"}
```

| Fact | Live value |
|---|---|
| Candidate branch | `codex/wave0-freeze-safety-main` |
| Candidate observation commit | `f62eef7f910c1dcd403d24dedff17d33263a2e33` |
| Active Spec Kit package | `specs/001-freeze-safety` |
| Integrated master-planning patch | `b0075f3f39e03c2541f0c28990e309a7fbf64742`, equal for `c080890` and `63530ca` |
| App screens | 21 registered screens |
| Server routes | 6 routes |
| App suites | 69 suites |
| Full gate | `2979/0` |
| Demo SHA-256 | `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40` |

## Screen Registry

`bounds`, `circle`, `circle-adv`, `mine`, `maroof`, `create`, `daftari`, `dispute`, `org`, `open`, `impact`, `home`, `plans`, `refusal`, `proof`, `request`, `settings`, `settle`, `timeline`, `shariah`, `standing`.

## Server Routes

`POST /create-loan`, `POST /seal`, `POST /verify`, `POST /net`, `GET /list`, `GET /health`.

## Stage Asset Set

- Live app: `app/` via `node app/_serve-app.cjs`.
- Frozen fallback: `demo/index.html`.
- Terminal proof: `node server/demo-bank-node.cjs`.
- Static fallback: the six tracked files under `docs/pitch/fallback/`.
- Stage hygiene: `node tests/stage-preflight.cjs`.

No tag, push, overwrite, cleanup, release, Shariah ruling, or owner decision was performed.
