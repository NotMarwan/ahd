import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');

function git(args: string): string {
  return execSync(`git ${args}`, { cwd: PROJECT_ROOT, encoding: 'utf-8' }).trim();
}

export function gitLog(n: number = 10, path?: string): { commits: Array<{ hash: string; message: string }> } {
  try {
    const cmd = `log --oneline -${n}${path ? ` -- "${path}"` : ''}`;
    const output = git(cmd);
    const commits = output.split('\n').filter(Boolean).map(line => {
      const hash = line.slice(0, 7);
      const message = line.slice(8).trim();
      return { hash, message };
    });
    return { commits };
  } catch {
    return { commits: [] };
  }
}

export function gitDiff(a?: string, b?: string): { diff: string } {
  try {
    let cmd: string;
    if (a && b) {
      cmd = `diff ${a}..${b}`;
    } else {
      cmd = 'diff --cached';
    }
    const diff = git(cmd);
    return { diff: diff || '(no diff)' };
  } catch {
    return { diff: '(error getting diff)' };
  }
}
