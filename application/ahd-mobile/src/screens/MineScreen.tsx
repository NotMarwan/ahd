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
  ShowcaseNotice,
  StatusChip,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { SHOWCASE_PROFILE_NAME, SHOWCASE_RECORDS } from '@/showcase/showcase-data';
import { selectMineRecords, useAhdJourney, usePilot } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export function MineScreen() {
  const router = useRouter();
  const { beginCreate, openRecord, state: journey } = useAhdJourney();
  const { state: pilot } = usePilot();
  const localDisplayName = pilot.profile.displayName;
  const realRecords = selectMineRecords(journey.records, localDisplayName);
  const isShowcase = !localDisplayName || realRecords.length === 0;
  const displayName = localDisplayName ?? SHOWCASE_PROFILE_NAME;
  const records = isShowcase ? selectMineRecords(SHOWCASE_RECORDS, SHOWCASE_PROFILE_NAME) : realRecords;
  const totalDocumentedMinor = records.reduce(
    (sum, entry) => sum + entry.sealed.record.amountMinor,
    0,
  );

  const createAhd = async () => {
    await beginCreate();
    router.push('/create');
  };
  const showRecord = async (recordId: string) => {
    await openRecord(recordId);
    router.push(`/record/${recordId}`);
  };

  return (
    <AppShell testID="mine-screen">
      <ScreenHeader
        eyebrow="دفترك أنت"
        title="ما عليّ"
        subtitle="أصول العهود التي يظهر فيها اسم عرضك كمستفيد. لا ندّعي مبلغًا متبقيًا بلا سجل سداد."
      />

      {isShowcase ? <ShowcaseNotice label="عرض تجريبي" body="نتيجة مكتملة للعرض فقط؛ لا تدخل في سجلات جهازك." /> : null}

      {!displayName ? (
        <Section>
          <RowGroup>
            <EmptyState
              title="حدّد اسم العرض أولًا"
              body="نستخدم اسم عرض محليًا فقط لنعرف أي العهود تخصّك؛ لا نطلب هوية أو هاتفًا."
            />
          </RowGroup>
          <AhdButton label="افتح الإعدادات" onPress={() => router.push('/settings')} />
        </Section>
      ) : records.length === 0 ? (
        <Section>
          <RowGroup>
            <EmptyState
              title="لا يوجد عهد عليك بهذا الاسم"
              body={`لم نجد سجلًا مختومًا يكون فيه «${displayName}» مستفيدًا.`}
            />
          </RowGroup>
          <AhdButton label="أنشئ عهدًا" onPress={createAhd} />
        </Section>
      ) : (
        <>
          <Section title="الأصل الموثّق">
            <AmountDisplay
              label={`${records.length} عهود محلية`}
              value={ahdCore.formatMinorSar(totalDocumentedMinor)}
            />
          </Section>
          <Section title="عهودك">
            <RowGroup>
              {records.map((entry) => (
                <View key={entry.sealed.record.id} style={styles.record}>
                  <View style={styles.heading}>
                    <Text style={styles.party}>لـ {entry.sealed.record.lender}</Text>
                    <StatusChip label="أصل موثّق" tone="covenant" />
                  </View>
                  <AmountDisplay value={ahdCore.formatMinorSar(entry.sealed.record.amountMinor)} />
                  <Text style={styles.meta}>{entry.sealed.record.id}</Text>
                  {!isShowcase ? (
                    <AhdButton
                      label="افتح العهد"
                      onPress={() => showRecord(entry.sealed.record.id)}
                      variant="quiet"
                    />
                  ) : null}
                </View>
              ))}
            </RowGroup>
          </Section>
        </>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  record: {
    gap: spacing.x2,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  heading: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.x2,
  },
  party: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  meta: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.technical,
    writingDirection: 'ltr',
  },
});
