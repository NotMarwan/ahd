import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECT_ROOT } from 'ahd-mcp-common';

interface Decision {
  id: string;
  title: string;
  context: string;
  status: string;
}

export function getDecisions(topic?: string): { decisions: Decision[] } {
  const content = readFileSync(join(PROJECT_ROOT, 'docs/DECISIONS-FOR-MARWAN.md'), 'utf-8');
  const decisions: Decision[] = [];
  const regex = /### (D-\d+) · (.+?)(?:\n|$)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const title = match[2];
    const start = match.index + match[0].length;
    const end = content.indexOf('\n### ', start);
    const section = content.slice(start, end > 0 ? end : undefined).trim();
    const context = section.slice(0, 300).replace(/\n+/g, ' ').trim();
    let status = 'open';
    if (section.includes('ADDRESSED') || section.includes('resolved')) status = 'resolved';
    if (section.includes('DEFERRED')) status = 'deferred';
    const entry: Decision = { id, title, context: context + (context.length >= 300 ? '…' : ''), status };
    if (!topic || id === topic || title.toLowerCase().includes(topic.toLowerCase()) || context.toLowerCase().includes(topic.toLowerCase())) {
      decisions.push(entry);
    }
  }
  return { decisions };
}
