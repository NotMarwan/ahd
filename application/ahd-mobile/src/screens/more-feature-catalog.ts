import { CONTEXTUAL_SCREENS } from '@/navigation/screen-registry';

export type MoreCategory = 'الكل' | 'العهود' | 'الدوائر' | 'الحماية' | 'الأثر' | 'الإدارة';
export type MoreFeatureTone = 'accent' | 'gold' | 'neutral';
type ContextualKey = (typeof CONTEXTUAL_SCREENS)[number]['key'];

export type MoreFeature = (typeof CONTEXTUAL_SCREENS)[number] & {
  readonly description: string;
  readonly category: Exclude<MoreCategory, 'الكل'>;
  readonly tone: MoreFeatureTone;
  readonly badge?: string;
};

type FeatureMetadata = Omit<MoreFeature, 'key' | 'label' | 'route' | 'surface' | 'baseline'>;

const METADATA = {
  timeline: { description: 'راجع كل حركة محفوظة بترتيب واضح.', category: 'العهود', tone: 'neutral' },
  open: { description: 'وثّق أصلًا مرنًا بلا فائدة ولا غرامة.', category: 'العهود', tone: 'accent', badge: 'مرن' },
  circle: { description: 'نظّم عهود المجموعة وموافقاتها محليًا.', category: 'الدوائر', tone: 'gold' },
  'circle-adv': { description: 'كرّر الدورة مع إيقاف واستئناف واضحين.', category: 'الدوائر', tone: 'gold', badge: 'متقدّم' },
  mine: { description: 'اعرف ما عليك من سجلات جهازك فقط.', category: 'العهود', tone: 'accent' },
  request: { description: 'جهّز طلب عهد يحفظ المقصد قبل المبلغ.', category: 'العهود', tone: 'accent' },
  proof: { description: 'تحقّق محليًا من الختم واكشف أي عبث.', category: 'الحماية', tone: 'gold', badge: 'موصى به' },
  maroof: { description: 'اجمع الوفاء والإمهال والإبراء في أثر محايد.', category: 'الأثر', tone: 'gold' },
  dispute: { description: 'سجّل الخلاف دون أن يحكم عهد بين الأطراف.', category: 'الحماية', tone: 'neutral' },
  standing: { description: 'خطّط سُلفة دورية بأصل ثابت ومعلن.', category: 'العهود', tone: 'accent' },
  impact: { description: 'شاهد أثر سجلاتك المحلية دون كشف الأفراد.', category: 'الأثر', tone: 'accent', badge: 'محلي' },
  bounds: { description: 'افهم ضمانات المدين والدائن وحدود المصرف.', category: 'الحماية', tone: 'gold', badge: 'مهم' },
  settings: { description: 'خصّص العرض وصدّر بياناتك أو احذفها.', category: 'الإدارة', tone: 'neutral' },
  refusal: { description: 'جرّب حيًا كيف يرفض المحرك الربا والغرامة.', category: 'الحماية', tone: 'gold' },
  shariah: { description: 'راجع الأساس والحدود والأسئلة قيد المراجعة.', category: 'الحماية', tone: 'gold', badge: 'لا فتوى' },
  plans: { description: 'افصل أجرة الخدمة المقترحة عن أصل القرض.', category: 'الإدارة', tone: 'neutral', badge: 'قيد المراجعة' },
  org: { description: 'اطّلع على الجاهزية المؤسسية بحدود صريحة.', category: 'الإدارة', tone: 'neutral', badge: 'يحتاج اتصالًا' },
  jamiya: { description: 'خطّط جمعية بترتيب رضائي محفوظ محليًا.', category: 'الدوائر', tone: 'gold', badge: 'جديد' },
  daily: { description: 'دوّن قيد اليوم واحفظه على هذا الجهاز.', category: 'الأثر', tone: 'accent', badge: 'جديد' },
} as const satisfies Record<ContextualKey, FeatureMetadata>;

export const MORE_CATEGORIES = ['الكل', 'العهود', 'الدوائر', 'الحماية', 'الأثر', 'الإدارة'] as const;

export const MORE_FEATURES: readonly MoreFeature[] = CONTEXTUAL_SCREENS.map((screen) => ({
  ...screen,
  ...METADATA[screen.key],
}));

function normalizeArabic(value: string): string {
  return value
    .trim()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .toLowerCase();
}

export function filterMoreFeatures(query: string, category: MoreCategory): readonly MoreFeature[] {
  const normalizedQuery = normalizeArabic(query);
  return MORE_FEATURES.filter((feature) => {
    const inCategory = category === 'الكل' || feature.category === category;
    const searchable = normalizeArabic(`${feature.label} ${feature.description} ${feature.category}`);
    return inCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}
