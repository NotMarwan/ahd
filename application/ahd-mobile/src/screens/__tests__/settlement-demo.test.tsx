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

describe('تسوية السجلات الحقيقية', () => {
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
    expect(view.getByRole('button', { name: 'احفظ اقتراح التسوية' })).toBeDisabled();

    fireEvent.press(view.getByRole('checkbox', { name: 'أؤكد رضا جميع الأطراف عن هذا الاقتراح' }));
    await waitFor(() => expect(
      view.getByRole('button', { name: 'احفظ اقتراح التسوية' }),
    ).toBeEnabled());
    await act(async () => {
      await fireEvent.press(view.getByRole('button', { name: 'احفظ اقتراح التسوية' }));
    });

    await waitFor(() => expect(store.getState().step).toBe('settlement'));
    expect(store.getState().settlement?.beforeCount).toBe(2);
    expect(store.getState().settlement?.afterCount).toBe(1);
    expect(store.getState().settlementConsent?.confirmed).toBe(true);
  });

  it('تعرض خمسة أشخاص ونتيجة 9 إلى 2 ببيانات معلّمة من دون حفظ', async () => {
    const store = new AhdJourneyStore(new InMemoryAhdRepository());
    const view = await render(
      <AhdJourneyProvider store={store}>
        <SettlementScreen />
      </AhdJourneyProvider>,
    );

    expect(view.getAllByText('بيانات تجريبية').length).toBeGreaterThan(0);
    expect(view.getAllByTestId(/^netting-participant-/)).toHaveLength(5);
    for (const name of ['نورة', 'سارة', 'خالد', 'ليلى', 'فهد']) {
      expect(view.getByTestId(`netting-participant-${name}`)).toBeTruthy();
    }
    expect(view.getByText('قبل: 9')).toBeTruthy();
    expect(view.getByText('بعد: 2')).toBeTruthy();
    expect(view.getByText('العهود التجريبية الداخلة · 9')).toBeTruthy();
    expect(view.getByText('التحويلات المقترحة · 2')).toBeTruthy();
    expect(view.queryByText('قبل — خيوط متقاطعة')).toBeNull();
    expect(view.queryByRole('checkbox')).toBeNull();
    expect(view.queryByRole('button', { name: 'احفظ اقتراح التسوية' })).toBeNull();
    expect(store.getState().records).toHaveLength(0);
  });
});
