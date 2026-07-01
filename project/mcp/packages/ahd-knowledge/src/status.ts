import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PROJECT_ROOT } from 'ahd-mcp-common';

export function getOpenThreads(priority?: string): { threads: Array<{ id: string; title: string; priority: string; status: string }> } {
  const threadsPath = join(PROJECT_ROOT, '_meta/deep-work/ledger/open-threads.md');
  let content: string;
  try {
    content = readFileSync(threadsPath, 'utf-8');
  } catch {
    return { threads: [] };
  }
  const threads: Array<{ id: string; title: string; priority: string; status: string }> = [];
  const regex = /\*\*(OT-\w+)\*\*.*?(?:\n|$)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const line = content.slice(match.index, match.index + 120).replace(/\n/g, ' ').trim();
    const p = line.includes('P0') ? 'P0' : line.includes('P1') ? 'P1' : 'P2';
    if (!priority || p === priority) {
      threads.push({ id, title: line.slice(0, 80), priority: p, status: 'open' });
    }
  }
  return { threads };
}

export function getProjectStatus() {
  try {
    const headPath = join(PROJECT_ROOT, '.git/HEAD');
    const head = readFileSync(headPath, 'utf-8').trim();
    const branch = head.startsWith('ref: ') ? head.replace('ref: refs/heads/', '') : head.slice(0, 7);
    return {
      branch,
      integrity: 'check via ahd-fs check_integrity',
      testCounts: 'see OVERNIGHT-LOG.md or run the harness',
    };
  } catch {
    return { branch: 'unknown', integrity: 'unknown', testCounts: 'unknown' };
  }
}

export async function queryKnowledge(query: string): Promise<{ results: Array<{ path: string; snippet: string }> }> {
  const q = query.toLowerCase();
  const results: Array<{ path: string; snippet: string }> = [];
  const mdFiles: string[] = [];

  function walk(dir: string) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') walk(full);
      else if (entry.isFile() && entry.name.endsWith('.md')) mdFiles.push(full);
    }
  }
  walk(PROJECT_ROOT);

  for (const file of mdFiles) {
    let content: string;
    try {
      content = readFileSync(file, 'utf-8');
    } catch {
      continue;
    }
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(q)) {
        const rel = relative(PROJECT_ROOT, file).replace(/\\/g, '/');
        results.push({ path: rel, snippet: lines[i].trim().slice(0, 120) });
        if (results.length >= 20) break;
      }
    }
    if (results.length >= 20) break;
  }
  return { results };
}
