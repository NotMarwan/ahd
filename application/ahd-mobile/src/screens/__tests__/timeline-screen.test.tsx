import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { TimelineScreen } from '../TimelineScreen';

test('يعرض سِجلّ الشهادة وعهود البذرة بحالتها المشتقّة', async () => {
  const view = await render(<TimelineScreen />);

  expect(view.getByText('سِجلّ الشهادة')).toBeTruthy();
  expect(view.getByText('فيصل ← عمر')).toBeTruthy();
  expect(view.getByText('متعثّر — بلا غرامة')).toBeTruthy();
  expect(view.getByText('أُبرئ — إبراءٌ من المُقرِض')).toBeTruthy();
});
