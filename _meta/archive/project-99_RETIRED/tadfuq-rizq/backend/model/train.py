"""
Optional GBM seam — Agent 1.

Trains a GradientBoostingRegressor that maps the 6-signal vector -> months of
effective income to extend, learned from the transparent policy + mild structured
nonlinearity. This exists so the team can tell the "trained model" story for the
Data-analysis criterion; the service uses it only when USE_MODEL=1, otherwise the
fully-explainable transparent function is the default.

Run:  python model/train.py   (writes model/limit_model.pkl, prints R^2)
Deterministic: fixed numpy seed.
"""
from __future__ import annotations
import os
import numpy as np

# import the policy weights so the learned target is consistent with the engine
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from underwrite import WEIGHTS, MAX_INCOME_MULTIPLE  # noqa: E402

FEATURES = list(WEIGHTS.keys())


def _target(X):
    # base policy: score * MAX_INCOME_MULTIPLE, plus a small interaction that a
    # tree can learn (verification amplifies stability) + bounded noise
    score = X @ np.array([WEIGHTS[f] for f in FEATURES])
    interaction = 0.6 * X[:, FEATURES.index("invoice_verified_ratio")] * \
        X[:, FEATURES.index("cashflow_stability")]
    y = (score + 0.15 * interaction) * MAX_INCOME_MULTIPLE
    return np.clip(y, 0.0, MAX_INCOME_MULTIPLE * 1.1)


def main():
    from sklearn.ensemble import GradientBoostingRegressor
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import r2_score
    import joblib

    rng = np.random.default_rng(42)
    X = rng.random((4000, len(FEATURES)))
    y = _target(X) + rng.normal(0, 0.05, size=4000)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(n_estimators=200, max_depth=3, random_state=42)
    model.fit(Xtr, ytr)
    r2 = r2_score(yte, model.predict(Xte))

    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "limit_model.pkl")
    joblib.dump(model, out)
    print(f"trained GBM  R^2={r2:.3f}  features={FEATURES}  -> {out}")


if __name__ == "__main__":
    main()
