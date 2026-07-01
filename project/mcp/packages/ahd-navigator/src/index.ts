#!/usr/bin/env node
import { z } from 'zod';
import { runMcpServer, defineTool } from 'ahd-mcp-common';
import { findByIntent } from './intent-finder.js';
import { getArchitecture } from './architecture.js';
import { getConventions } from './conventions.js';
import { getFeatureGraph, getFileRole, findTestsFor } from './features.js';

const filePath = z.string().min(1).describe('Project-relative file path, e.g. "app/features/riba-lint.js"');

const tools = [
  defineTool({
    name: 'find_by_intent',
    description: 'Find files by a natural-language description of what you are looking for (e.g. "riba linter", "settlement muqassa", "test harness").',
    schema: { query: z.string().min(1).describe('What are you looking for?') },
    handler: ({ query }) => findByIntent(query),
  }),
  defineTool({
    name: 'get_architecture',
    description: 'Project architecture overview (builds, layers, engine info). Use this to orient before making structural changes.',
    schema: {},
    handler: () => getArchitecture(),
  }),
  defineTool({
    name: 'get_conventions',
    description: 'Project conventions (spine rules, determinism rules, testing rules). Use this before writing or reviewing any code change.',
    schema: {},
    handler: () => getConventions(),
  }),
  defineTool({
    name: 'get_feature_graph',
    description: 'All features with their file locations, dependencies, and test coverage.',
    schema: {},
    handler: () => getFeatureGraph(),
  }),
  defineTool({
    name: 'get_file_role',
    description: 'What a given file does in the project (feature/screen, golden-pinned, parity copy, or plain project file).',
    schema: { path: filePath },
    handler: ({ path }) => getFileRole(path),
  }),
  defineTool({
    name: 'find_tests_for',
    description: 'Find test files covering a given source file.',
    schema: { path: filePath },
    handler: ({ path }) => findTestsFor(path),
  }),
];

await runMcpServer({ name: 'ahd-navigator', version: '0.1.0' }, tools);
