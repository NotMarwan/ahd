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
  for (const name of ['مقهى الحي', 'سلطان', 'عبدالله', 'ريم', 'ماجد', 'فهد']) {
    expect(view.getByText(name)).toBeTruthy();
  }
  for (const id of ['AHD-CAFE', 'AHD-SULTAN', 'AHD-ABD', 'AHD-KEPT', 'AHD-DISP', 'AHD-FAHD']) {
    expect(view.getByText(id)).toBeTruthy();
  }
  expect(view.queryByText(/[%٪]/)).toBeNull();
  expect(journeyStore.getState().records).toHaveLength(0);
});
