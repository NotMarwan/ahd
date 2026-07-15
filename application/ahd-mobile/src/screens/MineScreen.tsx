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

function isClosed(status: string): boolean {
  return status === 'KEPT' || status === 'FORGIVEN' || status === 'VOID';
}

function statusTone(status: string): 'verified' | 'covenant' | 'stopped' | 'neutral' {
  if (isClosed(status)) return 'verified';
  if (status === 'DEFAULTED') return 'stopped';
  if (status === 'DISPUTED') return 'neutral';
  return 'covenant';
}

export function MineScreen() {
  const obligations = AhdEngine.SEED_AHDS;
  const openObligations = obligations.filter((o) => !isClosed(AhdEngine.fold(o.events).status));
  const totalRemainingMinor = openObligations.reduce(
    (sum, o) => sum + AhdEngine.toMinor(o.amount),
    0,
  );

  return (
    <AppShell testID="mine-screen">
      <ScreenHeader
        eyebrow="التزاماتي"
        title="ما عليّ"
        subtitle="التزاماتُك — بترتيب ما يستحقّ عنايتك أوّلًا، بلا مطالبة ولا عدّ أيّام"
      />
      <Section title="ملخّص">
        <RowGroup>
          <View style={styles.row}>
            <AmountDisplay label="إجمالي ما عليك" value={ahdCore.formatMinorSar(totalRemainingMinor)} />
          </View>
          <View style={styles.row}>
            <Text style={styles.tileLabel}>عهودٌ قائمة</Text>
            <Text style={styles.tileValue}>{openObligations.length}</Text>
          </View>
        </RowGroup>
      </Section>
      <Text style={styles.verse}>
        ﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾ — لك أن تطلب المهلة بكرامة، ولك أن تسدّد متى تيسّر.
      </Text>
      <Section title="عهودك">
        {obligations.length === 0 ? (
          <Text style={styles.empty}>لا شيء عليك الآن 🤍 — ذمّتك خفيفة.</Text>
        ) : (
          <RowGroup>
            {obligations.map((o) => {
              const f = AhdEngine.fold(o.events);
              const closed = isClosed(f.status);
              return (
                <View key={o.id} style={styles.row}>
                  <View style={styles.rowHead}>
                    <Text style={styles.who}>لـ {o.lender}</Text>
                    <StatusChip label={AhdEngine.statusLabel(o.events)} tone={statusTone(f.status)} />
                  </View>
                  <Text style={styles.amt}>
                    {closed ? 'ذمّةٌ محفوظة' : `المتبقّي ${ahdCore.formatMinorSar(AhdEngine.toMinor(o.amount))}`}
                  </Text>
                </View>
              );
            })}
          </RowGroup>
        )}
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
  amt: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  tileLabel: {
    ...typography.label,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  tileValue: {
    ...typography.amount,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    textAlign: 'right',
  },
  verse: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
    lineHeight: 20,
  },
  empty: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
