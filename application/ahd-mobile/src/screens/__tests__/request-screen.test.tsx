import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { RequestScreen } from '../RequestScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يبدأ طلب العهد فارغًا ولا ينتحل قبول الطرف الآخر', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><RequestScreen /></PilotProvider>);
  expect(view.getByText('طلب عهد')).toBeTruthy();
  expect(view.getByLabelText('تطلب من').props.value).toBe('');
  expect(view.queryByText(/وافق .* على العهد/)).toBeNull();
  expect(view.getByRole('button', { name: 'احفظ الطلب المحلي' })).toBeTruthy();
});
