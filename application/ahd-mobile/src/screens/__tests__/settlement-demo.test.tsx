import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository } from '@/state';
import { SettlementScreen } from '../SettlementScreen';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../../generated/engine.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Settlement = require('../../generated/features/settlement.js');

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('مقاصّة الشبكة', () => {
  it('تقلّص شبكة التحويلات وتحافظ على مجموع الالتزامات', () => {
    const view = Settlement.settlementView(engine.IOUS, engine);
    expect(view.conserved).toBe(true);
    expect(view.afterCount).toBeLessThan(view.beforeCount);
  });

  it('تعرض الشبكة قبل المقاصّة وتظهر «المجموع محفوظ» بعد التشغيل', async () => {
    const store = new AhdJourneyStore(new InMemoryAhdRepository());
    await store.beginCreate();
    await store.reviewDraftFromForm({
      id: 'AHD-TEST-001',
      lender: 'نورة',
      borrower: 'سارة',
      amountSarText: '1200',
      months: 4,
      open: false,
      start: { y: 2026, m: 7 },
      timestamp: '2026-07-01T10:00:00+03:00',
      purpose: 'قرض حسن',
    });
    await store.seal();

    const screen = await render(
      <AhdJourneyProvider store={store}>
        <SettlementScreen />
      </AhdJourneyProvider>,
    );

    expect(screen.getByText('400.00 ر.س')).toBeTruthy();
    expect(screen.getByText('50.00 ر.س')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'شغّل مقاصّة الشبكة' }));
    await waitFor(() => expect(store.getState().step).toBe('settlement'));

    expect(await screen.findByText('المجموع محفوظ')).toBeTruthy();
    expect(screen.getByText('حُفظ مجموع الالتزامات')).toBeTruthy();
    expect(screen.getByText(`قبل: ${engine.IOUS.length} تحويلات`)).toBeTruthy();
    expect(screen.getByText('بعد: 2 تحويل')).toBeTruthy();
  });
});
