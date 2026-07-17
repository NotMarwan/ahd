import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { MaroofScreen } from '../MaroofScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يعرض سجل معروف تجريبيًا من السجلات بلا نسبة ثقة', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  const journeyStore = new AhdJourneyStore(new InMemoryAhdRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider store={journeyStore}><MaroofScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('عرض تجريبي')).toBeTruthy();
  expect(view.getByText('العلاقات الموثّقة')).toBeTruthy();
  expect(view.getByText('ليلى')).toBeTruthy();
  expect(view.getByText('سارة')).toBeTruthy();
  expect(view.getByText('خالد')).toBeTruthy();
  expect(view.getByText('AHD-DEMO-0001')).toBeTruthy();
  expect(view.getByText('AHD-DEMO-0002')).toBeTruthy();
  expect(view.getByText('AHD-DEMO-0003')).toBeTruthy();
  expect(view.queryByText(/[%٪]/)).toBeNull();
  expect(journeyStore.getState().records).toHaveLength(0);
});
