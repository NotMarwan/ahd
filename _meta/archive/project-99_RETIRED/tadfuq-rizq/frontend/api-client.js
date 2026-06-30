/* =============================================================================
 * api-client.js — Agent 3 — Contract 3
 * One client, two modes:
 *   OFFLINE = true  → resolves from window.RIZQ_FALLBACK (file://-safe, NO network) = DEMO MODE
 *   OFFLINE = false → hits Agent 1's FastAPI on API_BASE (dev/integration)
 * Same result shapes in both modes.
 * ============================================================================= */
(function () {
  "use strict";

  const API_BASE = "http://localhost:8000";

  // Flip to false during integration to hit the real backend. TRUE = demo default.
  const OFFLINE = true;

  // Small artificial latency so the OFFLINE path feels like a real call (deterministic, not random).
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  function fb() {
    if (!window.RIZQ_FALLBACK) throw new Error("fallback-embedded.js not loaded before api-client.js");
    return window.RIZQ_FALLBACK;
  }

  async function getPersonas() {
    if (OFFLINE) { await wait(120); return fb().personas; }
    const r = await fetch(`${API_BASE}/personas`); return r.json();
  }

  async function connect(persona_id) {
    if (OFFLINE) {
      await wait(150);
      const b = fb().bundles[persona_id];
      if (!b) throw new Error(`unknown persona ${persona_id}`);
      return b;
    }
    const r = await fetch(`${API_BASE}/bundle/${persona_id}`); return r.json();
  }

  async function underwrite(bundle) {
    if (OFFLINE) {
      await wait(200);
      const res = fb().results[bundle.persona_id];
      if (!res) throw new Error(`no result for ${bundle.persona_id}`);
      return res;
    }
    const r = await fetch(`${API_BASE}/underwrite`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bundle),
    });
    return r.json();
  }

  // ---- Contract 3 frontend addendum: signal name → data-source badge (non-breaking) ----
  // Proves the moat on screen: the limit is driven by BOTH OB and ZATCA.
  const SIGNAL_SOURCE = {
    cashflow_stability: "OB",
    income_regularity: "OB",
    expense_volatility: "OB",
    buffer_months: "OB",
    invoice_verified_ratio: "ZATCA",
    revenue_trend: "MIX",
  };
  const sourceOf = (name) => SIGNAL_SOURCE[name] || "MIX";

  window.RizqApi = { OFFLINE, API_BASE, getPersonas, connect, underwrite, sourceOf, SIGNAL_SOURCE };
})();
