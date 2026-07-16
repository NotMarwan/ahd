import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { ahdCore } from '@/core/ahd-core';
import {
  AhdJourneyProvider,
  AhdJourneyStore,
  JourneySliceRepository,
  PilotProvider,
  PilotStore,
} from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { CircleAdvScreen } from '../CircleAdvScreen';
import { CircleScreen } from '../CircleScreen';
import { DisputeScreen } from '../DisputeScreen';
import { JamiyaScreen } from '../JamiyaScreen';
import { MaroofScreen } from '../MaroofScreen';
import { MineScreen } from '../MineScreen';
import { RequestScreen } from '../RequestScreen';
import { StandingScreen } from '../StandingScreen';
import { TimelineScreen } from '../TimelineScreen';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

async function setupRealPilot() {
  const repository = new InMemoryPilotRepository();
  const pilotStore = new PilotStore(repository);
  const journeyStore = new AhdJourneyStore(new JourneySliceRepository(repository), ahdCore);
  await pilotStore.hydrate();
  await pilotStore.setDisplayName('سارة');

  await journeyStore.beginCreate();
  await journeyStore.reviewDraft({
    id: 'AHD-PILOT-0001',
    lender: 'ريم',
    borrower: 'سارة',
    amountMinor: 120_000,
    months: 3,
    start: { y: 2026, m: 8 },
    timestamp: '2026-07-16T00:00:00+03:00',
  });
  await journeyStore.seal();
  await journeyStore.beginCreate();
  await journeyStore.reviewDraft({
    id: 'AHD-PILOT-0002',
    lender: 'هند',
    borrower: 'سارة',
    amountMinor: 80_000,
    open: true,
    start: { y: 2026, m: 7 },
    timestamp: '2026-07-16T00:00:00+03:00',
  });
  await journeyStore.seal();
  return { repository, pilotStore, journeyStore };
}

function providers(
  ui: ReactElement,
  pilotStore: PilotStore,
  journeyStore?: AhdJourneyStore,
) {
  return (
    <PilotProvider store={pilotStore}>
      {journeyStore ? <AhdJourneyProvider store={journeyStore}>{ui}</AhdJourneyProvider> : ui}
    </PilotProvider>
  );
}

describe('Pilot UI batches 4–6', () => {
  test('batch 4 reads what-I-owe, known history, and timeline only from real local records', async () => {
    const { pilotStore, journeyStore } = await setupRealPilot();
    expect(pilotStore.getState().profile.displayName).toBe('سارة');
    expect(journeyStore.getState().records).toHaveLength(2);

    const mine = await render(providers(<MineScreen />, pilotStore, journeyStore));
    expect(mine.getByText('لـ ريم')).toBeTruthy();
    expect(mine.getByText('لـ هند')).toBeTruthy();
    expect(mine.queryByText('فيصل')).toBeNull();
    await mine.unmount();

    const maroof = await render(providers(<MaroofScreen />, pilotStore, journeyStore));
    expect(maroof.getByText('ريم')).toBeTruthy();
    expect(maroof.getByText('هند')).toBeTruthy();
    expect(maroof.queryByText(/%|٪/)).toBeNull();
    await maroof.unmount();

    const timeline = await render(providers(<TimelineScreen />, pilotStore, journeyStore));
    expect(timeline.getAllByText('كُتب العهد')).toHaveLength(2);
    expect(timeline.getAllByText('AHD-PILOT-0001').length).toBeGreaterThan(0);
    expect(timeline.queryByText('ملاحظة تجريبية')).toBeNull();
    await timeline.unmount();
  });

  test('batch 5 uses a persisted customer circle and previews netting without claiming a transfer', async () => {
    const { pilotStore } = await setupRealPilot();
    await pilotStore.createCircle({
      kind: 'jamiya',
      title: 'جمعية البيت',
      organizer: 'سارة',
      startMonth: '2026-08',
      members: [
        { displayName: 'سارة', shareMinor: 30_000 },
        { displayName: 'ريم', shareMinor: 30_000 },
        { displayName: 'هند', shareMinor: 30_000 },
      ],
    });
    const circle = pilotStore.getState().jamiya.circles[0];
    for (const member of circle.members) {
      await pilotStore.recordCircleConsentAttestation(circle.id, member.id, {
        recordedBy: circle.organizer,
        effectiveDate: '2026-07-16',
        confirmed: true,
      });
    }
    await pilotStore.activateCircle(circle.id);
    expect(pilotStore.getState().profile.displayName).toBe('سارة');
    expect(pilotStore.getState().jamiya.circles[0].title).toBe('جمعية البيت');

    const jamiya = await render(providers(<JamiyaScreen />, pilotStore));
    expect(jamiya.getByText('جمعية البيت')).toBeTruthy();
    expect(jamiya.getAllByText('سارة').length).toBeGreaterThan(0);
    expect(jamiya.queryByText('أم سارة')).toBeNull();
    await jamiya.unmount();

    const circleView = await render(providers(<CircleScreen />, pilotStore));
    expect(circleView.getByText('جمعية البيت')).toBeTruthy();
    expect(circleView.getAllByText('الحصة 300.00 ر.س')).toHaveLength(3);
    await circleView.unmount();

    const advanced = await render(providers(<CircleAdvScreen />, pilotStore));
    expect(advanced.getByText('قبل المقاصّة · 2')).toBeTruthy();
    expect(advanced.getByText('اقتراح فقط')).toBeTruthy();
    expect(advanced.queryByText(/تم التحويل|نُقلت الأموال/)).toBeNull();
    await advanced.unmount();
  });

  test('batch 6 persists a request, shows the real open Ahd, and opens a real dispute', async () => {
    const { pilotStore, journeyStore } = await setupRealPilot();
    const recordCount = journeyStore.getState().records.length;
    expect(pilotStore.getState().profile.displayName).toBe('سارة');

    const request = await render(providers(<RequestScreen />, pilotStore));
    await fireEvent.changeText(request.getByLabelText('تطلب من'), 'نجلاء');
    await fireEvent.changeText(request.getByLabelText('المبلغ بالريال'), '450');
    await fireEvent.changeText(request.getByLabelText('الغرض'), 'احتياج أسري');
    await fireEvent.changeText(request.getByLabelText('تاريخ الطلب'), '2026-07-16');
    await fireEvent.press(request.getByRole('button', { name: 'احفظ الطلب المحلي' }));
    await waitFor(() => expect(request.getByText(/يحتاج اتصالًا لإرساله/)).toBeTruthy());
    expect(journeyStore.getState().records).toHaveLength(recordCount);
    expect(request.queryByText(/وافق نجلاء/)).toBeNull();
    await request.unmount();

    const standing = await render(providers(<StandingScreen />, pilotStore, journeyStore));
    expect(standing.getByText('AHD-PILOT-0002')).toBeTruthy();
    expect(standing.getByText('الأصل الموثّق')).toBeTruthy();
    await standing.unmount();

    const dispute = await render(providers(<DisputeScreen />, pilotStore, journeyStore));
    await fireEvent.press(dispute.getByLabelText('اختر العهد AHD-PILOT-0001'));
    await fireEvent.changeText(dispute.getByLabelText('سبب النزاع'), 'اختلاف في إثبات دفعة');
    await fireEvent.changeText(dispute.getByLabelText('تاريخ فتح النزاع'), '2026-07-16');
    await fireEvent.press(dispute.getByRole('button', { name: 'افتح القضية محليًا' }));
    await waitFor(() => expect(dispute.getByText('اختلاف في إثبات دفعة')).toBeTruthy());
    expect(dispute.getByRole('button', { name: 'اعرض السجل المختوم' })).toBeTruthy();
    await dispute.unmount();
  });
});
