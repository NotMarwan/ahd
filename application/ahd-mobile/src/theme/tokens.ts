export const colors = {
  ground: '#FFFFFF',
  card: '#FFFFFF',
  cardSecondary: '#F8FAFF',
  hairline: '#E3E7EF',
  line: '#E3E7EF',
  ink: '#16222C',
  inkSecondary: '#68727A',
  accent: '#2456F6',
  accentDeep: '#122B66',
  accentSoft: '#E8EDFF',
  accentLine: '#D4DDFB',
  onAccentDim: '#C8D4FF',
  verified: '#B9862F',
  verifiedSoft: '#F7EDD6',
  verifiedText: '#7A551A',
  covenant: '#B9862F',
  covenantSoft: '#F7EDD6',
  waiting: '#C77E1E',
  waitingSoft: '#FBF0DA',
  tamper: '#C2402A',
  tamperSoft: '#FBE7E1',
  stopped: '#C2402A',
  stoppedSoft: '#FBE7E1',
  seal: '#121F26',
  sealInk: '#D8E6E3',
  sealLabel: '#9FB4B1',
  sealHash: '#E4C179',
  disabled: '#C7CCD6',
  white: '#FFFFFF',
} as const;

export const spacing = {
  x1: 4,
  x2: 8,
  x3: 12,
  x4: 16,
  x5: 20,
  x6: 24,
  x7: 32,
  x8: 48,
} as const;

export const radii = {
  small: 10,
  medium: 14,
  large: 20,
  card: 14,
  sheet: 20,
  phone: 40,
  pill: 999,
} as const;

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '800' as const, lineHeight: 43 },
  display: { fontSize: 27, fontWeight: '800' as const, lineHeight: 35 },
  ceremonyTitle: { fontSize: 27, fontWeight: '800' as const, lineHeight: 35 },
  title: { fontSize: 15.5, fontWeight: '700' as const, lineHeight: 22 },
  row: { fontSize: 15.5, fontWeight: '700' as const, lineHeight: 22 },
  body: { fontSize: 13, fontWeight: '400' as const, lineHeight: 21 },
  secondary: { fontSize: 13, fontWeight: '400' as const, lineHeight: 21 },
  sub: { fontSize: 11.5, fontWeight: '600' as const, lineHeight: 18 },
  label: { fontSize: 11.5, fontWeight: '700' as const, lineHeight: 18 },
  caption: { fontSize: 10.5, fontWeight: '500' as const, lineHeight: 16 },
  amount: { fontSize: 34, fontWeight: '800' as const, lineHeight: 42 },
} as const;

export const fontFamilies = {
  body:
    process.env.EXPO_OS === 'web'
      ? '"IBM Plex Sans Arabic","Segoe UI",Tahoma,system-ui,sans-serif'
      : undefined,
  display:
    process.env.EXPO_OS === 'web'
      ? '"IBM Plex Sans Arabic","Segoe UI",Tahoma,system-ui,sans-serif'
      : undefined,
  technical:
    process.env.EXPO_OS === 'web'
      ? 'Consolas,"Cascadia Mono",ui-monospace,monospace'
      : 'monospace',
} as const;

export const controls = {
  minTarget: 48,
  rowHeight: 56,
  hitSlop: 8,
} as const;

export const motion = {
  duration: 500,
  easing: [0.16, 1, 0.3, 1] as const,
} as const;
