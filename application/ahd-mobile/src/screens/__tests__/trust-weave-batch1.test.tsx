import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository } from '@/state';
import { HomeScreen } from '../HomeScreen';
import { OpenLoanScreen } from '../OpenLoanScreen';
import { SettlementScreen } from '../SettlementScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

function renderWithJourney(element: React.ReactElement) {
  const store = new AhdJourneyStore(new InMemoryAhdRepository());
  return render(<AhdJourneyProvider store={store}>{element}</AhdJourneyProvider>);
}

describe('Trust Weave reference batch 1', () => {
  it('renders the home weave, balance board, official logo, and primary path', async () => {
    await renderWithJourney(<HomeScreen />);

    expect(screen.getByText(/المعروف بينكم/)).toBeTruthy();
    expect(screen.getByTestId('home-weave')).toBeTruthy();
    expect(screen.getByTestId('home-balance-board')).toBeTruthy();
    expect(screen.getByLabelText('شعار عهد الرسمي')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ابدأ عهدًا جديدًا' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'ابدأ الجولة التجريبية' })).toBeNull();
  });

  it('renders the open-loan hero, woven repayment meter, and living ledger', async () => {
    await render(<OpenLoanScreen />);

    expect(screen.getByText('رحلة الوفاء')).toBeTruthy();
    expect(screen.getByTestId('open-loan-hero')).toBeTruthy();
    expect(screen.getByTestId('repayment-thread-meter')).toBeTruthy();
    expect(screen.getByText('الدفتر الحي')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'راجع الإبراء' }));
    await waitFor(() => expect(screen.getByText(/الإبراء يحتاج تأكيدًا موثقًا/)).toBeTruthy());
  });

  it('renders explainable before-and-after netting before any mutation', async () => {
    await renderWithJourney(<SettlementScreen />);

    expect(screen.getByText(/نفكّ التشابك/)).toBeTruthy();
    expect(screen.getByTestId('netting-visual')).toBeTruthy();
    expect(screen.getByText('9')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });
});
