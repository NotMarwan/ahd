import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { StandingScreen } from '../StandingScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('تعرض سلفة تجريبية مفتوحة ومعلّمة من دون حفظها', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  const journeyStore = new AhdJourneyStore(new InMemoryAhdRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider store={journeyStore}><StandingScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('عرض تجريبي')).toBeTruthy();
  expect(view.getByText('عهود مفتوحة · 1')).toBeTruthy();
  expect(view.getByText('AHD-STANDING')).toBeTruthy();
  expect(view.getByText('3,200.00 ر.س')).toBeTruthy();
  expect(view.getByText('أبو فهد ← راميش')).toBeTruthy();
  expect(view.queryByRole('button', { name: 'افتح العهد' })).toBeNull();
  expect(journeyStore.getState().records).toHaveLength(0);
});
