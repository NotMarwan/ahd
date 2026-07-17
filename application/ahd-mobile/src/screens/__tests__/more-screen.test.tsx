import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { CONTEXTUAL_SCREENS } from '@/navigation/screen-registry';
import { MoreScreen } from '../MoreScreen';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

describe('مركز أدوات عهد', () => {
  it('يعرض كل المسارات داخل فهرس غني قابل للبحث', async () => {
    const view = await render(<MoreScreen />);

    expect(view.getByLabelText('ابحث في أدوات عهد')).toBeTruthy();
    for (const screen of CONTEXTUAL_SCREENS) {
      expect(view.getByTestId(`more-feature-${screen.key}`)).toBeTruthy();
    }

    fireEvent.changeText(view.getByLabelText('ابحث في أدوات عهد'), 'الشرعي');
    await waitFor(() => {
      expect(view.getByTestId('more-feature-shariah')).toBeTruthy();
      expect(view.queryByTestId('more-feature-daily')).toBeNull();
    });
  });

  it('يصفّي حسب الفئة ويفتح البطاقة المقترحة', async () => {
    mockPush.mockClear();
    const view = await render(<MoreScreen />);

    fireEvent.press(view.getByRole('button', { name: 'الدوائر' }));
    await waitFor(() => {
      expect(view.getByTestId('more-feature-circle')).toBeTruthy();
      expect(view.getByTestId('more-feature-jamiya')).toBeTruthy();
      expect(view.queryByTestId('more-feature-shariah')).toBeNull();
    });

    fireEvent.press(view.getByRole('button', { name: 'افتح المقاصّة المقترحة' }));
    expect(mockPush).toHaveBeenCalledWith('/settle');
  });
});
