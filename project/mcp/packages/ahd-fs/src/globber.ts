import { glob } from 'tinyglobby';
import { resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');
const EXCLUDE = ['**/node_modules/**', '**/.git/**', '**/dist/**'];

export async function projectGlob(pattern: string): Promise<{ files: string[] }> {
  const files = await glob(pattern, {
    cwd: PROJECT_ROOT,
    ignore: EXCLUDE,
    onlyFiles: true,
  });
  return { files };
}

export async function findCoverageGaps(): Promise<{ gaps: string[] }> {
  const features = await glob('app/features/*.js', { cwd: PROJECT_ROOT });
  const testFiles = await glob('tests/app/*.test.cjs', { cwd: PROJECT_ROOT });
  const gaps: string[] = [];
  for (const feat of features) {
    const baseName = feat.split('/').pop()!.replace('.js', '');
    const hasTest = testFiles.some(t => t.includes(baseName));
    if (!hasTest) gaps.push(feat);
  }
  return { gaps };
}
