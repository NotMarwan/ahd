import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AhdButton,
  AppShell,
  EmptyState,
  RowGroup,
  ScreenHeader,
  Section,
  ShowcaseNotice,
  StatusChip,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { SHOWCASE_DAILY_ENTRIES, SHOWCASE_DAILY_FORM } from '@/showcase/showcase-data';
import { usePilot } from '@/state';
import type { PilotDailyEntry } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

function Field({
  label,
  value,
  onChangeText,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText(value: string): void;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        multiline={multiline}
        onChangeText={onChangeText}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

function entryTitle(entry: PilotDailyEntry): string {
  if (entry.kind === 'note') return entry.title;
  if (entry.kind === 'request') {
    return `طلب عهد من ${entry.lender} · ${ahdCore.formatMinorSar(entry.amountMinor)}`;
  }
  return `خلاف على ${entry.recordId}`;
}

function entryBody(entry: PilotDailyEntry): string {
  if (entry.kind === 'note') return entry.note;
  if (entry.kind === 'request') return entry.termsAr;
  return entry.reason;
}

function entryChip(entry: PilotDailyEntry): { label: string; tone: 'neutral' | 'covenant' | 'verified' } {
  if (entry.kind === 'note') return { label: 'قيد محلي', tone: 'covenant' };
  if (entry.kind === 'request') return { label: 'يحتاج اتصالًا', tone: 'neutral' };
  return entry.status === 'open'
    ? { label: 'خلاف مفتوح', tone: 'neutral' }
    : { label: 'صُولح محليًا', tone: 'verified' };
}

export function DailyScreen() {
  const { state, store } = usePilot();
  const storedEntries = state.daily.entries;
  const isShowcase = storedEntries.length === 0;
  const entries = isShowcase ? SHOWCASE_DAILY_ENTRIES : storedEntries;
  const [title, setTitle] = useState<string>(SHOWCASE_DAILY_FORM.title);
  const [note, setNote] = useState<string>(SHOWCASE_DAILY_FORM.note);
  const [effectiveDate, setEffectiveDate] = useState<string>(SHOWCASE_DAILY_FORM.effectiveDate);
  const [feedback, setFeedback] = useState<string>();

  const save = async () => {
    setFeedback(undefined);
    try {
      await store.addDailyNote({ title, note, effectiveDate });
      setTitle('');
      setNote('');
      setEffectiveDate('');
      setFeedback('حُفظ القيد محليًا على هذا الجهاز — لم يتغيّر أي رصيد.');
    } catch (caught) {
      setFeedback(caught instanceof Error ? caught.message : 'تعذّر حفظ القيد');
    }
  };

  return (
    <AppShell testID="daily-screen">
      <ScreenHeader
        eyebrow="دفتر اليوم"
        title="اليومي"
        subtitle="قيودٌ يوميّة تكتبها بنفسك وتبقى على جهازك — تذكيرٌ ومعروف، لا حكمَ ولا رصيد."
      />

      {isShowcase ? (
        <ShowcaseNotice body="حقول القيد تبدأ بمثال واضح؛ لا يُحفظ شيء إلا عند ضغط الزر، وأول قيد حقيقي يستبدل قائمة العرض." />
      ) : null}

      <Section title="قيد جديد">
        <RowGroup>
          <View style={styles.form}>
            <Field label="عنوان القيد" value={title} onChangeText={setTitle} />
            <Field label="نصّ القيد" value={note} onChangeText={setNote} multiline />
            <Field label="تاريخ القيد" value={effectiveDate} onChangeText={setEffectiveDate} />
          </View>
        </RowGroup>
        <AhdButton label="احفظ القيد" onPress={save} />
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      </Section>

      {entries.length === 0 ? (
        <Section>
          <RowGroup>
            <EmptyState
              title="لا قيود بعد"
              body="أول قيدٍ تكتبه — دفعة سلّمتها، وعدٌ قطعته، معروفٌ تريد تذكّره — يظهر هنا."
            />
          </RowGroup>
        </Section>
      ) : (
        <Section title={`${isShowcase ? 'قيود تجريبية' : 'قيود هذا الجهاز'} · ${entries.length}`}>
          <RowGroup>
            {entries.map((entry) => {
              const chip = entryChip(entry);
              return (
                <View key={entry.id} style={styles.entry}>
                  <View style={styles.heading}>
                    <Text style={styles.entryTitle}>{entryTitle(entry)}</Text>
                    <StatusChip label={chip.label} tone={chip.tone} />
                  </View>
                  <Text style={styles.entryBody}>{entryBody(entry)}</Text>
                  <Text style={styles.entryMeta}>
                    {entry.effectiveDate}
                    {' · '}
                    {entry.id}
                  </Text>
                </View>
              );
            })}
          </RowGroup>
        </Section>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.x3,
    padding: spacing.x3,
  },
  field: {
    gap: spacing.x1,
  },
  label: {
    ...typography.label,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
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
  feedback: {
    ...typography.secondary,
    color: colors.waiting,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  entry: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  heading: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  entryTitle: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
    flexShrink: 1,
  },
  entryBody: {
    ...typography.secondary,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    lineHeight: 21,
    textAlign: 'right',
  },
  entryMeta: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.technical,
    writingDirection: 'ltr',
  },
});
