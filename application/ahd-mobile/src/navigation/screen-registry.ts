export type ScreenSurface = 'tab' | 'stack';

export type ScreenDefinition = {
  readonly key: string;
  readonly label: string;
  readonly route: `/${string}`;
  readonly surface: ScreenSurface;
  readonly baseline: `s${string}` | null;
};

export const SCREEN_REGISTRY = [
  { key: 'home', label: 'الرئيسية', route: '/home', surface: 'tab', baseline: 's01' },
  { key: 'create', label: 'أنشئ عهدًا', route: '/create', surface: 'tab', baseline: 's02' },
  { key: 'daftari', label: 'دفتري', route: '/daftari', surface: 'tab', baseline: 's04' },
  { key: 'settle', label: 'التسوية', route: '/settle', surface: 'tab', baseline: 's03' },
  { key: 'more', label: 'المزيد', route: '/more', surface: 'tab', baseline: null },
  { key: 'timeline', label: 'السجلّ', route: '/timeline', surface: 'stack', baseline: 's10' },
  { key: 'open', label: 'قرضٌ مفتوح', route: '/open', surface: 'stack', baseline: 's09' },
  { key: 'circle', label: 'الدائرة', route: '/circle', surface: 'stack', baseline: 's11' },
  { key: 'circle-adv', label: 'الدائرة+', route: '/circle-adv', surface: 'stack', baseline: 's12' },
  { key: 'mine', label: 'ما عليّ', route: '/mine', surface: 'stack', baseline: 's05' },
  { key: 'request', label: 'اطلب عهدًا', route: '/request', surface: 'stack', baseline: 's08' },
  { key: 'proof', label: 'الإثبات', route: '/proof', surface: 'stack', baseline: 's06' },
  { key: 'maroof', label: 'سِجلّ المعروف', route: '/maroof', surface: 'stack', baseline: 's14' },
  { key: 'dispute', label: 'محلّ خلاف', route: '/dispute', surface: 'stack', baseline: 's15' },
  { key: 'standing', label: 'سُلفة بالمعروف', route: '/standing', surface: 'stack', baseline: 's13' },
  { key: 'impact', label: 'أثر عهد', route: '/impact', surface: 'stack', baseline: 's07' },
  { key: 'bounds', label: 'الضمانات والحدود', route: '/bounds', surface: 'stack', baseline: 's16' },
  { key: 'settings', label: 'الإعدادات', route: '/settings', surface: 'stack', baseline: 's17' },
  { key: 'refusal', label: 'ما لا يفعله عهد', route: '/refusal', surface: 'stack', baseline: null },
  { key: 'shariah', label: 'الأساس الشرعي', route: '/shariah', surface: 'stack', baseline: null },
  { key: 'plans', label: 'الأجرة والخطط', route: '/plans', surface: 'stack', baseline: null },
  { key: 'org', label: 'لوحة المؤسسة', route: '/org', surface: 'stack', baseline: null },
  { key: 'jamiya', label: 'الجمعية', route: '/jamiya', surface: 'stack', baseline: null },
  { key: 'daily', label: 'اليومي', route: '/daily', surface: 'stack', baseline: null },
] as const satisfies readonly ScreenDefinition[];

export type ScreenKey = (typeof SCREEN_REGISTRY)[number]['key'];

export const PRIMARY_TABS = SCREEN_REGISTRY.filter((screen) => screen.surface === 'tab');
export const CONTEXTUAL_SCREENS = SCREEN_REGISTRY.filter((screen) => screen.surface === 'stack');
