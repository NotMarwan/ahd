import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PilotDatabaseProvider } from '@/state';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <PilotDatabaseProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            animation: 'none',
            contentStyle: { backgroundColor: colors.ground },
            headerShown: false,
          }}
        >
          <Stack.Screen name="welcome" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(stack)" />
        </Stack>
    </PilotDatabaseProvider>
  );
}
