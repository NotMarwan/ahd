import { expect, jest, test } from '@jest/globals';
import { Share } from 'react-native';

import { shareEnvelopeText } from '../native-share';

test('opens the native share sheet with the exact serialized envelope', async () => {
  const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction });
  const serialized = '{"format":"ShareEnvelopeV1"}';

  await expect(shareEnvelopeText(serialized)).resolves.toBe('opened');
  expect(share).toHaveBeenCalledWith(
    { title: 'سجل عهد مختوم', message: serialized },
    { dialogTitle: 'شارك سجل العهد' },
  );
});
