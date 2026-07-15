"use strict";

const fs = require("node:fs");
const path = require("node:path");

const MOBILE_ROOT = path.resolve(__dirname, "..");
const PROJECT_ROOT = path.resolve(MOBILE_ROOT, "..", "..");
const DEFAULT_SOURCE_ROOT = path.join(PROJECT_ROOT, "app");
const DEFAULT_DESTINATION_ROOT = path.join(MOBILE_ROOT, "src", "generated");

const SOURCE_FILES = Object.freeze([
  "engine.js",
  "features/create.js",
  "features/riba-lint.js",
  "features/daftari.js",
  "features/settlement.js",
  "features/proof.js",
]);

function roots(options) {
  const input = options || {};
  return {
    sourceRoot: input.sourceRoot || DEFAULT_SOURCE_ROOT,
    destinationRoot: input.destinationRoot || DEFAULT_DESTINATION_ROOT,
  };
}

function syncGenerated(options) {
  const resolved = roots(options);
  for (const relativePath of SOURCE_FILES) {
    const source = path.join(resolved.sourceRoot, relativePath);
    const destination = path.join(resolved.destinationRoot, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
}

function checkGenerated(options) {
  const resolved = roots(options);
  const drift = [];

  for (const relativePath of SOURCE_FILES) {
    const source = path.join(resolved.sourceRoot, relativePath);
    const destination = path.join(resolved.destinationRoot, relativePath);
    if (!fs.existsSync(destination)) {
      drift.push(relativePath);
      continue;
    }

    const sourceBytes = fs.readFileSync(source);
    const destinationBytes = fs.readFileSync(destination);
    if (!sourceBytes.equals(destinationBytes)) drift.push(relativePath);
  }

  return { ok: drift.length === 0, drift };
}

module.exports = {
  SOURCE_FILES,
  syncGenerated,
  checkGenerated,
};
