import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AmountDisplay,
  AppShell,
  EmptyState,
  RowGroup,
  ScreenHeader,
  SealChip,
  Section,
  StatusChip,
  ThreadMeter,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { deriveOpenLoanPosition, useAhdJourney } from '@/state';
import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

export function OpenLoanScreen() {
  const router = useRouter();
  const { state, verifyProof } = useAhdJourney();
  const [showForgivenessNotice, setShowForgivenessNotice] = useState(false);
  const entry = state.records.find((item) => item.sealed.record.id === state.activeRecordId)
    ?? state.records[state.records.length - 1];

  if (!entry) {
    return (
      <AppShell header={{ onBack: () => router.back() }} testID="open-loan-screen">
        <ScreenHeader
          eyebrow="رحلة الوفاء"
          title="العهد أولًا، ثم الحركة."
          subtitle="لا نعرض أرقامًا أو أطرافًا قبل وجود سجل حقيقي محفوظ على جهازك."
        />
        <Section>
          <RowGroup>
            <EmptyState title="لا يوجد عهد مفتوح" body="أنشئ عهدًا واختمه لتظهر رحلة الوفاء هنا." />
          </RowGroup>
          <AhdButton label="أنشئ عهدًا" onPress={() => router.push('/create')} />
        </Section>
      </AppShell>
    );
  }

  const { sealed } = entry;
  const { prepared, record } = sealed;
  const { paidMinor, remainingMinor, progressPercent: progress } = deriveOpenLoanPosition(record);
  const showProof = async () => {
    await verifyProof();
    router.push('/proof');
  };

  return (
    <AppShell header={{ onBack: () => router.back() }} testID="open-loan-screen">
      <ScreenHeader
        eyebrow={`عهد قائم · ${record.id}`}
        title="رحلة الوفاء"
        subtitle="كل رقم هنا من السجل المحلي نفسه؛ لا غرامة ولا تغيير صامت للأصل."
      />

      <View style={styles.parties}>
        <View style={styles.party}>
          <View style={styles.partyDot}><Text style={styles.partyLetter}>{record.lender.slice(0, 1)}</Text></View>
          <Text style={styles.partyName}>{record.lender}</Text>
          <Text style={styles.partyRole}>صاحب المال</Text>
        </View>
        <View style={styles.thread} />
        <View style={styles.party}>
          <View style={styles.partyDot}><Text style={styles.partyLetter}>{record.borrower.slice(0, 1)}</Text></View>
          <Text style={styles.partyName}>{record.borrower}</Text>
          <Text style={styles.partyRole}>المستفيد</Text>
        </View>
      </View>

      <View testID="open-loan-hero" style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>المتبقي من أصل العهد</Text>
          <StatusChip label={paidMinor > 0 ? 'حركة مسجّلة' : 'لا دفعات مسجّلة'} tone="active" />
        </View>
        <AmountDisplay value={ahdCore.formatMinorSar(remainingMinor)} />
        <View style={styles.meterPanel}>
          <ThreadMeter
            testID="repayment-thread-meter"
            progress={progress}
            paidLabel={paidMinor > 0 ? `سُدّد ${ahdCore.formatMinorSar(paidMinor)}` : 'لم تسجّل دفعة بعد'}
            remainingLabel={`الأصل ${ahdCore.formatMinorSar(record.amountMinor)}`}
          />
        </View>
      </View>

      <Section title="الجدول المحفوظ">
        <RowGroup>
          {prepared.open ? (
            <View style={styles.scheduleRow}>
              <View style={styles.knot} />
              <View style={styles.scheduleCopy}>
                <Text style={styles.scheduleTitle}>عهد مفتوح بلا موعد إلزامي</Text>
                <Text style={styles.scheduleMeta}>عند العجز يُمهل المستفيد بالمعروف.</Text>
              </View>
            </View>
          ) : prepared.schedule.map((item, index) => (
            <View key={`${item.dueISO}-${index}`} style={styles.scheduleRow}>
              <View style={styles.knot} />
              <View style={styles.scheduleCopy}>
                <Text style={styles.scheduleTitle}>{item.label}</Text>
                <Text style={styles.scheduleMeta}>{item.dueISO}</Text>
              </View>
              <Text style={styles.scheduleAmount}>{ahdCore.formatMinorSar(item.amountMinor)}</Text>
            </View>
          ))}
        </RowGroup>
      </Section>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>القاعدة ثابتة</Text>
        <Text style={styles.noticeCopy}>التأخر لا يضيف هللة واحدة. الإبراء يحتاج تأكيد صاحب الحق ثم سجلًا جديدًا مختومًا.</Text>
      </View>

      <AhdButton label="راجع الإبراء" onPress={() => setShowForgivenessNotice(true)} variant="secondary" />
      {showForgivenessNotice ? (
        <View accessibilityLiveRegion="polite" style={styles.forgiveness}>
          <Text style={styles.forgivenessTitle}>الإبراء لم يُنفذ</Text>
          <Text style={styles.forgivenessCopy}>لم يتغيّر الرصيد. يلزم رضا صاحب الحق وإثبات محلي جديد قبل أي تغيير.</Text>
        </View>
      ) : null}
      <AhdButton label="فتح المقاصّة" onPress={() => router.push('/settle')} />
      <AhdButton label="التحقق والمشاركة" onPress={showProof} variant="quiet" />

      <SealChip
        eyebrow="هذا العهد مختوم"
        label="النسخة المحلية مطابقة للسجل"
        hash={`${entry.proof.seal.slice(0, 12)}…`}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  parties: {
    minHeight: 72,
    paddingHorizontal: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  party: { minWidth: 92, alignItems: 'center', gap: spacing.x1 },
  partyDot: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
  },
  partyLetter: { ...typography.title, color: colors.accent, fontFamily: fontFamilies.body },
  partyName: { ...typography.sub, color: colors.ink, fontFamily: fontFamilies.body },
  partyRole: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body },
  thread: { width: 56, height: 3, borderRadius: radii.pill, backgroundColor: colors.covenant },
  hero: {
    padding: spacing.x4,
    gap: spacing.x3,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.accentLine,
    backgroundColor: colors.cardSecondary,
  },
  heroTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  heroLabel: { ...typography.sub, color: colors.inkSecondary, fontFamily: fontFamilies.body },
  meterPanel: {
    padding: spacing.x3,
    borderRadius: radii.medium,
    backgroundColor: colors.accentDeep,
  },
  scheduleRow: {
    minHeight: 58,
    paddingHorizontal: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  knot: { width: 8, height: 8, borderRadius: radii.pill, backgroundColor: colors.covenant },
  scheduleCopy: { flex: 1, alignItems: 'flex-end' },
  scheduleTitle: { ...typography.sub, color: colors.ink, fontFamily: fontFamilies.body },
  scheduleMeta: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body },
  scheduleAmount: { ...typography.sub, color: colors.ink, fontFamily: fontFamilies.display, writingDirection: 'ltr' },
  notice: {
    padding: spacing.x3,
    gap: spacing.x1,
    borderRightWidth: 4,
    borderRightColor: colors.covenant,
    borderRadius: radii.medium,
    backgroundColor: colors.covenantSoft,
  },
  noticeTitle: { ...typography.sub, color: colors.verifiedText, fontFamily: fontFamilies.body, textAlign: 'right' },
  noticeCopy: { ...typography.body, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  forgiveness: {
    padding: spacing.x3,
    gap: spacing.x1,
    borderRadius: radii.medium,
    backgroundColor: colors.waitingSoft,
  },
  forgivenessTitle: { ...typography.sub, color: colors.waiting, fontFamily: fontFamilies.body, textAlign: 'right' },
  forgivenessCopy: { ...typography.body, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
});
