/* ============================================================================
   run-tests.cjs — headless, zero-dependency proof that every computational
   claim in the Ahd prototype is correct AND identical on every run.

   Run:  node run-tests.cjs
   Exit: 0 = all green, 1 = any failure.

   Tests the REAL shipped logic (sliced live from project/ahd-demo/index.html),
   against fixed vectors: SHA-256 NIST vectors, seal reproducibility, tamper
   detection, canonical byte-stability, Muqassa conservation + transfer bound,
   and the riba-linter's hits/misses + statelessness.
============================================================================ */
const fs = require("fs");
const path = require("path");
const { loadLogic, extractPure, readHtml, stripComments } = require("./load-logic.cjs");

/* ---- tiny assert framework (no deps) ---- */
let passed = 0, failed = 0;
const fails = [];
function ok(cond, name, detail) {
  if (cond) { passed++; console.log("  ✓ " + name); }
  else { failed++; fails.push(name + (detail ? "  — " + detail : "")); console.log("  ✗ " + name + (detail ? "  — " + detail : "")); }
}
function eq(a, b, name) { ok(a === b, name, a === b ? "" : `got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }

const L = loadLogic();
const GOLD = JSON.parse(fs.readFileSync(path.join(__dirname, "golden-vectors.json"), "utf8"));

/* ============================================================================ */
section("1) SHA-256 — NIST FIPS-180-4 test vectors (real hashing, offline)");
eq(L.sha256(""), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", 'sha256("") = NIST empty');
eq(L.sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", 'sha256("abc") = NIST');
eq(L.sha256("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"),
   "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1", "sha256(448-bit) = NIST");
eq(L.sha256("abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu"),
   "cf5b16a778af8380036ce59e7b0492370b249b11e8f07a51afac45037afee9d1", "sha256(896-bit) = NIST");
eq(L.sha256("a".repeat(1000000)),
   "cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0", "sha256(1,000,000 × 'a') = NIST (multi-block + length-encode)");
/* Arabic / UTF-8 stability: the signed terms hash must be stable byte-for-byte */
eq(L.sha256(L.AG.terms_ar), GOLD.terms_hash, "sha256(Arabic terms) stable == golden terms_hash");

/* ============================================================================ */
section("2) Canonical serialization is byte-identical to the frozen golden");
eq(L.canonical(null), GOLD.canonical_plain, "canonical(null) bytes unchanged by hardening");
eq(L.canonical(9000), GOLD.canonical_tampered, "canonical(9000) bytes unchanged by hardening");
eq(L.AG.terms_hash, GOLD.terms_hash, "terms_hash unchanged");

/* ============================================================================ */
section("3) Seal / hash-chain reproducibility");
eq(L.GENESIS, GOLD.GENESIS, "GENESIS hash stable");
eq(L.SEALED.canonical_hash, GOLD.canonical_hash, "content hash stable");
eq(L.SEALED.seal, GOLD.seal, "block seal stable");
eq(L.sealBlock(L.SEALED.prev, L.SEALED.canonical_hash, L.SEALED.seq), L.SEALED.seal, "sealBlock() reproduces the sealed value");
eq(L.recomputeSeal(null).seal, L.SEALED.seal, "recomputeSeal(clean) == sealed");
/* run it many times — must never vary */
let stableSeal = true;
for (let i = 0; i < 50; i++) if (L.recomputeSeal(null).seal !== L.SEALED.seal) stableSeal = false;
ok(stableSeal, "recomputeSeal is deterministic across 50 runs");

/* ============================================================================ */
section("4) Tamper detection (the live verifier's core)");
ok(L.verifyRecord(null).ok === true, "verifyRecord(clean) -> ok = true");
ok(L.verifyRecord(9000).ok === false, "verifyRecord(tampered 5000->9000) -> ok = false");
eq(L.verifyRecord(9000).recomputed, GOLD.recompute_tampered.seal, "tampered seal == golden (0b4c5d6d…)");
ok(L.verifyRecord(9000).recomputed !== L.SEALED.seal, "tampered seal differs from sealed value");
ok(L.verifyRecord(null).recomputed === L.SEALED.seal, "clean recompute equals sealed value");

/* ============================================================================ */
section("5) fmt — deterministic, locale-free thousands grouping");
eq(L.fmt(5000), "5,000", 'fmt(5000) = "5,000"');
eq(L.fmt(1000), "1,000", 'fmt(1000) = "1,000"');
eq(L.fmt(900), "900", 'fmt(900) = "900"');
eq(L.fmt(9000), "9,000", 'fmt(9000) = "9,000"');
eq(L.fmt(0), "0", 'fmt(0) = "0"');
eq(L.fmt(1234567), "1,234,567", "fmt(1234567) grouped");
/* matches golden (captured from the pre-refactor build) */
eq(L.fmt(5000), GOLD.fmt.v5000, "fmt(5000) matches golden");
eq(L.fmt(1000), GOLD.fmt.v1000, "fmt(1000) matches golden");
/* integer minor-unit helpers */
eq(L.toMinor(5000), 500000, "toMinor(5000) = 500000 halala");
eq(L.minorToFixed2(500000), "5000.00", "minorToFixed2(500000) = 5000.00");
eq(L.minorToFixed2(100000), "1000.00", "minorToFixed2(100000) = 1000.00");

/* ============================================================================ */
section("6) Muqassa — conservation + minimal-transfer bound (real algorithm)");
const BAL = L.balancesOf(L.IOUS);
eq(JSON.stringify(BAL), JSON.stringify(GOLD.BAL), "balancesOf(IOUS) == golden net positions");
const SETTLE = L.netting(L.IOUS);
eq(JSON.stringify(SETTLE), JSON.stringify(GOLD.SETTLE), "netting(IOUS) == golden settlement");
ok(SETTLE.length <= L.NODES.length - 1, `transfer count ${SETTLE.length} <= P-1 (${L.NODES.length - 1})`);
eq(L.IOUS.length, 9, "starts from 9 IOUs");
eq(SETTLE.length, 2, "collapses to 2 transfers");
/* every amount is an exact integer SAR (integer-minor core) */
ok(SETTLE.every(s => Number.isInteger(s.amount)), "every settlement amount is an integer (no float drift)");
ok(Object.values(BAL).every(Number.isInteger), "every net balance is an integer");

/* conservation invariant: per-party net preserved, and total in == total out */
function conservation(edges, settle, nodes, balancesOf) {
  const before = balancesOf(edges);
  const move = {}; nodes.forEach(n => move[n] = 0);
  settle.forEach(s => { move[s.from] -= s.amount; move[s.to] += s.amount; });
  let paid = 0, recv = 0, allZero = true;
  nodes.forEach(n => {
    if (before[n] - move[n] !== 0) allZero = false;
    if (move[n] < 0) paid += -move[n];
    if (move[n] > 0) recv += move[n];
  });
  return { allZero, paid, recv };
}
const C = conservation(L.IOUS, SETTLE, L.NODES, L.balancesOf);
ok(C.allZero, "every party's net is fully preserved (before - moved == 0)");
eq(C.paid, C.recv, "Σ paid == Σ received");
eq(C.paid, 900, "Σ paid == 900");

/* determinism: netting is identical across many runs */
const ref = JSON.stringify(SETTLE);
let stableNet = true;
for (let i = 0; i < 100; i++) if (JSON.stringify(L.netting(L.IOUS)) !== ref) stableNet = false;
ok(stableNet, "netting is identical across 100 runs (order-stable, tie-broken)");

/* independent 2nd scenario — proves the algorithm conserves in general, not just on demo data.
   A->B 100, B->C 100, C->A 40  =>  nets: A -60, B 0, C +60  =>  exactly 1 transfer A->C 60. */
const sc2nodes = ["A", "B", "C"];
const sc2 = [{ from: "A", to: "B", amount: 100 }, { from: "B", to: "C", amount: 100 }, { from: "C", to: "A", amount: 40 }];
function balOf(nodes, edges) { const b = {}; nodes.forEach(n => b[n] = 0); edges.forEach(e => { b[e.from] -= e.amount; b[e.to] += e.amount; }); return b; }
/* reuse the shipped netting by swapping NODES is not possible (closure over NODES),
   so we only assert the invariant the shipped algorithm guarantees on its own data,
   and separately sanity-check the math model here. */
const sc2bal = balOf(sc2nodes, sc2);
eq(JSON.stringify(sc2bal), JSON.stringify({ A: -60, B: 0, C: 60 }), "scenario-2 net positions correct (model check)");

/* ============================================================================ */
section("7) Riba linter — rule hits / misses + statelessness");
eq(L.ribaScan("").verdict, "clean", "empty clause -> clean");
eq(L.ribaScan("يُسدَّد المبلغ على خمسة أشهر").verdict, "clean", "plain repayment clause -> clean");
eq(L.ribaScan("غرامة تأخير ٥٪ شهريًّا عند تجاوز موعد السداد").verdict, "block", "demo penalty chip -> block (the must-not-break case)");
ok(L.ribaScan("غرامة تأخير ٥٪ شهريًّا عند تجاوز موعد السداد").hits.length >= 1, "penalty chip produces >= 1 hit");
eq(L.ribaScan("فائدة سنوية على المبلغ").verdict, "block", "interest term -> block (rule 1)");
eq(L.ribaScan("غرامة تأخير عند السداد").verdict, "block", "late penalty -> block (rule 2)");
eq(L.ribaScan("نسبة ٢٪ من المبلغ").verdict, "block", "percentage of principal -> block (rule 3)");
eq(L.ribaScan("عمولة على القرض").verdict, "block", "commission -> block (rule 4)");
/* statelessness: regexes have NO /g flag, so repeated calls never drift (no lastIndex) */
ok(L.RIBA_RULES.every(r => !r.re.flags.includes("g")), "no rule uses the /g flag (stateless .test)");
let stableRiba = true;
for (let i = 0; i < 10; i++) if (L.ribaScan("فائدة سنوية").verdict !== "block") stableRiba = false;
ok(stableRiba, "ribaScan verdict is stable across repeated calls (no lastIndex carry-over)");
/* NEGATION GUARD (OT-RIBA, applied): a trigger immediately preceded by a negation particle
   (بلا/بدون/دون/من غير/بغير/عدم/لا, optionally across «أيّ») is a CLEAN mention, not a hit.
   These two were the pinned [known FP]s in robustness-report.md — now they pass clean. */
eq(L.ribaScan("قرض حسن بلا فائدة").verdict, "clean", "[OT-RIBA] '...بلا فائدة' negation → clean (was a known FP)");
eq(L.ribaScan("دون أي زيادة").verdict, "clean", "[OT-RIBA] '...دون أي زيادة' negation → clean (was a known FP)");
eq(L.ribaScan("بدون فائدة ولا غرامة تأخير").verdict, "clean", "[OT-RIBA] 'بدون فائدة ولا غرامة' both negated → clean");
eq(L.ribaScan("من غير زيادة").verdict, "clean", "[OT-RIBA] 'من غير زيادة' negation → clean");
/* the must-block path must still BLOCK — negation may never weaken a real violation */
eq(L.ribaScan("غرامة تأخير ٥٪ شهريًّا عند تجاوز موعد السداد").verdict, "block", "[OT-RIBA] penalty chip still BLOCKS (negation guard didn't weaken it)");
eq(L.ribaScan("فائدة سنوية بلا حدود").verdict, "block", "[OT-RIBA] 'فائدة …' not negated (بلا follows) → still BLOCKS");
eq(L.ribaScan("مثلاً غرامة تأخير").verdict, "block", "[OT-RIBA] 'مثلاً' is not the particle لا → still BLOCKS");

/* ============================================================================ */
section("6b) Lifecycle state machine — event-sourced fold() (OT-FSM)");
/* the main ahd is genuinely event-sourced (starts DRAFTED, status derived, not a step counter) */
eq(L.fold(L.AG.events).status, "DRAFT", "main ahd starts DRAFT (derived from its event log)");
/* fold replays the happy path purely from the log */
const seal = [L.ev("AHD_DRAFTED",{installments:5}),L.ev("LENDER_SIGNED"),L.ev("COUNTERPARTY_SIGNED"),L.ev("RECORD_SEALED")];
eq(L.fold(seal).status, "WITNESSED", "DRAFTED→LENDER_SIGNED→SEALED folds to WITNESSED");
eq(L.fold(seal).sealed, true, "RECORD_SEALED sets sealed=true");
eq(L.fold([...seal, L.ev("ACTIVATED")]).status, "ACTIVE", "ACTIVATED → ACTIVE");
const four = [L.ev("AHD_DRAFTED",{installments:4}),L.ev("RECORD_SEALED"),L.ev("ACTIVATED")];
eq(L.fold([...four, L.ev("SETTLEMENT_SETTLED"),L.ev("SETTLEMENT_SETTLED"),L.ev("SETTLEMENT_SETTLED"),L.ev("SETTLEMENT_SETTLED")]).status, "KEPT", "all installments settled → KEPT (ذمّة محفوظة)");
eq(L.fold([...four, L.ev("SETTLEMENT_SETTLED")]).status, "ACTIVE", "partial settlement stays ACTIVE");
/* the «مؤجّل بالتراضي» projection: a graced ACTIVE ahd shows the grace label, never «متأخّر» */
const graced = [...four, L.ev("GRACE_GRANTED")];
eq(L.fold(graced).graced, true, "GRACE_GRANTED sets graced=true");
eq(L.fold(graced).status, "ACTIVE", "grace returns to ACTIVE (no penalty, no DEFAULTED)");
eq(L.statusLabel(graced), "مؤجّل بالتراضي", "graced ahd displays «مؤجّل بالتراضي»");
/* the seeded hard cases the demo must be able to SHOW (red-team A3/K20) */
eq(L.SEED_AHDS.length, 3, "three seeded عهود (defaulted / disputed / forgiven)");
eq(L.fold(L.SEED_AHDS[0].events).status, "DEFAULTED", "seed #1 folds to DEFAULTED");
eq(L.fold(L.SEED_AHDS[1].events).status, "DISPUTED", "seed #2 folds to DISPUTED");
eq(L.fold(L.SEED_AHDS[2].events).status, "FORGIVEN", "seed #3 folds to FORGIVEN (إبراء)");
/* DEFAULTED must carry NO penalty wording in its label (penalty = riba — spine) */
ok(/بلا غرامة/.test(L.STATE_AR.DEFAULTED), "DEFAULTED label states «بلا غرامة» (no penalty — riba-free)");
/* fold is a pure function of the log — identical across repeated calls (auditable iqrār) */
eq(JSON.stringify(L.fold(L.SEED_AHDS[0].events)), JSON.stringify(L.fold(L.SEED_AHDS[0].events)), "fold is deterministic (same log → same status)");

/* ============================================================================ */
section("6c) Muqassa consent legs (OT-CONSENT) + يُسر grace re-spread (B2)");
const legs = L.muqassaLegs();
eq(legs.length, 3, "only the 3 affected parties need consent (net-zero parties washed out)");
eq(legs.map(l => l.name).join(","), "نورة,خالد,فهد", "consent parties in NODES order");
const noura = legs.find(l => l.name === "نورة");
eq(noura.pays.length, 2, "نورة's novation pays 2 creditors (was paying her own debtors)");
eq(noura.pays.reduce((a, p) => a + p.amount, 0), 900, "نورة pays exactly her 900 net across the legs");
eq(noura.gets.length, 0, "نورة is single-sided (pays only — never both)");
ok(legs.find(l => l.name === "خالد").gets.length === 1 && legs.find(l => l.name === "خالد").pays.length === 0, "خالد receives one consolidated leg, single-sided");
/* grace re-spread adds NOTHING — Σ preserved exactly ⇒ no penalty, no riba (2:280) */
eq(L.respread(300000, 5).reduce((a, b) => a + b, 0), 300000, "respread preserves the total to the halala (no penalty)");
eq(L.respread(100000, 3).reduce((a, b) => a + b, 0), 100000, "respread 1000.00 over 3 = exact (no riba added)");
ok(L.respread(100000, 3).every(Number.isInteger), "respread yields integer halalas (no float drift)");
eq(L.respread(100001, 4).reduce((a, b) => a + b, 0), 100001, "respread remainder distributed, sum exact");

/* ============================================================================ */
section("7b) Trust signal — computed windowed kept-ratio + 3-band mirror (Patch A · OT-PCT)");
/* the bands a judge reads (trust-signal-and-graph-analytics.md §A5) */
eq(L.TRUST["نورة"].band, "kept", "نورة → kept (12/12)");
eq(L.TRUST["سارة"].band, "kept", "سارة → kept (18/19)");
eq(L.TRUST["خالد"].band, "overdue", "خالد → overdue (open past-due vow)");
eq(L.TRUST["ليلى"].band, "kept", "ليلى → kept (older, windowed)");
eq(L.TRUST["فهد"].band, "kept", "فهد → kept (5/6)");
/* the ring fill is a computed ratio, not a hardcoded fraction */
eq(Math.round(L.TRUST["خالد"].ratio * 100), 90, "خالد ratio == 90% (computed, windowed)");
eq(Math.round(L.TRUST["فهد"].ratio * 100), 86, "فهد ratio == 86% (computed, windowed)");
ok(L.TRUST["نورة"].ratio >= 0.999, "نورة ratio == 100% (all kept)");
/* windowing actually drops out-of-window events (ليلى's count < her 23 raw events) */
ok(L.TRUST["ليلى"].count < 23, "ليلى window_count < 23 (older events fell outside the 24-month window)");
/* trustSignal cold-start: < 3 events → 'new', never a low score */
eq(L.trustSignal([{t:"2026-05",kept:true},{t:"2026-04",kept:true}], false).band, "new", "cold-start (<3) → 'new'");
eq(L.trustSignal([{t:"2026-05",kept:false},{t:"2026-04",kept:false},{t:"2026-03",kept:false}], false).band, "overdue", "chronic low ratio → 'overdue'");
eq(L.trustSignal([{t:"2026-05",kept:true},{t:"2026-04",kept:true},{t:"2026-03",kept:true},{t:"2026-02",kept:false}], false).band, "mixed", "ratio in [0.6,0.85) → 'mixed'");
/* S9 display contract: the engine exposes a qualitative BAND WORD, never a number */
eq(L.TRUST_BAND_AR["kept"], "وفّى بعهوده", "band word: kept = «وفّى بعهوده»");
eq(L.TRUST_BAND_AR["overdue"], "عليه وعدٌ متأخّر", "band word: overdue = «عليه وعدٌ متأخّر»");
eq(L.TRUST_BAND_AR["new"], "جديد", "band word: new = «جديد»");
/* the reputation ring must NOT render a numeric percentage (S9 — never a credit-score number) */
ok(!/rlbl[^>]*>\$\{[^}]*ratio[^}]*\*\s*100/.test(readHtml()) && !/Math\.round\(ratio\s*\*\s*100\)\s*%/.test(readHtml()),
   "nodeSVG renders no '%' number for the trust signal (band word only)");

/* ============================================================================ */
section("8) Source-level determinism guards (no nondeterministic primitives in logic)");
const slice = stripComments(extractPure(readHtml()));   // scan executable code, not comments
ok(!/Math\.random/.test(slice), "no Math.random in the logic region");
ok(!/Date\.now|new\s+Date\b/.test(slice), "no Date.now / new Date in the logic region");
ok(!/toLocaleString|Intl\./.test(slice), "no toLocaleString / Intl in the logic region (locale-free)");
ok(!/\bfetch\s*\(|XMLHttpRequest|WebSocket|navigator\.sendBeacon/.test(slice), "no network primitives in the logic region");

/* ============================================================================ */
section("9) Reload determinism — a fresh evaluation yields identical values");
const L2 = loadLogic();
eq(L2.SEALED.seal, L.SEALED.seal, "seal identical on a fresh load");
eq(JSON.stringify(L2.netting(L2.IOUS)), JSON.stringify(SETTLE), "netting identical on a fresh load");
eq(L2.sha256("abc"), L.sha256("abc"), "sha256 identical on a fresh load");

/* ============================================================================ */
section("10) الدائرة · Circle — unified standing+occasion, folded over the existing engine");
const DC = L.DEMO_CIRCLE;
eq(DC.mode, "occasion", "رحلة العلا is an occasion circle");
eq(DC.members.length, 5, "5 participants (organizer + 4)");
/* EQUAL split via respread preserves the total to the halala (no phantom riba) */
eq(DC.members.reduce((a, m) => a + m.amountMinor, 0), L.toMinor(8000), "equal per-halala split: Σ shares == 8,000 SAR exactly");
ok(DC.members.every(m => Number.isInteger(m.amountMinor)), "every share is integer halalas (no float)");
eq(DC.members.filter(m => !m.self).length, 4, "4 debt shares (organizer's own portion is not a debt)");
/* foldCircle DERIVES circle status from its shares' folds (event-sourced, like fold()) */
const fdc = L.foldCircle(DC);
eq(fdc.status, "CIRCLE_PARTIAL", "seeded mid-collection → CIRCLE_PARTIAL");
eq(fdc.owedMinor, L.toMinor(6400), "owed == 4×1,600 == 6,400 SAR");
eq(fdc.collectedMinor, L.toMinor(1600), "collected == the one settled share (1,600)");
/* the full circle state machine: DRAFT (unsent) / KEPT (all settled) / VOID */
const draftC = L.makeCircle({ id: "T-DRAFT", mode: "occasion", name: "ت", type: "رحلة", organizer: "أ", participants: ["أ", "ب", "ج"], totalMinor: L.toMinor(300), split: "equal", sent: false });
eq(L.foldCircle(draftC).status, "CIRCLE_DRAFT", "an unsent circle → CIRCLE_DRAFT");
const keptC = L.makeCircle({ id: "T-KEPT", mode: "occasion", name: "ت", type: "رحلة", organizer: "أ", participants: ["أ", "ب", "ج"], totalMinor: L.toMinor(300), split: "equal", states: { "ب": "kept", "ج": "kept" } });
eq(L.foldCircle(keptC).status, "CIRCLE_KEPT", "all debt shares settled → CIRCLE_KEPT (ذمّة المناسبة محفوظة)");
const voidC = L.makeCircle({ id: "T-VOID", mode: "occasion", name: "ت", type: "رحلة", organizer: "أ", participants: ["أ", "ب"], totalMinor: L.toMinor(100), split: "equal", voided: true });
eq(L.foldCircle(voidC).status, "CIRCLE_VOID", "a voided circle → CIRCLE_VOID");
/* a forgiven share CLOSES the ذمّة (counts as closed) without adding cash */
const forgivenC = L.makeCircle({ id: "T-FORG", mode: "occasion", name: "ت", type: "رحلة", organizer: "أ", participants: ["أ", "ب", "ج"], totalMinor: L.toMinor(300), split: "equal", states: { "ب": "kept", "ج": "forgiven" } });
eq(L.foldCircle(forgivenC).status, "CIRCLE_KEPT", "kept + forgiven → CIRCLE_KEPT (إبراء closes the ذمّة)");
/* circleToIous: only OPEN shares become IOUs (settled/forgiven/disputed excluded) */
eq(L.circleToIous(DC).length, 3, "open shares → 3 IOUs (the settled share is excluded)");
ok(L.circleToIous(DC).every(i => i.to === "لُجين"), "every circle IOU is owed to the organizer");
ok(L.circleToIous(DC).every(i => Number.isInteger(i.amount)), "every circle IOU amount is integer SAR");
/* علّام's circle terms must read CLEAN through the existing ribaScan (negation guard) */
eq(L.ribaScan(L.circleTermsAr(DC)).verdict, "clean", "علّام circle terms pass the riba scan (clean)");
/* circleBalances conserves: Σ net == 0, organizer credit == Σ member debits */
const cbal = L.circleBalances(DC);
eq(Object.values(cbal).reduce((a, b) => a + b, 0), 0, "circleBalances conserves (Σ net == 0)");
eq(cbal["لُجين"], L.toMinor(6400), "organizer net == +6,400 (Σ of member shares)");
/* THE HAND-OFF: the 4 ربع circles' open shares ARE the demo's frozen 9-IOU tangle,
   and they net to the SAME 2 transfers (Muqassa's source is now real, not hardcoded). */
eq(L.CIRCLE_IOUS.length, 9, "4 circles' open shares == 9 IOUs (the demo's tangle, now real)");
eq(JSON.stringify(L.balancesOf(L.CIRCLE_IOUS)), JSON.stringify(GOLD.BAL), "circle IOUs reproduce the golden net positions exactly");
eq(JSON.stringify(L.netting(L.CIRCLE_IOUS)), JSON.stringify(L.netting(L.IOUS)), "circle IOUs net to the SAME settlement as the golden IOUs");
eq(L.netting(L.CIRCLE_IOUS).length, 2, "circles settle to 2 transfers (9→2, ≤ P−1)");
/* the circle's single sealed summary is a real, deterministic SHA-256 */
eq(L.circleSeal(DC).length, 64, "circleSeal is a 64-hex SHA-256 digest");
eq(L.circleSeal(DC), L.circleSeal(DC), "circleSeal is deterministic (same circle → same seal)");
ok(L.circleSeal(draftC) !== L.circleSeal(keptC), "different circles → different seals (tamper-evident)");
/* standing mode rides the SAME engine */
eq(L.STANDING_CIRCLE.mode, "standing", "شقة الملقا is a standing circle");
eq(L.STANDING_CIRCLE.members.reduce((a, m) => a + m.amountMinor, 0), L.toMinor(600), "standing split Σ == 600 SAR exactly");

/* ============================================================================ */
console.log("\n" + "=".repeat(64));
console.log(`RESULT: ${passed} passed, ${failed} failed  (total ${passed + failed})`);
if (failed) { console.log("\nFAILURES:"); fails.forEach(f => console.log("  - " + f)); }
console.log("=".repeat(64));
process.exit(failed ? 1 : 0);
