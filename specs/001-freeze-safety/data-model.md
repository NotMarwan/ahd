# Data Model: Freeze Safety and Truth

## ChangeInventoryItem

- `path`: repository-relative path
- `kind`: tracked-modified, tracked-added, untracked, generated, ignored
- `owner`: user, project, generated, unresolved
- `disposition`: release, park, generated, ignore, owner-decision
- `reason`: non-empty explanation
- `collision`: whether intended work overlaps another owner

## ReleaseManifest

- `candidate_id`: stable release-candidate label
- `commit`: full Git commit
- `branch`: source branch
- `created_at`: operator-recorded ISO timestamp; never product logic
- `gate`: command, assertion count, failure count, duration
- `demo_sha256`: full pinned hash
- `assets`: path and SHA-256 pairs
- `included_paths`: intended release paths
- `excluded_paths`: parked or generated paths with reasons
- `approvals`: named release/tag/push approvals

## DocumentationClaim

- `claim_key`: stable name such as `app_suite_count`
- `document`: path
- `classification`: current or historical
- `expected_source`: live command or code location
- `observed_value`: parsed document value
- `status`: match, mismatch, exempt-history

## DecisionReference

- `id`: globally unique identifier
- `title`: one decision only
- `authority`: Marwan, scholar, counsel, vendor, operator
- `status`: open, approved, rejected, superseded
- `dependencies`: task or feature identifiers

## State Transitions

`inventory-draft -> inventory-approved -> candidate-built -> gate-green -> preflight-green -> operator-release`

Any failure returns to `candidate-built`; external release never occurs automatically.

