#!/usr/bin/env node
/* ============================================================================
   build-chain-fixture.cjs — BUILDS the new additive multi-block-chain +
   Merkle + bank-signature golden vector (T-L1 properties 2, 4, 5).

   This is a BUILDER, not the standalone verifier — it is allowed (and meant)
   to call the GOLDEN engine primitives VERBATIM, exactly like
   app/features/rifq.js and app/features/covenant-log.js already do for their
   own event chains:
       seal_i = engine.sealBlock(prev, engine.sha256(canonical_i), seq_i),
       prev starts at engine.GENESIS.
   No hash/seal primitive is reimplemented here — engine.sha256/sealBlock/
   GENESIS are called directly, unmodified. The per-block canonical text
   builder (`canonicalChainBlockImpl`) is imported from
   protocol/verify-ahd-seal.cjs so the SAME bytes the standalone verifier
   independently reconstructs are the bytes actually hashed here — that
   agreement (checked by tests/app/seal-properties.test.cjs) is what makes the
   pinned vector below a genuine, reproducible golden vector, not a fixture
   that only this file's own logic happens to accept.

   Produces THREE chained blocks (one loan's lifecycle: create → reschedule →
   settle), each wrapped in the "assembled proof" envelope §9 of
   verify-ahd-seal.cjs describes: {record, bank_proof, merkle}. The bank signs
   every block's `sealed_seal` with the FIXED demo Ed25519 key
   (protocol/bank-key-demo.cjs — NOT production; see that file's header). All
   three blocks are Merkle-ized together (RFC 6962, tree_size 3) and every
   block carries its own per-leaf audit path against one published/signed
   root.

   Run directly to (re)generate the pinned fixture:
     node protocol/build-chain-fixture.cjs > protocol/fixtures/chain-3block.json
   (The committed fixture is byte-identical to this script's own output —
   tests/app/seal-properties.test.cjs asserts that determinism.)

   Deterministic: no Date.now/new Date/Math.random/Intl/float anywhere below —
   every timestamp is a fixed string, every amount an integer-halala string.
============================================================================ */
"use strict";
const engine = require("../app/engine.js");
const seal = require("./verify-ahd-seal.cjs");
const bankKey = require("./bank-key-demo.cjs");
const crypto = require("crypto");

const GENESIS_SEED = "AHD-CHAIN-GENESIS-ALINMA-2026";
const AHD_ID = "AHD-CHAIN-DEMO-2026-0001";

/* the three semantic events of one عهد's lifecycle — every field named, no
   derived/inferred content; `detail` is a plain key=value;… descriptive
   string (same convention canonicalMain's `riba=` line and rifq's
   RIFQ-GRACE-v1 use), so nothing about the event is hidden behind an opaque
   hash-only summary. */
const BLOCKS_RAW = [
  {
    seq: 1,
    event: "create",
    detail: "principal=1200.00 SAR;months=6;lender=أنت;borrower=سلطان;basis=Quran:2:282",
    timestamp: "2026-07-01T09:00:00+03:00"
  },
  {
    seq: 2,
    event: "reschedule",
    detail: "new_months=9;new_installment=133.34 SAR;reason=grace;basis=Quran:2:280",
    timestamp: "2026-09-01T09:00:00+03:00"
  },
  {
    seq: 3,
    event: "settle",
    detail: "settled=1200.00 SAR;method=bank_transfer;remaining=0.00 SAR",
    timestamp: "2027-04-01T09:00:00+03:00"
  }
];

function signSeal(sealedSealHex) {
  const sig = crypto.sign(null, Buffer.from(sealedSealHex, "utf8"), bankKey.BANK_PRIVATE_KEY_PEM);
  return { cryptosuite: bankKey.CRYPTOSUITE, verificationMethod: bankKey.VERIFICATION_METHOD, proofValue: sig.toString("base64") };
}

function buildChainFixture() {
  // ---- 1) chain the three blocks with the GOLDEN sha256/sealBlock/GENESIS ----
  // engine.GENESIS is ALREADY sha256(GENESIS_SEED) — the same value
  // verify-ahd-seal.cjs's DEFAULT_GENESIS_SEED independently derives.
  let prev = engine.GENESIS;
  const blocks = BLOCKS_RAW.map((b) => {
    const record = { profile: "ahd-chain-block-v1", ahd_id: AHD_ID, seq: b.seq, event: b.event, detail: b.detail, timestamp: b.timestamp };
    const canonical = seal.canonicalChainBlockImpl(record);
    const canonicalHash = engine.sha256(canonical);
    const sealedSeal = engine.sealBlock(prev, canonicalHash, b.seq);
    const withChain = Object.assign({}, record, { chain: { genesis_seed: GENESIS_SEED, prev: prev, seq: b.seq }, sealed_seal: sealedSeal });
    prev = sealedSeal;
    return { record: withChain, canonical: canonical, canonical_hash: canonicalHash, sealed_seal: sealedSeal };
  });

  // ---- 2) bank signs every block's sealed_seal (Ed25519, fixed demo key) ----
  blocks.forEach((b) => { b.bank_proof = signSeal(b.sealed_seal); });

  // ---- 3) Merkle-ize all three sealed_seal values together (RFC 6962) ----
  const leaves = blocks.map((b) => Buffer.from(b.sealed_seal, "hex"));
  const rootBuf = seal.merkleRoot(leaves);
  const rootHex = rootBuf.toString("hex");
  const treeSize = leaves.length;
  blocks.forEach((b, i) => {
    const path = seal.merkleAuditPath(leaves, i).map((s) => ({ hash: s.hash.toString("hex"), side: s.side }));
    b.merkle = { leaf_index: i, audit_path: path, tree_size: treeSize, signed_root: rootHex };
  });

  return blocks.map((b) => ({ record: b.record, bank_proof: b.bank_proof, merkle: b.merkle }));
}

module.exports = { buildChainFixture: buildChainFixture, AHD_ID: AHD_ID, GENESIS_SEED: GENESIS_SEED };

if (require.main === module) {
  console.log(JSON.stringify(buildChainFixture(), null, 2));
}
