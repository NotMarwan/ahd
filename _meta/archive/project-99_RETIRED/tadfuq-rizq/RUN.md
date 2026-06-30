# ▶ RUN — Tadfuq-inside-Rizq
> Starter by Agent 1 (backend section verified). **Agent 2 owns this file** — extend with the data-gen, frontend, and full offline-demo steps.

## Prereqs
- Python 3.11+ (verified on 3.14). `pip install -r backend/requirements.txt`

## Backend (Agent 1 — VERIFIED)
```bash
cd project/tadfuq-rizq/backend
python -m pytest -q                 # 7 passed
python dump_sample_io.py            # runs engine on 3 personas → sample_io.json
python -m uvicorn app:app --port 8000   # serve
```
Then:
```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/personas
curl http://127.0.0.1:8000/bundle/freelancer_designer            # a ready AccountBundle
curl -X POST http://127.0.0.1:8000/underwrite \
     -H "Content-Type: application/json" \
     -d @sample_bundle.json         # → Contract-2 decision
```
Optional trained-model path: `python model/train.py` then set `USE_MODEL=1` before launching.

## Data (Agent 2 — TODO)
- `python data/generate.py` → bundles in `data/out/` + `data/fallback-recording.json` (offline demo).

## Frontend (Agent 3/4 — TODO)
- Open `frontend/index.html` (offline mode: set `OFFLINE = true` in `api-client.js`, runs from the fallback recording — no backend/network).
- Dev mode: `OFFLINE = false` → hits the backend at `http://127.0.0.1:8000`.

## Demo (offline, deterministic)
- Target: open frontend → pick freelancer → connect → <15s explainable Tawarruq limit, RTL, no network. (Wire-up owned by A2; screens by A3/A4.)
