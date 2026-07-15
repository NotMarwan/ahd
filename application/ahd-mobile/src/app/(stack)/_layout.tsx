import { Stack } from 'expo-router';

import { colors, fontFamilies } from '@/theme';

export default function ContextLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'none',
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
    />
  );
}
