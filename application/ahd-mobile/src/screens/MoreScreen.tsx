import { useMemo, useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppShell, ScreenHeader, Section } from '@/components';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';
import {
  filterMoreFeatures,
  MORE_CATEGORIES,
  type MoreCategory,
  type MoreFeature,
  type MoreFeatureTone,
} from './more-feature-catalog';

const RTL_ROW = Platform.OS === 'web' ? 'row' : 'row-reverse';

const TONE_COLORS: Record<MoreFeatureTone, { line: string; soft: string; text: string }> = {
  accent: { line: colors.accent, soft: colors.accentSoft, text: colors.accent },
  gold: { line: colors.covenant, soft: colors.covenantSoft, text: colors.covenant },
  neutral: { line: colors.inkSecondary, soft: colors.cardSecondary, text: colors.inkSecondary },
};

function FeatureCard({ feature, onPress }: { feature: MoreFeature; onPress: () => void }) {
  const tone = TONE_COLORS[feature.tone];
  return (
    <Pressable
      accessibilityLabel={feature.label}
      accessibilityRole="button"
      onPress={onPress}
      testID={`more-feature-${feature.key}`}
      style={({ pressed }) => [styles.featureCard, pressed && styles.pressed]}
    >
      <View style={[styles.toneLine, { backgroundColor: tone.line }]} />
      <View style={styles.cardMeta}>
        <View style={[styles.categoryPill, { backgroundColor: tone.soft }]}>
          <View style={[styles.categoryDot, { backgroundColor: tone.line }]} />
          <Text style={[styles.categoryText, { color: tone.text }]}>{feature.category}</Text>
        </View>
        {feature.badge ? <Text style={[styles.badge, { color: tone.text }]}>{feature.badge}</Text> : null}
      </View>
      <View style={styles.cardCopy}>
        <Text numberOfLines={2} style={styles.cardTitle}>{feature.label}</Text>
        <Text numberOfLines={3} style={styles.cardDescription}>{feature.description}</Text>
      </View>
      <View style={styles.openRow}>
        <Text style={[styles.openText, { color: tone.text }]}>افتح</Text>
        <Text accessibilityElementsHidden style={[styles.openArrow, { color: tone.text }]}>←</Text>
      </View>
    </Pressable>
  );
}

function NetworkPreview() {
  return (
    <View accessibilityElementsHidden style={styles.networkPreview}>
      <View style={[styles.networkNode, styles.nodeTop]} />
      <View style={[styles.networkNode, styles.nodeRight]} />
      <View style={[styles.networkNode, styles.nodeBottomRight]} />
      <View style={[styles.networkNode, styles.nodeBottomLeft]} />
      <View style={[styles.networkNode, styles.nodeLeft]} />
      <View style={styles.networkCore}>
        <Text style={styles.networkCount}>9 → 2</Text>
      </View>
    </View>
  );
}

export function MoreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<MoreCategory>('الكل');
  const filteredFeatures = useMemo(() => filterMoreFeatures(query, category), [query, category]);
  const open = (route: `/${string}`) => router.push(route as Href);

  return (
    <AppShell testID="more-screen">
      <ScreenHeader
        eyebrow="المزيد · 19 أداة"
        title="أدوات عهد،"
        accentTitle="جاهزة للاستعراض."
        subtitle="ابحث أو اختر فئة؛ كل أداة تعرض نتيجتها ببيانات واضحة من أول زيارة."
      />

      <View style={styles.searchBox}>
        <View style={styles.searchThread} />
        <TextInput
          accessibilityLabel="ابحث في أدوات عهد"
          accessibilityRole="search"
          onChangeText={setQuery}
          placeholder="ابحث في أدوات عهد"
          placeholderTextColor={colors.inkSecondary}
          returnKeyType="search"
          style={styles.searchInput}
          value={query}
        />
        {query ? (
          <Pressable accessibilityLabel="امسح البحث" accessibilityRole="button" onPress={() => setQuery('')} style={styles.clearSearch}>
            <Text style={styles.clearSearchText}>×</Text>
          </Pressable>
        ) : <Text accessibilityElementsHidden style={styles.searchHint}>بحث</Text>}
      </View>

      <Pressable
        accessibilityLabel="افتح التسوية المقترحة"
        accessibilityRole="button"
        onPress={() => open('/settle')}
        style={({ pressed }) => [styles.hero, pressed && styles.pressed]}
      >
        <View style={styles.heroCopy}>
          <View style={styles.heroLabelRow}>
            <View style={styles.heroDot} />
            <Text style={styles.heroEyebrow}>تجربة جاهزة · خمسة أشخاص</Text>
          </View>
          <Text style={styles.heroTitle}>اختصر شبكة كاملة،{`\n`}ولا تغيّر حق أحد.</Text>
          <Text style={styles.heroBody}>شاهد تسعة التزامات تتحول إلى تحويلين فقط، مع بقاء صافي كل طرف محفوظًا.</Text>
          <Text style={styles.heroAction}>افتح التسوية ←</Text>
        </View>
        <NetworkPreview />
      </Pressable>

      <ScrollView
        horizontal
        contentContainerStyle={styles.chips}
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroller}
      >
        {MORE_CATEGORIES.map((item) => {
          const selected = category === item;
          return (
            <Pressable
              key={item}
              accessibilityLabel={item}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setCategory(item)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Section
        title={query || category !== 'الكل' ? `النتائج · ${filteredFeatures.length}` : 'كل الأدوات'}
        accessory={<Text style={styles.sectionCount}>{filteredFeatures.length}</Text>}
      >
        {filteredFeatures.length > 0 ? (
          <View style={styles.featureGrid} testID="more-tools-grid">
            {filteredFeatures.map((feature) => (
              <FeatureCard key={feature.key} feature={feature} onPress={() => open(feature.route)} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyResults}>
            <Text style={styles.emptyTitle}>لا توجد نتيجة مطابقة</Text>
            <Text style={styles.emptyBody}>جرّب كلمة أقصر أو اختر «الكل».</Text>
          </View>
        )}
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    minHeight: controls.minTarget,
    paddingHorizontal: spacing.x3,
    flexDirection: RTL_ROW,
    alignItems: 'center',
    gap: spacing.x2,
    borderWidth: 1,
    borderColor: colors.accentLine,
    borderRadius: radii.medium,
    backgroundColor: colors.cardSecondary,
  },
  searchThread: { width: 4, height: 28, borderRadius: radii.pill, backgroundColor: colors.accent },
  searchInput: {
    ...typography.body,
    flex: 1,
    minHeight: controls.minTarget,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  searchHint: { ...typography.caption, color: colors.accent, fontFamily: fontFamilies.body, fontWeight: '700' },
  clearSearch: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.accentSoft },
  clearSearchText: { fontSize: 21, lineHeight: 24, color: colors.accent, fontFamily: fontFamilies.body },
  hero: {
    minHeight: 220,
    padding: spacing.x4,
    flexDirection: RTL_ROW,
    alignItems: 'center',
    gap: spacing.x3,
    borderWidth: 1,
    borderColor: colors.covenant,
    borderRadius: radii.large,
    backgroundColor: colors.covenantSoft,
  },
  heroCopy: { flex: 1, alignItems: 'stretch', gap: spacing.x2 },
  heroLabelRow: { flexDirection: RTL_ROW, alignItems: 'center', gap: spacing.x2 },
  heroDot: { width: 8, height: 8, borderRadius: radii.pill, backgroundColor: colors.covenant },
  heroEyebrow: { ...typography.caption, color: colors.covenant, fontFamily: fontFamilies.body, fontWeight: '700' },
  heroTitle: { ...typography.title, color: colors.ink, fontFamily: fontFamilies.display, textAlign: 'right' },
  heroBody: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  heroAction: { ...typography.sub, color: colors.accent, fontFamily: fontFamilies.body, fontWeight: '700' },
  networkPreview: { width: 112, height: 132, alignItems: 'center', justifyContent: 'center' },
  networkCore: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.covenant, borderRadius: radii.pill, backgroundColor: colors.card },
  networkCount: { ...typography.sub, color: colors.accent, fontFamily: fontFamilies.technical, fontWeight: '800', writingDirection: 'ltr' },
  networkNode: { position: 'absolute', width: 17, height: 17, borderWidth: 3, borderColor: colors.accent, borderRadius: radii.pill, backgroundColor: colors.card },
  nodeTop: { top: 2, left: 47 },
  nodeRight: { top: 35, right: 3 },
  nodeBottomRight: { bottom: 5, right: 20 },
  nodeBottomLeft: { bottom: 5, left: 20 },
  nodeLeft: { top: 35, left: 3 },
  chips: { flexDirection: RTL_ROW, gap: spacing.x2, paddingHorizontal: 1 },
  horizontalScroller: { width: '100%', maxWidth: '100%', minWidth: 0 },
  chip: { minHeight: 40, paddingHorizontal: spacing.x4, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radii.pill, backgroundColor: colors.card },
  chipSelected: { borderColor: colors.accent, backgroundColor: colors.accent },
  chipText: { ...typography.label, color: colors.inkSecondary, fontFamily: fontFamilies.body },
  chipTextSelected: { color: colors.white },
  featureGrid: { flexDirection: RTL_ROW, flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.x3 },
  featureCard: {
    width: '48%',
    minHeight: 168,
    padding: spacing.x3,
    overflow: 'hidden',
    justifyContent: 'space-between',
    gap: spacing.x3,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.large,
    backgroundColor: colors.card,
  },
  toneLine: { position: 'absolute', top: 0, right: 0, left: 0, height: 4 },
  cardMeta: { flexDirection: RTL_ROW, alignItems: 'center', justifyContent: 'space-between', gap: spacing.x1 },
  categoryPill: { minHeight: 28, paddingHorizontal: spacing.x2, flexDirection: RTL_ROW, alignItems: 'center', gap: spacing.x1, borderRadius: radii.pill },
  categoryDot: { width: 6, height: 6, borderRadius: radii.pill },
  categoryText: { ...typography.caption, fontFamily: fontFamilies.body, fontWeight: '700' },
  badge: { ...typography.caption, flexShrink: 1, fontFamily: fontFamilies.body, fontWeight: '700', textAlign: 'left' },
  cardCopy: { flex: 1, width: '100%', alignItems: 'stretch', justifyContent: 'center' },
  cardTitle: { ...typography.title, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  cardDescription: { ...typography.caption, marginTop: spacing.x1, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  openRow: { flexDirection: RTL_ROW, alignItems: 'center', gap: spacing.x1 },
  openText: { ...typography.caption, fontFamily: fontFamilies.body, fontWeight: '700' },
  openArrow: { ...typography.caption, fontFamily: fontFamilies.body },
  sectionCount: { ...typography.caption, minWidth: 26, textAlign: 'center', color: colors.accent, fontFamily: fontFamilies.technical },
  emptyResults: { minHeight: 128, alignItems: 'center', justifyContent: 'center', padding: spacing.x4, borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.card },
  emptyTitle: { ...typography.title, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'center' },
  emptyBody: { ...typography.caption, marginTop: spacing.x1, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'center' },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
});
