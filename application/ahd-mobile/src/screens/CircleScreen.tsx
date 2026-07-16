import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AhdButton, AppShell, EmptyState, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { usePilot } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export function CircleScreen() {
  const router = useRouter();
  const { state, store } = usePilot();
  const active = state.jamiya.circles.find((circle) => circle.id === state.jamiya.activeCircleId)
    ?? state.jamiya.circles.at(-1);

  return (
    <AppShell testID="circle-screen">
      <ScreenHeader
        eyebrow="دفتر الدوائر"
        title="الدائرة"
        subtitle="كل الأسماء والموافقات والدفعات أدخلها العميل؛ لا توجد أموال أو أعضاء مزروعون."
      />

      {!active ? (
        <Section>
          <RowGroup><EmptyState title="لا توجد دائرة" body="أنشئ جمعية محلية وحدّد أعضاءها وحصصهم." /></RowGroup>
          <AhdButton label="أنشئ جمعية" onPress={() => router.push('/jamiya')} />
        </Section>
      ) : (
        <>
          {state.jamiya.circles.length > 1 ? (
            <Section title="دوائرك">
              <RowGroup>
                {state.jamiya.circles.map((circle) => (
                  <View key={circle.id} style={styles.row}>
                    <Text style={styles.title}>{circle.title}</Text>
                    <AhdButton label="اختر الدائرة" onPress={() => store.selectCircle(circle.id)} variant="quiet" />
                  </View>
                ))}
              </RowGroup>
            </Section>
          ) : null}

          <Section title={active.title}>
            <RowGroup>
              <View style={styles.card}>
                <View style={styles.heading}>
                  <Text style={styles.title}>{active.organizer}</Text>
                  <StatusChip
                    label={active.status === 'draft' ? 'مسودة' : active.status === 'active' ? 'نشطة محليًا' : 'مكتملة'}
                    tone={active.status === 'complete' ? 'verified' : 'covenant'}
                  />
                </View>
                <Text style={styles.meta}>{active.id} · البداية {active.startMonth}</Text>
              </View>
            </RowGroup>
          </Section>

          <Section title="الأعضاء">
            <RowGroup>
              {active.members.map((member) => {
                const payments = active.payments.filter((payment) => payment.memberId === member.id).length;
                return (
                  <View key={member.id} style={styles.row}>
                    <View style={styles.heading}>
                      <Text style={styles.title}>{member.displayName}</Text>
                      <StatusChip
                        label={member.consentAttestation ? 'إقرار المنظّم محفوظ' : 'بانتظار إقرار المنظّم'}
                        tone={member.consentAttestation ? 'verified' : 'neutral'}
                      />
                    </View>
                    <Text style={styles.meta}>الحصة {ahdCore.formatMinorSar(member.shareMinor)}</Text>
                    <Text style={styles.meta}>دفعات مسجّلة محليًا: {payments}</Text>
                  </View>
                );
              })}
            </RowGroup>
          </Section>

          <AhdButton label="إدارة الجمعية" onPress={() => router.push('/jamiya')} />
          <AhdButton label="معاينة الدائرة+" onPress={() => router.push('/circle-adv')} variant="secondary" />
        </>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.x2, padding: spacing.x3 },
  row: { gap: spacing.x2, padding: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  heading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  title: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  meta: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
});
