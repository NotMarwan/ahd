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
