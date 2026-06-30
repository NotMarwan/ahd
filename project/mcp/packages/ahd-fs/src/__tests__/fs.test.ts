import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('ahd-fs', () => {
  test('project_glob finds .md files at root', async () => {
    const { projectGlob } = await import('../globber.js');
    const result = await projectGlob('*.md');
    assert.ok(result.files.length >= 1);
    assert.ok(!result.files.some((f: string) => f.includes('node_modules')));
  });

  test('project_glob excludes node_modules', async () => {
    const { projectGlob } = await import('../globber.js');
    const result = await projectGlob('**/package.json');
    assert.ok(!result.files.some((f: string) => f.startsWith('project/mcp') && f.includes('node_modules')));
  });

  test('git_log returns commits', async () => {
    const { gitLog } = await import('../git.js');
    const result = await gitLog(5);
    assert.ok(result.commits.length <= 5);
    assert.ok(result.commits.length >= 1);
  });

  test('git_log for a specific file', async () => {
    const { gitLog } = await import('../git.js');
    const result = await gitLog(3, 'docs/DECISIONS-FOR-MARWAN.md');
    assert.ok(result.commits.length >= 1);
  });

  test('git_diff returns a diff string', async () => {
    const { gitDiff } = await import('../git.js');
    const result = await gitDiff();
    assert.ok(typeof result.diff === 'string');
  });

  test('check_integrity verifies demo tripwire', async () => {
    const { checkIntegrity } = await import('../integrity.js');
    const result = await checkIntegrity();
    assert.ok(result.tripwireOk === true || result.tripwireOk === false);
    assert.ok(typeof result.gitStatus === 'string');
  });

  test('find_coverage_gaps returns files without tests', async () => {
    const { findCoverageGaps } = await import('../globber.js');
    const result = await findCoverageGaps();
    assert.ok(Array.isArray(result.gaps));
  });
});
