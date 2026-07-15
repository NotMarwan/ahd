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

console.log("mobile-vertical-slice-structure.test: one complete journey, not 21 screen implementations");

const requiredRoutes = [
  "src/app/index.tsx",
  "src/app/(tabs)/home.tsx",
  "src/app/(tabs)/create.tsx",
  "src/app/(tabs)/daftari.tsx",
  "src/app/(tabs)/settle.tsx",
  "src/app/(stack)/record/[id].tsx",
  "src/app/(stack)/proof.tsx",
];

for (const relativePath of requiredRoutes) {
  ok(fs.existsSync(path.join(MOBILE, relativePath)), `${relativePath} exists`);
}

const requiredScreens = [
  "HomeScreen.tsx",
  "CreateAhdScreen.tsx",
  "DaftariScreen.tsx",
  "RecordDetailScreen.tsx",
  "SettlementScreen.tsx",
  "ProofScreen.tsx",
];

for (const filename of requiredScreens) {
  ok(fs.existsSync(path.join(MOBILE, "src", "screens", filename)), `${filename} exists`);
}

const routeRoot = path.join(MOBILE, "src", "app");
function routeLeaves(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return routeLeaves(absolute);
    return entry.name.endsWith(".tsx") && entry.name !== "_layout.tsx" ? [absolute] : [];
  });
}

ok(routeLeaves(routeRoot).length === 7, "Phase 1 implements seven route leaves only");

const screenRoot = path.join(MOBILE, "src", "screens");
const screenSource = fs.existsSync(screenRoot)
  ? fs.readdirSync(screenRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
      .map((entry) => fs.readFileSync(path.join(screenRoot, entry.name), "utf8"))
      .join("\n")
  : "";

for (const forbidden of [
  /\bsha256\s*\(/,
  /\bsealBlock\s*\(/,
  /\btoMinor\s*\(/,
  /\bparseFloat\s*\(/,
  /\bMath\.round\s*\(/,
  /amountMinor\s*[*/+-]/,
]) {
  ok(!forbidden.test(screenSource), `screens avoid business operation ${forbidden}`);
}

console.log(`mobile-vertical-slice-structure.test: ${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
