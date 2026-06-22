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

  /* ---- structured provenance of the sealed record (display-ready) ----
     Reuses the engine (fold/statusLabel/toMinor/short) + the proof pack. Integer
     halalas; no golden function is altered. Money figures only, never a score. */
  function provenance(record, engine) {
    var e = engine || ENGINE;
    var pack = buildProofPack(record, e);
    var fold = (typeof e.fold === "function") ? e.fold(record.events || []) : { status: "" };
    var schedule = (record.installments || []).map(function (s, i) {
      return { n: i + 1, dueISO: s.dueISO || null, amountMinor: e.toMinor(s.amountSAR) };
    });
    var open = schedule.length === 1 && !schedule[0].dueISO;
    return {
      id: record.id, type: "قرض حسن",
      lender: record.lender, borrower: record.borrower,
      principalSAR: record.amountSAR, principalMinor: e.toMinor(record.amountSAR),
      schedule: schedule, open: open,
      basis: open ? "Quran:2:280" : "Quran:2:282",
      witnessedVia: "نفاذ (Nafath) + SHA-256",
      status: fold.status || "", statusAr: (typeof e.statusLabel === "function") ? e.statusLabel(record.events) : "",
      events: (record.events || []).map(function (x) { return x.type; }),
      contentHash: pack.contentHash,
      sealShort: (typeof e.short === "function") ? e.short(pack.seal, 24) : String(pack.seal).slice(0, 24),
      riba: "interest:false; late_penalty:false; gharar:none"
    };
  }

  /* ---- a precise tamper report: names the changed field + the diverging
     hashes/seals (the golden seal is recomputed, never reinvented) ---- */
  function tamperReport(record, engine, overrideSAR) {
    var e = engine || ENGINE;
    var base = buildProofPack(record, e);
    var v = verifyProof(record, e, overrideSAR == null ? null : overrideSAR);
    var after = overrideSAR == null ? record.amountSAR : overrideSAR;
    return {
      ok: v.ok, field: "principal",
      before: record.amountSAR, after: after,
      beforeMinor: e.toMinor(record.amountSAR), afterMinor: e.toMinor(after),
      hashBefore: base.contentHash, hashAfter: v.contentHash,
      sealBefore: base.seal, sealAfter: v.recomputed
    };
  }

  return { proofCanonical: proofCanonical, buildProofPack: buildProofPack, verifyProof: verifyProof, provenance: provenance, tamperReport: tamperReport };
});
