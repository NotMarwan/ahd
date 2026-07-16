import { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { AhdButton, AppShell, RowGroup, ScreenHeader, Section } from '@/components';
import { sharePilotExport } from '@/share';
import { usePilot } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

export function SettingsScreen() {
  const { state, store } = usePilot();
  const [nameDraft, setNameDraft] = useState(state.profile.displayName ?? '');
  const [feedback, setFeedback] = useState<string>();
  const [deleteArmed, setDeleteArmed] = useState(false);

  const report = (message: string) => setFeedback(message);
  const fail = (caught: unknown, fallback: string) => {
    setFeedback(caught instanceof Error ? caught.message : fallback);
  };

  const saveName = async () => {
    try {
      await store.setDisplayName(nameDraft);
      report('حُفظ اسم العرض محليًا على هذا الجهاز.');
    } catch (caught) {
      fail(caught, 'تعذّر حفظ الاسم');
    }
  };

  const toggleHideAmounts = async (value: boolean) => {
    try {
      await store.updateSettings({ hideAmounts: value });
    } catch (caught) {
      fail(caught, 'تعذّر حفظ الإعداد');
    }
  };

  const toggleDigits = async (value: boolean) => {
    try {
      await store.updateSettings({ digitMode: value ? 'arabic' : 'western' });
    } catch (caught) {
      fail(caught, 'تعذّر حفظ الإعداد');
    }
  };

  const exportAll = async () => {
    try {
      const serialized = await store.exportPortable();
      const result = await sharePilotExport(serialized);
      report(
        result === 'opened'
          ? 'جُهّز التصدير الكامل (AhdPilotExportV1) وفُتحت نافذة المشاركة.'
          : 'أُغلقت نافذة المشاركة — لم يغادر أيّ ملف هذا الجهاز.',
      );
    } catch (caught) {
      fail(caught, 'تعذّر التصدير');
    }
  };

  const confirmDelete = async () => {
    try {
      await store.deleteAll();
      setDeleteArmed(false);
      setNameDraft('');
      report('حُذفت كل بيانات عهد من هذا الجهاز نهائيًا.');
    } catch (caught) {
      fail(caught, 'تعذّر الحذف');
    }
  };

  return (
    <AppShell testID="settings-screen">
      <ScreenHeader title="الإعدادات · عن عهد" />

      <Section title="اسم العرض">
        <RowGroup>
          <View style={styles.form}>
            <Text style={styles.note}>
              اسمٌ للعرض المحلي فقط — لا هوية ولا هاتف ولا حسابَ بنك، ولا يغادر هذا الجهاز.
            </Text>
            <TextInput
              accessibilityLabel="اسم العرض"
              onChangeText={setNameDraft}
              style={styles.input}
              value={nameDraft}
            />
          </View>
        </RowGroup>
        <AhdButton label="احفظ اسم العرض" onPress={saveName} />
      </Section>

      <Section title="العرض والخصوصيّة">
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
              onValueChange={toggleHideAmounts}
              value={state.settings.hideAmounts}
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleBody}>
              <Text style={styles.toggleLabel}>الأرقام الهنديّة (٠١٢٣)</Text>
              <Text style={styles.toggleNote}>عرض الأرقام بالرسم المشرقيّ بدل الرسم الغربي.</Text>
            </View>
            <Switch
              accessibilityLabel="الأرقام الهنديّة"
              onValueChange={toggleDigits}
              value={state.settings.digitMode === 'arabic'}
            />
          </View>
        </RowGroup>
      </Section>

      <Section title="بياناتك — تصديرٌ وحذف">
        <RowGroup>
          <View style={styles.form}>
            <Text style={styles.note}>
              التصدير يجهّز نسخةً كاملةً محمولةً من كل شرائح البيانات الخمس بصيغة
              AhdPilotExportV1 الثابتة — أنت من يقرّر أين تذهب.
            </Text>
          </View>
        </RowGroup>
        <AhdButton label="صدّر بيانات عهد" onPress={exportAll} />
        {!deleteArmed ? (
          <AhdButton
            label="احذف كل بيانات عهد من هذا الجهاز"
            onPress={() => setDeleteArmed(true)}
            variant="quiet"
          />
        ) : (
          <View style={styles.deleteConfirm}>
            <Text style={styles.deleteWarning}>
              هذا حذفٌ نهائيّ لكل السجلّات والدوائر والقيود على هذا الجهاز، ولا يمكن التراجع
              عنه. صدّر بياناتك أولًا إن أردت الاحتفاظ بها.
            </Text>
            <AhdButton label="تأكيد الحذف النهائي" onPress={confirmDelete} />
            <AhdButton label="تراجع" onPress={() => setDeleteArmed(false)} variant="quiet" />
          </View>
        )}
      </Section>

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

      <Section title="الإفصاح الذاتي">
        <RowGroup>
          <View style={styles.form}>
            <Text style={styles.note}>
              مشاركة كلمة «وفّى بعهوده» مع من تطلب منه عهدًا مسألةٌ شرعيّةٌ مفتوحة (D-1) قيد
              قرارٍ بشريّ — لم تُفعَّل في هذه النسخة، ولا نعرض مفتاحًا لا يعمل.
            </Text>
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
  form: {
    gap: spacing.x2,
    padding: spacing.x3,
  },
  input: {
    minHeight: controls.minTarget,
    paddingHorizontal: spacing.x3,
    paddingVertical: spacing.x2,
    color: colors.ink,
    backgroundColor: colors.ground,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.card,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  note: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x3,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
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
  deleteConfirm: {
    gap: spacing.x2,
  },
  deleteWarning: {
    ...typography.secondary,
    color: colors.waiting,
    fontFamily: fontFamilies.body,
    lineHeight: 20,
    textAlign: 'right',
  },
  feedback: {
    ...typography.secondary,
    color: colors.waiting,
    fontFamily: fontFamilies.body,
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
