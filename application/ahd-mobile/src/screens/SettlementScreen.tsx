import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AppShell,
  EmptyState,
  NettingVisual,
  RowGroup,
  ScreenHeader,
  SealChip,
  Section,
  StatusChip,
} from '@/components';
import { ahdCore, type SettlementResult, type SettlementTransfer } from '@/core/ahd-core';
import { useAhdJourney, type AhdStoredRecord } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

function connectedLocalRecords(
  records: readonly AhdStoredRecord[],
  activeRecordId: string | null,
): readonly AhdStoredRecord[] {
  const local = records.filter((entry) => entry.source === 'local');
  const active = local.find((entry) => entry.sealed.record.id === activeRecordId)
    ?? local[local.length - 1];
  if (!active) return [];
  const parties = new Set([active.sealed.record.lender, active.sealed.record.borrower]);
  const selected = new Set([active.sealed.record.id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const entry of local) {
      const record = entry.sealed.record;
      if (selected.has(record.id)) continue;
      if (parties.has(record.lender) || parties.has(record.borrower)) {
        selected.add(record.id);
        parties.add(record.lender);
        parties.add(record.borrower);
        changed = true;
      }
    }
  }
  return local.filter((entry) => selected.has(entry.sealed.record.id));
}

function transfersFor(records: readonly AhdStoredRecord[]): SettlementTransfer[] {
  return records.map(({ sealed }) => ({
    from: sealed.record.borrower,
    to: sealed.record.lender,
    amountMinor: sealed.record.amountMinor,
  }));
}

function TransferRow({ transfer }: { transfer: SettlementTransfer }) {
  return (
    <View style={styles.transferRow}>
      <View style={styles.transferThread} />
      <View style={styles.transferCopy}>
        <Text style={styles.transferParties}>{transfer.to} ← {transfer.from}</Text>
        <Text style={styles.transferAmount}>{ahdCore.formatMinorSar(transfer.amountMinor)}</Text>
      </View>
    </View>
  );
}

export function SettlementScreen() {
  const router = useRouter();
  const { settle, state, verifyProof } = useAhdJourney();
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const connected = connectedLocalRecords(state.records, state.activeRecordId);
  const recordIds = connected.map((entry) => entry.sealed.record.id);
  const transfers = transfersFor(connected);
  let preview: SettlementResult | undefined;
  let previewError: string | undefined;
  try {
    preview = transfers.length > 0 ? ahdCore.buildSettlement(transfers) : undefined;
  } catch (error) {
    previewError = error instanceof Error ? error.message : 'تعذّر حساب الشبكة';
  }
  const currentConsentIds = state.settlementConsent?.recordIds ?? [];
  const resultMatches = currentConsentIds.length === recordIds.length
    && currentConsentIds.every((recordId, index) => recordId === recordIds[index]);
  const settlement = resultMatches ? state.settlement : undefined;
  const visual = settlement ?? preview;

  const runSettlement = async () => {
    await settle(recordIds, consentConfirmed);
  };
  const showProof = async () => {
    await verifyProof();
    router.push('/proof');
  };

  return (
    <AppShell testID="settlement-screen">
      <ScreenHeader
        eyebrow="المقاصّة · اقتراح محلي"
        title="نختصر التحويل،"
        accentTitle="ولا نغيّر الحق."
        subtitle="تدخل فقط العهود المحلية المتصلة، ولا يُحفظ الاقتراح بلا إقرار صريح."
      />

      {!visual ? (
        <Section>
          <RowGroup>
            <EmptyState
              title={previewError ? 'توقّف الحساب بأمان' : 'لا توجد شبكة للمقاصّة'}
              body={previewError
                ? 'هذه الشبكة تتجاوز حدّ الـPilot المحلي. لم يتغيّر أي رصيد.'
                : 'أنشئ عهدًا مختومًا ليظهر اقتراح المقاصّة من سجلاتك الفعلية.'}
            />
          </RowGroup>
          <AhdButton label="أنشئ عهدًا" onPress={() => router.push('/create')} />
        </Section>
      ) : (
        <>
          <NettingVisual
            testID="netting-visual"
            beforeCount={visual.beforeCount}
            afterCount={visual.afterCount}
          />

          {!settlement ? (
            <View style={styles.consentArea}>
              <Pressable
                accessibilityLabel="أؤكد رضا جميع الأطراف عن هذا الاقتراح"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: consentConfirmed }}
                onPress={() => setConsentConfirmed((current) => !current)}
                style={[styles.consentCard, consentConfirmed && styles.consentCardChecked]}
              >
                <View style={[styles.checkbox, consentConfirmed && styles.checkboxChecked]}>
                  <Text style={styles.checkmark}>{consentConfirmed ? '✓' : ''}</Text>
                </View>
                <View style={styles.consentCopy}>
                  <Text style={styles.consentTitle}>أؤكد رضا جميع الأطراف عن هذا الاقتراح</Text>
                  <Text style={styles.consentBody}>إقرار محلي للـPilot؛ لا ينفّذ تحويلًا ولا يغيّر الرصيد.</Text>
                </View>
              </Pressable>
              <AhdButton
                label="احفظ اقتراح المقاصّة"
                onPress={runSettlement}
                disabled={!consentConfirmed}
              />
            </View>
          ) : null}

          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryLabel}>{settlement ? 'اقتراح محفوظ محليًا' : 'معاينة قبل الحفظ'}</Text>
              <StatusChip
                label={settlement?.conserved ? 'المجموع محفوظ' : 'لا تغيير بعد'}
                tone={settlement?.conserved ? 'verified' : 'active'}
              />
            </View>
            <Text style={styles.summaryTitle}>الصافي محفوظ لكل طرف؛ الذي يتغيّر هو عدد التحويلات المقترحة فقط.</Text>
            <View style={styles.counts}>
              <Text style={styles.count}>قبل: {visual.beforeCount}</Text>
              <View style={styles.countThread} />
              <Text style={styles.count}>بعد: {visual.afterCount}</Text>
            </View>
          </View>

          <Section title={settlement ? 'التحويلات المقترحة' : 'العهود الداخلة في الحساب'}>
            <RowGroup>
              {(settlement?.after ?? transfers).map((transfer, index) => (
                <TransferRow key={`${transfer.from}-${transfer.to}-${index}`} transfer={transfer} />
              ))}
            </RowGroup>
          </Section>

          {settlement ? (
            <View style={styles.resultActions}>
              <Text style={styles.resultNote}>حُفظ الاقتراح فقط. التنفيذ الخارجي ما زال يحتاج اتصالًا وموافقة مستقلة.</Text>
              <AhdButton label="التحقق من الإثبات" onPress={showProof} />
            </View>
          ) : null}

          <SealChip
            eyebrow="المحرك حتمي"
            label="نفس السجلات تعطي نفس الاقتراح"
            hash={`${visual.beforeCount}→${visual.afterCount}`}
          />
        </>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    padding: spacing.x4,
    gap: spacing.x3,
    borderRadius: radii.large,
    borderRightWidth: 4,
    borderRightColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  summaryTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  summaryLabel: { ...typography.caption, color: colors.accent, fontFamily: fontFamilies.body, fontWeight: '700' },
  summaryTitle: { ...typography.title, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  counts: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.x3 },
  count: { ...typography.sub, color: colors.ink, fontFamily: fontFamilies.body, fontVariant: ['tabular-nums'] },
  countThread: { flex: 1, height: 2, borderRadius: radii.pill, backgroundColor: colors.covenant },
  transferRow: {
    minHeight: controls.rowHeight,
    paddingHorizontal: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  transferThread: { width: 5, height: 32, borderRadius: radii.pill, backgroundColor: colors.covenant },
  transferCopy: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  transferParties: { ...typography.sub, flex: 1, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  transferAmount: { ...typography.sub, color: colors.inkSecondary, fontFamily: fontFamilies.body, writingDirection: 'ltr' },
  consentArea: { gap: spacing.x3 },
  consentCard: {
    minHeight: 78,
    padding: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x3,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  consentCardChecked: { borderColor: colors.covenant, backgroundColor: colors.covenantSoft },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.small,
    borderWidth: 2,
    borderColor: colors.inkSecondary,
  },
  checkboxChecked: { borderColor: colors.covenant, backgroundColor: colors.covenant },
  checkmark: { ...typography.sub, color: colors.white, fontFamily: fontFamilies.body },
  consentCopy: { flex: 1, alignItems: 'flex-end' },
  consentTitle: { ...typography.sub, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  consentBody: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  resultActions: { gap: spacing.x3 },
  resultNote: { ...typography.body, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
});
