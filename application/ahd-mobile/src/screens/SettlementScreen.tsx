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

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js');

type NetworkTransfer = { from: string; to: string; amount: number };

const NETWORK_IOUS = engine.IOUS as readonly NetworkTransfer[];

function formatSar(amountSar: number): string {
  return ahdCore.formatMinorSar(engine.toMinor(amountSar));
}

function TransferRow({ transfer }: { transfer: NetworkTransfer }) {
  return (
    <View style={styles.transferRow}>
      <Text style={styles.row}>{transfer.to} ← {transfer.from}</Text>
      <Text style={styles.amount}>{formatSar(transfer.amount)}</Text>
    </View>
  );
}

export function SettlementScreen() {
  const router = useRouter();
  const { settle, state, verifyProof } = useAhdJourney();
  const sealed = state.sealed;

  const runSettlement = async () => {
    await settle(
      NETWORK_IOUS.map((transfer) => ({
        from: transfer.from,
        to: transfer.to,
        amountMinor: engine.toMinor(transfer.amount),
      })),
    );
  };

  const showProof = async () => {
    await verifyProof();
    router.push('/proof');
  };

  const settlement = state.settlement;

  return (
    <AppShell testID="settlement-screen">
      <ScreenHeader
        eyebrow="المقاصّة"
        title="سوِّ الشبكة بوضوح"
        subtitle="تسعة التزامات متشابكة بين خمسة أعضاء، والمحرك يختصرها إلى أقل عدد من التحويلات من غير فائدة أو غرامة."
      />

      {!sealed ? (
        <RowGroup>
          <EmptyState title="لا يوجد عهد للمقاصّة" body="اختم عهدًا أولًا ثم افتح تفاصيله." />
        </RowGroup>
      ) : !settlement ? (
        <Section title="شبكة الالتزامات قبل المقاصّة">
          <RowGroup>
            {NETWORK_IOUS.map((transfer, index) => (
              <TransferRow key={`${transfer.from}-${transfer.to}-${index}`} transfer={transfer} />
            ))}
          </RowGroup>
          <AhdButton label="شغّل مقاصّة الشبكة" onPress={runSettlement} />
        </Section>
      ) : (
        <Section title="نتيجة المقاصّة">
          <StatusChip
            label={settlement.conserved ? 'المجموع محفوظ' : 'تحتاج مراجعة'}
            tone={settlement.conserved ? 'verified' : 'stopped'}
          />
          {settlement.conserved ? (
            <Text style={styles.verdict}>حُفظ مجموع الالتزامات</Text>
          ) : null}
          <RowGroup>
            <View style={styles.summary}>
              <Text style={styles.row}>قبل: {settlement.beforeCount} تحويلات</Text>
              <Text style={styles.row}>بعد: {settlement.afterCount} تحويل</Text>
            </View>
          </RowGroup>
          <Section title="التحويلات بعد المقاصّة">
            <RowGroup>
              {settlement.after.map((transfer, index) => (
                <View key={`${transfer.from}-${transfer.to}-${index}`} style={styles.transferRow}>
                  <Text style={styles.row}>{transfer.to} ← {transfer.from}</Text>
                  <AmountDisplay value={ahdCore.formatMinorSar(transfer.amountMinor)} />
                </View>
              ))}
            </RowGroup>
          </Section>
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
  transferRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.x2,
    paddingHorizontal: spacing.x3,
    paddingVertical: spacing.x2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  row: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  amount: {
    ...typography.row,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
  },
  verdict: {
    ...typography.row,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
