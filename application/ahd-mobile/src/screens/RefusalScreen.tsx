import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { colors, fontFamilies, spacing, typography } from '@/theme';

type RefusalItem = {
  readonly key: string;
  readonly act: string;
  readonly control: string;
  readonly bankDoes: string;
  readonly whyRefused: string;
  readonly enforcedBy: string;
};

/* Ported verbatim from app/features/refusal.js (Refusal.model()). */
const HEADING = 'عهد لا يُقرض، لا يُقيّم، لا يحكم';
const SUB =
  'ثلاثة أبوابٍ يطرقها كلُّ بنكٍ تقليديّ — وعهد يُغلقها عمدًا. ليست نقصًا نعتذر عنه، بل هُويّتنا.';
const QUOTE = 'ما لا يفعله عهدٌ هو المنتج — لا نعتذر عنه، بل نبنيه على رفضه.';

const ITEMS: readonly RefusalItem[] = [
  {
    key: 'lend',
    act: 'لا يُقرض',
    control: 'معدّل الفائدة على القرض',
    bankDoes: 'بنكٌ تقليديّ يُقرضك من ماله، ويربح على القرض فائدةً أو غرامةَ تأخير.',
    whyRefused:
      'عهد يشهد ويختم ويُسوّي، لا يُقرض من ماله ولا يربح على القرض — حصّتُه من القرض صفرٌ في الكود (loanChargeHalalas: 0)، والمالُ من الناس للناس.',
    enforcedBy: 'app/features/billing.js',
  },
  {
    key: 'score',
    act: 'لا يُقيّم',
    control: 'الرقم الائتمانيّ للعميل',
    bankDoes: 'بنكٌ تقليديّ يمنحك رقمًا ائتمانيًّا يتبعك، ويُصنّفك، ويُتداول عنك.',
    whyRefused:
      'عهد لا يُصدر رقمًا ولا تصنيفًا. أثرُك عندك وحدك كلمةٌ لا رقم — «وفّى بعهوده» — لا تُصدَّر ولا تُباع.',
    enforcedBy: 'app/features/daftari.js',
  },
  {
    key: 'judge',
    act: 'لا يحكم',
    control: 'إصدار الحكم في الخلاف',
    bankDoes: 'طرفٌ ثالثٌ يفصل في خلافك، ويُصدر حكمًا مُلزمًا لأحد الطرفين.',
    whyRefused:
      'عند الخلاف يتوقّف عهد ويعرض البيّنة المختومة — لا يقضي ولا يُفتي؛ يذكر الآية ويُحيل لأهل العلم.',
    enforcedBy: 'app/features/dispute.js',
  },
];

const CHARITY = {
  act: 'اجعلها صدقة',
  line: 'وحين يعجز المدين، لعهد بابٌ لا يملكه بنك: بضغطةٍ يتحوّل الدَّين إلى صدقةٍ بكرامة — يُبرَأ ما تبقّى، ويُختَم كبيّنةٍ للمعروف، بلا أيّ زيادة.',
  ayah: '﴿وأن تصدّقوا خيرٌ لكم إن كنتم تعلمون﴾',
  enforcedBy: 'app/features/open-loan.js',
};

function RefusalCard({ item }: { readonly item: RefusalItem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.act}>
        {'✗ '}
        {item.act}
      </Text>
      <View style={styles.controlRow}>
        <Text style={styles.controlLabel}>{item.control}</Text>
        <StatusChip label="🔒 معطّلٌ في عهد" tone="stopped" />
      </View>
      <Text style={styles.body}>{item.bankDoes}</Text>
      <Text style={styles.why}>{item.whyRefused}</Text>
      <Text style={styles.guard}>
        {'يحرسه: '}
        {item.enforcedBy}
      </Text>
    </View>
  );
}

export function RefusalScreen() {
  return (
    <AppShell testID="refusal-screen">
      <ScreenHeader eyebrow="🛡️ ما لا يفعله عهد" title={HEADING} subtitle={SUB} />
      <Text style={styles.quote}>{QUOTE}</Text>
      <Section title="الرفض الثلاثي">
        <RowGroup>
          {ITEMS.map((item) => (
            <RefusalCard key={item.key} item={item} />
          ))}
        </RowGroup>
      </Section>
      <Section title="🤍 الصدقة">
        <View style={styles.charity}>
          <Text style={styles.charityAct}>
            {'🤍 '}
            {CHARITY.act}
          </Text>
          <Text style={styles.body}>{CHARITY.line}</Text>
          <Text style={styles.ayah}>{CHARITY.ayah}</Text>
          <Text style={styles.guard}>
            {'يحرسه: '}
            {CHARITY.enforcedBy}
          </Text>
        </View>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  quote: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    textAlign: 'right',
  },
  card: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  controlRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  controlLabel: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  act: {
    ...typography.row,
    color: colors.stopped,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  body: {
    ...typography.secondary,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  why: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  guard: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  charity: {
    gap: spacing.x1,
    padding: spacing.x3,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  charityAct: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  ayah: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
