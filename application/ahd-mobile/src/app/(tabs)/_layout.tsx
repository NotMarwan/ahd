import { Tabs } from 'expo-router';

import { TabIcon } from '@/components/tab-icon';
import { colors, fontFamilies } from '@/theme';

export default function TabLayout() {
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
          height: 78,
          paddingHorizontal: 6,
          paddingBottom: 10,
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
      {/* forcesRTL renders the FIRST child rightmost — declared in reverse so
          الرئيسية lands leftmost as requested */}
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
