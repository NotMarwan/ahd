import { describe, expect, jest, test } from "@jest/globals";

import { ahdCore } from "../../core/ahd-core";

type RepositoryModule = typeof import("../ahd-repository");
type JourneyModule = typeof import("../journey-store");
type SQLiteModule = typeof import("../expo-sqlite-ahd-repository");

function loadStateModules(): {
  repository: RepositoryModule | null;
  journey: JourneyModule | null;
  sqlite: SQLiteModule | null;
  error: unknown;
} {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return {
      repository: require("../ahd-repository"),
      journey: require("../journey-store"),
      sqlite: require("../expo-sqlite-ahd-repository"),
      error: undefined,
    };
  } catch (error) {
    return { repository: null, journey: null, sqlite: null, error };
  }
}

function requireStateModules() {
  const loaded = loadStateModules();
  expect(loaded.error).toBeUndefined();
  expect(loaded.repository).not.toBeNull();
  expect(loaded.journey).not.toBeNull();
  expect(loaded.sqlite).not.toBeNull();
  if (!loaded.repository || !loaded.journey || !loaded.sqlite) throw loaded.error;
  return loaded as {
    repository: RepositoryModule;
    journey: JourneyModule;
    sqlite: SQLiteModule;
    error: undefined;
  };
}

const INPUT = {
  id: "MOBILE-JOURNEY-1",
  lender: "أنت",
  borrower: "سلطان",
  amountMinor: 120_000,
  months: 3,
  start: { y: 2026, m: 7 },
  timestamp: "2026-07-01T10:00:00+03:00",
};

async function runJourney(store: {
  beginCreate(): Promise<unknown>;
  reviewDraft(input: typeof INPUT): Promise<unknown>;
  seal(): Promise<unknown>;
  openDaftari(): Promise<unknown>;
  openRecord(): Promise<unknown>;
  settle(transfers: Array<{ from: string; to: string; amountMinor: number }>): Promise<unknown>;
  verifyProof(): Promise<unknown>;
  getState(): { step: string };
}) {
  const steps = [store.getState().step];
  await store.beginCreate();
  steps.push(store.getState().step);
  await store.reviewDraft(INPUT);
  steps.push(store.getState().step);
  await store.seal();
  steps.push(store.getState().step);
  await store.openDaftari();
  steps.push(store.getState().step);
  await store.openRecord();
  steps.push(store.getState().step);
  await store.settle([
    { from: "نورة", to: "سارة", amountMinor: 10_000 },
    { from: "سارة", to: "خالد", amountMinor: 10_000 },
  ]);
  steps.push(store.getState().step);
  await store.verifyProof();
  steps.push(store.getState().step);
  return steps;
}

describe("Phase 1 journey state", () => {
  test("parses form SAR text in core before reviewing the draft", async () => {
    const { repository, journey } = requireStateModules();
    const store = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);
    await store.beginCreate();

    await store.reviewDraftFromForm({
      id: "MOBILE-FORM-1",
      lender: "أنت",
      borrower: "سلطان",
      amountSarText: "1200.05",
      months: 3,
    });

    expect(store.getState().prepared?.amountMinor).toBe(120_005);
  });

  test("follows the approved create-to-proof route", async () => {
    const { repository, journey } = requireStateModules();
    const store = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);

    const steps = await runJourney(store);

    expect(steps).toEqual([
      "home",
      "create",
      "riba_check",
      "sealed",
      "daftari",
      "record_detail",
      "settlement",
      "proof",
    ]);
    expect(store.getState().proofVerification?.ok).toBe(true);
  });

  test("produces byte-equivalent state for the same fixed inputs", async () => {
    const { repository, journey } = requireStateModules();
    const first = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);
    const second = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);

    await runJourney(first);
    await runJourney(second);

    expect(JSON.stringify(first.getState())).toBe(JSON.stringify(second.getState()));
  });

  test("round-trips the journey through the repository", async () => {
    const { repository, journey } = requireStateModules();
    const persistence = new repository.InMemoryAhdRepository();
    const writer = new journey.AhdJourneyStore(persistence, ahdCore);
    await runJourney(writer);

    const reader = new journey.AhdJourneyStore(persistence, ahdCore);
    await reader.hydrate();

    expect(reader.getState()).toEqual(writer.getState());
    expect(reader.getState()).not.toBe(writer.getState());
  });

  test("records needs_connection without changing canonical or seal", async () => {
    const { repository, journey } = requireStateModules();
    const store = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);
    await store.beginCreate();
    await store.reviewDraft(INPUT);
    await store.seal();
    const before = store.getState();

    await store.requestExternal("external_evidence");
    const after = store.getState();

    expect(after.connection).toEqual({
      status: "needs_connection",
      operation: "external_evidence",
      recordId: "MOBILE-JOURNEY-1",
    });
    expect(after.sealed?.canonical).toBe(before.sealed?.canonical);
    expect(after.sealed?.seal).toBe(before.sealed?.seal);
  });

  test("keeps the in-memory journey unchanged when persistence fails", async () => {
    const { journey } = requireStateModules();
    const repository = {
      load: async () => null,
      save: async () => { throw new Error("disk unavailable"); },
      clear: async () => undefined,
    };
    const store = new journey.AhdJourneyStore(repository, ahdCore);

    await expect(store.beginCreate()).rejects.toThrow("disk unavailable");
    expect(store.getState().step).toBe("home");
  });

  test("Expo SQLite repository round-trips through an injected database", async () => {
    const { sqlite } = requireStateModules();
    let payload: string | null = null;
    const database = {
      execAsync: jest.fn(async () => undefined),
      runAsync: jest.fn(async (_sql: string, _version?: number, nextPayload?: string) => {
        payload = nextPayload ?? null;
        return { lastInsertRowId: 1, changes: 1 };
      }),
      getFirstAsync: jest.fn(async () => (payload ? { payload } : null)),
    };
    const repository = new sqlite.ExpoSQLiteAhdRepository(database as never);
    const state = {
      version: 1 as const,
      asOf: ahdCore.AS_OF,
      step: "home" as const,
    };

    await repository.save(state);

    expect(await repository.load()).toEqual(state);
    expect(database.execAsync).toHaveBeenCalledTimes(1);
    expect(database.runAsync).toHaveBeenCalledTimes(1);
  });
});
