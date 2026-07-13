const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..", "..");
const TRIPWIRE_PATH = path.join(ROOT, "tests", "tripwire.cjs");
let pass = 0, fail = 0;
function ok(condition, message) {
  if (condition) { pass++; console.log("  ✓ " + message); }
  else { fail++; console.log("  ✗ " + message); }
}

console.log("tripwire-portability.test: Node-only frozen-demo verification");
ok(fs.existsSync(TRIPWIRE_PATH), "tripwire module exists");
if (!fs.existsSync(TRIPWIRE_PATH)) {
  console.log("tripwire-portability.test: " + pass + " passed, " + fail + " failed");
  process.exit(1);
}

const Tripwire = require(TRIPWIRE_PATH);
const EXPECTED = "e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40";
ok(typeof Tripwire.parseChecksum === "function", "parseChecksum exists");
ok(typeof Tripwire.sha256File === "function", "sha256File exists");
ok(typeof Tripwire.verify === "function", "verify exists");

const parsedLf = Tripwire.parseChecksum(EXPECTED + " *demo/index.html\n");
const parsedCrlf = Tripwire.parseChecksum(EXPECTED + "  demo/index.html\r\n");
ok(parsedLf.hash === EXPECTED && parsedLf.file === "demo/index.html", "parses GNU checksum LF form");
ok(parsedCrlf.hash === EXPECTED && parsedCrlf.file === "demo/index.html", "parses GNU checksum CRLF form");
ok(Tripwire.parseChecksum("not-a-checksum\n") === null, "rejects malformed checksum");
ok(Tripwire.parseChecksum(EXPECTED + " *../demo/index.html\n") === null, "rejects traversal checksum target");
ok(Tripwire.parseChecksum(EXPECTED + " *demo/index.html\n" + EXPECTED + " *demo/index.html\n") === null, "rejects multiple checksum lines");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-tripwire-"));
const demo = path.join(temp, "demo");
fs.mkdirSync(demo);
const fixture = path.join(demo, "index.html");
fs.writeFileSync(fixture, "sealed bytes", "utf8");
const fixtureHash = crypto.createHash("sha256").update("sealed bytes").digest("hex");
fs.mkdirSync(path.join(temp, "_overnight", "backup"), { recursive: true });
fs.writeFileSync(path.join(temp, "_overnight", "backup", "demo.sha256"), fixtureHash + " *demo/index.html\r\n", "utf8");
ok(Tripwire.sha256File(fixture) === fixtureHash, "hashes file bytes with Node crypto");
ok(Tripwire.verify(temp).ok === true, "verifies a matching temporary fixture");
fs.writeFileSync(fixture, "tampered bytes", "utf8");
ok(Tripwire.verify(temp).ok === false, "rejects a tampered temporary fixture");
fs.rmSync(temp, { recursive: true, force: true });

ok(Tripwire.verify(ROOT).ok === true, "verifies the frozen demo hash in this checkout");
const source = fs.readFileSync(TRIPWIRE_PATH, "utf8");
ok(!/sha256sum|child_process/.test(source), "tripwire has no platform shell dependency");
ok(!/sha256sum/.test(fs.readFileSync(path.join(ROOT, "tests", "run-all.cjs"), "utf8")), "full gate delegates tripwire without sha256sum");
ok(!/sha256sum/.test(fs.readFileSync(path.join(ROOT, "tests", "stage-preflight.cjs"), "utf8")), "stage preflight delegates tripwire without sha256sum");

console.log("tripwire-portability.test: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
