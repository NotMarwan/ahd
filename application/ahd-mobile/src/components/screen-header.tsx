import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, spacing, typography } from '@/theme';

type ScreenHeaderProps = {
  readonly title: string;
  readonly accentTitle?: string;
  readonly eyebrow?: string;
  readonly subtitle?: string;
};

export function ScreenHeader({ title, accentTitle, eyebrow, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.container} accessibilityRole="header">
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {accentTitle ? <Text style={styles.accentTitle}>{accentTitle}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.x1,
    width: '100%',
    alignItems: 'stretch',
  },
  eyebrow: {
    ...typography.sub,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  title: {
    ...typography.display,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    textAlign: 'right',
  },
  accentTitle: {
    ...typography.display,
    marginTop: -spacing.x1,
    color: colors.accent,
    fontFamily: fontFamilies.display,
    textAlign: 'right',
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.x1,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
