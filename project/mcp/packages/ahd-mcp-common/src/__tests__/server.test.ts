import { test, describe } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { buildListToolsHandler, buildCallToolHandler } from '../server.js';
import type { ToolDef } from '../server.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

function textOf(result: CallToolResult): string {
  const first = result.content[0];
  if (!first || first.type !== 'text') {
    throw new Error(`expected a text content block, got: ${JSON.stringify(first)}`);
  }
  return first.text;
}

const tools: ToolDef[] = [
  {
    name: 'echo',
    description: 'Echoes input back',
    schema: { text: z.string().describe('text to echo') },
    handler: (a) => ({ echoed: (a as { text: string }).text }),
  },
  {
    name: 'no_args',
    description: 'Takes no arguments',
    schema: {},
    handler: () => ({ ok: true }),
  },
  {
    name: 'boom',
    description: 'Always throws a plain error',
    schema: {},
    handler: () => {
      throw new Error('boom failed');
    },
  },
  {
    name: 'missing_file',
    description: 'Throws ENOENT reading a nonexistent file',
    schema: {},
    handler: () => {
      readFileSync('/definitely/does/not/exist-ahd-mcp-common-test.txt');
      return {};
    },
  },
];

describe('buildListToolsHandler', () => {
  test('lists every tool with name, description, and a JSON-schema inputSchema', async () => {
    const handler = buildListToolsHandler(tools);
    const result = await handler();
    assert.equal(result.tools.length, tools.length);
    const echo = result.tools.find((t) => t.name === 'echo')!;
    assert.equal(echo.description, 'Echoes input back');
    assert.equal(echo.inputSchema.type, 'object');
    assert.ok((echo.inputSchema.properties as Record<string, unknown>).text);
    assert.ok((echo.inputSchema.required as string[]).includes('text'));

    const noArgs = result.tools.find((t) => t.name === 'no_args')!;
    assert.equal(noArgs.inputSchema.type, 'object');
  });
});

describe('buildCallToolHandler', () => {
  test('dispatches valid input to the matching handler', async () => {
    const handler = buildCallToolHandler(tools);
    const result = await handler({ params: { name: 'echo', arguments: { text: 'hi' } } });
    assert.notEqual(result.isError, true);
    const parsed = JSON.parse(textOf(result));
    assert.equal(parsed.echoed, 'hi');
  });

  test('handles a tool with no arguments', async () => {
    const handler = buildCallToolHandler(tools);
    const result = await handler({ params: { name: 'no_args', arguments: {} } });
    assert.notEqual(result.isError, true);
    const parsed = JSON.parse(textOf(result));
    assert.equal(parsed.ok, true);
  });

  test('rejects wrong input type with an actionable message naming the field', async () => {
    const handler = buildCallToolHandler(tools);
    const result = await handler({ params: { name: 'echo', arguments: { text: 123 } } });
    assert.equal(result.isError, true);
    const parsed = JSON.parse(textOf(result));
    assert.match(parsed.error, /text/);
  });

  test('rejects a missing required field with an actionable message', async () => {
    const handler = buildCallToolHandler(tools);
    const result = await handler({ params: { name: 'echo', arguments: {} } });
    assert.equal(result.isError, true);
    const parsed = JSON.parse(textOf(result));
    assert.match(parsed.error, /text/);
  });

  test('unknown tool name returns an actionable message listing available tools', async () => {
    const handler = buildCallToolHandler(tools);
    const result = await handler({ params: { name: 'does_not_exist', arguments: {} } });
    assert.equal(result.isError, true);
    const parsed = JSON.parse(textOf(result));
    assert.match(parsed.error, /does_not_exist/);
    assert.match(parsed.error, /echo/);
  });

  test('a thrown error from the handler is caught and reported as isError', async () => {
    const handler = buildCallToolHandler(tools);
    const result = await handler({ params: { name: 'boom', arguments: {} } });
    assert.equal(result.isError, true);
    const parsed = JSON.parse(textOf(result));
    assert.match(parsed.error, /boom failed/);
  });

  test('ENOENT errors get an actionable "not found" hint appended', async () => {
    const handler = buildCallToolHandler(tools);
    const result = await handler({ params: { name: 'missing_file', arguments: {} } });
    assert.equal(result.isError, true);
    const parsed = JSON.parse(textOf(result));
    assert.match(parsed.error, /not found/i);
  });
});
