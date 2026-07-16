import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository } from '@/state';
import { SettlementScreen } from '../SettlementScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

async function networkStore() {
  const store = new AhdJourneyStore(new InMemoryAhdRepository());
  for (const draft of [
    { id: 'AHD-NET-0001', lender: 'سارة', borrower: 'أحمد' },
    { id: 'AHD-NET-0002', lender: 'أحمد', borrower: 'ريم' },
  ]) {
    await store.beginCreate();
    await store.reviewDraftFromForm({
      ...draft,
      amountSarText: '1200',
      months: 3,
      start: { y: 2026, m: 7 },
      timestamp: '2026-07-16T16:00:00+03:00',
    });
    await store.seal();
  }
  return store;
}

describe('مقاصّة السجلات الحقيقية', () => {
  it('تعرض الشبكة المتصلة وتمنع الحفظ حتى الإقرار الصريح', async () => {
    const store = await networkStore();
    const view = await render(
      <AhdJourneyProvider store={store}>
        <SettlementScreen />
      </AhdJourneyProvider>,
    );

    expect(view.getByTestId('netting-visual')).toBeTruthy();
    expect(view.getByText('قبل: 2')).toBeTruthy();
    expect(view.getByText('بعد: 1')).toBeTruthy();
    expect(view.getByRole('button', { name: 'احفظ اقتراح المقاصّة' })).toBeDisabled();

    fireEvent.press(view.getByRole('checkbox', { name: 'أؤكد رضا جميع الأطراف عن هذا الاقتراح' }));
    await waitFor(() => expect(
      view.getByRole('button', { name: 'احفظ اقتراح المقاصّة' }),
    ).toBeEnabled());
    await act(async () => {
      await fireEvent.press(view.getByRole('button', { name: 'احفظ اقتراح المقاصّة' }));
    });

    await waitFor(() => expect(store.getState().step).toBe('settlement'));
    expect(store.getState().settlement?.beforeCount).toBe(2);
    expect(store.getState().settlement?.afterCount).toBe(1);
    expect(store.getState().settlementConsent?.confirmed).toBe(true);
    expect(view.getByText('المجموع محفوظ')).toBeTruthy();
  });

  it('لا يعرض شبكة مزروعة عندما يكون الدفتر خاليًا', async () => {
    const store = new AhdJourneyStore(new InMemoryAhdRepository());
    const view = await render(
      <AhdJourneyProvider store={store}>
        <SettlementScreen />
      </AhdJourneyProvider>,
    );

    expect(view.getByText('لا توجد شبكة للمقاصّة')).toBeTruthy();
    expect(view.queryByTestId('netting-visual')).toBeNull();
    expect(view.getByRole('button', { name: 'أنشئ عهدًا' })).toBeTruthy();
  });
});
