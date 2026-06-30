"""
Generator — Agent 2 (data). Seeded, deterministic synthetic AccountBundles
(Contract 1) for the 3 personas. This is the CANONICAL data source for the
flagship demo (Agent 1's fixtures.py is only test scaffolding).

Run:
    python data/generate.py          # writes data/out/<persona>.json + prints summary

Determinism: one seed per persona (personas.py). Same persona -> identical bundle.
No datetime.now(), no unseeded randomness. Dates anchored to 2026-05.
"""
from __future__ import annotations
import json
import os
import random
import sys

# allow `python data/generate.py` from repo root or from data/
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import personas as P  # noqa: E402


def _day(rng: random.Random, month: str, lo: int = 2, hi: int = 27) -> str:
    return f"{month}-{rng.randint(lo, hi):02d}"


def _designer(rng, prof) -> dict:
    months = P.months_back(prof["months_active"])
    ob, zatca = [], []
    for mi, month in enumerate(months):
        growth = (1.0 + prof["monthly_growth"]) ** mi
        for ci, client in enumerate(prof["recurring_clients"]):
            if rng.random() < prof["client_pay_prob"]:
                lo, hi = prof["client_pay_range"]
                amt = round(rng.uniform(lo, hi) * growth, 2)
                d = _day(rng, month)
                ob.append({"date": d, "amount_sar": amt, "direction": "credit",
                           "category": "design_services", "counterparty": client})
                if rng.random() < prof["invoice_prob"]:
                    cleared = rng.random() < prof["invoice_cleared_prob"]
                    zatca.append({"date": d, "amount_sar": amt, "buyer": client,
                                  "status": "cleared" if cleared else "pending",
                                  "uuid": f"zd-{mi:02d}-{ci}"})
        # occasional one-off project (not from a recurring client)
        if rng.random() < prof["oneoff_prob"]:
            lo, hi = prof["oneoff_range"]
            amt = round(rng.uniform(lo, hi) * growth, 2)
            ob.append({"date": _day(rng, month), "amount_sar": amt, "direction": "credit",
                       "category": "design_services", "counterparty": "مشروع لمرة واحدة"})
        # living + tooling expenses
        elo, ehi = prof["expense_range"]
        for _ in range(rng.randint(*prof["expense_count"])):
            ob.append({"date": _day(rng, month), "amount_sar": round(rng.uniform(elo, ehi), 2),
                       "direction": "debit", "category": "living", "counterparty": "نفقات"})
    return _wrap("freelancer_designer", prof, ob, zatca, [])


def _merchant(rng, prof) -> dict:
    months = P.months_back(prof["months_active"])
    ob, zatca, pos = [], [], []
    for mi, month in enumerate(months):
        m_num = int(month[5:7])
        seasonal = prof["seasonal"].get(m_num, 1.0)
        growth = (1.0 + prof["monthly_growth"]) ** mi
        blo, bhi = prof["base_monthly_range"]
        base = rng.uniform(blo, bhi) * seasonal * growth
        n = rng.randint(*prof["settlements_per_month"])
        for s in range(n):
            amt = round(base / n * rng.uniform(0.85, 1.15), 2)
            d = _day(rng, month)
            pos.append({"date": d, "amount_sar": amt, "terminal": f"POS-{rng.randint(1, 3)}"})
            ob.append({"date": d, "amount_sar": amt, "direction": "credit",
                       "category": "pos_settlement", "counterparty": "مدى"})
            if rng.random() < prof["invoice_prob"]:
                cleared = rng.random() < prof["invoice_cleared_prob"]
                zatca.append({"date": d, "amount_sar": amt, "buyer": "عملاء التجزئة",
                              "status": "cleared" if cleared else "pending",
                              "uuid": f"zm-{mi:02d}-{s}"})
        elo, ehi = prof["expense_range"]
        for _ in range(rng.randint(*prof["expense_count"])):
            ob.append({"date": _day(rng, month), "amount_sar": round(rng.uniform(elo, ehi), 2),
                       "direction": "debit", "category": "inventory", "counterparty": "موردون"})
    return _wrap("small_merchant", prof, ob, zatca, pos)


def _gig_driver(rng, prof) -> dict:
    months = P.months_back(prof["months_active"])
    ob, zatca = [], []
    plo, phi = prof["payout_range"]
    for mi, month in enumerate(months):
        tlo, thi = prof["monthly_target_range"]
        target = rng.uniform(tlo, thi)
        acc, guard = 0.0, 0
        while acc < target and guard < 80:
            amt = round(rng.uniform(plo, phi), 2)
            ob.append({"date": _day(rng, month), "amount_sar": amt, "direction": "credit",
                       "category": "ride_payout", "counterparty": prof["platform"]})
            acc += amt
            guard += 1
        if rng.random() < prof["invoice_month_prob"]:
            zatca.append({"date": _day(rng, month), "amount_sar": round(acc * rng.uniform(0.1, 0.3), 2),
                          "buyer": prof["platform"], "status": "cleared", "uuid": f"zg-{mi:02d}"})
        elo, ehi = prof["expense_range"]
        for _ in range(rng.randint(*prof["expense_count"])):
            ob.append({"date": _day(rng, month), "amount_sar": round(rng.uniform(elo, ehi), 2),
                       "direction": "debit", "category": "fuel", "counterparty": "وقود"})
    return _wrap("gig_driver", prof, ob, zatca, [])


def _wrap(persona_id, prof, ob, zatca, pos) -> dict:
    # sort by date for realism
    ob.sort(key=lambda t: t["date"])
    zatca.sort(key=lambda t: t["date"])
    pos.sort(key=lambda t: t["date"])
    return {
        "persona_id": persona_id,
        "profile": {"name_ar": prof["name_ar"], "segment": prof["segment"],
                    "months_active": prof["months_active"], "has_simah_score": prof["has_simah_score"]},
        "ob_transactions": ob,
        "zatca_invoices": zatca,
        "pos_settlements": pos,
    }


_BUILDERS = {
    "freelancer_designer": _designer,
    "small_merchant": _merchant,
    "gig_driver": _gig_driver,
}


def build_bundle(persona_id: str) -> dict:
    if persona_id not in P.PROFILES:
        raise ValueError(f"unknown persona {persona_id!r}")
    prof = P.PROFILES[persona_id]
    rng = random.Random(prof["seed"])
    return _BUILDERS[persona_id](rng, prof)


def _summary(b: dict) -> str:
    credits = [t for t in b["ob_transactions"] if t["direction"] == "credit"]
    debits = [t for t in b["ob_transactions"] if t["direction"] == "debit"]
    cin = sum(t["amount_sar"] for t in credits)
    dout = sum(t["amount_sar"] for t in debits)
    zc = sum(i["amount_sar"] for i in b["zatca_invoices"] if i["status"] == "cleared")
    m = b["profile"]["months_active"]
    return (f"{b['persona_id']:<20} mo={m:>2}  credits={cin:>11,.0f}  debits={dout:>10,.0f}  "
            f"net={cin - dout:>10,.0f}  avg_rev/mo={cin / m:>8,.0f}  "
            f"zatca_cleared={zc:>10,.0f} ({(zc / cin * 100 if cin else 0):4.0f}% of credits)  "
            f"txns={len(b['ob_transactions']):>3} inv={len(b['zatca_invoices']):>3} pos={len(b['pos_settlements']):>3}")


def main():
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
    os.makedirs(out_dir, exist_ok=True)
    print("Generating synthetic AccountBundles (deterministic, anchored 2026-05):\n")
    for pid in P.PROFILES:
        b = build_bundle(pid)
        with open(os.path.join(out_dir, f"{pid}.json"), "w", encoding="utf-8") as f:
            json.dump(b, f, ensure_ascii=False, indent=2)
        print("  " + _summary(b))
    print(f"\nWrote {len(P.PROFILES)} bundles to {out_dir}")


if __name__ == "__main__":
    main()
