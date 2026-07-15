# Open-Witness Five-Property Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the independent verifier into a versioned five-property verifier, publish exchangeable tamper fixtures, and prove three-record interoperability with a clean-room second issuer without changing golden bytes.

**Architecture:** Keep the existing verifier and legacy profiles intact, then add profile dispatch, strict property results, trusted-time and issuer/checkpoint adapters, and explicit CLI modes. Production trusted time and signing remain disabled until approved adapter, TSA, and HSM/KMS evidence exist; clean-room conformance is isolated from all Ahd application code.

**Tech Stack:** Node.js >=22.13 CommonJS, built-in `fs`/`path`/`crypto`, an owner/security-approved pinned RFC-3161/CMS adapter, JSON fixtures, zero app/demo imports.

## Global Constraints

- Never modify `demo/index.html`, golden function internals, golden vectors, or `app/engine.js`.
- Existing `ahd-main-v1`, `ahd-create-v1`, and `ahd-chain-block-v1` verification outcomes remain backward-compatible.
- Trusted time attests the 32 raw bytes decoded from hexadecimal `sealed_seal`; it never enters canonical business content.
- All five properties return `valid`, `invalid`, `missing`, or `unsupported`; every mandatory property must be `valid` for `ok: true`.
- The verifier and clean-room issuer never import `app/`, `demo/`, generated engine code, or server code.
- Fixture keys and TSA evidence are visibly non-production and cannot satisfy a production profile.
- Production TSA, issuer custody, license, and governance publication remain owner/vendor gates.
- Every behavior change begins with a focused failing test; run `node tests/app/run-app-tests.cjs` and `cd tests; node run-all.cjs` before completion.

---

## File Structure

| Path | Responsibility |
|---|---|
| `protocol/profiles/protocol-profiles.json` | Mandatory property and compatibility matrix |
| `protocol/profiles/load-profiles.cjs` | Strict profile parsing and lookup |
| `protocol/proof-result.cjs` | Stable property result and overall result assembly |
| `protocol/chain-verify.cjs` | Contiguous sequence and previous-seal verification |
| `protocol/timestamp/adapter-contract.cjs` | Timestamp adapter input/output validation |
| `protocol/timestamp/fixture-adapter.cjs` | Non-evidentiary deterministic orchestration fixture |
| `protocol/profiles/issuer-profiles.json` | Fixture/staging/production public-key lifecycle |
| `protocol/issuer-registry.cjs` | Verification-method and issuance lifecycle checks |
| `protocol/checkpoint-registry.cjs` | Merkle checkpoint authentication policy |
| `protocol/verify-ahd-seal.cjs` | Existing verifier plus additive profile/CLI orchestration |
| `protocol/fixtures/conformance/` | Stable valid/missing/unsupported/property-tampered packages |
| `protocol/conformance/run-conformance.cjs` | Two-way fixture exchange runner |
| `protocol/issuers/reference-2/` | Clean-room issuer and verifier |
| `tests/app/open-witness-conformance.test.cjs` | Five-property, CLI, independence, and exchange tests |
| `protocol/GOVERNANCE.md` | Change control, errata, lifecycle, security path |
| `protocol/SECURITY.md` | Threat boundaries, reporting, cryptographic limitations |
| `protocol/CONFORMANCE.md` | Fixture and release rules |
| `protocol/LICENSE-SPECIFICATION` | Owner-selected specification license; created only after approval |
| `protocol/LICENSE-CODE` | Owner-selected code license; created only after approval |

### Task 1: Add strict profiles and five-property result assembly

**Files:**
- Create: `protocol/profiles/protocol-profiles.json`
- Create: `protocol/profiles/load-profiles.cjs`
- Create: `protocol/proof-result.cjs`
- Create: `tests/app/open-witness-conformance.test.cjs`

**Interfaces:**
- Consumes: declared `profile_id`, `protocol_version`, and per-property result objects.
- Produces: `loadProfile(profileId, protocolVersion)` and `assembleResult(profile, results)`.

- [ ] **Step 1: Write the failing profile/result test**

```js
const assert = require("assert");
const path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const { loadProfile } = require(path.join(ROOT, "protocol", "profiles", "load-profiles.cjs"));
const { assembleResult } = require(path.join(ROOT, "protocol", "proof-result.cjs"));

const profile = loadProfile("ahd-five-property-v1", "1.1.0");
assert.deepStrictEqual(profile.mandatory_properties, [
  "integrity", "continuity", "trusted_time", "issuer_signature", "merkle_inclusion"
]);
const result = assembleResult(profile, {
  integrity: { status: "valid", code: "OK" },
  continuity: { status: "valid", code: "OK" },
  trusted_time: { status: "missing", code: "TIMESTAMP_MISSING" },
  issuer_signature: { status: "valid", code: "OK" },
  merkle_inclusion: { status: "valid", code: "OK" }
});
assert.strictEqual(result.ok, false);
assert.strictEqual(result.failed_at, "trusted_time");
assert.throws(() => loadProfile("ahd-five-property-v1", "2.0.0"), /UNSUPPORTED_MAJOR/);
```

- [ ] **Step 2: Run the test and verify the missing modules fail**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: FAIL with `Cannot find module ...load-profiles.cjs`.

- [ ] **Step 3: Add the profile registry and loaders**

```json
{
  "registry_version": "1.0.0",
  "supported_major": 1,
  "profiles": {
    "ahd-legacy-record-v1": {
      "protocol_version": "1.0.0",
      "mandatory_properties": ["integrity"],
      "canonical_profiles": ["ahd-main-v1", "ahd-create-v1", "ahd-chain-block-v1"],
      "lifecycle": "verification_only"
    },
    "ahd-five-property-v1": {
      "protocol_version": "1.1.0",
      "mandatory_properties": ["integrity", "continuity", "trusted_time", "issuer_signature", "merkle_inclusion"],
      "canonical_profiles": ["ahd-main-v1", "ahd-create-v1", "ahd-chain-block-v1"],
      "lifecycle": "active"
    }
  }
}
```

```js
// protocol/profiles/load-profiles.cjs
"use strict";
const registry = require("./protocol-profiles.json");
function major(version) {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version || "");
  if (!match) throw new Error("INVALID_SEMVER");
  return Number(match[1]);
}
function loadProfile(profileId, protocolVersion) {
  if (major(protocolVersion) !== registry.supported_major) throw new Error("UNSUPPORTED_MAJOR");
  const profile = registry.profiles[profileId];
  if (!profile) throw new Error("UNSUPPORTED_PROFILE");
  return Object.freeze(Object.assign({ profile_id: profileId }, profile));
}
module.exports = { major, loadProfile };
```

```js
// protocol/proof-result.cjs
"use strict";
const ORDER = ["integrity", "continuity", "trusted_time", "issuer_signature", "merkle_inclusion"];
const STATUSES = ["valid", "invalid", "missing", "unsupported"];
function normalize(value) {
  if (!value || STATUSES.indexOf(value.status) < 0) return { status: "missing", code: "RESULT_MISSING" };
  return { status: value.status, code: String(value.code || "UNSPECIFIED") };
}
function assembleResult(profile, supplied) {
  const properties = {};
  ORDER.forEach((name) => { properties[name] = normalize(supplied[name]); });
  const failed = ORDER.find((name) => profile.mandatory_properties.indexOf(name) >= 0 && properties[name].status !== "valid");
  return { ok: !failed, profile_id: profile.profile_id, properties, failed_at: failed || null, diagnostics: {} };
}
module.exports = { ORDER, assembleResult };
```

- [ ] **Step 4: Run the focused test**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: PASS for profile order, missing-property failure, and unsupported major.

- [ ] **Step 5: Commit the profile contract**

```bash
git add protocol/profiles/protocol-profiles.json protocol/profiles/load-profiles.cjs protocol/proof-result.cjs tests/app/open-witness-conformance.test.cjs
git commit -m "feat(protocol): add five-property profile contract"
```

### Task 2: Enforce chain continuity and explicit CLI modes

**Files:**
- Create: `protocol/chain-verify.cjs`
- Modify: `protocol/verify-ahd-seal.cjs` at `verifyChain`, `verifyFull`, exports, and CLI entry block
- Modify: `tests/app/open-witness-conformance.test.cjs`

**Interfaces:**
- Consumes: ordered block arrays and existing `verify()` integrity function.
- Produces: `verifyContinuity(blocks)` and CLI flags `--record`, `--package`, `--chain`, `--json`.

- [ ] **Step 1: Add failing continuity and CLI tests**

```js
const { spawnSync } = require("child_process");
const { verifyContinuity } = require(path.join(ROOT, "protocol", "chain-verify.cjs"));
const chain = require(path.join(ROOT, "protocol", "fixtures", "chain-3block.json"));
assert.strictEqual(verifyContinuity(chain).status, "valid");
const skipped = JSON.parse(JSON.stringify(chain));
skipped[1].record.seq += 1;
skipped[1].record.chain.seq += 1;
assert.strictEqual(verifyContinuity(skipped).code, "SEQUENCE_GAP");
const wrongEnvelope = JSON.parse(JSON.stringify(chain));
wrongEnvelope[1].record.chain.seq = wrongEnvelope[1].record.seq + 1;
assert.strictEqual(verifyContinuity(wrongEnvelope).code, "SEQUENCE_ENVELOPE_MISMATCH");

const cli = spawnSync(process.execPath, [
  path.join(ROOT, "protocol", "verify-ahd-seal.cjs"), "--chain",
  path.join(ROOT, "protocol", "fixtures", "chain-3block.json"), "--json"
], { encoding: "utf8" });
assert.strictEqual(cli.status, 0, cli.stderr);
assert.strictEqual(JSON.parse(cli.stdout).properties.continuity.status, "valid");
```

- [ ] **Step 2: Run and confirm strict checks are absent**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: FAIL because `chain-verify.cjs` is absent or the CLI rejects the chain array.

- [ ] **Step 3: Implement strict continuity**

```js
// protocol/chain-verify.cjs
"use strict";
function bad(code, index) { return { status: "invalid", code, index }; }
function fields(block) {
  var record = block.record || block.canonical_record || block;
  var chain = record.chain || {};
  return {
    seq: block.seq == null ? record.seq : block.seq,
    canonicalSeq: chain.seq == null ? record.seq : chain.seq,
    previousSeal: block.previous_seal == null ? chain.prev : block.previous_seal,
    sealedSeal: block.sealed_seal == null ? record.sealed_seal : block.sealed_seal
  };
}
function verifyContinuity(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return { status: "missing", code: "CHAIN_MISSING" };
  for (let i = 0; i < blocks.length; i += 1) {
    const block = fields(blocks[i]);
    const prior = i > 0 ? fields(blocks[i - 1]) : null;
    if (!Number.isInteger(block.seq)) return bad("SEQUENCE_INVALID", i);
    if (block.canonicalSeq !== block.seq) return bad("SEQUENCE_ENVELOPE_MISMATCH", i);
    if (prior && block.seq !== prior.seq + 1) return bad("SEQUENCE_GAP", i);
    if (prior && block.previousSeal !== prior.sealedSeal) return bad("PREVIOUS_SEAL_MISMATCH", i);
  }
  return { status: "valid", code: "OK" };
}
module.exports = { verifyContinuity };
```

In `protocol/verify-ahd-seal.cjs`, add exact mode parsing before reading the input:

```js
function parseCli(argv) {
  const modes = ["--record", "--package", "--chain"].filter((flag) => argv.indexOf(flag) >= 0);
  if (modes.length !== 1) throw new Error("USAGE_MODE_REQUIRED");
  const flag = modes[0], index = argv.indexOf(flag), file = argv[index + 1];
  if (!file || file.startsWith("--")) throw new Error("USAGE_PATH_REQUIRED");
  return { mode: flag.slice(2), file, json: argv.indexOf("--json") >= 0 };
}
```

Route `--chain` through `verifyContinuity`, route `--package` through the profiled verifier created in later tasks,
and retain `--record` legacy behavior. A top-level array under any other mode returns exit `2`.

- [ ] **Step 4: Run legacy, chain, and focused suites**

Run: `node protocol/verify-ahd-seal.cjs --record protocol/fixtures/main-record.json --json`
Expected: exit `0` and legacy integrity valid.

Run: `node protocol/verify-ahd-seal.cjs --chain protocol/fixtures/chain-3block.json --json`
Expected: exit `0` and continuity valid.

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: PASS.

- [ ] **Step 5: Commit strict continuity and CLI routing**

```bash
git add protocol/chain-verify.cjs protocol/verify-ahd-seal.cjs tests/app/open-witness-conformance.test.cjs
git commit -m "feat(protocol): verify strict chain continuity"
```

### Task 3: Add the timestamp adapter boundary and fail-closed profiles

**Files:**
- Create: `protocol/timestamp/adapter-contract.cjs`
- Create: `protocol/timestamp/fixture-adapter.cjs`
- Create: `protocol/profiles/timestamp-trust-profiles.json`
- Modify: `protocol/verify-ahd-seal.cjs`
- Modify: `tests/app/open-witness-conformance.test.cjs`

**Interfaces:**
- Consumes: `tokenDer`, raw expected imprint bytes, fixed `asOf`, and an explicit trust profile.
- Produces: async `verifyTimestampProperty(attestation, sealedSealHex, adapter, trustProfile, asOf)`.

- [ ] **Step 1: Write failing imprint and missing-adapter tests**

```js
const { verifyTimestampProperty } = require(path.join(ROOT, "protocol", "timestamp", "adapter-contract.cjs"));
(async () => {
  const seen = [];
  const adapter = { verifyTimestamp: async (input) => {
    seen.push(input);
    return { status: "valid", code: "OK", genTime: "2026-07-14T00:00:00Z", tsaKeyId: "fixture-tsa-v1" };
  }};
  const seal = "00".repeat(32);
  const good = await verifyTimestampProperty(
    { token_base64: Buffer.from("fixture").toString("base64"), trust_profile_id: "fixture-tsa-v1" },
    seal, adapter, { environment: "fixture" }, "2026-07-14T00:00:00Z"
  );
  assert.strictEqual(good.status, "valid");
  assert.strictEqual(seen[0].expectedImprint.equals(Buffer.alloc(32)), true);
  assert.strictEqual((await verifyTimestampProperty(null, seal, adapter, {}, "2026-07-14T00:00:00Z")).code, "TIMESTAMP_MISSING");
  assert.strictEqual((await verifyTimestampProperty({}, seal, null, {}, "2026-07-14T00:00:00Z")).code, "TIMESTAMP_ADAPTER_UNAPPROVED");
})().catch((error) => { console.error(error); process.exitCode = 1; });
```

- [ ] **Step 2: Run and confirm the adapter contract is absent**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: FAIL with a missing `adapter-contract.cjs` module.

- [ ] **Step 3: Implement the narrow adapter contract**

```js
// protocol/timestamp/adapter-contract.cjs
"use strict";
const ALLOWED = ["valid", "invalid", "missing", "unsupported"];
function fail(status, code) { return { status, code }; }
async function verifyTimestampProperty(attestation, sealedSealHex, adapter, trustProfile, asOf) {
  if (!attestation || !attestation.token_base64) return fail("missing", "TIMESTAMP_MISSING");
  if (!/^[0-9a-f]{64}$/.test(sealedSealHex || "")) return fail("invalid", "SEALED_SEAL_INVALID");
  if (!adapter || typeof adapter.verifyTimestamp !== "function") return fail("unsupported", "TIMESTAMP_ADAPTER_UNAPPROVED");
  const result = await adapter.verifyTimestamp({
    tokenDer: Buffer.from(attestation.token_base64, "base64"),
    expectedImprint: Buffer.from(sealedSealHex, "hex"),
    trustProfile,
    asOf
  });
  if (!result || ALLOWED.indexOf(result.status) < 0) return fail("invalid", "TIMESTAMP_ADAPTER_RESULT_INVALID");
  return { status: result.status, code: String(result.code || "UNSPECIFIED") };
}
module.exports = { verifyTimestampProperty };
```

The fixture adapter must cryptographically bind its fixture token to `expectedImprint` with a fixture-only public
key and must reject any trust profile whose `environment` is not `fixture`. It is orchestration evidence only.

- [ ] **Step 4: Prove missing evidence cannot pass**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: PASS; missing timestamp is `missing`, absent approved adapter is `unsupported`, and neither yields `ok`.

Run: `node tests/app/seal-properties.test.cjs`
Expected: PASS with existing four-property mechanics unchanged.

- [ ] **Step 5: Commit the fail-closed adapter boundary**

```bash
git add protocol/timestamp protocol/profiles/timestamp-trust-profiles.json protocol/verify-ahd-seal.cjs tests/app/open-witness-conformance.test.cjs
git commit -m "feat(protocol): add trusted-time adapter boundary"
```

### Task 4: Integrate the approved RFC-3161/CMS adapter

**External gate:** Begin this task only after `docs/DECISIONS-FOR-MARWAN.md` records the exact module/package,
version, integrity hash, license, security review owner, accredited TSA/trust roots, allowed policy OIDs, and
production/fixture separation. The recorded adapter must verify imprint, signed attributes, CMS signature,
certificate chain, EKU/purpose, policy, effective interval, and revocation evidence. Do not substitute the fixture
adapter or a free TSA.

**Files:**
- Create: `protocol/timestamp/approved-adapter.cjs`
- Create after approval: `protocol/profiles/timestamp-adapter-approved.json`
- Create: `protocol/fixtures/conformance/valid-trusted-time.json`
- Create: `protocol/fixtures/conformance/tampered-trusted-time.json`
- Create: `protocol/fixtures/conformance/untrusted-tsa.json`
- Modify: `protocol/profiles/timestamp-trust-profiles.json`
- Modify: `tests/app/open-witness-conformance.test.cjs`

**Interfaces:**
- Consumes: the exact adapter approved by the owner/security record and offline RFC-3161 DER fixtures.
- Produces: the `verifyTimestamp(input)` contract from Task 3 with stable result codes.

- [ ] **Step 1: Add failing real-token tests**

```js
const { loadApprovedAdapter } = require(path.join(ROOT, "protocol", "timestamp", "approved-adapter.cjs"));
const approvedConfig = require(path.join(ROOT, "protocol", "profiles", "timestamp-adapter-approved.json"));
const approved = loadApprovedAdapter(approvedConfig, ROOT);
const validTime = require(path.join(ROOT, "protocol", "fixtures", "conformance", "valid-trusted-time.json"));
const tamperedTime = require(path.join(ROOT, "protocol", "fixtures", "conformance", "tampered-trusted-time.json"));
const untrusted = require(path.join(ROOT, "protocol", "fixtures", "conformance", "untrusted-tsa.json"));
(async () => {
  assert.strictEqual((await approved.verifyTimestamp(validTime.adapter_input)).status, "valid");
  assert.strictEqual((await approved.verifyTimestamp(tamperedTime.adapter_input)).code, "IMPRINT_MISMATCH");
  assert.strictEqual((await approved.verifyTimestamp(untrusted.adapter_input)).code, "TSA_UNTRUSTED");
})().catch((error) => { console.error(error); process.exitCode = 1; });
```

- [ ] **Step 2: Run against the approved adapter dependency and confirm the wrapper is absent**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: FAIL with missing `approved-adapter.cjs` while the approved dependency itself is installed at the
recorded version.

- [ ] **Step 3: Implement a zero-policy wrapper around the approved dependency**

```js
// protocol/timestamp/approved-adapter.cjs
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
function loadApprovedAdapter(config, root) {
  if (!config || config.schema !== "ahd-timestamp-adapter-approval-v1") throw new Error("TIMESTAMP_ADAPTER_CONFIG_INVALID");
  if (config.environment !== "production" || !config.approval_id) throw new Error("TIMESTAMP_ADAPTER_NOT_APPROVED");
  const modulePath = path.resolve(root, config.module_path);
  const digest = crypto.createHash("sha256").update(fs.readFileSync(modulePath)).digest("hex");
  if (digest !== config.module_sha256) throw new Error("TIMESTAMP_ADAPTER_DIGEST_MISMATCH");
  const driver = require(modulePath);
  if (!driver || typeof driver.verify !== "function") throw new Error("TIMESTAMP_ADAPTER_API_INVALID");
  return { verifyTimestamp: async function (input) {
    const value = await driver.verify({
    token: input.tokenDer,
    expectedImprint: input.expectedImprint,
    trustAnchors: input.trustProfile.trust_anchors,
    allowedPolicyOids: input.trustProfile.allowed_policy_oids,
    verificationTime: input.asOf,
    requireTimestampingEku: true,
    requireEssCertIdV2: true
  });
    if (!value.signatureValid) return { status: "invalid", code: "TIMESTAMP_SIGNATURE_INVALID" };
    if (!value.imprintValid) return { status: "invalid", code: "IMPRINT_MISMATCH" };
    if (!value.chainTrusted) return { status: "invalid", code: "TSA_UNTRUSTED" };
    if (!value.policyAllowed) return { status: "invalid", code: "TSA_POLICY_REJECTED" };
    return { status: "valid", code: "OK", genTime: value.genTime, tsaKeyId: value.tsaKeyId };
  }};
}
module.exports = { loadApprovedAdapter };
```

After the owner gate, `timestamp-adapter-approved.json` records the decision's exact `module_path`, file SHA-256,
package name/version/license, `approval_id`, and `environment: "production"`. The approved module implements the
shown driver input/output. If its upstream API differs, a reviewed deployment adapter maps it to this exact driver
contract and the committed SHA-256 binds that adapter byte-for-byte.

- [ ] **Step 4: Run real-token and negative fixtures offline**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: PASS for valid, one-byte imprint tamper, bad CMS signature, untrusted root, wrong EKU, rejected policy,
expired/revoked trust metadata, and deterministic repeat verification.

- [ ] **Step 5: Commit only after the external gate and tests pass**

```bash
git add docs/DECISIONS-FOR-MARWAN.md protocol/timestamp/approved-adapter.cjs protocol/profiles/timestamp-adapter-approved.json protocol/profiles/timestamp-trust-profiles.json protocol/fixtures/conformance tests/app/open-witness-conformance.test.cjs
git commit -m "feat(protocol): verify approved RFC3161 timestamps"
```

### Task 5: Add issuer and checkpoint lifecycle verification

**Files:**
- Create: `protocol/profiles/issuer-profiles.json`
- Create: `protocol/issuer-registry.cjs`
- Create: `protocol/checkpoint-registry.cjs`
- Modify: `protocol/verify-ahd-seal.cjs`
- Modify: `tests/app/open-witness-conformance.test.cjs`

**Interfaces:**
- Consumes: existing `verifyBankSignature()` and `verifyMerkleInclusion()` mechanics plus explicit registries.
- Produces: `verifyIssuerLifecycle(proof, registry, attestedAt)` and `verifyAuthenticatedCheckpoint(proof, registry)`.

- [ ] **Step 1: Write failing lifecycle tests**

```js
const { verifyIssuerLifecycle } = require(path.join(ROOT, "protocol", "issuer-registry.cjs"));
const active = { issuer_id: "ahd-fixture", verification_method: "ahd-fixture#2026-01", cryptosuite: "eddsa-jcs-2022", environment: "fixture", effective_from: "2026-01-01T00:00:00Z", retired_at: "2026-08-01T00:00:00Z", compromised_at: null };
assert.strictEqual(verifyIssuerLifecycle({ issuer_id: active.issuer_id, verification_method: active.verification_method, cryptosuite: active.cryptosuite }, [active], "2026-07-14T00:00:00Z").status, "valid");
assert.strictEqual(verifyIssuerLifecycle({ issuer_id: active.issuer_id, verification_method: active.verification_method, cryptosuite: "wrong" }, [active], "2026-07-14T00:00:00Z").code, "CRYPTOSUITE_MISMATCH");
assert.strictEqual(verifyIssuerLifecycle({ issuer_id: active.issuer_id, verification_method: active.verification_method, cryptosuite: active.cryptosuite }, [active], "2026-09-01T00:00:00Z").code, "ISSUED_AFTER_RETIREMENT");
```

- [ ] **Step 2: Run and confirm registry enforcement is absent**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: FAIL with missing issuer/checkpoint registry modules.

- [ ] **Step 3: Implement exact lifecycle and checkpoint checks**

```js
// protocol/issuer-registry.cjs
"use strict";
function verifyIssuerLifecycle(proof, registry, attestedAt) {
  const item = (registry || []).find((x) => x.issuer_id === proof.issuer_id && x.verification_method === proof.verification_method);
  if (!item) return { status: "unsupported", code: "ISSUER_METHOD_UNKNOWN" };
  if (item.cryptosuite !== proof.cryptosuite) return { status: "invalid", code: "CRYPTOSUITE_MISMATCH" };
  if (attestedAt < item.effective_from) return { status: "invalid", code: "ISSUED_BEFORE_KEY_EFFECTIVE" };
  if (item.retired_at && attestedAt >= item.retired_at) return { status: "invalid", code: "ISSUED_AFTER_RETIREMENT" };
  if (item.compromised_at && attestedAt >= item.compromised_at) return { status: "invalid", code: "KEY_COMPROMISED" };
  return { status: "valid", code: "OK", profile: item };
}
module.exports = { verifyIssuerLifecycle };
```

The checkpoint registry uses the same pattern: exact `log_id`, `verification_method`, algorithm, effective
interval, signed tree size/root, and signature. A mathematically valid Merkle path with an unauthenticated root
returns `CHECKPOINT_UNAUTHENTICATED`.

- [ ] **Step 4: Run focused and legacy suites**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: PASS for active, retired historical, issued-after-retirement, compromised, wrong-suite, wrong-key,
unauthenticated checkpoint, and valid checkpoint cases.

Run: `node tests/app/seal-properties.test.cjs`
Expected: PASS; existing Ed25519 and Merkle mechanics remain green.

- [ ] **Step 5: Commit lifecycle policy**

```bash
git add protocol/profiles/issuer-profiles.json protocol/issuer-registry.cjs protocol/checkpoint-registry.cjs protocol/verify-ahd-seal.cjs tests/app/open-witness-conformance.test.cjs
git commit -m "feat(protocol): enforce issuer and checkpoint lifecycle"
```

### Task 6: Persist the complete conformance fixture matrix

**Files:**
- Create: `protocol/fixtures/conformance/valid-five-property.json`
- Create: `protocol/fixtures/conformance/tampered-integrity.json`
- Create: `protocol/fixtures/conformance/tampered-continuity.json`
- Create: `protocol/fixtures/conformance/tampered-trusted-time.json`
- Create: `protocol/fixtures/conformance/tampered-issuer-signature.json`
- Create: `protocol/fixtures/conformance/tampered-merkle-inclusion.json`
- Create: `protocol/fixtures/conformance/missing-each-property.json`
- Create: `protocol/fixtures/conformance/unsupported-major.json`
- Create: `protocol/conformance/fixture-manifest.json`
- Modify: `tests/app/open-witness-conformance.test.cjs`

**Interfaces:**
- Consumes: verifier/registries from Tasks 1-5.
- Produces: immutable fixture manifest with expected property status/code and file SHA-256.

- [ ] **Step 1: Write a failing manifest-driven test**

```js
const fs = require("fs");
const crypto = require("crypto");
const manifest = require(path.join(ROOT, "protocol", "conformance", "fixture-manifest.json"));
(async () => {
  for (const entry of manifest.fixtures) {
    const bytes = fs.readFileSync(path.join(ROOT, entry.path));
    assert.strictEqual(crypto.createHash("sha256").update(bytes).digest("hex"), entry.sha256);
    const actual = await verifyPackage(JSON.parse(bytes.toString("utf8")), dependencies);
    assert.strictEqual(actual.properties[entry.property].status, entry.expected_status, entry.path);
    assert.strictEqual(actual.properties[entry.property].code, entry.expected_code, entry.path);
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
```

- [ ] **Step 2: Run and confirm persistent fixtures are absent**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: FAIL with missing `fixture-manifest.json` or fixture files.

- [ ] **Step 3: Generate each fixture from one valid package with one explicit mutation**

Use `protocol/conformance/build-fixtures.cjs` with a fixed fixture seed, fixed times, fixture-only keys, and one
named mutation per output. The builder writes JSON with sorted two-space indentation and a terminal newline, then
writes the manifest hash. It never imports `app/`, `demo/`, or server code. The test source-scans those forbidden
imports.

- [ ] **Step 4: Run the manifest and CLI matrix twice**

Run: `node protocol/conformance/build-fixtures.cjs --check`
Expected: exit `0`; regenerated bytes equal committed bytes.

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: PASS twice with identical JSON results and exactly one primary failure per tampered fixture.

- [ ] **Step 5: Commit persistent conformance evidence**

```bash
git add protocol/fixtures/conformance protocol/conformance/build-fixtures.cjs protocol/conformance/fixture-manifest.json tests/app/open-witness-conformance.test.cjs
git commit -m "test(protocol): persist five-property tamper fixtures"
```

### Task 7: Build the clean-room second implementation and exchange records

**Files:**
- Create: `protocol/issuers/reference-2/issue.cjs`
- Create: `protocol/issuers/reference-2/verify.cjs`
- Create: `protocol/issuers/reference-2/README.md`
- Create: `protocol/issuers/reference-2/fixtures/record-1.json`
- Create: `protocol/issuers/reference-2/fixtures/record-2.json`
- Create: `protocol/issuers/reference-2/fixtures/record-3.json`
- Create: `protocol/conformance/run-conformance.cjs`
- Create: `protocol/conformance/results/exchange-v1.json`
- Modify: `tests/app/open-witness-conformance.test.cjs`

**Interfaces:**
- Consumes: the published contracts and fixture files only.
- Produces: `reference-2 issue.cjs --fixture <id>` packages and `verify.cjs --package <path> --json` results.

- [ ] **Step 1: Write failing independence and three-by-three exchange tests**

```js
const forbidden = ["app/", "demo/", "engine.js", "verify-ahd-seal.cjs"];
for (const file of ["issue.cjs", "verify.cjs"]) {
  const src = fs.readFileSync(path.join(ROOT, "protocol", "issuers", "reference-2", file), "utf8");
  forbidden.forEach((token) => assert.strictEqual(src.includes(token), false, `${file} imports ${token}`));
}
const exchange = spawnSync(process.execPath, [path.join(ROOT, "protocol", "conformance", "run-conformance.cjs"), "--json"], { encoding: "utf8" });
assert.strictEqual(exchange.status, 0, exchange.stderr);
const summary = JSON.parse(exchange.stdout);
assert.strictEqual(summary.ahd_accepts_reference2, 3);
assert.strictEqual(summary.reference2_accepts_ahd, 3);
```

- [ ] **Step 2: Run and confirm the clean-room implementation is absent**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: FAIL with missing reference-2 files.

- [ ] **Step 3: Implement independently from the written contract**

The issuer must contain its own canonical serializer, SHA-256 composition, Ed25519 fixture key, Merkle builder,
and package writer. The verifier must contain its own parser and five-property dispatch. It may share Node built-ins
and the externally approved timestamp adapter package, but no Ahd implementation module or verifier helper.

`run-conformance.cjs` executes both CLIs as child processes, captures exact JSON, checks three fixtures in each
direction, sorts results by implementation/fixture ID, and writes `exchange-v1.json`.

- [ ] **Step 4: Run the exchange and source isolation checks**

Run: `node protocol/conformance/run-conformance.cjs --json`
Expected: exit `0`, `ahd_accepts_reference2: 3`, `reference2_accepts_ahd: 3`.

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: PASS including forbidden-import and unsupported-major cases.

- [ ] **Step 5: Commit interoperability proof**

```bash
git add protocol/issuers/reference-2 protocol/conformance/run-conformance.cjs protocol/conformance/results/exchange-v1.json tests/app/open-witness-conformance.test.cjs
git commit -m "feat(protocol): prove clean-room interoperability"
```

### Task 8: Publish governance only after the owner license gate

**External gate:** The owner records specification license, code license, governance authority, security contact,
deprecation window, and conformance release authority in `docs/DECISIONS-FOR-MARWAN.md`.

**Files:**
- Create: `protocol/GOVERNANCE.md`
- Create: `protocol/SECURITY.md`
- Create: `protocol/CONFORMANCE.md`
- Create: `protocol/ALGORITHM-REGISTRY.md`
- Create after approval: `protocol/LICENSE-SPECIFICATION`
- Create after approval: `protocol/LICENSE-CODE`
- Modify: `docs/specs/open-witness-v1.md`
- Modify: `docs/evidence/PATH-TO-PRODUCTION.md`
- Modify: `_meta/OPEN-ITEMS.md`
- Modify: `tests/app/open-witness-conformance.test.cjs`

**Interfaces:**
- Consumes: owner decisions and implemented profile/conformance registries.
- Produces: published lifecycle/security/conformance documents with no unresolved ownership or licensing marker.

- [ ] **Step 1: Add failing governance completeness checks**

```js
for (const rel of [
  "protocol/GOVERNANCE.md", "protocol/SECURITY.md", "protocol/CONFORMANCE.md",
  "protocol/ALGORITHM-REGISTRY.md", "protocol/LICENSE-SPECIFICATION", "protocol/LICENSE-CODE"
]) assert.strictEqual(fs.existsSync(path.join(ROOT, rel)), true, rel);
const governance = fs.readFileSync(path.join(ROOT, "protocol", "GOVERNANCE.md"), "utf8");
for (const heading of ["Change authority", "Version lifecycle", "Errata", "Deprecation", "Conformance releases"])
  assert.strictEqual(governance.includes(heading), true, heading);
```

- [ ] **Step 2: Run only after the owner gate and confirm documents are absent**

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected before writing: FAIL on the first absent governance/license file.

- [ ] **Step 3: Write documents from recorded decisions and live registries**

State the five-property status accurately, name the security contact/channel, define compatible minor and
incompatible major changes, retain historical verification, define algorithm retirement, and link the exact
conformance manifest. Correct old claims that multi-block/Merkle are absent or that only three properties exist.
Do not describe fixture TSA/keys as production.

- [ ] **Step 4: Run focused, app, full, and tripwire gates**

Run: `node tests/app/open-witness.test.cjs`
Expected: PASS.

Run: `node tests/app/seal-properties.test.cjs`
Expected: PASS.

Run: `node tests/app/open-witness-conformance.test.cjs`
Expected: PASS.

Run: `node tests/app/run-app-tests.cjs`
Expected: all app suites green.

Run: `cd tests && node run-all.cjs`
Expected: `AHD GATE` green with zero failures and demo tripwire intact; record the live assertion count.

- [ ] **Step 5: Commit governance and corrected evidence state**

```bash
git add docs/DECISIONS-FOR-MARWAN.md protocol/GOVERNANCE.md protocol/SECURITY.md protocol/CONFORMANCE.md protocol/ALGORITHM-REGISTRY.md protocol/LICENSE-SPECIFICATION protocol/LICENSE-CODE docs/specs/open-witness-v1.md docs/evidence/PATH-TO-PRODUCTION.md _meta/OPEN-ITEMS.md tests/app/open-witness-conformance.test.cjs
git commit -m "docs(protocol): publish approved Open-Witness governance"
```

## Plan Self-Review

- **Spec coverage:** Tasks 1-8 cover FR-001 through FR-004, FR-014, FR-015, protocol portions of FR-017/FR-018,
  and SC-001/SC-002/SC-005/SC-008. Product and mobile requirements are delegated to their named sibling plans.
- **External-value handling:** The adapter loader is complete without choosing a vendor. Execution creates the
  production config only from the recorded owner/security decision and pins the reviewed adapter by SHA-256. No
  synthetic default is permitted.
- **Type consistency:** Property names, statuses, profile IDs, timestamp input, and result fields match the Spec Kit
  contracts and data model.
- **Rollback:** New issuance can be disabled while legacy profiles, old keys, old fixtures, and verifier versions
  remain available. No golden record is resealed.
