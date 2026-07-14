# Contract: External Validation Register v1

Every public claim row must contain:

```text
claim_id | exact_wording | grade | source_artifact | population | n | limitations | reviewer | status
```

Allowed grades:

- `MEASURED`: directly computed from collected or primary-source data.
- `MODEL`: derived from sourced inputs and explicit assumptions.
- `SYNTHETIC`: produced from fixtures or generated scenarios.
- `ESTIMATE`: informed but not directly measured.
- `EXTERNAL-VALIDATION`: dated evidence from a named outside party.
- `PENDING`: not allowed as a factual public claim.

Rules:

- `MEASURED` survey claims require consented eligible denominator and limitations.
- `EXTERNAL-VALIDATION` requires a dated artifact and commitment classification.
- Reviewer authority is limited to the exact question answered.
- Claim propagation cannot promote `PENDING` rows.
- Superseded claims remain in history with replacement links.

