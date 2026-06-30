import manifest from './project-map.json' assert { type: 'json' };

type IntentMap = Record<string, Array<{ path: string; description: string }>>;

const intentMap: IntentMap = {
  'riba linter': [
    { path: 'app/features/riba-lint.js', description: 'Additive riba linter (deepened)' },
    { path: 'demo/index.html', description: 'Golden ribaScan (4 rules, AHD-LOGIC)' },
    { path: 'app/engine.js', description: 'Parity-engine ribaScan' },
    { path: 'app/screens/create.js', description: 'Create screen (uses riba linter)' },
  ],
  'settlement muqassa': [
    { path: 'app/features/settlement.js', description: 'Muqassa settlement logic' },
    { path: 'app/screens/settlement.js', description: 'Muqassa settlement screen' },
  ],
  'golden functions': [
    { path: 'demo/index.html', description: 'Golden functions (AHD-LOGIC section)' },
    { path: 'app/engine.js', description: 'Parity-engine copy of golden functions' },
  ],
  'decisions marwan': [
    { path: 'docs/DECISIONS-FOR-MARWAN.md', description: 'Open decisions for Marwan' },
  ],
  'test harness': [
    { path: 'tests/', description: 'Core test harness' },
    { path: 'tests/app/', description: 'App test suites' },
  ],
  'handoff': [
    { path: 'handoffs/', description: 'Agent handoff logs' },
  ],
  'status': [
    { path: '_meta/overnight-log.md', description: 'Overnight deepening log' },
  ],
};

export function findByIntent(query: string): { results: Array<{ path: string; description: string }> } {
  const q = query.toLowerCase();
  const results: Array<{ path: string; description: string }> = [];
  for (const [key, entries] of Object.entries(intentMap)) {
    if (key.includes(q) || q.split(' ').some((w: string) => key.includes(w))) {
      results.push(...entries);
    }
  }
  return { results };
}
