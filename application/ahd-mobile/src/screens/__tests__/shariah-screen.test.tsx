import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { ShariahScreen } from '../ShariahScreen';

test('«الأساس الشرعي» تعرض الآليّات والأسئلة المفتوحة وعدم الإفتاء', async () => {
  const view = await render(<ShariahScreen />);
  expect(view.getAllByText('الأساس الشرعي').length).toBeGreaterThan(0);
  expect(view.getByText('شهادة القرض الحسن — عهد يكتب ويشهد، لا يُقرض')).toBeTruthy();
  expect(view.getByText('لا ربا · لا غرامة · لا ميسر · لا غرر')).toBeTruthy();
  expect(view.getByText('أسئلةٌ مفتوحةٌ بانتظار مراجعة عالِم')).toBeTruthy();
});
