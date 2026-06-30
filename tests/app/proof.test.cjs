/* ============================================================================
   proof.test.cjs — «حافظة الإثبات» (the proof-pack / evidence export) suite.
   The core promise: a witnessed عهد is admissible evidence (نظام الإثبات). The
   proof stands on cryptography, NOT the bank's judgment. Reuses the GOLDEN
   sha256 / sealBlock / GENESIS (called, never modified). Tamper-evident:
   recompute matches when untouched, breaks the moment the amount is mutated.
============================================================================ */
const path = require("path");
const P = (...p) => path.join(__dirname, "..", "..", "app", ...p);
const E = require(P("engine.js"));
const PF = require(P("features", "proof.js"));

let pass = 0, fail = 0;
const ok = (c, m, d) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m + (d ? "  — " + d : "")); } };
const HEX64 = /^[0-9a-f]{64}$/;

console.log("proof.test: the proof-pack / evidence export (حافظة الإثبات)\n");

const ev = (t, x) => Object.assign({ type: t }, x || {});
const rec = {
  id: "R-PROOF", lender: "نورة", borrower: "سارة", amountSAR: 5000,
  installments: [{ dueISO: "2026-08-01", amountSAR: 5000 }],
  events: [ev("AHD_DRAFTED", { installments: 1 }), ev("LENDER_SIGNED"), ev("COUNTERPARTY_SIGNED"), ev("RECORD_SEALED"), ev("ACTIVATED")]
};

const pack = PF.buildProofPack(rec, E);

/* ---- structure: a real content hash + block seal + the genesis→block chain ---- */
ok(HEX64.test(pack.contentHash), "contentHash is a 64-hex SHA-256");
ok(HEX64.test(pack.seal), "seal is a 64-hex block seal");
ok(pack.contentHash === E.sha256(pack.canonical), "contentHash == sha256(canonical) (consistent)");
ok(pack.seal === E.sealBlock(E.GENESIS, pack.contentHash, 1), "seal == sealBlock(GENESIS, contentHash, 1) (golden construction)");
ok(Array.isArray(pack.chain) && pack.chain.length === 2, "chain is genesis → block (length 2)");
ok(pack.chain[0].hash === E.GENESIS, "chain[0] is the GENESIS root");
ok(pack.chain[1].seal === pack.seal && pack.chain[1].prev === E.GENESIS, "chain[1] block links prev=GENESIS and carries the seal");

/* ---- canonical carries the witnessed facts (integer halalas, no float) ---- */
ok(/ahd_id=R-PROOF/.test(pack.canonical), "canonical records the ahd_id");
ok(/lender=نورة/.test(pack.canonical) && /borrower=سارة/.test(pack.canonical), "canonical records both parties");
ok(/principal=5000\.00 SAR/.test(pack.canonical), "canonical principal is minorToFixed2 (5000.00 SAR — integer halalas)");
ok(/interest:false/.test(pack.canonical) && /late_penalty_to_lender:false/.test(pack.canonical), "canonical asserts riba-clean (no interest, no penalty)");
ok(pack.canonical.indexOf("%") < 0, "no percentage anywhere in the canonical");

/* ---- deterministic ---- */
ok(pack.seal === PF.buildProofPack(rec, E).seal, "buildProofPack is deterministic (same seal on re-run)");

/* ---- live verify: untouched → OK ---- */
const v = PF.verifyProof(rec, E);
ok(v.ok === true, "verifyProof on the untouched record → OK (سليمة)");
ok(v.recomputed === v.sealed, "verify: recomputed seal equals the sealed value");

/* ---- tamper: mutate the amount → the seal BREAKS (عبثٌ مكشوف) ---- */
const t = PF.verifyProof(rec, E, 9000);
ok(t.ok === false, "tampering the amount (5000→9000) → verify FAILS");
ok(t.recomputed !== t.sealed, "tamper: recomputed seal differs from the sealed value (exposed)");
ok(PF.proofCanonical(rec, E, 9000) !== pack.canonical, "tampered canonical differs from the sealed canonical");

/* ---- a different record yields a different seal (no collisions on our inputs) ---- */
const rec2 = Object.assign({}, rec, { id: "R-PROOF-2", amountSAR: 5001 });
ok(PF.buildProofPack(rec2, E).seal !== pack.seal, "a different record → a different seal");

console.log("\n" + "=".repeat(56));
console.log("PROOF: " + pass + " passed, " + fail + " failed");
console.log("=".repeat(56));
process.exit(fail ? 1 : 0);
