// =============================================================================
//  Generate every reproducible test vector for 10_Deep/Backend.
//  Usage:  node ref/generate-vectors.mjs            (human-readable)
//          node ref/generate-vectors.mjs --json     (raw JSON dump)
// =============================================================================
import {
  H, jcs, jcsHash, GENESIS, BANK_ATTESTATION, buildSchedule, sealRecord, verifyRecord,
  merkleRoot, inclusionPath, verifyInclusion, balances, greedyNetting, conservation,
  findCycles, efficiency, minTransfersExact, greedyCountFromBalances, trustSignal, TRUST,
  selfTestSha256, verifyPlan, greedyNetting as _gn,
} from "./ahd-ref.mjs";

const out = {};
const log = (...a) => { if (!process.argv.includes("--json")) console.log(...a); };

/* 0 — SHA-256 pinned to NIST */
out.sha256_selftest = selfTestSha256();
log("SHA-256 NIST self-test:", out.sha256_selftest ? "PASS" : "FAIL");

/* 1 — JCS conformance examples (RFC 8785 behaviours) */
out.jcs_examples = {
  key_sort: jcs({ b: 1, a: 2, c: 3 }),                 // {"a":2,"b":1,"c":3}
  nested: jcs({ z: { y: 1, x: 2 }, a: [3, 2, 1] }),    // arrays keep order, keys sort
  unicode: jcs({ k: "نورة" }),                          // Arabic preserved as UTF-8
  escape: jcs({ s: 'a"b\\c\t' }),                       // JSON minimal escaping
  bool_null: jcs({ t: true, f: false, n: null }),
};
log("\nJCS examples:");
for (const [k, v] of Object.entries(out.jcs_examples)) log("  " + k + " => " + v);

/* 2 — THE DEMO RECORD (Noura → Sara, 5,000 SAR qard hasan) */
const principal = 500000, months = 5;
const schedule = buildSchedule(principal, months, "2026-07");
const sub = (name) => jcsHash({ _t: "mock.nafath.sub.v1", id_namespace: "alinma-ahd", name });
const terms_ar =
  "يُقِرّ الطرفان بأنّ «نورة العتيبي» أقرضت «سارة الزهراني» مبلغ 5,000 ريال على سبيل القرض الحسن، " +
  "يُسدَّد على 5 أقساطٍ شهريّةٍ متساوية قدر كلٍّ منها 1,000 ريال، دون أيّ زيادة أو فائدة أو غرامة تأخير. " +
  "عند العجز يُمهَل المقترض بالمعروف.";
const terms = {
  _t: "ahd.terms.v1",
  ahd_id: "AHD-01HZ-NOURA-SARA",
  kind: "qard_hasan",
  parties: [
    { role: "lender", display_name: "نورة العتيبي", nafath_sub: sub("نورة العتيبي") },
    { role: "borrower", display_name: "سارة الزهراني", nafath_sub: sub("سارة الزهراني") },
  ],
  principal: { amount_halalas: principal, currency: "SAR" },
  months,
  schedule,
  riba: { interest: false, late_penalty_to_lender: false, gharar: false },
  terms_ar,
  basis: "Quran:2:282",
  ts: "2026-07-01T10:30:00+03:00",
};
const assertions = [
  { sub: sub("نورة العتيبي"), acr: "nafath.biometric", auth_time: "2026-07-01T10:29:40+03:00", txn_id: "NFTH-TXN-LENDER-7731" },
  { sub: sub("سارة الزهراني"), acr: "nafath.biometric", auth_time: "2026-07-01T10:29:58+03:00", txn_id: "NFTH-TXN-BORROW-7748" },
];
const rec = sealRecord(terms, {
  assertions,
  tsa: { tsa: "mock-tsa-alinma", gen_time: "2026-07-01T10:30:05+03:00" },
  seq: 1, prev_chain_hash: GENESIS,
  fee: { flat_halalas: 0, basis: "actual_direct_cost" },
});
out.genesis = GENESIS;
out.schedule_sum_ok = schedule.reduce((s, x) => s + x.amount_halalas, 0) === principal;
out.record = {
  terms_canonical: jcs(terms),
  terms_hash: rec.terms_hash,
  assertion_sigs: rec.assertions.map((a) => ({ sub: a.sub.slice(0, 16) + "…", sig: a.sig })),
  tsa_token: rec.tsa.tsa_token,
  envelope_hash: rec.envelope_hash,
  leaf: rec.leaf,
  bank_sig: rec.bank_sig,
};
log("\nDEMO RECORD (Noura→Sara):");
log("  terms_hash :", rec.terms_hash);
log("  envelope   :", rec.envelope_hash);
log("  leaf       :", rec.leaf);
log("  bank_sig   :", rec.bank_sig);
log("  schedule Σ == principal:", out.schedule_sum_ok);

/* 3 — VERIFICATION: intact / tamper / reorder / replay */
const clone = (o) => JSON.parse(JSON.stringify(o));

// intact
out.verify_intact = verifyRecord(rec);

// single-field tamper: principal 5,000 -> 9,000 (post-seal)
const tampered = clone(rec);
tampered.terms.principal.amount_halalas = 900000;
out.verify_tamper_amount = verifyRecord(tampered);

// reorder tamper: swap schedule[0] and schedule[1] (arrays are order-significant in JCS)
const reordered = clone(rec);
[reordered.terms.schedule[0], reordered.terms.schedule[1]] = [reordered.terms.schedule[1], reordered.terms.schedule[0]];
out.verify_tamper_reorder = verifyRecord(reordered);

// key-reorder is NOT a tamper: JCS sorts keys -> identical bytes -> identical hash
out.keyorder_is_noop = jcsHash({ a: 1, b: 2 }) === jcsHash({ b: 2, a: 1 });

// replay: present the SAME envelope at seq=2 with prev=GENESIS (wrong slot)
const replay = sealRecord(terms, {
  assertions, tsa: { tsa: "mock-tsa-alinma", gen_time: "2026-07-01T10:30:05+03:00" },
  seq: 2, prev_chain_hash: GENESIS, fee: { flat_halalas: 0, basis: "actual_direct_cost" },
});
out.replay_leaf_differs = replay.leaf !== rec.leaf;            // seq change alone => new leaf
out.verify_replay_continuity = verifyRecord(replay, { prevLeaf: rec.leaf }); // prev mismatch caught
log("\nVERIFY: intact=", out.verify_intact.intact,
    "| tamper-amount failedAt=", out.verify_tamper_amount.failedAt,
    "| reorder failedAt=", out.verify_tamper_reorder.failedAt,
    "| key-reorder no-op=", out.keyorder_is_noop,
    "| replay continuity failedAt=", out.verify_replay_continuity.failedAt);

/* 4 — MERKLE CHECKPOINT over a 4-record batch + inclusion proof */
// build 3 more sibling records (other circle agreements) to fill the batch
function quickLeaf(id, amount, seq, prev) {
  const t = { _t: "ahd.terms.v1", ahd_id: id, kind: "qard_hasan",
    parties: [{ role: "lender", display_name: id + "-L", nafath_sub: sub(id + "L") },
              { role: "borrower", display_name: id + "-B", nafath_sub: sub(id + "B") }],
    principal: { amount_halalas: amount, currency: "SAR" }, months: 1,
    schedule: [{ seq: 1, due: "2026-08-01", amount_halalas: amount }],
    riba: { interest: false, late_penalty_to_lender: false, gharar: false },
    terms_ar: "قرض حسن " + id, basis: "Quran:2:282", ts: "2026-07-02T09:00:00+03:00" };
  const r = sealRecord(t, { assertions: [
    { sub: sub(id + "L"), acr: "nafath.biometric", auth_time: "2026-07-02T08:59:00+03:00", txn_id: "NFTH-" + id + "-L" },
    { sub: sub(id + "B"), acr: "nafath.biometric", auth_time: "2026-07-02T08:59:30+03:00", txn_id: "NFTH-" + id + "-B" }],
    tsa: { tsa: "mock-tsa-alinma", gen_time: "2026-07-02T09:00:05+03:00" },
    seq, prev_chain_hash: prev, fee: { flat_halalas: 0, basis: "actual_direct_cost" } });
  return r;
}
const r0 = rec;                                   // seq 1, the demo record
const r1 = quickLeaf("AHD-CIRCLE-02", 30000, 2, r0.leaf);
const r2 = quickLeaf("AHD-CIRCLE-03", 75000, 3, r1.leaf);
const r3 = quickLeaf("AHD-CIRCLE-04", 12000, 4, r2.leaf);
const leaves = [r0.leaf, r1.leaf, r2.leaf, r3.leaf];
const root = merkleRoot(leaves);
const proofIdx = 1;
const path = inclusionPath(proofIdx, leaves);
out.merkle = {
  tree_size: leaves.length, leaves, root,
  inclusion_for_index: proofIdx, audit_path: path,
  verifies: verifyInclusion(leaves[proofIdx], proofIdx, path, leaves.length, root),
  tamper_detected: !verifyInclusion(H("forged-leaf"), proofIdx, path, leaves.length, root),
};
log("\nMERKLE: root=", root, "| proof[idx1] verifies=", out.merkle.verifies, "| forged rejected=", out.merkle.tamper_detected);

// full chain-aware verification of r1 under the checkpoint
out.verify_r1_full = verifyRecord(r1, {
  prevLeaf: r0.leaf,
  checkpoint: { tree_size: leaves.length, root },
  inclusion: { index: 1, path },
}).intact;
log("  r1 full verify (chain+merkle):", out.verify_r1_full);

/* 5 — MUQASSA: the demo's 9 IOUs (in halalas) */
const PARTIES = ["نورة", "سارة", "خالد", "ليلى", "فهد"];
const IOUS_SAR = [
  ["نورة", "سارة", 200], ["سارة", "خالد", 200], ["نورة", "ليلى", 250], ["ليلى", "فهد", 250],
  ["نورة", "خالد", 400], ["نورة", "فهد", 50], ["سارة", "ليلى", 150], ["ليلى", "خالد", 150],
  ["خالد", "سارة", 150],
];
const IOUS = IOUS_SAR.map(([from, to, s]) => ({ from, to, amount: s * 100 }));
const bal = balances(PARTIES, IOUS);
const transfers = greedyNetting(PARTIES, IOUS);
const cons = conservation(PARTIES, IOUS, transfers);
const eff = efficiency(IOUS, transfers);
const cycles = findCycles(PARTIES, IOUS);
out.muqassa_demo = {
  balances_halalas: bal,
  transfers_halalas: transfers,
  transfers_sar: transfers.map((t) => ({ from: t.from, to: t.to, sar: t.amount / 100 })),
  conservation_all_zero: cons.allZero, conservation_sum_zero: cons.sumZero,
  total_paid_halalas: cons.totalPaid,
  efficiency: eff,
  cycles_found: cycles.length,
  exact_min: minTransfersExact(Object.values(bal)),
  greedy_count: transfers.length,
};
log("\nMUQASSA demo: balances(SAR)=",
    Object.fromEntries(Object.entries(bal).map(([k, v]) => [k, v / 100])));
log("  transfers:", out.muqassa_demo.transfers_sar.map((t) => `${t.from}->${t.to}:${t.sar}`).join("  "));
log("  conservation allZero=", cons.allZero, "sumZero=", cons.sumZero, "| paid=", cons.totalPaid / 100, "SAR");
log("  efficiency:", JSON.stringify(eff), "| cycles=", cycles.length,
    "| greedy=", transfers.length, "exact=", out.muqassa_demo.exact_min);

/* 6 — MUQASSA edge cases */
const ec = {};
// pure 3-cycle equal -> 0 transfers
ec.pure_cycle = greedyNetting(["A", "B", "C"],
  [{ from: "A", to: "B", amount: 1000 }, { from: "B", to: "C", amount: 1000 }, { from: "C", to: "A", amount: 1000 }]).length;
// star (one creditor) -> n-1
ec.star = greedyNetting(["A", "B", "C", "D"],
  [{ from: "A", to: "D", amount: 100 }, { from: "B", to: "D", amount: 100 }, { from: "C", to: "D", amount: 100 }]).length;
// owes & is owed equally -> drops out
ec.balanced_dropout = balances(["A", "B"], [{ from: "A", to: "B", amount: 500 }, { from: "B", to: "A", amount: 500 }]);
out.muqassa_edges = ec;
log("\nMUQASSA edges: pure-cycle transfers=", ec.pure_cycle, "| star transfers=", ec.star, "| balanced dropout=", JSON.stringify(ec.balanced_dropout));

/* 7 — OPTIMALITY: search a deterministic instance where greedy > exact */
function searchWorstCase() {
  // deterministic LCG so the search is reproducible (no Math.random)
  let s = 123456789;
  const rnd = (n) => { s = (1103515245 * s + 12345) & 0x7fffffff; return s % n; };
  for (let trial = 0; trial < 200000; trial++) {
    const n = 4 + rnd(4);                       // 4..7 parties
    const v = [];
    let sum = 0;
    for (let i = 0; i < n - 1; i++) { const x = rnd(13) - 6; v.push(x); sum += x; }
    v.push(-sum);
    const nz = v.filter((x) => x !== 0);
    if (nz.length < 4) continue;
    const g = greedyCountFromBalances(nz.slice());
    const e = minTransfersExact(nz.slice());
    if (g > e) return { balances: nz, greedy: g, exact: e, trial };
  }
  return null;
}
const wc = searchWorstCase();
// build explicit greedy + a verified exact plan for the found instance
if (wc) {
  const parties = wc.balances.map((_, i) => "P" + i);
  const net = Object.fromEntries(parties.map((p, i) => [p, wc.balances[i]]));
  // synth edges that realise these balances: each debtor sends |bal| to a sink, sink redistributes? simpler:
  // greedy operates on balances directly via greedyNetting using a single phantom edge set:
  const synthEdges = [];
  parties.forEach((p, i) => { if (wc.balances[i] < 0) synthEdges.push({ from: p, to: "P0", amount: -wc.balances[i] }); });
  // (greedy uses only net balances, so reconstruct via greedyNetting on real balances:)
  const greedyPlan = greedyNettingFromBalances(net);
  // a hand exact plan for [-2,4,-5,2,1] => P0:-2 P1:+4 P2:-5 P3:+2 P4:+1
  const exactPlan = [
    { from: "P2", to: "P1", amount: 4 },
    { from: "P0", to: "P3", amount: 2 },
    { from: "P2", to: "P4", amount: 1 },
  ];
  wc.greedy_plan = greedyPlan;
  wc.exact_plan = exactPlan;
  wc.exact_plan_valid = verifyPlan(net, exactPlan);
  wc.greedy_plan_valid = verifyPlan(net, greedyPlan);
}
function greedyNettingFromBalances(net) {
  const parties = Object.keys(net);
  const edges = [];
  // encode balances as edges into a phantom so greedyNetting reproduces them
  // (greedyNetting recomputes balances from edges; we instead call it on a 1-hop encoding)
  for (const p of parties) if (net[p] < 0) edges.push({ from: p, to: "__sink__", amount: -net[p] });
  for (const p of parties) if (net[p] > 0) edges.push({ from: "__sink__", to: p, amount: net[p] });
  const ps = [...parties, "__sink__"];
  return greedyNetting(ps, edges).filter((t) => t.from !== "__sink__" && t.to !== "__sink__");
}
out.worst_case = wc;
log("\nOPTIMALITY worst-case (greedy > exact):", JSON.stringify({ balances: wc.balances, greedy: wc.greedy, exact: wc.exact }));
log("  greedy plan:", wc.greedy_plan.map((t) => `${t.from}->${t.to}:${t.amount}`).join(" "), "valid=", wc.greedy_plan_valid);
log("  exact  plan:", wc.exact_plan.map((t) => `${t.from}->${t.to}:${t.amount}`).join(" "), "valid=", wc.exact_plan_valid);

/* 8 — MULTI-CURRENCY: net per-currency independently (no FX inference) */
const mcEdges = [
  { from: "A", to: "B", amount: 30000, currency: "SAR" },
  { from: "B", to: "A", amount: 20000, currency: "SAR" },
  { from: "A", to: "C", amount: 10000, currency: "USD" },
];
const byCur = {};
for (const e of mcEdges) (byCur[e.currency] ??= []).push(e);
out.multi_currency = Object.fromEntries(Object.entries(byCur).map(([cur, es]) => {
  const ps = [...new Set(es.flatMap((e) => [e.from, e.to]))];
  return [cur, greedyNetting(ps, es)];
}));
log("\nMULTI-CURRENCY (independent per currency):", JSON.stringify(out.multi_currency));

/* 9 — TRUST SIGNAL for the 5 personas (windowed, decayed, deterministic) */
// each persona's OWN matured-obligation history [{t:"YYYY-MM", kept}]
const HIST = {
  "نورة": gen(12, 12, "2024-08"),        // 12/12 kept
  "سارة": gen(19, 18, "2024-06"),        // 18/19 kept (1 late)
  "خالد": gen(8, 7, "2024-09"),          // 7/8 kept
  "ليلى": gen(23, 22, "2023-12"),        // 22/23 kept (older history -> decayed)
  "فهد": gen(6, 5, "2025-02"),           // 5/6 kept, fewer events
};
function gen(total, kept, startISO) {
  // spread `total` monthly events from startISO; first (total-kept) are missed
  const [y, m] = startISO.split("-").map(Number);
  const evs = [];
  for (let i = 0; i < total; i++) {
    const mm = ((m - 1 + i) % 12) + 1, yy = y + Math.floor((m - 1 + i) / 12);
    evs.push({ t: `${yy}-${String(mm).padStart(2, "0")}`, kept: i >= (total - kept) });
  }
  return evs;
}
// current open-overdue state (separate from history): خالد currently owes a past-due vow
const OPEN_OVERDUE = { "خالد": true };
out.trust = Object.fromEntries(Object.entries(HIST).map(([p, evs]) =>
  [p, trustSignal(evs, { openOverdue: !!OPEN_OVERDUE[p] })]));
// standalone band demonstrations (one clean example per band)
out.trust_bands = {
  new: trustSignal(gen(2, 2, "2026-04")),                         // count<3
  kept: trustSignal(gen(10, 10, "2025-02")),                      // ratio 100%
  mixed: trustSignal(gen(10, 7, "2025-02")),                      // 0.6<=ratio<0.85
  overdue_chronic: trustSignal(gen(10, 4, "2025-02")),            // ratio<0.6
  overdue_open: trustSignal(gen(10, 10, "2025-02"), { openOverdue: true }),
};
out.trust_config = TRUST;
log("\nTRUST SIGNAL (AS_OF " + TRUST.AS_OF + ", window " + TRUST.WINDOW_MONTHS + "m, half-life " + TRUST.HALF_LIFE_MONTHS + "m):");
for (const [p, sig] of Object.entries(out.trust))
  log(`  ${p}: band=${sig.band} ratio=${sig.ratio_pct}% count(window)=${sig.window_count}`);

/* ---- emit ---- */
if (process.argv.includes("--json")) process.stdout.write(JSON.stringify(out, null, 2));
else log("\n(run with --json for the machine-readable dump)");
export default out;
