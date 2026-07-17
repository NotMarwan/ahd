import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section } from '@/components';
import { colors, fontFamilies, spacing, typography } from '@/theme';

type Grade = 'verified' | 'recorded' | 'pending' | 'design-only';

type Citation = {
  readonly labelAr: string;
  readonly refAr?: string;
  readonly clauseAr?: string;
  readonly quoteAr?: string;
  readonly noteAr: string;
  readonly grade: Grade;
};

type Mechanic = {
  readonly key: string;
  readonly titleAr: string;
  readonly mechanicAr: string;
  readonly citations: readonly Citation[];
};

type OpenQuestion = {
  readonly id: string;
  readonly questionAr: string;
  readonly forAudience: string;
};

/* Ported verbatim from app/features/shariah-basis.js (ShariahBasis). */
const HEADING = 'الأساس الشرعي';
const SUB = 'كلُّ آليّةٍ في عهد تستند إلى نصٍّ أو معيارٍ مذكورٍ باسمه — والذكاءُ هنا يستشهد ولا يُفتي.';
const NO_FATWA_LINE =
  'الذكاءُ يستشهد بالنصوص والمعايير ويرصد الشبهة — ولا يُفتي، ولا يحكم في مسألةٍ خلافيّة؛ كلُّ سؤالٍ فقهيٍّ مفتوحٍ أدناه يُحال إلى عالِمٍ شرعيٍّ معتمد.';
const PENDING_NOTE =
  'أسئلة بانتظار مراجعة عالِم — لم تُعرَض بعدُ على أيّ هيئةٍ شرعيّةٍ ولم تُرفَع بعد إلى الإنماء.';

const GRADE_LABEL: Record<Grade, string> = {
  verified: '🟢 مؤكَّد',
  recorded: '🟡 مُسجَّلٌ في الأرشيف — لم يُعَد التحقّق',
  pending: '🔴 الرقم الدقيق يُراجَع',
  'design-only': '⚪ خيارٌ تصميميّ — لا نصَّ مرقَّمًا بعينه',
};

const MECHANICS: readonly Mechanic[] = [
  {
    key: 'qard',
    titleAr: 'شهادة القرض الحسن — عهد يكتب ويشهد، لا يُقرض',
    mechanicAr:
      'عهد يكتب عهدَ القرض الحسن بين طرفين ويختمه، دون أن يكون طرفًا مُقرِضًا — هو الكاتب، لا أحد الشاهدين.',
    citations: [
      {
        labelAr: 'آية الدَّين',
        refAr: '٢:٢٨٢',
        quoteAr: '﴿... وَلْيَكْتُب بَّيْنَكُمْ كَاتِبٌۢ بِٱلْعَدْلِ ۚ ... وَٱسْتَشْهِدُوا۟ شَهِيدَيْنِ مِن رِّجَالِكُمْ ۖ ...﴾',
        noteAr:
          'الأمر بكتابة الدَّين وإشهاده؛ التفريق بين الكاتب (بِٱلْعَدْلِ) والشاهدَين — عهد هو الكاتب، لا طرفٌ شاهد أو مُقرِض.',
        grade: 'verified',
      },
      {
        labelAr: 'معيار الشريعة رقم ١٩ — القرض (AAOIFI SS-19)',
        clauseAr: 'التعريف العام للقرض الحسن (رقم البند الدقيق للتعريف: يُراجَع)',
        noteAr:
          'القرض عقدٌ إرفاقٍ بلا زيادةٍ مشروطة؛ أيّ زيادةٍ مشروطة على المبلغ المقروض رِبًا — الأصل الذي يقوم عليه رفض عهد لأيّ فائدةٍ أو غرامة.',
        grade: 'recorded',
      },
      {
        labelAr: 'الإقرار سيّد الأدلّة',
        noteAr:
          'قاعدةٌ فقهيّةٌ إجرائيّةٌ كلاسيكيّة (وليست معيارًا مرقَّمًا): إقرارُ المدين بالدَّين من أقوى الأدلّة — الأساس الذي يجعل «إقرارٌ بدَين» موقَّعًا وثيقةً ذات وزن.',
        grade: 'recorded',
      },
    ],
  },
  {
    key: 'seal',
    titleAr: 'الختم الرقميّ — امتدادٌ تقنيٌّ لأمر الكتابة',
    mechanicAr:
      'الختم بِـ SHA-256 هو تنفيذٌ تقنيٌّ لأمر «فاكتبوه» بوسيلةٍ عصريّة تفضح أيّ عبثٍ لاحق — الحفظ الرقميّ لا يغيّر طبيعة الالتزام الشرعيّ للكتابة.',
    citations: [
      {
        labelAr: 'آية الدَّين',
        refAr: '٢:٢٨٢',
        quoteAr: '﴿... فَٱكْتُبُوهُ ۚ ...﴾',
        noteAr: 'أمرٌ صريحٌ بكتابة الدَّين — الختم الرقميّ صورةٌ من صور الكتابة والحفظ، لا بديلٌ شرعيّ جديد.',
        grade: 'verified',
      },
      {
        labelAr: 'نظام الإثبات (السجلّات والتوقيعات الرقميّة) — المرسوم الملكيّ م/٤٣ لعام ٢٠٢٢',
        clauseAr:
          'الجوهر: الأدلّة الرقميّة أدلّةٌ كتابيّةٌ متى تحقّقت شروط السلامة/النسبة، وعبء الإثبات ينتقل إلى الطرف المُنكِر (المواد المُشار إليها في أرشيف المشروع: ٥٧/٥٨ تقريبًا — أرقام الموادّ الدقيقة تُراجَع، OT-CITE)',
        noteAr:
          'الجوهر مؤكَّدٌ بمصادر عدّة؛ رقم المادّة الدقيق ونصّها الأساسيّ لم يُقرأ من نصٍّ رسميٍّ حتى الآن — يحتاج تأكيدًا قانونيًّا قبل التصريح به على المنصّة.',
        grade: 'pending',
      },
      {
        labelAr: 'نظام المعاملات الإلكترونيّة — المرسوم الملكيّ م/١٨ لعام ٢٠٠٧',
        clauseAr: 'المادّة ١٤ — التوقيع الإلكترونيّ له ذاتُ الحجّيّة القانونيّة للتوقيع اليدويّ متى تحقّقت شروط الموثوقيّة',
        noteAr:
          'يُبنى عليها اعتماد التوقيع عبر نفاذ/مزوّد خدمات ثقةٍ مرخَّص — مُسجَّلٌ في أرشيف المشروع، لم يُعَد التحقّق منه مباشرةً في هذه الجلسة.',
        grade: 'recorded',
      },
    ],
  },
  {
    key: 'netting',
    titleAr: 'التسوية الشبكية — أقلّ التحويلات، والصافي محفوظ',
    mechanicAr:
      'عهد يُصفّي التزاماتٍ متبادلةً بين أطرافٍ عدّةٍ إلى أقلّ عددٍ من التحويلات، بحيث يبقى صافي مركز كلّ طرفٍ كما هو قبل التصفية وبعدها — بالتراضي، لا بإلزامٍ أحاديّ.',
    citations: [
      {
        labelAr: 'التسوية (Set-off)',
        noteAr: 'مفهومٌ مستقرٌّ في الفقه الإسلاميّ: تقاصّ الديون المتبادلة من جنسٍ واحدٍ وعملةٍ واحدةٍ صحيحٌ برضا الأطراف — الأساس الذي تُبنى عليه تسوية عهد.',
        grade: 'verified',
      },
      {
        labelAr: 'الحوالة (نقل الدَّين) بالتراضي',
        noteAr:
          'كلّ ساقٍ من سيقان التسوية في عهد تُعرَض كحوالةٍ بالتراضي بين طرفين — المفهوم الفقهيّ للحوالة الثنائيّة مستقرّ؛ المعيار الشرعيّ المرقَّم المحدَّد لهذا التطبيق في هذا المشروع: يُراجَع.',
        grade: 'pending',
      },
      {
        labelAr: 'الغرر والميسر',
        noteAr:
          'التسوية تشترط رضا كلّ طرفٍ عن سِيَقان تحويله — لا عنصر مقامرةٍ ولا غررَ في مقدار الالتزام؛ الأصل الفقهيّ الكلاسيكيّ في تحريم بيع الغرر.',
        grade: 'verified',
      },
    ],
  },
  {
    key: 'no-riba',
    titleAr: 'لا ربا · لا غرامة · لا ميسر · لا غرر',
    mechanicAr:
      'لا زيادة على القرض بأيّ اسم، لا غرامة تأخيرٍ، لا شرط جزائيّ، ولا عنصر مقامرةٍ أو غررٍ في أيّ تسويةٍ أو جدولة — التأخّر يُقابَل بالمهلة لا بالزيادة.',
    citations: [
      {
        labelAr: 'تحريم الربا',
        refAr: '٢:٢٧٥، ٢:٢٧٨–٢٧٩',
        noteAr: 'لا زيادةَ على القرض، ولا رسمَ متصاعدًا مع الزمن، ولا غرامة تأخير — الأساس الذي يمنع عهد من فرض أيّ زيادةٍ على مبلغ القرض.',
        grade: 'verified',
      },
      {
        labelAr: 'المهلة للمُعسِر',
        refAr: '٢:٢٨٠',
        quoteAr: '﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾',
        noteAr: 'مهلةٌ مأمورةٌ للمعسر، بلا غرامةٍ على العُسر — الأساس الذي تُبنى عليه ميزة «أحتاج وقتًا» بلا زيادةِ هللةٍ واحدة.',
        grade: 'verified',
      },
      {
        labelAr: 'معيار الشريعة رقم ١٩ — القرض (AAOIFI SS-19)',
        clauseAr: 'البند ١٠/٣/٢',
        noteAr:
          'لا يجوز ربط أجرة الخدمة بمبلغ القرض الممنوح أو المسحوب — أجرةٌ نسبيّةٌ من مبلغ القرض رِبًا؛ الأساس الذي يمنع عهد من أخذ نسبةٍ من مبلغ القرض.',
        grade: 'recorded',
      },
      {
        labelAr: 'معيار الشريعة رقم ١٩ — القرض (AAOIFI SS-19)',
        clauseAr: 'البند ٧/٨',
        noteAr:
          'اختبار الحيلة: لا يجوز اشتراط عقدٍ معاوضيٍّ كشرطٍ لمنح القرض؛ خدمة التوثيق يجب أن تكون مستقلّةً وحقيقيّةً، لا شرطًا مُقنَّعًا للقرض.',
        grade: 'recorded',
      },
    ],
  },
  {
    key: 'trust-band',
    titleAr: 'إشارة الثقة النوعيّة — كلمةٌ لا رقم',
    mechanicAr:
      'أثر المستخدم عند نفسه كلمةٌ («وفّى بعهوده») لا رقمٌ ولا تصنيفٌ ائتمانيّ — لا يُصدَّر، لا يُباع، ولا يُستخدَم لتسعير أو رفض أيّ عهدٍ جديد.',
    citations: [
      {
        labelAr: 'قاعدةٌ تصميميّةٌ تنفّذ السبينة، لا نصًّا فقهيًّا واحدًا بعينه',
        noteAr:
          'لا يستند أرشيف المشروع الشرعيّ إلى نصٍّ أو معيارٍ مرقَّمٍ واحدٍ بعينه لهذا العنصر تحديدًا؛ هو خيارٌ تصميميٌّ ينفّذ حدود عهد نفسها (لا تصنيف ائتمانيّ، لا تصدير) — والسؤال الشرعيّ المفتوح الحقيقيّ حوله مذكورٌ أدناه (D-1).',
        grade: 'design-only',
      },
    ],
  },
];

const OPEN_QUESTIONS: readonly OpenQuestion[] = [
  {
    id: 'D-6a-Hilah',
    questionAr:
      'هل يخلو فصل القرض الحسن (بلا زيادةٍ البتّة) عن أجرة توثيقٍ ثابتةٍ على عقد وكالةٍ منفصل من شبهة الحيلة أو قاعدة «كلّ قرضٍ جرَّ نفعًا»، وفق معيار الشريعة رقم ١٩ (البند ١٠/٣/٢ — عدم الربط بمبلغ القرض، والبند ٧/٨ — اختبار الحيلة)؟',
    forAudience: 'لجنة/عالِمٍ شرعيٍّ معتمد (المرجعيّة المقترحة: الهيئة الشرعيّة لمصرف الإنماء)',
  },
  {
    id: 'D-1',
    questionAr:
      'هل يُخِلّ إفصاح المستخدم طوعًا عن كلمة «وفّى بعهوده» الخاصّة بتاريخه هو وحده (لا بيانات أيّ طرفٍ آخر) لطرفٍ جديدٍ بقاعدة أنّ إشارة الثقة «لا تُصدَّر ولا تُستخدَم في تقييم أحد»؟',
    forAudience: 'عالِمٍ شرعيٍّ معتمد (مسألة خصوصيّةٍ وشرعٍ مشتركة)',
  },
  {
    id: 'D-3',
    questionAr:
      'هل يخلو نموذج «التعهّد ثم الدفع عند الصرف» (بلا إيداعٍ مجمَّعٍ لدى البنك) من شبهة الغرر أو الأمانة في تجميع دائرةٍ نحو هدفٍ مشترك؟ وهل يجوز لصندوق قرضٍ حسنٍ مؤسّسيٍّ أن يحتفظ بمالٍ مجمَّعٍ في عهدته تحت أيّ بنية أمانةٍ/حفظٍ مرخَّصة؟',
    forAudience: 'لجنة/عالِمٍ شرعيٍّ معتمد',
  },
  {
    id: 'netting-multilateral',
    questionAr:
      'هل يمتدّ حكم التسوية والحوالة الثنائيّة المستقرّ فقهيًّا (بين طرفين) إلى تسويةٍ متعدّدة الأطراف (تسويةٌ شبكيّةٌ بين أكثر من طرفين دفعةً واحدة، كما تفعلها شاشة التسوية في عهد)، أم يستلزم ذلك شرطًا إضافيًّا في الرضا أو صيغة العقد لم يُشترَط في الحوالة الثنائيّة؟',
    forAudience: 'عالِمٍ شرعيٍّ معتمد متخصّصٍ في فقه المعاملات',
  },
];

function CitationRow({ citation }: { readonly citation: Citation }) {
  return (
    <View style={styles.citationRow}>
      <Text style={styles.citationLabel}>
        {citation.labelAr}
        {citation.refAr ? ` — ${citation.refAr}` : ''}
      </Text>
      {citation.clauseAr ? <Text style={styles.citationClause}>{citation.clauseAr}</Text> : null}
      {citation.quoteAr ? <Text style={styles.citationQuote}>{citation.quoteAr}</Text> : null}
      <Text style={styles.citationNote}>{citation.noteAr}</Text>
      <Text style={styles.citationGrade}>{GRADE_LABEL[citation.grade]}</Text>
    </View>
  );
}

function MechanicRow({ mechanic }: { readonly mechanic: Mechanic }) {
  return (
    <View style={styles.mechanicRow}>
      <Text style={styles.mechanicTitle}>{mechanic.titleAr}</Text>
      <Text style={styles.mechanicBody}>{mechanic.mechanicAr}</Text>
      {mechanic.citations.map((citation) => (
        <CitationRow key={citation.labelAr + (citation.clauseAr ?? '')} citation={citation} />
      ))}
    </View>
  );
}

function QuestionRow({ question }: { readonly question: OpenQuestion }) {
  return (
    <View style={styles.questionRow}>
      <Text style={styles.questionText}>
        {'❓ '}
        {question.questionAr}
      </Text>
      <Text style={styles.questionAudience}>
        {'لِـ: '}
        {question.forAudience}
      </Text>
    </View>
  );
}

export function ShariahScreen() {
  return (
    <AppShell testID="shariah-screen">
      <ScreenHeader title={HEADING} subtitle={SUB} />
      <Section title="الآليّات المستندة إلى نصٍّ أو معيار">
        <RowGroup>
          {MECHANICS.map((mechanic) => (
            <MechanicRow key={mechanic.key} mechanic={mechanic} />
          ))}
        </RowGroup>
      </Section>
      <Section title="أسئلةٌ مفتوحةٌ بانتظار مراجعة عالِم">
        <RowGroup>
          {OPEN_QUESTIONS.map((question) => (
            <QuestionRow key={question.id} question={question} />
          ))}
        </RowGroup>
      </Section>
      <Text style={styles.footer}>{NO_FATWA_LINE}</Text>
      <Text style={styles.footer}>{PENDING_NOTE}</Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  mechanicRow: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  mechanicTitle: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  mechanicBody: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  citationRow: {
    gap: 4,
    paddingTop: spacing.x1,
  },
  citationLabel: {
    ...typography.secondary,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  citationClause: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  citationQuote: {
    ...typography.secondary,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  citationNote: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  citationGrade: {
    ...typography.label,
    color: colors.accent,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  questionRow: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  questionText: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  questionAudience: {
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
});
