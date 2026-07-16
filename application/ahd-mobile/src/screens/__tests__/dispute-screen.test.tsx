import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { DisputeScreen } from '../DisputeScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('لا ينشئ النزاع سجلًا ثابتًا ويطلب عهدًا حقيقيًا أولًا', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider><DisputeScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('النزاع')).toBeTruthy();
  expect(view.getByText('لا يوجد عهد لفتح قضية عليه')).toBeTruthy();
  expect(view.queryByText(/سالم/)).toBeNull();
  expect(view.getByRole('button', { name: 'افتح دفتري' })).toBeTruthy();
});
