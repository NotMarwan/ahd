import { render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import { AhdJourneyProvider, AhdJourneyStore, InMemoryAhdRepository } from '@/state';
import { CreateAhdScreen } from '../CreateAhdScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('Pilot UI batches 1–3', () => {
  it('starts Create Ahd with honest empty fields and no demo fill', async () => {
    const store = new AhdJourneyStore(new InMemoryAhdRepository());
    await render(
      <AhdJourneyProvider store={store}>
        <CreateAhdScreen />
      </AhdJourneyProvider>,
    );

    expect(screen.getByLabelText('صاحب المال').props.value).toBe('');
    expect(screen.getByLabelText('المستفيد').props.value).toBe('');
    expect(screen.getByLabelText('مبلغ العهد بالريال').props.value).toBe('');
    expect(screen.getByLabelText('غرض العهد').props.value).toBe('');
    expect(screen.queryByRole('button', { name: 'تعبئة تجريبية' })).toBeNull();
    expect(screen.getByLabelText('شعار عهد الرسمي')).toBeTruthy();
  });
});
