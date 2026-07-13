/* ============================================================================
   smoke-live.cjs — OPTIONAL, MANUAL, real-socket smoke check of server/http.cjs.

   Not part of the deterministic gate (tests/run-all.cjs never calls this) and
   not named *.test.cjs/-parity.cjs/-smoke.cjs inside tests/app, so it is never
   auto-discovered either. Run it by hand when you want to see a real HTTP
   round-trip against the frozen golden main seal:

     node server/smoke-live.cjs
============================================================================ */
"use strict";
const http = require("http");
const { createAhdServer, PORT, HOST } = require("./http.cjs");

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body || {}), "utf8");
    const req = http.request(
      { host: HOST, port: PORT, path: path, method: "POST", headers: { "Content-Type": "application/json", "Content-Length": data.length } },
      (res) => {
        let chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(Buffer.concat(chunks).toString("utf8")) }); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on("error", reject);
    req.end(data);
  });
}

const server = createAhdServer();
server.listen(PORT, HOST, async () => {
  try {
    const v = await post("/verify", {});
    console.log("POST /verify (MAIN):", v.status, v.body);
    const golden = "6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18";
    const ok = v.status === 200 && v.body.ok === true && v.body.sealed === golden;
    console.log(ok ? "SMOKE-LIVE: OK — live HTTP round-trip reproduces the golden main seal" : "SMOKE-LIVE: FAILED");
    process.exitCode = ok ? 0 : 1;
  } catch (e) {
    console.error("SMOKE-LIVE: ERROR", e);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
