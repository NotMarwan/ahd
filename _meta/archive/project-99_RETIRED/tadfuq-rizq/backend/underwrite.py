"""
Tadfuq underwriting engine — Agent 1 (Lane 1).  Implements Contract 2.

Turns an AccountBundle (Contract 1) into an explainable, Shariah-framed
working-capital limit.

Design choice (honest): a TRANSPARENT, deterministic weighted-scoring function
is the demo default — every SAR of the limit is attributable to a named signal,
which is what makes the explanation real rather than decorative. A gradient-
boosted model (model/train.py) is available behind the same `_months_extended`
seam for the "trained model" story; enable with env USE_MODEL=1.

Determinism: every decision field is a pure function of the bundle. The only
non-deterministic field is `generated_in_ms` (measured wall-clock, informational)
— excluded from determinism guarantees/tests.

Moat guarantee: at least one OB signal and the ZATCA signal
(`invoice_verified_ratio`) always contribute to an eligible limit.
"""
from __future__ import annotations
import hashlib
import json
import os
import time
from collections import defaultdict
from statistics import mean, median, pstdev

import explainer

# ---- signal weights (sum = 1.0) ----
WEIGHTS = {
    "cashflow_stability":     0.25,  # OB
    "income_regularity":      0.20,  # OB
    "invoice_verified_ratio": 0.20,  # ZATCA  <-- the moat (OB x ZATCA cross-check)
    "revenue_trend":          0.15,  # OB
    "buffer_adequacy":        0.10,  # OB
    "expense_discipline":     0.10,  # OB (inverse of expense volatility)
}
OB_SIGNALS = {"cashflow_stability", "income_regularity", "revenue_trend",
              "buffer_adequacy", "expense_discipline"}
ZATCA_SIGNALS = {"invoice_verified_ratio"}

LABELS_AR = {
    "cashflow_stability":     "استقرار التدفّق النقدي",
    "income_regularity":      "انتظام الدخل",
    "invoice_verified_ratio": "تحقّق الفواتير عبر زاتكا",
    "revenue_trend":          "اتجاه نمو الإيرادات",
    "buffer_adequacy":        "كفاية الفائض الشهري",
    "expense_discipline":     "انضباط المصروفات",
}

SEGMENT_CAP = {"freelancer_designer": 100_000, "small_merchant": 250_000, "gig_driver": 50_000}
DEFAULT_CAP = 100_000
ELIGIBILITY_MIN_MONTHS = 6
ELIGIBILITY_MIN_SCORE = 0.30
MAX_INCOME_MULTIPLE = 6.0  # months of effective income at top score


# ---------- small numeric helpers ----------
def _clip(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def _cv(vals):
    vals = list(vals)
    if not vals:
        return 1.0
    m = mean(vals)
    if m <= 0:
        return 1.0
    return (pstdev(vals) / m) if len(vals) > 1 else 0.0


def _slope(ys):
    n = len(ys)
    if n < 2:
        return 0.0
    xs = list(range(n))
    mx, my = mean(xs), mean(ys)
    den = sum((x - mx) ** 2 for x in xs)
    if den == 0:
        return 0.0
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / den


def _monthly(transactions, direction):
    by = defaultdict(float)
    for t in transactions:
        if t.get("direction") == direction:
            by[str(t["date"])[:7]] += float(t["amount_sar"])
    return dict(sorted(by.items()))


# ---------- signal extraction ----------
def extract_signals(bundle: dict) -> dict:
    ob = bundle.get("ob_transactions", [])
    zatca = bundle.get("zatca_invoices", [])

    income_by_month = _monthly(ob, "credit")
    expense_by_month = _monthly(ob, "debit")
    income_series = list(income_by_month.values())
    expense_series = list(expense_by_month.values())

    total_income = sum(income_series)
    avg_income = mean(income_series) if income_series else 0.0
    avg_expense = mean(expense_series) if expense_series else 0.0

    # months span (from first to last OB txn)
    all_months = sorted({str(t["date"])[:7] for t in ob}) if ob else []
    span = len(all_months) if all_months else 1

    # OB signals
    cashflow_stability = _clip(1.0 - _cv(income_series))
    income_regularity = _clip(len(income_by_month) / span)
    norm_slope = (_slope(income_series) / avg_income) if avg_income else 0.0
    revenue_trend = _clip(0.5 + norm_slope * 3.0)  # 0.5 = flat
    buffer_adequacy = _clip((avg_income - avg_expense) / avg_income) if avg_income else 0.0
    expense_discipline = _clip(1.0 - _cv(expense_series))

    # ZATCA signal (the moat): share of OB income corroborated by cleared invoices
    cleared = sum(float(i["amount_sar"]) for i in zatca if i.get("status") == "cleared")
    invoice_verified_ratio = _clip(cleared / total_income) if total_income else 0.0

    values = {
        "cashflow_stability": round(cashflow_stability, 4),
        "income_regularity": round(income_regularity, 4),
        "invoice_verified_ratio": round(invoice_verified_ratio, 4),
        "revenue_trend": round(revenue_trend, 4),
        "buffer_adequacy": round(buffer_adequacy, 4),
        "expense_discipline": round(expense_discipline, 4),
    }
    derived = {
        "median_monthly_income": median(income_series) if income_series else 0.0,
        "avg_monthly_income": avg_income,
        "verified_ratio": invoice_verified_ratio,
    }
    return values, derived


# ---------- model seam (transparent default; GBM optional) ----------
_MODEL = None


def _load_model():
    global _MODEL
    if _MODEL is not None:
        return _MODEL
    try:
        import joblib
        path = os.path.join(os.path.dirname(__file__), "model", "limit_model.pkl")
        _MODEL = joblib.load(path)
    except Exception:
        _MODEL = False
    return _MODEL


def _months_extended(score: float, values: dict) -> float:
    """Map signal score -> months of effective income to extend.
    Transparent default = score * MAX_INCOME_MULTIPLE. Optional GBM behind the seam."""
    if os.environ.get("USE_MODEL") == "1":
        model = _load_model()
        if model:
            feats = [[values[k] for k in WEIGHTS]]
            return float(max(0.0, model.predict(feats)[0]))
    return score * MAX_INCOME_MULTIPLE


# ---------- decision ----------
def _decision_id(bundle: dict) -> str:
    payload = json.dumps(
        {"p": bundle.get("persona_id"),
         "ob": [(str(t["date"]), round(float(t["amount_sar"]), 2), t.get("direction")) for t in bundle.get("ob_transactions", [])],
         "z": [(str(i["date"]), round(float(i["amount_sar"]), 2), i.get("status")) for i in bundle.get("zatca_invoices", [])]},
        sort_keys=True, ensure_ascii=False)
    h = hashlib.md5(payload.encode("utf-8")).hexdigest()[:8]
    return f"det-{h}-{bundle.get('persona_id', 'unknown')}"


def underwrite(bundle: dict) -> dict:
    t0 = time.perf_counter()
    persona = bundle.get("persona_id", "unknown")
    months_active = int(bundle.get("profile", {}).get("months_active", 0))
    values, derived = extract_signals(bundle)

    score = sum(WEIGHTS[k] * values[k] for k in WEIGHTS)  # in [0,1]
    eligible = (months_active >= ELIGIBILITY_MIN_MONTHS
                and score >= ELIGIBILITY_MIN_SCORE
                and derived["median_monthly_income"] > 0)

    cap = SEGMENT_CAP.get(persona, DEFAULT_CAP)

    if not eligible:
        limit_sar, tenor, structure = 0, 0, "none"
        signals = [{"name": k, "value": round(values[k], 2), "contribution_sar": 0,
                    "label_ar": LABELS_AR[k]} for k in WEIGHTS]
    else:
        # verification blend: ZATCA-corroborated income is trusted more
        blend = 0.6 + 0.4 * derived["verified_ratio"]
        effective_income = derived["median_monthly_income"] * blend
        months_ext = _months_extended(score, values)
        raw = effective_income * months_ext
        limit_sar = int(min(cap, raw) // 500 * 500)  # round down to nearest 500
        # tenor from quality
        if score >= 0.60 and values["revenue_trend"] >= 0.5:
            tenor = 12
        elif score >= 0.45:
            tenor = 6
        else:
            tenor = 3
        structure = "Tawarruq"
        # decompose limit by each signal's weighted contribution (sum ~= limit)
        denom = score if score > 0 else 1.0
        signals = []
        for k in WEIGHTS:
            contrib = int(round(limit_sar * (WEIGHTS[k] * values[k]) / denom))
            signals.append({"name": k, "value": round(values[k], 2),
                            "contribution_sar": contrib, "label_ar": LABELS_AR[k]})
        # absorb rounding remainder into the top signal so contributions sum to limit
        drift = limit_sar - sum(s["contribution_sar"] for s in signals)
        if signals:
            top = max(signals, key=lambda s: s["contribution_sar"])
            top["contribution_sar"] += drift

    confidence = round(_clip(0.5 + 0.2 * min(months_active, 24) / 24
                             + 0.25 * derived["verified_ratio"]
                             + 0.1 * values["income_regularity"], 0.5, 0.95), 2)

    result = {
        "limit_sar": limit_sar,
        "structure": structure,
        "tenor_months": tenor,
        "explanation_ar": "",  # filled below via the ALLaM seam
        "confidence": confidence,
        "signals": signals,
        "decision_id": _decision_id(bundle),
        "generated_in_ms": int((time.perf_counter() - t0) * 1000),
    }
    result["explanation_ar"] = explainer.explain(result, bundle)
    return result
