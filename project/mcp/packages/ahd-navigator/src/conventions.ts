export function getConventions() {
  return {
    spine: [
      'Bank witnesses/seals/settles; does NOT lend, judge, charge on the loan, or score',
      'No riba / penalty / maysir / gharar',
      'Integer halalas (1 SAR = 100), never float money',
      'Trust signal is a qualitative own-history band, never a number, never exported, never underwrites',
      'AI issues no fatwa — cite scholars/standards/verses; flag Shariah questions, do not rule',
    ],
    determinism: [
      'No Date.now / new Date / Math.random / Intl / .toLocaleString in logic',
      'Fixed AS_OF for all computations',
      'Golden functions never modified internally',
      'Pure functions separated from DOM',
    ],
    testing: [
      'Tests live in tests/ and tests/app/',
      'Named *.test.cjs / *-parity.cjs / *-smoke.cjs for auto-discovery',
      'TDD: write failing test first',
      'Harness is the gate — keep it green, never weaken an assertion',
    ],
    goldenFunctions: ['sha256', 'canonical', 'sealBlock', 'recomputeSeal', 'verifyRecord', 'netting', 'fmt', 'respread'],
  };
}
