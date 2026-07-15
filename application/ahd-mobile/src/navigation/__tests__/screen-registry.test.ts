import * as fs from 'fs';
import * as path from 'path';

import { describe, expect, it } from '@jest/globals';

import { PRIMARY_TABS, SCREEN_REGISTRY } from '../screen-registry';

describe('Ahd mobile route registry', () => {
  it('declares exactly 23 unique product routes', () => {
    expect(SCREEN_REGISTRY).toHaveLength(23);
    expect(new Set(SCREEN_REGISTRY.map((screen) => screen.key)).size).toBe(23);
    expect(new Set(SCREEN_REGISTRY.map((screen) => screen.route)).size).toBe(23);
  });

  it('exposes exactly five primary tabs in the approved order', () => {
    expect(PRIMARY_TABS.map(({ key, label }) => ({ key, label }))).toEqual([
      { key: 'home', label: 'الرئيسية' },
      { key: 'create', label: 'أنشئ عهدًا' },
      { key: 'daftari', label: 'دفتري' },
      { key: 'settle', label: 'المقاصّة' },
      { key: 'more', label: 'المزيد' },
    ]);
    expect(SCREEN_REGISTRY.filter((screen) => screen.surface === 'tab')).toHaveLength(5);
    expect(SCREEN_REGISTRY.filter((screen) => screen.surface === 'stack')).toHaveLength(18);
  });

  it('every registered route has a route file', () => {
    const appDir = path.join(__dirname, '..', '..', 'app');
    for (const screen of SCREEN_REGISTRY) {
      const name = screen.route.slice(1);
      const candidates = [
        path.join(appDir, '(tabs)', `${name}.tsx`),
        path.join(appDir, '(stack)', `${name}.tsx`),
        path.join(appDir, '(stack)', name, 'index.tsx'),
      ];
      const exists = candidates.some((candidate) => fs.existsSync(candidate));
      if (!exists) throw new Error(`route file missing for ${screen.route}`);
    }
  });
});
