import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, controls, fontFamilies, spacing, typography } from '@/theme';

import { useAhdJourney } from './ahd-store';
import { usePilot } from './pilot-store';

type BootPhase = 'booting' | 'ready' | 'error';

export function PilotHydrationGate({ children }: { children: ReactNode }) {
  const { store } = usePilot();
  const { hydrate } = useAhdJourney();
  const [phase, setPhase] = useState<BootPhase>('booting');
  const [message, setMessage] = useState<string | null>(null);
  const runId = useRef(0);
  const hydrateJourney = useRef(hydrate);

  useEffect(() => {
    hydrateJourney.current = hydrate;
  }, [hydrate]);

  const startHydration = () => {
    const id = ++runId.current;
    return Promise.all([store.hydrate(), hydrateJourney.current()])
      .then(() => {
        if (runId.current === id) setPhase('ready');
      })
      .catch((error: unknown) => {
        if (runId.current !== id) return;
        setMessage(error instanceof Error ? error.message : String(error));
        setPhase('error');
      });
  };

  const retry = () => {
    setPhase('booting');
    setMessage(null);
    void startHydration();
  };

  useEffect(() => {
    void startHydration();
    return () => { runId.current += 1; };
    // The injected stores are stable for the lifetime of the provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  if (phase === 'ready') return children;

  if (phase === 'error') {
    return (
      <View accessibilityRole="alert" style={styles.centered}>
        <Text style={styles.title}>تعذّر فتح السجل المحلي</Text>
        <Text style={styles.copy}>{message ?? 'حدث خطأ محلي غير متوقع.'}</Text>
        <Pressable
          accessibilityRole="button"
          hitSlop={controls.hitSlop}
          onPress={retry}
          style={styles.retry}
        >
          <Text style={styles.retryLabel}>حاول مرة أخرى</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View accessibilityLabel="تهيئة السجل المحلي" style={styles.centered}>
      <ActivityIndicator color={colors.accent} size="small" />
      <Text style={styles.copy}>نفتح سجلك المحلي…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.x3,
    padding: spacing.x5,
    backgroundColor: colors.ground,
  },
  title: {
    ...typography.title,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    textAlign: 'center',
  },
  copy: {
    ...typography.body,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'center',
  },
  retry: {
    minHeight: controls.minTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.x4,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  retryLabel: {
    ...typography.label,
    color: colors.accent,
    fontFamily: fontFamilies.body,
  },
});
