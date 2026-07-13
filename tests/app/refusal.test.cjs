/* ============================================================================
   refusal.test.cjs — TDD for «ما لا يفعله عهد» (Front B, innovation/memorability).
   The claim: the identity «يشهد ولا يُقرض» is SHOWN, not just spoken — three
   refusals, each greying out a control a normal bank would use, each naming the
   REAL guard file that enforces it. Pure content; frozen; on-spine (no %, no
   score number; refusals stated as negations).
============================================================================ */
const path = require("path");
const fs = require("fs");
const Refusal = require(path.join(__dirname, "..", "..", "app", "features", "refusal.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };
const R = (p) => path.join(__dirname, "..", "..", p);

console.log("refusal.test: «ما لا يفعله عهد» — the refusal made visible (Front B)");

const m = Refusal.model();
ok(/يُقرض/.test(m.heading) && /يُقيّم/.test(m.heading) && /يحكم/.test(m.heading), "heading names all three refusals");
ok(Array.isArray(m.items) && m.items.length === 3, "exactly three refusals");

/* W5: the quotable, on-screen pull-quote — «what we refuse to do IS the product» */
ok(typeof m.quote === "string" && m.quote.length > 10, "the model carries a quotable pull-quote");
ok(/المنتج/.test(m.quote), "the quote states the refusal itself IS the product (no apology)");
ok(Refusal.QUOTE === m.quote, "the module also exports QUOTE directly (stable, importable)");

m.items.forEach(function (it) {
  ok(!!(it.act && it.control && it.bankDoes && it.whyRefused && it.enforcedBy),
     "refusal «" + it.act + "» is complete (act · control · bankDoes · why · guard)");
  ok(fs.existsSync(R(it.enforcedBy)), "guard file exists for «" + it.act + "»: " + it.enforcedBy);
});

ok(!!(m.charity && m.charity.enforcedBy && fs.existsSync(R(m.charity.enforcedBy))), "the charity beat cites a real guard file");
ok(/صدقة/.test(m.charity.act) || /صدقة/.test(m.charity.line), "the charity beat turns debt into صدقة (the unclonable moment)");

/* spine: no percentage/score number anywhere; refusals are negations */
const blob = JSON.stringify(m);
ok(!/[0-9]\s*[%٪]/.test(blob), "no percentage/score glyph anywhere");
ok(/لا يُقرض/.test(blob) && /لا يُصدر رقمًا/.test(blob), "refusals are stated as negations (لا …)");

/* immutability: the shared content model is frozen */
ok(Object.isFrozen(m) && Object.isFrozen(m.items), "the model + items list are frozen (shared content is protected)");

console.log("\nrefusal: " + pass + "/" + (pass + fail) + (fail ? "  (" + fail + " FAILED)" : ""));
process.exit(fail ? 1 : 0);
