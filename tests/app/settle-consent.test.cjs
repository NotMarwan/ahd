const path = require("path");
let SC;
try { SC = require(path.join(__dirname, "..", "..", "app", "features", "settle-consent.js")); }
catch (e) { console.log("SETTLECONSENT RED: " + e.message); process.exit(1); }
let passed = 0, failed = 0;
const ok = (c, n) => c ? (passed++, console.log("  ✓ " + n)) : (failed++, console.log("  ✗ " + n));
const throws = (fn, n) => { try { fn(); failed++; console.log("  ✗ " + n + " (did not throw)"); } catch (e) { passed++; console.log("  ✓ " + n); } };

const transfers = [{ from: "سالم", to: "نورة", amount: 150 }, { from: "خالد", to: "نورة", amount: 50 }];
const s0 = SC.makeState(transfers);
ok(s0.legs.length === 2 && s0.legs[0].from === "سالم" && Object.keys(s0.legs[0].consents).length === 0, "state mirrors the transfers with empty consents");

const s1 = SC.consent(s0, 0, "سالم");
ok(s1.legs[0].consents["سالم"] === true && !s0.legs[0].consents["سالم"], "consent is immutable");
ok(SC.legReady(s1.legs[0]) === false, "one party is not enough");
const s2 = SC.consent(s1, 0, "نورة");
ok(SC.legReady(s2.legs[0]) === true, "both parties → leg ready");
ok(SC.allReady(s2) === false, "other legs still gate the settlement");
const s3 = SC.consent(SC.consent(s2, 1, "خالد"), 1, "نورة");
ok(SC.allReady(s3) === true, "all legs consented → settlement may seal");

throws(() => SC.consent(s0, 0, "غريب"), "a stranger cannot consent to a leg");
throws(() => SC.consent(s0, 5, "سالم"), "unknown leg index throws");

ok(SC.impactAr(s0.legs[0], "سالم").indexOf("150") >= 0 && SC.impactAr(s0.legs[0], "سالم").indexOf("يدفع") >= 0, "impact line for the payer");
ok(SC.impactAr(s0.legs[0], "نورة").indexOf("يستلم") >= 0, "impact line for the receiver");

ok(JSON.stringify(SC.makeState(transfers)) === JSON.stringify(s0), "deterministic");

console.log(`\nSETTLECONSENT: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
