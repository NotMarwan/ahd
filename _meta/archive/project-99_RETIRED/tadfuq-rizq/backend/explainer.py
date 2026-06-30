"""
ALLaM seam (Contract 4b) — Agent 1.

Deterministic Arabic rationale generator. Reads like ALLaM output (fluent MSA,
2–3 sentences, names the Tawarruq structure + the top-2 driving signals).

>>> STUBBED <<<  In production this single function is replaced by a call to
ALLaM via IBM watsonx. Everything it states is derived from the computed result
(no free-text hallucination) — so the stub is faithful, just not generative.
"""
from __future__ import annotations


def _sar(x) -> str:
    return f"{int(round(x)):,}"


def explain(result: dict, bundle: dict) -> str:
    months = bundle.get("profile", {}).get("months_active", 0)
    sigs = sorted(result.get("signals", []), key=lambda s: s["contribution_sar"], reverse=True)
    verified = 0
    for s in result.get("signals", []):
        if s["name"] == "invoice_verified_ratio":
            verified = round(s["value"] * 100)

    if result["limit_sar"] <= 0 or result["structure"] == "none":
        return (f"لا يتوفّر حدّ تمويل حاليًا: السجل المتاح ({months} أشهر) أو إشارات "
                f"التدفّق النقدي غير كافية بعد. بمجرّد توفّر دخل أكثر انتظامًا وفواتير "
                f"زاتكا معتمدة، سيُعاد تقييم الأهلية تلقائيًا دون أي إجراء منك.")

    s1 = sigs[0]["label_ar"] if len(sigs) > 0 else "تدفّقك النقدي"
    s2 = sigs[1]["label_ar"] if len(sigs) > 1 else "انتظام دخلك"
    return (f"بناءً على تحليل {months} شهرًا من تدفّقك النقدي، نقترح حدّ تمويل رأس مال "
            f"عامل بصيغة التورّق بقيمة {_sar(result['limit_sar'])} ريال لمدة "
            f"{result['tenor_months']} أشهر. استند القرار أساسًا إلى {s1} و{s2}، مع تحقّق "
            f"{verified}% من دخلك عبر فواتير زاتكا المعتمدة. التمويل مبنيّ على هيكل تورّق "
            f"شرعي دون أي فائدة ربوية، وقابل لمراجعة الهيئة الشرعية.")
