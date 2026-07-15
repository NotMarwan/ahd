import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

type AhdButtonProps = Pick<PressableProps, 'onPress' | 'disabled' | 'testID'> & {
  readonly label: string;
  readonly variant?: 'primary' | 'secondary' | 'quiet';
};

export function AhdButton({
  label,
  onPress,
  disabled = false,
  testID,
  variant = 'primary',
}: AhdButtonProps) {
  const isDisabled = disabled === true;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={controls.hitSlop}
      onPress={onPress}
      testID={testID}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'quiet' && styles.quiet,
        isDisabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
          isDisabled && styles.disabledLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: controls.minTarget,
    paddingHorizontal: spacing.x3,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.card,
    borderCurve: 'continuous',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  quiet: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  label: {
    ...typography.row,
    fontFamily: fontFamilies.body,
    textAlign: 'center',
  },
  primaryLabel: {
    color: colors.card,
  },
  secondaryLabel: {
    color: colors.ink,
  },
  disabledLabel: {
    color: colors.inkSecondary,
  },
});
