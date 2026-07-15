import { useSyncExternalStore } from 'react';

export type DemoStep = {
  readonly route: `/${string}`;
  readonly title: string;
  readonly hint: string;
};

export const DEMO_STEPS: readonly DemoStep[] = [
  {
    route: '/home',
    title: 'البداية',
    hint: 'هذه رحلة عهد كاملة: من كتابة الدين إلى إثبات الختم. اضغط «التالي».',
  },
  {
    route: '/create',
    title: 'أنشئ عهدًا',
    hint: 'البيانات معبّأة تجريبيًا. اضغط «فحص الشروط» ثم «اختم العهد»، ثم «التالي».',
  },
  {
    route: '/daftari',
    title: 'دفتري',
    hint: 'العهد المختوم يظهر هنا من غير أي درجة ائتمانية.',
  },
  {
    route: '/record/AHD-MOBILE-001',
    title: 'تفاصيل العهد',
    hint: 'الختم يُتحقق منه محليًا: «الختم سليم».',
  },
  {
    route: '/settle',
    title: 'المقاصّة',
    hint: 'تسعة التزامات بين خمسة أعضاء تُختصر لتحويلين، والمجموع محفوظ. جرّب «شغّل مقاصّة الشبكة».',
  },
  {
    route: '/proof',
    title: 'الإثبات',
    hint: 'تحقق مستقل من الختم: «مطابق».',
  },
  {
    route: '/more',
    title: 'المزيد',
    hint: 'بقية الشاشات: الدائرة، الجمعية، الأساس الشرعي، وما لا يفعله عهد.',
  },
] as const;

type DemoState = {
  active: boolean;
  index: number;
};

let state: DemoState = { active: false, index: 0 };
const listeners = new Set<() => void>();

function setState(next: DemoState): void {
  state = next;
  listeners.forEach((listener) => listener());
}

export const demoGuide = {
  getState(): DemoState {
    return state;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  start(): void {
    setState({ active: true, index: 0 });
  },
  next(): DemoStep | null {
    if (!state.active) return null;
    const nextIndex = state.index + 1;
    if (nextIndex >= DEMO_STEPS.length) {
      setState({ active: false, index: 0 });
      return null;
    }
    setState({ active: true, index: nextIndex });
    return DEMO_STEPS[nextIndex];
  },
  skip(): void {
    setState({ active: false, index: 0 });
  },
};

export function useDemoGuide() {
  const snapshot = useSyncExternalStore(
    demoGuide.subscribe,
    demoGuide.getState,
    demoGuide.getState,
  );
  return {
    active: snapshot.active,
    index: snapshot.index,
    step: snapshot.active ? DEMO_STEPS[snapshot.index] : null,
    isLast: snapshot.index === DEMO_STEPS.length - 1,
    start: demoGuide.start,
    next: demoGuide.next,
    skip: demoGuide.skip,
  };
}
