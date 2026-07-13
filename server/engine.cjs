/* ============================================================================
   engine.cjs — THIN ADDITIVE ADAPTER. Re-exports the SAME byte-faithful engine
   copy the app already uses (app/engine.js), so the server calls the IDENTICAL
   golden functions — sha256, canonical, sealBlock, recomputeSeal, verifyRecord,
   netting core+tiebreak, fmt, respread, ev, ... — never a reimplementation.

   app/engine.js is itself a verbatim, byte-faithful copy of demo/index.html's
   AHD-LOGIC region (see app/build-engine.cjs + tests/app/engine-parity.cjs).
   This file adds NOTHING to the logic — it only gives the server directory one
   clear, documented require path into that same engine. If app/engine.js is
   ever regenerated (node app/build-engine.cjs), the server picks up the new
   bytes automatically — there is no second copy to drift.
============================================================================ */
"use strict";
const path = require("path");

module.exports = require(path.join(__dirname, "..", "app", "engine.js"));
