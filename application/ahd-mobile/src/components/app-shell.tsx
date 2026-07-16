import type { PropsWithChildren } from 'react';
import { ScrollView, type ScrollViewProps, StyleSheet, useWindowDimensions, View } from 'react-native';

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
        style={[styles.inner, { paddingHorizontal: contentPaddingForWidth(width) }]}
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
    paddingTop: spacing.x2,
    paddingBottom: spacing.x8,
    writingDirection: 'rtl',
    fontFamily: fontFamilies.body,
  },
});
