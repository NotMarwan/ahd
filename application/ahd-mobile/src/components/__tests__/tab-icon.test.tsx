import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { TabIcon } from '../tab-icon';

for (const name of ['home', 'create', 'daftari', 'settle', 'more'] as const) {
  test(`renders ${name} icon`, async () => {
    const view = await render(<TabIcon name={name} color="#000" />);
    expect(view.toJSON()).toBeTruthy();
  });
}
