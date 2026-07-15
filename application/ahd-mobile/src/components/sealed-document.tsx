import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

type SealedDocumentProps = {
  readonly title: string;
  readonly verdict: string;
  readonly technicalDetails: string;
};

export function SealedDocument({ title, verdict, technicalDetails }: SealedDocumentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const disclosureLabel = isExpanded ? 'إخفاء التفاصيل التقنية' : 'عرض التفاصيل التقنية';

  return (
    <View style={styles.document}>
      <Text style={styles.kicker}>وثيقة مختومة</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.verdict} accessibilityLiveRegion="polite">
        <Text style={styles.verdictText}>{verdict}</Text>
      </View>
      <Pressable
        accessibilityLabel={disclosureLabel}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        hitSlop={controls.hitSlop}
        onPress={() => setIsExpanded((current) => !current)}
        style={styles.disclosure}
      >
        <Text style={styles.disclosureLabel}>{disclosureLabel}</Text>
      </Pressable>
      {isExpanded ? (
        <Text selectable style={styles.technical}>
          {technicalDetails}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  document: {
    gap: spacing.x2,
    padding: spacing.x3,
    backgroundColor: colors.seal,
    borderRadius: radii.card,
    borderCurve: 'continuous',
  },
  kicker: {
    ...typography.label,
    color: colors.sealLabel,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  title: {
    ...typography.ceremonyTitle,
    color: colors.sealInk,
    fontFamily: fontFamilies.display,
    textAlign: 'right',
  },
  verdict: {
    alignSelf: 'stretch',
    padding: spacing.x2,
    backgroundColor: colors.verified,
    borderRadius: radii.card,
  },
  verdictText: {
    ...typography.row,
    color: colors.card,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  disclosure: {
    minHeight: controls.minTarget,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  disclosureLabel: {
    ...typography.row,
    color: colors.sealHash,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  technical: {
    ...typography.secondary,
    color: colors.sealInk,
    fontFamily: 'monospace',
    writingDirection: 'ltr',
    textAlign: 'left',
  },
});
