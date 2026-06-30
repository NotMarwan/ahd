"""Runs the engine on all 3 personas, writes sample_io.json (contract proof),
prints a human summary. Run from backend/:  python dump_sample_io.py"""
from __future__ import annotations
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fixtures
import underwrite as uw

out = {}
print("=" * 64)
for pid in ["freelancer_designer", "small_merchant", "gig_driver"]:
    b = fixtures.build_bundle(pid)
    r = uw.underwrite(b)
    out[pid] = {"input_summary": {
        "persona_id": pid, "months_active": b["profile"]["months_active"],
        "ob_txns": len(b["ob_transactions"]), "zatca_invoices": len(b["zatca_invoices"]),
        "pos_settlements": len(b["pos_settlements"])}, "output": r}
    print(f"{pid:20s}  limit={r['limit_sar']:>7,} SAR  tenor={r['tenor_months']}m  "
          f"conf={r['confidence']}  id={r['decision_id']}")
    print(f"   AR: {r['explanation_ar']}")
    print(f"   signals: " + ", ".join(f"{s['name']}={s['value']}→{s['contribution_sar']:,}"
                                       for s in r["signals"]))
    print("-" * 64)

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_io.json"),
          "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print("wrote sample_io.json")
