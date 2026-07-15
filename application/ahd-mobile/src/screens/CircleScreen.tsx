import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js') as GeneratedCircleEngine;

interface GeneratedCircleShareEvent {
  type: string;
  [key: string]: unknown;
}

interface GeneratedCircleMember {
  name: string;
  amountMinor: number;
  self: boolean;
  events: GeneratedCircleShareEvent[];
}

interface GeneratedCircle {
  id: string;
  name: string;
  organizer: string;
  totalMinor: number;
  members: GeneratedCircleMember[];
}

interface GeneratedCircleEngine {
  DEMO_CIRCLE: GeneratedCircle;
  CIRCLE_STATE_AR: Record<string, string>;
  circleShares: (circle: GeneratedCircle) => GeneratedCircleMember[];
  foldCircle: (circle: GeneratedCircle) => {
    status: string;
    debtCount: number;
    closed: number;
    owedMinor: number;
    collectedMinor: number;
  };
  toMinor: (sar: number) => number;
}

function memberTone(events: GeneratedCircleShareEvent[]): 'verified' | 'stopped' | 'neutral' {
  const kinds = events.map((event) => event.type);
  if (kinds.includes('SETTLEMENT_SETTLED') || kinds.includes('FORGIVEN')) return 'verified';
  if (kinds.includes('DISPUTE_RAISED')) return 'stopped';
  return 'neutral';
}

function memberStatusAr(events: GeneratedCircleShareEvent[]): string {
  const kinds = events.map((event) => event.type);
  if (kinds.includes('SETTLEMENT_SETTLED')) return 'محفوظة';
  if (kinds.includes('FORGIVEN')) return 'أُبرئ';
  if (kinds.includes('GRACE_GRANTED')) return 'مؤجّل بالتراضي';
  if (kinds.includes('DISPUTE_RAISED')) return 'محلّ خلاف';
  if (kinds.includes('ACTIVATED')) return 'نشِط';
  return 'بانتظار';
}

export function CircleScreen() {
  const circle = engine.DEMO_CIRCLE;
  const fold = engine.foldCircle(circle);
  const shares = engine.circleShares(circle);
  const statusAr = engine.CIRCLE_STATE_AR[fold.status] ?? fold.status;

  return (
    <AppShell testID="circle-screen">
      <ScreenHeader
        eyebrow="لوحة أمين الصندوق"
        title={`دائرة «${circle.name}»`}
        subtitle={`أمين الصندوق ${circle.organizer}`}
      />

      <Section title="التقدّم">
        <RowGroup>
          <View style={styles.progressRow}>
            <Text style={styles.heroNumber}>{ahdCore.formatMinorSar(fold.collectedMinor)}</Text>
            <Text style={styles.progressLabel}>
              جُمِع من إجمالي {ahdCore.formatMinorSar(fold.owedMinor)}
            </Text>
            <Text style={styles.progressLabel}>{statusAr}</Text>
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
              <StatusChip label={memberStatusAr(member.events)} tone={memberTone(member.events)} />
            </View>
          ))}
        </RowGroup>
      </Section>

      <Section title="ملاحظة">
        <RowGroup>
          <View style={styles.noteRow}>
            <Text style={styles.noteText}>
              التذكير جماعيٌّ يصل الجميع — لا يُسمّى المتأخّر ولا يُفضح. ومتى تعسّر عضوٌ: «أحتاج وقت» (٢٨٠) أو
              إبراءٌ صدقةً.
            </Text>
          </View>
        </RowGroup>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    gap: spacing.x1,
    padding: spacing.x3,
  },
  heroNumber: {
    ...typography.amount,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  progressLabel: {
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
