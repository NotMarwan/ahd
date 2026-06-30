import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('ahd-knowledge', () => {
  test('get_decisions returns decision entries', async () => {
    const { getDecisions } = await import('../decisions.js');
    const result = await getDecisions();
    assert.ok(result.decisions.length >= 4);
    const d3 = result.decisions.find((d: any) => d.id === 'D-3');
    assert.ok(d3);
    assert.ok(d3.title.includes('Mode-B'));
  });

  test('get_decisions filters by topic', async () => {
    const { getDecisions } = await import('../decisions.js');
    const result = await getDecisions('riba');
    assert.ok(result.decisions.length >= 1);
  });

  test('get_open_threads returns threads', async () => {
    const { getOpenThreads } = await import('../status.js');
    const result = await getOpenThreads();
    assert.ok(result.threads.length >= 3);
  });

  test('get_project_status returns status object', async () => {
    const { getProjectStatus } = await import('../status.js');
    const result = await getProjectStatus();
    assert.ok(result.branch);
    assert.ok(result.testCounts);
  });

  test('get_handoffs returns latest handoffs', async () => {
    const { getHandoffs } = await import('../handoffs.js');
    const result = await getHandoffs(2);
    assert.ok(result.handoffs.length <= 2);
    if (result.handoffs.length > 0) {
      assert.ok(result.handoffs[0].id);
    }
  });

  test('query_knowledge finds text in markdown files', async () => {
    const { queryKnowledge } = await import('../status.js');
    const result = await queryKnowledge('riba linter');
    assert.ok(result.results.length >= 1);
  });

  test('get_specs returns specs list', async () => {
    const { getSpecs } = await import('../specs.js');
    const result = await getSpecs();
    assert.ok(result.specs.length >= 1);
  });

  test('unknown topic returns empty decisions (no crash)', async () => {
    const { getDecisions } = await import('../decisions.js');
    const result = await getDecisions('zzznotexist');
    assert.equal(result.decisions.length, 0);
  });
});
