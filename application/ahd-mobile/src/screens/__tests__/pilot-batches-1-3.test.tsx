import { render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository } from '@/state';
import { CreateAhdScreen } from '../CreateAhdScreen';
import { DaftariScreen } from '../DaftariScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('Pilot UI batches 1–3', () => {
  it('starts Create Ahd with honest empty fields and no demo fill', async () => {
    const store = new AhdJourneyStore(new InMemoryAhdRepository());
    await render(
      <AhdJourneyProvider store={store}>
        <CreateAhdScreen />
      </AhdJourneyProvider>,
    );

    expect(screen.getByLabelText('صاحب المال').props.value).toBe('');
    expect(screen.getByLabelText('المستفيد').props.value).toBe('');
    expect(screen.getByLabelText('مبلغ العهد بالريال').props.value).toBe('');
    expect(screen.getByLabelText('غرض العهد').props.value).toBe('');
    expect(screen.queryByRole('button', { name: 'تعبئة تجريبية' })).toBeNull();
    expect(screen.getByLabelText('شعار عهد الرسمي')).toBeTruthy();
  });

  it('shows every real sealed record in Daftari instead of one seeded row', async () => {
    const store = new AhdJourneyStore(new InMemoryAhdRepository());
    for (const [lender, borrower, amountMinor] of [
      ['ريم', 'هناء', 75_000],
      ['سارة', 'ليان', 120_000],
    ] as const) {
      await store.beginCreate();
      await store.reviewDraft({
        id: store.nextDraftId(),
        lender,
        borrower,
        amountMinor,
        months: 3,
      });
      await store.seal();
    }

    await render(
      <AhdJourneyProvider store={store}>
        <DaftariScreen />
      </AhdJourneyProvider>,
    );

    expect(screen.getByText('AHD-PILOT-0001')).toBeTruthy();
    expect(screen.getByText('AHD-PILOT-0002')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'فتح تفاصيل العهد' })).toHaveLength(2);
  });
});
