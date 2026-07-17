import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, radii, spacing, typography } from '@/theme';
import { StatusChip } from './status-chip';

type ShowcaseNoticeProps = {
  readonly label?: 'بيانات تجريبية' | 'عرض تجريبي';
  readonly body?: string;
};

export function ShowcaseNotice({
  label = 'بيانات تجريبية',
  body = 'مثال ثابت للعرض فقط. لا يُحفظ ولا يغيّر بيانات جهازك.',
}: ShowcaseNoticeProps) {
  return (
    <View accessibilityLabel={label} style={styles.notice} testID="showcase-notice">
      <View style={styles.heading}>
        <View style={styles.dot} />
        <Text style={styles.title}>{label}</Text>
        <StatusChip label="غير محفوظ" tone="covenant" />
      </View>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    padding: spacing.x3,
    gap: spacing.x2,
    borderWidth: 1,
    borderColor: colors.covenant,
    borderRadius: radii.medium,
    backgroundColor: colors.covenantSoft,
  },
  heading: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.covenant,
  },
  title: {
    ...typography.sub,
    flex: 1,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  body: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
