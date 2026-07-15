import { describe, expect, it } from '@jest/globals';

import { PRIMARY_TABS, SCREEN_REGISTRY } from '../screen-registry';

describe('Ahd mobile route registry', () => {
  it('declares exactly 21 unique product routes', () => {
    expect(SCREEN_REGISTRY).toHaveLength(21);
    expect(new Set(SCREEN_REGISTRY.map((screen) => screen.key)).size).toBe(21);
    expect(new Set(SCREEN_REGISTRY.map((screen) => screen.route)).size).toBe(21);
  });

  it('exposes exactly four primary tabs in the approved order', () => {
    expect(PRIMARY_TABS.map(({ key, label }) => ({ key, label }))).toEqual([
      { key: 'home', label: 'الرئيسية' },
      { key: 'create', label: 'أنشئ عهدًا' },
      { key: 'daftari', label: 'دفتري' },
      { key: 'settle', label: 'المقاصّة' },
    ]);
    expect(SCREEN_REGISTRY.filter((screen) => screen.surface === 'tab')).toHaveLength(4);
    expect(SCREEN_REGISTRY.filter((screen) => screen.surface === 'stack')).toHaveLength(17);
  });
});
