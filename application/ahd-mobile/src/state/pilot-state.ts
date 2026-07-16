import {
  MAX_PILOT_AMOUNT_MINOR,
  ahdCore,
  type ProofPack,
  type SealedAhd,
  type SettlementTransfer,
} from '../core/ahd-core';
import { verifyAttachedProof } from '../share';
import type {
  AhdJourneyState,
  AhdStoredRecord,
  ImportedAhdRecord,
} from './journey-store';
import { initialJourneyState } from './journey-store';

export const PILOT_SLICE_KEYS = [
  'profile',
  'journey',
  'daily',
  'jamiya',
  'settings',
] as const;

export type PilotSliceKey = (typeof PILOT_SLICE_KEYS)[number];

export type PilotProfileSlice = {
  version: 1;
  welcomeAccepted: boolean;
  displayName: string | null;
};

export type PilotNoteEntry = {
  kind: 'note';
  id: string;
  title: string;
  note: string;
  effectiveDate: string;
};

export type PilotRequestEntry = {
  kind: 'request';
  id: string;
  borrower: string;
  lender: string;
  amountMinor: number;
  purpose: string;
  termsAr: string;
  effectiveDate: string;
  status: 'needs_connection';
};

export type PilotDisputeEntry = {
  kind: 'dispute';
  id: string;
  recordId: string;
  reason: string;
  effectiveDate: string;
  status: 'open' | 'reconciled';
  externalStatus: 'needs_connection';
  reconciliation?: {
    attestedBy: string;
    effectiveDate: string;
    confirmed: true;
  };
};

export type PilotDailyEntry = PilotNoteEntry | PilotRequestEntry | PilotDisputeEntry;

export type PilotDailySlice = {
  version: 2;
  entries: readonly PilotDailyEntry[];
};

export type PilotCircleKind = 'jamiya' | 'occasion' | 'standing';

export type PilotCircleConsentAttestation = {
  mode: 'organizer_attestation';
  recordedBy: string;
  effectiveDate: string;
  confirmed: true;
};

export type PilotCircleMember = {
  id: string;
  displayName: string;
  consentAttestation: PilotCircleConsentAttestation | null;
  shareMinor: number;
};

export type PilotCirclePayment = {
  id: string;
  round: number;
  memberId: string;
  amountMinor: number;
  effectiveDate: string;
};

export type PilotCircle = {
  id: string;
  kind: PilotCircleKind;
  title: string;
  organizer: string;
  startMonth: string;
  members: readonly PilotCircleMember[];
  orderMemberIds: readonly string[];
  payments: readonly PilotCirclePayment[];
  status: 'draft' | 'active' | 'complete';
};

export type PilotNettingReceipt = {
  id: string;
  circleIds: readonly string[];
  before: readonly SettlementTransfer[];
  after: readonly SettlementTransfer[];
  beforeCount: number;
  afterCount: number;
  conserved: boolean;
  consentConfirmed: true;
  effectiveDate: string;
};

export type PilotLegacyJamiyaSnapshot = {
  circleId: string | null;
  title: string;
  contributionMinor: number;
  members: readonly {
    id: string;
    displayName: string;
    consented: boolean;
    paidMinor: number;
  }[];
};

export type PilotJamiyaSlice = {
  version: 2;
  circles: readonly PilotCircle[];
  activeCircleId: string | null;
  nettingReceipts: readonly PilotNettingReceipt[];
  legacySnapshot: PilotLegacyJamiyaSnapshot | null;
};

export type PilotSettingsSlice = {
  version: 1;
  digitMode: 'western' | 'arabic';
  hideAmounts: boolean;
};

export type PilotSlices = {
  profile: PilotProfileSlice;
  journey: AhdJourneyState;
  daily: PilotDailySlice;
  jamiya: PilotJamiyaSlice;
  settings: PilotSettingsSlice;
};

export type PilotSlice<K extends PilotSliceKey> = PilotSlices[K];

export const PILOT_SLICE_VERSIONS = {
  profile: 1,
  journey: 1,
  daily: 2,
  jamiya: 2,
  settings: 1,
} as const satisfies Record<PilotSliceKey, number>;

export function initialPilotSlices(): PilotSlices {
  return {
    profile: { version: 1, welcomeAccepted: false, displayName: null },
    journey: initialJourneyState(),
    daily: { version: 2, entries: [] },
    jamiya: {
      version: 2,
      circles: [],
      activeCircleId: null,
      nettingReceipts: [],
      legacySnapshot: null,
    },
    settings: { version: 1, digitMode: 'western', hideAmounts: false },
  };
}

function migrationRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function migrationClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function migratePilotSlice<K extends PilotSliceKey>(key: K, value: unknown): unknown {
  const slice = migrationRecord(value);
  if (!slice || slice.version !== 1) return value;

  if (key === 'daily' && Array.isArray(slice.entries)) {
    return {
      version: 2,
      entries: slice.entries.map((item) => {
        const entry = migrationRecord(item);
        if (!entry) return item;
        if (typeof entry.kind !== 'string') return { kind: 'note', ...migrationClone(entry) };
        if (entry.kind !== 'dispute') return migrationClone(entry);
        const migrated: Record<string, unknown> = {
          ...migrationClone(entry),
          externalStatus: 'needs_connection',
        };
        if (migrated.status === 'reconciled' && !migrationRecord(migrated.reconciliation)) {
          migrated.status = 'open';
        }
        return migrated;
      }),
    };
  }

  if (key === 'jamiya') {
    if (Array.isArray(slice.circles)) {
      const circles = slice.circles.map((item) => {
        const circle = migrationRecord(item);
        if (!circle || !Array.isArray(circle.members)) return item;
        const members = circle.members.map((memberValue) => {
          const member = migrationRecord(memberValue);
          if (!member) return memberValue;
          const { consented: _legacyConsent, ...preserved } = member;
          return { ...migrationClone(preserved), consentAttestation: null };
        });
        return { ...migrationClone(circle), members, status: 'draft' };
      });
      return {
        version: 2,
        circles,
        activeCircleId: slice.activeCircleId ?? null,
        nettingReceipts: Array.isArray(slice.nettingReceipts)
          ? migrationClone(slice.nettingReceipts)
          : [],
        legacySnapshot: null,
      };
    }
    return {
      version: 2,
      circles: [],
      activeCircleId: null,
      nettingReceipts: [],
      legacySnapshot: migrationClone({
        circleId: slice.circleId,
        title: slice.title,
        contributionMinor: slice.contributionMinor,
        members: slice.members,
      }),
    };
  }

  return value;
}

export function selectRelatedRecords(
  records: readonly AhdStoredRecord[],
  displayName: string | null,
): readonly AhdStoredRecord[] {
  if (!displayName) return [];
  return records.filter(({ sealed }) => (
    sealed.record.lender === displayName || sealed.record.borrower === displayName
  ));
}

export function selectMineRecords(
  records: readonly AhdStoredRecord[],
  displayName: string | null,
): readonly AhdStoredRecord[] {
  if (!displayName) return [];
  return records.filter(({ sealed }) => sealed.record.borrower === displayName);
}

export type PilotMaroofEntry = {
  recordId: string;
  counterpart: string;
  role: 'lender' | 'borrower';
  band: 'documented' | 'settled' | 'reconciled';
};

export function deriveMaroofBands(
  records: readonly AhdStoredRecord[],
  displayName: string | null,
): readonly PilotMaroofEntry[] {
  return selectRelatedRecords(records, displayName).map(({ sealed }) => {
    const eventTypes = new Set(sealed.record.events.map((event) => event.type));
    const role = sealed.record.lender === displayName ? 'lender' as const : 'borrower' as const;
    const band = eventTypes.has('SETTLEMENT_SETTLED')
      ? 'settled' as const
      : eventTypes.has('DISPUTE_RECONCILED')
        ? 'reconciled' as const
        : 'documented' as const;
    return {
      recordId: sealed.record.id,
      counterpart: role === 'lender' ? sealed.record.borrower : sealed.record.lender,
      role,
      band,
    };
  });
}

export type PilotTimelineEntry = {
  id: string;
  recordId: string;
  eventIndex: number;
  eventType: string;
  lender: string;
  borrower: string;
};

export function buildLocalTimeline(
  records: readonly AhdStoredRecord[],
  displayName: string | null,
): readonly PilotTimelineEntry[] {
  return selectRelatedRecords(records, displayName).flatMap(({ sealed }) => (
    sealed.record.events.map((event, eventIndex) => ({
      id: `${sealed.record.id}:${eventIndex}`,
      recordId: sealed.record.id,
      eventIndex,
      eventType: event.type,
      lender: sealed.record.lender,
      borrower: sealed.record.borrower,
    }))
  ));
}

type UnknownRecord = Record<string, unknown>;

const JOURNEY_STEPS = new Set([
  'home',
  'create',
  'riba_check',
  'sealed',
  'daftari',
  'record_detail',
  'settlement',
  'proof',
]);

function invalid(path: string): never {
  throw new Error(`Invalid Pilot data shape at ${path}`);
}

function stableJson(value: unknown): string {
  const normalize = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(normalize);
    if (item && typeof item === 'object') {
      return Object.keys(item as UnknownRecord)
        .sort()
        .reduce<UnknownRecord>((result, key) => {
          result[key] = normalize((item as UnknownRecord)[key]);
          return result;
        }, {});
    }
    return item;
  };
  return JSON.stringify(normalize(value));
}

function rebuildSealed(sealed: SealedAhd): SealedAhd {
  const source = sealed.prepared.sourceDraft;
  return ahdCore.sealPrepared(ahdCore.prepareDraft({
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

function sealedProofIntegrityAt(sealed: SealedAhd, proof: ProofPack, path: string): void {
  try {
    const recomputed = rebuildSealed(sealed);
    if (stableJson(recomputed) !== stableJson(sealed) || !verifyAttachedProof(sealed.record, proof).ok) {
      invalid(`${path}.integrity`);
    }
  } catch {
    invalid(`${path}.integrity`);
  }
}

function recordAt(
  value: unknown,
  path: string,
  required: readonly string[],
  optional: readonly string[] = [],
): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(path);
  const record = value as UnknownRecord;
  const allowed = new Set([...required, ...optional]);
  if (required.some((key) => !Object.prototype.hasOwnProperty.call(record, key))) invalid(path);
  if (Object.keys(record).some((key) => !allowed.has(key))) invalid(path);
  return record;
}

function stringAt(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string') invalid(path);
}

function booleanAt(value: unknown, path: string): asserts value is boolean {
  if (typeof value !== 'boolean') invalid(path);
}

function integerAt(value: unknown, path: string, minimum = 0): asserts value is number {
  if (!Number.isSafeInteger(value) || (value as number) < minimum) invalid(path);
}

function stringOrNullAt(value: unknown, path: string): asserts value is string | null {
  if (value !== null && typeof value !== 'string') invalid(path);
}

function arrayAt(value: unknown, path: string): asserts value is readonly unknown[] {
  if (!Array.isArray(value)) invalid(path);
}

function nonEmptyStringAt(value: unknown, path: string): asserts value is string {
  stringAt(value, path);
  if (!(value as string).trim() || /[\u0000-\u001f\u007f]/.test(value as string)) invalid(path);
}

export function isValidPilotDateOnly(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysByMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysByMonth[month - 1];
}

function dateOnlyAt(value: unknown, path: string): asserts value is string {
  stringAt(value, path);
  if (!isValidPilotDateOnly(value as string)) invalid(path);
}

function monthAt(value: unknown, path: string): asserts value is string {
  stringAt(value, path);
  const match = /^(\d{4})-(\d{2})$/.exec(value as string);
  if (!match || Number(match[1]) < 1 || Number(match[2]) < 1 || Number(match[2]) > 12) {
    invalid(path);
  }
}

function positivePilotMinorAt(value: unknown, path: string): asserts value is number {
  integerAt(value, path, 1);
  if ((value as number) > MAX_PILOT_AMOUNT_MINOR) invalid(path);
}

function transfersConserve(
  before: readonly SettlementTransfer[],
  after: readonly SettlementTransfer[],
): boolean {
  const balances = (transfers: readonly SettlementTransfer[]) => {
    const result = new Map<string, number>();
    transfers.forEach((transfer) => {
      result.set(transfer.from, (result.get(transfer.from) ?? 0) - transfer.amountMinor);
      result.set(transfer.to, (result.get(transfer.to) ?? 0) + transfer.amountMinor);
    });
    return [...result.entries()].filter(([, amount]) => amount !== 0).sort(([left], [right]) => (
      left < right ? -1 : left > right ? 1 : 0
    ));
  };
  return stableJson(balances(before)) === stableJson(balances(after));
}

function jsonValueAt(value: unknown, path: string): void {
  if (
    value === null
    || typeof value === 'string'
    || typeof value === 'boolean'
    || (typeof value === 'number' && Number.isFinite(value))
  ) return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => jsonValueAt(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value as UnknownRecord).forEach(([key, item]) => {
      jsonValueAt(item, `${path}.${key}`);
    });
    return;
  }
  invalid(path);
}

function draftAt(value: unknown, path: string): void {
  const draft = recordAt(value, path, [
    'id',
    'type',
    'lender',
    'borrower',
    'amountMinor',
    'open',
    'months',
    'start',
    'timestamp',
    'purpose',
  ]);
  stringAt(draft.id, `${path}.id`);
  stringAt(draft.type, `${path}.type`);
  stringAt(draft.lender, `${path}.lender`);
  stringAt(draft.borrower, `${path}.borrower`);
  integerAt(draft.amountMinor, `${path}.amountMinor`);
  booleanAt(draft.open, `${path}.open`);
  integerAt(draft.months, `${path}.months`);
  const start = recordAt(draft.start, `${path}.start`, ['y', 'm']);
  integerAt(start.y, `${path}.start.y`, 1);
  integerAt(start.m, `${path}.start.m`, 1);
  if ((start.m as number) > 12) invalid(`${path}.start.m`);
  stringAt(draft.timestamp, `${path}.timestamp`);
  stringAt(draft.purpose, `${path}.purpose`);
}

function screeningAt(value: unknown, path: string): void {
  const screening = recordAt(value, path, ['verdict', 'hits']);
  if (screening.verdict !== 'clean' && screening.verdict !== 'block') {
    invalid(`${path}.verdict`);
  }
  arrayAt(screening.hits, `${path}.hits`);
  screening.hits.forEach((item, index) => {
    const hitPath = `${path}.hits[${index}]`;
    const hit = recordAt(item, hitPath, ['why', 'fix', 'category'], ['severity', 'source']);
    stringAt(hit.why, `${hitPath}.why`);
    stringAt(hit.fix, `${hitPath}.fix`);
    stringAt(hit.category, `${hitPath}.category`);
    if (hit.severity !== undefined) stringAt(hit.severity, `${hitPath}.severity`);
    if (hit.source !== undefined) stringAt(hit.source, `${hitPath}.source`);
  });
}

function preparedAt(value: unknown, path: string): void {
  const prepared = recordAt(value, path, [
    'id',
    'lender',
    'borrower',
    'amountMinor',
    'open',
    'months',
    'termsAr',
    'schedule',
    'sourceDraft',
  ]);
  stringAt(prepared.id, `${path}.id`);
  stringAt(prepared.lender, `${path}.lender`);
  stringAt(prepared.borrower, `${path}.borrower`);
  integerAt(prepared.amountMinor, `${path}.amountMinor`);
  booleanAt(prepared.open, `${path}.open`);
  integerAt(prepared.months, `${path}.months`);
  stringAt(prepared.termsAr, `${path}.termsAr`);
  arrayAt(prepared.schedule, `${path}.schedule`);
  prepared.schedule.forEach((item, index) => {
    const itemPath = `${path}.schedule[${index}]`;
    const schedule = recordAt(item, itemPath, ['label', 'dueISO', 'amountMinor']);
    stringAt(schedule.label, `${itemPath}.label`);
    stringAt(schedule.dueISO, `${itemPath}.dueISO`);
    integerAt(schedule.amountMinor, `${itemPath}.amountMinor`);
  });
  draftAt(prepared.sourceDraft, `${path}.sourceDraft`);
}

function ahdRecordAt(value: unknown, path: string): void {
  const ahdRecord = recordAt(
    value,
    path,
    ['id', 'lender', 'borrower', 'amountMinor', 'installments', 'events'],
  );
  stringAt(ahdRecord.id, `${path}.id`);
  stringAt(ahdRecord.lender, `${path}.lender`);
  stringAt(ahdRecord.borrower, `${path}.borrower`);
  integerAt(ahdRecord.amountMinor, `${path}.amountMinor`);
  arrayAt(ahdRecord.installments, `${path}.installments`);
  ahdRecord.installments.forEach((item, index) => {
    const itemPath = `${path}.installments[${index}]`;
    const installment = recordAt(item, itemPath, ['dueISO', 'amountMinor']);
    stringOrNullAt(installment.dueISO, `${itemPath}.dueISO`);
    integerAt(installment.amountMinor, `${itemPath}.amountMinor`);
  });
  arrayAt(ahdRecord.events, `${path}.events`);
  ahdRecord.events.forEach((item, index) => {
    const itemPath = `${path}.events[${index}]`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) invalid(itemPath);
    stringAt((item as UnknownRecord).type, `${itemPath}.type`);
    jsonValueAt(item, itemPath);
  });
}

function sealedAt(value: unknown, path: string): void {
  const sealed = recordAt(value, path, [
    'prepared',
    'termsAr',
    'screening',
    'canonical',
    'canonicalHash',
    'seal',
    'verification',
    'record',
  ]);
  preparedAt(sealed.prepared, `${path}.prepared`);
  stringAt(sealed.termsAr, `${path}.termsAr`);
  screeningAt(sealed.screening, `${path}.screening`);
  stringAt(sealed.canonical, `${path}.canonical`);
  stringAt(sealed.canonicalHash, `${path}.canonicalHash`);
  stringAt(sealed.seal, `${path}.seal`);

  const verification = recordAt(
    sealed.verification,
    `${path}.verification`,
    ['ok', 'sealed', 'recomputed', 'canonicalHash'],
  );
  booleanAt(verification.ok, `${path}.verification.ok`);
  stringAt(verification.sealed, `${path}.verification.sealed`);
  stringAt(verification.recomputed, `${path}.verification.recomputed`);
  stringAt(verification.canonicalHash, `${path}.verification.canonicalHash`);

  ahdRecordAt(sealed.record, `${path}.record`);
}

function transferAt(value: unknown, path: string): void {
  const transfer = recordAt(value, path, ['from', 'to', 'amountMinor']);
  stringAt(transfer.from, `${path}.from`);
  stringAt(transfer.to, `${path}.to`);
  integerAt(transfer.amountMinor, `${path}.amountMinor`);
}

function settlementAt(value: unknown, path: string): void {
  const settlement = recordAt(
    value,
    path,
    ['before', 'after', 'beforeCount', 'afterCount', 'conserved'],
  );
  arrayAt(settlement.before, `${path}.before`);
  arrayAt(settlement.after, `${path}.after`);
  settlement.before.forEach((item, index) => transferAt(item, `${path}.before[${index}]`));
  settlement.after.forEach((item, index) => transferAt(item, `${path}.after[${index}]`));
  integerAt(settlement.beforeCount, `${path}.beforeCount`);
  integerAt(settlement.afterCount, `${path}.afterCount`);
  booleanAt(settlement.conserved, `${path}.conserved`);
  if (settlement.beforeCount !== settlement.before.length) invalid(`${path}.beforeCount`);
  if (settlement.afterCount !== settlement.after.length) invalid(`${path}.afterCount`);
}

function proofAt(value: unknown, path: string): void {
  const proof = recordAt(value, path, ['id', 'canonical', 'contentHash', 'seal', 'chain']);
  stringAt(proof.id, `${path}.id`);
  stringAt(proof.canonical, `${path}.canonical`);
  stringAt(proof.contentHash, `${path}.contentHash`);
  stringAt(proof.seal, `${path}.seal`);
  arrayAt(proof.chain, `${path}.chain`);
  proof.chain.forEach((item, index) => {
    const itemPath = `${path}.chain[${index}]`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) invalid(itemPath);
    jsonValueAt(item, itemPath);
  });
}

function storedRecordAt(value: unknown, path: string): void {
  const entry = recordAt(value, path, ['sealed', 'proof', 'source']);
  sealedAt(entry.sealed, `${path}.sealed`);
  proofAt(entry.proof, `${path}.proof`);
  if (entry.source !== 'local' && entry.source !== 'imported') invalid(`${path}.source`);
  const sealed = entry.sealed as { record: { id: string } };
  const proof = entry.proof as { id: string };
  if (sealed.record.id !== proof.id) invalid(`${path}.proof.id`);
  const typed = entry as unknown as AhdStoredRecord;
  sealedProofIntegrityAt(typed.sealed, typed.proof, path);
}

function importedRecordAt(value: unknown, path: string): void {
  const entry = recordAt(value, path, ['record', 'proof', 'exportedAt']);
  ahdRecordAt(entry.record, `${path}.record`);
  proofAt(entry.proof, `${path}.proof`);
  stringAt(entry.exportedAt, `${path}.exportedAt`);
  const record = entry.record as { id: string };
  const proof = entry.proof as { id: string };
  if (record.id !== proof.id) invalid(`${path}.proof.id`);
  try {
    const typed = entry as unknown as ImportedAhdRecord;
    if (!verifyAttachedProof(typed.record, typed.proof).ok) invalid(`${path}.integrity`);
  } catch {
    invalid(`${path}.integrity`);
  }
}

function journeyAt(value: unknown, path: string): void {
  const journey = recordAt(
    value,
    path,
    ['version', 'asOf', 'step'],
    [
      'records',
      'imports',
      'activeRecordId',
      'prepared',
      'screening',
      'sealed',
      'settlement',
      'settlementConsent',
      'proof',
      'proofVerification',
      'connection',
    ],
  );
  if (journey.version !== 1) invalid(`${path}.version`);
  if (journey.asOf !== initialJourneyState().asOf) invalid(`${path}.asOf`);
  if (typeof journey.step !== 'string' || !JOURNEY_STEPS.has(journey.step)) {
    invalid(`${path}.step`);
  }
  const hasRecords = Object.prototype.hasOwnProperty.call(journey, 'records');
  const hasImports = Object.prototype.hasOwnProperty.call(journey, 'imports');
  const hasActiveRecordId = Object.prototype.hasOwnProperty.call(journey, 'activeRecordId');
  if (hasRecords !== hasActiveRecordId) invalid(`${path}.records`);
  if (hasRecords) {
    arrayAt(journey.records, `${path}.records`);
    journey.records.forEach((entry, index) => storedRecordAt(entry, `${path}.records[${index}]`));
    stringOrNullAt(journey.activeRecordId, `${path}.activeRecordId`);
    const ids = journey.records.map((entry) => (
      entry as { sealed: { record: { id: string } } }
    ).sealed.record.id);
    if (new Set(ids).size !== ids.length) invalid(`${path}.records`);
    if (journey.activeRecordId !== null && !ids.includes(journey.activeRecordId as string)) {
      invalid(`${path}.activeRecordId`);
    }
  }
  if (hasImports) {
    arrayAt(journey.imports, `${path}.imports`);
    journey.imports.forEach((entry, index) => importedRecordAt(entry, `${path}.imports[${index}]`));
    const importedIds = journey.imports.map((entry) => (
      entry as { record: { id: string } }
    ).record.id);
    if (new Set(importedIds).size !== importedIds.length) invalid(`${path}.imports`);
  }
  if (journey.prepared !== undefined) preparedAt(journey.prepared, `${path}.prepared`);
  if (journey.screening !== undefined) screeningAt(journey.screening, `${path}.screening`);
  if (journey.sealed !== undefined) sealedAt(journey.sealed, `${path}.sealed`);
  if (journey.settlement !== undefined) settlementAt(journey.settlement, `${path}.settlement`);
  if (journey.settlementConsent !== undefined) {
    const consent = recordAt(
      journey.settlementConsent,
      `${path}.settlementConsent`,
      ['confirmed', 'recordIds'],
    );
    if (consent.confirmed !== true) invalid(`${path}.settlementConsent.confirmed`);
    arrayAt(consent.recordIds, `${path}.settlementConsent.recordIds`);
    consent.recordIds.forEach((recordId, index) => (
      stringAt(recordId, `${path}.settlementConsent.recordIds[${index}]`)
    ));
    if (consent.recordIds.length === 0) invalid(`${path}.settlementConsent.recordIds`);
    if (new Set(consent.recordIds as readonly string[]).size !== consent.recordIds.length) {
      invalid(`${path}.settlementConsent.recordIds`);
    }
  }
  if (Boolean(journey.settlement) !== Boolean(journey.settlementConsent)) {
    invalid(`${path}.settlement.integrity`);
  }
  if (journey.settlement !== undefined && journey.settlementConsent !== undefined) {
    if (!hasRecords) invalid(`${path}.settlement.integrity`);
    try {
      const consent = journey.settlementConsent as { confirmed: true; recordIds: readonly string[] };
      const records = journey.records as readonly AhdStoredRecord[];
      const entries = consent.recordIds.map((recordId) => {
        const entry = records.find((candidate) => candidate.sealed.record.id === recordId);
        if (!entry || entry.source !== 'local') invalid(`${path}.settlement.integrity`);
        return entry;
      });
      const recomputed = ahdCore.buildSettlement(entries.map(({ sealed }) => ({
        from: sealed.record.borrower,
        to: sealed.record.lender,
        amountMinor: sealed.record.amountMinor,
      })));
      if (stableJson(recomputed) !== stableJson(journey.settlement)) {
        invalid(`${path}.settlement.integrity`);
      }
    } catch {
      invalid(`${path}.settlement.integrity`);
    }
  }
  if (journey.proof !== undefined) proofAt(journey.proof, `${path}.proof`);
  if (journey.proofVerification !== undefined) {
    const verification = recordAt(
      journey.proofVerification,
      `${path}.proofVerification`,
      ['ok', 'sealed', 'recomputed', 'contentHash'],
    );
    booleanAt(verification.ok, `${path}.proofVerification.ok`);
    stringAt(verification.sealed, `${path}.proofVerification.sealed`);
    stringAt(verification.recomputed, `${path}.proofVerification.recomputed`);
    stringAt(verification.contentHash, `${path}.proofVerification.contentHash`);
  }
  if (journey.connection !== undefined) {
    const connection = recordAt(
      journey.connection,
      `${path}.connection`,
      ['status', 'operation', 'recordId'],
    );
    if (connection.status !== 'needs_connection') invalid(`${path}.connection.status`);
    if (connection.operation !== 'identity' && connection.operation !== 'external_evidence') {
      invalid(`${path}.connection.operation`);
    }
    stringAt(connection.recordId, `${path}.connection.recordId`);
  }

  const step = journey.step as string;
  if (step === 'riba_check' && (!journey.prepared || !journey.screening)) invalid(`${path}.step`);
  if (['sealed', 'daftari', 'record_detail'].includes(step) && !journey.sealed) {
    invalid(`${path}.step`);
  }
  if (step === 'settlement' && (!journey.sealed || !journey.settlement)) invalid(`${path}.step`);
  if (step === 'proof' && (!journey.sealed || !journey.proof || !journey.proofVerification)) {
    invalid(`${path}.step`);
  }
  if (hasRecords && journey.sealed) {
    const sealedId = (journey.sealed as { record: { id: string } }).record.id;
    if (journey.activeRecordId !== sealedId) invalid(`${path}.activeRecordId`);
    const activeEntry = (journey.records as readonly unknown[]).find((entry) => (
      (entry as AhdStoredRecord).sealed.record.id === sealedId
    )) as AhdStoredRecord | undefined;
    if (!activeEntry || stableJson(activeEntry.sealed) !== stableJson(journey.sealed)) {
      invalid(`${path}.sealed.integrity`);
    }
    if (journey.proof !== undefined) {
      const rootProof = journey.proof as ProofPack;
      if (!verifyAttachedProof(activeEntry.sealed.record, rootProof).ok) {
        invalid(`${path}.proof.integrity`);
      }
      if (journey.proofVerification !== undefined) {
        const expected = verifyAttachedProof(activeEntry.sealed.record, rootProof);
        if (stableJson(expected) !== stableJson(journey.proofVerification)) {
          invalid(`${path}.proofVerification`);
        }
      }
    }
  }
}

export function assertPilotSlice<K extends PilotSliceKey>(
  key: K,
  value: unknown,
): asserts value is PilotSlice<K> {
  if (key === 'profile') {
    const profile = recordAt(value, 'profile', ['version', 'welcomeAccepted', 'displayName']);
    if (profile.version !== 1) invalid('profile.version');
    booleanAt(profile.welcomeAccepted, 'profile.welcomeAccepted');
    stringOrNullAt(profile.displayName, 'profile.displayName');
    return;
  }
  if (key === 'journey') {
    journeyAt(value, 'journey');
    return;
  }
  if (key === 'daily') {
    const daily = recordAt(value, 'daily', ['version', 'entries']);
    if (daily.version !== 2) invalid('daily.version');
    arrayAt(daily.entries, 'daily.entries');
    daily.entries.forEach((item, index) => {
      const path = `daily.entries[${index}]`;
      const kind = (item as UnknownRecord | null)?.kind;
      if (kind === 'note') {
        const entry = recordAt(item, path, ['kind', 'id', 'title', 'note', 'effectiveDate']);
        nonEmptyStringAt(entry.id, `${path}.id`);
        nonEmptyStringAt(entry.title, `${path}.title`);
        nonEmptyStringAt(entry.note, `${path}.note`);
        dateOnlyAt(entry.effectiveDate, `${path}.effectiveDate`);
      } else if (kind === 'request') {
        const entry = recordAt(item, path, [
          'kind', 'id', 'borrower', 'lender', 'amountMinor', 'purpose', 'termsAr',
          'effectiveDate', 'status',
        ]);
        nonEmptyStringAt(entry.id, `${path}.id`);
        nonEmptyStringAt(entry.borrower, `${path}.borrower`);
        nonEmptyStringAt(entry.lender, `${path}.lender`);
        if (entry.borrower === entry.lender) invalid(`${path}.lender`);
        positivePilotMinorAt(entry.amountMinor, `${path}.amountMinor`);
        stringAt(entry.purpose, `${path}.purpose`);
        nonEmptyStringAt(entry.termsAr, `${path}.termsAr`);
        dateOnlyAt(entry.effectiveDate, `${path}.effectiveDate`);
        if (entry.status !== 'needs_connection') invalid(`${path}.status`);
      } else if (kind === 'dispute') {
        const entry = recordAt(
          item,
          path,
          ['kind', 'id', 'recordId', 'reason', 'effectiveDate', 'status', 'externalStatus'],
          ['reconciliation'],
        );
        nonEmptyStringAt(entry.id, `${path}.id`);
        nonEmptyStringAt(entry.recordId, `${path}.recordId`);
        nonEmptyStringAt(entry.reason, `${path}.reason`);
        dateOnlyAt(entry.effectiveDate, `${path}.effectiveDate`);
        if (entry.status !== 'open' && entry.status !== 'reconciled') invalid(`${path}.status`);
        if (entry.externalStatus !== 'needs_connection') invalid(`${path}.externalStatus`);
        if (entry.reconciliation !== undefined) {
          const reconciliation = recordAt(entry.reconciliation, `${path}.reconciliation`, [
            'attestedBy', 'effectiveDate', 'confirmed',
          ]);
          nonEmptyStringAt(reconciliation.attestedBy, `${path}.reconciliation.attestedBy`);
          dateOnlyAt(reconciliation.effectiveDate, `${path}.reconciliation.effectiveDate`);
          if (reconciliation.confirmed !== true) invalid(`${path}.reconciliation.confirmed`);
        }
        if ((entry.status === 'reconciled') !== (entry.reconciliation !== undefined)) {
          invalid(`${path}.reconciliation`);
        }
      } else {
        invalid(`${path}.kind`);
      }
    });
    const ids = daily.entries.map((entry) => (entry as { id: string }).id);
    if (new Set(ids).size !== ids.length) invalid('daily.entries');
    return;
  }
  if (key === 'jamiya') {
    const jamiya = recordAt(value, 'jamiya', [
      'version', 'circles', 'activeCircleId', 'nettingReceipts', 'legacySnapshot',
    ]);
    if (jamiya.version !== 2) invalid('jamiya.version');
    arrayAt(jamiya.circles, 'jamiya.circles');
    stringOrNullAt(jamiya.activeCircleId, 'jamiya.activeCircleId');
    arrayAt(jamiya.nettingReceipts, 'jamiya.nettingReceipts');
    jamiya.circles.forEach((item, circleIndex) => {
      const path = `jamiya.circles[${circleIndex}]`;
      const circle = recordAt(item, path, [
        'id', 'kind', 'title', 'organizer', 'startMonth', 'members', 'orderMemberIds',
        'payments', 'status',
      ]);
      nonEmptyStringAt(circle.id, `${path}.id`);
      if (!['jamiya', 'occasion', 'standing'].includes(circle.kind as string)) invalid(`${path}.kind`);
      nonEmptyStringAt(circle.title, `${path}.title`);
      nonEmptyStringAt(circle.organizer, `${path}.organizer`);
      monthAt(circle.startMonth, `${path}.startMonth`);
      arrayAt(circle.members, `${path}.members`);
      if (circle.members.length < 2 || circle.members.length > 5) invalid(`${path}.members`);
      circle.members.forEach((memberValue, memberIndex) => {
        const memberPath = `${path}.members[${memberIndex}]`;
        const member = recordAt(memberValue, memberPath, [
          'id', 'displayName', 'consentAttestation', 'shareMinor',
        ]);
        nonEmptyStringAt(member.id, `${memberPath}.id`);
        nonEmptyStringAt(member.displayName, `${memberPath}.displayName`);
        if (member.consentAttestation !== null) {
          const attestation = recordAt(
            member.consentAttestation,
            `${memberPath}.consentAttestation`,
            ['mode', 'recordedBy', 'effectiveDate', 'confirmed'],
          );
          if (attestation.mode !== 'organizer_attestation') {
            invalid(`${memberPath}.consentAttestation.mode`);
          }
          nonEmptyStringAt(attestation.recordedBy, `${memberPath}.consentAttestation.recordedBy`);
          if (attestation.recordedBy !== circle.organizer) {
            invalid(`${memberPath}.consentAttestation.recordedBy`);
          }
          dateOnlyAt(attestation.effectiveDate, `${memberPath}.consentAttestation.effectiveDate`);
          if (attestation.confirmed !== true) invalid(`${memberPath}.consentAttestation.confirmed`);
        }
        positivePilotMinorAt(member.shareMinor, `${memberPath}.shareMinor`);
      });
      const members = circle.members as readonly PilotCircleMember[];
      const memberIds = members.map((member) => member.id);
      const memberNames = members.map((member) => member.displayName);
      if (new Set(memberIds).size !== memberIds.length || new Set(memberNames).size !== memberNames.length) {
        invalid(`${path}.members`);
      }
      arrayAt(circle.orderMemberIds, `${path}.orderMemberIds`);
      circle.orderMemberIds.forEach((memberId, index) => (
        nonEmptyStringAt(memberId, `${path}.orderMemberIds[${index}]`)
      ));
      if (
        circle.orderMemberIds.length !== memberIds.length
        || new Set(circle.orderMemberIds as readonly string[]).size !== memberIds.length
        || !(circle.orderMemberIds as readonly string[]).every((id) => memberIds.includes(id))
      ) invalid(`${path}.orderMemberIds`);
      arrayAt(circle.payments, `${path}.payments`);
      circle.payments.forEach((paymentValue, paymentIndex) => {
        const paymentPath = `${path}.payments[${paymentIndex}]`;
        const payment = recordAt(paymentValue, paymentPath, [
          'id', 'round', 'memberId', 'amountMinor', 'effectiveDate',
        ]);
        nonEmptyStringAt(payment.id, `${paymentPath}.id`);
        integerAt(payment.round, `${paymentPath}.round`, 1);
        if ((payment.round as number) > members.length) invalid(`${paymentPath}.round`);
        nonEmptyStringAt(payment.memberId, `${paymentPath}.memberId`);
        const member = members.find((candidate) => candidate.id === payment.memberId);
        if (!member) invalid(`${paymentPath}.memberId`);
        positivePilotMinorAt(payment.amountMinor, `${paymentPath}.amountMinor`);
        if (payment.amountMinor !== member.shareMinor) invalid(`${paymentPath}.amountMinor`);
        dateOnlyAt(payment.effectiveDate, `${paymentPath}.effectiveDate`);
      });
      const payments = circle.payments as readonly PilotCirclePayment[];
      const paymentKeys = payments.map((payment) => `${payment.round}:${payment.memberId}`);
      if (new Set(paymentKeys).size !== paymentKeys.length) invalid(`${path}.payments`);
      payments.forEach((payment) => {
        for (let round = 1; round < payment.round; round += 1) {
          if (members.some((member) => !payments.some((item) => (
            item.round === round && item.memberId === member.id
          )))) invalid(`${path}.payments`);
        }
      });
      if (!['draft', 'active', 'complete'].includes(circle.status as string)) invalid(`${path}.status`);
      if (circle.status !== 'draft' && members.some((member) => !member.consentAttestation)) {
        invalid(`${path}.status`);
      }
      const allPaid = members.every((member) => members.every((_, roundIndex) => (
        payments.some((payment) => payment.round === roundIndex + 1 && payment.memberId === member.id)
      )));
      if ((circle.status === 'complete') !== allPaid) invalid(`${path}.status`);
    });
    const circles = jamiya.circles as readonly PilotCircle[];
    const circleIds = circles.map((circle) => circle.id);
    if (new Set(circleIds).size !== circleIds.length) invalid('jamiya.circles');
    if (jamiya.activeCircleId !== null && !circleIds.includes(jamiya.activeCircleId as string)) {
      invalid('jamiya.activeCircleId');
    }
    jamiya.nettingReceipts.forEach((item, receiptIndex) => {
      const path = `jamiya.nettingReceipts[${receiptIndex}]`;
      const receipt = recordAt(item, path, [
        'id', 'circleIds', 'before', 'after', 'beforeCount', 'afterCount', 'conserved',
        'consentConfirmed', 'effectiveDate',
      ]);
      nonEmptyStringAt(receipt.id, `${path}.id`);
      arrayAt(receipt.circleIds, `${path}.circleIds`);
      if (receipt.circleIds.length === 0) invalid(`${path}.circleIds`);
      receipt.circleIds.forEach((circleId, index) => nonEmptyStringAt(circleId, `${path}.circleIds[${index}]`));
      if (
        new Set(receipt.circleIds as readonly string[]).size !== receipt.circleIds.length
        || !(receipt.circleIds as readonly string[]).every((id) => circleIds.includes(id))
      ) invalid(`${path}.circleIds`);
      arrayAt(receipt.before, `${path}.before`);
      arrayAt(receipt.after, `${path}.after`);
      receipt.before.forEach((transfer, index) => transferAt(transfer, `${path}.before[${index}]`));
      receipt.after.forEach((transfer, index) => transferAt(transfer, `${path}.after[${index}]`));
      integerAt(receipt.beforeCount, `${path}.beforeCount`);
      integerAt(receipt.afterCount, `${path}.afterCount`);
      if (receipt.beforeCount !== receipt.before.length || receipt.afterCount !== receipt.after.length) {
        invalid(`${path}.beforeCount`);
      }
      if (receipt.conserved !== true || receipt.consentConfirmed !== true) invalid(`${path}.conserved`);
      dateOnlyAt(receipt.effectiveDate, `${path}.effectiveDate`);
      if (!transfersConserve(
        receipt.before as readonly SettlementTransfer[],
        receipt.after as readonly SettlementTransfer[],
      )) invalid(`${path}.conserved`);
    });
    const receiptIds = (jamiya.nettingReceipts as readonly PilotNettingReceipt[]).map((item) => item.id);
    if (new Set(receiptIds).size !== receiptIds.length) invalid('jamiya.nettingReceipts');
    if (jamiya.legacySnapshot !== null) {
      const snapshot = recordAt(jamiya.legacySnapshot, 'jamiya.legacySnapshot', [
        'circleId', 'title', 'contributionMinor', 'members',
      ]);
      stringOrNullAt(snapshot.circleId, 'jamiya.legacySnapshot.circleId');
      stringAt(snapshot.title, 'jamiya.legacySnapshot.title');
      integerAt(snapshot.contributionMinor, 'jamiya.legacySnapshot.contributionMinor');
      arrayAt(snapshot.members, 'jamiya.legacySnapshot.members');
      snapshot.members.forEach((memberValue, index) => {
        const path = `jamiya.legacySnapshot.members[${index}]`;
        const member = recordAt(memberValue, path, [
          'id', 'displayName', 'consented', 'paidMinor',
        ]);
        nonEmptyStringAt(member.id, `${path}.id`);
        nonEmptyStringAt(member.displayName, `${path}.displayName`);
        booleanAt(member.consented, `${path}.consented`);
        integerAt(member.paidMinor, `${path}.paidMinor`);
      });
    }
    return;
  }
  const settings = recordAt(value, 'settings', ['version', 'digitMode', 'hideAmounts']);
  if (settings.version !== 1) invalid('settings.version');
  if (settings.digitMode !== 'western' && settings.digitMode !== 'arabic') {
    invalid('settings.digitMode');
  }
  booleanAt(settings.hideAmounts, 'settings.hideAmounts');
}

export function assertPilotSlices(value: unknown): asserts value is PilotSlices {
  const slices = recordAt(value, 'slices', PILOT_SLICE_KEYS);
  PILOT_SLICE_KEYS.forEach((key) => assertPilotSlice(key, slices[key]));
}
