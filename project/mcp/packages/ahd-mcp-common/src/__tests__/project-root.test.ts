import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECT_ROOT } from '../project-root.js';

test('PROJECT_ROOT resolves to the repo root', () => {
  assert.ok(existsSync(join(PROJECT_ROOT, 'CLAUDE.md')));
  assert.ok(existsSync(join(PROJECT_ROOT, 'demo/index.html')));
  assert.ok(existsSync(join(PROJECT_ROOT, 'project/mcp/package.json')));
});
