import { expect, jest, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import { CONTEXTUAL_SCREENS } from '@/navigation/screen-registry';
import { MoreScreen } from '../MoreScreen';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

test('«المزيد» يعرض كل الشاشات السياقية وينقل إليها', async () => {
  const view = await render(<MoreScreen />);
  for (const screen of CONTEXTUAL_SCREENS) {
    expect(view.getByText(screen.label)).toBeTruthy();
  }
  fireEvent.press(view.getByText('الأساس الشرعي'));
  expect(mockPush).toHaveBeenCalledWith('/shariah');
});
