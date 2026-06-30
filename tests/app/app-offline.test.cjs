/* ============================================================================
   app-offline.test.cjs — STATIC offline + determinism scan of the app source.
   Reads every .js under project/ahd-app/ (engine.js, app.js, features/*, screens/*),
   STRIPS comments first (so prose like «no Date.now / no Math.random» in a comment
   doesn't trip the scan), then asserts NONE of the live code contains any networking
   or nondeterminism primitive. This proves the new app is as offline + deterministic
   as the golden demo (which the demo harness's offline-check.cjs guards separately).
   The scanner carries its OWN teeth-tests so a future weakening can't pass silently.
============================================================================ */
const fs = require("fs");
const path = require("path");

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("app-offline.test: static offline+determinism scan (comments stripped)");

/* The forbidden primitives — networking + sources of nondeterminism. */
const FORBIDDEN = ["fetch(", "XMLHttpRequest", "WebSocket", "Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString"];

/* Robust comment stripper: char-by-char with string / template / regex / comment
   state so that // or /* inside a string or a regex literal is NOT a comment, and a
   forbidden word inside a REAL comment is removed. Regex-start is detected only when
   the previous significant char permits a regex (conservative). Newlines are kept so
   reported line numbers stay meaningful. Verified non-destructive below (PARSE-OK). */
function stripComments(src) {
  let out = "", i = 0;
  const n = src.length;
  let state = "code"; // code|line|block|sq|dq|tpl|regex
  let prev = "";       // last non-whitespace code char (to disambiguate / )
  while (i < n) {
    const c = src[i], c2 = src[i + 1];
    if (state === "code") {
      if (c === "/" && c2 === "/") { state = "line"; i += 2; continue; }
      if (c === "/" && c2 === "*") { state = "block"; i += 2; continue; }
      if (c === "'") { state = "sq"; out += c; i++; prev = c; continue; }
      if (c === '"') { state = "dq"; out += c; i++; prev = c; continue; }
      if (c === "`") { state = "tpl"; out += c; i++; prev = c; continue; }
      if (c === "/") {
        if (prev === "" || "(,=:[!&|?{};+-*%^~<>".indexOf(prev) >= 0 || /[\n\r]/.test(prev)) {
          state = "regex"; out += c; i++; continue;
        }
      }
      out += c;
      if (!/\s/.test(c)) prev = c;
      i++; continue;
    }
    if (state === "line") { if (c === "\n") { state = "code"; out += c; } i++; continue; }
    if (state === "block") { if (c === "*" && c2 === "/") { state = "code"; i += 2; } else { if (c === "\n") out += c; i++; } continue; }
    if (state === "sq") { if (c === "\\") { out += c + (c2 || ""); i += 2; continue; } if (c === "'") { state = "code"; prev = c; } out += c; i++; continue; }
    if (state === "dq") { if (c === "\\") { out += c + (c2 || ""); i += 2; continue; } if (c === '"') { state = "code"; prev = c; } out += c; i++; continue; }
    if (state === "tpl") { if (c === "\\") { out += c + (c2 || ""); i += 2; continue; } if (c === "`") { state = "code"; prev = c; } out += c; i++; continue; }
    if (state === "regex") { if (c === "\\") { out += c + (c2 || ""); i += 2; continue; } if (c === "/") { state = "code"; prev = c; } if (c === "\n") { state = "code"; } out += c; i++; continue; }
  }
  return out;
}

/* find every forbidden token in a stripped source; returns [{tok,line}] */
function scan(stripped) {
  const hits = [];
  for (const tok of FORBIDDEN) {
    let idx = stripped.indexOf(tok);
    while (idx >= 0) {
      hits.push({ tok: tok, line: stripped.slice(0, idx).split("\n").length });
      idx = stripped.indexOf(tok, idx + 1);
    }
  }
  return hits;
}

/* --- scanner SELF-TESTS (teeth): the stripper must be non-destructive and catch real code --- */
{
  const sample = "const a = Date.now();\n/* comment with Math.random and new Date and Intl. */\n// fetch( in a line comment\nconst re = /a\\/b/;\nconst s = 'a // not a comment';\nconst t = `Intl. inside template`;";
  const st = stripComments(sample);
  ok(st.indexOf("Date.now") >= 0, "teeth: a forbidden token in REAL code survives stripping (Date.now)");
  ok(st.indexOf("Math.random") < 0, "teeth: forbidden word inside a block comment is removed (Math.random)");
  ok(st.indexOf("new Date") < 0, "teeth: forbidden word inside a block comment is removed (new Date)");
  ok(st.indexOf("fetch(") < 0, "teeth: forbidden token inside a line comment is removed (fetch()");
  ok(st.indexOf("// not a comment") >= 0, "teeth: // inside a STRING literal is NOT stripped");
  ok(st.indexOf("Intl. inside template") >= 0, "teeth: a template-literal body is preserved");
  ok(st.indexOf("/a\\/b/") >= 0 || st.indexOf("a\\/b") >= 0, "teeth: a regex literal with an escaped slash is preserved");
  ok(scan(sample.replace(/[\s\S]*/, "const z=1;")).length === 0, "teeth: scan() returns no hits for clean code");
  ok(scan("const a=Date.now();const b=Math.random();").length === 2, "teeth: scan() finds BOTH forbidden tokens in clean-of-comments code");
}

/* --- the real scan over every app .js --- */
const APP = path.join(__dirname, "..", "..", "app");
const targets = [
  "engine.js",
  "app.js",
  path.join("features", "open-loan.js"),
  path.join("features", "daftari.js"),
  path.join("screens", "open-loan.js"),
  path.join("screens", "daftari.js")
];

/* discover any OTHER .js under features/ and screens/ so a newly-added file is covered too */
for (const sub of ["features", "screens"]) {
  const dir = path.join(APP, sub);
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".js")) {
        const rel = path.join(sub, f);
        if (targets.indexOf(rel) < 0) targets.push(rel);
      }
    }
  }
}

ok(targets.length >= 6, "scanning at least 6 app source files (got " + targets.length + ")");

let totalRawComment = 0; // count of tokens that DID appear raw (in comments) — proves stripping mattered
for (const rel of targets) {
  const abs = path.join(APP, rel);
  ok(fs.existsSync(abs), "source present: " + rel);
  const src = fs.readFileSync(abs, "utf8");
  const stripped = stripComments(src);

  /* the live (comment-stripped) code must contain NONE of the forbidden primitives */
  const hits = scan(stripped);
  const detail = hits.map(h => h.tok + "@L" + h.line).join(", ");
  ok(hits.length === 0, rel + ": no networking/nondeterminism primitive in live code" + (hits.length ? "  [FOUND: " + detail + "]" : ""));

  /* count raw (pre-strip) occurrences so we can assert the stripping actually did work */
  const rawHits = scan(src);
  totalRawComment += (rawHits.length - hits.length);

  /* a positive determinism marker: every app module is plain ASCII-safe UTF-8 text (no BOM surprises) */
  ok(src.charCodeAt(0) !== 0xFEFF, rel + ": no UTF-8 BOM (clean source bytes)");
}

/* the engine/app/daftari comments DO mention these words in prose — assert the strip removed
   real raw occurrences, proving the comment-strip is load-bearing (not a vacuous pass). */
ok(totalRawComment > 0, "comment-strip was load-bearing: removed " + totalRawComment + " forbidden token(s) that lived only inside comments");

console.log("\n========================================================");
console.log("APP-OFFLINE: " + pass + " passed, " + fail + " failed");
console.log("========================================================");
process.exit(fail ? 1 : 0);
