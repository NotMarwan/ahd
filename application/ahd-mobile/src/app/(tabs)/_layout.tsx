import { Tabs } from 'expo-router';

import { colors, fontFamilies } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.ground },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkSecondary,
        tabBarLabelStyle: {
          fontFamily: fontFamilies.body,
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarStyle: {
          minHeight: 64,
          backgroundColor: colors.card,
          borderTopColor: colors.hairline,
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
          maxWidth: '25%',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'الرئيسية', tabBarAccessibilityLabel: 'الرئيسية' }}
      />
      <Tabs.Screen
        name="create"
        options={{ title: 'أنشئ عهدًا', tabBarAccessibilityLabel: 'أنشئ عهدًا' }}
      />
      <Tabs.Screen
        name="daftari"
        options={{ title: 'دفتري', tabBarAccessibilityLabel: 'دفتري' }}
      />
      <Tabs.Screen
        name="settle"
        options={{ title: 'المقاصّة', tabBarAccessibilityLabel: 'المقاصّة' }}
      />
    </Tabs>
  );
}
