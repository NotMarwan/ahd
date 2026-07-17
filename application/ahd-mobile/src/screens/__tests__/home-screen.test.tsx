import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository } from '@/state';
import { HomeScreen } from '../HomeScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('تعرض الرئيسية قصة الويب آب كمثال معلّم من دون حفظها', async () => {
  const store = new AhdJourneyStore(new InMemoryAhdRepository());
  const view = await render(
    <AhdJourneyProvider store={store}>
      <HomeScreen />
    </AhdJourneyProvider>,
  );

  expect(view.getByText('بيانات تجريبية')).toBeTruthy();
  expect(view.getByText('6')).toBeTruthy();
  expect(view.getByText('5,200.00 ر.س')).toBeTruthy();
  expect(view.getByText('3,000.00 ر.س')).toBeTruthy();
  expect(view.getByText('سلطان · 1,200.00 ر.س · متأخر 37 يومًا')).toBeTruthy();
  expect(store.getState().records).toHaveLength(0);
});
