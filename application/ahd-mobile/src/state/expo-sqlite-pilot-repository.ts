import type { SQLiteDatabase } from 'expo-sqlite';

import { serializePilotExport, type PilotRepository } from './pilot-repository';
import {
  PILOT_SLICE_KEYS,
  assertPilotSlice,
  initialPilotSlices,
  type PilotSlice,
  type PilotSliceKey,
  type PilotSlices,
} from './pilot-state';

const CREATE_TABLE_SQL = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS ahd_pilot_slices (
  slice_key TEXT PRIMARY KEY NOT NULL,
  version INTEGER NOT NULL,
  payload TEXT NOT NULL
);`;

const UPSERT_SQL = `
INSERT INTO ahd_pilot_slices (slice_key, version, payload)
VALUES (?, ?, ?)
ON CONFLICT(slice_key) DO UPDATE SET
  version = excluded.version,
  payload = excluded.payload;`;

type SliceRow = {
  slice_key: string;
  version: number;
  payload: string;
};

function isPilotSliceKey(value: string): value is PilotSliceKey {
  return (PILOT_SLICE_KEYS as readonly string[]).includes(value);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class ExpoSQLitePilotRepository implements PilotRepository {
  private initialized: Promise<void> | null = null;
  private writeTail: Promise<void> = Promise.resolve();

  constructor(private readonly database: SQLiteDatabase) {}

  async loadAll(): Promise<PilotSlices> {
    await this.initialize();
    await this.writeTail;
    const rows = await this.database.getAllAsync<SliceRow>(
      'SELECT slice_key, version, payload FROM ahd_pilot_slices ORDER BY slice_key',
    );
    const slices = initialPilotSlices();

    for (const row of rows) {
      if (!isPilotSliceKey(row.slice_key)) {
        throw new Error(`Unknown Pilot slice: ${row.slice_key}`);
      }
      if (row.version !== 1) {
        throw new Error(`Unsupported ${row.slice_key} slice version: ${row.version}`);
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(row.payload);
      } catch {
        throw new Error(`Corrupt ${row.slice_key} Pilot slice`);
      }
      assertPilotSlice(row.slice_key, parsed);
      slices[row.slice_key] = clone(parsed) as never;
    }

    return clone(slices);
  }

  saveSlice<K extends PilotSliceKey>(key: K, value: PilotSlice<K>): Promise<void> {
    const payload = clone(value);
    assertPilotSlice(key, payload);
    const write = this.writeTail.then(async () => {
      await this.initialize();
      await this.database.runAsync(UPSERT_SQL, key, payload.version, JSON.stringify(payload));
    });
    this.writeTail = write.catch(() => undefined);
    return write;
  }

  clearAll(): Promise<void> {
    const write = this.writeTail.then(async () => {
      await this.initialize();
      await this.database.runAsync('DELETE FROM ahd_pilot_slices');
    });
    this.writeTail = write.catch(() => undefined);
    return write;
  }

  async exportPortable(): Promise<string> {
    return serializePilotExport(await this.loadAll());
  }

  private initialize(): Promise<void> {
    if (!this.initialized) this.initialized = this.database.execAsync(CREATE_TABLE_SQL);
    return this.initialized;
  }
}
