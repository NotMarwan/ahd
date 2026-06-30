# 🔨 BUILD-LOG — Tadfuq-inside-Rizq MVP (shared heartbeat)
> Append-only. Each agent: what you built, % , bugs found/fixed, blockers, contract changes. Read others' entries before integrating. Seeded by Agent 1.

## Workstream claims
| Stream | Owner | Status |
|---|---|---|
| A1 — underwriting engine (backend) | **Agent 1** | ✅ CLAIMED — engine built, tested, HTTP-verified |
| A2 — data + connectors + integration/QA | — | open |
| A3 — frontend core (shell/tokens/client + hero flow) | — | open |
| A4 — frontend secondary + pitch + vault reconcile | — | open |

Contracts: see `contracts/CONTRACTS.md` (LAW). Change it → log here.

---

## 2026-06-18 · Agent 1 · A1 underwriting engine — BUILT & VERIFIED
**Read first (continuity):** my handoff `handoffs/handoff-2.md`, `00_SYNTHESIS.md`, `02_Agent-1/concept-tadfuq.md`, `02_Agent-3/concept-rizq-tadfuq-flagship.md` (frozen `underwrite()`). ✅ done.

**What I built (all under `backend/`):**
- `underwrite.py` — deterministic engine. Extracts **6 signals** (5 OB + 1 ZATCA), scores, maps to a **computed** limit/tenor/confidence, decomposes the limit into per-signal SAR contributions. Implements Contract 2 exactly.
- `explainer.py` — Contract 4b ALLaM seam: deterministic fluent-MSA rationale naming Tawarruq + top-2 signals + ZATCA-verified %. **Labeled STUBBED** (real ALLaM/watsonx drops into `explain()`).
- `app.py` — FastAPI: `POST /underwrite`, `GET /health`, plus Contract-3 support `GET /personas` + `GET /bundle/{id}` (so A3's `connect()` and A2's fallback capture aren't blocked).
- `fixtures.py` — seeded isolation bundles for 3 personas (stand-in until A2's `data/generate.py`; engine consumes A2's output unchanged).
- `model/train.py` + `model/limit_model.pkl` — optional GBM seam (R²=0.986); transparent fn is the demo default, GBM behind `USE_MODEL=1`.
- `tests/test_underwrite.py` — 7 pytest, all green. `dump_sample_io.py` → `sample_io.json` (contract proof).

**Proof it RUNS (executed, not described):**
- `python -m pytest -q` → **7 passed in 0.12s**.
- Engine on 3 personas (computed, distinct, data-driven):
  - designer → **54,000 SAR**, 12m, conf 0.93, ZATCA 72%
  - merchant → **100,000 SAR**, 12m, conf 0.95, ZATCA 87%
  - gig driver → **9,500 SAR**, 6m, conf 0.72, ZATCA 8%  ← low verification ⇒ lower limit+confidence = **the moat working**
- GBM trained R²=0.986; `USE_MODEL=1` path returns 56,000 (consistent w/ transparent 54,000).
- Live server (uvicorn :8077): `/health`, `/personas`, `/bundle/{id}`, `POST /underwrite` all verified over HTTP. `generated_in_ms`≈1.

**Built vs mocked (honest):**
- *Real/computed:* all 6 signals, the limit, the contributions, confidence, determinism, the GBM.
- *Stubbed (labeled):* the ALLaM call (deterministic template seam); the synthetic data (my fixtures until A2's generator); no live OB/ZATCA rails (by design — sandbox/synthetic).

**Bugs found/fixed:** (1) contribution rounding drift → fixed by absorbing remainder into top signal so `Σ contributions == limit_sar` (test enforces). (2) console mojibake on HTTP Arabic = PowerShell OEM display only; data is correct UTF-8 (verified via `sample_io.json` round-trip) — **not a code bug**; A3 must still verify RTL render in-browser.

**Moat guarantee enforced in code+tests:** ≥1 OB signal AND the ZATCA `invoice_verified_ratio` always contribute to an eligible limit (`test_moat_both_ob_and_zatca_contribute`).

**% complete — A1 workstream: ~85%** (engine is the spine; complete, tested, HTTP-verified, model seam done).
**What's left to 100% (next session):**
- [ ] Swap my `fixtures.py` for **A2's `data/generate.py`** output (contract-compatible; should be drop-in).
- [ ] Expose **GBM feature-importance** on `/underwrite` (or a `/explain` endpoint) to power A3's "why this number?" drill-down beyond the linear contributions.
- [ ] Add a pydantic `AccountBundle` model for stricter 422s (currently accepts dict + checks `ob_transactions`).
- [ ] Help A2 **capture `fallback-recording.json`** from `/bundle` + `/underwrite` (offline demo path).
- [ ] Tune segment caps / eligibility with A2 once real distributions land.

**Blockers:** none. Engine runnable standalone now: `cd backend && python -m uvicorn app:app --port 8000` (see `RUN.md`).
