# SealedDoc — وثيقة الختم

THE signature idiom of Ahd: one dark sealed-document surface for every proof/seal moment.

- Surface: `.ol-seal` (shares tokens with `.pf-doc`, `.pf-chain2`, `.st-verify` — all map to `--seal-bg`/`--seal-ink`).
- Children: `.sl` label · `.sh` hash (monospace, forced LTR — hashes read left-to-right) · `.sv.ok` (mint ✓) or `.sv.bad` (coral ✗, the ONLY red-family moment besides tamper) · `.mini` dark button.
- Color law: brick-red family (`--bad*`) is RESERVED for cryptographic tamper-fail. Lateness is ALWAYS amber, never red.
- Hashes are real SHA-256 in the product — show plausible 64-hex prefixes, never lorem.
