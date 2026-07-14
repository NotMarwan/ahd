# Data Model: Judge Readiness

## PresentationBeat

- `id`: stable beat identifier
- `window_seconds`: start and end
- `spoken_claim`: exact approved line
- `action`: exact control or terminal command
- `expected_visual`: visible proof
- `evidence_key`: source-ledger reference or none
- `fallback_id`: recovery beat

## StagePath

- `kind`: primary, extended, emergency, fallback
- `beats`: ordered presentation beats
- `maximum_seconds`: hard limit
- `entry_state`: required starting screen and app state
- `exit_visual`: screen held during close

## RehearsalResult

- `run_id`: unique rehearsal label
- `path_kind`: stage path tested
- `duration_seconds`: observed duration
- `missed_actions`: count and details
- `claim_errors`: unsupported or stale lines
- `recovery_seconds`: per injected failure
- `recall`: one-hour reviewer responses
- `judge_scores`: five criteria plus tired judge

## StageAsset

- `path`: repository-relative asset
- `role`: deck, screenshot, fallback, font, video, command evidence
- `sha256`: integrity hash
- `source_state`: commit or screen state
- `license`: required for distributable assets

