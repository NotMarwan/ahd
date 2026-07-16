import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AppShell,
  EmptyState,
  RowGroup,
  ScreenHeader,
  Section,
  StatusChip,
} from '@/components';
import { deriveMaroofBands, useAhdJourney, usePilot } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

const BAND = {
  documented: { label: 'عهد موثّق محليًا', tone: 'neutral' as const },
  settled: { label: 'وفاء مسجّل', tone: 'verified' as const },
  reconciled: { label: 'صلح مسجّل', tone: 'covenant' as const },
};

export function MaroofScreen() {
  const router = useRouter();
  const { beginCreate, state: journey } = useAhdJourney();
  const { state: pilot } = usePilot();
  const displayName = pilot.profile.displayName;
  const entries = deriveMaroofBands(journey.records, displayName);

  const createAhd = async () => {
    await beginCreate();
    router.push('/create');
  };

  return (
    <AppShell testID="maroof-screen">
      <ScreenHeader
        eyebrow="سجل العلاقة"
        title="سجلّ المعروف"
        subtitle="وصف نوعي لما وثّقته أنت فقط؛ بلا نسبة ثقة، وبلا درجة ائتمانية، وبلا حكم على أحد."
      />

      {!displayName ? (
        <Section>
          <RowGroup>
            <EmptyState title="حدّد اسم العرض" body="يعتمد هذا السجل على اسم العرض المحلي في جهازك." />
          </RowGroup>
          <AhdButton label="افتح الإعدادات" onPress={() => router.push('/settings')} />
        </Section>
      ) : entries.length === 0 ? (
        <Section>
          <RowGroup>
            <EmptyState title="لا يوجد تاريخ محلي بعد" body="يظهر هنا فقط ما نتج عن عهود مختومة شاركت فيها." />
          </RowGroup>
          <AhdButton label="أنشئ أول عهد" onPress={createAhd} />
        </Section>
      ) : (
        <Section title="العلاقات الموثّقة">
          <RowGroup>
            {entries.map((entry) => (
              <View key={entry.recordId} style={styles.row}>
                <View style={styles.heading}>
                  <Text style={styles.name}>{entry.counterpart}</Text>
                  <StatusChip label={BAND[entry.band].label} tone={BAND[entry.band].tone} />
                </View>
                <Text style={styles.meta}>
                  {entry.role === 'lender' ? 'أنت صاحب المال في هذا العهد' : 'أنت المستفيد في هذا العهد'}
                </Text>
                <Text style={styles.id}>{entry.recordId}</Text>
              </View>
            ))}
          </RowGroup>
        </Section>
      )}

      <Text style={styles.disclaimer}>
        لا يُصدَّر هذا الوصف كتصنيف، ولا يُستخدم لمنح المال أو رفضه.
      </Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  heading: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  name: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  meta: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  id: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.technical, writingDirection: 'ltr' },
  disclaimer: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, lineHeight: 20, textAlign: 'right' },
});
