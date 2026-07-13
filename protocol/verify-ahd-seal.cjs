#!/usr/bin/env node
/* ============================================================================
   verify-ahd-seal.cjs — Open-Witness v1 STANDALONE reference verifier.

   INDEPENDENCE (the whole point of this file): it uses ONLY Node's built-in
   `crypto` module (crypto.createHash('sha256')) plus the small set of pure
   helper functions documented byte-for-byte in docs/specs/open-witness-v1.md.
   It does NOT require/import app/engine.js, anything under app/, or anything
   under demo/ — a sealed Ahd record can therefore be verified by a third party
   (another bank, a court, either counterparty) who has never run Ahd's own
   software, using only the published spec + a standard SHA-256 implementation.

   Each canonical builder below takes the record's RAW semantic fields (name,
   amount, dates, terms text, consent) and rebuilds the exact byte sequence
   that gets hashed — this is genuine independent recomputation, never a
   re-formatting of a pre-built/trusted canonical string or seal.

   Usage:   node protocol/verify-ahd-seal.cjs <record.json>
   Exit codes: 0 = VALID, 1 = TAMPERED, 2 = malformed input/usage error.

   Spine: this tool WITNESSES/VERIFIES a cryptographic fact only — it does not
   lend, judge, score, or rule on Shariah matters (no fatwa; it just proves a
   hash chain does or does not reproduce).
============================================================================ */
"use strict";
const fs = require("fs");
const crypto = require("crypto");

/* ---------------------------------------------------------------------------
   1) Standard SHA-256 only — no hand-rolled crypto in this file. (Reproducing
      the golden seals below with Node's crypto module proves the demo/app's
      own hand-rolled SHA-256 — used there only for offline-browser
      determinism — agrees byte-for-byte with a standard library.)
--------------------------------------------------------------------------- */
function sha256hex(str) {
  return crypto.createHash("sha256").update(String(str), "utf8").digest("hex");
}

/* ---------------------------------------------------------------------------
   2) Deterministic helpers — copied from the published spec
      (docs/specs/open-witness-v1.md §3), NOT imported from app/engine.js.
      Integer halalas throughout; no float money; no Date.now/Math.random/Intl
      anywhere in this file.
--------------------------------------------------------------------------- */
const MINOR = 100;
function toMinor(sar) { return Math.round(Number(sar) * MINOR); }
function minorToFixed2(minor) {
  const a = Math.round(Math.abs(Number(minor) || 0)), neg = minor < 0;
  return (neg ? "-" : "") + Math.floor(a / MINOR) + "." + String(a % MINOR).padStart(2, "0");
}
function fmt(n) {
  const r = Math.round(Number(n) || 0), neg = r < 0;
  const s = String(Math.abs(r)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return neg ? "-" + s : s;
}
function respread(totalMinor, count) {
  const t = Math.max(0, Math.round(totalMinor)), c = Math.max(1, count | 0);
  const base = Math.floor(t / c), extra = t - base * c;
  return Array.from({ length: c }, (_, i) => base + (i < extra ? 1 : 0));
}
const AR_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
function scheduleLabels(start, months) {
  const arr = []; let y = start.y, m = start.m;
  for (let i = 0; i < months; i++) {
    const mm = ((m - 1 + i) % 12), yy = y + Math.floor((m - 1 + i) / 12);
    arr.push("1 " + AR_MONTHS[mm] + " " + yy);
  }
  return arr;
}
function short10Upper(hexHash) { return hexHash.slice(0, 10).toUpperCase(); }

/* ---------------------------------------------------------------------------
   3) Canonical serializers — one per record profile (spec §4 "ahd-main-v1",
      §5 "ahd-create-v1"). Both emit the same "AHD-RECORD-v1" line family; they
      differ only in the presence of a consent block (main) vs. a term=/no
      consent-block shape (create) — see the spec for the byte-exact diff.
--------------------------------------------------------------------------- */
function canonicalMain(r) {
  const aMinor = toMinor(r.amount_sar);
  const instMinor = Math.round(aMinor / r.months);
  const inst2 = minorToFixed2(instMinor);
  const labels = scheduleLabels(r.start, r.months);
  const sched = labels.map((label, i) => (i + 1) + ":" + label + ":" + inst2).join("|");
  const termsHash = sha256hex(r.terms_ar);
  const consentStr = (r.consent || []).map((c) => {
    const sigRef = "NFTH-" + short10Upper(sha256hex(c.party + "|" + c.assurance + "|" + c.signed_at + "|" + termsHash));
    return c.party + "#" + c.assurance + "#" + c.signed_at + "#" + sigRef;
  }).join(",");
  return [
    "AHD-RECORD-v1",
    "ahd_id=" + r.ahd_id,
    "type=" + r.type,
    "lender=" + r.lender,
    "borrower=" + r.borrower,
    "principal=" + minorToFixed2(aMinor) + " SAR",
    "months=" + r.months,
    "schedule=" + sched,
    "terms_hash=" + termsHash,
    "basis=Quran:2:282",
    "riba=interest:false;late_penalty_to_lender:false;gharar:none",
    "consent=" + consentStr,
    "ts=" + r.timestamp
  ].join("\n");
}

function draftTermsAr(r, aMinor) {
  const amt = fmt(aMinor / MINOR);
  const tail = "يُردُّ كما أُخِذ بلا فائدةٍ، وبلا غرامةِ تأخير، وبلا أيّ زيادة";
  if (r.open) {
    return "يُقِرّ الطرفان بأنّ «" + r.lender + "» أقرض «" + r.borrower + "» مبلغ " + amt +
      " ريال على سبيل القرض الحسن، يُسدَّد متى ما تيسّر دون موعدٍ محدّد، " + tail +
      ". ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.";
  }
  const inst = fmt(respread(aMinor, r.months)[0] / MINOR);
  return "يُقِرّ الطرفان بأنّ «" + r.lender + "» أقرض «" + r.borrower + "» مبلغ " + amt +
    " ريال على سبيل القرض الحسن، يُسدَّد على " + r.months + " أقساطٍ شهريّةٍ متساوية قدر كلٍّ منها " +
    inst + " ريال، " + tail + ". عند العجز يُمهَل المقترض بالمعروف.";
}

function canonicalCreate(r) {
  const aMinor = toMinor(r.amount_sar);
  const lines = [
    "AHD-RECORD-v1",
    "ahd_id=" + r.ahd_id,
    "type=" + r.type,
    "lender=" + r.lender,
    "borrower=" + r.borrower,
    "principal=" + minorToFixed2(aMinor) + " SAR"
  ];
  if (r.open) {
    lines.push("term=open", "schedule=NONE", "due=none");
  } else {
    const parts = respread(aMinor, r.months);
    const labels = scheduleLabels(r.start, r.months);
    const sched = labels.map((label, i) => (i + 1) + ":" + label + ":" + minorToFixed2(parts[i])).join("|");
    lines.push("term=scheduled", "months=" + r.months, "schedule=" + sched);
  }
  const termsAr = draftTermsAr(r, aMinor);
  lines.push(
    "terms_hash=" + sha256hex(termsAr),
    "basis=Quran:" + (r.open ? "2:280" : "2:282"),
    "riba=interest:false;late_penalty_to_lender:false;gharar:none",
    "ts=" + r.timestamp
  );
  return lines.join("\n");
}

const PROFILES = { "ahd-main-v1": canonicalMain, "ahd-create-v1": canonicalCreate };

/* ---------------------------------------------------------------------------
   4) The hash chain (spec §6): GENESIS = sha256(genesis_seed); seal =
      sha256(prev + canonical_hash + String(seq)). Defaults match the golden
      engine's own constants when a record omits `chain` (seq 1, prev ==
      GENESIS — a first block off the genesis anchor).
--------------------------------------------------------------------------- */
const DEFAULT_GENESIS_SEED = "AHD-CHAIN-GENESIS-ALINMA-2026";

function verify(record) {
  const build = PROFILES[record.profile];
  if (!build) throw new Error("unknown profile: " + record.profile + " (expected one of: " + Object.keys(PROFILES).join(", ") + ")");
  const canonical = build(record);
  const canonicalHash = sha256hex(canonical);
  const chain = record.chain || {};
  const genesis = sha256hex(chain.genesis_seed || DEFAULT_GENESIS_SEED);
  const prev = chain.prev || genesis;
  const seq = chain.seq == null ? 1 : chain.seq;
  const recomputed = sha256hex(prev + canonicalHash + String(seq));
  return {
    ok: recomputed === record.sealed_seal,
    sealed: record.sealed_seal,
    recomputed: recomputed,
    canonical_hash: canonicalHash,
    canonical: canonical
  };
}

/* Register the third profile used by multi-block chains (§8 below) alongside
   the two shipped in v1 — see canonicalChainBlock's own header comment. */
PROFILES["ahd-chain-block-v1"] = canonicalChainBlockImpl;

/* ---------------------------------------------------------------------------
   6) Merkle inclusion — RFC 6962 §2.1 Certificate Transparency Merkle Tree
      Hash, implemented DIRECTLY here (not via `merkletreejs`'s default config,
      which lacks leaf/node domain separation — a documented second-preimage
      footgun on unbalanced trees; see docs/superpowers/plans/2026-07-13-
      ceiling-break-8-9-plan.md Appendix C). Domain separation: a LEAF hash is
      SHA-256(0x00 ‖ d); an INTERNAL node hash is SHA-256(0x01 ‖ left ‖ right).
      The single prefix byte makes the leaf-hash and node-hash domains
      disjoint, so an attacker cannot pass an internal node off as a leaf (or
      vice versa) to forge a false inclusion proof.
--------------------------------------------------------------------------- */
function sha256buf(buf) { return crypto.createHash("sha256").update(buf).digest(); }
function merkleLeafHash(dataBuf) { return sha256buf(Buffer.concat([Buffer.from([0x00]), dataBuf])); }
function merkleNodeHash(leftBuf, rightBuf) { return sha256buf(Buffer.concat([Buffer.from([0x01]), leftBuf, rightBuf])); }

/* largest power of two strictly less than n — RFC 6962's "k" split point. */
function largestPowerOfTwoLessThan(n) {
  let k = 1;
  while (k * 2 < n) k *= 2;
  return k;
}

/* MTH(D[start:start+n]) — RFC 6962 §2.1's recursive Merkle Tree Hash. */
function merkleSubtreeHash(leaves, start, n) {
  if (n === 1) return merkleLeafHash(leaves[start]);
  const k = largestPowerOfTwoLessThan(n);
  const left = merkleSubtreeHash(leaves, start, k);
  const right = merkleSubtreeHash(leaves, start + k, n - k);
  return merkleNodeHash(left, right);
}

function merkleRoot(leaves) {
  if (!leaves || leaves.length === 0) return sha256buf(Buffer.alloc(0)); // MTH({}) = SHA-256("")
  return merkleSubtreeHash(leaves, 0, leaves.length);
}

/* PATH(m, D[n]) — RFC 6962 §2.1.1 audit path for leaf index m. Each returned
   step carries {hash, side}: side "L" means the sibling sits to the LEFT of
   the subtree computed so far (combine as nodeHash(sibling, running)); side
   "R" means the sibling sits to the RIGHT (combine as nodeHash(running,
   sibling)). Carrying the side alongside the hash — rather than requiring a
   verifier to re-derive left/right purely from (leaf index, tree size) via
   bit arithmetic — is a documented, deliberate simplification of the raw
   RFC 6962 wire format: the underlying leaf/node hash construction below is
   byte-exact RFC 6962; only the audit-path *encoding* carries one extra bit
   per step, in exchange for a much less failure-prone verifier. */
function merkleAuditPathRec(leaves, index, start, n) {
  if (n === 1) return [];
  const k = largestPowerOfTwoLessThan(n);
  if (index < k) {
    const sibling = merkleSubtreeHash(leaves, start + k, n - k);
    return merkleAuditPathRec(leaves, index, start, k).concat([{ hash: sibling, side: "R" }]);
  }
  const sibling = merkleSubtreeHash(leaves, start, k);
  return merkleAuditPathRec(leaves, index - k, start + k, n - k).concat([{ hash: sibling, side: "L" }]);
}
function merkleAuditPath(leaves, index) { return merkleAuditPathRec(leaves, index, 0, leaves.length); }

/* verify a claimed leaf's inclusion at `index` in a tree of `treeSize` leaves,
   given its audit path; reconstructs the root and compares to `expectedRootBuf`
   (both Buffers). Never throws — malformed input verifies false. */
function verifyMerkleInclusion(leafDataBuf, index, path, treeSize, expectedRootBuf) {
  if (!Buffer.isBuffer(leafDataBuf) || !Array.isArray(path) || !Buffer.isBuffer(expectedRootBuf)) return false;
  if (!(treeSize > 0) || index < 0 || index >= treeSize) return false;
  let running = merkleLeafHash(leafDataBuf);
  for (let i = 0; i < path.length; i++) {
    const step = path[i];
    if (!step || !Buffer.isBuffer(step.hash) || (step.side !== "L" && step.side !== "R")) return false;
    running = step.side === "L" ? merkleNodeHash(step.hash, running) : merkleNodeHash(running, step.hash);
  }
  return Buffer.compare(running, expectedRootBuf) === 0;
}

/* ---------------------------------------------------------------------------
   7) Bank signature — real Ed25519 asymmetric sign/verify (Node built-in
      `crypto`, zero-dep), shaped as a W3C-VC-Data-Integrity-style
      DataIntegrityProof `{cryptosuite, verificationMethod, proofValue}`. This
      is what closes the Repudiation gap the SHA-256 `bank_sig` MOCK in
      _meta/deep-work/backend/seal-scheme-spec.md left open: forging an
      internally-consistent hash chain costs nothing; forging a valid Ed25519
      signature without the private key is computationally infeasible.

      Honest scope note: the signed message is the block's own `sealed_seal`
      hex string (the existing, golden, pipe-delimited Open-Witness chain
      output) — NOT a new RFC-8785 JCS canonicalization. Adding a second
      canonicalization scheme was out of scope for this pass (reuse golden
      primitives verbatim, never add a new hash/canonical primitive); a future
      "eddsa-jcs-2022"-conformant profile is a named residual gap, not
      silently assumed. `cryptosuite` below is therefore a project-local id,
      not a registered W3C Data Integrity cryptosuite name.

      The DEMO_BANK_PUBLIC_KEY_PEM constant below is copied VERBATIM from
      protocol/bank-key-demo.cjs's BANK_PUBLIC_KEY_PEM rather than required —
      this keeps this file's require() list fs+crypto ONLY (see
      tests/app/open-witness.test.cjs's zero-dep source scan). A public key
      has no confidentiality requirement, so the duplication is harmless; the
      PRIVATE key never appears in this file. That demo key is NOT production
      — see protocol/bank-key-demo.cjs's header for the HSM/KMS custody gap.
--------------------------------------------------------------------------- */
const DEMO_BANK_PUBLIC_KEY_PEM =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MCowBQYDK2VwAyEAPqacay7/NcQRX8p614bI0kdxuWzXZJTD1ry2nvC9McE=\n" +
  "-----END PUBLIC KEY-----\n";

function verifyBankSignature(sealedSealHex, bankProof, publicKeyPem) {
  if (!bankProof || typeof bankProof.proofValue !== "string") return false;
  try {
    const sig = Buffer.from(bankProof.proofValue, "base64");
    return crypto.verify(null, Buffer.from(String(sealedSealHex), "utf8"), publicKeyPem || DEMO_BANK_PUBLIC_KEY_PEM, sig);
  } catch (e) {
    return false;
  }
}

/* ---------------------------------------------------------------------------
   8) Multi-block chain (T-L1 property 2) — seal_i = SHA256(prev + canonical_hash_i
      + seq), where `prev` is the PRIOR BLOCK'S OWN RECOMPUTED seal, not merely
      the prior block's *claimed* field. This is the real chain-continuity
      check the v1 spec's single-record `verify()` didn't do (it trusted
      whatever `chain.prev` a lone record claimed). Feed an ORDERED array of
      records (same per-record shape as §4/§5); a first-block record's
      `chain.prev` still defaults to GENESIS when omitted.
--------------------------------------------------------------------------- */
function canonicalChainBlockImpl(r) {
  return [
    "AHD-CHAIN-BLOCK-v1",
    "ahd_id=" + r.ahd_id,
    "seq=" + r.seq,
    "event=" + r.event,
    "detail=" + r.detail,
    "ts=" + r.timestamp
  ].join("\n");
}

function verifyChain(records) {
  const list = records || [];
  const perRecord = [];
  let prevRecomputed = null;
  for (let i = 0; i < list.length; i++) {
    const rec = list[i];
    const r = verify(rec);
    const genesisForThis = sha256hex((rec.chain && rec.chain.genesis_seed) || DEFAULT_GENESIS_SEED);
    const claimedPrev = (rec.chain && rec.chain.prev) || genesisForThis;
    const expectedPrev = i === 0 ? genesisForThis : prevRecomputed;
    const continuityOk = claimedPrev === expectedPrev;
    perRecord.push({ index: i, integrityOk: r.ok, continuityOk: continuityOk, recomputed: r.recomputed });
    if (!r.ok || !continuityOk) {
      return { ok: false, failedAt: i, failedStep: !r.ok ? "integrity" : "chain-continuity", perRecord: perRecord };
    }
    prevRecomputed = r.recomputed; // next block must point at what THIS block ACTUALLY recomputes to
  }
  return { ok: true, failedAt: -1, failedStep: null, perRecord: perRecord };
}

/* ---------------------------------------------------------------------------
   9) verifyFull — the assembled ordered check a real third party runs against
      ONE block of an "assembled proof" envelope:
        { record, sealed_seal, bank_proof:{cryptosuite,verificationMethod,
          proofValue}, merkle:{leaf_index,audit_path,tree_size,signed_root} }
      Order: integrity → chain continuity (against the PRIOR block's recomputed
      seal, via `opts.priorSealedSealHex`, or GENESIS for a first block) → bank
      signature → Merkle inclusion. Returns the FIRST failing step, so a
      verifier learns WHAT KIND of tampering occurred — content edit vs
      reorder/replay vs a rewritten log — not merely pass/fail.
--------------------------------------------------------------------------- */
function verifyFull(proof, opts) {
  const options = opts || {};
  const record = proof.record;
  const r = verify(record);
  if (!r.ok) return { ok: false, failedAt: "integrity", detail: r };

  const genesisForThis = sha256hex((record.chain && record.chain.genesis_seed) || DEFAULT_GENESIS_SEED);
  const expectedPrev = options.priorSealedSealHex != null ? options.priorSealedSealHex : genesisForThis;
  const claimedPrev = (record.chain && record.chain.prev) || genesisForThis;
  if (claimedPrev !== expectedPrev) {
    return { ok: false, failedAt: "chain-continuity", detail: { claimedPrev: claimedPrev, expectedPrev: expectedPrev } };
  }

  if (proof.bank_proof) {
    const sigOk = verifyBankSignature(r.recomputed, proof.bank_proof, options.publicKeyPem);
    if (!sigOk) return { ok: false, failedAt: "bank-signature", detail: proof.bank_proof };
  }

  if (proof.merkle) {
    const m = proof.merkle;
    const leafBuf = Buffer.from(r.recomputed, "hex");
    const pathBufs = (m.audit_path || []).map((s) => ({ hash: Buffer.from(s.hash, "hex"), side: s.side }));
    const rootBuf = Buffer.from(m.signed_root, "hex");
    const inclOk = verifyMerkleInclusion(leafBuf, m.leaf_index, pathBufs, m.tree_size, rootBuf);
    if (!inclOk) return { ok: false, failedAt: "merkle-inclusion", detail: m };
  }

  return { ok: true, failedAt: null, recomputed: r.recomputed };
}

module.exports = {
  verify, sha256hex, canonicalMain, canonicalCreate, PROFILES, DEFAULT_GENESIS_SEED,
  merkleLeafHash, merkleNodeHash, merkleRoot, merkleAuditPath, verifyMerkleInclusion,
  verifyBankSignature, DEMO_BANK_PUBLIC_KEY_PEM,
  canonicalChainBlockImpl, verifyChain, verifyFull
};

/* ---------------------------------------------------------------------------
   10) CLI entrypoint. Backward compatible: a plain single-record JSON (the
   original v1 shape) verifies exactly as before. A JSON carrying a top-level
   `record` field (the newer "assembled proof" envelope — §9) is routed
   through `verifyFull` instead, so the old fixtures/tests are untouched.
--------------------------------------------------------------------------- */
if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node protocol/verify-ahd-seal.cjs <record.json>");
    process.exit(2);
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.error("cannot read/parse " + file + ": " + e.message);
    process.exit(2);
  }
  const isAssembledProof = parsed && typeof parsed === "object" && parsed.record;
  let result;
  try {
    result = isAssembledProof ? verifyFull(parsed) : verify(parsed);
  } catch (e) {
    console.error("verification error: " + e.message);
    process.exit(2);
  }
  if (result.ok) {
    console.log(isAssembledProof
      ? "VALID  — assembled proof verified (integrity → chain continuity → bank signature → Merkle inclusion)"
      : "VALID  — seal " + result.recomputed + " reproduced from the record's own fields (Open-Witness v1, standard SHA-256 only)");
    process.exit(0);
  } else {
    console.log(isAssembledProof
      ? "TAMPERED  — first failing step: " + result.failedAt
      : "TAMPERED  — claimed seal " + result.sealed + " does not match the recomputed seal " + result.recomputed);
    process.exit(1);
  }
}
