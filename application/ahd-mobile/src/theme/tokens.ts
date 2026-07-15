export const colors = {
  ground: '#efe9dc',
  card: '#ffffff',
  hairline: 'rgba(60,50,30,0.12)',
  ink: '#1c1812',
  inkSecondary: '#6d6353',
  accent: '#a1442e',
  accentSoft: '#f4e2da',
  verified: '#177f6d',
  verifiedSoft: '#e3f0eb',
  verifiedText: '#116153',
  covenant: '#a8863f',
  covenantSoft: '#f3ead2',
  stopped: '#7a2410',
  stoppedSoft: '#f6e3da',
  seal: '#221d16',
  sealInk: '#ece3d0',
  sealLabel: '#b3a789',
  sealHash: '#d8b978',
  disabled: '#cbbfa9',
} as const;

export const spacing = {
  x1: 4,
  x2: 8,
  x3: 16,
  x4: 24,
  x5: 32,
  x6: 48,
} as const;

export const radii = {
  card: 14,
  sheet: 30,
  pill: 999,
} as const;

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '800' as const },
  ceremonyTitle: { fontSize: 24, fontWeight: '800' as const },
  row: { fontSize: 16, fontWeight: '600' as const },
  secondary: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '700' as const },
  amount: { fontSize: 36, fontWeight: '800' as const },
} as const;

export const fontFamilies = {
  body:
    process.env.EXPO_OS === 'web'
      ? '"Segoe UI","Noto Naskh Arabic",Tahoma,system-ui,sans-serif'
      : undefined,
  display:
    process.env.EXPO_OS === 'web'
      ? '"Sakkal Majalla","Segoe UI",Tahoma,system-ui,sans-serif'
      : undefined,
} as const;

export const controls = {
  minTarget: 44,
  hitSlop: 8,
} as const;
