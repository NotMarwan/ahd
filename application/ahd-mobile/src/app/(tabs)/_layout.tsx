import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabIcon } from '@/components/tab-icon';
import { colors, fontFamilies } from '@/theme';

export default function TabLayout() {
  // Edge-to-edge Android draws the system navigation bar over the app; the
  // fixed-height tab bar must grow by the bottom inset or 3-button nav
  // devices cover the tab buttons (found by the CI emulator journey).
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      backBehavior="history"
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.ground },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkSecondary,
        tabBarActiveBackgroundColor: colors.accentSoft,
        tabBarLabelStyle: {
          fontFamily: fontFamilies.body,
          fontSize: 10.5,
          fontWeight: '700',
        },
        tabBarStyle: {
          height: 78 + insets.bottom,
          paddingHorizontal: 6,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 8,
          backgroundColor: colors.card,
          borderTopColor: colors.hairline,
          shadowColor: colors.ink,
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.05,
          shadowRadius: 16,
          elevation: 8,
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
          marginHorizontal: 2,
          borderRadius: 14,
        },
      }}
    >
      {/* Native RTL is pinned OFF (app.json extra.supportsRTL/forcesRTL=false):
          the screens hand-mirror RTL on an LTR base. Tabs stay declared in
          reverse so الرئيسية lands RIGHTMOST — the Arabic tab convention. */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'المزيد',
          tabBarAccessibilityLabel: 'المزيد',
          tabBarButtonTestID: 'tab-more',
          tabBarIcon: ({ color }) => <TabIcon name="more" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settle"
        options={{
          title: 'المقاصّة',
          tabBarAccessibilityLabel: 'المقاصّة',
          tabBarButtonTestID: 'tab-settle',
          tabBarIcon: ({ color }) => <TabIcon name="settle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="daftari"
        options={{
          title: 'دفتري',
          tabBarAccessibilityLabel: 'دفتري',
          tabBarButtonTestID: 'tab-daftari',
          tabBarIcon: ({ color }) => <TabIcon name="daftari" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'أنشئ عهدًا',
          tabBarAccessibilityLabel: 'أنشئ عهدًا',
          tabBarButtonTestID: 'tab-create',
          tabBarIcon: ({ color }) => <TabIcon name="create" color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'الرئيسية',
          tabBarAccessibilityLabel: 'الرئيسية',
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
    </Tabs>
  );
}
