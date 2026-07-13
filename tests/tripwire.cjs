"use strict";

var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

var CHECKSUM_FILE = path.join("_overnight", "backup", "demo.sha256");
var CHECKSUM_RE = /^([0-9a-f]{64}) [ *]([^\r\n]+)\r?\n?$/;

function parseChecksum(text) {
  if (typeof text !== "string" || text.split(/\r?\n/).filter(Boolean).length !== 1) return null;
  var match = CHECKSUM_RE.exec(text);
  if (!match) return null;
  var file = match[2];
  if (path.isAbsolute(file) || file.indexOf("..") !== -1 || file.replace(/\\/g, "/") !== "demo/index.html") return null;
  return { hash: match[1], file: file };
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function verify(root) {
  try {
    var parsed = parseChecksum(fs.readFileSync(path.join(root, CHECKSUM_FILE), "utf8"));
    if (!parsed) return { ok: false, reason: "invalid checksum file" };
    var target = path.resolve(root, parsed.file);
    var base = path.resolve(root) + path.sep;
    if (target.indexOf(base) !== 0) return { ok: false, reason: "checksum target escapes root" };
    var actual = sha256File(target);
    return { ok: actual === parsed.hash, expected: parsed.hash, actual: actual, file: parsed.file };
  } catch (error) {
    return { ok: false, reason: error && error.message ? error.message : String(error) };
  }
}

module.exports = { parseChecksum: parseChecksum, sha256File: sha256File, verify: verify };

if (require.main === module) {
  var result = verify(path.join(__dirname, ".."));
  console.log(result.ok ? "TRIPWIRE: OK — demo/index.html: OK (e2f48467…)" : "TRIPWIRE: FAILED — " + (result.reason || "hash mismatch"));
  process.exit(result.ok ? 0 : 1);
}
