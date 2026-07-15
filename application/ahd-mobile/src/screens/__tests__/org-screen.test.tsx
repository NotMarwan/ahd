import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { OrgScreen } from '../OrgScreen';

test('يعرض لوحة المؤسسة بمؤشّرات مجمّعة فقط', async () => {
  const view = await render(<OrgScreen />);
  expect(view.getByText('صندوق قرض حسن')).toBeTruthy();
  expect(view.getByText('عهودٌ نشطة')).toBeTruthy();
  expect(view.getByText('🛡️ تجميعاتٌ فقط — لا رقمَ فردٍ، ولا تصنيف، ولا يُصدَّر شيء.')).toBeTruthy();
});
