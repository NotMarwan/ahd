import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, spacing, typography } from '@/theme';

type SectionProps = PropsWithChildren<{
  readonly title?: string;
  readonly accessory?: ReactNode;
}>;

export function Section({ title, accessory, children }: SectionProps) {
  return (
    <View style={styles.section}>
      {title || accessory ? (
        <View style={styles.headingRow}>
          {title ? <Text style={styles.title}>{title}</Text> : <View />}
          {accessory}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.x2,
  },
  headingRow: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  title: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
