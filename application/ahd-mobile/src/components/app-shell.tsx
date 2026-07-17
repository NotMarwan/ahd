import { useContext, type PropsWithChildren } from 'react';
import { ScrollView, type ScrollViewProps, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { colors, fontFamilies, spacing } from '@/theme';
import { TrustWeaveHeader, type TrustWeaveHeaderProps } from './trust-weave-header';

type AppShellProps = PropsWithChildren<Pick<ScrollViewProps, 'testID' | 'keyboardShouldPersistTaps'>> & {
  readonly header?: TrustWeaveHeaderProps | false;
};

export function contentPaddingForWidth(width: number): number {
  return width < 390 ? 16 : 20;
}

export function AppShell({
  children,
  header,
  keyboardShouldPersistTaps = 'handled',
  testID,
}: AppShellProps) {
  const { width } = useWindowDimensions();
  // Edge-to-edge Android draws behind the status bar; the top inset keeps the
  // Trust-Weave header out from under the clock/battery icons (same class of
  // bug as the tab-bar bottom inset found by the CI emulator journey). The
  // context read (not useSafeAreaInsets) falls back to 0 when no provider
  // exists, e.g. bare component renders in jest.
  const insets = useContext(SafeAreaInsetsContext);
  const topInset = insets?.top ?? 0;

  return (
    <ScrollView
      testID={testID}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      <View
        testID={testID ? `${testID}-content` : undefined}
        style={[
          styles.inner,
          {
            paddingHorizontal: contentPaddingForWidth(width),
            paddingTop: topInset + spacing.x2,
          },
        ]}
      >
        {header === false ? null : (
          <TrustWeaveHeader
            actionLabel={header?.actionLabel}
            onAction={header?.onAction}
            onBack={header?.onBack}
          />
        )}
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.ground,
  },
  content: {
    flexGrow: 1,
  },
  inner: {
    flexGrow: 1,
    width: '100%',
    boxSizing: 'border-box',
    maxWidth: 520,
    alignSelf: 'center',
    gap: spacing.x4,
    paddingBottom: spacing.x8,
    writingDirection: 'rtl',
    fontFamily: fontFamilies.body,
  },
});
