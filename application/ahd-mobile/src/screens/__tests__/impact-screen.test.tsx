import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { ImpactScreen } from '../ImpactScreen';

test('يعرض ملخّص أثر عهد كمجاميع مجهّلة بلا أسماء ولا نتائج رقميّة فرديّة', async () => {
  const view = await render(<ImpactScreen />);

  expect(view.getByText('أثر عهد — أثر المقاصّة عبر الدوائر')).toBeTruthy();
  expect(view.getByText('التزامًا موثّقًا')).toBeTruthy();
  expect(view.getByText('ذمّةٌ محفوظة أو أُبرئت')).toBeTruthy();
});
