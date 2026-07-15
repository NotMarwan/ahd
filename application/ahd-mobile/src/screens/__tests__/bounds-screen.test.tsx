import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { BoundsScreen } from '../BoundsScreen';

test('«الضمانات والحدود» تعرض العناوين الثلاثة وسطر التشغيل', async () => {
  const view = await render(<BoundsScreen />);
  expect(view.getByText('الضمانات والحدود — مكتوبةٌ في الكود')).toBeTruthy();
  expect(view.getByText('للمدين — كرامتُك محفوظة')).toBeTruthy();
  expect(view.getByText('للدائن — حقُّك موثَّق')).toBeTruthy();
  expect(view.getByText('حدود المصرف — يشهد ولا يتجاوز')).toBeTruthy();
  expect(view.getByText('cd tests && node run-all.cjs')).toBeTruthy();
});
