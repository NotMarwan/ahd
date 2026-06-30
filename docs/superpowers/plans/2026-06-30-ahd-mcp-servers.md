# Ahd MCP Servers — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three focused MCP servers under `project/mcp/` — codebase navigator, knowledge base, and git-aware filesystem — that give AI agents structured access to the Ahd project.

**Architecture:** npm workspace with three independent TypeScript packages, each an MCP server over stdio transport using `@modelcontextprotocol/sdk`. No HTTP, no database, no external APIs. Deterministic, pure-function core.

**Tech Stack:** TypeScript, Node.js v24, `@modelcontextprotocol/sdk`, `tsx` (dev runner), `tinyglobby` (already in project deps).

---

### Task 1: Workspace scaffold

**Files:**
- Create: `project/mcp/package.json`
- Create: `project/mcp/tsconfig.base.json`
- Create: `project/mcp/.gitignore`
- Create: `project/mcp/packages/ahd-navigator/package.json`
- Create: `project/mcp/packages/ahd-navigator/tsconfig.json`
- Create: `project/mcp/packages/ahd-knowledge/package.json`
- Create: `project/mcp/packages/ahd-knowledge/tsconfig.json`
- Create: `project/mcp/packages/ahd-fs/package.json`
- Create: `project/mcp/packages/ahd-fs/tsconfig.json`

- [ ] **Step 1: Create root workspace package.json**

```json
{
  "name": "ahd-mcp-workspace",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "generate-map": "tsx packages/ahd-navigator/scripts/generate-map.ts"
  },
  "devDependencies": {
    "@modelcontextprotocol/sdk": "^1.16.0",
    "typescript": "^5.6.0",
    "tsx": "^4.0.0",
    "@types/node": "^24.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
dist/
```

- [ ] **Step 4: Create navigator package.json**

```json
{
  "name": "ahd-navigator",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "bin": "./dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.16.0"
  }
}
```

- [ ] **Step 5: Create navigator tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 6: Create knowledge package.json** (same pattern, name `ahd-knowledge`)

- [ ] **Step 7: Create knowledge tsconfig.json** (same pattern as Step 5)

- [ ] **Step 8: Create fs package.json** (same pattern, name `ahd-fs`)

- [ ] **Step 9: Create fs tsconfig.json** (same pattern as Step 5)

- [ ] **Step 10: Install workspace dependencies**

```bash
cd project/mcp
npm install
```

Expected: Workspace installs `@modelcontextprotocol/sdk`, `typescript`, `tsx`, `@types/node` at root `node_modules/`, symlinks each package.

- [ ] **Step 11: Commit**

---

### Task 2: Project-map generator script + manifest

**Files:**
- Create: `project/mcp/packages/ahd-navigator/scripts/generate-map.ts`

- [ ] **Step 1: Write the failing test**

The test should verify the generator produces a valid manifest with expected top-level keys.

```typescript
import { test } from 'node:test';
import assert from 'node:assert';

// We'll test the generated JSON directly
import manifest from '../src/project-map.json' assert { type: 'json' };

test('project-map has required top-level keys', () => {
  assert.ok(manifest.builds);
  assert.ok(manifest.layers);
  assert.ok(manifest.engineInfo);
  assert.ok(manifest.features);
  assert.ok(manifest.goldenFunctions);
  assert.ok(manifest.harness);
});

test('builds include ahd-demo with tripwire', () => {
  const demo = manifest.builds.find((b: any) => b.name === 'ahd-demo');
  assert.ok(demo);
  assert.match(demo.tripwire, /^[a-f0-9]{64}$/);
});

test('engineInfo has golden and parity paths', () => {
  assert.ok(manifest.engineInfo.golden.path);
  assert.ok(manifest.engineInfo.parity.path);
});

test('features is a non-empty array with required fields', () => {
  assert.ok(manifest.features.length > 5);
  for (const feat of manifest.features) {
    assert.ok(feat.name);
    assert.ok(feat.featureFile || feat.description);
  }
});

test('goldenFunctions lists all 8 pinned functions', () => {
  const expected = ['sha256', 'canonical', 'sealBlock', 'recomputeSeal', 'verifyRecord', 'netting', 'fmt', 'respread'];
  for (const fn of expected) {
    assert.ok(manifest.goldenFunctions.includes(fn), `missing ${fn}`);
  }
});

test('harness has expected suite counts', () => {
  assert.ok(manifest.harness.runTests >= 135);
  assert.equal(manifest.harness.offlineCheck, 9);
  assert.equal(manifest.harness.domSmoke, 40);
  assert.ok(manifest.harness.app >= 29);
});
```

- [ ] **Step 2: Verify test fails** — project-map.json doesn't exist yet, so the import will throw.

- [ ] **Step 3: Write generate-map.ts script**

The script walks the project structure and produces the JSON manifest. It lives under `scripts/` and is invoked via `npm run generate-map` from the workspace root.

```typescript
import { writeFileSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');
const OUTPUT = join(import.meta.dirname, '../src/project-map.json');

function sha256Of(p: string): string {
  if (!existsSync(p)) return '';
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}

const manifest: Record<string, unknown> = {
  builds: [
    {
      name: 'ahd-demo',
      path: 'project/ahd-demo/index.html',
      type: 'frozen-presenter',
      tripwire: sha256Of(join(PROJECT_ROOT, 'project/ahd-demo/index.html')),
    },
    {
      name: 'ahd-app',
      path: 'project/ahd-app/',
      type: 'publishable-product',
      serveCmd: 'node project/ahd-app/_serve-app.cjs',
    },
    {
      name: 'ahd-promo',
      path: 'project/ahd-promo/',
      type: 'remotion-video',
    },
  ],
  layers: [
    { name: 'legal-shariah-regulatory', path: '08_Ahd_Deep/Agent-1/', description: 'Legal/Shariah foundations' },
    { name: 'growth-adoption', path: '08_Ahd_Deep/Agent-2/', description: 'KSA market + adoption strategy' },
    { name: 'product-demo', path: '08_Ahd_Deep/Agent-3/', description: 'Product spec + demo narrative' },
    { name: 'circle', path: '08_Ahd_Deep/Agent-4/', description: 'Circle (group lending) spec' },
  ],
  engineInfo: {
    golden: {
      path: 'project/ahd-demo/index.html',
      markers: ['// ===AHD-LOGIC:BEGIN===', '// ===AHD-LOGIC:END==='],
    },
    parity: {
      path: 'project/ahd-app/engine.js',
      generatedBy: 'build-engine.cjs',
      proof: 'app/engine-parity.cjs',
    },
  },
  goldenFunctions: ['sha256', 'canonical', 'sealBlock', 'recomputeSeal', 'verifyRecord', 'netting', 'fmt', 'respread'],
  harness: {
    corePath: '10_Deep/Hardening/test-harness/',
    appPath: '10_Deep/Hardening/test-harness/app/',
    suites: { runTests: 135, offlineCheck: 9, domSmoke: 40, app: 29 },
  },
};

const featuresDir = join(PROJECT_ROOT, 'project/ahd-app/features');
const screensDir = join(PROJECT_ROOT, 'project/ahd-app/screens');
const testsDir = join(PROJECT_ROOT, '10_Deep/Hardening/test-harness/app');

const features: Array<Record<string, unknown>> = [
  {
    name: 'create', featureFile: 'project/ahd-app/features/create.js', screenFile: 'project/ahd-app/screens/create.js',
    testFiles: ['app/create.test.cjs'], description: 'Create-عهد flow with riba linter',
  },
  {
    name: 'riba-lint', featureFile: 'project/ahd-app/features/riba-lint.js', screenFile: null,
    testFiles: ['app/riba-lint.test.cjs', 'app/riba-lint-corpus.test.cjs'], description: 'Deepened riba linter (additive over golden)',
  },
  {
    name: 'settlement', featureFile: 'project/ahd-app/features/settlement.js', screenFile: 'project/ahd-app/screens/settlement.js',
    testFiles: ['app/settlement.test.cjs', 'app/settlement-conserve.test.cjs'], description: 'Muqassa netting + conservation proof',
  },
  {
    name: 'daftari', featureFile: 'project/ahd-app/features/daftari.js', screenFile: 'project/ahd-app/screens/daftari.js',
    testFiles: ['app/daftari.test.cjs', 'app/daftari-hub.test.cjs'], description: 'Creditor home ledger + hub',
  },
  {
    name: 'open-loan', featureFile: 'project/ahd-app/features/open-loan.js', screenFile: 'project/ahd-app/screens/open-loan.js',
    testFiles: ['app/open-loan.test.cjs', 'app/open-loan-progress.test.cjs'], description: 'Open-term qard hasan',
  },
  {
    name: 'circle', featureFile: 'project/ahd-app/features/circle.js', screenFile: 'project/ahd-app/screens/circle.js',
    testFiles: ['app/circle.test.cjs', 'app/circle-reminder.test.cjs'], description: 'Circle treasurer dashboard + group reminder',
  },
  {
    name: 'circle-adv', featureFile: 'project/ahd-app/features/circle-adv.js', screenFile: 'project/ahd-app/screens/circle-adv.js',
    testFiles: ['app/circle-adv.test.cjs', 'app/circle-adv-split.test.cjs'], description: 'Advanced circle (splits, recurring, graduation)',
  },
  {
    name: 'timeline', featureFile: null, screenFile: 'project/ahd-app/screens/timeline.js',
    testFiles: ['app/timeline.test.cjs', 'app/timeline-connect.test.cjs'], description: 'Witness timeline (سِجلّ الشهادة)',
  },
  {
    name: 'proof', featureFile: null, screenFile: 'project/ahd-app/screens/proof.js',
    testFiles: ['app/proof.test.cjs', 'app/proof-provenance.test.cjs'], description: 'Proof-pack / evidence export',
  },
  {
    name: 'dispute', featureFile: null, screenFile: 'project/ahd-app/screens/dispute.js',
    testFiles: ['app/dispute.test.cjs'], description: 'Dispute pause (محلّ خلاف)',
  },
  {
    name: 'request', featureFile: 'project/ahd-app/features/request.js', screenFile: 'project/ahd-app/screens/request.js',
    testFiles: ['app/request.test.cjs'], description: 'Borrower-initiated request (اطلب عهدًا)',
  },
  {
    name: 'settings', featureFile: null, screenFile: 'project/ahd-app/screens/settings.js',
    testFiles: ['app/settings.test.cjs', 'app/settings-deepen.test.cjs'], description: 'Settings + privacy + digit toggle',
  },
  {
    name: 'home', featureFile: null, screenFile: 'project/ahd-app/screens/home.js',
    testFiles: [], description: 'Home front door',
  },
];

// Auto-discover feature files not in the static list
const known = new Set(features.map(f => f.featureFile).filter(Boolean));
for (const entry of readdirSync(featuresDir, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.js')) {
    const rel = `project/ahd-app/features/${entry.name}`;
    if (!known.has(rel)) {
      features.push({ name: entry.name.replace(/\.js$/, ''), featureFile: rel, screenFile: null, testFiles: [], description: '' });
    }
  }
}

manifest.features = features;
writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(`project-map.json written to ${OUTPUT}`);
```

- [ ] **Step 4: Run the generator**
```bash
cd project/mcp
npm run generate-map
```
Expected: `src/project-map.json` created with valid content.

- [ ] **Step 5: Run the test to verify it passes**
```bash
cd project/mcp/packages/ahd-navigator
npx tsx src/__tests__/project-map.test.ts
```
Expected: all assertions pass.

- [ ] **Step 6: Commit**

---

### Task 3: `ahd-navigator` — server entry + all tools

**Files:**
- Create: `project/mcp/packages/ahd-navigator/src/index.ts`
- Create: `project/mcp/packages/ahd-navigator/src/intent-finder.ts`
- Create: `project/mcp/packages/ahd-navigator/src/architecture.ts`
- Create: `project/mcp/packages/ahd-navigator/src/conventions.ts`
- Create: `project/mcp/packages/ahd-navigator/src/features.ts`
- Create: `project/mcp/packages/ahd-navigator/src/__tests__/navigator.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

describe('ahd-navigator', () => {
  let server: Server;

  before(() => {
    // Import and init triggers tool registration
    server = new Server({ name: 'ahd-navigator', version: '0.1.0' });
  });

  test('server exposes ahd-navigator name', () => {
    const info = server.getServerVersion();
    assert.equal(info.name, 'ahd-navigator');
  });

  test('find_by_intent matches "riba linter" to riba-lint.js', async () => {
    const { default: app } = await import('../index.js');
    const result = await app.handleToolCall('find_by_intent', { query: 'riba linter' });
    const content = JSON.parse(result.content[0].text);
    assert.ok(content.results.length >= 2);
    assert.ok(content.results.some((r: any) => r.path.includes('riba-lint')));
  });

  test('get_architecture returns both builds', async () => {
    const { default: app } = await import('../index.js');
    const result = await app.handleToolCall('get_architecture', {});
    const content = JSON.parse(result.content[0].text);
    assert.ok(content.builds.length >= 2);
    assert.ok(content.builds.some((b: any) => b.name === 'ahd-demo'));
    assert.ok(content.builds.some((b: any) => b.name === 'ahd-app'));
  });

  test('get_conventions returns spine rules', async () => {
    const { default: app } = await import('../index.js');
    const result = await app.handleToolCall('get_conventions', {});
    const content = JSON.parse(result.content[0].text);
    assert.ok(content.spine);
    assert.ok(content.spine.length >= 4);
  });

  test('get_feature_graph returns all features', async () => {
    const { default: app } = await import('../index.js');
    const result = await app.handleToolCall('get_feature_graph', {});
    const content = JSON.parse(result.content[0].text);
    assert.ok(content.features.length >= 10);
    assert.ok(content.features.some((f: any) => f.name === 'riba-lint'));
  });

  test('get_file_role returns role for a known file', async () => {
    const { default: app } = await import('../index.js');
    const result = await app.handleToolCall('get_file_role', { path: 'project/ahd-app/features/riba-lint.js' });
    const content = JSON.parse(result.content[0].text);
    assert.ok(content.role);
    assert.ok(content.role.includes('riba'));
  });

  test('find_tests_for finds tests for a known file', async () => {
    const { default: app } = await import('../index.js');
    const result = await app.handleToolCall('find_tests_for', { path: 'project/ahd-app/features/riba-lint.js' });
    const content = JSON.parse(result.content[0].text);
    assert.ok(content.tests.length >= 1);
  });

  test('unknown intent returns empty results (no crash)', async () => {
    const { default: app } = await import('../index.js');
    const result = await app.handleToolCall('find_by_intent', { query: 'zzznotexist' });
    const content = JSON.parse(result.content[0].text);
    assert.equal(content.results.length, 0);
  });
});
```

- [ ] **Step 2: Verify test fails** — module doesn't exist yet.

- [ ] **Step 3: Write intent-finder.ts**

```typescript
import manifest from './project-map.json' assert { type: 'json' };

type IntentMap = Record<string, Array<{ path: string; description: string }>>;

const intentMap: IntentMap = {
  'riba linter': [
    { path: 'project/ahd-app/features/riba-lint.js', description: 'Additive riba linter (deepened)' },
    { path: 'project/ahd-demo/index.html', description: 'Golden ribaScan (4 rules, AHD-LOGIC)' },
    { path: 'project/ahd-app/engine.js', description: 'Parity-engine ribaScan' },
    { path: 'project/ahd-app/screens/create.js', description: 'Create screen (uses riba linter)' },
  ],
  'settlement muqassa': [
    { path: 'project/ahd-app/features/settlement.js', description: 'Muqassa settlement logic' },
    { path: 'project/ahd-app/screens/settlement.js', description: 'Muqassa settlement screen' },
  ],
  'golden functions': [
    { path: 'project/ahd-demo/index.html', description: 'Golden functions (AHD-LOGIC section)' },
    { path: 'project/ahd-app/engine.js', description: 'Parity-engine copy of golden functions' },
  ],
  'decisions marwan': [
    { path: 'DECISIONS-FOR-MARWAN.md', description: 'Open decisions for Marwan' },
  ],
  'test harness': [
    { path: '10_Deep/Hardening/test-harness/', description: 'Core test harness' },
    { path: '10_Deep/Hardening/test-harness/app/', description: 'App test suites' },
  ],
  'handoff': [
    { path: 'handoffs/', description: 'Agent handoff logs' },
  ],
  'status': [
    { path: '10_Deep/STATUS.md', description: 'Deep-track status log' },
    { path: 'OVERNIGHT-LOG.md', description: 'Overnight deepening log' },
  ],
};

export function findByIntent(query: string): { results: Array<{ path: string; description: string }> } {
  const q = query.toLowerCase();
  const results: Array<{ path: string; description: string }> = [];
  for (const [key, entries] of Object.entries(intentMap)) {
    if (key.includes(q) || q.split(' ').some((w: string) => key.includes(w))) {
      results.push(...entries);
    }
  }
  return { results };
}
```

- [ ] **Step 4: Write architecture.ts**

```typescript
import manifest from './project-map.json' assert { type: 'json' };

export function getArchitecture() {
  return {
    builds: manifest.builds,
    layers: manifest.layers,
    engineInfo: manifest.engineInfo,
  };
}
```

- [ ] **Step 5: Write conventions.ts**

```typescript
export function getConventions() {
  return {
    spine: [
      'Bank witnesses/seals/settles; does NOT lend, judge, charge on the loan, or score',
      'No riba / penalty / maysir / gharar',
      'Integer halalas (1 SAR = 100), never float money',
      'Trust signal is a qualitative own-history band, never a number, never exported, never underwrites',
      'AI issues no fatwa — cite scholars/standards/verses; flag Shariah questions, do not rule',
    ],
    determinism: [
      'No Date.now / new Date / Math.random / Intl / .toLocaleString in logic',
      'Fixed AS_OF for all computations',
      'Golden functions never modified internally',
      'Pure functions separated from DOM',
    ],
    testing: [
      'Tests live in 10_Deep/Hardening/test-harness/app/',
      'Named *.test.cjs / *-parity.cjs / *-smoke.cjs for auto-discovery',
      'TDD: write failing test first',
      'Harness is the gate — keep it green, never weaken an assertion',
    ],
    goldenFunctions: ['sha256', 'canonical', 'sealBlock', 'recomputeSeal', 'verifyRecord', 'netting', 'fmt', 'respread'],
  };
}
```

- [ ] **Step 6: Write features.ts**

```typescript
import manifest from './project-map.json' assert { type: 'json' };

export function getFeatureGraph() {
  return { features: manifest.features };
}

export function getFileRole(path: string): { role: string; isGolden: boolean; isParity: boolean } {
  const normalized = path.replace(/\\/g, '/');
  const isGolden = manifest.builds.some((b: any) => b.name === 'ahd-demo' && normalized.includes(b.path));
  const isParity = normalized.includes('engine.js') || normalized.includes('build-engine.cjs');
  const feature = manifest.features.find((f: any) =>
    normalized === (f.featureFile || '') || normalized === (f.screenFile || '')
  );
  return {
    role: feature?.description || (isGolden ? 'Golden pinned function' : isParity ? 'Parity copy of golden engine' : 'Project file'),
    isGolden,
    isParity,
  };
}

export function findTestsFor(path: string): { tests: string[] } {
  const normalized = path.replace(/\\/g, '/');
  const feature = manifest.features.find((f: any) =>
    normalized === (f.featureFile || '') || normalized === (f.screenFile || '')
  );
  if (feature?.testFiles) {
    return { tests: feature.testFiles.map((t: string) => `10_Deep/Hardening/test-harness/${t}`) };
  }
  return { tests: [] };
}
```

- [ ] **Step 7: Write server index.ts**

```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { findByIntent } from './intent-finder.js';
import { getArchitecture } from './architecture.js';
import { getConventions } from './conventions.js';
import { getFeatureGraph, getFileRole, findTestsFor } from './features.js';

const server = new Server(
  { name: 'ahd-navigator', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: 'find_by_intent', description: 'Find files by natural language description', inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'What are you looking for?' } }, required: ['query'] } },
    { name: 'get_architecture', description: 'Project architecture overview (builds, layers, engine)', inputSchema: { type: 'object', properties: {} } },
    { name: 'get_conventions', description: 'Project conventions (spine, determinism, testing)', inputSchema: { type: 'object', properties: {} } },
    { name: 'get_feature_graph', description: 'All features with file locations and dependencies', inputSchema: { type: 'object', properties: {} } },
    { name: 'get_file_role', description: 'What a file does in the project', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
    { name: 'find_tests_for', description: 'Find test files covering a given source file', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  try {
    let result: unknown;
    switch (name) {
      case 'find_by_intent': result = findByIntent(args.query as string); break;
      case 'get_architecture': result = getArchitecture(); break;
      case 'get_conventions': result = getConventions(); break;
      case 'get_feature_graph': result = getFeatureGraph(); break;
      case 'get_file_role': result = getFileRole(args.path as string); break;
      case 'find_tests_for': result = findTestsFor(args.path as string); break;
      default: throw new Error(`Unknown tool: ${name}`);
    }
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: (e as Error).message }) }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

- [ ] **Step 8: Run tests**
```bash
cd project/mcp/packages/ahd-navigator
npx tsx src/__tests__/navigator.test.ts
```
Expected: all 7 tests pass.

- [ ] **Step 9: Commit**

---

### Task 4: `ahd-knowledge` — server + all tools

**Files:**
- Create: `project/mcp/packages/ahd-knowledge/src/index.ts`
- Create: `project/mcp/packages/ahd-knowledge/src/decisions.ts`
- Create: `project/mcp/packages/ahd-knowledge/src/status.ts`
- Create: `project/mcp/packages/ahd-knowledge/src/handoffs.ts`
- Create: `project/mcp/packages/ahd-knowledge/src/specs.ts`
- Create: `project/mcp/packages/ahd-knowledge/src/__tests__/knowledge.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('ahd-knowledge', () => {
  test('get_decisions returns decision entries', async () => {
    const { getDecisions } = await import('../decisions.js');
    const result = await getDecisions();
    assert.ok(result.decisions.length >= 4);
    const d3 = result.decisions.find((d: any) => d.id === 'D-3');
    assert.ok(d3);
    assert.ok(d3.title.includes('Mode-B'));
  });

  test('get_decisions filters by topic', async () => {
    const { getDecisions } = await import('../decisions.js');
    const result = await getDecisions('riba');
    assert.ok(result.decisions.length >= 1);
    assert.ok(result.decisions.some((d: any) => d.id === 'D-5'));
  });

  test('get_open_threads returns threads', async () => {
    const { getOpenThreads } = await import('../status.js');
    const result = await getOpenThreads();
    assert.ok(result.threads.length >= 3);
  });

  test('get_project_status returns status object', async () => {
    const { getProjectStatus } = await import('../status.js');
    const result = await getProjectStatus();
    assert.ok(result.branch);
    assert.ok(result.testCounts);
  });

  test('get_handoffs returns latest handoffs', async () => {
    const { getHandoffs } = await import('../handoffs.js');
    const result = await getHandoffs(2);
    assert.ok(result.handoffs.length <= 2);
    if (result.handoffs.length > 0) {
      assert.ok(result.handoffs[0].id);
    }
  });

  test('query_knowledge finds text in markdown files', async () => {
    const { queryKnowledge } = await import('../status.js');
    const result = await queryKnowledge('riba linter');
    assert.ok(result.results.length >= 1);
  });

  test('get_specs returns specs list', async () => {
    const { getSpecs } = await import('../specs.js');
    const result = await getSpecs();
    assert.ok(result.specs.length >= 1);
  });

  test('unknown topic returns empty decisions (no crash)', async () => {
    const { getDecisions } = await import('../decisions.js');
    const result = await getDecisions('zzznotexist');
    assert.equal(result.decisions.length, 0);
  });
});
```

- [ ] **Step 2: Verify test fails** — modules don't exist yet.

- [ ] **Step 3: Write decisions.ts**

Parses `DECISIONS-FOR-MARWAN.md` into structured entries using regex:

```typescript
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');

interface Decision {
  id: string;
  title: string;
  context: string;
  status: string;
}

export function getDecisions(topic?: string): { decisions: Decision[] } {
  const content = readFileSync(join(PROJECT_ROOT, 'DECISIONS-FOR-MARWAN.md'), 'utf-8');
  const decisions: Decision[] = [];
  // Match D-N patterns: "### D-N · Title"
  const regex = /### (D-\d+) · (.+?)(?:\n|$)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const title = match[2];
    // Extract context: text after Title up to next ### or end
    const start = match.index + match[0].length;
    const end = content.indexOf('\n### ', start);
    const section = content.slice(start, end > 0 ? end : undefined).trim();
    const context = section.slice(0, 300).replace(/\n+/g, ' ').trim();
    // Determine status
    let status = 'open';
    if (section.includes('ADDRESSED') || section.includes('resolved')) status = 'resolved';
    if (section.includes('DEFERRED')) status = 'deferred';
    const entry: Decision = { id, title, context: context + (context.length >= 300 ? '…' : ''), status };
    if (!topic || id === topic || title.toLowerCase().includes(topic.toLowerCase()) || context.toLowerCase().includes(topic.toLowerCase())) {
      decisions.push(entry);
    }
  }
  return { decisions };
}
```

- [ ] **Step 4: Write status.ts** (open threads + project status + knowledge search)

```typescript
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');

export function getOpenThreads(priority?: string): { threads: Array<{ id: string; title: string; priority: string; status: string }> } {
  const path = join(PROJECT_ROOT, '10_Deep/Ledger/open-threads.md');
  const content = readFileSync(path, 'utf-8');
  const threads: Array<{ id: string; title: string; priority: string; status: string }> = [];
  const regex = /\*\*(OT-\w+)\*\*.*?(?:\n|$)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const line = content.slice(match.index, match.index + 120).replace(/\n/g, ' ').trim();
    const p = line.includes('P0') ? 'P0' : line.includes('P1') ? 'P1' : 'P2';
    if (!priority || p === priority) {
      threads.push({ id, title: line.slice(0, 80), priority: p, status: 'open' });
    }
  }
  return { threads };
}

export function getProjectStatus() {
  try {
    const branch = readFileSync(join(PROJECT_ROOT, '.git/HEAD'), 'utf-8').replace('ref: refs/heads/', '').trim();
    return {
      branch,
      integrity: 'check via ahd-fs check_integrity',
      testCounts: 'see 10_Deep/STATUS.md or run the harness',
    };
  } catch {
    return { branch: 'unknown', integrity: 'unknown', testCounts: 'unknown' };
  }
}

export async function queryKnowledge(query: string): Promise<{ results: Array<{ path: string; snippet: string }> }> {
  const q = query.toLowerCase();
  const results: Array<{ path: string; snippet: string }> = [];
  const mdFiles: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') walk(full);
      else if (entry.isFile() && entry.name.endsWith('.md')) mdFiles.push(full);
    }
  }
  walk(PROJECT_ROOT);

  for (const file of mdFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(q)) {
        const rel = relative(PROJECT_ROOT, file).replace(/\\/g, '/');
        results.push({ path: rel, snippet: lines[i].trim().slice(0, 120) });
        if (results.length >= 20) break;
      }
    }
    if (results.length >= 20) break;
  }
  return { results };
}
```

- [ ] **Step 5: Write handoffs.ts**

```typescript
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');

export function getHandoffs(n: number = 1): { handoffs: Array<{ id: string; summary: string }> } {
  const dir = join(PROJECT_ROOT, 'handoffs');
  const files = readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .slice(0, n);
  const handoffs = files.map(file => {
    const content = readFileSync(join(dir, file), 'utf-8');
    const firstLine = content.split('\n')[0]?.replace(/^#\s*/, '').trim() || file;
    return { id: file.replace(/\.md$/, ''), summary: firstLine.slice(0, 120) };
  });
  return { handoffs };
}
```

- [ ] **Step 6: Write specs.ts**

```typescript
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');

export function getSpecs(area?: string): { specs: Array<{ name: string; path: string; type: string }> } {
  const specs: Array<{ name: string; path: string; type: string }> = [];
  const dirs = ['docs/superpowers/specs', 'docs/superpowers/plans'];
  for (const d of dirs) {
    const full = join(PROJECT_ROOT, d);
    try {
      for (const entry of readdirSync(full)) {
        if (!area || entry.toLowerCase().includes(area.toLowerCase())) {
          specs.push({ name: entry.replace(/\.md$/, ''), path: `${d}/${entry}`, type: d.includes('specs') ? 'spec' : 'plan' });
        }
      }
    } catch { /* dir may not exist */ }
  }
  return { specs };
}
```

- [ ] **Step 7: Write server index.ts** (same pattern as ahd-navigator, registering knowledge tools)

```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getDecisions } from './decisions.js';
import { getOpenThreads, getProjectStatus, queryKnowledge } from './status.js';
import { getHandoffs } from './handoffs.js';
import { getSpecs } from './specs.js';

const server = new Server(
  { name: 'ahd-knowledge', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: 'get_decisions', description: 'Open decisions for Marwan, optionally filtered by topic', inputSchema: { type: 'object', properties: { topic: { type: 'string' } } } },
    { name: 'get_open_threads', description: 'Open threads from the Ledger', inputSchema: { type: 'object', properties: { priority: { type: 'string', enum: ['P0', 'P1', 'P2'] } } } },
    { name: 'get_project_status', description: 'Project health snapshot (branch, integrity, test counts)', inputSchema: { type: 'object', properties: {} } },
    { name: 'get_handoffs', description: 'Most recent agent handoffs', inputSchema: { type: 'object', properties: { n: { type: 'number' } } } },
    { name: 'query_knowledge', description: 'Full-text search across project markdown', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
    { name: 'get_specs', description: 'List specs and plans', inputSchema: { type: 'object', properties: { area: { type: 'string' } } } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  try {
    let result: unknown;
    switch (name) {
      case 'get_decisions': result = getDecisions(args.topic as string); break;
      case 'get_open_threads': result = getOpenThreads(args.priority as string); break;
      case 'get_project_status': result = getProjectStatus(); break;
      case 'get_handoffs': result = getHandoffs(args.n as number); break;
      case 'query_knowledge': result = await queryKnowledge(args.query as string); break;
      case 'get_specs': result = getSpecs(args.area as string); break;
      default: throw new Error(`Unknown tool: ${name}`);
    }
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: (e as Error).message }) }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

- [ ] **Step 8: Run tests**
```bash
cd project/mcp/packages/ahd-knowledge
npx tsx src/__tests__/knowledge.test.ts
```
Expected: all 8 tests pass.

- [ ] **Step 9: Commit**

---

### Task 5: `ahd-fs` — server + all tools

**Files:**
- Create: `project/mcp/packages/ahd-fs/src/index.ts`
- Create: `project/mcp/packages/ahd-fs/src/globber.ts`
- Create: `project/mcp/packages/ahd-fs/src/git.ts`
- Create: `project/mcp/packages/ahd-fs/src/integrity.ts`
- Create: `project/mcp/packages/ahd-fs/src/__tests__/fs.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('ahd-fs', () => {
  test('project_glob finds .md files in project', async () => {
    const { projectGlob } = await import('../globber.js');
    const result = await projectGlob('**/*.md');
    assert.ok(result.files.length >= 5);
    assert.ok(!result.files.some((f: string) => f.includes('node_modules')));
  });

  test('project_glob excludes node_modules', async () => {
    const { projectGlob } = await import('../globber.js');
    const result = await projectGlob('**/package.json');
    assert.ok(!result.files.some((f: string) => f.startsWith('project/mcp/packages') && !f.includes('node_modules')));
  });

  test('git_log returns commits', async () => {
    const { gitLog } = await import('../git.js');
    const result = await gitLog(5);
    assert.ok(result.commits.length <= 5);
    assert.ok(result.commits.length >= 1);
  });

  test('git_log for a specific file', async () => {
    const { gitLog } = await import('../git.js');
    const result = await gitLog(3, 'DECISIONS-FOR-MARWAN.md');
    assert.ok(result.commits.length >= 1);
  });

  test('git_diff returns a diff string', async () => {
    const { gitDiff } = await import('../git.js');
    const result = await gitDiff();
    assert.ok(typeof result.diff === 'string');
  });

  test('check_integrity verifies demo tripwire', async () => {
    const { checkIntegrity } = await import('../integrity.js');
    const result = await checkIntegrity();
    assert.ok(result.tripwireOk === true || result.tripwireOk === false);
    assert.ok(typeof result.gitStatus === 'string');
  });

  test('find_coverage_gaps returns files without tests', async () => {
    const { findCoverageGaps } = await import('../globber.js');
    const result = await findCoverageGaps();
    assert.ok(Array.isArray(result.gaps));
  });
});
```

- [ ] **Step 2: Verify test fails**

- [ ] **Step 3: Write globber.ts**

```typescript
import { glob } from 'tinyglobby';
import { resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');
const EXCLUDE = ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/*.token', '**/node_modules'];

export async function projectGlob(pattern: string): Promise<{ files: string[] }> {
  const files = await glob(pattern, {
    cwd: PROJECT_ROOT,
    ignore: EXCLUDE,
    onlyFiles: true,
  });
  return { files };
}

export async function findCoverageGaps(): Promise<{ gaps: string[] }> {
  const features = await glob('project/ahd-app/features/*.js', { cwd: PROJECT_ROOT });
  const testFiles = await glob('10_Deep/Hardening/test-harness/app/*.test.cjs', { cwd: PROJECT_ROOT });
  const gaps: string[] = [];
  for (const feat of features) {
    const baseName = feat.split('/').pop()!.replace('.js', '');
    const hasTest = testFiles.some(t => t.includes(baseName));
    if (!hasTest) gaps.push(feat);
  }
  return { gaps };
}
```

- [ ] **Step 4: Write git.ts**

```typescript
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');

function git(args: string): string {
  return execSync(`git ${args}`, { cwd: PROJECT_ROOT, encoding: 'utf-8' }).trim();
}

export function gitLog(n: number = 10, path?: string): { commits: Array<{ hash: string; message: string }> } {
  const cmd = `log --oneline -${n}${path ? ` -- "${path}"` : ''}`;
  const output = git(cmd);
  const commits = output.split('\n').filter(Boolean).map(line => {
    const hash = line.slice(0, 7);
    const message = line.slice(8).trim();
    return { hash, message };
  });
  return { commits };
}

export function gitDiff(a?: string, b?: string): { diff: string } {
  const ref = a && b ? `${a}..${b}` : 'HEAD';
  const cmd = `diff ${a || b ? ref : '--cached'}`;
  try {
    const diff = git(cmd);
    return { diff: diff || '(no diff)' };
  } catch {
    return { diff: '(error getting diff)' };
  }
}
```

- [ ] **Step 5: Write integrity.ts**

```typescript
import { readFileSync, execSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');
const EXPECTED = 'e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40';

export function checkIntegrity(): { tripwireOk: boolean; gitStatus: string } {
  try {
    const data = readFileSync(join(PROJECT_ROOT, 'project/ahd-demo/index.html'));
    const hash = createHash('sha256').update(data).digest('hex');
    const tripwireOk = hash === EXPECTED;
    const gitStatus = execSync('git status --short', { cwd: PROJECT_ROOT, encoding: 'utf-8' }).trim();
    return { tripwireOk, gitStatus: gitStatus || '(clean)' };
  } catch (e) {
    return { tripwireOk: false, gitStatus: `Error: ${(e as Error).message}` };
  }
}
```

- [ ] **Step 6: Write server index.ts** (same pattern, registering fs tools)

```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { projectGlob, findCoverageGaps } from './globber.js';
import { gitLog, gitDiff } from './git.js';
import { checkIntegrity } from './integrity.js';

const server = new Server(
  { name: 'ahd-fs', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: 'project_glob', description: 'Glob with project-aware exclusions (no node_modules/.git)', inputSchema: { type: 'object', properties: { pattern: { type: 'string' } }, required: ['pattern'] } },
    { name: 'git_log', description: 'Git log for project or file', inputSchema: { type: 'object', properties: { n: { type: 'number' }, path: { type: 'string' } } } },
    { name: 'git_diff', description: 'Git diff between references', inputSchema: { type: 'object', properties: { a: { type: 'string' }, b: { type: 'string' } } } },
    { name: 'check_integrity', description: 'Verify demo SHA-256 tripwire + git status', inputSchema: { type: 'object', properties: {} } },
    { name: 'find_coverage_gaps', description: 'Source files with no corresponding test', inputSchema: { type: 'object', properties: {} } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  try {
    let result: unknown;
    switch (name) {
      case 'project_glob': result = await projectGlob(args.pattern as string); break;
      case 'git_log': result = gitLog(args.n as number || 10, args.path as string); break;
      case 'git_diff': result = gitDiff(args.a as string, args.b as string); break;
      case 'check_integrity': result = checkIntegrity(); break;
      case 'find_coverage_gaps': result = await findCoverageGaps(); break;
      default: throw new Error(`Unknown tool: ${name}`);
    }
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: (e as Error).message }) }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

- [ ] **Step 7: Run tests**
```bash
cd project/mcp/packages/ahd-fs
npx tsx src/__tests__/fs.test.ts
```
Expected: all tests pass.

- [ ] **Step 8: Commit**

---

### Task 6: Integration smoke test

- [ ] **Step 1: Write integration test that launches all three servers via stdio**

```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const ROOT = resolve(import.meta.dirname, '../../..');

describe('all three MCP servers respond correctly', () => {
  test('ahd-navigator: listTools returns 6 tools', async () => {
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['tsx', 'packages/ahd-navigator/src/index.ts'],
      workingDir: ROOT,
    });
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const tools = await client.listTools();
    assert.equal(tools.tools.length, 6);
    assert.ok(tools.tools.some((t: any) => t.name === 'find_by_intent'));
    transport.close();
  });

  test('ahd-knowledge: listTools returns 6 tools', async () => {
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['tsx', 'packages/ahd-knowledge/src/index.ts'],
      workingDir: ROOT,
    });
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const tools = await client.listTools();
    assert.equal(tools.tools.length, 6);
    transport.close();
  });

  test('ahd-fs: listTools returns 5 tools', async () => {
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['tsx', 'packages/ahd-fs/src/index.ts'],
      workingDir: ROOT,
    });
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const tools = await client.listTools();
    assert.equal(tools.tools.length, 5);
    transport.close();
  });

  test('ahd-fs: check_integrity returns expected structure', async () => {
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['tsx', 'packages/ahd-fs/src/index.ts'],
      workingDir: ROOT,
    });
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const result = await client.callTool('check_integrity', {});
    const content = JSON.parse(result.content[0].text);
    assert.ok('tripwireOk' in content);
    assert.ok('gitStatus' in content);
    transport.close();
  });
});
```

- [ ] **Step 2: Run integration tests**

```bash
cd project/mcp
npx tsx packages/__tests__/integration.test.ts
```
Expected: all tests pass (3 servers register correct tools, check_integrity returns expected shape).

- [ ] **Step 3: Commit**

---

### Task 7: README + documentation

- [ ] **Step 1: Write project/mcp/README.md**

```markdown
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
npx tsx packages/__tests__/integration.test.ts
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
```

- [ ] **Step 2: Commit**

---

### Task 8: Wiring — update root CLAUDE.md with MCP config

**File:**
- Modify: `CLAUDE.md` (add MCP server config block)

- [ ] **Step 1: Read current CLAUDE.md** to find the right insertion point.

- [ ] **Step 2: Add MCP servers section** near the bottom, before any existing tool configuration.

- [ ] **Step 3: Commit** with message `docs: add MCP server config to CLAUDE.md`
