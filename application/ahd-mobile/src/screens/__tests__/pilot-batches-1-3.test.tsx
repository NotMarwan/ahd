import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository } from '@/state';
import { createShareEnvelope, serializeShareEnvelope } from '@/share';
import { CreateAhdScreen } from '../CreateAhdScreen';
import { DaftariScreen } from '../DaftariScreen';
import { ProofScreen } from '../ProofScreen';

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

  it('imports and persists only a ShareEnvelopeV1 that matches its attached proof', async () => {
    const source = new AhdJourneyStore(new InMemoryAhdRepository());
    await source.beginCreate();
    await source.reviewDraft({
      id: 'AHD-SHARED-0001',
      lender: 'سارة',
      borrower: 'أحمد',
      amountMinor: 80_000,
      months: 2,
      timestamp: '2026-07-16T16:00:00+03:00',
    });
    await source.seal();
    const sourceState = source.getState();
    const serialized = serializeShareEnvelope(createShareEnvelope({
      record: sourceState.sealed!.record,
      proof: sourceState.proof!,
      exportedAt: sourceState.sealed!.prepared.sourceDraft.timestamp,
    }));
    const target = new AhdJourneyStore(new InMemoryAhdRepository());
    const view = await render(
      <AhdJourneyProvider store={target}>
        <ProofScreen />
      </AhdJourneyProvider>,
    );

    fireEvent.changeText(view.getByLabelText('بيانات السجل المشترك'), serialized);
    await waitFor(() => expect(
      view.getByRole('button', { name: 'تحقق من السجل المستورد' }),
    ).toBeEnabled());
    await act(async () => {
      await fireEvent.press(view.getByRole('button', { name: 'تحقق من السجل المستورد' }));
    });
    await waitFor(() => expect(target.getState().imports).toHaveLength(1));
    expect(view.getByText('السجل مطابق للإثبات المرفق')).toBeTruthy();

    const tampered = JSON.parse(serialized) as { record: { amount_minor: number } };
    tampered.record.amount_minor += 1;
    fireEvent.changeText(view.getByLabelText('بيانات السجل المشترك'), JSON.stringify(tampered));
    await waitFor(() => expect(view.getByLabelText('بيانات السجل المشترك').props.value).toContain('80001'));
    await act(async () => {
      await fireEvent.press(view.getByRole('button', { name: 'تحقق من السجل المستورد' }));
    });
    await waitFor(() => expect(view.getByText(/توقّف الاستيراد/)).toBeTruthy());
    expect(target.getState().imports).toHaveLength(1);
  });
});
