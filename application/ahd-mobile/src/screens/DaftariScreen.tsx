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

export function DaftariScreen() {
  const router = useRouter();
  const { beginCreate, openRecord, state } = useAhdJourney();
  const sealed = state.sealed;

  const createAhd = async () => {
    await beginCreate();
    router.push('/create');
  };

  const showRecord = async () => {
    if (!sealed) return;
    await openRecord();
    router.push(`/record/${sealed.record.id}`);
  };

  return (
    <AppShell testID="daftari-screen">
      <ScreenHeader
        eyebrow="دفتري"
        title="عهودك في مكان واحد"
        subtitle="تظهر هنا العهود المختومة التي شاركت فيها، من غير درجة ائتمانية."
      />

      {!sealed ? (
        <Section>
          <RowGroup>
            <EmptyState
              title="لا يوجد عهد مختوم بعد"
              body="أنشئ أول عهد، وافحص شروطه، ثم اختمه ليظهر هنا."
            />
          </RowGroup>
          <AhdButton label="أنشئ عهدًا" onPress={createAhd} />
        </Section>
      ) : (
        <Section title="العهد النشط">
          <RowGroup>
            <View style={styles.record}>
              <View style={styles.heading}>
                <Text style={styles.id}>{sealed.record.id}</Text>
                <StatusChip label="مختوم" tone="verified" />
              </View>
              <Text style={styles.parties}>
                {sealed.record.lender} ← {sealed.record.borrower}
              </Text>
              <AmountDisplay value={ahdCore.formatMinorSar(sealed.record.amountMinor)} />
              <AhdButton label="فتح تفاصيل العهد" onPress={showRecord} variant="quiet" />
            </View>
          </RowGroup>
        </Section>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  record: {
    gap: spacing.x2,
    padding: spacing.x3,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  id: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  parties: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
