import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AhdButton, AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

type FieldProps = {
  label: string;
  value: string;
  onChangeText(value: string): void;
  keyboardType?: 'default' | 'decimal-pad';
};

function Field({ label, value, onChangeText, keyboardType = 'default' }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

function buildTermsAr(borrower: string, lender: string, amountText: string): string {
  return `يطلب ${borrower} من ${lender} مبلغ ${amountText} ر.س قرضًا حسنًا، يُرَدّ مثله دون أيّ زيادة أو فائدة أو غرامة.`;
}

export function RequestScreen() {
  const router = useRouter();
  const [borrower] = useState('أنت');
  const [lender, setLender] = useState('نورة');
  const [amountText, setAmountText] = useState('500');
  const [sent, setSent] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let amountMinor: number | null = null;
  try {
    amountMinor = ahdCore.parseSarTextToMinor(amountText);
  } catch {
    amountMinor = null;
  }

  const termsAr = buildTermsAr(borrower, lender, amountText);
  const screening = ahdCore.screenTerms(termsAr);
  const clean = screening.verdict === 'clean' && amountMinor !== null;

  const send = () => {
    setError(null);
    if (!clean) {
      setError('راجع الشروط قبل الإرسال');
      return;
    }
    setSent(true);
  };

  const accept = () => {
    setAccepted(true);
  };

  const openDaftari = () => {
    router.push('/daftari');
  };

  return (
    <AppShell testID="request-screen">
      <ScreenHeader
        eyebrow="اطلب عهدًا · قرضٌ حسن"
        title="أنت تطلب — وعهدٌ يكتبها بكرامة"
        subtitle="لا حرج في أن تسأل، والكلمة محفوظة."
      />

      {!sent ? (
        <Section title="الأطراف والمبلغ">
          <RowGroup>
            <View style={styles.form}>
              <Field label="المُقترِض (أنت)" value={borrower} onChangeText={() => undefined} />
              <Field label="تطلب من" value={lender} onChangeText={setLender} />
              <Field
                label="المبلغ بالريال"
                value={amountText}
                onChangeText={setAmountText}
                keyboardType="decimal-pad"
              />
            </View>
          </RowGroup>
        </Section>
      ) : null}

      <Section title="الشروط (صياغة علّام · محاكاة)">
        <RowGroup>
          <Text style={styles.terms}>{termsAr}</Text>
        </RowGroup>
        <StatusChip
          label={
            clean
              ? 'النصّ سليم — قرضٌ حسن بلا ربا، ولا غرامة، ولا أيّ زيادة'
              : 'يحتاج تصحيحًا'
          }
          tone={clean ? 'verified' : 'stopped'}
        />
      </Section>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {accepted ? (
        <Section title="النتيجة">
          <RowGroup>
            <View style={styles.accepted}>
              <Text style={styles.acceptedText}>
                ✓ وافق {lender} — خُتم العهد وأُضيف إلى دفترك («عليّ») 🤍
              </Text>
            </View>
          </RowGroup>
          <AhdButton label="افتح دفتري · «عليّ»" onPress={openDaftari} />
        </Section>
      ) : sent ? (
        <Section title="بانتظار الموافقة">
          <Text style={styles.terms}>أُرسل الطلب — بانتظار موافقة {lender}.</Text>
          <AhdButton label={`وافق ${lender} على العهد 🤍`} onPress={accept} variant="secondary" />
        </Section>
      ) : (
        <Section>
          <AhdButton disabled={!clean} label="أرسِل الطلب بالمعروف" onPress={send} />
          <Text style={styles.note}>
            الطلب لا يُلزم أحدًا — للمُقرض أن يوافق أو يعتذر بلا حرج.
          </Text>
        </Section>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.x3,
    padding: spacing.x3,
  },
  field: {
    gap: spacing.x1,
  },
  label: {
    ...typography.label,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  input: {
    minHeight: controls.minTarget,
    paddingHorizontal: spacing.x3,
    paddingVertical: spacing.x2,
    color: colors.ink,
    backgroundColor: colors.ground,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    borderRadius: radii.card,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  terms: {
    ...typography.secondary,
    padding: spacing.x3,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    lineHeight: 21,
    textAlign: 'right',
  },
  error: {
    ...typography.secondary,
    color: colors.stopped,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  accepted: {
    padding: spacing.x3,
  },
  acceptedText: {
    ...typography.row,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  note: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
