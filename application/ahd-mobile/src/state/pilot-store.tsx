import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';

import type { PilotRepository } from './pilot-repository';
import {
  initialPilotSlices,
  type PilotSettingsSlice,
  type PilotSlice,
  type PilotSliceKey,
  type PilotSlices,
} from './pilot-state';

export type PilotStoreStatus = 'idle' | 'hydrating' | 'ready' | 'error';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class PilotStore {
  private state: PilotSlices = initialPilotSlices();
  private status: PilotStoreStatus = 'idle';
  private error: Error | null = null;
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly repository: PilotRepository,
    private readonly afterDelete: () => void = () => undefined,
  ) {}

  // useSyncExternalStore requires referentially stable snapshots between writes.
  getState = (): PilotSlices => this.state;

  getStatus = (): PilotStoreStatus => this.status;

  getError = (): Error | null => this.error;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  async hydrate(): Promise<PilotSlices> {
    this.status = 'hydrating';
    this.error = null;
    this.emit();
    try {
      const stored = await this.repository.loadAll();
      this.state = clone(stored);
      this.status = 'ready';
      this.emit();
      return this.getState();
    } catch (error) {
      this.error = error instanceof Error ? error : new Error(String(error));
      this.status = 'error';
      this.emit();
      throw this.error;
    }
  }

  async acceptWelcome(): Promise<PilotSlices> {
    return this.updateSlice('profile', { ...this.state.profile, welcomeAccepted: true });
  }

  async setDisplayName(displayName: string | null): Promise<PilotSlices> {
    const normalized = displayName?.trim() || null;
    return this.updateSlice('profile', { ...this.state.profile, displayName: normalized });
  }

  async updateSettings(patch: Partial<Omit<PilotSettingsSlice, 'version'>>): Promise<PilotSlices> {
    return this.updateSlice('settings', { ...this.state.settings, ...patch, version: 1 });
  }

  async exportPortable(): Promise<string> {
    return this.repository.exportPortable();
  }

  async deleteAll(): Promise<PilotSlices> {
    await this.repository.clearAll();
    this.afterDelete();
    this.state = initialPilotSlices();
    this.status = 'ready';
    this.error = null;
    this.emit();
    return this.getState();
  }

  private async updateSlice<K extends PilotSliceKey>(
    key: K,
    value: PilotSlice<K>,
  ): Promise<PilotSlices> {
    const next = clone(value);
    await this.repository.saveSlice(key, next);
    this.state = { ...this.state, [key]: next };
    this.emit();
    return this.getState();
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export type PilotContextValue = {
  store: PilotStore;
  state: PilotSlices;
  status: PilotStoreStatus;
  error: Error | null;
};

const PilotContext = createContext<PilotContextValue | undefined>(undefined);

export function PilotProvider({ children, store }: { children: ReactNode; store: PilotStore }) {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  const status = useSyncExternalStore(store.subscribe, store.getStatus, store.getStatus);
  const error = useSyncExternalStore(store.subscribe, store.getError, store.getError);

  return (
    <PilotContext.Provider value={{ store, state, status, error }}>
      {children}
    </PilotContext.Provider>
  );
}

export function usePilot(): PilotContextValue {
  const value = useContext(PilotContext);
  if (!value) throw new Error('usePilot must be used within PilotProvider');
  return value;
}
