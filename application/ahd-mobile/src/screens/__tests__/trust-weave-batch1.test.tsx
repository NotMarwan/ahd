import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository } from '@/state';
import { HomeScreen } from '../HomeScreen';
import { OpenLoanScreen } from '../OpenLoanScreen';
import { SettlementScreen } from '../SettlementScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

async function storeWithNetwork() {
  const store = new AhdJourneyStore(new InMemoryAhdRepository());
  for (const draft of [
    { id: 'AHD-WEAVE-0001', lender: 'سارة', borrower: 'أحمد' },
    { id: 'AHD-WEAVE-0002', lender: 'أحمد', borrower: 'ريم' },
  ]) {
    await store.beginCreate();
    await store.reviewDraft({ ...draft, amountMinor: 120_000, months: 3 });
    await store.seal();
  }
  return store;
}

describe('Trust Weave real Pilot batch', () => {
  it('renders the home weave, balance board, official logo, and primary path', async () => {
    const store = new AhdJourneyStore(new InMemoryAhdRepository());
    const view = await render(
      <AhdJourneyProvider store={store}>
        <HomeScreen />
      </AhdJourneyProvider>,
    );

    expect(view.getByText(/المعروف بينكم/)).toBeTruthy();
    expect(view.getByTestId('home-weave')).toBeTruthy();
    expect(view.getByTestId('home-balance-board')).toBeTruthy();
    expect(view.getAllByLabelText('شعار عهد الرسمي')).toHaveLength(1);
    expect(view.getByRole('button', { name: 'ابدأ عهدًا جديدًا' })).toBeTruthy();
    expect(view.queryByRole('button', { name: 'ابدأ الجولة التجريبية' })).toBeNull();
  });

  it('renders the open-loan surface only from the selected real record', async () => {
    const store = await storeWithNetwork();
    const view = await render(
      <AhdJourneyProvider store={store}>
        <OpenLoanScreen />
      </AhdJourneyProvider>,
    );

    expect(view.getByText('رحلة الوفاء')).toBeTruthy();
    expect(view.getByTestId('open-loan-hero')).toBeTruthy();
    expect(view.getByTestId('repayment-thread-meter')).toBeTruthy();
    expect(view.getAllByLabelText('شعار عهد الرسمي')).toHaveLength(1);
    fireEvent.press(view.getByRole('button', { name: 'راجع الإبراء' }));
    await waitFor(() => expect(view.getByText(/لم يتغيّر الرصيد/)).toBeTruthy());
  });

  it('renders explainable real before-and-after netting before persistence', async () => {
    const store = await storeWithNetwork();
    const view = await render(
      <AhdJourneyProvider store={store}>
        <SettlementScreen />
      </AhdJourneyProvider>,
    );

    expect(view.getByText(/نختصر التحويل/)).toBeTruthy();
    expect(view.getByTestId('netting-visual')).toBeTruthy();
    expect(view.getByText('قبل: 2')).toBeTruthy();
    expect(view.getByText('بعد: 1')).toBeTruthy();
    expect(view.getAllByLabelText('شعار عهد الرسمي')).toHaveLength(1);
  });
});
