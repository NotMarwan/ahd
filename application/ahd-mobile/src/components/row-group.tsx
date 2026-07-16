import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/theme';

type RowGroupProps = PropsWithChildren<{
  readonly variant?: 'surface' | 'plain' | 'accent';
  readonly testID?: string;
}>;

export function RowGroup({ children, variant = 'surface', testID }: RowGroupProps) {
  return (
    <View
      testID={testID}
      style={[
        styles.group,
        variant === 'plain' && styles.plain,
        variant === 'accent' && styles.accent,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.medium,
  },
  plain: {
    overflow: 'visible',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  accent: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentLine,
  },
});
