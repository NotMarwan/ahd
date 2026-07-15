import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js') as { toMinor: (amountSAR: number) => number };

type Plan = {
  readonly key: string;
  readonly name: string;
  readonly payer: string;
  readonly priceSAR: number;
  readonly paid: boolean;
  readonly unit: string;
  readonly note: string;
  readonly features: readonly string[];
};

/* Ported verbatim from app/features/billing.js (Billing.PLANS) + app/features/fee-receipt.js. */
const SHARIAH_REVIEW_LABEL = 'قيد المراجعة الشرعيّة';
const LOAN_FREE_AR = 'القرض مجانيٌّ للأبد';
const SERVICE_NOT_LOAN_AR = 'أجرة على الخدمة، لا على القرض';
const SUB_LINE =
  'الخيرُ مجاني، والبنية لها أجرة — كمسجدٍ الصلاةُ فيه مجانيّة وبناؤه مدفوع. كلّ سعرٍ ثابتٌ للخدمة، لا نسبةً من قرض، ولا يزيد بالتأخير.';
const BASIS_LINE =
  'الأساس المعياريّ: أجرةٌ ثابتةٌ بقدر التكلفة المباشرة على عقدٍ منفصل (AAOIFI SS-19: لا ربطَ بالمبلغ، ولا بالمدّة). كلُّ رقمٍ هنا مقترحٌ ' +
  SHARIAH_REVIEW_LABEL +
  ' — لا يُذكر حكمًا مستقرًّا حتى يُعتمد.';

const RECEIPT_TITLE = 'أجرة التوثيق — منفصلةٌ عن القرض';
const RECEIPT_NOTE = 'عقدان منفصلان: القرض الحسن بلا أيّ زيادة، وأجرةٌ ثابتةٌ للخدمة لا تكبر بالمبلغ ولا بالتأخير.';
const RECEIPT_LOAN_INCREASE = 'الزيادة على القرض';
const RECEIPT_FIXED_FEE = 'أجرة توثيقٍ ثابتة';
const FLAT_SEAL_FEE_SAR = 5;

const PLANS: readonly Plan[] = [
  {
    key: 'free',
    name: 'مجاني',
    payer: 'الأفراد',
    priceSAR: 0,
    paid: false,
    unit: '',
    note: 'توثيق العهد وختمه وتسويته — مجانًا للأبد.',
    features: [
      'توثيق العهود وختمها وتسويتها — بلا أيّ رسم',
      'دفترك ومقاصّتك الأساسيّة',
      'البيّنة المحايدة عند الحاجة — مجانًا',
    ],
  },
  {
    key: 'plus',
    name: 'دفتري بلس',
    payer: 'الأفراد',
    priceSAR: 12,
    paid: true,
    unit: 'لكلّ شهر',
    note: 'ميزاتٌ غير-قرضيّة فقط — توثيق القرض يبقى مجانيًّا.',
    features: ['دوائر بلا حدّ', 'تحليلاتٌ مفصّلة', 'تذكيراتٌ بإيقاعٍ مخصّص', 'تصديرٌ أولويٌّ للوثائق'],
  },
  {
    key: 'circle',
    name: 'الدائرة',
    payer: 'منظّم الدائرة',
    priceSAR: 19,
    paid: true,
    unit: 'لكلّ دائرة/شهر',
    note: 'يدفعها المنظّم، لا المقترضون.',
    features: ['مقاصّةٌ جماعيّة', 'قسمةٌ تلقائيّة بالأصناف', 'إدارة العهود المتكرّرة'],
  },
  {
    key: 'org',
    name: 'المؤسسة · الوقف',
    payer: 'جمعيّة / جهة عمل / مكتب عائلي',
    priceSAR: 2900,
    paid: true,
    unit: 'لكلّ شهر (أو ٤ ر.س لكلّ مقعد)',
    note: 'أجرةٌ على البرمجيّة يدفعها الكيان — لا تُنتزَع من قرضِ أحد.',
    features: ['إدارة صندوق قرضٍ حسن', 'عهود الأجور (مساند)', 'توثيقٌ بالجملة', 'تقرير الأثر المجهّل'],
  },
  {
    key: 'bank',
    name: 'ترخيص المصرف (white-label)',
    payer: 'مصرف / منشأة تقنيّة ماليّة',
    priceSAR: 250000,
    paid: true,
    unit: 'لكلّ سنة + ~١–٣ ر.س لكلّ ختم',
    note: 'المصرف يشغّله لعملائه كمنتج ولاءٍ مجاني — والقرض يبقى مجانيًّا.',
    features: ['المحرّك كاملًا (توثيق + مقاصّة مختومة)', 'بندٌ يمنع الربا والغرامة والتصنيف', 'تشغيلٌ باسم المصرف'],
  },
];

function money(sar: number): string {
  return ahdCore.formatMinorSar(engine.toMinor(sar));
}

function PlanCard({ plan }: { readonly plan: Plan }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{plan.name}</Text>
      <Text style={styles.payer}>
        {'يدفعها: '}
        {plan.payer}
      </Text>
      {plan.paid ? (
        <Text style={styles.price}>
          {money(plan.priceSAR)}
          {' · '}
          {plan.unit}
        </Text>
      ) : (
        <Text style={styles.priceFree}>مجانًا — للأبد</Text>
      )}
      {plan.features.map((feature) => (
        <Text key={feature} style={styles.feature}>
          {'· '}
          {feature}
        </Text>
      ))}
      <Text style={styles.note}>{plan.note}</Text>
      <Text style={styles.free}>{LOAN_FREE_AR}</Text>
      <StatusChip
        label={plan.paid ? `🕋 ${SHARIAH_REVIEW_LABEL}` : '✓ بلا رسم'}
        tone={plan.paid ? 'covenant' : 'verified'}
      />
    </View>
  );
}

export function PlansScreen() {
  return (
    <AppShell testID="plans-screen">
      <ScreenHeader eyebrow="🧾 الأجرة والخطط" title="الأجرة والخطط" subtitle={SUB_LINE} />
      <Text style={styles.thesis}>
        {SERVICE_NOT_LOAN_AR}
        {' · '}
        {LOAN_FREE_AR}
      </Text>
      <Section title={RECEIPT_TITLE}>
        <RowGroup>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{RECEIPT_LOAN_INCREASE}</Text>
            <Text style={styles.receiptValueZero}>{money(0)}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{RECEIPT_FIXED_FEE}</Text>
            <Text style={styles.receiptValue}>{money(FLAT_SEAL_FEE_SAR)}</Text>
          </View>
        </RowGroup>
        <Text style={styles.note}>{RECEIPT_NOTE}</Text>
        <StatusChip label={`🕋 ${SHARIAH_REVIEW_LABEL}`} tone="covenant" />
      </Section>
      <Section title="الخطط">
        <RowGroup>
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} />
          ))}
        </RowGroup>
      </Section>
      <Text style={styles.basis}>{BASIS_LINE}</Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  thesis: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  card: {
    gap: 4,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  name: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  payer: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  price: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  priceFree: {
    ...typography.row,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  feature: {
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
  },
  free: {
    ...typography.secondary,
    color: colors.accent,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  receiptRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  receiptLabel: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  receiptValue: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
  },
  receiptValueZero: {
    ...typography.row,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
  },
  basis: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
