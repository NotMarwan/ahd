/* ============================================================================
   store.cjs — deterministic in-memory persistence for the thin server slice.

   A plain Map keyed by loan id, wrapped in explicit pure-ish operations (no
   shared module-level singleton) so every test/run gets its own isolated,
   deterministic store. No file IO, no external DB, no network. Swapping this
   for a real datastore (with concurrency, transactions, migrations) is an
   explicit residual gap — see docs/ARCHITECTURE.md's server addendum.
============================================================================ */
"use strict";

function createStore() {
  return { loans: new Map() };
}

function putLoan(store, id, record) {
  store.loans.set(id, record);
  return record;
}

function getLoan(store, id) {
  return store.loans.get(id) || null;
}

function listLoans(store) {
  return Array.from(store.loans.values());
}

module.exports = { createStore, putLoan, getLoan, listLoans };
