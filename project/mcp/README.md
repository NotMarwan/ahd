# Ahd MCP Servers

Three independent Model Context Protocol servers for AI agents working on the Ahd project.

## Servers

| Server | Tools | Purpose |
|--------|-------|---------|
| `ahd-navigator` | 6 | Codebase navigation: find files by intent, architecture overview, conventions, feature graph, file roles, test coverage lookup |
| `ahd-knowledge` | 6 | Project knowledge: decisions (D-N), open threads, status, handoffs, full-text search, specs/plans |
| `ahd-fs` | 5 | Filesystem tools: project-aware glob, git log/diff, integrity check, coverage gaps |

## Quick start

```bash
cd project/mcp
npm install
npm run generate-map   # creates project-map.json for navigator
npm run build          # compile all three (optional — tsx works without)
```

## Testing

```bash
# Per-server
npx tsx packages/ahd-navigator/src/__tests__/navigator.test.ts
npx tsx packages/ahd-knowledge/src/__tests__/knowledge.test.ts
npx tsx packages/ahd-fs/src/__tests__/fs.test.ts

# Integration (all three via stdio)
npx tsx __tests__/integration.test.ts
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
