# Contract: Release Manifest v1

Required top-level keys:

```json
{
  "schema": "ahd-release-manifest-v1",
  "candidate_id": "2026-07-15-freeze-rc1",
  "commit": "40-hex-character commit",
  "branch": "judge-lens-real-leap",
  "gate": { "assertions": 2869, "failures": 0, "demo_ok": true },
  "demo_sha256": "e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40",
  "assets": [{ "path": "relative/path", "sha256": "64-hex-character hash" }],
  "included_paths": ["relative/path"],
  "excluded_paths": [{ "path": "relative/path", "reason": "owner work" }],
  "approvals": []
}
```

Validation rules:

- Every path is repository-relative and unique.
- Included and excluded paths do not overlap.
- Gate failures equal zero.
- Demo hash equals the pinned tripwire.
- Empty approvals are valid for a candidate but invalid for tag or push operations.
- Validation never deletes, moves, stages, commits, tags, or pushes files.

