import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js') as GeneratedStandingEngine;

interface GeneratedShareEvent {
  type: string;
  [key: string]: unknown;
}

interface GeneratedCircleMember {
  name: string;
  amountMinor: number;
  self: boolean;
  events: GeneratedShareEvent[];
}

interface GeneratedCircle {
  id: string;
  name: string;
  organizer: string;
  totalMinor: number;
  members: GeneratedCircleMember[];
}

interface GeneratedStandingEngine {
  STANDING_CIRCLE: GeneratedCircle;
  CIRCLE_STATE_AR: Record<string, string>;
  circleShares: (circle: GeneratedCircle) => GeneratedCircleMember[];
  foldCircle: (circle: GeneratedCircle) => {
    status: string;
    debtCount: number;
    closed: number;
    owedMinor: number;
    collectedMinor: number;
  };
}

function memberStatusAr(events: GeneratedShareEvent[]): string {
  const kinds = events.map((event) => event.type);
  if (kinds.includes('SETTLEMENT_SETTLED')) return 'سُدِّد ✓';
  if (kinds.includes('GRACE_GRANTED')) return 'مؤجّل بالتراضي';
  if (kinds.includes('ACTIVATED')) return 'قائم — متى ما تيسّر';
  return 'بانتظار';
}

export function StandingScreen() {
  const circle = engine.STANDING_CIRCLE;
  const fold = engine.foldCircle(circle);
  const shares = engine.circleShares(circle);
  const statusAr = engine.CIRCLE_STATE_AR[fold.status] ?? fold.status;
  const outstandingMinor = fold.owedMinor - fold.collectedMinor;

  return (
    <AppShell testID="standing-screen">
      <ScreenHeader
        eyebrow="سُلفة بالمعروف"
        title="قرضٌ حسنٌ قائمٌ بين طرفين"
        subtitle={`${circle.organizer} · ${circle.name}`}
      />

      <Section title="باقٍ">
        <RowGroup>
          <View style={styles.heroRow}>
            <Text style={styles.heroNumber}>{ahdCore.formatMinorSar(outstandingMinor)}</Text>
            <Text style={styles.heroLabel}>{statusAr}</Text>
          </View>
        </RowGroup>
      </Section>

      <Section title="الأعضاء">
        <RowGroup>
          {shares.map((member) => (
            <View key={member.name} style={styles.memberRow}>
              <Text style={styles.memberText}>
                {member.name} · {ahdCore.formatMinorSar(member.amountMinor)}
              </Text>
              <StatusChip label={memberStatusAr(member.events)} tone="neutral" />
            </View>
          ))}
        </RowGroup>
      </Section>

      <Section title="ملاحظة">
        <RowGroup>
          <View style={styles.noteRow}>
            <Text style={styles.noteText}>
              سُلفةٌ قائمةٌ متجدّدة — لا موعد، لا تذكير، لا حرج. في كلّ دورةٍ يُختم عهدٌ واحد، يُسدَّد متى ما تيسّر،
              بلا أيّ زيادة.
            </Text>
          </View>
        </RowGroup>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    gap: spacing.x1,
    padding: spacing.x3,
  },
  heroNumber: {
    ...typography.amount,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  heroLabel: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  memberText: {
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
