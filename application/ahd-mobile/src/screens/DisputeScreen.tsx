import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AhdButton, AppShell, EmptyState, RowGroup, ScreenHeader, Section, ShowcaseNotice, StatusChip } from '@/components';
import { SHOWCASE_DAILY_ENTRIES, SHOWCASE_DISPUTE_FORM, SHOWCASE_RECORDS } from '@/showcase/showcase-data';
import { useAhdJourney, usePilot } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

export function DisputeScreen() {
  const router = useRouter();
  const { openRecord, state: journey } = useAhdJourney();
  const { state: pilot, store } = usePilot();
  const storedDisputes = pilot.daily.entries.filter((entry) => entry.kind === 'dispute');
  const isRecordsShowcase = journey.records.length === 0;
  const isDisputesShowcase = storedDisputes.length === 0;
  const records = isRecordsShowcase ? SHOWCASE_RECORDS : journey.records;
  const disputes = isDisputesShowcase ? SHOWCASE_DAILY_ENTRIES.filter((entry) => entry.kind === 'dispute') : storedDisputes;
  const preferredRecordId = disputes.find((entry) => entry.kind === 'dispute')?.recordId;
  const initialRecordId = records.find((entry) => entry.sealed.record.id === preferredRecordId)?.sealed.record.id
    ?? records[0]?.sealed.record.id
    ?? '';
  const [requestedRecordId, setRequestedRecordId] = useState<string>(initialRecordId);
  const recordId = records.some((entry) => entry.sealed.record.id === requestedRecordId)
    ? requestedRecordId
    : initialRecordId;
  const [reason, setReason] = useState<string>(SHOWCASE_DISPUTE_FORM.reason);
  const [effectiveDate, setEffectiveDate] = useState<string>(SHOWCASE_DISPUTE_FORM.effectiveDate);
  const [reconciliationDate, setReconciliationDate] = useState<string>(SHOWCASE_DISPUTE_FORM.reconciliationDate);
  const [reconciliationConfirmed, setReconciliationConfirmed] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const selectedIsReal = journey.records.some((entry) => entry.sealed.record.id === recordId);

  const save = async () => {
    if (!recordId || !selectedIsReal) return;
    setFeedback(undefined);
    try {
      await store.openDispute({ recordId, reason, effectiveDate });
      setFeedback('فُتحت القضية محليًا. لم يتغيّر الختم أو المبلغ أو حالة الطرف الآخر.');
    } catch (caught) {
      setFeedback(caught instanceof Error ? caught.message : 'تعذّر فتح القضية');
    }
  };
  const showProof = async (id: string) => {
    await openRecord(id);
    router.push('/proof');
  };
  const resolve = async (id: string) => {
    if (!pilot.profile.displayName) return;
    setFeedback(undefined);
    try {
      await store.recordDisputeReconciliation(id, {
        attestedBy: pilot.profile.displayName,
        effectiveDate: reconciliationDate,
        confirmed: reconciliationConfirmed,
      });
      setFeedback('حُفظ إقرارك المحلي بأن الصلح تم خارج التطبيق. ما زال السجل يحتاج اتصالًا لمشاركته مع الطرف الآخر.');
      setReconciliationConfirmed(false);
      setReconciliationDate('');
    }
    catch (caught) { setFeedback(caught instanceof Error ? caught.message : 'تعذّر تسجيل الصلح'); }
  };

  return (
    <AppShell testID="dispute-screen">
      <ScreenHeader
        eyebrow="سجل محايد"
        title="النزاع"
        subtitle="افتح قضية على عهد حقيقي محفوظ. عهد يوثّق ولا يحكم، وفتح القضية لا يغيّر الرصيد."
      />

      <ShowcaseNotice body="حقول القضية تبدأ بمثال غير محفوظ؛ العهد الحقيقي المحدد وحده يمكن فتح قضية عليه بعد الضغط." />

      {records.length === 0 ? (
        <Section>
          <RowGroup><EmptyState title="لا يوجد عهد لفتح قضية عليه" body="يجب أن يكون السجل مختومًا ومحفوظًا أولًا." /></RowGroup>
          <AhdButton label="افتح دفتري" onPress={() => router.push('/daftari')} />
        </Section>
      ) : (
        <Section title="اختر العهد">
          <RowGroup>
            {records.map((entry) => {
              const id = entry.sealed.record.id;
              const selected = recordId === id;
              return (
                <Pressable
                  accessibilityLabel={`اختر العهد ${id}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={id}
                  onPress={() => setRequestedRecordId(id)}
                  style={[styles.record, selected && styles.recordSelected]}
                >
                  <Text style={styles.title}>{entry.sealed.record.lender} ← {entry.sealed.record.borrower}</Text>
                  <Text style={styles.id}>{id}</Text>
                </Pressable>
              );
            })}
          </RowGroup>
          <TextInput accessibilityLabel="سبب النزاع" multiline onChangeText={setReason} style={[styles.input, styles.reason]} value={reason} />
          <TextInput accessibilityLabel="تاريخ فتح النزاع" onChangeText={setEffectiveDate} placeholder="YYYY-MM-DD" style={styles.input} value={effectiveDate} />
          <AhdButton disabled={!recordId || !selectedIsReal} label={isRecordsShowcase ? "مثال غير محفوظ" : "افتح القضية محليًا"} onPress={save} />
          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
        </Section>
      )}

      {disputes.length > 0 ? (
        <Section title={`${isDisputesShowcase ? 'قضايا تجريبية' : 'قضايا محلية'} · ${disputes.length}`}>
          <RowGroup>
            {disputes.map((dispute) => (
              <View key={dispute.id} style={styles.case}>
                <View style={styles.heading}>
                  <Text style={styles.title}>{dispute.recordId}</Text>
                  <StatusChip label={isDisputesShowcase ? 'مثال غير محفوظ' : dispute.status === 'open' ? 'مفتوحة محليًا' : 'إقرار صلح محلي'} tone={dispute.status === 'open' ? 'neutral' : 'verified'} />
                </View>
                <Text style={styles.note}>{dispute.reason}</Text>
                <Text style={styles.note}>{dispute.effectiveDate}</Text>
                <Text style={styles.id}>{dispute.id}</Text>
                <Text style={styles.note}>يحتاج اتصالًا لمشاركته مع الطرف الآخر؛ لا يغيّر الختم أو الرصيد.</Text>
                {!isDisputesShowcase ? <AhdButton label="اعرض السجل المختوم" onPress={() => showProof(dispute.recordId)} variant="secondary" /> : null}
                {!isDisputesShowcase && dispute.status === 'open' && pilot.profile.displayName ? (
                  <View style={styles.reconciliation}>
                    <TextInput
                      accessibilityLabel={`تاريخ الصلح ${dispute.id}`}
                      onChangeText={setReconciliationDate}
                      placeholder="YYYY-MM-DD"
                      style={styles.input}
                      value={reconciliationDate}
                    />
                    <Pressable
                      accessibilityLabel={`أقر أن الصلح تم خارج التطبيق ${dispute.id}`}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: reconciliationConfirmed }}
                      onPress={() => setReconciliationConfirmed((value) => !value)}
                      style={styles.attestation}
                    >
                      <Text style={styles.note}>{reconciliationConfirmed ? '✓ ' : '○ '}أقر أن الصلح تم خارج التطبيق، وهذا تسجيل محلي مني فقط.</Text>
                    </Pressable>
                    <AhdButton
                      disabled={!reconciliationDate || !reconciliationConfirmed}
                      label="احفظ إقرار الصلح المحلي"
                      onPress={() => resolve(dispute.id)}
                      variant="quiet"
                    />
                  </View>
                ) : null}
              </View>
            ))}
          </RowGroup>
        </Section>
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  record: { gap: spacing.x1, padding: spacing.x3, borderWidth: 1, borderColor: colors.hairline, borderRadius: radii.card, backgroundColor: colors.ground },
  recordSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  title: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  id: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.technical, writingDirection: 'ltr' },
  input: { minHeight: controls.minTarget, paddingHorizontal: spacing.x3, paddingVertical: spacing.x2, borderWidth: 1, borderColor: colors.hairline, borderRadius: radii.card, color: colors.ink, backgroundColor: colors.ground, fontFamily: fontFamilies.body, textAlign: 'right', writingDirection: 'rtl' },
  reason: { minHeight: 92, textAlignVertical: 'top' },
  case: { gap: spacing.x2, padding: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  heading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  note: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  reconciliation: { gap: spacing.x2, paddingTop: spacing.x1 },
  attestation: { minHeight: controls.minTarget, justifyContent: 'center', paddingHorizontal: spacing.x2 },
  feedback: { ...typography.secondary, color: colors.waiting, fontFamily: fontFamilies.body, textAlign: 'right' },
});
