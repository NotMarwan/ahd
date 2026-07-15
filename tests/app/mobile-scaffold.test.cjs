const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const MOBILE = path.join(ROOT, "application", "ahd-mobile");

let passed = 0;
let failed = 0;

function ok(condition, message) {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${message}`);
    return;
  }
  failed += 1;
  console.error(`  ✗ ${message}`);
}

console.log("mobile-scaffold.test: clean Expo SDK 57 product boundary");

const packagePath = path.join(MOBILE, "package.json");
ok(fs.existsSync(packagePath), "application/ahd-mobile has its own package.json");

if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  ok(/^~?57\./.test(pkg.dependencies?.expo || ""), "mobile product uses Expo SDK 57");
  ok(pkg.main === "expo-router/entry", "Expo Router owns the native entry point");
}

ok(
  fs.existsSync(path.join(MOBILE, "src", "app", "_layout.tsx")),
  "mobile product keeps route files below src/app"
);
const gitignorePath = path.join(MOBILE, ".gitignore");
ok(
  fs.existsSync(gitignorePath) && /node_modules/.test(fs.readFileSync(gitignorePath, "utf8")),
  "installed dependencies are excluded from source evidence"
);

console.log(`mobile-scaffold.test: ${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
