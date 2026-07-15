import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { JamiyaScreen } from '../JamiyaScreen';

test('يعرض عقد الجمعية الموثّقة المختومة وترتيب الاستلام', async () => {
  const view = await render(<JamiyaScreen />);
  expect(view.getAllByText('الجمعية الموثّقة').length).toBeGreaterThan(0);
  expect(view.getByText('✓ الختم سليم')).toBeTruthy();
  expect(view.getByText('1. أم سارة')).toBeTruthy();
});
