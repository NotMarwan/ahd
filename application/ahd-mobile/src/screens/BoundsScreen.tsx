import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AhdButton, AppShell, RowGroup, ScreenHeader, Section, ShowcaseNotice } from '@/components';
import { ahdCore, type RibaScreening } from '@/core/ahd-core';
import { SHOWCASE_BOUNDS_TERMS } from '@/showcase/showcase-data';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

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
        text: 'التسويةُ لا تغيّر صافيَ حقّك هللةً — مركزُك قبلها هو مركزُك بعدها.',
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

function LiveRibaCheck() {
  const [terms, setTerms] = useState<string>(SHOWCASE_BOUNDS_TERMS);
  const [screening, setScreening] = useState<RibaScreening | undefined>(() => ahdCore.screenTerms(SHOWCASE_BOUNDS_TERMS));

  const check = () => {
    const normalized = terms.trim();
    if (!normalized) {
      setScreening(undefined);
      return;
    }
    setScreening(ahdCore.screenTerms(normalized));
  };

  return (
    <View style={styles.demo}>
      <Text style={styles.demoIntro}>
        هذا هو الفاحص نفسه الذي يمنع ختم أيّ عهدٍ فيه ربًا أو غرامة — اكتب شرطًا وجرّبه الآن،
        محليًّا بلا إنترنت.
      </Text>
      <Text style={styles.demoLabel}>نصّ الشرط</Text>
      <TextInput
        accessibilityLabel="نصّ الشرط"
        multiline
        onChangeText={setTerms}
        style={styles.demoInput}
        value={terms}
      />
      <AhdButton label="افحص الشرط" onPress={check} />
      {screening ? (
        screening.verdict === 'clean' ? (
          <Text style={styles.demoClean}>✓ سليمٌ من الربا — يقبله المحرّك كما هو.</Text>
        ) : (
          <View style={styles.demoBlock}>
            <Text style={styles.demoBlockTitle}>رُفض الشرط — لن يُختَم عهدٌ بهذا النصّ:</Text>
            {screening.hits.map((hit) => (
              <View key={hit.category + hit.why} style={styles.demoHit}>
                <Text style={styles.demoHitWhy}>{hit.why}</Text>
                <Text style={styles.demoHitFix}>البديل: {hit.fix}</Text>
              </View>
            ))}
          </View>
        )
      ) : null}
    </View>
  );
}

export function BoundsScreen() {
  return (
    <AppShell testID="bounds-screen">
      <ScreenHeader title="الضمانات والحدود — مكتوبةٌ في الكود" subtitle={HERO_LINE} />
      <ShowcaseNotice body="شرط غرامة واضح ومفحوص مسبقًا لتظهر نتيجة الرفض والبديل فورًا." />
      <Section title="جرّب الحارس بنفسك">
        <RowGroup>
          <LiveRibaCheck />
        </RowGroup>
      </Section>
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
  demo: {
    gap: spacing.x2,
    padding: spacing.x3,
  },
  demoIntro: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
  demoLabel: {
    ...typography.label,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  demoInput: {
    minHeight: controls.minTarget,
    paddingHorizontal: spacing.x3,
    paddingVertical: spacing.x2,
    color: colors.ink,
    backgroundColor: colors.ground,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.card,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  demoClean: {
    ...typography.row,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  demoBlock: {
    gap: spacing.x1,
  },
  demoBlockTitle: {
    ...typography.row,
    color: colors.waiting,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  demoHit: {
    gap: 2,
  },
  demoHitWhy: {
    ...typography.secondary,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  demoHitFix: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
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
