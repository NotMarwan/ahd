import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { StandingScreen } from '../StandingScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('لا تعرض سلفة مزروعة وتوجّه لإنشاء عهد مفتوح', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider><StandingScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('لا توجد سلفة مفتوحة')).toBeTruthy();
  expect(view.queryByText('شقة الملقا')).toBeNull();
  expect(view.getByRole('button', { name: 'أنشئ عهدًا مفتوحًا' })).toBeTruthy();
});
