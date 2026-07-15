import { useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section } from '@/components';
import { CONTEXTUAL_SCREENS } from '@/navigation/screen-registry';
import { colors, controls, fontFamilies, spacing, typography } from '@/theme';

export function MoreScreen() {
  const router = useRouter();

  return (
    <AppShell testID="more-screen">
      <ScreenHeader
        eyebrow="المزيد"
        title="كل شاشات عهد"
        subtitle="السجلات والدوائر والأساس الشرعي والإعدادات في مكان واحد."
      />
      <Section title="الشاشات">
        <RowGroup>
          {CONTEXTUAL_SCREENS.map((screen) => (
            <Pressable
              key={screen.key}
              accessibilityRole="button"
              accessibilityLabel={screen.label}
              onPress={() => router.push(screen.route as Href)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Text style={styles.label}>{screen.label}</Text>
              <Text style={styles.chevron}>‹</Text>
            </Pressable>
          ))}
        </RowGroup>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: controls.minTarget,
    paddingHorizontal: spacing.x3,
    paddingVertical: spacing.x2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  rowPressed: {
    backgroundColor: colors.ground,
  },
  label: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  chevron: {
    ...typography.row,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
  },
});
