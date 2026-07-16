import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { TimelineScreen } from '../TimelineScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يعرض خطًا زمنيًا فارغًا صادقًا بلا ملاحظات مزروعة', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider><TimelineScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('الخط الزمني')).toBeTruthy();
  expect(view.getByText('لا توجد أحداث بعد')).toBeTruthy();
  expect(view.getByRole('button', { name: 'أنشئ عهدًا' })).toBeTruthy();
});
