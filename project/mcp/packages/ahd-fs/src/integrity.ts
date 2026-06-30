import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');
const DEMO_PATH = join(PROJECT_ROOT, 'demo/index.html');
const EXPECTED = 'e2f48467a70a958be0840dd9f0f9fca27c47bb35445481f19ba27de0d1b8be40';

export function checkIntegrity(): { tripwireOk: boolean; gitStatus: string } {
  try {
    const data = readFileSync(DEMO_PATH);
    const hash = createHash('sha256').update(data).digest('hex');
    const tripwireOk = hash === EXPECTED;
    const gitStatus = execSync('git status --short', { cwd: PROJECT_ROOT, encoding: 'utf-8' }).trim();
    return { tripwireOk, gitStatus: gitStatus || '(clean)' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { tripwireOk: false, gitStatus: `Error: ${msg}` };
  }
}
