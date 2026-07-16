import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AppShell,
  EmptyState,
  RowGroup,
  ScreenHeader,
  Section,
  StatusChip,
} from '@/components';
import { buildLocalTimeline, useAhdJourney, usePilot } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

const EVENT_LABELS: Record<string, string> = {
  AHD_DRAFTED: 'كُتب العهد',
  LENDER_SIGNED: 'ثُبّت طرف المال',
  COUNTERPARTY_SIGNED: 'ثُبّت الطرف المقابل',
  RECORD_SEALED: 'خُتم السجل محليًا',
  ACTIVATED: 'أصبح العهد قائمًا',
  SETTLEMENT_SETTLED: 'سُجّل الوفاء',
  DISPUTE_RECONCILED: 'سُجّل الصلح',
};

export function TimelineScreen() {
  const router = useRouter();
  const { beginCreate, openRecord, state: journey } = useAhdJourney();
  const { state: pilot } = usePilot();
  const displayName = pilot.profile.displayName;
  const events = buildLocalTimeline(journey.records, displayName);

  const createAhd = async () => {
    await beginCreate();
    router.push('/create');
  };
  const showRecord = async (recordId: string) => {
    await openRecord(recordId);
    router.push(`/record/${recordId}`);
  };

  return (
    <AppShell testID="timeline-screen">
      <ScreenHeader
        eyebrow="من الختم نفسه"
        title="الخط الزمني"
        subtitle="ترتيب الأحداث داخل سجلاتك المحلية. لا نخترع وقتًا لم يسجله الحدث."
      />

      {!displayName ? (
        <Section>
          <RowGroup><EmptyState title="حدّد اسم العرض" body="حتى نعرض أحداث العهود التي تخصّك فقط." /></RowGroup>
          <AhdButton label="افتح الإعدادات" onPress={() => router.push('/settings')} />
        </Section>
      ) : events.length === 0 ? (
        <Section>
          <RowGroup><EmptyState title="لا توجد أحداث بعد" body="اختم عهدًا ليظهر تسلسله هنا." /></RowGroup>
          <AhdButton label="أنشئ عهدًا" onPress={createAhd} />
        </Section>
      ) : (
        <Section title="الأحداث المحلية">
          <RowGroup>
            {events.map((event) => (
              <View key={event.id} style={styles.event}>
                <View style={styles.heading}>
                  <StatusChip label={`الحدث ${event.eventIndex + 1}`} tone="neutral" />
                  <Text style={styles.title}>{EVENT_LABELS[event.eventType] ?? event.eventType}</Text>
                </View>
                <Text style={styles.parties}>{event.lender} ← {event.borrower}</Text>
                <Text style={styles.id}>{event.recordId}</Text>
                <AhdButton label="افتح السجل" onPress={() => showRecord(event.recordId)} variant="quiet" />
              </View>
            ))}
          </RowGroup>
        </Section>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  event: { gap: spacing.x1, padding: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  heading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  title: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  parties: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  id: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.technical, writingDirection: 'ltr' },
});
