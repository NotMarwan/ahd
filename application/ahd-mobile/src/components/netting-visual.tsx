import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

type NettingVisualProps = {
  readonly beforeCount: number;
  readonly afterCount: number;
  readonly testID?: string;
};

function Node({ cx, cy, fill = colors.accent }: { cx: number; cy: number; fill?: string }) {
  return <Circle cx={cx} cy={cy} fill={colors.card} r={7} stroke={fill} strokeWidth={3} />;
}

export function NettingVisual({ beforeCount, afterCount, testID }: NettingVisualProps) {
  return (
    <View testID={testID} style={styles.container}>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>قبل</Text>
          <Text style={styles.before}>{beforeCount}</Text>
          <Text style={styles.statCaption}>تحويلات متشابكة</Text>
        </View>
        <View accessibilityElementsHidden style={styles.arrowLane}>
          <View style={styles.arrowThread} />
          <Text style={styles.arrow}>←</Text>
        </View>
        <View style={[styles.stat, styles.statAfter]}>
          <Text style={styles.statLabel}>بعد</Text>
          <Text style={styles.after}>{afterCount}</Text>
          <Text style={styles.statCaption}>تحويلان واضحان</Text>
        </View>
      </View>

      <View style={styles.graphCard}>
        <View style={styles.graphHeading}>
          <Text style={styles.graphTitle}>قبل — خيوط متقاطعة</Text>
          <Text style={styles.graphNote}>الصافي محفوظ</Text>
        </View>
        <Svg height={72} width="100%" viewBox="0 0 320 72">
          <Path d="M296 18 C230 18 202 56 160 56 C112 56 90 20 24 20" fill="none" stroke={colors.accent} strokeLinecap="round" strokeWidth={4} />
          <Path d="M296 54 C232 54 204 18 158 18 C112 18 88 52 24 52" fill="none" stroke={colors.waiting} strokeLinecap="round" strokeWidth={4} />
          <Node cx={296} cy={18} />
          <Node cx={296} cy={54} fill={colors.waiting} />
          <Node cx={24} cy={20} />
          <Node cx={24} cy={52} fill={colors.waiting} />
        </Svg>
        <View style={styles.shift}>
          <View style={styles.shiftLine} />
          <Text style={styles.shiftText}>نختصر المسار، ولا نغيّر الحق</Text>
          <View style={styles.shiftLine} />
        </View>
        <Svg height={46} width="100%" viewBox="0 0 320 46">
          <Path d="M296 23 L24 23" fill="none" stroke={colors.covenant} strokeLinecap="round" strokeWidth={5} />
          <Node cx={296} cy={23} fill={colors.covenant} />
          <Node cx={24} cy={23} fill={colors.covenant} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.x3,
  },
  stats: {
    minHeight: 112,
    padding: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: radii.large,
    backgroundColor: colors.accentDeep,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statAfter: {
    borderRadius: radii.medium,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  statLabel: {
    ...typography.caption,
    color: colors.onAccentDim,
    fontFamily: fontFamilies.body,
  },
  before: {
    ...typography.amount,
    color: colors.onAccentDim,
    fontFamily: fontFamilies.display,
    fontVariant: ['tabular-nums'],
  },
  after: {
    ...typography.amount,
    color: colors.sealHash,
    fontFamily: fontFamilies.display,
    fontVariant: ['tabular-nums'],
  },
  statCaption: {
    ...typography.caption,
    color: colors.onAccentDim,
    fontFamily: fontFamilies.body,
    textAlign: 'center',
  },
  arrowLane: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowThread: {
    position: 'absolute',
    right: 0,
    left: 0,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.sealHash,
  },
  arrow: {
    paddingHorizontal: spacing.x1,
    color: colors.sealHash,
    backgroundColor: colors.accentDeep,
    fontSize: 18,
  },
  graphCard: {
    padding: spacing.x3,
    overflow: 'hidden',
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  graphHeading: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  graphTitle: {
    ...typography.sub,
    color: colors.ink,
    fontFamily: fontFamilies.body,
  },
  graphNote: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
  },
  shift: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x2,
  },
  shiftLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  shiftText: {
    ...typography.caption,
    color: colors.accent,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
  },
});
