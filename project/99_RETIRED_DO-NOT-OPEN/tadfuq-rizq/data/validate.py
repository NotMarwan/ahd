"""
QA / validation — Agent 2 (test lead).

Adversarial checks on the data + the underwrite contract. Run:
    python data/validate.py
Exit code 0 = all pass. Catches: schema breakage, non-deterministic output,
a constant/hardcoded limit, contributions not summing to the limit, the moat
(OB+ZATCA both driving the number) silently dropping, RTL/encoding issues.
"""
from __future__ import annotations
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import personas as P  # noqa: E402
import generate  # noqa: E402

# Prefer the canonical engine if Agent 1's is importable; else the reference.
_BACKEND = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.insert(0, _BACKEND)
try:
    from underwrite import underwrite  # type: ignore
    ENGINE = "backend/underwrite.py (Agent 1, canonical)"
except Exception:
    from reference_underwrite import underwrite  # noqa: E402
    ENGINE = "data/reference_underwrite.py (Agent 2 reference)"

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
PASS, FAIL = "PASS", "FAIL"
results = []

# Source-of-signal by NAME (Contract 2 signals carry no `source` field; A1's
# canonical engine names the ZATCA signal `invoice_verified_ratio`). Covers both
# A1's engine and the A2 reference signal names. New OB signals default to OB.
ZATCA_NAMES = {"invoice_verified_ratio"}
OB_NAMES = {"cashflow_stability", "income_regularity", "revenue_trend",
            "buffer_adequacy", "buffer_months", "expense_discipline", "expense_volatility"}


def signal_source(sig: dict) -> str:
    return sig.get("source") or ("ZATCA" if sig["name"] in ZATCA_NAMES else "OB")


def check(name, cond, detail=""):
    results.append((cond, name, detail))
    print(f"  [{PASS if cond else FAIL}] {name}" + (f"  — {detail}" if detail else ""))


def validate_bundle(b):
    pid = b["persona_id"]
    assert pid in P.PROFILES
    ok_keys = all(k in b for k in ("persona_id", "profile", "ob_transactions", "zatca_invoices", "pos_settlements"))
    check(f"{pid}: AccountBundle has all Contract-1 keys", ok_keys)
    pr = b["profile"]
    check(f"{pid}: profile complete", all(k in pr for k in ("name_ar", "segment", "months_active", "has_simah_score")))
    dirs_ok = all(t["direction"] in ("credit", "debit") for t in b["ob_transactions"])
    check(f"{pid}: ob_transactions direction ∈ {{credit,debit}}", dirs_ok)
    dates_ok = all(DATE_RE.match(t["date"]) for t in b["ob_transactions"])
    check(f"{pid}: all OB dates are YYYY-MM-DD", dates_ok)
    stat_ok = all(i["status"] in ("cleared", "pending") for i in b["zatca_invoices"])
    check(f"{pid}: ZATCA status ∈ {{cleared,pending}}", stat_ok)
    ar_ok = bool(re.search(r"[؀-ۿ]", pr["name_ar"]))
    check(f"{pid}: name_ar contains Arabic (encoding intact)", ar_ok, pr["name_ar"])


def main():
    print(f"\n=== Tadfuq-inside-Rizq · data + contract QA ===\nengine: {ENGINE}\n")
    bundles = {pid: generate.build_bundle(pid) for pid in P.PROFILES}

    print("Contract 1 — AccountBundle schema:")
    for b in bundles.values():
        validate_bundle(b)

    print("\nDeterminism (same seed → identical bundle):")
    for pid in P.PROFILES:
        a = json.dumps(generate.build_bundle(pid), ensure_ascii=False, sort_keys=True)
        b = json.dumps(generate.build_bundle(pid), ensure_ascii=False, sort_keys=True)
        check(f"{pid}: bundle reproducible", a == b)

    print("\nContract 2 — underwrite() output:")
    limits, results_by = {}, {}
    for pid, bundle in bundles.items():
        r = underwrite(bundle)
        results_by[pid] = r
        limits[pid] = r["limit_sar"]
        keys_ok = all(k in r for k in ("limit_sar", "structure", "tenor_months", "explanation_ar",
                                       "confidence", "signals", "decision_id", "generated_in_ms"))
        check(f"{pid}: result has all Contract-2 keys", keys_ok)
        srcs = {signal_source(s) for s in r["signals"]}
        check(f"{pid}: ≥1 OB signal AND ≥1 ZATCA signal present (the moat)",
              ("OB" in srcs and "ZATCA" in srcs),
              "names=" + ",".join(f"{s['name']}[{signal_source(s)}]" for s in r["signals"]))
        ssum = sum(s["contribution_sar"] for s in r["signals"])
        check(f"{pid}: Σ contributions == limit_sar", ssum == r["limit_sar"], f"{ssum:,} vs {r['limit_sar']:,}")
        struct_ok = (r["structure"] == "none") == (r["limit_sar"] == 0)
        check(f"{pid}: structure 'none' iff limit 0", struct_ok)
        ar_ok = bool(re.search(r"[؀-ۿ]", r["explanation_ar"]))
        check(f"{pid}: explanation_ar is Arabic", ar_ok)

    print("\nDeterminism of underwrite (excluding generated_in_ms):")
    for pid, bundle in bundles.items():
        def strip(r):
            r = dict(r); r.pop("generated_in_ms", None); return json.dumps(r, ensure_ascii=False, sort_keys=True)
        check(f"{pid}: underwrite reproducible", strip(underwrite(bundle)) == strip(underwrite(bundle)))

    print("\nThe limit moves with the data (NOT constant):")
    distinct = len(set(limits.values()))
    check("3 personas → 3 distinct limits", distinct == 3, " · ".join(f"{k}={v:,}" for k, v in limits.items()))
    # ZATCA moat: gig (thin invoices) must get a materially lower ZATCA contribution than merchant
    def zatca_contrib(pid):
        return next((s["contribution_sar"] for s in results_by[pid]["signals"]
                     if s["name"] == "invoice_verified_ratio"), 0)
    check("ZATCA moat: gig ZATCA-contribution << merchant", zatca_contrib("gig_driver") < zatca_contrib("small_merchant"),
          f"gig={zatca_contrib('gig_driver'):,} vs merchant={zatca_contrib('small_merchant'):,}")

    passed = sum(1 for ok, *_ in results if ok)
    total = len(results)
    print(f"\n=== {passed}/{total} checks passed ===")
    sys.exit(0 if passed == total else 1)


if __name__ == "__main__":
    main()
