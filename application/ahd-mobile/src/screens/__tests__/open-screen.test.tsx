import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { OpenLoanScreen } from '../OpenLoanScreen';

test('يعرض قرضًا مفتوحًا وتوزيع يُسر محفوظ المجموع', async () => {
  const view = await render(<OpenLoanScreen />);

  expect(view.getByText('قرضٌ مفتوحٌ بينك وبين المقترض — متى ما تيسّر')).toBeTruthy();
  expect(view.getByText('القسط 1')).toBeTruthy();
  expect(view.getByText('🤍 اجعلها صدقة')).toBeTruthy();
});
