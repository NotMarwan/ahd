import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECT_ROOT } from 'ahd-mcp-common';

export function getSpecs(area?: string): { specs: Array<{ name: string; path: string; type: string }> } {
  const specs: Array<{ name: string; path: string; type: string }> = [];
  const dirs = ['docs/superpowers/specs', 'docs/superpowers/plans'];
  for (const d of dirs) {
    const full = join(PROJECT_ROOT, d);
    try {
      for (const entry of readdirSync(full)) {
        if (!area || entry.toLowerCase().includes(area.toLowerCase())) {
          specs.push({ name: entry.replace(/\.md$/, ''), path: `${d}/${entry}`, type: d.includes('specs') ? 'spec' : 'plan' });
        }
      }
    } catch {
      // dir may not exist
    }
  }
  return { specs };
}
