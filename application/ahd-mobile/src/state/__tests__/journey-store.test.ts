import { describe, expect, jest, test } from "@jest/globals";

import { ahdCore } from "../../core/ahd-core";
import { createShareEnvelope, serializeShareEnvelope } from "../../share";
import { assertPilotSlice } from "../pilot-state";

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
  settle(recordIds: readonly string[], consentConfirmed: boolean): Promise<unknown>;
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
  await store.settle([INPUT.id], true);
  steps.push(store.getState().step);
  await store.verifyProof();
  steps.push(store.getState().step);
  return steps;
}

describe("Phase 1 journey state", () => {
  test("starts with a real empty record collection and deterministic next ID", () => {
    const { repository, journey } = requireStateModules();
    const store = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);

    expect(store.getState().records).toEqual([]);
    expect(store.getState().activeRecordId).toBeNull();
    expect(store.nextDraftId()).toBe("AHD-PILOT-0001");
  });

  test("keeps multiple sealed records and selects details by real record ID", async () => {
    const { repository, journey } = requireStateModules();
    const store = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);

    await store.beginCreate();
    await store.reviewDraft({ ...INPUT, id: store.nextDraftId() });
    await store.seal();
    const firstSeal = store.getState().sealed?.seal;

    await store.beginCreate();
    expect(store.nextDraftId()).toBe("AHD-PILOT-0002");
    await store.reviewDraft({
      ...INPUT,
      id: store.nextDraftId(),
      lender: "ريم",
      borrower: "هناء",
      amountMinor: 75_000,
    });
    await store.seal();

    expect(store.getState().records.map((entry) => entry.sealed.record.id)).toEqual([
      "AHD-PILOT-0001",
      "AHD-PILOT-0002",
    ]);
    expect(store.getState().records[0].proof.seal).toEqual(expect.any(String));

    await store.openRecord("AHD-PILOT-0001");
    expect(store.getState().activeRecordId).toBe("AHD-PILOT-0001");
    expect(store.getState().sealed?.record.id).toBe("AHD-PILOT-0001");
    expect(store.getState().sealed?.seal).toBe(firstSeal);
  });

  test("rejects control characters that can collide in the canonical record", async () => {
    const { repository, journey } = requireStateModules();
    const store = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);
    await store.beginCreate();

    await expect(store.reviewDraft({ ...INPUT, lender: "أمل\nborrower=سارة" })).rejects.toThrow(
      /control|line|name|canonical/i,
    );
    expect(store.getState().step).toBe("create");
  });

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

  test("requires explicit consent and derives settlement only from selected local records", async () => {
    const { repository, journey } = requireStateModules();
    const store = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);
    await store.beginCreate();
    await store.reviewDraft(INPUT);
    await store.seal();

    await expect(store.settle([INPUT.id], false)).rejects.toThrow("explicit consent");
    expect(store.getState().settlement).toBeUndefined();

    await store.settle([INPUT.id], true);
    expect(store.getState().settlement?.before).toEqual([
      { from: INPUT.borrower, to: INPUT.lender, amountMinor: INPUT.amountMinor },
    ]);
    expect(store.getState().settlementConsent).toEqual({
      confirmed: true,
      recordIds: [INPUT.id],
    });
    expect(() => assertPilotSlice("journey", store.getState())).not.toThrow();
  });

  test("restores the selected record when settlement follows an abandoned create flow", async () => {
    const { repository, journey } = requireStateModules();
    const store = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);
    await store.beginCreate();
    await store.reviewDraft(INPUT);
    await store.seal();
    await store.beginCreate();
    expect(store.getState().sealed).toBeUndefined();

    await store.settle([INPUT.id], true);

    expect(store.getState().step).toBe("settlement");
    expect(store.getState().activeRecordId).toBe(INPUT.id);
    expect(store.getState().sealed?.record.id).toBe(INPUT.id);
  });

  test("fails closed when persisted local content no longer matches its attached proof", async () => {
    const { repository, journey } = requireStateModules();
    const persistence = new repository.InMemoryAhdRepository<
      ReturnType<typeof journey.initialJourneyState>
    >();
    const writer = new journey.AhdJourneyStore(persistence, ahdCore);
    await writer.beginCreate();
    await writer.reviewDraft(INPUT);
    await writer.seal();
    const tampered = await persistence.load();
    if (!tampered) throw new Error("expected persisted journey");
    tampered.records[0].sealed.record.amountMinor += 1;
    tampered.sealed!.record.amountMinor += 1;
    await persistence.save(tampered);

    expect(() => assertPilotSlice("journey", tampered)).toThrow(/integrity|proof|Invalid/i);
    const reader = new journey.AhdJourneyStore(persistence, ahdCore);
    await expect(reader.hydrate()).rejects.toThrow(/integrity|proof|stored/i);
    expect(reader.getState()).toEqual(journey.initialJourneyState());
  });

  test("fails closed when a persisted settlement no longer matches its consented records", async () => {
    const { repository, journey } = requireStateModules();
    const persistence = new repository.InMemoryAhdRepository<
      ReturnType<typeof journey.initialJourneyState>
    >();
    const writer = new journey.AhdJourneyStore(persistence, ahdCore);
    await writer.beginCreate();
    await writer.reviewDraft(INPUT);
    await writer.seal();
    await writer.settle([INPUT.id], true);
    const tampered = await persistence.load();
    if (!tampered?.settlement) throw new Error("expected persisted settlement");
    tampered.settlement.after[0].amountMinor += 1;
    await persistence.save(tampered);

    expect(() => assertPilotSlice("journey", tampered)).toThrow(/settlement|integrity|Invalid/i);
    const reader = new journey.AhdJourneyStore(persistence, ahdCore);
    await expect(reader.hydrate()).rejects.toThrow(/settlement|integrity|stored/i);
    expect(reader.getState()).toEqual(journey.initialJourneyState());
  });

  test("persists only verified shared records without adding them to financial records", async () => {
    const { repository, journey } = requireStateModules();
    const source = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);
    await source.beginCreate();
    await source.reviewDraft(INPUT);
    await source.seal();
    const sourceState = source.getState();
    const serialized = serializeShareEnvelope(createShareEnvelope({
      record: sourceState.sealed!.record,
      proof: sourceState.proof!,
      exportedAt: sourceState.sealed!.prepared.sourceDraft.timestamp,
    }));

    const target = new journey.AhdJourneyStore(new repository.InMemoryAhdRepository(), ahdCore);
    await expect(target.importSharedRecord(serialized)).resolves.toMatchObject({ status: "verified" });
    await expect(target.importSharedRecord(serialized)).resolves.toMatchObject({ status: "verified" });

    expect(target.getState().records).toEqual([]);
    expect(target.getState().imports).toHaveLength(1);
    expect(target.getState().imports[0].record.id).toBe(INPUT.id);
    expect(() => assertPilotSlice("journey", target.getState())).not.toThrow();

    const tampered = JSON.parse(serialized) as { record: { amount_minor: number } };
    tampered.record.amount_minor += 1;
    await expect(target.importSharedRecord(JSON.stringify(tampered))).resolves.toMatchObject({
      status: "tampered",
    });
    expect(target.getState().imports).toHaveLength(1);
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
      records: [],
      imports: [],
      activeRecordId: null,
    };

    await repository.save(state);

    expect(await repository.load()).toEqual(state);
    expect(database.execAsync).toHaveBeenCalledTimes(1);
    expect(database.runAsync).toHaveBeenCalledTimes(1);
  });
});
