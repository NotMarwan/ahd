/* ============================================================================
   features/proof.js — «حافظة الإثبات» (the proof-pack / evidence export).
   The core promise: a witnessed عهد is admissible evidence (نظام الإثبات 2022).
   Builds a canonical serialization of a record, hashes it (GOLDEN sha256),
   seals it into the chain (GOLDEN sealBlock over GENESIS), and verifies it live —
   recompute matches when untouched, breaks the instant the amount is mutated.

   Reuses the engine ONLY (sha256 / sealBlock / GENESIS / toMinor / minorToFixed2);
   never modifies a golden function. Deterministic; integer halalas.

   Dual module: Node `require`, browser `window.Proof` (uses window.AHD).
============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../engine.js"));
  else root.Proof = factory(root.AHD);
})(typeof self !== "undefined" ? self : this, function (ENGINE) {
  "use strict";

  /* a deterministic, canonical serialization of a witnessed record (optionally
     re-computed with a tampered principal, to demonstrate tamper-evidence). */
  function proofCanonical(record, engine, overrideSAR) {
    var e = engine || ENGINE;
    var principalMinor = overrideSAR == null ? e.toMinor(record.amountSAR) : e.toMinor(overrideSAR);
    var lines = ["AHD-PROOF-v1", "ahd_id=" + record.id, "type=قرض حسن",
      "lender=" + record.lender, "borrower=" + record.borrower,
      "principal=" + e.minorToFixed2(principalMinor) + " SAR"];
    var sched = (record.installments || []).map(function (s, i) {
      return (i + 1) + ":" + (s.dueISO || "open") + ":" + e.minorToFixed2(e.toMinor(s.amountSAR));
    }).join("|");
    lines.push("schedule=" + (sched || "NONE"));
    lines.push("events=" + (record.events || []).map(function (x) { return x.type; }).join(","));
    lines.push("riba=interest:false;late_penalty_to_lender:false;gharar:none", "basis=Quran:2:282");
    return lines.join("\n");
  }

  function buildProofPack(record, engine) {
    var e = engine || ENGINE;
    var canonical = proofCanonical(record, e);
    var contentHash = e.sha256(canonical);
    var seal = e.sealBlock(e.GENESIS, contentHash, 1);
    return {
      id: record.id, canonical: canonical, contentHash: contentHash, seal: seal,
      chain: [
        { label: "genesis", hash: e.GENESIS },
        { label: "block", seq: 1, prev: e.GENESIS, contentHash: contentHash, seal: seal }
      ]
    };
  }

  /* recompute-and-compare; pass overrideSAR to simulate tampering the amount */
  function verifyProof(record, engine, overrideSAR) {
    var e = engine || ENGINE;
    var base = buildProofPack(record, e);
    var ch = e.sha256(proofCanonical(record, e, overrideSAR == null ? null : overrideSAR));
    var seal = e.sealBlock(e.GENESIS, ch, 1);
    return { ok: seal === base.seal, sealed: base.seal, recomputed: seal, contentHash: ch };
  }

  return { proofCanonical: proofCanonical, buildProofPack: buildProofPack, verifyProof: verifyProof };
});
