import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section } from '@/components';
import { colors, fontFamilies, spacing, typography } from '@/theme';

type BoundItem = {
  readonly text: string;
  readonly enforcedBy: string;
};

type BoundSection = {
  readonly key: string;
  readonly titleAr: string;
  readonly items: readonly BoundItem[];
};

/* Ported verbatim from app/features/bounds.js (Bounds.SECTIONS / describeAr). */
const HERO_LINE =
  'ضماناتٌ مكتوبةٌ في الكود، لا في الشعارات — كلُّ بندٍ أدناه يحرسه ملفٌّ حقيقيٌّ باسمه، تقرؤه وتشغّله بنفسك.';
const FOOTER_LINE = 'كلُّ بندٍ أعلاه يحرسه اختبارٌ آليٌّ يعمل دون إنترنت — اطلب تشغيله.';
const RUN_CMD = 'cd tests && node run-all.cjs';

const SECTIONS: readonly BoundSection[] = [
  {
    key: 'borrower',
    titleAr: 'للمدين — كرامتُك محفوظة',
    items: [
      {
        text: 'لا غرامةَ تأخيرٍ أبدًا — التأخّرُ لا يزيد عليك هللةً واحدة.',
        enforcedBy: 'app/features/riba-lint.js · tests/app/riba-lint-corpus.test.cjs',
      },
      {
        text: '«أحتاج وقتًا» تعيد الجدولة بلا زيادةِ هللةٍ — ﴿فنظرةٌ إلى ميسرة﴾.',
        enforcedBy: 'app/features/borrower.js · tests/app/borrower.test.cjs',
      },
      {
        text: '«ادفع ما تيسّر» مقبولٌ دائمًا — أيُّ مبلغٍ يُنقص المتبقّي فورًا، بالهللة.',
        enforcedBy: 'app/features/borrower.js · tests/app/borrower.test.cjs',
      },
      {
        text: 'لا عدّادَ تأخيرٍ أحمر — المتأخّرُ كهرمانيٌّ بكلمةٍ كريمة، بلا عدِّ أيّام.',
        enforcedBy: 'tests/app/app-dom-smoke.cjs',
      },
      {
        text: 'الخلافُ يوقف التذكيرَ فورًا — عهدٌ يشهد ولا يحكم.',
        enforcedBy: 'app/features/daftari.js · tests/app/daftari.test.cjs',
      },
    ],
  },
  {
    key: 'lender',
    titleAr: 'للدائن — حقُّك موثَّق',
    items: [
      {
        text: 'وثيقةٌ مختومةٌ تفضح أيَّ عبث — يتغيّر حرفٌ فيتغيّر الختمُ كلُّه.',
        enforcedBy: 'app/engine.js · tests/app/proof.test.cjs',
      },
      {
        text: 'المصرفُ يُذكِّر نيابةً عنك بالمعروف — فلا تصير أنت «المُطالِب».',
        enforcedBy: 'app/features/daftari.js · tests/app/daftari.test.cjs',
      },
      {
        text: 'الإبراءُ بيدك وحدك — تُغلقه صدقةً بكرامةٍ متى شئت.',
        enforcedBy: 'app/features/open-loan.js · tests/app/open-loan.test.cjs',
      },
      {
        text: 'المقاصّةُ لا تغيّر صافيَ حقّك هللةً — مركزُك قبلها هو مركزُك بعدها.',
        enforcedBy: 'app/features/settlement.js · tests/app/settlement-conserve.test.cjs',
      },
    ],
  },
  {
    key: 'bank',
    titleAr: 'حدود المصرف — يشهد ولا يتجاوز',
    items: [
      {
        text: 'يكتب ويشهد ويحفظ — ولا يُقرض من عنده أبدًا.',
        enforcedBy: 'app/features/settings.js · tests/app/settings.test.cjs',
      },
      {
        text: 'لا يحكم في خلاف — يوقف ويحفظ البيّنةَ للطرفين وللقضاء.',
        enforcedBy: 'app/features/dispute.js · tests/app/dispute.test.cjs',
      },
      {
        text: 'لا يأخذ على القرض شيئًا — لا رسمَ ولا عمولةَ ولا أجرَ خدمةٍ عليه.',
        enforcedBy: 'app/engine.js · tests/app/riba-lint-corpus.test.cjs',
      },
      {
        text: 'لا رقمَ ائتمانٍ ولا تصدير — سجلُّ وفائك كلمةٌ تُقال لك وحدك، ولا تخرج.',
        enforcedBy: 'app/features/daftari.js · tests/app/daftari.test.cjs',
      },
      {
        text: 'الذكاءُ يصوغ ويستشهد ولا يُفتي — يرصد الشبهةَ ويقترح البديلَ الحلال.',
        enforcedBy: 'app/features/riba-lint.js · tests/app/riba-lint.test.cjs',
      },
    ],
  },
];

function BoundRow({ item }: { readonly item: BoundItem }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowText}>{item.text}</Text>
      <Text style={styles.guard}>
        {'يحرسه: '}
        {item.enforcedBy}
      </Text>
    </View>
  );
}

export function BoundsScreen() {
  return (
    <AppShell testID="bounds-screen">
      <ScreenHeader eyebrow="🧭 حدود عهد" title="الضمانات والحدود — مكتوبةٌ في الكود" subtitle={HERO_LINE} />
      {SECTIONS.map((section) => (
        <Section key={section.key} title={section.titleAr}>
          <RowGroup>
            {section.items.map((item) => (
              <BoundRow key={item.text} item={item} />
            ))}
          </RowGroup>
        </Section>
      ))}
      <Section title="أمر التشغيل">
        <Text style={styles.footer}>{FOOTER_LINE}</Text>
        <Text style={styles.runCmd}>{RUN_CMD}</Text>
      </Section>
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
  rowText: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  guard: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  footer: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  runCmd: {
    ...typography.secondary,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'left',
  },
});
