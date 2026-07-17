import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { CONTEXTUAL_SCREENS } from '@/navigation/screen-registry';
import { MORE_FEATURES } from '../more-feature-catalog';
import { MoreScreen } from '../MoreScreen';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

describe('مركز أدوات عهد', () => {
  it('يعرض الأدوات التسع عشرة كبطاقات موحّدة في شبكة من عمودين', async () => {
    const view = await render(<MoreScreen />);

    expect(view.getByLabelText('ابحث في أدوات عهد')).toBeTruthy();
    expect(view.getAllByTestId(/^more-feature-/)).toHaveLength(19);
    expect(MORE_FEATURES).toHaveLength(CONTEXTUAL_SCREENS.length);
    expect(MORE_FEATURES.every((feature) => !Object.prototype.hasOwnProperty.call(feature, 'mark'))).toBe(true);
    expect(view.queryByText('الأهم الآن')).toBeNull();
    expect(view.queryByText('استخدمتها مؤخرًا')).toBeNull();
    expect(StyleSheet.flatten(view.getByTestId('more-tools-grid').props.style)).toMatchObject({
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
    });

    fireEvent.changeText(view.getByLabelText('ابحث في أدوات عهد'), 'الشرعي');
    await waitFor(() => {
      expect(view.getByTestId('more-feature-shariah')).toBeTruthy();
      expect(view.queryByTestId('more-feature-daily')).toBeNull();
    });
  });

  it('يصفّي الفئات ويفتح التسوية', async () => {
    mockPush.mockClear();
    const view = await render(<MoreScreen />);

    fireEvent.press(view.getByRole('button', { name: 'الدوائر' }));
    await waitFor(() => {
      expect(view.getByTestId('more-feature-circle')).toBeTruthy();
      expect(view.getByTestId('more-feature-jamiya')).toBeTruthy();
      expect(view.queryByTestId('more-feature-shariah')).toBeNull();
    });

    fireEvent.press(view.getByRole('button', { name: 'افتح التسوية المقترحة' }));
    expect(mockPush).toHaveBeenCalledWith('/settle');
  });
});
