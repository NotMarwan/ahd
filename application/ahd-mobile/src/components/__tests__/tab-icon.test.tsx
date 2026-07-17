import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { TabIcon } from '../tab-icon';

test('تستخدم التسوية أيقونة تحويل دائرية بدل الميزان', async () => {
  const view = await render(<TabIcon name="settle" color="#123456" />);
  expect(view.getByTestId('tab-icon-settle')).toBeTruthy();
  expect(JSON.stringify(view.toJSON())).not.toContain('M12 4v16M8 6h8');
});
