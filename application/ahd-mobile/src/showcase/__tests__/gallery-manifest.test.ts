import { describe, expect, it } from '@jest/globals';

import { SCREEN_REGISTRY } from '../../navigation/screen-registry';
import { MOBILE_README_GALLERY } from '../gallery-manifest';

describe('mobile README gallery manifest', () => {
  it('maps exactly 20 final assets to every registered screen once', () => {
    expect(MOBILE_README_GALLERY).toHaveLength(20);

    const filenames = MOBILE_README_GALLERY.map((asset) => asset.filename);
    const coveredScreens = MOBILE_README_GALLERY.flatMap((asset) => asset.screens);
    const registeredScreens = SCREEN_REGISTRY.map((screen) => screen.key);

    expect(new Set(filenames).size).toBe(20);
    expect(coveredScreens).toHaveLength(24);
    expect(new Set(coveredScreens).size).toBe(24);
    expect([...coveredScreens].sort()).toEqual([...registeredScreens].sort());
  });

  it('captures both proof states in the same proof asset', () => {
    const proofAsset = MOBILE_README_GALLERY.find((asset) =>
      asset.screens.includes('proof'),
    );

    expect(proofAsset?.states).toEqual(['verified', 'tampered']);
  });
});
