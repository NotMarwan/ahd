import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { TimelineScreen } from '../TimelineScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يعرض خطًا زمنيًا تجريبيًا معلّمًا من دون حفظه', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  const journeyStore = new AhdJourneyStore(new InMemoryAhdRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider store={journeyStore}><TimelineScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('عرض تجريبي')).toBeTruthy();
  expect(view.getByText('الأحداث المحلية')).toBeTruthy();
  expect(view.getAllByText('كُتب العهد')).toHaveLength(6);
  for (const id of ['AHD-CAFE', 'AHD-SULTAN', 'AHD-ABD', 'AHD-KEPT', 'AHD-DISP', 'AHD-FAHD']) {
    expect(view.getAllByText(id)).toHaveLength(5);
  }
  expect(view.queryByRole('button', { name: 'افتح السجل' })).toBeNull();
  expect(journeyStore.getState().records).toHaveLength(0);
});
