import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';

import {
  MAX_PILOT_AMOUNT_MINOR,
  ahdCore,
  type SettlementResult,
  type SettlementTransfer,
} from '../core/ahd-core';
import type { PilotRepository } from './pilot-repository';
import {
  initialPilotSlices,
  isValidPilotDateOnly,
  type PilotCircle,
  type PilotCircleConsentAttestation,
  type PilotCircleKind,
  type PilotCircleMember,
  type PilotDailyEntry,
  type PilotDisputeEntry,
  type PilotRequestEntry,
  type PilotSettingsSlice,
  type PilotSlice,
  type PilotSliceKey,
  type PilotSlices,
} from './pilot-state';

export type PilotStoreStatus = 'idle' | 'hydrating' | 'ready' | 'error';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function requiredText(value: string, label: string, maxLength = 120): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength || /[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new TypeError(`${label} is invalid`);
  }
  return normalized;
}

function dateOnly(value: string, label: string): string {
  const normalized = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new TypeError(`${label} must use YYYY-MM-DD`);
  }
  if (!isValidPilotDateOnly(normalized)) throw new TypeError(`${label} is invalid`);
  return normalized;
}

function monthOnly(value: string): string {
  const normalized = value.trim();
  const match = /^(\d{4})-(\d{2})$/.exec(normalized);
  if (!match || Number(match[1]) < 1 || Number(match[2]) < 1 || Number(match[2]) > 12) {
    throw new TypeError('startMonth must use YYYY-MM');
  }
  return normalized;
}

function pilotMinor(value: number, label: string): number {
  if (!Number.isSafeInteger(value) || value <= 0 || value > MAX_PILOT_AMOUNT_MINOR) {
    throw new RangeError(`${label} must be positive integer halalas within the Pilot limit`);
  }
  return value;
}

function nextId(prefix: string, ids: readonly string[]): string {
  const existing = new Set(ids);
  let sequence = 1;
  while (existing.has(`${prefix}${String(sequence).padStart(4, '0')}`)) sequence += 1;
  return `${prefix}${String(sequence).padStart(4, '0')}`;
}

function nextCircleRound(circle: PilotCircle): number | null {
  for (let round = 1; round <= circle.members.length; round += 1) {
    if (circle.members.some((member) => !circle.payments.some((payment) => (
      payment.round === round && payment.memberId === member.id
    )))) return round;
  }
  return null;
}

export type SaveRequestInput = {
  borrower: string;
  lender: string;
  amountMinor: number;
  purpose?: string;
  effectiveDate: string;
};

export type OpenDisputeInput = {
  recordId: string;
  reason: string;
  effectiveDate: string;
};

export type RecordDisputeReconciliationInput = {
  attestedBy: string;
  effectiveDate: string;
  confirmed: boolean;
};

export type RecordCircleConsentAttestationInput = {
  recordedBy: string;
  effectiveDate: string;
  confirmed: boolean;
};

export type CreateCircleInput = {
  kind: PilotCircleKind;
  title: string;
  organizer: string;
  startMonth: string;
  members: readonly { displayName: string; shareMinor: number }[];
};

export function previewCircleNetting(circles: readonly PilotCircle[]): SettlementResult {
  const before: SettlementTransfer[] = [];
  circles.forEach((circle) => {
    if (circle.status !== 'active') throw new Error('Circle must be active before netting preview');
    if (circle.members.some((member) => !member.consentAttestation)) {
      throw new Error('Circle netting requires organizer attestations for every consent');
    }
    const round = nextCircleRound(circle);
    if (round === null) return;
    const recipientId = circle.orderMemberIds[round - 1];
    const recipient = circle.members.find((member) => member.id === recipientId);
    if (!recipient) throw new Error('Circle recipient is invalid');
    circle.members.forEach((member) => {
      const alreadyPaid = circle.payments.some((payment) => (
        payment.round === round && payment.memberId === member.id
      ));
      if (!alreadyPaid && member.id !== recipient.id) {
        before.push({
          from: member.displayName,
          to: recipient.displayName,
          amountMinor: member.shareMinor,
        });
      }
    });
  });
  if (before.length === 0) {
    return { before: [], after: [], beforeCount: 0, afterCount: 0, conserved: true };
  }
  return ahdCore.buildSettlement(before);
}

export class PilotStore {
  private state: PilotSlices = initialPilotSlices();
  private status: PilotStoreStatus = 'idle';
  private error: Error | null = null;
  private readonly listeners = new Set<() => void>();
  private mutationTail: Promise<void> = Promise.resolve();

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
    return this.updateFreshSlice('profile', (profile) => ({ ...profile, welcomeAccepted: true }));
  }

  async setDisplayName(displayName: string | null): Promise<PilotSlices> {
    const normalized = displayName?.trim() || null;
    return this.updateFreshSlice('profile', (profile) => ({ ...profile, displayName: normalized }));
  }

  async updateSettings(patch: Partial<Omit<PilotSettingsSlice, 'version'>>): Promise<PilotSlices> {
    return this.updateFreshSlice('settings', (settings) => ({ ...settings, ...patch, version: 1 }));
  }

  async saveRequest(input: SaveRequestInput): Promise<PilotSlices> {
    const borrower = requiredText(input.borrower, 'borrower');
    const lender = requiredText(input.lender, 'lender');
    if (borrower === lender) throw new TypeError('Request parties must be distinct');
    const amountMinor = pilotMinor(input.amountMinor, 'amountMinor');
    const purpose = input.purpose?.trim() ?? '';
    if (purpose.length > 240 || /[\u0000-\u001f\u007f]/.test(purpose)) {
      throw new TypeError('purpose is invalid');
    }
    const effectiveDate = dateOnly(input.effectiveDate, 'effectiveDate');
    const termsAr = `طلب ${borrower} من ${lender} ${ahdCore.formatMinorSar(amountMinor)} قرضًا حسنًا؛ بلا فائدة أو غرامة أو زيادة، وينتظر موافقة الطرف الآخر خارج هذا الجهاز.`;
    if (ahdCore.screenTerms(termsAr).verdict !== 'clean') {
      throw new Error('Request terms failed the riba screen');
    }
    return this.updateFreshSlice('daily', (daily) => {
      const id = nextId(
        'REQ-PILOT-',
        daily.entries.filter((entry) => entry.kind === 'request').map((entry) => entry.id),
      );
      const entry: PilotRequestEntry = {
        kind: 'request',
        id,
        borrower,
        lender,
        amountMinor,
        purpose,
        termsAr,
        effectiveDate,
        status: 'needs_connection',
      };
      return { ...daily, entries: [...daily.entries, entry] };
    });
  }

  async openDispute(input: OpenDisputeInput): Promise<PilotSlices> {
    const recordId = requiredText(input.recordId, 'recordId', 64);
    const reason = requiredText(input.reason, 'reason', 320);
    const effectiveDate = dateOnly(input.effectiveDate, 'effectiveDate');
    return this.updateFreshSlice('daily', (daily, latest) => {
      if (!latest.journey.records.some((entry) => entry.sealed.record.id === recordId)) {
        throw new Error('Local Ahd record was not found');
      }
      if (daily.entries.some((entry) => (
        entry.kind === 'dispute' && entry.recordId === recordId && entry.status === 'open'
      ))) throw new Error('An open dispute already exists for this record');
      const id = nextId(
        'DSP-PILOT-',
        daily.entries.filter((entry) => entry.kind === 'dispute').map((entry) => entry.id),
      );
      const entry: PilotDisputeEntry = {
        kind: 'dispute',
        id,
        recordId,
        reason,
        effectiveDate,
        status: 'open',
        externalStatus: 'needs_connection',
      };
      return { ...daily, entries: [...daily.entries, entry] };
    });
  }

  async recordDisputeReconciliation(
    disputeId: string,
    input: RecordDisputeReconciliationInput,
  ): Promise<PilotSlices> {
    const id = requiredText(disputeId, 'disputeId', 64);
    if (!input.confirmed) throw new Error('Reconciliation requires explicit confirmation of the local attestation');
    const attestedBy = requiredText(input.attestedBy, 'attestedBy', 80);
    const effectiveDate = dateOnly(input.effectiveDate, 'effectiveDate');
    return this.updateFreshSlice('daily', (daily) => {
      let found = false;
      const entries = daily.entries.map((entry): PilotDailyEntry => {
        if (entry.kind !== 'dispute' || entry.id !== id) return entry;
        found = true;
        if (entry.status !== 'open') throw new Error('Dispute is already reconciled');
        return {
          ...entry,
          status: 'reconciled',
          externalStatus: 'needs_connection',
          reconciliation: { attestedBy, effectiveDate, confirmed: true },
        };
      });
      if (!found) throw new Error('Dispute was not found');
      return { ...daily, entries };
    });
  }

  async createCircle(input: CreateCircleInput): Promise<PilotSlices> {
    if (!['jamiya', 'occasion', 'standing'].includes(input.kind)) {
      throw new TypeError('Circle kind is invalid');
    }
    const title = requiredText(input.title, 'title');
    const organizer = requiredText(input.organizer, 'organizer');
    const startMonth = monthOnly(input.startMonth);
    if (input.members.length < 2 || input.members.length > 5) {
      throw new RangeError('Circle requires 2 to 5 members');
    }
    const memberInputs = input.members.map((member) => ({
      displayName: requiredText(member.displayName, 'member displayName', 80),
      shareMinor: pilotMinor(member.shareMinor, 'member shareMinor'),
    }));
    if (new Set(memberInputs.map((member) => member.displayName)).size !== memberInputs.length) {
      throw new TypeError('Circle member names must be unique');
    }
    if (!memberInputs.some((member) => member.displayName === organizer)) {
      throw new TypeError('Circle organizer must be a member');
    }
    if (input.kind === 'jamiya' && new Set(memberInputs.map((member) => member.shareMinor)).size !== 1) {
      throw new TypeError('Jamiya members must use one agreed share');
    }
    return this.updateFreshSlice('jamiya', (jamiya) => {
      const id = nextId('CIR-PILOT-', jamiya.circles.map((circle) => circle.id));
      const members: PilotCircleMember[] = memberInputs.map((member, index) => ({
        id: `${id}-M${String(index + 1).padStart(2, '0')}`,
        displayName: member.displayName,
        consentAttestation: null,
        shareMinor: member.shareMinor,
      }));
      const circle: PilotCircle = {
        id,
        kind: input.kind,
        title,
        organizer,
        startMonth,
        members,
        orderMemberIds: members.map((member) => member.id),
        payments: [],
        status: 'draft',
      };
      return { ...jamiya, circles: [...jamiya.circles, circle], activeCircleId: id };
    });
  }

  async selectCircle(circleId: string): Promise<PilotSlices> {
    const id = requiredText(circleId, 'circleId', 64);
    return this.updateFreshSlice('jamiya', (jamiya) => {
      if (!jamiya.circles.some((circle) => circle.id === id)) throw new Error('Circle was not found');
      return { ...jamiya, activeCircleId: id };
    });
  }

  async recordCircleConsentAttestation(
    circleId: string,
    memberId: string,
    input: RecordCircleConsentAttestationInput,
  ): Promise<PilotSlices> {
    if (!input.confirmed) throw new Error('Consent recording requires an explicit organizer attestation');
    const recordedBy = requiredText(input.recordedBy, 'recordedBy', 80);
    const effectiveDate = dateOnly(input.effectiveDate, 'effectiveDate');
    return this.updateFreshSlice('jamiya', (jamiya) => {
      let circleFound = false;
      let memberFound = false;
      const circles = jamiya.circles.map((circle): PilotCircle => {
        if (circle.id !== circleId) return circle;
        circleFound = true;
        if (circle.status !== 'draft') throw new Error('Active circle consent cannot be changed');
        if (recordedBy !== circle.organizer) {
          throw new Error('Only the named organizer may attest received consent');
        }
        return {
          ...circle,
          members: circle.members.map((member) => {
            if (member.id !== memberId) return member;
            memberFound = true;
            const consentAttestation: PilotCircleConsentAttestation = {
              mode: 'organizer_attestation',
              recordedBy,
              effectiveDate,
              confirmed: true,
            };
            return { ...member, consentAttestation };
          }),
        };
      });
      if (!circleFound || !memberFound) throw new Error('Circle member was not found');
      return { ...jamiya, circles };
    });
  }

  async activateCircle(circleId: string): Promise<PilotSlices> {
    return this.updateFreshSlice('jamiya', (jamiya) => {
      let found = false;
      const circles = jamiya.circles.map((circle): PilotCircle => {
        if (circle.id !== circleId) return circle;
        found = true;
        if (circle.status !== 'draft') throw new Error('Circle is already active');
        if (circle.members.some((member) => !member.consentAttestation)) {
          throw new Error('Circle activation requires an organizer attestation for every member consent');
        }
        return { ...circle, status: 'active' };
      });
      if (!found) throw new Error('Circle was not found');
      return { ...jamiya, circles, activeCircleId: circleId };
    });
  }

  async recordCirclePayment(
    circleId: string,
    round: number,
    memberId: string,
    effectiveDateInput: string,
  ): Promise<PilotSlices> {
    const effectiveDate = dateOnly(effectiveDateInput, 'effectiveDate');
    return this.updateFreshSlice('jamiya', (jamiya) => {
      let found = false;
      const paymentIds = jamiya.circles.flatMap((circle) => circle.payments.map((payment) => payment.id));
      const paymentId = nextId('PAY-PILOT-', paymentIds);
      const circles = jamiya.circles.map((circle): PilotCircle => {
        if (circle.id !== circleId) return circle;
        found = true;
        if (circle.status !== 'active') throw new Error('Circle must be active before recording payment');
        const currentRound = nextCircleRound(circle);
        if (currentRound === null) throw new Error('Circle is complete');
        if (round !== currentRound) throw new Error('Cannot record a future round');
        const member = circle.members.find((candidate) => candidate.id === memberId);
        if (!member) throw new Error('Circle member was not found');
        if (circle.payments.some((payment) => payment.round === round && payment.memberId === memberId)) {
          throw new Error('Duplicate payment is already recorded');
        }
        const payments = [
          ...circle.payments,
          { id: paymentId, round, memberId, amountMinor: member.shareMinor, effectiveDate },
        ];
        const complete = circle.members.every((candidate) => circle.members.every((_, roundIndex) => (
          payments.some((payment) => (
            payment.round === roundIndex + 1 && payment.memberId === candidate.id
          ))
        )));
        return { ...circle, payments, status: complete ? 'complete' : 'active' };
      });
      if (!found) throw new Error('Circle was not found');
      return { ...jamiya, circles };
    });
  }

  async confirmCircleNetting(
    circleIds: readonly string[],
    consentConfirmed: boolean,
    effectiveDateInput: string,
  ): Promise<PilotSlices> {
    if (!consentConfirmed) throw new Error('Circle netting requires explicit consent');
    const uniqueIds = [...new Set(circleIds)];
    if (uniqueIds.length === 0 || uniqueIds.length !== circleIds.length) {
      throw new Error('Circle netting requires unique circles');
    }
    const effectiveDate = dateOnly(effectiveDateInput, 'effectiveDate');
    return this.updateFreshSlice('jamiya', (jamiya) => {
      const circles = uniqueIds.map((id) => {
        const circle = jamiya.circles.find((candidate) => candidate.id === id);
        if (!circle) throw new Error('Circle was not found');
        return circle;
      });
      const preview = previewCircleNetting(circles);
      if (preview.beforeCount === 0) throw new Error('No open circle obligations to net');
      const id = nextId('NET-PILOT-', jamiya.nettingReceipts.map((receipt) => receipt.id));
      return {
        ...jamiya,
        nettingReceipts: [
          ...jamiya.nettingReceipts,
          {
            id,
            circleIds: uniqueIds,
            ...preview,
            consentConfirmed: true as const,
            effectiveDate,
          },
        ],
      };
    });
  }

  async exportPortable(): Promise<string> {
    await this.mutationTail;
    return this.repository.exportPortable();
  }

  async deleteAll(): Promise<PilotSlices> {
    return this.enqueueMutation(async () => {
      await this.repository.clearAll();
      this.afterDelete();
      this.state = initialPilotSlices();
      this.status = 'ready';
      this.error = null;
      this.emit();
      return this.getState();
    });
  }

  private updateFreshSlice<K extends PilotSliceKey>(
    key: K,
    update: (value: PilotSlice<K>, latest: PilotSlices) => PilotSlice<K>,
  ): Promise<PilotSlices> {
    return this.enqueueMutation(async () => {
      const latest = await this.repository.loadAll();
      const next = clone(update(clone(latest[key]), latest));
      await this.repository.saveSlice(key, next);
      this.state = { ...clone(latest), [key]: next };
      this.emit();
      return this.getState();
    });
  }

  private enqueueMutation<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.mutationTail.then(operation);
    this.mutationTail = result.then(() => undefined, () => undefined);
    return result;
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
