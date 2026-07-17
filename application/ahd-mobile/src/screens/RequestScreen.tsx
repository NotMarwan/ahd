import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AhdButton, AppShell, EmptyState, RowGroup, ScreenHeader, Section, ShowcaseNotice, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { SHOWCASE_DAILY_ENTRIES, SHOWCASE_PROFILE_NAME, SHOWCASE_REQUEST_FORM } from '@/showcase/showcase-data';
import { usePilot } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

function Field({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText(value: string): void;
  keyboardType?: 'default' | 'decimal-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} keyboardType={keyboardType} onChangeText={onChangeText} style={styles.input} value={value} />
    </View>
  );
}

export function RequestScreen() {
  const router = useRouter();
  const { state, store } = usePilot();
  const localBorrower = state.profile.displayName;
  const borrower = localBorrower ?? SHOWCASE_PROFILE_NAME;
  const suggestedLender = borrower === SHOWCASE_REQUEST_FORM.lender
    ? SHOWCASE_PROFILE_NAME
    : SHOWCASE_REQUEST_FORM.lender;
  const storedRequests = state.daily.entries.filter((entry) => entry.kind === 'request');
  const isRequestsShowcase = storedRequests.length === 0;
  const requests = isRequestsShowcase ? SHOWCASE_DAILY_ENTRIES.filter((entry) => entry.kind === 'request') : storedRequests;
  const [lender, setLender] = useState<string>(suggestedLender);
  const [amountText, setAmountText] = useState<string>(SHOWCASE_REQUEST_FORM.amountText);
  const [purpose, setPurpose] = useState<string>(SHOWCASE_REQUEST_FORM.purpose);
  const [effectiveDate, setEffectiveDate] = useState<string>(SHOWCASE_REQUEST_FORM.effectiveDate);
  const [feedback, setFeedback] = useState<string>();
  const partiesClash = lender.trim() === borrower.trim();

  const save = async () => {
    if (!localBorrower || partiesClash) return;
    setFeedback(undefined);
    try {
      await store.saveRequest({
        borrower,
        lender,
        amountMinor: ahdCore.parseSarTextToMinor(amountText),
        purpose,
        effectiveDate,
      });
      setFeedback('حُفظ الطلب محليًا. يحتاج اتصالًا لإرساله للطرف الآخر، ولم يتغيّر أي رصيد.');
    } catch (caught) {
      setFeedback(caught instanceof Error ? caught.message : 'تعذّر حفظ الطلب');
    }
  };

  return (
    <AppShell testID="request-screen">
      <ScreenHeader
        eyebrow="طلب غير مُلزِم"
        title="طلب عهد"
        subtitle="اكتب الطلب بكرامة واحفظه محليًا. لا يستطيع هذا الجهاز قبول الطلب باسم الطرف الآخر."
      />

      <ShowcaseNotice body="حقول الطلب تبدأ بمثال غير محفوظ؛ راجع الطرفين ثم اضغط الحفظ فقط عندما تريد طلبًا محليًا حقيقيًا." />

      {!borrower ? (
        <Section>
          <RowGroup><EmptyState title="حدّد اسم العرض" body="سيظهر اسمك طالبًا للعهد، من دون هوية أو رقم هاتف." /></RowGroup>
          <AhdButton label="افتح الإعدادات" onPress={() => router.push('/settings')} />
        </Section>
      ) : (
        <Section title="طلب جديد">
          <RowGroup>
            <View style={styles.form}>
              <View style={styles.identity}>
                <Text style={styles.label}>طالب العهد</Text>
                <Text style={styles.identityName}>{borrower}</Text>
              </View>
              <Field label="تطلب من" value={lender} onChangeText={setLender} />
              <Field label="المبلغ بالريال" value={amountText} onChangeText={setAmountText} keyboardType="decimal-pad" />
              <Field label="الغرض" value={purpose} onChangeText={setPurpose} />
              <Field label="تاريخ الطلب" value={effectiveDate} onChangeText={setEffectiveDate} />
            </View>
          </RowGroup>
          <AhdButton disabled={!localBorrower || partiesClash} label={localBorrower ? "احفظ الطلب المحلي" : "احفظ اسم العرض أولًا"} onPress={save} />
          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
        </Section>
      )}

      {requests.length > 0 ? (
        <Section title={`طلبات محفوظة · ${requests.length}`}>
          <RowGroup>
            {requests.map((request) => (
              <View key={request.id} style={styles.request}>
                <View style={styles.heading}>
                  <Text style={styles.identityName}>{request.lender}</Text>
                  <StatusChip label="يحتاج اتصالًا" tone="neutral" />
                </View>
                <Text style={styles.meta}>{ahdCore.formatMinorSar(request.amountMinor)} · {request.effectiveDate}</Text>
                <Text style={styles.terms}>{request.termsAr}</Text>
                <Text style={styles.id}>{request.id}</Text>
              </View>
            ))}
          </RowGroup>
        </Section>
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.x3, padding: spacing.x3 },
  field: { gap: spacing.x1 },
  label: { ...typography.label, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  input: { minHeight: controls.minTarget, paddingHorizontal: spacing.x3, paddingVertical: spacing.x2, color: colors.ink, backgroundColor: colors.ground, borderWidth: 1, borderColor: colors.hairline, borderRadius: radii.card, fontFamily: fontFamilies.body, fontSize: 16, textAlign: 'right', writingDirection: 'rtl' },
  identity: { gap: spacing.x1 },
  identityName: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  request: { gap: spacing.x2, padding: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  heading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  meta: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  terms: { ...typography.secondary, color: colors.ink, fontFamily: fontFamilies.body, lineHeight: 21, textAlign: 'right' },
  id: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.technical, writingDirection: 'ltr' },
  feedback: { ...typography.secondary, color: colors.waiting, fontFamily: fontFamilies.body, textAlign: 'right' },
});
