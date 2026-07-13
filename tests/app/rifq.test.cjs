/* ============================================================================
   rifq.test.cjs — TDD for features/rifq.js «رِفْق» (mercy-first clearing, I-L1).
   Proves: (1) the pre-filter mechanism (consented-hardship debtor excluded from
   forced set-off), (2) exact integer-halala conservation, (3) the golden
   netting/tiebreak/seal primitives are called VERBATIM and left byte-unchanged,
   (4) NOTHING but an explicit creditorConsent===true declaration can ever defer
   an obligation (no-scoring), (5) determinism across independent reloads,
   (6) the grace event is sealed (and tamper-evident) via the golden chain,
   (7) offline purity of the new file.
============================================================================ */
const fs = require("fs");
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const E = require(P("engine.js"));
const IMPACT = require(P("features", "impact.js"));
const R = require(P("features", "rifq.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

console.log("rifq.test: «رِفْق» mercy-first clearing — pre-filter, conservation, golden reuse, no-scoring, sealed grace");

/* the golden 9-IOU demo tangle (real engine.NODES names — نورة is debtor in 4 of the 9 edges) */
const IOUS = E.IOUS;
const AS_OF = "2026-06-21T00:00:00+03:00"; // a FIXED witnessedAt string, never a clock read

/* ---------------------------------------------------------------------------
   1) MECHANISM — the pre-filter
--------------------------------------------------------------------------- */
{
  ok(typeof R.applyRifq === "function", "applyRifq exists");
  ok(typeof R.partitionObligations === "function", "partitionObligations exists");

  /* blanket declaration (no creditorId): ALL of نورة's creditors co-witnessed */
  const blanket = [{ debtorId: "نورة", creditorConsent: true, witnessedAt: AS_OF }];
  const split = R.partitionObligations(IOUS, blanket);
  ok(split.deferred.every(e => e.from === "نورة"), "every deferred edge's debtor is the declared hardship party");
  ok(split.deferred.length === IOUS.filter(e => e.from === "نورة").length,
    "ALL of نورة's outgoing obligations are deferred under a blanket declaration");
  ok(split.forNetting.every(e => e.from !== "نورة"), "no نورة-debtor edge leaks into forNetting");
  eq(split.deferred.length + split.forNetting.length, IOUS.length, "partition is total: deferred + forNetting == all edges");

  /* granular declaration (creditorId set): ONLY that one leg defers */
  const granular = [{ debtorId: "خالد", creditorId: "سارة", creditorConsent: true, witnessedAt: AS_OF }];
  const splitG = R.partitionObligations(IOUS, granular);
  const khalidEdges = IOUS.filter(e => e.from === "خالد");
  ok(khalidEdges.length > 0, "sanity: خالد owes at least one edge in the golden tangle");
  const deferredKhalid = splitG.deferred.filter(e => e.from === "خالد");
  eq(deferredKhalid.length, 1, "granular declaration defers exactly the ONE named creditor leg");
  eq(deferredKhalid[0].to, "سارة", "the deferred leg is خالد→سارة (the consented creditor)");

  /* a different creditor of the SAME debtor, NOT named in the granular declaration, is untouched */
  const otherKhalidCreditors = khalidEdges.filter(e => e.to !== "سارة");
  otherKhalidCreditors.forEach(e => {
    ok(splitG.forNetting.indexOf(e) >= 0, "خالد's non-consented creditor leg (→" + e.to + ") stays in forNetting");
  });
}

/* ---------------------------------------------------------------------------
   2) NO-SCORING — hardship is DECLARED + WITNESSED, never inferred
--------------------------------------------------------------------------- */
{
  const edge = { from: "نورة", to: "سارة", amount: 200 };
  const cases = [
    { debtorId: "نورة" },                                         // no consent key at all
    { debtorId: "نورة", creditorConsent: false },                  // explicit false
    { debtorId: "نورة", creditorConsent: "yes" },                  // truthy but not === true
    { debtorId: "نورة", creditorConsent: 1 }                       // truthy but not === true
  ];
  cases.forEach((d, i) => {
    ok(!R.declarationCovers(d, edge), "no-scoring case " + i + ": weak/absent consent never defers (" + JSON.stringify(d) + ")");
  });

  /* a declaration carrying extra fields that LOOK like scoring inputs (amount/history/
     pastDue/behaviorScore) must have ZERO effect — only debtorId/creditorId/creditorConsent matter */
  const scoreLike = { debtorId: "نورة", creditorConsent: true, witnessedAt: AS_OF, amount: 999999, history: "bad", pastDue: 40, behaviorScore: 12 };
  ok(R.declarationCovers(scoreLike, edge), "a CONSENTED declaration still defers regardless of extra amount/history/pastDue/score fields present");
  const missingConsentButRichData = { debtorId: "نورة", witnessedAt: AS_OF, amount: 1, history: "perfect", pastDue: 0, behaviorScore: 100 };
  ok(!R.declarationCovers(missingConsentButRichData, edge),
    "NO consent flag ⇒ never defers, even with amount/history/pastDue/behaviorScore data present (no inferred path)");

  /* static source scan: rifq.js must never reference the trust/history engine at all —
     there must be NO code path from own-history/trust signal into the hardship gate */
  const src = fs.readFileSync(P("features", "rifq.js"), "utf8");
  ["TRUST", "trustSignal", ".ratio", "_HIST", "_OPEN_OVERDUE"].forEach(tok => {
    ok(src.indexOf(tok) < 0, "rifq.js source contains NO reference to «" + tok + "» (no hidden inference path)");
  });
}

/* ---------------------------------------------------------------------------
   3) GOLDEN REUSE + UNTOUCHED — netting/tiebreak/seal called verbatim, never modified
--------------------------------------------------------------------------- */
{
  const declBlanket = [{ debtorId: "نورة", creditorConsent: true, witnessedAt: AS_OF }];
  const nodesBefore = E.NODES.slice();
  const nettingBeforeRef = E.netting;
  const pinnedNettingOfIOUS = JSON.stringify(E.netting(IOUS)); // the golden 9→2 result, independent of رِفْق

  const result = R.applyRifq(IOUS, declBlanket, E);

  ok(E.netting === nettingBeforeRef, "engine.netting function reference is UNCHANGED after applyRifq (never monkeypatched)");
  ok(JSON.stringify(E.NODES) === JSON.stringify(nodesBefore), "engine.NODES roster is byte-identical after applyRifq (no leaked mutation)");
  eq(JSON.stringify(E.netting(IOUS)), pinnedNettingOfIOUS, "engine.netting(IOUS) still returns the SAME golden result after رِفْق ran (function itself untouched)");
  eq(E.SEALED.seal, "6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18", "PIN: golden main seal unchanged (6c9410b9…)");

  /* the netted output is exactly what engine.netting produces on the forNetting subset — verbatim, not re-derived */
  const settleShim = IMPACT.makeSettleFn(E);
  eq(JSON.stringify(result.netted), JSON.stringify(settleShim(result.forNetting)),
    "result.netted === engine.netting(forNetting) via the SAME DI shim impact.js uses (traced, not duplicated)");

  /* نورة nets to zero visible transfers HERSELF post-رِفْق (she is entirely deferred, not settled) */
  ok(result.netted.every(t => t.from !== "نورة" && t.to !== "نورة"),
    "نورة appears in NEITHER side of any post-رِفْق netted transfer — she is genuinely excluded from forced set-off");
  ok(result.deferred.length > 0, "at least one obligation was actually deferred (the mechanism did something observable)");
}

/* ---------------------------------------------------------------------------
   4) CONSERVATION — deferred + netted reproduce the ORIGINAL picture exactly,
      integer halalas, in every state (partition identity + per-member net)
--------------------------------------------------------------------------- */
{
  ok(typeof R.rifqConservation === "function", "rifqConservation exists");
  const decl = [{ debtorId: "نورة", creditorConsent: true, witnessedAt: AS_OF }];
  const cp = R.rifqConservation(IOUS, decl, E);
  eq(cp.partitionOk, true, "partition identity: deferredMinor + forNettingMinor === originalMinor (integer halalas)");
  eq(cp.netsPreserved, true, "EVERY member's net position (halalas) is identical before رِفْق and after (deferred ∪ netted)");
  ok(cp.perMember.every(m => Number.isInteger(m.netBeforeMinor) && Number.isInteger(m.netAfterMinor)),
    "every net position is an INTEGER halala (no float money anywhere)");
  ok(cp.perMember.length === 5, "conservation proof covers all 5 golden members");
  eq(cp.originalMinor, IOUS.reduce((a, e) => a + E.toMinor(e.amount), 0), "originalMinor matches a direct sum of the tangle");

  /* no hardship at all ⇒ رِفْق is a no-op pass-through: netted == golden netting(IOUS), deferred == [] */
  const none = R.rifqConservation(IOUS, [], E);
  eq(none.deferredMinor, 0, "zero declarations ⇒ zero deferred halalas");
  eq(none.partitionOk, true, "zero declarations ⇒ partition still holds trivially");
  eq(JSON.stringify(R.applyRifq(IOUS, [], E).netted), JSON.stringify(E.netting(IOUS)),
    "zero declarations ⇒ applyRifq(...).netted is BYTE-IDENTICAL to plain engine.netting(IOUS) (pure pass-through)");

  /* a small hand-built tangle: a 3-cycle where one member declares hardship */
  const tri = [{ from: "أ", to: "ب", amount: 100 }, { from: "ب", to: "ج", amount: 100 }, { from: "ج", to: "أ", amount: 100 }];
  const triDecl = [{ debtorId: "ب", creditorConsent: true, witnessedAt: AS_OF }];
  const triCp = R.rifqConservation(tri, triDecl, E);
  eq(triCp.partitionOk, true, "3-cycle + hardship: partition identity holds");
  eq(triCp.netsPreserved, true, "3-cycle + hardship: every net preserved");
  eq(triCp.deferredMinor, E.toMinor(100), "3-cycle: exactly ب's one 100-SAR obligation is deferred");

  /* empty tangle: vacuous conservation, no throw */
  const emptyCp = R.rifqConservation([], [], E);
  eq(emptyCp.partitionOk, true, "empty tangle: conserved vacuously");
  eq(emptyCp.netsPreserved, true, "empty tangle: no members, vacuously preserved");
}

/* ---------------------------------------------------------------------------
   5) DETERMINISM — identical inputs ⇒ byte-identical outputs, across reload
--------------------------------------------------------------------------- */
{
  const decl = [{ debtorId: "نورة", creditorConsent: true, witnessedAt: AS_OF }];
  const r1 = R.applyRifq(IOUS, decl, E);
  const r2 = R.applyRifq(IOUS, decl, E);
  eq(JSON.stringify(r1), JSON.stringify(r2), "applyRifq is deterministic across two calls with the same input");

  const enginePath = P("engine.js"), rifqPath = P("features", "rifq.js"), impactPath = P("features", "impact.js");
  delete require.cache[require.resolve(enginePath)];
  delete require.cache[require.resolve(impactPath)];
  delete require.cache[require.resolve(rifqPath)];
  const E2 = require(enginePath);
  const R2 = require(rifqPath);
  ok(E2 !== E, "cache busted: independent engine module instance");
  ok(R2 !== R, "cache busted: independent rifq module instance");
  const r3 = R2.applyRifq(E2.IOUS, decl, E2);
  eq(JSON.stringify(r3), JSON.stringify(r1), "applyRifq is byte-identical across an INDEPENDENT module reload");
}

/* ---------------------------------------------------------------------------
   6) GRACE SEALED AS A FIRST-CLASS EVENT — golden chain, tamper-evident
--------------------------------------------------------------------------- */
{
  const decl = [{ debtorId: "نورة", creditorConsent: true, witnessedAt: AS_OF }];
  const split = R.partitionObligations(IOUS, decl);
  const sealed = R.sealGraceEvents(split.deferred, split.deferredBy, E);
  ok(Array.isArray(sealed.entries) && sealed.entries.length === split.deferred.length, "one sealed grace entry per deferred obligation");
  ok(typeof sealed.head === "string" && sealed.head.length > 0, "sealGraceEvents returns a head seal");
  eq(sealed.entries[0].seal, E.sealBlock(E.GENESIS, sealed.entries[0].canonical_hash, 0),
    "grace entry 0 seal == sealBlock(GENESIS, hash0, 0) — the GOLDEN primitive, from GENESIS");
  if (sealed.entries.length > 1) {
    eq(sealed.entries[1].seal, E.sealBlock(sealed.entries[0].seal, sealed.entries[1].canonical_hash, 1),
      "grace entry 1 chains off entry 0's seal (prev = previous seal)");
  }
  sealed.entries.forEach(en => { eq(en.witnessedAt, AS_OF, "grace entry carries the declaration's fixed witnessedAt (never a clock read)"); });

  const vOk = R.verifyGraceEvents(sealed, split.deferred, split.deferredBy, E);
  eq(vOk.ok, true, "verifyGraceEvents(intact).ok === true");
  eq(vOk.firstBrokenAt, -1, "intact grace chain: firstBrokenAt === -1");
  const vBad = R.verifyGraceEvents(sealed, split.deferred, split.deferredBy, E, 0);
  eq(vBad.ok, false, "tampering the deferred amount by 1 halala breaks the grace seal");
  ok(vBad.firstBrokenAt >= 0, "tamper detected at/after index 0");

  /* determinism of the grace chain itself */
  const sealed2 = R.sealGraceEvents(split.deferred, split.deferredBy, E);
  eq(sealed2.head, sealed.head, "sealGraceEvents head is deterministic across two runs");

  /* the canonical line cites the fiqh basis, never a percentage/score */
  ok(sealed.entries.every(en => en.canonical.indexOf("basis=Quran:2:280") >= 0), "every grace entry cites Qur'an 2:280 (the respite verse)");
  ok(!/\d{1,3}\s*[%٪]/.test(JSON.stringify(sealed)), "no percentage/score anywhere in the sealed grace events");
}

/* ---------------------------------------------------------------------------
   7) OFFLINE PURITY — no networking/nondeterminism primitive in the new file
--------------------------------------------------------------------------- */
{
  const src = fs.readFileSync(P("features", "rifq.js"), "utf8");
  const stripped = src.replace(/\/\*[\s\S]*?\*\//g, ""); // block comments only (rifq.js has no // comments)
  const FORBIDDEN = ["fetch(", "XMLHttpRequest", "WebSocket", "Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString"];
  FORBIDDEN.forEach(tok => { ok(stripped.indexOf(tok) < 0, "rifq.js: no forbidden token «" + tok + "» in LIVE code (comments stripped)"); });
  ok(src.charCodeAt(0) !== 0xFEFF, "rifq.js: no UTF-8 BOM");
}

console.log("\n========================================================");
console.log("RIFQ: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
