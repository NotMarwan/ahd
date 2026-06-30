import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface Feature {
  name: string;
  featureFile: string | null;
  screenFile: string | null;
  testFiles: string[];
  description: string;
}

type Manifest = {
  builds: unknown[];
  layers: unknown[];
  engineInfo: unknown;
  features: Feature[];
  goldenFunctions: string[];
  harness: { suites: Record<string, number> };
};

let _manifest: Manifest | null = null;
function getManifest(): Manifest {
  if (!_manifest) {
    const p = resolve(import.meta.dirname, './project-map.json');
    _manifest = JSON.parse(readFileSync(p, 'utf-8')) as Manifest;
  }
  return _manifest;
}

export function getFeatureGraph() {
  return { features: getManifest().features };
}

export function getFileRole(fpath: string): { role: string; isGolden: boolean; isParity: boolean } {
  const normalized = fpath.replace(/\\/g, '/');
  const isGolden = normalized.includes('demo/index.html');
  const isParity = normalized.includes('engine.js') || normalized.includes('build-engine.cjs');
  const feature = getManifest().features.find(f =>
    normalized === (f.featureFile || '') || normalized === (f.screenFile || '')
  );
  return {
    role: feature?.description || (isGolden ? 'Golden pinned function' : isParity ? 'Parity copy of golden engine' : 'Project file'),
    isGolden,
    isParity,
  };
}

export function findTestsFor(fpath: string): { tests: string[] } {
  const normalized = fpath.replace(/\\/g, '/');
  const feature = getManifest().features.find(f =>
    normalized === (f.featureFile || '') || normalized === (f.screenFile || '')
  );
  if (feature?.testFiles) {
    return { tests: feature.testFiles.map(t => `tests/${t}`) };
  }
  return { tests: [] };
}
