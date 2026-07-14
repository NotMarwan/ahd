# Quickstart: External Validation

## Validate instrument and analysis

```powershell
node tests/app/demand-survey-analysis.test.cjs
node tests/app/evidence-propagation.test.cjs
$env:AHD_RESEARCH_DATA = 'C:\approved-private-store\demand-survey-results.csv'
node tools/analyze-demand-survey.cjs $env:AHD_RESEARCH_DATA
```

Expected: consent and eligibility exclusions reported; no direct identifiers; aggregates reproduce exactly.

## Human workflow

1. Approve survey consent, sampling, and distribution owner.
2. Field survey and interviews; retain de-identified rows only in the approved encrypted store outside Git.
3. Send separate Shariah and legal/regulatory packets to qualified reviewers.
4. Record written answers without interpretation beyond their conditions.
5. Seek one bounded pilot or non-binding interest artifact.
6. Run claim propagation only after evidence-register approval.
