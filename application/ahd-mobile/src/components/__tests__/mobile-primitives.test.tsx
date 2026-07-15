import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it } from '@jest/globals';
import { StyleSheet } from 'react-native';

import {
  AhdButton,
  AmountDisplay,
  AppShell,
  EmptyState,
  RowGroup,
  ScreenHeader,
  SealedDocument,
  Section,
  StatusChip,
  contentPaddingForWidth,
} from '..';

describe('Ahd mobile primitives', () => {
  it('uses the approved responsive horizontal padding', () => {
    expect(contentPaddingForWidth(389)).toBe(16);
    expect(contentPaddingForWidth(390)).toBe(20);
  });

  it('renders the single-column shell and semantic section primitives', async () => {
    await render(
      <AppShell testID="shell">
        <ScreenHeader title="دفتري" eyebrow="عهد" />
        <Section title="عهودي">
          <RowGroup>
            <EmptyState title="لا توجد عهود" body="ابدأ بإنشاء عهدك الأول." />
          </RowGroup>
        </Section>
      </AppShell>,
    );

    expect(screen.getByText('دفتري')).toBeTruthy();
    expect(screen.getByText('عهودي')).toBeTruthy();
    expect(screen.getByText('لا توجد عهود')).toBeTruthy();
    const shellStyle = StyleSheet.flatten(screen.getByTestId('shell').props.contentContainerStyle);
    expect(shellStyle.flexGrow).toBe(1);
  });

  it('keeps the primary control at least 44px high', async () => {
    await render(<AhdButton label="اختم العهد" onPress={() => undefined} testID="primary-action" />);

    const style = StyleSheet.flatten(screen.getByTestId('primary-action').props.style);
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(screen.getByRole('button', { name: 'اختم العهد' })).toBeTruthy();
  });

  it('shows user-facing values without doing business calculations', async () => {
    await render(
      <>
        <StatusChip label="موثّق" tone="verified" />
        <AmountDisplay value="1,250 ر.س" label="قيمة العهد" />
      </>,
    );

    expect(screen.getByText('موثّق')).toBeTruthy();
    expect(screen.getByText('1,250 ر.س')).toBeTruthy();
  });

  it('keeps technical proof collapsed until requested', async () => {
    await render(
      <SealedDocument
        verdict="الختم صحيح"
        title="إثبات العهد"
        technicalDetails="SHA-256: 6c9410b9"
      />,
    );

    expect(screen.getByText('الختم صحيح')).toBeTruthy();
    expect(screen.queryByText('SHA-256: 6c9410b9')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'عرض التفاصيل التقنية' }));
    expect(screen.getByText('SHA-256: 6c9410b9')).toBeTruthy();
  });
});
