import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { PlansScreen } from '../PlansScreen';

test('«الأجرة والخطط» تعرض العنوان والخطط والإيصال المزدوج', async () => {
  const view = await render(<PlansScreen />);
  expect(view.getByText('الأجرة والخطط')).toBeTruthy();
  expect(view.getByText('أجرة على الخدمة، لا على القرض · القرض مجانيٌّ للأبد')).toBeTruthy();
  expect(view.getByText('مجاني')).toBeTruthy();
  expect(view.getByText('دفتري بلس')).toBeTruthy();
  expect(view.getByText('أجرة التوثيق — منفصلةٌ عن القرض')).toBeTruthy();
});
