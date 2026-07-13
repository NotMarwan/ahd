/* ============================================================================
   bank-key-demo.cjs — the FIXED demo Ed25519 bank keypair used to sign sealed
   chain blocks (T-L1 property 4, docs/superpowers/plans/2026-07-13-ceiling-
   break-8-9-plan.md §3.2 + Appendix C).

   ⚠️  DEMO-ONLY KEY MATERIAL — NOT PRODUCTION. ⚠️
   This private key is committed in plain text in a public repo on purpose, to
   keep the whole seal reproducible/offline for judging. It must NEVER be used
   to sign a real obligation. Production custody = an HSM/KMS (AWS KMS, GCP
   Cloud KMS, Azure Key Vault, or a CST-licensed TSP such as emdha) that never
   exports the private key material — see docs/specs/open-witness-v1.md §9 and
   _meta/deep-work/backend/seal-scheme-spec.md §7 ("Bank-key HSM/KMS" gate).

   Determinism note: this key is GENERATED ONCE (offline, via Node's
   crypto.generateKeyPairSync('ed25519')) and then hardcoded — it is never
   regenerated at runtime, so no Math.random/crypto.randomBytes call sits in
   any hashed/signed code path. Ed25519 signing is itself deterministic per
   RFC 8032 (no per-signature nonce randomness), so a FIXED key + FIXED message
   always produces the FIXED signature bytes — reproducible on any machine.

   A SECOND, unrelated fixed keypair ("WRONG_KEY") is included purely so tests
   can prove verification genuinely fails against the wrong public key (real
   asymmetric crypto, not a rubber-stamp check). It is equally demo-only.

   Zero-dependency: no requires at all (plain data + one helper).
============================================================================ */
"use strict";

/* ---- the real demo bank key (used to actually sign fixtures) ---- */
const BANK_PRIVATE_KEY_PEM =
  "-----BEGIN PRIVATE KEY-----\n" +
  "MC4CAQAwBQYDK2VwBCIEIDuL8kj2Ce1rwJTR9CEF/d6Bj82jOKMIMTXrG3OfgD8u\n" +
  "-----END PRIVATE KEY-----\n";

const BANK_PUBLIC_KEY_PEM =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MCowBQYDK2VwAyEAPqacay7/NcQRX8p614bI0kdxuWzXZJTD1ry2nvC9McE=\n" +
  "-----END PUBLIC KEY-----\n";

/* a stable, non-secret label identifying which demo key signed a proof —
   shaped like a W3C VC Data Integrity `verificationMethod` (a URI a verifier
   would dereference to fetch the public key); here it is just a fixed string
   because there is no real DID/key-registry seam in this prototype. */
const VERIFICATION_METHOD = "ahd-bank-demo-key-2026#ed25519-1";

/* project-local cryptosuite id (NOT a registered W3C Data Integrity suite —
   see protocol/verify-ahd-seal.cjs §7's honest scope note: the signed bytes
   are the existing Open-Witness `sealed_seal` hex, not RFC-8785 JCS bytes). */
const CRYPTOSUITE = "ahd-eddsa-2026-demo";

/* ---- a SECOND, unrelated fixed keypair — for negative "wrong key" tests only ---- */
const WRONG_PRIVATE_KEY_PEM =
  "-----BEGIN PRIVATE KEY-----\n" +
  "MC4CAQAwBQYDK2VwBCIEIC1vzh+PJqrCaTYfsQ5mxu+q6m+3g3+b52UVzlL0gd2s\n" +
  "-----END PRIVATE KEY-----\n";

const WRONG_PUBLIC_KEY_PEM =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MCowBQYDK2VwAyEAQfYtYlXdfVLocGSGdJ0L9mzSMZUElbGGiuwVzfOJv9c=\n" +
  "-----END PUBLIC KEY-----\n";

module.exports = {
  BANK_PRIVATE_KEY_PEM,
  BANK_PUBLIC_KEY_PEM,
  VERIFICATION_METHOD,
  CRYPTOSUITE,
  WRONG_PRIVATE_KEY_PEM,
  WRONG_PUBLIC_KEY_PEM
};
