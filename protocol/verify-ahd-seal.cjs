#!/usr/bin/env node
/* ============================================================================
   verify-ahd-seal.cjs — Open-Witness v1 STANDALONE reference verifier.

   INDEPENDENCE (the whole point of this file): it uses ONLY Node's built-in
   `crypto` module (crypto.createHash('sha256')) plus the small set of pure
   helper functions documented byte-for-byte in docs/specs/open-witness-v1.md.
   It does NOT require/import app/engine.js, anything under app/, or anything
   under demo/ — a sealed Ahd record can therefore be verified by a third party
   (another bank, a court, either counterparty) who has never run Ahd's own
   software, using only the published spec + a standard SHA-256 implementation.

   Each canonical builder below takes the record's RAW semantic fields (name,
   amount, dates, terms text, consent) and rebuilds the exact byte sequence
   that gets hashed — this is genuine independent recomputation, never a
   re-formatting of a pre-built/trusted canonical string or seal.

   Usage:   node protocol/verify-ahd-seal.cjs <record.json>
   Exit codes: 0 = VALID, 1 = TAMPERED, 2 = malformed input/usage error.

   Spine: this tool WITNESSES/VERIFIES a cryptographic fact only — it does not
   lend, judge, score, or rule on Shariah matters (no fatwa; it just proves a
   hash chain does or does not reproduce).
============================================================================ */
"use strict";
const fs = require("fs");
const crypto = require("crypto");

/* ---------------------------------------------------------------------------
   1) Standard SHA-256 only — no hand-rolled crypto in this file. (Reproducing
      the golden seals below with Node's crypto module proves the demo/app's
      own hand-rolled SHA-256 — used there only for offline-browser
      determinism — agrees byte-for-byte with a standard library.)
--------------------------------------------------------------------------- */
function sha256hex(str) {
  return crypto.createHash("sha256").update(String(str), "utf8").digest("hex");
}

/* ---------------------------------------------------------------------------
   2) Deterministic helpers — copied from the published spec
      (docs/specs/open-witness-v1.md §3), NOT imported from app/engine.js.
      Integer halalas throughout; no float money; no Date.now/Math.random/Intl
      anywhere in this file.
--------------------------------------------------------------------------- */
const MINOR = 100;
function toMinor(sar) { return Math.round(Number(sar) * MINOR); }
function minorToFixed2(minor) {
  const a = Math.round(Math.abs(Number(minor) || 0)), neg = minor < 0;
  return (neg ? "-" : "") + Math.floor(a / MINOR) + "." + String(a % MINOR).padStart(2, "0");
}
function fmt(n) {
  const r = Math.round(Number(n) || 0), neg = r < 0;
  const s = String(Math.abs(r)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return neg ? "-" + s : s;
}
function respread(totalMinor, count) {
  const t = Math.max(0, Math.round(totalMinor)), c = Math.max(1, count | 0);
  const base = Math.floor(t / c), extra = t - base * c;
  return Array.from({ length: c }, (_, i) => base + (i < extra ? 1 : 0));
}
const AR_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
function scheduleLabels(start, months) {
  const arr = []; let y = start.y, m = start.m;
  for (let i = 0; i < months; i++) {
    const mm = ((m - 1 + i) % 12), yy = y + Math.floor((m - 1 + i) / 12);
    arr.push("1 " + AR_MONTHS[mm] + " " + yy);
  }
  return arr;
}
function short10Upper(hexHash) { return hexHash.slice(0, 10).toUpperCase(); }

/* ---------------------------------------------------------------------------
   3) Canonical serializers — one per record profile (spec §4 "ahd-main-v1",
      §5 "ahd-create-v1"). Both emit the same "AHD-RECORD-v1" line family; they
      differ only in the presence of a consent block (main) vs. a term=/no
      consent-block shape (create) — see the spec for the byte-exact diff.
--------------------------------------------------------------------------- */
function canonicalMain(r) {
  const aMinor = toMinor(r.amount_sar);
  const instMinor = Math.round(aMinor / r.months);
  const inst2 = minorToFixed2(instMinor);
  const labels = scheduleLabels(r.start, r.months);
  const sched = labels.map((label, i) => (i + 1) + ":" + label + ":" + inst2).join("|");
  const termsHash = sha256hex(r.terms_ar);
  const consentStr = (r.consent || []).map((c) => {
    const sigRef = "NFTH-" + short10Upper(sha256hex(c.party + "|" + c.assurance + "|" + c.signed_at + "|" + termsHash));
    return c.party + "#" + c.assurance + "#" + c.signed_at + "#" + sigRef;
  }).join(",");
  return [
    "AHD-RECORD-v1",
    "ahd_id=" + r.ahd_id,
    "type=" + r.type,
    "lender=" + r.lender,
    "borrower=" + r.borrower,
    "principal=" + minorToFixed2(aMinor) + " SAR",
    "months=" + r.months,
    "schedule=" + sched,
    "terms_hash=" + termsHash,
    "basis=Quran:2:282",
    "riba=interest:false;late_penalty_to_lender:false;gharar:none",
    "consent=" + consentStr,
    "ts=" + r.timestamp
  ].join("\n");
}

function draftTermsAr(r, aMinor) {
  const amt = fmt(aMinor / MINOR);
  const tail = "يُردُّ كما أُخِذ بلا فائدةٍ، وبلا غرامةِ تأخير، وبلا أيّ زيادة";
  if (r.open) {
    return "يُقِرّ الطرفان بأنّ «" + r.lender + "» أقرض «" + r.borrower + "» مبلغ " + amt +
      " ريال على سبيل القرض الحسن، يُسدَّد متى ما تيسّر دون موعدٍ محدّد، " + tail +
      ". ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾.";
  }
  const inst = fmt(respread(aMinor, r.months)[0] / MINOR);
  return "يُقِرّ الطرفان بأنّ «" + r.lender + "» أقرض «" + r.borrower + "» مبلغ " + amt +
    " ريال على سبيل القرض الحسن، يُسدَّد على " + r.months + " أقساطٍ شهريّةٍ متساوية قدر كلٍّ منها " +
    inst + " ريال، " + tail + ". عند العجز يُمهَل المقترض بالمعروف.";
}

function canonicalCreate(r) {
  const aMinor = toMinor(r.amount_sar);
  const lines = [
    "AHD-RECORD-v1",
    "ahd_id=" + r.ahd_id,
    "type=" + r.type,
    "lender=" + r.lender,
    "borrower=" + r.borrower,
    "principal=" + minorToFixed2(aMinor) + " SAR"
  ];
  if (r.open) {
    lines.push("term=open", "schedule=NONE", "due=none");
  } else {
    const parts = respread(aMinor, r.months);
    const labels = scheduleLabels(r.start, r.months);
    const sched = labels.map((label, i) => (i + 1) + ":" + label + ":" + minorToFixed2(parts[i])).join("|");
    lines.push("term=scheduled", "months=" + r.months, "schedule=" + sched);
  }
  const termsAr = draftTermsAr(r, aMinor);
  lines.push(
    "terms_hash=" + sha256hex(termsAr),
    "basis=Quran:" + (r.open ? "2:280" : "2:282"),
    "riba=interest:false;late_penalty_to_lender:false;gharar:none",
    "ts=" + r.timestamp
  );
  return lines.join("\n");
}

const PROFILES = { "ahd-main-v1": canonicalMain, "ahd-create-v1": canonicalCreate };

/* ---------------------------------------------------------------------------
   4) The hash chain (spec §6): GENESIS = sha256(genesis_seed); seal =
      sha256(prev + canonical_hash + String(seq)). Defaults match the golden
      engine's own constants when a record omits `chain` (seq 1, prev ==
      GENESIS — a first block off the genesis anchor).
--------------------------------------------------------------------------- */
const DEFAULT_GENESIS_SEED = "AHD-CHAIN-GENESIS-ALINMA-2026";

function verify(record) {
  const build = PROFILES[record.profile];
  if (!build) throw new Error("unknown profile: " + record.profile + " (expected one of: " + Object.keys(PROFILES).join(", ") + ")");
  const canonical = build(record);
  const canonicalHash = sha256hex(canonical);
  const chain = record.chain || {};
  const genesis = sha256hex(chain.genesis_seed || DEFAULT_GENESIS_SEED);
  const prev = chain.prev || genesis;
  const seq = chain.seq == null ? 1 : chain.seq;
  const recomputed = sha256hex(prev + canonicalHash + String(seq));
  return {
    ok: recomputed === record.sealed_seal,
    sealed: record.sealed_seal,
    recomputed: recomputed,
    canonical_hash: canonicalHash,
    canonical: canonical
  };
}

module.exports = { verify, sha256hex, canonicalMain, canonicalCreate, PROFILES, DEFAULT_GENESIS_SEED };

/* ---------------------------------------------------------------------------
   5) CLI entrypoint.
--------------------------------------------------------------------------- */
if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node protocol/verify-ahd-seal.cjs <record.json>");
    process.exit(2);
  }
  let record;
  try {
    record = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.error("cannot read/parse " + file + ": " + e.message);
    process.exit(2);
  }
  let result;
  try {
    result = verify(record);
  } catch (e) {
    console.error("verification error: " + e.message);
    process.exit(2);
  }
  if (result.ok) {
    console.log("VALID  — seal " + result.recomputed + " reproduced from the record's own fields (Open-Witness v1, standard SHA-256 only)");
    process.exit(0);
  } else {
    console.log("TAMPERED  — claimed seal " + result.sealed + " does not match the recomputed seal " + result.recomputed);
    process.exit(1);
  }
}
