#!/usr/bin/env node
import { z } from 'zod';
import { runMcpServer, defineTool } from 'ahd-mcp-common';
import { getDecisions } from './decisions.js';
import { getOpenThreads, getProjectStatus, queryKnowledge } from './status.js';
import { getHandoffs } from './handoffs.js';
import { getSpecs } from './specs.js';

const tools = [
  defineTool({
    name: 'get_decisions',
    description: 'Open decisions for Marwan (docs/DECISIONS-FOR-MARWAN.md), optionally filtered by topic, ID (e.g. "D-3"), or keyword in the title/context.',
    schema: { topic: z.string().min(1).optional().describe('Topic, decision ID (e.g. "D-3"), or keyword to filter by') },
    handler: ({ topic }) => getDecisions(topic),
  }),
  defineTool({
    name: 'get_open_threads',
    description: 'Open threads from the ledger (_meta/deep-work/ledger/open-threads.md), optionally filtered by priority.',
    schema: { priority: z.enum(['P0', 'P1', 'P2']).optional().describe('Filter to only this priority') },
    handler: ({ priority }) => getOpenThreads(priority),
  }),
  defineTool({
    name: 'get_project_status',
    description: 'Project health snapshot: current git branch, where to check integrity, and where test counts live.',
    schema: {},
    handler: () => getProjectStatus(),
  }),
  defineTool({
    name: 'get_handoffs',
    description: 'Most recent agent handoff logs from _meta/handoffs/, newest first.',
    schema: { n: z.coerce.number().int().min(0).optional().describe('How many handoffs to return (default 1)') },
    handler: ({ n }) => getHandoffs(n),
  }),
  defineTool({
    name: 'query_knowledge',
    description: 'Full-text (case-insensitive substring) search across every project markdown file. Returns up to 20 matching lines with their file path.',
    schema: { query: z.string().min(1).describe('Text to search for') },
    handler: ({ query }) => queryKnowledge(query),
  }),
  defineTool({
    name: 'get_specs',
    description: 'List design specs and plans (docs/superpowers/specs/ and docs/superpowers/plans/), optionally filtered by area/keyword in the filename.',
    schema: { area: z.string().min(1).optional().describe('Keyword to filter filenames by') },
    handler: ({ area }) => getSpecs(area),
  }),
];

await runMcpServer({ name: 'ahd-knowledge', version: '0.1.0' }, tools);
