"""
Isolation fixtures — Agent 1 (backend).

Deterministic, seeded synthetic AccountBundles (Contract 1) for the 3 personas,
so the engine is runnable + testable WITHOUT waiting on Agent 2's production
generator (data/generate.py). When that lands, the engine consumes its output
unchanged — these fixtures stay only as test scaffolding.

Dates are anchored to a fixed "now" (2026-05) so output is reproducible
regardless of the real run date.
"""
from __future__ import annotations
import random

END_YEAR, END_MONTH = 2026, 5
SEEDS = {"freelancer_designer": 11, "small_merchant": 22, "gig_driver": 33}


def _months(n):
    out, y, m = [], END_YEAR, END_MONTH
    for _ in range(n):
        out.append(f"{y:04d}-{m:02d}")
        m -= 1
        if m == 0:
            m, y = 12, y - 1
    return list(reversed(out))


def _day(rng, month, lo=2, hi=27):
    return f"{month}-{rng.randint(lo, hi):02d}"


def build_bundle(persona_id: str) -> dict:
    if persona_id not in SEEDS:
        raise ValueError(f"unknown persona {persona_id!r}")
    rng = random.Random(SEEDS[persona_id])
    if persona_id == "freelancer_designer":
        return _designer(rng)
    if persona_id == "small_merchant":
        return _merchant(rng)
    return _gig_driver(rng)


def _designer(rng) -> dict:
    months = _months(18)
    clients = ["استوديو نون", "وكالة مدى", "شركة أفق"]
    ob, zatca = [], []
    for mi, month in enumerate(months):
        # 3 recurring clients, each pays ~3.5–5k most months (occasional skip)
        for ci, client in enumerate(clients):
            if rng.random() < 0.88:
                amt = round(rng.uniform(3500, 5200), 2)
                d = _day(rng, month)
                ob.append({"date": d, "amount_sar": amt, "direction": "credit",
                           "category": "design_services", "counterparty": client})
                # ~80% of client income is invoiced via ZATCA and cleared
                if rng.random() < 0.80:
                    zatca.append({"date": d, "amount_sar": amt, "buyer": client,
                                  "status": "cleared" if rng.random() < 0.9 else "pending",
                                  "uuid": f"zd-{mi:02d}-{ci}"})
        # living + software expenses
        for _ in range(rng.randint(4, 6)):
            ob.append({"date": _day(rng, month), "amount_sar": round(rng.uniform(700, 1800), 2),
                       "direction": "debit", "category": "living", "counterparty": "نفقات"})
    return {"persona_id": "freelancer_designer",
            "profile": {"name_ar": "نورة — مصمّمة مستقلّة", "segment": "freelancer",
                        "months_active": 18, "has_simah_score": False},
            "ob_transactions": ob, "zatca_invoices": zatca, "pos_settlements": []}


def _merchant(rng) -> dict:
    months = _months(24)
    ob, zatca, pos = [], [], []
    for mi, month in enumerate(months):
        m_num = int(month[5:7])
        seasonal = 1.6 if m_num in (3, 4) else (1.3 if m_num in (9, 12) else 1.0)  # Ramadan/Eid/season
        base = rng.uniform(16000, 26000) * seasonal
        # POS settlements (several through the month) make up most income
        n_settle = rng.randint(3, 5)
        for s in range(n_settle):
            amt = round(base / n_settle * rng.uniform(0.85, 1.15), 2)
            d = _day(rng, month)
            pos.append({"date": d, "amount_sar": amt, "terminal": f"POS-{rng.randint(1,3)}"})
            ob.append({"date": d, "amount_sar": amt, "direction": "credit",
                       "category": "pos_settlement", "counterparty": "مدى"})
            # merchant invoices ~90% (ZATCA Wave 24)
            if rng.random() < 0.90:
                zatca.append({"date": d, "amount_sar": amt, "buyer": "عملاء التجزئة",
                              "status": "cleared" if rng.random() < 0.92 else "pending",
                              "uuid": f"zm-{mi:02d}-{s}"})
        for _ in range(rng.randint(5, 8)):
            ob.append({"date": _day(rng, month), "amount_sar": round(rng.uniform(1500, 5000), 2),
                       "direction": "debit", "category": "inventory", "counterparty": "موردون"})
    return {"persona_id": "small_merchant",
            "profile": {"name_ar": "متجر الرفاع — تجارة تجزئة", "segment": "small_merchant",
                        "months_active": 24, "has_simah_score": False},
            "ob_transactions": ob, "zatca_invoices": zatca, "pos_settlements": pos}


def _gig_driver(rng) -> dict:
    months = _months(12)
    ob, zatca = [], []
    for mi, month in enumerate(months):
        # volatile: many small daily payouts, weekend spikes, dry stretches
        target = rng.uniform(4000, 9000)
        acc, guard = 0.0, 0
        while acc < target and guard < 40:
            amt = round(rng.uniform(35, 160), 2)
            ob.append({"date": _day(rng, month), "amount_sar": amt, "direction": "credit",
                       "category": "ride_payout", "counterparty": "منصة توصيل"})
            acc += amt
            guard += 1
        # gig drivers rarely issue ZATCA invoices -> low verified ratio
        if rng.random() < 0.25:
            zatca.append({"date": _day(rng, month), "amount_sar": round(acc * rng.uniform(0.1, 0.3), 2),
                          "buyer": "منصة توصيل", "status": "cleared", "uuid": f"zg-{mi:02d}"})
        # fuel + living debits
        for _ in range(rng.randint(6, 10)):
            ob.append({"date": _day(rng, month), "amount_sar": round(rng.uniform(120, 480), 2),
                       "direction": "debit", "category": "fuel", "counterparty": "وقود"})
    return {"persona_id": "gig_driver",
            "profile": {"name_ar": "سعد — سائق توصيل", "segment": "gig_driver",
                        "months_active": 12, "has_simah_score": False},
            "ob_transactions": ob, "zatca_invoices": zatca, "pos_settlements": []}


PERSONAS = [
    {"persona_id": "freelancer_designer", "name_ar": "نورة — مصمّمة مستقلّة", "segment": "freelancer",
     "teaser_ar": "دخل غير منتظم من 3 عملاء، 18 شهرًا، بلا سجل سِمَة"},
    {"persona_id": "small_merchant", "name_ar": "متجر الرفاع", "segment": "small_merchant",
     "teaser_ar": "مبيعات موسمية عبر نقاط البيع، فواتير زاتكا معتمدة، 24 شهرًا"},
    {"persona_id": "gig_driver", "name_ar": "سعد — سائق توصيل", "segment": "gig_driver",
     "teaser_ar": "دخل يومي متقلّب من منصات التوصيل، 12 شهرًا"},
]
