import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section } from '@/components';
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
  toMinor: (sar: number) => number;
};

const AhdEngine = engine as Engine;

export function ImpactScreen() {
  const seeds = AhdEngine.SEED_AHDS;
  const totalObligations = seeds.length;
  const totalMovedMinor = seeds.reduce((sum, o) => sum + AhdEngine.toMinor(o.amount), 0);
  const keptOrForgivenCount = seeds.filter((o) => {
    const status = AhdEngine.fold(o.events).status;
    return status === 'KEPT' || status === 'FORGIVEN';
  }).length;

  return (
    <AppShell testID="impact-screen">
      <ScreenHeader
        eyebrow="أثر عهد"
        title="أثر عهد — أثر المقاصّة عبر الدوائر"
        subtitle="المصرف يشهد ويحفظ — مجاميع مجهّلة فقط، لا يظهر هنا اسمٌ ولا رقمٌ فرديّ."
      />
      <Section title="ملخّص العهود">
        <RowGroup>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{totalObligations}</Text>
            <Text style={styles.cardLabel}>التزامًا موثّقًا</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{keptOrForgivenCount}</Text>
            <Text style={styles.cardLabel}>ذمّةٌ محفوظة أو أُبرئت</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{ahdCore.formatMinorSar(totalMovedMinor)}</Text>
            <Text style={styles.cardLabel}>ر.س موثّقة عبر الشهادة</Text>
          </View>
        </RowGroup>
      </Section>
      <Text style={styles.note}>
        الأرقام هنا مجاميعُ مجهّلة على بيانات اختبار — لا تُقدَّم كمسحٍ ميدانيّ، والمصادر مذكورة في الشاشة الكاملة.
      </Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
    alignItems: 'flex-end',
  },
  cardValue: {
    ...typography.amount,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    textAlign: 'right',
  },
  cardLabel: {
    ...typography.secondary,
    color: colors.inkSecondary,
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
