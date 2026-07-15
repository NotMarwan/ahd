import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { MaroofScreen } from '../MaroofScreen';

test('يعرض شاشة معروف بأثرٍ نوعيٍّ للوفاء دون أي رقم', async () => {
  const view = await render(<MaroofScreen />);

  expect(view.getByText('من عُرِف بالوفاء')).toBeTruthy();
  expect(view.getByText('نورة')).toBeTruthy();
  expect(view.getAllByText('وفّى بعهوده').length).toBeGreaterThan(0);
  expect(view.queryByText(/0\.\d+/)).toBeNull();
});
