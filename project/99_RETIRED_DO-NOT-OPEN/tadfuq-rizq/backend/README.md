# backend/ — Tadfuq underwriting engine (Agent 1)

Implements **Contract 2** (`underwrite()`) + Contract-3 support endpoints.

## Files
| File | Role |
|---|---|
| `underwrite.py` | engine: 6 signals (5 OB + 1 ZATCA) → computed limit/tenor/confidence + per-signal SAR contributions. Deterministic. |
| `explainer.py` | **ALLaM seam (STUBBED)** — deterministic Arabic rationale; real ALLaM/watsonx drops into `explain()`. |
| `app.py` | FastAPI: `POST /underwrite`, `GET /health`, `GET /personas`, `GET /bundle/{id}`. |
| `fixtures.py` | seeded isolation bundles (3 personas) — stand-in until `data/generate.py`. |
| `model/train.py` | optional GBM seam (R²≈0.986). Default engine is the transparent fn; GBM via `USE_MODEL=1`. |
| `tests/` | pytest (7) — moat, determinism, contributions-sum, ineligibility. |
| `dump_sample_io.py` | runs all personas → `sample_io.json` (contract proof). |

## The 6 signals
`cashflow_stability` (OB·0.25) · `income_regularity` (OB·0.20) · **`invoice_verified_ratio` (ZATCA·0.20)** · `revenue_trend` (OB·0.15) · `buffer_adequacy` (OB·0.10) · `expense_discipline` (OB·0.10).
**Moat rule (tested):** ≥1 OB signal AND the ZATCA signal always contribute to an eligible limit.

## Design choice (honest)
Transparent weighted scoring is the **demo default** — every SAR is attributable to a named signal (real explainability, not decoration). The GBM exists behind the same `_months_extended()` seam for the "trained model" story. Eligibility gate: ≥6 months active, score ≥0.30, positive income → else `limit_sar=0`, `structure="none"`.

## Verified
`pytest` 7/7 · 3 distinct computed limits (54k / 100k / 9.5k SAR) · GBM R²=0.986 · all endpoints live over HTTP. See `../BUILD-LOG.md`.
