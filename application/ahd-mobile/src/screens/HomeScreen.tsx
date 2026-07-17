import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AppShell,
  ScreenHeader,
  SealChip,
  ShowcaseNotice,
  WeaveBand,
  type WeaveThreadTone,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { SHOWCASE_HOME, SHOWCASE_RECORDS } from '@/showcase/showcase-data';
import { useAhdJourney } from '@/state';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';

type QuickActionProps = {
  readonly label: string;
  readonly detail: string;
  readonly tone: 'active' | 'kept' | 'late';
  readonly onPress: () => void;
};

const QUICK_TONE = {
  active: colors.accent,
  kept: colors.covenant,
  late: colors.waiting,
} as const;

function QuickAction({ label, detail, tone, onPress }: QuickActionProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={controls.hitSlop}
      onPress={onPress}
      style={styles.quickRow}
    >
      <View style={[styles.quickThread, { backgroundColor: QUICK_TONE[tone] }]} />
      <View style={styles.quickCopy}>
        <Text style={styles.quickTitle}>{label}</Text>
        <Text style={styles.quickDetail}>{detail}</Text>
      </View>
      <Text accessibilityElementsHidden style={styles.quickArrow}>←</Text>
    </Pressable>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const { beginCreate, openDaftari, state } = useAhdJourney();
  const realRecords = state.records;
  const isShowcase = realRecords.length === 0;
  const records = isShowcase ? SHOWCASE_RECORDS : realRecords;
  const activeEntry = isShowcase
    ? records.find((entry) => entry.sealed.record.id === SHOWCASE_HOME.urgentRecordId)
    : records.find((entry) => entry.sealed.record.id === state.activeRecordId) ?? records[records.length - 1];

  const startJourney = async () => {
    await beginCreate();
    router.push('/create');
  };

  const showDaftari = async () => {
    if (realRecords.length === 0) {
      router.push('/daftari');
      return;
    }
    await openDaftari();
    router.push('/daftari');
  };

  const threads: readonly WeaveThreadTone[] = Array.from({ length: 7 }, (_, index) => (
    index < records.length ? 'active' : 'empty'
  ));
  const activeCount = String(records.length);
  const totalMinor = realRecords.reduce((total, entry) => total + entry.sealed.record.amountMinor, 0);
  const primaryBalance = ahdCore.formatMinorSar(isShowcase ? SHOWCASE_HOME.receivableMinor : totalMinor);
  const secondaryBalance = isShowcase
    ? ahdCore.formatMinorSar(SHOWCASE_HOME.payableMinor)
    : activeCount;

  return (
    <AppShell testID="home-screen">
      <ScreenHeader
        eyebrow={`الرئيسية · ${state.asOf}`}
        title="المعروف بينكم"
        accentTitle="له أثرٌ محفوظ."
      />

      {isShowcase ? (
        <ShowcaseNotice body="قصة جاهزة من نسخة الويب آب للعرض فقط؛ لا تُضاف إلى دفتر جهازك." />
      ) : null}

      <WeaveBand
        testID="home-weave"
        threads={threads}
        detail={isShowcase ? '7 خيوط تشرح حالات العهود' : 'كل خيط عهد محفوظ'}
        caption={isShowcase ? 'الأزرق قائم، والذهب وفاء، والكهرمان تأخر' : 'الأزرق عهد قائم وموثّق محليًا'}
        alert={isShowcase ? 'مثال غير محفوظ' : `${records.length} في دفترك`}
      />

      <View testID="home-balance-board" style={styles.board}>
        <View style={styles.boardHero}>
          <View style={styles.boardTop}>
            <View style={styles.boardCopy}>
              <Text style={styles.boardLabel}>دفتر العهود</Text>
              <Text style={styles.boardTitle}>كل ما بينكم، في مكان واضح</Text>
            </View>
            <View style={styles.countBox}>
              <Text style={styles.count}>{activeCount}</Text>
              <Text style={styles.countLabel}>عهود نشطة</Text>
            </View>
          </View>
          <View style={styles.balances}>
            <View style={styles.balanceCell}>
              <Text style={styles.balanceLabel}>{isShowcase ? 'لك في الدفتر' : 'إجمالي الأصل الموثّق'}</Text>
              <Text style={styles.balanceValue}>{primaryBalance}</Text>
            </View>
            <View style={[styles.balanceCell, styles.balanceDivider]}>
              <Text style={styles.balanceLabel}>{isShowcase ? 'عليك' : 'سجلات محفوظة محليًا'}</Text>
              <Text style={styles.balanceValue}>{secondaryBalance}</Text>
            </View>
          </View>
        </View>
        <View style={styles.nearest}>
          <View style={styles.nearestMark}>
            <View style={styles.nearestDot} />
            <Text style={styles.nearestLetter}>{activeEntry ? 'ع' : '＋'}</Text>
          </View>
          <View style={styles.nearestCopy}>
            <Text style={styles.nearestLabel}>{isShowcase ? 'الأكثر إلحاحًا' : activeEntry ? 'آخر عهد محفوظ' : 'دفترك خالٍ وواضح'}</Text>
            <Text style={styles.nearestTitle}>
              {isShowcase && activeEntry
                ? `${activeEntry.sealed.record.borrower} · ${ahdCore.formatMinorSar(activeEntry.sealed.record.amountMinor)} · متأخر ${SHOWCASE_HOME.urgentDaysLate} يومًا`
                : activeEntry ? `افتح ${activeEntry.sealed.record.id} وراجع تفاصيله` : 'ابدأ عهدك الأول حين تتفقون'}
            </Text>
          </View>
          <Text style={styles.nearestState}>{isShowcase ? 'متأخر' : activeEntry ? 'محفوظ' : 'جاهز'}</Text>
        </View>
      </View>

      <AhdButton label="ابدأ عهدًا جديدًا" onPress={startJourney} />

      <View>
        <Text style={styles.quickLabel}>مساراتك القريبة</Text>
        <View style={styles.quickList}>
          <QuickAction label="دفتري" detail="ما لك وما عليك" tone="active" onPress={showDaftari} />
          <QuickAction label="التسوية" detail="أقل تحويلات، والصافي ثابت" tone="kept" onPress={() => router.push('/settle')} />
          <QuickAction label="سجل المعروف" detail="إبراء ووفاء، محفوظان" tone="late" onPress={() => router.push('/maroof')} />
        </View>
      </View>

      <SealChip
        eyebrow={isShowcase ? 'ختم تجريبي' : activeEntry ? 'دفترك مختوم' : 'الختم ينتظر أول عهد'}
        label={isShowcase ? 'المثال مطابق للختم، وغير محفوظ على جهازك' : activeEntry ? 'المحتوى مطابق للختم المحلي' : 'لا يوجد ختم قبل موافقة الطرفين'}
        hash={activeEntry ? `${activeEntry.sealed.seal.slice(0, 8)}…` : undefined}
      />

      <Text style={styles.footnote}>
        عهد يشهد على الاتفاق ومسار الوفاء؛ لا يقرض، ولا يحكم، ولا يضيف فائدة أو غرامة.
      </Text>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  board: {
    overflow: 'hidden',
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.accentLine,
    backgroundColor: colors.card,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  boardHero: {
    padding: spacing.x4,
    backgroundColor: colors.accent,
  },
  boardTop: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.x3,
  },
  boardCopy: {
    flex: 1,
  },
  boardLabel: {
    ...typography.caption,
    color: colors.onAccentDim,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  boardTitle: {
    ...typography.body,
    marginTop: spacing.x1,
    color: colors.white,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
    textAlign: 'right',
  },
  countBox: {
    minWidth: 76,
    paddingRight: spacing.x3,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.24)',
    alignItems: 'flex-start',
  },
  count: {
    ...typography.amount,
    color: colors.white,
    fontFamily: fontFamilies.display,
    fontVariant: ['tabular-nums'],
  },
  countLabel: {
    ...typography.caption,
    color: colors.onAccentDim,
    fontFamily: fontFamilies.body,
  },
  balances: {
    marginTop: spacing.x3,
    paddingTop: spacing.x3,
    flexDirection: 'row-reverse',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.22)',
  },
  balanceCell: {
    flex: 1,
  },
  balanceDivider: {
    paddingRight: spacing.x3,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.22)',
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.onAccentDim,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  balanceValue: {
    ...typography.title,
    marginTop: spacing.x1,
    color: colors.white,
    fontFamily: fontFamilies.body,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
  nearest: {
    minHeight: controls.rowHeight,
    padding: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x3,
  },
  nearestMark: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.small,
    backgroundColor: colors.waitingSoft,
  },
  nearestDot: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 9,
    height: 9,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.card,
    backgroundColor: colors.waiting,
  },
  nearestLetter: {
    ...typography.title,
    color: colors.waiting,
    fontFamily: fontFamilies.body,
  },
  nearestCopy: {
    flex: 1,
  },
  nearestLabel: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  nearestTitle: {
    ...typography.sub,
    marginTop: 2,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  nearestState: {
    ...typography.caption,
    color: colors.waiting,
    fontFamily: fontFamilies.body,
    fontWeight: '700',
  },
  quickLabel: {
    ...typography.caption,
    marginBottom: spacing.x2,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  quickList: {
    overflow: 'hidden',
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  quickRow: {
    minHeight: controls.rowHeight,
    paddingHorizontal: spacing.x3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  quickThread: {
    width: 5,
    height: 32,
    borderRadius: radii.pill,
  },
  quickCopy: {
    flex: 1,
  },
  quickTitle: {
    ...typography.sub,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  quickDetail: {
    ...typography.caption,
    marginTop: 2,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  quickArrow: {
    ...typography.body,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
  },
  footnote: {
    ...typography.caption,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
