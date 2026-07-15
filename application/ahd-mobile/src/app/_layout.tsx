import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AhdJourneyProvider } from '@/state';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <AhdJourneyProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          animation: 'none',
          contentStyle: { backgroundColor: colors.ground },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(stack)" />
      </Stack>
    </AhdJourneyProvider>
  );
}
