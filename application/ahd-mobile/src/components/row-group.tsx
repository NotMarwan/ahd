import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/theme';

export function RowGroup({ children }: PropsWithChildren) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    borderRadius: radii.card,
  },
});
