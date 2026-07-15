import { StyleSheet, Text, View } from 'react-native';

import { AhdButton, AmountDisplay, AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, fontFamilies, spacing, typography } from '@/theme';

const DISPUTE_RECORD_ID = 'AHD-MOBILE-DISPUTE-001';
const DISPUTE_TIMESTAMP = '2026-06-01T10:00:00+03:00';

const prepared = ahdCore.prepareDraft({
  id: DISPUTE_RECORD_ID,
  lender: 'سالم',
  borrower: 'عبدالله',
  amountMinor: 90000,
  months: 3,
  open: false,
  start: { y: 2026, m: 6 },
  timestamp: DISPUTE_TIMESTAMP,
  purpose: 'قرض حسن لظرفٍ طارئ',
});
const sealedRecord = ahdCore.sealPrepared(prepared);

type DisputePath = {
  key: 'reconcile' | 'judiciary';
  icon: string;
  ar: string;
  note: string;
  encouraged?: boolean;
};

const PATHS: DisputePath[] = [
  {
    key: 'reconcile',
    icon: '🌿',
    ar: 'الصلح والتراضي',
    note: 'إعادة جدولةٍ بالمعروف، أو إبراءٌ لما تبقّى — بلا زيادةٍ في الحالين.',
    encouraged: true,
  },
  {
    key: 'judiciary',
    icon: '🔏',
    ar: 'القضاء',
    note: 'الوثيقة المختومة تُعرَض دليلًا محايدًا أمام الجهة المختصة.',
  },
];

export function DisputeScreen() {
  const verified = sealedRecord.verification.ok;

  return (
    <AppShell testID="dispute-screen">
      <ScreenHeader
        title={`عهد «${sealedRecord.record.lender}» و«${sealedRecord.record.borrower}»`}
        subtitle="عهدٌ يشهد ولا يحكم."
      />

      <Section title="المبلغ والوثيقة">
        <RowGroup>
          <View style={styles.recordBody}>
            <AmountDisplay value={ahdCore.formatMinorSar(sealedRecord.record.amountMinor)} />
            <StatusChip
              label={verified ? 'السجلّ مطابق للختم' : 'تعذّر التحقق'}
              tone={verified ? 'verified' : 'stopped'}
            />
          </View>
        </RowGroup>
      </Section>

      <Section>
        <Text style={styles.paused}>
          ⏸️ أوقف عهد التذكيرات هنا — بلا غرامة، بلا انحياز، بلا أيّ زيادة. الوقت الآن للصلح.
        </Text>
      </Section>

      <Section title="الوثيقة المحايدة">
        <RowGroup>
          <Text style={styles.exhibit}>
            سجلٌّ مختومٌ يحفظ الاتفاق كما كُتب — لا يُعدَّل، ولا ينحاز لطرف.
          </Text>
        </RowGroup>
      </Section>

      <Section title="المسارات">
        {PATHS.map((path) => (
          <RowGroup key={path.key}>
            <View style={styles.path}>
              <View style={styles.pathHeading}>
                <Text style={styles.pathTitle}>
                  {path.icon} {path.ar}
                </Text>
                {path.encouraged ? <StatusChip label="الأحبّ" tone="covenant" /> : null}
              </View>
              <Text style={styles.pathNote}>{path.note}</Text>
            </View>
          </RowGroup>
        ))}
      </Section>

      <AhdButton label="اعرض السجلّ المختوم 🔏" onPress={() => undefined} variant="secondary" />

      <Text style={styles.footnote}>
        المصرف ليس خصمًا ولا حَكَمًا — يشهد، ويحفظ الحقّ بكرامةٍ للطرفين.
      </Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  recordBody: {
    gap: spacing.x2,
    padding: spacing.x3,
  },
  paused: {
    ...typography.secondary,
    padding: spacing.x3,
    color: colors.stopped,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
  exhibit: {
    ...typography.secondary,
    padding: spacing.x3,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
  path: {
    gap: spacing.x1,
    padding: spacing.x3,
  },
  pathHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  pathTitle: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  pathNote: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
  footnote: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
});
