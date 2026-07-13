# Ahd Full Product Roadmap + Arabic Demand Survey

> For agentic workers: use `executing-plans` and TDD. One bounded task per worker. Never modify `demo/index.html` or golden engine internals.

## Goal and guardrails

Raise Judge Lens evidence, UX, technical safety, and feasibility without changing Ahd's spine. Money remains integer halalas. Ahd witnesses, seals, settles, and nets; it never lends, judges, charges interest/penalties, or scores people. AI issues no fatwa. Raw survey data and secrets are never committed.

Execution uses three isolated lanes and one integration controller. Lowest capable model handles each mechanical task. Review occurs once after integration, not inside lanes.

Priority: survey/analysis; Arabic typography/rehearsal; threat model/rate limits; external validation packs; Open-Witness interoperability; gift-only third-party settlement; cloud/TLS; TSA proof; forgiveness request; duress report; debt-at-death specification. Estate workflow, billing, and self-disclosure remain gated. Pooled custody is excluded from v1.

## Lane A: anonymous Arabic survey

Create canonical `docs/evidence/survey/form-spec.json`, deterministic `tools/survey/render-google-form.cjs`, generated `tools/survey/build-google-form.gs`, offline `tools/survey/analyze-responses.cjs`, fixtures, tests, and owner runbook.

Form rules: Arabic only; 3-4 minutes; anonymous; no name, email, phone, ID, bank data, IP collection, or financial free text. Email/login/one-response restrictions off. Raw Sheet/CSV private. Five prefilled source links G1-G5.

Questions, in order: consent; Saudi-resident adult eligibility; optional age and nationality bands; lending and borrowing frequency in last 12 months; largest amount lent band; delayed repayment experience; conditional awkwardness, last action, and relationship strain; documentation method; reminder preference; importance of no interest/penalty; reassurance from written debt; optional concept reaction last; source-group code. Negative consent/eligibility ends the form. Pain block appears only after a delay experience.

Sample: minimum 80 valid, target 150, normal stop 250, absolute optional stretch 384. At least five unrelated seed groups with 10 valid each; no group above 40%. Never claim national representativeness.

Preregistered thresholds: H1 at least 35% lent or borrowed in 12 months. H2 among delayed cases: awkward top-two at least 50%, hint/wait/forgive at least 30%, any strain at least 20%. H3 among low-documenters: neutral automatic or trusted-third-party reminder at least 40%. Below 80 is exploratory; 80-149 directional pilot; 150-250 strong directional convenience evidence. Survey-only marks OT-A1 `SUPPORTED-DIRECTIONAL`, not closed.

Analyzer exports `loadResponses(csvText)`, `validateResponse(row)`, `summarize(rows,{kFloor:10,minPublicGroup:20})`, and `renderMarkdown(summary)`. Suppress cells below 10, public subgroups below 20, show counts/base n/whole percentages, flag but never auto-delete duplicate candidates. Commit aggregate JSON/Markdown only.

## Lane B: safety and external validation

Write a route-level STRIDE/LINDDUN threat model covering assets, trust boundaries, authentication, replay, denial of service, metadata privacy, storage compromise, and presenter/cloud differences.

Add `server/rate-limit.cjs` with `createFixedWindowLimiter({limit,windowMs})`; `check(key,nowMs)` returns `{allowed,remaining,retryAfterMs}`. Live mutating routes allow 30/min/client, `/verify` 120/min/client, `/health` unlimited. Derive client identity from socket remote address, not forwarded headers. Use injected monotonic time. Return deterministic 429 metadata. Preserve direct router parity through opt-in context.

Prepare scholar, Saudi legal, SAMA/custody, Nafath, and timestamp-provider validation packs. Every question requests allowed/blocked/needs-change; a pack is not approval.

Document an optional RFC 3161-style timestamp demonstration and cloud/TLS profile with HMAC auth, injected secrets, durable storage, TLS, rate limiting, health, backup/restore, and log redaction. Never use demo keys as production keys. Offline app guarantees remain intact.

## Lane C: experience, protocol, and safe product

Vendor official IBM Plex Sans Arabic Regular/Semibold WOFF2 locally, record release and SHA-256, include OFL, and use no CDN. Add rehearsal timing, screenshot, and zero-console checklist.

Add a second deterministic Open-Witness issuer fixture. Both issuer records verify independently; wrong issuer, payload tamper, broken chain, and invalid Merkle proof fail. Standalone verifier must not import `app/` or the frozen engine.

Add UMD `recordThirdPartyGift(record,{payerId,amountMinor,reference},engine)`: integer halalas, payer distinct from borrower/lender, no overpayment, existing principal-payment event, metadata `channel:"third_party_gift"` and `recourse:false`. It records an externally confirmed gift only: no reimbursement, guarantee, new debt, payment-rail claim, or score.

Add `requestForgiveness(record,{borrowerId,scope,amountMinor?,reasonKey},engine)` as an auxiliary request. It changes no balance, schedule, or seal. Only lender acceptance invokes existing forgiveness. Add `reportDuress(record,{reporterId,reasonKey},engine)`: pre-seal blocks sealing for human review; post-seal never rewrites or invalidates the record. Ahd makes no truth judgment, sanction, or risk signal. Reasons are enums, not free text.

Keep new screens contextual and `NAV_ORDER` unchanged. Update script order, project map, DOM smoke inventory, scoped CSS, and offline assertions.

Write debt-at-death v1 specification only. States: `DEATH_REPORTED`, `DEATH_VERIFIED`, `ESTATE_EVIDENCE_EXPORTED`, `ESTATE_SETTLEMENT_RECORDED`. Lender receivable belongs to estate and only proven representative acts. Borrower liability is estate-only; heirs have no personal liability. No automatic acceleration/maturity, inheritance-share calculation, waiver, judgment, or scoring. Enabled estate workflow requires scholar and Saudi legal approval.

Billing requires Shariah/legal/payment approval; any approved fee must be flat or actual-cost, separate, and unrelated to principal, duration, or delay. Self-disclosure stays deferred. Pooled custody stays excluded; use pledge-then-pay unless licensed custody is approved. Protocol normalization changes are additive v2 only.

## Integration and acceptance

Each production behavior follows RED-GREEN TDD. Lane commits are cherry-picked only after scoped tests and `node tests/run-all.cjs` pass. Integration reruns the full gate, then repeats it from a clean `git archive` snapshot. Frozen demo SHA must remain `e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40`.

After integration: verify forbidden APIs, integer money, console-free judge surfaces, and spine language. Run one independent high-capability whole-branch review, then Judge Lens/tired-judge/skeptic. Any visible criterion below 8 creates a `JL-` item. Refresh evidence/deck/script/screenshots, score state, open items, session report, Obsidian cockpit, and Graphify. Fetch remote; stop if `origin/main` changed. No force-push.
