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

const DEMO_SETTLEMENT_TRANSFERS = [
  { from: 'نورة', to: 'سارة', amountMinor: 20_000 },
  { from: 'سارة', to: 'خالد', amountMinor: 20_000 },
  { from: 'نورة', to: 'ليلى', amountMinor: 25_000 },
  { from: 'ليلى', to: 'فهد', amountMinor: 25_000 },
  { from: 'نورة', to: 'خالد', amountMinor: 40_000 },
  { from: 'نورة', to: 'فهد', amountMinor: 5_000 },
  { from: 'سارة', to: 'ليلى', amountMinor: 15_000 },
  { from: 'ليلى', to: 'خالد', amountMinor: 15_000 },
  { from: 'خالد', to: 'سارة', amountMinor: 15_000 },
] as const satisfies readonly SettlementTransfer[];

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
  const isDemo = transfers.length === 0;
  const previewTransfers = isDemo ? DEMO_SETTLEMENT_TRANSFERS : transfers;
  let preview: SettlementResult | undefined;
  let previewError: string | undefined;
  try {
    preview = previewTransfers.length > 0 ? ahdCore.buildSettlement(previewTransfers) : undefined;
  } catch (error) {
    previewError = error instanceof Error ? error.message : 'تعذّر حساب الشبكة';
  }
  const currentConsentIds = state.settlementConsent?.recordIds ?? [];
  const resultMatches = currentConsentIds.length === recordIds.length
    && currentConsentIds.every((recordId, index) => recordId === recordIds[index]);
  const settlement = !isDemo && resultMatches ? state.settlement : undefined;
  const visual = settlement ?? preview;
  const demoOutput = isDemo ? (preview?.after ?? []) : [];
  const demoMovedMinor = demoOutput.reduce((total, transfer) => total + transfer.amountMinor, 0);

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
        eyebrow={isDemo ? 'المقاصّة · تجربة توضّح الفكرة' : 'المقاصّة · اقتراح محلي'}
        title="نختصر التحويل،"
        accentTitle="ولا نغيّر الحق."
        subtitle={isDemo
          ? 'مثال حتمي كامل؛ سجلاتك الحقيقية تبقى منفصلة ولا تتغيّر.'
          : 'تدخل فقط العهود المحلية المتصلة، ولا يُحفظ الاقتراح بلا إقرار صريح.'}
      />

      {!visual ? (
        <Section>
          <RowGroup>
            <EmptyState
              title="توقّف الحساب بأمان"
              body={previewError
                ? 'هذه الشبكة تتجاوز حدّ الـPilot المحلي. لم يتغيّر أي رصيد.'
                : 'تعذّر تجهيز المعاينة. لم يتغيّر أي رصيد.'}
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

          {isDemo ? (
            <View style={styles.demoNotice}>
              <View style={styles.demoNoticeTop}>
                <View style={styles.demoNoticeCopy}>
                  <Text style={styles.demoEyebrow}>بيانات تجريبية</Text>
                  <Text style={styles.demoTitle}>شبكة كاملة، جاهزة للاستكشاف</Text>
                </View>
                <StatusChip label="بيانات تجريبية" tone="covenant" />
              </View>
              <Text style={styles.demoBody}>
                العهود أدناه مثال توضيحي ثابت. لا تُضاف إلى دفترك، ولا تحفظ موافقة، ولا تنفّذ تحويلًا.
              </Text>
              <View style={styles.demoStats}>
                <View style={styles.demoStat}>
                  <Text style={styles.demoStatValue}>9</Text>
                  <Text style={styles.demoStatLabel}>عهود</Text>
                </View>
                <View style={styles.demoStatDivider} />
                <View style={styles.demoStat}>
                  <Text style={styles.demoStatValue}>5</Text>
                  <Text style={styles.demoStatLabel}>أطراف</Text>
                </View>
                <View style={styles.demoStatDivider} />
                <View style={styles.demoStat}>
                  <Text style={styles.demoStatValue}>{ahdCore.formatMinorSar(demoMovedMinor)}</Text>
                  <Text style={styles.demoStatLabel}>صافي التحويل</Text>
                </View>
              </View>
            </View>
          ) : null}

          {!settlement && !isDemo ? (
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
              <Text style={styles.summaryLabel}>
                {isDemo ? 'نتيجة المثال' : settlement ? 'اقتراح محفوظ محليًا' : 'معاينة قبل الحفظ'}
              </Text>
              <StatusChip
                label={isDemo ? 'بيانات تجريبية' : settlement?.conserved ? 'المجموع محفوظ' : 'لا تغيير بعد'}
                tone={isDemo ? 'covenant' : settlement?.conserved ? 'verified' : 'active'}
              />
            </View>
            <Text style={styles.summaryTitle}>الصافي محفوظ لكل طرف؛ الذي يتغيّر هو عدد التحويلات المقترحة فقط.</Text>
            <View style={styles.counts}>
              <Text style={styles.count}>قبل: {visual.beforeCount}</Text>
              <View style={styles.countThread} />
              <Text style={styles.count}>بعد: {visual.afterCount}</Text>
            </View>
          </View>

          {isDemo ? (
            <>
              <Section title={`العهود التجريبية الداخلة · ${DEMO_SETTLEMENT_TRANSFERS.length}`}>
                <RowGroup>
                  {DEMO_SETTLEMENT_TRANSFERS.map((transfer, index) => (
                    <TransferRow key={`demo-before-${transfer.from}-${transfer.to}-${index}`} transfer={transfer} />
                  ))}
                </RowGroup>
              </Section>
              <Section title={`التحويلات المقترحة · ${demoOutput.length}`}>
                <RowGroup variant="accent">
                  {demoOutput.map((transfer, index) => (
                    <TransferRow key={`demo-after-${transfer.from}-${transfer.to}-${index}`} transfer={transfer} />
                  ))}
                </RowGroup>
              </Section>
              <View style={styles.demoActions}>
                <Text style={styles.demoActionNote}>أضف عهودك الفعلية لتظهر مقاصّة تخص سجلات جهازك وحدها.</Text>
                <AhdButton label="أنشئ عهدًا حقيقيًا" onPress={() => router.push('/create')} />
                <AhdButton label="شاهد أثر المقاصّة" onPress={() => router.push('/impact')} variant="secondary" />
              </View>
            </>
          ) : (
            <Section title={settlement ? 'التحويلات المقترحة' : 'العهود الداخلة في الحساب'}>
              <RowGroup>
                {(settlement?.after ?? transfers).map((transfer, index) => (
                  <TransferRow key={`${transfer.from}-${transfer.to}-${index}`} transfer={transfer} />
                ))}
              </RowGroup>
            </Section>
          )}

          {settlement ? (
            <View style={styles.resultActions}>
              <Text style={styles.resultNote}>حُفظ الاقتراح فقط. التنفيذ الخارجي ما زال يحتاج اتصالًا وموافقة مستقلة.</Text>
              <AhdButton label="التحقق من الإثبات" onPress={showProof} />
            </View>
          ) : null}

          <SealChip
            eyebrow={isDemo ? 'مثال حتمي غير محفوظ' : 'المحرك حتمي'}
            label={isDemo ? 'يعرض الفكرة فقط؛ سجلاتك لا تتغيّر' : 'نفس السجلات تعطي نفس الاقتراح'}
            hash={`${visual.beforeCount}→${visual.afterCount}`}
          />
        </>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  demoNotice: {
    padding: spacing.x4,
    gap: spacing.x3,
    borderWidth: 1,
    borderColor: colors.covenant,
    borderRadius: radii.large,
    backgroundColor: colors.covenantSoft,
  },
  demoNoticeTop: { flexDirection: 'row-reverse', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.x2 },
  demoNoticeCopy: { flex: 1 },
  demoEyebrow: { ...typography.caption, color: colors.covenant, fontFamily: fontFamilies.body, fontWeight: '700', textAlign: 'right' },
  demoTitle: { ...typography.title, marginTop: 2, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  demoBody: { ...typography.body, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  demoStats: { flexDirection: 'row-reverse', alignItems: 'stretch', paddingTop: spacing.x3, borderTopWidth: 1, borderTopColor: 'rgba(185,134,47,0.24)' },
  demoStat: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  demoStatValue: { ...typography.title, color: colors.verifiedText, fontFamily: fontFamilies.display, fontVariant: ['tabular-nums'], textAlign: 'center' },
  demoStatLabel: { ...typography.caption, marginTop: 2, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'center' },
  demoStatDivider: { width: 1, backgroundColor: 'rgba(185,134,47,0.24)' },
  demoActions: { gap: spacing.x3 },
  demoActionNote: { ...typography.body, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
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
