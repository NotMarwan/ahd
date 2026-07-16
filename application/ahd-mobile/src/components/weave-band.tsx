import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

export type WeaveThreadTone = 'active' | 'kept' | 'late' | 'empty';

type WeaveBandProps = {
  readonly threads: readonly WeaveThreadTone[];
  readonly title?: string;
  readonly detail?: string;
  readonly caption?: string;
  readonly alert?: string;
  readonly testID?: string;
};

const HEIGHTS = [30, 46, 54, 36, 44, 40, 50] as const;

const TONE_COLOR: Record<WeaveThreadTone, string> = {
  active: colors.accent,
  kept: colors.covenant,
  late: colors.waiting,
  empty: colors.line,
};

export function WeaveBand({
  threads,
  title = 'نسيج عهودك',
  detail,
  caption,
  alert,
  testID,
}: WeaveBandProps) {
  return (
    <View testID={testID} style={styles.card}>
      <View style={styles.heading}>
        <Text style={styles.title}>{title}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
      <View accessibilityLabel="خيوط حالة العهود" style={styles.band}>
        {threads.map((tone, index) => (
          <View
            key={`${tone}-${index}`}
            style={[
              styles.thread,
              {
                height: HEIGHTS[index % HEIGHTS.length],
                backgroundColor: TONE_COLOR[tone],
                opacity: tone === 'empty' ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.threadGlint} />
            {tone === 'late' ? <View style={styles.lateKnot} /> : null}
          </View>
        ))}
      </View>
      {caption || alert ? (
        <View style={styles.footer}>
          <Text style={styles.caption}>{caption}</Text>
          <Text style={styles.alert}>{alert}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.x3,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cardSecondary,
  },
  heading: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  title: {
    ...typography.sub,
    color: colors.ink,
    fontFamily: fontFamilies.body,
  },
  detail: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
  },
  band: {
    height: 58,
    marginTop: spacing.x2,
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 6,
  },
  thread: {
    flex: 1,
    minWidth: 8,
    overflow: 'visible',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  threadGlint: {
    position: 'absolute',
    top: 6,
    right: 3,
    bottom: 5,
    width: 2,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  lateKnot: {
    position: 'absolute',
    top: -5,
    right: '50%',
    width: 10,
    height: 10,
    marginRight: -5,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.cardSecondary,
    backgroundColor: colors.waiting,
  },
  footer: {
    marginTop: spacing.x2,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  caption: {
    ...typography.caption,
    flex: 1,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  alert: {
    ...typography.caption,
    color: colors.waiting,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
    textAlign: 'left',
  },
});
