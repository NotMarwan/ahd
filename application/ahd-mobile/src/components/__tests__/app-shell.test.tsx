import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { AppShell } from '@/components/app-shell';
import { spacing } from '@/theme';

function contentPaddingTop(getByTestId: Awaited<ReturnType<typeof render>>['getByTestId']): number {
  const style = StyleSheet.flatten(getByTestId('shell-content').props.style);
  return style.paddingTop as number;
}

describe('AppShell safe-area top inset', () => {
  it('starts content below the status bar by adding the top inset', async () => {
    const insets = { top: 31, right: 0, bottom: 48, left: 0 };
    const screen = await render(
      <SafeAreaInsetsContext.Provider value={insets}>
        <AppShell testID="shell" header={false}>
          <Text>محتوى</Text>
        </AppShell>
      </SafeAreaInsetsContext.Provider>,
    );
    expect(contentPaddingTop(screen.getByTestId)).toBe(31 + spacing.x2);
  });

  it('falls back to the base padding when no safe-area provider exists', async () => {
    const screen = await render(
      <AppShell testID="shell" header={false}>
        <Text>محتوى</Text>
      </AppShell>,
    );
    expect(contentPaddingTop(screen.getByTestId)).toBe(spacing.x2);
  });
});
