import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { StandingScreen } from '../StandingScreen';

test('يعرض السُّلفة القائمة بين سعود وتركي', async () => {
  const view = await render(<StandingScreen />);
  expect(view.getByText('قرضٌ حسنٌ قائمٌ بين طرفين')).toBeTruthy();
  expect(view.getByText('سعود · شقة الملقا')).toBeTruthy();
  expect(view.getByText('تركي · 200.00 ر.س')).toBeTruthy();
});
