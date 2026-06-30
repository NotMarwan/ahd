"""
Tadfuq FastAPI service — Agent 1.  Contract 2 + Contract 3 support.

Run:  uvicorn app:app --port 8000   (from backend/)
      or:  python app.py
Endpoints:
  GET  /health                 -> {status, signals, weights}
  GET  /personas               -> persona teasers (Contract 3 getPersonas support)
  GET  /bundle/{persona_id}    -> a ready AccountBundle (for connect() + fallback capture)
  POST /underwrite             -> Contract 2 decision
"""
from __future__ import annotations
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import fixtures
import underwrite as uw

app = FastAPI(title="Tadfuq Underwriting Engine", version="0.1.0")

# local dev / file:// frontend — permissive CORS is fine for the hackathon
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "engine": "tadfuq", "version": app.version,
            "use_model": os.environ.get("USE_MODEL") == "1",
            "signals": list(uw.WEIGHTS.keys()), "weights": uw.WEIGHTS}


@app.get("/personas")
def personas():
    return fixtures.PERSONAS


@app.get("/bundle/{persona_id}")
def bundle(persona_id: str):
    try:
        return fixtures.build_bundle(persona_id)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"unknown persona {persona_id}")


@app.post("/underwrite")
def underwrite(bundle: dict):
    if "ob_transactions" not in bundle:
        raise HTTPException(status_code=422, detail="bundle missing ob_transactions (Contract 1)")
    return uw.underwrite(bundle)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
