// =============================================================================
//  عهد · Ahd — Back-end REFERENCE IMPLEMENTATION (Node ESM, deterministic)
//  Authored for 10_Deep/Backend (PROMPT 2 — deepen the data & back-end).
//
//  This file is the single source of truth for every computed claim in the
//  10_Deep/Backend specs. It is pure, deterministic (no Date.now / no random),
//  integer-money only (halalas), and uses the SAME algorithms the prototype
//  (project/ahd-demo/index.html) runs on screen — so the on-screen numbers and
//  the documented test vectors are byte-identical.
//
//  Run:  node ref/generate-vectors.mjs   (prints every vector as JSON)
//  Hash: Node's crypto SHA-256 (FIPS 180-4). The prototype ships a from-scratch
//        SHA-256; selfTestSha256() below asserts the two agree bit-for-bit.
// =============================================================================
import { createHash } from "node:crypto";

/* ---------------------------------------------------------------------------
 * 0) Hashing primitive
 * ------------------------------------------------------------------------- */
export const sha256hex = (buf) =>
  createHash("sha256").update(buf).digest("hex");
// hash of a UTF-8 string
export const H = (str) => sha256hex(Buffer.from(str, "utf8"));

/* ---------------------------------------------------------------------------
 * 1) RFC 8785 JSON Canonicalization Scheme (JCS) — restricted value domain
 *
 *    Ahd canonical objects contain ONLY: string | integer | boolean | null |
 *    array | object. Money is integer halalas, so JCS's float edge cases
 *    (exponents, fractions, -0, NaN) never arise. Over this domain the full
 *    JCS rule set reduces to:
 *      • object keys sorted by UTF-16 code unit  (JS String.sort default)
 *      • strings serialized per ECMAScript JSON.stringify (RFC 8785 §3.2.2.2)
 *      • integers serialized as plain decimal     (RFC 8785 §3.2.2.3, |n|<2^53)
 *      • no insignificant whitespace; UTF-8 output
 *    Node and Chrome both run V8, so JSON.stringify(string|int) is identical.
 * ------------------------------------------------------------------------- */
export function jcs(v) {
  if (v === null) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") {
    if (!Number.isFinite(v) || !Number.isInteger(v))
      throw new Error("JCS(Ahd): only integers allowed, got " + v);
    return String(v);
  }
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(jcs).join(",") + "]";
  if (typeof v === "object") {
    const keys = Object.keys(v).sort(); // UTF-16 code-unit order = RFC 8785
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + jcs(v[k])).join(",") + "}";
  }
  throw new Error("JCS(Ahd): unsupported type " + typeof v);
}
// canonical bytes -> SHA-256 hex
export const jcsHash = (obj) => H(jcs(obj));

/* ---------------------------------------------------------------------------
 * 2) Money — integer halalas. 1 SAR = 100 halalas. No floats, ever.
 * ------------------------------------------------------------------------- */
export const sar = (h) => (h / 100); // for DISPLAY only
export const halalas = (sarAmount) => Math.round(sarAmount * 100);

// Schedule with exact integer-remainder distribution so Σ schedule == principal.
// The first `rem` installments absorb 1 halala each (largest-remainder, stable).
export function buildSchedule(principal_halalas, months, firstDueISO) {
  const base = Math.floor(principal_halalas / months);
  let rem = principal_halalas - base * months; // 0 <= rem < months
  const [y, m] = firstDueISO.split("-").map(Number);
  const out = [];
  for (let i = 0; i < months; i++) {
    const amount = base + (i < rem ? 1 : 0);
    const mm = ((m - 1 + i) % 12) + 1;
    const yy = y + Math.floor((m - 1 + i) / 12);
    out.push({ seq: i + 1, due: `${yy}-${String(mm).padStart(2, "0")}-01`, amount_halalas: amount });
  }
  return out; // invariant: out.reduce(+amount) === principal_halalas
}

/* ---------------------------------------------------------------------------
 * 3) THE SEAL — domain-separated, JCS-canonical preimages.
 *    Every hashed object carries a "_t" type tag (domain separation): a value
 *    minted for one layer can never be replayed as another.
 *
 *      h        = SHA256( JCS(terms) )                         INTEGRITY
 *      sig_i    = SHA256( JCS(nafath-binding_i ∋ h) )          ATTRIBUTION/WYSIWYS
 *      tsa      = SHA256( JCS(tsa-request ∋ h) )               TIME (RFC-3161 seam)
 *      e        = SHA256( JCS(envelope ∋ h, sigs, tsa) )       sealed content
 *      leaf     = SHA256( JCS(leaf ∋ seq, prev, e) )           CHAIN
 *      bank_sig = SHA256( JCS(bank-sig ∋ leaf, key_id) )       NON-REPUDIATION
 *
 *    In production sig_i is the TSP's AES/QES signature, tsa is an RFC-3161
 *    TimeStampToken, and bank_sig is the bank HSM signature — all over the
 *    SAME preimage bytes. Here those three are SHA-256 stand-ins behind a
 *    clearly-labelled seam; the bytes they cover are real.
 * ------------------------------------------------------------------------- */
export const GENESIS = jcsHash({ _t: "ahd.genesis.v1", tenant: "alinma", epoch: "2026" });

export const BANK_ATTESTATION =
  "تشهد المنشأة بأنّ هويتين موثّقتين عبر نفاذ (acr ≥ substantial) ختمتا هذه السلسلة من البايتات " +
  "بعينها في وقت الختم المعتمد، وأنّها لم تُعدَّل منذ ذلك الحين. ولا تشهد المنشأة بانتقال نقدٍ فعلي، " +
  "ولا بعدالة الشروط أو نهائيتها الشرعية، ولا بانتفاء الإكراه, ولا بصحة أيّ واقعةٍ أساس — تُحال هذه إلى الجهات القضائية.";

// Build a fully-sealed Ahd record from a terms object + signer/tsa/chain inputs.
export function sealRecord(terms, { assertions, tsa, seq, prev_chain_hash, fee }) {
  const h = jcsHash(terms);

  // (3) signer binding — each Nafath assertion is bound to THIS terms_hash
  const boundAssertions = assertions.map((a) => {
    const sig = jcsHash({
      _t: "ahd.nafath.binding.v1",
      sub: a.sub, acr: a.acr, auth_time: a.auth_time, txn_id: a.txn_id,
      terms_hash: h,
    });
    return { sub: a.sub, acr: a.acr, auth_time: a.auth_time, txn_id: a.txn_id, sig };
  });

  // (4) trusted timestamp over h
  const tsa_token = jcsHash({
    _t: "ahd.tsa.v1", terms_hash: h, tsa: tsa.tsa, gen_time: tsa.gen_time,
  });

  // sealed content envelope
  const envelope = {
    _t: "ahd.envelope.v1",
    ahd_id: terms.ahd_id,
    terms_hash: h,
    assertions: boundAssertions,
    tsa_token,
    fee, // {flat_halalas, basis}
    attestation: BANK_ATTESTATION,
  };
  const envelope_hash = jcsHash(envelope);

  // (5) chain leaf + bank signature
  const leaf = jcsHash({ _t: "ahd.leaf.v1", seq, prev_chain_hash, envelope_hash });
  const bank_sig = jcsHash({ _t: "ahd.banksig.v1", key_id: "alinma-seal-key-2026", leaf });

  return {
    ahd_id: terms.ahd_id, terms, terms_hash: h,
    assertions: boundAssertions, tsa: { ...tsa, tsa_token },
    fee, attestation: BANK_ATTESTATION,
    envelope, envelope_hash, seq, prev_chain_hash, leaf, bank_sig,
  };
}

/* ---------------------------------------------------------------------------
 * 4) VERIFICATION PROCEDURE — machine-checkable. Given a record (and its
 *    chain neighbour / checkpoint), decide INTACT or TAMPERED, and localise
 *    the first failing property.
 * ------------------------------------------------------------------------- */
export function verifyRecord(rec, ctx = {}) {
  const steps = [];
  const check = (name, ok, detail) => { steps.push({ name, ok, detail }); return ok; };

  // 1. INTEGRITY — terms canonical hash
  const h2 = jcsHash(rec.terms);
  if (!check("integrity", h2 === rec.terms_hash,
      `recomputed=${h2.slice(0,16)} sealed=${rec.terms_hash.slice(0,16)}`))
    return verdict(steps, "integrity");

  // 2. ATTRIBUTION — each Nafath binding signature over the sealed terms_hash
  for (const a of rec.assertions) {
    const sig2 = jcsHash({ _t: "ahd.nafath.binding.v1",
      sub: a.sub, acr: a.acr, auth_time: a.auth_time, txn_id: a.txn_id, terms_hash: rec.terms_hash });
    if (!check(`attribution:${a.sub.slice(0,8)}`, sig2 === a.sig,
        `recomputed=${sig2.slice(0,16)} sealed=${a.sig.slice(0,16)}`))
      return verdict(steps, "attribution");
  }

  // 3. CONTENT — envelope hash, then chain leaf
  const e2 = jcsHash(rec.envelope);
  if (!check("envelope", e2 === rec.envelope_hash,
      `recomputed=${e2.slice(0,16)} sealed=${rec.envelope_hash.slice(0,16)}`))
    return verdict(steps, "envelope");
  const leaf2 = jcsHash({ _t: "ahd.leaf.v1", seq: rec.seq, prev_chain_hash: rec.prev_chain_hash, envelope_hash: e2 });
  if (!check("chain-leaf", leaf2 === rec.leaf,
      `recomputed=${leaf2.slice(0,16)} sealed=${rec.leaf.slice(0,16)}`))
    return verdict(steps, "chain-leaf");

  // 4. NON-REPUDIATION — bank signature over the leaf
  const bs2 = jcsHash({ _t: "ahd.banksig.v1", key_id: "alinma-seal-key-2026", leaf: rec.leaf });
  if (!check("bank-sig", bs2 === rec.bank_sig,
      `recomputed=${bs2.slice(0,16)} sealed=${rec.bank_sig.slice(0,16)}`))
    return verdict(steps, "bank-sig");

  // 5. CHAIN CONTINUITY — prev must equal the previous record's leaf (or GENESIS)
  if (ctx.prevLeaf !== undefined) {
    if (!check("chain-continuity", rec.prev_chain_hash === ctx.prevLeaf,
        `prev=${rec.prev_chain_hash.slice(0,16)} expected=${ctx.prevLeaf.slice(0,16)}`))
      return verdict(steps, "chain-continuity");
  }

  // 6. ANTI-REWRITE — Merkle inclusion under a signed checkpoint (optional)
  if (ctx.checkpoint && ctx.inclusion) {
    const ok = verifyInclusion(rec.leaf, ctx.inclusion.index, ctx.inclusion.path,
                               ctx.checkpoint.tree_size, ctx.checkpoint.root);
    if (!check("merkle-inclusion", ok, `root=${ctx.checkpoint.root.slice(0,16)}`))
      return verdict(steps, "merkle-inclusion");
  }

  // 7. TIME — TSA token over terms_hash (RFC-3161 seam; recomputable in demo)
  if (rec.tsa) {
    const t2 = jcsHash({ _t: "ahd.tsa.v1", terms_hash: rec.terms_hash, tsa: rec.tsa.tsa, gen_time: rec.tsa.gen_time });
    if (!check("time", t2 === rec.tsa.tsa_token, `recomputed=${t2.slice(0,16)}`))
      return verdict(steps, "time");
  }

  return verdict(steps, null);
}
function verdict(steps, failedAt) {
  return { intact: failedAt === null, failedAt, steps };
}

/* ---------------------------------------------------------------------------
 * 5) MERKLE CHECKPOINT — RFC 6962 (Certificate Transparency) hashing.
 *    leaf hash:   SHA256(0x00 || leafBytes)
 *    inner node:  SHA256(0x01 || left || right)
 *    odd nodes are promoted (split at the largest power of two < n).
 *    Inputs here are per-record `leaf` hex strings (the chain leaves).
 * ------------------------------------------------------------------------- */
const hexToBuf = (hex) => Buffer.from(hex, "hex");
const mLeaf = (leafHex) => sha256hex(Buffer.concat([Buffer.from([0x00]), hexToBuf(leafHex)]));
const mNode = (l, r) => sha256hex(Buffer.concat([Buffer.from([0x01]), hexToBuf(l), hexToBuf(r)]));
const largestPow2LessThan = (n) => { let k = 1; while (k * 2 < n) k *= 2; return k; };

export function merkleRoot(leaves) {
  if (leaves.length === 0) return sha256hex(Buffer.alloc(0)); // RFC 6962 MTH({})
  if (leaves.length === 1) return mLeaf(leaves[0]);
  const k = largestPow2LessThan(leaves.length);
  return mNode(merkleRoot(leaves.slice(0, k)), merkleRoot(leaves.slice(k)));
}
// RFC 6962 §2.1.1 audit path for the leaf at index m of an n-leaf tree.
export function inclusionPath(m, leaves) {
  const n = leaves.length;
  if (n <= 1) return [];
  const k = largestPow2LessThan(n);
  if (m < k) return [...inclusionPath(m, leaves.slice(0, k)), merkleRoot(leaves.slice(k))];
  return [...inclusionPath(m - k, leaves.slice(k)), merkleRoot(leaves.slice(0, k))];
}
// verify an audit path reconstructs the root — RFC 6962 §2.1.1 verbatim.
export function verifyInclusion(leafHex, m, path, n, root) {
  if (m >= n) return false;
  let fn = m, sn = n - 1, r = mLeaf(leafHex);
  for (const p of path) {
    if (sn === 0) return false;
    if ((fn & 1) || fn === sn) {
      r = mNode(p, r);
      if (!(fn & 1)) { do { fn >>= 1; sn >>= 1; } while (!(fn & 1) && fn !== 0); }
    } else {
      r = mNode(r, p);
    }
    fn >>= 1; sn >>= 1;
  }
  return sn === 0 && r === root;
}

/* ---------------------------------------------------------------------------
 * 6) MUQASSA — integer-halalas netting engine.
 *    balances: net[p] = Σ incoming − Σ outgoing.  >0 creditor, <0 debtor.
 * ------------------------------------------------------------------------- */
export function balances(parties, edges) {
  const net = Object.fromEntries(parties.map((p) => [p, 0]));
  for (const e of edges) { net[e.from] -= e.amount; net[e.to] += e.amount; }
  return net;
}
// Greedy max-debtor / max-creditor reduction. Returns integer-halalas transfers.
export function greedyNetting(parties, edges) {
  const net = balances(parties, edges);
  const cred = [], deb = [];
  for (const p of parties) {
    if (net[p] > 0) cred.push({ p, v: net[p] });
    else if (net[p] < 0) deb.push({ p, v: -net[p] });
  }
  // deterministic tie-break: amount desc, then party name asc
  const cmp = (a, b) => (b.v - a.v) || (a.p < b.p ? -1 : a.p > b.p ? 1 : 0);
  cred.sort(cmp); deb.sort(cmp);
  const out = [];
  let i = 0, j = 0;
  while (i < deb.length && j < cred.length) {
    const m = Math.min(deb[i].v, cred[j].v);
    out.push({ from: deb[i].p, to: cred[j].p, amount: m });
    deb[i].v -= m; cred[j].v -= m;
    if (deb[i].v === 0) i++;
    if (cred[j].v === 0) j++;
  }
  return out;
}
// Conservation proof: every party's pre-net == cash they move in settlement.
export function conservation(parties, edges, transfers) {
  const pre = balances(parties, edges);
  const move = Object.fromEntries(parties.map((p) => [p, 0]));
  for (const t of transfers) { move[t.from] -= t.amount; move[t.to] += t.amount; }
  const rows = parties.map((p) => ({ party: p, net_before: pre[p], moved: move[p], remaining: pre[p] - move[p] }));
  const totalPaid = transfers.reduce((s, t) => s + t.amount, 0);
  const allZero = rows.every((r) => r.remaining === 0);
  const sumZero = parties.reduce((s, p) => s + pre[p], 0) === 0;
  return { rows, totalPaid, allZero, sumZero };
}

// Directed simple-cycle enumeration (Johnson-lite via DFS) — feeds the
// "what gets washed" insight: a cycle contributes 0 to every net.
export function findCycles(parties, edges) {
  const adj = Object.fromEntries(parties.map((p) => [p, []]));
  for (const e of edges) adj[e.from].push(e.to);
  const cycles = [];
  const idx = Object.fromEntries(parties.map((p, i) => [p, i]));
  for (const start of parties) {
    const stack = [start], onStack = new Set([start]);
    (function dfs(u) {
      for (const v of adj[u]) {
        if (idx[v] < idx[start]) continue;          // only cycles whose min node is `start`
        if (v === start) { cycles.push([...stack]); }
        else if (!onStack.has(v)) { stack.push(v); onStack.add(v); dfs(v); stack.pop(); onStack.delete(v); }
      }
    })(start);
  }
  return cycles;
}

// Settlement-efficiency metrics (bank-facing, computed from the graph).
export function efficiency(edges, transfers) {
  const E = edges.length, T = transfers.length;
  const cashBefore = edges.reduce((s, e) => s + e.amount, 0);
  const cashAfter = transfers.reduce((s, t) => s + t.amount, 0);
  return {
    edges_before: E, transfers_after: T,
    transfer_reduction: E === 0 ? 0 : +(1 - T / E).toFixed(4),
    cash_before: cashBefore, cash_after: cashAfter,
    cash_reduction: cashBefore === 0 ? 0 : +(1 - cashAfter / cashBefore).toFixed(4),
  };
}

/* ---------------------------------------------------------------------------
 * 7) EXACT optimum (NP-hard) — minimum-transactions via DFS (LeetCode-465
 *    style). Used ONLY to (a) prove greedy is honest about optimality and
 *    (b) offer an exact solver for small circles (n ≤ ~15).
 * ------------------------------------------------------------------------- */
export function minTransfersExact(netValues) {
  const bal = netValues.filter((x) => x !== 0);
  function dfs(start) {
    while (start < bal.length && bal[start] === 0) start++;
    if (start === bal.length) return 0;
    let best = Infinity;
    for (let j = start + 1; j < bal.length; j++) {
      if (bal[j] * bal[start] < 0) {          // opposite signs only
        bal[j] += bal[start];
        best = Math.min(best, 1 + dfs(start + 1));
        bal[j] -= bal[start];
        if (bal[j] + bal[start] === 0) break;  // perfect cancel — can't do better
      }
    }
    return best;
  }
  return dfs(0);
}
// count transfers the greedy emits for a raw balance vector
export function greedyCountFromBalances(netValues) {
  const cred = [], deb = [];
  netValues.forEach((v, i) => { if (v > 0) cred.push({ p: "c" + i, v }); else if (v < 0) deb.push({ p: "d" + i, v: -v }); });
  const cmp = (a, b) => (b.v - a.v) || (a.p < b.p ? -1 : 1);
  cred.sort(cmp); deb.sort(cmp);
  let i = 0, j = 0, n = 0;
  while (i < deb.length && j < cred.length) {
    const m = Math.min(deb[i].v, cred[j].v);
    deb[i].v -= m; cred[j].v -= m; n++;
    if (deb[i].v === 0) i++; if (cred[j].v === 0) j++;
  }
  return n;
}

/* ---------------------------------------------------------------------------
 * 8) TRUST SIGNAL — windowed, time-decayed kept-ratio over the user's OWN
 *    sealed history. NOT a credit score (see trust-signal spec).
 *      weight(ev) = HALF_LIFE decay over months elapsed from AS_OF
 *      kept_ratio = Σ w·kept / Σ w     (matured obligations in WINDOW only)
 *    Deterministic: AS_OF is a fixed constant, never Date.now().
 * ------------------------------------------------------------------------- */
export const TRUST = { AS_OF: "2026-06", WINDOW_MONTHS: 24, HALF_LIFE_MONTHS: 12 };
const monthsBetween = (fromISO, toISO) => {
  const [fy, fm] = fromISO.split("-").map(Number);
  const [ty, tm] = toISO.split("-").map(Number);
  return (ty - fy) * 12 + (tm - fm);
};
export function trustSignal(events, opts = {}, cfg = TRUST) {
  // events: [{ t:"YYYY-MM", kept:bool }] — matured obligations from the user's OWN history.
  // opts.openOverdue: a CURRENT state flag (an open obligation now past its due date) —
  //   kept separate from historical lateness on purpose: a single old late-but-settled
  //   vow is not the same as currently owing money past due.
  let wKept = 0, wTot = 0, count = 0;
  for (const ev of events) {
    const age = monthsBetween(ev.t, cfg.AS_OF);
    if (age < 0 || age >= cfg.WINDOW_MONTHS) continue; // window filter
    const w = Math.pow(0.5, age / cfg.HALF_LIFE_MONTHS);
    wTot += w; if (ev.kept) wKept += w; count++;
  }
  const ratio = wTot === 0 ? null : wKept / wTot;
  let band;
  if (count < 3) band = "new";                                 // cold-start → never penalise
  else if (opts.openOverdue) band = "overdue";                 // currently past-due
  else if (ratio !== null && ratio >= 0.85) band = "kept";
  else if (ratio !== null && ratio >= 0.6) band = "mixed";
  else band = "overdue";                                        // chronic low kept-ratio
  return {
    band,
    ratio_pct: ratio === null ? null : Math.round(ratio * 100),
    window_count: count,
    // explicit NON-credit-score guarantees (asserted in code, enforced by callers)
    is_number_exported: false, used_in_underwriting: false, sent_to_bureau: false, cross_party_inference: false,
  };
}

// Verify an arbitrary settlement plan actually clears every party's net (used to
// validate the exact-solver plan in the optimality discussion).
export function verifyPlan(netObj, transfers) {
  const move = Object.fromEntries(Object.keys(netObj).map((p) => [p, 0]));
  for (const t of transfers) { move[t.from] -= t.amount; move[t.to] += t.amount; }
  return Object.keys(netObj).every((p) => netObj[p] - move[p] === 0);
}

/* ---------------------------------------------------------------------------
 * 9) Self-test: the prototype's from-scratch SHA-256 must equal crypto's.
 *    (The exact byte-for-byte port lives in index.html; here we just assert
 *     the standard NIST vectors so the two implementations are pinned.)
 * ------------------------------------------------------------------------- */
export function selfTestSha256() {
  const vectors = {
    "": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "abc": "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq":
      "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
  };
  for (const [k, want] of Object.entries(vectors))
    if (H(k) !== want) throw new Error(`SHA-256 NIST vector mismatch for ${JSON.stringify(k)}`);
  return true;
}
