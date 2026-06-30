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
    const msg = e instanceof Error ? e.message : String(e);
    return { content: [{ type: 'text', text: JSON.stringify({ error: msg }) }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
