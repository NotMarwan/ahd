/* ============================================================================
   issue-token.cjs — OUT-OF-BAND CLI to mint an HMAC session token for the
   LIVE server/http.cjs process (server/auth.cjs). Not part of the gate, not
   auto-discovered by tests/app (no .test/-parity/-smoke suffix).

   This is a deliberate, honest scope limit: there is no self-service
   network registration/login endpoint yet (residual gap — see T2 write-up).
   An operator with filesystem access to the running server's DATA_DIR mints
   a token for a named actor; the server verifies it against the SAME
   persisted key (DATA_DIR/auth.key, or AHD_AUTH_KEY if set) — no restart
   needed, no secret leaves the machine.

   Usage:
     node server/issue-token.cjs <actor> [ttlMs]

   Example:
     node server/issue-token.cjs نورة 900000
     -> prints a token; use it as: Authorization: Bearer <token>
============================================================================ */
"use strict";
const Auth = require("./auth.cjs");
const Store = require("./store.cjs");

function main(argv) {
  var actor = argv[2];
  var ttlMs = argv[3] ? Number(argv[3]) : undefined;
  if (!actor) {
    console.error("usage: node server/issue-token.cjs <actor> [ttlMs]");
    process.exitCode = 1;
    return;
  }
  var dataDir = process.env.AHD_DATA_DIR || Store.DEFAULT_DATA_DIR;
  var secretKey = process.env.AHD_AUTH_KEY || Auth.resolveSecretKey(dataDir);
  var token = Auth.issueToken({ actor: actor, secretKey: secretKey, ttlMs: ttlMs });
  console.log(token);
}

if (require.main === module) main(process.argv);

module.exports = { main: main };
