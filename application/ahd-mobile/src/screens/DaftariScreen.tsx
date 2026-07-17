import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AmountDisplay,
  AppShell,
  RowGroup,
  ScreenHeader,
  Section,
  ShowcaseNotice,
  StatusChip,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { SHOWCASE_RECORDS } from '@/showcase/showcase-data';
import { useAhdJourney } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export function DaftariScreen() {
  const router = useRouter();
  const { beginCreate, openRecord, state } = useAhdJourney();
  const isShowcase = state.records.length === 0;
  const records = isShowcase ? SHOWCASE_RECORDS : state.records;

  const createAhd = async () => {
    await beginCreate();
    router.push('/create');
  };

  const showRecord = async (recordId: string) => {
    await openRecord(recordId);
    router.push(`/record/${recordId}`);
  };

  return (
    <AppShell testID="daftari-screen">
      <ScreenHeader
        eyebrow="دفتري"
        title="عهودك في مكان واحد"
        subtitle="تظهر هنا العهود المختومة التي شاركت فيها، من غير درجة ائتمانية."
      />

      {isShowcase ? (
        <ShowcaseNotice
          label="عرض تجريبي"
          body="ثلاثة عهود مكتملة الشكل للعرض فقط. أول عهد حقيقي تحفظه سيحلّ محلها فورًا."
        />
      ) : null}

      <Section title={`${isShowcase ? 'عهود جاهزة للاستعراض' : 'العهود المحفوظة'} · ${records.length}`}>
        <RowGroup>
          {records.map((entry) => (
            <View key={entry.sealed.record.id} style={styles.record}>
              <View style={styles.heading}>
                <Text style={styles.id}>{entry.sealed.record.id}</Text>
                <StatusChip
                  label={isShowcase ? 'مثال غير محفوظ' : entry.source === 'local' ? 'مختوم محليًا' : 'مستورد ومتحقق'}
                  tone={isShowcase ? 'covenant' : 'verified'}
                />
              </View>
              <Text style={styles.parties}>
                {entry.sealed.record.lender} ← {entry.sealed.record.borrower}
              </Text>
              <AmountDisplay value={ahdCore.formatMinorSar(entry.sealed.record.amountMinor)} />
              {!isShowcase ? (
                <AhdButton
                  label="فتح تفاصيل العهد"
                  onPress={() => showRecord(entry.sealed.record.id)}
                  testID="daftari-open-record"
                  variant="quiet"
                />
              ) : null}
            </View>
          ))}
        </RowGroup>
      </Section>

      {isShowcase ? <AhdButton label="أنشئ عهدًا حقيقيًا" onPress={createAhd} /> : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  record: { gap: spacing.x2, padding: spacing.x3 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  id: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.technical, textAlign: 'right' },
  parties: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
});
