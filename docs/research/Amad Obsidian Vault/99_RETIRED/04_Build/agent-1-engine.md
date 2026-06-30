---
title: 04_Build — Agent 1 · Tadfuq Underwriting Engine (BUILT)
tags: [agent/1, build, status/verified, track/open-banking]
updated: 2026-06-18
---

# 🔨 Build — Tadfuq Underwriting Engine (Agent 1)
> The backend spine of the flagship [[concept-rizq-tadfuq-flagship|Tadfuq-inside-Rizq]]. **Built, tested, HTTP-verified** on 2026-06-18.

## Where the code lives
`project/tadfuq-rizq/backend/` — `underwrite.py` (engine) · `explainer.py` (ALLaM seam, stubbed) · `app.py` (FastAPI) · `fixtures.py` (isolation data) · `model/train.py` (GBM seam) · `tests/` · `sample_io.json` (contract proof). Run steps: `project/tadfuq-rizq/RUN.md`. Heartbeat: `project/tadfuq-rizq/BUILD-LOG.md`.

## What it does (Contract 2)
`POST /underwrite` ← `AccountBundle` → `{ limit_sar, structure:"Tawarruq", tenor_months, explanation_ar, confidence, signals[], decision_id, generated_in_ms }`.

## Key decisions (so the next agent doesn't re-litigate)
1. **Transparent weighted scoring is the demo default** — every SAR is attributable to a named signal (real explainability). A trained **GBM (R²=0.986)** sits behind the `USE_MODEL=1` seam for the "model" story. Honest tradeoff documented in code.
2. **6 signals, moat enforced:** 5 OB + 1 ZATCA (`invoice_verified_ratio`); a test asserts both sources contribute to every eligible limit. This is [[concept-tadfuq|Tadfuq]]'s OB×ZATCA moat made literal.
3. **Determinism** on every field except `generated_in_ms` (latency, informational). Stable `decision_id` = md5 of the bundle.
4. **Eligibility gate:** ≥6 months, score ≥0.30, positive income → else limit 0 / `structure:"none"` (thin-file path tested).
5. Added `GET /personas` + `GET /bundle/{id}` so Agent 3's `connect()` and Agent 2's fallback capture aren't blocked.

## Verified output (computed, distinct, data-driven)
| Persona | Limit | Tenor | Conf | ZATCA verified |
|---|---|---|---|---|
| نورة — مصمّمة (designer) | 54,000 SAR | 12m | 0.93 | 72% |
| متجر الرفاع (merchant) | 100,000 SAR | 12m | 0.95 | 87% |
| سعد — سائق (gig driver) | 9,500 SAR | 6m | 0.72 | 8% |

Gig driver's low ZATCA verification → lower limit + confidence = **the moat working on screen.** `pytest` 7/7. All endpoints live over HTTP.

## % + what's left
**A1 workstream ≈85%.** Left to 100%: consume Agent 2's real generator (drop-in), expose GBM feature-importance for A3's drill-down, capture `fallback-recording.json`, pydantic bundle model. Full list in `BUILD-LOG.md`.

## Links
- [[concept-rizq-tadfuq-flagship]] · [[concept-tadfuq]] · [[handoff-2|Agent 1 handoff]] · [[00_SYNTHESIS]] · [[00_Index]]
