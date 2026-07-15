import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, spacing, typography } from '@/theme';

type AmountDisplayProps = {
  readonly value: string;
  readonly label?: string;
};

export function AmountDisplay({ value, label }: AmountDisplayProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Text selectable style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.x1,
    alignItems: 'flex-start',
  },
  label: {
    ...typography.label,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  value: {
    ...typography.amount,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
});
