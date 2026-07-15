import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AmountDisplay,
  AppShell,
  EmptyState,
  RowGroup,
  ScreenHeader,
  Section,
  StatusChip,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { useAhdJourney } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export function SettlementScreen() {
  const router = useRouter();
  const { settle, state, verifyProof } = useAhdJourney();
  const sealed = state.sealed;

  const runSettlement = async () => {
    if (!sealed) return;
    await settle([
      {
        from: sealed.record.borrower,
        to: sealed.record.lender,
        amountMinor: sealed.record.amountMinor,
      },
    ]);
  };

  const showProof = async () => {
    await verifyProof();
    router.push('/proof');
  };

  return (
    <AppShell testID="settlement-screen">
      <ScreenHeader
        eyebrow="المقاصّة"
        title="سوِّ الالتزام بوضوح"
        subtitle="المحرك يرتّب التحويلات ويحافظ على مجموع الالتزامات من غير فائدة أو غرامة."
      />

      {!sealed ? (
        <RowGroup>
          <EmptyState title="لا يوجد عهد للمقاصّة" body="اختم عهدًا أولًا ثم افتح تفاصيله." />
        </RowGroup>
      ) : !state.settlement ? (
        <Section title="التحويل المقترح">
          <RowGroup>
            <View style={styles.summary}>
              <Text style={styles.row}>{sealed.record.borrower} ← {sealed.record.lender}</Text>
              <AmountDisplay value={ahdCore.formatMinorSar(sealed.record.amountMinor)} />
            </View>
          </RowGroup>
          <AhdButton label="تنفيذ المقاصّة" onPress={runSettlement} />
        </Section>
      ) : (
        <Section title="نتيجة المقاصّة">
          <StatusChip
            label={state.settlement.conserved ? 'المجموع محفوظ' : 'تحتاج مراجعة'}
            tone={state.settlement.conserved ? 'verified' : 'stopped'}
          />
          <Text style={styles.verdict}>حُفظ مجموع الالتزامات</Text>
          <RowGroup>
            <View style={styles.summary}>
              <Text style={styles.row}>قبل: {state.settlement.beforeCount} تحويل</Text>
              <Text style={styles.row}>بعد: {state.settlement.afterCount} تحويل</Text>
            </View>
          </RowGroup>
          <AhdButton label="التحقق من الإثبات" onPress={showProof} />
        </Section>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  summary: {
    gap: spacing.x2,
    padding: spacing.x3,
  },
  row: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  verdict: {
    ...typography.row,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
