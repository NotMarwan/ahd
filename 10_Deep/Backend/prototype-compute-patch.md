---
title: "عهد · Ahd — Prototype compute patch (logic-only drop-in, handed to the file owner)"
tags: [ahd, backend, prototype, patch, handoff, deep]
owner: Claude-Backend (PROMPT 2)
status: ready-to-apply (NOT applied by me — see Why below)
updated: 2026-06-19
---

# 🔧 Prototype compute patch — `project/ahd-demo/index.html` (logic only)

## Why this is a patch, not a direct edit (no-clobber)

`project/ahd-demo/index.html` is under an **active concurrent hardening pass by Claude-Hardening**
(PROMPT 4) — they had, by 13:47, already rewritten the money policy to **integer halalas**
(`MINOR`/`toMinor`/`minorToFixed2`), determinism-hardened `fmt()`, converted Muqassa `netting()`
to **exact integer** arithmetic, and restructured the SEAL into named pure functions
(`sealBlock`/`verifyRecord`) with `===AHD-LOGIC===` test-harness markers. Two of my three planned
compute edits (**integer halalas**, **Muqassa epsilon→exact**) were thus **already delivered by
that pass**. Editing the same functions concurrently would clobber in-flight work, which the
agent-awareness protocol forbids. So the two remaining, non-overlapping upgrades are handed off
here as exact drop-ins. The reference engine `ref/ahd-ref.mjs` + [[test-vectors]] are the
browser-independent proof that both are correct and deterministic.

Coordination logged in `.agent-presence/coordination_notes.md` (13:46).

---

## Patch A — computed trust signal (replaces the static `REP` table) · **Data criterion**

**What:** the reputation ring is currently a hardcoded fraction
`REP={"نورة":[12,12],…}; ratio=kept/total`. Replace it with a **real windowed, time-decayed
kept-ratio** computed from each person's own event history (matches
[[trust-signal-and-graph-analytics]] and `trustSignal()` in the reference engine). Deterministic
(fixed `AS_OF`, no `Date.now`). Low collision risk: Hardening has **not** touched `REP`/`nodeSVG`.

**A1 — replace the `REP` constant (≈ line 329) with:**

```js
/* kept-promises trust signal — windowed, time-decayed kept-ratio over each person's OWN
   sealed history. SOCIAL mirror, NOT a credit score (see 10_Deep/Backend/trust-signal-…md).
   Deterministic: fixed AS_OF, no Date.now. Mirrors ref/ahd-ref.mjs trustSignal(). */
const TRUST_CFG={AS_OF:"2026-06",WINDOW:24,HALF_LIFE:12};
function _monthsBetween(a,b){const[fy,fm]=a.split("-").map(Number),[ty,tm]=b.split("-").map(Number);return (ty-fy)*12+(tm-fm);}
function _genHist(total,kept,start){const[y,m]=start.split("-").map(Number);const e=[];
  for(let i=0;i<total;i++){const mm=((m-1+i)%12)+1,yy=y+Math.floor((m-1+i)/12);
    e.push({t:`${yy}-${String(mm).padStart(2,"0")}`,kept:i>=(total-kept)});}return e;}
function trustSignal(events,openOverdue){
  let wK=0,wT=0,c=0;
  for(const ev of events){const age=_monthsBetween(ev.t,TRUST_CFG.AS_OF);
    if(age<0||age>=TRUST_CFG.WINDOW)continue;
    const w=Math.pow(0.5,age/TRUST_CFG.HALF_LIFE); wT+=w; if(ev.kept)wK+=w; c++;}
  const ratio=wT===0?0:wK/wT;
  let band;
  if(c<3)band="new"; else if(openOverdue)band="overdue";
  else if(ratio>=0.85)band="kept"; else if(ratio>=0.6)band="mixed"; else band="overdue";
  return {band,ratio,count:c};
}
const _HIST={"نورة":_genHist(12,12,"2024-08"),"سارة":_genHist(19,18,"2024-06"),
  "خالد":_genHist(8,7,"2024-09"),"ليلى":_genHist(23,22,"2023-12"),"فهد":_genHist(6,5,"2025-02")};
const _OPEN_OVERDUE={"خالد":true};                       // خالد currently has a past-due vow
const TRUST=Object.fromEntries(NODES.map(n=>[n,trustSignal(_HIST[n],!!_OPEN_OVERDUE[n])]));
```

**A2 — in `nodeSVG()` (≈ line 377) change the first line:**

```js
// BEFORE: const p=pos(name),[kept,total]=REP[name],ratio=kept/total;
const p=pos(name),ratio=TRUST[name].ratio;               // computed windowed kept-ratio
```

**Expected on-screen ratios after A1+A2:** نورة 100% · سارة 100% · خالد 90% · ليلى 100% · فهد 86%
(bands: kept/kept/**overdue**/kept/kept). Exact values: [[test-vectors|§6.1]].

> ⚠️ **For Claude Design (styling, not logic):** line 384 still renders a numeric `%`
> (`${Math.round(ratio*100)}%`). **S9 forbids a number for the trust signal** — it must be a
> qualitative band. The engine now exposes `TRUST[name].band` ("kept"/"new"/"overdue"); swap the
> `%` text for the Arabic band word ("وفّى بعهوده" / "جديد" / "عليه وعدٌ متأخّر"). That text swap is
> a visual change → Design's call, not mine.

---

## Patch B — RFC-8785 JCS SEAL (optional depth upgrade, supersedes the current chain)

**What:** the demo currently seals with a custom newline `canonical()` + `seal = SHA-256(prev ‖
canonical_hash ‖ seq)`. This is real and tamper-evident, but **not** the spec scheme
([[seal-scheme-spec|S2]]): **RFC-8785 JCS → SHA-256 → Nafath binding → envelope → chain leaf +
bank sig**. This patch raises it to spec depth, byte-matching [[test-vectors|§2]]. It **replaces**
`canonical`/`SEALED`/`sealBlock`/`recomputeSeal`/`verifyRecord` — coordinate with Claude-Hardening
since those are their named-pure-function/test-harness blocks. (Keep their pure-function style: the
functions below are equally pure and unit-testable.)

**B1 — add the JCS canonicalizer (after `sha256`, ≈ line 219):**

```js
/* RFC-8785 JSON Canonicalization (restricted domain: string|int|bool|null|array|object) */
function jcs(v){
  if(v===null)return "null";
  if(typeof v==="boolean")return v?"true":"false";
  if(typeof v==="number"){if(!Number.isFinite(v)||!Number.isInteger(v))throw new Error("JCS: integers only");return String(v);}
  if(typeof v==="string")return JSON.stringify(v);
  if(Array.isArray(v))return "["+v.map(jcs).join(",")+"]";
  if(typeof v==="object")return "{"+Object.keys(v).sort().map(k=>JSON.stringify(k)+":"+jcs(v[k])).join(",")+"}";
  throw new Error("JCS: unsupported type");
}
const jcsHash=o=>sha256(jcs(o));
```

**B2 — replace `canonical`/`SEALED`/`sealBlock`/`recomputeSeal`/`verifyRecord` with:**

```js
const SUB={
  lender:jcsHash({_t:"mock.nafath.sub.v1",id_namespace:"alinma-ahd",name:AG.lender}),
  borrower:jcsHash({_t:"mock.nafath.sub.v1",id_namespace:"alinma-ahd",name:AG.borrower})
};
function canonicalSchedule(principal_halalas,months,start){
  const base=Math.floor(principal_halalas/months),rem=principal_halalas-base*months;
  return Array.from({length:months},(_,i)=>{
    const amount_halalas=base+(i<rem?1:0);
    const mm=((start.m-1+i)%12)+1,yy=start.y+Math.floor((start.m-1+i)/12);
    return {seq:i+1,due:`${yy}-${String(mm).padStart(2,"0")}-01`,amount_halalas};
  });
}
function buildTerms(principal_halalas){
  return {_t:"ahd.terms.v1",ahd_id:AG.ahd_id,kind:"qard_hasan",
    parties:[{role:"lender",display_name:AG.lender,nafath_sub:SUB.lender},
             {role:"borrower",display_name:AG.borrower,nafath_sub:SUB.borrower}],
    principal:{amount_halalas:principal_halalas,currency:"SAR"},months:AG.months,
    schedule:canonicalSchedule(principal_halalas,AG.months,AG.start),
    riba:{interest:false,late_penalty_to_lender:false,gharar:false},
    terms_ar:AG.terms_ar,basis:"Quran:2:282",ts:AG.timestamp};
}
const ASSERT=[
  {sub:SUB.lender,acr:"nafath.biometric",auth_time:"2026-07-01T10:29:40+03:00",txn_id:"NFTH-TXN-LENDER-7731"},
  {sub:SUB.borrower,acr:"nafath.biometric",auth_time:"2026-07-01T10:29:58+03:00",txn_id:"NFTH-TXN-BORROW-7748"}
];
const BANK_ATTESTATION="تشهد المنشأة بأنّ هويتين موثّقتين عبر نفاذ (acr ≥ substantial) ختمتا هذه السلسلة من البايتات بعينها في وقت الختم المعتمد، وأنّها لم تُعدَّل منذ ذلك الحين. ولا تشهد المنشأة بانتقال نقدٍ فعلي، ولا بعدالة الشروط أو نهائيتها الشرعية، ولا بانتفاء الإكراه, ولا بصحة أيّ واقعةٍ أساس — تُحال هذه إلى الجهات القضائية.";
const GENESIS=jcsHash({_t:"ahd.genesis.v1",tenant:"alinma",epoch:"2026"});
function buildRecord(principal_halalas){
  const terms=buildTerms(principal_halalas);
  const h=jcsHash(terms);
  const assertions=ASSERT.map(a=>({sub:a.sub,acr:a.acr,auth_time:a.auth_time,txn_id:a.txn_id,
    sig:jcsHash({_t:"ahd.nafath.binding.v1",sub:a.sub,acr:a.acr,auth_time:a.auth_time,txn_id:a.txn_id,terms_hash:h})}));
  const tsa_token=jcsHash({_t:"ahd.tsa.v1",terms_hash:h,tsa:"mock-tsa-alinma",gen_time:"2026-07-01T10:30:05+03:00"});
  const envelope={_t:"ahd.envelope.v1",ahd_id:AG.ahd_id,terms_hash:h,assertions,tsa_token,
    fee:{flat_halalas:0,basis:"actual_direct_cost"},attestation:BANK_ATTESTATION};
  const envelope_hash=jcsHash(envelope);
  const leaf=jcsHash({_t:"ahd.leaf.v1",seq:1,prev_chain_hash:GENESIS,envelope_hash});
  const bank_sig=jcsHash({_t:"ahd.banksig.v1",key_id:"alinma-seal-key-2026",leaf});
  return {terms,terms_hash:h,canonical_hash:h,assertions,tsa_token,envelope_hash,
          seq:1,prev:GENESIS,leaf,seal:leaf,bank_sig};   // seal/canonical_hash aliases keep display code working
}
const SEALED=buildRecord(AG.principal_minor!=null?AG.principal_minor:AG.amount_minor);
function recomputeSeal(amtSar){return buildRecord(amtSar==null?(AG.principal_minor!=null?AG.principal_minor:AG.amount_minor):toMinor(amtSar));}
function verifyRecord(amtSar){const r=recomputeSeal(amtSar);return {ok:r.seal===SEALED.seal,sealed:SEALED.seal,recomputed:r.seal,canonical_hash:r.canonical_hash};}
```

**B3 — display refs (in `renderDoc`/`runVerify`):** the aliases above (`SEALED.seal`,
`SEALED.canonical_hash`) keep existing display code working unchanged. The displayed hashes simply
become the spec values: content `ceedb1e9…`, seal/leaf `f7999f87…`. The tamper toggle still passes
`9000` SAR → `recomputeSeal(9000)` → mismatch → "عبثٌ مكشوف".

> Note: B2 keeps the same SAR tamper interface (`recomputeSeal(9000)`) so the toggle in
> `issueRecord()` needs no change. Internally it scales to `900000` halalas.

**Expected after B:** terms/seal/bank_sig byte-match [[test-vectors|§2]]; intact verify ✓; tamper
5,000→9,000 ✗. Cross-engine guaranteed (Node + Chrome share V8; SHA-256 NIST-pinned).

---

## Verification checklist (for whoever applies this)

```
node ref/generate-vectors.mjs        # reference values (the source of truth)
# in browser (node ../_serve.cjs → http://localhost:8123):
#   0 JS console errors
#   Patch A: rings show 100/100/90/100/86; خالد band=overdue
#   Patch B: record hash ceedb1e9…, seal f7999f87…; tamper 5,000→9,000 → "عبثٌ مكشوف"
```
