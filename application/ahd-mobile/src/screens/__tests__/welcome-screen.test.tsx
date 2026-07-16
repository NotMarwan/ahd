import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { InMemoryPilotRepository, PilotProvider, PilotStore } from '@/state';
import { WelcomeScreen } from '../WelcomeScreen';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

describe('Pilot first-run welcome', () => {
  it('states the local Pilot limits before saving consent', async () => {
    const store = new PilotStore(new InMemoryPilotRepository());
    await store.hydrate();
    await render(
      <PilotProvider store={store}>
        <WelcomeScreen />
      </PilotProvider>,
    );

    expect(screen.getByText('نسخة Pilot محلية')).toBeTruthy();
    expect(screen.getByText(/ليست خدمة مصرفية/)).toBeTruthy();
    expect(screen.getByText(/ليست اعتمادًا شرعيًا أو قانونيًا/)).toBeTruthy();
    expect(screen.getByText(/لا نطلب هوية وطنية أو رقم هاتف/)).toBeTruthy();
    expect(screen.getByText(/تبقى بياناتك على هذا الجهاز/)).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'ابدأ تجربتي المحلية' }));
    });

    await waitFor(() => expect(store.getState().profile.welcomeAccepted).toBe(true));
    expect(mockReplace).toHaveBeenCalledWith('/home');
  });
});
