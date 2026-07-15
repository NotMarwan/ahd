import { StyleSheet, Text } from 'react-native';

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
import { useAhdJourney } from '@/state';
import { colors, fontFamilies, typography } from '@/theme';

export function ProofScreen() {
  const { requestExternal, state, verifyProof } = useAhdJourney();
  const verification = state.proofVerification;

  return (
    <AppShell testID="proof-screen">
      <ScreenHeader
        title="تحقق مستقلًا من العهد"
        subtitle="النتيجة الأساسية ظاهرة، والتفاصيل التقنية تفتح عند الحاجة."
      />

      {!state.sealed ? (
        <RowGroup>
          <EmptyState title="لا يوجد إثبات" body="يُنشأ الإثبات بعد ختم العهد." />
        </RowGroup>
      ) : !verification || !state.proof ? (
        <Section>
          <AhdButton label="تحقق من الختم" onPress={verifyProof} />
        </Section>
      ) : (
        <Section title="نتيجة التحقق">
          <StatusChip
            label={verification.ok ? 'مطابق' : 'غير مطابق'}
            tone={verification.ok ? 'verified' : 'stopped'}
          />
          <Text style={styles.verdict}>
            {verification.ok ? 'الختم مطابق للسجل' : 'الختم لا يطابق السجل'}
          </Text>
          <SealedDocument
            title="إثبات العهد"
            verdict={verification.ok ? 'تم التحقق محليًا' : 'توقف التحقق'}
            technicalDetails={`contentHash: ${verification.contentHash}\nseal: ${verification.sealed}\nrecomputed: ${verification.recomputed}`}
          />
          <AhdButton
            label="طلب إثبات خارجي"
            onPress={() => requestExternal('external_evidence')}
            variant="secondary"
          />
          {state.connection?.status === 'needs_connection' ? (
            <Text style={styles.connection}>يتطلب اتصالًا بالخدمة الخارجية</Text>
          ) : null}
        </Section>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  verdict: {
    ...typography.row,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  connection: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
