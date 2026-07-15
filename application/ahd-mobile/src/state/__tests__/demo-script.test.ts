import { beforeEach, describe, expect, it } from '@jest/globals';

import { DEMO_STEPS, demoGuide } from '../demo-script';

describe('الجولة الموجّهة', () => {
  beforeEach(() => demoGuide.skip());

  it('تغطي الرحلة الأساسية بالترتيب', () => {
    const routes = DEMO_STEPS.map((step) => step.route);
    expect(routes[0]).toBe('/home');
    expect(routes).toEqual([
      '/home',
      '/create',
      '/daftari',
      '/record/AHD-MOBILE-001',
      '/settle',
      '/proof',
      '/more',
    ]);
    for (const step of DEMO_STEPS) {
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.hint.length).toBeGreaterThan(0);
    }
  });

  it('next يتقدم خطوة، وskip ينهي الجولة', () => {
    demoGuide.start();
    expect(demoGuide.getState()).toEqual({ active: true, index: 0 });
    const step = demoGuide.next();
    expect(step?.route).toBe('/create');
    expect(demoGuide.getState().index).toBe(1);
    demoGuide.skip();
    expect(demoGuide.getState().active).toBe(false);
  });

  it('next بعد آخر خطوة ينهي الجولة', () => {
    demoGuide.start();
    for (let i = 0; i < DEMO_STEPS.length - 1; i += 1) demoGuide.next();
    expect(demoGuide.getState().index).toBe(DEMO_STEPS.length - 1);
    expect(demoGuide.next()).toBeNull();
    expect(demoGuide.getState().active).toBe(false);
  });
});
