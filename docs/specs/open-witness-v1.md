# Open-Witness v1 — an independently-verifiable seal standard

**Status:** shipped (offline-safe Innovation lever I1, `docs/superpowers/plans/2026-07-13-four-criteria-push.md` §2).
**Reference implementation (origin, not the standard):** `app/engine.js` (golden, frozen functions
`sha256` / `canonical` / `sealBlock` / `recomputeSeal` / `verifyRecord`) and `app/features/create.js`
(`createCanonical` / `createSeal` / `verifyCreated`).
**Independent verifier (the standard, runnable proof):** `protocol/verify-ahd-seal.cjs` — zero
dependencies, Node built-in `crypto` only, never imports `app/engine.js`, anything under `app/`, or
anything under `demo/`.

## 0. Why this exists

Ahd's spine is that the bank **witnesses, seals, and settles** — it never lends, judges, or scores.
"Witnessing" is only worth something if a third party — another bank, a court, an auditor, or either
counterparty themselves — can check the bank's work **without trusting the bank's software**. Open-Witness
v1 is the published, byte-exact recipe for that check: given a sealed record's own semantic fields (who,
how much, when, what terms, what consent), *anyone* with a standard SHA-256 implementation can recompute
the exact same seal Ahd produced, or prove it was tampered with. The bank adds no secret step, no private
key, no proprietary format — the seal is a public fact, not an Ahd artifact.

This is portability, not a new financial primitive: it does not change what is witnessed, only who is
capable of verifying it. On-spine; no fiqh ruling required; fully offline.

## 1. Design in one paragraph

A sealed Ahd record's seal is `SHA-256(prev_hash + SHA-256(canonical_bytes) + seq)`, where `canonical_bytes`
is a **deterministic, pipe/line-delimited plain-text serialization** of the record's fields in a fixed
order, built entirely from integer halalas (never floating-point SAR) and fixed-format date/consent
strings. `prev_hash` chains to a genesis anchor (`SHA-256("AHD-CHAIN-GENESIS-ALINMA-2026")`) for a
first-block record. Any change to any field — name, amount, date, terms text, consent — changes
`canonical_bytes`, which changes `SHA-256(canonical_bytes)`, which changes the seal. There is no other
input to the seal: no clock, no randomness, no locale-dependent formatting.

## 2. Two record profiles (both real, both golden-pinned)

The engine currently emits sealed records in two concrete shapes, both frozen and both proven against
pinned golden values in `tests/app/golden-vectors.test.cjs` / `tests/app/server-parity.test.cjs`:

| Profile | Produced by | Golden anchor | Distinguishing shape |
|---|---|---|---|
| `ahd-main-v1` | `app/engine.js`'s `canonical(amt)` (the frozen demo/app MAIN record) | seal `6c9410b9…` | includes a `consent=` line (two-party Nafath consent, each with a derived `sig_ref`); the schedule's per-line installment amount is **one value computed once** (`round(principal / months)`) and reused on every schedule line |
| `ahd-create-v1` | `app/features/create.js`'s `createCanonical(draft)` (any newly created عهد, scheduled or open) | NEW-1 seal `0463553997c8…` | no consent line; carries an explicit `term=scheduled`/`term=open` line; the schedule's per-line installment amounts come from `respread()` (remainder-conserving — the sum of all lines is always exactly the principal, unlike the main profile's single-value shortcut) |

Both profiles emit the same outer envelope: line 1 is the literal tag `AHD-RECORD-v1`, lines are
newline-joined (`\n`), and the whole string (UTF-8 bytes) is what gets SHA-256'd for the content hash.

A verifier is told which profile a record uses via an explicit `profile` field in the record's JSON export
(§7) — this is not guessed or inferred; it is a declared, public fact about which of the two real
serialization algorithms produced the record, exactly as `engine.js` and `create.js` are two real,
different (but both golden) code paths in the shipped product.

## 3. Deterministic primitives (verbatim contract — reproduce these exactly)

Every primitive below has **zero dependence on wall-clock time, randomness, or locale** (no `Date.now`,
no `Math.random`, no `Intl`/`toLocaleString`). This is what makes the same record hash identically on any
machine, any year, any locale.

```
MINOR = 100                                   // 1 SAR == 100 halala; ALL amounts are integer halalas
toMinor(sar)        = round(Number(sar) * MINOR)
minorToFixed2(minor) = (sign) + floor(|minor| / MINOR) + "." + pad2(|minor| % MINOR)
                       // e.g. minorToFixed2(500000) == "5000.00"
fmt(n)               = comma-grouped integer, e.g. fmt(5000) == "5,000"  (NOT toLocaleString — see below)
respread(totalMinor, count) = base = floor(total/count), extra = total - base*count;
                       array[i] = base + (1 if i < extra else 0)   // Σarray == totalMinor EXACTLY
AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس",
             "سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
scheduleLabels(start={y,m}, months) =
  for i in 0..months-1: mm=(m-1+i) mod 12; yy = y + floor((m-1+i)/12);
                        label = "1 " + AR_MONTHS[mm] + " " + yy
```

**Why not `toLocaleString`:** a small-ICU Node build silently drops thousands-grouping ("5000" instead of
"5,000"), so the *same source* could hash differently across environments. `fmt()` is hand-rolled precisely
so every engine — browser, any Node build, this standalone verifier — produces byte-identical output.

**SHA-256:** any RFC 6234/FIPS 180-4-conformant implementation. The reference demo/app uses a hand-rolled
pure-JS SHA-256 (for offline-browser determinism with zero dependencies); the standalone verifier
(`protocol/verify-ahd-seal.cjs`) uses Node's built-in `crypto.createHash('sha256')` instead. **The two
independently reproduce the identical golden seals** (§8) — that agreement is itself the proof that the
demo's hand-rolled hash is a conformant SHA-256, not a house-made variant.

## 4. Canonical serialization — profile `ahd-main-v1`

Given a record's raw fields `{ahd_id, type, lender, borrower, amount_sar, months, start:{y,m}, terms_ar,
consent:[{party,assurance,signed_at}], timestamp}`:

```
aMinor      = toMinor(amount_sar)
instMinor   = round(aMinor / months)                    // ONE value, reused on every schedule line
inst2       = minorToFixed2(instMinor)
labels      = scheduleLabels(start, months)
schedule    = join("|", for i in 0..months-1: (i+1) + ":" + labels[i] + ":" + inst2)
terms_hash  = SHA256hex(terms_ar)
for each consent entry c:
  sig_ref   = "NFTH-" + SHA256hex(c.party + "|" + c.assurance + "|" + c.signed_at + "|" + terms_hash)
                        .slice(0,10).toUpperCase()
  consent_i = c.party + "#" + c.assurance + "#" + c.signed_at + "#" + sig_ref
consent_str = join(",", consent_i for each consent entry, IN ARRAY ORDER)

canonical = join("\n", [
  "AHD-RECORD-v1",
  "ahd_id="    + ahd_id,
  "type="      + type,
  "lender="    + lender,
  "borrower="  + borrower,
  "principal=" + minorToFixed2(aMinor) + " SAR",
  "months="    + months,
  "schedule="  + schedule,
  "terms_hash="+ terms_hash,
  "basis=Quran:2:282",
  "riba=interest:false;late_penalty_to_lender:false;gharar:none",
  "consent="   + consent_str,
  "ts="        + timestamp
])
```

Note the `sig_ref` is **derived**, never trusted as given input — a verifier that only had a party's claimed
`sig_ref` (without recomputing it from `party|assurance|signed_at|terms_hash`) would not be independently
verifying anything; it would be trusting a label. Open-Witness recomputes it.

## 5. Canonical serialization — profile `ahd-create-v1`

Given a record's raw fields `{ahd_id, type, lender, borrower, amount_sar, open, months, start:{y,m},
timestamp}` (no `terms_ar` or `consent` input — the terms text is itself DERIVED, per the two fixed
Arabic templates below):

```
aMinor = toMinor(amount_sar)
lines  = ["AHD-RECORD-v1", "ahd_id="+ahd_id, "type="+type, "lender="+lender, "borrower="+borrower,
          "principal="+minorToFixed2(aMinor)+" SAR"]

if open:
  lines += ["term=open", "schedule=NONE", "due=none"]
  terms_ar = "يُقِرّ الطرفان بأنّ «"+lender+"» أقرض «"+borrower+"» مبلغ "+fmt(aMinor/100)+
             " ريال على سبيل القرض الحسن، يُسدَّد متى ما تيسّر دون موعدٍ محدّد، "+
             "يُردُّ كما أُخِذ بلا فائدةٍ، وبلا غرامةِ تأخير، وبلا أيّ زيادة"+
             ". ﴿وإن كان ذو عسرةٍ فنظرةٌ إلى ميسرة﴾."
  basis = "2:280"
else:
  parts    = respread(aMinor, months)                    // remainder-conserving, per-line amounts
  labels   = scheduleLabels(start, months)
  schedule = join("|", for i in 0..months-1: (i+1)+":"+labels[i]+":"+minorToFixed2(parts[i]))
  lines   += ["term=scheduled", "months="+months, "schedule="+schedule]
  inst     = fmt(parts[0] / 100)
  terms_ar = "يُقِرّ الطرفان بأنّ «"+lender+"» أقرض «"+borrower+"» مبلغ "+fmt(aMinor/100)+
             " ريال على سبيل القرض الحسن، يُسدَّد على "+months+" أقساطٍ شهريّةٍ متساوية قدر كلٍّ منها "+
             inst+" ريال، يُردُّ كما أُخِذ بلا فائدةٍ، وبلا غرامةِ تأخير، وبلا أيّ زيادة"+
             ". عند العجز يُمهَل المقترض بالمعروف."
  basis = "2:282"

lines += ["terms_hash="+SHA256hex(terms_ar), "basis=Quran:"+basis,
          "riba=interest:false;late_penalty_to_lender:false;gharar:none", "ts="+timestamp]
canonical = join("\n", lines)
```

## 6. The hash chain (both profiles)

```
GENESIS       = SHA256hex("AHD-CHAIN-GENESIS-ALINMA-2026")     // the fixed chain anchor, never regenerated
canonical_hash = SHA256hex(canonical)                            // §4 or §5 above
seal          = SHA256hex(prev + canonical_hash + String(seq))   // sealBlock(prev, canonical_hash, seq)
```

For a first-block record (both pinned golden vectors are first-block), `prev == GENESIS` and `seq == 1`.
Multi-block chains (a record superseding a prior sealed state — reschedule, settlement, etc.) set `prev` to
the previous block's own `seal` and increment `seq`; that extension is **out of scope for this v1 spec**
(see Residual gaps, §9 — OT-SEAL5 tracks multi-block/Merkle/TSA extension).

## 7. Verifier input schema (the JSON a third party is handed)

```jsonc
{
  "profile": "ahd-main-v1" | "ahd-create-v1",
  "ahd_id": "string",
  "type": "قرض حسن",
  "lender": "string", "borrower": "string",
  "amount_sar": 5000,                      // whole/decimal SAR as given at witnessing time
  "months": 5,                             // ahd-create-v1 only if !open
  "open": false,                           // ahd-create-v1 only
  "start": { "y": 2026, "m": 7 },
  "timestamp": "2026-07-01T10:30:00+03:00",
  "terms_ar": "…",                         // ahd-main-v1 only (frozen narrative text)
  "consent": [ { "party": "…", "assurance": "NAFATH_BIOMETRIC", "signed_at": "…" }, … ],  // ahd-main-v1 only
  "chain": { "genesis_seed": "AHD-CHAIN-GENESIS-ALINMA-2026", "seq": 1 },  // optional, defaults shown
  "sealed_seal": "6c9410b9…"               // the seal being claimed/checked
}
```

This is the export a bank, court, or counterparty actually receives — the record's own semantic fields plus
the seal it is supposed to reproduce. See `protocol/fixtures/*.json` for three worked examples: the golden
MAIN record, the golden NEW-1 create record, and a deliberately tampered copy of MAIN (amount changed,
original seal kept) to demonstrate detection.

## 8. Golden vectors this spec reproduces

| Record | Profile | Pinned golden seal | Source of truth |
|---|---|---|---|
| MAIN (نورة→سارة, 5000 SAR / 5 months) | `ahd-main-v1` | `6c9410b95ba4715a3c2b174ff70aa2d7ab88fa0294868a41354d2f9e60f7fd18` | `app/engine.js` `SEALED.seal`, pinned in `tests/app/golden-vectors.test.cjs` + `tests/app/server-parity.test.cjs` |
| NEW-1 (أنت→سلطان, 1200 SAR / 3 months) | `ahd-create-v1` | `0463553997c80d77e65d1a411acc0e0bd9d4bef67a92dc96af045dfa24a2b8f8` | `tests/app/golden-vectors.test.cjs` (`CR.createSeal(d1, E).seal`) |

`tests/app/open-witness.test.cjs` runs `protocol/verify-ahd-seal.cjs` — the standalone verifier, **not**
`app/engine.js` — against both fixtures and asserts it reproduces both pinned seals exactly, then asserts a
tampered fixture is flagged `TAMPERED`. It also asserts (by source-grep) that the verifier never imports
`app/engine.js`, anything under `app/`, or anything under `demo/`.

## 9. Residual gaps (surfaced honestly, not faked)

- **Multi-block chains** (`prev` pointing to a prior real block's seal, not just `GENESIS`) are not covered
  by this v1 spec's worked examples — both pinned golden vectors are first-block records. The chain formula
  in §6 generalizes trivially (feed the prior seal as `prev`, increment `seq`), but no golden multi-block
  vector is pinned yet. Tracked as **OT-SEAL5**.
- **RFC-3161 timestamping / Merkle-batch anchoring** (an external, licensed TSA time-stamping the seal, or
  batching many seals under one published Merkle root) is a real hardening path for production but is a
  seam here — the HASHING is real; the TSA/PKI integration is not built. Tracked as **OT-SEAL5** /
  `docs/PATH-TO-PRODUCTION.md`.
- **Nafath/PKI signature verification** of the consent entries themselves (proving the named party actually
  signed, not just that a `sig_ref` hash is internally consistent) is out of scope — the golden engine's
  `sig_ref` is a hash-derived reference, not a live PKI signature check. This is documented, not hidden.
- This spec covers the two record profiles the shipped engine actually emits today (`ahd-main-v1`,
  `ahd-create-v1`); other feature-specific seals in the app (open-loan, proof-pack, circle) reuse the same
  `sha256`/`sealBlock` primitives over their own field sets and are natural v1.1 profile candidates, not
  yet formalized here.
