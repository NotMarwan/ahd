import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AhdButton, AmountDisplay, AppShell, RowGroup, ScreenHeader, Section } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js');

type Engine = {
  respread: (totalMinor: number, count: number) => number[];
  toMinor: (sar: number) => number;
};

const AhdEngine = engine as Engine;

const PRINCIPAL_SAR = 8000;
const RESPREAD_MONTHS = 3;

export function OpenLoanScreen() {
  const [months] = useState<number>(RESPREAD_MONTHS);
  const principalMinor = AhdEngine.toMinor(PRINCIPAL_SAR);
  const shares = AhdEngine.respread(principalMinor, months);

  return (
    <AppShell testID="open-loan-screen">
      <ScreenHeader
        eyebrow="قرضٌ مفتوح"
        title="قرضٌ مفتوحٌ بينك وبين المقترض — متى ما تيسّر"
        subtitle="لا موعد، لا تذكير منك، لا حرج. حين ييسّر الله، يردّ — ولكِ أن تُبرئ متى شئتِ."
      />
      <Section title="المتبقّي">
        <RowGroup>
          <View style={styles.row}>
            <AmountDisplay label="المتبقّي" value={ahdCore.formatMinorSar(principalMinor)} />
          </View>
        </RowGroup>
      </Section>
      <Section title="رحلة السداد · متى ما تيسّر (توزيع يُسر)">
        <RowGroup>
          {shares.map((shareMinor, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.stepLabel}>القسط {i + 1}</Text>
              <Text style={styles.stepValue}>{ahdCore.formatMinorSar(shareMinor)}</Text>
            </View>
          ))}
        </RowGroup>
      </Section>
      <Text style={styles.note}>
        طلبُ إعادة الجدولة لا يزيد المبلغ ولا يضيف أيّ غرامة — الحاصل الجُمَعيّ محفوظٌ تمامًا (٢٬٢٨٠: نظرةٌ إلى ميسرة).
      </Text>
      <AhdButton label="🤍 اجعلها صدقة" onPress={() => {}} variant="secondary" testID="open-loan-forgive" />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  stepLabel: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  stepValue: {
    ...typography.row,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    fontVariant: ['tabular-nums'],
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
