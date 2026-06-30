import { test } from 'node:test';
import assert from 'node:assert';

// We'll test the generated JSON directly
import manifest from '../project-map.json' assert { type: 'json' };

test('project-map has required top-level keys', () => {
  assert.ok(manifest.builds);
  assert.ok(manifest.layers);
  assert.ok(manifest.engineInfo);
  assert.ok(manifest.features);
  assert.ok(manifest.goldenFunctions);
  assert.ok(manifest.harness);
});

test('builds include ahd-demo with tripwire', () => {
  const demo = manifest.builds.find((b: any) => b.name === 'ahd-demo');
  assert.ok(demo);
  assert.match(demo.tripwire, /^[a-f0-9]{64}$/);
});

test('engineInfo has golden and parity paths', () => {
  assert.ok(manifest.engineInfo.golden.path);
  assert.ok(manifest.engineInfo.parity.path);
});

test('features is a non-empty array with required fields', () => {
  assert.ok(manifest.features.length > 5);
  for (const feat of manifest.features) {
    assert.ok(feat.name);
    assert.ok(feat.featureFile || feat.description);
  }
});

test('goldenFunctions lists all 8 pinned functions', () => {
  const expected = ['sha256', 'canonical', 'sealBlock', 'recomputeSeal', 'verifyRecord', 'netting', 'fmt', 'respread'];
  for (const fn of expected) {
    assert.ok(manifest.goldenFunctions.includes(fn), `missing ${fn}`);
  }
});

test('harness has expected suite counts', () => {
  assert.ok(manifest.harness.runTests >= 135);
  assert.equal(manifest.harness.offlineCheck, 9);
  assert.equal(manifest.harness.domSmoke, 40);
  assert.ok(manifest.harness.app >= 29);
});
