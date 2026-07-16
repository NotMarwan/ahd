import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { OpenLoanScreen } from '../OpenLoanScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

test('يعرض رحلة الوفاء المفتوحة وتوزيع اليسر المحفوظ', async () => {
  const view = await render(<OpenLoanScreen />);

  expect(view.getByText('رحلة الوفاء')).toBeTruthy();
  expect(view.getByText('القسط 1')).toBeTruthy();
  expect(view.getByRole('button', { name: 'راجع الإبراء' })).toBeTruthy();
  expect(view.getByTestId('repayment-thread-meter')).toBeTruthy();
});
