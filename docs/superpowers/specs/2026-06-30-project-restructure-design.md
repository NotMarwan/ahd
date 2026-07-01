# Project Restructure — Ahd (عهد)

## Goal
Clean, professional project tree for a hackathon/fintech prototype. Flatten the nested `project/` directory, consolidate documentation, archive process artifacts, add a full README and design system doc.

## Target structure

```
ahd/
├── README.md              // Layered: product pitch → architecture → quick start
├── DESIGN.md              // Full design system: colors, typography, layout, RTL, components
├── CLAUDE.md              // Agent working guide (updated paths)
├── .gitignore
│
├── app/                   // ← from project/ahd-app/
├── demo/                  // ← from project/ahd-demo/
├── promo/                 // ← from project/ahd-promo/
│
├── tests/                 // ← from 10_Deep/Hardening/test-harness/
├── lib/                   // Shared build/serve tools extracted
│   └── _serve-app.cjs     // (copied from app/ — app/ keeps its own)
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PRESENTER-GUIDE.md
│   ├── DECK-DRAFT-AR.md
│   ├── DECISIONS-FOR-MARWAN.md
│   ├── PUBLISHABLE-PRODUCT-SPEC.md
│   ├── specs/              // ← from 12_Consumer/, 13_Circle/, 11_Build/
│   │   ├── consumer-agent-1.md … consumer-agent-4.md
│   │   ├── circle-spec.md
│   │   └── build-spec.md
│   ├── evidence/
│   │   ├── EVIDENCE-BRIEF.md
│   │   ├── REBUTTAL-PLAYBOOK.md
│   │   └── DEMAND-SURVEY-KIT.md
│   └── research/           // ← AMAD prompts, dossiers, Obisidian Vault
│       ├── AMAD_2026_Agent_Prompt.md
│       ├── AMAD_HACKATHON_2026_FULL_DOSSIER.md
│       ├── Amad Obsidian Vault/
│       └── ... (Arabic docs, PDFs)
│
├── _meta/
│   ├── deep-work/
│   │   ├── backend/       // ← 10_Deep/Backend/
│   │   ├── hardening/     // ← 10_Deep/Hardening/*.md (not test-harness/)
│   │   └── ledger/        // ← 10_Deep/Ledger/
│   ├── handoffs/          // ← handoffs/
│   ├── agent-presence/    // ← .agent-presence/
│   ├── overnight-log.md   // ← OVERNIGHT-LOG.md
│   ├── STATUS.md          // ← 10_Deep/STATUS.md
│   └── archive/           // ← 99_RETIRED, claudecodeui, prototypes, temp files
│
├── _raw/                  // keeps existing raw materials
└── _overnight/            // keeps backup + tripwire (path updated)
```

## Path updates needed

| File | Old path | New path |
|------|----------|----------|
| `app/build-engine.cjs` require | `../../10_Deep/Hardening/test-harness/load-logic.cjs` | `../tests/load-logic.cjs` |
| `tests/load-logic.cjs` HTML_PATH | `.../project/ahd-demo/index.html` | `../demo/index.html` |
| `tests/app/engine-parity.cjs` ENGINE_PATH | `.../project/ahd-app/engine.js` | `../../app/engine.js` |
| `tests/dom-smoke.cjs` HTML_PATH | `.../project/ahd-demo/index.html` | `../demo/index.html` |
| `tests/offline-check.cjs` HTML_PATH | `.../project/ahd-demo/index.html` | `../demo/index.html` |
| `_overnight/backup/demo.sha256` | `*project/ahd-demo/index.html` | `*demo/index.html` |

## README structure
1. Product pitch / spine
2. Screen-by-screen walkthrough
3. Quick start (one command to run)
4. Architecture (two-build, one engine, determinism)
5. Design highlights
6. Quality gate (test commands)
7. Project map
8. Shariah basis (Quran 2:282 + 2:280)

## DESIGN.md structure
1. Design Philosophy (dignity-first, amber-not-red, RTL-native, anti-score)
2. Color Palette
3. Typography
4. Spacing & Layout
5. Iconography & Visual Language
6. Motion
7. RTL & Arabic
8. Accessibility
9. Visual Components

## Audit plan
After restructure: run tests, verify tripwire, check app serves, update CLAUDE.md paths.

## Addendum (2026-07-01) — `project/` kept as a scoped exception

`project/` was **not** flattened away as planned above. `project/mcp/` (3 MCP servers, 17 tools, for AI-agent tooling) was added after this doc was written, and is being kept deliberately: dev/agent tooling lives under `project/`; product surfaces (`app/`, `demo/`, `promo/`) stay flat at the root exactly as planned. Confirmed directly with the project owner — not re-litigated here. See `CLAUDE.md`'s "Where things are" and `project/mcp/README.md`. The stray untracked top-level `mcp/` duplicate (an earlier scaffold, pre-dating the move into `project/mcp/`) was deleted as clutter.
