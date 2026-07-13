/* ============================================================================
   smoke-live.cjs — T4: over-the-wire HTTP parity, wired INTO the gate as a
   META step (tests/run-all.cjs — like the tripwire + no-drift check: excluded
   from the product assertion total, its own pass/fail line, red banner if it
   fails). Proves the pure router (server/router.cjs, already covered by
   tests/app/server-parity.test.cjs with no live socket) reproduces the SAME
   golden seals over a REAL Node http.Server + a real localhost TCP round trip.

   Non-flaky by construction: binds OS-EPHEMERAL port 0 (server.listen(0, ...))
   and reads the ACTUAL assigned port back from server.address().port — never
   a fixed port (server/http.cjs's PORT=8225 constant is for the live process
   only; using it here would risk a port-collision hang on a machine that
   already has a real ahd-server running, exactly the false-red failure mode
   CLAUDE.md flags). Uses an in-memory store (Store.createStore() with no
   dataDir — no disk I/O, no leftover files) and auth OFF (this file's job is
   over-the-wire SEAL parity, not auth — that is already proven live by
   server/demo-bank-node.cjs and deterministically by
   tests/app/server-auth.test.cjs) to keep the moving parts minimal.

   What this proves, over Node's own `http` module (never fetch/XHR/WebSocket):
     1) POST /verify (MAIN, no id) over a real socket reproduces the project's
        ONE pinned golden main seal 6c9410b9… (byte-identical to demo/app).
     2) POST /create-loan -> POST /seal for a brand-new record over a real
        socket reproduces the pinned golden NEW-1 seal (same vector
        server-parity.test.cjs and server/demo-bank-node.cjs already use) —
        "the seal IS the API" holds over the wire, not just in-process.
     3) the server closes cleanly (server.close() awaited) — no leaked socket.

   Run standalone:  node server/smoke-live.cjs
   Normally invoked by tests/run-all.cjs as the "smoke-live" meta step.
============================================================================ */
"use strict";
const http = require("http");
const { createAhdServer } = require("./http.cjs");
const Store = require("./store.cjs");

const HOST = "127.0.0.1";
const GOLDEN_MAIN_SEAL = "6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18";
const GOLDEN_NEW1_SEAL = "0463553997c80d77e65d1a411acc0e0bd9d4bef67a92dc96af045dfa24a2b8f8"; // golden-vectors.test.cjs / server-parity.test.cjs NEW-1

function request(method, port, urlPath, body) {
  return new Promise(function (resolve, reject) {
    const data = Buffer.from(JSON.stringify(body || {}), "utf8");
    const req = http.request(
      { host: HOST, port: port, path: urlPath, method: method, headers: { "Content-Type": "application/json", "Content-Length": data.length } },
      function (res) {
        const chunks = [];
        res.on("data", function (c) { chunks.push(c); });
        res.on("end", function () {
          try { resolve({ status: res.statusCode, body: JSON.parse(Buffer.concat(chunks).toString("utf8")) }); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on("error", reject);
    req.end(data);
  });
}

async function main() {
  let ok = true;
  const mark = function (cond, label) { console.log((cond ? "  ✓ " : "  ✗ ") + label); return !!cond; };

  const store = Store.createStore(); // no dataDir => in-memory only, no disk I/O, no leftover files
  const server = createAhdServer(store, { enabled: false }); // auth OFF — this file proves seal parity, not auth (see header)
  await new Promise(function (resolve) { server.listen(0, HOST, resolve); }); // 0 = OS-assigned EPHEMERAL port — never a fixed one
  const port = server.address().port;
  console.log("SMOKE-LIVE: real socket on http://" + HOST + ":" + port + " (ephemeral port, OS-assigned)");

  try {
    const v = await request("POST", port, "/verify", {});
    ok = mark(v.status === 200 && v.body.ok === true && v.body.sealed === GOLDEN_MAIN_SEAL,
      "POST /verify (MAIN) over real HTTP -> sealed == golden main seal (" + v.body.sealed + ")") && ok;

    const c = await request("POST", port, "/create-loan", { id: "NEW-1", lender: "أنت", borrower: "سلطان", amountSAR: 1200, months: 3 });
    ok = mark(c.status === 201 && c.body.status === "DRAFT", "POST /create-loan (NEW-1) over real HTTP -> 201 DRAFT") && ok;

    const s = await request("POST", port, "/seal", { id: "NEW-1" });
    ok = mark(s.status === 200 && s.body.status === "WITNESSED" && s.body.seal === GOLDEN_NEW1_SEAL,
      "POST /seal (NEW-1) over real HTTP -> seal == golden NEW-1 seal (" + s.body.seal + ")") && ok;

    const h = await request("GET", port, "/health", {});
    ok = mark(h.status === 200 && h.body.ok === true, "GET /health over real HTTP -> 200 { ok: true }") && ok;
  } catch (e) {
    console.error("SMOKE-LIVE: ERROR", e);
    ok = false;
  } finally {
    await new Promise(function (resolve) { server.close(resolve); }); // close cleanly before exiting
  }

  console.log(ok
    ? "SMOKE-LIVE: OK — real HTTP round-trip reproduces every pinned golden seal, server closed cleanly"
    : "SMOKE-LIVE: FAILED");
  process.exitCode = ok ? 0 : 1;
}

main();
