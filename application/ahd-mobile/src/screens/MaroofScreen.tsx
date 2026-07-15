import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js') as GeneratedEngine;

type TrustBand = 'kept' | 'mixed' | 'overdue' | 'new';

interface TrustEntry {
  band: TrustBand;
  ratio: number;
  count: number;
}

interface GeneratedEngine {
  TRUST: Record<string, TrustEntry>;
  TRUST_BAND_AR: Record<TrustBand, string>;
}

type StatusTone = 'verified' | 'covenant' | 'stopped' | 'neutral';

const BAND_TONE: Record<TrustBand, StatusTone> = {
  kept: 'verified',
  mixed: 'covenant',
  overdue: 'stopped',
  new: 'neutral',
};

export function MaroofScreen() {
  const trust = engine.TRUST as Record<string, TrustEntry>;
  const names = Object.keys(trust);

  return (
    <AppShell testID="maroof-screen">
      <ScreenHeader
        eyebrow="معروف"
        title="من عُرِف بالوفاء"
        subtitle="أثرٌ نوعيٌّ من تاريخك أنت وحدك — بلا رقمٍ، وبلا درجة ائتمانية، ولا يُصدَّر خارج عهد."
      />

      <Section title="سجلّ الوفاء">
        <RowGroup>
          {names.map((name, index) => {
            const entry = trust[name];
            const label = engine.TRUST_BAND_AR[entry.band];
            return (
              <View
                key={name}
                style={[styles.row, index === names.length - 1 && styles.rowLast]}
              >
                <Text style={styles.name}>{name}</Text>
                <StatusChip label={label} tone={BAND_TONE[entry.band]} />
              </View>
            );
          })}
        </RowGroup>
      </Section>

      <Text style={styles.disclaimer}>
        هذا وصفٌ نوعيٌّ لعلاقتك بمن تعاملت معهم فقط، ولا يُستخدَم للإقراض ولا للحكم على أحد.
      </Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  name: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  disclaimer: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
});
