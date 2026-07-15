import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

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

const PROTOTYPE_ID = 'AHD-MOBILE-001';
const PROTOTYPE_TIMESTAMP = '2026-07-01T10:00:00+03:00';

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

export function CreateAhdScreen() {
  const router = useRouter();
  const { beginCreate, openDaftari, reviewDraftFromForm, seal, state } = useAhdJourney();
  const [lender, setLender] = useState('نورة');
  const [borrower, setBorrower] = useState('سارة');
  const [amountSarText, setAmountSarText] = useState('1200');
  const [purpose, setPurpose] = useState('قرض حسن لتجهيز المنزل');
  const [error, setError] = useState<string | null>(null);

  const review = async () => {
    setError(null);
    try {
      if (state.step !== 'create') await beginCreate();
      await reviewDraftFromForm({
        id: PROTOTYPE_ID,
        lender,
        borrower,
        amountSarText,
        months: 4,
        open: false,
        start: { y: 2026, m: 7 },
        timestamp: PROTOTYPE_TIMESTAMP,
        purpose,
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
          <Text style={styles.prototype}>إثبات محلي حتمي للنموذج الأولي</Text>
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
  prototype: {
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
