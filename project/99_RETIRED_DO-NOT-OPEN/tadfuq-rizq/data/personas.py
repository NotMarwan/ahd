"""
Personas — Agent 2 (data). Economic profiles for the 3 demo personas.

These drive data/generate.py. IDs / names / month-counts are kept consistent
with Agent 1's backend/fixtures.py so the engine consumes generator output
unchanged (the fixtures are only test scaffolding; this generator is canonical).

Distributions are chosen so the underwriting signals are MEANINGFUL and the
three personas land at clearly different limits (proving the limit moves with
the data, and that the ZATCA moat matters):
  - designer : stable, mostly-invoiced  -> solid limit, high confidence
  - merchant : seasonal, high volume, POS + ZATCA -> highest limit
  - gig_driver: volatile, thin ZATCA -> smallest limit, lowest confidence
"""
from __future__ import annotations

# Fixed "now" anchor so dates are reproducible regardless of real run date
# (matches Agent 1's fixtures: END 2026-05).
END_YEAR, END_MONTH = 2026, 5

# Master seed for the whole synthetic world. Deterministic.
MASTER_SEED = 20260618

PROFILES = {
    "freelancer_designer": {
        "name_ar": "نورة — مصمّمة مستقلّة",
        "segment": "freelancer",
        "months_active": 18,
        "has_simah_score": False,
        "teaser_ar": "دخل غير منتظم من 3 عملاء، 18 شهرًا، بلا سجل سِمَة",
        "seed": MASTER_SEED + 1,
        # income model
        "recurring_clients": ["استوديو نون", "وكالة مدى", "شركة أفق"],
        "client_pay_range": (3500, 5200),
        "client_pay_prob": 0.88,        # chance a given client pays in a given month
        "monthly_growth": 0.010,        # gentle upward drift -> revenue_trend signal
        "invoice_prob": 0.82,           # share of client income invoiced via ZATCA
        "invoice_cleared_prob": 0.90,
        "oneoff_prob": 0.30,            # occasional extra project
        "oneoff_range": (2000, 4000),
        "expense_count": (4, 6),
        "expense_range": (700, 1800),
        "uses_pos": False,
    },
    "small_merchant": {
        "name_ar": "متجر الرفاع — تجارة تجزئة",
        "segment": "small_merchant",
        "months_active": 24,
        "has_simah_score": False,
        "teaser_ar": "مبيعات موسمية عبر نقاط البيع، فواتير زاتكا معتمدة، 24 شهرًا",
        "seed": MASTER_SEED + 2,
        "base_monthly_range": (16000, 26000),
        "seasonal": {3: 1.6, 4: 1.6, 9: 1.3, 12: 1.3},  # Ramadan / Eid / back-to-school
        "settlements_per_month": (3, 5),
        "invoice_prob": 0.90,           # ZATCA Wave 24: small merchants now on e-invoicing
        "invoice_cleared_prob": 0.92,
        "expense_count": (5, 8),
        "expense_range": (1500, 5000),
        "monthly_growth": 0.006,
        "uses_pos": True,
    },
    "gig_driver": {
        "name_ar": "سعد — سائق توصيل",
        "segment": "gig_driver",
        "months_active": 12,
        "has_simah_score": False,
        "teaser_ar": "دخل يومي متقلّب من منصات التوصيل، 12 شهرًا",
        "seed": MASTER_SEED + 3,
        "monthly_target_range": (4000, 9000),  # volatile month-to-month
        "payout_range": (35, 160),
        "platform": "منصة توصيل",
        "invoice_month_prob": 0.25,     # rarely issues ZATCA -> low verified ratio
        "expense_count": (6, 10),
        "expense_range": (120, 480),
        "monthly_growth": 0.0,
        "uses_pos": False,
    },
}

# Teasers for getPersonas() / GET /personas (Contract 3). Order = demo order.
PERSONA_LIST = [
    {"persona_id": pid, "name_ar": p["name_ar"], "segment": p["segment"], "teaser_ar": p["teaser_ar"]}
    for pid, p in PROFILES.items()
]


def months_back(n: int) -> list[str]:
    """N months as 'YYYY-MM', oldest first, ending at the fixed anchor."""
    out, y, m = [], END_YEAR, END_MONTH
    for _ in range(n):
        out.append(f"{y:04d}-{m:02d}")
        m -= 1
        if m == 0:
            m, y = 12, y - 1
    return list(reversed(out))
