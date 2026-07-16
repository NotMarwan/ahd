import { expect, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { PilotProvider, PilotStore } from '@/state';
import { InMemoryPilotRepository } from '@/state/pilot-repository';
import { SettingsScreen } from '../SettingsScreen';

test('الإعدادات تحفظ اسم العرض والتفضيلات محليًا ولا تعرض مفاتيح لا تعمل', async () => {
  const repository = new InMemoryPilotRepository();
  const pilotStore = new PilotStore(repository);
  await pilotStore.hydrate();

  const view = await render(
    <PilotProvider store={pilotStore}>
      <SettingsScreen />
    </PilotProvider>,
  );

  expect(view.getByText('الإعدادات · عن عهد')).toBeTruthy();
  expect(view.getByText(/كلمتك محفوظة، وعلاقتك محميّة/)).toBeTruthy();
  expect(view.queryByLabelText('الإفصاح الذاتي')).toBeNull();
  expect(view.getByText(/D-1/)).toBeTruthy();

  await fireEvent.changeText(view.getByLabelText('اسم العرض'), 'سارة');
  await fireEvent.press(view.getByRole('button', { name: 'احفظ اسم العرض' }));
  await waitFor(async () => {
    expect((await repository.loadAll()).profile.displayName).toBe('سارة');
  });

  const toggle = view.getByLabelText('إخفاء المبالغ');
  expect(toggle.props.value).toBe(false);
  await fireEvent(toggle, 'valueChange', true);
  await waitFor(async () => {
    expect((await repository.loadAll()).settings.hideAmounts).toBe(true);
  });
});
