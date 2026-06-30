#ahd #layer/tech #agent/2

# Agent-2 · Technical & Security — GAP REGISTER

Each gap: what is missing/wrong · why it matters (criterion it fails) · severity. Severity scale: **Critical** = a single judge sentence kills the concept; **High** = visibly loses points; **Med** = polish/credibility.

| # | Gap (what is missing / wrong) | Why it matters / which review it fails | Severity |
|---|---|---|---|
| G1 | "Tamper-evident" = a 32-bit **FNV** hash; no crypto hash, no chain, no signature, no timestamp, no Nafath binding | Technical (20) + Feasibility (25). The core verb "RECORDS" is unproven; forgeable in seconds. This is the kill-line. | **Critical** |
| G2 | **Admissibility asserted on-screen** ("مقبولة كدليل · نظام الإثبات 2022") with no integrity engineering behind it | Feasibility (25). Evidence Law admits digital evidence only if integrity standards are met; a label is not a scheme. | **Critical** |
| G3 | Bank's **witness vs record-keeper** role not encoded in the data model; attestation boundary undefined | Feasibility (25) + Shariah. Liability exposure; the single biggest red-team kill-line. | **Critical** |
| G4 | **No threat model / abuse-case table** (coercion, forgery, repudiation, mule, netting collusion, replay, ATO, term inflation) | Technical (20). An evidence product with no adversarial analysis is not serious. | **Critical** |
| G5 | Muqassa **overclaims "minimum transfers"** (greedy ≠ optimal; min-transactions is NP-hard); no proof/invariant/complexity | Data (15 — softest spot). The centerpiece must be provably correct, not just demoed. | **High** |
| G6 | Muqassa netting performs an unconsented **counterparty substitution** (hawala/novation) with no consent capture | Feasibility + Shariah. Netting is a legal act sold as a UI tap. | **High** |
| G7 | **Trust signal undefined**; risks becoming a shadow credit score (SIMAH/PDPL profiling) | Data (15) + Compliance. The /01 centerpiece is a promise, not a computation. | **High** |
| G8 | **WYSIWYS gap** — the exact bytes a party signs are not hashed and shown pre-signature | Technical + non-repudiation. "I signed something else" defeats the witness. | **High** |
| G9 | sarie **SAR 20,000 cap** and **push-not-pull** reality ignored; "auto-settle" needs a standing mandate | Feasibility (25). Settlement is hand-waved; large installments break. | **High** |
| G10 | **PDPL data-handling**: stored-vs-not, minimization, retention, lawful basis, and revocation-on-sealed-record not specified | Compliance / Feasibility. Consent-revocation vs immutable evidence is a real conflict. | **Med→High** |
| G11 | **Fee model unspecified** → riba/gharar status technically unknown (cross-layer, but it lands on the `ahd` object's fee field) | Shariah. Must be a flat actual-cost fee, decoupled from principal, or it's riba. | **High** |
| G12 | No **idempotency / replay** protection on sign + settle events; money stored as float not integer halalas | Technical. Double-settle / replay risk; rounding drift. | **Med** |

**Closure map:** G1,G2,G8,G12 → §3.1 (the SEAL scheme). G3 → §3.2 (attestation boundary). G4 → §3.4 (threat table). G5,G6 → §3.5 (Muqassa proof + consent). G7 → §3.6 (trust signal). G9 → §3.3 (settlement sequence). G10 → §3.7 (PDPL). G11 → §3.8 (fee field, grounded in AAOIFI).
