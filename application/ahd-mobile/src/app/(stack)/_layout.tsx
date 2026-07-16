import { Stack } from 'expo-router';

import { CONTEXTUAL_SCREENS } from '@/navigation/screen-registry';
import { colors, fontFamilies } from '@/theme';

export default function ContextLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'fade',
        contentStyle: { backgroundColor: colors.ground },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.ground },
        headerTitleStyle: {
          color: colors.ink,
          fontFamily: fontFamilies.body,
          fontWeight: '700',
        },
      }}
    >
      {/* headerTitle stays empty: the bar carries only the back affordance,
          each screen renders its own ScreenHeader title (no duplication).
          title remains set for a11y / browser tab naming. */}
      {CONTEXTUAL_SCREENS.map((screen) => (
        <Stack.Screen
          key={screen.key}
          name={screen.route.slice(1)}
          options={{
            title: screen.label,
            headerTitle: '',
            headerShown: screen.key !== 'open',
          }}
        />
      ))}
      <Stack.Screen name="record/[id]" options={{ title: 'تفاصيل العهد', headerTitle: '' }} />
    </Stack>
  );
}
