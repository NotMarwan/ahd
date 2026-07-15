import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { CircleAdvScreen } from '../CircleAdvScreen';

test('يعرض دوائر الصندوق ومقاصّتها', async () => {
  const view = await render(<CircleAdvScreen />);
  expect(view.getByText('تقسيمٌ وتخريجٌ وتعهّد')).toBeTruthy();
  expect(view.getByText('عشاء الخميس')).toBeTruthy();
  expect(view.getByText('قبل المقاصّة · 9 عهود مفتوحة')).toBeTruthy();
});
