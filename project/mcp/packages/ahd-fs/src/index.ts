#!/usr/bin/env node
import { z } from 'zod';
import { runMcpServer, defineTool } from 'ahd-mcp-common';
import { projectGlob, findCoverageGaps } from './globber.js';
import { gitLog, gitDiff } from './git.js';
import { checkIntegrity } from './integrity.js';

const tools = [
  defineTool({
    name: 'project_glob',
    description: 'Glob for files in the project, with project-aware exclusions (no node_modules/.git/dist).',
    schema: { pattern: z.string().min(1).describe('Glob pattern, e.g. "**/*.md" or "app/features/*.js"') },
    handler: ({ pattern }) => projectGlob(pattern),
  }),
  defineTool({
    name: 'git_log',
    description: 'Git log for the whole project or a specific file, most recent first.',
    schema: {
      n: z.coerce.number().int().min(1).optional().describe('How many commits to return (default 10)'),
      path: z.string().min(1).optional().describe('Limit to commits touching this project-relative path'),
    },
    handler: ({ n, path }) => gitLog(n, path),
  }),
  defineTool({
    name: 'git_diff',
    description: 'Git diff between two refs, or the currently staged diff if no refs are given.',
    schema: {
      a: z.string().min(1).optional().describe('First ref (e.g. a commit hash or HEAD~1)'),
      b: z.string().min(1).optional().describe('Second ref (e.g. HEAD)'),
    },
    handler: ({ a, b }) => gitDiff(a, b),
  }),
  defineTool({
    name: 'check_integrity',
    description: "Verify the frozen demo's SHA-256 tripwire and report live git status.",
    schema: {},
    handler: () => checkIntegrity(),
  }),
  defineTool({
    name: 'find_coverage_gaps',
    description: 'Find app feature source files that have no corresponding test file.',
    schema: {},
    handler: () => findCoverageGaps(),
  }),
];

await runMcpServer({ name: 'ahd-fs', version: '0.1.0' }, tools);
