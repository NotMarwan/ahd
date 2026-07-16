import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AppShell,
  NettingVisual,
  RowGroup,
  ScreenHeader,
  SealChip,
  StatusChip,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { useAhdJourney } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js');

type NetworkTransfer = { from: string; to: string; amount: number };

const NETWORK_IOUS = engine.IOUS as readonly NetworkTransfer[];
const PREVIEW_SETTLEMENT = ahdCore.buildSettlement(
  NETWORK_IOUS.map((transfer) => ({
    from: transfer.from,
    to: transfer.to,
    amountMinor: engine.toMinor(transfer.amount),
  })),
);

function formatSar(amountSar: number): string {
  return ahdCore.formatMinorSar(engine.toMinor(amountSar));
}

function TransferRow({ transfer, index }: { transfer: NetworkTransfer; index: number }) {
  return (
    <View style={styles.transferRow}>
      <View style={[styles.transferThread, { backgroundColor: index % 3 === 0 ? colors.waiting : colors.accent }]} />
      <Text style={styles.row}>{transfer.to} ← {transfer.from}</Text>
      <Text style={styles.transferAmount}>{formatSar(transfer.amount)}</Text>
    </View>
  );
}

export function SettlementScreen() {
  const router = useRouter();
  const { settle, state, verifyProof } = useAhdJourney();
  const sealed = state.sealed;
  const settlement = state.settlement;
  const visualSettlement = settlement ?? PREVIEW_SETTLEMENT;

  const runSettlement = async () => {
    await settle(
      NETWORK_IOUS.map((transfer) => ({
        from: transfer.from,
        to: transfer.to,
        amountMinor: engine.toMinor(transfer.amount),
      })),
    );
  };

  const showProof = async () => {
    await verifyProof();
    router.push('/proof');
  };

  return (
    <AppShell testID="settlement-screen">
      <ScreenHeader
        eyebrow="المقاصّة · اقتراح قابل للشرح"
        title="نفكّ التشابك،"
        accentTitle="لا نقصّ الخيوط."
        subtitle="الصوافي لا تتغيّر، ولا شيء يُطبّق بلا رضا الجميع."
      />

      <NettingVisual
        testID="netting-visual"
        beforeCount={visualSettlement.beforeCount}
        afterCount={visualSettlement.afterCount}
      />

      <View style={styles.explainer}>
        <View style={styles.explainerTop}>
          <Text style={styles.explainerLabel}>المسار المقترح</Text>
          <StatusChip label={settlement ? 'محسوب محليًا' : 'معاينة محلية'} tone="active" />
        </View>
        <Text style={styles.explainerTitle}>نقلّل عدد التحويلات، ونحفظ صافي حق كل طرف.</Text>
        <Text style={styles.explainerNote}>
          {sealed
            ? 'هذه نتيجة المحرك على شبكة العهد الحالية.'
            : 'هذه شبكة الاختبار الحتمية داخل التطبيق؛ التطبيق لا يطبّقها على أشخاص حقيقيين قبل وجود عهد مختوم.'}
        </Text>
      </View>

      {!sealed ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyThread} />
          <View style={styles.emptyCopy}>
            <Text style={styles.emptyTitle}>لا يوجد عهد للمقاصّة</Text>
            <Text style={styles.emptyBody}>اختم عهدًا أولًا ثم ارجع لتشغيل المسار الحقيقي.</Text>
          </View>
          <AhdButton label="أنشئ عهدًا" onPress={() => router.push('/create')} variant="secondary" />
        </View>
      ) : !settlement ? (
        <View>
          <View style={styles.listHeading}>
            <Text style={styles.listTitle}>شبكة الالتزامات الحالية</Text>
            <Text style={styles.listCaption}>{NETWORK_IOUS.length} خيوط</Text>
          </View>
          <RowGroup>
            {NETWORK_IOUS.map((transfer, index) => (
              <TransferRow key={`${transfer.from}-${transfer.to}-${index}`} transfer={transfer} index={index} />
            ))}
          </RowGroup>
          <View style={styles.actionGap} />
          <AhdButton label="شغّل مقاصّة الشبكة" onPress={runSettlement} />
        </View>
      ) : (
        <View style={styles.resultSection}>
          <View style={styles.resultTop}>
            <StatusChip
              label={settlement.conserved ? 'المجموع محفوظ' : 'تحتاج مراجعة'}
              tone={settlement.conserved ? 'kept' : 'tamper'}
            />
            <Text style={styles.resultTitle}>
              {settlement.conserved ? 'حُفظ مجموع الالتزامات' : 'توقفت النتيجة للمراجعة'}
            </Text>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryValue}>قبل: {settlement.beforeCount} تحويلات</Text>
            <View style={styles.summaryThread} />
            <Text style={styles.summaryValue}>بعد: {settlement.afterCount} تحويل</Text>
          </View>

          <View>
            <View style={styles.listHeading}>
              <Text style={styles.listTitle}>التحويلات بعد المقاصّة</Text>
              <Text style={styles.listCaption}>اقتراح فقط</Text>
            </View>
            <RowGroup>
              {settlement.after.map((transfer, index) => (
                <View key={`${transfer.from}-${transfer.to}-${index}`} style={styles.transferRow}>
                  <View style={[styles.transferThread, { backgroundColor: colors.covenant }]} />
                  <Text style={styles.row}>{transfer.to} ← {transfer.from}</Text>
                  <Text style={styles.transferAmount}>{ahdCore.formatMinorSar(transfer.amountMinor)}</Text>
                </View>
              ))}
            </RowGroup>
          </View>

          <AhdButton label="التحقق من الإثبات" onPress={showProof} />
        </View>
      )}

      <View style={styles.consentCard}>
        <View style={styles.consentKnot}><View style={styles.consentRing} /></View>
        <View style={styles.consentCopy}>
          <Text style={styles.consentLabel}>رضا جميع الأطراف</Text>
          <Text style={styles.consentTitle}>المقترح لا يصبح نافذًا بصمت.</Text>
        </View>
        <StatusChip label="لا تغيير بعد" tone="late" />
      </View>

      <SealChip eyebrow="المحرك حتمي" label="نفس الشبكة تعطي نفس النتيجة" hash="9→2" />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  explainer: {
    padding: spacing.x3,
    borderRadius: radii.medium,
    borderRightWidth: 4,
    borderRightColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  explainerTop: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  explainerLabel: {
    ...typography.caption,
    color: colors.accent,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
  },
  explainerTitle: {
    ...typography.title,
    marginTop: spacing.x2,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  explainerNote: {
    ...typography.caption,
    marginTop: spacing.x1,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  emptyCard: {
    padding: spacing.x4,
    gap: spacing.x3,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  emptyThread: {
    width: 52,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  emptyCopy: {
    gap: spacing.x1,
  },
  emptyTitle: {
    ...typography.title,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  emptyBody: {
    ...typography.body,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  listHeading: {
    marginBottom: spacing.x2,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  listTitle: {
    ...typography.body,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
  },
  listCaption: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
  },
  transferRow: {
    minHeight: controls.rowHeight,
    paddingHorizontal: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  transferThread: {
    width: 5,
    height: 32,
    borderRadius: radii.pill,
  },
  row: {
    ...typography.sub,
    flex: 1,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  transferAmount: {
    ...typography.sub,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    fontVariant: ['tabular-nums'],
    writingDirection: 'ltr',
  },
  actionGap: {
    height: spacing.x3,
  },
  resultSection: {
    gap: spacing.x4,
  },
  resultTop: {
    gap: spacing.x2,
  },
  resultTitle: {
    ...typography.title,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  summary: {
    minHeight: 58,
    paddingHorizontal: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x2,
    borderRadius: radii.medium,
    backgroundColor: colors.accentDeep,
  },
  summaryValue: {
    ...typography.sub,
    flex: 1,
    color: colors.white,
    fontFamily: fontFamilies.body,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  summaryThread: {
    width: 3,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: colors.sealHash,
  },
  consentCard: {
    minHeight: 64,
    padding: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x3,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.covenant,
    backgroundColor: colors.covenantSoft,
  },
  consentKnot: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.seal,
  },
  consentRing: {
    width: 15,
    height: 15,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: colors.sealHash,
  },
  consentCopy: {
    flex: 1,
  },
  consentLabel: {
    ...typography.caption,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  consentTitle: {
    ...typography.sub,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
