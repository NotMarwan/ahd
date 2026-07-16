import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { MineScreen } from '../MineScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يعرض ما عليّ من بيانات العميل فقط مع إجراء للحالة الفارغة', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider><MineScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('ما عليّ')).toBeTruthy();
  expect(view.getByText('لا يوجد عهد عليك بهذا الاسم')).toBeTruthy();
  expect(view.queryByText('لـ فيصل')).toBeNull();
  expect(view.getByRole('button', { name: 'أنشئ عهدًا' })).toBeTruthy();
});
