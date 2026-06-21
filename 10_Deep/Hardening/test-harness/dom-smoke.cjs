/* ============================================================================
   dom-smoke.cjs — headless render + robustness smoke. Zero dependencies.
   Runs the WHOLE shipped <script> under a minimal fake DOM and drives the
   full demo flow + the adversarial robustness paths, asserting nothing throws.

   This is the "browser smoke" you can run anywhere offline. It proves the
   render/control-flow + the hardening guards EXECUTE cleanly:
     • every screen R[0..4] renders without error
     • go() clamps out-of-range targets (no unbuilt state)
     • double-tap on a Nafath confirm is ignored (no double issue / no crash)
     • navigation cancels in-flight timers (no orphaned-timer write)
     • a thrown render is caught by the offline fallback (clean recovery)
   (The real-Chrome pass — browser-smoke.mjs / Playwright MCP — validates pixels
    and console; this validates control flow with no browser dependency.)
   Run:  node dom-smoke.cjs
============================================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const HTML_PATH = path.join(__dirname, "..", "..", "..", "project", "ahd-demo", "index.html");
const html = fs.readFileSync(HTML_PATH, "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

let passed = 0, failed = 0;
function ok(cond, name, detail) {
  if (cond) { passed++; console.log("  ✓ " + name); }
  else { failed++; console.log("  ✗ " + name + (detail ? "  — " + detail : "")); }
}
function noThrow(fn, name) { try { fn(); ok(true, name); } catch (e) { ok(false, name, e && e.message); } }

/* ---- minimal fake DOM: concrete elements with exactly the APIs the page uses ---- */
function makeEl() {
  const e = {
    _html: "", style: {}, disabled: false, value: "", onclick: null,
    classList: { s: new Set(), add(c) { this.s.add(c); }, remove(c) { this.s.delete(c); }, contains(c) { return this.s.has(c); } },
    addEventListener() {}, removeEventListener() {}, focus() {}, setAttribute() {},
    querySelector() { return makeEl(); }, querySelectorAll() { return []; }, appendChild() {},
  };
  Object.defineProperty(e, "innerHTML", { get() { return this._html; }, set(v) { this._html = String(v); } });
  Object.defineProperty(e, "outerHTML", { get() { return ""; }, set(v) {} });
  Object.defineProperty(e, "textContent", { get() { return this._html; }, set(v) { this._html = String(v); } });
  return e;
}
let timerId = 0;
const sandbox = {
  Math, Array, Object, JSON, String, Number, Boolean, RegExp, Error, parseInt, parseFloat, isNaN, isFinite,
  TextEncoder, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float64Array, ArrayBuffer, DataView,
  console: { log() {}, error() {}, warn() {} },               // swallow the fallback's diagnostic line
  setTimeout: () => ++timerId, clearTimeout: () => {},        // timers do NOT auto-fire in the smoke
  setInterval: () => ++timerId, clearInterval: () => {},
  document: { body: { contains: () => true }, getElementById: () => makeEl(), querySelector: () => makeEl(), createElement: () => makeEl(), addEventListener() {} },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.scrollTo = () => {};
sandbox.addEventListener = () => {};

const FOOTER = `;globalThis.__APP={go,confirmPerson,issueRecord,renderDoc,runVerify,runMuqassa,settleNext,graceReschedule,showMuqassaConsent,renderConsentCards,renderSeedAhds,renderLifecycle,R,S,renderFallback,foldCircle,renderG1,renderG2,renderG3,renderG4,circleRemind,circleForgive,circleAddMember,circleSettleRest,circleConfirmShare};`;

console.log("Headless render + robustness smoke\n");
vm.createContext(sandbox);
noThrow(() => vm.runInContext(script + FOOTER, sandbox, { filename: "ahd-full.js" }), "page boots (script runs, go(0) renders) without error");
const A = sandbox.__APP;

/* drive every screen (6-step flow: 0 problem · 1 create · 2 C1 invite · 3 seal · 4 settle · 5 muqassa) */
noThrow(() => A.go(0), "R[0] (problem · KSA demand) renders");
noThrow(() => A.go(1), "R[1] (create + typing) renders");
noThrow(() => A.go(2), "R[2] (C1 «وصلتك بسلامة» invite) renders");
noThrow(() => A.go(3), "R[3] (Nafath confirm) renders");
noThrow(() => A.issueRecord(), "issueRecord (witnessed record + lifecycle) renders");
noThrow(() => A.renderDoc(), "renderDoc renders");
noThrow(() => A.runVerify(), "runVerify (clean) renders");
noThrow(() => { A.S.tampered = true; A.renderDoc(); A.runVerify(); A.S.tampered = false; }, "tamper toggle + verify renders");
noThrow(() => A.renderLifecycle(), "lifecycle track (derived status) renders");
noThrow(() => A.renderSeedAhds(), "seeded states (defaulted/disputed/forgiven) render");
noThrow(() => A.go(4), "R[4] (settlement + يُسر grace) renders");
noThrow(() => A.graceReschedule(), "يُسر grace reschedule renders (no penalty)");
noThrow(() => { for (let i = 0; i < 9; i++) A.settleNext(); }, "settleNext to completion (ذمّة محفوظة) renders");
noThrow(() => A.go(5), "R[5] (Muqassa) renders");
noThrow(() => A.showMuqassaConsent(), "Muqassa consent step renders");
noThrow(() => A.renderConsentCards(), "consent cards render");
noThrow(() => A.runMuqassa(), "runMuqassa (graph + conservation proof) renders");

/* robustness paths */
noThrow(() => { A.go(99); ok(A.S.step === 5, "go(99) clamps to last screen (step=" + A.S.step + ")"); }, "go(99) does not throw");
noThrow(() => { A.go(-5); ok(A.S.step === 0, "go(-5) clamps to first screen (step=" + A.S.step + ")"); }, "go(-5) does not throw");

A.go(3);                                               // step 3 is now the Nafath confirm
A.confirmPerson("L");
const firstTimer = A.S.timers.L;
A.confirmPerson("L");                                  // double-tap
ok(A.S.timers.L === firstTimer, "double-tap on a confirm is ignored (no second timer started)");
ok(A.S.conf.L === false || A.S.conf.L === true, "confirm state remains well-defined after double-tap");
noThrow(() => A.confirmPerson("ZZ"), "confirmPerson with an unknown party is a safe no-op");

/* navigation cancels in-flight timers (orphaned-timer guard) */
A.go(3); A.confirmPerson("L"); A.confirmPerson("B");
A.go(0);
ok(A.S.timers.L === 0 && A.S.timers.B === 0 && A.S.timers.type === 0, "go() cleared all in-flight timers on navigation");
ok(A.S.gracePlan === null && A.S.consent === null, "go(0) reset clears gracePlan + consent state");

/* offline fallback: a thrown render is caught and recovered, not propagated */
const savedR3 = A.R[3];
A.R[3] = () => { throw new Error("simulated render failure"); };
noThrow(() => A.go(3), "a throwing screen is caught by the offline fallback (no crash)");
A.R[3] = savedR3;
A.go(0);

/* ---- الدائرة · Circle screens (G1..G4) + organizer/member actions ---- */
noThrow(() => A.go("G1"), "G1 (أنشئ دائرة · create) renders");
noThrow(() => A.go("G2"), "G2 (member receives their share) renders");
noThrow(() => A.circleConfirmShare("ريم"), "member confirm (أؤكّد نصيبي) is a safe op");
noThrow(() => A.go("G3"), "G3 (treasurer dashboard) renders");
noThrow(() => A.circleRemind(), "group reminder renders (never names the late member)");
noThrow(() => A.circleAddMember(), "add a late member renders (new عهد into the circle)");
noThrow(() => A.circleForgive(), "forgive a share (إبراء · FORGIVEN) renders");
noThrow(() => A.circleSettleRest(), "settle remaining shares renders");
ok(A.foldCircle(A.S.circle).status === "CIRCLE_KEPT", "circle reaches CIRCLE_KEPT (ذمّة المناسبة محفوظة) after all shares settle");
noThrow(() => A.go("G4"), "G4 (Muqassa hand-off) renders");
noThrow(() => A.go("ZZ"), "unknown circle key is a safe no-op (no unbuilt screen)");
A.go(0);
ok(A.S.circle === null, "go(0) reset clears the live circle instance");

console.log("\n" + "=".repeat(56));
console.log(`DOM SMOKE: ${passed} passed, ${failed} failed`);
console.log("=".repeat(56));
process.exit(failed ? 1 : 0);
