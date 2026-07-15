import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section } from '@/components';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js') as GeneratedCircleAdvEngine;

interface GeneratedCircle {
  id: string;
  name: string;
  organizer: string;
  totalMinor: number;
}

interface GeneratedIouEdge {
  from: string;
  to: string;
  amount: number;
}

interface GeneratedCircleAdvEngine {
  MUQASSA_CIRCLES: GeneratedCircle[];
  CIRCLE_IOUS: GeneratedIouEdge[];
  circleToIous: (circle: GeneratedCircle) => GeneratedIouEdge[];
  netting: (edges: GeneratedIouEdge[]) => GeneratedIouEdge[];
  fmt: (n: number) => string;
}

export function CircleAdvScreen() {
  const circles = engine.MUQASSA_CIRCLES;
  const openIous = engine.CIRCLE_IOUS;
  const settled = engine.netting(openIous);

  return (
    <AppShell testID="circle-adv-screen">
      <ScreenHeader
        title="تقسيمٌ وتخريجٌ وتعهّد"
        subtitle="دوائر الصندوق ومقاصّتها معًا — بلا فائدةٍ ولا غرامة"
      />

      <Section title="دوائر الربع">
        <RowGroup>
          {circles.map((circle) => (
            <View key={circle.id} style={styles.circleRow}>
              <Text style={styles.circleName}>{circle.name}</Text>
              <Text style={styles.circleSub}>أمين الصندوق {circle.organizer}</Text>
            </View>
          ))}
        </RowGroup>
      </Section>

      <Section title={`قبل المقاصّة · ${openIous.length} عهود مفتوحة`}>
        <RowGroup>
          {openIous.map((edge, index) => (
            <View key={`${edge.from}-${edge.to}-${index}`} style={styles.edgeRow}>
              <Text style={styles.edgeText}>
                {edge.from} ← {edge.to} · {engine.fmt(edge.amount)} ر.س
              </Text>
            </View>
          ))}
        </RowGroup>
      </Section>

      <Section title={`بعد المقاصّة · ${settled.length} تحويلات فقط`}>
        <RowGroup>
          {settled.map((edge, index) => (
            <View key={`${edge.from}-${edge.to}-${index}`} style={styles.edgeRow}>
              <Text style={styles.edgeText}>
                {edge.from} ← {edge.to} · {engine.fmt(edge.amount)} ر.س
              </Text>
            </View>
          ))}
        </RowGroup>
      </Section>

      <Section title="ملاحظة">
        <RowGroup>
          <View style={styles.noteRow}>
            <Text style={styles.noteText}>
              ⚠️ نمط التعهّد الجماعي (ب) يحتاج مراجعةً شرعيّة قبل الإطلاق — لا وديعةٌ مجمّعة يحفظها المصرف.
            </Text>
          </View>
        </RowGroup>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  circleRow: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  circleName: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  circleSub: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  edgeRow: {
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  edgeText: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  noteRow: {
    padding: spacing.x3,
  },
  noteText: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
