import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { CircleScreen } from '../CircleScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('تعرض دائرة تجريبية من ستة أعضاء من دون حفظها', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  const view = await render(<PilotProvider store={store}><CircleScreen /></PilotProvider>);
  expect(view.getByText('عرض تجريبي')).toBeTruthy();
  expect(view.getByText('جمعية أهل الحي')).toBeTruthy();
  expect(view.getByText('مثال غير محفوظ')).toBeTruthy();
  expect(view.getAllByText('الحصة 1,000.00 ر.س')).toHaveLength(6);
  expect(store.getState().jamiya.circles).toHaveLength(0);
});
