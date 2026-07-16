import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AhdButton,
  AppShell,
  ScreenHeader,
  SealChip,
  TrustWeaveHeader,
  WeaveBand,
  type WeaveThreadTone,
} from '@/components';
import { ahdCore } from '@/core/ahd-core';
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

  const startJourney = async () => {
    await beginCreate();
    router.push('/create');
  };

  const showDaftari = async () => {
    if (!state.sealed) {
      await startJourney();
      return;
    }
    await openDaftari();
    router.push('/daftari');
  };

  const threads: readonly WeaveThreadTone[] = state.sealed
    ? ['kept', 'active', 'active', 'late', 'kept', 'active', 'active']
    : ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'];
  const activeCount = state.sealed ? '1' : '0';
  const balance = state.sealed
    ? ahdCore.formatMinorSar(state.sealed.record.amountMinor)
    : '0.00 ر.س';

  return (
    <AppShell testID="home-screen">
      <TrustWeaveHeader />

      <ScreenHeader
        eyebrow={`الرئيسية · ${state.asOf}`}
        title="المعروف بينكم"
        accentTitle="له أثرٌ محفوظ."
      />

      <WeaveBand
        testID="home-weave"
        threads={threads}
        detail={state.sealed ? 'كل خيط عهد واحد' : 'يبدأ بعد أول عهد'}
        caption={state.sealed ? 'الأزرق قائم، والذهبي وُفّي' : 'الخيوط تظهر حين تحفظ أول كلمة'}
        alert={state.sealed ? 'خيط واحد يحتاجك' : 'دفترك جديد'}
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
              <Text style={styles.balanceLabel}>لك عند الآخرين</Text>
              <Text style={styles.balanceValue}>{state.sealed ? balance : '0.00 ر.س'}</Text>
            </View>
            <View style={[styles.balanceCell, styles.balanceDivider]}>
              <Text style={styles.balanceLabel}>عليك للآخرين</Text>
              <Text style={styles.balanceValue}>0.00 ر.س</Text>
            </View>
          </View>
        </View>
        <View style={styles.nearest}>
          <View style={styles.nearestMark}>
            <View style={styles.nearestDot} />
            <Text style={styles.nearestLetter}>{state.sealed ? 'ع' : '＋'}</Text>
          </View>
          <View style={styles.nearestCopy}>
            <Text style={styles.nearestLabel}>{state.sealed ? 'الخطوة الأقرب' : 'دفترك خالٍ وواضح'}</Text>
            <Text style={styles.nearestTitle}>
              {state.sealed ? `افتح ${state.sealed.record.id} وتابع الوفاء` : 'ابدأ عهدك الأول حين تتفقون'}
            </Text>
          </View>
          <Text style={styles.nearestState}>{state.sealed ? 'قائم' : 'جاهز'}</Text>
        </View>
      </View>

      <AhdButton label="ابدأ عهدًا جديدًا" onPress={startJourney} />

      <View>
        <Text style={styles.quickLabel}>مساراتك القريبة</Text>
        <View style={styles.quickList}>
          <QuickAction label="دفتري" detail="ما لك وما عليك" tone="active" onPress={showDaftari} />
          <QuickAction label="المقاصّة" detail="أقل تحويلات، والصافي ثابت" tone="kept" onPress={() => router.push('/settle')} />
          <QuickAction label="سجل المعروف" detail="إبراء ووفاء، محفوظان" tone="late" onPress={() => router.push('/maroof')} />
        </View>
      </View>

      <SealChip
        eyebrow={state.sealed ? 'دفترك مختوم' : 'الختم ينتظر أول عهد'}
        label={state.sealed ? 'المحتوى مطابق للختم المحلي' : 'لا يوجد ختم قبل موافقة الطرفين'}
        hash={state.sealed ? `${state.sealed.seal.slice(0, 8)}…` : undefined}
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
