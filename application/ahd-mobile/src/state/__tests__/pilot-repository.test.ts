import { describe, expect, it, jest } from '@jest/globals';

function loadPilotRepository() {
  try {
    return {
      repository: require('../pilot-repository'),
      sqlite: require('../expo-sqlite-pilot-repository'),
      state: require('../pilot-state'),
      web: require('../web-pilot-repository'),
      error: undefined,
    };
  } catch (error) {
    return { repository: undefined, sqlite: undefined, state: undefined, web: undefined, error };
  }
}

describe('Pilot slice repository', () => {
  const loaded = loadPilotRepository();

  it('exports the five-slice local persistence contract', () => {
    expect(loaded.error).toBeUndefined();
    expect(loaded.state?.PILOT_SLICE_KEYS).toEqual([
      'profile',
      'journey',
      'daily',
      'jamiya',
      'settings',
    ]);
  });

  it('round-trips slices without leaking mutable references', async () => {
    if (!loaded.repository || !loaded.state) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    const profile = { ...loaded.state.initialPilotSlices().profile, welcomeAccepted: true };

    await repository.saveSlice('profile', profile);
    const first = await repository.loadAll();
    first.profile.welcomeAccepted = false;
    const second = await repository.loadAll();

    expect(second.profile.welcomeAccepted).toBe(true);
    expect(Object.keys(second)).toEqual(loaded.state.PILOT_SLICE_KEYS);
  });

  it('exports deterministic versioned JSON and clears every slice', async () => {
    if (!loaded.repository || !loaded.state) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    await repository.saveSlice('profile', {
      ...loaded.state.initialPilotSlices().profile,
      welcomeAccepted: true,
      displayName: 'سارة',
    });

    const first = await repository.exportPortable();
    const second = await repository.exportPortable();
    expect(first).toBe(second);
    expect(JSON.parse(first)).toMatchObject({
      format: 'AhdPilotExportV1',
      version: 1,
      slices: { profile: { displayName: 'سارة', welcomeAccepted: true } },
    });
    expect(first).not.toMatch(/national|phone|account|credential|analytics|token/i);

    await repository.clearAll();
    expect(await repository.loadAll()).toEqual(loaded.state.initialPilotSlices());
  });

  it('adapts the journey slice to the existing Ahd repository interface', async () => {
    if (!loaded.repository || !loaded.state) return;
    const repository = new loaded.repository.InMemoryPilotRepository();
    const adapter = new loaded.repository.JourneySliceRepository(repository);
    const journey = { ...loaded.state.initialPilotSlices().journey, step: 'create' };

    await adapter.save(journey);
    expect(await adapter.load()).toEqual(journey);
    await adapter.clear();
    expect(await adapter.load()).toEqual(loaded.state.initialPilotSlices().journey);
  });

  it('round-trips all five slices through the injected SQLite database', async () => {
    if (!loaded.sqlite || !loaded.state) return;
    const rows = new Map<string, { slice_key: string; version: number; payload: string }>();
    const database = {
      execAsync: jest.fn(async () => undefined),
      runAsync: jest.fn(async (sql: string, key?: string, version?: number, payload?: string) => {
        if (sql.includes('DELETE FROM ahd_pilot_slices')) rows.clear();
        else if (key && version && payload) rows.set(key, { slice_key: key, version, payload });
        return { lastInsertRowId: 1, changes: 1 };
      }),
      getAllAsync: jest.fn(async () => [...rows.values()]),
    };
    const repository = new loaded.sqlite.ExpoSQLitePilotRepository(database as never);
    const profile = { ...loaded.state.initialPilotSlices().profile, welcomeAccepted: true };

    await repository.saveSlice('profile', profile);
    expect((await repository.loadAll()).profile).toEqual(profile);
    expect(database.execAsync).toHaveBeenCalledTimes(1);

    await repository.clearAll();
    expect(await repository.loadAll()).toEqual(loaded.state.initialPilotSlices());
  });

  it('fails closed on corrupt or future SQLite slices', async () => {
    if (!loaded.sqlite) return;
    const database = {
      execAsync: jest.fn(async () => undefined),
      runAsync: jest.fn(async () => ({ lastInsertRowId: 0, changes: 0 })),
      getAllAsync: jest.fn(async () => [
        { slice_key: 'profile', version: 2, payload: '{bad-json' },
      ]),
    };
    const repository = new loaded.sqlite.ExpoSQLitePilotRepository(database as never);

    await expect(repository.loadAll()).rejects.toThrow(/profile|version|corrupt/i);
  });

  it('fails closed on valid JSON with an invalid SQLite slice shape', async () => {
    if (!loaded.sqlite) return;
    const database = {
      execAsync: jest.fn(async () => undefined),
      runAsync: jest.fn(async () => ({ lastInsertRowId: 0, changes: 0 })),
      getAllAsync: jest.fn(async () => [{
        slice_key: 'profile',
        version: 1,
        payload: JSON.stringify({ version: 1, welcomeAccepted: 'yes', displayName: null }),
      }]),
    };

    await expect(
      new loaded.sqlite.ExpoSQLitePilotRepository(database as never).loadAll(),
    ).rejects.toThrow(/invalid|profile|shape/i);
  });

  it('persists the localhost preview without importing native SQLite', async () => {
    if (!loaded.web || !loaded.state) return;
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    };
    const first = new loaded.web.WebPilotRepository(storage);
    await first.saveSlice('profile', {
      ...loaded.state.initialPilotSlices().profile,
      welcomeAccepted: true,
    });

    const second = new loaded.web.WebPilotRepository(storage);
    expect((await second.loadAll()).profile.welcomeAccepted).toBe(true);
    expect(await second.exportPortable()).toContain('AhdPilotExportV1');

    await second.clearAll();
    expect(await second.loadAll()).toEqual(loaded.state.initialPilotSlices());
  });

  it('migrates and persists legacy daily and Jamiya slices in the web repository', async () => {
    if (!loaded.web || !loaded.state) return;
    const legacySlices = {
      ...loaded.state.initialPilotSlices(),
      daily: {
        version: 1,
        entries: [{
          id: 'DAY-0001',
          title: 'قيد قديم',
          note: 'محفوظ كما كتبه صاحبه',
          effectiveDate: '2026-07-15',
        }],
      },
      jamiya: {
        version: 1,
        circleId: 'LEGACY-CIRCLE-1',
        title: 'جمعية قديمة',
        contributionMinor: 25_000,
        members: [{
          id: 'LEGACY-MEMBER-1',
          displayName: 'سارة',
          consented: true,
          paidMinor: 25_000,
        }],
      },
    };
    const values = new Map<string, string>([[
      'sa.ahd.mobile.pilot.v1',
      JSON.stringify({
        format: 'AhdPilotExportV1',
        version: 1,
        asOf: legacySlices.journey.asOf,
        slices: legacySlices,
      }),
    ]]);
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    };

    const migrated = await new loaded.web.WebPilotRepository(storage).loadAll();

    expect(migrated.daily).toMatchObject({
      version: 2,
      entries: [{ kind: 'note', id: 'DAY-0001', title: 'قيد قديم' }],
    });
    expect(migrated.jamiya).toMatchObject({
      version: 2,
      circles: [],
      legacySnapshot: {
        circleId: 'LEGACY-CIRCLE-1',
        contributionMinor: 25_000,
      },
    });
    const persisted = JSON.parse(values.get('sa.ahd.mobile.pilot.v1') ?? '{}');
    expect(persisted.slices.daily.version).toBe(2);
    expect(persisted.slices.jamiya.version).toBe(2);
  });

  it('migrates legacy SQLite rows before returning hydrated slices', async () => {
    if (!loaded.sqlite || !loaded.state) return;
    const rows = [
      {
        slice_key: 'daily',
        version: 1,
        payload: JSON.stringify({
          version: 1,
          entries: [{
            id: 'DAY-0001',
            title: 'قيد قديم',
            note: 'محفوظ',
            effectiveDate: '2026-07-15',
          }],
        }),
      },
      {
        slice_key: 'jamiya',
        version: 1,
        payload: JSON.stringify({
          version: 1,
          circleId: null,
          title: '',
          contributionMinor: 0,
          members: [],
        }),
      },
    ];
    const database = {
      execAsync: jest.fn(async () => undefined),
      runAsync: jest.fn(async () => ({ lastInsertRowId: 0, changes: 1 })),
      getAllAsync: jest.fn(async () => rows),
    };

    const migrated = await new loaded.sqlite.ExpoSQLitePilotRepository(database as never).loadAll();

    expect(migrated.daily.version).toBe(2);
    expect(migrated.jamiya.version).toBe(2);
    expect(database.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO ahd_pilot_slices'),
      'daily',
      2,
      expect.any(String),
    );
  });

  it('fails closed on valid JSON with an invalid web slice shape', async () => {
    if (!loaded.web || !loaded.state) return;
    const invalid = {
      format: 'AhdPilotExportV1',
      version: 1,
      asOf: loaded.state.initialPilotSlices().journey.asOf,
      slices: {
        ...loaded.state.initialPilotSlices(),
        daily: { version: 1, entries: [{ id: 7 }] },
      },
    };
    const storage = {
      getItem: () => JSON.stringify(invalid),
      setItem: () => undefined,
      removeItem: () => undefined,
    };

    await expect(new loaded.web.WebPilotRepository(storage).loadAll()).rejects.toThrow(
      /invalid|daily|shape/i,
    );
  });
});
