import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { DisputeScreen } from '../DisputeScreen';

test('يعرض محلّ الخلاف بلا غرامة ومع وثيقة مختومة محايدة', async () => {
  const view = await render(<DisputeScreen />);

  expect(view.getByText('عهد «سالم» و«عبدالله»')).toBeTruthy();
  expect(view.getByText('السجلّ مطابق للختم')).toBeTruthy();
  expect(
    view.getByText(
      '⏸️ أوقف عهد التذكيرات هنا — بلا غرامة، بلا انحياز، بلا أيّ زيادة. الوقت الآن للصلح.',
    ),
  ).toBeTruthy();
  expect(
    view.getByText('المصرف ليس خصمًا ولا حَكَمًا — يشهد، ويحفظ الحقّ بكرامةٍ للطرفين.'),
  ).toBeTruthy();
});
