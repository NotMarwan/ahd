import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section, ShowcaseNotice } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { SHOWCASE_JAMIYA, SHOWCASE_RECORDS } from '@/showcase/showcase-data';
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
  const { state: journey } = useAhdJourney();
  const { state: pilot } = usePilot();
  const realImpact = derivePilotImpact(journey.records, pilot.jamiya);
  const isShowcase = realImpact.documentedCount === 0 && realImpact.circleCount === 0;
  const impact = isShowcase
    ? derivePilotImpact(SHOWCASE_RECORDS, SHOWCASE_JAMIYA)
    : realImpact;

  return (
    <AppShell testID="impact-screen">
      <ScreenHeader
        title="أثر عهد"
        subtitle={isShowcase
          ? 'صورة تجريبية توضّح أفضل شكل للنتيجة؛ لا تمثل استخدامًا حقيقيًا.'
          : 'مجاميعُ محسوبةٌ من سجلّات هذا الجهاز فقط — لا مسح ميدانيّ ولا توقّعات.'}
      />
      {isShowcase ? (
        <ShowcaseNotice body="مجاميع مشتقة من العهود والجمعية التجريبية فقط، ولا تُحسب ضمن بيانات جهازك." />
      ) : null}
      <Section title={isShowcase ? 'النتيجة التجريبية' : 'ما وُثّق على هذا الجهاز'}>
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
        <Section title="الدوائر والتسوية">
          <RowGroup>
            <ImpactCard label="دائرةً محليّة" value={String(impact.circleCount)} />
            <ImpactCard label="إيصال تسويةٍ موثّق" value={String(impact.nettingReceiptCount)} />
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
        {isShowcase
          ? 'هذه الأرقام ثابتة ومعلّمة للعرض؛ أول بيانات محلية حقيقية تستبدلها.'
          : 'كلّ رقمٍ أعلاه مُشتقٌّ لحظيًّا من سجلّات هذا الجهاز فقط — لا تجميع خارجيًّا، ولا اسمَ فردٍ ولا تصنيف.'}
      </Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.x1, padding: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline, alignItems: 'flex-end' },
  cardValue: { ...typography.amount, color: colors.ink, fontFamily: fontFamilies.display, textAlign: 'right' },
  cardLabel: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  note: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right', lineHeight: 20 },
});
