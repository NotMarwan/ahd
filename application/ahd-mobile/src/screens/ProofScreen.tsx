import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AhdButton,
  AppShell,
  EmptyState,
  RowGroup,
  ScreenHeader,
  SealedDocument,
  Section,
  StatusChip,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import {
  createShareEnvelope,
  serializeShareEnvelope,
  shareEnvelopeText,
  verifyAttachedProof,
  type ShareEnvelopeResult,
} from '@/share';
import { useAhdJourney } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

function ImportResult({ result }: { result: ShareEnvelopeResult }) {
  const presentation = result.status === 'verified'
    ? { label: 'مطابق', tone: 'verified' as const, title: 'السجل مطابق للإثبات المرفق' }
    : result.status === 'tampered'
      ? { label: 'عبث مكتشف', tone: 'tamper' as const, title: 'توقّف الاستيراد: المحتوى لا يطابق الإثبات' }
      : result.status === 'unsupported'
        ? { label: 'نسخة غير مدعومة', tone: 'neutral' as const, title: 'لم يُستورد السجل' }
        : { label: 'ملف غير صالح', tone: 'late' as const, title: 'تعذّر قراءة السجل' };
  return (
    <View accessibilityLiveRegion="polite" style={styles.importResult}>
      <StatusChip label={presentation.label} tone={presentation.tone} />
      <Text style={styles.importTitle}>{presentation.title}</Text>
      {result.status === 'verified' ? (
        <>
          <Text style={styles.importMeta}>{result.record.id}</Text>
          <Text style={styles.importAmount}>{ahdCore.formatMinorSar(result.record.amountMinor)}</Text>
          <Text style={styles.importNote}>حُفظ ضمن السجلات المستوردة للقراءة فقط، ولم يدخل الرصيد أو المقاصّة.</Text>
        </>
      ) : null}
    </View>
  );
}

export function ProofScreen() {
  const { importSharedRecord, requestExternal, state, verifyProof } = useAhdJourney();
  const [shareFeedback, setShareFeedback] = useState<string>();
  const [importText, setImportText] = useState('');
  const [importResult, setImportResult] = useState<ShareEnvelopeResult>();
  const sealed = state.sealed;
  const proof = state.proof;
  const verification = sealed && proof ? verifyAttachedProof(sealed.record, proof) : undefined;

  const shareRecord = async () => {
    if (!sealed || !proof) return;
    const envelope = createShareEnvelope({
      record: sealed.record,
      proof,
      exportedAt: sealed.prepared.sourceDraft.timestamp,
    });
    const result = await shareEnvelopeText(serializeShareEnvelope(envelope));
    setShareFeedback(result === 'opened' ? 'فُتحت المشاركة' : 'أُغلقت المشاركة بلا إرسال');
  };
  const verifyImport = async () => {
    const result = await importSharedRecord(importText.trim());
    setImportResult(result);
  };

  return (
    <AppShell testID="proof-screen">
      <ScreenHeader
        eyebrow="ShareEnvelopeV1"
        title="تحقّق، ثم شارك."
        subtitle="الإثبات محلي وحتمي؛ الاستيراد يكشف تغيّر المحتوى قبل حفظه."
      />

      {!sealed ? (
        <Section title="إثبات هذا الجهاز">
          <RowGroup>
            <EmptyState title="لا يوجد عهد محلي" body="يمكنك مع ذلك لصق سجل مشترك والتحقق منه أدناه." />
          </RowGroup>
        </Section>
      ) : !verification || !proof ? (
        <Section title="إثبات هذا الجهاز">
          <AhdButton label="تحقق من الختم" onPress={verifyProof} />
        </Section>
      ) : (
        <Section title="إثبات هذا الجهاز">
          <View style={styles.verdictRow}>
            <StatusChip
              label={verification.ok ? 'مطابق' : 'عبث مكتشف'}
              tone={verification.ok ? 'verified' : 'tamper'}
            />
            <Text style={[styles.verdict, !verification.ok && styles.tampered]} testID="proof-verdict">
              {verification.ok ? 'الختم مطابق للسجل' : 'الختم لا يطابق السجل المرفق'}
            </Text>
          </View>
          <SealedDocument
            title="إثبات العهد"
            verdict={verification.ok ? 'تم التحقق محليًا' : 'توقف التحقق'}
            technicalDetails={`contentHash: ${verification.contentHash}\nseal: ${verification.sealed}\nrecomputed: ${verification.recomputed}`}
          />
          <AhdButton
            label="شارك السجل المختوم"
            onPress={shareRecord}
            disabled={!verification.ok}
          />
          {shareFeedback ? <Text style={styles.feedback}>{shareFeedback}</Text> : null}
          <AhdButton
            label="طلب إثبات خارجي"
            onPress={() => requestExternal('external_evidence')}
            variant="secondary"
          />
          {state.connection?.status === 'needs_connection' ? (
            <Text style={styles.connection}>يتطلب اتصالًا بالخدمة الخارجية؛ لم يتغيّر السجل أو الرصيد.</Text>
          ) : null}
        </Section>
      )}

      <Section title={`استيراد سجل · ${state.imports.length} محفوظ`}>
        <Text style={styles.help}>الصق النص كاملًا. لن يُحفظ إلا إذا طابق السجل إثباته المرفق.</Text>
        <TextInput
          accessibilityLabel="بيانات السجل المشترك"
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          onChangeText={setImportText}
          placeholder="{&quot;format&quot;:&quot;ShareEnvelopeV1&quot;,…}"
          style={styles.input}
          textAlignVertical="top"
          value={importText}
        />
        <AhdButton
          label="تحقق من السجل المستورد"
          onPress={verifyImport}
          disabled={importText.trim().length === 0}
          variant="secondary"
        />
        {importResult ? <ImportResult result={importResult} /> : null}
      </Section>

      <View style={styles.limitCard}>
        <Text style={styles.limitTitle}>حدود التحقق</Text>
        <Text style={styles.limitText}>يثبت تطابق الملف مع إثباته المرفق، ولا يثبت هوية المرسل أو توقيع جهة خارجية.</Text>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  verdictRow: { gap: spacing.x2 },
  verdict: { ...typography.row, color: colors.verifiedText, fontFamily: fontFamilies.body, textAlign: 'right' },
  tampered: { color: colors.tamper },
  feedback: { ...typography.secondary, color: colors.verifiedText, fontFamily: fontFamilies.body, textAlign: 'right' },
  connection: { ...typography.secondary, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  help: { ...typography.body, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  input: {
    minHeight: 132,
    padding: spacing.x3,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cardSecondary,
    color: colors.ink,
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    lineHeight: 18,
    writingDirection: 'ltr',
  },
  importResult: {
    minHeight: controls.rowHeight,
    padding: spacing.x3,
    gap: spacing.x2,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  importTitle: { ...typography.sub, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  importMeta: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.technical, writingDirection: 'ltr' },
  importAmount: { ...typography.title, color: colors.ink, fontFamily: fontFamilies.display, writingDirection: 'ltr' },
  importNote: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  limitCard: {
    padding: spacing.x3,
    gap: spacing.x1,
    borderRadius: radii.medium,
    backgroundColor: colors.waitingSoft,
  },
  limitTitle: { ...typography.sub, color: colors.waiting, fontFamily: fontFamilies.body, textAlign: 'right' },
  limitText: { ...typography.body, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
});
