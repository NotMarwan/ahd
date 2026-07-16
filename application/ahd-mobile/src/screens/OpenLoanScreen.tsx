import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AppShell,
  ScreenHeader,
  SealChip,
  ThreadMeter,
  TrustWeaveHeader,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js');

type Engine = {
  respread: (totalMinor: number, count: number) => number[];
  toMinor: (sar: number) => number;
};

const AhdEngine = engine as Engine;
const PRINCIPAL_SAR = 8000;
const RESPREAD_MONTHS = 3;
const SAMPLE_PAID_MINOR = AhdEngine.toMinor(4160);

export function OpenLoanScreen() {
  const router = useRouter();
  const [showForgivenessNotice, setShowForgivenessNotice] = useState(false);
  const principalMinor = AhdEngine.toMinor(PRINCIPAL_SAR);
  const shares = AhdEngine.respread(principalMinor, RESPREAD_MONTHS);
  const remainingMinor = principalMinor - SAMPLE_PAID_MINOR;

  return (
    <AppShell testID="open-loan-screen">
      <TrustWeaveHeader onBack={() => router.back()} />

      <ScreenHeader
        eyebrow="قرض مفتوح · AH-2841"
        title="رحلة الوفاء"
        subtitle="بين طرفين، وبلا موعد يضغط أو غرامة تزيد أصل القرض."
      />

      <View style={styles.partyLine}>
        <View style={styles.partyDot}><Text style={styles.partyLetter}>س</Text></View>
        <Text style={styles.partyName}>سارة</Text>
        <View style={styles.partyThread} />
        <View style={styles.partyDot}><Text style={styles.partyLetter}>أ</Text></View>
        <Text style={styles.partyName}>أحمد</Text>
      </View>

      <View testID="open-loan-hero" style={styles.hero}>
        <Text style={styles.heroLabel}>المتبقّي من أصل 8,000.00 ر.س</Text>
        <View style={styles.amountRow}>
          <Text style={styles.amount}>{ahdCore.formatMinorSar(remainingMinor).replace(' ر.س', '')}</Text>
          <Text style={styles.currency}>ر.س</Text>
        </View>
        <ThreadMeter
          testID="repayment-thread-meter"
          progress={52}
          paidLabel="سُدّد على دفعات موثّقة"
          remainingLabel={`${ahdCore.formatMinorSar(SAMPLE_PAID_MINOR)} نُسج ذهبًا`}
        />
      </View>

      <View style={styles.lateNote}>
        <View style={styles.lateDot} />
        <Text style={styles.lateTitle}>تأخّر ودّي</Text>
        <Text style={styles.lateCopy}>بلا غرامة، أبدًا</Text>
      </View>

      <View>
        <View style={styles.ledgerHeading}>
          <Text style={styles.ledgerTitle}>الدفتر الحي</Text>
          <Text style={styles.ledgerCaption}>ما حدث · وما التالي</Text>
        </View>
        <View style={styles.ledger}>
          <View style={styles.ledgerRail} />
          <View style={styles.ledgerRow}>
            <View style={[styles.ledgerKnot, styles.knotKept]} />
            <View style={styles.ledgerCopy}>
              <Text style={styles.ledgerMain}>مختوم برضا الطرفين</Text>
              <Text style={styles.ledgerSub}>نسخة الاتفاق محفوظة محليًا</Text>
            </View>
          </View>
          {shares.map((shareMinor, index) => (
            <View key={index} style={styles.ledgerRow}>
              <View style={[styles.ledgerKnot, index === 0 ? styles.knotKept : styles.knotActive]} />
              <View style={styles.ledgerCopy}>
                <Text style={styles.ledgerMain}>القسط {index + 1}</Text>
                <Text style={styles.ledgerSub}>{ahdCore.formatMinorSar(shareMinor)} · متى ما تيسّر</Text>
              </View>
            </View>
          ))}
          <View style={styles.ledgerRow}>
            <View style={[styles.ledgerKnot, styles.knotFuture]} />
            <View style={styles.ledgerCopy}>
              <Text style={styles.ledgerMain}>الإغلاق: سداد أو إبراء</Text>
              <Text style={styles.ledgerSub}>يُحفظ المعروف عند الاكتمال</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.nextStep}>
        <Text style={styles.nextLabel}>الخطوة التالية</Text>
        <Text style={styles.nextTitle}>سجّل ما تيسّر، أو اتفقا على مهلة — الخيط يُنسج ولا يُشد.</Text>
      </View>

      <Text style={styles.note}>
        طلبُ إعادة الجدولة لا يزيد المبلغ ولا يضيف أيّ غرامة — الحاصل الجُمَعيّ محفوظٌ تمامًا (٢٬٢٨٠: نظرةٌ إلى ميسرة).
      </Text>

      <AhdButton
        label="راجع الإبراء"
        onPress={() => setShowForgivenessNotice(true)}
        variant="secondary"
        testID="open-loan-forgive"
      />
      {showForgivenessNotice ? (
        <View accessibilityLiveRegion="polite" style={styles.forgivenessNotice}>
          <Text style={styles.forgivenessTitle}>الإبراء يحتاج تأكيدًا موثقًا من صاحبة الحق</Text>
          <Text style={styles.forgivenessCopy}>لم يتغيّر الرصيد. افتحي العهد نفسه لإتمام الإبراء وختمه.</Text>
        </View>
      ) : null}

      <SealChip eyebrow="هذا العهد مختوم" label="النسخة v1 · سليمة" hash="a3f27c…" />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  partyLine: {
    minHeight: 36,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x2,
  },
  partyDot: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
  },
  partyLetter: {
    ...typography.sub,
    color: colors.accent,
    fontFamily: fontFamilies.body,
  },
  partyName: {
    ...typography.sub,
    color: colors.ink,
    fontFamily: fontFamilies.body,
  },
  partyThread: {
    width: 30,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.waiting,
  },
  hero: {
    padding: spacing.x5,
    overflow: 'hidden',
    borderRadius: radii.large,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 4,
  },
  heroLabel: {
    ...typography.sub,
    color: colors.onAccentDim,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  amountRow: {
    marginVertical: spacing.x1,
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    gap: spacing.x2,
  },
  amount: {
    fontSize: 43,
    lineHeight: 54,
    fontWeight: '800',
    color: colors.white,
    fontFamily: fontFamilies.display,
    fontVariant: ['tabular-nums'],
  },
  currency: {
    ...typography.body,
    color: colors.onAccentDim,
    fontFamily: fontFamilies.body,
  },
  lateNote: {
    minHeight: 46,
    paddingHorizontal: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x2,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.waiting,
    backgroundColor: colors.waitingSoft,
  },
  lateDot: {
    width: 9,
    height: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.waiting,
  },
  lateTitle: {
    ...typography.title,
    color: colors.waiting,
    fontFamily: fontFamilies.body,
  },
  lateCopy: {
    ...typography.caption,
    flex: 1,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'left',
  },
  ledgerHeading: {
    marginBottom: spacing.x2,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ledgerTitle: {
    ...typography.body,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
  },
  ledgerCaption: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
  },
  ledger: {
    position: 'relative',
    paddingRight: spacing.x2,
  },
  ledgerRail: {
    position: 'absolute',
    top: 18,
    bottom: 18,
    right: 14,
    width: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.accentLine,
  },
  ledgerRow: {
    minHeight: controls.rowHeight,
    paddingRight: 36,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  ledgerKnot: {
    position: 'absolute',
    right: 0,
    width: 15,
    height: 15,
    borderRadius: radii.pill,
    borderWidth: 3,
    backgroundColor: colors.card,
  },
  knotKept: {
    borderColor: colors.covenant,
    backgroundColor: colors.covenant,
  },
  knotActive: {
    borderColor: colors.accent,
  },
  knotFuture: {
    borderColor: colors.line,
  },
  ledgerCopy: {
    flex: 1,
  },
  ledgerMain: {
    ...typography.sub,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  ledgerSub: {
    ...typography.caption,
    marginTop: 2,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
  nextStep: {
    padding: spacing.x3,
    borderRadius: radii.medium,
    borderRightWidth: 4,
    borderRightColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  nextLabel: {
    ...typography.caption,
    color: colors.accent,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  nextTitle: {
    ...typography.sub,
    marginTop: spacing.x1,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  note: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  forgivenessNotice: {
    padding: spacing.x3,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.covenant,
    backgroundColor: colors.covenantSoft,
  },
  forgivenessTitle: {
    ...typography.sub,
    color: colors.verifiedText,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  forgivenessCopy: {
    ...typography.caption,
    marginTop: spacing.x1,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
