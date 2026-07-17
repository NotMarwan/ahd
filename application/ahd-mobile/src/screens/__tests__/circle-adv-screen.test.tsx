import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { CircleAdvScreen } from '../CircleAdvScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('تعرض الدائرة+ تسوية تجريبية من 9 إلى 2 من دون حفظ إيصال', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  const view = await render(<PilotProvider store={store}><CircleAdvScreen /></PilotProvider>);
  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByText('قبل التسوية · 9')).toBeTruthy();
  expect(view.getByText('بعد التسوية · 2')).toBeTruthy();
  expect(view.getByText('القيمة محفوظة حسابيًا')).toBeTruthy();
  expect(view.queryByRole('button', { name: 'احفظ إيصال التخطيط' })).toBeNull();
  expect(store.getState().jamiya.nettingReceipts).toHaveLength(0);
});
