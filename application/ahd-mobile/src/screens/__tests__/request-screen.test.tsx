import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { RequestScreen } from '../RequestScreen';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

test('يبني طلب عهد نظيف ويرسله وينتظر الموافقة', async () => {
  const view = await render(<RequestScreen />);

  expect(view.getByText('أنت تطلب — وعهدٌ يكتبها بكرامة')).toBeTruthy();
  expect(
    view.getByText('النصّ سليم — قرضٌ حسن بلا ربا، ولا غرامة، ولا أيّ زيادة'),
  ).toBeTruthy();

  fireEvent.press(view.getByRole('button', { name: 'أرسِل الطلب بالمعروف' }));

  await waitFor(() =>
    expect(view.getByText('أُرسل الطلب — بانتظار موافقة نورة.')).toBeTruthy(),
  );
});
