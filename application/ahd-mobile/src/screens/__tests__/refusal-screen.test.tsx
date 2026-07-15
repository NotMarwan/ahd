import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { RefusalScreen } from '../RefusalScreen';

test('«ما لا يفعله عهد» تعرض الرفوض الثلاثة وبطاقة الصدقة', async () => {
  const view = await render(<RefusalScreen />);
  expect(view.getByText('عهد لا يُقرض، لا يُقيّم، لا يحكم')).toBeTruthy();
  expect(view.getByText('✗ لا يُقرض')).toBeTruthy();
  expect(view.getByText('✗ لا يُقيّم')).toBeTruthy();
  expect(view.getByText('✗ لا يحكم')).toBeTruthy();
  expect(view.getByText('🤍 اجعلها صدقة')).toBeTruthy();
});
