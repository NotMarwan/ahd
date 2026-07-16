import { hasAllPilotSlices, serializePilotExport, type PilotRepository } from './pilot-repository';
import {
  PILOT_SLICE_KEYS,
  assertPilotSlice,
  assertPilotSlices,
  initialPilotSlices,
  type PilotSlice,
  type PilotSliceKey,
  type PilotSlices,
} from './pilot-state';

export type PilotStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const STORAGE_KEY = 'sa.ahd.mobile.pilot.v1';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function parseStoredSlices(raw: string | null): PilotSlices {
  if (raw === null) return initialPilotSlices();
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error('Corrupt local Pilot preview data');
  }
  if (!value || typeof value !== 'object') throw new Error('Invalid local Pilot preview data');
  const envelope = value as { format?: unknown; version?: unknown; slices?: Partial<PilotSlices> };
  if (envelope.format !== 'AhdPilotExportV1' || envelope.version !== 1) {
    throw new Error('Unsupported local Pilot preview version');
  }
  if (!envelope.slices || !hasAllPilotSlices(envelope.slices)) {
    throw new Error('Incomplete local Pilot preview data');
  }
  for (const key of PILOT_SLICE_KEYS) {
    if (envelope.slices[key].version !== 1) {
      throw new Error(`Unsupported ${key} preview slice version`);
    }
  }
  assertPilotSlices(envelope.slices);
  return clone(envelope.slices);
}

export class WebPilotRepository implements PilotRepository {
  private writeTail: Promise<void> = Promise.resolve();

  constructor(private readonly storage: PilotStorage) {}

  async loadAll(): Promise<PilotSlices> {
    await this.writeTail;
    return parseStoredSlices(this.storage.getItem(STORAGE_KEY));
  }

  saveSlice<K extends PilotSliceKey>(key: K, value: PilotSlice<K>): Promise<void> {
    const candidate = clone(value);
    assertPilotSlice(key, candidate);
    const write = this.writeTail.then(() => {
      const slices = parseStoredSlices(this.storage.getItem(STORAGE_KEY));
      const next = { ...slices, [key]: candidate };
      this.storage.setItem(STORAGE_KEY, serializePilotExport(next));
    });
    this.writeTail = write.catch(() => undefined);
    return write;
  }

  clearAll(): Promise<void> {
    const write = this.writeTail.then(() => {
      this.storage.removeItem(STORAGE_KEY);
    });
    this.writeTail = write.catch(() => undefined);
    return write;
  }

  async exportPortable(): Promise<string> {
    return serializePilotExport(await this.loadAll());
  }
}
