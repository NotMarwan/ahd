/* ============================================================================
   AUTO-GENERATED — DO NOT EDIT BY HAND.  Regenerate: node build-engine.cjs
   This is a BYTE-FAITHFUL copy of the pure AHD-LOGIC region of
   project/ahd-demo/index.html (the demo is never modified). The parity test
   10_Deep/Hardening/test-harness/app/engine-parity.cjs proves this copy matches
   the demo's golden outputs and contains the exact slice.
   Reuse: Node  -> const AHD = require("./engine.js")
          Browser -> <script src="engine.js"></script> then window.AHD
============================================================================ */

/* ============================================================================
   1) Real SHA-256 (pure JS, synchronous, offline, deterministic).
      Used for the witnessed-record content hash + the append-only hash-chain.
      (Production: both parties' Nafath/PKI signatures + an RFC-3161 timestamp
       token from a licensed TSP; here the HASHING is real, the PKI/TSA are seams.)
============================================================================ */
const K256=[
 0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
 0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
 0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
 0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
 0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
 0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
 0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
 0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
function sha256bytes(bytes){
  let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,
      h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
  const l=bytes.length, withOne=l+1, k=(56-(withOne%64)+64)%64, total=withOne+k+8;
  const m=new Uint8Array(total); m.set(bytes); m[l]=0x80;
  const dv=new DataView(m.buffer);
  const bitLen=l*8;
  dv.setUint32(total-4, bitLen>>>0, false);
  dv.setUint32(total-8, Math.floor(bitLen/0x100000000), false);
  const w=new Uint32Array(64);
  const rotr=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let i=0;i<total;i+=64){
    for(let t=0;t<16;t++) w[t]=dv.getUint32(i+t*4,false);
    for(let t=16;t<64;t++){
      const s0=rotr(w[t-15],7)^rotr(w[t-15],18)^(w[t-15]>>>3);
      const s1=rotr(w[t-2],17)^rotr(w[t-2],19)^(w[t-2]>>>10);
      w[t]=(w[t-16]+s0+w[t-7]+s1)>>>0;
    }
    let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;
    for(let t=0;t<64;t++){
      const S1=rotr(e,6)^rotr(e,11)^rotr(e,25);
      const ch=(e&f)^((~e)&g);
      const t1=(h+S1+ch+K256[t]+w[t])>>>0;
      const S0=rotr(a,2)^rotr(a,13)^rotr(a,22);
      const maj=(a&b)^(a&c)^(b&c);
      const t2=(S0+maj)>>>0;
      h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
    }
    h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;
    h4=(h4+e)>>>0;h5=(h5+f)>>>0;h6=(h6+g)>>>0;h7=(h7+h)>>>0;
  }
  const hx=x=>('00000000'+(x>>>0).toString(16)).slice(-8);
  return hx(h0)+hx(h1)+hx(h2)+hx(h3)+hx(h4)+hx(h5)+hx(h6)+hx(h7);
}
const enc=new TextEncoder();
const sha256=str=>sha256bytes(enc.encode(str));
const short=(h,n)=>h.slice(0,n||16).toUpperCase();

/* ---------- formatting helpers (deterministic; no Date.now / no Math.random / no Intl) ----
   fmt() formats a whole number with comma thousands-grouping WITHOUT toLocaleString.
   Why: toLocaleString("en-US") depends on the runtime's ICU build — a small-ICU Node
   would drop the grouping ("5000" not "5,000"), so the SAME source could hash/display
   differently across environments. This hand-rolled grouping is byte-identical on every
   engine, locking determinism (and it feeds terms_ar → terms_hash, so it must be stable). */
function fmt(n){
  const r=Math.round(Number(n)||0), neg=r<0;
  const s=String(Math.abs(r)).replace(/\B(?=(\d{3})+(?!\d))/g,",");
  return neg?"-"+s:s;
}
/* ---------- money policy: integer minor units (halalas), never binary-float money ----
   1 SAR = 100 halala. Every value-bearing computation (the principal/installment that
   get hashed, and the Muqassa netting) runs on integers; SAR is a display projection. */
const MINOR=100;
const toMinor=sar=>Math.round(Number(sar)*MINOR);              // 5000 SAR -> 500000 halala
function minorToFixed2(minor){                                  // 500000 -> "5000.00"
  const a=Math.round(Math.abs(Number(minor)||0)), neg=minor<0;
  return (neg?"-":"")+Math.floor(a/MINOR)+"."+String(a%MINOR).padStart(2,"0");
}
const AR_MONTHS=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
/* يُسر grace re-spread (B2): split a remaining principal (integer halalas) across `count` months.
   The SUM is preserved exactly ⇒ rescheduling adds NOTHING — no penalty, no riba (2:280 grace). */
function respread(totalMinor,count){
  const t=Math.max(0,Math.round(totalMinor)),c=Math.max(1,count|0);
  const base=Math.floor(t/c),extra=t-base*c;
  return Array.from({length:c},(_,i)=>base+(i<extra?1:0));   // Σ == totalMinor, integer halalas
}

/* ============================================================================
   2) The Ahd object (shared canonical model — contracts.md C2).
      Amounts kept in SAR for the demo; production uses integer halalas (C2).
============================================================================ */
const AG={
  ahd_id:"AHD-01HZ-NOURA-SARA",
  type:"قرض حسن", lender:"نورة العتيبي", borrower:"سارة الزهراني",
  amount:5000, months:5, start:{y:2026,m:7},
  timestamp:"2026-07-01T10:30:00+03:00"
};
AG.amount_minor=toMinor(AG.amount);              // 500000 halala — the value-bearing principal
AG.installment_minor=Math.round(AG.amount_minor/AG.months); // 100000 halala (exact for 5000/5)
AG.installment=AG.installment_minor/MINOR;       // 1000 SAR — display projection only
AG.schedule=Array.from({length:AG.months},(_,i)=>{
  const m=((AG.start.m-1+i)%12), y=AG.start.y+Math.floor((AG.start.m-1+i)/12);
  return {label:`1 ${AR_MONTHS[m]} ${y}`,amount:AG.installment,paid:false};
});
/* the FROZEN plain-Arabic terms the parties actually sign (ALLaM-drafted, مُحاكاة) */
AG.terms_ar=`يُقِرّ الطرفان بأنّ «${AG.lender}» أقرضت «${AG.borrower}» مبلغ ${fmt(AG.amount)} ريال على سبيل القرض الحسن، يُسدَّد على ${AG.months} أقساطٍ شهريّةٍ متساوية قدر كلٍّ منها ${fmt(AG.installment)} ريال، دون أيّ زيادة أو فائدة أو غرامة تأخير. عند العجز يُمهَل المقترض بالمعروف.`;
AG.terms_hash=sha256(AG.terms_ar);
/* two-party Nafath consent (assurance NAFATH_BIOMETRIC) — signatures are seams,
   but each consent's signing-payload hash is real */
AG.consent=[
  {party:AG.lender, role:"المُقرِضة", assurance:"NAFATH_BIOMETRIC", signed_at:"2026-07-01T10:29:40+03:00"},
  {party:AG.borrower,role:"المقترضة",assurance:"NAFATH_BIOMETRIC", signed_at:"2026-07-01T10:29:58+03:00"}
];
AG.consent.forEach(c=>{ c.sig_ref="NFTH-"+short(sha256(c.party+"|"+c.assurance+"|"+c.signed_at+"|"+AG.terms_hash),10); });

/* Canonical serialization → the bytes that get hashed. `amt` lets the verifier
   recompute under a *tampered* value to prove any change breaks the seal. */
function canonical(amt){
  const aMinor=(amt==null?AG.amount_minor:toMinor(amt));   // integer halalas — no float money
  const instMinor=Math.round(aMinor/AG.months);
  const inst2=minorToFixed2(instMinor);                    // identical bytes to the old inst.toFixed(2)
  const sched=AG.schedule.map((s,i)=>`${i+1}:${s.label}:${inst2}`).join("|");
  return [
    "AHD-RECORD-v1",
    `ahd_id=${AG.ahd_id}`,
    `type=${AG.type}`,
    `lender=${AG.lender}`,
    `borrower=${AG.borrower}`,
    `principal=${minorToFixed2(aMinor)} SAR`,
    `months=${AG.months}`,
    `schedule=${sched}`,
    `terms_hash=${AG.terms_hash}`,
    `basis=Quran:2:282`,
    `riba=interest:false;late_penalty_to_lender:false;gharar:none`,
    `consent=${AG.consent.map(c=>`${c.party}#${c.assurance}#${c.signed_at}#${c.sig_ref}`).join(",")}`,
    `ts=${AG.timestamp}`
  ].join("\n");
}
/* The append-only chain (contracts.md C2 record_seal):
   genesis → block. seal = H(prev_hash + canonical_hash + seq). */
const GENESIS=sha256("AHD-CHAIN-GENESIS-ALINMA-2026");
/* named pure function — the seal primitive (kept separate so it is unit-testable) */
function sealBlock(prev,canonical_hash,seq){ return sha256(prev+canonical_hash+String(seq)); }
const SEALED={
  seq:1, prev:GENESIS,
  canonical_hash:sha256(canonical(null))
};
SEALED.seal=sealBlock(SEALED.prev,SEALED.canonical_hash,SEALED.seq);
/* recompute the seal from (possibly tampered) data — the verifier's core */
function recomputeSeal(amt){
  const ch=sha256(canonical(amt));
  return {canonical_hash:ch, seal:sealBlock(SEALED.prev,ch,SEALED.seq)};
}
/* named pure verifier: recompute → compare against the sealed value. Pure & deterministic;
   the on-screen runVerify() is a thin render wrapper over this. */
function verifyRecord(amt){
  const r=recomputeSeal(amt);
  return {ok:r.seal===SEALED.seal, sealed:SEALED.seal, recomputed:r.seal, canonical_hash:r.canonical_hash};
}

/* ============================================================================
   2.5) The lifecycle state machine (OT-FSM) — REAL event-sourcing, not a step counter.
        The ahd's status is DERIVED by folding its append-only event log (no UPDATE that
        could silently alter a sealed obligation) — exactly backend-architecture.md §2-3.
        Pure + deterministic: same log ⇒ same status on every engine. (The UI's S.step is a
        separate navigation counter; THIS is the agreement's real lifecycle.)
============================================================================ */
const ev=(type,extra)=>Object.assign({type},extra||{});       // tiny event constructor
/* canonical states (contracts S5 / backend §3.1). KEPT ≡ «ذِمّة محفوظة»; a graced ACTIVE ahd
   displays «مؤجّل بالتراضي». DEFAULTED carries NO penalty (penalty would be riba). */
const STATE_AR={
  DRAFT:"مسودة", PENDING_CONSENT:"بانتظار قبول الطرف الآخر", WITNESSED:"مُوثَّق ومختوم",
  ACTIVE:"نشِط", SETTLING:"قيد السداد", KEPT:"ذمّة محفوظة — وُفِّي به",
  DEFAULTED:"متعثّر — بلا غرامة", DISPUTED:"محلّ خلاف — للقضاء", ESCALATED:"أُحيل إلى القضاء",
  FORGIVEN:"أُبرئ — إبراءٌ من المُقرِض", DECLINED:"اعتُذِر عنه", EXPIRED:"انتهت صلاحيّته",
  VOID:"مُلغًى", RESCHEDULED:"مؤجّل بالتراضي"
};
/* fold(events) → derived status (pure reducer). Any state is reproducible from a prefix of the
   log — which is how the demo seeds any screen and how an auditor reconstructs history. */
function fold(events){
  let status="—",graced=false,settled=0,total=0,sealed=false;
  for(const e of (events||[])){
    switch(e.type){
      case "AHD_DRAFTED": status="DRAFT"; if(e.installments)total=e.installments; break;
      case "LENDER_SIGNED": if(status==="DRAFT")status="PENDING_CONSENT"; break;
      case "COUNTERPARTY_SIGNED": break;                      // seal event carries the transition
      case "RECORD_SEALED": status="WITNESSED"; sealed=true; break;
      case "ACTIVATED": status="ACTIVE"; break;
      case "SETTLEMENT_INITIATED": status="SETTLING"; break;
      case "SETTLEMENT_SETTLED": settled++; status=(total&&settled>=total)?"KEPT":"ACTIVE"; break;
      case "ALL_SETTLED": status="KEPT"; break;
      case "GRACE_GRANTED": graced=true; status="ACTIVE"; break;   // 2:280 reschedule → back to ACTIVE
      case "DEFAULT_MARKED": status="DEFAULTED"; break;
      case "DISPUTE_RAISED": status="DISPUTED"; break;
      case "ESCALATION_EXPORTED": status="ESCALATED"; break;
      case "FORGIVEN": status="FORGIVEN"; break;
      case "DECLINED": status="DECLINED"; break;
      case "EXPIRED": status="EXPIRED"; break;
      case "VOIDED": status="VOID"; break;
    }
  }
  return {status,graced,settled,total,sealed};
}
/* the display label honours the graced/«مؤجّل بالتراضي» projection over a plain ACTIVE */
function statusLabel(events){
  const f=fold(events);
  if(f.status==="ACTIVE"&&f.graced) return STATE_AR.RESCHEDULED;
  return STATE_AR[f.status]||f.status;
}
/* the MAIN ahd is now event-sourced: it starts DRAFTED; the demo APPENDS events at each real
   transition (seal → settle → grace → kept), and the screen reads statusLabel(AG.events). */
AG.events=[ev("AHD_DRAFTED",{installments:AG.months})];
/* OTHER عهود in the system — seeded with real event logs so the demo can SHOW the hard cases a
   judge asks for (red-team A3/K20: "show me a defaulted / disputed agreement"). Status DERIVED. */
const SEED_AHDS=[
  { id:"AHD-02HZ-FAISAL-OMAR", lender:"فيصل", borrower:"عمر", amount:3000,
    note:"تعثّر بعد مهلةٍ بالمعروف — بلا غرامة؛ السجلّ مهيّأٌ للقضاء عند الحاجة.",
    events:[ev("AHD_DRAFTED",{installments:4}),ev("LENDER_SIGNED"),ev("COUNTERPARTY_SIGNED"),
            ev("RECORD_SEALED"),ev("ACTIVATED"),ev("SETTLEMENT_SETTLED"),ev("GRACE_GRANTED"),ev("DEFAULT_MARKED")] },
  { id:"AHD-03HZ-HIND-REEM", lender:"هند", borrower:"ريم", amount:1500,
    note:"أبلغ أحد الطرفين عن خلاف — «عهد» يكتب ويشهد ويحفظ، ولا يحكم بينهما.",
    events:[ev("AHD_DRAFTED",{installments:3}),ev("LENDER_SIGNED"),ev("COUNTERPARTY_SIGNED"),
            ev("RECORD_SEALED"),ev("ACTIVATED"),ev("DISPUTE_RAISED")] },
  { id:"AHD-04HZ-SALEH-NAIF", lender:"صالح", borrower:"نايف", amount:2000,
    note:"أبرأ المُقرِض ما تبقّى صدقةً ﴿وأن تصدّقوا خيرٌ لكم﴾.",
    events:[ev("AHD_DRAFTED",{installments:5}),ev("LENDER_SIGNED"),ev("COUNTERPARTY_SIGNED"),
            ev("RECORD_SEALED"),ev("ACTIVATED"),ev("SETTLEMENT_SETTLED"),ev("SETTLEMENT_SETTLED"),ev("FORGIVEN")] }
];

/* ============================================================================
   3) Muqassa — real greedy min-transfer netting + the conservation invariant.
============================================================================ */
const NODES=["نورة","سارة","خالد","ليلى","فهد"];
const IOUS=[
  {from:"نورة",to:"سارة",amount:200},{from:"سارة",to:"خالد",amount:200},
  {from:"نورة",to:"ليلى",amount:250},{from:"ليلى",to:"فهد",amount:250},
  {from:"نورة",to:"خالد",amount:400},{from:"نورة",to:"فهد",amount:50},
  {from:"سارة",to:"ليلى",amount:150},{from:"ليلى",to:"خالد",amount:150},
  {from:"خالد",to:"سارة",amount:150}
];
/* kept-promises trust signal (Patch A · OT-PCT) — a windowed, time-decayed kept-ratio
   computed from each person's OWN sealed history. A SOCIAL mirror, NOT a credit score
   (10_Deep/Backend/trust-signal-and-graph-analytics.md): own-history only, descriptive
   not predictive, never exported, never underwrites. Deterministic: fixed AS_OF, no Date.now.
   Mirrors ref/ahd-ref.mjs trustSignal(). Output is a 3-band qualitative word (S9), never a number. */
const TRUST_CFG={AS_OF:"2026-06",WINDOW:24,HALF_LIFE:12};
/* Arabic band words — the qualitative mirror shown in place of a forbidden % (S9) */
const TRUST_BAND_AR={kept:"وفّى بعهوده",mixed:"وفّى بأغلب عهوده",overdue:"عليه وعدٌ متأخّر",new:"جديد"};
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

function balancesOf(edges){
  const bal={}; NODES.forEach(n=>bal[n]=0);
  edges.forEach(e=>{bal[e.from]-=e.amount; bal[e.to]+=e.amount;});
  return bal; // >0 creditor (owed), <0 debtor (owes)
}
function netting(edges){
  const balSar=balancesOf(edges);
  /* integer-minor core: exact arithmetic, zero float epsilons. Build creditor/debtor
     lists in fixed NODES order so the result is deterministic before sorting. */
  const idx=n=>NODES.indexOf(n);
  const cred=[],deb=[];
  NODES.forEach(n=>{const v=toMinor(balSar[n]); if(v>0)cred.push({p:n,v}); else if(v<0)deb.push({p:n,v:-v});});
  /* sort by size desc; tie-break by fixed NODES index (NOT localeCompare, which is
     locale-dependent) so equal balances always resolve identically on every engine. */
  cred.sort((a,b)=>b.v-a.v || idx(a.p)-idx(b.p));
  deb.sort((a,b)=>b.v-a.v || idx(a.p)-idx(b.p));
  const out=[]; let i=0,j=0;
  while(i<deb.length&&j<cred.length){
    const m=Math.min(deb[i].v,cred[j].v);                  // integer halalas
    out.push({from:deb[i].p,to:cred[j].p,amount:m/MINOR}); // back to whole SAR (m is a multiple of MINOR)
    deb[i].v-=m; cred[j].v-=m;
    if(deb[i].v===0)i++; if(cred[j].v===0)j++;              // exact integer comparison
  }
  return out;
}
const BAL=balancesOf(IOUS);
const SETTLE=netting(IOUS);
/* per-member novation legs (OT-CONSENT, muqassa-deep §8): the netting changes who-pays-whom, so
   each affected party must consent to their NEW leg(s) before commit. Pure projection of SETTLE:
   only parties with a leg appear (a net-zero party is washed out, needs no consent). */
function muqassaLegs(edges){
  const t=edges||SETTLE, legs={}; NODES.forEach(n=>legs[n]={pays:[],gets:[]});
  t.forEach(x=>{ legs[x.from].pays.push({to:x.to,amount:x.amount}); legs[x.to].gets.push({from:x.from,amount:x.amount}); });
  return NODES.filter(n=>legs[n].pays.length||legs[n].gets.length).map(n=>({name:n,pays:legs[n].pays,gets:legs[n].gets}));
}

/* ============================================================================
   4) Trust-network SVG (deterministic layout, reputation rings).
============================================================================ */
const CX=180,CY=158,RAD=112,NR=23;
function pos(name){const i=NODES.indexOf(name);const a=(-90+i*72)*Math.PI/180;return {x:CX+RAD*Math.cos(a),y:CY+RAD*Math.sin(a)};}
function shorten(a,b,r){const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1;return {x:a.x+dx/L*r,y:a.y+dy/L*r};}
function edgeSVG(e,cls,label){
  const A=pos(e.from),B=pos(e.to);
  const a=shorten(A,B,NR+3), b=shorten(B,A,NR+9);
  const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1;
  const nx=-dy/L,ny=dx/L,bow=16, cx=mx+nx*bow, cy=my+ny*bow;
  const d=`M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  const mk=cls==='se'?'arwg':'arw';
  let s=`<path d="${d}" class="${cls}" marker-end="url(#${mk})"/>`;
  if(label) s+=`<text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" class="elbl">${fmt(e.amount)}</text>`;
  return s;
}
function nodeSVG(name){
  const p=pos(name),sig=TRUST[name],ratio=sig.ratio;          // computed windowed kept-ratio
  const r=NR+5,C=2*Math.PI*r,dash=(ratio*C).toFixed(1),gap=(C-ratio*C+0.0001).toFixed(1);
  /* S9: show the qualitative BAND WORD, never a number/percentile (OT-PCT). The ring fill is
     geometry only; the label a judge reads is «وفّى بعهوده» / «جديد» / «عليه وعدٌ متأخّر». */
  const word=TRUST_BAND_AR[sig.band]||TRUST_BAND_AR.new;
  return `<g transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})">
    <circle r="${r}" class="ring-bg"/>
    <circle r="${r}" class="ring-fg" stroke-dasharray="${dash} ${gap}" transform="rotate(-90)"/>
    <circle r="${NR}" class="nodec"/>
    <text class="nlbl" y="3">${name}</text>
    <text class="rlbl" y="${r+13}">${word}</text>
  </g>`;
}
function graphSVG(mode){
  const edges=(mode==='after'?SETTLE.map(e=>edgeSVG(e,'se',true)):IOUS.map(e=>edgeSVG(e,'be',false))).join("");
  return `<svg viewBox="0 0 360 320" class="gsvg" role="img" aria-label="شبكة الديون">
    <defs>
      <marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="ah"/></marker>
      <marker id="arwg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="ahg"/></marker>
    </defs>
    ${edges}${NODES.map(nodeSVG).join("")}</svg>`;
}

/* ============================================================================
   4.5) Riba/penalty rule engine — deterministic, offline, STATELESS regex.
        No /g flag anywhere ⇒ no RegExp.lastIndex carry-over between calls
        (a classic source of "works once, wrong the second time" nondeterminism).
        Kept here in the pure, Node-testable region so the harness can prove
        every rule hit and every miss against fixed vectors.
============================================================================ */
const RIBA_RULES=[
  {re:/(?:فائدة|الفائدة|ربا|ربوي|فايدة)/, why:"شرط فائدة/ربا على القرض", fix:"قرضٌ حسن بلا أيّ زيادة على الأصل"},
  {re:/(?:غرامة|عقوبة|جزاء)\s*(?:ال)?تأخير|غرامة|عقوبة|جزاء/, why:"غرامة تأخير لصالح المُقرِض", fix:"عند العُسر: نظرة إلى ميسرة (إمهال بالمعروف بلا زيادة)، أو إلتزام بالتبرّع لجهة خيرية"},
  {re:/(?:نسبة|٪|%|في\s*الم(?:ئة|ية)|بالمئة)/, why:"نسبة مئوية مرتبطة بمبلغ القرض", fix:"أجرة خدمةٍ ثابتة منفصلة عن القرض — لا نسبة من المبلغ"},
  {re:/(?:عمولة|زيادة|أرباح|ربح)/, why:"زيادة/عمولة على أصل الدَّين", fix:"الأصل فقط؛ أيّ رسمٍ يكون أجرة خدمةٍ ثابتة"}
];
/* negation guard (OT-RIBA): a trigger immediately preceded by a negation particle
   (بلا/بدون/دون/من غير/بغير/عدم/لا), optionally across a filler word like «أيّ», is a
   CLEAN mention ("بلا فائدة"), NOT a violation. The particle must sit at a word boundary
   (start-of-text or whitespace) so it never matches the tail of an unrelated word (مثلا…).
   No /g on RIBA_RULES (the statelessness invariant is preserved) — we sweep by slicing. */
const RIBA_NEG=/(?:^|\s)و?(?:بلا|بدون|دون|من\s+غير|بغير|عدم|لا)\s+(?:(?:أيّ?|أيّة|أية|اي)\s+)?$/;
function ribaHit(re,t){
  let from=0;
  while(from<=t.length){
    const m=re.exec(t.slice(from));
    if(!m) return false;
    const idx=from+m.index;
    if(!RIBA_NEG.test(t.slice(0,idx))) return true;     // a non-negated trigger ⇒ a real hit
    from=idx+(m[0].length||1);                          // skip this negated occurrence, keep scanning
  }
  return false;
}
function ribaScan(text){
  const t=(typeof text==="string"?text:(text==null?"":String(text))).trim();
  if(!t) return {verdict:"clean",hits:[]};
  const hits=RIBA_RULES.filter(r=>ribaHit(r.re,t));
  return {verdict:hits.length?"block":"clean", hits};
}
/* ============================================================================
   4.7) الدائرة · Circle — the everyday on-ramp (Agent-1 «الدائرة الدائمة» +
        Agent-4 «عهد المناسبة», UNIFIED into ONE object with a `mode`).
        A Circle is a THIN PARENT over N bilateral qard-hasan shares born from one
        event: the bank witnesses each share as its own عهد (reusing fold/seal/
        respread). NO new financial primitive — just an aggregation + a per-halala
        split that preserves the sum exactly (so no rounding ever creates phantom
        riba). Pure, DOM-free, deterministic ⇒ Node-testable. UI screens G1..G4
        live below the marker; this is the engine they fold over.
============================================================================ */
/* circle status is DERIVED from its shares' folds — a mirror of the event-sourced
   fold() philosophy (S6 of the spec): DRAFT → OPEN → PARTIAL → KEPT (or VOID). */
const CIRCLE_STATE_AR={
  CIRCLE_DRAFT:"مسودة الدائرة",
  CIRCLE_OPEN:"مفتوحة — قيد الجمع",
  CIRCLE_PARTIAL:"جُمِع بعضها",
  CIRCLE_KEPT:"ذمّة المناسبة محفوظة — وفّى الجميع",
  CIRCLE_VOID:"أُلغيت المناسبة"
};
/* one share's append-only event log for a given lifecycle. A share folds through the
   SAME fold() as a full قرض حسن (it IS a 1-installment qard hasan), so every existing
   state — WITNESSED/ACTIVE/KEPT/DISPUTED/FORGIVEN/graced — is reused, not reinvented. */
function shareEvents(kind){
  const sealed=[ev("AHD_DRAFTED",{installments:1}),ev("LENDER_SIGNED"),ev("COUNTERPARTY_SIGNED"),ev("RECORD_SEALED"),ev("ACTIVATED")];
  switch(kind){
    case "draft":    return [ev("AHD_DRAFTED",{installments:1})];                 // sent, awaiting confirm → بانتظار
    case "active":   return sealed;                                               // confirmed via Nafath → وافق (sealed, unpaid)
    case "kept":     return sealed.concat(ev("SETTLEMENT_SETTLED"));              // paid → سدّد ✓ (KEPT)
    case "graced":   return sealed.concat(ev("GRACE_GRANTED"));                   // أحتاج وقت (2:280, ACTIVE+graced, no penalty)
    case "disputed": return sealed.concat(ev("DISPUTE_RAISED"));                  // نصيبي غير صحيح → محلّ خلاف
    case "forgiven": return sealed.concat(ev("FORGIVEN"));                        // أبرئ نصيبًا صدقةً
    default:         return [ev("AHD_DRAFTED",{installments:1})];
  }
}
/* build a Circle from a spec. EQUAL split runs the existing respread() over integer
   halalas ⇒ Σ shares == total EXACTLY (no halala lost or invented). The organizer's
   own portion is `self` (she already paid it) — never a debt to herself. */
function makeCircle(spec){
  const parts=spec.participants||[];
  let shares;
  if(spec.split==="custom"){
    shares=parts.map(n=>(spec.customMinor&&spec.customMinor[n])||0);
  }else{
    shares=respread(spec.totalMinor||0,parts.length||1);   // equal per-halala split, sum preserved
  }
  const members=parts.map((n,i)=>{
    const self=(n===spec.organizer);
    const kind=self?"kept":((spec.states&&spec.states[n])||"draft");   // organizer's own share is covered
    return {name:n,amountMinor:shares[i]||0,self,events:shareEvents(kind)};
  });
  return {
    id:spec.id,mode:spec.mode,name:spec.name,type:spec.type,
    organizer:spec.organizer,totalMinor:spec.totalMinor||0,split:spec.split||"equal",
    sent:spec.sent!==false,voided:!!spec.voided,members
  };
}
/* علّام (محاكاة) drafts ONE plain-Arabic terms paragraph for the whole circle; the
   existing ribaScan() must read it CLEAN (negation guard handles «بلا فائدة»). */
function circleTermsAr(circle){
  const debts=circle.members.filter(m=>!m.self);
  const each=debts.length?fmt(debts[0].amountMinor/MINOR):"0";
  return `يُقِرّ أعضاء «${circle.name}» بأنّ «${circle.organizer}» دفعت عن الجميع مبلغ ${fmt(circle.totalMinor/MINOR)} ريال، وأنّ نصيب كلِّ عضوٍ — قدره ${each} ريال — قرضٌ حسن يُردّ إليها بلا أيّ فائدة ولا غرامة تأخير، متى ما تيسّر. عند العُسر يُمهَل العضو بالمعروف.`;
}
/* the non-organizer shares — the actual qard-hasan عهود the circle holds. */
function circleShares(circle){ return circle.members.filter(m=>!m.self); }
/* fold the circle: derive its status + progress from its shares' folds (event-sourced). */
function foldCircle(circle){
  const folds=circle.members.map(m=>({m,f:fold(m.events)}));
  let owedMinor=0,collectedMinor=0,closed=0,debtCount=0;
  folds.forEach(({m,f})=>{
    if(m.self) return;                                   // organizer's own portion isn't a debt
    debtCount++; owedMinor+=m.amountMinor;
    if(f.status==="KEPT"){ collectedMinor+=m.amountMinor; closed++; }
    else if(f.status==="FORGIVEN"){ closed++; }          // إبراء closes the ذمّة (no cash, but settled)
  });
  let status;
  if(circle.voided) status="CIRCLE_VOID";
  else if(!circle.sent) status="CIRCLE_DRAFT";
  else if(debtCount>0&&closed>=debtCount) status="CIRCLE_KEPT";
  else if(closed>0) status="CIRCLE_PARTIAL";
  else status="CIRCLE_OPEN";
  return {status,debtCount,closed,owedMinor,collectedMinor,folds:folds.map(x=>x.f)};
}
/* convert OPEN shares to IOU edges (member owes organizer) for the existing Muqassa.
   Settled/forgiven/disputed/void shares are excluded — only live debts get netted. */
function circleToIous(circle){
  return circle.members.filter(m=>!m.self).filter(m=>{
    const st=fold(m.events).status;
    return st!=="KEPT"&&st!=="FORGIVEN"&&st!=="VOID"&&st!=="DISPUTED";
  }).map(m=>({from:m.name,to:circle.organizer,amount:m.amountMinor/MINOR}));
}
/* self-contained net positions for ONE circle (halalas; >0 creditor). Used to prove the
   circle→IOUS conversion conserves: organizer credit == Σ member debits, Σ net == 0. */
function circleBalances(circle){
  const bal={}; circle.members.forEach(m=>bal[m.name]=0);
  circle.members.filter(m=>!m.self).forEach(m=>{
    bal[m.name]-=m.amountMinor; bal[circle.organizer]+=m.amountMinor;
  });
  return bal;
}
/* ONE sealed proof for the whole occasion (reuses the real SHA-256). Any change to any
   share's name/amount breaks the digest — a single tamper-evident summary for the circle. */
function circleCanonical(circle){
  return [
    "AHD-CIRCLE-v1",`id=${circle.id}`,`mode=${circle.mode}`,`name=${circle.name}`,
    `organizer=${circle.organizer}`,`total=${minorToFixed2(circle.totalMinor)} SAR`,
    `members=${circle.members.map(m=>`${m.name}#${minorToFixed2(m.amountMinor)}`).join(",")}`,
    "basis=Quran:2:282;qard_hasan:true;riba:false;late_penalty:false"
  ].join("\n");
}
function circleSeal(circle){ return sha256(circleCanonical(circle)); }

/* ---- seeded demo circles (fixed data ⇒ identical every run, fully offline) ---- */
/* the SHOWCASE occasion — لُجين's «رحلة العلا»: one trip, equal per-halala split among 5,
   seeded mid-collection so the treasurer dashboard shows every dignified state at once. */
const DEMO_CIRCLE=makeCircle({
  id:"CIR-OCC-ALULA-2026",mode:"occasion",name:"رحلة العلا",type:"رحلة",
  organizer:"لُجين",participants:["لُجين","نورة","سارة","خالد","ريم"],
  totalMinor:toMinor(8000),split:"equal",
  states:{"نورة":"kept","سارة":"active","خالد":"graced","ريم":"draft"}
});
/* the STANDING household — سعود's «شقة الملقا»: an everyday split logged in one tap. */
const STANDING_CIRCLE=makeCircle({
  id:"CIR-STD-MALQA",mode:"standing",name:"شقة الملقا",type:"سكن مشترك",
  organizer:"سعود",participants:["سعود","تركي","عبدالله"],
  totalMinor:toMinor(600),split:"equal",
  states:{"تركي":"active","عبدالله":"draft"}
});
/* the ربع's circles whose OPEN shares, unioned, ARE the demo's frozen 9-IOU tangle —
   so Muqassa's source is no longer hardcoded: it's «the circles you actually made». */
function muqassaCircle(id,name,organizer,owed){
  const participants=[organizer].concat(Object.keys(owed));
  const customMinor={},states={}; let total=0;
  Object.keys(owed).forEach(d=>{ customMinor[d]=toMinor(owed[d]); total+=toMinor(owed[d]); states[d]="active"; });
  customMinor[organizer]=0;
  return makeCircle({id,mode:"occasion",name,type:"مناسبة",organizer,participants,totalMinor:total,split:"custom",customMinor,states});
}
const MUQASSA_CIRCLES=[
  muqassaCircle("CIR-DINNER","عشاء الخميس","سارة",{"نورة":200,"خالد":150}),
  muqassaCircle("CIR-TRIP","رحلة البحر","خالد",{"سارة":200,"نورة":400,"ليلى":150}),
  muqassaCircle("CIR-GIFT","هديّة جماعية","ليلى",{"نورة":250,"سارة":150}),
  muqassaCircle("CIR-EID","عيديّة","فهد",{"ليلى":250,"نورة":50})
];
/* the union of those circles' open shares == the 9 golden IOUs (same net positions ⇒
   the existing netting() reduces them to the SAME 2 transfers, conservation intact). */
const CIRCLE_IOUS=MUQASSA_CIRCLES.reduce((a,c)=>a.concat(circleToIous(c)),[]);


;(function(){
  var __api = { sha256, sha256bytes, short, fmt, toMinor, minorToFixed2, canonical, sealBlock, recomputeSeal, verifyRecord, GENESIS, SEALED, AG, NODES, IOUS, BAL, SETTLE, balancesOf, netting, ribaScan, RIBA_RULES, TRUST, trustSignal, TRUST_BAND_AR, fold, statusLabel, STATE_AR, SEED_AHDS, ev, respread, AR_MONTHS, muqassaLegs, CIRCLE_STATE_AR, shareEvents, makeCircle, circleTermsAr, circleShares, foldCircle, circleToIous, circleBalances, circleCanonical, circleSeal, DEMO_CIRCLE, STANDING_CIRCLE, MUQASSA_CIRCLES, CIRCLE_IOUS };
  if (typeof module === "object" && module.exports) module.exports = __api;
  if (typeof window !== "undefined") window.AHD = __api;
  if (typeof globalThis !== "undefined") globalThis.AHD = __api;
})();
