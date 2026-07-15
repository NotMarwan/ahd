import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { MineScreen } from '../MineScreen';

test('يعرض «ما عليّ» بالتزامات البذرة بكرامة وبلا نتيجة رقميّة', async () => {
  const view = await render(<MineScreen />);

  expect(view.getByText('ما عليّ')).toBeTruthy();
  expect(view.getByText('لـ فيصل')).toBeTruthy();
  expect(view.getByText('لـ صالح')).toBeTruthy();
  expect(view.getByText('عهودٌ قائمة')).toBeTruthy();
});
