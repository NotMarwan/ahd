import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { JamiyaScreen } from '../JamiyaScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('تبدأ الجمعية بلا أعضاء أو ختم مزروعين وتقدّم إنشاءً حقيقيًا', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><JamiyaScreen /></PilotProvider>);
  expect(view.getByText('الجمعية')).toBeTruthy();
  expect(view.getByLabelText('اسم الجمعية').props.value).toBe('');
  expect(view.queryByText('أم سارة')).toBeNull();
  expect(view.getByRole('button', { name: 'احفظ مسودة الجمعية' })).toBeTruthy();
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
