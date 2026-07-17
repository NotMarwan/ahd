import type { PropsWithChildren } from 'react';
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
import { BoundsScreen } from '../BoundsScreen';
import { CreateAhdScreen } from '../CreateAhdScreen';
import { DaftariScreen } from '../DaftariScreen';
import { DailyScreen } from '../DailyScreen';
import { ImpactScreen } from '../ImpactScreen';
import { JamiyaScreen } from '../JamiyaScreen';
import { ProofScreen } from '../ProofScreen';
import { RequestScreen } from '../RequestScreen';
import { SettingsScreen } from '../SettingsScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn(), back: jest.fn() }) }));

async function harness(displayName?: string) {
  const repository = new InMemoryPilotRepository();
  const pilotStore = new PilotStore(repository);
  const journeyStore = new AhdJourneyStore(new JourneySliceRepository(repository), ahdCore);
  await pilotStore.hydrate();
  await journeyStore.hydrate();
  if (displayName) await pilotStore.setDisplayName(displayName);
  return { pilotStore, journeyStore };
}

function Providers({ children, pilotStore, journeyStore }: PropsWithChildren<{
  pilotStore: PilotStore;
  journeyStore: AhdJourneyStore;
}>) {
  return (
    <PilotProvider store={pilotStore}>
      <AhdJourneyProvider store={journeyStore}>{children}</AhdJourneyProvider>
    </PilotProvider>
  );
}

test('يملأ إنشاء عهد بقصة تجريبية من دون إنشاء سجل عند العرض', async () => {
  const { pilotStore, journeyStore } = await harness();
  const view = await render(
    <Providers pilotStore={pilotStore} journeyStore={journeyStore}>
      <CreateAhdScreen />
    </Providers>,
  );

  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByLabelText('صاحب المال').props.value).toBe('نايف العتيبي');
  expect(view.getByLabelText('المستفيد').props.value).toBe('سلطان');
  expect(view.getByLabelText('مبلغ العهد بالريال').props.value).toBe('1200');
  expect(view.getByLabelText('غرض العهد').props.value).toBe('سلفة شخصية بلا زيادة');
  expect(view.getByLabelText('عدد أشهر السداد').props.value).toBe('1');
  expect(view.getByLabelText('شهر أول استحقاق').props.value).toBe('2026-05');
  expect(view.getByLabelText('تاريخ الاتفاق').props.value).toBe('2026-04-15');
  expect(journeyStore.getState().records).toHaveLength(0);
});

test('يجهز اليومي بقيد مفيد من دون حفظه عند العرض', async () => {
  const { pilotStore, journeyStore } = await harness('نورة');
  const view = await render(
    <Providers pilotStore={pilotStore} journeyStore={journeyStore}><DailyScreen /></Providers>,
  );
  expect(view.getByLabelText('عنوان القيد').props.value).toBe('قيد اليوم');
  expect(view.getByLabelText('نصّ القيد').props.value).toContain('200');
  expect(view.getByLabelText('تاريخ القيد').props.value).toBe('2026-06-21');
  expect(pilotStore.getState().daily.entries).toHaveLength(0);
});

test('تجهز الجمعية بستة أشخاص من دون حفظ دائرة عند العرض', async () => {
  const { pilotStore, journeyStore } = await harness('أم سارة');
  const view = await render(
    <Providers pilotStore={pilotStore} journeyStore={journeyStore}><JamiyaScreen /></Providers>,
  );
  expect(view.getByLabelText('اسم الجمعية').props.value).toBe('جمعية أهل الحي');
  expect(view.getByLabelText('شهر البداية').props.value).toBe('2026-04');
  expect(view.getByLabelText('حصة كل عضو بالريال').props.value).toBe('1000');
  expect(view.getByLabelText('أسماء الأعضاء الآخرين').props.value).toBe('نورة، هند، منال، عبير، لجين');
  expect(view.getByText('جمعية أهل الحي · عرض النتيجة')).toBeTruthy();
  expect(pilotStore.getState().jamiya.circles).toHaveLength(0);
});

test('يجهز طلب عهد من دون حفظه عند العرض', async () => {
  const { pilotStore, journeyStore } = await harness('نورة');
  const view = await render(
    <Providers pilotStore={pilotStore} journeyStore={journeyStore}><RequestScreen /></Providers>,
  );
  expect(view.getByLabelText('تطلب من').props.value).toBe('خالد');
  expect(view.getByLabelText('المبلغ بالريال').props.value).toBe('2500');
  expect(view.getByLabelText('الغرض').props.value).toBe('إصلاح السيارة');
  expect(view.getByLabelText('تاريخ الطلب').props.value).toBe('2026-06-21');
  expect(pilotStore.getState().daily.entries).toHaveLength(0);
});

test('يعرض دفتري بيانات جاهزة ولا يضيفها إلى المخزن', async () => {
  const { pilotStore, journeyStore } = await harness();
  const view = await render(
    <Providers pilotStore={pilotStore} journeyStore={journeyStore}><DaftariScreen /></Providers>,
  );
  expect(view.getByText('عرض تجريبي')).toBeTruthy();
  expect(view.getByText('AHD-CAFE')).toBeTruthy();
  expect(journeyStore.getState().records).toHaveLength(0);
});

test('يعرض أثرًا تجريبيًا كاملًا عندما يكون المخزن فارغًا', async () => {
  const { pilotStore, journeyStore } = await harness();
  const view = await render(
    <Providers pilotStore={pilotStore} journeyStore={journeyStore}><ImpactScreen /></Providers>,
  );
  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByText('التزامًا موثّقًا')).toBeTruthy();
  expect(journeyStore.getState().records).toHaveLength(0);
});

test('يجهز فاحص الحدود بنتيجة رفض فورية من دون حفظ شيء', async () => {
  const { pilotStore, journeyStore } = await harness();
  const view = await render(
    <Providers pilotStore={pilotStore} journeyStore={journeyStore}><BoundsScreen /></Providers>,
  );
  expect(view.getByLabelText('نصّ الشرط').props.value).toBe('إذا تأخر السداد تُضاف غرامة 100 ريال؛ وهذا شرط محظور في عهد.');
  expect(view.getByText(/رُفض الشرط/)).toBeTruthy();
  expect(pilotStore.getState().daily.entries).toHaveLength(0);
});

test('يجهز إثباتًا صحيحًا للمعاينة ولا يحفظه قبل التحقق الصريح', async () => {
  const { pilotStore, journeyStore } = await harness();
  const view = await render(
    <Providers pilotStore={pilotStore} journeyStore={journeyStore}><ProofScreen /></Providers>,
  );
  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByLabelText('بيانات السجل المشترك').props.value).toContain('ShareEnvelopeV1');
  expect(view.getByText(/معاينة صحيحة فقط؛ لم يُحفظ السجل بعد/)).toBeTruthy();
  expect(journeyStore.getState().imports).toHaveLength(0);
});

test('يجهز اسم عرض في الإعدادات ولا يحفظه قبل الضغط', async () => {
  const { pilotStore, journeyStore } = await harness();
  const view = await render(
    <Providers pilotStore={pilotStore} journeyStore={journeyStore}><SettingsScreen /></Providers>,
  );
  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByLabelText('اسم العرض').props.value).toBe('نايف العتيبي');
  expect(pilotStore.getState().profile.displayName).toBeNull();
});
