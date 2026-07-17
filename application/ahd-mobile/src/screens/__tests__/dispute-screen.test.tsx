import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository, PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { DisputeScreen } from '../DisputeScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يعرض قضية تجريبية مكتملة ومعلّمة من دون حفظها', async () => {
  const store = new PilotStore(new InMemoryPilotRepository());
  const journeyStore = new AhdJourneyStore(new InMemoryAhdRepository());
  await store.hydrate();
  const view = await render(<PilotProvider store={store}><AhdJourneyProvider store={journeyStore}><DisputeScreen /></AhdJourneyProvider></PilotProvider>);
  expect(view.getByText('النزاع')).toBeTruthy();
  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByRole('radio', { name: 'اختر العهد AHD-DISP' })).toBeChecked();
  expect(view.getByLabelText('سبب النزاع').props.value).toBe('اختلف ماجد ونايف على إثبات دفعة يونيو؛ جُمّد العهد حتى يرفقا الإيصال.');
  expect(view.getByLabelText('تاريخ فتح النزاع').props.value).toBe('2026-06-21');
  expect(view.getByRole('button', { name: 'مثال غير محفوظ' })).toBeDisabled();
  expect(view.getByText('DISPUTE-DEMO-0001')).toBeTruthy();
  expect(store.getState().daily.entries).toHaveLength(0);
  expect(journeyStore.getState().records).toHaveLength(0);
});
