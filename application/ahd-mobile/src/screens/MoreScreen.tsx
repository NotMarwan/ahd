import { useMemo, useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppShell, ScreenHeader, Section, StatusChip } from '@/components';
import { colors, controls, fontFamilies, radii, spacing, typography } from '@/theme';
import {
  BENTO_MORE_FEATURES,
  filterMoreFeatures,
  MORE_CATEGORIES,
  RECENT_MORE_FEATURES,
  type MoreCategory,
  type MoreFeature,
  type MoreFeatureTone,
} from './more-feature-catalog';

const TONE_COLORS: Record<MoreFeatureTone, { background: string; foreground: string }> = {
  accent: { background: colors.accentSoft, foreground: colors.accent },
  gold: { background: colors.covenantSoft, foreground: colors.covenant },
  neutral: { background: colors.cardSecondary, foreground: colors.inkSecondary },
};

function FeatureMark({ feature, inverse = false }: { feature: MoreFeature; inverse?: boolean }) {
  const tone = TONE_COLORS[feature.tone];
  return (
    <View style={[styles.mark, { backgroundColor: inverse ? 'rgba(255,255,255,0.12)' : tone.background }]}>
      <Text style={[styles.markText, { color: inverse ? colors.white : tone.foreground }]}>{feature.mark}</Text>
      <View style={[styles.markDot, { backgroundColor: inverse ? colors.sealHash : tone.foreground }]} />
    </View>
  );
}

function RecentCard({ feature, onPress }: { feature: MoreFeature; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={`افتح ${feature.label}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.recentCard, pressed && styles.pressed]}
    >
      <FeatureMark feature={feature} />
      <Text style={styles.recentTitle}>{feature.label}</Text>
      <Text numberOfLines={2} style={styles.recentDescription}>{feature.description}</Text>
    </Pressable>
  );
}

function BentoCard({ feature, onPress }: { feature: MoreFeature; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={`افتح ${feature.label}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.bentoCard, pressed && styles.pressed]}
    >
      <View style={styles.bentoTop}>
        <FeatureMark feature={feature} />
        {feature.badge ? <StatusChip label={feature.badge} tone={feature.tone === 'gold' ? 'covenant' : 'active'} /> : null}
      </View>
      <View>
        <Text style={styles.bentoTitle}>{feature.label}</Text>
        <Text numberOfLines={3} style={styles.bentoDescription}>{feature.description}</Text>
      </View>
      <Text accessibilityElementsHidden style={styles.cardAction}>افتح ←</Text>
    </Pressable>
  );
}

function FeatureRow({ feature, onPress }: { feature: MoreFeature; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={feature.label}
      accessibilityRole="button"
      onPress={onPress}
      testID={`more-feature-${feature.key}`}
      style={({ pressed }) => [styles.featureRow, pressed && styles.pressed]}
    >
      <FeatureMark feature={feature} />
      <View style={styles.featureCopy}>
        <View style={styles.featureTitleRow}>
          <Text style={styles.featureTitle}>{feature.label}</Text>
          {feature.badge ? <Text style={styles.featureBadge}>{feature.badge}</Text> : null}
        </View>
        <Text numberOfLines={2} style={styles.featureDescription}>{feature.description}</Text>
      </View>
      <Text accessibilityElementsHidden style={styles.featureArrow}>‹</Text>
    </Pressable>
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
        accentTitle="حين تحتاجها."
        subtitle="ابحث، صفِّ، وافتح النتيجة التي تريدها؛ كل شاشة معها وصف واضح."
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
        accessibilityLabel="افتح المقاصّة المقترحة"
        accessibilityRole="button"
        onPress={() => open('/settle')}
        style={({ pressed }) => [styles.hero, pressed && styles.heroPressed]}
      >
        <View accessibilityElementsHidden style={styles.heroThread} />
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroEyebrow}>المقترح لك</Text>
            <Text style={styles.heroTitle}>اختصر شبكة كاملة،{`\n`}ولا تغيّر حق أحد.</Text>
          </View>
          <View style={styles.heroPreview}>
            <Text style={styles.heroBefore}>9</Text>
            <Text style={styles.heroArrow}>←</Text>
            <Text style={styles.heroAfter}>2</Text>
          </View>
        </View>
        <Text style={styles.heroBody}>شاهد تسعة عهود تجريبية تتحول إلى تحويلين مع بقاء صافي كل طرف محفوظًا.</Text>
        <View style={styles.heroActionRow}>
          <Text style={styles.heroAction}>افتح المقاصّة</Text>
          <Text style={styles.heroActionArrow}>←</Text>
        </View>
      </Pressable>

      <Section title="استخدمتها مؤخرًا">
        <ScrollView
          horizontal
          contentContainerStyle={styles.recentStrip}
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroller}
        >
          {RECENT_MORE_FEATURES.map((feature) => (
            <RecentCard key={feature.key} feature={feature} onPress={() => open(feature.route)} />
          ))}
        </ScrollView>
      </Section>

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

      {query === '' && category === 'الكل' ? (
        <Section title="الأهم الآن">
          <View style={styles.bentoRow}>
            {BENTO_MORE_FEATURES.map((feature) => (
              <BentoCard key={feature.key} feature={feature} onPress={() => open(feature.route)} />
            ))}
          </View>
        </Section>
      ) : null}

      <Section
        title={query || category !== 'الكل' ? `النتائج · ${filteredFeatures.length}` : 'كل الأدوات'}
        accessory={<Text style={styles.sectionCount}>{filteredFeatures.length}</Text>}
      >
        <View style={styles.featureList}>
          {filteredFeatures.length > 0 ? filteredFeatures.map((feature) => (
            <FeatureRow key={feature.key} feature={feature} onPress={() => open(feature.route)} />
          )) : (
            <View style={styles.emptyResults}>
              <Text style={styles.emptyTitle}>لا توجد نتيجة مطابقة</Text>
              <Text style={styles.emptyBody}>جرّب كلمة أقصر أو اختر «الكل».</Text>
            </View>
          )}
        </View>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    minHeight: controls.minTarget,
    paddingHorizontal: spacing.x3,
    flexDirection: 'row-reverse',
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
    minHeight: 218,
    padding: spacing.x5,
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderRadius: radii.large,
    backgroundColor: colors.accentDeep,
    shadowColor: colors.accentDeep,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 4,
  },
  heroPressed: { opacity: 0.94, transform: [{ scale: 0.995 }] },
  heroThread: { position: 'absolute', left: -34, bottom: 42, width: 210, height: 5, borderRadius: radii.pill, backgroundColor: colors.covenant, transform: [{ rotate: '-12deg' }] },
  heroTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.x3 },
  heroEyebrow: { ...typography.caption, color: colors.sealHash, fontFamily: fontFamilies.body, fontWeight: '700', textAlign: 'right' },
  heroTitle: { ...typography.display, marginTop: spacing.x1, color: colors.white, fontFamily: fontFamilies.display, textAlign: 'right' },
  heroPreview: { minWidth: 76, alignItems: 'center', padding: spacing.x2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', borderRadius: radii.medium, backgroundColor: 'rgba(255,255,255,0.08)' },
  heroBefore: { ...typography.title, color: colors.onAccentDim, fontFamily: fontFamilies.display, fontVariant: ['tabular-nums'] },
  heroArrow: { ...typography.body, color: colors.sealHash, fontFamily: fontFamilies.body },
  heroAfter: { ...typography.amount, color: colors.sealHash, fontFamily: fontFamilies.display, fontVariant: ['tabular-nums'] },
  heroBody: { ...typography.body, maxWidth: 300, color: colors.onAccentDim, fontFamily: fontFamilies.body, textAlign: 'right' },
  heroActionRow: { alignSelf: 'flex-start', flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.x2 },
  heroAction: { ...typography.sub, color: colors.white, fontFamily: fontFamilies.body, fontWeight: '700' },
  heroActionArrow: { ...typography.body, color: colors.sealHash, fontFamily: fontFamilies.body },
  recentStrip: { flexDirection: 'row-reverse', gap: spacing.x3, paddingHorizontal: 1 },
  horizontalScroller: { width: '100%', maxWidth: '100%', minWidth: 0 },
  recentCard: { width: 152, minHeight: 138, padding: spacing.x3, gap: spacing.x2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.card },
  recentTitle: { ...typography.sub, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  recentDescription: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  chips: { flexDirection: 'row-reverse', gap: spacing.x2, paddingHorizontal: 1 },
  chip: { minHeight: 38, paddingHorizontal: spacing.x4, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radii.pill, backgroundColor: colors.card },
  chipSelected: { borderColor: colors.accent, backgroundColor: colors.accent },
  chipText: { ...typography.label, color: colors.inkSecondary, fontFamily: fontFamilies.body },
  chipTextSelected: { color: colors.white },
  bentoRow: { flexDirection: 'row-reverse', gap: spacing.x3 },
  bentoCard: { flex: 1, minHeight: 190, padding: spacing.x3, justifyContent: 'space-between', borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.cardSecondary },
  bentoTop: { flexDirection: 'row-reverse', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.x1 },
  bentoTitle: { ...typography.title, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  bentoDescription: { ...typography.caption, marginTop: spacing.x1, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  cardAction: { ...typography.caption, color: colors.accent, fontFamily: fontFamilies.body, fontWeight: '700', textAlign: 'left' },
  mark: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radii.small },
  markText: { ...typography.title, fontFamily: fontFamilies.display, fontWeight: '800' },
  markDot: { position: 'absolute', top: 5, left: 5, width: 6, height: 6, borderRadius: radii.pill },
  featureList: { overflow: 'hidden', borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.card },
  featureRow: { minHeight: 76, paddingHorizontal: spacing.x3, paddingVertical: spacing.x2, flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.x3, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline },
  featureCopy: { flex: 1, gap: 2 },
  featureTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.x2 },
  featureTitle: { ...typography.row, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'right' },
  featureBadge: { ...typography.caption, color: colors.covenant, fontFamily: fontFamilies.body, fontWeight: '700' },
  featureDescription: { ...typography.caption, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'right' },
  featureArrow: { ...typography.title, color: colors.inkSecondary, fontFamily: fontFamilies.body },
  sectionCount: { ...typography.caption, minWidth: 26, textAlign: 'center', color: colors.accent, fontFamily: fontFamilies.technical },
  emptyResults: { minHeight: 128, alignItems: 'center', justifyContent: 'center', padding: spacing.x4 },
  emptyTitle: { ...typography.title, color: colors.ink, fontFamily: fontFamilies.body, textAlign: 'center' },
  emptyBody: { ...typography.caption, marginTop: spacing.x1, color: colors.inkSecondary, fontFamily: fontFamilies.body, textAlign: 'center' },
  pressed: { backgroundColor: colors.accentSoft, opacity: 0.94 },
});
