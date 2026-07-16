import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

type ThreadMeterProps = {
  readonly progress: number;
  readonly paidLabel: string;
  readonly remainingLabel: string;
  readonly testID?: string;
};

export function ThreadMeter({ progress, paidLabel, remainingLabel, testID }: ThreadMeterProps) {
  const bounded = Math.max(0, Math.min(100, progress));

  return (
    <View testID={testID}>
      <View accessibilityLabel={`نُسج ${bounded} من 100 من خيط الوفاء`} style={styles.meter}>
        <View style={styles.lane} />
        <View style={[styles.woven, { width: `${bounded}%` }]} />
        <View style={[styles.knot, { right: `${bounded}%` }]} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>{paidLabel}</Text>
        <Text style={styles.value}>{remainingLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  meter: {
    height: 14,
    justifyContent: 'center',
  },
  lane: {
    position: 'absolute',
    right: 0,
    left: 0,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  woven: {
    position: 'absolute',
    right: 0,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.sealHash,
  },
  knot: {
    position: 'absolute',
    width: 15,
    height: 15,
    marginRight: -7.5,
    borderRadius: radii.pill,
    borderWidth: 4,
    borderColor: colors.sealHash,
    backgroundColor: colors.white,
  },
  labels: {
    marginTop: spacing.x2,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  label: {
    ...typography.caption,
    flex: 1,
    color: colors.onAccentDim,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  value: {
    ...typography.caption,
    color: colors.sealHash,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    textAlign: 'left',
  },
});
