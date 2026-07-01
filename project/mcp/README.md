# Ahd MCP Servers

Three independent Model Context Protocol servers for AI agents working on the Ahd project.

## Servers

| Server | Tools | Purpose |
|--------|-------|---------|
| `ahd-navigator` | 6 | Codebase navigation: find files by intent, architecture overview, conventions, feature graph, file roles, test coverage lookup |
| `ahd-knowledge` | 6 | Project knowledge: decisions (D-N), open threads, status, handoffs, full-text search, specs/plans |
| `ahd-fs` | 5 | Filesystem tools: project-aware glob, git log/diff, integrity check, coverage gaps |

All three are built on an internal shared package, `ahd-mcp-common` (not a server itself): `runMcpServer()` gives every tool Zod-validated input, a uniform JSON response/error shape, and actionable errors (unknown-tool names list the real tools; missing files get a "not found" hint). Each tool declares its input as a Zod shape via `defineTool()`, and the JSON Schema advertised over `tools/list` is generated from that same shape (`z.toJSONSchema`), so the two can't drift apart. Set `DEBUG=1` to see startup/connection logs on stderr (silent by default).

## Quick start

```bash
cd project/mcp
npm install
npm run generate-map   # creates project-map.json for navigator
npm run build          # compile all three (optional — tsx works without)
```

## Testing

```bash
# Shared package
npx tsx packages/ahd-mcp-common/src/__tests__/project-root.test.ts
npx tsx packages/ahd-mcp-common/src/__tests__/debug.test.ts
npx tsx packages/ahd-mcp-common/src/__tests__/server.test.ts

# Per-server
npx tsx packages/ahd-navigator/src/__tests__/navigator.test.ts
npx tsx packages/ahd-navigator/src/__tests__/project-map.test.ts
npx tsx packages/ahd-knowledge/src/__tests__/knowledge.test.ts
npx tsx packages/ahd-fs/src/__tests__/fs.test.ts

# Integration (all three via real stdio, including error-path checks)
npx tsx __tests__/integration.test.ts

# Type-check everything (tsx does not type-check; this does)
npm run build --workspaces --if-present
```

## Adding to Claude Code

Add to your `claude.json` or `CLAUDE.md` MCP config:

```json
{
  "mcpServers": {
    "ahd-navigator": { "command": "npx", "args": ["tsx", "project/mcp/packages/ahd-navigator/src/index.ts"] },
    "ahd-knowledge": { "command": "npx", "args": ["tsx", "project/mcp/packages/ahd-knowledge/src/index.ts"] },
    "ahd-fs": { "command": "npx", "args": ["tsx", "project/mcp/packages/ahd-fs/src/index.ts"] }
  }
}
```

## Project map

`ahd-navigator` uses a static `project-map.json` manifest. Regenerate it when the project structure changes:

```bash
cd project/mcp
npm run generate-map
```

## Design

See `docs/superpowers/specs/2026-06-30-ahd-mcp-servers-design.md`.
