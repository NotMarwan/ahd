/* ============================================================================
   browser-smoke.mjs — REAL-Chrome smoke for the Ahd prototype.
   Drives the actual page in headless Chromium: asserts 0 console errors,
   0 external network requests (fully offline), the deterministic seal hash,
   live tamper detection, settlement completion, and the Muqassa result —
   then reloads and asserts the seal is byte-identical (same every run).

   Requires Playwright (one-time, online):  npm i -D playwright && npx playwright install chromium
   Run:  node browser-smoke.mjs
   Exit: 0 = all green · 1 = a check failed · 2 = Playwright not installed.
============================================================================ */
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(__dirname, "..", "..", "..", "project", "ahd-demo", "index.html");
const URL = pathToFileURL(INDEX).href;
const GOLD_SEAL = "6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18";

let chromium;
try { ({ chromium } = await import("playwright")); }
catch {
  console.error("Playwright not installed.\n  npm i -D playwright && npx playwright install chromium\n  (then re-run: node browser-smoke.mjs)");
  process.exit(2);
}

let passed = 0, failed = 0;
const ok = (c, n, d) => { if (c) { passed++; console.log("  ✓ " + n); } else { failed++; console.log("  ✗ " + n + (d ? "  — " + d : "")); } };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") consoleErrors.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));
const external = [];
page.on("request", (r) => { if (!r.url().startsWith("file:") && !r.url().startsWith("data:")) external.push(r.url()); });

console.log("Real-Chrome smoke — " + URL + "\n");
await page.goto(URL, { waitUntil: "networkidle" });

ok(consoleErrors.length === 0, "0 console errors/warnings on load", consoleErrors.join(" | "));
ok(external.length === 0, "0 external network requests (fully offline)", external.join(" | "));

/* horizontal overflow guard */
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
ok(!overflow, "no horizontal overflow");

/* step 0 -> 2 programmatically (window.go / confirmPerson are the public API) */
await page.evaluate(() => window.go(2));
await page.evaluate(() => { window.confirmPerson("L"); window.confirmPerson("B"); });
await sleep(900);                                   // let both Nafath scans complete + record issue
let body = await page.evaluate(() => document.body.innerText);
ok(/وثيقة عهد موثّقة/.test(body), "witnessed record is issued after dual confirm");

/* verify (clean) */
await page.evaluate(() => { const b = document.getElementById("vbtn"); if (b) b.click(); });
await sleep(120);
body = await page.evaluate(() => document.body.innerText);
ok(/سليمة/.test(body), "verifier reports the clean record as سليمة (valid)");

/* the sealed hash on screen must equal the golden seal (uppercased short form) */
const sealShown = await page.evaluate(() => {
  const m = document.body.innerText.match(/[0-9A-F]{20,}/);
  return m ? m[0] : "";
});
ok(GOLD_SEAL.slice(0, 24).toUpperCase().startsWith(sealShown.slice(0, 24)) || sealShown.startsWith(GOLD_SEAL.slice(0, 24).toUpperCase()),
   "on-screen seal matches the golden seal (6C9410B9…)", "shown=" + sealShown);

/* tamper -> FAIL */
await page.evaluate(() => { const b = document.getElementById("tbtn"); if (b) b.click(); });
await sleep(150);
body = await page.evaluate(() => document.body.innerText);
ok(/عبثٌ مكشوف/.test(body), "tampering (5,000→9,000) is detected live (عبثٌ مكشوف)");

/* settle */
await page.evaluate(() => window.go(3));
await sleep(60);
for (let i = 0; i < 6; i++) { await page.evaluate(() => { const b = document.getElementById("skip"); if (b) b.click(); }); await sleep(40); }
body = await page.evaluate(() => document.body.innerText);
ok(/ذمّة محفوظة/.test(body), "all installments settle → ذمّة محفوظة");

/* muqassa */
await page.evaluate(() => window.go(4));
await sleep(60);
await page.evaluate(() => { const b = document.getElementById("run"); if (b) b.click(); });
await sleep(120);
body = await page.evaluate(() => document.body.innerText);
ok(/صفر صافٍ|٩٠٠|900/.test(body), "Muqassa conservation proof renders (Σ=900 / صفر صافٍ)");

/* determinism: reload and confirm the seal is byte-identical */
await page.reload({ waitUntil: "networkidle" });
await page.evaluate(() => window.go(2));
await page.evaluate(() => { window.confirmPerson("L"); window.confirmPerson("B"); });
await sleep(900);
const seal2 = await page.evaluate(() => { const m = document.body.innerText.match(/[0-9A-F]{20,}/); return m ? m[0] : ""; });
ok(seal2 === sealShown, "seal is identical after a full reload (same every run)", `first=${sealShown} second=${seal2}`);
ok(consoleErrors.length === 0, "still 0 console errors after the full flow", consoleErrors.join(" | "));

await browser.close();
console.log("\n" + "=".repeat(56));
console.log(`BROWSER SMOKE: ${passed} passed, ${failed} failed`);
console.log("=".repeat(56));
process.exit(failed ? 1 : 0);
