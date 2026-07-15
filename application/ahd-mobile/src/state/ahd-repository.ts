export interface AhdRepository<T> {
  load(): Promise<T | null>;
  save(state: T): Promise<void>;
  clear(): Promise<void>;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class InMemoryAhdRepository<T = never> implements AhdRepository<T> {
  private value: T | null = null;

  async load(): Promise<T | null> {
    return this.value === null ? null : clone(this.value);
  }

  async save(state: T): Promise<void> {
    this.value = clone(state);
  }

  async clear(): Promise<void> {
    this.value = null;
  }
}
