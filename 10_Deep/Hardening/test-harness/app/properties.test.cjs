/* ============================================================================
   properties.test.cjs — PROPERTY-STYLE invariants over MANY deterministic
   inputs (seeded LCG, never Math.random / Date). Three families:
     1) respread()     : even split, sum preserved, no phantom halala.
     2) circle         : foldCircle / circleBalances / circleToIous conservation
                         + OPEN→KEPT transition driven by composed share events.
     3) open-loan      : foldOpenLoan conservation, remaining>=0, never DEFAULTED.
   Reuses the parity-proven engine + features/open-loan.js — nothing modified.
============================================================================ */
const path = require("path");
const engine = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "engine.js"));
const L = require(path.join(__dirname, "..", "..", "..", "..", "project", "ahd-app", "features", "open-loan.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ")");

/* seeded LCG — the ONLY source of pseudo-randomness; fully deterministic. */
let _s = 12345;
const rnd = () => (_s = (_s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const ri = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1)); // inclusive integer in [lo,hi]
const ev = engine.ev;

console.log("properties.test: property-style invariants (seeded LCG)");

/* =========================================================================
   1) respread(totalMinor, count) — even integer split, sum preserved.
      For ~200 random (total in halalas, count 1..12) pairs:
        Σ == total, every element non-negative integer, length == count,
        max-min <= 1 (no phantom halala, the no-riba rounding guarantee).
========================================================================= */
{
  const N = 200;
  let allSum = true, allInt = true, allNonNeg = true, allLen = true, allSpread = true;
  let worstSpread = 0;
  for (let k = 0; k < N; k++) {
    const total = ri(0, 5000000);   // up to 50,000.00 SAR in halalas
    const count = ri(1, 12);
    const parts = engine.respread(total, count);
    const sum = parts.reduce((a, b) => a + b, 0);
    if (sum !== total) allSum = false;
    if (parts.length !== count) allLen = false;
    let mn = Infinity, mx = -Infinity;
    for (const p of parts) {
      if (!Number.isInteger(p)) allInt = false;
      if (p < 0) allNonNeg = false;
      if (p < mn) mn = p;
      if (p > mx) mx = p;
    }
    const spread = mx - mn;
    if (spread > worstSpread) worstSpread = spread;
    if (spread > 1) allSpread = false;
  }
  ok(allSum, "respread: Σ parts == total over " + N + " random pairs (exact, no halala lost/invented)");
  ok(allLen, "respread: length == count over all " + N + " pairs");
  ok(allInt, "respread: every element is an integer halala over all " + N + " pairs");
  ok(allNonNeg, "respread: every element is non-negative over all " + N + " pairs");
  ok(allSpread, "respread: max-min <= 1 (even split, no phantom halala) over all " + N + " pairs");
  eq(worstSpread, 1, "respread: worst observed spread is exactly 1 (some splits are uneven by one halala)");
  /* spot-pinned vectors that must hold regardless of the LCG */
  eq(engine.respread(100, 3).join(","), "34,33,33", "respread(100,3) == [34,33,33]");
  eq(engine.respread(0, 5).join(","), "0,0,0,0,0", "respread(0,5) is all zeros");
  eq(engine.respread(7, 1).join(","), "7", "respread(7,1) == [7] (single-member circle)");
}

/* =========================================================================
   2) Circle conservation — foldCircle / circleBalances / circleToIous.
      Build many deterministic circles (vary participants & amounts) and assert:
        - Σ circleBalances == 0  (nothing created or destroyed)
        - organizer credit == Σ member debits (non-self)
        - circleToIous excludes settled (KEPT) / forgiven (FORGIVEN) shares
========================================================================= */
const PEOPLE = ["أ", "ب", "ج", "د", "هـ", "و", "ز", "ح"]; // أ ب ج د هـ و ز ح
const STATES = ["draft", "active", "kept", "graced", "forgiven", "disputed"];

function buildCircle(seedTag) {
  const memberCount = ri(2, 6);                 // 2..6 non-organizer members
  const participants = ["منظّم"]; // منظّم (organizer) first
  for (let i = 0; i < memberCount; i++) participants.push(PEOPLE[i]);
  const totalMinor = engine.toMinor(ri(1, 9999));
  const states = {};
  for (let i = 0; i < memberCount; i++) states[PEOPLE[i]] = STATES[ri(0, STATES.length - 1)];
  return engine.makeCircle({
    id: "CIR-PROP-" + seedTag, mode: (rnd() < 0.5 ? "occasion" : "standing"),
    name: "دائرة " + seedTag, type: "مناسبة",
    organizer: "منظّم", participants: participants,
    totalMinor: totalMinor, split: "equal", states: states
  });
}

{
  const N = 120;
  let allZero = true, allCredit = true, allExcl = true, allDebtSum = true;
  for (let k = 0; k < N; k++) {
    const c = buildCircle(k);
    const bal = engine.circleBalances(c);
    const sum = Object.values(bal).reduce((a, b) => a + b, 0);
    if (sum !== 0) allZero = false;

    /* organizer credit == Σ member (non-self) debits */
    const debit = c.members.filter(m => !m.self).reduce((a, m) => a + m.amountMinor, 0);
    if (bal[c.organizer] !== debit) allCredit = false;
    /* each member's own balance is exactly -amountMinor (a pure bilateral debt) */
    let perMemberOk = true;
    c.members.filter(m => !m.self).forEach(m => { if (bal[m.name] !== -m.amountMinor) perMemberOk = false; });
    if (!perMemberOk) allDebtSum = false;

    /* circleToIous: NO edge for a KEPT or FORGIVEN (or VOID/DISPUTED) share */
    const ious = engine.circleToIous(c);
    const liveNames = new Set(ious.map(e => e.from));
    let exclOk = true;
    c.members.filter(m => !m.self).forEach(m => {
      const st = engine.fold(m.events).status;
      const dead = (st === "KEPT" || st === "FORGIVEN" || st === "VOID" || st === "DISPUTED");
      if (dead && liveNames.has(m.name)) exclOk = false;     // a dead share must NOT appear
      if (!dead && !liveNames.has(m.name)) exclOk = false;   // a live share MUST appear
    });
    /* every IOU points at the organizer (member owes organizer) */
    ious.forEach(e => { if (e.to !== c.organizer) exclOk = false; });
    if (!exclOk) allExcl = false;
  }
  ok(allZero, "circleBalances: Σ net == 0 over " + N + " random circles (conservation)");
  ok(allCredit, "circleBalances: organizer credit == Σ member debits over all " + N + " circles");
  ok(allDebtSum, "circleBalances: each member's net == -amountMinor (pure bilateral debt) over all " + N + " circles");
  ok(allExcl, "circleToIous: excludes settled/forgiven/void/disputed, keeps every live debt, all point to organizer");
}

/* drive a circle OPEN -> PARTIAL -> KEPT by COMPOSING share events */
{
  const c0 = engine.makeCircle({
    id: "CIR-PROP-DRIVE", mode: "occasion", name: "رحلة", type: "رحلة",
    organizer: "منظّم", participants: ["منظّم", "أ", "ب", "ج"],
    totalMinor: engine.toMinor(900), split: "equal",
    states: { "أ": "active", "ب": "active", "ج": "active" }   // all sealed, none paid
  });
  const withEvent = (circle, name, e) => Object.assign({}, circle, {
    members: circle.members.map(m => m.name === name ? Object.assign({}, m, { events: m.events.concat(e) }) : m)
  });
  const settled = ev("SETTLEMENT_SETTLED");
  eq(engine.foldCircle(c0).status, "CIRCLE_OPEN", "drive: all-active circle starts CIRCLE_OPEN");
  eq(engine.foldCircle(c0).debtCount, 3, "drive: debtCount == 3 (organizer excluded)");
  eq(engine.foldCircle(c0).closed, 0, "drive: nothing closed yet");
  const c1 = withEvent(c0, "أ", settled);
  eq(engine.foldCircle(c1).status, "CIRCLE_PARTIAL", "drive: after settling one share -> CIRCLE_PARTIAL");
  const c2 = withEvent(c1, "ب", settled);
  eq(engine.foldCircle(c2).status, "CIRCLE_PARTIAL", "drive: two of three settled -> still CIRCLE_PARTIAL");
  const c3 = withEvent(c2, "ج", settled);
  eq(engine.foldCircle(c3).status, "CIRCLE_KEPT", "drive: all three settled -> CIRCLE_KEPT");
  /* collected == owed when fully kept; conservation of the collected total.
     owedMinor counts only the NON-organizer shares (the organizer's own portion
     is `self` — already covered — so with 4 participants splitting 900, the debt
     is the 3 member shares, NOT the full 900). */
  const f3 = engine.foldCircle(c3);
  const debtSum3 = c3.members.filter(m => !m.self).reduce((a, m) => a + m.amountMinor, 0);
  eq(f3.collectedMinor, f3.owedMinor, "drive: fully-kept circle collected == owed");
  eq(f3.owedMinor, debtSum3, "drive: owed total == Σ non-self member shares (organizer's own portion excluded)");
  eq(f3.owedMinor, 67500, "drive: 900 split 4-ways → 3 debtors owe 67,500 halalas (organizer's 22,500 is self-covered)");
  /* a FORGIVEN share also closes the ذمّة (no cash, but settled) */
  const cF = withEvent(withEvent(withEvent(c0, "أ", ev("FORGIVEN")), "ب", settled), "ج", settled);
  eq(engine.foldCircle(cF).status, "CIRCLE_KEPT", "drive: forgive one + settle the rest -> CIRCLE_KEPT (إبراء closes)");
  ok(engine.foldCircle(cF).collectedMinor < engine.foldCircle(cF).owedMinor, "drive: forgiven share is NOT counted as cash collected");
}

/* =========================================================================
   3) foldOpenLoan conservation over many deterministic pay/forgive sequences.
      For each sequence: paid+forgiven+remaining == principal ALWAYS,
      remaining >= 0 ALWAYS, and status is NEVER DEFAULTED (open ⇒ no due).
========================================================================= */
{
  const apply = (loan, e) => Object.assign({}, loan, { events: loan.events.concat(e) });
  const N = 150;
  let allCons = true, allNonNeg = true, neverDefault = true, allClamped = true, allKeys = true;
  const VALID = { DRAFT: 1, ACTIVE: 1, PARTIAL: 1, KEPT: 1, FORGIVEN: 1 };
  for (let k = 0; k < N; k++) {
    const principalSAR = ri(1, 50000);
    let loan = L.makeOpenLoan({
      id: "OPEN-PROP-" + k, lender: "مُقرِض", borrower: "مقترِض",
      amountSAR: principalSAR, purpose: "اختبار"
    });
    const steps = ri(0, 8);
    for (let s = 0; s < steps; s++) {
      const remBefore = L.foldOpenLoan(loan).remainingMinor;
      const roll = rnd();
      let e;
      if (roll < 0.6) {
        /* pay a random amount (sometimes an overpay to exercise clamping) */
        const amt = ri(1, principalSAR + 7000);
        e = L.payEvent(loan, amt, engine);
        /* the event must never exceed what remained */
        if (e.amountMinor > remBefore) allClamped = false;
      } else if (roll < 0.85) {
        /* partial إبراء */
        const amt = ri(1, principalSAR + 7000);
        e = L.forgiveEvent(loan, amt, engine);
        if (e.amountMinor > remBefore) allClamped = false;
      } else {
        /* full إبراء (closes the remainder) */
        e = L.forgiveEvent(loan, null, engine);
      }
      loan = apply(loan, e);
      const f = L.foldOpenLoan(loan);
      if (f.paidMinor + f.forgivenMinor + f.remainingMinor !== engine.toMinor(principalSAR)) allCons = false;
      if (f.remainingMinor < 0) allNonNeg = false;
      if (f.statusKey === "DEFAULTED" || f.statusKey === "ESCALATED") neverDefault = false;
      if (!VALID[f.statusKey]) allKeys = false;
    }
  }
  ok(allCons, "foldOpenLoan: paid+forgiven+remaining == principal across all steps of " + N + " sequences");
  ok(allNonNeg, "foldOpenLoan: remaining >= 0 across all steps of " + N + " sequences");
  ok(neverDefault, "foldOpenLoan: status is NEVER DEFAULTED/ESCALATED (open-term ⇒ no due ⇒ no تأخّر)");
  ok(allClamped, "foldOpenLoan: pay/forgive events are always clamped to the remaining (no overpay) across " + N + " sequences");
  ok(allKeys, "foldOpenLoan: statusKey is always one of DRAFT/ACTIVE/PARTIAL/KEPT/FORGIVEN");
}

console.log("\n========================================================");
console.log("PROPERTIES: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
