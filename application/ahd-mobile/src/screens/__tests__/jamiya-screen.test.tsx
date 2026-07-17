import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { JamiyaScreen } from '../JamiyaScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('تعبئ الجمعية بعرض معلّم من ستة أعضاء ولا تحفظه تلقائيًا', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  await store.setDisplayName('أم سارة');
  const view = await render(<PilotProvider store={store}><JamiyaScreen /></PilotProvider>);
  expect(view.getByText('الجمعية')).toBeTruthy();
  expect(view.getByLabelText('اسم الجمعية').props.value).toBe('جمعية أهل الحي');
  expect(view.getByLabelText('شهر البداية').props.value).toBe('2026-04');
  expect(view.getByLabelText('حصة كل عضو بالريال').props.value).toBe('1000');
  expect(view.getByLabelText('أسماء الأعضاء الآخرين').props.value).toBe('نورة، هند، منال، عبير، لجين');
  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByText('جمعية أهل الحي · عرض النتيجة')).toBeTruthy();
  expect(view.getByText('البداية 2026-04 · 6 أعضاء')).toBeTruthy();
  for (const member of ['1. أم سارة', '2. نورة', '3. هند', '4. منال', '5. عبير', '6. لجين']) {
    expect(view.getByText(member)).toBeTruthy();
  }
  expect(store.getState().jamiya.circles).toHaveLength(0);
  await fireEvent.press(view.getByRole('button', { name: 'احفظ مسودة الجمعية' }));
  await waitFor(() => expect(store.getState().jamiya.circles).toHaveLength(1));
  expect(store.getState().jamiya.circles[0].members).toHaveLength(6);
  expect(new Set(store.getState().jamiya.circles[0].members.map((member) => member.displayName)).size).toBe(6);
});

test('يحفظ اسم عرض محليًا عندما يفتح المستخدم الجمعية لأول مرة', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  const view = await render(<PilotProvider store={store}><JamiyaScreen /></PilotProvider>);

  await fireEvent.changeText(view.getByLabelText('اسم العرض المحلي'), 'سارة');
  await fireEvent.press(view.getByRole('button', { name: 'احفظ اسم العرض' }));

  await waitFor(() => expect(store.getState().profile.displayName).toBe('سارة'));
  expect(view.getByRole('button', { name: 'احفظ مسودة الجمعية' })).toBeTruthy();
});
