import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js') as GeneratedOrgEngine;

interface GeneratedIouEdge {
  from: string;
  to: string;
  amount: number;
}

interface GeneratedOrgEngine {
  NODES: string[];
  IOUS: GeneratedIouEdge[];
  toMinor: (sar: number) => number;
}

interface KpiTileProps {
  readonly label: string;
  readonly value: string;
}

function KpiTile({ label, value }: KpiTileProps) {
  return (
    <View style={styles.kpiTile}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );
}

export function OrgScreen() {
  const nodes = engine.NODES;
  const ious = engine.IOUS;
  const outstandingMinor = ious.reduce((sum, edge) => sum + engine.toMinor(edge.amount), 0);

  return (
    <AppShell testID="org-screen">
      <ScreenHeader
        title="صندوق قرض حسن"
        subtitle="تجميعاتٌ فقط — لا رقمَ فردٍ، ولا تصنيف، ولا يُصدَّر شيء"
      />

      <Section title="متبقٍّ للصندوق">
        <RowGroup>
          <View style={styles.heroRow}>
            <Text style={styles.heroNumber}>{ahdCore.formatMinorSar(outstandingMinor)}</Text>
          </View>
        </RowGroup>
      </Section>

      <Section title="مؤشّرات">
        <RowGroup>
          <View style={styles.kpiGrid}>
            <KpiTile label="الأعضاء المشتركون" value={String(nodes.length)} />
            <KpiTile label="عهودٌ نشطة" value={String(ious.length)} />
            <KpiTile label="أُقرِض قرضًا حسنًا" value={ahdCore.formatMinorSar(outstandingMinor)} />
            <KpiTile label="متبقٍّ" value={ahdCore.formatMinorSar(outstandingMinor)} />
          </View>
        </RowGroup>
      </Section>

      <Section title="حماية">
        <RowGroup>
          <View style={styles.guardRow}>
            <Text style={styles.guardText}>🛡️ تجميعاتٌ فقط — لا رقمَ فردٍ، ولا تصنيف، ولا يُصدَّر شيء.</Text>
            <Text style={styles.guardText}>
              🤍 لا يحتفظ الصندوق بمالٍ مجمَّع — كلٌّ يدفع لحظة الصرف (عهدٌ حسن مباشر).
            </Text>
          </View>
        </RowGroup>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    padding: spacing.x3,
  },
  heroNumber: {
    ...typography.amount,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.x2,
    padding: spacing.x3,
  },
  kpiTile: {
    flexBasis: '45%',
    gap: spacing.x1,
  },
  kpiLabel: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  kpiValue: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  guardRow: {
    gap: spacing.x1,
    padding: spacing.x3,
  },
  guardText: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
