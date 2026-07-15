import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

type StatusTone = 'verified' | 'covenant' | 'stopped' | 'neutral';

type StatusChipProps = {
  readonly label: string;
  readonly tone?: StatusTone;
};

const toneStyles: Record<StatusTone, { backgroundColor: string; color: string }> = {
  verified: { backgroundColor: colors.verifiedSoft, color: colors.verifiedText },
  covenant: { backgroundColor: colors.covenantSoft, color: colors.covenant },
  stopped: { backgroundColor: colors.stoppedSoft, color: colors.stopped },
  neutral: { backgroundColor: colors.accentSoft, color: colors.inkSecondary },
};

export function StatusChip({ label, tone = 'neutral' }: StatusChipProps) {
  const toneStyle = toneStyles[tone];

  return (
    <View style={[styles.chip, { backgroundColor: toneStyle.backgroundColor }]}>
      <Text style={[styles.label, { color: toneStyle.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 28,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: spacing.x2,
    borderRadius: radii.pill,
  },
  label: {
    ...typography.label,
    fontFamily: fontFamilies.body,
    textAlign: 'center',
  },
});
