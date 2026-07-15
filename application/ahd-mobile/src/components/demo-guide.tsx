import { useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useDemoGuide } from '@/state/demo-script';
import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

export function DemoGuide() {
  const router = useRouter();
  const { active, step, isLast, next, skip } = useDemoGuide();

  if (!active || !step) return null;

  const advance = () => {
    const nextStep = next();
    if (nextStep) router.push(nextStep.route as Href);
  };

  return (
    <View style={styles.banner} accessibilityLiveRegion="polite">
      <View style={styles.textBlock}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.hint}>{step.hint}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'إنهاء الجولة' : 'التالي'}
          onPress={advance}
          style={styles.primary}
        >
          <Text style={styles.primaryLabel}>{isLast ? 'إنهاء الجولة' : 'التالي'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="تخطّي الجولة"
          onPress={skip}
          style={styles.secondary}
        >
          <Text style={styles.secondaryLabel}>تخطّي</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 64,
    left: spacing.x3,
    right: spacing.x3,
    gap: spacing.x2,
    padding: spacing.x3,
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    shadowColor: colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  textBlock: {
    gap: spacing.x1,
  },
  title: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
    textAlign: 'right',
  },
  hint: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row-reverse',
    gap: spacing.x2,
  },
  primary: {
    paddingHorizontal: spacing.x3,
    paddingVertical: spacing.x2,
    backgroundColor: colors.accent,
    borderRadius: radii.card,
  },
  primaryLabel: {
    ...typography.row,
    color: colors.card,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
  },
  secondary: {
    paddingHorizontal: spacing.x3,
    paddingVertical: spacing.x2,
  },
  secondaryLabel: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
  },
});
