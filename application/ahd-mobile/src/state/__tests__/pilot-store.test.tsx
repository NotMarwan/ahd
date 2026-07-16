import { describe, expect, it, jest } from '@jest/globals';
import { act, render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AhdJourneyProvider } from '../ahd-store';
import { InMemoryAhdRepository } from '../ahd-repository';
import { AhdJourneyStore, initialJourneyState, type AhdJourneyState } from '../journey-store';

function loadPilotStore() {
  try {
    return {
      bootstrap: require('../pilot-bootstrap'),
      repository: require('../pilot-repository'),
      state: require('../pilot-state'),
      store: require('../pilot-store'),
      error: undefined,
    };
  } catch (error) {
    return { bootstrap: undefined, repository: undefined, state: undefined, store: undefined, error };
  }
}

describe('Pilot store', () => {
  const loaded = loadPilotStore();

  it('exports a real local Pilot store', () => {
    expect(loaded.error).toBeUndefined();
    expect(loaded.store?.PilotStore).toEqual(expect.any(Function));
    expect(loaded.bootstrap?.PilotHydrationGate).toEqual(expect.any(Function));
  });

  it('hydrates before accepting the first-run disclosure', async () => {
    if (!loaded.repository || !loaded.state || !loaded.store) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    await repository.saveSlice('settings', {
      ...loaded.state.initialPilotSlices().settings,
      hideAmounts: true,
    });
    const store = new loaded.store.PilotStore(repository);

    expect(store.getStatus()).toBe('idle');
    await store.hydrate();
    expect(store.getStatus()).toBe('ready');
    expect(store.getState().settings.hideAmounts).toBe(true);
    expect(store.getState().profile.welcomeAccepted).toBe(false);
  });

  it('persists welcome acceptance and resets only after delete succeeds', async () => {
    if (!loaded.repository || !loaded.store) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    const store = new loaded.store.PilotStore(repository);
    await store.hydrate();
    await store.acceptWelcome();

    expect(store.getState().profile.welcomeAccepted).toBe(true);
    expect((await repository.loadAll()).profile.welcomeAccepted).toBe(true);

    await store.deleteAll();
    expect(store.getState().profile.welcomeAccepted).toBe(false);
    expect((await repository.loadAll()).profile.welcomeAccepted).toBe(false);
  });

  it('resets the live journey store as part of full deletion', async () => {
    if (!loaded.repository || !loaded.store) return;
    const resetJourney = jest.fn();
    const store = new loaded.store.PilotStore(
      new loaded.repository.InMemoryPilotRepository(),
      resetJourney,
    );
    await store.hydrate();

    await store.deleteAll();

    expect(resetJourney).toHaveBeenCalledTimes(1);
  });

  it('does not change memory when persistence fails', async () => {
    if (!loaded.repository || !loaded.store) return;
    class FailingRepository extends loaded.repository.InMemoryPilotRepository {
      async saveSlice(): Promise<void> {
        throw new Error('disk unavailable');
      }
    }
    const store = new loaded.store.PilotStore(new FailingRepository());
    await store.hydrate();

    await expect(store.acceptWelcome()).rejects.toThrow('disk unavailable');
    expect(store.getState().profile.welcomeAccepted).toBe(false);
  });

  it('keeps a stable external-store snapshot until state changes', async () => {
    if (!loaded.repository || !loaded.store) return;
    const store = new loaded.store.PilotStore(new loaded.repository.InMemoryPilotRepository());
    await store.hydrate();

    const first = store.getState();
    expect(store.getState()).toBe(first);
    await store.acceptWelcome();
    expect(store.getState()).not.toBe(first);
  });

  it('does not mount product UI until Pilot and journey hydration finish', async () => {
    if (!loaded.bootstrap || !loaded.repository || !loaded.state || !loaded.store) return;
    let releaseLoad: (() => void) | undefined;
    const barrier = new Promise<void>((resolve) => { releaseLoad = resolve; });
    class DeferredRepository extends loaded.repository.InMemoryPilotRepository {
      async loadAll() {
        await barrier;
        return super.loadAll();
      }
    }
    const pilotRepository = new DeferredRepository();
    await pilotRepository.saveSlice('profile', {
      ...loaded.state.initialPilotSlices().profile,
      welcomeAccepted: true,
    });
    const journeyRepository = new InMemoryAhdRepository<AhdJourneyState>();
    await journeyRepository.save({ ...initialJourneyState(), step: 'create' });
    const pilotStore = new loaded.store.PilotStore(pilotRepository);
    const journeyStore = new AhdJourneyStore(journeyRepository);

    const view = await render(
      <loaded.store.PilotProvider store={pilotStore}>
        <AhdJourneyProvider store={journeyStore}>
          <loaded.bootstrap.PilotHydrationGate>
            <Text>واجهة المنتج</Text>
          </loaded.bootstrap.PilotHydrationGate>
        </AhdJourneyProvider>
      </loaded.store.PilotProvider>,
    );

    expect(view.getByText('نفتح سجلك المحلي…')).toBeTruthy();
    expect(view.queryByText('واجهة المنتج')).toBeNull();

    await act(async () => { releaseLoad?.(); });
    await waitFor(() => expect(view.getByText('واجهة المنتج')).toBeTruthy());
    expect(pilotStore.getState().profile.welcomeAccepted).toBe(true);
    expect(journeyStore.getState().step).toBe('create');
  });
});
