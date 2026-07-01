/* ONE-OFF golden capture from the CURRENT (pre-refactor) index.html.
   Runs the WHOLE in-page <script> in a vm with a no-op DOM shim, then reads
   the computed values. Output → golden-vectors.json. This freezes the exact
   hashes/results the hardened code must reproduce byte-for-byte. */
const fs = require("fs"), path = require("path"), vm = require("vm");

const HTML = fs.readFileSync(path.join(__dirname, "..", "demo", "index.html"), "utf8");
const m = HTML.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error("no <script> found"); process.exit(1); }
const script = m[1];

/* a fake DOM element that absorbs every read/write so the page's render code
   (renderSteps / R[0]) can run harmlessly in Node. */
function fakeEl() {
  const el = {
    innerHTML: "", textContent: "", value: "", disabled: false, style: {},
    classList: { add() {}, remove() {}, contains() { return false; } },
    setAttribute() {}, addEventListener() {}, removeEventListener() {},
    appendChild() {}, focus() {}, contains() { return true; },
  };
  el.querySelector = () => fakeEl();
  el.querySelectorAll = () => [];
  return el;
}
const sandbox = {
  TextEncoder, Uint8Array, Uint32Array, DataView, Math, Array, Object, JSON,
  String, Number, isNaN, parseInt, parseFloat, console,
  setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
  document: {
    body: { contains: () => true },
    getElementById: () => fakeEl(),
    querySelector: () => fakeEl(),
    querySelectorAll: () => [],
    createElement: () => fakeEl(),
    addEventListener: () => {},
  },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

const footer = `
;globalThis.__G = {
  GENESIS: GENESIS,
  seq: SEALED.seq, prev: SEALED.prev,
  canonical_hash: SEALED.canonical_hash, seal: SEALED.seal,
  terms_ar: AG.terms_ar, terms_hash: AG.terms_hash,
  canonical_plain: canonical(null), canonical_tampered: canonical(9000),
  recompute_clean: recomputeSeal(null), recompute_tampered: recomputeSeal(9000),
  consent_refs: AG.consent.map(function(c){return c.sig_ref;}),
  BAL: BAL, SETTLE: SETTLE, IOUS_len: IOUS.length, NODES: NODES,
  fmt: { v50: fmt(50), v200: fmt(200), v900: fmt(900), v1000: fmt(1000), v5000: fmt(5000), v9000: fmt(9000) },
  sha: { empty: sha256(""), abc: sha256("abc"),
         long: sha256("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq") },
  riba: {
    clean_empty: ribaScan(""),
    clean_ok: ribaScan("الأصل فقط دون زيادة"),
    block_fee: ribaScan("غرامة تأخير ٥٪ شهريًّا عند تجاوز موعد السداد"),
    block_interest: ribaScan("فائدة سنوية على المبلغ"),
    block_pct: ribaScan("نسبة ٢٪ من المبلغ")
  }
};`;

vm.createContext(sandbox);
vm.runInContext(script + footer, sandbox, { filename: "ahd-current.js" });

const G = sandbox.__G;
fs.writeFileSync(path.join(__dirname, "golden-vectors.json"), JSON.stringify(G, null, 2));
console.log("=== GOLDEN VECTORS (current index.html) ===");
console.log("GENESIS        :", G.GENESIS);
console.log("canonical_hash :", G.canonical_hash);
console.log("seal           :", G.seal);
console.log("terms_hash     :", G.terms_hash);
console.log("recompute clean seal :", G.recompute_clean.seal, "==seal?", G.recompute_clean.seal === G.seal);
console.log("recompute tamper seal:", G.recompute_tampered.seal, "==seal?", G.recompute_tampered.seal === G.seal);
console.log("consent refs   :", G.consent_refs.join(", "));
console.log("BAL            :", JSON.stringify(G.BAL));
console.log("SETTLE         :", JSON.stringify(G.SETTLE));
console.log("fmt            :", JSON.stringify(G.fmt));
console.log("sha empty      :", G.sha.empty);
console.log("sha abc        :", G.sha.abc);
console.log("sha long(56)   :", G.sha.long);
console.log("riba block_fee :", G.riba.block_fee.verdict, "hits=", G.riba.block_fee.hits.length);
console.log("riba clean_ok  :", G.riba.clean_ok.verdict);
console.log("wrote golden-vectors.json");
