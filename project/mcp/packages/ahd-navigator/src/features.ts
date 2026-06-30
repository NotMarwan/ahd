import manifest from './project-map.json' assert { type: 'json' };

export function getFeatureGraph() {
  return { features: manifest.features };
}

export function getFileRole(path: string): { role: string; isGolden: boolean; isParity: boolean } {
  const normalized = path.replace(/\\/g, '/');
  const isGolden = normalized.includes('demo/index.html');
  const isParity = normalized.includes('engine.js') || normalized.includes('build-engine.cjs');
  const feature = manifest.features.find((f: any) =>
    normalized === (f.featureFile || '') || normalized === (f.screenFile || '')
  );
  return {
    role: feature?.description || (isGolden ? 'Golden pinned function' : isParity ? 'Parity copy of golden engine' : 'Project file'),
    isGolden,
    isParity,
  };
}

export function findTestsFor(path: string): { tests: string[] } {
  const normalized = path.replace(/\\/g, '/');
  const feature = manifest.features.find((f: any) =>
    normalized === (f.featureFile || '') || normalized === (f.screenFile || '')
  );
  if (feature?.testFiles) {
    return { tests: feature.testFiles.map((t: string) => `tests/${t}`) };
  }
  return { tests: [] };
}
