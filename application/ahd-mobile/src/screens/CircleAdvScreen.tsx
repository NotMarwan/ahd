import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AhdButton, AppShell, EmptyState, RowGroup, ScreenHeader, Section, ShowcaseNotice, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { SHOWCASE_CIRCLE, SHOWCASE_DATE, SHOWCASE_SETTLEMENT } from '@/showcase/showcase-data';
import { previewCircleNetting, usePilot } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

export function CircleAdvScreen() {
  const router = useRouter();
  const { state, store } = usePilot();
  const storedActiveCircles = state.jamiya.circles.filter((circle) => circle.status === 'active');
  const isShowcase = storedActiveCircles.length === 0;
  const activeCircles = isShowcase ? [SHOWCASE_CIRCLE] : storedActiveCircles;
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(SHOWCASE_DATE);
  const [feedback, setFeedback] = useState<string>();
  const preview = (() => {
    try {
      return isShowcase
        ? SHOWCASE_SETTLEMENT
        : activeCircles.length > 0 ? previewCircleNetting(activeCircles) : undefined;
    } catch {
      return undefined;
    }
  })();

  const confirm = async () => {
    if (isShowcase) return;
    setFeedback(undefined);
    try {
      await store.confirmCircleNetting(
        activeCircles.map((circle) => circle.id),
        consentConfirmed,
        effectiveDate,
      );
      setFeedback('حُفظ إيصال التخطيط محليًا؛ لم تُنقل أموال ولم يتغيّر رصيد.');
    } catch (caught) {
      setFeedback(caught instanceof Error ? caught.message : 'تعذّر حفظ الإيصال');
    }
  };

  return (
    <AppShell testID="circle-adv-screen">
      <ScreenHeader
        eyebrow="اقتراح فقط"
        title="الدائرة+"
        subtitle="معاينة تسوية لالتزامات الجولة الحالية. الحفظ إيصال تخطيط محلي، وليس تحويلًا ماليًا."
      />

      <ShowcaseNotice
        body={isShowcase
          ? 'تسوية 9 إلى 2 جاهزة للعرض فقط؛ لا يُحفظ إيصال ولا تُنقل أموال.'
          : 'تاريخ الإيصال معبأ كمثال؛ المعاينة من دوائرك الحقيقية ولا يُحفظ شيء قبل الإقرار والضغط.'}
      />

      {!preview || preview.beforeCount === 0 ? (
        <Section>
          <RowGroup><EmptyState title="لا توجد التزامات دائرة جاهزة" body="فعّل جمعية بموافقات مسجّلة لتظهر المعاينة." /></RowGroup>
          <AhdButton label="افتح الجمعية" onPress={() => router.push('/jamiya')} />
        </Section>
      ) : (
        <>
          <Section title={`قبل التسوية · ${preview.beforeCount}`}>
            <RowGroup>
              {preview.before.map((transfer, index) => (
                <View key={`${transfer.from}-${transfer.to}-${index}`} style={styles.row}>
                  <Text style={styles.transfer}>{transfer.from} ← {transfer.to}</Text>
                  <Text style={styles.amount}>{ahdCore.formatMinorSar(transfer.amountMinor)}</Text>
                </View>
              ))}
            </RowGroup>
          </Section>
          <Section title={`بعد التسوية · ${preview.afterCount}`}>
            <RowGroup>
              {preview.after.map((transfer, index) => (
                <View key={`${transfer.from}-${transfer.to}-${index}`} style={styles.row}>
                  <Text style={styles.transfer}>{transfer.from} ← {transfer.to}</Text>
                  <Text style={styles.amount}>{ahdCore.formatMinorSar(transfer.amountMinor)}</Text>
                </View>
              ))}
            </RowGroup>
            <StatusChip label={preview.conserved ? 'القيمة محفوظة حسابيًا' : 'المعاينة متوقفة'} tone={preview.conserved ? 'verified' : 'neutral'} />
          </Section>
          {!isShowcase ? (
            <Section title="إيصال التخطيط">
              <TextInput
                accessibilityLabel="تاريخ إيصال التسوية"
                onChangeText={setEffectiveDate}
                placeholder="YYYY-MM-DD"
                style={styles.input}
                value={effectiveDate}
              />
              <Pressable
                accessibilityLabel="أؤكد موافقة أصحاب الدوائر على حفظ الاقتراح"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: consentConfirmed }}
                onPress={() => setConsentConfirmed((value) => !value)}
                style={[styles.consent, consentConfirmed && styles.consentChecked]}
              >
                <Text style={styles.consentText}>أؤكد أن الموافقات أُخذت خارج التطبيق لحفظ هذا الاقتراح فقط</Text>
              </Pressable>
              <AhdButton disabled={!consentConfirmed} label="احفظ إيصال التخطيط" onPress={confirm} />
              {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
            </Section>
          ) : null}
        </>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.x1, padding: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  transfer: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  amount: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.technical, writingDirection: 'ltr' },
  input: { minHeight: controls.minTarget, paddingHorizontal: spacing.x3, borderWidth: 1, borderColor: colors.hairline, borderRadius: radii.card, color: colors.ink, backgroundColor: colors.ground, fontFamily: fontFamilies.technical, writingDirection: 'ltr' },
  consent: { minHeight: controls.minTarget, padding: spacing.x3, borderWidth: 1, borderColor: colors.hairline, borderRadius: radii.card, justifyContent: 'center', backgroundColor: colors.ground },
  consentChecked: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  consentText: { ...typography.secondary, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  feedback: { ...typography.secondary, color: colors.waiting, fontFamily: fontFamilies.body, textAlign: 'right' },
});
