/* ============================================================================
   features/rifq.js — «رِفْق» (mercy-first clearing). The plan's I-L1 lever
   (docs/superpowers/plans/2026-07-13-ceiling-break-8-9-plan.md §1.2): a debtor
   who self-declares hardship (مُعسِر), CO-WITNESSED by the affected creditor(s)
   (consent), is EXCLUDED from forced set-off — their obligation(s) are held
   aside at the ORIGINAL amount (Qur'an 2:280 «فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ» — respite,
   no reduction unless the creditor separately chooses إبراء) and the grace is
   sealed into the golden chain as a first-class event. Netting still runs on
   everyone else — liquidity optimized SUBJECT TO the debtor-protection
   constraint, not despite it.

   SPINE — this module is a WRAPPER, never a reimplementation:
     • the GOLDEN engine.netting is called VERBATIM (via features/impact.js's
       makeSettleFn DI shim — traced, not duplicated) on the REMAINING edges only;
       its internals/tiebreak are never touched.
     • the grace event is sealed with the GOLDEN sha256/sealBlock/GENESIS
       (features/covenant-log.js's per-entry chain pattern, traced) — never a
       new hash/seal primitive.
     • NO SCORING: a declaration is honored iff `creditorConsent === true`
       (strict) and a `debtorId` string are present. NOTHING else is read —
       not amount, not history, not a trust band. Hardship is DECLARED +
       WITNESSED, never inferred (a single inferred path would be a spine breach).
     • CONSENT: `creditorId` omitted ⇒ a blanket declaration (ALL of that
       debtor's creditors co-witnessed); `creditorId` present ⇒ granular —
       ONLY that one creditor's claim on that debtor defers. An edge whose
       creditor never consented is NOT deferred, however hard the debtor's
       hardship is declared elsewhere — this is the *consented* muqāṣṣa
       variant (see docs/DECISIONS-FOR-MARWAN.md D-8).
     • Bank still only WITNESSES declaration+consent+grace — it does not
       decide/judge whether the hardship is real.

   Deterministic; integer halalas throughout (via engine.toMinor). No Date/
   Math.random/Intl/float in logic — `witnessedAt` is a caller-supplied fixed
   string (e.g. AS_OF), never a clock read here.

   Dual module: Node `require`, browser `window.Rifq` (uses window.AHD/Impact).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"), require("./impact.js"));
  else root.Rifq = factory(root.AHD, root.Impact);
})(typeof self !== "undefined" ? self : this, function (ENGINE, IMPACT) {
  "use strict";

  /* a declaration is honored ONLY on strict boolean consent + a real debtorId.
     No other field of `d` is ever read by this function — by construction,
     nothing derived from amount/history/behavior can ever flip this gate. */
  function isConsented(d) {
    return !!d && d.creditorConsent === true && typeof d.debtorId === "string" && d.debtorId.length > 0;
  }

  /* does ONE declaration cover ONE edge? blanket (no creditorId) covers every
     creditor of that debtor; granular (creditorId set) covers only that leg. */
  function declarationCovers(d, edge) {
    if (!isConsented(d)) return false;
    if (d.debtorId !== edge.from) return false;
    if (d.creditorId == null) return true;
    return d.creditorId === edge.to;
  }

  /* first covering declaration, first-seen order (deterministic array scan) —
     carries the witnessedAt of the covering declaration into the grace seal. */
  function decisionFor(edge, declarations) {
    var list = declarations || [];
    for (var i = 0; i < list.length; i++) if (declarationCovers(list[i], edge)) return list[i];
    return null;
  }

  /* PRE-FILTER: partition the tangle. deferred = edges whose DEBTOR is a
     consented-hardship debtor (their creditor co-witnessed); forNetting =
     everything else, fed to the golden netting untouched. */
  function partitionObligations(edges, declarations) {
    var deferred = [], forNetting = [], deferredBy = [];
    (edges || []).forEach(function (edge) {
      var d = decisionFor(edge, declarations);
      if (d) { deferred.push(edge); deferredBy.push(d); } else forNetting.push(edge);
    });
    return { deferred: deferred, forNetting: forNetting, deferredBy: deferredBy };
  }

  /* ---- the grace event: sealed as a first-class event via the GOLDEN chain
     (identical construction to covenant-log.sealCovenantLog: seal_i =
     sealBlock(prev, sha256(canonical_i), i), prev starts at GENESIS). ---- */
  function graceEntryCanonical(edge, decl, engine) {
    var e = engine || ENGINE;
    return [
      "RIFQ-GRACE-v1",
      "debtor=" + edge.from,
      "creditor=" + edge.to,
      "amount=" + e.minorToFixed2(e.toMinor(edge.amount)) + " SAR",
      "basis=Quran:2:280",
      "consent=creditor_witnessed:true",
      "witnessedAt=" + ((decl && decl.witnessedAt) || ""),
      "riba=interest:false;late_penalty_to_lender:false;gharar:none"
    ].join("\n");
  }

  function sealGraceEvents(deferredEdges, deferredBy, engine) {
    var e = engine || ENGINE, prev = e.GENESIS, entries = [];
    (deferredEdges || []).forEach(function (edge, i) {
      var decl = (deferredBy || [])[i] || null;
      var canonical = graceEntryCanonical(edge, decl, e);
      var ch = e.sha256(canonical);
      var seal = e.sealBlock(prev, ch, i);
      entries.push({
        seq: i, debtorId: edge.from, creditorId: edge.to,
        amountMinor: e.toMinor(edge.amount), witnessedAt: (decl && decl.witnessedAt) || "",
        canonical: canonical, canonical_hash: ch, seal: seal
      });
      prev = seal;
    });
    return { entries: entries, head: entries.length ? entries[entries.length - 1].seal : e.GENESIS };
  }

  /* recompute-and-compare; tamperIndex bumps that deferred edge's amount by
     one halala before recompute — proves the grace chain is tamper-evident
     exactly like every other golden-sealed trail in this app. */
  function verifyGraceEvents(sealed, deferredEdges, deferredBy, engine, tamperIndex) {
    var e = engine || ENGINE, entries = (sealed && sealed.entries) || [];
    var prev = e.GENESIS, firstBrokenAt = -1;
    for (var i = 0; i < entries.length; i++) {
      var edge = deferredEdges[i], decl = (deferredBy || [])[i] || null;
      var useEdge = (tamperIndex != null && i === tamperIndex)
        ? Object.assign({}, edge, { amount: (edge.amount || 0) + 1 }) : edge;
      var canonical = graceEntryCanonical(useEdge, decl, e);
      var ch = e.sha256(canonical);
      var seal = e.sealBlock(prev, ch, i);
      if (seal !== entries[i].seal && firstBrokenAt === -1) firstBrokenAt = i;
      prev = seal;
    }
    return { ok: firstBrokenAt === -1, firstBrokenAt: firstBrokenAt, head: prev };
  }

  /* ---- the mechanism itself: pre-filter → GOLDEN netting on the remainder →
     seal the deferred grace. `settleFn` is DI (defaults to Impact.makeSettleFn,
     the established roster-safe shim that calls engine.netting VERBATIM —
     traced from app/features/impact.js, never duplicated). ---- */
  function applyRifq(edges, declarations, engine, settleFn) {
    var e = engine || ENGINE;
    var split = partitionObligations(edges, declarations);
    var settle = settleFn || (IMPACT && IMPACT.makeSettleFn(e)) || e.netting;
    var netted = settle(split.forNetting);
    var grace = sealGraceEvents(split.deferred, split.deferredBy, e);
    var hardshipDebtors = [];
    split.deferredBy.forEach(function (d) {
      if (hardshipDebtors.indexOf(d.debtorId) < 0) hardshipDebtors.push(d.debtorId);
    });
    return {
      deferred: split.deferred, forNetting: split.forNetting, netted: netted,
      grace: grace, hardshipDebtors: hardshipDebtors
    };
  }

  /* ---- verification-only helpers (NOT the netting; a local balance sum, the
     same pattern impact.js's netsOf uses to check golden conservation without
     reimplementing the algorithm). ---- */
  function namesOf(edges) {
    var names = [];
    (edges || []).forEach(function (ed) {
      if (names.indexOf(ed.from) < 0) names.push(ed.from);
      if (names.indexOf(ed.to) < 0) names.push(ed.to);
    });
    return names;
  }
  function netPositionsMinor(names, edges, engine) {
    var e = engine || ENGINE, bal = {};
    names.forEach(function (n) { bal[n] = 0; });
    (edges || []).forEach(function (ed) {
      var m = e.toMinor(ed.amount);
      bal[ed.from] -= m; bal[ed.to] += m;
    });
    return bal;
  }

  /* CONSERVATION, integer halalas, in every state:
       (1) partition identity — deferredMinor + forNettingMinor === originalMinor
           (the pre-filter loses/invents nothing; a plain partition of the tangle).
       (2) per-member net position, computed over the WHOLE original tangle,
           equals the net position computed over (deferred ∪ golden-netted) —
           i.e. combining the untouched deferred edges with the golden netting's
           OWN already-proven per-member conservation reproduces every member's
           original net exactly. Deferral changes WHO must move money now, never
           what anyone is owed or owes. */
  function rifqConservation(edges, declarations, engine, settleFn) {
    var e = engine || ENGINE;
    var result = applyRifq(edges, declarations, e, settleFn);
    var names = namesOf(edges);
    var before = netPositionsMinor(names, edges, e);
    var after = netPositionsMinor(names, result.deferred.concat(result.netted), e);
    var perMember = names.map(function (n) {
      return { name: n, netBeforeMinor: before[n], netAfterMinor: after[n], preserved: before[n] === after[n] };
    });
    var grossMinor = function (arr) { return (arr || []).reduce(function (a, ed) { return a + e.toMinor(ed.amount); }, 0); };
    var originalMinor = grossMinor(edges);
    var deferredMinor = grossMinor(result.deferred);
    var forNettingMinor = grossMinor(result.forNetting);
    return {
      perMember: perMember,
      netsPreserved: perMember.every(function (m) { return m.preserved; }),
      originalMinor: originalMinor, deferredMinor: deferredMinor, forNettingMinor: forNettingMinor,
      partitionOk: (deferredMinor + forNettingMinor) === originalMinor
    };
  }

  return {
    isConsented: isConsented,
    declarationCovers: declarationCovers,
    partitionObligations: partitionObligations,
    graceEntryCanonical: graceEntryCanonical,
    sealGraceEvents: sealGraceEvents,
    verifyGraceEvents: verifyGraceEvents,
    applyRifq: applyRifq,
    rifqConservation: rifqConservation
  };
});
