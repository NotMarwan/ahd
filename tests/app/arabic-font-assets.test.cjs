"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const root = path.join(__dirname, "..", "..");
const css = fs.readFileSync(path.join(root, "app", "app.css"), "utf8");
const manifestPath = path.join(root, "app", "assets", "fonts", "IBM-Plex-Sans-Arabic-SOURCE.md");
const files = ["IBMPlexSansArabic-Regular.woff2", "IBMPlexSansArabic-SemiBold.woff2"];
let pass = 0, fail = 0;
function ok(v, m) { if (v) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } }
console.log("arabic-font-assets.test: local IBM Plex Arabic assets");
ok(/@font-face/.test(css) && /IBM Plex Sans Arabic/.test(css), "CSS declares IBM Plex Sans Arabic font faces");
ok(!/https?:\/\/[^\s)'\"]+\.(woff2|woff|ttf|otf)/i.test(css), "CSS loads no remote font URL");
ok(fs.existsSync(manifestPath), "source and license manifest exists");
const manifest = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8") : "";
ok(/SIL Open Font License/i.test(manifest) && /source/i.test(manifest) && /SHA-256/i.test(manifest), "manifest records OFL, source release, and SHA-256");
files.forEach(function (name) { const p = path.join(root, "app", "assets", "fonts", name); ok(fs.existsSync(p) && fs.statSync(p).size > 1000, name + " is locally vendored"); if (fs.existsSync(p)) { const sum = crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex"); ok(manifest.indexOf(sum) >= 0, name + " SHA-256 recorded"); } });
console.log("ARABIC-FONT-ASSETS: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
