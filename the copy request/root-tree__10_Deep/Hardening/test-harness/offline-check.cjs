/* ============================================================================
   offline-check.cjs — prove the prototype makes ZERO network calls in the demo
   path. Static analysis of the shipped index.html. Zero dependencies.
   Run:  node offline-check.cjs   (exit 0 = fully offline, 1 = a network seam found)
============================================================================ */
const fs = require("fs");
const path = require("path");

const HTML_PATH = path.join(__dirname, "..", "..", "..", "project", "ahd-demo", "index.html");
const html = fs.readFileSync(HTML_PATH, "utf8");

let passed = 0, failed = 0;
function ok(cond, name, detail) {
  if (cond) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ " + name + (detail ? "  — " + detail : "")); }
}

console.log("Offline invariants — project/ahd-demo/index.html\n");

/* 1) no external script/style/image/font resources */
ok(!/<script[^>]+\bsrc\s*=/i.test(html), "no <script src=…> (all JS is inline)");
const linkHrefs = [...html.matchAll(/<link[^>]+href\s*=\s*["']([^"']+)["']/gi)].map(m => m[1]);
ok(linkHrefs.every(h => h.startsWith("data:")), "every <link href> is a data: URI (favicon embedded)", linkHrefs.join(", "));
ok(!/<img[^>]+\bsrc\s*=\s*["']https?:/i.test(html), "no <img> loads a remote URL");
ok(!/@import/i.test(html), "no CSS @import");
ok(!/url\(\s*['"]?https?:/i.test(html), "no CSS url(http…) (no remote backgrounds/fonts)");
ok(!/@font-face|fonts\.googleapis|fonts\.gstatic|typekit|use\.fontawesome/i.test(html),
   "no web fonts (system font stack only)");

/* 2) no runtime network primitives anywhere in the page */
const netRe = /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|navigator\.sendBeacon|new\s+Worker|importScripts|\.ajax\s*\(|axios/;
ok(!netRe.test(html), "no fetch / XHR / WebSocket / EventSource / Worker / sendBeacon");

/* 3) favicon is embedded as a data: URI (so no /favicon.ico 404 over the wire) */
ok(/<link[^>]+rel=["']icon["'][^>]+href=["']data:image\/svg\+xml/i.test(html),
   "favicon is an embedded data: SVG (no network request for it)");

/* 4) the only http(s) string present is the SVG XML namespace (not a fetch) */
const httpHits = [...html.matchAll(/https?:\/\/[^\s"'<>]+/g)].map(m => m[0]);
const nonNamespace = httpHits.filter(u => !u.startsWith("http://www.w3.org/"));
ok(nonNamespace.length === 0, "no http(s) URL other than the W3C SVG namespace",
   "found: " + nonNamespace.join(", "));

console.log("\n" + "=".repeat(56));
console.log(`OFFLINE CHECK: ${passed} passed, ${failed} failed`);
console.log("=".repeat(56));
process.exit(failed ? 1 : 0);
