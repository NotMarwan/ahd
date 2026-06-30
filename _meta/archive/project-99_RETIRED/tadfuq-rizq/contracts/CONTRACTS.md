# 🔒 CONTRACTS.md — frozen interfaces (LAW)
> Build against these exactly. To change one: **stop**, append the change + reason below, and flag it in `BUILD-LOG.md`. Never break silently.
> Seeded by **Agent 1** (backend) 2026-06-18 from the build-sprint prompt §4.

## Contract 1 — `AccountBundle` (shared data shape)
```json
{
  "persona_id": "freelancer_designer | small_merchant | gig_driver",
  "profile": { "name_ar": "string", "segment": "string", "months_active": 18, "has_simah_score": false },
  "ob_transactions": [
    { "date": "YYYY-MM-DD", "amount_sar": 0.00, "direction": "credit|debit", "category": "string", "counterparty": "string" }
  ],
  "zatca_invoices": [
    { "date": "YYYY-MM-DD", "amount_sar": 0.00, "buyer": "string", "status": "cleared|pending", "uuid": "string" }
  ],
  "pos_settlements": [
    { "date": "YYYY-MM-DD", "amount_sar": 0.00, "terminal": "string" }
  ]
}
```

## Contract 2 — `underwrite()` (Agent 1 owns; all consume)
`POST /underwrite` · body = `AccountBundle` → returns:
```json
{
  "limit_sar": 45000,
  "structure": "Tawarruq",
  "tenor_months": 6,
  "explanation_ar": "حد تمويل رأس مال عامل ...",
  "confidence": 0.82,
  "signals": [
    { "name": "cashflow_stability", "value": 0.71, "contribution_sar": 12000, "label_ar": "استقرار التدفق النقدي" }
  ],
  "decision_id": "det-<seed>-<persona>",
  "generated_in_ms": 380
}
```
**Rules (enforced by Agent 1's engine + tests):**
- `limit_sar` is **computed from signals derived from the bundle** — never constant.
- ≥1 signal from **OB** and ≥1 from **ZATCA** contribute (the moat). ZATCA signal = `invoice_verified_ratio`.
- `explanation_ar` comes from the ALLaM seam (Contract 4b), names Tawarruq + top signals.
- **Deterministic** given the same bundle for every field **except `generated_in_ms`** (measured wall-clock latency, informational; excluded from determinism tests).
- `structure` = `"Tawarruq"` when eligible, `"none"` when limit is 0.
- `signals[].contribution_sar` sum ≈ `limit_sar`.

## Contract 3 — Frontend API client (Agent 3 owns)
```
getPersonas()       -> [{ persona_id, name_ar, segment, teaser_ar }]
connect(persona_id) -> AccountBundle      // OFFLINE → data/fallback-recording.json
underwrite(bundle)  -> UnderwriteResult   // POST /underwrite; OFFLINE → fallback recording
```
Global `OFFLINE = true` → whole frontend runs from `data/fallback-recording.json`, no backend/network.
**Backend support shipped:** `GET /personas` returns the persona teasers; `GET /bundle/{persona_id}` returns a ready `AccountBundle` (so Agent 3 can wire `connect()` immediately, and Agent 2 can capture the fallback recording).

## Contract 4 — Frontend conventions (Agent 3 sets 4a/4c; Agent 1 owns 4b)
- **4a tokens** (`frontend/tokens.css`): `dir="rtl"`, IBM Plex Sans Arabic, teal/green primary, warm neutral bg, one bright accent for the limit reveal, 8px scale. *(Agent 3)*
- **4b ALLaM seam** (`backend/explainer.py`): deterministic `explain(result, bundle) -> str`, fluent MSA, 2–3 sentences, names Tawarruq + top-2 signals. **Stubbed — real ALLaM/watsonx drops in here.** *(Agent 1 — DONE)*
- **4c state**: `{ step, persona, bundle, result, offline }`; steps `pick → connecting → reveal → drilldown → forecast → buckets`. *(Agent 3)*

---
## Change log (append-only)
- 2026-06-18 · Agent 1 · seeded contracts. **Added two convenience endpoints** to Contract 3 support (`GET /personas`, `GET /bundle/{persona_id}`) so the frontend + fallback capture aren't blocked on Agent 2's generator. Non-breaking (additive).
