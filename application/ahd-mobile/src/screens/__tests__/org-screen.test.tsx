import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { OrgScreen } from '../OrgScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يعرض لوحة المؤسسة بمجاميع عرض معلّمة دون ادعاء ربط أو حفظ', async () => {
  const pilotStore = new PilotStore(new InMemoryPilotRepository());
  await pilotStore.hydrate();

  const view = await render(
    <PilotProvider store={pilotStore}>
      <OrgScreen />
    </PilotProvider>,
  );
  expect(view.getByText('لوحة المؤسسة')).toBeTruthy();
  expect(view.getByText('عرض تجريبي')).toBeTruthy();
  expect(view.getByText('لا مؤسسة مرتبطة بهذه النسخة التجريبية')).toBeTruthy();
  expect(view.getByText('يحتاج اتصالًا')).toBeTruthy();
  expect(view.getByText('جمعية الأهل')).toBeTruthy();
  expect(view.getByText('5 أعضاء · 5,000.00 ر.س')).toBeTruthy();
  expect(view.getByText('5,000.00 ر.س')).toBeTruthy();
  expect(view.getByText('🛡️ تجميعاتٌ فقط — لا رقمَ فردٍ، ولا تصنيف، ولا يُصدَّر شيء.')).toBeTruthy();
  expect(pilotStore.getState().jamiya.circles).toHaveLength(0);
});
