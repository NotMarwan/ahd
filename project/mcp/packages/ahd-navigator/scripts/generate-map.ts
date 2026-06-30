import { writeFileSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');
const OUTPUT = join(import.meta.dirname, '../src/project-map.json');

function sha256Of(p: string): string {
  if (!existsSync(p)) return '';
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}

const manifest: Record<string, unknown> = {
  builds: [
    {
      name: 'ahd-demo',
      path: 'demo/index.html',
      type: 'frozen-presenter',
      tripwire: sha256Of(join(PROJECT_ROOT, 'demo/index.html')),
    },
    {
      name: 'ahd-app',
      path: 'app/',
      type: 'publishable-product',
      serveCmd: 'node app/_serve-app.cjs',
    },
    {
      name: 'ahd-promo',
      path: 'promo/',
      type: 'remotion-video',
    },
  ],
  layers: [],
  engineInfo: {
    golden: {
      path: 'demo/index.html',
      markers: ['// ===AHD-LOGIC:BEGIN===', '// ===AHD-LOGIC:END==='],
    },
    parity: {
      path: 'app/engine.js',
      generatedBy: 'build-engine.cjs',
      proof: 'tests/app/engine-parity.cjs',
    },
  },
  goldenFunctions: ['sha256', 'canonical', 'sealBlock', 'recomputeSeal', 'verifyRecord', 'netting', 'fmt', 'respread'],
  harness: {
    corePath: 'tests/',
    appPath: 'tests/app/',
    suites: { runTests: 135, offlineCheck: 9, domSmoke: 40, app: 29 },
  },
};

const featuresDir = join(PROJECT_ROOT, 'app/features');
const features: Array<Record<string, unknown>> = [
  {
    name: 'create', featureFile: 'app/features/create.js', screenFile: 'app/screens/create.js',
    testFiles: ['app/create.test.cjs'], description: 'Create-عهد flow with riba linter',
  },
  {
    name: 'riba-lint', featureFile: 'app/features/riba-lint.js', screenFile: null,
    testFiles: ['app/riba-lint.test.cjs', 'app/riba-lint-corpus.test.cjs'], description: 'Deepened riba linter (additive over golden)',
  },
  {
    name: 'settlement', featureFile: 'app/features/settlement.js', screenFile: 'app/screens/settlement.js',
    testFiles: ['app/settlement.test.cjs', 'app/settlement-conserve.test.cjs'], description: 'Muqassa netting + conservation proof',
  },
  {
    name: 'daftari', featureFile: 'app/features/daftari.js', screenFile: 'app/screens/daftari.js',
    testFiles: ['app/daftari.test.cjs', 'app/daftari-hub.test.cjs'], description: 'Creditor home ledger + hub',
  },
  {
    name: 'open-loan', featureFile: 'app/features/open-loan.js', screenFile: 'app/screens/open-loan.js',
    testFiles: ['app/open-loan.test.cjs', 'app/open-loan-progress.test.cjs'], description: 'Open-term qard hasan',
  },
  {
    name: 'circle', featureFile: 'app/features/circle.js', screenFile: 'app/screens/circle.js',
    testFiles: ['app/circle.test.cjs', 'app/circle-reminder.test.cjs'], description: 'Circle treasurer dashboard + group reminder',
  },
  {
    name: 'circle-adv', featureFile: 'app/features/circle-adv.js', screenFile: 'app/screens/circle-adv.js',
    testFiles: ['app/circle-adv.test.cjs', 'app/circle-adv-split.test.cjs'], description: 'Advanced circle (splits, recurring, graduation)',
  },
  {
    name: 'timeline', featureFile: null, screenFile: 'app/screens/timeline.js',
    testFiles: ['app/timeline.test.cjs', 'app/timeline-connect.test.cjs'], description: 'Witness timeline (سِجلّ الشهادة)',
  },
  {
    name: 'proof', featureFile: null, screenFile: 'app/screens/proof.js',
    testFiles: ['app/proof.test.cjs', 'app/proof-provenance.test.cjs'], description: 'Proof-pack / evidence export',
  },
  {
    name: 'dispute', featureFile: null, screenFile: 'app/screens/dispute.js',
    testFiles: ['app/dispute.test.cjs'], description: 'Dispute pause (محلّ خلاف)',
  },
  {
    name: 'request', featureFile: 'app/features/request.js', screenFile: 'app/screens/request.js',
    testFiles: ['app/request.test.cjs'], description: 'Borrower-initiated request (اطلب عهدًا)',
  },
  {
    name: 'settings', featureFile: null, screenFile: 'app/screens/settings.js',
    testFiles: ['app/settings.test.cjs', 'app/settings-deepen.test.cjs'], description: 'Settings + privacy + digit toggle',
  },
  {
    name: 'home', featureFile: null, screenFile: 'app/screens/home.js',
    testFiles: [], description: 'Home front door',
  },
];

// Auto-discover feature files not in the static list — track by name to prevent duplicates
const knownNames = new Set(features.map(f => f.name));
if (existsSync(featuresDir)) {
  for (const entry of readdirSync(featuresDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.js')) {
      const name = entry.name.replace(/\.js$/, '');
      if (!knownNames.has(name)) {
        features.push({ name, featureFile: `app/features/${entry.name}`, screenFile: null, testFiles: [], description: '' });
      }
    }
  }
}

manifest.features = features;
writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(`project-map.json written to ${OUTPUT}`);
