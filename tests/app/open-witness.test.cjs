/* ============================================================================
   open-witness.test.cjs — I1 Open-Witness protocol: proves the Ahd seal is an
   INDEPENDENTLY-VERIFIABLE open standard, not an Ahd-only artifact.

   This suite runs ONLY protocol/verify-ahd-seal.cjs (the standalone reference
   verifier, Node crypto only) — it never requires app/engine.js — against the
   two pinned golden seals (MAIN + NEW-1, the same values pinned in
   tests/app/golden-vectors.test.cjs / tests/app/server-parity.test.cjs) and a
   deliberately tampered record, then proves BY SOURCE SCAN that the verifier
   truly never imports app/engine.js, anything under app/, or anything under
   demo/ — a verifier that quietly leaned on Ahd's own code would defeat the
   entire point of an "open standard" (docs/specs/open-witness-v1.md).
============================================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { stripComments } = require(path.join(__dirname, "..", "load-logic.cjs"));

const VERIFIER_PATH = path.join(__dirname, "..", "..", "protocol", "verify-ahd-seal.cjs");
const FIXTURES_DIR = path.join(__dirname, "..", "..", "protocol", "fixtures");
const { verify } = require(VERIFIER_PATH);

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const eq = (a, b, m) => ok(a === b, m + "  (got " + JSON.stringify(a) + ", want " + JSON.stringify(b) + ")");

console.log("open-witness.test: Open-Witness v1 protocol — independent verifiability (I1)");

/* the SAME pinned golden values as tests/app/golden-vectors.test.cjs and
   tests/app/server-parity.test.cjs — never re-derived here, only reproduced */
const GOLDEN_MAIN_SEAL = "6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18";
const GOLDEN_NEW1_SEAL = "0463553997c80d77e65d1a411acc0e0bd9d4bef67a92dc96af045dfa24a2b8f8";

function loadFixture(name) { return JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, name), "utf8")); }

/* ---- 0) INDEPENDENCE: the verifier module itself never imports Ahd's own code ---- */
{
  const src = fs.readFileSync(VERIFIER_PATH, "utf8");
  const FORBIDDEN_REQUIRES = [
    /require\(\s*["'][^"']*engine\.js["']\s*\)/,   // any require(".../engine.js")
    /require\(\s*["'][^"']*[\/\\]app[\/\\][^"']*["']\s*\)/, // any require reaching into a .../app/... dir
    /require\(\s*["'][^"']*[\/\\]demo[\/\\][^"']*["']\s*\)/ // any require reaching into a .../demo/... dir
  ];
  const hit = FORBIDDEN_REQUIRES.find((re) => re.test(src));
  ok(!hit, "protocol/verify-ahd-seal.cjs source contains NO require() of app/engine.js, app/, or demo/");

  /* whitelist scan: every require() call target must be a bare Node built-in
     ("fs" / "crypto"), never a relative/project path of any kind */
  const requireCalls = [...src.matchAll(/require\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]);
  ok(requireCalls.length >= 2, "verifier requires at least fs + crypto (found " + requireCalls.length + ")");
  const nonBuiltin = requireCalls.filter((t) => t !== "fs" && t !== "crypto");
  ok(nonBuiltin.length === 0, "every require() target is a bare Node built-in (fs/crypto) — zero project/external deps" + (nonBuiltin.length ? "  [FOUND: " + nonBuiltin.join(", ") + "]" : ""));
}

/* ---- 1) MAIN golden record: the STANDALONE verifier reproduces the pinned golden MAIN seal ---- */
{
  const rec = loadFixture("main-record.json");
  eq(rec.profile, "ahd-main-v1", "main-record.json declares profile ahd-main-v1");
  eq(rec.sealed_seal, GOLDEN_MAIN_SEAL, "fixture main-record.json claims the project's pinned golden MAIN seal");
  const r = verify(rec);
  eq(r.recomputed, GOLDEN_MAIN_SEAL, "verify-ahd-seal.cjs (crypto-only, NO engine import) recomputes the GOLDEN MAIN seal exactly");
  ok(r.ok === true, "MAIN record verifies VALID (recomputed == claimed)");
}

/* ---- 2) NEW-1 golden record: reproduces the pinned golden NEW-1 seal (a DIFFERENT profile/algorithm) ---- */
{
  const rec = loadFixture("new1-record.json");
  eq(rec.profile, "ahd-create-v1", "new1-record.json declares profile ahd-create-v1");
  eq(rec.sealed_seal, GOLDEN_NEW1_SEAL, "fixture new1-record.json claims the project's pinned golden NEW-1 seal");
  const r = verify(rec);
  eq(r.recomputed, GOLDEN_NEW1_SEAL, "verify-ahd-seal.cjs recomputes the GOLDEN NEW-1 seal exactly (ahd-create-v1 profile)");
  ok(r.ok === true, "NEW-1 record verifies VALID (recomputed == claimed)");
}

/* ---- 3) tamper-evidence: a changed field breaks the seal — verifier reports TAMPERED ---- */
{
  const rec = loadFixture("main-record-tampered.json");
  eq(rec.amount_sar, 9999, "tampered fixture genuinely differs from the golden MAIN amount (5000 SAR)");
  eq(rec.sealed_seal, GOLDEN_MAIN_SEAL, "tampered fixture still CLAIMS the original golden MAIN seal (the tamper scenario)");
  const r = verify(rec);
  ok(r.recomputed !== GOLDEN_MAIN_SEAL, "recomputed seal diverges from the golden MAIN seal once the amount is tampered");
  ok(r.ok === false, "verify-ahd-seal.cjs reports TAMPERED (ok:false) for the doctored record");
}

/* ---- 4) unknown profile is refused (never silently mis-verified) ---- */
{
  let threw = false;
  try { verify(Object.assign({}, loadFixture("main-record.json"), { profile: "not-a-real-profile" })); }
  catch (e) { threw = /unknown profile/i.test(e.message); }
  ok(threw, "an unrecognized profile throws rather than silently verifying under the wrong algorithm");
}

/* ---- 5) CLI smoke: the ACTUAL command-line entrypoint a third party would run ---- */
{
  function runCli(file) {
    try { return { out: execFileSync(process.execPath, [VERIFIER_PATH, file], { encoding: "utf8" }), code: 0 }; }
    catch (e) { return { out: String(e.stdout || "") + String(e.stderr || ""), code: e.status }; }
  }
  const okMain = runCli(path.join(FIXTURES_DIR, "main-record.json"));
  ok(okMain.code === 0 && /VALID/.test(okMain.out), "CLI: `node protocol/verify-ahd-seal.cjs main-record.json` prints VALID, exits 0");
  const okNew1 = runCli(path.join(FIXTURES_DIR, "new1-record.json"));
  ok(okNew1.code === 0 && /VALID/.test(okNew1.out), "CLI: the NEW-1 fixture prints VALID, exits 0");
  const tampered = runCli(path.join(FIXTURES_DIR, "main-record-tampered.json"));
  ok(tampered.code === 1 && /TAMPERED/.test(tampered.out), "CLI: the tampered fixture prints TAMPERED, exits 1");
  const noArgRun = (() => { try { return { out: execFileSync(process.execPath, [VERIFIER_PATH], { encoding: "utf8" }), code: 0 }; } catch (e) { return { out: String(e.stdout || "") + String(e.stderr || ""), code: e.status }; } })();
  ok(noArgRun.code === 2, "CLI: no file argument exits 2 (usage error), never a false VALID/TAMPERED");
}

/* ---- 6) offline + determinism static scan (mirrors app-offline.test.cjs / server-parity.test.cjs's
   intent) — scan the STRIPPED source (comments removed) so prose mentioning these tokens (as this
   very file's header does, to document the determinism contract) never produces a false positive;
   only live/executable code is checked. ---- */
{
  const stripped = stripComments(fs.readFileSync(VERIFIER_PATH, "utf8"));
  const FORBIDDEN_TOKENS = ["fetch(", "XMLHttpRequest", "WebSocket", "Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString"];
  const hits = FORBIDDEN_TOKENS.filter((tok) => stripped.indexOf(tok) >= 0);
  ok(hits.length === 0, "protocol/verify-ahd-seal.cjs: no networking/nondeterminism primitive in live code" + (hits.length ? "  [FOUND: " + hits.join(", ") + "]" : ""));
}

console.log("\n========================================================");
console.log("OPEN-WITNESS: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
