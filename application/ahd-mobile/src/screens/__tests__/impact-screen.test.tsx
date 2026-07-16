import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { ahdCore } from '@/core/ahd-core';
import {
  AhdJourneyProvider,
  AhdJourneyStore,
  JourneySliceRepository,
  PilotProvider,
  PilotStore,
} from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { ImpactScreen } from '../ImpactScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يعرض الأثر كمجاميع مشتقة من سجلّات الجهاز فقط بلا أسماء ولا بيانات اختبار', async () => {
  const repository = new InMemoryPilotRepository();
  const pilotStore = new PilotStore(repository);
  const journeyStore = new AhdJourneyStore(new JourneySliceRepository(repository), ahdCore);
  await pilotStore.hydrate();
  await journeyStore.beginCreate();
  await journeyStore.reviewDraft({
    id: 'AHD-PILOT-0001',
    lender: 'ريم',
    borrower: 'سارة',
    amountMinor: 50_000,
    months: 2,
    start: { y: 2026, m: 8 },
    timestamp: '2026-07-16T00:00:00+03:00',
  });
  await journeyStore.seal();

  const view = await render(
    <PilotProvider store={pilotStore}>
      <AhdJourneyProvider store={journeyStore}>
        <ImpactScreen />
      </AhdJourneyProvider>
    </PilotProvider>,
  );

  expect(view.getByText('أثر عهد')).toBeTruthy();
  expect(view.getByText('التزامًا موثّقًا')).toBeTruthy();
  expect(view.getByText('500.00 ر.س')).toBeTruthy();
  expect(view.getAllByText(/سجلّات هذا الجهاز فقط/).length).toBeGreaterThan(0);
  expect(view.queryByText(/بيانات اختبار/)).toBeNull();
});
