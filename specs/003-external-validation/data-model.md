# Data Model: External Validation

## SurveyResponse

- `response_id`: random research identifier unrelated to Ahd identity
- `consent`: explicit yes/no
- `eligible`: Saudi adult and target-context eligibility
- `channel`: sampling channel
- `answers`: bounded categorical and optional free-text responses
- `quality_flags`: duplicate, incomplete, speed, inconsistency
- `collected_at`: research timestamp, never product logic

## EvidenceFinding

- `finding_id`: stable evidence key
- `kind`: measured, model, synthetic, estimate, external-validation
- `population`: eligible sample description
- `n`: denominator
- `value`: metric or theme
- `uncertainty`: interval or qualitative limitation
- `source_artifact`: exact path
- `allowed_claim`: reviewed public wording
- `status`: draft, reviewed, approved, superseded

## ReviewDecision

- `decision_id`: unique project-wide ID
- `question`: one issue only
- `reviewer`: name, organization, qualification
- `answer`: approved, rejected, conditional, unanswered
- `conditions`: exact constraints
- `allowed_public_wording`: bounded claim
- `affected_items`: feature, claim, and task IDs
- `artifact`: dated written evidence

## PilotSignal

- `counterparty`: organization or community
- `level`: conversation, verbal-interest, non-binding-letter, trial, signed-pilot, paid-contract
- `scope`: participants, duration, data, and obligations
- `artifact`: dated evidence path
- `next_action`: owner and due date

