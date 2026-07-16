import {
  ahdCore,
  type AhdDraftInput,
  type NeedsConnection,
  type PreparedAhd,
  type ProofPack,
  type ProofVerification,
  type RibaScreening,
  type SealedAhd,
  type SettlementResult,
  type SettlementTransfer,
} from "../core/ahd-core";
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

export interface AhdJourneyState {
  version: 1;
  asOf: typeof ahdCore.AS_OF;
  step: AhdJourneyStep;
  prepared?: PreparedAhd;
  screening?: RibaScreening;
  sealed?: SealedAhd;
  settlement?: SettlementResult;
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

export function initialJourneyState(): AhdJourneyState {
  return { version: 1, asOf: ahdCore.AS_OF, step: "home" };
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
      this.state = clone(stored);
      this.emit();
    }
    return this.getState();
  }

  resetAfterExternalClear(): void {
    this.state = initialJourneyState();
    this.emit();
  }

  async beginCreate(): Promise<AhdJourneyState> {
    return this.commit({ ...initialJourneyState(), step: "create" });
  }

  async reviewDraft(input: AhdDraftInput): Promise<AhdJourneyState> {
    this.requireStep("create");
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
    return this.commit({ ...this.state, step: "sealed", sealed });
  }

  async openDaftari(): Promise<AhdJourneyState> {
    this.requireSealed();
    return this.commit({ ...this.state, step: "daftari" });
  }

  async openRecord(): Promise<AhdJourneyState> {
    this.requireSealed();
    return this.commit({ ...this.state, step: "record_detail" });
  }

  async settle(transfers: readonly SettlementTransfer[]): Promise<AhdJourneyState> {
    this.requireSealed();
    const settlement = this.core.buildSettlement(transfers);
    return this.commit({ ...this.state, step: "settlement", settlement });
  }

  async verifyProof(): Promise<AhdJourneyState> {
    const sealed = this.requireSealed();
    const proof = this.core.buildProof(sealed.record);
    const proofVerification = this.core.verifyProof(sealed.record);
    return this.commit({ ...this.state, step: "proof", proof, proofVerification });
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
