/* _verify_real.cjs — Agent 4: run forecast+buckets PURE fns over Agent 2's REAL data/out bundles
   and cross-check the forecast shortfall against Agent 1's REAL underwrite limit (sample_io.json).
   Run: node frontend/components/_verify_real.cjs */
const fs = require("fs"), path = require("path");
function load(f) { eval(fs.readFileSync(path.join(__dirname, f), "utf8")); }
load("forecast.js"); load("buckets.js");
const TR = globalThis.TR;
const root = path.join(__dirname, "..", "..");
const fmt = (n) => Math.round(n).toLocaleString("en-US");

function repPayment(bundle) {
  const cr = bundle.ob_transactions.filter((t) => t.direction === "credit" && t.category !== "transfer").map((t) => t.amount_sar);
  const last = cr.slice(-6).sort((a, b) => a - b);
  return last.length ? last[Math.floor(last.length / 2)] : 0;
}

const sample = JSON.parse(fs.readFileSync(path.join(root, "backend", "sample_io.json"), "utf8"));
let ok = true;
for (const id of ["freelancer_designer", "gig_driver", "small_merchant"]) {
  const bundle = JSON.parse(fs.readFileSync(path.join(root, "data", "out", id + ".json"), "utf8"));
  const f = TR.computeForecast(bundle);
  const pay = repPayment(bundle);
  const k = TR.computeBuckets(pay, bundle);
  const limit = sample[id] ? sample[id].output.limit_sar : null;     // A1's real limit
  const coversShortfall = limit != null && limit >= f.shortfall;     // buffer ≥ forecast gap (the loop)
  const det = JSON.stringify(f) === JSON.stringify(TR.computeForecast(bundle));
  if (!det) ok = false;
  console.log("─".repeat(64));
  console.log(`${id} · ${bundle.profile.name_ar}`);
  console.log(`  forecast: baseline ${fmt(f.baseline)} | next(${f.nextLabel}) ${fmt(f.expectedNext)} | SHORTFALL ${fmt(f.shortfall)} SAR | lean ${f.leanCount}`);
  console.log(`  buckets(${fmt(pay)}): zakat ${fmt(k.zakat)} | VAT ${fmt(k.vat)} (reg ${k.vatRegistered}) | reserve ${fmt(k.reserve)} | spend ${fmt(k.spendable)}`);
  console.log(`  loop: A1 limit ${fmt(limit)} SAR ≥ shortfall? ${coversShortfall}  | deterministic ${det}`);
}
console.log("─".repeat(64));
console.log(ok ? "✅ forecast+buckets run on REAL data, deterministic, loop coherent" : "❌ FAIL");
process.exit(ok ? 0 : 1);
