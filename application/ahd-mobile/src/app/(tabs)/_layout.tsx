import { Tabs } from 'expo-router';
import { StyleSheet, type ColorValue, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabIcon, type TabIconName } from '@/components/tab-icon';
import { colors, fontFamilies } from '@/theme';

function TabBarGlyph({
  color,
  focused,
  name,
}: {
  color: ColorValue;
  focused: boolean;
  name: TabIconName;
}) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <TabIcon name={name} color={color} size={21} />
    </View>
  );
}

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
        tabBarLabelStyle: {
          fontFamily: fontFamilies.body,
          fontSize: 10.5,
          fontWeight: '700',
          marginTop: -2,
        },
        tabBarStyle: {
          height: 72 + insets.bottom,
          paddingHorizontal: 6,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 6,
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
          marginHorizontal: 1,
          borderRadius: 12,
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
          tabBarIcon: ({ color, focused }) => <TabBarGlyph name="more" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settle"
        options={{
          title: 'المقاصّة',
          tabBarAccessibilityLabel: 'المقاصّة',
          tabBarButtonTestID: 'tab-settle',
          tabBarIcon: ({ color, focused }) => <TabBarGlyph name="settle" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="daftari"
        options={{
          title: 'دفتري',
          tabBarAccessibilityLabel: 'دفتري',
          tabBarButtonTestID: 'tab-daftari',
          tabBarIcon: ({ color, focused }) => <TabBarGlyph name="daftari" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'أنشئ عهدًا',
          tabBarAccessibilityLabel: 'أنشئ عهدًا',
          tabBarButtonTestID: 'tab-create',
          tabBarIcon: ({ color, focused }) => <TabBarGlyph name="create" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'الرئيسية',
          tabBarAccessibilityLabel: 'الرئيسية',
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: ({ color, focused }) => <TabBarGlyph name="home" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 38,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  tabIconActive: {
    backgroundColor: colors.accentSoft,
  },
});
