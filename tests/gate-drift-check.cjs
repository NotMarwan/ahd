/* ============================================================================
   gate-drift-check.cjs — JL-6: no-drift gate test. Scans the judge-facing
   LIVING reference surfaces (deck/script/guide/brief/rebuttals/README/
   CLAUDE.md/architecture/spec + the AmadHackathon vault's current-status
   banners) for a cited gate-assertion count (ASCII or Arabic-Indic digits)
   and fails if any citation does not match a number the LIVE run actually
   produced.

   Authoritative counts: NEVER hardcoded here. `run-all.cjs`, right after it
   sums each step's "N passed", hands this script the live numbers via
   AHD_GATE_* env vars (see the "no-drift" step in run-all.cjs). This script
   does not itself re-run any suite — it only re-derives the small, static
   app-suite COUNT (not its assertion total) by listing tests/app/ the same
   way run-app-tests.cjs discovers files (cheap, no process spawned).

   Dated/historical citations ("earlier snapshot cited X", "then-live X",
   "١٦٨٧" mentioned only as a superseded prior value, "≈" approximations)
   are deliberately excluded — they are point-in-time citations, not live
   claims. AmadHackathon vault notes carry a live BANNER at the top and a
   dated running changelog below it; only the banner (text before the first
   level-2 "## " heading) is scanned.

   Run standalone:  AHD_GATE_TOTAL=.. AHD_GATE_CORE_LOGIC=.. ... node gate-drift-check.cjs
   (normally invoked by run-all.cjs, which sets every AHD_GATE_* var itself)
   Exit: 0 = no drift found (or env missing but self-teeth still run+pass), 1 = drift or missing env for the live scan.
============================================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");

/* ---- judge-facing LIVING surfaces (never dated logs/plans/reports) ---- */
const FULL_FILE_TARGETS = [
  "CLAUDE.md",
  "README.md",
  "docs/ARCHITECTURE.md",
  "docs/PUBLISHABLE-PRODUCT-SPEC.md",
  "docs/PRESENTER-GUIDE.md",
  "docs/evidence/EVIDENCE-BRIEF.md",
  "docs/evidence/REBUTTAL-PLAYBOOK.md",
  "docs/pitch/deck-content-v2.md",
  "docs/pitch/script-ar.md",
  "docs/pitch/top6-cards-ar.md",
  "docs/pitch/rehearsal-checklist.md",
];

/* vault notes: only the banner (before the first "## " heading) is a live
   claim — the rest is a dated, point-in-time changelog. */
const BANNER_FILE_TARGETS = [
  "AmadHackathon/00 Home.md",
  "AmadHackathon/05 حالة المشروع.md",
];

/* two tiers of "this isn't a live claim" markers:
   - WORD markers (earlier/then/سابق/…) use a WIDE ±40-char window — they're
     specific enough not to collide with unrelated nearby text in practice.
   - SYMBOL markers (≈/~, "approximately") use a TIGHT window that must
     immediately PRECEDE the number itself (e.g. "≈283"). A wide window here
     is unsafe: several banners read "N/0   (≈6s, fully offline...)" where
     the "≈" describes the UNRELATED runtime duration a few words later, not
     the count — a wide window would wrongly swallow a genuinely stale count
     sitting right before it (caught live: README.md's "AHD GATE ✅ N/0
     (≈6s…)" pattern once masked a seeded 1999/0 mismatch during dev-testing). */
const WORD_MARKERS = /earlier|then[\s-]|superseded|historical|snapshot|سابق|كانت|قديم|تقريب|approx|illustrative/i;
const SYMBOL_MARKERS_TIGHT = /[≈~]\s*$/;

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
function normalizeNumber(raw) {
  const ascii = raw.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
  return parseInt(ascii.replace(/[,٬]/g, ""), 10);
}
function stripMd(s) { return s.replace(/[*`]/g, ""); }
function lineOf(text, index) { return text.slice(0, index).split("\n").length; }

const NUM = "[0-9٠-٩][0-9٠-٩,٬]*";
const NUM_NOT_AFTER_SLASH = "(?<![/])" + NUM; // don't let the trailing "0" of an "N/0" fragment masquerade as "0 assertions"
const PATTERNS = [
  // NB: trailing `\b` is intentionally AVOIDED here — in a non-`u` JS regex `\b`/`\w`
  // are ASCII-only, so `[0٠]\b` and `word\b` silently fail on Arabic-Indic digits (٠)
  // and Arabic script (تأكيد), leaving the Arabic-Indic judge surfaces unscanned.
  // Use explicit digit-lookaheads instead (work for ASCII + Arabic-Indic alike).
  { name: "slash-zero (N/0)", re: new RegExp("(" + NUM + ")\\s*/\\s*[0٠](?![0-9٠-٩])", "g") },
  { name: "assertions/تأكيد", re: new RegExp("(" + NUM_NOT_AFTER_SLASH + ")\\s*(?:assertions?|تأكيدً?ا?)(?![0-9٠-٩])", "gi") },
  { name: "app-suite combo", re: new RegExp("(?:app|تطبيق)\\s*" + NUM + "(?:\\s*/\\s*[0٠])?\\s*\\(\\s*(" + NUM + ")\\s*(?:suites?|مجموعة)", "gi") },
  { name: "مجموعة اختبار", re: new RegExp("(" + NUM + ")\\s*مجموعة\\s*اختبار", "g") },
];

/* every count-claim match in `text`, with its normalized value + line number,
   EXCLUDING deliberately-historical/approximate citations (see the two-tier
   marker comment above WORD_MARKERS). */
function extractClaims(rawText) {
  const text = stripMd(rawText);
  const claims = [];
  for (const p of PATTERNS) {
    for (const m of text.matchAll(p.re)) {
      const idx = m.index + m[0].indexOf(m[1]);
      const wideWindow = text.slice(Math.max(0, idx - 40), Math.min(text.length, idx + m[1].length + 40));
      const tightBefore = text.slice(Math.max(0, idx - 3), idx);
      if (WORD_MARKERS.test(wideWindow) || SYMBOL_MARKERS_TIGHT.test(tightBefore)) continue;
      claims.push({ value: normalizeNumber(m[1]), raw: m[1], line: lineOf(text, idx), pattern: p.name });
    }
  }
  return claims;
}

/* scan one file (relative to root); bannerOnly truncates at the first
   "## " heading (AmadHackathon vault notes: banner vs. dated changelog) */
function scanFile(root, relPath, bannerOnly) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) return { file: relPath, claims: [], missing: true };
  let text = fs.readFileSync(abs, "utf8");
  if (bannerOnly) {
    const cut = text.search(/\n#{2,3}\s/);
    if (cut >= 0) text = text.slice(0, cut);
  }
  return { file: relPath, claims: extractClaims(text), missing: false };
}

/* full drift check over an explicit file/banner-file list against an
   explicit `allowed` Set of currently-authoritative numbers. Pure function —
   no env-var reads, no process spawns — so it is trivially fixture-testable. */
function checkDrift(root, files, bannerFiles, allowed) {
  const violations = [];
  const scanned = [];
  for (const f of files) {
    const r = scanFile(root, f, false);
    scanned.push(r.file);
    for (const c of r.claims) {
      if (!allowed.has(c.value)) violations.push({ file: r.file, line: c.line, value: c.value, pattern: c.pattern });
    }
  }
  for (const f of bannerFiles) {
    const r = scanFile(root, f, true);
    scanned.push(r.file);
    for (const c of r.claims) {
      if (!allowed.has(c.value)) violations.push({ file: r.file, line: c.line, value: c.value, pattern: c.pattern });
    }
  }
  return { violations, scanned };
}

/* the static (no-suite-run) part of the authoritative set: how many app
   suites exist on disk right now — same discovery rule as run-app-tests.cjs,
   just a directory listing, not an execution. */
function liveSuiteCount(root) {
  const dir = path.join(root, "tests", "app");
  const SUITE = /(\.test|-parity|-smoke)\.cjs$/;
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter((f) => SUITE.test(f) && f !== "run-app-tests.cjs").length;
}

module.exports = { normalizeNumber, extractClaims, checkDrift, liveSuiteCount, FULL_FILE_TARGETS, BANNER_FILE_TARGETS };

if (require.main === module) {
  let passed = 0, failed = 0;
  const fails = [];
  function ok(cond, name, detail) {
    if (cond) { passed++; console.log("  ✓ " + name); }
    else { failed++; fails.push(name + (detail ? "  — " + detail : "")); console.log("  ✗ " + name + (detail ? "  — " + detail : "")); }
  }
  function section(t) { console.log("\n" + t); }
  function withFixture(build, run) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-gate-drift-"));
    try { build(dir); return run(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  }

  /* ---- self-teeth: prove the mechanism on synthetic fixtures — never a real doc ---- */
  section("0a) Self-teeth — flags a stale gate-count citation");
  {
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"), "الحصيلة: **1234/0** تأكيدًا آليًّا."),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([2000, 184, 14, 1802]))
    );
    ok(v.violations.length === 1 && v.violations[0].value === 1234, "flags the seeded 1234/0 mismatch", JSON.stringify(v.violations));
  }

  section("0b) Self-teeth — does NOT flag a citation matching the live total");
  {
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"), "gate: 2000/0 assertions, all green."),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([2000, 184, 14, 1802]))
    );
    ok(v.violations.length === 0, "no violation when the citation equals the live total", JSON.stringify(v.violations));
  }

  section("0c) Self-teeth — deliberately historical citations are excluded (earlier/then-live)");
  {
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"), "Earlier: 1500/0 (then-live 9999/0); now 2000/0."),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([2000]))
    );
    ok(v.violations.length === 0, "1500/0 and 9999/0 are skipped as historical markers; only 2000/0 is checked and matches", JSON.stringify(v.violations));
  }

  section("0d) Self-teeth — WITHOUT the historical marker, the same stale number IS flagged");
  {
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"), "harness 1500/0 (X-1, recomputed 2026-01-01)."),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([2000]))
    );
    ok(v.violations.length === 1 && v.violations[0].value === 1500, "an undated stale citation is genuinely caught (proves the exclusion isn't just 'never fires')", JSON.stringify(v.violations));
  }

  section("0e) Self-teeth — banner files scope to text BEFORE the first '## ' heading");
  {
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"),
        "---\nfront\n---\n\n> banner 2000/0 correct\n\n## Changelog\n\n- 11 July: 1500/0 stale changelog entry\n"),
      (dir) => checkDrift(dir, [], ["doc.md"], new Set([2000]))
    );
    ok(v.violations.length === 0, "the dated changelog's 1500/0 (below '## ') is out of scope; only the banner's 2000/0 is checked", JSON.stringify(v.violations));
  }

  section("0f) Self-teeth — a WITHOUT banner-scoping, the same stale number IS flagged");
  {
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"),
        "---\nfront\n---\n\n> banner 2000/0 correct\n\n## Changelog\n\n- 11 July: 1500/0 stale changelog entry\n"),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([2000]))
    );
    ok(v.violations.length === 1 && v.violations[0].value === 1500, "scanned as a FULL file (no banner-scoping), the changelog's 1500/0 is genuinely caught", JSON.stringify(v.violations));
  }

  section("0g) Self-teeth — the combined app-suite-count formula is checked too");
  {
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"), "core 184/0 + تطبيق 999/0 (7 مجموعة) + structure 14/0 = 1197/0"),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([1197, 184, 999, 14]))
    );
    ok(v.violations.length === 1 && v.violations[0].value === 7, "flags a stale suite-count (7) inside the combined formula even though the assertion totals match", JSON.stringify(v.violations));
  }

  section("0h) Self-teeth — '≈N' immediately before a number IS treated as approximate/skipped");
  {
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"), "the older tier shipped ≈283 assertions, all green."),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([2000]))
    );
    ok(v.violations.length === 0, "≈283 (immediately-prefixed) is treated as an approximation, not a live claim", JSON.stringify(v.violations));
  }

  section("0i) Self-teeth — a trailing, UNRELATED '≈6s' runtime note does NOT mask a real stale count nearby");
  {
    // regression for a real bug caught during dev: several banners read
    // "AHD GATE ✅ N/0   (≈6s, fully offline...)" — the ≈ describes the
    // RUNTIME a few words later, not the count that precedes it. A window-
    // based exclusion around ≈ would have wrongly swallowed a stale N/0
    // sitting right before it (this is exactly the shape of README.md's
    // real banner line).
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"), "node run-all.cjs   # -> AHD GATE OK 1999/0   (~=6s, fully offline)"),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([2000]))
    );
    ok(v.violations.length === 1 && v.violations[0].value === 1999,
      "a stale 1999/0 is still caught even though an unrelated approx-runtime note follows it", JSON.stringify(v.violations));
  }

  section("0j) Self-teeth — Arabic-Indic slash-zero (١٢٣٤/٠) stale count IS caught");
  {
    // regression: a trailing `\b` on the slash-zero pattern once made Arabic-Indic
    // ٠ invisible (\b is ASCII-only), so ١٨٤/٠ etc. on the Arabic judge surfaces
    // (PRESENTER-GUIDE «الحصيلة» line) were silently unscanned.
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"), "الحصيلة: ١٢٣٤/٠ — كلّ التأكيدات خضراء."),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([2000]))
    );
    ok(v.violations.length === 1 && v.violations[0].value === 1234,
      "Arabic-Indic ١٢٣٤/٠ is scanned and flagged (not just the ASCII form)", JSON.stringify(v.violations));
  }

  section("0k) Self-teeth — Arabic-Indic 'N تأكيدًا' stale count IS caught");
  {
    // regression: the تأكيد assertion-word branch was dead under a trailing `\b`.
    const v = withFixture(
      (dir) => fs.writeFileSync(path.join(dir, "doc.md"), "المجموع ٩٩٩٩ تأكيدًا آليًّا."),
      (dir) => checkDrift(dir, ["doc.md"], [], new Set([2000]))
    );
    ok(v.violations.length === 1 && v.violations[0].value === 9999,
      "Arabic-Indic '٩٩٩٩ تأكيدًا' is scanned and flagged (the تأكيد branch is no longer dead)", JSON.stringify(v.violations));
  }

  /* ---- live scan: the real judge surfaces against the real live gate ---- */
  section("1) Live scan — judge-facing surfaces vs. the live run-all.cjs total");
  const ROOT = path.join(__dirname, "..");
  const envTotal = process.env.AHD_GATE_TOTAL;
  if (envTotal === undefined) {
    ok(false, "AHD_GATE_TOTAL (and sibling AHD_GATE_* vars) must be set by the caller",
      "run via `cd tests && node run-all.cjs` (it sets these right after computing the live total); " +
      "direct standalone runs without the env vars cannot know the authoritative count");
  } else {
    const grandTotal = parseInt(process.env.AHD_GATE_TOTAL, 10);
    const coreLogic = parseInt(process.env.AHD_GATE_CORE_LOGIC || "0", 10);
    const offline = parseInt(process.env.AHD_GATE_OFFLINE || "0", 10);
    const domSmoke = parseInt(process.env.AHD_GATE_DOM_SMOKE || "0", 10);
    const structure = parseInt(process.env.AHD_GATE_STRUCTURE || "0", 10);
    const app = parseInt(process.env.AHD_GATE_APP || "0", 10);
    const coreTotal = coreLogic + offline + domSmoke;
    const suiteCount = liveSuiteCount(ROOT);
    const allowed = new Set([grandTotal, coreTotal, coreLogic, offline, domSmoke, structure, app, suiteCount]);

    const result = checkDrift(ROOT, FULL_FILE_TARGETS, BANNER_FILE_TARGETS, allowed);
    ok(result.violations.length === 0,
      "every gate-count citation on a judge-facing surface equals the live gate (" + grandTotal + "/0, " + suiteCount + " suites)",
      result.violations.map((v) => v.file + ":" + v.line + " cites " + v.value + " (" + v.pattern + ")").join("; "));
  }

  console.log("\n========================================================");
  console.log("GATE-DRIFT CHECK: " + passed + " passed, " + failed + " failed");
  console.log("========================================================");
  if (failed > 0) { console.log("\nFAILURES:"); fails.forEach((f) => console.log("  - " + f)); }
  process.exit(failed > 0 ? 1 : 0);
}
