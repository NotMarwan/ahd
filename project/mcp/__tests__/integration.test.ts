import { test, describe } from 'node:test';
import assert from 'node:assert';
import { resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const ROOT = resolve(import.meta.dirname, '..');

function fsTransport() {
  return new StdioClientTransport({
    command: 'node',
    args: ['--import', 'tsx/esm', 'packages/ahd-fs/src/index.ts'],
    cwd: ROOT,
    windowsHide: false,
  });
}

function navTransport() {
  return new StdioClientTransport({
    command: 'node',
    args: ['--import', 'tsx/esm', 'packages/ahd-navigator/src/index.ts'],
    cwd: ROOT,
    windowsHide: false,
  });
}

function knowledgeTransport() {
  return new StdioClientTransport({
    command: 'node',
    args: ['--import', 'tsx/esm', 'packages/ahd-knowledge/src/index.ts'],
    cwd: ROOT,
    windowsHide: false,
  });
}

describe('all three MCP servers respond correctly', () => {
  test('ahd-navigator: listTools returns 6 tools', async () => {
    const transport = navTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const tools = await client.listTools();
    assert.equal(tools.tools.length, 6);
    assert.ok(tools.tools.some((t: any) => t.name === 'find_by_intent'));
    transport.close();
  });

  test('ahd-knowledge: listTools returns 6 tools', async () => {
    const transport = knowledgeTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const tools = await client.listTools();
    assert.equal(tools.tools.length, 6);
    transport.close();
  });

  test('ahd-fs: listTools returns 5 tools', async () => {
    const transport = fsTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const tools = await client.listTools();
    assert.equal(tools.tools.length, 5);
    transport.close();
  });

  test('ahd-fs: check_integrity returns expected structure', async () => {
    const transport = fsTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const result = await client.callTool({ name: 'check_integrity', arguments: {} });
    const content = JSON.parse(result.content[0].text);
    assert.ok('tripwireOk' in content);
    assert.ok('gitStatus' in content);
    transport.close();
  });
});
