/* ============================================================================
   handlers.cjs — thin route handlers for the Ahd server slice.

   Every handler is a PURE function: (body, ctx) -> { status, body }, where
   ctx = { engine, store }. No socket, no DOM, no clock in any hashed/sealed
   value — this is what lets tests call handlers directly (no live port).

   All sealing/verification/netting is done by the GOLDEN engine functions
   (via server/engine.cjs, a straight re-export of app/engine.js) and by
   app/features/create.js + app/features/riba-lint.js, which themselves call
   ONLY golden primitives (sha256 / sealBlock / GENESIS / toMinor /
   minorToFixed2 / respread / ribaScan). Nothing here reimplements sealing,
   verification, netting, or riba detection.

   On-spine by construction: the bank here only witnesses/seals/verifies/nets.
   No lending (no money moves), no dispute judging, no interest/penalty terms
   are ever accepted (riba-linter guard in sealLoan), no credit score.
============================================================================ */
"use strict";
const path = require("path");
const CreateAhd = require(path.join(__dirname, "..", "app", "features", "create.js"));
const Store = require("./store.cjs");

/* sentinel id: the single frozen demo agreement AG (نورة→سارة, 5000 SAR / 5)
   baked into the golden engine at module load — verifying it IS reproducing
   the project's one pinned golden main seal 6c9410b9…, not a reimplementation. */
const MAIN_ID = "MAIN";

function bad(status, message) {
  return { status: status, body: { ok: false, error: message } };
}

/* ---- POST /create-loan — writes a DRAFT (unsealed) loan record ---- */
function createLoan(body, ctx) {
  var b = body || {};
  if (!b.id || typeof b.id !== "string") return bad(400, "id (string) is required");
  if (b.id === MAIN_ID) return bad(400, "id 'MAIN' is reserved for the frozen demo record");
  if (!b.lender || !b.borrower) return bad(400, "lender and borrower are required");
  var amountSAR = Number(b.amountSAR);
  if (!(amountSAR > 0)) return bad(400, "amountSAR must be a positive number");
  var open = !!b.open;
  if (!open && b.months != null) {
    var m = parseInt(b.months, 10);
    if (!Number.isInteger(m) || m < 1) return bad(400, "months must be a positive integer");
  }
  if (Store.getLoan(ctx.store, b.id)) return bad(409, "id already exists");

  var e = ctx.engine;
  var draft = CreateAhd.makeDraft({
    id: b.id, lender: b.lender, borrower: b.borrower, amountSAR: amountSAR,
    months: b.months, open: open, start: b.start, timestamp: b.timestamp, purpose: b.purpose
  });
  var terms_ar = CreateAhd.draftTermsAr(draft, e);
  var riba = CreateAhd.ribaCheck(terms_ar, e); // golden ribaScan floor, reused not reimplemented

  var record = {
    id: draft.id, draft: draft, status: "DRAFT",
    terms_ar: terms_ar, riba: riba, seal: null, canonical_hash: null,
    events: [e.ev("AHD_DRAFTED", { installments: open ? 1 : draft.months })]
  };
  Store.putLoan(ctx.store, draft.id, record);
  return {
    status: 201,
    body: { id: draft.id, status: record.status, terms_ar: terms_ar, riba: { verdict: riba.verdict } }
  };
}

/* ---- POST /seal — witnesses + seals a previously-drafted loan ---- */
function sealLoan(body, ctx) {
  var b = body || {};
  if (!b.id) return bad(400, "id is required");
  var rec = Store.getLoan(ctx.store, b.id);
  if (!rec) return bad(404, "unknown loan id");
  if (rec.status === "WITNESSED") {
    return {
      status: 200,
      body: { id: rec.id, status: rec.status, seal: rec.seal, canonical_hash: rec.canonical_hash, already: true }
    };
  }
  /* on-spine refusal: never witness/seal terms the riba linter flags */
  if (rec.riba && rec.riba.verdict !== "clean") {
    return bad(422, "on-spine refusal: terms flagged by riba linter — cannot witness/seal");
  }

  var e = ctx.engine;
  var sealResult = CreateAhd.createSeal(rec.draft, e); // GOLDEN sha256 + sealBlock + GENESIS
  var events = rec.events.concat([e.ev("LENDER_SIGNED"), e.ev("COUNTERPARTY_SIGNED"), e.ev("RECORD_SEALED"), e.ev("ACTIVATED")]);
  var updated = Object.assign({}, rec, {
    status: "WITNESSED", seal: sealResult.seal, canonical_hash: sealResult.canonical_hash, events: events
  });
  Store.putLoan(ctx.store, rec.id, updated);
  return {
    status: 200,
    body: {
      id: updated.id, status: updated.status, seal: updated.seal, canonical_hash: updated.canonical_hash,
      statusAr: e.statusLabel(events)
    }
  };
}

/* ---- POST /verify — recompute-and-compare (tamper-evidence) ----
   id omitted or "MAIN" -> verifies the single frozen demo AG record via the
   GOLDEN engine.verifyRecord, reproducing the pinned golden main seal
   6c9410b9…. Any other id -> verifies a server-created, server-sealed loan
   via app/features/create.js's verifyCreated (golden sha256/sealBlock). */
function verifyLoan(body, ctx) {
  var b = body || {};
  var e = ctx.engine;
  var id = b.id || MAIN_ID;
  var tamperSAR = (b.amountSAR === undefined || b.amountSAR === null) ? null : Number(b.amountSAR);

  if (id === MAIN_ID) {
    var r = e.verifyRecord(tamperSAR); // GOLDEN function, untouched
    return {
      status: 200,
      body: { id: MAIN_ID, main: true, ok: r.ok, sealed: r.sealed, recomputed: r.recomputed, canonical_hash: r.canonical_hash }
    };
  }

  var rec = Store.getLoan(ctx.store, id);
  if (!rec) return bad(404, "unknown loan id");
  if (rec.status !== "WITNESSED") return bad(409, "loan is not sealed yet");
  var v = CreateAhd.verifyCreated(rec.draft, e, tamperSAR); // reuses GOLDEN sha256/sealBlock
  return {
    status: 200,
    body: { id: id, main: false, ok: v.ok, sealed: v.sealed, recomputed: v.recomputed, canonical_hash: v.canonical_hash }
  };
}

/* ---- POST /net — Muqassa netting. body.edges optional; defaults to the
   golden 9-IOU demo tangle (engine.IOUS) so a bare POST already proves the
   9->2 reduction server-side. ---- */
function netLoans(body, ctx) {
  var b = body || {};
  var e = ctx.engine;
  var edges = Array.isArray(b.edges) ? b.edges : e.IOUS;
  var transfers = e.netting(edges); // GOLDEN netting core + tiebreak
  return { status: 200, body: { transfers: transfers, count: transfers.length } };
}

/* ---- GET /list — every loan the server has witnessed/drafted ---- */
function listLoans(body, ctx) {
  var items = Store.listLoans(ctx.store).map(function (rec) {
    return {
      id: rec.id, lender: rec.draft.lender, borrower: rec.draft.borrower,
      amountSAR: rec.draft.amountMinor / 100, status: rec.status, seal: rec.seal
    };
  });
  return { status: 200, body: { items: items, count: items.length } };
}

/* ---- GET /health — T5 deploy story: additive healthcheck for a container/
   orchestrator (Docker HEALTHCHECK, load-balancer probe, etc). Deterministic
   by construction: a STATIC body, never a wall-clock timestamp/uptime — this
   file must stay Date.now/new Date-free (server-parity.test.cjs's static
   scan enforces it project-wide). Public (never gated by auth, see
   server/router.cjs's ROUTES table: mutating: false). ---- */
function health(body, ctx) {
  return { status: 200, body: { ok: true } };
}

module.exports = {
  createLoan: createLoan, sealLoan: sealLoan, verifyLoan: verifyLoan, netLoans: netLoans,
  listLoans: listLoans, health: health, MAIN_ID: MAIN_ID
};
