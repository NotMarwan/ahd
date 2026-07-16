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
import { BoundsScreen } from '../BoundsScreen';
import { DailyScreen } from '../DailyScreen';
import { ImpactScreen } from '../ImpactScreen';
import { MoreScreen } from '../MoreScreen';
import { OrgScreen } from '../OrgScreen';
import { PlansScreen } from '../PlansScreen';
import { RefusalScreen } from '../RefusalScreen';
import { SettingsScreen } from '../SettingsScreen';
import { ShariahScreen } from '../ShariahScreen';

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

async function setupEmptyPilot() {
  const repository = new InMemoryPilotRepository();
  const pilotStore = new PilotStore(repository);
  const journeyStore = new AhdJourneyStore(new JourneySliceRepository(repository), ahdCore);
  await pilotStore.hydrate();
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

describe('Pilot UI batches 7–9', () => {
  test('batch 7 impact derives only from actual local records with no seeded aggregates', async () => {
    const { pilotStore, journeyStore } = await setupRealPilot();

    const impact = await render(providers(<ImpactScreen />, pilotStore, journeyStore));
    expect(impact.getByText('2')).toBeTruthy();
    expect(impact.getByText('2,000.00 ر.س')).toBeTruthy();
    expect(impact.getAllByText(/سجلّات هذا الجهاز فقط/).length).toBeGreaterThan(0);
    expect(impact.queryByText('فيصل')).toBeNull();
    expect(impact.queryByText('نورة')).toBeNull();
    expect(impact.queryByText(/بيانات اختبار/)).toBeNull();
    await impact.unmount();
  });

  test('batch 7 impact shows an honest empty state with a real next action', async () => {
    const { pilotStore, journeyStore } = await setupEmptyPilot();

    const impact = await render(providers(<ImpactScreen />, pilotStore, journeyStore));
    expect(impact.getByText('لا أثر بعد')).toBeTruthy();
    await fireEvent.press(impact.getByRole('button', { name: 'أنشئ عهدًا' }));
    expect(mockPush).toHaveBeenCalledWith('/create');
    await impact.unmount();
  });

  test('batch 7 bounds runs the real riba screen on typed terms', async () => {
    const { pilotStore } = await setupEmptyPilot();

    const bounds = await render(providers(<BoundsScreen />, pilotStore));
    await fireEvent.changeText(
      bounds.getByLabelText('نصّ الشرط'),
      'وعند التأخير تُضاف غرامة ٥٪',
    );
    await fireEvent.press(bounds.getByRole('button', { name: 'افحص الشرط' }));
    await waitFor(() => expect(bounds.getByText(/رُفض الشرط/)).toBeTruthy());

    await fireEvent.changeText(bounds.getByLabelText('نصّ الشرط'), 'قرض حسن بلا زيادة');
    await fireEvent.press(bounds.getByRole('button', { name: 'افحص الشرط' }));
    await waitFor(() => expect(bounds.getByText(/سليمٌ من الربا/)).toBeTruthy());
    await bounds.unmount();
  });

  test('batch 7 refusal demonstrates the enforced penalty refusal with a live check', async () => {
    const { pilotStore } = await setupEmptyPilot();

    const refusal = await render(providers(<RefusalScreen />, pilotStore));
    expect(refusal.getByText('عهد لا يُقرض، لا يُقيّم، لا يحكم')).toBeTruthy();
    await fireEvent.press(refusal.getByRole('button', { name: 'جرّب: اشترط غرامة تأخير' }));
    await waitFor(() => expect(refusal.getByText(/رفض المحرّك الشرط/)).toBeTruthy());
    expect(refusal.queryByText(/تم التحويل/)).toBeNull();
    await refusal.unmount();
  });

  test('batch 8 org shows honest local aggregates and never implies an institutional link', async () => {
    const { pilotStore } = await setupRealPilot();
    await pilotStore.createCircle({
      kind: 'jamiya',
      title: 'جمعية البيت',
      organizer: 'سارة',
      startMonth: '2026-08',
      members: [
        { displayName: 'سارة', shareMinor: 30_000 },
        { displayName: 'ريم', shareMinor: 30_000 },
      ],
    });

    const org = await render(providers(<OrgScreen />, pilotStore));
    expect(org.getByText(/لا مؤسسة مرتبطة/)).toBeTruthy();
    expect(org.getByText('يحتاج اتصالًا')).toBeTruthy();
    expect(org.getByText('جمعية البيت')).toBeTruthy();
    expect(org.queryByText('نورة')).toBeNull();
    expect(org.queryByText('خالد')).toBeNull();
    expect(org.queryByText(/عهودٌ نشطة/)).toBeNull();
    await org.unmount();
  });

  test('batch 8 plans states there is no active subscription and no payment collection', async () => {
    const { pilotStore } = await setupEmptyPilot();

    const plans = await render(providers(<PlansScreen />, pilotStore));
    expect(plans.getByText(/لا اشتراك نشطًا/)).toBeTruthy();
    expect(plans.getAllByText(/قيد المراجعة الشرعيّة/).length).toBeGreaterThan(0);
    expect(plans.getByText('مجاني')).toBeTruthy();
    expect(plans.queryByText(/اشترك الآن|ادفع/)).toBeNull();
    await plans.unmount();
  });

  test('batch 8 settings persists the display name and local preferences', async () => {
    const { repository, pilotStore } = await setupEmptyPilot();

    const settings = await render(providers(<SettingsScreen />, pilotStore));
    await fireEvent.changeText(settings.getByLabelText('اسم العرض'), 'سارة');
    await fireEvent.press(settings.getByRole('button', { name: 'احفظ اسم العرض' }));
    await waitFor(() => expect(pilotStore.getState().profile.displayName).toBe('سارة'));

    const hide = settings.getByLabelText('إخفاء المبالغ');
    await fireEvent(hide, 'valueChange', true);
    await waitFor(async () => {
      expect((await repository.loadAll()).settings.hideAmounts).toBe(true);
    });
    await settings.unmount();
  });

  test('batch 8 settings exports all pilot data as the deterministic portable envelope', async () => {
    const { pilotStore } = await setupRealPilot();
    const serialized = await pilotStore.exportPortable();
    const parsed = JSON.parse(serialized) as { format: string; slices: Record<string, unknown> };
    expect(parsed.format).toBe('AhdPilotExportV1');
    expect(Object.keys(parsed.slices)).toEqual(
      ['profile', 'journey', 'daily', 'jamiya', 'settings'],
    );

    const settings = await render(providers(<SettingsScreen />, pilotStore));
    expect(settings.getByRole('button', { name: 'صدّر بيانات عهد' })).toBeTruthy();
    await settings.unmount();
  });

  test('batch 8 settings requires a deliberate two-step confirmation before deleting local data', async () => {
    const { pilotStore } = await setupRealPilot();
    expect(pilotStore.getState().profile.displayName).toBe('سارة');

    const settings = await render(providers(<SettingsScreen />, pilotStore));
    expect(settings.queryByRole('button', { name: 'تأكيد الحذف النهائي' })).toBeNull();
    await fireEvent.press(settings.getByRole('button', { name: 'احذف كل بيانات عهد من هذا الجهاز' }));
    await fireEvent.press(settings.getByRole('button', { name: 'تأكيد الحذف النهائي' }));
    await waitFor(() => expect(pilotStore.getState().profile.displayName).toBeNull());
    expect(pilotStore.getState().profile.welcomeAccepted).toBe(false);
    await settings.unmount();
  });

  test('batch 9 daily persists a typed local qaid and shows it from the daily slice', async () => {
    const { repository, pilotStore } = await setupEmptyPilot();

    const daily = await render(providers(<DailyScreen />, pilotStore));
    expect(daily.getByText('لا قيود بعد')).toBeTruthy();

    await fireEvent.changeText(daily.getByLabelText('عنوان القيد'), 'قيد اليوم');
    await fireEvent.changeText(daily.getByLabelText('نصّ القيد'), 'سلّمت ريم دفعة يدًا بيد');
    await fireEvent.changeText(daily.getByLabelText('تاريخ القيد'), '2026-07-16');
    await fireEvent.press(daily.getByRole('button', { name: 'احفظ القيد' }));

    await waitFor(() => expect(daily.getByText('قيد اليوم')).toBeTruthy());
    expect(daily.getByText('سلّمت ريم دفعة يدًا بيد')).toBeTruthy();
    expect((await repository.loadAll()).daily.entries).toHaveLength(1);
    expect(daily.queryByText('لا قيود بعد')).toBeNull();
    await daily.unmount();
  });

  test('batch 9 daily rejects an invalid date without persisting anything', async () => {
    const { repository, pilotStore } = await setupEmptyPilot();

    const daily = await render(providers(<DailyScreen />, pilotStore));
    await fireEvent.changeText(daily.getByLabelText('عنوان القيد'), 'قيد فاسد');
    await fireEvent.changeText(daily.getByLabelText('نصّ القيد'), 'نص');
    await fireEvent.changeText(daily.getByLabelText('تاريخ القيد'), '2026-02-30');
    await fireEvent.press(daily.getByRole('button', { name: 'احفظ القيد' }));

    await waitFor(() => expect(daily.getByText(/effectiveDate/)).toBeTruthy());
    expect((await repository.loadAll()).daily.entries).toHaveLength(0);
    await daily.unmount();
  });

  test('batch 9 more lists the daily route and shariah keeps the no-fatwa boundary', async () => {
    const { pilotStore } = await setupEmptyPilot();

    const more = await render(providers(<MoreScreen />, pilotStore));
    await fireEvent.press(more.getByRole('button', { name: 'اليومي' }));
    expect(mockPush).toHaveBeenCalledWith('/daily');
    await more.unmount();

    const shariah = await render(providers(<ShariahScreen />, pilotStore));
    expect(shariah.getByText('الأساس الشرعي')).toBeTruthy();
    expect(shariah.getAllByText(/ولا يُفتي/).length).toBeGreaterThan(0);
    expect(shariah.getAllByText(/بانتظار مراجعة عالِم/).length).toBeGreaterThan(0);
    await shariah.unmount();
  });
});
