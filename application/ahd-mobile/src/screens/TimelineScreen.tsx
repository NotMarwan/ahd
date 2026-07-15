import { StyleSheet, Text, View } from 'react-native';

import { AmountDisplay, AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js');

type AhdEvent = { type: string };

type SeedAhd = {
  id: string;
  lender: string;
  borrower: string;
  amount: number;
  note: string;
  events: AhdEvent[];
};

type Engine = {
  SEED_AHDS: SeedAhd[];
  fold: (events: AhdEvent[]) => { status: string; graced: boolean };
  statusLabel: (events: AhdEvent[]) => string;
  toMinor: (sar: number) => number;
};

const AhdEngine = engine as Engine;

function statusTone(status: string): 'verified' | 'covenant' | 'stopped' | 'neutral' {
  if (status === 'KEPT' || status === 'FORGIVEN') return 'verified';
  if (status === 'DEFAULTED') return 'stopped';
  if (status === 'DISPUTED') return 'neutral';
  return 'covenant';
}

export function TimelineScreen() {
  const seeds = AhdEngine.SEED_AHDS;

  return (
    <AppShell testID="timeline-screen">
      <ScreenHeader
        title="سِجلّ الشهادة"
        subtitle="المصرف يشهد ويحفظ — لا يُقرض، ولا يحكم، ولا يُصنّف. هذا ما جرى توثيقه."
      />
      <Section title="العهود">
        <RowGroup>
          {seeds.map((ahd) => {
            const label = AhdEngine.statusLabel(ahd.events);
            return (
              <View key={ahd.id} style={styles.row}>
                <View style={styles.rowHead}>
                  <Text style={styles.who}>
                    {ahd.lender} ← {ahd.borrower}
                  </Text>
                  <StatusChip label={label} tone={statusTone(AhdEngine.fold(ahd.events).status)} />
                </View>
                <AmountDisplay value={ahdCore.formatMinorSar(AhdEngine.toMinor(ahd.amount))} />
                <Text style={styles.note}>{ahd.note}</Text>
              </View>
            );
          })}
        </RowGroup>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  rowHead: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.x2,
  },
  who: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  note: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
    lineHeight: 20,
  },
});
