# Plan · Deepen-04 — حافظة الإثبات ↔ محلّ خلاف interconnection

**Lane:** proof-pack + dispute. **Mode:** additive pure logic + screen weave. **Spine:** the bank witnesses
and **never judges**; the proof stands on cryptography, not the bank's word; no penalty/score; integer halalas.

## Where they are now
- **Proof** shows canonical + content hash + a 2-line chain + a tamper toggle (amount +4000) + verify. Thin
  chain viz, no provenance, the tamper demo doesn't say *which field* changed.
- **Dispute** shows stance + paused + a neutral-exhibit card (links to proof) + two paths (تراضٍ: reschedule/
  forgive · قضاء: show proof). It already calls `openProof`, but the proof screen does NOT reframe itself as
  the *neutral exhibit* when arrived-from-dispute (it still says «رجوع إلى دفتري»).

## Deepen the proof (pure logic — TDD first, `app/proof-provenance.test.cjs`)
1. **`provenance(record, engine)`** → a structured, display-ready provenance of the sealed record: parties,
   principal (integer halalas), type, full schedule, basis verse (2:282), witnessed-via (نفاذ + SHA-256),
   status, content hash, short seal, riba-flags. Reuses fold/statusLabel/toMinor/short/buildProofPack — no
   golden change. It's the record's provenance, surfaced.
2. **`tamperReport(record, engine, overrideSAR)`** → `{ok, field, before, after, beforeMinor, afterMinor,
   hashBefore, hashAfter, sealBefore, sealAfter}` — names EXACTLY which field changed and shows the two
   diverging hashes/seals. A convincing, precise tamper demonstration (golden seal reused).

## Weave (the interconnection)
3. app.js: **`openProofAsExhibit(id)`** sets `proofState.fromDispute = true` and opens proof; **`proofBack`**
   returns to محلّ خلاف when arrived-from-dispute (else to دفتري). Dispute's proof buttons call it.
4. Proof screen: when `fromDispute`, the back button reads «→ رجوع إلى الخلاف» and a banner frames the doc as
   the **neutral exhibit** («دليلٌ محايد يُقدَّم للطرفين وللقضاء عند الحاجة — وعهد يشهد ولا يحكم»). Always:
   render the **provenance card** + a clearer **genesis → content-hash → block-seal chain** + the precise
   **tamper report** (the changed field + the two hashes) when tampered.

## Guards
- Existing `proof.test.cjs` (65) + `dispute.test.cjs` (64) stay fully green — no assertion weakened.
- New logic TDD'd; DOM-smoke grown for provenance + the exhibit framing + the precise tamper diff.
- Golden sha256/sealBlock/GENESIS reused, never altered (golden-vectors + parity stay green).
- No number/score (amounts are money); amber-not-red; determinism + offline preserved.
- Real-browser: proof shows provenance/chain/tamper-diff; dispute→proof reframes as exhibit; 0 console errors.
