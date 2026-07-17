import * as fs from 'fs';
import * as path from 'path';

import { expect, test } from '@jest/globals';

function productionFiles(root: string): string[] {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__tests__' || entry.name === 'generated') return [];
      return productionFiles(full);
    }
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

test('تستخدم كل واجهات الجوال كلمة التسوية العامة', () => {
  const sourceRoot = path.join(__dirname, '..', '..');
  const bannedStem = ['الم', 'قاص'].join('');
  const offenders = productionFiles(sourceRoot).filter((file) => (
    fs.readFileSync(file, 'utf8').includes(bannedStem)
  ));
  expect(offenders).toEqual([]);
});
