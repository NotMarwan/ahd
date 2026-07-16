import type { AhdRepository } from './ahd-repository';
import type { AhdJourneyState } from './journey-store';
import {
  PILOT_SLICE_KEYS,
  initialPilotSlices,
  type PilotSlice,
  type PilotSliceKey,
  type PilotSlices,
} from './pilot-state';

export type AhdPilotExportV1 = {
  format: 'AhdPilotExportV1';
  version: 1;
  asOf: string;
  slices: PilotSlices;
};

export interface PilotRepository {
  loadAll(): Promise<PilotSlices>;
  saveSlice<K extends PilotSliceKey>(key: K, value: PilotSlice<K>): Promise<void>;
  clearAll(): Promise<void>;
  exportPortable(): Promise<string>;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function orderedSlices(slices: PilotSlices): PilotSlices {
  return {
    profile: clone(slices.profile),
    journey: clone(slices.journey),
    daily: clone(slices.daily),
    jamiya: clone(slices.jamiya),
    settings: clone(slices.settings),
  };
}

export function serializePilotExport(slices: PilotSlices): string {
  const envelope: AhdPilotExportV1 = {
    format: 'AhdPilotExportV1',
    version: 1,
    asOf: slices.journey.asOf,
    slices: orderedSlices(slices),
  };
  return JSON.stringify(envelope);
}

export class InMemoryPilotRepository implements PilotRepository {
  private slices: PilotSlices;
  private writeTail: Promise<void> = Promise.resolve();

  constructor(initial?: Partial<PilotSlices>) {
    this.slices = { ...initialPilotSlices(), ...clone(initial ?? {}) };
  }

  async loadAll(): Promise<PilotSlices> {
    await this.writeTail;
    return orderedSlices(this.slices);
  }

  saveSlice<K extends PilotSliceKey>(key: K, value: PilotSlice<K>): Promise<void> {
    const next = clone(value);
    const write = this.writeTail.then(() => {
      this.slices = { ...this.slices, [key]: next };
    });
    this.writeTail = write.catch(() => undefined);
    return write;
  }

  async clearAll(): Promise<void> {
    const write = this.writeTail.then(() => {
      this.slices = initialPilotSlices();
    });
    this.writeTail = write.catch(() => undefined);
    return write;
  }

  async exportPortable(): Promise<string> {
    return serializePilotExport(await this.loadAll());
  }
}

export class JourneySliceRepository implements AhdRepository<AhdJourneyState> {
  constructor(private readonly repository: PilotRepository) {}

  async load(): Promise<AhdJourneyState> {
    return (await this.repository.loadAll()).journey;
  }

  async save(state: AhdJourneyState): Promise<void> {
    await this.repository.saveSlice('journey', state);
  }

  async clear(): Promise<void> {
    await this.repository.saveSlice('journey', initialPilotSlices().journey);
  }
}

export function hasAllPilotSlices(value: Partial<PilotSlices>): value is PilotSlices {
  return PILOT_SLICE_KEYS.every((key) => value[key] !== undefined);
}
