import {
  ahdCore,
  type AhdDraftInput,
  type AhdRecord,
  type NeedsConnection,
  type PreparedAhd,
  type ProofPack,
  type ProofVerification,
  type RibaScreening,
  type SealedAhd,
  type SettlementResult,
  type SettlementTransfer,
} from "../core/ahd-core";
import {
  parseShareEnvelope,
  verifyAttachedProof,
  type ShareEnvelopeResult,
} from "../share";
import type { AhdRepository } from "./ahd-repository";

export type AhdJourneyStep =
  | "home"
  | "create"
  | "riba_check"
  | "sealed"
  | "daftari"
  | "record_detail"
  | "settlement"
  | "proof";

export type AhdStoredRecord = {
  sealed: SealedAhd;
  proof: ProofPack;
  source: "local" | "imported";
};

export type ImportedAhdRecord = {
  record: AhdRecord;
  proof: ProofPack;
  exportedAt: string;
};

export type SettlementConsent = {
  confirmed: true;
  recordIds: readonly string[];
};

export interface AhdJourneyState {
  version: 1;
  asOf: typeof ahdCore.AS_OF;
  step: AhdJourneyStep;
  records: readonly AhdStoredRecord[];
  imports: readonly ImportedAhdRecord[];
  activeRecordId: string | null;
  prepared?: PreparedAhd;
  screening?: RibaScreening;
  sealed?: SealedAhd;
  settlement?: SettlementResult;
  settlementConsent?: SettlementConsent;
  proof?: ProofPack;
  proofVerification?: ProofVerification;
  connection?: NeedsConnection;
}

export type AhdDraftFormInput = Omit<AhdDraftInput, "amountMinor"> & {
  amountSarText: string;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function stableJson(value: unknown): string {
  const normalize = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(normalize);
    if (item && typeof item === "object") {
      return Object.keys(item as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((result, key) => {
          result[key] = normalize((item as Record<string, unknown>)[key]);
          return result;
        }, {});
    }
    return item;
  };
  return JSON.stringify(normalize(value));
}

function rebuildSealed(
  core: typeof ahdCore,
  sealed: SealedAhd,
): SealedAhd {
  const source = sealed.prepared.sourceDraft;
  return core.sealPrepared(core.prepareDraft({
    id: source.id,
    lender: source.lender,
    borrower: source.borrower,
    amountMinor: source.amountMinor,
    months: source.months,
    open: source.open,
    start: source.start,
    timestamp: source.timestamp,
    purpose: source.purpose,
  }));
}

function assertStoredRecordIntegrity(core: typeof ahdCore, entry: AhdStoredRecord): void {
  try {
    const recomputed = rebuildSealed(core, entry.sealed);
    const proofVerification = verifyAttachedProof(entry.sealed.record, entry.proof);
    if (stableJson(recomputed) !== stableJson(entry.sealed) || !proofVerification.ok) {
      throw new Error("Stored Ahd integrity check failed");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Stored Ahd integrity check failed") throw error;
    throw new Error("Stored Ahd integrity check failed", { cause: error });
  }
}

function assertImportedRecordIntegrity(entry: ImportedAhdRecord): void {
  try {
    if (!verifyAttachedProof(entry.record, entry.proof).ok) {
      throw new Error("Stored imported proof integrity check failed");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Stored imported proof integrity check failed") throw error;
    throw new Error("Stored imported proof integrity check failed", { cause: error });
  }
}

function assertStoredSettlementIntegrity(
  core: typeof ahdCore,
  settlement: SettlementResult,
  consent: SettlementConsent,
  records: readonly AhdStoredRecord[],
): void {
  try {
    if (new Set(consent.recordIds).size !== consent.recordIds.length) {
      throw new Error("Stored settlement contains duplicate consent records");
    }
    const entries = consent.recordIds.map((recordId) => {
      const entry = records.find((candidate) => candidate.sealed.record.id === recordId);
      if (!entry || entry.source !== "local") {
        throw new Error("Stored settlement references a non-local record");
      }
      return entry;
    });
    const recomputed = core.buildSettlement(entries.map(({ sealed }) => ({
      from: sealed.record.borrower,
      to: sealed.record.lender,
      amountMinor: sealed.record.amountMinor,
    })));
    if (stableJson(recomputed) !== stableJson(settlement)) {
      throw new Error("Stored settlement integrity check failed");
    }
  } catch (error) {
    if (error instanceof Error && /Stored settlement/i.test(error.message)) throw error;
    throw new Error("Stored settlement integrity check failed", { cause: error });
  }
}

export function initialJourneyState(): AhdJourneyState {
  return {
    version: 1,
    asOf: ahdCore.AS_OF,
    step: "home",
    records: [],
    imports: [],
    activeRecordId: null,
  };
}

function assertCanonicalField(value: string, label: string, maxLength: number): void {
  if (!value || value.length > maxLength || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new TypeError(`${label} contains invalid control characters for the canonical record`);
  }
}

export class AhdJourneyStore {
  private state: AhdJourneyState = initialJourneyState();
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly repository: AhdRepository<AhdJourneyState>,
    private readonly core: typeof ahdCore = ahdCore,
  ) {}

  getState(): AhdJourneyState {
    return clone(this.state);
  }

  // useSyncExternalStore requires the same reference until a committed write.
  getSnapshot = (): AhdJourneyState => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  async hydrate(): Promise<AhdJourneyState> {
    const stored = await this.repository.load();
    if (stored) {
      const legacy = stored as AhdJourneyState & {
        records?: readonly AhdStoredRecord[];
        imports?: readonly ImportedAhdRecord[];
        activeRecordId?: string | null;
      };
      const records = Array.isArray(legacy.records)
        ? clone(legacy.records)
        : legacy.sealed
          ? [{
              sealed: clone(legacy.sealed),
              proof: clone(legacy.proof ?? this.core.buildProof(legacy.sealed.record)),
              source: "local" as const,
            }]
          : [];
      const imports = Array.isArray(legacy.imports) ? clone(legacy.imports) : [];
      records.forEach((entry) => assertStoredRecordIntegrity(this.core, entry));
      imports.forEach(assertImportedRecordIntegrity);
      const settlementConsent = legacy.settlementConsent;
      if (Boolean(legacy.settlement) !== Boolean(settlementConsent)) {
        throw new Error("Stored settlement integrity check failed");
      }
      const settlement = legacy.settlement && settlementConsent ? legacy.settlement : undefined;
      if (settlement && settlementConsent) {
        assertStoredSettlementIntegrity(this.core, settlement, settlementConsent, records);
      }
      const rootSteps: readonly AhdJourneyStep[] = [
        "sealed",
        "daftari",
        "record_detail",
        "settlement",
        "proof",
      ];
      const needsRootRecord = Boolean(legacy.sealed) || rootSteps.includes(legacy.step);
      const storedActiveId = Object.prototype.hasOwnProperty.call(legacy, "activeRecordId")
        ? legacy.activeRecordId
        : undefined;
      const activeRecordId = needsRootRecord
        ? storedActiveId
          ?? legacy.sealed?.record.id
          ?? records.at(-1)?.sealed.record.id
          ?? null
        : storedActiveId ?? null;
      const activeEntry = activeRecordId
        ? records.find((entry) => entry.sealed.record.id === activeRecordId)
        : undefined;
      if (activeRecordId && !activeEntry) throw new Error("Stored active Ahd record was not found");
      if (needsRootRecord && !activeEntry) throw new Error("Stored Ahd root record was not found");
      if (legacy.sealed && activeEntry && stableJson(legacy.sealed) !== stableJson(activeEntry.sealed)) {
        throw new Error("Stored Ahd root integrity check failed");
      }
      if (legacy.proof && activeEntry && !verifyAttachedProof(activeEntry.sealed.record, legacy.proof).ok) {
        throw new Error("Stored Ahd root proof integrity check failed");
      }
      const step = legacy.step === "settlement" && !settlement
        ? (activeEntry ? "record_detail" : "home")
        : legacy.step;
      const candidate: AhdJourneyState = {
        ...clone(stored),
        step,
        records,
        imports,
        settlement,
        settlementConsent,
        activeRecordId,
      };
      if (activeEntry && needsRootRecord) {
        candidate.sealed = clone(activeEntry.sealed);
        candidate.proof = clone(activeEntry.proof);
        candidate.proofVerification = verifyAttachedProof(activeEntry.sealed.record, activeEntry.proof);
      } else {
        delete candidate.sealed;
        delete candidate.proof;
        delete candidate.proofVerification;
      }
      if (JSON.stringify(candidate) !== JSON.stringify(stored)) {
        await this.repository.save(candidate);
      }
      this.state = candidate;
      this.emit();
    }
    return this.getState();
  }

  resetAfterExternalClear(): void {
    this.state = initialJourneyState();
    this.emit();
  }

  nextDraftId(): string {
    const existing = new Set(this.state.records.map((entry) => entry.sealed.record.id));
    let sequence = 1;
    while (existing.has(`AHD-PILOT-${String(sequence).padStart(4, "0")}`)) sequence += 1;
    return `AHD-PILOT-${String(sequence).padStart(4, "0")}`;
  }

  async beginCreate(): Promise<AhdJourneyState> {
    return this.commit({
      ...initialJourneyState(),
      step: "create",
      records: clone(this.state.records),
      imports: clone(this.state.imports),
    });
  }

  async reviewDraft(input: AhdDraftInput): Promise<AhdJourneyState> {
    this.requireStep("create");
    assertCanonicalField(input.id, "id", 64);
    assertCanonicalField(input.lender, "lender name", 80);
    assertCanonicalField(input.borrower, "borrower name", 80);
    const prepared = this.core.prepareDraft(input);
    const screening = this.core.screenTerms(prepared.termsAr);
    return this.commit({ ...this.state, step: "riba_check", prepared, screening });
  }

  async reviewDraftFromForm(input: AhdDraftFormInput): Promise<AhdJourneyState> {
    const { amountSarText, ...draftInput } = input;
    return this.reviewDraft({
      ...draftInput,
      amountMinor: this.core.parseSarTextToMinor(amountSarText),
    });
  }

  async seal(): Promise<AhdJourneyState> {
    this.requireStep("riba_check");
    if (!this.state.prepared) throw new Error("No prepared Ahd to seal");
    const sealed = this.core.sealPrepared(this.state.prepared);
    const proof = this.core.buildProof(sealed.record);
    const entry: AhdStoredRecord = { sealed, proof, source: "local" };
    const records = [
      ...this.state.records.filter((item) => item.sealed.record.id !== sealed.record.id),
      entry,
    ];
    return this.commit({
      ...this.state,
      step: "sealed",
      sealed,
      proof,
      proofVerification: verifyAttachedProof(sealed.record, proof),
      records,
      activeRecordId: sealed.record.id,
    });
  }

  async openDaftari(): Promise<AhdJourneyState> {
    const entry = this.findRecord(this.state.activeRecordId) ?? this.state.records.at(-1);
    return this.commit({
      ...this.state,
      step: "daftari",
      activeRecordId: entry?.sealed.record.id ?? null,
      sealed: entry?.sealed,
      proof: entry?.proof,
      proofVerification: entry ? verifyAttachedProof(entry.sealed.record, entry.proof) : undefined,
    });
  }

  async openRecord(recordId?: string): Promise<AhdJourneyState> {
    const entry = this.findRecord(
      recordId ?? this.state.activeRecordId ?? this.state.sealed?.record.id ?? null,
    );
    if (!entry) throw new Error("No sealed Ahd record was found");
    return this.commit({
      ...this.state,
      step: "record_detail",
      activeRecordId: entry.sealed.record.id,
      sealed: entry.sealed,
      proof: entry.proof,
      proofVerification: verifyAttachedProof(entry.sealed.record, entry.proof),
    });
  }

  async settle(recordIds: readonly string[], consentConfirmed: boolean): Promise<AhdJourneyState> {
    if (!consentConfirmed) throw new Error("Settlement requires explicit consent");
    const uniqueRecordIds = [...new Set(recordIds)];
    if (uniqueRecordIds.length === 0) throw new Error("Settlement requires at least one local record");
    const entries = uniqueRecordIds.map((recordId) => {
      const entry = this.findRecord(recordId);
      if (!entry || entry.source !== "local") throw new Error("Settlement record is not local");
      return entry;
    });
    const transfers: SettlementTransfer[] = entries.map(({ sealed }) => ({
      from: sealed.record.borrower,
      to: sealed.record.lender,
      amountMinor: sealed.record.amountMinor,
    }));
    const settlement = this.core.buildSettlement(transfers);
    const settlementConsent: SettlementConsent = { confirmed: true, recordIds: uniqueRecordIds };
    const activeEntry = entries.find((entry) => (
      entry.sealed.record.id === this.state.activeRecordId
    )) ?? entries.at(-1);
    if (!activeEntry) throw new Error("Settlement requires an active local record");
    return this.commit({
      ...this.state,
      step: "settlement",
      settlement,
      settlementConsent,
      activeRecordId: activeEntry.sealed.record.id,
      sealed: clone(activeEntry.sealed),
      proof: clone(activeEntry.proof),
      proofVerification: verifyAttachedProof(activeEntry.sealed.record, activeEntry.proof),
    });
  }

  async verifyProof(): Promise<AhdJourneyState> {
    const sealed = this.requireSealed();
    const proof = this.state.proof ?? this.findRecord(sealed.record.id)?.proof;
    if (!proof) throw new Error("No attached proof for the sealed Ahd");
    const proofVerification = verifyAttachedProof(sealed.record, proof);
    return this.commit({ ...this.state, step: "proof", proof, proofVerification });
  }

  async importSharedRecord(serialized: string): Promise<ShareEnvelopeResult> {
    const result = parseShareEnvelope(serialized);
    if (result.status !== "verified") return result;
    const existing = this.state.imports.find((entry) => entry.record.id === result.record.id);
    if (existing) {
      if (existing.proof.seal === result.proof.seal) return result;
      return { status: "invalid", reason: "A different imported record already uses this identifier" };
    }
    const imported: ImportedAhdRecord = {
      record: result.record,
      proof: result.proof,
      exportedAt: result.envelope.exported_at,
    };
    await this.commit({ ...this.state, imports: [...this.state.imports, imported] });
    return result;
  }

  async requestExternal(operation: NeedsConnection["operation"]): Promise<AhdJourneyState> {
    const sealed = this.requireSealed();
    const connection = this.core.requestExternal(operation, sealed);
    return this.commit({ ...this.state, connection });
  }

  private requireStep(expected: AhdJourneyStep): void {
    if (this.state.step !== expected) {
      throw new Error(`Expected journey step ${expected}, received ${this.state.step}`);
    }
  }

  private requireSealed(): SealedAhd {
    if (!this.state.sealed) throw new Error("No sealed Ahd in the journey");
    return this.state.sealed;
  }

  private findRecord(recordId: string | null): AhdStoredRecord | undefined {
    if (!recordId) return undefined;
    return this.state.records.find((entry) => entry.sealed.record.id === recordId);
  }

  private async commit(next: AhdJourneyState): Promise<AhdJourneyState> {
    const candidate = clone(next);
    await this.repository.save(candidate);
    this.state = candidate;
    this.emit();
    return this.getState();
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}
