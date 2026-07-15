import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { CircleScreen } from '../CircleScreen';

test('يعرض لوحة أمين الصندوق ببيانات دائرة رحلة العلا', async () => {
  const view = await render(<CircleScreen />);
  expect(view.getByText('دائرة «رحلة العلا»')).toBeTruthy();
  expect(view.getByText('أمين الصندوق لُجين')).toBeTruthy();
  expect(view.getByText('محفوظة')).toBeTruthy();
});
