import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AhdButton, AppShell } from '@/components';
import { usePilot } from '@/state';
import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

const LIMITS = [
  {
    marker: '01',
    title: 'ليست خدمة مصرفية',
    detail: 'لا نحفظ أموالًا، ولا ننفّذ تحويلات، ولا نغيّر رصيدًا خارجيًا.',
  },
  {
    marker: '02',
    title: 'ليست اعتمادًا شرعيًا أو قانونيًا',
    detail: 'هي أداة محلية لتوثيق ما تتفقون عليه ومراجعته بوضوح.',
  },
  {
    marker: '03',
    title: 'لا نطلب هوية وطنية أو رقم هاتف',
    detail: 'تكفي أسماء العرض التي تختارونها لهذه التجربة.',
  },
] as const;

export function WelcomeScreen() {
  const router = useRouter();
  const { store } = usePilot();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const begin = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await store.acceptWelcome();
      router.replace('/home');
    } catch {
      setError('تعذّر حفظ البداية على جهازك. حاول مرة أخرى.');
      setBusy(false);
    }
  };

  return (
    <AppShell testID="welcome-screen">
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>نسخة Pilot محلية</Text>
        <Text style={styles.title}>كلمتكم، محفوظة بينكم.</Text>
        <Text style={styles.lead}>
          جرّبوا رحلة عهد حقيقية على هذا الجهاز، من الاتفاق إلى الختم والتحقق، من دون حساب بنكي أو مزامنة سحابية.
        </Text>
      </View>

      <View style={styles.localCard}>
        <View style={styles.localSignal} />
        <View style={styles.localCopy}>
          <Text style={styles.localTitle}>تبقى بياناتك على هذا الجهاز</Text>
          <Text style={styles.localDetail}>يمكنك تصديرها أو حذفها كاملة من الإعدادات متى أردت.</Text>
        </View>
        <Text accessibilityElementsHidden style={styles.localMark}>محلي</Text>
      </View>

      <View style={styles.limits}>
        {LIMITS.map((item) => (
          <View key={item.marker} style={styles.limitRow}>
            <Text style={styles.marker}>{item.marker}</Text>
            <View style={styles.limitCopy}>
              <Text style={styles.limitTitle}>{item.title}</Text>
              <Text style={styles.limitDetail}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

      <AhdButton
        disabled={busy}
        label={busy ? 'نحفظ البداية…' : 'ابدأ تجربتي المحلية'}
        onPress={begin}
        testID="welcome-start"
      />

      <Text style={styles.footnote}>Pilot محدود لمستخدم أو مستخدمين · بلا تتبّع · بلا شبكة</Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: spacing.x3,
    gap: spacing.x2,
  },
  eyebrow: {
    ...typography.label,
    color: colors.covenant,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  title: {
    ...typography.largeTitle,
    maxWidth: 360,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    textAlign: 'right',
  },
  lead: {
    ...typography.body,
    maxWidth: 430,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  localCard: {
    minHeight: 96,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x3,
    padding: spacing.x4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accentLine,
    borderRadius: radii.large,
    backgroundColor: colors.cardSecondary,
  },
  localSignal: {
    width: 9,
    alignSelf: 'stretch',
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  localCopy: {
    flex: 1,
    gap: spacing.x1,
  },
  localTitle: {
    ...typography.title,
    color: colors.accentDeep,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  localDetail: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  localMark: {
    ...typography.caption,
    paddingHorizontal: spacing.x2,
    paddingVertical: spacing.x1,
    borderRadius: radii.pill,
    color: colors.white,
    backgroundColor: colors.accent,
    fontFamily: fontFamilies.body,
  },
  limits: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  limitRow: {
    minHeight: 76,
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: spacing.x3,
    paddingVertical: spacing.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  marker: {
    ...typography.caption,
    width: 30,
    paddingTop: 2,
    color: colors.covenant,
    fontFamily: fontFamilies.technical,
    textAlign: 'right',
  },
  limitCopy: {
    flex: 1,
    gap: spacing.x1,
  },
  limitTitle: {
    ...typography.title,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  limitDetail: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  error: {
    ...typography.caption,
    color: colors.stopped,
    fontFamily: fontFamilies.body,
    textAlign: 'center',
  },
  footnote: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'center',
  },
});
