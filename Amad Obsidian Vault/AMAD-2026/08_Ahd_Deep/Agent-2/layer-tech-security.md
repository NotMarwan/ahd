#ahd #layer/tech #agent/2

# عهد · Ahd — Technical & Security Layer (the deep deliverable)
**Agent-2 · Technical architecture & abuse-resistance.** Mandate: make Ahd technically *real* and *attack-proof*. The bank lends nothing; it is an **amana/wakala** record-keeper + settlement agent that **proves** integrity, attribution, non-repudiation, and time — and refuses to adjudicate.

---

## 1. Audit findings (summary)
Full audit in `audit-tech.md`. The five load-bearing holes:
1. **"Tamper-evident" was a 32-bit FNV hash** — no chain, no signature, no timestamp, no signer binding. Forgeable in seconds. (Critical)
2. **Admissibility was a label on a div**, not an engineered integrity scheme. (Critical)
3. **Witness vs record-keeper was not encoded** in the data model → liability ambiguity. (Critical)
4. **No threat model** for a product whose users may become adversaries. (Critical)
5. **Muqassa overclaimed "minimum transfers"** and modelled netting as a UI tap, not a consented legal act. (High)

The concept and netting are genuinely sound; the *proof* was missing. Below, each becomes a designed mechanism.

---

## 2. Gap register (summary)
12 gaps registered in `gaps-tech.md` (G1–G12), severity-ranked, each mapped to a §3 resolution. The four Criticals (G1–G4) are closed first because each is an independent kill-line.

---

## 3. Deep resolutions (the bulk)

### 3.1 The SEAL scheme — what actually makes the record tamper-evident (closes G1, G2, G8, G12)

The record is not "a hash." It is a **5-property seal**, each property defending a distinct admissibility requirement. I call the sealed object the **`ahd` record** and its proof the **SEAL** (Signed Evidence with Anchored Ledger).

```
                         THE SEAL (per ahd record)
 ┌──────────────────────────────────────────────────────────────────────┐
 │ (1) CANONICALIZE  terms → deterministic byte-string C  (JCS / RFC 8785)│
 │ (2) HASH          h = SHA-256(C)        ── INTEGRITY                    │
 │ (3) SIGNER-BIND   bind each Nafath assertion (sub, acr, auth_time,      │
 │                   txn-id) into the signed envelope  ── ATTRIBUTION      │
 │ (4) TIMESTAMP     RFC-3161 token over h from a TSA  ── TIME / "when"     │
 │ (5) CHAIN+SIGN    leaf = H(h ‖ prev_chain_hash);                        │
 │                   bank signs the sealed envelope ── NON-REPUDIATION     │
 └──────────────────────────────────────────────────────────────────────┘
```

**Step 1 — Canonicalization.** Terms are serialized with **JSON Canonicalization Scheme (RFC 8785 / JCS)**: sorted keys, fixed number format, UTF-8 NFC. This guarantees the *same agreement always produces the same bytes* on any machine — without it, two honest servers hash differently and "integrity" is meaningless. Money is stored as **integer halalas** (`amount_halalas: 500000`), never floats — this also closes the G12 rounding drift.

**Step 2 — Integrity hash.** `h = SHA-256(C)`. SHA-256 is collision-resistant (replaces the demo's FNV). If one byte of the terms changes, `h` changes — *integrity*.

**Step 3 — Signer binding (WYSIWYS, closes G8).** Before signing, each party is shown the **exact canonical terms** and the **short hash** derived from them. The Nafath assertion they return is over *that* `h`. We persist the Nafath response fields — `sub` (pairwise subject id), `acr` (assurance level), `auth_time`, and the Nafath transaction id — **inside the signed envelope**. This binds *who* authenticated to *which bytes* at *which assurance level*. "I signed something else" is now refuted by the record itself — *attribution*.

**Step 4 — Trusted timestamp.** An **RFC-3161** Time-Stamp Token from a TSA (in production, a SAMA/NCA-accredited authority) is taken over `h`. This proves the record existed at time T independent of the bank's own clock — *time*. (Demo: a local mock TSA behind a clean seam, honestly labeled.)

**Step 5 — Chain + bank signature.** Each record's leaf is `H(h ‖ prev_chain_hash)`, forming a **per-tenant hash chain** (an append-only Merkle log; production publishes a periodic signed Merkle root / "checkpoint" so even the bank cannot silently rewrite history). The whole envelope is signed by the bank's key. Result: any retroactive edit breaks the chain *and* the signature — *non-repudiation, including against the bank itself*.

**Why this is admissible, not "just a hash":** Saudi Evidence Law (in force 23 June 2022) admits digital records/signatures when **integrity** is demonstrable and the evidence is "unequivocally clear and devoid of doubt" ([Al Tamimi](https://www.tamimi.com/law-update-articles/the-characteristics-electronic-and-digital-evidences-in-saudi-arabia/), [JD Supra/Ankura](https://www.jdsupra.com/legalnews/breaking-down-saudi-arabia-s-new-5162342/)). The SEAL maps one-to-one onto what a court needs: SHA-256 = integrity; Nafath binding = attribution to identified persons; RFC-3161 = time; chain + bank signature = non-repudiation and non-tampering. **We claim the record is *engineered to be admissible*; we do not claim a guaranteed verdict — admissibility is a judge's determination, and that honesty is itself defensible.**

**The `ahd` object (data model):**

| Field | Type | Notes |
|---|---|---|
| `ahd_id` | UUIDv7 | time-sortable, idempotency anchor |
| `kind` | enum | `qard_hasan` \| `shared_cost` \| `deferred` \| `promise` |
| `parties[]` | {role, nafath_sub} | role ∈ {lender, borrower}; **no raw national ID stored** (pairwise `sub` only) |
| `amount_halalas` | int64 | integer money, never float |
| `schedule[]` | {due_date, amount_halalas, status} | status ∈ {pending, settled, waived} |
| `terms_canonical` | bytes (JCS) | the exact signed bytes |
| `terms_hash` | sha256 | `h` |
| `nafath_assertions[]` | {sub, acr, auth_time, txn_id, sig} | one per signer — the witness binding |
| `tsa_token` | RFC-3161 token | trusted time over `h` |
| `prev_chain_hash` / `leaf_hash` | sha256 | append-only chain |
| `bank_attestation` | signed blob | scope-limited (see §3.2) |
| `bank_sig` | signature | over the whole envelope |
| `fee` | {flat_halalas, basis:"actual_cost"} | decoupled from principal (see §3.8) |
| `status` | enum | draft → sealed → settling → kept → disputed |

### 3.2 The attestation boundary — witness vs record-keeper, in the schema (closes G3)

The `bank_attestation` field carries an **explicit, narrow attestation string** so the bank's role is unambiguous in the evidence itself:

> **Bank attests (provable, in-scope):** "Two Nafath-authenticated identities (acr ≥ substantial) each sealed *this exact byte-string* at *this RFC-3161 time*; this record has not been altered since."
> **Bank explicitly does NOT attest (out-of-scope, stated in the record):** that cash actually changed hands; that the terms are fair or Shariah-final; that no party was coerced; the truth of any underlying fact. **Disputes over those escalate to MoJ / Najiz / Taradhi.**

This makes Ahd a **record-keeper that witnesses an *e-signing event*, not an adjudicator of the *underlying debt*.** "You witnessed it so you're liable" dies because the record names precisely the four things the bank refuses to vouch for. This is the amana/wakala posture, written into the bytes.

### 3.3 Nafath + sarie integration sequences (closes G9)

**(a) Creation → dual e-sign → seal**
```
Lender App        Ahd Core         Nafath           TSA          Borrower App
   │ create ahd ───►│                                                │
   │                │ canonicalize C, h=SHA256(C)                    │
   │ show C + h ◄───│                                                │
   │ sign req ─────►│── auth(h) ──►│ (face/finger)                   │
   │                │◄─ assertion(sub,acr,auth_time,txn)             │
   │                │                                  invite ──────►│
   │                │◄────────── sign req ─── show C + h ────────────│
   │                │── auth(h) ──►│◄─ assertion ───                 │
   │                │── h ──────────────────►│ RFC-3161 token        │
   │                │◄──────────────────────│                        │
   │                │ leaf=H(h‖prev); bank_sig; append chain         │
   │  SEALED ◄──────│──────────────────────────────► SEALED          │
```

**(b) Scheduled auto-settlement via sarie**
```
Scheduler        Ahd Core        Payment Consent      sarie (SAMA IPS)
  │ due tick ──────►│                                       │
  │                 │ check standing mandate ──►│ valid?    │
  │                 │◄──────────────────────────│ yes       │
  │                 │ split if amount > 20,000 SAR (cap)     │
  │                 │── credit-push transfer (idempotency-key)──►│
  │                 │◄──────────── settled / failed ────────────│
  │                 │ update schedule[i]=settled; re-seal delta  │
  │                 │ if all settled → status="kept" (ذمّة محفوظة)│
```

**sarie reality, designed-for, not hand-waved:** sarie caps **SAR 20,000 per transaction** (Quick Transfer SAR 2,500), no daily cap, operated by Saudi Payments under SAMA ([SAMA launch](https://www.sama.gov.sa/en-us/news/pages/news-649.aspx), [BSF Sarie](https://bsf.sa/Library/Assets/Gallery/Files/BSF_Sarie_En.pdf)). So: (1) any installment > SAR 20,000 is **auto-split** across transactions; (2) sarie is **credit-push**, so "auto-settle" requires a **pre-authorized standing payment mandate** (Open Banking PIS consent / future direct-debit) from the borrower captured *at signing* — never a silent pull. If no mandate exists, Ahd degrades gracefully to a **one-tap reminder + pre-filled push** the borrower confirms. Every settlement carries an **idempotency key = `ahd_id ‖ schedule_index`** so a retry never double-pays (closes part of G12).

### 3.4 Threat model + abuse-case table (closes G4)

Adversary classes: **outsider** (no creds), **insider party** (a lender/borrower turned adversary — the *dominant* class for an evidence product), **colluding ring**, **compromised account**.

| # | Abuse case | Adversary | Designed defense |
|---|---|---|---|
| T1 | **Coercion to sign** ("sign or else") | insider lender | Nafath signing is on the victim's *own* device + biometric (can't be done for them); a mandatory **cooling-off window** before first settlement; an in-app **"I signed under pressure" flag** that marks the record `disputed` and routes to Taradhi. The bank attests only to the *signing event*, never to *voluntariness* (§3.2) — so coercion is a dispute for MoJ, not a bank liability. |
| T2 | **Fabricated / fake agreement** (forge a debt) | insider | A record requires **both** parties' live Nafath assertions bound to `h`. One party cannot manufacture the other's `sub`/`acr`/`auth_time` — Nafath returns them only after a real biometric auth on the counterparty's device. No dual assertion ⇒ no seal. |
| T3 | **Repudiation** ("I never signed / not those terms") | insider | WYSIWYS: the signed bytes = the shown bytes (§3.1 step 3). The stored Nafath `sub`+`txn_id`+`auth_time` and the RFC-3161 time refute "I never signed that." |
| T4 | **Money-mule / laundering** | ring | Ahd moves money **only over sarie/bank rails inside KYC'd accounts** — no cash, no anonymity. Velocity + structuring monitoring (many small `ahd`s into one account, rapid net-and-cash-out) feeds the bank's existing **AML/SAMA** pipeline. Trust signal (§3.6) **never** vouches for source-of-funds. |
| T5 | **Muqassa collusion** (fake circular IOUs to wash funds / inflate trust) | ring | Netting executes **only over already-sealed, dual-signed `ahd`s** — you can't net a debt nobody co-signed. Net-zero ring with no real settlement transfers = AML signal, not a clean trust boost. Trust signal counts **settled obligations on rail**, not declared ones (§3.6). |
| T5b | **Unconsented counterparty swap via netting** | n/a (correctness) | Netting changes who-pays-whom; treated as a **consented novation** — every party in the optimized plan must **re-confirm** the new transfer before it executes (§3.5). |
| T6 | **Replay** (resubmit a settlement / sign event) | outsider/insider | Idempotency key `ahd_id‖schedule_index`; Nafath `txn_id` single-use; chain leaf includes `prev_chain_hash` so a replayed seal is rejected. |
| T7 | **Account takeover** | outsider | Signing is gated on **Nafath acr ≥ substantial** (live biometric), not a password — a stolen app session can't sign. High-value `ahd` or new payee triggers **step-up**. |
| T8 | **Malicious lender inflates terms** (adds interest/penalty) | insider lender | The **riba/penalty checker** (AI layer) blocks any term that adds interest, late penalty, or open-ended gharar *before* sealing; `kind=qard_hasan` is structurally barred from carrying a markup field. Borrower sees the clean canonical terms before signing. |

### 3.5 The Muqassa netting algorithm — specified and proven (closes G5, G6)

**Problem.** Given sealed bilateral debts as a directed weighted multigraph, settle everyone with as few transfers as possible while preserving every person's net position.

**Algorithm (greedy max-debtor / max-creditor reduction):**
```
1. net[p] = Σ(incoming) − Σ(outgoing)            // O(E)
2. D = {p : net[p] < 0} (owe)   C = {p : net[p] > 0} (owed), as max-heaps by |net|
3. while D and C not empty:
     d = max debtor, c = max creditor
     m = min(|net[d]|, net[c])
     emit transfer d → c of m
     net[d]+=m ; net[c]-=m ; drop any party at 0
4. return transfers
```

**Complexity:** building balances O(E); each loop iteration zeroes ≥1 party, so ≤ n−1 iterations, each O(log n) on heaps ⇒ **O(E + n log n)**. For a friend-circle (n ≤ ~12) this is microseconds.

**Correctness invariant (the proof a judge can hear):**
- *Net-preservation:* Σ over all parties of `net` is 0 before (every debt is +x for one, −x for another) and each transfer moves `m` from a debtor to a creditor, decrementing one negative and one positive by the same `m` — so **every party's final net = 0 and no party's net is changed by more than what they actually owed/were owed.** Each person settles their *exact* net obligation, no more.
- *Transfer bound:* each iteration eliminates at least one party ⇒ **at most n−1 transfers.** This is the honest, provable claim.

**Honesty on optimality (closes the overclaim):** the *absolute minimum* number of transactions is the NP-hard "minimum-transactions" problem (subset-sum partition over balances). Greedy gives **≤ n−1**, which is optimal in the common case (no proper sub-partition sums to zero) and near-optimal otherwise. **We claim "n−1-bounded," not "the minimum,"** and offer an optional exact solver for small circles (n ≤ 15) via balanced-subset search. The demo's "أقل عدد" copy is corrected to "أقل تحويلات ممكنة عمليًا" (fewest practical transfers).

**Edge cases:**

| Case | Behavior |
|---|---|
| Pure 3-cycle A→B→C→A equal | all nets = 0 ⇒ **0 transfers** (fully washed) |
| Single dominant creditor | star pattern, n−1 transfers, all → the creditor |
| Disconnected sub-circles | nets are global; algorithm naturally produces independent transfer clusters — no special-casing |
| Floating residue | impossible: integer halalas ⇒ exact, the `1e-6` epsilon disappears |
| One party owes & is owed equally | net 0, drops out — they neither pay nor receive |

**Worked example (the demo's 9 IOUs, in SAR):**
Balances → نورة −900, سارة +0... computing nets from `IOUS`: نورة pays 200+250+400+50=900, receives 0 ⇒ **−900**. سارة pays 200+150=350, receives 200+150=350 ⇒ **0**. خالد receives 200+400+150=750, pays 150 ⇒ **+600**. ليلى receives 250+150=400, pays 250+150=400 ⇒ **0**. فهد receives 250+50=300, pays 0 ⇒ **+300**. Check Σ = −900+0+600+0+300 = 0 ✓. Debtors {نورة:900}; creditors {خالد:600, فهد:300}. Greedy: نورة→خالد 600, نورة→فهد 300. **9 IOUs → 2 transfers**, نورة out exactly 900, خالد in 600, فهد in 300 — every net preserved.

**Consent (closes G6):** the optimized plan is a **novation** — before any sarie transfer fires, each affected party gets a one-tap re-confirmation ("instead of paying سارة, you'll pay خالد 600 — confirm"). Only consented plans execute. Netting is thus a *consented multilateral settlement*, not a silent counterparty swap.

### 3.6 The trust signal — social, computational, and deliberately NOT a credit score (closes G7)

**What it computes** (per person, from *their own sealed Ahd history only*):
- `kept_ratio` = settled-on-time obligations / total matured obligations
- `count` = number of completed `ahd`s
- `recency` = time-decayed weighting (a 2019 default matters less than a 2026 one)
- `reciprocity` = lends as well as borrows (a pure-taker pattern is visible to *the counterparty*, not scored against the person)

Output: a **3-band qualitative signal** ("vows kept consistently" / "new — little history" / "has overdue vows") shown **only to a prospective counterparty at the moment they consider an `ahd`** — never sold, never a number, never aggregated cross-bank.

**What it deliberately refuses to do** (this is the moat *and* the compliance shield):
- ❌ no numeric score, no ranking, no percentile
- ❌ never used to **underwrite or price** any product (that would make Ahd a lender — banned by the spine)
- ❌ never fed to SIMAH / credit bureau, never a PDPL "profiling" decision with legal effect
- ❌ never inferred from non-Ahd data (no transaction-mining, no social graph scraping)

It is a **trust *mirror* for the two people, not a credit *score* for the system.** Computationally it is a windowed, decayed ratio over the user's own consented evidence — genuine, defensible, and structurally incapable of becoming a credit score because it never leaves the dyad and never touches an underwriting decision.

### 3.7 PDPL: data handling, minimization, retention, revocation (closes G10)

- **Stored:** Nafath pairwise `sub` (not raw National ID), canonical terms, hashes, assertions, TSA token, schedule, settlement references. **Not stored:** raw biometrics (they never leave Nafath/device), full national ID, message content beyond the agreement, anything not needed for the evidentiary record. Data minimization by construction.
- **Lawful basis:** *performance of a contract* + *establishment/exercise of a legal claim* — **not** revocable consent. This is why a party **cannot "withdraw consent" to erase a sealed `ahd`**: it is financial evidence both parties rely on, and PDPL permits retention for legal claims. The user *can* withdraw consent for *optional* processing (e.g. reminders, trust-signal display) without destroying the record.
- **Retention:** sealed records retained for the statutory limitation period of the claim, then cryptographically shredded (key destruction) — the chain keeps the leaf hash (proving a record *existed*) without the personal data.

### 3.8 The fee field — grounded so the riba status is *known* (closes G11)

The `fee` field is **`{flat_halalas, basis:"actual_cost"}`** — a fixed per-record administrative charge equal to the bank's actual cost of providing the record/settlement service, **decoupled from the principal**. This is the only Shariah-safe shape: AAOIFI permits a lending institution to charge a service fee **only for the actual cost of the service**, the charge **may not exceed actual cost**, and it **may not be linked to the amount lent** ([AAOIFI/DSN analysis](https://eudl.eu/pdf/10.4108/eai.4-11-2022.2329681), [Zaharuddin on management fees in qard](http://www.zaharuddin.net/index2.php?option=com_content&do_pdf=1&id=161)). By storing fee as a flat actual-cost value that is *structurally forbidden from referencing `amount_halalas`*, the riba/gharar status moves from "unknown" to "engineered-clean" — the schema itself prevents a percentage-of-loan fee. (Final ruling: Shariah board, per AAOIFI's requirement that the SSB approve the cost formula.)

---

## 4. Edge cases & failure modes (this layer)

| Failure | Handling |
|---|---|
| Nafath down at signing | `ahd` stays `draft`; nothing sealed; no half-witnessed state. Honest "try again." |
| TSA unreachable | Seal with chain+bank-sig now, **back-fill RFC-3161 token** when TSA returns; record flags `time:provisional` until anchored. |
| sarie settlement fails (limit/funds) | schedule[i] stays `pending`; retry with same idempotency key; never partial-double-pay. |
| Installment > SAR 20,000 | auto-split into ≤20k transactions (§3.3). |
| One party deletes the app | record persists (evidence is the bank's amana, not the device's); counterparty unaffected. |
| Chain divergence / DB tamper | periodic signed Merkle checkpoint detects any silent rewrite — including by the bank. |
| Netting plan partially confirmed | only the consented sub-transfers execute; unconfirmed legs remain as original bilateral debts. |
| Borrower has no standing mandate | degrade to confirm-to-push reminder, never silent pull. |

---

## 5. Proof / grounding (cited)
- **Evidence Law 2022** — in force 23 Jun 2022; digital records/signatures admissible *given integrity* + "clear and devoid of doubt": [Al Tamimi](https://www.tamimi.com/law-update-articles/the-characteristics-electronic-and-digital-evidences-in-saudi-arabia/), [JD Supra / Ankura](https://www.jdsupra.com/legalnews/breaking-down-saudi-arabia-s-new-5162342/), [Latham & Watkins on e-signatures](https://www.lw.com/admin/upload/SiteAttachments/Understanding-the-Enforceability-and-Admissibility-of-Electronic-Signatures-in-Saudi-Arabias-Evolving-Legal-System.pdf).
- **sarie** — SAR 20,000/txn cap, Quick Transfer SAR 2,500, no daily cap, Saudi Payments/SAMA: [SAMA launch](https://www.sama.gov.sa/en-us/news/pages/news-649.aspx), [BSF Sarie PDF](https://bsf.sa/Library/Assets/Gallery/Files/BSF_Sarie_En.pdf).
- **Nafath** — SDAIA+MoI national SSO, biometric (face/fingerprint) auth, integratable as an identity-provider connector across 530+ services: [my.gov.sa](https://my.gov.sa/en/services/119727), [OECD-OPSI](https://oecd-opsi.org/innovations/nafath-app/).
- **Fee model (AAOIFI)** — service fee permitted only at actual cost, may not exceed cost, may not be linked to amount lent, SSB must approve formula: [AAOIFI/DSN comparison](https://eudl.eu/pdf/10.4108/eai.4-11-2022.2329681).
- **Standards used in the SEAL:** SHA-256 (FIPS 180-4), RFC 8785 JSON Canonicalization, RFC 3161 Time-Stamp Protocol — all open, widely-implemented, court-recognized.

---

## 6. Adoption implication — why a Saudi trusts / returns
The security architecture *is* the adoption argument. A Saudi asking a loved one to Nafath-sign feels like distrust **only if the record protects one side**. The SEAL is **symmetric**: it equally refutes "you never paid me" *and* "I never borrowed that much" — so signing reads as *mutual protection of the relationship*, the very thing Ayat al-Dayn commands. The bank attesting *only* to the signing event (never calling anyone a liar) keeps it dignified. And because the record is the bank's amana — surviving a deleted app, a lost phone, a forgotten promise — a Saudi *returns* to Ahd as the place their word is kept. Trust is not a feature here; it is the cryptography.

---

## 7. Residual risks (honest)
| Risk | Mitigation |
|---|---|
| Final **admissibility is a court's call**, not the app's | We claim "engineered to be admissible" + name the exact integrity properties; pre-production MoJ/SAMA/Shariah sign-off is disclosed, not hidden. |
| **TSA accreditation** in KSA may require a specific provider | Scheme is provider-agnostic (any RFC-3161 TSA); demo uses a labeled mock. |
| **Standing-mandate / direct-debit** for true auto-pull may await Open Banking PIS maturity | Degrade to confirm-to-push; no silent pull claimed. |
| Greedy netting **not provably minimal** | Honest "≤ n−1" claim + optional exact solver for small circles. |
| Coercion is **socially real and tech-unobservable** | Cooling-off + dispute flag + bank's explicit non-attestation to voluntariness; routes to Taradhi. |

---

## 8. Objection-killer additions (one sentence each)
- **"Your hash is theater."** → It's not a hash, it's a SEAL: SHA-256 (integrity) + Nafath-bound assertions (attribution) + RFC-3161 (time) + chain & bank signature (non-repudiation) — the four things a court needs, not one.
- **"Saying it's admissible doesn't make it admissible."** → Correct — which is why we *engineer the integrity properties Evidence Law 2022 requires* and claim "built to be admissible," with MoJ sign-off disclosed, not asserted.
- **"So the bank IS liable as a witness."** → The record itself names the four things the bank refuses to vouch for (cash moved, fairness, voluntariness, underlying truth) — it witnesses the *signing event*, never the *debt*.
- **"Netting is just a chart."** → It's an O(E + n log n) greedy reduction with a net-preservation invariant, a proven ≤ n−1 bound, an honest NP-hardness caveat, and a *consented novation* step — math, not animation.
- **"Your trust score is an illegal credit score."** → It never produces a number, never underwrites, never reaches SIMAH, and never leaves the two people — it is structurally incapable of being a credit score.
