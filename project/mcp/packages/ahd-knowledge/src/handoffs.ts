import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');

export function getHandoffs(n: number = 1): { handoffs: Array<{ id: string; summary: string }> } {
  const dir = join(PROJECT_ROOT, '_meta/handoffs');
  let files: string[];
  try {
    files = readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse()
      .slice(0, n);
  } catch {
    return { handoffs: [] };
  }
  const handoffs = files.map(file => {
    try {
      const content = readFileSync(join(dir, file), 'utf-8');
      const firstLine = content.split('\n')[0]?.replace(/^#\s*/, '').trim() || file;
      return { id: file.replace(/\.md$/, ''), summary: firstLine.slice(0, 120) };
    } catch {
      return { id: file.replace(/\.md$/, ''), summary: file };
    }
  });
  return { handoffs };
}
