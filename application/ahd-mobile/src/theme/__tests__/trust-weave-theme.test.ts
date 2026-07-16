import { describe, expect, it } from '@jest/globals';

import { colors, controls, radii, spacing, typography } from '..';

describe('Trust Weave theme contract', () => {
  it('uses the approved white, cobalt, gold, amber, tamper, and seal palette', () => {
    expect(colors.ground).toBe('#FFFFFF');
    expect(colors.accent).toBe('#2456F6');
    expect(colors.accentDeep).toBe('#122B66');
    expect(colors.accentSoft).toBe('#E8EDFF');
    expect(colors.covenant).toBe('#B9862F');
    expect(colors.waiting).toBe('#C77E1E');
    expect(colors.tamper).toBe('#C2402A');
    expect(colors.seal).toBe('#121F26');
  });

  it('removes the old Sadu palette from semantic tokens', () => {
    const serialized = JSON.stringify(colors).toLowerCase();

    expect(serialized).not.toContain('#efe9dc');
    expect(serialized).not.toContain('#a1442e');
    expect(serialized).not.toContain('#177f6d');
    expect(serialized).not.toContain('#a8863f');
  });

  it('uses the approved mobile scale', () => {
    expect(controls.minTarget).toBe(48);
    expect(radii.large).toBe(20);
    expect(radii.medium).toBe(14);
    expect(radii.small).toBe(10);
    expect(spacing.x3).toBe(12);
    expect(typography.display.fontSize).toBe(27);
    expect(typography.title.fontSize).toBe(15.5);
  });
});
