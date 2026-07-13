/* ============================================================================
   shariah-basis.test.cjs — TDD for «الأساس الشرعي» content model (feasibility
   gate, W4). The claim: every core mechanic (قرض حسن، الختم الرقمي، المقاصّة،
   لا ربا/لا غرامة/لا ميسر/لا غرر، إشارة الثقة النوعيّة) names its cited
   verse/standard, and every genuinely open question is phrased AS A QUESTION
   for a qualified scholar — never a ruling. AI issues no fatwa (spine).
   Pure content; frozen; deterministic; on-spine (no %, no trust NUMBER).
============================================================================ */
const path = require("path");
const fs = require("fs");
const SB = require(path.join(__dirname, "..", "..", "app", "features", "shariah-basis.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ " + m); } };

console.log("shariah-basis.test: «الأساس الشرعي» — cited mechanics + open questions as QUESTIONS (never a ruling)");

/* ---- module shape ---- */
ok(Array.isArray(SB.MECHANICS), "MECHANICS is an array");
ok(SB.MECHANICS.length === 5, "exactly 5 core mechanics (got " + SB.MECHANICS.length + ")");
ok(Array.isArray(SB.OPEN_QUESTIONS) && SB.OPEN_QUESTIONS.length >= 3, "at least 3 open questions (got " + (SB.OPEN_QUESTIONS || []).length + ")");
ok(typeof SB.NO_FATWA_LINE === "string" && SB.NO_FATWA_LINE.length > 0, "NO_FATWA_LINE exists");
ok(typeof SB.PENDING_NOTE === "string" && SB.PENDING_NOTE.length > 0, "PENDING_NOTE exists");
ok(typeof SB.describeAr === "function", "describeAr exists");

/* ---- the five expected mechanics, in order ---- */
const KEYS = SB.MECHANICS.map(m => m.key);
ok(JSON.stringify(KEYS) === JSON.stringify(["qard", "seal", "netting", "no-riba", "trust-band"]),
   "mechanic keys are qard,seal,netting,no-riba,trust-band in that order (got " + KEYS.join(",") + ")");

/* ---- every mechanic: complete + cites at least one source ---- */
SB.MECHANICS.forEach(function (m) {
  ok(typeof m.titleAr === "string" && m.titleAr.length > 0, "[" + m.key + "] has a non-empty Arabic title");
  ok(typeof m.mechanicAr === "string" && m.mechanicAr.length > 0, "[" + m.key + "] has a non-empty mechanic description");
  ok(Array.isArray(m.citations) && m.citations.length >= 1, "[" + m.key + "] cites at least one source");
  m.citations.forEach(function (c) {
    ok(typeof c.kind === "string" && c.kind.length > 0, "[" + m.key + "] citation has a kind");
    ok(typeof c.labelAr === "string" && c.labelAr.length > 0, "[" + m.key + "] citation «" + c.kind + "» has a non-empty label");
    ok(typeof c.noteAr === "string" && c.noteAr.length > 0, "[" + m.key + "] citation «" + c.kind + "» has a non-empty note");
    ok(["verified", "recorded", "pending", "design-only"].indexOf(c.grade) >= 0,
       "[" + m.key + "] citation «" + c.kind + "» has a valid grade (got " + c.grade + ")");
  });
});

/* ---- THE TEETH: across all mechanics, at least one AAOIFI standard citation
   AND at least one Qur'an citation exist (the task's floor: "cite the relevant
   AAOIFI SS-19 clause(s) + Qur'an 2:282/2:280 where relevant") ---- */
const ALL_CITES = [];
SB.MECHANICS.forEach(m => m.citations.forEach(c => ALL_CITES.push(Object.assign({ mechanic: m.key }, c))));
ok(ALL_CITES.some(c => c.kind === "aaoifi"), "at least one AAOIFI Shariah Standard citation exists across all mechanics");
ok(ALL_CITES.some(c => c.kind === "quran" && /٢:٢٨٢|2:282/.test(c.refAr || "")), "Qur'an 2:282 (write the debt) is cited");
ok(ALL_CITES.some(c => c.kind === "quran" && /٢:٢٨٠|2:280/.test(c.refAr || "")), "Qur'an 2:280 (grace/respite) is cited");
ok(ALL_CITES.some(c => c.kind === "law" && /الإثبات/.test(c.labelAr)), "نظام الإثبات (Evidence Law) is cited for the sealing mechanic");

/* AAOIFI clause numbers already vetted in the project's own arsenal must appear
   verbatim (never invented) — 10/3/2 (no linkage to principal) + 7/8 (Hilah test) */
ok(ALL_CITES.some(c => /١٠\/٣\/٢|10\/3\/2/.test(c.clauseAr || "")), "AAOIFI SS-19 clause 10/3/2 (no linkage to the amount lent) is cited");
ok(ALL_CITES.some(c => /٧\/٨|7\/8/.test(c.clauseAr || "")), "AAOIFI SS-19 clause 7/8 (Hilah/bundling test) is cited");

/* ---- honesty: any citation whose exact clause/article number is NOT pinned
   by the project's own vetted sources must be graded "pending" or "recorded",
   never "verified" — never invent a citation ---- */
ok(ALL_CITES.filter(c => c.grade === "pending").length >= 1, "at least one citation is honestly graded «pending» (exact number to confirm)");

/* ---- the trust-band mechanic stays a WORD, never a number (spine) ---- */
const trustBand = SB.MECHANICS.filter(m => m.key === "trust-band")[0];
ok(!!trustBand, "trust-band mechanic exists");
ok(/كلمة|لا رقم|لا يُصدَّر|لا تُصدَّر/.test(trustBand.mechanicAr), "trust-band mechanic states the word-not-number rule");

/* ---- OPEN QUESTIONS: every one is a QUESTION (ends with ؟), names its
   audience (a qualified scholar), and contains NO ruling/fatwa language ---- */
const RULING_MARKERS = ["الحكم الشرعي هو", "نُفتي بأنّ", "الفتوى أنّ", "هذا حلالٌ قطعًا", "هذا حرامٌ قطعًا", "يُحكَم بأنّ", "قرارنا أنّ"];
SB.OPEN_QUESTIONS.forEach(function (q) {
  ok(typeof q.id === "string" && q.id.length > 0, "open question has an id");
  ok(typeof q.questionAr === "string" && q.questionAr.trim().length > 0, "[" + q.id + "] has a non-empty question");
  ok(/؟\s*$/.test(q.questionAr.trim()), "[" + q.id + "] is phrased as a QUESTION (ends with ؟): " + q.questionAr.slice(0, 40) + "…");
  ok(typeof q.forAudience === "string" && /عالِم|عالم|هيئة|لجنة/.test(q.forAudience), "[" + q.id + "] names a qualified-scholar audience");
  ok(RULING_MARKERS.every(rm => q.questionAr.indexOf(rm) < 0), "[" + q.id + "] contains NO ruling/fatwa-issuing language");
  ok(Array.isArray(q.relatesTo) && q.relatesTo.length >= 1, "[" + q.id + "] links to at least one tracked decision/thread id");
});

/* the three named open questions from the task brief must be present */
const QIDS = SB.OPEN_QUESTIONS.map(q => q.id);
ok(QIDS.some(id => /D-6a|hilah|Hilah/i.test(id)), "the Hilah / «كل قرضٍ جرَّ نفعًا» concern is an open question");
ok(QIDS.indexOf("D-1") >= 0, "D-1 (self-disclosure of one's own band) is an open question");
ok(QIDS.indexOf("D-3") >= 0, "D-3 (pooled-deposit / مود Mode-B) is an open question");

/* ---- spine: no percentage/score glyph, no fatwa line states the AI bound ---- */
const blob = JSON.stringify(SB);
ok(blob.indexOf("%") < 0 && blob.indexOf("٪") < 0, "NO percentage/score glyph anywhere in the module");
ok(/لا يُفتي/.test(SB.NO_FATWA_LINE), "NO_FATWA_LINE explicitly states «لا يُفتي»");
ok(/بانتظار مراجعة عالِم/.test(SB.PENDING_NOTE), "PENDING_NOTE carries the exact «أسئلة بانتظار مراجعة عالِم» framing");

/* ---- describeAr: heading + sub, deterministic ---- */
const d = SB.describeAr();
ok(typeof d.heading === "string" && d.heading.length > 0, "describeAr returns a non-empty heading");
ok(typeof d.sub === "string" && d.sub.length > 0, "describeAr returns a non-empty sub");
ok(d.noFatwaLine === SB.NO_FATWA_LINE, "describeAr surfaces the no-fatwa line");
ok(d.pendingNote === SB.PENDING_NOTE, "describeAr surfaces the pending-review note");
ok(JSON.stringify(SB.describeAr()) === JSON.stringify(d), "describeAr is deterministic (identical JSON on a second call)");

/* ---- immutability ---- */
ok(Object.isFrozen(SB.MECHANICS) && SB.MECHANICS.every(m => Object.isFrozen(m) && Object.isFrozen(m.citations)),
   "MECHANICS is deep-frozen (content cannot drift at runtime)");
ok(Object.isFrozen(SB.OPEN_QUESTIONS) && SB.OPEN_QUESTIONS.every(q => Object.isFrozen(q)),
   "OPEN_QUESTIONS is deep-frozen");

/* ---- source purity: no nondeterminism/networking primitive (mirrors bounds.test.cjs) ---- */
const src = fs.readFileSync(path.join(__dirname, "..", "..", "app", "features", "shariah-basis.js"), "utf8");
["Date.now", "new Date", "Math.random", "Intl.", ".toLocaleString", "fetch(", "XMLHttpRequest", "WebSocket"].forEach(tok =>
  ok(src.indexOf(tok) < 0, "module source has no «" + tok + "»"));

console.log("\nshariah-basis: " + pass + "/" + (pass + fail) + (fail ? "  (" + fail + " FAILED)" : ""));
process.exit(fail ? 1 : 0);
