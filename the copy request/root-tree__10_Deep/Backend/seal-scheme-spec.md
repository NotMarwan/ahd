---
title: "عهد · Ahd — The SEAL Scheme (record-integrity back-end, implementation depth)"
tags: [ahd, backend, seal, integrity, evidence, deep]
owner: Claude-Backend (PROMPT 2 — Deepen the Data & Back-end)
status: spec-v1 (reference implementation in ref/ahd-ref.mjs; vectors in test-vectors.md)
updated: 2026-06-19
---

# 🔏 The SEAL — Signed Evidence with Anchored Ledger

> **Spine:** the bank is **amīn / wakīl / shāhid-bil-wathīqa** — it produces and preserves the
> *evidence*, it does not testify, judge, or enforce ([[contracts|C1]]). The SEAL is the
> cryptographic substance behind "tamper-evident, court-admissible record" ([[contracts|S2]]):
> it converts that claim from a label on a `<div>` into a **machine-checkable** fact.
>
> This document specifies the SEAL to implementation depth: the exact canonicalization rules,
> the exact preimage of every hash, the Merkle-checkpoint construction with a worked inclusion
> proof, and a verification procedure that — given a record and its chain — **decides
> tamper/intact and localises the first broken property**. Every value here is reproduced by
> `ref/ahd-ref.mjs` and pinned in [[test-vectors]].

---

## 0. What a Saudi court needs, and how the five properties map

Evidence Law 2022 (RD M/43, in force 7 Jul 2022) admits a digital record when its **integrity**
is demonstrable and the proof is "clear and devoid of doubt"; the **contesting party bears the
burden** (Arts. 55–59); full certified-signature weight additionally wants an **accredited
PKI / licensed CSP** (Art. 57(1)). The SEAL is engineered so each requirement has a dedicated,
verifiable property:

| # | Property | Court requirement it serves | Cryptographic mechanism |
|---|---|---|---|
| 1 | **Integrity** | the bytes have not changed | `h = SHA-256(JCS(terms))` |
| 2 | **Attribution** (WYSIWYS) | *who* assented to *which bytes* | Nafath assertion `{sub,acr,auth_time,txn_id}` bound to `h` via a TSP signature |
| 3 | **Time** | the record existed at time *T* | RFC-3161 Time-Stamp Token over `h` |
| 4 | **Non-repudiation** | the issuer cannot disown it | bank signature over the chain leaf |
| 5 | **Anti-rewrite** | history cannot be silently rewritten — *even by the bank* | append-only hash chain + signed RFC-6962 Merkle checkpoints |

**Claim ceiling (honest):** "*engineered to meet the conditions of admissibility*," never "is
admissible." Final admissibility and certified-signature status are a judge's / an accredited
CSP's determination — disclosed, not papered over ([[contracts|S1, S2]]).

---

## 1. Money & numbers — the precondition for any deterministic hash

All monetary values are **integer halalas** (`1 SAR = 100 halalas`), `int64`. **Floats are
banned everywhere in the sealed object.** Two independent servers must hash the *same* agreement
to the *same* bytes; a single `0.1 + 0.2 = 0.30000000000000004` would destroy that. Integer money
also closes the netting/schedule rounding-drift hole ([[contracts|G12]]):

> **Schedule invariant.** `Σ schedule[i].amount_halalas == principal.amount_halalas` **exactly.**
> Remainder is distributed by stable largest-remainder: `base = ⌊P/n⌋`, the first
> `r = P − n·base` installments carry `base + 1`. (Demo: 500000/5 → all 100000, r = 0.
> General: 500000/3 → `[166667, 166667, 166666]`, Σ = 500000.) Reference: `buildSchedule()`.

---

## 2. Step 1 — Canonicalization (RFC 8785 JCS, restricted domain)

The signed/hashed artifact is **not** a UI string and **not** ad-hoc `JSON.stringify` — both are
non-deterministic across machines (key order, whitespace, number formatting, Unicode form). We
serialize with **RFC 8785 JSON Canonicalization Scheme (JCS)**.

### 2.1 The rules we implement (and why the hard parts vanish)

Ahd canonical objects contain **only** these value types: `string`, **integer**, `boolean`,
`null`, `array`, `object`. Because money is integer halalas and there are **no floats**, JCS's
genuinely hard cases (ECMAScript shortest-round-trip float formatting, exponents, `-0`, `NaN`)
**never occur**. Over this domain the full JCS rule-set reduces to four mechanical rules:

1. **Object keys** are sorted by **UTF-16 code-unit** order (RFC 8785 §3.2.3). JavaScript's
   default `Array.prototype.sort()` on strings *is* UTF-16 code-unit order — so
   `Object.keys(obj).sort()` is conformant for our (ASCII) key set.
2. **Strings** are serialized per ECMAScript `JSON.stringify` (RFC 8785 §3.2.2.2): minimal
   escaping (`\" \\ \b \t \n \f \r`, `\u00XX` for other control chars), and **all non-ASCII
   characters — including Arabic — are emitted as raw UTF-8**, not `\uXXXX`.
3. **Integers** are serialized as plain decimal (RFC 8785 §3.2.2.3); valid for `|n| < 2^53`,
   which every halala amount and count satisfies.
4. **No insignificant whitespace.** Output is **UTF-8**.

> Node and Chrome both run **V8**, so `JSON.stringify(string)` and `String(integer)` are
> byte-identical between the reference engine and the in-browser prototype. This is *why* the
> on-screen hashes equal the documented vectors.

### 2.2 Reference canonicalizer (the whole thing)

```js
function jcs(v) {
  if (v === null) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") {
    if (!Number.isFinite(v) || !Number.isInteger(v)) throw new Error("JCS: integers only");
    return String(v);
  }
  if (typeof v === "string") return JSON.stringify(v);          // RFC 8785 §3.2.2.2
  if (Array.isArray(v)) return "[" + v.map(jcs).join(",") + "]"; // order PRESERVED
  if (typeof v === "object") {                                   // keys SORTED
    return "{" + Object.keys(v).sort()
      .map(k => JSON.stringify(k) + ":" + jcs(v[k])).join(",") + "}";
  }
  throw new Error("JCS: unsupported type");
}
```

**Conformance vectors** (from `ref/generate-vectors.mjs`):

| Input | JCS output |
|---|---|
| `{b:1,a:2,c:3}` | `{"a":2,"b":1,"c":3}` |
| `{z:{y:1,x:2},a:[3,2,1]}` | `{"a":[3,2,1],"z":{"x":2,"y":1}}` |
| `{k:"نورة"}` | `{"k":"نورة"}` (Arabic preserved) |
| `{s:'a"b\\c\t'}` | `{"s":"a\"b\\c\t"}` |
| `{t:true,f:false,n:null}` | `{"f":false,"n":null,"t":true}` |

**Key consequence — semantic equality, byte equality.** A record whose object keys are written
in a different order canonicalizes to the *same* bytes ⇒ the *same* hash. Reordering **keys** is a
no-op (proven: `jcsHash({a:1,b:2}) === jcsHash({b:2,a:1})` → `true`). Reordering **array
elements** (e.g. swapping two schedule installments) is a *real* change and **is** detected
(§6.3). This is exactly the discrimination a court needs: format noise is invisible, content
tampering is not.

---

## 3. Step 2–5 — the exact preimages

Every hashed object carries a **`_t` type tag** (domain separation): a digest minted for one
layer can never be replayed as another. `‖` below is byte concatenation; all hashes are
`SHA-256` (FIPS 180-4), hex lower-case.

### 3.1 The `terms` object → integrity hash `h`

`h = SHA-256( JCS(terms) )`.

Demo `terms` (Noura → Sara, 5,000 SAR qard hasan), abridged — full canonical bytes (1059 bytes)
and value in [[test-vectors]]:

```json
{"_t":"ahd.terms.v1","ahd_id":"AHD-01HZ-NOURA-SARA","basis":"Quran:2:282","kind":"qard_hasan",
 "months":5,"parties":[{"display_name":"نورة العتيبي","nafath_sub":"cd8a0006…81e8","role":"lender"},
 {"display_name":"سارة الزهراني","nafath_sub":"b5b63ded…27c1","role":"borrower"}],
 "principal":{"amount_halalas":500000,"currency":"SAR"},
 "riba":{"gharar":false,"interest":false,"late_penalty_to_lender":false},
 "schedule":[{"amount_halalas":100000,"due":"2026-07-01","seq":1}, … 5 entries …],
 "terms_ar":"يُقِرّ الطرفان …","ts":"2026-07-01T10:30:00+03:00"}
```

> `h = ceedb1e97f7006f29e6c66d9e3da6f835cb91f26ea1c9c3f3640985502db94a5`

`nafath_sub` is the **pairwise pseudonymous subject id**, never the raw National ID
([[contracts|S15]]). Demo mock: `sub = SHA-256(JCS({_t:"mock.nafath.sub.v1",
id_namespace:"alinma-ahd", name}))`. The full Arabic clause `terms_ar` is included *inside* the
canonical object, so the human-readable text and the structured fields are sealed together —
neither can drift from the other.

### 3.2 Signer binding (WYSIWYS) → `sig` per party

The party is shown the **exact canonical terms** and a short hash derived from `h`; the Nafath
authentication and the TSP signature are taken over **that** `h`. We persist the binding:

```
sig_i = SHA-256( JCS({ _t:"ahd.nafath.binding.v1",
                       sub, acr, auth_time, txn_id, terms_hash: h }) )
```

In production `sig_i` is the **TSP's AES/QES signature** (emdha-class, CST-licensed) over these
bytes; in the demo it is a SHA-256 stand-in behind a labelled seam — **the bytes it covers are
real**. Lender binding preimage (exact):

```
{"_t":"ahd.nafath.binding.v1","acr":"nafath.biometric","auth_time":"2026-07-01T10:29:40+03:00",
 "sub":"cd8a00069954a0b807c51a5780e7c1c3ccff5f409bd28169772706e97d5a81e8",
 "terms_hash":"ceedb1e97f7006f29e6c66d9e3da6f835cb91f26ea1c9c3f3640985502db94a5",
 "txn_id":"NFTH-TXN-LENDER-7731"}
→ sig = a01e96e02083e66bb34a5b0a78264eb0384a84717c0045d396b58ff621227940
```
Borrower `sig = 1185ff46f8fdefe7cecf0c7f0a20850a4bfffd8c29f66d1c368fe54eb952195c`.

This is what kills repudiation: "I signed *something else*" is refuted because the stored `sig`
only verifies against the canonical bytes whose hash is `h`. Change one byte of `terms` → `h`
changes → every `sig` fails to verify.

### 3.3 Trusted time → `tsa_token`

```
tsa_token = SHA-256( JCS({ _t:"ahd.tsa.v1", terms_hash:h, tsa:"mock-tsa-alinma",
                           gen_time:"2026-07-01T10:30:05+03:00" }) )
          = e010c8ed857966b97a0b65e58903c43bd8ea69f8669a9aba6c7c2f6dd7b6cd39
```

Production: an **RFC-3161 TimeStampToken** from an accredited TSA over `h` (the scheme is
provider-agnostic — any RFC-3161 TSA drops into this seam). The token proves the record existed
at *T* independent of the bank's own clock. **Degraded mode:** if the TSA is unreachable, seal
now with chain + bank-sig and flag `time:provisional`, back-fill the RFC-3161 token when the TSA
returns ([[contracts|tech §4]]).

### 3.4 Sealed content envelope → `envelope_hash e`

The envelope binds the integrity hash, all signer bindings, the timestamp, the fee, and the
**attestation boundary string** (§5) into one object:

```
envelope = { _t:"ahd.envelope.v1", ahd_id, terms_hash:h,
             assertions:[{sub,acr,auth_time,txn_id,sig}, …],
             tsa_token, fee:{flat_halalas:0, basis:"actual_direct_cost"}, attestation }
e = SHA-256( JCS(envelope) ) = 9df5085520269240b2c18aee08c612c4b5a4021d6ec2bafd381c391ed3e36fb0
```

`fee` is structurally decoupled from `principal` ([[contracts|S4]]); default consumer posture
is `flat_halalas: 0` (free / float-monetised).

### 3.5 Chain leaf + bank signature → `leaf`, `bank_sig`

```
leaf     = SHA-256( JCS({ _t:"ahd.leaf.v1", seq, prev_chain_hash, envelope_hash:e }) )
bank_sig = SHA-256( JCS({ _t:"ahd.banksig.v1", key_id:"alinma-seal-key-2026", leaf }) )
```

- Genesis (per tenant): `prev_chain_hash₀ = SHA-256(JCS({_t:"ahd.genesis.v1", tenant:"alinma",
  epoch:"2026"})) = f82c6b59ee12a798794bfabb7ef5cf7567aa531ba5e0caa35a4041ba04458cd6`.
- Record *n* sets `prev_chain_hash = leaf_{n-1}`. The demo record (seq 1, prev = genesis):
  > `leaf = f7999f87ec2131d5d3a56f306a363ada628ff4f3f298d24f436ba89094813e41`
  > `bank_sig = 8f1d28a5013a91388c54e238181812a1d53e74e0efc2bac5d4a2421d8740bd22`

`bank_sig` is the bank's HSM signature over the leaf (mocked as SHA-256 in the demo). Any
retroactive edit changes `h → e → leaf`, breaking both the chain **and** the bank signature —
non-repudiation **including against the bank itself**.

---

## 4. Merkle checkpoints — anti-rewrite, even by the issuer (RFC 6962)

A hash chain proves *internal* consistency but a malicious operator who controls the whole DB
could rewrite the entire chain. The defence is a **periodic signed Merkle checkpoint**: the bank
publishes (and signs) a Merkle root over the batch of leaves; an auditor (or counterparty) who
retained an earlier signed root can prove any later divergence.

### 4.1 Construction (RFC 6962 §2.1)

We adopt **Certificate Transparency** Merkle hashing verbatim (court/audit-recognised, handles
odd node counts by promotion):

```
leaf hash :  MTH({d})       = SHA-256( 0x00 ‖ d )
inner node:  MTH(D[0:n])     = SHA-256( 0x01 ‖ MTH(D[0:k]) ‖ MTH(D[k:n]) ),  k = 2^⌊log2(n-1)⌋
empty     :  MTH({})         = SHA-256( "" )
```

where the `d` values are the per-record **chain leaves**. The domain-separation prefixes
(`0x00` leaf, `0x01` node) prevent second-preimage attacks that swap a leaf for an inner node.

### 4.2 Worked checkpoint (4-record batch)

Leaves (record 0 = the demo record; records 1–3 = sibling circle agreements):

```
L0 = f7999f87ec2131d5d3a56f306a363ada628ff4f3f298d24f436ba89094813e41
L1 = e2f8c7646d954ea6568a97921162feb3e09b6c0187062a12fda2d2f8856e52bc
L2 = df8b117c99fe3f1fb6ffc97f45f864d542fb3f63c2eabc07769156e7c8400be7
L3 = 8eef3ecd1143e180e303c589dc77283b629b33f08ffc8e2aa34e9f339bcaac3a
ROOT = 363296376cc6d5d5bdb6b99f38fbd6d77bf39ac5ec50b94da29528a276cbd64a   (tree_size = 4)
```

### 4.3 Inclusion proof (audit path) for `L1`

Audit path for leaf index 1 in the 4-leaf tree (RFC 6962 §2.1.1):

```
audit_path = [ 8e95028e5e11872950974d8d963aefcf698d5141584e9ef882ad8f568be4dc51,   // = MTH({L0})
               0052aba985469f20d7d7b1d4cc8e6589d3dc3d032f21e18260fc2f9e938f1a7d ]  // = MTH({L2,L3})
```

Verification (reconstruct the root from the leaf + path):

```
r0 = MTH({L1})                       = SHA-256(0x00 ‖ L1)
r1 = SHA-256(0x01 ‖ path[0] ‖ r0)    // L1 is the right child at the bottom
root' = SHA-256(0x01 ‖ r1 ‖ path[1]) // the {L0,L1} subtree is the left child at the top
assert root' == ROOT                 // ✓
```

- Genuine proof **verifies**: `true`.
- A **forged leaf** (`SHA-256("forged-leaf")`) under the same path is **rejected**: `true`
  (root mismatch). Reference: `verifyInclusion()` (RFC-6962-exact); vectors in [[test-vectors]].

---

## 5. The attestation boundary — in the bytes (closes liability ambiguity)

The envelope embeds a fixed `attestation` string so the bank's role is unambiguous **inside the
evidence** ([[contracts|S6]]):

> **Attests (in-scope, provable):** two Nafath-authenticated identities (acr ≥ substantial)
> sealed *this exact byte-string* at *this RFC-3161 time*; unaltered since.
> **Does NOT attest (out-of-scope, named in the record):** that cash moved · that terms are
> fair / Shariah-final · the absence of coercion · the truth of any underlying fact. Those
> escalate to MoJ / Najiz / Taradhi.

Because the four refusals are *part of the sealed bytes*, "you witnessed it, so you're liable"
fails on contact: the record itself states what the bank witnessed (the e-signing event) and
what it explicitly did not (the debt).

---

## 6. The verification procedure (machine-checkable, tamper-localising)

Given a record (and optionally its previous leaf + a signed checkpoint with an inclusion proof),
decide **intact / tampered** and return the **first** failing property. Reference:
`verifyRecord()`.

### 6.1 Algorithm

```
1. INTEGRITY        h'  = SHA-256(JCS(terms));               require h' == terms_hash
2. ATTRIBUTION      for each assertion a:
                    sig' = SHA-256(JCS(binding(a, terms_hash))); require sig' == a.sig
3. CONTENT          e'  = SHA-256(JCS(envelope));            require e' == envelope_hash
                    leaf'= SHA-256(JCS(leafObj(seq,prev,e'))); require leaf' == leaf
4. NON-REPUDIATION  bs' = SHA-256(JCS(bankSig(leaf)));        require bs' == bank_sig
5. CONTINUITY       require prev_chain_hash == leaf_{seq-1}   (or genesis at seq 1)
6. ANTI-REWRITE     require verifyInclusion(leaf, idx, path, size, signed_root)   [if checkpoint]
7. TIME             t'  = SHA-256(JCS(tsa(terms_hash)));      require t' == tsa_token
verdict: intact  ⟺  all required checks pass; else { intact:false, failedAt:<first failure> }
```

The order matters operationally: it **localises** the breach. A failure at `integrity` means the
*content* was altered; at `chain-continuity` means a *reordering/insertion/replay*; at
`merkle-inclusion` means the *log itself* was rewritten.

### 6.2 Intact record — every property passes

```
integrity:true  attribution(cd8a0006):true  attribution(b5b63ded):true
envelope:true  chain-leaf:true  bank-sig:true  time:true     → { intact:true }
```

### 6.3 Tamper test vectors

| Vector | Mutation | Verdict | `failedAt` | Why |
|---|---|---|---|---|
| **intact** | none | intact | — | all 7 checks pass |
| **single-field tamper** | `principal.amount_halalas 500000 → 900000` | TAMPERED | `integrity` | `h'=90e00c83f7ebfc4d…` ≠ sealed `ceedb1e97f7006f2…` |
| **reorder** | swap `schedule[0]` ↔ `schedule[1]` | TAMPERED | `integrity` | arrays are order-significant in JCS → `h` changes |
| **key-reorder (control)** | write object keys in different order | INTACT | — | JCS sorts keys → identical bytes → identical `h` (correctly *not* a tamper) |
| **replay** | resubmit same envelope at `seq=2, prev=genesis` | TAMPERED | `chain-continuity` | leaf differs (seq tag) **and** `prev_chain_hash` ≠ previous leaf |

Replay defence is layered: the leaf preimage includes `seq` and `prev_chain_hash` (so a replayed
seal lands at the wrong slot and breaks continuity), the Nafath `txn_id` is single-use, and the
settlement idempotency key `ahd_id ‖ schedule_index` ([[contracts|S7]]) blocks double-pay.

---

## 7. Failure modes & honest limits

| Condition | Behaviour |
|---|---|
| TSA unreachable | seal with chain + bank-sig now; flag `time:provisional`; back-fill RFC-3161 token later. |
| Nafath down at signing | record stays `DRAFT`; nothing sealed; no half-witnessed state. |
| DB/chain silently rewritten | the next signed Merkle checkpoint diverges from any retained earlier root → detected, incl. against the bank. |
| One party deletes the app | record persists (the evidence is the bank's *amana*, not the device's). |
| Certified-signature weight (Art. 57(1)) | requires an **accredited PKI / licensed CSP** for the bank key + TSA — a pre-production procurement item, disclosed, not assumed. |
| Final admissibility | a judge's determination — we engineer the integrity precondition and claim only "designed to meet the conditions." |

---

## 8. What the prototype computes (vs the production seam)

The prototype `project/ahd-demo/index.html` runs this **exact** scheme on screen — a from-scratch
synchronous SHA-256 (pinned to the NIST vectors `""`, `"abc"`, the 56-byte multi-block), the JCS
canonicalizer of §2.2, and the preimages of §3 — so the displayed `terms_hash`, `envelope`,
`leaf`, and `bank_sig` are **byte-identical** to the vectors above and re-derivable by anyone.
Mocked strictly behind labelled (`محاكاة`) seams: the Nafath biometric auth, the **TSP AES/QES
signature**, the **RFC-3161 TSA token**, the **bank HSM key**, and sarie. Swapping a seam for the
real integration changes *who computes a signature*, never the **bytes** that are signed.

> Reproduce everything: `node ref/generate-vectors.mjs` (see [[test-vectors]]).
