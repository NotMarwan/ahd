import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AhdButton,
  AmountDisplay,
  AppShell,
  RowGroup,
  ScreenHeader,
  SealedDocument,
  Section,
  StatusChip,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { useAhdJourney } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

type FieldProps = {
  label: string;
  value: string;
  onChangeText(value: string): void;
  keyboardType?: 'default' | 'decimal-pad' | 'number-pad';
  editable?: boolean;
  placeholder?: string;
};

function Field({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  editable = true,
  placeholder,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        editable={editable}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, !editable && styles.inputDisabled]}
        value={value}
      />
    </View>
  );
}

function parseMonth(value: string): { y: number; m: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  return y >= 1 && m >= 1 && m <= 12 ? { y, m } : null;
}

function isValidDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function CreateAhdScreen() {
  const router = useRouter();
  const { beginCreate, openDaftari, reviewDraftFromForm, seal, state, store } = useAhdJourney();
  const [lender, setLender] = useState('');
  const [borrower, setBorrower] = useState('');
  const [amountSarText, setAmountSarText] = useState('');
  const [purpose, setPurpose] = useState('');
  const [repaymentMode, setRepaymentMode] = useState<'scheduled' | 'open'>('scheduled');
  const [monthsText, setMonthsText] = useState('');
  const [firstDueMonth, setFirstDueMonth] = useState('');
  const [agreementDate, setAgreementDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const review = async () => {
    setError(null);
    try {
      const normalizedLender = lender.trim();
      const normalizedBorrower = borrower.trim();
      if (!normalizedLender || !normalizedBorrower || !amountSarText.trim()) {
        setError('اكتب اسمي العرض والمبلغ قبل فحص الشروط.');
        return;
      }
      if (normalizedLender === normalizedBorrower) {
        setError('اختر اسمي عرض مختلفين للطرفين.');
        return;
      }
      if (!isValidDate(agreementDate.trim())) {
        setError('اكتب تاريخ الاتفاق بصيغة YYYY-MM-DD.');
        return;
      }
      const agreementMonth = parseMonth(agreementDate.trim().slice(0, 7));
      if (!agreementMonth) {
        setError('تاريخ الاتفاق غير صالح.');
        return;
      }
      const open = repaymentMode === 'open';
      const months = open ? 0 : Number(monthsText.trim());
      const start = open ? agreementMonth : parseMonth(firstDueMonth.trim());
      if (!open && (!/^\d+$/.test(monthsText.trim()) || !Number.isInteger(months) || months < 1 || months > 60)) {
        setError('عدد أشهر السداد يجب أن يكون بين 1 و60.');
        return;
      }
      if (!start) {
        setError('اكتب شهر أول استحقاق بصيغة YYYY-MM.');
        return;
      }
      if (state.step !== 'create') await beginCreate();
      await reviewDraftFromForm({
        id: store.nextDraftId(),
        lender: normalizedLender,
        borrower: normalizedBorrower,
        amountSarText,
        months,
        open,
        start,
        timestamp: `${agreementDate.trim()}T00:00:00+03:00`,
        purpose: purpose.trim(),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذّر فحص البيانات');
    }
  };

  const sealAhd = async () => {
    setError(null);
    try {
      await seal();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذّر ختم العهد');
    }
  };

  const showDaftari = async () => {
    await openDaftari();
    router.push('/daftari');
  };

  const prepared = state.prepared;
  const screening = state.screening;
  const isReview = state.step === 'riba_check' && prepared && screening;
  const sealed = state.sealed;

  return (
    <AppShell testID="create-ahd-screen">
      <ScreenHeader
        eyebrow="أنشئ عهدًا"
        title={sealed ? 'تم حفظ الكلمة' : isReview ? 'راجع قبل الختم' : 'اكتب تفاصيل العهد'}
        subtitle="يظهر الفحص قبل الختم، ولا تُضاف فائدة أو غرامة على أصل القرض."
      />

      {!isReview && !sealed ? (
        <Section title="الأطراف والمبلغ">
          <RowGroup>
            <View style={styles.form}>
              <Field label="صاحب المال" value={lender} onChangeText={setLender} />
              <Field label="المستفيد" value={borrower} onChangeText={setBorrower} />
              <Field
                label="مبلغ العهد بالريال"
                value={amountSarText}
                onChangeText={setAmountSarText}
                keyboardType="decimal-pad"
              />
              <Field label="غرض العهد" value={purpose} onChangeText={setPurpose} />
              <View accessibilityRole="radiogroup" style={styles.modeGroup}>
                <Text style={styles.label}>طريقة السداد</Text>
                <View style={styles.modeRow}>
                  <Pressable
                    accessibilityLabel="سداد مجدول"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: repaymentMode === 'scheduled' }}
                    onPress={() => setRepaymentMode('scheduled')}
                    style={[styles.modeChoice, repaymentMode === 'scheduled' && styles.modeChoiceSelected]}
                  >
                    <Text style={styles.modeText}>سداد مجدول</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel="عهد مفتوح"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: repaymentMode === 'open' }}
                    onPress={() => setRepaymentMode('open')}
                    style={[styles.modeChoice, repaymentMode === 'open' && styles.modeChoiceSelected]}
                  >
                    <Text style={styles.modeText}>عهد مفتوح</Text>
                  </Pressable>
                </View>
              </View>
              <Field
                editable={repaymentMode === 'scheduled'}
                keyboardType="number-pad"
                label="عدد أشهر السداد"
                onChangeText={setMonthsText}
                value={monthsText}
              />
              <Field
                editable={repaymentMode === 'scheduled'}
                label="شهر أول استحقاق"
                onChangeText={setFirstDueMonth}
                placeholder="YYYY-MM"
                value={firstDueMonth}
              />
              <Field
                label="تاريخ الاتفاق"
                onChangeText={setAgreementDate}
                placeholder="YYYY-MM-DD"
                value={agreementDate}
              />
            </View>
          </RowGroup>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <AhdButton label="فحص الشروط" onPress={review} />
        </Section>
      ) : null}

      {isReview && prepared && screening ? (
        <Section title="نتيجة الفحص">
          <StatusChip
            label={screening.verdict === 'clean' ? 'خالي من الزيادة المشروطة' : 'متوقف'}
            tone={screening.verdict === 'clean' ? 'verified' : 'stopped'}
          />
          <Text style={styles.verdict}>الشروط خالية من الزيادة المشروطة</Text>
          <AmountDisplay
            label="أصل القرض"
            value={ahdCore.formatMinorSar(prepared.amountMinor)}
          />
          <RowGroup>
            <Text style={styles.terms}>{prepared.termsAr}</Text>
          </RowGroup>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <AhdButton
            disabled={screening.verdict !== 'clean'}
            label="اختم العهد"
            onPress={sealAhd}
          />
        </Section>
      ) : null}

      {sealed ? (
        <Section title="الختم المحلي">
          <SealedDocument
            title="عهد موثّق"
            verdict="الختم مطابق للمحتوى"
            technicalDetails={`seal: ${sealed.seal}\ncanonicalHash: ${sealed.canonicalHash}`}
          />
          <Text style={styles.localProof}>إثبات محلي حتمي ومحفوظ على هذا الجهاز</Text>
          <Text style={styles.disclaimer}>
            لا يمثّل هذا الختم نفاذًا أو ختمًا زمنيًا خارجيًا أو توقيع جهة مصدرة.
          </Text>
          <AhdButton label="افتح دفتري" onPress={showDaftari} />
        </Section>
      ) : null}
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
  inputDisabled: {
    backgroundColor: colors.cardSecondary,
    color: colors.inkSecondary,
  },
  modeGroup: {
    gap: spacing.x2,
  },
  modeRow: {
    flexDirection: 'row-reverse',
    gap: spacing.x2,
  },
  modeChoice: {
    flex: 1,
    minHeight: controls.minTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.x2,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.card,
    backgroundColor: colors.ground,
  },
  modeChoiceSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  modeText: {
    ...typography.label,
    color: colors.ink,
    fontFamily: fontFamilies.body,
  },
  verdict: {
    ...typography.row,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  terms: {
    ...typography.secondary,
    minHeight: 72,
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
  localProof: {
    ...typography.row,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  disclaimer: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
});
