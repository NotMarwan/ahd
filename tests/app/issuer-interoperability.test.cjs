"use strict";
const assert = require("assert");
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "..");
const verify = require(path.join(root, "protocol", "verify-ahd-seal.cjs"));
const issuerA = require(path.join(root, "protocol", "bank-key-demo.cjs"));
const issuerB = require(path.join(root, "protocol", "issuer-b-key-demo.cjs"));
const a = JSON.parse(fs.readFileSync(path.join(root, "protocol", "fixtures", "chain-3block.json"), "utf8"));
const b = JSON.parse(fs.readFileSync(path.join(root, "protocol", "fixtures", "chain-3block-issuer-b.json"), "utf8"));
let pass = 0, fail = 0;
function ok(v, m) { if (v) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } }
function full(chain, key) { let prior = null; return chain.map(function (item) { const r = verify.verifyFull(item, { priorSealedSealHex: prior, publicKeyPem: key }); prior = item.record.sealed_seal; return r; }); }
console.log("issuer-interoperability.test: A/B independent issuer fixtures");
ok(full(a, issuerA.BANK_PUBLIC_KEY_PEM).every(function (r) { return r.ok; }), "issuer A fixture verifies with issuer A public key");
ok(full(b, issuerB.ISSUER_B_PUBLIC_KEY_PEM).every(function (r) { return r.ok; }), "issuer B fixture verifies with issuer B public key");
ok(!full(b, issuerA.BANK_PUBLIC_KEY_PEM).every(function (r) { return r.ok; }), "issuer B rejects issuer A key");
const tamper = JSON.parse(JSON.stringify(b)); tamper[1].record.detail += ";tamper=1";
ok(verify.verifyFull(tamper[1], { priorSealedSealHex: tamper[0].record.sealed_seal, publicKeyPem: issuerB.ISSUER_B_PUBLIC_KEY_PEM }).failedAt === "integrity", "issuer B content tamper fails integrity");
ok(verify.verifyFull(b[1], { priorSealedSealHex: "0".repeat(64), publicKeyPem: issuerB.ISSUER_B_PUBLIC_KEY_PEM }).failedAt === "chain-continuity", "issuer B wrong prior chain fails continuity");
const merkle = JSON.parse(JSON.stringify(b)); merkle[0].merkle.audit_path[0].hash = "0" + merkle[0].merkle.audit_path[0].hash.slice(1);
ok(verify.verifyFull(merkle[0], { publicKeyPem: issuerB.ISSUER_B_PUBLIC_KEY_PEM }).failedAt === "merkle-inclusion", "issuer B Merkle tamper fails inclusion");
ok(verify.verifyFull(b[0], { publicKeyPem: issuerB.ISSUER_B_PUBLIC_KEY_PEM }).ok, "verifier remains standalone and accepts independently supplied issuer key");
console.log("ISSUER-INTEROPERABILITY: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
