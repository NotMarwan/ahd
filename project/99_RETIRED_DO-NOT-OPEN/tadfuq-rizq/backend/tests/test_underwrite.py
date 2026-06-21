"""
pytest — Agent 1. Proves the Contract-2 rules hold.
Run from backend/:  python -m pytest -q
"""
from __future__ import annotations
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import fixtures      # noqa: E402
import underwrite as uw  # noqa: E402

PERSONAS = ["freelancer_designer", "small_merchant", "gig_driver"]


def _result(pid):
    return uw.underwrite(fixtures.build_bundle(pid))


def test_eligible_personas_get_tawarruq_limit():
    for pid in PERSONAS:
        r = _result(pid)
        assert r["limit_sar"] > 0, f"{pid} should be fundable"
        assert r["structure"] == "Tawarruq"
        assert r["tenor_months"] in (3, 6, 12)
        assert 0.5 <= r["confidence"] <= 0.95


def test_moat_both_ob_and_zatca_contribute():
    # at least one OB signal AND the ZATCA signal must contribute to the limit
    for pid in ["freelancer_designer", "small_merchant"]:
        r = _result(pid)
        contrib = {s["name"]: s["contribution_sar"] for s in r["signals"]}
        assert contrib["invoice_verified_ratio"] > 0, f"{pid}: ZATCA signal must contribute"
        assert any(contrib[s] > 0 for s in uw.OB_SIGNALS), f"{pid}: an OB signal must contribute"


def test_limit_is_not_constant_across_personas():
    limits = {pid: _result(pid)["limit_sar"] for pid in PERSONAS}
    assert len(set(limits.values())) >= 2, f"limit must move with the data, got {limits}"


def test_contributions_sum_to_limit():
    for pid in PERSONAS:
        r = _result(pid)
        if r["limit_sar"] > 0:
            assert sum(s["contribution_sar"] for s in r["signals"]) == r["limit_sar"]


def test_deterministic_except_latency():
    for pid in PERSONAS:
        a = _result(pid)
        b = _result(pid)
        for k in ("limit_sar", "structure", "tenor_months", "explanation_ar",
                  "confidence", "signals", "decision_id"):
            assert a[k] == b[k], f"{pid}.{k} not deterministic"


def test_thin_file_is_ineligible():
    bundle = fixtures.build_bundle("gig_driver")
    bundle["profile"]["months_active"] = 3          # below the 6-month gate
    bundle["ob_transactions"] = bundle["ob_transactions"][:8]
    r = uw.underwrite(bundle)
    assert r["limit_sar"] == 0
    assert r["structure"] == "none"
    assert "لا يتوفّر" in r["explanation_ar"]


def test_signals_use_both_sources():
    names = set(uw.WEIGHTS)
    assert uw.ZATCA_SIGNALS <= names and uw.OB_SIGNALS <= names
    assert abs(sum(uw.WEIGHTS.values()) - 1.0) < 1e-9
