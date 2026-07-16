import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { MaroofScreen } from '../MaroofScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('لا يصنع سجل معروف أو نسبة ثقة من بذور ثابتة', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider><MaroofScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('سجلّ المعروف')).toBeTruthy();
  expect(view.getByText('لا يوجد تاريخ محلي بعد')).toBeTruthy();
  expect(view.queryByText('نورة')).toBeNull();
});
