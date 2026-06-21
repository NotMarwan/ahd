"""
REFERENCE underwrite() — Agent 2 (data/integration).

>>> NOT CANONICAL <<<  Agent 1's `backend/underwrite.py` is the canonical engine.
This is a contract-conformant REFERENCE used to (a) generate the offline fallback
recording and (b) give Agent 1 a concrete target while their engine lands. It obeys
Contract 2 exactly (limit computed from signals, >=1 OB + >=1 ZATCA driver,
deterministic, contributions sum ~ limit, structure 'none' when limit 0).

`make_fallback.py` prefers `backend.underwrite.underwrite` when importable and only
falls back to this. Regenerate the fallback from the canonical engine when it lands.

Arabic explanation is delegated to Agent 1's canonical ALLaM seam
(`backend/explainer.py::explain`) when importable, else a faithful local copy.
"""
from __future__ import annotations
import os
import statistics
import sys
import time
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import personas as P  # noqa: E402

# --- reuse Agent 1's canonical explainer if available --------------------------
_BACKEND = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.insert(0, _BACKEND)
try:
    from explainer import explain as _explain_ar  # Agent 1's canonical seam
    _EXPLAINER = "backend/explainer.py (Agent 1, canonical)"
except Exception:  # pragma: no cover - fallback only
    def _explain_ar(result, bundle):
        m = bundle.get("profile", {}).get("months_active", 0)
        if result["limit_sar"] <= 0:
            return f"لا يتوفّر حدّ تمويل حاليًا: السجل ({m} أشهر) أو الإشارات غير كافية بعد."
        top = sorted(result["signals"], key=lambda s: s["contribution_sar"], reverse=True)
        s1 = top[0]["label_ar"] if top else "تدفّقك النقدي"
        return (f"بناءً على تحليل {m} شهرًا، نقترح حدّ تمويل رأس مال عامل بصيغة التورّق "
                f"بقيمة {int(result['limit_sar']):,} ريال لمدة {result['tenor_months']} أشهر، "
                f"استنادًا إلى {s1}. هيكل تورّق شرعي دون فائدة ربوية.")
    _EXPLAINER = "data/reference_underwrite.py local fallback"

LABELS = {
    "cashflow_stability": "استقرار التدفّق النقدي",
    "income_regularity": "انتظام الدخل من عملاء متكرّرين",
    "revenue_trend": "اتجاه نمو الإيرادات",
    "buffer_months": "هامش السيولة الاحتياطي",
    "invoice_verified_ratio": "نسبة الدخل الموثّق بفواتير زاتكا",
}
SOURCE = {  # which rail each signal comes from (the moat proof)
    "cashflow_stability": "OB", "income_regularity": "OB", "revenue_trend": "OB",
    "buffer_months": "OB", "invoice_verified_ratio": "ZATCA",
}
WEIGHTS = {  # positive contributors to creditworthiness
    "invoice_verified_ratio": 0.28,  # ZATCA moat carries the most weight
    "cashflow_stability": 0.24,
    "income_regularity": 0.20,
    "buffer_months": 0.16,
    "revenue_trend": 0.12,
}


def _clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def _monthly(txns, key="amount_sar"):
    by = defaultdict(float)
    for t in txns:
        by[t["date"][:7]] += t[key]
    return dict(sorted(by.items()))


def extract_signals(bundle: dict) -> dict:
    """All six signals (0..1). >=1 OB + >=1 ZATCA by construction."""
    credits = [t for t in bundle["ob_transactions"] if t["direction"] == "credit"]
    debits = [t for t in bundle["ob_transactions"] if t["direction"] == "debit"]
    m_rev = _monthly(credits)
    m_exp = _monthly(debits)
    rev_vals = list(m_rev.values()) or [0.0]
    exp_vals = list(m_exp.values()) or [0.0]
    avg_rev = statistics.fmean(rev_vals)
    total_credit = sum(rev_vals)

    # OB: cash-flow stability = 1 - coefficient of variation of monthly REVENUE.
    # (QA fix: measuring NET conflated lumpy inventory/expense spikes with income
    #  instability and zeroed the merchant's headline signal. Income reliability is
    #  a revenue property. Note to A1: align backend/underwrite.py to revenue-CV.)
    cv_rev = (statistics.pstdev(rev_vals) / avg_rev) if avg_rev > 0 else 1.0
    cashflow_stability = _clamp(1.0 - cv_rev)

    # OB: revenue trend (first-third vs last-third average)
    third = max(1, len(rev_vals) // 3)
    first_avg = statistics.fmean(rev_vals[:third])
    last_avg = statistics.fmean(rev_vals[-third:])
    trend = (last_avg - first_avg) / first_avg if first_avg > 0 else 0.0
    revenue_trend = _clamp(0.5 + trend)

    # OB: income regularity = share of credit value from recurring counterparties
    by_cp_months = defaultdict(set)
    by_cp_amt = defaultdict(float)
    for t in credits:
        by_cp_months[t["counterparty"]].add(t["date"][:7])
        by_cp_amt[t["counterparty"]] += t["amount_sar"]
    n_months = max(1, len(m_rev))
    recurring_amt = sum(a for cp, a in by_cp_amt.items() if len(by_cp_months[cp]) >= 0.5 * n_months)
    income_regularity = _clamp(recurring_amt / total_credit if total_credit else 0.0)

    # OB: buffer months = accumulated net / avg monthly expense (normalized /12)
    avg_exp = statistics.fmean(exp_vals)
    net_total = total_credit - sum(exp_vals)
    buffer_raw = (net_total / avg_exp) if avg_exp > 0 else 0.0
    buffer_months = _clamp(buffer_raw / 12.0)

    # ZATCA: verified ratio = cleared invoice value / total credit (the moat)
    cleared = sum(i["amount_sar"] for i in bundle["zatca_invoices"] if i["status"] == "cleared")
    invoice_verified_ratio = _clamp(cleared / total_credit if total_credit else 0.0)

    return {
        "_avg_rev": avg_rev, "_buffer_raw": buffer_raw,
        "cashflow_stability": cashflow_stability,
        "income_regularity": income_regularity,
        "revenue_trend": revenue_trend,
        "buffer_months": buffer_months,
        "invoice_verified_ratio": invoice_verified_ratio,
        "expense_volatility": _clamp((statistics.pstdev(exp_vals) / avg_exp) if avg_exp > 0 else 1.0),
    }


def underwrite(bundle: dict) -> dict:
    t0 = time.perf_counter()
    sig = extract_signals(bundle)
    avg_rev = sig["_avg_rev"]

    # creditworthiness in 0..1 from weighted positive signals minus expense volatility
    cw = sum(WEIGHTS[k] * sig[k] for k in WEIGHTS) - 0.15 * sig["expense_volatility"]
    cw = _clamp(cw)

    # limit: a fraction of monthly revenue scaled by creditworthiness,
    # then materially boosted/penalized by ZATCA verification (the moat).
    raw = avg_rev * (0.30 + 1.30 * cw)
    zatca_factor = 0.75 + 0.45 * sig["invoice_verified_ratio"]
    limit = raw * zatca_factor
    limit = min(limit, avg_rev * 2.0)            # responsible-lending cap
    limit_sar = int(round(limit / 500.0)) * 500   # round to nearest 500
    if cw < 0.18 or avg_rev < 1000:
        limit_sar = 0

    structure = "Tawarruq" if limit_sar > 0 else "none"
    tenor = 6
    if limit_sar > 0:
        if sig["cashflow_stability"] > 0.7 and sig["invoice_verified_ratio"] > 0.6:
            tenor = 9
        elif cw < 0.35:
            tenor = 3
    confidence = round(_clamp(0.40 + 0.30 * sig["invoice_verified_ratio"]
                              + 0.20 * sig["cashflow_stability"]
                              + 0.10 * min(bundle["profile"]["months_active"] / 24.0, 1.0)), 2)

    # contributions: split the limit across positive signals by weight*value share
    signals = []
    if limit_sar > 0:
        shares = {k: WEIGHTS[k] * sig[k] for k in WEIGHTS}
        tot = sum(shares.values()) or 1.0
        running = 0
        keys = sorted(shares, key=lambda k: shares[k], reverse=True)
        for i, k in enumerate(keys):
            if i == len(keys) - 1:
                contrib = limit_sar - running   # last one absorbs rounding so sum == limit
            else:
                contrib = int(round(limit_sar * shares[k] / tot))
                running += contrib
            signals.append({"name": k, "value": round(sig[k], 2),
                            "contribution_sar": contrib, "label_ar": LABELS[k],
                            "source": SOURCE[k]})
    else:
        for k in WEIGHTS:
            signals.append({"name": k, "value": round(sig[k], 2), "contribution_sar": 0,
                            "label_ar": LABELS[k], "source": SOURCE[k]})

    result = {
        "limit_sar": limit_sar,
        "structure": structure,
        "tenor_months": tenor,
        "explanation_ar": "",
        "confidence": confidence,
        "signals": signals,
        "decision_id": f"det-{P.MASTER_SEED}-{bundle['persona_id']}",
        "generated_in_ms": round((time.perf_counter() - t0) * 1000, 1),
    }
    result["explanation_ar"] = _explain_ar(result, bundle)
    return result


if __name__ == "__main__":
    import json
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import generate
    print(f"[reference_underwrite] explainer = {_EXPLAINER}\n")
    for pid in P.PROFILES:
        r = underwrite(generate.build_bundle(pid))
        drivers = " · ".join(f"{s['name']}({s['source']})={s['value']}→{s['contribution_sar']:,}"
                             for s in r["signals"])
        print(f"{pid:<20} limit={r['limit_sar']:>7,} {r['structure']:<9} "
              f"tenor={r['tenor_months']}m conf={r['confidence']}  Σcontrib="
              f"{sum(s['contribution_sar'] for s in r['signals']):,}")
        print(f"    {drivers}")
        print(f"    AR: {r['explanation_ar'][:90]}...\n")
