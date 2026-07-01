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

  test('ahd-navigator: find_by_intent works end-to-end over real stdio', async () => {
    const transport = navTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const result = await client.callTool({ name: 'find_by_intent', arguments: { query: 'riba linter' } });
    assert.notEqual(result.isError, true);
    const content = JSON.parse(result.content[0].text);
    assert.ok(content.results.length >= 1);
    transport.close();
  });

  test('ahd-navigator: find_by_intent with a bad input type returns an actionable error, not a crash', async () => {
    const transport = navTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const result = await client.callTool({ name: 'find_by_intent', arguments: { query: 123 } });
    assert.equal(result.isError, true);
    const content = JSON.parse(result.content[0].text);
    assert.match(content.error, /query/);
    transport.close();
  });

  test('ahd-knowledge: get_decisions works end-to-end over real stdio', async () => {
    const transport = knowledgeTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const result = await client.callTool({ name: 'get_decisions', arguments: {} });
    assert.notEqual(result.isError, true);
    const content = JSON.parse(result.content[0].text);
    assert.ok(content.decisions.length >= 1);
    transport.close();
  });

  test('ahd-knowledge: get_open_threads with an invalid priority returns an actionable error, not silent empty results', async () => {
    const transport = knowledgeTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const result = await client.callTool({ name: 'get_open_threads', arguments: { priority: 'P9' } });
    assert.equal(result.isError, true);
    const content = JSON.parse(result.content[0].text);
    assert.match(content.error, /priority/);
    transport.close();
  });

  test('ahd-fs: project_glob works end-to-end over real stdio', async () => {
    const transport = fsTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const result = await client.callTool({ name: 'project_glob', arguments: { pattern: '*.md' } });
    assert.notEqual(result.isError, true);
    const content = JSON.parse(result.content[0].text);
    assert.ok(content.files.length >= 1);
    transport.close();
  });

  test('ahd-fs: project_glob with a missing required field returns an actionable error, not a crash', async () => {
    const transport = fsTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const result = await client.callTool({ name: 'project_glob', arguments: {} });
    assert.equal(result.isError, true);
    const content = JSON.parse(result.content[0].text);
    assert.match(content.error, /pattern/);
    transport.close();
  });

  test('an unknown tool name returns an actionable error listing real tool names, not a crash', async () => {
    const transport = fsTransport();
    const client = new Client({ name: 'test', version: '1.0' });
    await client.connect(transport);
    const result = await client.callTool({ name: 'not_a_real_tool', arguments: {} });
    assert.equal(result.isError, true);
    const content = JSON.parse(result.content[0].text);
    assert.match(content.error, /project_glob/);
    transport.close();
  });
});
