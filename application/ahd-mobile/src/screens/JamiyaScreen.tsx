import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
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
import {
  SHOWCASE_CIRCLE,
  SHOWCASE_JAMIYA_FORM,
  SHOWCASE_PROFILE_NAME,
} from '@/showcase/showcase-data';
import { usePilot, type PilotCircle } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

function currentRound(circle: PilotCircle): number | null {
  for (let round = 1; round <= circle.members.length; round += 1) {
    if (circle.members.some((member) => !circle.payments.some((payment) => (
      payment.round === round && payment.memberId === member.id
    )))) return round;
  }
  return null;
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText(value: string): void;
  keyboardType?: 'default' | 'decimal-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

function CircleSummary({ circle, showcase = false }: { circle: PilotCircle; showcase?: boolean }) {
  return (
    <>
      <Section title={showcase ? `${circle.title} · عرض النتيجة` : circle.title}>
        <RowGroup>
          <View style={styles.card}>
            <View style={styles.heading}>
              <Text style={styles.title}>{circle.organizer}</Text>
              <StatusChip
                label={showcase ? 'مثال غير محفوظ' : circle.status === 'draft' ? 'بانتظار الموافقات' : circle.status === 'active' ? 'نشطة محليًا' : 'مكتملة'}
                tone={circle.status === 'complete' ? 'verified' : 'covenant'}
              />
            </View>
            <Text style={styles.meta}>البداية {circle.startMonth} · {circle.members.length} أعضاء</Text>
            <Text style={styles.meta}>الحصة {ahdCore.formatMinorSar(circle.members[0].shareMinor)}</Text>
            <Text style={styles.id}>{circle.id}</Text>
          </View>
        </RowGroup>
      </Section>
      <Section title="ترتيب الاستلام والموافقات">
        <RowGroup>
          {circle.orderMemberIds.map((memberId, index) => {
            const member = circle.members.find((item) => item.id === memberId)!;
            const paid = circle.payments.some((payment) => payment.round === 1 && payment.memberId === member.id);
            return (
              <View key={member.id} style={styles.member}>
                <View style={styles.heading}>
                  <Text style={styles.title}>{index + 1}. {member.displayName}</Text>
                  <StatusChip label={showcase ? 'مثال الجولة' : paid ? 'دفعة مسجّلة' : 'جاهز للدورة'} tone={paid ? 'verified' : 'neutral'} />
                </View>
                <Text style={styles.meta}>{showcase ? 'موافقة تجريبية للعرض' : member.consentAttestation ? 'إقرار المنظّم محفوظ' : 'بانتظار إقرار المنظّم'}</Text>
              </View>
            );
          })}
        </RowGroup>
      </Section>
    </>
  );
}

export function JamiyaScreen() {
  const router = useRouter();
  const { state, store } = usePilot();
  const displayName = state.profile.displayName;
  const circle = state.jamiya.circles.find((item) => item.id === state.jamiya.activeCircleId)
    ?? state.jamiya.circles.at(-1);
  const showcaseMembersText = SHOWCASE_CIRCLE.members
    .map((member) => member.displayName)
    .filter((name) => name !== (displayName ?? SHOWCASE_PROFILE_NAME))
    .slice(0, 4)
    .join('، ');
  const [title, setTitle] = useState<string>(SHOWCASE_JAMIYA_FORM.title);
  const [displayNameDraft, setDisplayNameDraft] = useState<string>(SHOWCASE_PROFILE_NAME);
  const [startMonth, setStartMonth] = useState<string>(SHOWCASE_JAMIYA_FORM.startMonth);
  const [amountText, setAmountText] = useState<string>(SHOWCASE_JAMIYA_FORM.amountText);
  const [membersText, setMembersText] = useState<string>(showcaseMembersText);
  const [consentDate, setConsentDate] = useState<string>(SHOWCASE_JAMIYA_FORM.consentDate);
  const [paymentDate, setPaymentDate] = useState<string>(SHOWCASE_JAMIYA_FORM.paymentDate);
  const [error, setError] = useState<string>();

  useEffect(() => { setMembersText(showcaseMembersText); }, [showcaseMembersText]);

  const round = circle ? currentRound(circle) : null;
  const recipient = circle && round
    ? circle.members.find((member) => member.id === circle.orderMemberIds[round - 1])
    : undefined;
  const memberNames = useMemo(() => membersText
    .split(/[،,\n]/)
    .map((name) => name.trim())
    .filter(Boolean), [membersText]);

  const saveDisplayName = async () => {
    setError(undefined);
    try { await store.setDisplayName(displayNameDraft); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'تعذّر حفظ اسم العرض'); }
  };

  const createCircle = async () => {
    setError(undefined);
    if (!displayName) return;
    try {
      const amountMinor = ahdCore.parseSarTextToMinor(amountText);
      const names = [displayName, ...memberNames.filter((name) => name !== displayName)];
      await store.createCircle({
        kind: 'jamiya',
        title,
        organizer: displayName,
        startMonth,
        members: names.map((name) => ({ displayName: name, shareMinor: amountMinor })),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذّر إنشاء الجمعية');
    }
  };

  const recordConsent = async (memberId: string) => {
    if (!circle || !displayName) return;
    setError(undefined);
    try {
      await store.recordCircleConsentAttestation(circle.id, memberId, {
        recordedBy: displayName,
        effectiveDate: consentDate,
        confirmed: true,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذّر حفظ الموافقة');
    }
  };

  const activate = async () => {
    if (!circle) return;
    setError(undefined);
    try { await store.activateCircle(circle.id); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'تعذّر تفعيل الجمعية'); }
  };

  const recordPayment = async (memberId: string) => {
    if (!circle || !round) return;
    setError(undefined);
    try { await store.recordCirclePayment(circle.id, round, memberId, paymentDate); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'تعذّر حفظ الدفعة'); }
  };

  return (
    <AppShell testID="jamiya-screen">
      <ScreenHeader
        eyebrow="دائرة محلية"
        title="الجمعية"
        subtitle="ترتيب وموافقات ودفعات محفوظة على جهازك. لا يحتفظ عهد بالأموال ولا ينقلها."
      />

      {!circle || circle.status !== 'complete' ? (
        <ShowcaseNotice body={!circle
          ? 'جمعية من خمسة أشخاص بموافقات ودفعات ثابتة للعرض فقط؛ لا تُضاف إلى جهازك.'
          : 'حقول التاريخ تبدأ بأمثلة؛ بيانات الجمعية نفسها محلية ولا يُحفظ تغيير قبل الضغط.'} />
      ) : null}

      {!displayName ? (
        <Section title="ابدأ باسم عرض">
          <RowGroup><EmptyState title="حدّد اسم العرض" body="المثال أدناه جاهز، واحفظ الاسم فقط عندما تريد إنشاء جمعية حقيقية." /></RowGroup>
          <Field label="اسم العرض المحلي" value={displayNameDraft} onChangeText={setDisplayNameDraft} />
          <AhdButton disabled={!displayNameDraft.trim()} label="احفظ اسم العرض" onPress={saveDisplayName} />
          <AhdButton label="افتح الإعدادات" onPress={() => router.push('/settings')} variant="quiet" />
        </Section>
      ) : null}

      {!circle ? (
        <>
          <Section title="أنشئ جمعية">
            <RowGroup>
              <View style={styles.form}>
                <Field label="اسم الجمعية" value={title} onChangeText={setTitle} />
                <Field label="شهر البداية" value={startMonth} onChangeText={setStartMonth} />
                <Field label="حصة كل عضو بالريال" value={amountText} onChangeText={setAmountText} keyboardType="decimal-pad" />
                <Field label="أسماء الأعضاء الآخرين" value={membersText} onChangeText={setMembersText} />
                <Text style={styles.help}>افصل الأسماء بفاصلة. يلزم عضو آخر على الأقل، وبحد أقصى خمسة أعضاء.</Text>
              </View>
            </RowGroup>
            <AhdButton disabled={!displayName} label={displayName ? 'احفظ مسودة الجمعية' : 'احفظ اسم العرض أولًا'} onPress={createCircle} />
          </Section>
          <CircleSummary circle={SHOWCASE_CIRCLE} showcase />
        </>
      ) : (
        <>
          <CircleSummary circle={circle} />
          {circle.status === 'draft' ? (
            <Section title="إقرارات المنظّم">
              <View style={styles.attestationNotice}>
                <Text style={styles.help}>هذه إقرارات من المنظّم بأنه استلم الموافقات خارج التطبيق؛ ليست قبولًا رقميًا باسم أي عضو.</Text>
                <Field label="تاريخ استلام الموافقات" value={consentDate} onChangeText={setConsentDate} />
              </View>
              {circle.members.filter((member) => !member.consentAttestation).map((member) => (
                <AhdButton
                  key={member.id}
                  disabled={!consentDate}
                  label={`أقرّ أنني استلمت موافقة ${member.displayName}`}
                  onPress={() => recordConsent(member.id)}
                  variant="quiet"
                />
              ))}
              <AhdButton
                disabled={circle.members.some((member) => !member.consentAttestation)}
                label="فعّل الجمعية بعد إقرارات المنظّم"
                onPress={activate}
              />
            </Section>
          ) : null}
          {circle.status === 'active' && round ? (
            <Section title={`الجولة ${round} · المستفيد ${recipient?.displayName ?? ''}`}>
              <Field label="تاريخ تسجيل الدفعة" value={paymentDate} onChangeText={setPaymentDate} />
              <RowGroup>
                {circle.members.map((member) => {
                  const paid = circle.payments.some((payment) => payment.round === round && payment.memberId === member.id);
                  return (
                    <View key={member.id} style={styles.member}>
                      <View style={styles.heading}>
                        <Text style={styles.title}>{member.displayName}</Text>
                        <StatusChip label={paid ? 'مسجّلة' : 'لم تُسجّل'} tone={paid ? 'verified' : 'neutral'} />
                      </View>
                      {!paid ? <AhdButton label={`سجّل دفعة ${member.displayName}`} onPress={() => recordPayment(member.id)} variant="quiet" /> : null}
                    </View>
                  );
                })}
              </RowGroup>
            </Section>
          ) : null}
          <AhdButton label="افتح تفاصيل الدائرة" onPress={() => router.push('/circle')} variant="secondary" />
        </>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.x3, padding: spacing.x3 },
  field: { gap: spacing.x1 },
  label: { ...typography.label, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  input: { minHeight: controls.minTarget, paddingHorizontal: spacing.x3, paddingVertical: spacing.x2, color: colors.ink, backgroundColor: colors.ground, borderWidth: 1, borderColor: colors.hairline, borderRadius: radii.card, fontFamily: fontFamilies.body, fontSize: 16, textAlign: 'right', writingDirection: 'rtl' },
  help: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  attestationNotice: { gap: spacing.x2, paddingBottom: spacing.x3 },
  card: { gap: spacing.x1, padding: spacing.x3 },
  member: { gap: spacing.x2, padding: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  heading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.x2 },
  title: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  meta: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  id: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.technical, writingDirection: 'ltr' },
  error: { ...typography.secondary, color: colors.waiting, fontFamily: fontFamilies.body, textAlign: 'right' },
});
