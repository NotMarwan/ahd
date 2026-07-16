import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { CircleScreen } from '../CircleScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('تعرض الدائرة حالة فارغة قابلة للتنفيذ بلا رحلة مزروعة', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  const view = await render(<PilotProvider store={store}><CircleScreen /></PilotProvider>);
  expect(view.getByText('لا توجد دائرة')).toBeTruthy();
  expect(view.queryByText('رحلة العلا')).toBeNull();
  expect(view.getByRole('button', { name: 'أنشئ جمعية' })).toBeTruthy();
});
