import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { NettingVisual } from '../netting-visual';
import { colors } from '@/theme';

test('ترسم التسوية شبكة هندسية خفيفة من خمسة أشخاص بلا تقاطع', async () => {
  const view = await render(
    <NettingVisual
      beforeCount={9}
      afterCount={2}
      participants={['نورة', 'سارة', 'خالد', 'ليلى', 'فهد']}
    />,
  );

  expect(view.getAllByTestId(/^netting-participant-/)).toHaveLength(5);
  expect(view.getByTestId('netting-before-ring')).toBeTruthy();
  expect(view.getByTestId('netting-after-paths')).toBeTruthy();
  expect(view.queryByText('قبل — خيوط متقاطعة')).toBeNull();
  expect(StyleSheet.flatten(view.getByTestId('netting-stats').props.style).backgroundColor)
    .not.toBe(colors.accentDeep);
});
