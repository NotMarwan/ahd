import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { CircleAdvScreen } from '../CircleAdvScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('لا تدّعي الدائرة+ مقاصّة أو تحويلات قبل وجود دائرة حقيقية', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  const view = await render(<PilotProvider store={store}><CircleAdvScreen /></PilotProvider>);
  expect(view.getByText('الدائرة+')).toBeTruthy();
  expect(view.getByText('لا توجد التزامات دائرة جاهزة')).toBeTruthy();
  expect(view.queryByText(/9 عهود/)).toBeNull();
});
