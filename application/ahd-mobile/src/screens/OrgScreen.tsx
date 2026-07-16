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
import { ahdCore } from '@/core/ahd-core';
import { usePilot } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export function OrgScreen() {
  const router = useRouter();
  const { state } = usePilot();
  const circles = state.jamiya.circles;
  const totalPledgedMinor = circles.reduce(
    (sum, circle) => sum + circle.members.reduce((memberSum, member) => memberSum + member.shareMinor, 0),
    0,
  );

  return (
    <AppShell testID="org-screen">
      <ScreenHeader
        title="لوحة المؤسسة"
        subtitle="صندوق قرضٍ حسنٍ مؤسّسيّ يحتاج ربطًا خارجيًّا لم يحدث في هذه النسخة — لا نعرض هنا إلا ما على جهازك."
      />

      <Section title="الربط المؤسّسي">
        <RowGroup>
          <View style={styles.linkRow}>
            <View style={styles.linkBody}>
              <Text style={styles.linkTitle}>لا مؤسسة مرتبطة بهذه النسخة التجريبية</Text>
              <Text style={styles.linkNote}>
                ربط جمعيةٍ أو جهة عملٍ أو مكتبٍ عائليّ يتطلّب اتصالًا واعتمادًا خارج هذا الجهاز —
                لم يتمّ أيّ ربط، ولا يوجد صندوقٌ فعليّ هنا.
              </Text>
            </View>
            <StatusChip label="يحتاج اتصالًا" tone="neutral" />
          </View>
        </RowGroup>
      </Section>

      {circles.length === 0 ? (
        <Section title="دوائرك المحليّة">
          <RowGroup>
            <EmptyState
              title="لا دوائر محليّة بعد"
              body="ما تنشئه من دوائر على هذا الجهاز يظهر هنا كمجاميع محليّة فقط."
            />
          </RowGroup>
          <AhdButton label="أنشئ دائرة" onPress={() => router.push('/circle')} />
        </Section>
      ) : (
        <Section title="مجاميع من هذا الجهاز فقط">
          <RowGroup>
            {circles.map((circle) => (
              <View key={circle.id} style={styles.circleRow}>
                <Text style={styles.circleTitle}>{circle.title}</Text>
                <Text style={styles.circleMeta}>
                  {circle.members.length} أعضاء · {ahdCore.formatMinorSar(
                    circle.members.reduce((sum, member) => sum + member.shareMinor, 0),
                  )}
                </Text>
              </View>
            ))}
            <View style={styles.circleRow}>
              <Text style={styles.circleTitle}>إجمالي الحصص المتعاهد بها محليًّا</Text>
              <Text style={styles.circleMeta}>{ahdCore.formatMinorSar(totalPledgedMinor)}</Text>
            </View>
          </RowGroup>
        </Section>
      )}

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
  linkRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.x2,
    padding: spacing.x3,
  },
  linkBody: {
    flex: 1,
    gap: spacing.x1,
  },
  linkTitle: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  linkNote: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
  circleRow: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  circleTitle: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  circleMeta: {
    ...typography.secondary,
    color: colors.inkSecondary,
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
