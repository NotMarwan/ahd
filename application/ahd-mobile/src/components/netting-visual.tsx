import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

type NettingVisualProps = {
  readonly beforeCount: number;
  readonly afterCount: number;
  readonly participants?: readonly string[];
  readonly testID?: string;
};

const NODE_POSITIONS = [
  { top: 0, left: '41%' as const },
  { top: 62, right: 0 },
  { bottom: 0, right: '9%' as const },
  { bottom: 0, left: '9%' as const },
  { top: 62, left: 0 },
] as const;

function SvgNode({ cx, cy, tone = colors.accent }: { cx: number; cy: number; tone?: string }) {
  return <Circle cx={cx} cy={cy} fill={colors.card} r={7} stroke={tone} strokeWidth={3} />;
}

export function NettingVisual({
  beforeCount,
  afterCount,
  participants = ['نورة', 'سارة', 'خالد', 'ليلى', 'فهد'],
  testID,
}: NettingVisualProps) {
  const visibleParticipants = participants.slice(0, 5);
  return (
    <View testID={testID} style={styles.container}>
      <View testID="netting-stats" style={styles.stats}>
        <View style={styles.statChip}>
          <Text style={styles.statLabel}>قبل</Text>
          <Text style={styles.before}>{beforeCount}</Text>
          <Text style={styles.statCaption}>التزامات متفرقة</Text>
        </View>
        <View accessibilityElementsHidden style={styles.arrowLane}>
          <Text style={styles.arrow}>←</Text>
          <Text style={styles.arrowNote}>نفس الصافي</Text>
        </View>
        <View style={[styles.statChip, styles.statAfter]}>
          <Text style={styles.statLabel}>بعد</Text>
          <Text style={styles.after}>{afterCount}</Text>
          <Text style={styles.statCaption}>تحويلات واضحة</Text>
        </View>
      </View>

      <View style={styles.graphCard}>
        <View style={styles.graphHeading}>
          <Text style={styles.graphTitle}>قبل · خمسة أطراف حول شبكة واحدة</Text>
          <Text style={styles.graphNote}>الصافي محفوظ</Text>
        </View>

        <View style={styles.ringStage} testID="netting-before-ring">
          <Svg height={204} width="100%" viewBox="0 0 320 204">
            <Path
              d="M160 24 L286 88 L238 178 L82 178 L34 88 Z"
              fill="none"
              stroke={colors.accent}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
            />
            <Path
              d="M160 39 L268 94 L227 163 L93 163 L52 94 Z"
              fill="none"
              stroke={colors.covenant}
              strokeDasharray="10 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
            />
            <Path
              d="M34 88 C70 62 112 44 160 39 M286 88 C250 62 208 44 160 39"
              fill="none"
              stroke={colors.waiting}
              strokeLinecap="round"
              strokeWidth={2}
            />
            <SvgNode cx={160} cy={24} />
            <SvgNode cx={286} cy={88} tone={colors.covenant} />
            <SvgNode cx={238} cy={178} />
            <SvgNode cx={82} cy={178} tone={colors.covenant} />
            <SvgNode cx={34} cy={88} />
          </Svg>
          {visibleParticipants.map((name, index) => (
            <View
              key={`${name}-${index}`}
              style={[styles.person, NODE_POSITIONS[index]]}
              testID={`netting-participant-${name}`}
            >
              <View style={[styles.personDot, index % 2 === 1 && styles.personDotGold]} />
              <Text numberOfLines={1} style={styles.personName}>{name}</Text>
            </View>
          ))}
          <View style={styles.centerSeal}>
            <Text style={styles.centerNumber}>{beforeCount}</Text>
            <Text style={styles.centerLabel}>التزامات</Text>
          </View>
        </View>

        <View style={styles.shift}>
          <View style={styles.shiftLine} />
          <Text style={styles.shiftText}>نختصر المسار، ولا نغيّر الحق</Text>
          <View style={styles.shiftLine} />
        </View>

        <View style={styles.afterStage} testID="netting-after-paths">
          <Svg height={78} width="100%" viewBox="0 0 320 78">
            <Path d="M286 22 L34 22" fill="none" stroke={colors.accent} strokeLinecap="round" strokeWidth={5} />
            <Path d="M286 56 L34 56" fill="none" stroke={colors.covenant} strokeLinecap="round" strokeWidth={5} />
            <SvgNode cx={286} cy={22} />
            <SvgNode cx={34} cy={22} />
            <SvgNode cx={286} cy={56} tone={colors.covenant} />
            <SvgNode cx={34} cy={56} tone={colors.covenant} />
          </Svg>
          <View style={styles.afterBadge}>
            <Text style={styles.afterBadgeValue}>{afterCount}</Text>
            <Text style={styles.afterBadgeLabel}>فقط</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.x3 },
  stats: {
    minHeight: 116,
    padding: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.large,
    backgroundColor: colors.card,
  },
  statChip: {
    flex: 1,
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.medium,
    backgroundColor: colors.cardSecondary,
  },
  statAfter: { borderWidth: 1, borderColor: colors.covenant, backgroundColor: colors.covenantSoft },
  statLabel: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body },
  before: { ...typography.amount, color: colors.ink, fontFamily: fontFamilies.display, fontVariant: ['tabular-nums'] },
  after: { ...typography.amount, color: colors.covenant, fontFamily: fontFamilies.display, fontVariant: ['tabular-nums'] },
  statCaption: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'center' },
  arrowLane: { width: 62, alignItems: 'center', justifyContent: 'center' },
  arrow: { color: colors.accent, fontFamily: fontFamilies.body, fontSize: 26, lineHeight: 30 },
  arrowNote: { ...typography.caption, color: colors.accent, fontFamily: fontFamilies.body, textAlign: 'center' },
  graphCard: {
    padding: spacing.x3,
    overflow: 'hidden',
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.covenant,
    backgroundColor: colors.covenantSoft,
  },
  graphHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  graphTitle: { ...typography.sub, flex: 1, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  graphNote: { ...typography.caption, color: colors.covenant, fontFamily: fontFamilies.body },
  ringStage: { height: 236, marginTop: spacing.x2, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  person: { position: 'absolute', minWidth: 58, paddingHorizontal: spacing.x1, alignItems: 'center', zIndex: 2 },
  personDot: { width: 22, height: 22, borderWidth: 4, borderColor: colors.accent, borderRadius: radii.pill, backgroundColor: colors.card },
  personDotGold: { borderColor: colors.covenant },
  personName: { ...typography.caption, marginTop: 2, maxWidth: 72, color: colors.ink, fontFamily: fontFamilies.body, fontWeight: '700', textAlign: 'center' },
  centerSeal: { position: 'absolute', width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.covenant, borderRadius: radii.pill, backgroundColor: colors.card },
  centerNumber: { ...typography.amount, color: colors.accent, fontFamily: fontFamilies.display, fontVariant: ['tabular-nums'] },
  centerLabel: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body },
  shift: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.x2 },
  shiftLine: { flex: 1, height: 1, backgroundColor: colors.covenant },
  shiftText: { ...typography.caption, color: colors.accent, fontFamily: fontFamilies.body, fontWeight: '700' },
  afterStage: { minHeight: 92, marginTop: spacing.x2, position: 'relative', justifyContent: 'center' },
  afterBadge: { position: 'absolute', alignSelf: 'center', width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.card },
  afterBadgeValue: { ...typography.title, color: colors.covenant, fontFamily: fontFamilies.display, fontVariant: ['tabular-nums'] },
  afterBadgeLabel: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body },
});
