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
    const msg = e instanceof Error ? e.message : String(e);
    return { content: [{ type: 'text', text: JSON.stringify({ error: msg }) }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
