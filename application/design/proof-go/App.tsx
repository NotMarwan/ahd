// Ahd device proof — throwaway app, NOT product code.
// Tokens copied from application/design/tokens.json (source of truth).
// Exercises RN-MAPPING rows 1 (sadu band), 3 (gauge arc), 4 (counting number),
// 5 (muqassa stagger on SVG), 6 (hairline separators), 9 (dashed border).
import { useEffect, useState } from 'react';
import { I18nManager, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Line, Pattern, Path, Rect } from 'react-native-svg';
import Animated, {
  Easing, useAnimatedProps, useSharedValue, withDelay, withTiming,
} from 'react-native-reanimated';

const C = {
  ground: '#efe9dc', card: '#ffffff', ink: '#1c1812', ink2: '#6d6353',
  accent: '#a1442e', ok: '#177f6d', okText: '#116153', track: '#e2d7c0',
};

const ACircle = Animated.createAnimatedComponent(Circle);
const ALine = Animated.createAnimatedComponent(Line);

function SaduBand() {
  // row 1: repeating pattern via SVG <Pattern>
  return (
    <Svg width="100%" height={10}>
      <Defs>
        <Pattern id="sadu" width={10} height={10} patternUnits="userSpaceOnUse">
          <Rect width={10} height={10} fill={C.track} />
          <Path d="M0,10 L5,0 L10,10 Z" fill={C.accent} opacity={0.9} />
          <Path d="M0,0 L5,10 L10,0 Z" fill={C.ink} opacity={0.35} />
        </Pattern>
      </Defs>
      <Rect width="100%" height={10} rx={3} fill="url(#sadu)" />
    </Svg>
  );
}

function Gauge() {
  // row 3: arc sweep via animated strokeDashoffset
  const r = 26, circ = 2 * Math.PI * r;
  const p = useSharedValue(0);
  useEffect(() => { p.value = withTiming(0.75, { duration: 900, easing: Easing.out(Easing.cubic) }); }, []);
  const props = useAnimatedProps(() => ({ strokeDashoffset: circ * (1 - p.value) }));
  return (
    <Svg width={64} height={64}>
      <Circle cx={32} cy={32} r={r} stroke={C.track} strokeWidth={8} fill="none" />
      <ACircle cx={32} cy={32} r={r} stroke={C.ok} strokeWidth={8} fill="none"
        strokeDasharray={`${circ}`} animatedProps={props} strokeLinecap="round"
        transform="rotate(-90 32 32)" />
    </Svg>
  );
}

function CountUp() {
  // row 4: counting number, tabular figures
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = Date.now(); // throwaway proof app — determinism rule applies to product logic only
    const id = setInterval(() => {
      const k = Math.min(1, (Date.now() - t0) / 1100);
      setN(Math.round(2200 * (1 - Math.pow(1 - k, 3))));
      if (k >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, []);
  return <Text style={s.big}>{n.toLocaleString('en-US')} ريال</Text>;
}

const NODES = [[80, 12], [140, 40], [122, 96], [38, 96], [20, 40]] as const;
const EDGES = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [1, 3], [2, 4], [2, 3], [3, 4]] as const;

function TangleLine({ a, b, i }: { a: number; b: number; i: number }) {
  const v = useSharedValue(0.5);
  useEffect(() => { v.value = withDelay(300 + i * 200, withTiming(0.06, { duration: 400 })); }, []);
  const props = useAnimatedProps(() => ({ opacity: v.value }));
  return <ALine x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke={C.accent} strokeWidth={1.5} animatedProps={props} />;
}

function TransferLine({ a, b, i }: { a: number; b: number; i: number }) {
  const v = useSharedValue(0);
  useEffect(() => { v.value = withDelay(2300 + i * 300, withTiming(1, { duration: 700 })); }, []);
  const props = useAnimatedProps(() => ({ opacity: v.value }));
  return <ALine x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke={C.ok} strokeWidth={5} strokeLinecap="round" animatedProps={props} />;
}

function Muqassa() {
  // row 5: 9 lines fade out staggered, 2 teal transfers draw in
  return (
    <Svg width={160} height={110}>
      {EDGES.map(([a, b], i) => <TangleLine key={i} a={a} b={b} i={i} />)}
      <TransferLine a={0} b={1} i={0} />
      <TransferLine a={0} b={2} i={1} />
      {NODES.map(([x, y], i) => <Circle key={'n' + i} cx={x} cy={y} r={8} fill={i === 0 ? '#a8863f' : i <= 2 ? C.ok : '#b9ac95'} />)}
    </Svg>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.root}>
        <Text style={s.h1}>عهد — إثبات الجهاز</Text>
        <SaduBand />
        <View style={s.row}>
          <Gauge />
          <View style={{ flex: 1 }}>
            <Text style={s.lbl}>٤ · العدّاد يصعد إلى 2,200</Text>
            <CountUp />
          </View>
        </View>
        <View style={s.card}>
          {['١ · شريط السدو ظاهر ومتكرّر', '٣ · الحلقة اكتملت ثلاثة أرباع', '٦ · الفواصل شعريّة الرفع'].map((t, i) => (
            <View key={t} style={[s.cell, i > 0 && s.hair]}><Text style={s.cellT}>{t}</Text></View>
          ))}
          <View style={[s.cell, s.dashed]}><Text style={s.cellT}>٩ · هذا الصفّ بحدٍّ متقطّع</Text></View>
        </View>
        <View style={[s.card, { paddingVertical: 10 }]}>
          <Text style={s.lbl}>٥ · تسعة خيوط تذوب ويبقى تحويلان</Text>
          <Muqassa />
        </View>
        <Text style={s.foot}>RTL: {I18nManager.isRTL ? 'مفعّل' : 'غير مفعّل (مقبول في الإثبات)'} · كلّ بندٍ يعمل = PASS</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.ground, padding: 16, gap: 14 },
  h1: { fontSize: 26, fontWeight: '800', color: C.ink, textAlign: 'right' },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 14 },
  lbl: { fontSize: 12, color: C.ink2, textAlign: 'right', alignSelf: 'stretch' },
  big: { fontSize: 30, fontWeight: '800', color: C.ink, textAlign: 'right', fontVariant: ['tabular-nums'] },
  card: { backgroundColor: C.card, borderRadius: 14, paddingHorizontal: 14, alignItems: 'center' },
  cell: { minHeight: 48, justifyContent: 'center', alignSelf: 'stretch' },
  hair: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(60,50,30,0.3)' },
  dashed: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.accent, borderRadius: 10, marginVertical: 8, paddingHorizontal: 10 },
  cellT: { fontSize: 15, color: C.ink, textAlign: 'right' },
  foot: { fontSize: 12, color: C.okText, textAlign: 'center', marginTop: 'auto' },
});
