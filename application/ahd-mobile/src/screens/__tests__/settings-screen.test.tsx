import { expect, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import { SettingsScreen } from '../SettingsScreen';

test('يعرض إعدادات عهد مع مفتاح إفصاح ذاتي محلي بلا حفظ', async () => {
  const view = await render(<SettingsScreen />);

  expect(view.getByText('الإعدادات · عن عهد')).toBeTruthy();
  expect(view.getByText(/كلمتك محفوظة، وعلاقتك محميّة/)).toBeTruthy();

  const toggle = view.getByLabelText('الإفصاح الذاتي');
  expect(toggle.props.value).toBe(false);
  fireEvent(toggle, 'valueChange', true);
});
