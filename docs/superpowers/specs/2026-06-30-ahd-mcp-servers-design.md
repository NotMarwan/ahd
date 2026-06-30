# Ahd MCP Servers — Design Specification

> Three focused Model Context Protocol servers for navigating the Ahd project.
> Codebase navigator + knowledge base + filesystem tools.

## Purpose

AI agents working on Ahd need to understand a complex project: two builds (frozen demo + publishable app), a parity-tested engine copy, a spine of non-negotiable rules, 29+ test suites, a ledger of decisions and open threads, and 11 handoffs. Today they rely on grep + glob — slow, imprecise, no project awareness.

Three focused MCP servers give agents structured, fast access to:
- **Where things are** and what they do (navigator)
- **What the project knows** about itself (knowledge)
- **How the filesystem looks** today (filesystem)

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Claude Code / Desktop               │
│              (MCP client — connects to servers)       │
└────┬──────────────┬──────────────────┬────────────────┘
     │ stdio        │ stdio            │ stdio
┌────▼──────────┐ ┌─▼────────────────┐ ┌▼───────────────┐
│ ahd-navigator │ │ ahd-knowledge    │ │ ahd-fs         │
│               │ │                  │ │                │
│ intent-finder │ │ decisions        │ │ project_glob   │
│ architecture  │ │ status           │ │ git_log/diff   │
│ conventions   │ │ handoffs         │ │ git_blame      │
│ features      │ │ specs/plans      │ │ integrity      │
│ file_role     │ │ query_knowledge  │ │ coverage_gaps  │
│ tests_for     │ │                  │ │                │
└───────────────┘ └──────────────────┘ └────────────────┘
```

### Runtime
- **TypeScript + Node.js** (v24.14.1), `@modelcontextprotocol/sdk`
- `tsx` for development execution (no build step)
- `npm run build` for production (compiled `.js` outputs)

### Workspace layout (`project/mcp/`)
```
project/mcp/
├── package.json                           # npm workspace root
├── tsconfig.base.json                     # shared compiler options
├── packages/
│   ├── ahd-navigator/   →  MCP Server A
│   ├── ahd-knowledge/   →  MCP Server B
│   └── ahd-fs/          →  MCP Server C
└── README.md
```

Each package is an independent MCP server: its own `package.json` with `"type": "module"`, `"main": "./dist/index.js"`, and `"bin"` entry. This lets any MCP host (`claude_desktop_config.json`, Claude Code config, Cursor, etc.) point directly at a single package.

## Server A: `ahd-navigator`

### Purpose
Answer "where is X?" without grep. Understand architecture, conventions, feature locations at a structural level.

### Data source: `project-map.json`
A checked-in JSON manifest at `project/mcp/packages/ahd-navigator/src/project-map.json`. Auto-generated (via `npm run generate-map`) from a script that walks the project structure. This avoids live filesystem parsing — fast, stable, deterministic.

Shape:
```json
{
  "builds": [
    { "name": "ahd-demo", "path": "project/ahd-demo/index.html", "type": "frozen-presenter", "tripwire": "e2f48467…be40" },
    { "name": "ahd-app", "path": "project/ahd-app/", "type": "publishable-product", "serveCmd": "node project/ahd-app/_serve-app.cjs" },
    { "name": "ahd-promo", "path": "project/ahd-promo/", "type": "remotion-video" }
  ],
  "layers": [
    { "name": "legal-shariah-regulatory", "path": "08_Ahd_Deep/Agent-1/", "description": "Legal/Shariah foundations" },
    { "name": "growth-adoption", "path": "08_Ahd_Deep/Agent-2/", "description": "KSA market + adoption strategy" },
    { "name": "product-demo", "path": "08_Ahd_Deep/Agent-3/", "description": "Product spec + demo narrative" },
    { "name": "circle", "path": "08_Ahd_Deep/Agent-4/", "description": "Circle (group lending) spec" }
  ],
  "engineInfo": {
    "golden": { "path": "project/ahd-demo/index.html", "markers": ["// ===AHD-LOGIC:BEGIN===", "// ===AHD-LOGIC:END==="] },
    "parity": { "path": "project/ahd-app/engine.js", "generatedBy": "build-engine.cjs", "proof": "app/engine-parity.cjs" }
  },
  "features": [
    {
      "name": "create",
      "featureFile": "project/ahd-app/features/create.js",
      "screenFile": "project/ahd-app/screens/create.js",
      "testFiles": ["app/create.test.cjs"],
      "description": "Create-عهد flow with riba linter"
    },
    {
      "name": "riba-lint",
      "featureFile": "project/ahd-app/features/riba-lint.js",
      "screenFile": null,
      "testFiles": ["app/riba-lint.test.cjs", "app/riba-lint-corpus.test.cjs"],
      "description": "Deepened riba linter (additive over golden ribaScan)"
    }
  ],
  "goldenFunctions": ["sha256", "canonical", "sealBlock", "recomputeSeal", "verifyRecord", "netting", "fmt", "respread"],
  "harness": {
    "corePath": "10_Deep/Hardening/test-harness/",
    "appPath": "10_Deep/Hardening/test-harness/app/",
    "suites": { "runTests": 135, "offlineCheck": 9, "domSmoke": 40, "app": 29 }
  }
}
```

### Tools

#### `find_by_intent(query: string)`
Natural-language file finder. Maintains a static map of ~60 keyword → path entries covering every feature, screen, test, doc, and decision. Returns matches sorted by relevance.

Example:
- "riba linter" → `features/riba-lint.js` (additive riba linter), `engine.js` (golden ribaScan), `screens/create.js` (uses it)
- "muqassa screen" → `features/settlement.js`, `screens/settlement.js`
- "golden functions" → `ahd-demo/index.html` (AHD-LOGIC section), `engine.js` (parity copy)

#### `get_architecture()`
Returns the project-map.json `builds` + `layers` + `engineInfo` as structured data.

#### `get_conventions()`
Returns CLAUDE.md spine rules, determinism rules, test conventions as structured data.

#### `get_feature_graph()`
Returns `features[]` with their dependencies (which feature uses which other feature, which golden functions).

#### `get_file_role(path: string)`
Returns the role of any project file — what it does, what it depends on, whether it's golden/touch-restricted.

#### `find_tests_for(path: string)`
Cross-references the feature map to find test files covering a given source file.

## Server B: `ahd-knowledge`

### Purpose
Answer "what's the status of D-3?", "what's the last handoff?", "what are the open threads?" — surface project documentation as structured data.

### Tools

#### `get_decisions(topic?: string)`
Parses `DECISIONS-FOR-MARWAN.md` into structured entries (ID, title, context, status, options, recommendation). Filters by optional topic string.

#### `get_open_threads(priority?: string)`
Parses `10_Deep/Ledger/open-threads.md` for OT-ID entries. Returns array of {id, title, priority, status, description}.

#### `get_project_status()`
Cross-references `10_Deep/STATUS.md` + latest test run results + tripwire check + current branch. Returns a project health snapshot.

#### `get_handoffs(n?: number)`
Reads handoff files from `handoffs/` (numbered), returns the most recent N in structured format.

#### `query_knowledge(query: string)`
Full-text search across all project `.md` files (excluding node_modules). Uses basic keyword matching + filename scoring.

#### `get_specs(area?: string)`
Lists specs/plans from `docs/superpowers/specs/` and `docs/superpowers/plans/`. Filters by optional area substring.

## Server C: `ahd-fs`

### Purpose
Git-aware filesystem navigation that understands what's worth searching and what's noise.

### Tools

#### `project_glob(pattern: string)`
Wrapper around `tinyglobby` (already in node_modules via `claudecodeui`) with auto-excluded paths: `node_modules`, `.git`, `claims/`, `dist/`, `*.token`, `_overnight/backup/` (tripwire backup). Returns relative paths.

#### `git_log(path?: string, n?: number)`
Returns `git log --oneline -n{n}` for the project or a specific file.

#### `git_diff(a?: string, b?: string)`
Returns `git diff {a}..{b}` (defaults: working tree vs HEAD).

#### `git_blame(path: string)`
Returns annotated file with commit info per line (wraps `git blame --porcelain`).

#### `check_integrity()`
Verifies `project/ahd-demo/index.html` SHA-256 matches the tripwire `e2f48467…be40`, plus `git status --short`.

#### `find_coverage_gaps()`
Cross-references source files under `project/ahd-app/features/` and `project/ahd-app/screens/` against test files under `10_Deep/Hardening/test-harness/app/`. Reports files with no corresponding test.

## Error handling

All tools follow a uniform error contract:
- Unknown input → empty result, not a crash
- Missing file → clear error message with path
- Invalid args → validation error listing expected shape
- Never throw — all errors returned as structured `{error: string}` objects

## Testing

Each server is tested in isolation:
- **Unit tests**: each pure function in isolation (parsing, searching, mapping)
- **Tool tests**: register the server, call each tool, verify response shape + content
- **Integration**: launch all three servers via stdio, verify `listTools` + tool calls across all three

Tests follow the project pattern: `.test.cjs` files under each package's `tests/` directory, run via `node`.

## MCP Configuration

For Claude Code (`claude.json` or env):
```json
{
  "mcpServers": {
    "ahd-navigator": {
      "command": "npx",
      "args": ["tsx", "project/mcp/packages/ahd-navigator/src/index.ts"],
      "env": { "AHD_PROJECT_ROOT": "${workspaceFolder}" }
    },
    "ahd-knowledge": {
      "command": "npx",
      "args": ["tsx", "project/mcp/packages/ahd-knowledge/src/index.ts"],
      "env": { "AHD_PROJECT_ROOT": "${workspaceFolder}" }
    },
    "ahd-fs": {
      "command": "npx",
      "args": ["tsx", "project/mcp/packages/ahd-fs/src/index.ts"],
      "env": { "AHD_PROJECT_ROOT": "${workspaceFolder}" }
    }
  }
}
```

## Out of scope (explicitly not building)
- No HTTP transport (stdio only — local agent use)
- No AI/LLM calls inside the servers (pure code + data)
- No external API integrations
- No database or index server (flat file-based)
- No auto-rebuilding of the project map (manual `npm run generate-map`)
