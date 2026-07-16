import { describe, expect, it, jest } from '@jest/globals';
import { act, render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ahdCore } from '../../core/ahd-core';
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

  it('persists a local request as needs_connection without creating an Ahd or changing money', async () => {
    if (!loaded.repository || !loaded.store) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    const store = new loaded.store.PilotStore(repository);
    await store.hydrate();

    await store.saveRequest({
      borrower: 'سارة',
      lender: 'ريم',
      amountMinor: 50_000,
      purpose: 'ظرف عائلي',
      effectiveDate: '2026-07-16',
    });

    const saved = store.getState().daily.entries[0];
    expect(saved).toMatchObject({
      kind: 'request',
      id: 'REQ-PILOT-0001',
      status: 'needs_connection',
      amountMinor: 50_000,
    });
    expect(store.getState().journey.records).toHaveLength(0);

    const reader = new loaded.store.PilotStore(repository);
    await reader.hydrate();
    expect(reader.getState().daily.entries).toEqual(store.getState().daily.entries);
  });

  it('serializes concurrent mutations without losing either local request', async () => {
    if (!loaded.repository || !loaded.store) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    const store = new loaded.store.PilotStore(repository);
    await store.hydrate();

    await Promise.all([
      store.saveRequest({
        borrower: 'سارة',
        lender: 'ريم',
        amountMinor: 50_000,
        purpose: 'احتياج أول',
        effectiveDate: '2026-07-16',
      }),
      store.saveRequest({
        borrower: 'سارة',
        lender: 'هند',
        amountMinor: 60_000,
        purpose: 'احتياج ثانٍ',
        effectiveDate: '2026-07-17',
      }),
    ]);

    const requests = store.getState().daily.entries.filter((entry: { kind: string }) => entry.kind === 'request');
    expect(requests).toHaveLength(2);
    expect(requests.map((entry: { id: string }) => entry.id)).toEqual([
      'REQ-PILOT-0001',
      'REQ-PILOT-0002',
    ]);
  });

  it('persists a typed daily qaid locally and rejects invalid input', async () => {
    if (!loaded.repository || !loaded.store) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    const store = new loaded.store.PilotStore(repository);
    await store.hydrate();

    await store.addDailyNote({
      title: 'قيد اليوم',
      note: 'سلّمت ريم دفعة ٢٠٠ ر.س يدًا بيد',
      effectiveDate: '2026-07-16',
    });

    const saved = store.getState().daily.entries[0];
    expect(saved).toMatchObject({
      kind: 'note',
      id: 'QID-PILOT-0001',
      title: 'قيد اليوم',
      effectiveDate: '2026-07-16',
    });
    expect(store.getState().journey.records).toHaveLength(0);

    await expect(store.addDailyNote({
      title: '',
      note: 'بلا عنوان',
      effectiveDate: '2026-07-16',
    })).rejects.toThrow();
    await expect(store.addDailyNote({
      title: 'تاريخ فاسد',
      note: 'نص',
      effectiveDate: '2026-02-30',
    })).rejects.toThrow();

    const reader = new loaded.store.PilotStore(repository);
    await reader.hydrate();
    expect(reader.getState().daily.entries).toHaveLength(1);
  });

  it('validates Gregorian date-only input without runtime clock objects', () => {
    if (!loaded.state) return;
    expect(loaded.state.isValidPilotDateOnly).toEqual(expect.any(Function));
    expect(loaded.state.isValidPilotDateOnly('2028-02-29')).toBe(true);
    expect(loaded.state.isValidPilotDateOnly('2026-02-29')).toBe(false);
    expect(loaded.state.isValidPilotDateOnly('2026-13-01')).toBe(false);
  });

  it('opens and explicitly resolves a persisted dispute only for a real local record', async () => {
    if (!loaded.repository || !loaded.store) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    const journeyStore = new AhdJourneyStore(
      new loaded.repository.JourneySliceRepository(repository),
      ahdCore,
    );
    await journeyStore.beginCreate();
    await journeyStore.reviewDraft({
      id: 'AHD-PILOT-0001',
      lender: 'ريم',
      borrower: 'سارة',
      amountMinor: 90_000,
      months: 3,
      start: { y: 2026, m: 8 },
      timestamp: '2026-07-16T00:00:00+03:00',
    });
    await journeyStore.seal();
    const store = new loaded.store.PilotStore(repository);
    await store.hydrate();

    await expect(store.openDispute({
      recordId: 'missing',
      reason: 'اختلاف في التوثيق',
      effectiveDate: '2026-07-16',
    })).rejects.toThrow(/record|سجل/i);
    await store.openDispute({
      recordId: 'AHD-PILOT-0001',
      reason: 'اختلاف في التوثيق',
      effectiveDate: '2026-07-16',
    });
    const dispute = store.getState().daily.entries.find((entry: { kind: string }) => entry.kind === 'dispute');
    expect(dispute).toMatchObject({
      id: 'DSP-PILOT-0001',
      status: 'open',
      externalStatus: 'needs_connection',
    });

    await expect(store.recordDisputeReconciliation('DSP-PILOT-0001', {
      attestedBy: 'سارة',
      effectiveDate: '2026-07-17',
      confirmed: false,
    })).rejects.toThrow(/confirm|إقرار|صلح/i);
    await store.recordDisputeReconciliation('DSP-PILOT-0001', {
      attestedBy: 'سارة',
      effectiveDate: '2026-07-17',
      confirmed: true,
    });
    expect(store.getState().daily.entries.find((entry: { id: string }) => entry.id === 'DSP-PILOT-0001'))
      .toMatchObject({
        status: 'reconciled',
        externalStatus: 'needs_connection',
        reconciliation: {
          attestedBy: 'سارة',
          effectiveDate: '2026-07-17',
          confirmed: true,
        },
      });
  });

  it('persists circles, requires recorded consent, and stores netting only as a local receipt', async () => {
    if (!loaded.repository || !loaded.store) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    const store = new loaded.store.PilotStore(repository);
    await store.hydrate();
    await store.createCircle({
      kind: 'jamiya',
      title: 'جمعية الأسرة',
      organizer: 'سارة',
      startMonth: '2026-08',
      members: [
        { displayName: 'سارة', shareMinor: 50_000 },
        { displayName: 'ريم', shareMinor: 50_000 },
        { displayName: 'هند', shareMinor: 50_000 },
      ],
    });
    const circle = store.getState().jamiya.circles[0];
    expect(circle.id).toBe('CIR-PILOT-0001');
    await expect(store.activateCircle(circle.id)).rejects.toThrow(/consent|مواف/i);
    for (const member of circle.members) {
      await store.recordCircleConsentAttestation(circle.id, member.id, {
        recordedBy: circle.organizer,
        effectiveDate: '2026-07-16',
        confirmed: true,
      });
    }
    expect(store.getState().jamiya.circles[0].members[0].consentAttestation).toMatchObject({
      mode: 'organizer_attestation',
      recordedBy: circle.organizer,
    });
    await store.activateCircle(circle.id);

    await expect(store.confirmCircleNetting([circle.id], false, '2026-07-16'))
      .rejects.toThrow(/consent|مواف/i);
    const before = store.getState().jamiya.circles;
    await store.confirmCircleNetting([circle.id], true, '2026-07-16');
    expect(store.getState().jamiya.circles).toEqual(before);
    expect(store.getState().jamiya.nettingReceipts[0]).toMatchObject({
      id: 'NET-PILOT-0001',
      consentConfirmed: true,
      conserved: true,
    });
  });

  it('records circle payments idempotently and rejects a future round', async () => {
    if (!loaded.repository || !loaded.store) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    const store = new loaded.store.PilotStore(repository);
    await store.hydrate();
    await store.createCircle({
      kind: 'jamiya',
      title: 'جمعية صغيرة',
      organizer: 'سارة',
      startMonth: '2026-08',
      members: [
        { displayName: 'سارة', shareMinor: 10_000 },
        { displayName: 'ريم', shareMinor: 10_000 },
      ],
    });
    const circle = store.getState().jamiya.circles[0];
    for (const member of circle.members) {
      await store.recordCircleConsentAttestation(circle.id, member.id, {
        recordedBy: circle.organizer,
        effectiveDate: '2026-07-16',
        confirmed: true,
      });
    }
    await store.activateCircle(circle.id);

    await expect(store.recordCirclePayment(circle.id, 2, circle.members[0].id, '2026-08-01'))
      .rejects.toThrow(/future|round|جولة/i);
    await store.recordCirclePayment(circle.id, 1, circle.members[0].id, '2026-08-01');
    await expect(store.recordCirclePayment(circle.id, 1, circle.members[0].id, '2026-08-01'))
      .rejects.toThrow(/duplicate|مسجل|payment/i);

    const reader = new loaded.store.PilotStore(repository);
    await reader.hydrate();
    expect(reader.getState().jamiya.circles[0].payments).toHaveLength(1);
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
