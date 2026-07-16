import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

type SealChipProps = {
  readonly eyebrow: string;
  readonly label: string;
  readonly hash?: string;
};

export function SealChip({ eyebrow, label, hash }: SealChipProps) {
  return (
    <View style={styles.container}>
      <View accessibilityLabel="عقدة الختم" style={styles.knot}>
        <View style={styles.knotRing} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      {hash ? <Text style={styles.hash}>{hash}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    paddingHorizontal: spacing.x3,
    paddingVertical: spacing.x2,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x3,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cardSecondary,
  },
  knot: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.seal,
  },
  knotRing: {
    width: 13,
    height: 13,
    borderRadius: radii.pill,
    borderWidth: 2.5,
    borderColor: colors.sealHash,
  },
  copy: {
    flex: 1,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  label: {
    ...typography.sub,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  hash: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.technical,
    writingDirection: 'ltr',
  },
});
