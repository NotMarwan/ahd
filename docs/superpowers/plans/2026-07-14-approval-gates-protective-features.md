# Approval Gates and Protective Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add deterministic, fail-closed approval infrastructure and use it to activate only explicitly approved mercy, release, Circle, duress, collusion, identity/state, and aggregate-analytics profiles.

**Architecture:** Preserve every existing golden or prototype primitive and place new pure adapters around it. Approval, party consent, identity binding, state migration, and rollback are separate typed contracts; missing or invalid authority evidence produces a standard inert result and never calls mechanism logic.

**Tech Stack:** Browser/Node dual-module JavaScript, injected `app/engine.js` SHA-256 and integer-money helpers, Node CommonJS tests, existing innerHTML screen registry only after capability approval.

## Global Constraints

- Never modify `demo/index.html`, golden functions, golden vectors, `app/engine.js`, `app/features/rifq.js`, or the existing Circle pledge prototype.
- No capability activates from repository prose, feature flags, consent alone, review badges, or test artifacts.
- Test approval artifacts use `authority_type: "fixture"` and activate only `environment: "test"` profiles.
- Every production capability requires its exact named approval artifact and exact enabled profile.
- Missing, rejected, expired, revoked, superseded, tampered, wrong-environment, profile-mismatched, or condition-mismatched approval returns `INERT` and zero events/state/money.
- Money is integer halalas; original principal is immutable; forgiveness cannot exceed remaining principal.
- Duress/collusion modules emit neutral evidence and holds only: no guilt, fraud, score, probability, rating, underwriting, or verdict.
- `asOf` is caller-supplied. Logic contains no clock, randomness, locale formatting, or network primitive.
- Rollback disables future actions and never deletes witnessed history, revives forgiven principal, rewrites IDs, or reseals records.
- Judge-visible screens are wired only after the corresponding real approval exists and pass `docs/JUDGE-LENS.md`.

---

## File Structure

| Path | Responsibility |
|---|---|
| `app/features/decision-registry.js` | Canonical decision IDs and non-destructive legacy aliases |
| `app/features/approval-gate.js` | Artifact validation, registry compilation, activation, inert execution |
| `app/features/rifq-approved.js` | Conjunctive approval wrapper around existing Rifq |
| `app/features/circle-mode-b.js` | Exact approved pledge/custody profile execution |
| `app/features/borrower-release.js` | Request/consent/forgiveness state machine |
| `app/features/duress.js` | Neutral duress signal and hold events |
| `app/features/collusion-signal.js` | Privacy-safe structural signal and review hold |
| `app/features/identity-state.js` | URN validation, legacy binding, versioned state mapping |
| `app/features/analytics-public.js` | K-floor aggregate-only public output |
| `tests/app/fixtures/approvals/` | Fixture-only approval evidence |
| `tests/app/*-approval.test.cjs` | Inert, active, conservation, lifecycle, rollback tests |
| `app/screens/` | Contextual surfaces added only for actually approved capabilities |

### Task 1: Resolve decision-ID collisions with a checked alias registry

**Files:**
- Create: `app/features/decision-registry.js`
- Create: `tests/app/decision-registry.test.cjs`
- Modify: `docs/DECISIONS-FOR-MARWAN.md`

**Interfaces:**
- Consumes: canonical `DEC-*` entries with `legacy_ids`.
- Produces: `compileDecisionRegistry(entries)` and `resolveDecisionId(registry, id)`.

- [ ] **Step 1: Write failing uniqueness and alias tests**

```js
const assert = require("assert");
const path = require("path");
const Decisions = require(path.join(__dirname, "..", "..", "app", "features", "decision-registry.js"));
const entries = [
  { decision_id: "DEC-OPS-DEMO-FATE-V1", legacy_ids: ["D-4:demo"] },
  { decision_id: "DEC-SHARIAH-INHERITANCE-V1", legacy_ids: ["D-4:inheritance"] },
  { decision_id: "DEC-SHARIAH-CIRCLE-MODE-B-V1", legacy_ids: ["D-3"] }
];
const registry = Decisions.compileDecisionRegistry(entries);
assert.strictEqual(Decisions.resolveDecisionId(registry, "D-3"), "DEC-SHARIAH-CIRCLE-MODE-B-V1");
assert.strictEqual(Decisions.resolveDecisionId(registry, "D-4"), null);
assert.throws(() => Decisions.compileDecisionRegistry([
  { decision_id: "DEC-OPS-A-V1", legacy_ids: ["D-4"] },
  { decision_id: "DEC-OPS-B-V1", legacy_ids: ["D-4"] }
]), /DECISION_ALIAS_COLLISION/);
```

- [ ] **Step 2: Run and confirm the registry module is absent**

Run: `node tests/app/decision-registry.test.cjs`
Expected: FAIL with missing `decision-registry.js`.

- [ ] **Step 3: Implement the complete registry**

```js
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DecisionRegistry = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function validCanonical(id) { return /^DEC-[A-Z0-9]+-[A-Z0-9-]+-V[1-9]\d*$/.test(id || ""); }
  function compileDecisionRegistry(entries) {
    var canonical = {}, aliases = {};
    (entries || []).forEach(function (entry) {
      if (!validCanonical(entry.decision_id)) throw new Error("DECISION_ID_INVALID");
      if (canonical[entry.decision_id]) throw new Error("DECISION_ID_COLLISION");
      canonical[entry.decision_id] = entry;
      (entry.legacy_ids || []).forEach(function (alias) {
        if (aliases[alias] && aliases[alias] !== entry.decision_id) throw new Error("DECISION_ALIAS_COLLISION");
        aliases[alias] = entry.decision_id;
      });
    });
    return { canonical: canonical, aliases: aliases };
  }
  function resolveDecisionId(registry, id) {
    if (!registry || !id) return null;
    if (registry.canonical[id]) return id;
    return registry.aliases[id] || null;
  }
  return { validCanonical: validCanonical, compileDecisionRegistry: compileDecisionRegistry, resolveDecisionId: resolveDecisionId };
});
```

Record canonical IDs and scoped aliases in `docs/DECISIONS-FOR-MARWAN.md`. Preserve old prose; do not globally
replace historical `D-*` references. Reserve unique canonical IDs for borrower release, duress, and collusion,
but leave their decision status open until the named authority responds.

- [ ] **Step 4: Run registry and offline scans**

Run: `node tests/app/decision-registry.test.cjs`
Expected: PASS.

Run: `node tests/app/app-offline.test.cjs`
Expected: PASS; the new module has no nondeterministic/network token.

- [ ] **Step 5: Commit canonical decision identity**

```bash
git add app/features/decision-registry.js tests/app/decision-registry.test.cjs docs/DECISIONS-FOR-MARWAN.md
git commit -m "feat(governance): add collision-safe decision registry"
```

### Task 2: Implement deterministic approval validation and inert execution

**Files:**
- Create: `app/features/approval-gate.js`
- Create: `tests/app/approval-artifact.test.cjs`
- Create: `tests/app/fixtures/approvals/rifq-consent-approved.fixture.json`
- Create: `tests/app/fixtures/approvals/netting-approved.fixture.json`
- Create: `tests/app/fixtures/approvals/rejected.fixture.json`
- Create: `tests/app/fixtures/approvals/expired.fixture.json`

**Interfaces:**
- Consumes: `validateApprovalArtifact(artifact, expected, asOf, sha256)` inputs and Task 1 registry.
- Produces: `compileApprovalRegistry`, `resolveActivation`, `runApproved`, and the standard inert result.

- [ ] **Step 1: Write failing lifecycle and execution-spy tests**

```js
const assert = require("assert");
const path = require("path");
const E = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const Gate = require(path.join(__dirname, "..", "..", "app", "features", "approval-gate.js"));
const AS_OF = "2026-07-14T00:00:00Z";
const fixture = require("./fixtures/approvals/rifq-consent-approved.fixture.json");
const expected = { schema: "ahd-approval-artifact-v1", environment: "test", capability_id: "rifq_grace", enabled_profile: "creditor_consent_required", authority_types: ["fixture"], condition_keys: ["blanket_consent_allowed"] };
assert.strictEqual(Gate.validateApprovalArtifact(fixture, expected, AS_OF, E.sha256).status, "active");
const expired = Object.assign({}, fixture, { expires_at: "2026-07-13T00:00:00Z" });
expired.artifact_digest = Gate.computeArtifactDigest(expired, E.sha256);
assert.strictEqual(Gate.validateApprovalArtifact(expired, expected, AS_OF, E.sha256).status, "expired");
const registry = Gate.compileApprovalRegistry([fixture], { "rifq_grace|creditor_consent_required": expected }, AS_OF, E.sha256);
assert.strictEqual(Gate.resolveActivation(registry, "rifq_grace", "creditor_consent_required", [{ approval_id: fixture.approval_id, enabled_profile: "creditor_consent_required" }], { blanket_consent_allowed: true }).outcome, "INERT");
let calls = 0;
const inert = Gate.runApproved(Gate.inert("APPROVAL_MISSING", "rifq_grace"), {}, function () { calls += 1; });
assert.strictEqual(calls, 0);
assert.deepStrictEqual(inert.monetaryMoves, []);
```

- [ ] **Step 2: Run and confirm the approval gate is absent**

Run: `node tests/app/approval-artifact.test.cjs`
Expected: FAIL with missing `approval-gate.js`.

- [ ] **Step 3: Implement fixed-field hashing and fail-closed activation**

```js
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ApprovalGate = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var FIELDS = ["schema", "approval_id", "legacy_ids", "capability_id", "authority", "exact_question", "decision", "enabled_profile", "conditions", "source_ref", "source_digest", "effective_from", "expires_at", "revoked_at", "supersedes", "environment"];
  function stable(value) {
    if (Array.isArray(value)) return value.map(stable);
    if (value && typeof value === "object") {
      var ordered = {};
      Object.keys(value).sort().forEach(function (key) { ordered[key] = stable(value[key]); });
      return ordered;
    }
    return value;
  }
  function canonicalArtifact(a) {
    var out = {};
    FIELDS.forEach(function (key) { out[key] = a[key] == null ? null : a[key]; });
    return JSON.stringify(stable(out));
  }
  function computeArtifactDigest(a, sha256) { return sha256(canonicalArtifact(a)); }
  function status(name, code) { return { status: name, code: code }; }
  function validateApprovalArtifact(a, expected, asOf, sha256) {
    if (!a) return status("missing", "APPROVAL_MISSING");
    if (a.schema !== expected.schema) return status("invalid", "APPROVAL_SCHEMA_MISMATCH");
    if (a.environment !== expected.environment) return status("invalid", "APPROVAL_ENVIRONMENT_MISMATCH");
    if (a.capability_id !== expected.capability_id || a.enabled_profile !== expected.enabled_profile) return status("invalid", "APPROVAL_PROFILE_MISMATCH");
    if (!a.authority || expected.authority_types.indexOf(a.authority.authority_type) < 0) return status("invalid", "APPROVAL_AUTHORITY_INVALID");
    if (!/^[0-9a-f]{64}$/.test(a.source_digest || "")) return status("invalid", "APPROVAL_SOURCE_DIGEST_INVALID");
    var allowedConditions = expected.condition_keys || [];
    for (var c = 0; c < (a.conditions || []).length; c += 1) {
      if (allowedConditions.indexOf(a.conditions[c].key) < 0 || a.conditions[c].operator !== "eq") return status("invalid", "APPROVAL_CONDITION_UNSUPPORTED");
    }
    if (computeArtifactDigest(a, sha256) !== a.artifact_digest) return status("tampered", "APPROVAL_DIGEST_MISMATCH");
    if (a.decision !== "APPROVED") return status("rejected", "APPROVAL_REJECTED");
    if (asOf < a.effective_from) return status("pending", "APPROVAL_NOT_EFFECTIVE");
    if (a.expires_at && asOf >= a.expires_at) return status("expired", "APPROVAL_EXPIRED");
    if (a.revoked_at && asOf >= a.revoked_at) return status("revoked", "APPROVAL_REVOKED");
    return status("active", "OK");
  }
  function compileApprovalRegistry(items, expectations, asOf, sha256) {
    var active = {}, results = {};
    (items || []).forEach(function (item) {
      var expected = expectations[item.capability_id + "|" + item.enabled_profile];
      var result = expected ? validateApprovalArtifact(item, expected, asOf, sha256) : status("invalid", "APPROVAL_EXPECTATION_MISSING");
      results[item.approval_id] = result;
      if (result.status === "active") active[item.approval_id] = item;
    });
    return { active: active, results: results, asOf: asOf };
  }
  function inert(reason, capabilityId) { return { outcome: "INERT", reason: reason, capability_id: capabilityId, enabled_profile: null, approval_refs: [], events: [], stateChanges: [], monetaryMoves: [] }; }
  function resolveActivation(registry, capabilityId, requestedProfile, requirements, context) {
    var refs = [], required = requirements || [], values = context || {};
    for (var i = 0; i < required.length; i += 1) {
      var req = required[i], artifact = registry.active[req.approval_id];
      if (!artifact) return inert("APPROVAL_MISSING", capabilityId);
      if (artifact.enabled_profile !== req.enabled_profile) return inert("APPROVAL_PROFILE_MISMATCH", capabilityId);
      for (var c = 0; c < (artifact.conditions || []).length; c += 1) {
        var condition = artifact.conditions[c];
        if (condition.operator !== "eq" || values[condition.key] !== condition.value) return inert("APPROVAL_CONDITION_MISMATCH", capabilityId);
      }
      refs.push(req.approval_id);
    }
    return { outcome: "ACTIVE", reason: "OK", capability_id: capabilityId, enabled_profile: requestedProfile, approval_refs: refs, events: [], stateChanges: [], monetaryMoves: [] };
  }
  function runApproved(activation, input, execute) { return activation.outcome === "ACTIVE" ? execute(input, activation) : activation; }
  return { canonicalArtifact: canonicalArtifact, computeArtifactDigest: computeArtifactDigest, validateApprovalArtifact: validateApprovalArtifact, compileApprovalRegistry: compileApprovalRegistry, inert: inert, resolveActivation: resolveActivation, runApproved: runApproved };
});
```

Generate fixture digests with `computeArtifactDigest`; each fixture authority is visibly `fixture`, its environment
is `test`, and its source path sits under `tests/app/fixtures/`.

- [ ] **Step 4: Run lifecycle, mutation, and offline tests**

Run: `node tests/app/approval-artifact.test.cjs`
Expected: PASS for missing, rejected, not-effective, expired, revoked, tampered, wrong profile/environment/authority,
unknown condition, duplicate ID, and execution-spy cases.

Run: `node tests/app/app-offline.test.cjs`
Expected: PASS.

- [ ] **Step 5: Commit the approval gate**

```bash
git add app/features/approval-gate.js tests/app/approval-artifact.test.cjs tests/app/fixtures/approvals
git commit -m "feat(governance): enforce deterministic approval gates"
```

### Task 3: Wrap existing Rifq with conjunctive approvals

**Files:**
- Create: `app/features/rifq-approved.js`
- Create: `tests/app/rifq-approval.test.cjs`
- Modify after real approval: `app/index.html`
- Modify after real approval: `app/app.js`

**Interfaces:**
- Consumes: `ApprovalGate`, existing `Rifq.applyRifq`, exact successor IDs for legacy D-7 and D-8.
- Produces: `applyApprovedRifq(input, activation, rifq, engine)`.

- [ ] **Step 1: Write failing inert/conservation/backward-proof tests**

```js
const E = require(path.join(__dirname, "..", "..", "app", "engine.js"));
const Rifq = require(path.join(__dirname, "..", "..", "app", "features", "rifq.js"));
const Approved = require(path.join(__dirname, "..", "..", "app", "features", "rifq-approved.js"));
const input = { edges: E.IOUS, declarations: [{ debtorId: "نورة", creditorConsent: true, witnessedAt: "2026-06-21T00:00:00+03:00" }] };
let calls = 0;
const spy = { applyRifq: function () { calls += 1; return Rifq.applyRifq.apply(Rifq, arguments); } };
const inert = Approved.applyApprovedRifq(input, { outcome: "INERT", reason: "APPROVAL_MISSING" }, spy, E);
assert.strictEqual(calls, 0);
assert.deepStrictEqual(inert.monetaryMoves, []);
const activation = { outcome: "ACTIVE", enabled_profile: "creditor_consent_required", approval_refs: ["DEC-SHARIAH-NETTING-V1", "DEC-SHARIAH-RIFQ-CONSENT-V1"] };
const result = Approved.applyApprovedRifq(input, activation, spy, E);
assert.strictEqual(calls, 1);
assert.strictEqual(Rifq.verifyGraceEvents(result.result.grace, result.result.deferred, result.result.grace.entries.map(() => input.declarations[0]), E).ok, true);
assert.strictEqual(Rifq.rifqConservation(input.edges, input.declarations, E).netsPreserved, true);
```

- [ ] **Step 2: Run and confirm the adapter is absent**

Run: `node tests/app/rifq-approval.test.cjs`
Expected: FAIL with missing `rifq-approved.js`.

- [ ] **Step 3: Implement the wrapper without changing Rifq**

```js
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.RifqApproved = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function inert(reason) { return { outcome: "INERT", reason: reason, events: [], stateChanges: [], monetaryMoves: [] }; }
  function applyApprovedRifq(input, activation, rifq, engine) {
    if (!activation || activation.outcome !== "ACTIVE") return inert((activation && activation.reason) || "APPROVAL_MISSING");
    if (activation.enabled_profile !== "creditor_consent_required") return inert("APPROVAL_PROFILE_MISMATCH");
    var required = ["DEC-SHARIAH-NETTING-V1", "DEC-SHARIAH-RIFQ-CONSENT-V1"];
    for (var i = 0; i < required.length; i += 1) if (activation.approval_refs.indexOf(required[i]) < 0) return inert("APPROVAL_MISSING");
    var result = rifq.applyRifq(input.edges, input.declarations, engine);
    return { outcome: "ACTIVE", reason: "OK", approval_refs: activation.approval_refs.slice(), result: result, events: result.grace.entries.slice(), stateChanges: [], monetaryMoves: result.netted.slice() };
  }
  return { applyApprovedRifq: applyApprovedRifq };
});
```

- [ ] **Step 4: Run old and new Rifq suites**

Run: `node tests/app/rifq.test.cjs`
Expected: PASS with existing primitive unchanged.

Run: `node tests/app/rifq-approval.test.cjs`
Expected: PASS for missing/tampered/expired approval, conjunction, exact profile, execution spy, conservation,
rollback of future deferrals, and verification of old grace evidence.

- [ ] **Step 5: Commit the inert adapter; defer UI wiring until real approval**

```bash
git add app/features/rifq-approved.js tests/app/rifq-approval.test.cjs
git commit -m "feat(rifq): require exact approval profiles"
```

### Task 4: Implement exact-profile Circle mode B

**External gate:** The D-3 successor approval must name either `pledge_then_pay_at_spend` or
`licensed_external_custody`. The custody profile also requires legal, regulatory, provider, and custody artifacts.
Ahd pooled custody remains prohibited under both profiles.

**Files:**
- Create: `app/features/circle-mode-b.js`
- Create: `tests/app/circle-mode-b.test.cjs`
- Modify after real approval: `app/screens/circle-adv.js`
- Modify after real approval: `app/index.html`

**Interfaces:**
- Consumes: active Circle approval, external custody evidence when required, and `engine.respread`.
- Produces: `activateModeB(goal, members, activation, evidence, engine)`.

- [ ] **Step 1: Write failing profile and conservation tests**

```js
const ModeB = require(path.join(__dirname, "..", "..", "app", "features", "circle-mode-b.js"));
const goal = { goal_id: "G-1", goalMinor: 800000 };
const members = ["أ", "ب", "ج"];
assert.strictEqual(ModeB.activateModeB(goal, members, null, {}, E).outcome, "INERT");
const pledge = ModeB.activateModeB(goal, members, { outcome: "ACTIVE", enabled_profile: "pledge_then_pay_at_spend", approval_refs: ["DEC-SHARIAH-CIRCLE-MODE-B-V1"] }, {}, E);
assert.strictEqual(pledge.poolHeldByAhd, false);
assert.strictEqual(pledge.pledges.reduce((n, item) => n + item.amountMinor, 0), goal.goalMinor);
const custody = ModeB.activateModeB(goal, members, { outcome: "ACTIVE", enabled_profile: "licensed_external_custody", approval_refs: ["DEC-SHARIAH-CIRCLE-MODE-B-V1"] }, {}, E);
assert.strictEqual(custody.outcome, "INERT");
assert.strictEqual(custody.reason, "CUSTODY_EVIDENCE_MISSING");
```

- [ ] **Step 2: Run and confirm the module is absent**

Run: `node tests/app/circle-mode-b.test.cjs`
Expected: FAIL with missing `circle-mode-b.js`.

- [ ] **Step 3: Implement only the selected profile**

```js
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CircleModeB = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function inert(reason) { return { outcome: "INERT", reason: reason, events: [], stateChanges: [], monetaryMoves: [] }; }
  function activateModeB(goal, members, activation, evidence, engine) {
    if (!activation || activation.outcome !== "ACTIVE") return inert("APPROVAL_MISSING");
    var profile = activation.enabled_profile;
    if (profile !== "pledge_then_pay_at_spend" && profile !== "licensed_external_custody") return inert("APPROVAL_PROFILE_MISMATCH");
    if (profile === "licensed_external_custody") {
      var keys = ["legal", "regulatory", "provider", "custody"];
      for (var k = 0; k < keys.length; k += 1) if (!evidence[keys[k]]) return inert("CUSTODY_EVIDENCE_MISSING");
    }
    var parts = engine.respread(goal.goalMinor, members.length || 1);
    var pledges = members.map(function (member, index) { return { member: member, amountMinor: parts[index] || 0, status: "PLEDGED" }; });
    return { outcome: "ACTIVE", reason: "OK", profile: profile, goal_id: goal.goal_id, totalMinor: goal.goalMinor, pledges: pledges, poolHeldByAhd: false, externalCustodian: profile === "licensed_external_custody" ? evidence.provider.provider_id : null, events: [], stateChanges: [], monetaryMoves: [] };
  }
  return { activateModeB: activateModeB };
});
```

- [ ] **Step 4: Run Circle regression and rollback cases**

Run: `node tests/app/circle-adv.test.cjs`
Expected: PASS; existing proposal primitive remains unchanged.

Run: `node tests/app/circle-mode-b.test.cjs`
Expected: PASS for disabled, wrong profile, pledge conservation, missing/complete custody evidence, no Ahd pool,
unspent pledge cancellation, and survival of already converted mode-A agreements.

- [ ] **Step 5: Commit the gated mode-B module**

```bash
git add app/features/circle-mode-b.js tests/app/circle-mode-b.test.cjs
git commit -m "feat(circle): gate mode B by approved profile"
```

### Task 5: Add borrower-requested release with lender-bound consent

**External gate:** The owner records a unique borrower-release decision and its consent model before active
execution or UI wiring. The pure request/validation module may land inert beforehand.

**Files:**
- Create: `app/features/borrower-release.js`
- Create: `tests/app/borrower-release.test.cjs`
- Create after approval: `app/screens/borrower-release.js`
- Modify after approval: `app/index.html`

**Interfaces:**
- Consumes: active release approval, record parties/principal, append-only release events.
- Produces: `requestRelease`, `consentRelease`, `declineRelease`, `withdrawRelease`, and `foldRelease`.

- [ ] **Step 1: Write failing rights/conservation tests**

```js
const Release = require(path.join(__dirname, "..", "..", "app", "features", "borrower-release.js"));
const record = { id: "R-1", borrower: "ب", lender: "أ", principalMinor: 100000 };
const requested = Release.requestRelease(record, { actor: "ب", amountMinor: 25000, at: "2026-07-14" }, { outcome: "ACTIVE", approval_refs: ["DEC-SHARIAH-BORROWER-RELEASE-V1"] });
assert.strictEqual(requested.event.type, "BORROWER_RELEASE_REQUESTED");
assert.strictEqual(Release.foldRelease(record, [requested.event]).remainingMinor, 100000);
const activation = { outcome: "ACTIVE", approval_refs: ["DEC-SHARIAH-BORROWER-RELEASE-V1"] };
assert.throws(() => Release.consentRelease(record, [requested.event], { actor: "ب", amountMinor: 25000, at: "2026-07-14" }, activation), /LENDER_CONSENT_REQUIRED/);
const consent = Release.consentRelease(record, [requested.event], { actor: "أ", amountMinor: 25000, at: "2026-07-14" }, activation);
assert.strictEqual(Release.foldRelease(record, [requested.event, consent.event]).remainingMinor, 75000);
assert.throws(() => Release.consentRelease(record, [requested.event], { actor: "أ", amountMinor: 100001, at: "2026-07-14" }, activation), /RELEASE_EXCEEDS_REMAINING/);
```

- [ ] **Step 2: Run and confirm the state machine is absent**

Run: `node tests/app/borrower-release.test.cjs`
Expected: FAIL with missing `borrower-release.js`.

- [ ] **Step 3: Implement append-only request and consent transitions**

```js
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BorrowerRelease = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function active(a) { if (!a || a.outcome !== "ACTIVE") throw new Error("APPROVAL_REQUIRED"); }
  function foldRelease(record, events) {
    var forgiven = 0, status = "NONE";
    (events || []).forEach(function (event) {
      if (event.type === "BORROWER_RELEASE_REQUESTED") status = "REQUESTED";
      if (event.type === "RELEASE_DECLINED") status = "DECLINED";
      if (event.type === "REQUEST_WITHDRAWN") status = "WITHDRAWN";
      if (event.type === "PARTIAL_FORGIVEN" || event.type === "FORGIVEN") { forgiven += event.amountMinor; status = event.type; }
    });
    return { status: status, forgivenMinor: forgiven, remainingMinor: record.principalMinor - forgiven };
  }
  function requestRelease(record, input, activation) {
    active(activation);
    if (input.actor !== record.borrower) throw new Error("BORROWER_REQUEST_REQUIRED");
    if (!Number.isInteger(input.amountMinor) || input.amountMinor <= 0 || input.amountMinor > record.principalMinor) throw new Error("RELEASE_AMOUNT_INVALID");
    return { event: { type: "BORROWER_RELEASE_REQUESTED", recordId: record.id, borrower: record.borrower, lender: record.lender, amountMinor: input.amountMinor, at: input.at, approval_refs: activation.approval_refs.slice() } };
  }
  function consentRelease(record, events, input, activation) {
    active(activation);
    if (input.actor !== record.lender) throw new Error("LENDER_CONSENT_REQUIRED");
    var state = foldRelease(record, events);
    if (!Number.isInteger(input.amountMinor) || input.amountMinor <= 0 || input.amountMinor > state.remainingMinor) throw new Error("RELEASE_EXCEEDS_REMAINING");
    return { event: { type: input.amountMinor === state.remainingMinor ? "FORGIVEN" : "PARTIAL_FORGIVEN", recordId: record.id, lender: record.lender, amountMinor: input.amountMinor, at: input.at, approval_refs: activation.approval_refs.slice() } };
  }
  function declineRelease(record, input) { if (input.actor !== record.lender) throw new Error("LENDER_DECISION_REQUIRED"); return { event: { type: "RELEASE_DECLINED", recordId: record.id, at: input.at } }; }
  function withdrawRelease(record, input) { if (input.actor !== record.borrower) throw new Error("BORROWER_WITHDRAWAL_REQUIRED"); return { event: { type: "REQUEST_WITHDRAWN", recordId: record.id, at: input.at } }; }
  return { foldRelease: foldRelease, requestRelease: requestRelease, consentRelease: consentRelease, declineRelease: declineRelease, withdrawRelease: withdrawRelease };
});
```

- [ ] **Step 4: Run request, consent, and rollback suites**

Run: `node tests/app/borrower-release.test.cjs`
Expected: PASS for inert approval, borrower-only request, lender-only consent, decline, withdrawal, partial/full
forgiveness, over-release rejection, integer conservation, pending-request cancellation, and irreversible consented
forgiveness.

Run: `node tests/app/borrower.test.cjs`
Expected: PASS; existing borrower grace/pay flows remain unchanged.

- [ ] **Step 5: Commit the request-only release engine**

```bash
git add app/features/borrower-release.js tests/app/borrower-release.test.cjs
git commit -m "feat(release): require lender-bound forgiveness consent"
```

### Task 6: Add neutral duress and collusion review holds

**External gates:** Duress requires its unique legal/product decision. Collusion requires its unique privacy/legal
decision. Neither active path or screen is wired before the corresponding artifact exists.

**Files:**
- Create: `app/features/duress.js`
- Create: `app/features/collusion-signal.js`
- Create: `tests/app/duress.test.cjs`
- Create: `tests/app/collusion-signal.test.cjs`
- Create after approval: `app/screens/duress.js`
- Create after approval: `app/screens/collusion-review.js`

**Interfaces:**
- Consumes: active exact capability approval and caller-supplied neutral categories/evidence.
- Produces: append-only protective events and `foldProtectiveAction(events)`.

- [ ] **Step 1: Write failing neutrality and state-transition tests**

```js
const Duress = require(path.join(__dirname, "..", "..", "app", "features", "duress.js"));
const Collusion = require(path.join(__dirname, "..", "..", "app", "features", "collusion-signal.js"));
const activation = { outcome: "ACTIVE", approval_refs: ["DEC-LEGAL-DURESS-HOLD-V1"] };
const report = Duress.requestHold({ recordId: "R-1", requesterId: "P-1", reasonCategory: "CONSENT_CONCERN", at: "2026-07-14" }, activation);
assert.strictEqual(report.event.type, "DURESS_HOLD_REQUESTED");
assert.strictEqual(Duress.foldProtectiveAction([report.event]).status, "REQUESTED");
assert.strictEqual(/guilt|fraud|score|probability|rating/i.test(JSON.stringify(report)), false);
const structural = Collusion.requestReview({ cohortSize: 3, repeatedCounterpartyPattern: true, recordIds: ["R-1", "R-2", "R-3"], at: "2026-07-14" }, { outcome: "ACTIVE", approval_refs: ["DEC-PRIVACY-COLLUSION-HOLD-V1"] });
assert.strictEqual(structural.event.type, "COLLUSION_REVIEW_REQUESTED");
assert.strictEqual(Object.prototype.hasOwnProperty.call(structural, "score"), false);
```

- [ ] **Step 2: Run and confirm both modules are absent**

Run: `node tests/app/duress.test.cjs`
Expected: FAIL with missing `duress.js`.

Run: `node tests/app/collusion-signal.test.cjs`
Expected: FAIL with missing `collusion-signal.js`.

- [ ] **Step 3: Implement neutral event constructors and shared states**

```js
// app/features/duress.js
(function (root, factory) { if (typeof module === "object" && module.exports) module.exports = factory(); else root.Duress = factory(); })(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var REASONS = ["CONSENT_CONCERN", "DEVICE_CONTROL_CONCERN", "IDENTITY_CONCERN", "OTHER_NEUTRAL"];
  function requestHold(input, activation) {
    if (!activation || activation.outcome !== "ACTIVE") return { outcome: "INERT", reason: "APPROVAL_MISSING", events: [], stateChanges: [], monetaryMoves: [] };
    if (REASONS.indexOf(input.reasonCategory) < 0) throw new Error("DURESS_REASON_INVALID");
    return { outcome: "ACTIVE", event: { type: "DURESS_HOLD_REQUESTED", recordId: input.recordId, requesterId: input.requesterId, reasonCategory: input.reasonCategory, at: input.at, approval_refs: activation.approval_refs.slice() } };
  }
  function foldProtectiveAction(events) { var state = "NONE"; (events || []).forEach(function (e) { var map = { DURESS_HOLD_REQUESTED: "REQUESTED", DURESS_HOLD_ACTIVE: "ACTIVE", DURESS_HOLD_DISPUTED: "DISPUTED", DURESS_REPORT_WITHDRAWN: "WITHDRAWN", DURESS_HOLD_RELEASED: "RELEASED", DURESS_HOLD_SUPERSEDED: "SUPERSEDED" }; if (map[e.type]) state = map[e.type]; }); return { status: state }; }
  function transitionHold(recordId, type, at, activation) {
    var allowed = ["DURESS_HOLD_ACTIVE", "DURESS_HOLD_DISPUTED", "DURESS_REPORT_WITHDRAWN", "DURESS_HOLD_RELEASED", "DURESS_HOLD_SUPERSEDED"];
    if (allowed.indexOf(type) < 0) throw new Error("DURESS_TRANSITION_INVALID");
    if ((type === "DURESS_HOLD_ACTIVE" || type === "DURESS_HOLD_RELEASED") && (!activation || activation.outcome !== "ACTIVE")) throw new Error("APPROVAL_REQUIRED");
    return { event: { type: type, recordId: recordId, at: at, approval_refs: activation && activation.approval_refs ? activation.approval_refs.slice() : [] } };
  }
  return { requestHold: requestHold, transitionHold: transitionHold, foldProtectiveAction: foldProtectiveAction };
});
```

```js
// app/features/collusion-signal.js
(function (root, factory) { if (typeof module === "object" && module.exports) module.exports = factory(); else root.CollusionSignal = factory(); })(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function requestReview(input, activation) {
    if (!activation || activation.outcome !== "ACTIVE") return { outcome: "INERT", reason: "APPROVAL_MISSING", events: [], stateChanges: [], monetaryMoves: [] };
    if (!Number.isInteger(input.cohortSize) || input.cohortSize < 3) return { outcome: "INERT", reason: "K_FLOOR", events: [], stateChanges: [], monetaryMoves: [] };
    if (input.repeatedCounterpartyPattern !== true) return { outcome: "INERT", reason: "NO_STRUCTURAL_SIGNAL", events: [], stateChanges: [], monetaryMoves: [] };
    return { outcome: "ACTIVE", event: { type: "COLLUSION_REVIEW_REQUESTED", cohortSize: input.cohortSize, reasonCategory: "REPEATED_COUNTERPARTY_STRUCTURE", at: input.at, approval_refs: activation.approval_refs.slice() } };
  }
  function foldReview(events) { var state = "NONE"; (events || []).forEach(function (e) { var map = { COLLUSION_REVIEW_REQUESTED: "REQUESTED", COLLUSION_HOLD_ACTIVE: "ACTIVE", COLLUSION_REVIEW_DISPUTED: "DISPUTED", COLLUSION_REVIEW_WITHDRAWN: "WITHDRAWN", COLLUSION_HOLD_RELEASED: "RELEASED", COLLUSION_HOLD_SUPERSEDED: "SUPERSEDED" }; if (map[e.type]) state = map[e.type]; }); return { status: state }; }
  function transitionReview(type, at, activation) { var allowed = ["COLLUSION_HOLD_ACTIVE", "COLLUSION_REVIEW_DISPUTED", "COLLUSION_REVIEW_WITHDRAWN", "COLLUSION_HOLD_RELEASED", "COLLUSION_HOLD_SUPERSEDED"]; if (allowed.indexOf(type) < 0) throw new Error("COLLUSION_TRANSITION_INVALID"); if ((type === "COLLUSION_HOLD_ACTIVE" || type === "COLLUSION_HOLD_RELEASED") && (!activation || activation.outcome !== "ACTIVE")) throw new Error("APPROVAL_REQUIRED"); return { event: { type: type, at: at, approval_refs: activation && activation.approval_refs ? activation.approval_refs.slice() : [] } }; }
  return { requestReview: requestReview, foldReview: foldReview, transitionReview: transitionReview };
});
```

- [ ] **Step 4: Run neutrality, malicious-report, privacy, and rollback tests**

Run: `node tests/app/duress.test.cjs`
Expected: PASS for inert, allowed category, request, activation, dispute, withdrawal, release, supersession, malicious
report neutrality, no automatic verdict, and authorized release.

Run: `node tests/app/collusion-signal.test.cjs`
Expected: PASS for inert, k-floor, no-signal, structural signal, false-positive dispute, no IDs in public result, no
score/verdict vocabulary, revoked future actions, and retained historical evidence.

- [ ] **Step 5: Commit neutral safeguards**

```bash
git add app/features/duress.js app/features/collusion-signal.js tests/app/duress.test.cjs tests/app/collusion-signal.test.cjs
git commit -m "feat(protection): add neutral hold signals"
```

### Task 7: Add canonical identity bindings and versioned state adapters

**Files:**
- Create: `app/features/identity-state.js`
- Create: `tests/app/identity-state.test.cjs`

**Interfaces:**
- Consumes: supplied canonical URNs, legacy scheme/value/hash tuples, and existing engine states.
- Produces: `validateCanonicalId`, `bindLegacyIdentity`, `compileBindings`, and `mapLegacyState`.

- [ ] **Step 1: Write failing format, collision, and state tests**

```js
const IS = require(path.join(__dirname, "..", "..", "app", "features", "identity-state.js"));
const id = "urn:ahd:1:alinma:record:0123456789ABCDEFGHJKMNPQRS";
assert.strictEqual(IS.validateCanonicalId(id), true);
const binding = IS.bindLegacyIdentity({ canonical_id: id, entity_kind: "record", legacy_refs: [{ scheme: "ahd-record-v1", value: "R-CAFE", canonical_hash: "a".repeat(64) }], approval_ref: "DEC-OPS-ID-BINDING-V1" }, E.sha256);
assert.strictEqual(binding.binding_hash.length, 64);
assert.throws(() => IS.compileBindings([binding, Object.assign({}, binding, { canonical_id: id.replace("RS", "RT") })]), /LEGACY_BINDING_COLLISION/);
assert.deepStrictEqual(IS.mapLegacyState("RESCHEDULED"), { agreement: "ACTIVE", grace: "GRANTED" });
assert.throws(() => IS.mapLegacyState("غير معروف"), /STATE_UNSUPPORTED/);
```

- [ ] **Step 2: Run and confirm identity/state logic is absent**

Run: `node tests/app/identity-state.test.cjs`
Expected: FAIL with missing `identity-state.js`.

- [ ] **Step 3: Implement validation, additive binding, and exact state maps**

```js
(function (root, factory) { if (typeof module === "object" && module.exports) module.exports = factory(); else root.IdentityState = factory(); })(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var ID = /^urn:ahd:1:[a-z0-9-]+:(record|event|proof|principal|circle|approval):[0-9A-HJKMNP-TV-Z]{26}$/;
  var VOCABULARIES = {
    agreement: ["DRAFT", "PENDING_CONSENT", "WITNESSED", "ACTIVE", "SETTLING", "KEPT", "DEFAULTED", "DISPUTED", "ESCALATED", "FORGIVEN", "DECLINED", "EXPIRED", "VOID"],
    grace: ["NONE", "REQUESTED", "GRANTED"],
    circle: ["CIRCLE_DRAFT", "CIRCLE_OPEN", "CIRCLE_PARTIAL", "CIRCLE_KEPT", "CIRCLE_VOID"],
    protective: ["REQUESTED", "ACTIVE", "DISPUTED", "WITHDRAWN", "DECLINED", "RELEASED", "SUPERSEDED"]
  };
  function validateCanonicalId(id) { return ID.test(id || ""); }
  function bindLegacyIdentity(input, sha256) {
    if (!validateCanonicalId(input.canonical_id)) throw new Error("CANONICAL_ID_INVALID");
    var body = { schema: "ahd-identity-binding-v1", canonical_id: input.canonical_id, entity_kind: input.entity_kind, legacy_refs: input.legacy_refs, approval_ref: input.approval_ref };
    return Object.assign({}, body, { binding_hash: sha256(JSON.stringify(body)) });
  }
  function compileBindings(bindings) {
    var byLegacy = {};
    (bindings || []).forEach(function (binding) { (binding.legacy_refs || []).forEach(function (ref) { var key = ref.scheme + "|" + ref.value + "|" + ref.canonical_hash; if (byLegacy[key] && byLegacy[key] !== binding.canonical_id) throw new Error("LEGACY_BINDING_COLLISION"); byLegacy[key] = binding.canonical_id; }); });
    return { byLegacy: byLegacy };
  }
  function mapLegacyState(state) {
    if (state === "RESCHEDULED") return { agreement: "ACTIVE", grace: "GRANTED" };
    if (VOCABULARIES.agreement.indexOf(state) >= 0) return { agreement: state, grace: "NONE" };
    throw new Error("STATE_UNSUPPORTED");
  }
  function validateState(domain, state) { return !!VOCABULARIES[domain] && VOCABULARIES[domain].indexOf(state) >= 0; }
  return { VOCABULARIES: VOCABULARIES, validateCanonicalId: validateCanonicalId, bindLegacyIdentity: bindLegacyIdentity, compileBindings: compileBindings, mapLegacyState: mapLegacyState, validateState: validateState };
});
```

- [ ] **Step 4: Run identity, parity, and backward-verification suites**

Run: `node tests/app/identity-state.test.cjs`
Expected: PASS for valid kinds, invalid alphabet/length, supplied opaque ID, deterministic legacy derivation,
collision, binding tamper, every agreement/Circle/protective state, `RESCHEDULED` mapping, and unsupported histories.

Run: `node tests/app/engine-parity.cjs`
Expected: PASS; the golden state engine and seal remain unchanged.

- [ ] **Step 5: Commit additive identity/state compatibility**

```bash
git add app/features/identity-state.js tests/app/identity-state.test.cjs
git commit -m "feat(identity): add backward-safe IDs and states"
```

### Task 8: Enforce privacy-safe public analytics

**Files:**
- Create: `app/features/analytics-public.js`
- Create: `tests/app/analytics-privacy-v2.test.cjs`
- Modify after tests: `app/features/org.js`
- Modify after tests: `app/screens/org.js`

**Interfaces:**
- Consumes: aggregate-only internal totals and a declared claim label.
- Produces: `publicAggregate(rows, aggregateFn, claimLabel)` with `K_FLOOR = 3`.

- [ ] **Step 1: Write failing k-floor and fixed-key tests**

```js
const Public = require(path.join(__dirname, "..", "..", "app", "features", "analytics-public.js"));
const aggregate = (rows) => ({ conservedMinor: rows.reduce((n, row) => n + row.amountMinor, 0), savedTransfers: rows.length });
assert.deepStrictEqual(Public.publicAggregate([], aggregate, "synthetic"), { outcome: "SUPPRESSED", reason: "K_FLOOR", cohort_size: 0, k_floor: 3, totals_minor: null, claim_label: "synthetic" });
assert.strictEqual(Public.publicAggregate([{ id: "1" }, { id: "2" }], aggregate, "synthetic").outcome, "SUPPRESSED");
const safe = Public.publicAggregate([{ id: "1", amountMinor: 1 }, { id: "2", amountMinor: 2 }, { id: "3", amountMinor: 3 }], aggregate, "modelled");
assert.deepStrictEqual(Object.keys(safe).sort(), ["claim_label", "cohort_size", "k_floor", "outcome", "totals_minor"].sort());
assert.strictEqual(JSON.stringify(safe).includes("id"), false);
```

- [ ] **Step 2: Run and confirm the public boundary is absent**

Run: `node tests/app/analytics-privacy-v2.test.cjs`
Expected: FAIL with missing `analytics-public.js`.

- [ ] **Step 3: Implement suppression and a fixed public schema**

```js
(function (root, factory) { if (typeof module === "object" && module.exports) module.exports = factory(); else root.AnalyticsPublic = factory(); })(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var K_FLOOR = 3, LABELS = ["measured", "modelled", "synthetic", "estimated"];
  function publicAggregate(rows, aggregateFn, claimLabel) {
    var list = rows || [];
    if (LABELS.indexOf(claimLabel) < 0) throw new Error("CLAIM_LABEL_INVALID");
    if (list.length < K_FLOOR) return { outcome: "SUPPRESSED", reason: "K_FLOOR", cohort_size: list.length, k_floor: K_FLOOR, totals_minor: null, claim_label: claimLabel };
    var totals = aggregateFn(list);
    Object.keys(totals).forEach(function (key) { if (!Number.isInteger(totals[key])) throw new Error("AGGREGATE_NOT_INTEGER"); });
    return { outcome: "AGGREGATE", cohort_size: list.length, k_floor: K_FLOOR, totals_minor: totals, claim_label: claimLabel };
  }
  return { K_FLOOR: K_FLOOR, publicAggregate: publicAggregate };
});
```

Route the organization screen through `publicAggregate`. Do not export internal per-record helpers from the new
public module and source-scan for trust/history imports.

- [ ] **Step 4: Run analytics and org regressions**

Run: `node tests/app/analytics-privacy-v2.test.cjs`
Expected: PASS for cohorts 0, 1, 2, 3, integer totals, fixed keys, claim labels, no IDs/names/trust/score/history,
and rollback to the prior safe aggregate schema.

Run: `node tests/app/impact.test.cjs && node tests/app/impact-drill.test.cjs && node tests/app/org.test.cjs`
Expected: PASS.

- [ ] **Step 5: Commit the aggregate privacy boundary**

```bash
git add app/features/analytics-public.js app/features/org.js app/screens/org.js tests/app/analytics-privacy-v2.test.cjs
git commit -m "feat(analytics): suppress small public cohorts"
```

### Task 9: Wire only approved contextual UI and run the complete gate

**External gate:** A screen/action is created and registered only when its real approval artifact is present in the
owner-controlled evidence register. Inert infrastructure alone does not create an action button or claim approval.

**Files:**
- Modify after each real approval: `app/index.html`
- Modify after each real approval: `app/app.js`
- Create after approval review: `app/approved-capabilities.json`
- Create after each real approval: the matching contextual file under `app/screens/`
- Create/modify: `tests/app/protective-ui-smoke.test.cjs`
- Modify: `docs/PUBLISHABLE-PRODUCT-SPEC.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `_meta/OPEN-ITEMS.md`

**Interfaces:**
- Consumes: active capability registry and pure feature modules from Tasks 2-8.
- Produces: contextual screens with neutral Arabic copy, explicit approval/source label, and no navigation entry
  for capabilities that remain unapproved.

- [ ] **Step 1: Write the UI smoke test for the exact approved capability set**

```js
const approvedCapabilities = require(path.join(ROOT, "app", "approved-capabilities.json"));
const index = fs.readFileSync(path.join(ROOT, "app", "index.html"), "utf8");
for (const capability of approvedCapabilities.capabilities) {
  assert.strictEqual(index.includes(capability.script), true, capability.capability_id);
  const src = fs.readFileSync(path.join(ROOT, capability.screen_path), "utf8");
  assert.strictEqual(src.includes(capability.approval_id), true);
  assert.strictEqual(/درجة|تصنيف|احتمال احتيال|حكم بالإدانة/.test(src), false);
}
for (const capability of approvedCapabilities.blocked_capabilities) {
  assert.strictEqual(index.includes(capability.script), false, capability.capability_id);
}
```

- [ ] **Step 2: Run and confirm UI wiring matches no more than the actual approval set**

Run: `node tests/app/protective-ui-smoke.test.cjs`
Expected before approved wiring: PASS only when `capabilities` contains the actually approved set and every open
capability remains in `blocked_capabilities` with no script/screen registration.

- [ ] **Step 3: Add each approved contextual screen with explicit boundaries**

Each screen must show: capability purpose; exact consent needed; approval/source reference; original principal;
neutral current state; irreversible-effects note; and back navigation. It must not appear in the eight-entry
`NAV_ORDER`. Use the existing `registerScreen({ key, label, icon, render })` pattern, but replace emoji with the
project's approved inline vector/icon treatment when the broader UI icon task lands.

- [ ] **Step 4: Run focused, app, full, tripwire, and Judge Lens gates**

Run: `node tests/app/decision-registry.test.cjs && node tests/app/approval-artifact.test.cjs && node tests/app/rifq-approval.test.cjs && node tests/app/circle-mode-b.test.cjs && node tests/app/borrower-release.test.cjs && node tests/app/duress.test.cjs && node tests/app/collusion-signal.test.cjs && node tests/app/identity-state.test.cjs && node tests/app/analytics-privacy-v2.test.cjs && node tests/app/protective-ui-smoke.test.cjs`
Expected: every suite PASS.

Run: `node tests/app/run-app-tests.cjs`
Expected: all app suites green.

Run: `cd tests && node run-all.cjs`
Expected: `AHD GATE` green, zero failures, frozen-demo tripwire intact; record the live count.

Score the visible result using `docs/JUDGE-LENS.md`. Any criterion below `8/10` creates a `JL-*` item.

- [ ] **Step 5: Commit only the actually approved UI set and truthful docs**

```bash
git add app/index.html app/app.js app/approved-capabilities.json app/screens tests/app/protective-ui-smoke.test.cjs docs/PUBLISHABLE-PRODUCT-SPEC.md docs/ARCHITECTURE.md _meta/OPEN-ITEMS.md
git commit -m "feat(app): expose approved protective capabilities"
```

## Plan Self-Review

- **Spec coverage:** Tasks 1-9 cover FR-005 through FR-011, FR-016 through FR-018, and SC-003 through SC-005.
  Protocol and mobile requirements are owned by the two sibling plans.
- **Authority boundary:** The plan creates deterministic gates and inert modules without manufacturing a Shariah,
  legal, privacy, regulatory, provider, or owner approval.
- **Type consistency:** Canonical decision IDs, artifact fields, activation result, protective states, identity URN,
  and aggregate output match the Spec Kit contracts/data model.
- **Rollback:** Every active capability stops future actions after revocation while witnessed events, rights,
  bindings, old readers, and safe aggregate history remain intact.
