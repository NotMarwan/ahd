import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section } from '@/components';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export function SettingsScreen() {
  const [selfDisclosure, setSelfDisclosure] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);

  return (
    <AppShell testID="settings-screen">
      <ScreenHeader eyebrow="الإعدادات" title="الإعدادات · عن عهد" />

      <Section title="الإفصاح الذاتي">
        <RowGroup>
          <View style={styles.toggleRow}>
            <View style={styles.toggleBody}>
              <Text style={styles.toggleLabel}>مشاركة سجلّ وفائي مع من أطلب منه عهدًا</Text>
              <Text style={styles.toggleNote}>
                اختياريٌّ بالكامل — عرضٌ نوعيٌّ فقط («وفّى بعهوده»)، بلا رقمٍ ولا درجة ائتمانية.
              </Text>
            </View>
            <Switch
              accessibilityLabel="الإفصاح الذاتي"
              onValueChange={setSelfDisclosure}
              value={selfDisclosure}
            />
          </View>
        </RowGroup>
      </Section>

      <Section title="الخصوصيّة · إخفاء المبالغ">
        <RowGroup>
          <View style={styles.toggleRow}>
            <View style={styles.toggleBody}>
              <Text style={styles.toggleLabel}>إخفاء المبالغ في العرض</Text>
              <Text style={styles.toggleNote}>
                حين تُري شاشتك لأحد: تختفي المبالغ (تُستبدَل بـ «•••»). عرضٌ فقط — لا يمسّ الوثيقة ولا الختم.
              </Text>
            </View>
            <Switch
              accessibilityLabel="إخفاء المبالغ"
              onValueChange={setHideAmounts}
              value={hideAmounts}
            />
          </View>
        </RowGroup>
      </Section>

      <Text style={styles.model}>
        النموذج: عقدان منفصلان — قرضٌ حسن بلا أيّ زيادة بينكما، وأجرةُ خدمةٍ ثابتةٌ للمصرف على
        التوثيق والحفظ (لا نسبةٌ من المبلغ، ولا تزيد بالتأخير). فصلٌ تامّ بين القرض والأجرة.
      </Text>
      <Text style={styles.basis}>
        ﴿وَإِن كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ﴾ · ﴿وَأَن تَصَدَّقُوا خَيْرٌ لَّكُمْ﴾ (٢٨٠) —
        ﴿فَاكْتُبُوهُ﴾ (٢٨٢)
      </Text>
      <Text style={styles.about}>
        عهد — قرضٌ حسن مكتوبٌ ومشهود، بكرامة. كلمتك محفوظة، وعلاقتك محميّة.
      </Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x3,
    padding: spacing.x3,
  },
  toggleBody: {
    flex: 1,
    gap: spacing.x1,
  },
  toggleLabel: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  toggleNote: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 18,
    textAlign: 'right',
  },
  model: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
  basis: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 22,
    textAlign: 'right',
  },
  about: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
