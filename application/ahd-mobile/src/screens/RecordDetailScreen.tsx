import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AmountDisplay,
  AppShell,
  EmptyState,
  RowGroup,
  ScreenHeader,
  SealedDocument,
  Section,
  StatusChip,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { useAhdJourney } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export function RecordDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { openRecord, state, verifyProof } = useAhdJourney();
  const requestedId = Array.isArray(params.id) ? params.id[0] : params.id;
  const selectedEntry = requestedId
    ? state.records.find((entry) => entry.sealed.record.id === requestedId)
    : state.records.find((entry) => entry.sealed.record.id === state.activeRecordId);
  const sealed = selectedEntry?.sealed ?? (!requestedId ? state.sealed : undefined);

  const showProof = async () => {
    if (sealed && state.activeRecordId !== sealed.record.id) await openRecord(sealed.record.id);
    await verifyProof();
    router.push('/proof');
  };

  return (
    <AppShell testID="record-detail-screen">
      <ScreenHeader eyebrow="تفاصيل العهد" title={sealed?.record.id ?? 'لا يوجد عهد'} />

      {!sealed ? (
        <RowGroup>
          <EmptyState title="لا توجد تفاصيل لعرضها" body="ارجع إلى دفتري واختر عهدًا مختومًا." />
        </RowGroup>
      ) : (
        <>
          <Section title="الأصل والأطراف">
            <RowGroup>
              <View style={styles.summary}>
                <StatusChip label="الختم سليم" tone="verified" />
                <AmountDisplay
                  label="أصل القرض"
                  value={ahdCore.formatMinorSar(sealed.record.amountMinor)}
                />
                <Text style={styles.row}>صاحب المال: {sealed.record.lender}</Text>
                <Text style={styles.row}>المستفيد: {sealed.record.borrower}</Text>
              </View>
            </RowGroup>
          </Section>

          <Section title="وثيقة العهد">
            <SealedDocument
              title="كلمتك محفوظة"
              verdict="الختم مطابق للسجل"
              technicalDetails={`seal: ${sealed.seal}\ncanonicalHash: ${sealed.canonicalHash}`}
            />
          </Section>

          <Section>
            <AhdButton label="فتح المقاصّة" onPress={() => router.push('/settle')} />
            <AhdButton label="التحقق من الإثبات" onPress={showProof} variant="secondary" />
          </Section>
        </>
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
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
