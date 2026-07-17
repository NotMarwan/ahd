import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository } from '@/state';
import { OpenLoanScreen } from '../OpenLoanScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

async function sealedStore() {
  const store = new AhdJourneyStore(new InMemoryAhdRepository());
  await store.beginCreate();
  await store.reviewDraftFromForm({
    id: 'AHD-REAL-0001',
    lender: 'سارة',
    borrower: 'أحمد',
    amountSarText: '8000',
    months: 4,
    start: { y: 2026, m: 7 },
    timestamp: '2026-07-16T16:00:00+03:00',
  });
  await store.seal();
  return store;
}

test('يعرض رحلة الوفاء من السجل الحقيقي بلا أرقام أو أطراف مزروعة', async () => {
  const store = await sealedStore();
  const view = await render(
    <AhdJourneyProvider store={store}>
      <OpenLoanScreen />
    </AhdJourneyProvider>,
  );

  expect(view.getByText('رحلة الوفاء')).toBeTruthy();
  expect(view.getByText(/AHD-REAL-0001/)).toBeTruthy();
  expect(view.getByText('سارة')).toBeTruthy();
  expect(view.getByText('أحمد')).toBeTruthy();
  expect(view.getByText('8,000.00 ر.س')).toBeTruthy();
  expect(view.queryByText(/AH-2841|4,160|52%|a3f27c/)).toBeNull();
  expect(view.getByTestId('repayment-thread-meter')).toBeTruthy();

  fireEvent.press(view.getByRole('button', { name: 'راجع الإبراء' }));
  await waitFor(() => expect(view.getByText(/لم يتغيّر الرصيد/)).toBeTruthy());
});

test('يعرض رحلة تجريبية معلّمة حين لا يوجد عهد حقيقي من دون حفظها', async () => {
  const store = new AhdJourneyStore(new InMemoryAhdRepository());
  const view = await render(
    <AhdJourneyProvider store={store}>
      <OpenLoanScreen />
    </AhdJourneyProvider>,
  );

  expect(view.getByText('عرض تجريبي')).toBeTruthy();
  expect(view.getByText(/AHD-OPEN/)).toBeTruthy();
  expect(view.getByText('منيرة')).toBeTruthy();
  expect(view.getByText('ماجد')).toBeTruthy();
  expect(view.getByText('20,000.00 ر.س')).toBeTruthy();
  expect(view.queryByRole('button', { name: 'أنشئ عهدًا' })).toBeNull();
  expect(store.getState().records).toHaveLength(0);
});
