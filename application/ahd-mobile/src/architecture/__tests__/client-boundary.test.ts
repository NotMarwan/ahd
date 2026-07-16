import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from '@jest/globals';

const mobileRoot = path.resolve(__dirname, '..', '..', '..');
const packageJson = JSON.parse(
  fs.readFileSync(path.join(mobileRoot, 'package.json'), 'utf8'),
) as { scripts?: Record<string, string> };

type BoundaryResult = {
  ok: boolean;
  violations: readonly { file: string; specifier: string }[];
};

const { checkClientBoundaries } = require('../../../scripts/check-client-boundaries.cjs') as {
  checkClientBoundaries(options?: { mobileRoot?: string; sourceRoot?: string }): BoundaryResult;
};

describe('Pilot client boundary', () => {
  it('ships a runnable forbidden-import guard', () => {
    expect(packageJson.scripts?.['check:boundaries']).toBe(
      'node ./scripts/check-client-boundaries.cjs',
    );
    expect(
      fs.existsSync(path.join(mobileRoot, 'scripts', 'check-client-boundaries.cjs')),
    ).toBe(true);
  });

  it('removes the demo tour from the product root', () => {
    const rootLayout = fs.readFileSync(path.join(mobileRoot, 'src', 'app', '_layout.tsx'), 'utf8');

    expect(rootLayout).not.toContain('DemoGuide');
    expect(fs.existsSync(path.join(mobileRoot, 'src', 'components', 'demo-guide.tsx'))).toBe(false);
    expect(fs.existsSync(path.join(mobileRoot, 'src', 'state', 'demo-script.ts'))).toBe(false);
  });

  it('rejects imports that cross into prototype and presentation trees', () => {
    const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'ahd-mobile-boundary-'));
    const fakeMobileRoot = path.join(sandbox, 'application', 'ahd-mobile');
    const fakeSourceRoot = path.join(fakeMobileRoot, 'src');
    fs.mkdirSync(fakeSourceRoot, { recursive: true });
    fs.writeFileSync(
      path.join(fakeSourceRoot, 'bad.ts'),
      [
        "import '../../prototypes/card';",
        "const legacy = require('../../../app/engine.js');",
      ].join('\n'),
    );

    try {
      const result = checkClientBoundaries({ mobileRoot: fakeMobileRoot, sourceRoot: fakeSourceRoot });

      expect(result.ok).toBe(false);
      expect(result.violations.map((item) => item.specifier)).toEqual([
        '../../prototypes/card',
        '../../../app/engine.js',
      ]);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  it('keeps the real client source inside the allowed boundary', () => {
    expect(checkClientBoundaries({ mobileRoot }).violations).toEqual([]);
  });
});
