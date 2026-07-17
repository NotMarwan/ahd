import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { MineScreen } from '../MineScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يعرض ما عليّ من بيانات عرض معلّمة من دون حفظها', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  const journeyStore = new AhdJourneyStore(new InMemoryAhdRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider store={journeyStore}><MineScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('عرض تجريبي')).toBeTruthy();
  expect(view.getByText('2 عهود محلية')).toBeTruthy();
  expect(view.getByText('4,300.00 ر.س')).toBeTruthy();
  expect(view.getByText('لـ سارة')).toBeTruthy();
  expect(view.getByText('لـ خالد')).toBeTruthy();
  expect(view.getByText('AHD-DEMO-0002')).toBeTruthy();
  expect(view.getByText('AHD-DEMO-0003')).toBeTruthy();
  expect(view.queryByRole('button', { name: 'افتح العهد' })).toBeNull();
  expect(journeyStore.getState().records).toHaveLength(0);
});
