import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { JamiyaScreen } from '../JamiyaScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('تعبئ الجمعية بعرض معلّم من خمسة أعضاء ولا تحفظه تلقائيًا', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><JamiyaScreen /></PilotProvider>);
  expect(view.getByText('الجمعية')).toBeTruthy();
  expect(view.getByLabelText('اسم الجمعية').props.value).toBe('جمعية الأهل');
  expect(view.getByLabelText('شهر البداية').props.value).toBe('2026-08');
  expect(view.getByLabelText('حصة كل عضو بالريال').props.value).toBe('1000');
  expect(view.getByLabelText('أسماء الأعضاء الآخرين').props.value).toBe('نورة، ليلى، خالد، فهد');
  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByText('جمعية الأهل · عرض النتيجة')).toBeTruthy();
  expect(view.getByText('البداية 2026-08 · 5 أعضاء')).toBeTruthy();
  for (const member of ['1. نورة', '2. سارة', '3. ليلى', '4. خالد', '5. فهد']) {
    expect(view.getByText(member)).toBeTruthy();
  }
  expect(store.getState().jamiya.circles).toHaveLength(0);
  await fireEvent.press(view.getByRole('button', { name: 'احفظ مسودة الجمعية' }));
  await waitFor(() => expect(store.getState().jamiya.circles).toHaveLength(1));
  expect(store.getState().jamiya.circles[0].members).toHaveLength(5);
  expect(new Set(store.getState().jamiya.circles[0].members.map((member) => member.displayName)).size).toBe(5);
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
