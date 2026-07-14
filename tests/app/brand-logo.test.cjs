/* Contract for the approved Ahd primary logo. The frozen demo is intentionally
   outside this deployment: app, promo, repository, and project map only. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..", "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel));
const text = (rel) => read(rel).toString("utf8");
const sha256 = (rel) => crypto.createHash("sha256").update(read(rel)).digest("hex");

let pass = 0, fail = 0;
const ok = (condition, message) => {
  if (condition) { pass++; console.log("  ✓ " + message); }
  else { fail++; console.log("  ✗ " + message); }
};

console.log("brand-logo.test: approved primary mark is deployed consistently");

const canonical = "assets/brand/ahd-logo.png";
const app = "app/assets/ahd-logo.png";
const promo = "promo/public/logo/ahd-mark.png";

ok(fs.existsSync(path.join(ROOT, canonical)), "canonical brand asset exists");
ok(fs.existsSync(path.join(ROOT, app)), "offline app asset exists");
ok(fs.existsSync(path.join(ROOT, promo)), "promo renderer asset exists");

if ([canonical, app, promo].every(rel => fs.existsSync(path.join(ROOT, rel)))) {
  ok(sha256(canonical) === sha256(app), "app copy is byte-identical to the canonical mark");
  ok(sha256(canonical) === sha256(promo), "promo copy is byte-identical to the canonical mark");
} else {
  ok(false, "app copy is byte-identical to the canonical mark");
  ok(false, "promo copy is byte-identical to the canonical mark");
}

ok(text("app/index.html").includes('href="assets/ahd-logo.png"'), "app favicon uses the approved mark");
ok(text("app/screens/home.js").includes('src="assets/ahd-logo.png"'), "app home uses the approved mark");
ok(/USE_LOGO_ASSET\s*=\s*true/.test(text("promo/src/sadu.ts")), "promo renderer enables the approved mark");
ok(text("README.md").includes("assets/brand/ahd-logo.png"), "GitHub README displays the approved mark");

const projectMap = JSON.parse(text("project/mcp/packages/ahd-navigator/src/project-map.json"));
ok(projectMap.brandIdentity && projectMap.brandIdentity.primaryMark === canonical,
   "project map declares the canonical primary mark");
ok(projectMap.brandIdentity && projectMap.brandIdentity.appMark === app && projectMap.brandIdentity.promoMark === promo,
   "project map declares both deployed copies");

console.log("\nbrand-logo: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
