const path = require("path");
let JI;
try { JI = require(path.join(__dirname, "..", "..", "app", "features", "jamiya-invite.js")); }
catch (e) { console.log("JAMINVITE RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));
const throws = (fn, n) => { try { fn(); failed++; console.log("  ✗ " + n + " (did not throw)"); } catch (e) { passed++; console.log("  ✓ " + n); } };

const spec = { members: ["أم سارة", "نورة", "هند"], monthlyMinor: 100000, startMonth: "2026-07", orderAgreed: ["نورة", "أم سارة", "هند"] };
const card = JI.build(spec);
ok(card.termsAr.length >= 4, "invite card lists amount/duration/receive/order terms");
ok(card.termsAr.some(t => t.v.indexOf("1000") >= 0), "monthly amount rendered in SAR");
ok(card.absentAr.length === 3 && card.absentAr.join("").indexOf("رسوم") >= 0 && card.absentAr.join("").indexOf("حيازة") >= 0 && card.absentAr.join("").indexOf("سند") >= 0, "absent list: لا رسوم / لا حيازة / لا سند تنفيذي (Hakbah rejections)");
ok(card.perMember.length === 3 && card.perMember[0].name === "أم سارة" && card.perMember[0].round === 2, "per-member card knows each member's agreed round");

const s0 = JI.makeState(spec.members);
ok(JI.allAccepted(s0, spec.members) === false, "nobody accepted yet");
const s1 = JI.accept(s0, "أم سارة");
ok(s1.decisions["أم سارة"].status === "accepted" && !s0.decisions["أم سارة"], "accept is immutable");
const s2 = JI.decline(s1, "نورة", "الشهر لا يناسبني");
ok(s2.decisions["نورة"].status === "declined" && s2.decisions["نورة"].reasonAr === "الشهر لا يناسبني", "decline keeps the reason");
ok(JI.allAccepted(s2, spec.members) === false, "declined member blocks unanimity");
const s3 = JI.accept(JI.accept(s2, "نورة"), "هند");
ok(JI.allAccepted(s3, spec.members) === true, "re-accept after decline + last member → unanimous");
throws(() => JI.accept(s0, "غريب"), "accepting a non-member throws");

const sum = JI.summaryAr(s2, spec.members);
ok(sum.indexOf("1") >= 0 || sum.indexOf("١") >= 0, "summary counts decisions");
ok(JSON.stringify(JI.build(spec)) === JSON.stringify(card), "build deterministic");

console.log(`\nJAMINVITE: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
