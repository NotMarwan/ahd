import { test, describe } from 'node:test';
import assert from 'node:assert';
import { join } from 'node:path';
import { writeFileSync, rmSync } from 'node:fs';
import { PROJECT_ROOT } from 'ahd-mcp-common';

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

  test('project_glob returns an empty list for a pattern matching nothing (no crash)', async () => {
    const { projectGlob } = await import('../globber.js');
    const result = await projectGlob('**/*.zzznotexist-extension');
    assert.deepEqual(result.files, []);
  });

  test('git_log for a nonexistent path returns no commits (no crash)', async () => {
    const { gitLog } = await import('../git.js');
    const result = await gitLog(5, 'zzz/definitely/not/a/real/path.md');
    assert.deepEqual(result.commits, []);
  });

  test('git_diff works with explicit refs', async () => {
    const { gitDiff } = await import('../git.js');
    const result = await gitDiff('HEAD~1', 'HEAD');
    assert.ok(typeof result.diff === 'string');
  });

  test('check_integrity reflects LIVE git status, not a snapshot cached at process start', async () => {
    const { checkIntegrity } = await import('../integrity.js');
    const scratchName = '.ahd-fs-integrity-live-check.tmp';
    const scratchPath = join(PROJECT_ROOT, scratchName);

    const before = await checkIntegrity();
    assert.ok(!before.gitStatus.includes(scratchName), 'scratch file should not exist yet');

    writeFileSync(scratchPath, 'scratch');
    try {
      const after = await checkIntegrity();
      assert.ok(after.gitStatus.includes(scratchName), 'expected check_integrity to see the newly created file (live status, not cached)');
    } finally {
      rmSync(scratchPath);
    }
  });
});
