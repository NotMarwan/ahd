import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

type TrustWeaveHeaderProps = {
  readonly onBack?: () => void;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
};

const THREAD_COLORS = [
  colors.accent,
  colors.covenant,
  colors.accent,
  colors.waiting,
  colors.accent,
  colors.covenant,
] as const;

export function TrustWeaveHeader({ onBack, actionLabel, onAction }: TrustWeaveHeaderProps) {
  return (
    <View accessibilityRole="header" style={styles.container}>
      <View accessibilityElementsHidden style={styles.threadStrip}>
        {THREAD_COLORS.map((color, index) => (
          <View key={`${color}-${index}`} style={[styles.thread, { backgroundColor: color }]} />
        ))}
      </View>

      <View style={styles.row}>
        {onBack ? (
          <Pressable
            accessibilityLabel="رجوع"
            accessibilityRole="button"
            hitSlop={controls.hitSlop}
            onPress={onBack}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>→</Text>
          </Pressable>
        ) : (
          <View style={styles.sideSpacer} />
        )}

        <View style={styles.brand}>
          <Image
            accessibilityLabel="شعار عهد الرسمي"
            resizeMode="contain"
            source={require('../../assets/images/ahd-logo-transparent.png')}
            style={styles.logo}
          />
        </View>

        {actionLabel && onAction ? (
          <Pressable
            accessibilityLabel={actionLabel}
            accessibilityRole="button"
            hitSlop={controls.hitSlop}
            onPress={onAction}
            style={styles.iconButton}
          >
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        ) : (
          <View style={styles.sideSpacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.x2,
  },
  threadStrip: {
    height: 6,
    flexDirection: 'row-reverse',
    gap: spacing.x1,
  },
  thread: {
    flex: 1,
    borderRadius: radii.pill,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    width: 68,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 68,
    height: 40,
  },
  iconButton: {
    minWidth: 40,
    minHeight: 40,
    paddingHorizontal: spacing.x2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  iconText: {
    ...typography.title,
    color: colors.ink,
    fontFamily: fontFamilies.body,
  },
  actionText: {
    ...typography.caption,
    color: colors.ink,
    fontFamily: fontFamilies.body,
  },
  sideSpacer: {
    width: 40,
    height: 40,
  },
});
