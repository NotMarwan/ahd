/* ============================================================================
   seal-properties.test.cjs — T-L1 "complete the 5-property SEAL" (crypto scope
   only — docs/superpowers/plans/2026-07-13-ceiling-break-8-9-plan.md §3.2 +
   Appendix C). Proves the THREE properties this session adds beyond the one
   already shipped by protocol/verify-ahd-seal.cjs (content-hash integrity):

     prop 2 — multi-block chain (seal_i = sealBlock(prev, canonical_hash_i,
              seq), prev = prior block's OWN recomputed seal, GENESIS-rooted)
     prop 4 — bank signature (real Ed25519 sign/verify, Node built-in crypto,
              W3C-VC-Data-Integrity-shaped DataIntegrityProof)
     prop 5 — Merkle inclusion (RFC 6962, leaf/node hash domain separation)

   plus the extended standalone verifier (protocol/verify-ahd-seal.cjs's new
   verifyChain / verifyFull) that reports the FIRST failing step across all
   four properties in order: integrity → chain-continuity → bank-signature →
   merkle-inclusion.

   OUT OF SCOPE here (by design, per the session's own instructions): prop 3
   (RFC-3161 TSA) and the STRIDE/LINDDUN threat model / rate-limiting — those
   are separate, later work. This suite never claims them.

   Golden-untouched: this suite also re-asserts (defense in depth, alongside
   golden-vectors.test.cjs) that nothing about the FROZEN demo/engine changed
   while building this — demo/index.html's tripwire hash, the pinned MAIN and
   NEW-1 seals, and `git diff` on demo/index.html + app/engine.js.
============================================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const cp = require("child_process");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const P = (...p) => path.join(ROOT, ...p);

const VERIFIER_PATH = P("protocol", "verify-ahd-seal.cjs");
const FIXTURES_DIR = P("protocol", "fixtures");
const seal = require(VERIFIER_PATH);
const bankKey = require(P("protocol", "bank-key-demo.cjs"));
const { buildChainFixture } = require(P("protocol", "build-chain-fixture.cjs"));
const engine = require(P("app", "engine.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ", want " + JSON.stringify(b) + ")");

console.log("seal-properties.test: T-L1 complete the SEAL — chain + Merkle + bank signature (crypto scope)");

function loadFixture(name) { return JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, name), "utf8")); }

/* ---- 0) INDEPENDENCE (defense in depth alongside open-witness.test.cjs):
   the extended verifier is STILL fs+crypto only — no new require() crept in
   while adding merkle/chain/bank-signature logic. ---- */
{
  const src = fs.readFileSync(VERIFIER_PATH, "utf8");
  const requireCalls = [...src.matchAll(/require\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]);
  const nonBuiltin = requireCalls.filter((t) => t !== "fs" && t !== "crypto");
  ok(nonBuiltin.length === 0, "protocol/verify-ahd-seal.cjs still requires ONLY fs+crypto after the T-L1 extension" + (nonBuiltin.length ? "  [FOUND: " + nonBuiltin.join(", ") + "]" : ""));
  const FORBIDDEN = [/require\(\s*["'][^"']*engine\.js["']\s*\)/, /require\(\s*["'][^"']*[\/\\]app[\/\\][^"']*["']\s*\)/, /require\(\s*["'][^"']*[\/\\]demo[\/\\][^"']*["']\s*\)/];
  ok(!FORBIDDEN.find((re) => re.test(src)), "still no require() of app/engine.js, app/, or demo/");
}

/* ---- 1) chain determinism + the NEW pinned 3-block golden vector ----
   The frozen vectors (main 6c9410b9…, NEW-1 0463…) are untouched — this is an
   ADDITIVE vector for the multi-block chain, not a re-pin. */
const GOLDEN_MAIN_SEAL = "6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18";
const GOLDEN_NEW1_SEAL = "0463553997c80d77e65d1a411acc0e0bd9d4bef67a92dc96af045dfa24a2b8f8";
{
  const run1 = buildChainFixture();
  const run2 = buildChainFixture();
  ok(JSON.stringify(run1) === JSON.stringify(run2), "buildChainFixture() is deterministic (two calls, byte-identical JSON — no clock/random in the chain/signature/Merkle path)");

  const pinned = loadFixture("chain-3block.json");
  ok(JSON.stringify(run1) === JSON.stringify(pinned), "re-derivation reproduces the pinned protocol/fixtures/chain-3block.json exactly");

  eq(pinned.length, 3, "the new golden vector is a genuine 3-block chain (create → reschedule → settle)");
  eq(pinned[0].record.chain.prev, engine.GENESIS, "block 1's prev is the GOLDEN engine.GENESIS anchor (reused, not reimplemented)");
  eq(pinned[1].record.chain.prev, pinned[0].record.sealed_seal, "block 2's prev is block 1's ACTUAL sealed_seal (a real 2nd-block link)");
  eq(pinned[2].record.chain.prev, pinned[1].record.sealed_seal, "block 3's prev is block 2's ACTUAL sealed_seal (a real 3rd-block link)");

  // cross-check block 1's seal was built by CALLING the golden primitives verbatim
  const canonical1 = seal.canonicalChainBlockImpl(pinned[0].record);
  const ch1 = engine.sha256(canonical1);
  const expectedSeal1 = engine.sealBlock(engine.GENESIS, ch1, 1);
  eq(pinned[0].record.sealed_seal, expectedSeal1, "block 1's pinned seal == engine.sealBlock(engine.GENESIS, engine.sha256(canonical), 1) — the GOLDEN primitives, called verbatim");
}

/* ---- 2) each block individually verifies (integrity, via the STANDALONE verifier) ---- */
{
  const pinned = loadFixture("chain-3block.json");
  pinned.forEach((b, i) => {
    const r = seal.verify(b.record);
    ok(r.ok, "block " + (i + 1) + " verify().ok — standalone recomputation matches its pinned sealed_seal");
  });
}

/* ---- 3) verifyChain(): whole 3-block chain is continuous and intact ---- */
{
  const pinned = loadFixture("chain-3block.json");
  const r = seal.verifyChain(pinned.map((b) => b.record));
  ok(r.ok === true, "verifyChain() on the pinned 3-block chain: ok (all 3 integrity + continuity checks pass)");
  eq(r.perRecord.length, 3, "verifyChain() reports a per-record breakdown for all 3 blocks");
}

/* ---- 4) chain-continuity independently catches a reorder/replay forgery
   that a LONE record's own integrity check cannot (the record is re-sealed
   self-consistently against the WRONG prev, using only the PUBLIC golden
   sha256/sealBlock — no secret needed to forge this, which is exactly why a
   separate continuity check across the ordered sequence matters). ---- */
{
  const pinned = loadFixture("chain-3block.json");
  const forged = JSON.parse(JSON.stringify(pinned[2].record));
  forged.chain.prev = engine.GENESIS; // replay block 3 as if it were a first block
  const canonical = seal.canonicalChainBlockImpl(forged);
  const ch = engine.sha256(canonical);
  forged.sealed_seal = engine.sealBlock(engine.GENESIS, ch, forged.seq);

  ok(seal.verify(forged).ok === true, "the forged/replayed block 3 is internally self-consistent alone (integrity passes)");
  const r = seal.verifyChain([pinned[0].record, pinned[1].record, forged]);
  ok(r.ok === false, "verifyChain() flags the forged chain as NOT ok");
  eq(r.failedAt, 2, "verifyChain() localizes the failure to block index 2 (the forged one)");
  eq(r.failedStep, "chain-continuity", "verifyChain() reports the failing STEP as chain-continuity, not integrity — the tamper type is correctly distinguished");
}

/* ---- 5) Merkle inclusion (RFC 6962) — root recomputation + per-leaf audit paths ---- */
{
  const pinned = loadFixture("chain-3block.json");
  const leaves = pinned.map((b) => Buffer.from(b.record.sealed_seal, "hex"));
  const root = seal.merkleRoot(leaves);
  eq(root.toString("hex"), pinned[0].merkle.signed_root, "recomputed Merkle root matches the pinned signed_root");
  pinned.forEach((b) => ok(b.merkle.signed_root === root.toString("hex"), "block " + b.record.seq + " carries the SAME published root (one tree, size " + b.merkle.tree_size + ")"));

  pinned.forEach((b, i) => {
    const path = b.merkle.audit_path.map((s) => ({ hash: Buffer.from(s.hash, "hex"), side: s.side }));
    const inclOk = seal.verifyMerkleInclusion(leaves[i], b.merkle.leaf_index, path, b.merkle.tree_size, root);
    ok(inclOk, "block " + (i + 1) + "'s own audit path verifies inclusion in the published root");
  });

  // a genuine forged leaf under someone else's audit path is REJECTED
  const forgedLeaf = crypto.createHash("sha256").update("forged-leaf", "utf8").digest();
  const path0 = pinned[0].merkle.audit_path.map((s) => ({ hash: Buffer.from(s.hash, "hex"), side: s.side }));
  ok(seal.verifyMerkleInclusion(forgedLeaf, 0, path0, 3, root) === false, "a forged leaf under a real audit path is REJECTED (root mismatch)");

  // ONE tampered byte in an audit-path sibling hash breaks inclusion
  const tamperedPath = JSON.parse(JSON.stringify(pinned[1].merkle.audit_path));
  tamperedPath[0].hash = (tamperedPath[0].hash[0] === "f" ? "0" : "f") + tamperedPath[0].hash.slice(1);
  const tamperedPathBufs = tamperedPath.map((s) => ({ hash: Buffer.from(s.hash, "hex"), side: s.side }));
  ok(seal.verifyMerkleInclusion(leaves[1], 1, tamperedPathBufs, 3, root) === false, "a single tampered hex character in an audit-path sibling breaks inclusion verification");
}

/* ---- 6) RFC-6962 domain separation is REAL — cross-check against Node crypto directly
   (not merely trusting the internal implementation): leaf hash MUST equal
   SHA256(0x00‖d); node hash MUST equal SHA256(0x01‖l‖r); the two domains are
   provably disjoint from a THIRD, independently-computed value. ---- */
{
  const d = Buffer.from("ahd-leaf-probe", "utf8");
  const expectedLeaf = crypto.createHash("sha256").update(Buffer.concat([Buffer.from([0x00]), d])).digest();
  eq(seal.merkleLeafHash(d).toString("hex"), expectedLeaf.toString("hex"), "merkleLeafHash(d) === SHA256(0x00 ‖ d), cross-checked against a fresh Node crypto call");

  const l = crypto.createHash("sha256").update("L").digest();
  const r = crypto.createHash("sha256").update("R").digest();
  const expectedNode = crypto.createHash("sha256").update(Buffer.concat([Buffer.from([0x01]), l, r])).digest();
  eq(seal.merkleNodeHash(l, r).toString("hex"), expectedNode.toString("hex"), "merkleNodeHash(l,r) === SHA256(0x01 ‖ l ‖ r), cross-checked against a fresh Node crypto call");

  ok(seal.merkleLeafHash(d).toString("hex") !== crypto.createHash("sha256").update(d).digest("hex"), "leaf hash differs from a bare, undomain-separated SHA-256(d) — the 0x00 prefix genuinely changes the digest");
  ok(seal.merkleNodeHash(l, r).toString("hex") !== seal.merkleLeafHash(Buffer.concat([l, r])).toString("hex"), "a node hash of (l,r) is NOT the same digest as treating (l‖r) as a single leaf — the leaf/node domains are disjoint (the second-preimage footgun this construction avoids)");
}

/* ---- 7) Ed25519 bank signature — real asymmetric sign/verify ---- */
{
  const pinned = loadFixture("chain-3block.json");
  pinned.forEach((b, i) => {
    eq(b.bank_proof.cryptosuite, bankKey.CRYPTOSUITE, "block " + (i + 1) + " bank_proof.cryptosuite is set");
    eq(b.bank_proof.verificationMethod, bankKey.VERIFICATION_METHOD, "block " + (i + 1) + " bank_proof.verificationMethod is set");
    ok(typeof b.bank_proof.proofValue === "string" && b.bank_proof.proofValue.length > 0, "block " + (i + 1) + " bank_proof.proofValue is a non-empty signature string");

    const validOk = seal.verifyBankSignature(b.record.sealed_seal, b.bank_proof, bankKey.BANK_PUBLIC_KEY_PEM);
    ok(validOk === true, "block " + (i + 1) + " bank signature verifies VALID against the real bank public key");

    const wrongKeyOk = seal.verifyBankSignature(b.record.sealed_seal, b.bank_proof, bankKey.WRONG_PUBLIC_KEY_PEM);
    ok(wrongKeyOk === false, "block " + (i + 1) + " bank signature FAILS against a different (wrong) Ed25519 public key");

    const tamperedPayloadOk = seal.verifyBankSignature(b.record.sealed_seal + "00", b.bank_proof, bankKey.BANK_PUBLIC_KEY_PEM);
    ok(tamperedPayloadOk === false, "block " + (i + 1) + " bank signature FAILS when the signed payload (sealed_seal) is altered by even one byte");
  });

  // determinism: Ed25519 (PureEdDSA, RFC 8032) is deterministic — re-signing the
  // SAME message with the SAME fixed key reproduces the IDENTICAL signature.
  const msg = Buffer.from(pinned[0].record.sealed_seal, "utf8");
  const sigA = crypto.sign(null, msg, bankKey.BANK_PRIVATE_KEY_PEM).toString("base64");
  const sigB = crypto.sign(null, msg, bankKey.BANK_PRIVATE_KEY_PEM).toString("base64");
  eq(sigA, sigB, "Ed25519 signing the same message with the same fixed key is deterministic (RFC 8032) — reproducible across runs");
  eq(sigA, pinned[0].bank_proof.proofValue, "the re-derived signature matches the pinned block 1 bank_proof.proofValue exactly");
}

/* ---- 8) verifyFull(): the assembled ordered pipeline — integrity → chain-continuity
   → bank-signature → merkle-inclusion — reports the FIRST failing step ---- */
{
  const pinned = loadFixture("chain-3block.json");

  // 8a) the whole valid chain passes every step, threaded in order
  let prior = null;
  pinned.forEach((b, i) => {
    const r = seal.verifyFull(b, { priorSealedSealHex: prior });
    ok(r.ok === true, "verifyFull(): block " + (i + 1) + " passes ALL four ordered checks");
    prior = b.record.sealed_seal;
  });

  // 8b) content tamper (the shipped tampered fixture) → first failing step = integrity
  const tampered = loadFixture("chain-3block-tampered.json");
  ok(tampered[1].record.detail !== pinned[1].record.detail, "chain-3block-tampered.json genuinely differs from the golden chain (block 2's detail edited)");
  eq(tampered[1].record.sealed_seal, pinned[1].record.sealed_seal, "the tampered fixture keeps the ORIGINAL sealed_seal (the classic tamper scenario: content edited, seal left stale)");
  const rTamperContent = seal.verifyFull(tampered[1], { priorSealedSealHex: tampered[0].record.sealed_seal });
  ok(rTamperContent.ok === false, "verifyFull() on the content-tampered block: not ok");
  eq(rTamperContent.failedAt, "integrity", "content tamper is caught at the FIRST step: integrity");

  // 8c) bank-signature-only tamper (flip a base64 char in proofValue; content/chain untouched)
  const sigTampered = JSON.parse(JSON.stringify(pinned[0]));
  const pv = sigTampered.bank_proof.proofValue;
  sigTampered.bank_proof.proofValue = (pv[0] === "A" ? "B" : "A") + pv.slice(1);
  const rSigTamper = seal.verifyFull(sigTampered);
  ok(rSigTamper.ok === false, "verifyFull() on a bank-signature-tampered block: not ok");
  eq(rSigTamper.failedAt, "bank-signature", "signature-only tamper is caught at the bank-signature step (integrity + chain still pass)");

  // 8d) Merkle-only tamper (flip a hex char in the audit path; content/chain/sig untouched)
  const merkleTampered = JSON.parse(JSON.stringify(pinned[0]));
  const h0 = merkleTampered.merkle.audit_path[0].hash;
  merkleTampered.merkle.audit_path[0].hash = (h0[0] === "f" ? "0" : "f") + h0.slice(1);
  const rMerkleTamper = seal.verifyFull(merkleTampered);
  ok(rMerkleTamper.ok === false, "verifyFull() on a Merkle-audit-path-tampered block: not ok");
  eq(rMerkleTamper.failedAt, "merkle-inclusion", "Merkle-only tamper is caught LAST, at merkle-inclusion (integrity + chain + signature all still pass — proves the ordering genuinely localizes the tamper TYPE)");

  // 8e) chain-continuity-only failure via verifyFull's own prior-seal threading
  const rWrongPrior = seal.verifyFull(pinned[1], { priorSealedSealHex: engine.GENESIS });
  ok(rWrongPrior.ok === false, "verifyFull() on block 2 against a WRONG prior seal: not ok");
  eq(rWrongPrior.failedAt, "chain-continuity", "wrong prior-seal is caught at chain-continuity (block 2's own integrity is otherwise intact)");
}

/* ---- 9) CLI: the assembled-proof envelope is reachable from the real command line ---- */
{
  const pinned = loadFixture("chain-3block.json");
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-seal-cli-"));
  try {
    const validFile = path.join(tmpDir, "block1-valid.json");
    fs.writeFileSync(validFile, JSON.stringify(pinned[0]));
    function runCli(file) {
      try { return { out: execFileSync(process.execPath, [VERIFIER_PATH, file], { encoding: "utf8" }), code: 0 }; }
      catch (e) { return { out: String(e.stdout || "") + String(e.stderr || ""), code: e.status }; }
    }
    const rValid = runCli(validFile);
    ok(rValid.code === 0 && /VALID/.test(rValid.out), "CLI: a valid assembled-proof block prints VALID, exits 0");

    const tamperedBlock = JSON.parse(JSON.stringify(pinned[0]));
    tamperedBlock.bank_proof.proofValue = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
    const tamperedFile = path.join(tmpDir, "block1-tampered.json");
    fs.writeFileSync(tamperedFile, JSON.stringify(tamperedBlock));
    const rTampered = runCli(tamperedFile);
    ok(rTampered.code === 1 && /TAMPERED/.test(rTampered.out) && /bank-signature/.test(rTampered.out), "CLI: a bank-signature-tampered assembled proof prints TAMPERED with the failing step, exits 1");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

/* ---- 10) golden-untouched — defense in depth: the frozen demo/engine did not move
   while building the new properties above. ---- */
{
  const demoBytes = fs.readFileSync(P("demo", "index.html"));
  const demoHash = crypto.createHash("sha256").update(demoBytes).digest("hex");
  eq(demoHash, "e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40", "demo/index.html SHA-256 still matches the frozen tripwire (recomputed directly, not shelling out)");

  eq(engine.SEALED.seal, GOLDEN_MAIN_SEAL, "app/engine.js's frozen MAIN seal is unchanged");
  const CR = require(P("app", "features", "create.js"));
  const d1 = CR.makeDraft({ id: "NEW-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 });
  eq(CR.createSeal(d1, engine).seal, GOLDEN_NEW1_SEAL, "app/features/create.js's frozen NEW-1 seal is unchanged");
  ok(typeof engine.netting === "function", "engine.netting is still the same exported function (never shadowed/reimplemented)");

  try {
    const diff = cp.execSync("git diff --name-only -- demo/index.html app/engine.js", { cwd: ROOT, encoding: "utf8" });
    eq(diff.trim(), "", "git diff on demo/index.html + app/engine.js is empty — neither file has an uncommitted change");
  } catch (e) {
    ok(false, "git diff check could not run: " + e.message);
  }
}

console.log("\n========================================================");
console.log("SEAL-PROPERTIES (T-L1): " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
