# Ahd Local Demonstration Server Safety Implementation Plan

> **Required execution mode:** Use `executing-plans` task-by-task. Do not begin behavior-changing
> server work during the competition freeze unless the stage owner explicitly reopens it.

**Goal:** Prevent accidental secret/data commits, bound obvious local abuse, and make it impossible to
mislabel the localhost proof as a production service.

**Architecture:** Preserve `server/` as a separate `DEMO-ONLY` surface. Add a small limits module and
an explicit local-demo profile. Keep HMAC authentication, golden engine reuse, persistent JSONL replay,
and current stage vectors. Do not retrofit production identity or authorization into the demo server.

**Tech stack:** Node.js CommonJS and built-ins only; existing pure router/handler tests; real-socket
smoke; custom test harness.

**Source requirements:** FR-043, FR-044, FR-047, FR-049, NFR-014, PR-009, SEC-002, SEC-004,
SEC-005, SEC-007, SEC-009, SEC-013.

---

## Task 1: Reject Local Secrets and Data in Git

**Files:**

- Modify: `tests/structure-check.cjs`
- Modify: `.gitignore`

### Step 1: Add a failing hygiene helper test

Add `checkSensitiveTrackedPaths(paths)` to the exported structure helpers and exercise it in a
self-teeth fixture:

```js
function checkSensitiveTrackedPaths(paths) {
  const forbidden = [
    /^server\/data(?:\/|$)/,
    /(?:^|\/)loans\.jsonl$/,
    /(?:^|\/)auth\.key$/,
    /(?:^|\/)(?:private|secret)[-_].*\.key$/i
  ];
  return paths.filter(function (rel) {
    return forbidden.some(function (pattern) { return pattern.test(rel); });
  });
}
```

The repository check should obtain tracked paths using:

```js
const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: ROOT })
  .toString("utf8").split("\0").filter(Boolean);
```

Explicit public fixture/key paths under `protocol/fixtures/` and the documented demo public key remain
allowed. The current `protocol/bank-key-demo.cjs` must not be matched by a broad `*.key` rule.

### Step 2: Run red

```powershell
node tests/structure-check.cjs
```

Expected: the new self-teeth test fails until the helper is wired and the ignore policy is checked.

### Step 3: Add narrow ignore entries

Append:

```gitignore
# Local Ahd server state and generated authentication secrets
server/data/
**/loans.jsonl
**/auth.key
```

Do not ignore all JSON, all keys, `protocol/fixtures/`, or public test vectors.

### Step 4: Verify

```powershell
node tests/structure-check.cjs
git ls-files server/data "**/loans.jsonl" "**/auth.key"
```

Expected: structure check green; no tracked local state/key output.

### Step 5: Commit

```powershell
git add .gitignore tests/structure-check.cjs
git commit -m "chore(server): exclude local data and auth secrets"
```

---

## Task 2: Characterize the Authentication/Authorization Boundary

**Files:**

- Modify: `tests/app/server-auth.test.cjs`
- Create: `docs/security/LOCAL-SERVER-BOUNDARY.md`

### Step 1: Add a passing characterization test

Use a valid token whose actor is `mallory`, then call `/create-loan` naming `alice` and `bob`. Assert
the current local router accepts it. Name the assertion:

```text
local-demo characterization: HMAC authenticates actor but does not authorize named parties
```

This is not a desired production behavior. The test prevents documentation from claiming otherwise
and gives a future production service an explicit negative requirement.

### Step 2: Document the boundary

Create `docs/security/LOCAL-SERVER-BOUNDARY.md` with:

- authenticated properties: token integrity, expiry, actor label;
- absent properties: party binding, resource role, action authority, consent, revocation, audience,
  issuer, nonce, TLS, record privacy;
- public `/list` exposure;
- localhost and fixture-data-only rule;
- production replacement through `contracts/production-seams.md`; and
- a prohibition on claiming SEC-001–SEC-003 from local HMAC behavior.

### Step 3: Run focused tests

```powershell
node tests/app/server-auth.test.cjs
git diff --check -- docs/security/LOCAL-SERVER-BOUNDARY.md
```

### Step 4: Commit

```powershell
git add tests/app/server-auth.test.cjs docs/security/LOCAL-SERVER-BOUNDARY.md
git commit -m "test(server): document local authz boundary"
```

---

## Task 3: Add Local Request Limits With TDD

**Files:**

- Create: `server/limits.cjs`
- Create: `tests/app/server-limits.test.cjs`
- Modify: `server/http.cjs`
- Modify: `server/router.cjs`

**Demo defaults:** 64 KiB body, JSON depth 12, string length 4,096, netting edges 100. These are local
safety defaults, not production capacity claims.

### Step 1: Write failing pure limit tests

Create cases for:

- body at 65,536 bytes accepted and 65,537 rejected;
- depth 12 accepted and 13 rejected;
- string at 4,096 code units accepted and 4,097 rejected;
- 100 edges accepted and 101 rejected;
- rejection returns 413 for body size and 422 for semantic bounds; and
- rejected input causes no store mutation.

The test calls exported pure functions first; no socket is needed for most cases.

### Step 2: Run red

```powershell
node tests/app/server-limits.test.cjs
```

Expected: missing `server/limits.cjs`.

### Step 3: Implement pure limit checks

Create:

```js
"use strict";

const DEFAULTS = Object.freeze({
  maxBodyBytes: 65536,
  maxDepth: 12,
  maxStringLength: 4096,
  maxEdges: 100
});

function depthOf(value) {
  if (value === null || typeof value !== "object") return 0;
  const values = Array.isArray(value) ? value : Object.keys(value).map(function (key) { return value[key]; });
  return 1 + values.reduce(function (max, item) { return Math.max(max, depthOf(item)); }, 0);
}

function longestString(value) {
  if (typeof value === "string") return value.length;
  if (value === null || typeof value !== "object") return 0;
  const values = Array.isArray(value) ? value : Object.keys(value).map(function (key) { return value[key]; });
  return values.reduce(function (max, item) { return Math.max(max, longestString(item)); }, 0);
}

function validateBody(body, limits) {
  const cfg = Object.assign({}, DEFAULTS, limits || {});
  if (depthOf(body) > cfg.maxDepth) return { ok: false, status: 422, error: "request nesting exceeds local-demo limit" };
  if (longestString(body) > cfg.maxStringLength) return { ok: false, status: 422, error: "request string exceeds local-demo limit" };
  if (body && Array.isArray(body.edges) && body.edges.length > cfg.maxEdges) return { ok: false, status: 422, error: "edge count exceeds local-demo limit" };
  return { ok: true };
}

module.exports = { DEFAULTS: DEFAULTS, depthOf: depthOf, longestString: longestString, validateBody: validateBody };
```

### Step 4: Integrate before handlers

- In `http.cjs`, count `Buffer.byteLength` as chunks arrive and return 413 before parsing once the body
  exceeds the limit.
- In `router.cjs`, validate the parsed body before auth/handler dispatch.
- A rejected request must not call a handler or write JSONL.
- Keep `route` backward compatible by accepting optional limits after headers.

### Step 5: Run focused suite

```powershell
node tests/app/server-limits.test.cjs
node tests/app/server-parity.test.cjs
node tests/app/server-auth.test.cjs
node tests/app/server-persistence.test.cjs
node server/smoke-live.cjs
```

Expected: all green and golden seals unchanged.

### Step 6: Commit

```powershell
git add server/limits.cjs server/http.cjs server/router.cjs tests/app/server-limits.test.cjs
git commit -m "feat(server): bound local demo requests"
```

---

## Task 4: Make the Server Profile Explicit

**Files:**

- Create: `server/profile.cjs`
- Create: `tests/app/server-profile.test.cjs`
- Modify: `server/http.cjs`

### Step 1: Write failing profile tests

Required cases:

```js
eq(Profile.resolve("local-demo").name, "local-demo", "explicit local profile works");
throws(function () { Profile.resolve("production"); }, /separate production service required/,
  "demo server refuses production profile");
throws(function () { Profile.resolve(""); }, /local-demo/, "missing profile fails with explicit guidance");
```

### Step 2: Implement profile resolution

```js
"use strict";

function resolve(name) {
  if (name === "local-demo") return { name: "local-demo", publicList: true, bindHost: "127.0.0.1" };
  throw new Error("AHD_SERVER_PROFILE must be local-demo; a separate production service is required");
}

module.exports = { resolve: resolve };
```

`http.cjs` uses `process.env.AHD_SERVER_PROFILE || "local-demo"` only for backward-compatible local
startup. An explicit `production` value must terminate before key creation, bind, or data access.

### Step 3: Run tests

```powershell
node tests/app/server-profile.test.cjs
$env:AHD_SERVER_PROFILE = 'production'
node server/http.cjs
Remove-Item Env:AHD_SERVER_PROFILE
```

Expected: focused test green; production startup exits non-zero with the explicit boundary message.

### Step 4: Run local smoke

```powershell
node server/smoke-live.cjs
node server/demo-bank-node.cjs
```

Expected: local demonstrations remain green.

### Step 5: Commit

```powershell
git add server/profile.cjs server/http.cjs tests/app/server-profile.test.cjs
git commit -m "feat(server): enforce local demo profile"
```

---

## Task 5: Correct Server and Container Documentation

**Files:**

- Modify: `README.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `Dockerfile`
- Modify: `.dockerignore`
- Modify: `specs/001-ahd-product-system/contracts/local-server-api.md`

### Step 1: Update exact guarantees

Document:

- HMAC authentication exists; resource/action authorization does not.
- `/verify` and `/list` are public locally; only verification is a future public capability.
- JSONL is durable append plus torn-tail-tolerant replay, not a transaction engine.
- limits are local demo bounds, not production SLOs.
- the profile refuses production startup.
- loopback bind does not behave like normal `docker -p` exposure.
- the container copies a broad repository runtime and is not supply-chain production proof.

### Step 2: Tighten Docker context without breaking runtime

Ensure `.dockerignore` excludes:

```text
server/data
**/auth.key
**/loans.jsonl
tests
specs
.specify
.agents
```

Retain `server/`, `app/`, and `demo/` because the server adapter requires the generated app engine and
the project still documents golden provenance. Do not claim the image was build-tested if Docker is
unavailable.

### Step 3: Validate docs and source

```powershell
rg -n "no authentication|atomic append|production-ready|cloud deployment" README.md docs/ARCHITECTURE.md Dockerfile specs/001-ahd-product-system/contracts/local-server-api.md
git diff --check -- README.md docs/ARCHITECTURE.md Dockerfile .dockerignore specs/001-ahd-product-system/contracts/local-server-api.md
```

Expected: any matches are explicit negations/limitations, not stale claims.

### Step 4: Commit

```powershell
git add README.md docs/ARCHITECTURE.md Dockerfile .dockerignore specs/001-ahd-product-system/contracts/local-server-api.md
git commit -m "docs(server): state local safety boundary exactly"
```

---

## Task 6: Full Verification

### Step 1: Focused server gate

```powershell
node tests/app/server-auth.test.cjs
node tests/app/server-limits.test.cjs
node tests/app/server-profile.test.cjs
node tests/app/server-parity.test.cjs
node tests/app/server-persistence.test.cjs
node tests/app/server-health.test.cjs
node server/smoke-live.cjs
node server/demo-bank-node.cjs
```

### Step 2: Full project gate

```powershell
cd tests
node run-all.cjs
cd ..
```

Expected: zero failures, golden vectors unchanged, app offline checks green, tripwire unchanged.

### Step 3: Judge Lens and status

Score technical implementation and feasibility because the server is judge-visible. The evidence line
must say `localhost demonstration`, not `production backend`. Record a `JL-` item if either score is
below 8.

### Step 4: Commit status only

```powershell
git add _meta/STATUS.md _meta/overnight-log.md "AmadHackathon/10 المواصفة الأم.md"
git commit -m "docs(server): record local safety verification"
```

## Completion Criteria

- Local data and auth secrets cannot be tracked accidentally.
- Authentication/authorization distinction is executable and documented.
- Local requests are bounded before business handlers.
- Rejected input creates no event.
- Demo server refuses a production profile.
- Current stage vectors, durability replay, health, parity, and live smoke stay green.
- No production control or approval is implied.
