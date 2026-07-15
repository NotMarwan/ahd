import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AmountDisplay,
  AppShell,
  RowGroup,
  ScreenHeader,
  Section,
  StatusChip,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { useAhdJourney } from '@/state';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export function HomeScreen() {
  const router = useRouter();
  const { beginCreate, openDaftari, state } = useAhdJourney();

  const startJourney = async () => {
    await beginCreate();
    router.push('/create');
  };

  const showDaftari = async () => {
    await openDaftari();
    router.push('/daftari');
  };

  return (
    <AppShell testID="home-screen">
      <View style={styles.brand}>
        <Image
          accessibilityLabel="شعار عهد"
          source={require('../../assets/images/ahd-logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>

      <ScreenHeader
        title="كلمتك محفوظة، وعلاقتك محميّة"
        subtitle="نوثّق القرض الحسن ونختمه ونسوّيه، من غير فائدة أو غرامة أو تقييم ائتماني."
      />

      {state.sealed ? (
        <Section title="عهدك الأخير">
          <RowGroup>
            <View style={styles.row}>
              <View style={styles.rowHeading}>
                <Text style={styles.title}>{state.sealed.record.id}</Text>
                <StatusChip label="مختوم" tone="verified" />
              </View>
              <AmountDisplay
                label="قيمة العهد"
                value={ahdCore.formatMinorSar(state.sealed.record.amountMinor)}
              />
            </View>
          </RowGroup>
          <AhdButton label="افتح دفتري" onPress={showDaftari} />
        </Section>
      ) : (
        <Section title="رحلة واحدة واضحة">
          <RowGroup>
            <View style={styles.row}>
              <Text style={styles.title}>أنشئ، افحص، ثم اختم</Text>
              <Text style={styles.body}>
                تبدأ بتفاصيل العهد، ثم يظهر فحص الشروط قبل إنشاء أي ختم.
              </Text>
            </View>
          </RowGroup>
          <AhdButton label="ابدأ عهدًا جديدًا" onPress={startJourney} />
        </Section>
      )}

      <Text style={styles.footnote}>
        عهد شاهدٌ على الاتفاق ومسار السداد، وليس مقرضًا أو حكمًا بين الأطراف.
      </Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  brand: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 112,
    height: 112,
    borderRadius: 24,
  },
  row: {
    gap: spacing.x2,
    minHeight: 88,
    padding: spacing.x3,
  },
  rowHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  title: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  body: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 21,
    textAlign: 'right',
  },
  footnote: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
});
