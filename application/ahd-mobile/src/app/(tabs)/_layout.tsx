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
        tabBarLabelStyle: {
          fontFamily: fontFamilies.body,
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarStyle: {
          height: 56,
          paddingBottom: 4,
          paddingTop: 4,
          backgroundColor: colors.card,
          borderTopColor: colors.hairline,
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
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
          tabBarIcon: ({ color }) => <TabIcon name="more" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settle"
        options={{
          title: 'المقاصّة',
          tabBarAccessibilityLabel: 'المقاصّة',
          tabBarIcon: ({ color }) => <TabIcon name="settle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="daftari"
        options={{
          title: 'دفتري',
          tabBarAccessibilityLabel: 'دفتري',
          tabBarIcon: ({ color }) => <TabIcon name="daftari" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'أنشئ عهدًا',
          tabBarAccessibilityLabel: 'أنشئ عهدًا',
          tabBarIcon: ({ color }) => <TabIcon name="create" color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'الرئيسية',
          tabBarAccessibilityLabel: 'الرئيسية',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
    </Tabs>
  );
}
