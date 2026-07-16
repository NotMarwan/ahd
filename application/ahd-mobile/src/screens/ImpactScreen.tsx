import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AhdButton, AppShell, EmptyState, RowGroup, ScreenHeader, Section } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { derivePilotImpact, useAhdJourney, usePilot } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

function ImpactCard({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export function ImpactScreen() {
  const router = useRouter();
  const { beginCreate, state: journey } = useAhdJourney();
  const { state: pilot } = usePilot();
  const impact = derivePilotImpact(journey.records, pilot.jamiya);

  const createAhd = async () => {
    await beginCreate();
    router.push('/create');
  };

  if (impact.documentedCount === 0 && impact.circleCount === 0) {
    return (
      <AppShell testID="impact-screen">
        <ScreenHeader
          title="أثر عهد"
          subtitle="الأثر هنا يُقاس من سجلّات هذا الجهاز فقط — لا نعرض أرقامًا لم تحدث."
        />
        <Section>
          <RowGroup>
            <EmptyState
              title="لا أثر بعد"
              body="حين تُنشئ أول عهد مختوم على هذا الجهاز، تظهر مجاميعه هنا كما هي — بلا تجميل."
            />
          </RowGroup>
          <AhdButton label="أنشئ عهدًا" onPress={createAhd} />
        </Section>
      </AppShell>
    );
  }

  return (
    <AppShell testID="impact-screen">
      <ScreenHeader
        title="أثر عهد"
        subtitle="مجاميعُ محسوبةٌ من سجلّات هذا الجهاز فقط — لا مسح ميدانيّ ولا توقّعات."
      />
      <Section title="ما وُثّق على هذا الجهاز">
        <RowGroup>
          <ImpactCard label="التزامًا موثّقًا" value={String(impact.documentedCount)} />
          <ImpactCard
            label="قيمةٌ موثّقةٌ عبر الشهادة"
            value={ahdCore.formatMinorSar(impact.documentedMinor)}
          />
          <ImpactCard label="ذمّةٌ أُقفلت تسويةً أو صلحًا" value={String(impact.clearedCount)} />
        </RowGroup>
      </Section>
      {impact.circleCount > 0 ? (
        <Section title="الدوائر والمقاصّة">
          <RowGroup>
            <ImpactCard label="دائرةً محليّة" value={String(impact.circleCount)} />
            <ImpactCard label="إيصال مقاصّةٍ موثّق" value={String(impact.nettingReceiptCount)} />
            {impact.nettingReceiptCount > 0 ? (
              <ImpactCard
                label={`تحويلًا اختُصر إلى ${impact.transfersAfter}`}
                value={String(impact.transfersBefore)}
              />
            ) : null}
          </RowGroup>
        </Section>
      ) : null}
      <Text style={styles.note}>
        كلّ رقمٍ أعلاه مُشتقٌّ لحظيًّا من سجلّات هذا الجهاز فقط — لا تجميع خارجيًّا، ولا اسمَ فردٍ
        ولا تصنيف.
      </Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
    alignItems: 'flex-end',
  },
  cardValue: {
    ...typography.amount,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    textAlign: 'right',
  },
  cardLabel: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  note: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
    lineHeight: 20,
  },
});
