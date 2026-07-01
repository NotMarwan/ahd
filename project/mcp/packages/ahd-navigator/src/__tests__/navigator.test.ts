import { test, describe } from 'node:test';
import assert from 'node:assert';
import { findByIntent } from '../intent-finder.js';
import { getArchitecture } from '../architecture.js';
import { getConventions } from '../conventions.js';
import { getFeatureGraph, getFileRole, findTestsFor } from '../features.js';

describe('ahd-navigator', () => {
  test('find_by_intent matches "riba linter" to riba-lint.js', () => {
    const result = findByIntent('riba linter');
    assert.ok(result.results.length >= 2);
    assert.ok(result.results.some((r: any) => r.path.includes('riba-lint')));
  });

  test('get_architecture returns both builds', () => {
    const result = getArchitecture();
    assert.ok(result.builds.length >= 2);
    assert.ok(result.builds.some((b: any) => b.name === 'ahd-demo'));
    assert.ok(result.builds.some((b: any) => b.name === 'ahd-app'));
  });

  test('get_conventions returns spine rules', () => {
    const result = getConventions();
    assert.ok(result.spine);
    assert.ok(result.spine.length >= 4);
  });

  test('get_feature_graph returns all features', () => {
    const result = getFeatureGraph();
    assert.ok(result.features.length >= 10);
    assert.ok(result.features.some((f: any) => f.name === 'riba-lint'));
  });

  test('get_file_role returns role for a known file', () => {
    const result = getFileRole('app/features/riba-lint.js');
    assert.ok(result.role);
    assert.ok(result.role.includes('riba'));
  });

  test('find_tests_for finds tests for a known file', () => {
    const result = findTestsFor('app/features/riba-lint.js');
    assert.ok(result.tests.length >= 1);
  });

  test('unknown query returns empty results (no crash)', () => {
    const result = findByIntent('zzznotexist');
    assert.equal(result.results.length, 0);
  });

  test('get_file_role falls back to "Project file" for an unmatched path (no crash)', () => {
    const result = getFileRole('some/totally/unmatched/path.js');
    assert.equal(result.role, 'Project file');
    assert.equal(result.isGolden, false);
    assert.equal(result.isParity, false);
  });

  test('find_tests_for returns an empty list for an unmatched path (no crash)', () => {
    const result = findTestsFor('some/totally/unmatched/path.js');
    assert.deepEqual(result.tests, []);
  });
});
