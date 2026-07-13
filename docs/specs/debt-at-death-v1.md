# Debt at death v1 — specification only

## Purpose

Record a reported death and export neutral estate evidence. This is not enabled product logic and creates no estate workflow in the app.

## Event vocabulary

- `DEATH_REPORTED`: report received; no truth finding.
- `DEATH_VERIFIED`: human review records verification; no automatic settlement consequence.
- `ESTATE_EVIDENCE_EXPORTED`: neutral record package exported for the estate process.
- `ESTATE_SETTLEMENT_RECORDED`: an externally evidenced estate settlement is recorded.

## Boundaries

- Lender-side representative acts only for the lender estate.
- Borrower-side liability remains estate-only.
- No heir liability, inheritance-share calculation, automatic maturity, waiver, judgment, trust score, or sanction.
- No enabled estate code, UI, routing, or automatic event emission in v1.

## Commercial and Shariah gates

- Billing is deferred; no fee model is authorized here.
- Self-disclosure is deferred; no automated declaration flow is authorized here.
- Pooled funds are excluded.
- Legal, scholar, estate-administration, privacy, and product approval are required before any implementation.
