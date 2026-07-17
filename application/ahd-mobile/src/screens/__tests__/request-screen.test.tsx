import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { RequestScreen } from '../RequestScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يعرض طلبًا تجريبيًا معلّمًا ولا ينتحل قبول الطرف الآخر', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  await store.hydrate();
  await store.setDisplayName('سارة');
  const view = await render(<PilotProvider store={store}><RequestScreen /></PilotProvider>);
  expect(view.getByText('طلب عهد')).toBeTruthy();
  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByLabelText('تطلب من').props.value).toBe('نورة');
  expect(view.getByLabelText('المبلغ بالريال').props.value).toBe('2500');
  expect(view.getByLabelText('الغرض').props.value).toBe('إصلاح السيارة');
  expect(view.getByLabelText('تاريخ الطلب').props.value).toBe('2026-07-17');
  expect(view.getByText('REQUEST-DEMO-0001')).toBeTruthy();
  expect(view.queryByText(/وافق .* على العهد/)).toBeNull();
  expect(store.getState().daily.entries).toHaveLength(0);
  await fireEvent.press(view.getByRole('button', { name: 'احفظ الطلب المحلي' }));
  await waitFor(() => expect(store.getState().daily.entries).toHaveLength(1));
  expect(store.getState().daily.entries[0]).toMatchObject({ borrower: 'سارة', lender: 'نورة' });
});
