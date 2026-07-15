import type { SQLiteDatabase } from "expo-sqlite";

import type { AhdRepository } from "./ahd-repository";
import type { AhdJourneyState } from "./journey-store";

const CREATE_TABLE_SQL = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS ahd_mobile_state (
  id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
  version INTEGER NOT NULL,
  payload TEXT NOT NULL
);`;

const UPSERT_SQL = `
INSERT INTO ahd_mobile_state (id, version, payload)
VALUES (1, ?, ?)
ON CONFLICT(id) DO UPDATE SET version = excluded.version, payload = excluded.payload;`;

export class ExpoSQLiteAhdRepository implements AhdRepository<AhdJourneyState> {
  private initialized: Promise<void> | null = null;

  constructor(private readonly database: SQLiteDatabase) {}

  async load(): Promise<AhdJourneyState | null> {
    await this.initialize();
    const row = await this.database.getFirstAsync<{ payload: string }>(
      "SELECT payload FROM ahd_mobile_state WHERE id = 1",
    );
    if (!row) return null;

    const state = JSON.parse(row.payload) as AhdJourneyState;
    if (state.version !== 1) throw new Error(`Unsupported Ahd state version: ${state.version}`);
    return state;
  }

  async save(state: AhdJourneyState): Promise<void> {
    await this.initialize();
    await this.database.runAsync(UPSERT_SQL, state.version, JSON.stringify(state));
  }

  async clear(): Promise<void> {
    await this.initialize();
    await this.database.runAsync("DELETE FROM ahd_mobile_state WHERE id = 1");
  }

  private initialize(): Promise<void> {
    if (!this.initialized) {
      this.initialized = this.database.execAsync(CREATE_TABLE_SQL);
    }
    return this.initialized;
  }
}
