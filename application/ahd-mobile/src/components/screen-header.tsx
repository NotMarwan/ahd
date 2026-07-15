import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, spacing, typography } from '@/theme';

type ScreenHeaderProps = {
  readonly title: string;
  readonly eyebrow?: string;
  readonly subtitle?: string;
};

export function ScreenHeader({ title, eyebrow, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.container} accessibilityRole="header">
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.x2,
    width: '100%',
    alignItems: 'stretch',
  },
  eyebrow: {
    ...typography.label,
    color: colors.accent,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  title: {
    ...typography.largeTitle,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    textAlign: 'right',
  },
  subtitle: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 22,
    textAlign: 'right',
  },
});
