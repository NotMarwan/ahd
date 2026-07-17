import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AhdButton, AmountDisplay, AppShell, EmptyState, RowGroup, ScreenHeader, Section, ShowcaseNotice, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { SHOWCASE_PROFILE_NAME, SHOWCASE_STANDING_RECORD } from '@/showcase/showcase-data';
import { selectRelatedRecords, useAhdJourney, usePilot } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export function StandingScreen() {
  const router = useRouter();
  const { beginCreate, openRecord, state: journey } = useAhdJourney();
  const { state: pilot } = usePilot();
  const localDisplayName = pilot.profile.displayName;
  const realRecords = selectRelatedRecords(journey.records, localDisplayName)
    .filter((entry) => entry.sealed.prepared.open);
  const isShowcase = !localDisplayName || realRecords.length === 0;
  const displayName = localDisplayName ?? SHOWCASE_PROFILE_NAME;
  const records = isShowcase ? [SHOWCASE_STANDING_RECORD] : realRecords;

  const createOpen = async () => {
    await beginCreate();
    router.push('/create');
  };
  const showRecord = async (recordId: string) => {
    await openRecord(recordId);
    router.push(`/record/${recordId}`);
  };

  return (
    <AppShell testID="standing-screen">
      <ScreenHeader
        eyebrow="بلا موعد محدد"
        title="سلفة بالمعروف"
        subtitle="العهود المفتوحة التي شاركت فيها. المعروض أصل موثّق، وليس مبلغًا متبقيًا محسوبًا."
      />

      {isShowcase ? <ShowcaseNotice label="عرض تجريبي" body="سلفة مفتوحة مكتملة الشكل للعرض فقط؛ لا تُحفظ في جهازك." /> : null}

      {!displayName ? (
        <Section>
          <RowGroup><EmptyState title="حدّد اسم العرض" body="لعرض العهود المفتوحة التي تخصّك." /></RowGroup>
          <AhdButton label="افتح الإعدادات" onPress={() => router.push('/settings')} />
        </Section>
      ) : records.length === 0 ? (
        <Section>
          <RowGroup><EmptyState title="لا توجد سلفة مفتوحة" body="أنشئ عهدًا واختر «عهد مفتوح» بوضوح في شروطه." /></RowGroup>
          <AhdButton label="أنشئ عهدًا مفتوحًا" onPress={createOpen} />
        </Section>
      ) : (
        <Section title={`عهود مفتوحة · ${records.length}`}>
          <RowGroup>
            {records.map((entry) => (
              <View key={entry.sealed.record.id} style={styles.record}>
                <View style={styles.heading}>
                  <Text style={styles.parties}>{entry.sealed.record.lender} ← {entry.sealed.record.borrower}</Text>
                  <StatusChip label="متى ما تيسّر" tone="covenant" />
                </View>
                <AmountDisplay label="الأصل الموثّق" value={ahdCore.formatMinorSar(entry.sealed.record.amountMinor)} />
                <Text style={styles.id}>{entry.sealed.record.id}</Text>
                {!isShowcase ? <AhdButton label="افتح العهد" onPress={() => showRecord(entry.sealed.record.id)} variant="quiet" /> : null}
              </View>
            ))}
          </RowGroup>
        </Section>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  record: { gap: spacing.x2, padding: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  heading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  parties: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  id: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.technical, writingDirection: 'ltr' },
});
