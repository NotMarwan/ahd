import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, spacing, typography } from '@/theme';

type EmptyStateProps = {
  readonly title: string;
  readonly body?: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.x1,
    padding: spacing.x3,
    alignItems: 'flex-start',
  },
  title: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  body: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
});
