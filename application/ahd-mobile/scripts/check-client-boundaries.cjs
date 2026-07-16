"use strict";

const fs = require("node:fs");
const path = require("node:path");

const RUNTIME_EXTENSIONS = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);

function isInside(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function collectRuntimeFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "__tests__") visit(absolute);
      } else if (
        RUNTIME_EXTENSIONS.has(path.extname(entry.name))
        && !/\.test\.[cm]?[jt]sx?$/.test(entry.name)
      ) {
        files.push(absolute);
      }
    }
  };
  visit(directory);
  return files.sort();
}

function importSpecifiers(source) {
  const matches = [];
  const patterns = [
    /\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g,
    /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) matches.push({ index: match.index, specifier: match[1] });
  }
  return matches.sort((left, right) => left.index - right.index).map((item) => item.specifier);
}

function checkClientBoundaries(options = {}) {
  const mobileRoot = path.resolve(options.mobileRoot || path.join(__dirname, ".."));
  const sourceRoot = path.resolve(options.sourceRoot || path.join(mobileRoot, "src"));
  const projectRoot = path.resolve(mobileRoot, "..", "..");
  const forbiddenRoots = [
    path.join(projectRoot, "application", "prototypes"),
    path.join(projectRoot, "application", "design", "proof-go"),
    path.join(projectRoot, "docs", "pitch"),
    path.join(projectRoot, "docs", "handoff"),
    path.join(projectRoot, "app"),
  ].map((item) => path.resolve(item));
  const violations = [];

  for (const file of collectRuntimeFiles(sourceRoot)) {
    const source = fs.readFileSync(file, "utf8");
    for (const specifier of importSpecifiers(source)) {
      if (!specifier.startsWith(".") && !path.isAbsolute(specifier)) continue;
      const resolved = path.resolve(path.dirname(file), specifier);
      if (forbiddenRoots.some((root) => isInside(resolved, root))) {
        violations.push({ file: path.relative(mobileRoot, file).replace(/\\/g, "/"), specifier });
      }
    }
  }

  return { ok: violations.length === 0, violations };
}

if (require.main === module) {
  const result = checkClientBoundaries();
  if (result.ok) {
    process.stdout.write("Client boundary: clean.\n");
  } else {
    result.violations.forEach((item) => {
      process.stderr.write(`${item.file}: forbidden runtime import ${item.specifier}\n`);
    });
  }
  process.exitCode = result.ok ? 0 : 1;
}

module.exports = { checkClientBoundaries };
